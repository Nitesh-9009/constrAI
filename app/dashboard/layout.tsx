import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { FloatingAssistant } from "@/components/FloatingAssistant";
import { getMaterials, getOrgInfo } from "@/lib/queries";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [items, org] = await Promise.all([getMaterials(), getOrgInfo()]);

  return (
    <div className="flex min-h-screen">
      <Sidebar org={org} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar items={items} org={org} />
        <main className="flex-1">{children}</main>
      </div>
      <FloatingAssistant />
    </div>
  );
}
