import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Boxes,
  FileText,
  MapPin,
  Truck,
  Mail,
  CalendarClock,
  Flag,
} from "lucide-react";
import { materialById, materials, supplierById, taskById } from "@/lib/data";
import { riskOf } from "@/lib/types";
import { currency, formatDate, pct } from "@/lib/utils";
import { EtaChart } from "@/components/EtaChart";
import { CascadeView } from "@/components/CascadeView";
import { RiskBadge, StatusPill, ProgressBar } from "@/components/ui";

export function generateStaticParams() {
  return materials.map((m) => ({ id: m.id }));
}

const eventTone: Record<string, string> = {
  info: "bg-slate-400",
  warn: "bg-warning-500",
  good: "bg-success-500",
  action: "bg-primary-500",
};

export default async function MaterialDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const m = materialById(id);
  if (!m) notFound();

  const sup = supplierById(m.supplierId);
  const task = taskById(m.linkedTaskId);
  const risk = riskOf(m);
  const cod = m.criticalPathSlipDays * m.costOfDelayPerDay;

  return (
    <div className="container-luxe space-y-6 py-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" /> Control Tower
      </Link>

      {/* Header */}
      <div className="card relative overflow-hidden p-6">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-50" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <RiskBadge risk={risk} />
              <StatusPill status={m.status} />
              <span className="chip border-hairline bg-slate-50 font-mono text-slate-500">
                {m.poNumber}
              </span>
            </div>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">{m.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <Boxes className="h-4 w-4" /> {m.qty} {m.unit}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" /> {m.location}
              </span>
              <span className="flex items-center gap-1.5">
                <FileText className="h-4 w-4" /> {m.specRef}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-start gap-2 md:items-end">
            <div className="rounded-2xl border border-hairline bg-slate-50 px-5 py-3 text-left md:text-right">
              <p className="label-muted">On-time probability</p>
              <p
                className={`text-3xl font-semibold tabular-nums ${
                  risk === "high"
                    ? "text-danger-600"
                    : risk === "medium"
                    ? "text-warning-600"
                    : "text-success-600"
                }`}
              >
                {pct(m.onTimeProbability)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: ETA + timeline */}
        <div className="space-y-6 lg:col-span-2">
          <div className="card p-5">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">
                Probabilistic arrival forecast
              </h2>
              <span className="text-xs text-slate-400">
                Chronos + conformal · calibrated interval
              </span>
            </div>
            <EtaChart material={m} />
            <div className="mt-4 grid grid-cols-4 gap-3 text-center">
              <Stat label="p10 (early)" value={formatDate(m.eta.p10)} />
              <Stat label="p50 (likely)" value={formatDate(m.eta.p50)} tone="brand" />
              <Stat label="p90 (late)" value={formatDate(m.eta.p90)} />
              <Stat label="Need by" value={formatDate(m.neededBy)} tone="risk" />
            </div>
          </div>

          {/* Timeline */}
          <div className="card p-5">
            <h2 className="mb-4 text-sm font-semibold text-slate-900">
              Fused timeline — every signal, one thread
            </h2>
            <ol className="relative space-y-5 border-l border-hairline pl-6">
              {m.timeline.map((e, i) => (
                <li key={i} className="relative">
                  <span
                    className={`absolute -left-[27px] top-1 h-3 w-3 rounded-full ring-4 ring-white ${
                      eventTone[e.kind]
                    }`}
                  />
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-slate-900">{e.label}</p>
                    <time className="shrink-0 text-xs text-slate-400">
                      {formatDate(e.date, { year: "numeric" })}
                    </time>
                  </div>
                  {e.detail && <p className="mt-1 text-sm text-slate-500">{e.detail}</p>}
                  {e.source && (
                    <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-400">
                      {e.source}
                    </p>
                  )}
                </li>
              ))}
            </ol>
          </div>

          <CascadeView materialId={m.id} />
        </div>

        {/* Right: facts + actions */}
        <div className="space-y-6">
          <div className="card p-5">
            <h2 className="mb-3 text-sm font-semibold text-slate-900">Supplier</h2>
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-500">
                <Building2 className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-medium text-slate-900">{sup.name}</p>
                <p className="text-xs text-slate-400">{sup.location}</p>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <FactRow label="On-time history" value={pct(sup.onTimeRate)} />
              <div>
                <div className="mb-1 flex justify-between text-xs text-slate-400">
                  <span>Reliability</span>
                  <span>{pct(sup.reliability)}</span>
                </div>
                <ProgressBar
                  value={sup.reliability * 100}
                  tone={sup.reliability < 0.65 ? "risk" : sup.reliability < 0.8 ? "amber" : "brand"}
                />
              </div>
              <FactRow label="Avg lead time" value={`${sup.avgLeadDays} days`} />
            </div>
          </div>

          <div className="card p-5">
            <h2 className="mb-3 text-sm font-semibold text-slate-900">Schedule link</h2>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <CalendarClock className="h-4 w-4 text-slate-400" />
              {task.name}
            </div>
            <div className="mt-3 space-y-2">
              <FactRow label="Task window" value={`${formatDate(task.start)} – ${formatDate(task.end)}`} />
              <FactRow label="Float" value={`${task.floatDays} days`} />
              <FactRow
                label="Critical path"
                value={task.critical ? "Yes" : "No"}
                tone={task.critical ? "risk" : undefined}
              />
              {cod > 0 && <FactRow label="Delay exposure" value={currency(cod)} tone="risk" />}
            </div>
          </div>

          {/* Agent actions */}
          <div className="card p-5">
            <h2 className="mb-3 text-sm font-semibold text-slate-900">Agent — recommended actions</h2>
            <div className="space-y-2">
              {m.onTimeProbability < 0.6 && (
                <ActionItem
                  icon={Mail}
                  title={`Draft escalation to ${sup.name}`}
                  detail={`Chase ${m.poNumber}, request firm ship date & expedite.`}
                />
              )}
              {m.criticalPathSlipDays >= 1 && (
                <ActionItem
                  icon={CalendarClock}
                  title={`Re-sequence "${task.name}"`}
                  detail={`Protect ${m.criticalPathSlipDays}d of critical path.`}
                />
              )}
              {m.submittalStatus === "revise_resubmit" && (
                <ActionItem
                  icon={Flag}
                  title="Escalate submittal turnaround"
                  detail="Fabrication is gated by a revise/resubmit."
                />
              )}
              {m.status === "in_transit" && (
                <ActionItem
                  icon={Truck}
                  title="Confirm delivery window"
                  detail="Coordinate crane & crew for offload."
                />
              )}
              {m.onTimeProbability >= 0.8 &&
                m.criticalPathSlipDays === 0 &&
                m.status !== "in_transit" && (
                  <p className="text-sm text-slate-500">
                    On track — no action needed. ConstrAI keeps monitoring the ETA.
                  </p>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "brand" | "risk" }) {
  const t = tone === "brand" ? "text-primary-700" : tone === "risk" ? "text-danger-600" : "text-slate-900";
  return (
    <div className="rounded-xl border border-hairline bg-slate-50 p-2.5">
      <p className="label-muted">{label}</p>
      <p className={`mt-1 text-sm font-semibold ${t}`}>{value}</p>
    </div>
  );
}

function FactRow({ label, value, tone }: { label: string; value: string; tone?: "risk" }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-400">{label}</span>
      <span className={tone === "risk" ? "font-medium text-danger-600" : "font-medium text-slate-700"}>
        {value}
      </span>
    </div>
  );
}

function ActionItem({
  icon: Icon,
  title,
  detail,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  detail: string;
}) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-hairline bg-slate-50 px-3 py-2.5">
      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary-50 text-primary-600">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div>
        <p className="text-xs font-semibold text-slate-900">{title}</p>
        <p className="text-xs text-slate-500">{detail}</p>
      </div>
    </div>
  );
}
