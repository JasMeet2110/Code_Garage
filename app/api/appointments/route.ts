import { query } from "@/lib/db";
import { NextResponse } from "next/server";

// ✅ GET: All appointments
export async function GET() {
  try {
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

// POST: Add new appointment
export async function POST(req: Request) {
  try {
    const {
      name,
      service_type,
      car_make,
      car_model,
      car_year,
      plate_number,
      fuel_type,
      appointment_date,
      slot,
      request_towing,
      message,
      status,
    } = await req.json();

    const sql = `
      INSERT INTO appointments 
      (name, service_type, car_make, car_model, car_year, plate_number, fuel_type, appointment_date, slot, request_towing, message, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      name,
      service_type,
      car_make,
      car_model,
      car_year,
      plate_number,
      fuel_type,
      appointment_date,
      slot,
      request_towing ? 1 : 0,
      message || null,
      status || "Pending",
    ];

    const result = await query(sql, values);
    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error("Error adding appointment:", error);
    return NextResponse.json(
      { error: "Failed to add appointment" },
      { status: 500 }
    );
  }
}

// ✅ PUT: Update appointment
export async function PUT(req: Request) {
  try {
    const {
      id,
      name,
      service_type,
      car_make,
      car_model,
      car_year,
      plate_number,
      fuel_type,
      appointment_date,
      slot,
      request_towing,
      message,
      status,
    } = await req.json();

    const sql = `
      UPDATE appointments 
      SET name=?, service_type=?, car_make=?, car_model=?, car_year=?, plate_number=?, fuel_type=?, 
          appointment_date=?, slot=?, request_towing=?, message=?, status=?
      WHERE id=?
    `;

    await query(sql, [
      name,
      service_type,
      car_make,
      car_model,
      car_year,
      plate_number,
      fuel_type,
      appointment_date,
      slot,
      request_towing ? 1 : 0,
      message || null,
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

// ✅ DELETE: Delete appointment
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
