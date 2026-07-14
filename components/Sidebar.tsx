"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, ArrowUpRight } from "lucide-react";
import { Logo } from "./ui";
import { navItems } from "./nav";
import { cn } from "@/lib/utils";
import { PROJECT } from "@/lib/data";

export function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex-1 space-y-1 px-3" aria-label="Primary">
      {navItems.map((item) => {
        const active = item.href === "/dashboard" && pathname === "/dashboard";
        const Icon = item.icon;
        return (
          <Link
            key={item.label}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
              active
                ? "bg-brand-500/10 text-brand-300"
                : "text-slate-400 hover:bg-ink-800/60 hover:text-slate-200"
            )}
          >
            <Icon className="h-5 w-5" strokeWidth={1.8} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function ProjectCard() {
  return (
    <div className="mx-4 mb-4 rounded-xl border border-ink-700 bg-ink-850/60 p-3">
      <p className="label-muted">Active project</p>
      <p className="mt-1 text-sm font-semibold text-white">{PROJECT.name}</p>
      <p className="text-xs text-slate-500">
        {PROJECT.location} · {PROJECT.code}
      </p>
    </div>
  );
}

export function SidebarFooter({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="space-y-1 px-3 pb-4">
      <Link
        href="/dashboard#settings"
        onClick={onNavigate}
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-ink-800/60 hover:text-slate-200"
      >
        <Settings className="h-5 w-5" strokeWidth={1.8} />
        Settings
      </Link>
      <Link
        href="/"
        onClick={onNavigate}
        className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:text-slate-300"
      >
        Back to site
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-ink-700 bg-ink-900/60 lg:sticky lg:top-0 lg:flex lg:h-screen lg:overflow-y-auto">
      <div className="px-5 py-5">
        <Link href="/" aria-label="Kayakalp home">
          <Logo />
        </Link>
      </div>
      <ProjectCard />
      <NavList />
      <SidebarFooter />
    </aside>
  );
}
