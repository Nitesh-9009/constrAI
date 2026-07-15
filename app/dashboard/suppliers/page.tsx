import Link from "next/link";
import { Building2, Plus, MapPin, Pencil } from "lucide-react";
import { Reveal } from "@/components/motion";
import { SimpleBadge } from "@/components/ui";
import { getSuppliers } from "@/lib/queries";
import { supplierText, supplierTone } from "@/lib/plain";

export const metadata = { title: "Suppliers" };

export default async function SuppliersPage() {
  const suppliers = await getSuppliers();

  return (
    <div className="container-luxe max-w-4xl space-y-6 py-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-50 text-primary-600">
            <Building2 className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Suppliers
            </h1>
            <p className="text-base text-slate-500">The companies that make and deliver your stuff.</p>
          </div>
        </div>
        <Link href="/dashboard/suppliers/new" className="btn-primary">
          <Plus className="h-4 w-4" /> Add supplier
        </Link>
      </div>

      {suppliers.length === 0 ? (
        <div className="card grid place-items-center gap-3 p-12 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-50 text-primary-600">
            <Building2 className="h-7 w-7" />
          </span>
          <p className="text-lg font-semibold text-slate-900">No suppliers yet</p>
          <p className="text-sm text-slate-500">Add the companies you order from.</p>
          <Link href="/dashboard/suppliers/new" className="btn-primary mt-2">
            <Plus className="h-4 w-4" /> Add your first supplier
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {suppliers.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.04}>
              <div className="card card-hover flex items-center gap-4 p-4 sm:p-5">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-slate-100 text-slate-500">
                  <Building2 className="h-6 w-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-base font-semibold text-slate-900 sm:text-lg">
                    {s.name}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                    {s.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" /> {s.location}
                      </span>
                    )}
                    <span>Usually takes about {s.avgLeadDays} days</span>
                  </div>
                </div>
                <div className="hidden shrink-0 sm:block">
                  <SimpleBadge tone={supplierTone(s.onTimeRate)} size="sm" />
                  <p className="mt-1 text-right text-xs text-slate-400">
                    {supplierText(s.onTimeRate)}
                  </p>
                </div>
                <Link
                  href={`/dashboard/suppliers/${s.id}/edit`}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-hairline bg-white text-slate-500 shadow-soft transition hover:text-primary-600"
                  aria-label={`Edit ${s.name}`}
                >
                  <Pencil className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
