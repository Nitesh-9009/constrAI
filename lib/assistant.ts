import {
  materials,
  cascadeFor,
  supplierById,
  taskById,
  portfolioStats,
  PROJECT,
} from "./data";
import { Material } from "./types";
import { currency, formatDate } from "./utils";
import {
  simpleOf,
  simpleWord,
  latenessText,
  madeStatus,
  buildingDelayText,
  supplierText,
} from "./plain";

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

function describeMaterial(m: Material): string {
  const sup = supplierById(m.supplierId);
  const tone = simpleOf(m);
  const perDay = m.costOfDelayPerDay;
  return [
    `**${m.name}** — ${madeStatus[m.status].toLowerCase()} by ${sup.name}.`,
    `It should arrive **${formatDate(m.eta.p50)}**, and you need it by **${formatDate(
      m.neededBy
    )}** (${latenessText(m)}).`,
    tone === "late"
      ? `This is **running late**. Every day it is late costs about **${currency(
          perDay
        )}**, and it ${buildingDelayText(m).toLowerCase()}.`
      : tone === "risky"
      ? `This **might be late** — keep an eye on it.`
      : `This one looks **on time**. Nothing to do.`,
  ].join(" ");
}

function actionsFor(m: Material): AssistantAction[] {
  const acts: AssistantAction[] = [];
  const sup = supplierById(m.supplierId);
  if (m.onTimeProbability < 0.6) {
    acts.push({
      id: `escalate-${m.id}`,
      label: `Call ${sup.name}`,
      kind: "escalate",
      detail: `Ask them to hurry up your order and give you a firm delivery date.`,
    });
  }
  if (m.criticalPathSlipDays >= 1) {
    const task = taskById(m.linkedTaskId);
    acts.push({
      id: `reseq-${m.id}`,
      label: `Plan other work first`,
      kind: "resequence",
      detail: `Move "${task.name}" a little later so the crew is not left standing around waiting.`,
    });
  }
  if (m.submittalStatus === "revise_resubmit") {
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
 * Deterministic, domain-grounded responder. Always works with no API key so the
 * demo is reliable. If an LLM key is configured, the API route uses it instead.
 */
export function answerLocally(question: string): AssistantAnswer {
  const q = question.toLowerCase();
  const stats = portfolioStats();

  const ranked = [...materials].sort(
    (a, b) =>
      b.criticalPathSlipDays * b.costOfDelayPerDay -
      a.criticalPathSlipDays * a.costOfDelayPerDay
  );
  const topRisk = ranked[0];

  // What's late / needs attention / what should I do
  if (
    q.includes("block") ||
    q.includes("pour") ||
    q.includes("critical") ||
    q.includes("risk") ||
    q.includes("late") ||
    q.includes("problem") ||
    q.includes("wrong") ||
    q.includes("attention") ||
    q.includes("today") ||
    q.includes("do") ||
    q.includes("worst") ||
    q.includes("fix") ||
    q.includes("help")
  ) {
    // If the question names the pour / level 3, focus on what gates it.
    let focus = topRisk;
    if (q.includes("pour") || q.includes("level 3") || q.includes("l3") || q.includes("slab")) {
      const gating = materials
        .filter((m) => m.linkedTaskId === "t-l3-pour")
        .sort((a, b) => a.onTimeProbability - b.onTimeProbability)[0];
      if (gating) focus = gating;
    }
    const cascade = cascadeFor(focus.id);
    const cascadeText = cascade
      .map((c) => `${c.task.name} (${c.slipDays} day${c.slipDays > 1 ? "s" : ""} later)`)
      .join(", ");
    return {
      answer: [
        `The most important one to fix is: ${describeMaterial(focus)}`,
        cascade.length ? `\n\nIf it stays late, it also holds up: ${cascadeText}.` : "",
        `\n\nRight now **${stats.atRisk} of ${stats.total}** of your materials need attention.`,
      ].join(""),
      materialIds: [focus.id],
      actions: actionsFor(focus),
      confidence: 0.86,
    };
  }

  // Named material lookups (with simple synonyms)
  const synonyms: Record<string, string[]> = {
    "mat-rebar-l3": ["steel", "rebar", "bar", "reinforc"],
    "mat-concrete-l3": ["concrete", "cement", "pour", "mix"],
    "mat-precast-south": ["precast", "panel"],
    "mat-ahu-l4": ["ac", "air", "hvac", "cooling", "handling"],
    "mat-switchgear": ["electric", "switch", "power"],
    "mat-curtain-east": ["glass", "curtain", "window", "facade"],
  };
  const named = materials.find(
    (m) =>
      q.includes(m.poNumber.toLowerCase()) ||
      m.name.toLowerCase().split(" ").some((w) => w.length > 3 && q.includes(w)) ||
      (synonyms[m.id] ?? []).some((w) => q.includes(w))
  );
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
      answer: `**${safe.length}** of your materials are on time: ${safe
        .map((m) => m.name)
        .join(", ")}. Nothing to do for these — we keep watching them for you.`,
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
    const worst = [...materials].sort(
      (a, b) => supplierById(a.supplierId).onTimeRate - supplierById(b.supplierId).onTimeRate
    )[0];
    const sup = supplierById(worst.supplierId);
    return {
      answer: `The supplier that is late most often is **${sup.name}** — ${supplierText(
        sup.onTimeRate
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
      `Here is how things look at ${PROJECT.name}: **${stats.atRisk} of ${stats.total}** materials need attention.`,
      `\n\nThe most important one: ${describeMaterial(topRisk)}`,
      `\n\nYou can ask me things like "what is late?", "what should I do today?", or "which supplier is often late?"`,
    ].join(""),
    materialIds: [topRisk.id],
    actions: actionsFor(topRisk),
    confidence: 0.7,
  };
}

export function buildSystemPrompt(): string {
  const ctx = materials
    .map((m) => {
      const sup = supplierById(m.supplierId);
      return `- ${m.name} | ${m.poNumber} | status ${m.status} ${m.fabricationProgress}% | need ${m.neededBy} | ETA p50 ${m.eta.p50} | on-time ${(m.onTimeProbability * 100).toFixed(0)}% | slip ${m.criticalPathSlipDays}d | $${m.costOfDelayPerDay}/day | supplier ${sup.name} (${(sup.onTimeRate * 100).toFixed(0)}% on-time) | task ${m.linkedTaskId} | ${m.flags?.join("; ") ?? ""}`;
    })
    .join("\n");
  return `You are ConstrAI, a friendly helper for a construction site manager who may not know technical words. The project is "${PROJECT.name}" (${PROJECT.location}). Today is ${PROJECT.today}.
Answer in very simple, short sentences that anyone can understand. Do NOT use technical words, percentages, probabilities, or jargon like "critical path", "submittal", "forecast", or "lead time". Talk about whether a material is on time or running late, when it will arrive, when it is needed, and one clear thing to do. Use ONLY the information below. Never make up materials, suppliers, or dates.

WHAT YOU KNOW (do not repeat the raw data; explain it simply):
${ctx}`;
}
