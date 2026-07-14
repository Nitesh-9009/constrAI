import { cascadeFor, materialById, taskById } from "@/lib/data";
import { cn, currency } from "@/lib/utils";
import { ArrowDown, CalendarClock } from "lucide-react";

export function CascadeView({ materialId }: { materialId: string }) {
  const m = materialById(materialId);
  if (!m) return null;
  const cascade = cascadeFor(materialId);
  const rootTask = taskById(m.linkedTaskId);
  const totalCost = cascade.reduce((s, c) => s + c.slipDays * c.task.costPerDay, 0);

  if (cascade.length === 0) {
    return (
      <div className="card p-5">
        <p className="text-sm text-slate-400">
          No downstream cascade — this material has enough schedule float to absorb its
          current forecast. Kayakalp keeps monitoring.
        </p>
      </div>
    );
  }

  return (
    <div className="card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-risk-high/15 text-risk-high">
            <CalendarClock className="h-4 w-4" />
          </span>
          <h3 className="text-sm font-semibold text-white">Delay cascade (schedule DAG)</h3>
        </div>
        <span className="chip border-risk-high/40 bg-risk-high/10 text-risk-high">
          {currency(totalCost)} exposure
        </span>
      </div>

      <div className="space-y-0">
        {cascade.map((c, i) => (
          <div key={c.task.id}>
            <div
              className={cn(
                "flex items-center justify-between rounded-xl border px-4 py-3",
                i === 0
                  ? "border-risk-high/30 bg-risk-high/5"
                  : "border-ink-700 bg-ink-850/50"
              )}
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">{c.task.name}</p>
                <p className="text-xs text-slate-500">
                  {c.task.crew} · {c.task.critical ? "critical path" : `${c.task.floatDays}d float`}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-risk-high">+{c.slipDays}d</p>
                <p className="text-[11px] text-slate-500">
                  {currency(c.slipDays * c.task.costPerDay)}
                </p>
              </div>
            </div>
            {i < cascade.length - 1 && (
              <div className="flex justify-center py-1">
                <ArrowDown className="h-4 w-4 text-slate-600" />
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-slate-500">
        Root: <span className="text-slate-300">{rootTask.name}</span>. Slip propagated through
        dependent tasks, net of available float.
      </p>
    </div>
  );
}
