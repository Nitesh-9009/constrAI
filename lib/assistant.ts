import { currency, formatDate } from "./utils";
import {
  simpleOf,
  simpleWord,
  latenessText,
  madeStatusText,
  buildingDelayText,
  supplierText,
} from "./plain";
import type { MaterialVM } from "./materials";

export interface AssistantAction {
  id: string;
  label: string;
  kind: "escalate" | "resequence" | "reorder" | "flag";
  detail: string;
}

export interface AssistantAnswer {
  answer: string;
  materialIds: string[];
  actions: AssistantAction[];
  confidence: number;
}

function describeMaterial(m: MaterialVM): string {
  const tone = simpleOf(m);
  const who = m.supplier?.name ?? "the supplier";
  return [
    `**${m.name}** — ${madeStatusText(m.status).toLowerCase()} by ${who}.`,
    m.needBy && m.expectedArrival
      ? `It should arrive **${formatDate(m.expectedArrival)}**, and you need it by **${formatDate(
          m.needBy
        )}** (${latenessText(m)}).`
      : `The dates for this one are not set yet.`,
    tone === "late"
      ? `This is **running late**. Every day it is late costs about **${currency(
          m.costOfDelayPerDay
        )}**, and it ${buildingDelayText(m).toLowerCase()}.`
      : tone === "risky"
      ? `This **might be late** — keep an eye on it.`
      : `This one looks **on time**. Nothing to do.`,
  ].join(" ");
}

export function actionsFor(m: MaterialVM): AssistantAction[] {
  const acts: AssistantAction[] = [];
  const who = m.supplier?.name ?? "the supplier";
  if (m.onTimeProbability < 0.6) {
    acts.push({
      id: `escalate-${m.id}`,
      label: `Call ${who}`,
      kind: "escalate",
      detail: `Ask them to hurry up your order and give you a firm delivery date.`,
    });
  }
  if (m.buildingDelayDays >= 1) {
    acts.push({
      id: `reseq-${m.id}`,
      label: `Plan other work first`,
      kind: "resequence",
      detail: `Do other work first so the crew is not left standing around waiting.`,
    });
  }
  if (m.paperwork === "revise_resubmit") {
    acts.push({
      id: `flag-${m.id}`,
      label: `Get the papers approved`,
      kind: "flag",
      detail: `The order cannot be finished until the paperwork is approved. Push to get it signed off.`,
    });
  }
  return acts;
}

/**
 * Deterministic, plain-language responder. Works entirely on the caller's
 * materials — no API key, always consistent.
 */
export function answerLocally(question: string, materials: MaterialVM[]): AssistantAnswer {
  const q = question.toLowerCase();

  if (materials.length === 0) {
    return {
      answer:
        "You don't have any materials yet. Add your first order and I'll help you keep track of it.",
      materialIds: [],
      actions: [],
      confidence: 0.6,
    };
  }

  const ranked = [...materials].sort(
    (a, b) => b.buildingDelayDays * b.costOfDelayPerDay - a.buildingDelayDays * a.costOfDelayPerDay
  );
  const attention = ranked.filter((m) => simpleOf(m) !== "good");
  const topRisk = ranked[0];

  // What's late / needs attention / what should I do
  if (
    q.includes("block") ||
    q.includes("late") ||
    q.includes("risk") ||
    q.includes("problem") ||
    q.includes("wrong") ||
    q.includes("attention") ||
    q.includes("today") ||
    q.includes("do") ||
    q.includes("worst") ||
    q.includes("fix") ||
    q.includes("help")
  ) {
    const focus = attention[0] ?? topRisk;
    return {
      answer: [
        `The most important one to fix is: ${describeMaterial(focus)}`,
        `\n\nRight now **${attention.length} of ${materials.length}** of your materials need attention.`,
      ].join(""),
      materialIds: [focus.id],
      actions: actionsFor(focus),
      confidence: 0.86,
    };
  }

  // Named material lookup (by words in the name + a few common synonyms)
  const named = materials.find((m) => {
    const name = m.name.toLowerCase();
    return (
      name.split(/\s+/).some((w) => w.length > 3 && q.includes(w)) ||
      (q.includes("steel") && (name.includes("rebar") || name.includes("steel"))) ||
      (q.includes("concrete") && name.includes("concrete")) ||
      (q.includes("glass") && name.includes("curtain")) ||
      (q.includes("ac") && name.includes("air")) ||
      (q.includes("electric") && name.includes("switch"))
    );
  });
  if (named) {
    return {
      answer: describeMaterial(named),
      materialIds: [named.id],
      actions: actionsFor(named),
      confidence: 0.8,
    };
  }

  // On time / all good
  if (
    q.includes("on time") ||
    q.includes("on track") ||
    q.includes("delivered") ||
    q.includes("arrived") ||
    q.includes("good") ||
    q.includes("safe") ||
    q.includes("fine") ||
    q.includes("okay") ||
    q.includes("ok")
  ) {
    const safe = materials.filter((m) => simpleOf(m) === "good");
    return {
      answer: safe.length
        ? `**${safe.length}** of your materials are on time: ${safe
            .map((m) => m.name)
            .join(", ")}. Nothing to do for these — we keep watching them for you.`
        : "None are fully on time right now. Check the ones that need attention.",
      materialIds: safe.map((m) => m.id),
      actions: [],
      confidence: 0.75,
    };
  }

  // Supplier questions
  if (
    q.includes("supplier") ||
    q.includes("vendor") ||
    q.includes("company") ||
    q.includes("who")
  ) {
    const withSup = materials.filter((m) => m.supplier);
    const worst = [...withSup].sort(
      (a, b) => (a.supplier?.onTimeRate ?? 1) - (b.supplier?.onTimeRate ?? 1)
    )[0];
    if (!worst || !worst.supplier) {
      return {
        answer: "You haven't added any suppliers yet.",
        materialIds: [],
        actions: [],
        confidence: 0.6,
      };
    }
    return {
      answer: `The supplier that is late most often is **${worst.supplier.name}** — ${supplierText(
        worst.supplier.onTimeRate
      ).toLowerCase()}. They are making **${worst.name}**, which is ${simpleWord[
        simpleOf(worst)
      ].toLowerCase()}. It may help to call them and check on your order.`,
      materialIds: [worst.id],
      actions: actionsFor(worst),
      confidence: 0.78,
    };
  }

  // Default summary
  return {
    answer: [
      `Here is how things look: **${attention.length} of ${materials.length}** materials need attention.`,
      `\n\nThe most important one: ${describeMaterial(topRisk)}`,
      `\n\nYou can ask me things like "what is late?", "what should I do today?", or "which supplier is often late?"`,
    ].join(""),
    materialIds: [topRisk.id],
    actions: actionsFor(topRisk),
    confidence: 0.7,
  };
}

/**
 * Builds a plain-language, grounded system prompt for the LLM. The model must
 * answer ONLY from this data, in simple words.
 */
export function buildSystemPrompt(materials: MaterialVM[]): string {
  const today = new Date().toISOString().slice(0, 10);
  const lines = materials
    .map((m) => {
      const tone = simpleOf(m);
      const state =
        tone === "late" ? "RUNNING LATE" : tone === "risky" ? "might be late" : "on time";
      const need = m.needBy ? formatDate(m.needBy) : "no date set";
      const arrive = m.expectedArrival ? formatDate(m.expectedArrival) : "no date set";
      const sup = m.supplier
        ? `${m.supplier.name} (${supplierText(m.supplier.onTimeRate).toLowerCase()})`
        : "no supplier set";
      const paper =
        m.paperwork === "revise_resubmit"
          ? "papers NOT approved (work is stuck)"
          : m.paperwork === "pending"
          ? "papers waiting for approval"
          : "papers approved";
      return `- ${m.name}${m.projectName ? ` [project: ${m.projectName}]` : ""}: ${madeStatusText(
        m.status
      ).toLowerCase()}; needed by ${need}; should arrive ${arrive} (${latenessText(
        m
      )}); ${state}; made by ${sup}; ${paper}; every day late costs about ${currency(
        m.costOfDelayPerDay
      )}${m.notes ? `; note: ${m.notes}` : ""}.`;
    })
    .join("\n");

  return `You are ConstrAI, a friendly helper for a construction site manager who may have had little schooling. Today is ${today}.
Rules:
- Use very short, simple sentences and everyday words. No technical terms, no percentages, no jargon.
- Answer ONLY using the material list below. If the answer is not there, say you don't have that information.
- Never invent materials, suppliers, dates, or numbers.
- If something is late or has a problem, tell them ONE clear thing to do (like "call the supplier" or "do other work first").
- Keep answers to 1-3 short sentences.

THE MATERIALS (${materials.length}):
${lines || "No materials have been added yet."}`;
}

/** Materials whose name is clearly referenced in a piece of text. */
export function findMentioned(text: string, materials: MaterialVM[]): MaterialVM[] {
  const t = text.toLowerCase();
  // Generic construction words that would over-match if used alone.
  const stop = new Set([
    "units",
    "level",
    "slab",
    "panel",
    "panels",
    "order",
    "orders",
    "material",
    "materials",
    "system",
    "systems",
    "elevation",
    "east",
    "west",
    "north",
    "south",
    "face",
  ]);
  return materials.filter((m) => {
    const shortName = m.name.split("—")[0].trim().toLowerCase();
    if (shortName.length > 3 && t.includes(shortName)) return true;
    // fall back to distinctive words in the name (skip generic ones)
    return m.name
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .some((w) => w.length > 4 && !stop.has(w) && t.includes(w));
  });
}
