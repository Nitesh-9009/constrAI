import { MaterialsBoard } from "@/components/MaterialsBoard";
import { AssistantPanel } from "@/components/AssistantPanel";
import { CascadeView } from "@/components/CascadeView";
import { PhotoUpload } from "@/components/PhotoUpload";
import {
  LogisticsSection,
  DocumentsSection,
  SettingsSection,
} from "@/components/DashboardSections";
import { KpiCard } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { portfolioStats, materials, taskById, PROJECT } from "@/lib/data";
import { currency, pct } from "@/lib/utils";
import {
  Boxes,
  TriangleAlert,
  CircleDollarSign,
  ShieldCheck,
  Sparkles,
  CloudSun,
  Activity,
  ArrowUpRight,
  Gauge,
  Droplets,
  Wind,
} from "lucide-react";

export default function DashboardPage() {
  const stats = portfolioStats();
  const assistantLive = Boolean(process.env.OPENAI_API_KEY);
  const topRisk = [...materials].sort(
    (a, b) =>
      b.criticalPathSlipDays * b.costOfDelayPerDay -
      a.criticalPathSlipDays * a.costOfDelayPerDay
  )[0];

  const healthPct = Math.round((stats.onTrack / stats.total) * 100);
  const safetyScore = 96 - stats.critical * 3;

  return (
    <div className="container-luxe grid grid-cols-1 gap-6 py-6 xl:grid-cols-[1fr_400px]">
      {/* Left column */}
      <div className="min-w-0 space-y-6">
        {/* Page header */}
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-400">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-success-500/25 bg-success-50 px-2.5 py-1 text-success-700">
                <ShieldCheck className="h-3.5 w-3.5" /> Live · Encrypted
              </span>
              <span className="hidden sm:inline">{PROJECT.gc}</span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Material Control Tower
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              One predictive timeline for every material — approved, fabricating, delayed, in
              transit, or landed.
            </p>
          </div>
        </div>

        {/* Bento — KPI row */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Reveal delay={0}>
            <KpiCard
              label="Materials tracked"
              value={String(stats.total)}
              sub={PROJECT.name}
              icon={Boxes}
              tone="primary"
            />
          </Reveal>
          <Reveal delay={0.05}>
            <KpiCard
              label="At risk"
              value={String(stats.atRisk)}
              sub={`${stats.critical} critical`}
              icon={TriangleAlert}
              tone="warning"
            />
          </Reveal>
          <Reveal delay={0.1}>
            <KpiCard
              label="Delay exposure"
              value={currency(stats.totalExposure)}
              sub="critical-path cost"
              icon={CircleDollarSign}
              tone="danger"
            />
          </Reveal>
          <Reveal delay={0.15}>
            <KpiCard
              label="On track"
              value={String(stats.onTrack)}
              sub="no action needed"
              icon={ShieldCheck}
              tone="success"
            />
          </Reveal>
        </div>

        {/* Bento — AI insight (large) + health ring + weather */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* AI Prediction — spans 2 */}
          <Reveal className="lg:col-span-2" delay={0}>
            <div className="ai-ring card relative h-full overflow-hidden p-6">
              <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" />
              <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-primary-500/10 blur-3xl" />
              <div className="relative">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-800 text-white shadow-glow">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <span className="label-muted text-primary-700/80">AI prediction · top priority</span>
                  <span className="ml-auto flex items-center gap-1.5">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-danger-500/60" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-danger-500" />
                    </span>
                    <span className="text-xs font-medium text-danger-600">Action needed</span>
                  </span>
                </div>
                <h2 className="mt-3 text-xl font-semibold tracking-tight text-slate-900">
                  {topRisk.name}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
                  {topRisk.poNumber} is {topRisk.fabricationProgress}% fabricated with a{" "}
                  <span className="font-semibold text-slate-700">
                    {pct(topRisk.onTimeProbability)}
                  </span>{" "}
                  chance of arriving on time. Forecast lands after the need date — putting{" "}
                  {taskById(topRisk.linkedTaskId).name} and everything downstream at risk.
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <div className="rounded-xl border border-hairline bg-slate-50 px-4 py-2.5">
                    <p className="label-muted">Exposure</p>
                    <p className="mt-0.5 text-lg font-semibold tabular-nums text-danger-600">
                      {currency(topRisk.criticalPathSlipDays * topRisk.costOfDelayPerDay)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-hairline bg-slate-50 px-4 py-2.5">
                    <p className="label-muted">Critical slip</p>
                    <p className="mt-0.5 text-lg font-semibold tabular-nums text-slate-900">
                      {topRisk.criticalPathSlipDays}d
                    </p>
                  </div>
                  <a href={`/dashboard/materials/${topRisk.id}`} className="btn-primary ml-auto">
                    Resolve now <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Portfolio health ring + weather stacked */}
          <div className="grid gap-4">
            <Reveal delay={0.08}>
              <div className="card card-hover flex items-center gap-4 p-5">
                <HealthRing value={healthPct} />
                <div>
                  <p className="label-muted">Portfolio health</p>
                  <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">
                    {healthPct}%
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs font-medium text-success-600">
                    <Gauge className="h-3.5 w-3.5" /> Safety score {safetyScore}
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="card card-hover overflow-hidden p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="label-muted">Site weather</p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">{PROJECT.location}</p>
                  </div>
                  <CloudSun className="h-8 w-8 text-warning-500" />
                </div>
                <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Activity className="h-3.5 w-3.5 text-slate-400" /> 94°F
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Droplets className="h-3.5 w-3.5 text-primary-400" /> 12%
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Wind className="h-3.5 w-3.5 text-slate-400" /> 8 mph
                  </span>
                </div>
                <p className="mt-3 rounded-lg bg-success-50 px-3 py-2 text-xs font-medium text-success-700">
                  Clear — no pour delays expected
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        <MaterialsBoard />

        <section id="schedule" className="scroll-mt-24">
          <h2 className="mb-3 text-lg font-semibold tracking-tight text-slate-900">Schedule impact</h2>
          <CascadeView materialId={topRisk.id} />
        </section>

        <LogisticsSection />
        <DocumentsSection />
        <SettingsSection assistantLive={assistantLive} />
      </div>

      {/* Right column */}
      <div className="space-y-6">
        <div className="glass sticky top-20 h-[560px] overflow-hidden">
          <AssistantPanel />
        </div>
        <PhotoUpload />
      </div>
    </div>
  );
}

/** Circular progress ring for portfolio health. */
function HealthRing({ value }: { value: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative grid h-16 w-16 shrink-0 place-items-center">
      <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" stroke="#eef2f8" strokeWidth="7" />
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute grid h-9 w-9 place-items-center rounded-full bg-primary-50 text-primary-600">
        <ShieldCheck className="h-4 w-4" />
      </span>
    </div>
  );
}
