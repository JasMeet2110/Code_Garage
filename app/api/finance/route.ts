import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const year = searchParams.get("year");
    const month = searchParams.get("month");

    let dateCondition = "";
    const params: any[] = [];

    if (year && month) {
      const start = `${year}-${month}-01`;

      const nextMonth = Number(month) === 12 ? 1 : Number(month) + 1;
      const nextYear = Number(month) === 12 ? Number(year) + 1 : Number(year);

      const end = `${nextYear}-${String(nextMonth).padStart(2, "0")}-01`;

      dateCondition = "AND a.appointment_date >= ? AND a.appointment_date < ?";
      params.push(start, end);
    } 
    else if (year && !month) {
      const start = `${year}-01-01`;
      const end = `${Number(year) + 1}-01-01`;

      dateCondition = "AND a.appointment_date >= ? AND a.appointment_date < ?";
      params.push(start, end);
    }

    const trxRows = (await query(
      `
        SELECT 
          t.id,
          t.amount,
          t.type,
          t.created_at,
          a.id AS appt_id,
          a.customer_name,
          a.service_type,
          a.status,
          a.appointment_date
        FROM transactions t
        LEFT JOIN appointments a ON a.id = t.appointment_id
        WHERE t.type = 'income' ${dateCondition}
        ORDER BY t.created_at DESC
      `,
      params
    )) as any[];

    let revenue = 0;
    const revenueMap = new Map<string, number>();

    for (const row of trxRows) {
      const amt = Number(row.amount) || 0;
      revenue += amt;

      const dateKey = new Date(row.appointment_date || row.created_at).toLocaleString(
        "en-CA",
        { month: "short", year: "numeric" }
      );

      revenueMap.set(dateKey, (revenueMap.get(dateKey) || 0) + amt);
    }

    const revenueTrend = Array.from(revenueMap.entries()).map(
      ([month, revenue]) => ({ month, revenue })
    );

    const salaryRows = (await query(
      "SELECT COALESCE(SUM(salary), 0) AS total FROM employees"
    )) as any[];

    let expenses = Number(salaryRows[0]?.total || 0);

    const expenseRows = (await query(
      `
        SELECT amount 
        FROM transactions t
        LEFT JOIN appointments a ON a.id = t.appointment_id
        WHERE t.type = 'expense' ${dateCondition}
      `,
      params
    )) as any[];

    for (const row of expenseRows) {
      expenses += Number(row.amount) || 0;
    }

    const profit = revenue - expenses;

    const outstandingRows = (await query(
      `
        SELECT 
          t.amount,
          a.customer_name,
          a.service_type,
          a.status,
          a.id AS appointment_id
        FROM appointments a
        LEFT JOIN transactions t ON t.appointment_id = a.id
        WHERE a.status = 'Pending'
      `
    )) as any[];

    let outstanding = 0;
    const pendingInvoices = outstandingRows
      .filter((row) => row.amount != null)
      .map((row) => {
        outstanding += Number(row.amount) || 0;
        return {
          id: row.appointment_id,
          customer: row.customer_name,
          service: row.service_type,
          amount: Number(row.amount) || 0,
          status: row.status,
        };
      });

    const recentTransactions = trxRows.slice(0, 5).map((row) => ({
      id: row.id,
      date: row.appointment_date || row.created_at,
      type: "Revenue",
      amount: Number(row.amount) || 0,
      status: row.status,
    }));

    return NextResponse.json(
      {
        summary: { revenue, expenses, profit, outstanding },
        revenueTrend,
        recentTransactions,
        pendingInvoices,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in /api/finance:", err);
    return NextResponse.json(
      { error: "Failed to fetch finance data" },
      { status: 500 }
    );
  }
}
