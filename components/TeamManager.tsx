"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import {
  UserPlus,
  Loader2,
  Mail,
  Crown,
  User as UserIcon,
  X,
  Clock,
} from "lucide-react";
import type { TeamData } from "@/lib/queries";
import { inviteMember, cancelInvite, removeMember } from "@/lib/actions/team";

export function TeamManager({ team }: { team: TeamData }) {
  const isOwner = team.myRole === "owner";
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  async function onInvite(fd: FormData) {
    setError(null);
    setOk(null);
    try {
      await inviteMember(fd);
      setOk(`Invite sent to ${String(fd.get("email"))}. They'll join when they sign up.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't send the invite.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Invite */}
      {isOwner && (
        <div className="card p-6">
          <h2 className="text-base font-semibold text-slate-900">Invite a coworker</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Enter their email. When they sign up with it, they join your company automatically.
          </p>
          <form action={onInvite} className="mt-4 flex flex-col gap-3 sm:flex-row">
            <span className="flex flex-1 items-center gap-2 rounded-xl border border-hairline bg-slate-50 px-3 py-2.5 transition focus-within:border-primary-300 focus-within:bg-white">
              <Mail className="h-4 w-4 shrink-0 text-slate-400" />
              <input
                name="email"
                type="email"
                required
                placeholder="coworker@company.com"
                className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
              />
            </span>
            <InviteButton />
          </form>
          {error && (
            <p className="mt-3 rounded-xl border border-danger-500/20 bg-danger-50 px-4 py-2.5 text-sm font-medium text-danger-700">
              {error}
            </p>
          )}
          {ok && (
            <p className="mt-3 rounded-xl border border-success-500/20 bg-success-50 px-4 py-2.5 text-sm font-medium text-success-700">
              {ok}
            </p>
          )}
        </div>
      )}

      {/* Members */}
      <div className="card overflow-hidden">
        <div className="border-b border-hairline px-6 py-4">
          <h2 className="text-base font-semibold text-slate-900">
            People ({team.members.length})
          </h2>
        </div>
        {team.members.map((m) => (
          <div
            key={m.userId}
            className="flex items-center gap-3 border-b border-hairline px-6 py-4 last:border-0"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary-500 to-primary-800 text-sm font-bold text-white">
              {(m.fullName || m.email || "?").charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900">
                {m.fullName || m.email || "Team member"}
                {m.isMe && <span className="ml-1 text-xs font-normal text-slate-400">(you)</span>}
              </p>
              {m.email && m.fullName && (
                <p className="truncate text-xs text-slate-400">{m.email}</p>
              )}
            </div>
            <span
              className={`chip ${
                m.role === "owner"
                  ? "border-primary-200 bg-primary-50 text-primary-700"
                  : "border-hairline bg-slate-50 text-slate-500"
              }`}
            >
              {m.role === "owner" ? <Crown className="h-3 w-3" /> : <UserIcon className="h-3 w-3" />}
              {m.role === "owner" ? "Owner" : "Member"}
            </span>
            {isOwner && !m.isMe && m.role !== "owner" && (
              <form action={removeMember.bind(null, m.userId)}>
                <button
                  type="submit"
                  className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-danger-50 hover:text-danger-600"
                  aria-label="Remove person"
                >
                  <X className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        ))}
      </div>

      {/* Pending invites */}
      {team.invites.length > 0 && (
        <div className="card overflow-hidden">
          <div className="border-b border-hairline px-6 py-4">
            <h2 className="text-base font-semibold text-slate-900">
              Waiting to join ({team.invites.length})
            </h2>
          </div>
          {team.invites.map((inv) => (
            <div
              key={inv.id}
              className="flex items-center gap-3 border-b border-hairline px-6 py-4 last:border-0"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-warning-50 text-warning-600">
                <Clock className="h-5 w-5" />
              </span>
              <p className="min-w-0 flex-1 truncate text-sm font-medium text-slate-700">
                {inv.email}
              </p>
              <span className="chip border-warning-500/25 bg-warning-50 text-warning-700">
                Invited
              </span>
              {isOwner && (
                <form action={cancelInvite.bind(null, inv.id)}>
                  <button
                    type="submit"
                    className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-danger-50 hover:text-danger-600"
                    aria-label="Cancel invite"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function InviteButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary">
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
      Send invite
    </button>
  );
}
