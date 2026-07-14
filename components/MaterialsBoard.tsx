"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, MapPin, TriangleAlert, PackageSearch } from "lucide-react";
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
  const reduce = useReducedMotion();

  const sorted = [...materials].sort(
    (a, b) =>
      b.criticalPathSlipDays * b.costOfDelayPerDay -
      a.criticalPathSlipDays * a.costOfDelayPerDay
  );
  const list = sorted.filter((m) => (filter === "all" ? true : riskOf(m) === filter));

  return (
    <section id="materials" className="scroll-mt-24">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-50 text-primary-600">
            <PackageSearch className="h-4.5 w-4.5" />
          </span>
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">
              Materials, ranked by cost of delay
            </h2>
            <p className="text-sm text-slate-500">
              Fused from POs, submittals, supplier emails &amp; site photos.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 rounded-xl border border-hairline bg-white p-1 shadow-soft">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition",
                filter === f.key
                  ? "bg-primary-600 text-white shadow-soft"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {list.length === 0 && (
          <div className="card p-10 text-center">
            <p className="text-sm font-medium text-slate-700">Nothing in this category</p>
            <p className="mt-1 text-xs text-slate-400">
              No materials currently match this filter.
            </p>
          </div>
        )}
        {list.map((m, i) => {
          const risk = riskOf(m);
          const sup = supplierById(m.supplierId);
          const cod = m.criticalPathSlipDays * m.costOfDelayPerDay;
          return (
            <motion.div
              key={m.id}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={`/dashboard/materials/${m.id}`}
                className="card card-hover group block p-4 sm:p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <RiskBadge risk={risk} />
                      <StatusPill status={m.status} />
                      {m.submittalStatus === "revise_resubmit" && (
                        <span className="chip border-danger-500/25 bg-danger-50 text-danger-700">
                          <TriangleAlert className="h-3 w-3" /> Submittal blocked
                        </span>
                      )}
                    </div>
                    <h3 className="mt-2 truncate text-base font-semibold text-slate-900 transition-colors group-hover:text-primary-700">
                      {m.name}
                    </h3>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                      <span className="font-mono text-slate-500">{m.poNumber}</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {m.location}
                      </span>
                      <span>{sup.name}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 sm:w-[42%] sm:shrink-0">
                    <Metric label="On-time" value={pct(m.onTimeProbability)} tone={risk} />
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

                  <ArrowRight className="hidden h-5 w-5 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-primary-500 sm:block" />
                </div>

                {m.status === "fabricating" && (
                  <div className="mt-4">
                    <div className="mb-1.5 flex justify-between text-xs text-slate-400">
                      <span>Fabrication</span>
                      <span className="font-medium text-slate-600">{m.fabricationProgress}%</span>
                    </div>
                    <ProgressBar
                      value={m.fabricationProgress}
                      tone={risk === "high" ? "risk" : risk === "medium" ? "amber" : "brand"}
                    />
                  </div>
                )}
              </Link>
            </motion.div>
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
      ? "text-danger-600"
      : tone === "medium"
      ? "text-warning-600"
      : tone === "low"
      ? "text-success-600"
      : "text-slate-900";
  return (
    <div>
      <p className="label-muted">{label}</p>
      <p className={cn("mt-1 text-sm font-semibold tabular-nums", toneClass)}>{value}</p>
      {sub && <p className="text-[11px] text-slate-400">{sub}</p>}
    </div>
  );
}
