import { MaterialsBoard } from "@/components/MaterialsBoard";
import { AssistantPanel } from "@/components/AssistantPanel";
import { CascadeView } from "@/components/CascadeView";
import { PhotoUpload } from "@/components/PhotoUpload";
import {
  LogisticsSection,
  DocumentsSection,
  SettingsSection,
} from "@/components/DashboardSections";
import { portfolioStats, materials, taskById, PROJECT } from "@/lib/data";
import { currency } from "@/lib/utils";
import {
  Boxes,
  TriangleAlert,
  CircleDollarSign,
  ShieldCheck,
} from "lucide-react";

export default function DashboardPage() {
  const stats = portfolioStats();
  const assistantLive = Boolean(process.env.OPENAI_API_KEY);
  const topRisk = [...materials].sort(
    (a, b) =>
      b.criticalPathSlipDays * b.costOfDelayPerDay -
      a.criticalPathSlipDays * a.costOfDelayPerDay
  )[0];

  const cards = [
    {
      label: "Materials tracked",
      value: String(stats.total),
      icon: Boxes,
      tone: "text-slate-200",
      sub: `${PROJECT.name}`,
    },
    {
      label: "At risk",
      value: String(stats.atRisk),
      icon: TriangleAlert,
      tone: "text-risk-med",
      sub: `${stats.critical} critical`,
    },
    {
      label: "Delay exposure",
      value: currency(stats.totalExposure),
      icon: CircleDollarSign,
      tone: "text-risk-high",
      sub: "critical-path cost",
    },
    {
      label: "On track",
      value: String(stats.onTrack),
      icon: ShieldCheck,
      tone: "text-risk-low",
      sub: "no action needed",
    },
  ];

  return (
    <div className="container-luxe grid grid-cols-1 gap-6 py-6 xl:grid-cols-[1fr_400px]">
      {/* Left column */}
      <div className="min-w-0 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Material Control Tower
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            One predictive timeline for every material — approved, fabricating, delayed, in
            transit, or landed.
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.label} className="card p-4">
                <div className="flex items-center justify-between">
                  <span className="label-muted">{c.label}</span>
                  <Icon className={`h-4 w-4 ${c.tone}`} />
                </div>
                <p className={`mt-2 text-2xl font-semibold tabular-nums ${c.tone}`}>{c.value}</p>
                <p className="mt-0.5 text-xs text-slate-500">{c.sub}</p>
              </div>
            );
          })}
        </div>

        {/* Priority banner */}
        <div className="card relative overflow-hidden p-5">
          <div className="grid-lines pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-risk-high/60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-risk-high" />
              </span>
              <span className="label-muted text-risk-high">Top priority this week</span>
            </div>
            <h2 className="mt-2 text-lg font-semibold text-white">{topRisk.name}</h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-400">
              {topRisk.poNumber} is {topRisk.fabricationProgress}% fabricated with a{" "}
              {Math.round(topRisk.onTimeProbability * 100)}% chance of arriving on time. Forecast
              lands after the need date — putting {taskById(topRisk.linkedTaskId).name} and
              everything downstream at risk ({currency(topRisk.criticalPathSlipDays * topRisk.costOfDelayPerDay)} exposure).
            </p>
          </div>
        </div>

        <MaterialsBoard />

        <section id="schedule" className="scroll-mt-24">
          <h2 className="mb-3 text-lg font-semibold text-white">Schedule impact</h2>
          <CascadeView materialId={topRisk.id} />
        </section>

        <LogisticsSection />
        <DocumentsSection />
        <SettingsSection assistantLive={assistantLive} />
      </div>

      {/* Right column */}
      <div className="space-y-6">
        <div className="card sticky top-20 h-[560px] overflow-hidden">
          <AssistantPanel />
        </div>
        <PhotoUpload />
      </div>
    </div>
  );
}
