import {
  materials,
  cascadeFor,
  supplierById,
  taskById,
  portfolioStats,
  PROJECT,
} from "./data";
import { Material, riskOf } from "./types";
import { currency, formatDate, pct } from "./utils";

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
  const risk = riskOf(m);
  const cod = m.criticalPathSlipDays * m.costOfDelayPerDay;
  return [
    `**${m.name}** (${m.poNumber}) — ${m.status.replace("_", " ")}, ${m.fabricationProgress}% fabricated.`,
    `On-time probability **${pct(m.onTimeProbability)}**; forecast p50 **${formatDate(
      m.eta.p50
    )}** vs need **${formatDate(m.neededBy)}**.`,
    risk === "high"
      ? `Risk **HIGH** — ${m.criticalPathSlipDays}-day critical-path slip (${currency(
          cod
        )} exposure). Supplier ${sup.name} runs ${pct(sup.onTimeRate)} on-time.`
      : `Risk ${risk.toUpperCase()}.`,
  ].join(" ");
}

function actionsFor(m: Material): AssistantAction[] {
  const acts: AssistantAction[] = [];
  const sup = supplierById(m.supplierId);
  if (m.onTimeProbability < 0.6) {
    acts.push({
      id: `escalate-${m.id}`,
      label: `Draft escalation to ${sup.name}`,
      kind: "escalate",
      detail: `Chase ${m.poNumber} — request firm ship date and expedite ${m.name}.`,
    });
  }
  if (m.criticalPathSlipDays >= 1) {
    const task = taskById(m.linkedTaskId);
    acts.push({
      id: `reseq-${m.id}`,
      label: `Propose re-sequence of "${task.name}"`,
      kind: "resequence",
      detail: `Shift ${task.name} by ${m.criticalPathSlipDays} day(s) or resequence non-dependent work to protect the critical path.`,
    });
  }
  if (m.submittalStatus === "revise_resubmit") {
    acts.push({
      id: `flag-${m.id}`,
      label: `Flag submittal blocker`,
      kind: "flag",
      detail: `${m.name} fabrication is gated by a revise/resubmit — escalate the submittal turnaround.`,
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

  // Blocking / pour / critical path
  if (
    q.includes("block") ||
    q.includes("pour") ||
    q.includes("critical") ||
    q.includes("at risk") ||
    q.includes("risk this week")
  ) {
    // If the question names a specific task/area (e.g. "the pour", "level 3"),
    // surface the riskiest material gating that task; otherwise the global top risk.
    let focus = topRisk;
    if (q.includes("pour") || q.includes("level 3") || q.includes("l3") || q.includes("slab")) {
      const gating = materials
        .filter((m) => m.linkedTaskId === "t-l3-pour")
        .sort((a, b) => a.onTimeProbability - b.onTimeProbability)[0];
      if (gating) focus = gating;
    }
    const cascade = cascadeFor(focus.id);
    const cascadeText = cascade
      .map((c) => `${c.task.name} (+${c.slipDays}d)`)
      .join(" → ");
    return {
      answer: [
        `The biggest blocker is ${describeMaterial(focus)}`,
        cascade.length
          ? `\n\n**Cascade:** ${cascadeText}. Left unmanaged this puts **${currency(
              focus.criticalPathSlipDays * focus.costOfDelayPerDay
            )}** of critical-path exposure at stake.`
          : "",
        `\n\nAcross the project: **${stats.atRisk}/${stats.total}** materials at risk, **${currency(
          stats.totalExposure
        )}** total delay exposure.`,
      ].join(""),
      materialIds: [focus.id],
      actions: actionsFor(focus),
      confidence: 0.86,
    };
  }

  // Named material lookups
  const named = materials.find(
    (m) =>
      q.includes(m.poNumber.toLowerCase()) ||
      m.name.toLowerCase().split(" ").some((w) => w.length > 3 && q.includes(w))
  );
  if (named) {
    return {
      answer: describeMaterial(named),
      materialIds: [named.id],
      actions: actionsFor(named),
      confidence: 0.8,
    };
  }

  // Delivered / on-track
  if (q.includes("on track") || q.includes("delivered") || q.includes("good") || q.includes("safe")) {
    const safe = materials.filter((m) => riskOf(m) === "low");
    return {
      answer: `**${safe.length}** materials are on track: ${safe
        .map((m) => m.name)
        .join(", ")}. No action needed — Kayakalp is monitoring their ETAs continuously.`,
      materialIds: safe.map((m) => m.id),
      actions: [],
      confidence: 0.75,
    };
  }

  // Supplier questions
  if (q.includes("supplier") || q.includes("vendor")) {
    const worst = [...materials].sort(
      (a, b) => supplierById(a.supplierId).onTimeRate - supplierById(b.supplierId).onTimeRate
    )[0];
    const sup = supplierById(worst.supplierId);
    return {
      answer: `Weakest supplier on the project is **${sup.name}** (${pct(
        sup.onTimeRate
      )} on-time, ${sup.avgLeadDays}-day avg lead). They hold ${worst.name} (${worst.poNumber}), currently ${pct(
        worst.onTimeProbability
      )} likely on time.`,
      materialIds: [worst.id],
      actions: actionsFor(worst),
      confidence: 0.78,
    };
  }

  // Default portfolio summary
  return {
    answer: [
      `Here's the ${PROJECT.name} material picture: **${stats.atRisk}** of **${stats.total}** materials at risk, **${stats.critical}** critical, **${currency(
        stats.totalExposure
      )}** total delay exposure.`,
      `\n\nTop concern: ${describeMaterial(topRisk)}`,
      `\n\nAsk me "what's blocking the pour?", about a PO number, or "which supplier is weakest?"`,
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
  return `You are Kayakalp, a predictive material control tower for the construction project "${PROJECT.name}" (${PROJECT.location}). Today is ${PROJECT.today}.
Answer procurement/schedule questions concisely and specifically using ONLY the material data below. Always ground answers in PO numbers, dates, on-time probabilities, and critical-path slip. When a material threatens the schedule, recommend a concrete action (draft escalation, re-sequence a task, reorder, or flag a submittal). Never invent materials, suppliers, or dates not present here.

MATERIAL DATA:
${ctx}`;
}
