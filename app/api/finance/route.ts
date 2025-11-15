import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// simple price list for services – adjust if you want different prices
const SERVICE_PRICES = {
  "Car AC Repair": 300,
  "Alternator Repair": 250,
  "Brake Repair": 200,
  "Car Battery Services": 180,
  "Cooling System": 220,
  "Auto Diagnostics": 150,
  "Drivetrain & Differential": 400,
  "Auto Electrical Repair": 260,
  "Engine Repair": 600,
  "General Car Repair": 180,
  "Heater Repair": 160,
  "Oil Change & Maintenance": 150,
  "Starter Repair": 200,
  "Suspension & Steering Repair": 350,
  "Tire Services": 100,
  "Transmission Repair": 700,
  "Wheel Alignment": 140,
  "Other Services": 150,
};

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const year = searchParams.get("year");
    const month = searchParams.get("month");

    let dateCondition = "";
    const params = [];

    if (year && month) {
      const startDate = `${year}-${month}-01`;
      const nextMonth = Number(month) === 12 ? 1 : Number(month) + 1;
      const nextYear = Number(month) === 12 ? Number(year) + 1 : Number(year);
      const endDate = `${nextYear}-${String(nextMonth).padStart(2, "0")}-01`;
      dateCondition = "AND appointment_date >= ? AND appointment_date < ?";
      params.push(startDate, endDate);
    } else if (year && !month) {
      const startDate = `${year}-01-01`;
      const endDate = `${Number(year) + 1}-01-01`;
      dateCondition = "AND appointment_date >= ? AND appointment_date < ?";
      params.push(startDate, endDate);
    }

    // ---------- Revenue + trend from appointments ----------
    const appointments = await query(
      `
        SELECT appointment_date, service_type, status, customer_name
        FROM appointments
        WHERE 1=1 ${dateCondition}
      `,
      params
    );

    let revenue = 0;
    const monthMap = new Map();

    for (const row of appointments) {
      const price = SERVICE_PRICES[row.service_type] ?? 150;
      revenue += price;

      const monthKey = new Date(row.appointment_date).toLocaleString(
        "en-CA",
        { month: "short", year: "numeric" }
      );

      const prev = monthMap.get(monthKey) ?? 0;
      monthMap.set(monthKey, prev + price);
    }

    const revenueTrend = Array.from(monthMap.entries()).map(
      ([month, amount]) => ({ month, revenue: amount })
    );

    // ---------- Expenses (example: from employees salaries) ----------
    const salaryRows = await query(
      "SELECT COALESCE(SUM(salary), 0) AS total_salaries FROM employees"
    );
    const expenses = salaryRows[0]?.total_salaries ?? 0;

    // ---------- Outstanding: value of pending appointments ----------
    const pendingRowsForTotal = await query(
      `
        SELECT service_type
        FROM appointments
        WHERE status = 'Pending' ${dateCondition}
      `,
      params
    );

    let outstanding = 0;
    for (const row of pendingRowsForTotal) {
      const price = SERVICE_PRICES[row.service_type] ?? 150;
      outstanding += price;
    }

    const profit = revenue - expenses;

    // ---------- Recent Transactions (latest 5 appointments) ----------
    const recentRows = await query(
      `
        SELECT id, appointment_date, service_type, status
        FROM appointments
        WHERE 1=1 ${dateCondition}
        ORDER BY appointment_date DESC
        LIMIT 5
      `,
      params
    );

    const recentTransactions = recentRows.map((row) => {
      const price = SERVICE_PRICES[row.service_type] ?? 150;
      return {
        id: row.id,
        date: row.appointment_date,
        type: "Revenue",
        amount: price,
        status: row.status,
      };
    });

    // ---------- Pending Invoices (pending appointments) ----------
    const pendingInvoiceRows = await query(
      `
        SELECT id, customer_name, service_type, appointment_date, status
        FROM appointments
        WHERE status = 'Pending' ${dateCondition}
        ORDER BY appointment_date ASC
        LIMIT 5
      `,
      params
    );

    const pendingInvoices = pendingInvoiceRows.map((row) => {
      const price = SERVICE_PRICES[row.service_type] ?? 150;
      return {
        id: row.id,
        customer: row.customer_name,
        service: row.service_type,
        amount: price,
        status: row.status,
        date: row.appointment_date,
      };
    });

    return NextResponse.json(
      {
        summary: {
          revenue,
          expenses,
          profit,
          outstanding,
        },
        revenueTrend,
        recentTransactions,
        pendingInvoices,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/finance:", error);
    return NextResponse.json(
      { error: "Failed to fetch finance data" },
      { status: 500 }
    );
  }
}
