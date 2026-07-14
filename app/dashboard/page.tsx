import Link from "next/link";
import { PhotoUpload } from "@/components/PhotoUpload";
import { SimpleBadge } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { materials, supplierById, PROJECT } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import {
  simpleOf,
  latenessText,
  madeStatus,
  whatToDo,
  buildingDelayText,
} from "@/lib/plain";
import {
  AlertTriangle,
  Clock3,
  CheckCircle2,
  ArrowRight,
  Sun,
  Boxes,
  Truck,
  MessageCircleQuestion,
  ChevronRight,
} from "lucide-react";

export default function TodayPage() {
  const sorted = [...materials].sort(
    (a, b) =>
      b.criticalPathSlipDays * b.costOfDelayPerDay -
      a.criticalPathSlipDays * a.costOfDelayPerDay
  );
  const late = sorted.filter((m) => simpleOf(m) === "late");
  const risky = sorted.filter((m) => simpleOf(m) === "risky");
  const good = sorted.filter((m) => simpleOf(m) === "good");
  const topFix = late[0] ?? risky[0];
  const fixSupplier = topFix ? supplierById(topFix.supplierId) : null;

  const hour = new Date(PROJECT.today).getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="container-luxe max-w-5xl space-y-6 py-6">
      {/* Greeting */}
      <div>
        <p className="text-sm font-medium text-slate-400">
          {new Date(PROJECT.today).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          {greeting} 👷
        </h1>
        <p className="mt-1 text-base text-slate-500">
          Here is how your materials look today at {PROJECT.name}.
        </p>
      </div>

      {/* Three big status tiles */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Reveal delay={0}>
          <StatusTile
            href="/dashboard/materials"
            count={good.length}
            label="On time"
            help="Nothing to worry about"
            icon={CheckCircle2}
            tone="good"
          />
        </Reveal>
        <Reveal delay={0.05}>
          <StatusTile
            href="/dashboard/alerts"
            count={risky.length}
            label="Might be late"
            help="Keep an eye on these"
            icon={Clock3}
            tone="risky"
          />
        </Reveal>
        <Reveal delay={0.1}>
          <StatusTile
            href="/dashboard/alerts"
            count={late.length}
            label="Running late"
            help="Do something now"
            icon={AlertTriangle}
            tone="late"
          />
        </Reveal>
      </div>

      {/* Fix this first */}
      {topFix && fixSupplier && (
        <Reveal delay={0.05}>
          <div className="card overflow-hidden">
            <div className="flex items-center gap-2 border-b border-hairline bg-danger-50/60 px-6 py-3">
              <AlertTriangle className="h-5 w-5 text-danger-600" />
              <p className="text-sm font-bold uppercase tracking-wide text-danger-700">
                Fix this first today
              </p>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap items-center gap-3">
                <SimpleBadge tone={simpleOf(topFix)} size="lg" />
                <span className="text-sm font-semibold text-slate-500">{latenessText(topFix)}</span>
              </div>
              <h2 className="mt-3 text-xl font-semibold text-slate-900">{topFix.name}</h2>
              <p className="mt-2 max-w-2xl text-base leading-relaxed text-slate-600">
                It is <b>{madeStatus[topFix.status].toLowerCase()}</b>, and you need it by{" "}
                <b>{formatDate(topFix.neededBy)}</b>. {buildingDelayText(topFix)}.
              </p>

              <div className="mt-4 flex items-start gap-3 rounded-2xl border border-primary-200 bg-primary-50/60 p-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary-600 text-white">
                  <ArrowRight className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-bold text-primary-800">What to do</p>
                  <p className="text-sm text-slate-700">
                    {whatToDo(topFix, fixSupplier.name) ?? "Keep watching this order."}
                  </p>
                </div>
              </div>

              <Link
                href={`/dashboard/materials/${topFix.id}`}
                className="btn-primary mt-5 text-base"
              >
                See full details <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      )}

      {/* Weather + quick links */}
      <div className="grid gap-4 md:grid-cols-2">
        <Reveal delay={0}>
          <div className="card card-hover flex items-center gap-4 p-5">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-warning-50 text-warning-500">
              <Sun className="h-7 w-7" />
            </span>
            <div>
              <p className="text-base font-semibold text-slate-900">Good weather for work</p>
              <p className="text-sm text-slate-500">
                {PROJECT.location} · Sunny, 94°F. No rain expected today.
              </p>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <div className="card p-5">
            <p className="label-muted">Go to</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <QuickLink href="/dashboard/materials" icon={Boxes} label="Materials" />
              <QuickLink href="/dashboard/deliveries" icon={Truck} label="Deliveries" />
              <QuickLink href="/dashboard/help" icon={MessageCircleQuestion} label="Get help" />
            </div>
          </div>
        </Reveal>
      </div>

      {/* Photo update */}
      <Reveal delay={0}>
        <PhotoUpload />
      </Reveal>
    </div>
  );
}

function StatusTile({
  href,
  count,
  label,
  help,
  icon: Icon,
  tone,
}: {
  href: string;
  count: number;
  label: string;
  help: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: "good" | "risky" | "late";
}) {
  const styles = {
    good: "bg-success-50 text-success-600 border-success-500/20",
    risky: "bg-warning-50 text-warning-600 border-warning-500/20",
    late: "bg-danger-50 text-danger-600 border-danger-500/20",
  }[tone];
  const num = {
    good: "text-success-700",
    risky: "text-warning-700",
    late: "text-danger-700",
  }[tone];
  return (
    <Link href={href} className="card card-hover block p-5">
      <div className="flex items-center justify-between">
        <span className={`grid h-11 w-11 place-items-center rounded-2xl border ${styles}`}>
          <Icon className="h-6 w-6" />
        </span>
        <span className={`text-4xl font-bold tabular-nums ${num}`}>{count}</span>
      </div>
      <p className="mt-3 text-lg font-semibold text-slate-900">{label}</p>
      <p className="text-sm text-slate-500">{help}</p>
    </Link>
  );
}

function QuickLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-2 rounded-2xl border border-hairline bg-slate-50 p-4 text-center transition hover:border-primary-200 hover:bg-primary-50/50"
    >
      <Icon className="h-6 w-6 text-primary-600" />
      <span className="text-xs font-semibold text-slate-700">{label}</span>
    </Link>
  );
}
