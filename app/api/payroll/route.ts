import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get("employeeId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Fetch employee salary
    const empRows = (await query(
      "SELECT salary, overtime_multiplier FROM employees WHERE id = ?",
      [employeeId]
    )) as any[];

    if (!empRows.length) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    const { salary, overtime_multiplier } = empRows[0];

    const shifts = (await query(
      `SELECT start_time, end_time FROM shifts 
   WHERE employee_id = ? 
   AND DATE(start_time) >= ? 
   AND DATE(start_time) <= ?`,
      [employeeId, startDate, endDate]
    )) as any[];

    // Calculate hours
    let regularHours = 0;
    let overtimeHours = 0;

shifts.forEach((shift: any) => {
  const start = new Date(shift.start_time);
  const end = new Date(shift.end_time);
  
  const dayOfWeek = start.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  
  const startHour = start.getHours() + start.getMinutes() / 60;
  const endHour = end.getHours() + end.getMinutes() / 60;
  const totalShiftHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  
  if (isWeekend) {
    // Weekend: ALL hours are overtime
    overtimeHours += totalShiftHours;
  } else {
    // Weekday: Combined rules
    const regularStart = 8;  // 8 AM
    const regularEnd = 18;   // 6 PM
    const dailyRegularLimit = 8; // Max 8 hours regular per day
    
    let shiftOvertimeHours = 0;
    let shiftRegularHours = 0;
    
    // 1. Hours BEFORE 8 AM → overtime
    if (startHour < regularStart) {
      const beforeEnd = Math.min(endHour, regularStart);
      const beforeHours = beforeEnd - startHour;
      if (beforeHours > 0) {
        shiftOvertimeHours += beforeHours;
      }
    }
    
    // 2. Hours AFTER 6 PM → overtime
    if (endHour > regularEnd) {
      const afterStart = Math.max(startHour, regularEnd);
      const afterHours = endHour - afterStart;
      if (afterHours > 0) {
        shiftOvertimeHours += afterHours;
      }
    }
    
    // 3. Hours DURING 8 AM - 6 PM → split based on 8-hour limit
    const regularOverlapStart = Math.max(startHour, regularStart);
    const regularOverlapEnd = Math.min(endHour, regularEnd);
    if (regularOverlapStart < regularOverlapEnd) {
      const duringHours = regularOverlapEnd - regularOverlapStart;
      
      // Apply 8-hour daily limit
      if (duringHours <= dailyRegularLimit) {
        shiftRegularHours += duringHours;
      } else {
        shiftRegularHours += dailyRegularLimit;
        shiftOvertimeHours += (duringHours - dailyRegularLimit);
      }
    }
    
    // Add to totals
    regularHours += shiftRegularHours;
    overtimeHours += shiftOvertimeHours;
  }
});


    // Calculate pay
    const hourlyRate = salary / 2080;
    const overtimeRate = hourlyRate * overtime_multiplier;
    const regularPay = regularHours * hourlyRate;
    const overtimePay = overtimeHours * overtimeRate;
    const totalPay = regularPay + overtimePay;

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
