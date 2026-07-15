import { Users } from "lucide-react";
import { getTeam } from "@/lib/queries";
import { TeamManager } from "@/components/TeamManager";

export const metadata = { title: "Team" };

export default async function TeamPage() {
  const team = await getTeam();

  return (
    <div className="container-luxe max-w-3xl space-y-6 py-6">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-50 text-primary-600">
          <Users className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Team
          </h1>
          <p className="text-base text-slate-500">The people in your company who can use this.</p>
        </div>
      </div>

      <TeamManager team={team} />
    </div>
  );
}
