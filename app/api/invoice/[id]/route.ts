import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { PDFDocument, StandardFonts } from "pdf-lib";
import fs from "fs";
import path from "path";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const rows = (await query("SELECT * FROM appointments WHERE id = ?", [id])) as any[];
    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    const appt = rows[0];

    // Create PDF
    const pdf = await PDFDocument.create();

    // Embed fonts
    const font = await pdf.embedFont(StandardFonts.Courier); // retro monospace

    // Add page
    const page = pdf.addPage([595, 842]); // A4
    const { width } = page.getSize();

    let y = 800;

    /* --------------------------------
       LOGO
    --------------------------------- */
    const logoPath = path.join(process.cwd(), "public", "logo", "TrackSideGarage.png");
    if (fs.existsSync(logoPath)) {
      const logoBytes = fs.readFileSync(logoPath);
      const pngImage = await pdf.embedPng(logoBytes);
      const pngDims = pngImage.scale(0.35);

      page.drawImage(pngImage, {
        x: width / 2 - pngDims.width / 2,
        y: y - pngDims.height - 5,
        width: pngDims.width,
        height: pngDims.height,
      });

      y -= pngDims.height + 20;
    }

    /* --------------------------------
       TITLE
    --------------------------------- */
    page.drawText("TRACKSIDE GARAGE", {
      x: width / 2 - 110,
      y,
      size: 20,
      font,
    });
    y -= 25;

    page.drawText("Official Service Invoice", {
      x: width / 2 - 110,
      y,
      size: 13,
      font,
    });
    y -= 30;

    const line = (txt: string) => {
      page.drawText(txt, { x: 50, y, size: 12, font });
      y -= 18;
    };

    const section = (title: string) => {
      line("----------------------------------------------");
      line(`>>> ${title}`);
      line("----------------------------------------------");
    };

    /* --------------------------------
       CUSTOMER DETAILS
    --------------------------------- */
    section("CUSTOMER DETAILS");
    line(`Name:  ${appt.customer_name}`);
    line(`Email: ${appt.email}`);
    line(`Phone: ${appt.phone}`);
    y -= 10;

    /* --------------------------------
       VEHICLE DETAILS
    --------------------------------- */
    section("VEHICLE INFORMATION");
    line(`Car:   ${appt.car_make} ${appt.car_model} (${appt.car_year})`);
    line(`Plate: ${appt.plate_number}`);
    line(`Fuel:  ${appt.fuel_type}`);
    y -= 10;

    /* --------------------------------
       APPOINTMENT DETAILS
    --------------------------------- */
    section("APPOINTMENT DETAILS");
    line(`Service:  ${appt.service_type}`);
    line(`Date:     ${appt.appointment_date}`);
    line(`Time:     ${appt.appointment_time}`);
    line(`Status:   ${appt.status}`);
    y -= 10;

    /* --------------------------------
       DESCRIPTION
    --------------------------------- */
    section("DESCRIPTION");
    line(appt.description || "No additional notes.");
    y -= 10;

    /* --------------------------------
       CHARGES (STATIC FOR NOW)
    --------------------------------- */
    section("CHARGES");
    line(`Service Cost:       $100`);
    line(`Garage Fee:         $20`);
    line(`Tax (GST 5%):       $6`);
    line("----------------------------------");
    line(`TOTAL:              $126`);
    y -= 20;

    page.drawText("Thank you for choosing Trackside Garage!", {
      x: width / 2 - 180,
      y,
      size: 12,
      font,
    });

    const pdfBytes = await pdf.save();

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=invoice_${id}.pdf`,
      },
    });
  } catch (err) {
    console.error("Invoice error:", err);
    return NextResponse.json({ error: "Failed to generate invoice" }, { status: 500 });
  }
}
