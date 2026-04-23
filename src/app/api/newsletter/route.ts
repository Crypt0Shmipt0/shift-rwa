import { NextResponse } from "next/server";

export async function POST() {
  // No-op placeholder — wire to a real ESP when ready
  return NextResponse.json({ ok: true }, { status: 200 });
}
