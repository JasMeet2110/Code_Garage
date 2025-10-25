import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// ✅ GET all customers
export async function GET() {
  try {
    const rows = await query("SELECT * FROM customers ORDER BY created_at DESC");
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}

// ✅ POST new customer (Admin or onboarding)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, email, carName, carPlate, year, color, carImage } = body;

    if (!name || !email)
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });

    await query(
      `INSERT INTO customers (name, phone, email, car_name, car_plate, year, color, car_image, start_date, is_profile_complete)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), true)
       ON DUPLICATE KEY UPDATE
         name=VALUES(name),
         phone=VALUES(phone),
         car_name=VALUES(car_name),
         car_plate=VALUES(car_plate),
         year=VALUES(year),
         color=VALUES(color),
         car_image=VALUES(car_image),
         is_profile_complete=true,
         updated_at=NOW()`,
      [name, phone, email, carName, carPlate, year, color, carImage]
    );

    return NextResponse.json({ message: "Customer added or updated successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error adding customer:", error);
    return NextResponse.json({ error: "Failed to add customer" }, { status: 500 });
  }
}

// ✅ PUT - Update customer by email (Client Account)
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { email, name, phone, carName, carPlate, year, color, carImage } = body;

    if (!email)
      return NextResponse.json({ error: "Email is required" }, { status: 400 });

    await query(
      `UPDATE customers 
       SET name=?, phone=?, car_name=?, car_plate=?, year=?, color=?, car_image=?, 
           updated_at=NOW()
       WHERE email=?`,
      [name, phone, carName, carPlate, year, color, carImage, email]
    );

    return NextResponse.json({ message: "Customer updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating customer:", error);
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 });
  }
}
