import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// Helper function to normalize datetime
function normalizeDateTime(input: string | null): string | null {
  if (!input) return null;

  try {
    const parsed = new Date(input);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString().slice(0, 19).replace("T", " ");
    }
  } catch {
    return null;
  }

  return null;
}

// Helper function to validate shift times
function validateShiftTimes(startTime: string, endTime: string): { valid: boolean; error?: string } {
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { valid: false, error: "Invalid date format" };
  }

  if (start >= end) {
    return { valid: false, error: "Start time must be before end time" };
  }

  // Check if shift is longer than 24 hours
  const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  if (duration > 24) {
    return { valid: false, error: "Shift cannot be longer than 24 hours" };
  }

  return { valid: true };
}

// Helper function to check for shift conflicts
async function checkShiftConflict(
  employeeId: number,
  startTime: string,
  endTime: string,
  excludeShiftId?: number
): Promise<boolean> {
  try {
    const sql = excludeShiftId
      ? `SELECT id FROM shifts 
         WHERE employee_id = ? 
         AND id != ?
         AND (
           (start_time < ? AND end_time > ?) OR
           (start_time < ? AND end_time > ?) OR
           (start_time >= ? AND end_time <= ?)
         )`
      : `SELECT id FROM shifts 
         WHERE employee_id = ? 
         AND (
           (start_time < ? AND end_time > ?) OR
           (start_time < ? AND end_time > ?) OR
           (start_time >= ? AND end_time <= ?)
         )`;

    const params = excludeShiftId
      ? [employeeId, excludeShiftId, endTime, startTime, endTime, startTime, startTime, endTime]
      : [employeeId, endTime, startTime, endTime, startTime, startTime, endTime];

    const results = await query(sql, params) as Array<{ id: number }>;
    return results.length > 0;
  } catch (error) {
    console.error("Error checking shift conflict:", error);
    return false;
  }
}

// GET - Fetch all shifts with optional filters
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get("employee_id");
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");

    let sql = `
      SELECT 
        s.id,
        s.employee_id,
        s.start_time,
        s.end_time,
        s.role_assigned,
        s.notes,
        s.created_at,
        s.updated_at,
        e.name as employee_name,
        e.position as employee_position
      FROM shifts s
      LEFT JOIN employees e ON s.employee_id = e.id
      WHERE 1=1
    `;

    const params: (string | number)[] = [];

    if (employeeId) {
      sql += " AND s.employee_id = ?";
      params.push(parseInt(employeeId));
    }

    if (startDate) {
      sql += " AND s.start_time >= ?";
      params.push(startDate);
    }

    if (endDate) {
      sql += " AND s.end_time <= ?";
      params.push(endDate);
    }

    sql += " ORDER BY s.start_time DESC";

    const results = await query(sql, params);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Error fetching shifts:", error);
    return NextResponse.json(
      { error: "Failed to fetch shifts" },
      { status: 500 }
    );
  }
}

// POST - Create new shift
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { employeeId, startTime, endTime, roleAssigned, notes } = body;

    // Validation
    if (!employeeId || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Employee ID, start time, and end time are required" },
        { status: 400 }
      );
    }

    // Normalize datetime
    const startTimeISO = normalizeDateTime(startTime);
    const endTimeISO = normalizeDateTime(endTime);

    if (!startTimeISO || !endTimeISO) {
      return NextResponse.json(
        { error: "Invalid datetime format" },
        { status: 400 }
      );
    }

    // Validate shift times
    const timeValidation = validateShiftTimes(startTimeISO, endTimeISO);
    if (!timeValidation.valid) {
      return NextResponse.json(
        { error: timeValidation.error },
        { status: 400 }
      );
    }

    // Check for conflicts
    const hasConflict = await checkShiftConflict(
      employeeId,
      startTimeISO,
      endTimeISO
    );

    if (hasConflict) {
      return NextResponse.json(
        { error: "This shift conflicts with an existing shift for this employee" },
        { status: 409 }
      );
    }

    // Verify employee exists
    const employeeCheck = await query(
      "SELECT id FROM employees WHERE id = ?",
      [employeeId]
    ) as Array<{ id: number }>;

    if (employeeCheck.length === 0) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    // Insert shift
    await query(
      `INSERT INTO shifts (employee_id, start_time, end_time, role_assigned, notes) 
       VALUES (?, ?, ?, ?, ?)`,
      [employeeId, startTimeISO, endTimeISO, roleAssigned || null, notes || null]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error adding shift:", error);
    return NextResponse.json(
      { error: "Failed to add shift" },
      { status: 500 }
    );
  }
}

// PUT - Update existing shift
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, employeeId, startTime, endTime, roleAssigned, notes } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Shift ID is required" },
        { status: 400 }
      );
    }

    // Normalize datetime
    const startTimeISO = normalizeDateTime(startTime);
    const endTimeISO = normalizeDateTime(endTime);

    if (!startTimeISO || !endTimeISO) {
      return NextResponse.json(
        { error: "Invalid datetime format" },
        { status: 400 }
      );
    }

    // Validate shift times
    const timeValidation = validateShiftTimes(startTimeISO, endTimeISO);
    if (!timeValidation.valid) {
      return NextResponse.json(
        { error: timeValidation.error },
        { status: 400 }
      );
    }

    // Check for conflicts (excluding current shift)
    const hasConflict = await checkShiftConflict(
      employeeId,
      startTimeISO,
      endTimeISO,
      id
    );

    if (hasConflict) {
      return NextResponse.json(
        { error: "This shift conflicts with an existing shift for this employee" },
        { status: 409 }
      );
    }

    // Update shift
    await query(
      `UPDATE shifts 
       SET employee_id = ?, start_time = ?, end_time = ?, role_assigned = ?, notes = ?
       WHERE id = ?`,
      [employeeId, startTimeISO, endTimeISO, roleAssigned || null, notes || null, id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating shift:", error);
    return NextResponse.json(
      { error: "Failed to update shift" },
      { status: 500 }
    );
  }
}

// DELETE - Remove shift
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Shift ID is required" },
        { status: 400 }
      );
    }

    await query("DELETE FROM shifts WHERE id = ?", [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting shift:", error);
    return NextResponse.json(
      { error: "Failed to delete shift" },
      { status: 500 }
    );
  }
}
