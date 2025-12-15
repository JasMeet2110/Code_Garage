import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    // REVENUE = completed appointments (labor only)
    const revenueRows = await query(`
      SELECT labor_cost, completed_at
      FROM appointments
      WHERE status='Completed' AND completed_at IS NOT NULL
    `) as any[];

    let revenue = 0;
    const revenueMap = new Map<string, number>();

    for (const r of revenueRows) {
      const amt = Number(r.labor_cost || 0);
      revenue += amt;

      const key = new Date(r.completed_at).toLocaleString("en-CA", {
        month: "short",
        year: "numeric",
      });

      revenueMap.set(key, (revenueMap.get(key) || 0) + amt);
    }

    const revenueTrend = [...revenueMap.entries()].map(([month, revenue]) => ({
      month,
      revenue,
    }));

    // PAYROLL
    const payroll = await query(`
      SELECT COALESCE(
        SUM((TIMESTAMPDIFF(MINUTE,start_time,end_time)/60)*e.salary),0
      ) total
      FROM shifts s JOIN employees e ON e.id=s.employee_id
    `) as any[];

    const expenses = Number(payroll[0].total);
    const profit = revenue - expenses;

    // OUTSTANDING
    const pending = await query(`
      SELECT id, customer_name, service_type, labor_cost
      FROM appointments WHERE status='Pending'
    `) as any[];

    const outstanding = pending.reduce((s,p)=>s+Number(p.labor_cost||0),0);

    return NextResponse.json({
      summary:{ revenue, expenses, profit, outstanding },
      revenueTrend,
      recentTransactions: revenueRows.slice(0,5).map((r,i)=>({
        id:i+1,
        date:r.completed_at,
        type:'Revenue',
        amount:r.labor_cost,
        status:'Completed'
      })),
      pendingInvoices: pending.map(p=>({
        id:p.id,
        customer:p.customer_name,
        service:p.service_type,
        amount:p.labor_cost,
        status:'Pending'
      }))
    });
  } catch (e) {
    return NextResponse.json({ error:'Finance error' },{ status:500 });
  }
}
