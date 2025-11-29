import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return new Response(
      JSON.stringify({ error: "Unauthorized (admin only)" }),
      { status: 403 }
    );
  }

  try {
    const items = await query(
      "SELECT id, name, part_number AS partNumber, quantity FROM inventory WHERE quantity < 5 ORDER BY quantity ASC"
    );

    return new Response(JSON.stringify(items), { status: 200 });
  } catch (err) {
    console.error("LOW STOCK API ERROR:", err);
    return new Response(
      JSON.stringify({ error: "Failed to fetch low-stock items" }),
      { status: 500 }
    );
  }
}