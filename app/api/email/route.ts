import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const {
      customerName,
      email,
      phone,
      service,
      vehicle,
      date,
      issue,
    } = await req.json();

    console.log("Sending admin email...");
    console.log("RESEND_API_KEY exists:", !!process.env.RESEND_API_KEY);

    const adminEmail = "tracksidegarage0101@gmail.com";

    // SEND ONLY ADMIN EMAIL
    const adminRes = await resend.emails.send({
      from: "Trackside Garage <onboarding@resend.dev>",
      to: adminEmail,
      subject: `New Appointment from ${customerName}`,
      html: `
        <h2>New Booking Received</h2>
        <p><b>Name:</b> ${customerName}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Service:</b> ${service}</p>
        <p><b>Vehicle:</b> ${vehicle}</p>
        <p><b>Date:</b> ${date}</p>
        <p><b>Issue:</b> ${issue}</p>
      `,
    });

    console.log("Admin response:", adminRes);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending admin email:", error);

    return NextResponse.json(
      { error: (error as any).message || "Unknown error" },
      { status: 500 }
    );
  }
}
