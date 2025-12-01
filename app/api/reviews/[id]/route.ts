import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function DELETE(req: Request, { params }: any) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized (admin only)" },
      { status: 403 }
    );
  }

  try {
    await query("DELETE FROM reviews WHERE id = ?", [params.id]);
    return NextResponse.json({ message: "Review deleted" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}