import { NextRequest, NextResponse } from "next/server";
import { answerLocally, buildSystemPrompt, findMentioned, actionsFor } from "@/lib/assistant";
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

  const materials = await getMaterials();

  // Deterministic fallback (always works, no key needed).
  const local = answerLocally(question, materials);
  const linksFor = (ids: string[]) =>
    ids
      .map((id) => {
        const mm = materials.find((m) => m.id === id);
        return mm ? { id: mm.id, name: mm.name } : null;
      })
      .filter((x): x is { id: string; name: string } => x !== null);

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      ...local,
      materialLinks: linksFor(local.materialIds),
      mode: "answer",
    });
  }

  // Ask the LLM, grounded strictly in the user's materials.
  try {
    const baseUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        temperature: 0.3,
        max_tokens: 400,
        messages: [
          { role: "system", content: buildSystemPrompt(materials) },
          { role: "user", content: question },
        ],
      }),
    }).finally(() => clearTimeout(timeout));

    if (!res.ok) throw new Error(`LLM ${res.status}`);
    const data = await res.json();
    const text: string = data?.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error("Empty LLM response");

    // Keep the linked chips + actions consistent with what the AI actually said.
    const mentioned = findMentioned(text, materials);
    const focus = mentioned.find((m) => m.buildingDelayDays > 0) ?? mentioned[0];

    return NextResponse.json({
      answer: text,
      materialIds: mentioned.map((m) => m.id),
      materialLinks: mentioned.map((m) => ({ id: m.id, name: m.name })),
      actions: focus ? actionsFor(focus) : [],
      confidence: 0.9,
      mode: "ai",
    });
  } catch {
    // LLM unavailable or slow — fall back to the reliable engine.
    return NextResponse.json({
      ...local,
      materialLinks: linksFor(local.materialIds),
      mode: "answer",
    });
  }
}
