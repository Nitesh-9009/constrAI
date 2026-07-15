"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Search,
  Menu,
  X,
  ArrowRight,
  TriangleAlert,
  Sparkles,
  ChevronDown,
  Command,
  Building2,
  Check,
  LayoutGrid,
  LogOut,
  MessageCircleQuestion,
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { simpleOf, latenessText } from "@/lib/plain";
import type { MaterialVM, OrgInfo } from "@/lib/materials";
import type { ProjectVM, Me } from "@/lib/queries";
import { setActiveProject } from "@/lib/actions/project-context";
import { supabaseConfigured } from "@/lib/supabase/config";
import { Logo, SimpleBadge } from "./ui";
import { NavList, ProjectCard, SidebarFooter } from "./Sidebar";

export function Topbar({
  items,
  org,
  projects,
  activeProjectId,
  me,
}: {
  items: MaterialVM[];
  org: OrgInfo;
  projects: ProjectVM[];
  activeProjectId: string | null;
  me: Me;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Lock body scroll when the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-hairline bg-white/80 px-4 py-3 backdrop-blur-xl sm:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation menu"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-hairline bg-white text-slate-500 shadow-soft hover:text-slate-900 lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>
          <WorkspaceSelector org={org} projects={projects} activeProjectId={activeProjectId} />
          <QuickSearch items={items} />
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden text-xs font-medium text-slate-400 lg:inline">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </span>
          <Link
            href="/dashboard/help"
            className="hidden items-center gap-1.5 rounded-full border border-primary-100 bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-700 transition hover:bg-primary-100 sm:inline-flex"
          >
            <Sparkles className="h-3.5 w-3.5" /> Ask AI
          </Link>
          <Notifications items={items} />
          <AccountMenu me={me} org={org} />
        </div>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 flex h-full w-72 flex-col border-r border-hairline bg-white shadow-2xl animate-fade-up">
            <div className="flex items-center justify-between px-5 py-5">
              <Link href="/" onClick={() => setMenuOpen(false)} aria-label="ConstrAI home">
                <Logo />
              </Link>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close navigation menu"
                className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:text-slate-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <ProjectCard org={org} />
            <MobileProjects
              projects={projects}
              activeProjectId={activeProjectId}
              onDone={() => setMenuOpen(false)}
            />
            <NavList onNavigate={() => setMenuOpen(false)} />
            <SidebarFooter onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}

function QuickSearch({ items }: { items: MaterialVM[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const query = q.trim().toLowerCase();
  const results = query
    ? items
        .filter(
          (m) =>
            m.name.toLowerCase().includes(query) ||
            (m.supplier?.name.toLowerCase().includes(query) ?? false) ||
            (m.location?.toLowerCase().includes(query) ?? false) ||
            (m.notes?.toLowerCase().includes(query) ?? false)
        )
        .slice(0, 6)
    : [];

  function go(id: string) {
    setOpen(false);
    setQ("");
    router.push(`/dashboard/materials/${id}`);
  }

  return (
    <div ref={ref} className="relative hidden w-full max-w-md sm:block">
      <div className="flex items-center gap-2 rounded-xl border border-hairline bg-slate-50 px-3 py-2 transition focus-within:border-primary-300 focus-within:bg-white focus-within:shadow-soft">
        <Search className="h-4 w-4 shrink-0 text-slate-400" />
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
            setActive(0);
          }}
          onFocus={() => q && setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((a) => Math.min(a + 1, results.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => Math.max(a - 1, 0));
            } else if (e.key === "Enter" && results[active]) {
              go(results[active].id);
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
          placeholder="Search your materials…"
          aria-label="Search materials"
          className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
        />
        <kbd className="hidden items-center gap-0.5 rounded-md border border-hairline bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400 md:inline-flex">
          <Command className="h-2.5 w-2.5" />K
        </kbd>
      </div>

      {open && query && (
        <div className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-2xl border border-hairline bg-white shadow-card-hover">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-slate-400">No matches for “{q}”.</p>
          ) : (
            results.map((m, i) => (
              <button
                key={m.id}
                onMouseEnter={() => setActive(i)}
                onClick={() => go(m.id)}
                className={cn(
                  "flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition",
                  i === active ? "bg-primary-50" : "hover:bg-slate-50"
                )}
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-slate-900">{m.name}</span>
                  <span className="block truncate text-xs text-slate-400">
                    Made by {m.supplier?.name ?? "—"}
                  </span>
                </span>
                <SimpleBadge tone={simpleOf(m)} size="sm" />
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function Notifications({ items }: { items: MaterialVM[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const alerts = items
    .filter((m) => simpleOf(m) !== "good")
    .sort(
      (a, b) =>
        b.buildingDelayDays * b.costOfDelayPerDay - a.buildingDelayDays * a.costOfDelayPerDay
    );

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={`Notifications, ${alerts.length} at risk`}
        aria-expanded={open}
        className="relative grid h-9 w-9 place-items-center rounded-xl border border-hairline bg-white text-slate-500 shadow-soft transition hover:text-slate-900"
      >
        <Bell className="h-4 w-4" />
        {alerts.length > 0 && (
          <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-danger-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
            {alerts.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-40 mt-2 w-80 overflow-hidden rounded-2xl border border-hairline bg-white shadow-card-hover">
          <div className="flex items-center gap-2 border-b border-hairline px-4 py-3">
            <TriangleAlert className="h-4 w-4 text-warning-500" />
            <p className="text-sm font-semibold text-slate-900">{alerts.length} materials need attention</p>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {alerts.map((m) => (
              <Link
                key={m.id}
                href={`/dashboard/materials/${m.id}`}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between gap-3 px-4 py-3 transition hover:bg-slate-50"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-slate-900">{m.name}</span>
                  <span className="block text-xs text-slate-400">
                    {latenessText(m)}
                    {m.needBy ? ` · need by ${formatDate(m.needBy)}` : ""}
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-slate-300" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MobileProjects({
  projects,
  activeProjectId,
  onDone,
}: {
  projects: ProjectVM[];
  activeProjectId: string | null;
  onDone: () => void;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const realProjects = projects.filter((p) => p.id !== "demo");
  if (realProjects.length < 2) return null;

  async function choose(id: string) {
    setBusy(true);
    try {
      await setActiveProject(id);
      onDone();
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-4 mb-4 rounded-2xl border border-hairline bg-white p-2 shadow-soft">
      <p className="px-2 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        Project
      </p>
      <button
        onClick={() => choose("all")}
        disabled={busy}
        className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
      >
        All projects
        {!activeProjectId && <Check className="h-4 w-4 text-primary-600" />}
      </button>
      {realProjects.map((p) => (
        <button
          key={p.id}
          onClick={() => choose(p.id)}
          disabled={busy}
          className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
        >
          <span className="truncate">{p.name}</span>
          {activeProjectId === p.id && <Check className="h-4 w-4 shrink-0 text-primary-600" />}
        </button>
      ))}
    </div>
  );
}

function WorkspaceSelector({
  org,
  projects,
  activeProjectId,
}: {
  org: OrgInfo;
  projects: ProjectVM[];
  activeProjectId: string | null;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const realProjects = projects.filter((p) => p.id !== "demo");

  async function choose(id: string) {
    setBusy(true);
    try {
      await setActiveProject(id);
      setOpen(false);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div ref={ref} className="relative hidden md:block">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        disabled={busy}
        className="flex items-center gap-2 rounded-xl border border-hairline bg-white px-2.5 py-2 shadow-soft transition hover:bg-slate-50 disabled:opacity-60"
        aria-label="Choose project"
      >
        <span className="grid h-6 w-6 place-items-center rounded-md bg-gradient-to-br from-primary-500 to-primary-800 text-[11px] font-bold text-white">
          {org.companyName.charAt(0).toUpperCase()}
        </span>
        <span className="flex max-w-[11rem] flex-col items-start leading-tight">
          <span className="truncate text-sm font-semibold text-slate-800">{org.projectName}</span>
          <span className="truncate text-[10px] text-slate-400">{org.companyName}</span>
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-40 mt-2 w-64 overflow-hidden rounded-2xl border border-hairline bg-white shadow-card-hover">
          <p className="px-4 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Choose a project
          </p>

          {realProjects.length > 1 && (
            <button
              onClick={() => choose("all")}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-slate-50"
            >
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-500">
                <LayoutGrid className="h-4 w-4" />
              </span>
              <span className="flex-1 text-sm font-medium text-slate-900">All projects</span>
              {!activeProjectId && <Check className="h-4 w-4 text-primary-600" />}
            </button>
          )}

          {realProjects.map((p) => (
            <button
              key={p.id}
              onClick={() => choose(p.id)}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-slate-50"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary-50 text-primary-600">
                <Building2 className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-slate-900">{p.name}</span>
                {p.location && (
                  <span className="block truncate text-xs text-slate-400">{p.location}</span>
                )}
              </span>
              {activeProjectId === p.id && <Check className="h-4 w-4 shrink-0 text-primary-600" />}
            </button>
          ))}

          <Link
            href="/dashboard/projects/new"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 border-t border-hairline px-4 py-2.5 text-sm font-medium text-primary-700 transition hover:bg-slate-50"
          >
            <span className="grid h-6 w-6 place-items-center rounded-md bg-primary-50 text-primary-600">
              +
            </span>
            Add a project
          </Link>
        </div>
      )}
    </div>
  );
}

function AccountMenu({ me, org }: { me: Me; org: OrgInfo }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const initial = (me.name || "?").charAt(0).toUpperCase();

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Account menu"
        className="flex items-center gap-2 rounded-xl border border-hairline bg-white py-1 pl-1 pr-2 shadow-soft transition hover:bg-slate-50"
      >
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-800 text-xs font-bold text-white">
          {initial}
        </span>
        <ChevronDown className="hidden h-3.5 w-3.5 text-slate-400 sm:block" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-40 mt-2 w-60 overflow-hidden rounded-2xl border border-hairline bg-white shadow-card-hover">
          <div className="flex items-center gap-3 border-b border-hairline px-4 py-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-800 text-sm font-bold text-white">
              {initial}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">{me.name}</p>
              <p className="truncate text-xs text-slate-400">{me.email || org.companyName}</p>
            </div>
          </div>
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
          >
            <LayoutGrid className="h-4 w-4 text-slate-400" /> My dashboard
          </Link>
          <Link
            href="/dashboard/help"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
          >
            <MessageCircleQuestion className="h-4 w-4 text-slate-400" /> Ask for help
          </Link>
          {supabaseConfigured ? (
            <form action="/auth/signout" method="post" className="border-t border-hairline">
              <button
                type="submit"
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50"
              >
                <LogOut className="h-4 w-4 text-slate-400" /> Log out
              </button>
            </form>
          ) : (
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 border-t border-hairline px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
            >
              <LogOut className="h-4 w-4 text-slate-400" /> Home page
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
