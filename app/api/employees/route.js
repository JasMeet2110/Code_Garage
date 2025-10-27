import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET all employees
export async function GET() {
  try {
    const results = await query("SELECT * FROM employees ORDER BY id ASC");
    return NextResponse.json(results);
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 });
  }
}

// POST - Add a new employee
export async function POST(req) {
  try {
    const { name, position, phone, email, salary, startDate } = await req.json();

    if (!name || !position || !phone || !email || !salary || !startDate) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    await query(
      "INSERT INTO employees (name, position, phone, email, salary, start_date) VALUES (?, ?, ?, ?, ?, ?)",
      [name, position, phone, email, salary, startDate]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error adding employee:", error);
    return NextResponse.json({ error: "Failed to add employee" }, { status: 500 });
  }
}

// PUT - Edit existing employee
export async function PUT(req) {
  try {
    const { id, name, position, phone, email, salary, startDate } = await req.json();

    if (!id) return NextResponse.json({ error: "Missing employee ID" }, { status: 400 });

    await query(
      "UPDATE employees SET name=?, position=?, phone=?, email=?, salary=?, start_date=? WHERE id=?",
      [name, position, phone, email, salary, startDate, id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating employee:", error);
    return NextResponse.json({ error: "Failed to update employee" }, { status: 500 });
  }
}

// DELETE - Remove an employee
export async function DELETE(req) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing employee ID" }, { status: 400 });

    await query("DELETE FROM employees WHERE id=?", [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting employee:", error);
    return NextResponse.json({ error: "Failed to delete employee" }, { status: 500 });
  }
}
