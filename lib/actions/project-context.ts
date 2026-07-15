"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { ACTIVE_PROJECT_COOKIE } from "@/lib/queries";

/** Set which project the dashboard is currently showing ("all" clears it). */
export async function setActiveProject(projectId: string) {
  const store = await cookies();
  if (!projectId || projectId === "all") {
    store.delete(ACTIVE_PROJECT_COOKIE);
  } else {
    store.set(ACTIVE_PROJECT_COOKIE, projectId, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }
  revalidatePath("/", "layout");
}
