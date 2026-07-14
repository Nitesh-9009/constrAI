export type MaterialStatus =
  | "submitted"
  | "approved"
  | "ordered"
  | "fabricating"
  | "in_transit"
  | "delivered";

export type Risk = "high" | "medium" | "low";

export interface TimelineEvent {
  date: string;
  label: string;
  kind: "info" | "warn" | "good" | "action";
  detail?: string;
  source?: string;
}

export interface Supplier {
  id: string;
  name: string;
  location: string;
  reliability: number; // 0..1 on-time history
  avgLeadDays: number;
  onTimeRate: number; // 0..1
}

export interface ScheduleTask {
  id: string;
  name: string;
  start: string;
  end: string;
  floatDays: number; // schedule float / slack
  critical: boolean;
  dependsOn: string[];
  crew: string;
  costPerDay: number; // idle / delay cost per day
}

export interface Material {
  id: string;
  name: string;
  sku: string;
  csiDivision: string;
  poNumber: string;
  qty: number;
  unit: string;
  supplierId: string;
  status: MaterialStatus;
  fabricationProgress: number; // 0..100
  location: string; // grid / floor
  specRef: string;
  submittalStatus: "pending" | "approved" | "revise_resubmit";
  neededBy: string;
  promisedBy: string;
  eta: {
    p10: string; // optimistic
    p50: string; // median
    p90: string; // pessimistic
  };
  onTimeProbability: number; // 0..1
  costOfDelayPerDay: number;
  criticalPathSlipDays: number;
  linkedTaskId: string;
  timeline: TimelineEvent[];
  flags?: string[];
}

export function riskOf(m: Material): Risk {
  if (m.onTimeProbability < 0.55 || m.criticalPathSlipDays >= 3) return "high";
  if (m.onTimeProbability < 0.8 || m.criticalPathSlipDays >= 1) return "medium";
  return "low";
}

export function costOfDelay(m: Material): number {
  return m.criticalPathSlipDays * m.costOfDelayPerDay;
}
