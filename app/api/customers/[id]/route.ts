import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// ✅ Update by ID (Admin)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { name, phone, email, carName, carPlate, startDate } = body;

    await query(
      "UPDATE customers SET name=?, phone=?, email=?, car_name=?, car_plate=?, start_date=? WHERE id=?",
      [name, phone, email, carName, carPlate, startDate, params.id]
    );

    return NextResponse.json({ message: "Customer updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating customer:", error);
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 });
  }
}

// ✅ Delete by ID (Admin)
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await query("DELETE FROM customers WHERE id=?", [params.id]);
    return NextResponse.json({ message: "Customer deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting customer:", error);
    return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 });
  }
}
