import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const monthParam = searchParams.get("month"); // e.g., 2025-10

    let dateCondition = "";
    let params: any[] = [];

    if (monthParam) {
      const [year, month] = monthParam.split("-");
      const startDate = `${year}-${month}-01`;

      // handle December → January rollover
      const nextMonth = Number(month) === 12 ? 1 : Number(month) + 1;
      const nextYear = Number(month) === 12 ? Number(year) + 1 : Number(year);
      const endDate = `${nextYear}-${String(nextMonth).padStart(2, "0")}-01`;

      dateCondition = "AND appointment_date >= ? AND appointment_date < ?";
      params = [startDate, endDate];
    }

    // ✅ Summary stats
    const [summary] = await query(`
      SELECT 
        (SELECT COUNT(*) FROM customers) AS total_customers,
        (SELECT COUNT(*) FROM appointments) AS total_appointments,
        (SELECT COUNT(*) FROM employees) AS total_employees,
        (SELECT ROUND(AVG(salary), 2) FROM employees) AS avg_salary
    `);

    // ✅ Appointments per month for chart
    // ✅ Appointments per month for chart (fixed for ONLY_FULL_GROUP_BY)
    const appointmentsTrend = await query(`
    SELECT 
        DATE_FORMAT(STR_TO_DATE(CONCAT(y, '-', m, '-01'), '%Y-%m-%d'), '%b') AS month,
        COUNT(*) AS count
    FROM (
        SELECT 
        YEAR(appointment_date) AS y, 
        MONTH(appointment_date) AS m
        FROM appointments
        WHERE appointment_date IS NOT NULL
    ) AS sub
    GROUP BY y, m
    ORDER BY y, m
    `);


    // ✅ Top Services (filtered by selected month)
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

    return NextResponse.json({ summary, appointmentsTrend, topServices });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}
