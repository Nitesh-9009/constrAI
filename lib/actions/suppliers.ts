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
  const num = (k: string, d: number) => {
    const v = str(k);
    const n = v ? Number(v) : NaN;
    return Number.isFinite(n) ? n : d;
  };
  return {
    name: str("name"),
    location: str("location") || null,
    on_time_rate: Math.min(1, Math.max(0, num("on_time_rate", 0.8))),
    avg_lead_days: Math.max(0, Math.round(num("avg_lead_days", 14))),
  };
}

export async function createSupplier(fd: FormData) {
  if (!supabaseConfigured) redirect("/dashboard/suppliers");
  const { supabase, orgId } = await getOrgId();
  if (!orgId) throw new Error("We couldn't find your account. Please log in again.");
  const values = readForm(fd);
  if (!values.name) throw new Error("Please enter the supplier's name.");
  const { error } = await supabase.from("suppliers").insert({ org_id: orgId, ...values });
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/suppliers");
  redirect("/dashboard/suppliers");
}

export async function updateSupplier(id: string, fd: FormData) {
  if (!supabaseConfigured) redirect("/dashboard/suppliers");
  const supabase = await createClient();
  const values = readForm(fd);
  if (!values.name) throw new Error("Please enter the supplier's name.");
  const { error } = await supabase.from("suppliers").update(values).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/suppliers");
  redirect("/dashboard/suppliers");
}

export async function deleteSupplier(id: string) {
  if (!supabaseConfigured) redirect("/dashboard/suppliers");
  const supabase = await createClient();
  const { error } = await supabase.from("suppliers").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/suppliers");
  redirect("/dashboard/suppliers");
}
