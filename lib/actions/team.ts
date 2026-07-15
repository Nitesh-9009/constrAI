"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/config";

async function ctx() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: org } = await supabase.from("orgs").select("id").limit(1).maybeSingle();
  let role = "member";
  if (user && org) {
    const { data: m } = await supabase
      .from("org_members")
      .select("role")
      .eq("org_id", org.id)
      .eq("user_id", user.id)
      .maybeSingle();
    role = m?.role ?? "member";
  }
  return { supabase, userId: user?.id ?? null, orgId: org?.id ?? null, role };
}

export async function inviteMember(fd: FormData) {
  if (!supabaseConfigured) return;
  const { supabase, userId, orgId, role } = await ctx();
  if (!orgId) throw new Error("We couldn't find your company.");
  if (role !== "owner") throw new Error("Only the owner can invite people.");
  const email = String(fd.get("email") ?? "").trim().toLowerCase();
  if (!email || !email.includes("@")) throw new Error("Please enter a valid email.");
  const { error } = await supabase
    .from("org_invites")
    .upsert({ org_id: orgId, email, invited_by: userId }, { onConflict: "org_id,email" });
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/team");
}

export async function cancelInvite(id: string) {
  if (!supabaseConfigured) return;
  const supabase = await createClient();
  const { error } = await supabase.from("org_invites").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/team");
}

export async function removeMember(userId: string) {
  if (!supabaseConfigured) return;
  const { supabase, orgId, role, userId: me } = await ctx();
  if (!orgId) throw new Error("We couldn't find your company.");
  if (role !== "owner") throw new Error("Only the owner can remove people.");
  if (userId === me) throw new Error("You can't remove yourself.");
  const { data: target } = await supabase
    .from("org_members")
    .select("role")
    .eq("org_id", orgId)
    .eq("user_id", userId)
    .maybeSingle();
  if (target?.role === "owner") throw new Error("You can't remove an owner.");
  const { error } = await supabase
    .from("org_members")
    .delete()
    .eq("org_id", orgId)
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/team");
}
