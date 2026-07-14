import type { MaterialVM } from "./materials";
import { daysBetween } from "./utils";

/** Simple 3-state used everywhere in the plain-language UI. */
export type Simple = "late" | "risky" | "good";

/** Map a material to a friendly 3-state — kept consistent with the dates shown. */
export function simpleOf(m: MaterialVM): Simple {
  if (m.needBy && m.expectedArrival) {
    const d = daysBetween(m.needBy, m.expectedArrival); // >0 = arrives after needed
    if (d > 0) return "late";
    if (d === 0) return "risky";
  }
  if (m.onTimeProbability < 0.6) return "risky";
  return "good";
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

/** How many days late (negative = early). 0 if dates aren't set. */
export function daysLate(m: MaterialVM): number {
  if (!m.needBy || !m.expectedArrival) return 0;
  return daysBetween(m.needBy, m.expectedArrival);
}

/** "3 days late" / "2 days early" / "Just in time" / "No date yet". */
export function latenessText(m: MaterialVM): string {
  if (!m.needBy || !m.expectedArrival) return "No date set yet";
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

export function madeStatusText(status: string): string {
  return madeStatus[status] ?? status.replace(/_/g, " ");
}

/** Chance of arriving on time, in words. */
export function chanceText(prob: number): string {
  if (prob >= 0.8) return "Very likely to arrive on time";
  if (prob >= 0.5) return "Might arrive late";
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

/** How much the whole building could be delayed, in words. */
export function buildingDelayText(m: MaterialVM): string {
  const d = m.buildingDelayDays;
  if (d <= 0) return "Won't delay the building";
  return `Could delay the building by ${d} day${d > 1 ? "s" : ""}`;
}

/** One clear thing to do about this order, in plain words. */
export function whatToDo(m: MaterialVM, supplierName: string | null): string | null {
  const who = supplierName ?? "the supplier";
  if (m.paperwork === "revise_resubmit")
    return `Get the papers approved so ${who} can finish making it.`;
  if (m.onTimeProbability < 0.6) return `Call ${who} and ask them to hurry up your order.`;
  if (m.buildingDelayDays >= 1) return `Plan other work first so the crew isn't left waiting.`;
  if (m.status === "in_transit") return `Get the crew and crane ready to unload it.`;
  return null;
}
