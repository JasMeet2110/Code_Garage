import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// ✅ Update by ID (Admin)
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;  // ADD THIS LINE
    const body = await req.json();
    const { name, phone, email, carName, carPlate, startDate } = body;

    await query(
      "UPDATE customers SET name=?, phone=?, email=?, car_name=?, car_plate=?, start_date=? WHERE id=?",
      [name, phone, email, carName, carPlate, startDate, id]  // CHANGE params.id to id
    );

    return NextResponse.json({ message: "Customer updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating customer:", error);
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 });
  }
}

// ✅ Delete by ID (Admin)
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;  
    await query("DELETE FROM customers WHERE id=?", [id]);
    return NextResponse.json({ message: "Customer deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting customer:", error);
    return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 });
  }
}
