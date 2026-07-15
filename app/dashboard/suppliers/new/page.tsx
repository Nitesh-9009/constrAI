import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { SupplierForm } from "@/components/SupplierForm";
import { createSupplier } from "@/lib/actions/suppliers";

export const metadata = { title: "Add supplier" };

export default function NewSupplierPage() {
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
          <Plus className="h-6 w-6" />
        </span>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Add a supplier
        </h1>
      </div>
      <SupplierForm action={createSupplier} submitLabel="Add supplier" />
    </div>
  );
}
