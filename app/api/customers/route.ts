import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// your admin email for BCC
const ADMIN_EMAIL = "tracksidegarage0101@gmail.com";

type CustomerRow = {
  id: number;
  name: string | null;
  phone: string | null;
  email: string;
  car_name: string | null;
  car_plate: string | null;
  year: number | null;
  color: string | null;
  car_image: string | null;
  start_date: Date | null;
  created_at?: Date;
  updated_at?: Date | null;
};

function toNull<T>(value: T | undefined | "") {
  return value === undefined || value === "" ? null : value;
}

function normalizeYear(val: any) {
  if (val === undefined || val === "") return null;
  if (typeof val === "number") return val;
  const parsed = parseInt(val, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

/* GET — all customers or customer by ?email= */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (email) {
      const rows = (await query(
        "SELECT * FROM customers WHERE email = ? LIMIT 1",
        [email]
      )) as CustomerRow[];

      const customer = rows.length > 0 ? rows[0] : null;
      return NextResponse.json(customer, { status: 200 });
    }

    const rows = (await query(
      "SELECT * FROM customers ORDER BY created_at DESC"
    )) as CustomerRow[];

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}

/* POST — create / upsert (Admin or first profile)
   → sends “Profile Created” email (BCC admin)
*/
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

    year = normalizeYear(year);

    // Check if this is a brand new customer
    const existing = (await query(
      "SELECT id FROM customers WHERE email = ? LIMIT 1",
      [email]
    )) as CustomerRow[];
    const isNew = existing.length === 0;

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

    // Send “profile created” email only when it's new
    if (isNew && process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: "Trackside Garage <notifications@tracksidegarage.com>",
          to: email,
          bcc: ADMIN_EMAIL, // 👈 admin gets hidden copy
          subject: "Your Profile Has Been Created",
          html: `
            <h2>Welcome to Trackside Garage!</h2>
            <p>Hi ${name || email},</p>
            <p>Your customer profile has been successfully created.</p>
            <p>You can now manage your information anytime in your account.</p>
            <br/>
            <p>Thank you for choosing Trackside Garage!</p>
          `,
        });
      } catch (emailError) {
        console.error("Failed to send profile created email:", emailError);
      }
    }

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

/* PUT — update profile (My Account)
   → sends “Profile Updated” email (BCC admin)
*/
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    let {
      email,
      name,
      phone,
      carName,
      carPlate,
      year,
      color,
      carImage,
    } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    year = normalizeYear(year);

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

    // Send “profile updated” email
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: "Trackside Garage <notifications@tracksidegarage.com>",
          to: email,
          bcc: ADMIN_EMAIL, // 👈 hidden copy to admin
          subject: "Your Profile Was Updated",
          html: `
            <h2>Your Profile Was Updated</h2>
            <p>Hi ${name || email},</p>
            <p>Your profile details were recently updated.</p>
            <p>If you did not make this change, please contact us immediately.</p>
            <br/>
            <p>Thank you!</p>
          `,
        });
      } catch (emailError) {
        console.error("Failed to send profile updated email:", emailError);
      }
    }

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
