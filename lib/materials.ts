import { Material } from "./types";
import { materials as demoMaterials, suppliers as demoSuppliers, PROJECT } from "./data";
import type { MaterialRow, SupplierRow } from "./database.types";

export type Paperwork = "approved" | "pending" | "revise_resubmit";

export type SupplierVM = {
  id: string;
  name: string;
  location: string | null;
  onTimeRate: number;
  avgLeadDays: number;
};

/** The single shape every screen renders — works for demo data and DB rows. */
export type MaterialVM = {
  id: string;
  name: string;
  unit: string;
  qty: number;
  status: string;
  location: string | null;
  needBy: string | null;
  expectedArrival: string | null;
  onTimeProbability: number;
  costOfDelayPerDay: number;
  buildingDelayDays: number;
  paperwork: Paperwork;
  notes: string | null;
  supplier: SupplierVM | null;
  createdAt?: string;
};

export type OrgInfo = {
  companyName: string;
  projectName: string;
  projectLocation: string;
};

export const DEMO_ORG: OrgInfo = {
  companyName: "Vertex Construction",
  projectName: PROJECT.name,
  projectLocation: PROJECT.location,
};

const asPaperwork = (v: string | null | undefined): Paperwork =>
  v === "pending" || v === "revise_resubmit" ? v : "approved";

/** Map a built-in demo material to the view model. */
export function demoToVM(m: Material): MaterialVM {
  const sup = demoSuppliers.find((s) => s.id === m.supplierId) ?? null;
  return {
    id: m.id,
    name: m.name,
    unit: m.unit,
    qty: m.qty,
    status: m.status,
    location: m.location,
    needBy: m.neededBy,
    expectedArrival: m.eta.p50,
    onTimeProbability: m.onTimeProbability,
    costOfDelayPerDay: m.costOfDelayPerDay,
    buildingDelayDays: m.criticalPathSlipDays,
    paperwork: asPaperwork(m.submittalStatus),
    notes: null,
    supplier: sup
      ? {
          id: sup.id,
          name: sup.name,
          location: sup.location,
          onTimeRate: sup.onTimeRate,
          avgLeadDays: sup.avgLeadDays,
        }
      : null,
  };
}

export function demoVMs(): MaterialVM[] {
  return demoMaterials.map(demoToVM);
}

const supRowToVM = (s: SupplierRow): SupplierVM => ({
  id: s.id,
  name: s.name,
  location: s.location,
  onTimeRate: Number(s.on_time_rate),
  avgLeadDays: Number(s.avg_lead_days),
});

/** Map a database material row (+ its supplier) to the view model. */
export function rowToVM(row: MaterialRow, sup: SupplierRow | null): MaterialVM {
  return {
    id: row.id,
    name: row.name,
    unit: row.unit,
    qty: Number(row.qty),
    status: row.status,
    location: row.location,
    needBy: row.need_by,
    expectedArrival: row.expected_arrival,
    onTimeProbability: Number(row.on_time_probability),
    costOfDelayPerDay: Number(row.cost_of_delay_per_day),
    buildingDelayDays: Number(row.building_delay_days),
    paperwork: asPaperwork(row.paperwork),
    notes: row.notes,
    supplier: sup ? supRowToVM(sup) : null,
    createdAt: row.created_at,
  };
}

export { supRowToVM };
