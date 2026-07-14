import { NextRequest, NextResponse } from "next/server";
import { answerLocally, buildSystemPrompt } from "@/lib/assistant";

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

  const local = answerLocally(question);

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    // Deterministic, grounded fallback — always works for the demo.
    return NextResponse.json({ ...local, mode: "deterministic" });
  }

  try {
    const baseUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        max_tokens: 320,
        messages: [
          { role: "system", content: buildSystemPrompt() },
          { role: "user", content: question },
        ],
      }),
    });
    if (!res.ok) throw new Error(`LLM ${res.status}`);
    const data = await res.json();
    const text: string = data?.choices?.[0]?.message?.content?.trim() || local.answer;
    return NextResponse.json({
      ...local,
      answer: text,
      mode: "llm",
    });
  } catch {
    // Graceful degradation to deterministic answer.
    return NextResponse.json({ ...local, mode: "deterministic" });
  }
}
