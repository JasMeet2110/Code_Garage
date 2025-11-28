import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import { ResultSetHeader } from "mysql2";
import { requireAdmin } from "@/lib/auth";


//GET
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");

    if (date) {
      const results = await query(
        "SELECT appointment_time FROM appointments WHERE appointment_date = ?",
        [date]
      );
      return NextResponse.json(results);
    }

    const results = await query(
      "SELECT * FROM appointments ORDER BY appointment_date DESC"
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

//POST
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

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    const { id, status } = data;

    const isCancelOnly =
      id &&
      status === "Cancelled" &&
      Object.keys(data).length === 2;

    if (isCancelOnly) {
      await query("UPDATE appointments SET status = ? WHERE id = ?", [
        "Cancelled",
        id,
      ]);
      return NextResponse.json({ success: true });
    }

    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized (admin only)" },
        { status: 403 }
      );
    }

    const sql = `
      UPDATE appointments 
      SET customer_name=?, email=?, phone=?, service_type=?, fuel_type=?, car_make=?, car_model=?, car_year=?, 
          plate_number=?, appointment_date=?, appointment_time=?, description=?, status=?
      WHERE id=?
    `;

    await query(sql, [
      data.customer_name,
      data.email,
      data.phone,
      data.service_type,
      data.fuel_type,
      data.car_make,
      data.car_model,
      data.car_year,
      data.plate_number,
      data.appointment_date,
      data.appointment_time,
      data.description,
      data.status,
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

//DELETE
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
