"use client";

import { useFormStatus } from "react-dom";
import { useState } from "react";
import Link from "next/link";
import { Loader2, Save } from "lucide-react";
import type { MaterialVM, SupplierVM } from "@/lib/materials";

const STATUS_OPTIONS = [
  { value: "ordered", label: "Order placed" },
  { value: "approved", label: "Order approved" },
  { value: "fabricating", label: "Being made" },
  { value: "in_transit", label: "On the way" },
  { value: "delivered", label: "Arrived" },
];

const PAPER_OPTIONS = [
  { value: "approved", label: "Papers approved" },
  { value: "pending", label: "Waiting for approval" },
  { value: "revise_resubmit", label: "Papers not approved yet" },
];

export function MaterialForm({
  action,
  suppliers,
  defaults,
  submitLabel = "Save",
}: {
  action: (fd: FormData) => void | Promise<void>;
  suppliers: SupplierVM[];
  defaults?: MaterialVM;
  submitLabel?: string;
}) {
  const [error, setError] = useState<string | null>(null);

  async function onAction(fd: FormData) {
    setError(null);
    try {
      await action(fd);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <form action={onAction} className="card space-y-5 p-6">
      <Field label="What is it?" hint="For example: Steel rebar, Concrete, Windows">
        <input
          name="name"
          required
          defaultValue={defaults?.name}
          placeholder="Type the material name"
          className={inputCls}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="How much?">
          <div className="flex gap-2">
            <input
              name="qty"
              type="number"
              step="any"
              min="0"
              defaultValue={defaults?.qty ?? 1}
              className={inputCls}
            />
            <input
              name="unit"
              defaultValue={defaults?.unit ?? "units"}
              placeholder="units"
              className={`${inputCls} max-w-[8rem]`}
            />
          </div>
        </Field>

        <Field label="Who is making it?">
          <select name="supplier_id" defaultValue={defaults?.supplier?.id ?? ""} className={inputCls}>
            <option value="">— Choose a supplier —</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="When do you need it?">
          <input
            name="need_by"
            type="date"
            defaultValue={defaults?.needBy ?? ""}
            className={inputCls}
          />
        </Field>
        <Field label="When should it arrive?">
          <input
            name="expected_arrival"
            type="date"
            defaultValue={defaults?.expectedArrival ?? ""}
            className={inputCls}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Where does it go?">
          <input
            name="location"
            defaultValue={defaults?.location ?? ""}
            placeholder="e.g. Level 3 slab"
            className={inputCls}
          />
        </Field>
        <Field label="Money lost each day it is late" hint="Optional">
          <input
            name="cost_of_delay_per_day"
            type="number"
            min="0"
            step="any"
            defaultValue={defaults?.costOfDelayPerDay ?? 0}
            className={inputCls}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Where is it now?">
          <select name="status" defaultValue={defaults?.status ?? "ordered"} className={inputCls}>
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Paperwork">
          <select name="paperwork" defaultValue={defaults?.paperwork ?? "approved"} className={inputCls}>
            {PAPER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Notes" hint="Anything worth remembering">
        <textarea
          name="notes"
          rows={3}
          defaultValue={defaults?.notes ?? ""}
          placeholder="Optional"
          className={inputCls}
        />
      </Field>

      {error && (
        <p className="rounded-xl border border-danger-500/20 bg-danger-50 px-4 py-2.5 text-sm font-medium text-danger-700">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3 pt-1">
        <SubmitButton label={submitLabel} />
        <Link href="/dashboard/materials" className="btn-ghost">
          Cancel
        </Link>
      </div>
    </form>
  );
}

const inputCls =
  "w-full rounded-xl border border-hairline bg-slate-50 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition focus:border-primary-300 focus:bg-white focus:outline-none";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700">{label}</span>
        {hint && <span className="text-xs text-slate-400">{hint}</span>}
      </span>
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
