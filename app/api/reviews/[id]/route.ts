import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function DELETE(req: Request, { params }: any) {
  try {
    await query("DELETE FROM reviews WHERE id = ?", [params.id]);
    return NextResponse.json({ message: "Review deleted" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
