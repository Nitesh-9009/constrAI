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
  Pencil,
} from "lucide-react";
import { getMaterial } from "@/lib/queries";
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

export default async function MaterialDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const m = await getMaterial(id);
  if (!m) notFound();

  const sup = m.supplier;
  const tone = simpleOf(m);
  const paper = paperStatus[m.paperwork];
  const action = whatToDo(m, sup?.name ?? null);
  const ActionIcon =
    m.paperwork === "revise_resubmit"
      ? FileWarning
      : m.onTimeProbability < 0.6
      ? Phone
      : m.status === "in_transit"
      ? PackageCheck
      : CalendarClock;

  return (
    <div className="container-luxe max-w-4xl space-y-6 py-6">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/materials"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" /> Back to my materials
        </Link>
        <Link href={`/dashboard/materials/${m.id}/edit`} className="btn-ghost text-sm">
          <Pencil className="h-4 w-4" /> Edit
        </Link>
      </div>

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
          {m.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" /> Goes to {m.location}
            </span>
          )}
          {sup && (
            <span className="flex items-center gap-1.5">
              <Building2 className="h-4 w-4" /> Made by {sup.name}
            </span>
          )}
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
          <BigFact label="You need it by" value={m.needBy ? formatDate(m.needBy) : "Not set"} tone="need" />
          <BigFact
            label="It should arrive"
            value={m.expectedArrival ? formatDate(m.expectedArrival) : "Not set"}
            tone={tone === "good" ? "good" : "late"}
          />
        </div>
      </div>

      {/* Two simple info cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Supplier */}
        <div className="card p-5">
          <h2 className="text-base font-semibold text-slate-900">Who is making it</h2>
          {sup ? (
            <>
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
            </>
          ) : (
            <p className="mt-3 text-sm text-slate-400">No supplier set for this order yet.</p>
          )}
        </div>

        {/* Paperwork */}
        <div className="card p-5">
          <h2 className="text-base font-semibold text-slate-900">Paperwork</h2>
          <div className="mt-3">
            <SimpleBadge tone={paper.tone} size="sm" />
            <p className="mt-2 text-sm text-slate-600">{paper.label}.</p>
            {m.paperwork === "revise_resubmit" ? (
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

      {/* Notes */}
      {m.notes && (
        <div className="card p-5 sm:p-6">
          <h2 className="mb-2 text-base font-semibold text-slate-900">Notes</h2>
          <p className="text-sm leading-relaxed text-slate-600">{m.notes}</p>
        </div>
      )}

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
