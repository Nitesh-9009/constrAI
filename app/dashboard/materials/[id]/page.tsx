import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Boxes,
  MapPin,
  Truck,
  Phone,
  CalendarClock,
  FileWarning,
  PackageCheck,
  CheckCircle2,
} from "lucide-react";
import { materialById, materials, supplierById } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { ArrivalBar } from "@/components/ArrivalBar";
import { SimpleBadge } from "@/components/ui";
import {
  simpleOf,
  latenessText,
  supplierText,
  supplierTone,
  paperStatus,
  buildingDelayText,
  whatToDo,
} from "@/lib/plain";

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
  const tone = simpleOf(m);
  const paper = paperStatus[m.submittalStatus];
  const action = whatToDo(m, sup.name);
  const ActionIcon =
    m.submittalStatus === "revise_resubmit"
      ? FileWarning
      : m.onTimeProbability < 0.6
      ? Phone
      : m.status === "in_transit"
      ? PackageCheck
      : CalendarClock;

  return (
    <div className="container-luxe max-w-4xl space-y-6 py-6">
      <Link
        href="/dashboard/materials"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" /> Back to my materials
      </Link>

      {/* Header */}
      <div className="card p-6">
        <div className="flex flex-wrap items-center gap-3">
          <SimpleBadge tone={tone} size="lg" />
          <span className="text-base font-semibold text-slate-500">{latenessText(m)}</span>
        </div>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          {m.name}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
          <span className="flex items-center gap-1.5">
            <Boxes className="h-4 w-4" /> {m.qty} {m.unit}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" /> Goes to {m.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Building2 className="h-4 w-4" /> Made by {sup.name}
          </span>
        </div>
      </div>

      {/* What to do — the most important thing */}
      {action && (
        <div className="card overflow-hidden border-primary-200">
          <div className="flex items-start gap-3 bg-primary-50/60 p-5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary-600 text-white">
              <ActionIcon className="h-6 w-6" />
            </span>
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-primary-700">What to do</p>
              <p className="mt-0.5 text-lg font-semibold text-slate-900">{action}</p>
              <p className="mt-1 text-sm text-slate-600">{buildingDelayText(m)}.</p>
            </div>
          </div>
        </div>
      )}

      {/* Arrival — simple visual */}
      <div className="card p-5 sm:p-6">
        <h2 className="text-base font-semibold text-slate-900">When will it arrive?</h2>
        <p className="text-sm text-slate-500">Compare when it comes with when you need it.</p>
        <ArrivalBar material={m} />
        <div className="mt-2 grid grid-cols-2 gap-3">
          <BigFact label="You need it by" value={formatDate(m.neededBy)} tone="need" />
          <BigFact
            label="It should arrive"
            value={formatDate(m.eta.p50)}
            tone={tone === "good" ? "good" : "late"}
          />
        </div>
      </div>

      {/* Two simple info cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Supplier */}
        <div className="card p-5">
          <h2 className="text-base font-semibold text-slate-900">Who is making it</h2>
          <div className="mt-3 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-slate-500">
              <Building2 className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">{sup.name}</p>
              <p className="text-xs text-slate-400">{sup.location}</p>
            </div>
          </div>
          <div className="mt-3">
            <SimpleBadge tone={supplierTone(sup.onTimeRate)} size="sm" />
            <p className="mt-1.5 text-sm text-slate-600">
              This supplier is <b>{supplierText(sup.onTimeRate).toLowerCase()}</b>.
            </p>
          </div>
        </div>

        {/* Paperwork */}
        <div className="card p-5">
          <h2 className="text-base font-semibold text-slate-900">Paperwork</h2>
          <div className="mt-3">
            <SimpleBadge tone={paper.tone} size="sm" />
            <p className="mt-2 text-sm text-slate-600">{paper.label}.</p>
            {m.submittalStatus === "revise_resubmit" ? (
              <p className="mt-1 text-sm text-slate-500">
                The order can&apos;t be finished until this is approved.
              </p>
            ) : (
              <p className="mt-1 flex items-center gap-1.5 text-sm text-success-600">
                <CheckCircle2 className="h-4 w-4" /> All good — no paperwork holding this up.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Story so far */}
      <div className="card p-5 sm:p-6">
        <h2 className="mb-4 text-base font-semibold text-slate-900">What has happened so far</h2>
        <ol className="relative space-y-5 border-l-2 border-hairline pl-6">
          {m.timeline.map((e, i) => (
            <li key={i} className="relative">
              <span
                className={`absolute -left-[29px] top-1 h-3.5 w-3.5 rounded-full ring-4 ring-white ${
                  eventTone[e.kind]
                }`}
              />
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-900">{e.label}</p>
                <time className="shrink-0 text-xs text-slate-400">
                  {formatDate(e.date, { year: "numeric" })}
                </time>
              </div>
              {e.detail && <p className="mt-1 text-sm text-slate-500">{e.detail}</p>}
            </li>
          ))}
        </ol>
      </div>

      {/* If delivering soon */}
      {m.status === "in_transit" && (
        <div className="card flex items-center gap-3 border-success-500/25 bg-success-50/60 p-5">
          <Truck className="h-6 w-6 shrink-0 text-success-600" />
          <p className="text-sm font-medium text-slate-700">
            This is on the way. Get the crew and crane ready to unload it.
          </p>
        </div>
      )}

      <div className="flex justify-center pt-2">
        <Link href="/dashboard/help" className="btn-ghost">
          <Phone className="h-4 w-4" /> Need help? Ask ConstrAI
        </Link>
      </div>
    </div>
  );
}

function BigFact({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "need" | "good" | "late";
}) {
  const styles =
    tone === "good"
      ? "border-success-500/25 bg-success-50 text-success-700"
      : tone === "late"
      ? "border-danger-500/25 bg-danger-50 text-danger-700"
      : "border-hairline bg-slate-50 text-slate-900";
  return (
    <div className={`rounded-2xl border p-4 ${styles}`}>
      <p className="text-xs font-medium uppercase tracking-wide opacity-70">{label}</p>
      <p className="mt-1 text-lg font-bold">{value}</p>
    </div>
  );
}
