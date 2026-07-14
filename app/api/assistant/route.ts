import { NextRequest, NextResponse } from "next/server";
import { answerLocally } from "@/lib/assistant";
import { getMaterials } from "@/lib/queries";

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

  // Deterministic, plain-language engine over the user's own materials.
  // Fast, consistent, works with no external AI key.
  const materials = await getMaterials();
  const answer = answerLocally(question, materials);
  return NextResponse.json({ ...answer, mode: "answer" });
}
