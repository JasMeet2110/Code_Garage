import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

function toNull<T>(value: T | undefined | "") {
  return value === undefined || value === "" ? null : value;
}

//GET
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (email) {
      const rows = await query(
        "SELECT * FROM customers WHERE email = ? LIMIT 1",
        [email]
      );
      return NextResponse.json(rows[0] || null, { status: 200 });
    }

    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized (admin only)" },
        { status: 403 }
      );
    }

    const rows = await query("SELECT * FROM customers ORDER BY created_at DESC");
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}

//POST
export async function POST(req: Request) {
  try {
    const body = await req.json();
    let { name, phone, email, carName, carPlate, year, color, carImage } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    if (!year || year === "") year = null;
    else if (typeof year === "string") {
      const parsed = parseInt(year, 10);
      year = Number.isNaN(parsed) ? null : parsed;
    }

    await query(
      `INSERT INTO customers (
         name, phone, email, car_name, car_plate, year, color, car_image, start_date
       )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE
         name       = VALUES(name),
         phone      = VALUES(phone),
         car_name   = VALUES(car_name),
         car_plate  = VALUES(car_plate),
         year       = VALUES(year),
         color      = VALUES(color),
         car_image  = VALUES(car_image),
         updated_at = NOW()`,
      [
        name,
        toNull(phone),
        email,
        toNull(carName),
        toNull(carPlate),
        year,
        toNull(color),
        toNull(carImage),
      ]
    );

    return NextResponse.json(
      { message: "Customer added or updated successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding customer:", error);
    return NextResponse.json(
      { error: "Failed to add customer" },
      { status: 500 }
    );
  }
}

// PUT
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    let { email, name, phone, carName, carPlate, year, color, carImage } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const sessionUser = await requireAdmin();
    const session = sessionUser || { email: null };

    if (!sessionUser) {
      if (session?.email !== email) {
        return NextResponse.json(
          { error: "Unauthorized. You can only modify your own account." },
          { status: 403 }
        );
      }
    }

    
    if (!year || year === "") year = null;
    else if (typeof year === "string") {
      const parsed = parseInt(year, 10);
      year = Number.isNaN(parsed) ? null : parsed;
    }

    await query(
      `UPDATE customers
       SET name=?, phone=?, car_name=?, car_plate=?, year=?, color=?, car_image=?, updated_at=NOW()
       WHERE email=?`,
      [
        toNull(name),
        toNull(phone),
        toNull(carName),
        toNull(carPlate),
        year,
        toNull(color),
        toNull(carImage),
        email,
      ]
    );

    return NextResponse.json(
      { message: "Customer updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating customer:", error);
    return NextResponse.json(
      { error: "Failed to update customer" },
      { status: 500 }
    );
  }
}
