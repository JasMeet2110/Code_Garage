import { NextResponse } from "next/server";
import { query } from "@/lib/db";

/* ---------------------------------------------
   Helper: normalize optional fields
---------------------------------------------- */
function toNull<T>(value: T | undefined | "") {
  return value === undefined || value === "" ? null : value;
}

/* ------------------------------------------------------
   ✅ GET customers
   - If ?email= is provided → return only that customer
   - Otherwise → return all customers
------------------------------------------------------ */
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

    const rows = await query(
      "SELECT * FROM customers ORDER BY created_at DESC"
    );
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}

/* ------------------------------------------------------
   ✅ POST — Create / upsert customer
   Used by Admin and My Account first-time setup
------------------------------------------------------ */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    let { name, phone, email, carName, carPlate, year, color, carImage } = body;

    // Required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Normalize year to number or null
    if (year === undefined || year === "") {
      year = null;
    } else if (typeof year === "string") {
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
        name,                        // required
        toNull(phone),
        email,                       // required
        toNull(carName),
        toNull(carPlate),
        year,                        // number or null
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

/* ------------------------------------------------------
   ✅ PUT — Update customer by email (Client My Account)
------------------------------------------------------ */
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

    // Normalize year again
    if (year === undefined || year === "") {
      year = null;
    } else if (typeof year === "string") {
      const parsed = parseInt(year, 10);
      year = Number.isNaN(parsed) ? null : parsed;
    }

    await query(
      `UPDATE customers
       SET name = ?, phone = ?, car_name = ?, car_plate = ?, year = ?, color = ?, car_image = ?,
           updated_at = NOW()
       WHERE email = ?`,
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
