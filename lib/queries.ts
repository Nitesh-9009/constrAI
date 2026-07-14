import "server-only";
import { createClient } from "./supabase/server";
import { supabaseConfigured } from "./supabase/config";
import {
  demoVMs,
  rowToVM,
  supRowToVM,
  DEMO_ORG,
  type MaterialVM,
  type OrgInfo,
  type SupplierVM,
} from "./materials";
import type { MaterialRow, SupplierRow } from "./database.types";

/** All materials for the signed-in user's org (or demo data when not configured). */
export async function getMaterials(): Promise<MaterialVM[]> {
  if (!supabaseConfigured) return demoVMs();
  const supabase = await createClient();
  const [{ data: mats }, { data: sups }] = await Promise.all([
    supabase.from("materials").select("*").order("created_at", { ascending: true }),
    supabase.from("suppliers").select("*"),
  ]);
  const supMap = new Map((sups ?? []).map((s: SupplierRow) => [s.id, s]));
  return (mats ?? []).map((m: MaterialRow) =>
    rowToVM(m, m.supplier_id ? supMap.get(m.supplier_id) ?? null : null)
  );
}

export async function getMaterial(id: string): Promise<MaterialVM | null> {
  if (!supabaseConfigured) {
    return demoVMs().find((m) => m.id === id) ?? null;
  }
  const supabase = await createClient();
  const { data: row } = await supabase.from("materials").select("*").eq("id", id).maybeSingle();
  if (!row) return null;
  let sup: SupplierRow | null = null;
  if (row.supplier_id) {
    const { data } = await supabase.from("suppliers").select("*").eq("id", row.supplier_id).maybeSingle();
    sup = data ?? null;
  }
  return rowToVM(row, sup);
}

export async function getSuppliers(): Promise<SupplierVM[]> {
  if (!supabaseConfigured) {
    // Derive from demo materials' suppliers.
    const seen = new Map<string, SupplierVM>();
    for (const m of demoVMs()) if (m.supplier) seen.set(m.supplier.id, m.supplier);
    return [...seen.values()];
  }
  const supabase = await createClient();
  const { data } = await supabase.from("suppliers").select("*").order("name");
  return (data ?? []).map(supRowToVM);
}

export async function getProjects() {
  if (!supabaseConfigured) {
    return [{ id: "demo", name: DEMO_ORG.projectName, location: DEMO_ORG.projectLocation, code: null }];
  }
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("id, name, location, code")
    .order("created_at", { ascending: true });
  return data ?? [];
}

export async function getOrgInfo(): Promise<OrgInfo> {
  if (!supabaseConfigured) return DEMO_ORG;
  const supabase = await createClient();
  const [{ data: orgs }, { data: projects }] = await Promise.all([
    supabase.from("orgs").select("name").limit(1),
    supabase.from("projects").select("name, location").order("created_at").limit(1),
  ]);
  return {
    companyName: orgs?.[0]?.name ?? "My Company",
    projectName: projects?.[0]?.name ?? "My Project",
    projectLocation: projects?.[0]?.location ?? "",
  };
}
