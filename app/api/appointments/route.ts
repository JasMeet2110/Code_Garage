import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import { ResultSetHeader } from "mysql2";
import { requireAdmin } from "@/lib/auth";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "tracksidegarage0101@gmail.com";
const BUSINESS_PHONE = process.env.BUSINESS_PHONE || "5878898163";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const id = searchParams.get("id");

    if (date) {
      const results = await query(
        "SELECT appointment_time FROM appointments WHERE appointment_date = ?",
        [date]
      );
      return NextResponse.json(results);
    }

    if (id) {
      const rows = (await query(
        `SELECT a.*, e.name AS employee_name 
         FROM appointments a 
         LEFT JOIN employees e ON e.id = a.assigned_employee_id
         WHERE a.id = ?`,
        [id]
      )) as any[];

      return NextResponse.json(rows[0] || null);
    }

    const results = await query(
      `SELECT a.*, e.name AS employee_name 
       FROM appointments a 
       LEFT JOIN employees e ON e.id = a.assigned_employee_id
       ORDER BY appointment_date DESC`
    );

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const {
      customer_name,
      email,
      phone,
      service_type,
      fuel_type,
      car_make,
      car_model,
      car_year,
      plate_number,
      appointment_date,
      appointment_time,
      description,
      status,
    } = await req.json();

    const existing = (await query(
      "SELECT id FROM appointments WHERE appointment_date = ? AND appointment_time = ?",
      [appointment_date, appointment_time]
    )) as any[];

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Selected time is already booked." },
        { status: 400 }
      );
    }

    const sql = `
      INSERT INTO appointments 
      (customer_name, email, phone, service_type, fuel_type, car_make, car_model, car_year, plate_number,
       appointment_date, appointment_time, description, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      customer_name,
      email,
      phone,
      service_type,
      fuel_type,
      car_make,
      car_model,
      car_year,
      plate_number,
      appointment_date,
      appointment_time,
      description,
      status || "Pending",
    ];

    const result = (await query(sql, values)) as ResultSetHeader;

    // --- EMAILS: admin + customer ---
    console.log("📧 Preparing emails:", {
      adminTo: ADMIN_EMAIL,
      customerTo: email,
    });

    try {
      await Promise.all([
        // Admin notification
        resend.emails.send({
          from: "Trackside Garage <onboarding@resend.dev>",
          to: ADMIN_EMAIL,
          subject: "New appointment booked",
          html: `
            <h2>New appointment booked</h2>
            <p><strong>Name:</strong> ${customer_name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Service:</strong> ${service_type}</p>
            <p><strong>Fuel type:</strong> ${fuel_type}</p>
            <p><strong>Vehicle:</strong> ${car_year} ${car_make} ${car_model}</p>
            <p><strong>Plate:</strong> ${plate_number}</p>
            <p><strong>Date:</strong> ${appointment_date}</p>
            <p><strong>Time:</strong> ${appointment_time}</p>
            <p><strong>Description:</strong> ${description || "N/A"}</p>
            <p><strong>Status:</strong> ${status || "Pending"}</p>
          `,
        }),

        // Customer confirmation
        resend.emails.send({
          from: "Trackside Garage <onboarding@resend.dev>",
          to: email,
          subject: "Your Trackside Garage appointment is booked",
          html: `
            <p>Hi ${customer_name},</p>
            <p>Thanks for booking with <strong>Trackside Garage</strong>!</p>
            <p>Here are your appointment details:</p>
            <ul>
              <li><strong>Date:</strong> ${appointment_date}</li>
              <li><strong>Time:</strong> ${appointment_time}</li>
              <li><strong>Service:</strong> ${service_type}</li>
              <li><strong>Fuel type:</strong> ${fuel_type}</li>
              <li><strong>Vehicle:</strong> ${car_year} ${car_make} ${car_model}</li>
              <li><strong>Plate:</strong> ${plate_number}</li>
            </ul>
            <p><strong>Description:</strong> ${description || "N/A"}</p>
            <p>If you need to reschedule or cancel, reply to this email or call us at ${
              BUSINESS_PHONE || "our shop"
            }.</p>
            <p>See you soon,<br/>Trackside Garage</p>
          `,
        }),
      ]);

      console.log("📧 Emails sent successfully");
    } catch (emailError) {
      console.error("Error sending appointment emails:", emailError);
      // don't fail the booking if email fails
    }

    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error("Error adding appointment:", error);
    return NextResponse.json(
      { error: "Failed to add appointment" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    const { id, status } = data;

    if (!id) {
      return NextResponse.json(
        { error: "Missing appointment ID" },
        { status: 400 }
      );
    }

    const isCancelOnly =
      status === "Cancelled" && Object.keys(data).length === 2;

    if (isCancelOnly) {
      await query("UPDATE appointments SET status = ? WHERE id = ?", [
        "Cancelled",
        id,
      ]);
      return NextResponse.json({ success: true });
    }

    if (data.complete === true) {
      await query(
        `UPDATE appointments 
         SET status = 'Completed',
             labor_cost = ?,
             completed_at = NOW()
         WHERE id = ?`,
        [data.labor_cost ?? 0, id]
      );

      return NextResponse.json({ success: true, completed: true });
    }

    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized (admin only)" },
        { status: 403 }
      );
    }

    const {
      customer_name,
      email,
      phone,
      service_type,
      fuel_type,
      car_make,
      car_model,
      car_year,
      plate_number,
      appointment_date,
      appointment_time,
      description,
      assigned_employee_id,
    } = data;

    const sql = `
      UPDATE appointments 
      SET customer_name = ?,
          email = ?,
          phone = ?,
          service_type = ?,
          fuel_type = ?,
          car_make = ?,
          car_model = ?,
          car_year = ?,
          plate_number = ?,
          appointment_date = ?,
          appointment_time = ?,
          description = ?,
          status = ?,
          assigned_employee_id = ?
      WHERE id = ?
    `;

    await query(sql, [
      customer_name ?? null,
      email ?? null,
      phone ?? null,
      service_type ?? null,
      fuel_type ?? null,
      car_make ?? null,
      car_model ?? null,
      car_year ?? null,
      plate_number ?? null,
      appointment_date ?? null,
      appointment_time ?? null,
      description ?? null,
      status || "Pending",
      assigned_employee_id ?? null,
      id,
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json(
      { error: "Failed to update appointment" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized (admin only)" },
        { status: 403 }
      );
    }

    const { id } = await req.json();
    await query("DELETE FROM appointments WHERE id = ?", [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return NextResponse.json(
      { error: "Failed to delete appointment" },
      { status: 500 }
    );
  }
}
