import { Bell } from "lucide-react";
import { getMaterials } from "@/lib/queries";
import { AlertsList } from "@/components/AlertsList";

export const metadata = { title: "Needs Attention" };

export default async function AlertsPage() {
  const items = await getMaterials();

  return (
    <div className="container-luxe max-w-4xl space-y-6 py-6">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-danger-50 text-danger-600">
          <Bell className="h-6 w-6" />
        </span>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Needs Attention
        </h1>
      </div>

      <AlertsList items={items} />
    </div>
  );
}
