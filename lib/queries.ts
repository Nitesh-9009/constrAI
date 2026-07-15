import "server-only";
import { cookies } from "next/headers";
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

export const ACTIVE_PROJECT_COOKIE = "constrai_project";

/**
 * The project the user is currently viewing (null = all projects).
 * Validated against the user's own projects so a stale cookie from a previous
 * user/session can never hide the current user's data.
 */
export async function getActiveProjectId(): Promise<string | null> {
  const store = await cookies();
  const v = store.get(ACTIVE_PROJECT_COOKIE)?.value;
  if (!v || v === "all") return null;
  if (!supabaseConfigured) return v;
  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("id").eq("id", v).maybeSingle();
  return data ? v : null;
}

/** All materials for the signed-in user's org, filtered to the active project. */
export async function getMaterials(): Promise<MaterialVM[]> {
  if (!supabaseConfigured) return demoVMs();
  const supabase = await createClient();
  const activeProject = await getActiveProjectId();

  let query = supabase.from("materials").select("*").order("created_at", { ascending: true });
  if (activeProject) query = query.eq("project_id", activeProject);

  const [{ data: mats }, { data: sups }, { data: projs }] = await Promise.all([
    query,
    supabase.from("suppliers").select("*"),
    supabase.from("projects").select("id, name"),
  ]);
  const supMap = new Map((sups ?? []).map((s: SupplierRow) => [s.id, s]));
  const projMap = new Map((projs ?? []).map((p) => [p.id, p.name]));
  return (mats ?? []).map((m: MaterialRow) =>
    rowToVM(
      m,
      m.supplier_id ? supMap.get(m.supplier_id) ?? null : null,
      m.project_id ? projMap.get(m.project_id) ?? null : null
    )
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
  let projectName: string | null = null;
  if (row.project_id) {
    const { data } = await supabase.from("projects").select("name").eq("id", row.project_id).maybeSingle();
    projectName = data?.name ?? null;
  }
  return rowToVM(row, sup, projectName);
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

export async function getSupplier(id: string): Promise<SupplierVM | null> {
  if (!supabaseConfigured) {
    return (await getSuppliers()).find((s) => s.id === id) ?? null;
  }
  const supabase = await createClient();
  const { data } = await supabase.from("suppliers").select("*").eq("id", id).maybeSingle();
  return data ? supRowToVM(data) : null;
}

export type ProjectVM = {
  id: string;
  name: string;
  location: string | null;
  code: string | null;
};

export async function getProjects(): Promise<ProjectVM[]> {
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

export async function getProject(id: string): Promise<ProjectVM | null> {
  if (!supabaseConfigured) {
    return (await getProjects()).find((p) => p.id === id) ?? null;
  }
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("id, name, location, code")
    .eq("id", id)
    .maybeSingle();
  return data ?? null;
}

export type TeamMember = {
  userId: string;
  role: string;
  fullName: string | null;
  email: string | null;
  isMe: boolean;
};
export type TeamInvite = { id: string; email: string };
export type TeamData = { members: TeamMember[]; invites: TeamInvite[]; myRole: string };

export async function getTeam(): Promise<TeamData> {
  if (!supabaseConfigured) {
    return {
      members: [
        { userId: "demo", role: "owner", fullName: "Site Manager", email: "you@example.com", isMe: true },
      ],
      invites: [],
      myRole: "owner",
    };
  }
  const supabase = await createClient();
  const [{ data: members }, { data: userRes }] = await Promise.all([
    supabase.from("org_members").select("user_id, role").order("created_at", { ascending: true }),
    supabase.auth.getUser(),
  ]);
  const me = userRes?.user?.id;
  const ids = (members ?? []).map((m) => m.user_id);
  const { data: profiles } = ids.length
    ? await supabase.from("profiles").select("id, full_name, email").in("id", ids)
    : { data: [] };
  const pMap = new Map((profiles ?? []).map((p) => [p.id, p]));
  const { data: invites } = await supabase
    .from("org_invites")
    .select("id, email")
    .order("created_at", { ascending: true });

  return {
    members: (members ?? []).map((m) => ({
      userId: m.user_id,
      role: m.role,
      fullName: pMap.get(m.user_id)?.full_name ?? null,
      email: pMap.get(m.user_id)?.email ?? null,
      isMe: m.user_id === me,
    })),
    invites: invites ?? [],
    myRole: (members ?? []).find((m) => m.user_id === me)?.role ?? "member",
  };
}

export type Me = { name: string; email: string };

export async function getMe(): Promise<Me> {
  if (!supabaseConfigured) return { name: "Site Manager", email: "" };
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { name: "Site Manager", email: "" };
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .maybeSingle();
  return {
    name: profile?.full_name || user.email?.split("@")[0] || "Site Manager",
    email: profile?.email || user.email || "",
  };
}

export async function getOrgInfo(): Promise<OrgInfo> {
  if (!supabaseConfigured) return DEMO_ORG;
  const supabase = await createClient();
  const activeProject = await getActiveProjectId();

  const { data: orgs } = await supabase.from("orgs").select("name").limit(1);
  const companyName = orgs?.[0]?.name ?? "My Company";

  if (activeProject) {
    const { data: p } = await supabase
      .from("projects")
      .select("name, location")
      .eq("id", activeProject)
      .maybeSingle();
    if (p) {
      return { companyName, projectName: p.name, projectLocation: p.location ?? "" };
    }
  }

  // No project selected → show "All projects".
  const { count } = await supabase
    .from("projects")
    .select("id", { count: "exact", head: true });
  const { data: first } = await supabase
    .from("projects")
    .select("name, location")
    .order("created_at")
    .limit(1);

  if ((count ?? 0) > 1) {
    return { companyName, projectName: "All projects", projectLocation: "" };
  }
  return {
    companyName,
    projectName: first?.[0]?.name ?? "My Project",
    projectLocation: first?.[0]?.location ?? "",
  };
}
