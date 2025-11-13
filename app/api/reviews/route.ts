import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const rows = await query("SELECT * FROM reviews ORDER BY created_at DESC");
    return NextResponse.json(rows);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, rating, comment } = await req.json();
    const date = new Date().toISOString().slice(0, 10);

    const result: any = await query(
      "INSERT INTO reviews (name, rating, comment, date) VALUES (?, ?, ?, ?)",
      [name, rating, comment, date]
    );

    return NextResponse.json({
      id: result.insertId,
      name,
      rating,
      comment,
      date,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
