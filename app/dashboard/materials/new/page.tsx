import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { MaterialForm } from "@/components/MaterialForm";
import { getSuppliers, getProjects, getActiveProjectId } from "@/lib/queries";
import { createMaterial } from "@/lib/actions/materials";

export const metadata = { title: "Add material" };

export default async function NewMaterialPage() {
  const [suppliers, projects, activeProjectId] = await Promise.all([
    getSuppliers(),
    getProjects(),
    getActiveProjectId(),
  ]);

  return (
    <div className="container-luxe max-w-2xl space-y-6 py-6">
      <Link
        href="/dashboard/materials"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" /> Back to my materials
      </Link>

      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-50 text-primary-600">
          <Plus className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Add a material
          </h1>
          <p className="text-base text-slate-500">Fill in what you know. You can change it later.</p>
        </div>
      </div>

      <MaterialForm
        action={createMaterial}
        suppliers={suppliers}
        projects={projects}
        defaultProjectId={activeProjectId}
        submitLabel="Add material"
      />
    </div>
  );
}
