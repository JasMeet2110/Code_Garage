import { NextResponse } from "next/server";
import OpenAI from "openai";
import systemPrompt from "./prompt";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message, appointments = [] } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Missing 'message'." },
        { status: 400 }
      );
    }

    // ---- AI CALL ----
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: JSON.stringify({
            adminMessage: message,
            existingAppointments: appointments,
          }),
        },
      ],
    });

    const raw = completion.choices[0].message?.content || "{}";

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      console.error("AI JSON ERROR:", raw);
      parsed = {
        replyText: "Something went wrong.",
        intent: "general",
        missingFields: [],
        appointmentData: null,
        employeeData: null,
        inventoryData: null,
        diagnosis: null,
        recommendedAction: null,
        estimatedCost: null,
        estimatedTime: null,
        emailBody: null,
        scheduling: {
          requestedSlot: null,
          conflict: false,
          availableSlots: [],
        },
      };
    }

    // Ensure schema ALWAYS exists
    return NextResponse.json(
      {
        replyText: parsed.replyText ?? "",
        intent: parsed.intent ?? "general",
        missingFields: parsed.missingFields ?? [],

        appointmentData: parsed.appointmentData ?? null,
        employeeData: parsed.employeeData ?? null,
        inventoryData: parsed.inventoryData ?? null,

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
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("AI Assistant API Error:", error);
    return NextResponse.json(
      {
        replyText: "Server error.",
        intent: "general",
        missingFields: [],
      },
      { status: 500 }
    );
  }
}
