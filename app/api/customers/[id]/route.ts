import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { withTransaction } from "@/lib/db";

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

    const result = await withTransaction(async (tx) => {
      // 🔒 Lock appointment
      const apptRows = (await tx(
        "SELECT * FROM appointments WHERE id = ? FOR UPDATE",
        [appointmentId]
      )) as any[];

      if (!apptRows.length) {
        return { error: "Appointment not found", status: 404 as const };
      }

      const appt = apptRows[0];

      if (appt.status === "Completed") {
        return {
          error: "Appointment already completed",
          status: 409 as const,
        };
      }

      let partsTotal = 0;

      // 🔧 Parts handling
      for (const p of parts) {
        const partId = Number(p.partId);
        const qty = Number(p.quantity);

        if (!partId || qty <= 0) continue;

        const invRows = (await tx(
          "SELECT * FROM inventory WHERE id = ? FOR UPDATE",
          [partId]
        )) as any[];

        if (!invRows.length) {
          return {
            error: `Inventory part id=${partId} not found`,
            status: 400 as const,
          };
        }

        const inv = invRows[0];

        if (inv.quantity < qty) {
          return {
            error: `Not enough stock for ${inv.name}`,
            status: 400 as const,
          };
        }

        const unitPrice = Number(inv.price) || 0;
        const totalPrice = unitPrice * qty;
        partsTotal += totalPrice;

        await tx(
          `INSERT INTO appointment_items
           (appointment_id, item_type, part_id, description, quantity, unit_price, total_price)
           VALUES (?, 'part', ?, ?, ?, ?, ?)`,
          [
            appointmentId,
            inv.id,
            inv.name,
            qty,
            unitPrice,
            totalPrice,
          ]
        );

        await tx(
          "UPDATE inventory SET quantity = quantity - ? WHERE id = ?",
          [qty, inv.id]
        );
      }

      const labor = Math.max(0, Number(laborCost) || 0);

      if (labor > 0) {
        await tx(
          `INSERT INTO appointment_items
           (appointment_id, item_type, part_id, description, quantity, unit_price, total_price)
           VALUES (?, 'labor', NULL, ?, 1, ?, ?)`,
          [appointmentId, `Labor - ${appt.service_type}`, labor, labor]
        );
      }

      const service = Math.max(0, Number(serviceCharge) || 0);

      if (service > 0) {
        await tx(
          `INSERT INTO appointment_items
           (appointment_id, item_type, part_id, description, quantity, unit_price, total_price)
           VALUES (?, 'service', NULL, ?, 1, ?, ?)`,
          [
            appointmentId,
            `Service Charge - ${appt.service_type}`,
            service,
            service,
          ]
        );
      }

      const subtotal = labor + partsTotal + service;
      const tax = Number((subtotal * 0.05).toFixed(2));
      const total = Number((subtotal + tax).toFixed(2));

      await tx(
        `UPDATE appointments
         SET status = 'Completed',
             completed_at = NOW(),
             labor_cost = ?
         WHERE id = ?`,
        [labor, appointmentId]
      );

      await tx(
        `INSERT INTO transactions
         (appointment_id, amount, type, category, notes, created_at)
         VALUES (?, ?, 'income', 'service', ?, NOW())`,
        [
          appointmentId,
          total,
          `Invoice for appointment #${appointmentId}`,
        ]
      );

      return {
        success: true,
        appointmentId,
        labor,
        serviceTotal: service,
        partsTotal,
        subtotal,
        tax,
        total,
      };
    });

    if ((result as any).error) {
      return NextResponse.json(
        { error: (result as any).error },
        { status: (result as any).status || 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error completing appointment:", error);
    return NextResponse.json(
      { error: "Failed to complete appointment" },
      { status: 500 }
    );
  }
}
