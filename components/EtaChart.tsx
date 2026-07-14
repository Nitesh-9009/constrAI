"use client";

import {
  Area,
  AreaChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { Material } from "@/lib/types";
import { formatDate } from "@/lib/utils";

/**
 * Renders a probabilistic arrival distribution (a smooth bell around p50)
 * with the "needed by" line — the calibrated ETA interval from the forecaster.
 */
export function EtaChart({ material }: { material: Material }) {
  const p10 = new Date(material.eta.p10).getTime();
  const p50 = new Date(material.eta.p50).getTime();
  const p90 = new Date(material.eta.p90).getTime();
  const need = new Date(material.neededBy).getTime();

  const spread = Math.max(p90 - p10, 1) / 2;
  const start = Math.min(p10, need) - spread * 0.6;
  const end = Math.max(p90, need) + spread * 0.6;

  const points = 48;
  const data = Array.from({ length: points }, (_, i) => {
    const t = start + ((end - start) * i) / (points - 1);
    const z = (t - p50) / spread;
    const density = Math.exp(-0.5 * z * z);
    return { t, density, late: t > need ? density : 0 };
  });

  return (
    <div className="h-40 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 4, left: 8 }}>
          <defs>
            <linearGradient id="etaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563EB" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#2563EB" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="lateFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EF4444" stopOpacity={0.32} />
              <stop offset="100%" stopColor="#EF4444" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="t"
            type="number"
            domain={[start, end]}
            tickFormatter={(v) => formatDate(new Date(v).toISOString())}
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            axisLine={{ stroke: "#e2e8f0" }}
            tickLine={false}
            minTickGap={40}
          />
          <Tooltip
            cursor={{ stroke: "#cbd5e1", strokeDasharray: "4 4" }}
            contentStyle={{
              background: "#ffffff",
              border: "1px solid rgba(15,23,42,0.08)",
              borderRadius: 12,
              fontSize: 12,
              boxShadow: "0 10px 28px -14px rgba(16,24,40,0.24)",
            }}
            labelFormatter={(v) => formatDate(new Date(v as number).toISOString(), { weekday: "short" })}
            formatter={() => ["", ""]}
          />
          <Area
            type="monotone"
            dataKey="density"
            stroke="#2563EB"
            strokeWidth={2}
            fill="url(#etaFill)"
            isAnimationActive
          />
          <Area
            type="monotone"
            dataKey="late"
            stroke="#EF4444"
            strokeWidth={0}
            fill="url(#lateFill)"
            isAnimationActive
          />
          <ReferenceLine
            x={need}
            stroke="#EF4444"
            strokeDasharray="5 4"
            label={{
              value: `Need ${formatDate(material.neededBy)}`,
              position: "insideTopRight",
              fill: "#EF4444",
              fontSize: 11,
            }}
          />
          <ReferenceLine x={p50} stroke="#2563EB" strokeDasharray="2 3" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
