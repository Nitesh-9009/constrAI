"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/config";

async function getOrgId() {
  const supabase = await createClient();
  const { data } = await supabase.from("orgs").select("id").limit(1).maybeSingle();
  return { supabase, orgId: data?.id ?? null };
}

function readForm(fd: FormData) {
  const str = (k: string) => {
    const v = fd.get(k);
    return v ? String(v).trim() : "";
  };
  return {
    name: str("name"),
    location: str("location") || null,
    code: str("code") || null,
  };
}

export async function createProject(fd: FormData) {
  if (!supabaseConfigured) redirect("/dashboard/projects");
  const { supabase, orgId } = await getOrgId();
  if (!orgId) throw new Error("We couldn't find your account. Please log in again.");
  const values = readForm(fd);
  if (!values.name) throw new Error("Please enter the project name.");
  const { error } = await supabase.from("projects").insert({ org_id: orgId, ...values });
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/projects");
  redirect("/dashboard/projects");
}

export async function updateProject(id: string, fd: FormData) {
  if (!supabaseConfigured) redirect("/dashboard/projects");
  const supabase = await createClient();
  const values = readForm(fd);
  if (!values.name) throw new Error("Please enter the project name.");
  const { error } = await supabase.from("projects").update(values).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/projects");
  redirect("/dashboard/projects");
}

export async function deleteProject(id: string) {
  if (!supabaseConfigured) redirect("/dashboard/projects");
  const supabase = await createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/projects");
  redirect("/dashboard/projects");
}
