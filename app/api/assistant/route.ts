import { NextRequest, NextResponse } from "next/server";
import { answerLocally } from "@/lib/assistant";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let question = "";
  try {
    const body = await req.json();
    question = (body?.question ?? "").toString().slice(0, 500);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!question.trim()) {
    return NextResponse.json({ error: "Empty question" }, { status: 400 });
  }

  // Deterministic, plain-language engine. Always works with no API key, gives
  // fast, consistent answers whose text always matches the linked materials
  // and actions. This is what real customers rely on.
  const answer = answerLocally(question);
  return NextResponse.json({ ...answer, mode: "answer" });
}
