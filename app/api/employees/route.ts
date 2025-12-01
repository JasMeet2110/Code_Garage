import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

function normalizeDate(input: string | null | undefined) {
  if (!input) return null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(input)) return input;

  try {
    const parsed = new Date(input);
    if (!isNaN(parsed.getTime())) {
      const yyyy = parsed.getFullYear();
      const mm = String(parsed.getMonth() + 1).padStart(2, "0");
      const dd = String(parsed.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    }
  } catch {}

  return null;
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized (admin only)" },
      { status: 403 }
    );
  }

  try {
    const results = await query("SELECT * FROM employees ORDER BY id ASC");
    return NextResponse.json(results);
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized (admin only)" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { name, position, phone, email, salary, startDate } = body;

    if (!name || !position || !phone || !email || !salary || !startDate) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const startDateISO = normalizeDate(startDate);
    if (!startDateISO) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    await query(
      "INSERT INTO employees (name, position, phone, email, salary, start_date) VALUES (?, ?, ?, ?, ?, ?)",
      [name, position, phone, email, salary, startDateISO]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error adding employee:", error);
    return NextResponse.json({ error: "Failed to add employee" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized (admin only)" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { id, name, position, phone, email, salary, startDate } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing employee ID" }, { status: 400 });
    }

    const startDateISO = normalizeDate(startDate);

    await query(
      "UPDATE employees SET name=?, position=?, phone=?, email=?, salary=?, start_date=? WHERE id=?",
      [name, position, phone, email, salary, startDateISO, id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating employee:", error);
    return NextResponse.json({ error: "Failed to update employee" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized (admin only)" }, { status: 403 });
  }

  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Missing employee ID" },
        { status: 400 }
      );
    }

    await query("DELETE FROM employees WHERE id=?", [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting employee:", error);
    return NextResponse.json({ error: "Failed to delete employee" }, { status: 500 });
  }
}
