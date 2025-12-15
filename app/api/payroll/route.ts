import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get("employeeId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!employeeId || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    /* ─────────────────────────────────────────────
       1️⃣ Fetch employee HOURLY wage
    ───────────────────────────────────────────── */
    const empRows = (await query(
      "SELECT salary FROM employees WHERE id = ?",
      [employeeId]
    )) as any[];

    if (!empRows.length) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    // salary = hourly wage
    const hourlyRate = Number(empRows[0].salary);
    const overtimeMultiplier = 1.5;

    /* ─────────────────────────────────────────────
       2️⃣ Fetch shifts in date range
    ───────────────────────────────────────────── */
    const shifts = (await query(
      `SELECT start_time, end_time 
       FROM shifts
       WHERE employee_id = ?
       AND DATE(start_time) >= ?
       AND DATE(start_time) <= ?`,
      [employeeId, startDate, endDate]
    )) as any[];

    let regularHours = 0;
    let overtimeHours = 0;

    /* ─────────────────────────────────────────────
       3️⃣ Calculate hours
    ───────────────────────────────────────────── */
    shifts.forEach((shift) => {
      const start = new Date(shift.start_time);
      const end = new Date(shift.end_time);

      const totalHours =
        (end.getTime() - start.getTime()) / (1000 * 60 * 60);

      const day = start.getDay(); // 0 = Sun, 6 = Sat
      const isWeekend = day === 0 || day === 6;

      const startHour = start.getHours() + start.getMinutes() / 60;
      const endHour = end.getHours() + end.getMinutes() / 60;

      if (isWeekend) {
        // Weekend → ALL overtime
        overtimeHours += totalHours;
        return;
      }

      // Weekday rules
      const REG_START = 8;  // 8 AM
      const REG_END = 18;   // 6 PM
      const DAILY_REG_LIMIT = 8;

      let shiftRegular = 0;
      let shiftOvertime = 0;

      // Before 8 AM
      if (startHour < REG_START) {
        shiftOvertime += Math.min(endHour, REG_START) - startHour;
      }

      // After 6 PM
      if (endHour > REG_END) {
        shiftOvertime += endHour - Math.max(startHour, REG_END);
      }

      // Between 8 AM - 6 PM
      const overlapStart = Math.max(startHour, REG_START);
      const overlapEnd = Math.min(endHour, REG_END);

      if (overlapStart < overlapEnd) {
        const during = overlapEnd - overlapStart;
        if (during <= DAILY_REG_LIMIT) {
          shiftRegular += during;
        } else {
          shiftRegular += DAILY_REG_LIMIT;
          shiftOvertime += during - DAILY_REG_LIMIT;
        }
      }

      regularHours += shiftRegular;
      overtimeHours += shiftOvertime;
    });

    /* ─────────────────────────────────────────────
       4️⃣ Calculate pay
    ───────────────────────────────────────────── */
    const overtimeRate = hourlyRate * overtimeMultiplier;

    const regularPay = Number((regularHours * hourlyRate).toFixed(2));
    const overtimePay = Number((overtimeHours * overtimeRate).toFixed(2));
    const totalPay = Number((regularPay + overtimePay).toFixed(2));

    /* ─────────────────────────────────────────────
       5️⃣ Response
    ───────────────────────────────────────────── */
    return NextResponse.json({
      hourlyRate,
      overtimeRate,
      regularHours,
      overtimeHours,
      regularPay,
      overtimePay,
      totalPay,
    });
  } catch (error) {
    console.error("Payroll calculation error:", error);
    return NextResponse.json(
      { error: "Failed to calculate payroll" },
      { status: 500 }
    );
  }
}
