"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/motion";
import { SimpleBadge } from "@/components/ui";
import { materials, supplierById } from "@/lib/data";
import { formatDate, cn } from "@/lib/utils";
import { simpleOf, latenessText, whatToDo, buildingDelayText } from "@/lib/plain";
import {
  Bell,
  ArrowRight,
  Check,
  PartyPopper,
  Phone,
  FileWarning,
  CalendarClock,
  PackageCheck,
} from "lucide-react";

export default function AlertsPage() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const reduce = useReducedMotion();

  const needAttention = [...materials]
    .filter((m) => simpleOf(m) !== "good")
    .sort(
      (a, b) =>
        b.criticalPathSlipDays * b.costOfDelayPerDay -
        a.criticalPathSlipDays * a.costOfDelayPerDay
    );

  const remaining = needAttention.filter((m) => !done[m.id]).length;

  return (
    <div className="container-luxe max-w-4xl space-y-6 py-6">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-danger-50 text-danger-600">
          <Bell className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Needs Attention
          </h1>
          <p className="text-base text-slate-500">
            {remaining > 0
              ? `${remaining} thing${remaining > 1 ? "s" : ""} to take care of. Do them one by one.`
              : "You are all caught up."}
          </p>
        </div>
      </div>

      {remaining === 0 && (
        <Reveal>
          <div className="card grid place-items-center gap-3 p-12 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-success-50 text-success-600">
              <PartyPopper className="h-8 w-8" />
            </span>
            <p className="text-lg font-semibold text-slate-900">Nice work! Nothing to fix.</p>
            <p className="text-sm text-slate-500">
              Every order that needed action has been handled.
            </p>
            <Link href="/dashboard/materials" className="btn-ghost mt-2">
              See all materials
            </Link>
          </div>
        </Reveal>
      )}

      <div className="space-y-4">
        {needAttention.map((m, i) => {
          const tone = simpleOf(m);
          const sup = supplierById(m.supplierId);
          const isDone = done[m.id];
          const action = whatToDo(m, sup.name) ?? "Keep watching this order.";
          const ActionIcon =
            m.submittalStatus === "revise_resubmit"
              ? FileWarning
              : m.onTimeProbability < 0.6
              ? Phone
              : m.status === "in_transit"
              ? PackageCheck
              : CalendarClock;

          return (
            <motion.div
              key={m.id}
              layout
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className={cn("card overflow-hidden", isDone && "opacity-60")}
            >
              <div className="p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <SimpleBadge tone={tone} />
                  <span className="text-sm font-semibold text-slate-500">{latenessText(m)}</span>
                </div>
                <Link href={`/dashboard/materials/${m.id}`}>
                  <h2 className="mt-3 text-lg font-semibold text-slate-900 hover:text-primary-700">
                    {m.name}
                  </h2>
                </Link>
                <p className="mt-1 text-sm text-slate-500">
                  You need it by {formatDate(m.neededBy)}. {buildingDelayText(m)}.
                </p>

                <div
                  className={cn(
                    "mt-4 flex items-start gap-3 rounded-2xl border p-4",
                    isDone
                      ? "border-success-500/25 bg-success-50"
                      : "border-primary-200 bg-primary-50/60"
                  )}
                >
                  <span
                    className={cn(
                      "grid h-9 w-9 shrink-0 place-items-center rounded-xl text-white",
                      isDone ? "bg-success-500" : "bg-primary-600"
                    )}
                  >
                    {isDone ? <Check className="h-5 w-5" /> : <ActionIcon className="h-5 w-5" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={cn("text-sm font-bold", isDone ? "text-success-700" : "text-primary-800")}>
                      {isDone ? "Done — good job!" : "What to do"}
                    </p>
                    <p className="text-sm text-slate-700">{action}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {!isDone ? (
                    <button
                      onClick={() => setDone((d) => ({ ...d, [m.id]: true }))}
                      className="btn-primary"
                    >
                      <Check className="h-4 w-4" /> Mark as done
                    </button>
                  ) : (
                    <button
                      onClick={() => setDone((d) => ({ ...d, [m.id]: false }))}
                      className="btn-ghost"
                    >
                      Undo
                    </button>
                  )}
                  <Link href={`/dashboard/materials/${m.id}`} className="btn-ghost">
                    See details <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
