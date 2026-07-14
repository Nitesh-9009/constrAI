import { cn } from "@/lib/utils";
import { Material, Risk, riskOf } from "@/lib/types";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 font-semibold", className)}>
      <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-800 text-white shadow-glow">
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
          <path
            d="M4 20V9l8-5 8 5v11"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 20v-6h6v6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="text-lg tracking-tight text-slate-900">
        Constr<span className="text-primary-600">AI</span>
      </span>
    </span>
  );
}

const riskStyles: Record<Risk, string> = {
  high: "border-danger-500/25 bg-danger-50 text-danger-700",
  medium: "border-warning-500/25 bg-warning-50 text-warning-700",
  low: "border-success-500/25 bg-success-50 text-success-700",
};

const riskDot: Record<Risk, string> = {
  high: "bg-danger-500",
  medium: "bg-warning-500",
  low: "bg-success-500",
};

const riskLabel: Record<Risk, string> = {
  high: "High risk",
  medium: "At risk",
  low: "On track",
};

export function RiskBadge({ risk, className }: { risk: Risk; className?: string }) {
  return (
    <span className={cn("chip", riskStyles[risk], className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", riskDot[risk])} />
      {riskLabel[risk]}
    </span>
  );
}

const statusStyles: Record<string, string> = {
  submitted: "border-slate-200 bg-slate-50 text-slate-600",
  approved: "border-sky-200 bg-sky-50 text-sky-700",
  ordered: "border-indigo-200 bg-indigo-50 text-indigo-700",
  fabricating: "border-warning-500/25 bg-warning-50 text-warning-700",
  in_transit: "border-cyan-200 bg-cyan-50 text-cyan-700",
  delivered: "border-success-500/25 bg-success-50 text-success-700",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span className={cn("chip capitalize", statusStyles[status] ?? statusStyles.submitted)}>
      {status.replace("_", " ")}
    </span>
  );
}

export function ProgressBar({
  value,
  className,
  tone = "brand",
}: {
  value: number;
  className?: string;
  tone?: "brand" | "amber" | "risk";
}) {
  const toneClass =
    tone === "risk"
      ? "bg-danger-500"
      : tone === "amber"
      ? "bg-warning-500"
      : "bg-gradient-to-r from-primary-500 to-primary-600";
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-slate-100", className)}>
      <div
        className={cn("h-full rounded-full transition-all duration-500", toneClass)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

/** Small pill used to label metrics / provenance. */
export function Chip({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("chip border-hairline bg-slate-50 text-slate-600", className)}>
      {children}
    </span>
  );
}

/** Enterprise KPI card used across the bento dashboard. */
export function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  tone = "slate",
  className,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "slate" | "primary" | "success" | "warning" | "danger";
  className?: string;
}) {
  const tones: Record<string, { icon: string; ring: string; value: string }> = {
    slate: { icon: "text-slate-500 bg-slate-100", ring: "", value: "text-slate-900" },
    primary: { icon: "text-primary-600 bg-primary-50", ring: "", value: "text-slate-900" },
    success: { icon: "text-success-600 bg-success-50", ring: "", value: "text-success-700" },
    warning: { icon: "text-warning-600 bg-warning-50", ring: "", value: "text-warning-700" },
    danger: { icon: "text-danger-600 bg-danger-50", ring: "", value: "text-danger-700" },
  };
  const t = tones[tone];
  return (
    <div className={cn("card card-hover p-5", className)}>
      <div className="flex items-center justify-between">
        <span className="label-muted">{label}</span>
        <span className={cn("grid h-9 w-9 place-items-center rounded-xl", t.icon)}>
          <Icon className="h-4.5 w-4.5" />
        </span>
      </div>
      <p className={cn("mt-3 text-3xl font-semibold tracking-tight tabular-nums", t.value)}>
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
    </div>
  );
}

/** Loading skeleton block. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-gradient-to-r from-slate-100 via-slate-200/70 to-slate-100 bg-[length:200%_100%]",
        className
      )}
    />
  );
}

export function riskFor(m: Material) {
  return riskOf(m);
}
