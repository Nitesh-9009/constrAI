import { Material, ScheduleTask, Supplier } from "./types";

export const PROJECT = {
  name: "Meridian Tower — Phase 2",
  code: "MTR-P2",
  location: "Austin, TX",
  gc: "ConstrAI Demo — Vertex Construction",
  today: "2026-07-11",
};

export const suppliers: Supplier[] = [
  {
    id: "sup-atlas",
    name: "Atlas Rebar & Steel",
    location: "San Antonio, TX",
    reliability: 0.62,
    avgLeadDays: 21,
    onTimeRate: 0.64,
  },
  {
    id: "sup-precise",
    name: "Precise Precast Co.",
    location: "Houston, TX",
    reliability: 0.71,
    avgLeadDays: 34,
    onTimeRate: 0.7,
  },
  {
    id: "sup-nordic",
    name: "Nordic HVAC Systems",
    location: "Dallas, TX",
    reliability: 0.83,
    avgLeadDays: 45,
    onTimeRate: 0.86,
  },
  {
    id: "sup-lumen",
    name: "Lumen Electrical Supply",
    location: "Austin, TX",
    reliability: 0.9,
    avgLeadDays: 12,
    onTimeRate: 0.92,
  },
  {
    id: "sup-vitro",
    name: "Vitro Curtainwall",
    location: "Monterrey, MX",
    reliability: 0.58,
    avgLeadDays: 60,
    onTimeRate: 0.55,
  },
  {
    id: "sup-terra",
    name: "TerraMix Concrete",
    location: "Austin, TX",
    reliability: 0.94,
    avgLeadDays: 3,
    onTimeRate: 0.95,
  },
];

export const tasks: ScheduleTask[] = [
  {
    id: "t-found",
    name: "Foundation & Grade Beams",
    start: "2026-06-15",
    end: "2026-07-05",
    floatDays: 0,
    critical: true,
    dependsOn: [],
    crew: "Concrete Crew A",
    costPerDay: 18500,
  },
  {
    id: "t-l3-pour",
    name: "Level 3 Slab Pour",
    start: "2026-07-11",
    end: "2026-07-15",
    floatDays: 0,
    critical: true,
    dependsOn: ["t-found"],
    crew: "Concrete Crew A",
    costPerDay: 22000,
  },
  {
    id: "t-steel-erect",
    name: "Structural Steel Erection L4-L6",
    start: "2026-07-16",
    end: "2026-07-30",
    floatDays: 0,
    critical: true,
    dependsOn: ["t-l3-pour"],
    crew: "Ironworkers",
    costPerDay: 31000,
  },
  {
    id: "t-precast",
    name: "Precast Panel Install — South Face",
    start: "2026-07-22",
    end: "2026-08-05",
    floatDays: 2,
    critical: false,
    dependsOn: ["t-steel-erect"],
    crew: "Erection Crew B",
    costPerDay: 16000,
  },
  {
    id: "t-mep",
    name: "MEP Rough-In L3-L4",
    start: "2026-07-20",
    end: "2026-08-12",
    floatDays: 1,
    critical: true,
    dependsOn: ["t-l3-pour"],
    crew: "Mechanical + Electrical",
    costPerDay: 24500,
  },
  {
    id: "t-curtain",
    name: "Curtainwall — East Elevation",
    start: "2026-08-03",
    end: "2026-08-24",
    floatDays: 0,
    critical: true,
    dependsOn: ["t-steel-erect"],
    crew: "Glazing Crew",
    costPerDay: 27000,
  },
];

export const materials: Material[] = [
  {
    id: "mat-rebar-l3",
    name: "#8 Rebar — Level 3 Slab",
    sku: "RB-8-A615-G60",
    csiDivision: "03 20 00 — Concrete Reinforcing",
    poNumber: "PO-4471",
    qty: 18.4,
    unit: "tons",
    supplierId: "sup-atlas",
    status: "fabricating",
    fabricationProgress: 60,
    location: "Grid B3–D6, Level 3",
    specRef: "S-204 / ASTM A615 Gr.60",
    submittalStatus: "approved",
    neededBy: "2026-07-11",
    promisedBy: "2026-07-10",
    eta: { p10: "2026-07-12", p50: "2026-07-14", p90: "2026-07-17" },
    onTimeProbability: 0.22,
    costOfDelayPerDay: 22000,
    criticalPathSlipDays: 4,
    linkedTaskId: "t-l3-pour",
    flags: ["Blocks critical path", "Supplier below 65% on-time"],
    timeline: [
      { date: "2026-06-19", label: "Submittal approved", kind: "good", source: "Submittal log" },
      { date: "2026-06-20", label: "PO-4471 issued to Atlas Rebar", kind: "info", source: "Procurement" },
      { date: "2026-07-02", label: "Fabrication started", kind: "info", source: "Supplier email" },
      {
        date: "2026-07-09",
        label: "Photo: 60% fabricated, 2 bundles mis-tagged",
        kind: "warn",
        detail: "VLM read fab-shop photo — 11 of 18.4 tons bent & tagged; 2 bundles show wrong bar mark vs S-204.",
        source: "Site photo · Qwen2.5-VL",
      },
      {
        date: "2026-07-10",
        label: "ETA slipped past need date",
        kind: "warn",
        detail: "Forecast p50 = Jul 14 vs need Jul 11. On-time probability 22%.",
        source: "ETA engine",
      },
    ],
  },
  {
    id: "mat-precast-south",
    name: "Precast Panels — South Face (24 units)",
    sku: "PC-SF-2400",
    csiDivision: "03 45 00 — Precast Architectural Concrete",
    poNumber: "PO-4390",
    qty: 24,
    unit: "panels",
    supplierId: "sup-precise",
    status: "fabricating",
    fabricationProgress: 45,
    location: "South elevation, L2–L5",
    specRef: "A-501 / Mix 5000psi",
    submittalStatus: "approved",
    neededBy: "2026-07-22",
    promisedBy: "2026-07-21",
    eta: { p10: "2026-07-20", p50: "2026-07-23", p90: "2026-07-27" },
    onTimeProbability: 0.48,
    costOfDelayPerDay: 16000,
    criticalPathSlipDays: 1,
    linkedTaskId: "t-precast",
    flags: ["2 days float remaining"],
    timeline: [
      { date: "2026-06-10", label: "Submittal approved", kind: "good", source: "Submittal log" },
      { date: "2026-06-12", label: "PO-4390 issued", kind: "info", source: "Procurement" },
      { date: "2026-06-28", label: "Casting started (11 of 24)", kind: "info", source: "Supplier report" },
      {
        date: "2026-07-08",
        label: "Curing delay flagged",
        kind: "warn",
        detail: "Supplier reports 3-day curing backlog. Forecast pushed to p50 Jul 23.",
        source: "Supplier email",
      },
    ],
  },
  {
    id: "mat-ahu-l4",
    name: "Air Handling Units — L4 (AHU-4A/4B)",
    sku: "AHU-40T-VFD",
    csiDivision: "23 74 00 — Packaged HVAC",
    poNumber: "PO-4302",
    qty: 2,
    unit: "units",
    supplierId: "sup-nordic",
    status: "in_transit",
    fabricationProgress: 100,
    location: "Mechanical Room L4",
    specRef: "M-610 / 40-ton VFD",
    submittalStatus: "approved",
    neededBy: "2026-08-01",
    promisedBy: "2026-07-29",
    eta: { p10: "2026-07-27", p50: "2026-07-29", p90: "2026-08-01" },
    onTimeProbability: 0.83,
    costOfDelayPerDay: 24500,
    criticalPathSlipDays: 0,
    linkedTaskId: "t-mep",
    timeline: [
      { date: "2026-05-30", label: "Submittal approved", kind: "good", source: "Submittal log" },
      { date: "2026-06-02", label: "PO-4302 issued", kind: "info", source: "Procurement" },
      { date: "2026-07-06", label: "Fabrication complete, QA passed", kind: "good", source: "Factory QA" },
      {
        date: "2026-07-09",
        label: "Shipped from Dallas — in transit",
        kind: "good",
        detail: "Tracked freight, ETA Jul 29. On-time probability 83%.",
        source: "Carrier API",
      },
    ],
  },
  {
    id: "mat-curtain-east",
    name: "Curtainwall Units — East Elevation",
    sku: "CW-E-UNIT",
    csiDivision: "08 44 00 — Curtain Wall Assemblies",
    poNumber: "PO-4155",
    qty: 320,
    unit: "units",
    supplierId: "sup-vitro",
    status: "fabricating",
    fabricationProgress: 30,
    location: "East elevation, L2–L8",
    specRef: "A-620 / Unitized system",
    submittalStatus: "revise_resubmit",
    neededBy: "2026-08-03",
    promisedBy: "2026-08-06",
    eta: { p10: "2026-08-05", p50: "2026-08-11", p90: "2026-08-19" },
    onTimeProbability: 0.18,
    costOfDelayPerDay: 27000,
    criticalPathSlipDays: 6,
    linkedTaskId: "t-curtain",
    flags: ["Submittal in revise/resubmit", "Cross-border freight", "Supplier 55% on-time"],
    timeline: [
      { date: "2026-05-15", label: "PO-4155 issued", kind: "info", source: "Procurement" },
      {
        date: "2026-06-30",
        label: "Submittal returned: revise & resubmit",
        kind: "warn",
        detail: "Thermal break detail rejected. Fabrication cannot finalize until re-approval.",
        source: "Architect review",
      },
      {
        date: "2026-07-07",
        label: "Fabrication partially on hold",
        kind: "warn",
        detail: "30% complete; remaining units blocked by submittal. Cross-border freight adds variance.",
        source: "Supplier email",
      },
    ],
  },
  {
    id: "mat-switchgear",
    name: "Main Switchgear — 2000A",
    sku: "SWG-2000A",
    csiDivision: "26 24 13 — Switchboards",
    poNumber: "PO-4210",
    qty: 1,
    unit: "assembly",
    supplierId: "sup-lumen",
    status: "ordered",
    fabricationProgress: 15,
    location: "Electrical Room L1",
    specRef: "E-410 / 2000A 480V",
    submittalStatus: "approved",
    neededBy: "2026-08-10",
    promisedBy: "2026-08-05",
    eta: { p10: "2026-08-03", p50: "2026-08-06", p90: "2026-08-10" },
    onTimeProbability: 0.79,
    costOfDelayPerDay: 24500,
    criticalPathSlipDays: 0,
    linkedTaskId: "t-mep",
    timeline: [
      { date: "2026-06-25", label: "Submittal approved", kind: "good", source: "Submittal log" },
      { date: "2026-06-27", label: "PO-4210 issued", kind: "info", source: "Procurement" },
      { date: "2026-07-05", label: "Long-lead components ordered", kind: "info", source: "Supplier report" },
    ],
  },
  {
    id: "mat-concrete-l3",
    name: "Ready-Mix Concrete — L3 Pour",
    sku: "RMX-5000",
    csiDivision: "03 30 00 — Cast-in-Place Concrete",
    poNumber: "PO-4468",
    qty: 420,
    unit: "cu yd",
    supplierId: "sup-terra",
    status: "approved",
    fabricationProgress: 0,
    location: "Level 3 slab",
    specRef: "S-201 / 5000psi",
    submittalStatus: "approved",
    neededBy: "2026-07-11",
    promisedBy: "2026-07-11",
    eta: { p10: "2026-07-11", p50: "2026-07-11", p90: "2026-07-12" },
    onTimeProbability: 0.95,
    costOfDelayPerDay: 22000,
    criticalPathSlipDays: 0,
    linkedTaskId: "t-l3-pour",
    flags: ["Ready — but gated by rebar (PO-4471)"],
    timeline: [
      { date: "2026-07-01", label: "Batch scheduled for Jul 11", kind: "good", source: "Supplier portal" },
      {
        date: "2026-07-10",
        label: "Delivery ready — dependent on rebar",
        kind: "warn",
        detail: "Concrete can pour on time, but rebar PO-4471 must be placed & inspected first.",
        source: "ETA engine",
      },
    ],
  },
];

export function supplierById(id: string) {
  return suppliers.find((s) => s.id === id)!;
}

export function taskById(id: string) {
  return tasks.find((t) => t.id === id)!;
}

export function materialById(id: string) {
  return materials.find((m) => m.id === id);
}

// Cascade: given a material slip, which downstream tasks are impacted (DAG walk).
export function cascadeFor(materialId: string) {
  const m = materialById(materialId);
  if (!m) return [];
  const rootTask = m.linkedTaskId;
  const impacted: { task: ScheduleTask; slipDays: number }[] = [];
  const visited = new Set<string>();
  const walk = (taskId: string, slip: number) => {
    if (visited.has(taskId)) return;
    visited.add(taskId);
    const t = taskById(taskId);
    if (!t) return;
    const absorbed = Math.max(0, slip - t.floatDays);
    impacted.push({ task: t, slipDays: absorbed });
    if (absorbed > 0) {
      tasks
        .filter((child) => child.dependsOn.includes(taskId))
        .forEach((child) => walk(child.id, absorbed));
    }
  };
  walk(rootTask, m.criticalPathSlipDays);
  return impacted.filter((i) => i.slipDays > 0);
}

export function portfolioStats() {
  const atRisk = materials.filter(
    (m) => m.onTimeProbability < 0.8 || m.criticalPathSlipDays >= 1
  );
  const totalExposure = materials.reduce(
    (sum, m) => sum + m.criticalPathSlipDays * m.costOfDelayPerDay,
    0
  );
  const critical = materials.filter((m) => m.criticalPathSlipDays >= 3).length;
  const onTrack = materials.length - atRisk.length;
  return {
    total: materials.length,
    atRisk: atRisk.length,
    critical,
    onTrack,
    totalExposure,
  };
}
