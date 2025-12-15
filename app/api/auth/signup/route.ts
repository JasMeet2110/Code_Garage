import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import bcrypt from "bcryptjs";
import { ResultSetHeader } from "mysql2"; // Import for type safety

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    const existingUsers = await query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    ) as any[];

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create user in the 'users' table
    const userResult = await query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, "client"]
    ) as ResultSetHeader; // Cast to get insertId

    const userId = userResult.insertId;

    // 4. CRITICAL FIX: Create customer in the 'customers' table
    // Note: We are using the same name and email, and linking it with the user ID if possible.
    // Assuming the 'customers' table has columns: id, name, email, user_id (optional)
    await query(
      "INSERT INTO customers (name, email) VALUES (?, ?)",
      [name, email]
    );
    
    // NOTE: If your 'customers' table has a 'user_id' column, use this instead:
    /*
    await query(
      "INSERT INTO customers (name, email, user_id) VALUES (?, ?, ?)",
      [name, email, userId]
    );
    */

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}
