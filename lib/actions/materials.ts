"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/config";
import { daysBetween } from "@/lib/utils";

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

  const need_by = str("need_by") || null;
  const expected_arrival = str("expected_arrival") || null;

  // Derive the technical fields from the plain inputs so users never see jargon.
  let on_time_probability = 0.8;
  let building_delay_days = 0;
  if (need_by && expected_arrival) {
    const late = daysBetween(need_by, expected_arrival);
    building_delay_days = Math.max(0, late);
    on_time_probability = late > 0 ? 0.3 : late === 0 ? 0.6 : 0.9;
  }

  return {
    name: str("name"),
    unit: str("unit") || "units",
    qty: num("qty", 1),
    status: str("status") || "ordered",
    supplier_id: str("supplier_id") || null,
    need_by,
    expected_arrival,
    paperwork: str("paperwork") || "approved",
    cost_of_delay_per_day: num("cost_of_delay_per_day", 0),
    location: str("location") || null,
    notes: str("notes") || null,
    on_time_probability,
    building_delay_days,
  };
}

export async function createMaterial(fd: FormData) {
  if (!supabaseConfigured) redirect("/dashboard/materials");
  const { supabase, orgId } = await getOrgId();
  if (!orgId) throw new Error("We couldn't find your account. Please log in again.");
  const values = readForm(fd);
  if (!values.name) throw new Error("Please enter what the material is.");
  const { error } = await supabase.from("materials").insert({ org_id: orgId, ...values });
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/materials");
  redirect("/dashboard/materials");
}

export async function updateMaterial(id: string, fd: FormData) {
  if (!supabaseConfigured) redirect("/dashboard/materials");
  const supabase = await createClient();
  const values = readForm(fd);
  if (!values.name) throw new Error("Please enter what the material is.");
  const { error } = await supabase.from("materials").update(values).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/materials");
  revalidatePath(`/dashboard/materials/${id}`);
  redirect(`/dashboard/materials/${id}`);
}

export async function deleteMaterial(id: string) {
  if (!supabaseConfigured) redirect("/dashboard/materials");
  const supabase = await createClient();
  const { error } = await supabase.from("materials").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/materials");
  redirect("/dashboard/materials");
}
