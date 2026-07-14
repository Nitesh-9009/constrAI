import { MaterialList } from "@/components/MaterialList";
import { Reveal } from "@/components/motion";
import { materials } from "@/lib/data";
import { simpleOf } from "@/lib/plain";
import { Boxes } from "lucide-react";

export const metadata = { title: "My Materials" };

export default function MaterialsPage() {
  const late = materials.filter((m) => simpleOf(m) !== "good").length;

  return (
    <div className="container-luxe max-w-5xl space-y-6 py-6">
      <div>
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
        {late > 0 && (
          <p className="mt-3 rounded-2xl border border-warning-500/20 bg-warning-50 px-4 py-3 text-sm font-medium text-warning-700">
            {late} order{late > 1 ? "s need" : " needs"} your attention. Tap any order to see what to do.
          </p>
        )}
      </div>

      <Reveal>
        <MaterialList />
      </Reveal>
    </div>
  );
}
