"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Search, Menu, X, ArrowRight, TriangleAlert } from "lucide-react";
import { materials, supplierById, PROJECT } from "@/lib/data";
import { riskOf } from "@/lib/types";
import { cn, formatDate, pct } from "@/lib/utils";
import { Logo, RiskBadge } from "./ui";
import { NavList, ProjectCard, SidebarFooter } from "./Sidebar";

export function Topbar() {
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
      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-ink-700 bg-ink-950/80 px-4 py-3 backdrop-blur-md sm:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation menu"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-ink-700 bg-ink-850/60 text-slate-300 hover:text-white lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>
          <QuickSearch />
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden text-xs text-slate-500 md:inline">
            {new Date(PROJECT.today).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </span>
          <Notifications />
          <div
            className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-sm font-bold text-ink-950"
            aria-hidden
          >
            N
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 flex h-full w-72 flex-col border-r border-ink-700 bg-ink-900 shadow-2xl animate-fade-up">
            <div className="flex items-center justify-between px-5 py-5">
              <Link href="/" onClick={() => setMenuOpen(false)} aria-label="Kayakalp home">
                <Logo />
              </Link>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close navigation menu"
                className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <ProjectCard />
            <NavList onNavigate={() => setMenuOpen(false)} />
            <SidebarFooter onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}

function QuickSearch() {
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
    ? materials
        .filter((m) => {
          const sup = supplierById(m.supplierId);
          return (
            m.name.toLowerCase().includes(query) ||
            m.poNumber.toLowerCase().includes(query) ||
            m.sku.toLowerCase().includes(query) ||
            sup.name.toLowerCase().includes(query) ||
            m.location.toLowerCase().includes(query)
          );
        })
        .slice(0, 6)
    : [];

  function go(id: string) {
    setOpen(false);
    setQ("");
    router.push(`/dashboard/materials/${id}`);
  }

  return (
    <div ref={ref} className="relative w-full max-w-md">
      <div className="flex items-center gap-2 rounded-xl border border-ink-700 bg-ink-850/60 px-3 py-2 focus-within:border-brand-500/60">
        <Search className="h-4 w-4 shrink-0 text-slate-500" />
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
          placeholder="Search POs, materials, suppliers…"
          aria-label="Search materials"
          className="w-full bg-transparent text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none"
        />
      </div>

      {open && query && (
        <div className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-xl border border-ink-700 bg-ink-900 shadow-2xl">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-slate-500">No matches for “{q}”.</p>
          ) : (
            results.map((m, i) => (
              <button
                key={m.id}
                onMouseEnter={() => setActive(i)}
                onClick={() => go(m.id)}
                className={cn(
                  "flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition",
                  i === active ? "bg-ink-800" : "hover:bg-ink-850"
                )}
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-white">{m.name}</span>
                  <span className="block truncate text-xs text-slate-500">
                    {m.poNumber} · {supplierById(m.supplierId).name}
                  </span>
                </span>
                <RiskBadge risk={riskOf(m)} />
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function Notifications() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const alerts = materials
    .filter((m) => riskOf(m) !== "low")
    .sort(
      (a, b) =>
        b.criticalPathSlipDays * b.costOfDelayPerDay -
        a.criticalPathSlipDays * a.costOfDelayPerDay
    );

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={`Notifications, ${alerts.length} at risk`}
        aria-expanded={open}
        className="relative grid h-9 w-9 place-items-center rounded-xl border border-ink-700 bg-ink-850/60 text-slate-400 hover:text-slate-200"
      >
        <Bell className="h-4 w-4" />
        {alerts.length > 0 && (
          <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-risk-high px-1 text-[10px] font-bold text-white">
            {alerts.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-40 mt-2 w-80 overflow-hidden rounded-xl border border-ink-700 bg-ink-900 shadow-2xl">
          <div className="flex items-center gap-2 border-b border-ink-700 px-4 py-3">
            <TriangleAlert className="h-4 w-4 text-risk-med" />
            <p className="text-sm font-semibold text-white">{alerts.length} materials need attention</p>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {alerts.map((m) => (
              <Link
                key={m.id}
                href={`/dashboard/materials/${m.id}`}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between gap-3 px-4 py-3 transition hover:bg-ink-850"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-white">{m.name}</span>
                  <span className="block text-xs text-slate-500">
                    {pct(m.onTimeProbability)} on-time · need {formatDate(m.neededBy)}
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-slate-600" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
