import { Material, riskOf } from "./types";
import { daysBetween } from "./utils";

/** Simple 3-state used everywhere in the plain-language UI. */
export type Simple = "late" | "risky" | "good";

/** Map the internal risk to a friendly 3-state. */
export function simpleOf(m: Material): Simple {
  const r = riskOf(m);
  return r === "high" ? "late" : r === "medium" ? "risky" : "good";
}

export const simpleWord: Record<Simple, string> = {
  late: "Running late",
  risky: "Might be late",
  good: "On time",
};

export const simpleHint: Record<Simple, string> = {
  late: "Do something now",
  risky: "Keep an eye on this",
  good: "Nothing to do",
};

/** How many days late (negative = early). Uses the expected arrival date. */
export function daysLate(m: Material): number {
  return daysBetween(m.neededBy, m.eta.p50);
}

/** "3 days late" / "2 days early" / "Just in time". */
export function latenessText(m: Material): string {
  const d = daysLate(m);
  if (d > 0) return `${d} day${d > 1 ? "s" : ""} late`;
  if (d < 0) return `${-d} day${-d > 1 ? "s" : ""} early`;
  return "Just in time";
}

/** Where the order is right now, in plain words. */
export const madeStatus: Record<string, string> = {
  submitted: "Order sent",
  approved: "Order approved",
  ordered: "Order placed",
  fabricating: "Being made",
  in_transit: "On the way",
  delivered: "Arrived",
};

/** Chance of arriving on time, in words. */
export function chanceText(m: Material): string {
  if (m.onTimeProbability >= 0.8) return "Very likely to arrive on time";
  if (m.onTimeProbability >= 0.5) return "Might arrive late";
  return "Very likely to arrive late";
}

/** How trustworthy a supplier is, in words. */
export function supplierText(rate: number): string {
  if (rate >= 0.85) return "Usually on time";
  if (rate >= 0.65) return "Sometimes late";
  return "Often late";
}

export function supplierTone(rate: number): Simple {
  if (rate >= 0.85) return "good";
  if (rate >= 0.65) return "risky";
  return "late";
}

/** Paperwork status in plain words. */
export const paperStatus: Record<string, { label: string; tone: Simple }> = {
  approved: { label: "Papers approved", tone: "good" },
  pending: { label: "Waiting for approval", tone: "risky" },
  revise_resubmit: { label: "Papers not approved — work is stuck", tone: "late" },
};

/** Money lost for each day this order is late (rounded, friendly). */
export function moneyPerDay(m: Material): number {
  return m.costOfDelayPerDay;
}

/** How much the whole building could be delayed, in words. */
export function buildingDelayText(m: Material): string {
  const d = m.criticalPathSlipDays;
  if (d <= 0) return "Won't delay the building";
  return `Could delay the building by ${d} day${d > 1 ? "s" : ""}`;
}

/** One clear thing to do about this order, in plain words. */
export function whatToDo(m: Material, supplierName: string): string | null {
  if (m.submittalStatus === "revise_resubmit")
    return `Get the papers approved so ${supplierName} can finish making it.`;
  if (m.onTimeProbability < 0.6)
    return `Call ${supplierName} and ask them to hurry up your order.`;
  if (m.criticalPathSlipDays >= 1)
    return `Plan other work first so the crew isn't left waiting.`;
  if (m.status === "in_transit") return `Get the crew and crane ready to unload it.`;
  return null;
}
