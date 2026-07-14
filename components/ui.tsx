import { cn } from "@/lib/utils";
import { Material, Risk, riskOf } from "@/lib/types";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 font-semibold", className)}>
      <span className="relative grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 text-ink-950 shadow-glow">
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
      <span className="text-lg tracking-tight text-white">
        Kayakalp
      </span>
    </span>
  );
}

const riskStyles: Record<Risk, string> = {
  high: "border-risk-high/40 bg-risk-high/10 text-risk-high",
  medium: "border-risk-med/40 bg-risk-med/10 text-risk-med",
  low: "border-risk-low/40 bg-risk-low/10 text-risk-low",
};

const riskLabel: Record<Risk, string> = {
  high: "High risk",
  medium: "At risk",
  low: "On track",
};

export function RiskBadge({ risk, className }: { risk: Risk; className?: string }) {
  return (
    <span className={cn("chip", riskStyles[risk], className)}>
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          risk === "high" && "bg-risk-high",
          risk === "medium" && "bg-risk-med",
          risk === "low" && "bg-risk-low"
        )}
      />
      {riskLabel[risk]}
    </span>
  );
}

const statusStyles: Record<string, string> = {
  submitted: "border-slate-500/30 bg-slate-500/10 text-slate-300",
  approved: "border-sky-500/30 bg-sky-500/10 text-sky-300",
  ordered: "border-indigo-500/30 bg-indigo-500/10 text-indigo-300",
  fabricating: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  in_transit: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
  delivered: "border-brand-500/30 bg-brand-500/10 text-brand-300",
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
      ? "bg-risk-high"
      : tone === "amber"
      ? "bg-risk-med"
      : "bg-brand-500";
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-ink-700", className)}>
      <div
        className={cn("h-full rounded-full transition-all", toneClass)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function riskFor(m: Material) {
  return riskOf(m);
}
