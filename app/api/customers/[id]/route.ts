import { NextResponse } from "next/server";
import { query } from "@/lib/db";

/**
 * Helper: extract the last segment (id) from the request URL
 */
function getIdFromUrl(req: Request): string {
  const url = new URL(req.url);
  const parts = url.pathname.split("/").filter(Boolean); // remove empty
  return parts[parts.length - 1]; // last segment is [id]
}

// ✅ Update by ID (Admin)  -  PUT /api/customers/[id]
export const PUT = async (req: Request) => {
  try {
    const id = getIdFromUrl(req);

    const body = await req.json();
    const { name, phone, email, carName, carPlate, startDate } = body;

    await query(
      `UPDATE customers
       SET name = ?, phone = ?, email = ?, car_name = ?, car_plate = ?, start_date = ?
       WHERE id = ?`,
      [name, phone, email, carName, carPlate, startDate, id]
    );

    return NextResponse.json(
      { message: "Customer updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating customer:", error);
    return NextResponse.json(
      { error: "Failed to update customer" },
      { status: 500 }
    );
  }
};

// ✅ Delete by ID (Admin)  -  DELETE /api/customers/[id]
export const DELETE = async (req: Request) => {
  try {
    const id = getIdFromUrl(req);

    await query("DELETE FROM customers WHERE id = ?", [id]);

    return NextResponse.json(
      { message: "Customer deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting customer:", error);
    return NextResponse.json(
      { error: "Failed to delete customer" },
      { status: 500 }
    );
  }
};
