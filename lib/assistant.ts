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

function actionsFor(m: MaterialVM): AssistantAction[] {
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
