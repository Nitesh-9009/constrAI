import Link from "next/link";
import {
  Truck,
  FileStack,
  Settings2,
  Mail,
  CalendarRange,
  FileCheck2,
  Building2,
  Camera,
  CheckCircle2,
  MapPin,
} from "lucide-react";
import { materials, supplierById } from "@/lib/data";
import { formatDate, pct } from "@/lib/utils";
import { StatusPill } from "./ui";

export function LogisticsSection() {
  const inbound = [...materials].sort(
    (a, b) => new Date(a.eta.p50).getTime() - new Date(b.eta.p50).getTime()
  );
  return (
    <section id="logistics" className="scroll-mt-24">
      <div className="mb-3 flex items-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-50 text-primary-600">
          <Truck className="h-4.5 w-4.5" />
        </span>
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">
          Logistics — inbound deliveries
        </h2>
      </div>
      <div className="card overflow-hidden">
        <div className="hidden grid-cols-12 gap-3 border-b border-hairline bg-slate-50/70 px-5 py-3 text-[11px] font-medium uppercase tracking-wide text-slate-400 sm:grid">
          <span className="col-span-4">Material</span>
          <span className="col-span-2">Status</span>
          <span className="col-span-3">From</span>
          <span className="col-span-2">ETA</span>
          <span className="col-span-1 text-right">On-time</span>
        </div>
        {inbound.map((m) => {
          const sup = supplierById(m.supplierId);
          return (
            <Link
              key={m.id}
              href={`/dashboard/materials/${m.id}`}
              className="grid grid-cols-2 gap-2 border-b border-hairline px-5 py-3.5 transition last:border-0 hover:bg-slate-50 sm:grid-cols-12 sm:gap-3"
            >
              <div className="col-span-2 min-w-0 sm:col-span-4">
                <p className="truncate text-sm font-medium text-slate-900">{m.name}</p>
                <p className="flex items-center gap-1 text-xs text-slate-400">
                  <MapPin className="h-3 w-3" /> {m.location}
                </p>
              </div>
              <div className="col-span-2 sm:col-span-2">
                <StatusPill status={m.status} />
              </div>
              <p className="col-span-1 truncate text-sm text-slate-500 sm:col-span-3">{sup.location}</p>
              <p className="col-span-1 text-sm text-slate-600 sm:col-span-2">{formatDate(m.eta.p50)}</p>
              <p
                className={`col-span-2 text-sm font-semibold tabular-nums sm:col-span-1 sm:text-right ${
                  m.onTimeProbability < 0.55
                    ? "text-danger-600"
                    : m.onTimeProbability < 0.8
                    ? "text-warning-600"
                    : "text-success-600"
                }`}
              >
                {pct(m.onTimeProbability)}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

const submittalLabel: Record<string, string> = {
  approved: "Approved",
  pending: "Pending",
  revise_resubmit: "Revise & resubmit",
};
const submittalTone: Record<string, string> = {
  approved: "text-success-600",
  pending: "text-warning-600",
  revise_resubmit: "text-danger-600",
};

export function DocumentsSection() {
  return (
    <section id="documents" className="scroll-mt-24">
      <div className="mb-3 flex items-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-50 text-primary-600">
          <FileStack className="h-4.5 w-4.5" />
        </span>
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">
          Documents — POs & submittals
        </h2>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {materials.map((m) => (
          <Link
            key={m.id}
            href={`/dashboard/materials/${m.id}`}
            className="card card-hover flex items-start gap-3 p-4"
          >
            <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500">
              <FileCheck2 className="h-4.5 w-4.5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="font-mono text-sm text-slate-900">{m.poNumber}</p>
                <span className={`text-xs font-medium ${submittalTone[m.submittalStatus]}`}>
                  {submittalLabel[m.submittalStatus]}
                </span>
              </div>
              <p className="mt-0.5 truncate text-sm text-slate-600">{m.name}</p>
              <p className="mt-1 truncate text-xs text-slate-400">
                {m.csiDivision} · {m.specRef}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

const sources = [
  { icon: Mail, name: "Project email inbox", detail: "POs, order confirmations & supplier replies", connected: true },
  { icon: CalendarRange, name: "Primavera P6", detail: "Schedule tasks, float & critical path", connected: true },
  { icon: FileCheck2, name: "Submittal log", detail: "Approvals & revise/resubmit status", connected: true },
  { icon: Building2, name: "Supplier portals", detail: "Fabrication progress & ship dates", connected: true },
  { icon: Camera, name: "Site photos (VLM)", detail: "Auto status from job-site images", connected: true },
];

export function SettingsSection({ assistantLive }: { assistantLive: boolean }) {
  return (
    <section id="settings" className="scroll-mt-24">
      <div className="mb-3 flex items-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-50 text-primary-600">
          <Settings2 className="h-4.5 w-4.5" />
        </span>
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">
          Data sources & integrations
        </h2>
      </div>
      <div className="card divide-y divide-[color:theme(colors.hairline)]">
        {sources.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.name} className="flex items-center gap-3 px-5 py-4">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500">
                <Icon className="h-4.5 w-4.5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-900">{s.name}</p>
                <p className="truncate text-xs text-slate-400">{s.detail}</p>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-medium text-success-600">
                <CheckCircle2 className="h-4 w-4" /> Connected
              </span>
            </div>
          );
        })}
        <div className="flex items-center gap-3 px-5 py-4">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary-50 text-primary-600">
            <Settings2 className="h-4.5 w-4.5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-900">Ask ConstrAI — AI engine</p>
            <p className="truncate text-xs text-slate-400">
              {assistantLive
                ? "Live LLM connected (Groq · Llama-3.3-70B)"
                : "Grounded reasoning mode — add an API key to enable a live LLM"}
            </p>
          </div>
          <span
            className={`chip ${
              assistantLive
                ? "border-success-500/25 bg-success-50 text-success-700"
                : "border-hairline bg-slate-50 text-slate-500"
            }`}
          >
            {assistantLive ? "AI live" : "Grounded"}
          </span>
        </div>
      </div>
    </section>
  );
}
