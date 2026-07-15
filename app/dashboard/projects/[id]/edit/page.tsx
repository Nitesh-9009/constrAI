import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { ProjectForm } from "@/components/ProjectForm";
import { getProject } from "@/lib/queries";
import { updateProject, deleteProject } from "@/lib/actions/projects";

export const metadata = { title: "Edit project" };

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  const updateAction = updateProject.bind(null, id);
  const deleteAction = deleteProject.bind(null, id);

  return (
    <div className="container-luxe max-w-2xl space-y-6 py-6">
      <Link
        href="/dashboard/projects"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" /> Back to projects
      </Link>
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-50 text-primary-600">
          <Pencil className="h-6 w-6" />
        </span>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Edit project
        </h1>
      </div>

      <ProjectForm action={updateAction} defaults={project} submitLabel="Save changes" />

      <div className="card flex flex-wrap items-center justify-between gap-3 p-5">
        <div>
          <p className="text-sm font-semibold text-slate-900">Remove this project</p>
          <p className="text-sm text-slate-500">Materials in it will stay, without a project.</p>
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
