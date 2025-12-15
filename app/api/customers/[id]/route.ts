import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const id = Number(params.id);
    if (!id) {
      return NextResponse.json({ error: "Invalid customer ID" }, { status: 400 });
    }

    const body = await req.json();
    const { name, phone, carName, carPlate, year, color, carImage } = body;

    await query(
      `UPDATE customers
       SET name = ?, phone = ?, car_name = ?, car_plate = ?, year = ?, color = ?, car_image = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        name ?? null,
        phone ?? null,
        carName ?? null,
        carPlate ?? null,
        year ?? null,
        color ?? null,
        carImage ?? null,
        id,
      ]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Update customer error:", err);
    return NextResponse.json(
      { error: "Failed to update customer" },
      { status: 500 }
    );
  }
}
