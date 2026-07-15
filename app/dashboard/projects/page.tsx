import Link from "next/link";
import { FolderKanban, Plus, MapPin, Pencil } from "lucide-react";
import { Reveal } from "@/components/motion";
import { getProjects } from "@/lib/queries";

export const metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="container-luxe max-w-4xl space-y-6 py-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-50 text-primary-600">
            <FolderKanban className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Projects
            </h1>
            <p className="text-base text-slate-500">Your building sites.</p>
          </div>
        </div>
        <Link href="/dashboard/projects/new" className="btn-primary">
          <Plus className="h-4 w-4" /> Add project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="card grid place-items-center gap-3 p-12 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-50 text-primary-600">
            <FolderKanban className="h-7 w-7" />
          </span>
          <p className="text-lg font-semibold text-slate-900">No projects yet</p>
          <Link href="/dashboard/projects/new" className="btn-primary mt-2">
            <Plus className="h-4 w-4" /> Add your first project
          </Link>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {projects.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.04}>
              <div className="card card-hover flex items-start gap-3 p-5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-slate-100 text-slate-500">
                  <FolderKanban className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-base font-semibold text-slate-900">{p.name}</h3>
                  <p className="mt-0.5 flex items-center gap-1 text-sm text-slate-500">
                    {p.location && (
                      <>
                        <MapPin className="h-3.5 w-3.5" /> {p.location}
                      </>
                    )}
                  </p>
                  {p.code && <p className="mt-1 font-mono text-xs text-slate-400">{p.code}</p>}
                </div>
                {p.id !== "demo" && (
                  <Link
                    href={`/dashboard/projects/${p.id}/edit`}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-hairline bg-white text-slate-500 shadow-soft transition hover:text-primary-600"
                    aria-label={`Edit ${p.name}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
