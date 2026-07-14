import Link from "next/link";
import { Reveal } from "@/components/motion";
import { SimpleBadge } from "@/components/ui";
import { getMaterials } from "@/lib/queries";
import { formatDate, cn } from "@/lib/utils";
import { simpleOf, madeStatusText, latenessText } from "@/lib/plain";
import { Truck, MapPin, ChevronRight } from "lucide-react";

export const metadata = { title: "Deliveries" };

export default async function DeliveriesPage() {
  const all = await getMaterials();
  // soonest arrival first (undated go last)
  const inbound = [...all].sort((a, b) => {
    const ta = a.expectedArrival ? new Date(a.expectedArrival).getTime() : Infinity;
    const tb = b.expectedArrival ? new Date(b.expectedArrival).getTime() : Infinity;
    return ta - tb;
  });

  return (
    <div className="container-luxe max-w-5xl space-y-6 py-6">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-50 text-primary-600">
          <Truck className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Deliveries
          </h1>
          <p className="text-base text-slate-500">What is coming to your site, and when.</p>
        </div>
      </div>

      {inbound.length === 0 && (
        <div className="card p-10 text-center text-sm text-slate-500">
          No deliveries yet. Add a material to start tracking its delivery.
        </div>
      )}

      <div className="space-y-3">
        {inbound.map((m, i) => {
          const tone = simpleOf(m);
          return (
            <Reveal key={m.id} delay={i * 0.05}>
              <Link
                href={`/dashboard/materials/${m.id}`}
                className="card card-hover group flex items-center gap-4 p-4 sm:p-5"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-slate-100 text-slate-500">
                  <Truck className="h-6 w-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-base font-semibold text-slate-900 group-hover:text-primary-700 sm:text-lg">
                    {m.name}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                    <span className="font-medium text-slate-600">{madeStatusText(m.status)}</span>
                    {m.supplier?.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" /> Coming from {m.supplier.location}
                      </span>
                    )}
                  </div>
                </div>
                <div className="hidden shrink-0 text-right sm:block">
                  <p className="text-xs text-slate-400">Arrives</p>
                  <p className="text-base font-semibold text-slate-900">
                    {m.expectedArrival ? formatDate(m.expectedArrival) : "—"}
                  </p>
                  <p
                    className={cn(
                      "text-xs font-semibold",
                      tone === "late"
                        ? "text-danger-600"
                        : tone === "risky"
                        ? "text-warning-600"
                        : "text-success-600"
                    )}
                  >
                    {latenessText(m)}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-slate-300 group-hover:text-primary-500" />
              </Link>
              <div className="mt-2 flex items-center justify-between px-1 sm:hidden">
                <SimpleBadge tone={tone} size="sm" />
                <span className="text-sm font-medium text-slate-600">
                  {m.expectedArrival ? `Arrives ${formatDate(m.expectedArrival)}` : "No date"}
                </span>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
