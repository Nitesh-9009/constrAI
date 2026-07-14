"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronRight, MapPin } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { simpleOf, latenessText, madeStatusText, type Simple } from "@/lib/plain";
import type { MaterialVM } from "@/lib/materials";
import { SimpleBadge } from "./ui";

type Filter = "all" | "late" | "good";

const filters: { key: Filter; label: string }[] = [
  { key: "all", label: "Show all" },
  { key: "late", label: "Late or risky" },
  { key: "good", label: "On time" },
];

export function MaterialList({
  items,
  showFilters = true,
}: {
  items: MaterialVM[];
  showFilters?: boolean;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const reduce = useReducedMotion();

  // worst first
  const sorted = [...items].sort(
    (a, b) =>
      b.buildingDelayDays * b.costOfDelayPerDay - a.buildingDelayDays * a.costOfDelayPerDay
  );

  const list = sorted.filter((m) => {
    if (filter === "all") return true;
    const s = simpleOf(m);
    if (filter === "late") return s === "late" || s === "risky";
    return s === "good";
  });

  return (
    <div>
      {showFilters && (
        <div className="mb-4 flex flex-wrap gap-2 rounded-2xl border border-hairline bg-white p-1.5 shadow-soft sm:inline-flex">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "rounded-xl px-4 py-2 text-sm font-semibold transition",
                filter === f.key
                  ? "bg-primary-600 text-white shadow-soft"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-3">
        {list.length === 0 && (
          <div className="card p-10 text-center">
            <p className="text-base font-semibold text-slate-700">Nothing here</p>
            <p className="mt-1 text-sm text-slate-400">No materials to show right now.</p>
          </div>
        )}
        {list.map((m, i) => {
          const tone = simpleOf(m);
          return (
            <motion.div
              key={m.id}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
            >
              <Link
                href={`/dashboard/materials/${m.id}`}
                className="card card-hover group flex items-center gap-4 p-4 sm:p-5"
              >
                <Stripe tone={tone} />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-base font-semibold text-slate-900 group-hover:text-primary-700 sm:text-lg">
                    {m.name}
                  </h3>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                    <span className="font-medium text-slate-600">{madeStatusText(m.status)}</span>
                    {m.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" /> {m.location}
                      </span>
                    )}
                    <span>{m.needBy ? `You need it by ${formatDate(m.needBy)}` : "No date set"}</span>
                  </div>
                  {m.supplier && (
                    <p className="mt-1 text-xs text-slate-400">Made by {m.supplier.name}</p>
                  )}
                </div>

                <div className="hidden shrink-0 flex-col items-end gap-1.5 sm:flex">
                  <SimpleBadge tone={tone} />
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      tone === "late"
                        ? "text-danger-600"
                        : tone === "risky"
                        ? "text-warning-600"
                        : "text-success-600"
                    )}
                  >
                    {latenessText(m)}
                  </span>
                </div>

                <ChevronRight className="h-5 w-5 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-primary-500" />
              </Link>

              {/* mobile badge row */}
              <div className="mt-2 flex items-center justify-between px-1 sm:hidden">
                <SimpleBadge tone={tone} size="sm" />
                <span
                  className={cn(
                    "text-sm font-semibold",
                    tone === "late"
                      ? "text-danger-600"
                      : tone === "risky"
                      ? "text-warning-600"
                      : "text-success-600"
                  )}
                >
                  {latenessText(m)}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function Stripe({ tone }: { tone: Simple }) {
  const color =
    tone === "late" ? "bg-danger-500" : tone === "risky" ? "bg-warning-500" : "bg-success-500";
  return <span className={cn("h-12 w-1.5 shrink-0 rounded-full", color)} />;
}
