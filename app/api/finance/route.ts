import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Example: Fetch financial summary data
    const summary = await query(
      "SELECT * FROM financial_summary LIMIT 1"
    ) as any[];

    const transactions = await query(
      "SELECT * FROM transactions ORDER BY date DESC LIMIT 10"
    ) as any[];

    return NextResponse.json({
      summary: summary[0] || {},
      transactions: transactions || []
    });
  } catch (error) {
    console.error("Error fetching finance data:", error);
    return NextResponse.json(
      { error: "Failed to fetch finance data" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Add logic to create financial records
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating finance record:", error);
    return NextResponse.json(
      { error: "Failed to create finance record" },
      { status: 500 }
    );
  }
}
