import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import { ResultSetHeader } from "mysql2";

// GET: fetch all appointments
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");

    // if a date is provided, return booked time slots for that date
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

// POST: add new appointment
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

    // check if this date + time is already booked
    const existing = (await query(
      "SELECT id FROM appointments WHERE appointment_date = ? AND appointment_time = ?",
      [appointment_date, appointment_time]
    )) as any[];

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: "Selected time is already booked." },
        { status: 400 }
      );
    }

    const sql = `
      INSERT INTO appointments 
      (customer_name, email, phone, service_type, fuel_type, car_make, car_model, car_year, plate_number, appointment_date, appointment_time, description, status)
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

// PUT: update appointment
export async function PUT(req: Request) {
  try {
    const {
      id,
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

    // cancel feature
    if (
      id &&
      status === "Cancelled" &&
      !customer_name &&
      !email &&
      !phone &&
      !service_type &&
      !fuel_type &&
      !car_make &&
      !car_model &&
      !car_year &&
      !plate_number &&
      !appointment_date &&
      !appointment_time &&
      !description
    ) {
      await query(
        "UPDATE appointments SET status = ? WHERE id = ?",
        [status, id]
      );
      return NextResponse.json({ success: true });
    }

    const sql = `
      UPDATE appointments 
      SET customer_name=?, email=?, phone=?, service_type=?, fuel_type=?, car_make=?, car_model=?, car_year=?, 
          plate_number=?, appointment_date=?, appointment_time=?, description=?, status=?
      WHERE id=?
    `;

    await query(sql, [
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

// DELETE: delete appointment
export async function DELETE(req: Request) {
  try {
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
