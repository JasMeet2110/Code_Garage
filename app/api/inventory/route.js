import { query } from "@/lib/db";

// ✅ GET all inventory items
export async function GET() {
  try {
    const results = await query(`
      SELECT 
        id, 
        name, 
        part_number AS partNumber, 
        quantity, 
        price 
      FROM inventory 
      ORDER BY id DESC
    `);
    return Response.json(results);
  } catch (error) {
    console.error("GET /api/inventory error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch inventory" }), { status: 500 });
  }
}

// ✅ POST - Add new item
export async function POST(req) {
  try {
    const { name, partNumber, quantity, price } = await req.json();

    if (!name || !partNumber || quantity <= 0 || price <= 0) {
      return new Response(JSON.stringify({ error: "Invalid input" }), { status: 400 });
    }

    await query(
      "INSERT INTO inventory (name, part_number, quantity, price) VALUES (?, ?, ?, ?)",
      [name, partNumber, quantity, price]
    );

    return new Response(JSON.stringify({ message: "Item added successfully" }), { status: 201 });
  } catch (error) {
    console.error("POST /api/inventory error:", error);
    return new Response(JSON.stringify({ error: "Failed to add item" }), { status: 500 });
  }
}

// ✅ PUT - Update an existing item
export async function PUT(req) {
  try {
    const { id, name, partNumber, quantity, price } = await req.json();

    if (!id || !name || !partNumber || quantity < 0 || price < 0) {
      return new Response(JSON.stringify({ error: "Invalid input" }), { status: 400 });
    }

    await query(
      "UPDATE inventory SET name = ?, part_number = ?, quantity = ?, price = ? WHERE id = ?",
      [name, partNumber, quantity, price, id]
    );

    return new Response(JSON.stringify({ message: "Item updated successfully" }), { status: 200 });
  } catch (error) {
    console.error("PUT /api/inventory error:", error);
    return new Response(JSON.stringify({ error: "Failed to update item" }), { status: 500 });
  }
}

// ✅ DELETE - Remove an item
export async function DELETE(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return new Response(JSON.stringify({ error: "Missing item ID" }), { status: 400 });
    }

    await query("DELETE FROM inventory WHERE id = ?", [id]);

    return new Response(JSON.stringify({ message: "Item deleted successfully" }), { status: 200 });
  } catch (error) {
    console.error("DELETE /api/inventory error:", error);
    return new Response(JSON.stringify({ error: "Failed to delete item" }), { status: 500 });
  }
}
