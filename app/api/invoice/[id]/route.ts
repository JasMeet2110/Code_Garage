import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { PDFDocument, StandardFonts } from "pdf-lib";
import fs from "fs";
import path from "path";

export async function GET(req: Request, context: any) {
  try {
    const { id } = context.params;

    const rows = (await query(
      `SELECT a.*, e.name AS employee_name
       FROM appointments a
       LEFT JOIN employees e ON e.id = a.assigned_employee_id
       WHERE a.id = ?`,
      [id]
    )) as any[];

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    const appt = rows[0];

    const itemRows = (await query(
      `SELECT * FROM appointment_items
       WHERE appointment_id = ?
       ORDER BY item_type DESC, id ASC`,
      [id]
    )) as any[];

    let laborTotal = 0;
    let partsTotal = 0;
    let serviceTotal = 0;

    for (const i of itemRows) {
      const total = Number(i.total_price) || 0;
      if (i.item_type === "labor") laborTotal += total;
      if (i.item_type === "part") partsTotal += total;
      if (i.item_type === "service") serviceTotal += total;
    }

    if (laborTotal === 0 && appt.labor_cost != null) {
      laborTotal = Number(appt.labor_cost) || 0;
    }

    const subtotal = laborTotal + partsTotal + serviceTotal;
    const tax = Number((subtotal * 0.05).toFixed(2));
    const total = subtotal + tax;

    const pdf = await PDFDocument.create();
    const font = await pdf.embedFont(StandardFonts.Courier);

    let page = pdf.addPage([595, 842]); // A4
    let { width } = page.getSize();
    let y = 800;

    const ensureSpace = (amount: number = 30) => {
      if (y - amount < 50) {
        page = pdf.addPage([595, 842]);
        y = 800;
      }
    };

    const writeLine = (text: string, size: number = 12) => {
      ensureSpace(20);
      page.drawText(text, { x: 50, y, size, font });
      y -= 18;
    };

    const writeCenter = (text: string, size: number = 12) => {
      ensureSpace(size + 15);
      const textWidth = font.widthOfTextAtSize(text, size);
      const x = (width - textWidth) / 2;
      page.drawText(text, { x, y, size, font });
      y -= size + 5;
    };

    const section = (title: string) => {
      writeLine("--------------------------------------------------------------");
      writeLine(`>>> ${title}`);
      writeLine("--------------------------------------------------------------");
    };

    const logoPath = path.join(process.cwd(), "public", "logo", "TrackSideGarage.png");

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

    writeCenter("TRACKSIDE GARAGE", 20);
    writeCenter("OFFICIAL SERVICE INVOICE", 13);
    y -= 10;

    section("CUSTOMER DETAILS");
    writeLine(`Name : ${appt.customer_name}`);
    writeLine(`Email: ${appt.email}`);
    writeLine(`Phone: ${appt.phone}`);
    y -= 10;

    section("VEHICLE INFORMATION");
    writeLine(`Car   : ${appt.car_make} ${appt.car_model} (${appt.car_year})`);
    writeLine(`Plate : ${appt.plate_number}`);
    writeLine(`Fuel  : ${appt.fuel_type || "N/A"}`);
    y -= 10;

    section("APPOINTMENT DETAILS");
    writeLine(`Service    : ${appt.service_type}`);
    writeLine(`Date       : ${appt.appointment_date}`);
    writeLine(`Time       : ${appt.appointment_time}`);
    writeLine(`Status     : ${appt.status}`);
    if (appt.employee_name) writeLine(`Technician : ${appt.employee_name}`);
    y -= 10;

    section("DESCRIPTION");

    const desc = appt.description || "No additional notes.";
    const words = desc.split(" ");

    let currentLine = "";
    for (const w of words) {
      if (font.widthOfTextAtSize(currentLine + w, 12) > 450) {
        writeLine(currentLine);
        currentLine = "";
      }
      currentLine += w + " ";
    }
    if (currentLine.trim()) writeLine(currentLine.trim());

    y -= 10;

    section("CHARGES");

    writeLine(`Labor Cost         : $${laborTotal.toFixed(2)}`);

    if (serviceTotal > 0) {
      writeLine(`Service Charge     : $${serviceTotal.toFixed(2)}`);
    } else {
      writeLine("Service Charge     : $0.00");
    }

    if (itemRows.some((i) => i.item_type === "part")) {
      writeLine("");
      writeLine("Parts Used:");

      for (const item of itemRows.filter((i) => i.item_type === "part")) {
        ensureSpace(25);

        const qty = Number(item.quantity) || 0;
        const unit = Number(item.unit_price) || 0;
        const tot = Number(item.total_price) || 0;

        writeLine(
          `- ${item.description} x${qty} @ $${unit.toFixed(2)} = $${tot.toFixed(2)}`
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
