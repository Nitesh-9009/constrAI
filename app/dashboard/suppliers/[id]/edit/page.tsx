import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { SupplierForm } from "@/components/SupplierForm";
import { getSupplier } from "@/lib/queries";
import { updateSupplier, deleteSupplier } from "@/lib/actions/suppliers";

export const metadata = { title: "Edit supplier" };

export default async function EditSupplierPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supplier = await getSupplier(id);
  if (!supplier) notFound();

  const updateAction = updateSupplier.bind(null, id);
  const deleteAction = deleteSupplier.bind(null, id);

  return (
    <div className="container-luxe max-w-2xl space-y-6 py-6">
      <Link
        href="/dashboard/suppliers"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" /> Back to suppliers
      </Link>
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-50 text-primary-600">
          <Pencil className="h-6 w-6" />
        </span>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Edit supplier
        </h1>
      </div>

      <SupplierForm action={updateAction} defaults={supplier} submitLabel="Save changes" />

      <div className="card flex flex-wrap items-center justify-between gap-3 p-5">
        <div>
          <p className="text-sm font-semibold text-slate-900">Remove this supplier</p>
          <p className="text-sm text-slate-500">Materials made by them will stay, without a supplier.</p>
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
