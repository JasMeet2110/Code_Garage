import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

type PartInput = {
  partId: number;
  quantity: number;
};

type CompletePayload = {
  appointmentId: number;
  laborCost: number;
  serviceCharge?: number;
  parts?: PartInput[];
};

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized (admin only)" },
      { status: 403 }
    );
  }

  try {
    const body = (await req.json()) as CompletePayload;
    const { appointmentId, laborCost, serviceCharge = 0, parts = [] } = body;

    if (!appointmentId) {
      return NextResponse.json(
        { error: "Missing appointmentId" },
        { status: 400 }
      );
    }

    const apptRows = (await query(
      "SELECT * FROM appointments WHERE id = ?",
      [appointmentId]
    )) as any[];

    if (!apptRows || apptRows.length === 0) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    const appt = apptRows[0];

    let partsTotal = 0;

    for (const p of parts) {
      const partId = Number(p.partId);
      const qty = Number(p.quantity);

      if (!partId || qty <= 0) continue;

      const invRows = (await query(
        "SELECT * FROM inventory WHERE id = ?",
        [partId]
      )) as any[];

      if (!invRows.length) {
        return NextResponse.json(
          { error: `Inventory part id=${partId} not found` },
          { status: 400 }
        );
      }

      const inv = invRows[0];

      if (inv.quantity < qty) {
        return NextResponse.json(
          {
            error: `Not enough stock for ${inv.name} (have ${inv.quantity}, need ${qty})`,
          },
          { status: 400 }
        );
      }

      const unitPrice = Number(inv.price) || 0;
      const totalPrice = unitPrice * qty;
      partsTotal += totalPrice;

      await query(
        `INSERT INTO appointment_items
         (appointment_id, item_type, part_id, description, quantity, unit_price, total_price)
         VALUES (?, 'part', ?, ?, ?, ?, ?)`,
        [
          appointmentId,
          inv.id,
          `${inv.name} (${inv.part_number})`,
          qty,
          unitPrice,
          totalPrice,
        ]
      );

      await query(
        "UPDATE inventory SET quantity = quantity - ? WHERE id = ?",
        [qty, inv.id]
      );
    }

    const labor = Number(laborCost) || 0;

    if (labor > 0) {
      await query(
        `INSERT INTO appointment_items
         (appointment_id, item_type, part_id, description, quantity, unit_price, total_price)
         VALUES (?, 'labor', NULL, ?, 1, ?, ?)`,
        [
          appointmentId,
          `Labor - ${appt.service_type}`,
          labor,
          labor,
        ]
      );
    }

    const service = Number(serviceCharge) || 0;
    let serviceTotal = 0;

    if (service > 0) {
      serviceTotal = service;
      await query(
        `INSERT INTO appointment_items
         (appointment_id, item_type, part_id, description, quantity, unit_price, total_price)
         VALUES (?, 'labor', NULL, ?, 1, ?, ?)`,
        [
          appointmentId,
          `Service Charge - ${appt.service_type}`,
          service,
          service,
        ]
      );
    }

    const subtotal = labor + partsTotal + serviceTotal;
    const tax = Number((subtotal * 0.05).toFixed(2));
    const total = subtotal + tax;

    await query(
      `UPDATE appointments 
       SET status = 'Completed', completed_at = NOW(), labor_cost = ?
       WHERE id = ?`,
      [labor, appointmentId]
    );

    await query(
      `INSERT INTO transactions (appointment_id, amount, type, category, notes, created_at)
       VALUES (?, ?, 'income', 'service', ?,  NOW())`,
      [
        appointmentId,
        total,
        `Invoice for appointment #${appointmentId} - ${appt.service_type}`,
      ]
    );

    return NextResponse.json({
      success: true,
      appointmentId,
      labor,
      serviceTotal,
      partsTotal,
      subtotal,
      tax,
      total,
    });
  } catch (error) {
    console.error("Error completing appointment:", error);
    return NextResponse.json(
      { error: "Failed to complete appointment" },
      { status: 500 }
    );
  }
}
