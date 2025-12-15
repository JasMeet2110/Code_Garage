import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "tracksidegarage0101@gmail.com";
const BUSINESS_PHONE =
  process.env.BUSINESS_PHONE || "+1 (403) 123-4567";

export async function POST(req: Request) {
  try {
    if (!resend) {
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    const { fullName, email, phone, subject, message } = await req.json();

    if (!fullName || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // send both admin notification + customer confirmation
    await Promise.all([
      // Admin email
      resend.emails.send({
        from: "Trackside Garage <no-reply@tracksidegarage.ca>",
        to: ADMIN_EMAIL,
        subject: `New Contact Inquiry — ${subject}`,
        html: `
          <h2>New Contact Inquiry</h2>
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone ? phone : "Not provided"}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong><br>${message}</p>
        `,
      }),

      // Customer confirmation email
      resend.emails.send({
        from: "Trackside Garage <no-reply@tracksidegarage.ca>",
        to: email,
        subject: "We received your message – Trackside Garage",
        html: `
          <p>Hi ${fullName},</p>
          <p>Thanks for reaching out to <strong>Trackside Garage</strong>.</p>
          <p>We’ve received your message and will get back to you as soon as possible.</p>
          <p><strong>Your message:</strong></p>
          <p>${message.replace(/\n/g, "<br/>")}</p>
          <p>If this is urgent, you can call us at ${BUSINESS_PHONE}.</p>
          <p>Best regards,<br/>Trackside Garage</p>
        `,
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("CONTACT EMAIL ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Failed to send email" },
      { status: 500 }
    );
  }
}
