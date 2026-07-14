import { Material } from "@/lib/types";
import { simpleOf } from "@/lib/plain";
import { formatDate, daysBetween } from "@/lib/utils";
import { Truck, Flag } from "lucide-react";

/**
 * A dead-simple visual: a line from today to a bit past the dates, with two
 * markers — when you NEED it, and when it will ARRIVE. Green if it lands in
 * time, red if it lands late. No statistics, no jargon.
 */
export function ArrivalBar({ material }: { material: Material }) {
  const tone = simpleOf(material);
  const need = new Date(material.neededBy).getTime();
  const arrive = new Date(material.eta.p50).getTime();

  const min = Math.min(need, arrive);
  const max = Math.max(need, arrive);
  const pad = Math.max((max - min) * 0.6, 2 * 24 * 3600 * 1000);
  const start = min - pad;
  const end = max + pad;
  const span = end - start || 1;

  const needPct = ((need - start) / span) * 100;
  const arrivePct = ((arrive - start) / span) * 100;
  const late = arrive > need;

  return (
    <div className="pt-8 pb-10">
      <div className="relative h-2 rounded-full bg-slate-100">
        {/* filled region between need & arrive */}
        <div
          className={`absolute top-0 h-2 rounded-full ${late ? "bg-danger-200" : "bg-success-200"}`}
          style={{
            left: `${Math.min(needPct, arrivePct)}%`,
            width: `${Math.abs(arrivePct - needPct)}%`,
          }}
        />

        {/* Needed marker */}
        <Marker
          pct={needPct}
          color="text-slate-700"
          dot="bg-slate-700"
          topLabel="You need it"
          bottomLabel={formatDate(material.neededBy)}
          icon={<Flag className="h-3.5 w-3.5" />}
        />

        {/* Arriving marker */}
        <Marker
          pct={arrivePct}
          color={late ? "text-danger-600" : "text-success-600"}
          dot={late ? "bg-danger-500" : "bg-success-500"}
          topLabel="Will arrive"
          bottomLabel={formatDate(material.eta.p50)}
          icon={<Truck className="h-3.5 w-3.5" />}
          below
        />
      </div>

      <p
        className={`mt-8 text-center text-sm font-semibold ${
          tone === "late" ? "text-danger-600" : tone === "risky" ? "text-warning-600" : "text-success-600"
        }`}
      >
        {late
          ? `This will arrive after you need it — ${daysBetween(material.neededBy, material.eta.p50)} day(s) late.`
          : "This should arrive in time for the crew."}
      </p>
    </div>
  );
}

function Marker({
  pct,
  color,
  dot,
  topLabel,
  bottomLabel,
  icon,
  below = false,
}: {
  pct: number;
  color: string;
  dot: string;
  topLabel: string;
  bottomLabel: string;
  icon: React.ReactNode;
  below?: boolean;
}) {
  return (
    <div
      className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${Math.max(4, Math.min(96, pct))}%` }}
    >
      <span className={`grid h-6 w-6 place-items-center rounded-full ${dot} text-white ring-4 ring-white`}>
        {icon}
      </span>
      <div
        className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-center ${
          below ? "top-8" : "-top-9"
        }`}
      >
        <p className={`text-xs font-semibold ${color}`}>{topLabel}</p>
        <p className="text-[11px] text-slate-400">{bottomLabel}</p>
      </div>
    </div>
  );
}
