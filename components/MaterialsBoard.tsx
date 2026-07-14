"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, TriangleAlert } from "lucide-react";
import { materials, supplierById } from "@/lib/data";
import { riskOf } from "@/lib/types";
import { cn, currency, formatDate, pct } from "@/lib/utils";
import { RiskBadge, StatusPill, ProgressBar } from "./ui";

type Filter = "all" | "high" | "medium" | "low";

const filters: { key: Filter; label: string }[] = [
  { key: "all", label: "All materials" },
  { key: "high", label: "High risk" },
  { key: "medium", label: "At risk" },
  { key: "low", label: "On track" },
];

export function MaterialsBoard() {
  const [filter, setFilter] = useState<Filter>("all");

  const sorted = [...materials].sort(
    (a, b) =>
      b.criticalPathSlipDays * b.costOfDelayPerDay -
      a.criticalPathSlipDays * a.costOfDelayPerDay
  );
  const list = sorted.filter((m) => (filter === "all" ? true : riskOf(m) === filter));

  return (
    <section id="materials" className="scroll-mt-24">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Materials, ranked by cost of delay</h2>
          <p className="text-sm text-slate-500">
            Every order fused from POs, submittals, supplier emails & site photos.
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs font-medium transition",
                filter === f.key
                  ? "border-brand-500/50 bg-brand-500/10 text-brand-300"
                  : "border-ink-700 bg-ink-850/50 text-slate-400 hover:text-slate-200"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {list.length === 0 && (
          <div className="card p-8 text-center">
            <p className="text-sm font-medium text-slate-300">Nothing in this category</p>
            <p className="mt-1 text-xs text-slate-500">
              No materials currently match this filter.
            </p>
          </div>
        )}
        {list.map((m) => {
          const risk = riskOf(m);
          const sup = supplierById(m.supplierId);
          const cod = m.criticalPathSlipDays * m.costOfDelayPerDay;
          return (
            <Link
              key={m.id}
              href={`/dashboard/materials/${m.id}`}
              className="card card-hover group block p-4 sm:p-5 animate-fade-up"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <RiskBadge risk={risk} />
                    <StatusPill status={m.status} />
                    {m.submittalStatus === "revise_resubmit" && (
                      <span className="chip border-risk-high/40 bg-risk-high/10 text-risk-high">
                        <TriangleAlert className="h-3 w-3" /> Submittal blocked
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 truncate text-base font-semibold text-white group-hover:text-brand-300">
                    {m.name}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                    <span className="font-mono">{m.poNumber}</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {m.location}
                    </span>
                    <span>{sup.name}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 sm:w-[42%] sm:shrink-0">
                  <Metric
                    label="On-time"
                    value={pct(m.onTimeProbability)}
                    tone={risk}
                  />
                  <Metric
                    label="ETA p50"
                    value={formatDate(m.eta.p50)}
                    sub={`need ${formatDate(m.neededBy)}`}
                  />
                  <Metric
                    label="Delay cost"
                    value={cod > 0 ? currency(cod) : "—"}
                    tone={cod > 0 ? "high" : undefined}
                  />
                </div>

                <ArrowRight className="hidden h-5 w-5 shrink-0 text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-brand-400 sm:block" />
              </div>

              {m.status === "fabricating" && (
                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-xs text-slate-500">
                    <span>Fabrication</span>
                    <span>{m.fabricationProgress}%</span>
                  </div>
                  <ProgressBar
                    value={m.fabricationProgress}
                    tone={risk === "high" ? "risk" : risk === "medium" ? "amber" : "brand"}
                  />
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "high" | "medium" | "low";
}) {
  const toneClass =
    tone === "high"
      ? "text-risk-high"
      : tone === "medium"
      ? "text-risk-med"
      : tone === "low"
      ? "text-risk-low"
      : "text-white";
  return (
    <div>
      <p className="label-muted">{label}</p>
      <p className={cn("mt-1 text-sm font-semibold tabular-nums", toneClass)}>{value}</p>
      {sub && <p className="text-[11px] text-slate-600">{sub}</p>}
    </div>
  );
}
