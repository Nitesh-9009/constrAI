"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { Logo } from "./ui";
import { navItems } from "./nav";
import { cn } from "@/lib/utils";
import { PROJECT } from "@/lib/data";

export function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex-1 space-y-1 px-3" aria-label="Primary">
      <p className="px-3 pb-1.5 pt-2 label-muted">Menu</p>
      {navItems.map((item) => {
        const active =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.label}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
              active
                ? "bg-primary-50 text-primary-700 shadow-inset-soft"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            {active && (
              <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary-600" />
            )}
            <Icon
              className={cn(
                "h-5 w-5 transition-colors",
                active ? "text-primary-600" : "text-slate-400 group-hover:text-slate-600"
              )}
              strokeWidth={1.8}
            />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function ProjectCard() {
  return (
    <div className="mx-4 mb-4 rounded-2xl border border-hairline bg-gradient-to-br from-primary-50 to-white p-3.5 shadow-soft">
      <div className="flex items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary-600 text-white shadow-soft">
          <ShieldCheck className="h-4 w-4" />
        </span>
        <p className="label-muted text-primary-700/70">Your site</p>
      </div>
      <p className="mt-2 text-sm font-semibold text-slate-900">{PROJECT.name}</p>
      <p className="text-xs text-slate-500">{PROJECT.location}</p>
    </div>
  );
}

export function SidebarFooter({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="space-y-1 px-3 pb-4">
      <Link
        href="/"
        onClick={onNavigate}
        className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:text-slate-700"
      >
        Home page
        <ArrowUpRight className="h-4 w-4" />
      </Link>
      <div className="mt-2 flex items-center gap-2 rounded-xl border border-hairline bg-slate-50 px-3 py-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success-500/60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-success-500" />
        </span>
        <span className="text-[11px] font-medium text-slate-500">Your info is safe &amp; private</span>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-hairline bg-white/80 backdrop-blur-xl lg:sticky lg:top-0 lg:flex lg:h-screen lg:overflow-y-auto">
      <div className="px-5 py-5">
        <Link href="/" aria-label="ConstrAI home">
          <Logo />
        </Link>
      </div>
      <ProjectCard />
      <NavList />
      <SidebarFooter />
    </aside>
  );
}
