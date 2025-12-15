import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function PUT(req: Request, context: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized (admin only)" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { name, phone, email, carName, carPlate, startDate } = body;

    await query(
      "UPDATE customers SET name=?, phone=?, email=?, car_name=?, car_plate=?, start_date=? WHERE id=?",
      [name, phone, email, carName, carPlate, startDate, context.params.id]
    );

    return NextResponse.json({ message: "Customer updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating customer:", error);
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized (admin only)" }, { status: 403 });
  }

  try {
    await query("DELETE FROM customers WHERE id=?", [context.params.id]);
    return NextResponse.json({ message: "Customer deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting customer:", error);
    return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 });
  }
}
