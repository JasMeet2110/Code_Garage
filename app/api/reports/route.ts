import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const year = searchParams.get("year");
    const month = searchParams.get("month");

    let dateCondition = "";
    let params: string[] = [];

    if (year && month) {
      // Filter for selected month in a specific year
      const startDate = `${year}-${month}-01`;
      const nextMonth = Number(month) === 12 ? 1 : Number(month) + 1;
      const nextYear = Number(month) === 12 ? Number(year) + 1 : Number(year);
      const endDate = `${nextYear}-${String(nextMonth).padStart(2, "0")}-01`;
      dateCondition = `AND appointment_date >= ? AND appointment_date < ?`;
      params = [startDate, endDate];
    } else if (year && !month) {
      // Filter for full year
      const startDate = `${year}-01-01`;
      const endDate = `${Number(year) + 1}-01-01`;
      dateCondition = `AND appointment_date >= ? AND appointment_date < ?`;
      params = [startDate, endDate];
    }

    // ✅ Summary now respects selected time period
    const [summary] = await query(
      `
      SELECT
        (SELECT COUNT(*) FROM customers) AS total_customers,
        (SELECT COUNT(*) FROM appointments WHERE 1=1 ${dateCondition}) AS total_appointments,
        (SELECT COUNT(*) FROM employees) AS total_employees,
        (SELECT ROUND(AVG(salary), 2) FROM employees) AS avg_salary
      `,
      params
    );

    // ✅ Appointments Trend (safe under ONLY_FULL_GROUP_BY)
    const appointmentsTrend = await query(
      `
      SELECT 
        DATE_FORMAT(MIN(appointment_date), '%b %Y') AS month,
        COUNT(*) AS count
      FROM appointments
      WHERE appointment_date IS NOT NULL
      ${dateCondition}
      GROUP BY YEAR(appointment_date), MONTH(appointment_date)
      ORDER BY YEAR(appointment_date), MONTH(appointment_date)
      `,
      params
    );

    // ✅ Top Services (filtered by same date range)
    const topServices = await query(
      `
      SELECT service_type AS name, COUNT(*) AS count
      FROM appointments
      WHERE status = 'Completed' ${dateCondition}
      GROUP BY service_type
      ORDER BY count DESC
      LIMIT 5
      `,
      params
    );

    return NextResponse.json({
      summary,
      appointmentsTrend,
      topServices,
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}
