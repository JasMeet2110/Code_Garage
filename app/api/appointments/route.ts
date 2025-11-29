import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import { ResultSetHeader } from "mysql2";
import { requireAdmin } from "@/lib/auth";

// GET
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const id = searchParams.get("id");

    // For availability check (client booking)
    if (date) {
      const results = await query(
        "SELECT appointment_time FROM appointments WHERE appointment_date = ?",
        [date]
      );
      return NextResponse.json(results);
    }

    // Single appointment by id (for complete page)
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

    // Admin list: join employee name if assigned
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

// POST — CREATE APPOINTMENT (client or admin)
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
    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error("Error adding appointment:", error);
    return NextResponse.json(
      { error: "Failed to add appointment" },
      { status: 500 }
    );
  }
}

// PUT — general update / assign employee / status change / complete job
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

    // =============================
    // 1️⃣  CANCEL ONLY
    // =============================
    const isCancelOnly =
      status === "Cancelled" && Object.keys(data).length === 2;

    if (isCancelOnly) {
      await query("UPDATE appointments SET status = ? WHERE id = ?", [
        "Cancelled",
        id,
      ]);
      return NextResponse.json({ success: true });
    }

    // =============================
    // 2️⃣  COMPLETE JOB (FROM MODAL)
    // =============================
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

    // =============================
    // 3️⃣  ADMIN UPDATE
    // =============================
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


// DELETE
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
