import { NextResponse } from "next/server";
import OpenAI from "openai";
import systemPrompt from "./prompt";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

/**
 * We store short-term memory inside the request body:
 * The frontend sends: { message, history }
 *
 * history = [{ role:"user"/"assistant", content:"..." }]
 *
 * This keeps context so the AI doesn’t forget previous fields.
 */
export async function POST(req: Request) {
  try {
    const { message, history = [], appointments = [] } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Missing 'message'." },
        { status: 400 }
      );
    }

    // Prepare full conversation for OpenAI
    const messages: any[] = [
      { role: "system", content: systemPrompt },
      ...history.map((m: any) => ({
        role: m.role,
        content: typeof m.content === "string" ? m.content : JSON.stringify(m.content),
      })),
      {
        role: "user",
        content: JSON.stringify({
          adminMessage: message,
          existingAppointments: appointments,
        }),
      },
    ];

    // ---- AI CALL ----
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages,
    });

    const raw = completion.choices[0].message?.content || "{}";

    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      console.error("AI JSON ERROR:", raw);
      parsed = {};
    }

    // Ensure schema ALWAYS exists
    const safe = {
      replyText: parsed.replyText ?? "I couldn't fully understand that.",
      intent: parsed.intent ?? "general",
      operation: parsed.operation ?? "none",
      missingFields: parsed.missingFields ?? [],

      appointmentData: parsed.appointmentData ?? null,
      employeeData: parsed.employeeData ?? null,
      inventoryData: parsed.inventoryData ?? null,
      customerData: parsed.customerData ?? null,

      diagnosis: parsed.diagnosis ?? null,
      recommendedAction: parsed.recommendedAction ?? null,
      estimatedCost: parsed.estimatedCost ?? null,
      estimatedTime: parsed.estimatedTime ?? null,
      emailBody: parsed.emailBody ?? null,

      scheduling: {
        requestedSlot: parsed.scheduling?.requestedSlot ?? null,
        conflict: parsed.scheduling?.conflict ?? false,
        availableSlots: parsed.scheduling?.availableSlots ?? [],
      },
    };

    return NextResponse.json(safe, { status: 200 });
  } catch (error) {
    console.error("AI Assistant API Error:", error);
    return NextResponse.json(
      {
        replyText: "Server error.",
        intent: "general",
        operation: "none",
        missingFields: [],
      },
      { status: 500 }
    );
  }
}
