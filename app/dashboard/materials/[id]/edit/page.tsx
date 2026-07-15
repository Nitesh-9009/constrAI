import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { MaterialForm } from "@/components/MaterialForm";
import { getMaterial, getSuppliers, getProjects } from "@/lib/queries";
import { updateMaterial, deleteMaterial } from "@/lib/actions/materials";

export const metadata = { title: "Edit material" };

export default async function EditMaterialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [material, suppliers, projects] = await Promise.all([
    getMaterial(id),
    getSuppliers(),
    getProjects(),
  ]);
  if (!material) notFound();

  const updateAction = updateMaterial.bind(null, id);
  const deleteAction = deleteMaterial.bind(null, id);

  return (
    <div className="container-luxe max-w-2xl space-y-6 py-6">
      <Link
        href={`/dashboard/materials/${id}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-50 text-primary-600">
          <Pencil className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Edit material
          </h1>
          <p className="text-base text-slate-500">Update anything that has changed.</p>
        </div>
      </div>

      <MaterialForm
        action={updateAction}
        suppliers={suppliers}
        projects={projects}
        defaults={material}
        submitLabel="Save changes"
      />

      <div className="card flex flex-wrap items-center justify-between gap-3 p-5">
        <div>
          <p className="text-sm font-semibold text-slate-900">Remove this material</p>
          <p className="text-sm text-slate-500">This can&apos;t be undone.</p>
        </div>
        <form action={deleteAction}>
          <button
            type="submit"
            className="btn inline-flex items-center gap-2 border border-danger-500/30 bg-danger-50 text-danger-700 hover:bg-danger-100"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </form>
      </div>
    </div>
  );
}
