import { query } from "@/lib/db";
import { NextResponse } from "next/server";

// GET: fetch all appointments
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
      description,
      status,
    } = await req.json();

    const sql = `
      INSERT INTO appointments 
      (customer_name, email, phone, service_type, fuel_type, car_make, car_model, car_year, plate_number, appointment_date, description, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      description,
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
      description,
      status,
    } = await req.json();

    const sql = `
      UPDATE appointments 
      SET customer_name=?, email=?, phone=?, service_type=?, fuel_type=?, car_make=?, car_model=?, car_year=?, 
          plate_number=?, appointment_date=?, description=?, status=?
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
