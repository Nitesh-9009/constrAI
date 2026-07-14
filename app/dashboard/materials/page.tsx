import { MaterialList } from "@/components/MaterialList";
import { Reveal } from "@/components/motion";
import { getMaterials } from "@/lib/queries";
import { simpleOf } from "@/lib/plain";
import { Boxes, Plus } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "My Materials" };

export default async function MaterialsPage() {
  const items = await getMaterials();
  const late = items.filter((m) => simpleOf(m) !== "good").length;

  return (
    <div className="container-luxe max-w-5xl space-y-6 py-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-50 text-primary-600">
            <Boxes className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              My Materials
            </h1>
            <p className="text-base text-slate-500">
              Every order you are waiting for, in one place.
            </p>
          </div>
        </div>
        <Link href="/dashboard/materials/new" className="btn-primary">
          <Plus className="h-4 w-4" /> Add material
        </Link>
      </div>

      {late > 0 && (
        <p className="rounded-2xl border border-warning-500/20 bg-warning-50 px-4 py-3 text-sm font-medium text-warning-700">
          {late} order{late > 1 ? "s need" : " needs"} your attention. Tap any order to see what to do.
        </p>
      )}

      {items.length === 0 ? (
        <div className="card grid place-items-center gap-3 p-12 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-50 text-primary-600">
            <Boxes className="h-7 w-7" />
          </span>
          <p className="text-lg font-semibold text-slate-900">No materials yet</p>
          <p className="text-sm text-slate-500">Add your first order to start tracking it.</p>
          <Link href="/dashboard/materials/new" className="btn-primary mt-2">
            <Plus className="h-4 w-4" /> Add your first material
          </Link>
        </div>
      ) : (
        <Reveal>
          <MaterialList items={items} />
        </Reveal>
      )}
    </div>
  );
}
