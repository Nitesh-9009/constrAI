"use client";

import { useFormStatus } from "react-dom";
import { useState } from "react";
import Link from "next/link";
import { Loader2, Save } from "lucide-react";
import type { SupplierVM } from "@/lib/materials";
import { isRedirectError } from "@/lib/utils";

const RELIABILITY = [
  { value: "0.9", label: "Usually on time" },
  { value: "0.72", label: "Sometimes late" },
  { value: "0.5", label: "Often late" },
];

function nearestReliability(rate?: number): string {
  if (rate === undefined) return "0.9";
  return RELIABILITY.reduce((best, o) =>
    Math.abs(Number(o.value) - rate) < Math.abs(Number(best.value) - rate) ? o : best
  ).value;
}

export function SupplierForm({
  action,
  defaults,
  submitLabel = "Save",
}: {
  action: (fd: FormData) => void | Promise<void>;
  defaults?: SupplierVM;
  submitLabel?: string;
}) {
  const [error, setError] = useState<string | null>(null);

  async function onAction(fd: FormData) {
    setError(null);
    try {
      await action(fd);
    } catch (e) {
      if (isRedirectError(e)) throw e;
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <form action={onAction} className="card space-y-5 p-6">
      <Field label="Supplier name">
        <input
          name="name"
          required
          defaultValue={defaults?.name}
          placeholder="e.g. Atlas Rebar & Steel"
          className={inputCls}
        />
      </Field>

      <Field label="Where are they?">
        <input
          name="location"
          defaultValue={defaults?.location ?? ""}
          placeholder="e.g. San Antonio, TX"
          className={inputCls}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="How often are they on time?">
          <select
            name="on_time_rate"
            defaultValue={nearestReliability(defaults?.onTimeRate)}
            className={inputCls}
          >
            {RELIABILITY.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Usually takes about (days)">
          <input
            name="avg_lead_days"
            type="number"
            min="0"
            defaultValue={defaults?.avgLeadDays ?? 14}
            className={inputCls}
          />
        </Field>
      </div>

      {error && (
        <p className="rounded-xl border border-danger-500/20 bg-danger-50 px-4 py-2.5 text-sm font-medium text-danger-700">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3 pt-1">
        <SubmitButton label={submitLabel} />
        <Link href="/dashboard/suppliers" className="btn-ghost">
          Cancel
        </Link>
      </div>
    </form>
  );
}

const inputCls =
  "w-full rounded-xl border border-hairline bg-slate-50 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition focus:border-primary-300 focus:bg-white focus:outline-none";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</span>
      {children}
    </label>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary">
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      {label}
    </button>
  );
}
