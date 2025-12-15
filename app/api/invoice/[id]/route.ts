import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { PDFDocument, StandardFonts } from "pdf-lib";
import fs from "fs";
import path from "path";

export async function GET(req: Request, context: any) {
  try {
    const { id } = context.params;

    /* ======================
       FETCH APPOINTMENT
    ====================== */
    const rows = (await query(
      `SELECT a.*, e.name AS employee_name
       FROM appointments a
       LEFT JOIN employees e ON e.id = a.assigned_employee_id
       WHERE a.id = ?`,
      [id]
    )) as any[];

    if (!rows.length) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    const appt = rows[0];

    /* ======================
       FETCH LINE ITEMS
    ====================== */
    const itemRows = (await query(
      `SELECT * FROM appointment_items
       WHERE appointment_id = ?
       ORDER BY item_type DESC, id ASC`,
      [id]
    )) as any[];

    /* ======================
      MONEY CALCULATION
      (FINAL + SAFE)
    ====================== */
    let laborTotal = 0;
    let serviceTotal = 0;
    let partsTotal = 0;

    for (const item of itemRows) {
      const total = Number(item.total_price) || 0;

      // 🔧 Normalize legacy bad data
      if (
        item.item_type === "labor" &&
        typeof item.description === "string" &&
        item.description.toLowerCase().includes("service")
      ) {
        serviceTotal += total;
        continue;
      }

      if (item.item_type === "labor") laborTotal += total;
      if (item.item_type === "service") serviceTotal += total;
      if (item.item_type === "part") partsTotal += total;
    }

    // ❌ DO NOT FALL BACK TO appointments.labor_cost anymore
    // This prevents double counting forever

    const subtotal = laborTotal + serviceTotal + partsTotal;
    const tax = Number((subtotal * 0.05).toFixed(2));
    const total = Number((subtotal + tax).toFixed(2));


    /* ======================
       PDF SETUP
    ====================== */
    const pdf = await PDFDocument.create();
    const font = await pdf.embedFont(StandardFonts.Courier);

    let page = pdf.addPage([595, 842]); // A4
    let { width } = page.getSize();
    let y = 800;

    const ensureSpace = (amount = 30) => {
      if (y - amount < 50) {
        page = pdf.addPage([595, 842]);
        y = 800;
      }
    };

    const writeLine = (text: string, size = 12) => {
      ensureSpace();
      page.drawText(text, { x: 50, y, size, font });
      y -= 18;
    };

    const writeCenter = (text: string, size = 12) => {
      ensureSpace(size + 15);
      const textWidth = font.widthOfTextAtSize(text, size);
      page.drawText(text, {
        x: (width - textWidth) / 2,
        y,
        size,
        font,
      });
      y -= size + 6;
    };

    const section = (title: string) => {
      writeLine("--------------------------------------------------------------");
      writeLine(`>>> ${title}`);
      writeLine("--------------------------------------------------------------");
    };

    /* ======================
       LOGO
    ====================== */
    const logoPath = path.join(
      process.cwd(),
      "public",
      "logo",
      "TrackSideGarage.png"
    );

    if (fs.existsSync(logoPath)) {
      const logoBytes = fs.readFileSync(logoPath);
      const png = await pdf.embedPng(logoBytes);
      const scale = png.scale(0.35);

      ensureSpace(scale.height + 20);

      page.drawImage(png, {
        x: width / 2 - scale.width / 2,
        y: y - scale.height,
        width: scale.width,
        height: scale.height,
      });

      y -= scale.height + 20;
    }

    /* ======================
       HEADER
    ====================== */
    writeCenter("TRACKSIDE GARAGE", 20);
    writeCenter("OFFICIAL SERVICE INVOICE", 13);
    writeCenter(`Invoice Date: ${new Date().toLocaleDateString()}`, 10);
    y -= 10;

    /* ======================
       CUSTOMER
    ====================== */
    section("CUSTOMER DETAILS");
    writeLine(`Name : ${appt.customer_name}`);
    writeLine(`Email: ${appt.email}`);
    writeLine(`Phone: ${appt.phone}`);
    y -= 10;

    /* ======================
       VEHICLE
    ====================== */
    section("VEHICLE INFORMATION");
    writeLine(
      `Car   : ${appt.car_make} ${appt.car_model} (${appt.car_year})`
    );
    writeLine(`Plate : ${appt.plate_number}`);
    writeLine(`Fuel  : ${appt.fuel_type || "N/A"}`);
    y -= 10;

    /* ======================
       APPOINTMENT
    ====================== */
    section("APPOINTMENT DETAILS");
    writeLine(`Service    : ${appt.service_type}`);
    writeLine(`Date       : ${appt.appointment_date}`);
    writeLine(`Time       : ${appt.appointment_time}`);
    writeLine(`Status     : ${appt.status}`);
    if (appt.employee_name)
      writeLine(`Technician : ${appt.employee_name}`);
    y -= 10;

    /* ======================
       DESCRIPTION
    ====================== */
    section("DESCRIPTION");
    const desc = appt.description || "No additional notes.";
    let line = "";

    for (const word of desc.split(" ")) {
      if (font.widthOfTextAtSize(line + word, 12) > 450) {
        writeLine(line);
        line = "";
      }
      line += word + " ";
    }
    if (line.trim()) writeLine(line.trim());
    y -= 10;

    /* ======================
       CHARGES
    ====================== */
    section("CHARGES");
    writeLine(`Labor Cost         : $${laborTotal.toFixed(2)}`);
    writeLine(`Service Charge     : $${serviceTotal.toFixed(2)}`);

    if (itemRows.some((i) => i.item_type === "part")) {
      writeLine("");
      writeLine("Parts Used:");

      for (const item of itemRows.filter(
        (i) => i.item_type === "part"
      )) {
        const qty = Number(item.quantity) || 0;
        const unit = Number(item.unit_price) || 0;
        const tot = Number(item.total_price) || 0;

        writeLine(
          `- ${item.description} x${qty} @ $${unit.toFixed(
            2
          )} = $${tot.toFixed(2)}`
        );
      }
    } else {
      writeLine("Parts Used         : None");
    }

    y -= 10;
    writeLine("--------------------------------------------------------------");
    writeLine(`Subtotal           : $${subtotal.toFixed(2)}`);
    writeLine(`GST (5%)           : $${tax.toFixed(2)}`);
    writeLine(`TOTAL              : $${total.toFixed(2)}`);
    y -= 20;

    writeCenter("Thank you for choosing Trackside Garage!", 12);

    /* ======================
       RESPONSE
    ====================== */
    const bytes = await pdf.save();
    const safeName = appt.customer_name
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase();

    return new NextResponse(Buffer.from(bytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=invoice_${safeName}.pdf`,
      },
    });
  } catch (err) {
    console.error("Invoice error:", err);
    return NextResponse.json(
      { error: "Failed to generate invoice" },
      { status: 500 }
    );
  }
}
