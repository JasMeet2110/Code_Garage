import { query } from "@/lib/db";

type Action = "Add" | "Edit" | "Delete" | "Completed";
type Entity = "Customer" | "Appointment" | "Employee" | "Inventory";

export async function logActivity(opts: {
  action: Action;
  entity: Entity;
  entityName?: string | null;
  message?: string | null;
}) {
  const { action, entity, entityName, message } = opts;
  try {
    await query(
      `INSERT INTO activity_log (action_type, entity_type, entity_name, message)
       VALUES (?, ?, ?, ?)`,
      [action, entity, entityName ?? null, message ?? null]
    );
  } catch (e) {
    // Don't crash your business logic if logging fails
    console.error("activity_log insert failed:", e);
  }
}
