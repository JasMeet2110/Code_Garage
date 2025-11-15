import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// Get summary financial data
export async function GET() {
  try {
    const revenue = await query("SELECT SUM(amount) AS totalRevenue FROM transactions WHERE type='income'");
    const expenses = await query("SELECT SUM(amount) AS totalExpenses FROM transactions WHERE type='expense'");
    const invoices = await query("SELECT * FROM invoices ORDER BY created_at DESC");

    return NextResponse.json({
      revenue: revenue[0]?.totalRevenue || 0,
      expenses: expenses[0]?.totalExpenses || 0,
      invoices
    });
  } catch (error) {
    console.error("Finance API error:", error);
    return NextResponse.json({ error: "Failed to load finance data" }, { status: 500 });
  }
}

