import { NextResponse } from "next/server";

/**
 * Example finance API route
 * You can customize later.
 */
export async function GET() {
  return NextResponse.json(
    { message: "Finance API is working" },
    { status: 200 }
  );
}
