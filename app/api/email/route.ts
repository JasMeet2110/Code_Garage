import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(req: Request) {
  try {
    if (!resend) {
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    const {
      customerName,
      email,
      phone,
      service,
      vehicle,
      date,
      issue,
    } = await req.json();

    const adminEmail = "tracksidegarage0101@gmail.com";

    /* ------------------------------------------------
       1️⃣ SEND ADMIN EMAIL
    ------------------------------------------------ */
    await resend.emails.send({
      from: "Trackside Garage <onboarding@resend.dev>",
      to: adminEmail,
      subject: `New Appointment from ${customerName}`,
      html: `
        <h2 style="color:#FF8C00;">New Booking Received</h2>
        <p><b>Name:</b> ${customerName}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Service:</b> ${service}</p>
        <p><b>Vehicle:</b> ${vehicle}</p>
        <p><b>Date:</b> ${date}</p>
        <p><b>Issue:</b> ${issue}</p>
      `,
    });

    /* ------------------------------------------------
       2️⃣ CALENDAR INVITE (.ics)
    ------------------------------------------------ */
    const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z
DTSTART:${date.replace(/-/g, "")}T090000Z
DTEND:${date.replace(/-/g, "")}T100000Z
SUMMARY:Trackside Garage Appointment
DESCRIPTION:${service} - ${issue}
LOCATION:Trackside Garage
END:VEVENT
END:VCALENDAR
`.trim();

    const calendarFile = {
      filename: "Trackside-Appointment.ics",
      content: icsContent,
    };

    /* ------------------------------------------------
       3️⃣ SEND CUSTOMER CONFIRMATION EMAIL
    ------------------------------------------------ */
    await resend.emails.send({
      from: "Trackside Garage <onboarding@resend.dev>",
      to: email,
      bcc: adminEmail, // hidden copy to admin
      subject: "Your Appointment is Confirmed",
      html: `
        <div style="background:#111; padding:20px; border-radius:12px; color:white; font-family:sans-serif;">
          
          <h2 style="color:#FF8C00; text-align:center;">Appointment Confirmed</h2>
          
          <p>Hello <b>${customerName}</b>,</p>
          <p>Thank you for booking with <b>Trackside Garage</b>! Your appointment has been successfully confirmed.</p>

          <div style="margin-top:20px; padding:15px; background:#222; border-radius:10px;">
            <p><b>Service:</b> ${service}</p>
            <p><b>Vehicle:</b> ${vehicle}</p>
            <p><b>Date:</b> ${date}</p>
            <p><b>Issue:</b> ${issue}</p>
          </div>

          <p style="margin-top:20px;">We look forward to serving you.  
          You can add this appointment to your calendar using the attachment.</p>

          <br />
          <p>— Trackside Garage Team</p>
        </div>
      `,
      attachments: [calendarFile],
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Email Error:", error);

    return NextResponse.json(
      { error: (error as any).message || "Unknown error" },
      { status: 500 }
    );
  }
}
