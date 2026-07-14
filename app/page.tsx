import Link from "next/link";
import {
  ArrowRight,
  ListChecks,
  Bell,
  TrendingUp,
  CheckCircle2,
  Camera,
  MessageSquareText,
  ShieldCheck,
  Smartphone,
  Github,
} from "lucide-react";
import { Logo } from "@/components/ui";
import { supabaseConfigured } from "@/lib/supabase/config";

export default function Home() {
  const ctaHref = supabaseConfigured ? "/signup" : "/dashboard";
  const ctaLabel = supabaseConfigured ? "Get started free" : "Open my dashboard";

  return (
    <div className="relative overflow-hidden">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-hairline bg-white/80 backdrop-blur-xl">
        <div className="container-luxe flex items-center justify-between py-4">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm text-slate-500 md:flex">
            <a href="#problem" className="transition hover:text-slate-900">The problem</a>
            <a href="#how" className="transition hover:text-slate-900">How it helps</a>
            <a href="#tech" className="transition hover:text-slate-900">Is it safe?</a>
          </nav>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/Nitesh-9009/constrAI"
              target="_blank"
              rel="noreferrer"
              className="hidden text-slate-400 transition hover:text-slate-900 sm:block"
            >
              <Github className="h-5 w-5" />
            </a>
            {supabaseConfigured && (
              <Link
                href="/login"
                className="hidden text-sm font-medium text-slate-600 transition hover:text-slate-900 sm:block"
              >
                Log in
              </Link>
            )}
            <Link href={ctaHref} className="btn-primary text-sm">
              {ctaLabel} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-70" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-primary-500/10 blur-3xl" />
        <div className="container-luxe relative py-20 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="chip mx-auto border-primary-200 bg-primary-50 text-primary-700">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
              Made for construction site teams
            </span>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight text-slate-900 sm:text-6xl">
              Know when your materials{" "}
              <span className="bg-gradient-to-r from-primary-500 to-primary-800 bg-clip-text text-transparent">
                will arrive
              </span>{" "}
              — and what to do if they are late
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-500">
              ConstrAI keeps track of all your orders and tells you, in plain words,{" "}
              <span className="text-slate-800">
                which ones are on time and which ones need action.
              </span>{" "}
              No paperwork. No guessing. So your crew is never left standing around waiting.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href={ctaHref} className="btn-primary">
                {ctaLabel} <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#how" className="btn-ghost">
                See how it helps
              </a>
            </div>
          </div>

          {/* Five questions */}
          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-5">
            {[
              "Is it approved?",
              "Is it being made?",
              "Is it late?",
              "Where is it?",
              "Will it be on time?",
            ].map((q, i) => (
              <div
                key={q}
                className="card card-hover animate-fade-up p-4 text-center"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <p className="text-sm font-medium text-slate-700">{q}</p>
                <p className="mt-1 text-xs font-medium text-primary-600">answered</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem */}
      <section id="problem" className="border-t border-hairline py-20">
        <div className="container-luxe">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="label-muted text-primary-600">The problem</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                Materials get ordered. Then the chaos begins.
              </h2>
              <p className="mt-4 text-slate-500">
                All the answers exist — but they are spread across order papers, supplier messages,
                site photos, and the schedule. Nobody puts them together. So a late order is often
                found{" "}
                <span className="font-medium text-slate-800">only after the crew is already waiting</span>.
                One small delay can push back the whole building and cost a lot of money.
              </p>
              <div className="mt-6 space-y-3">
                {[
                  "You never know a material is late until it is too late",
                  "Old tools need lots of typing that busy crews will never do",
                  "Nobody sees how one late order delays everything after it",
                ].map((t) => (
                  <div key={t} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-danger-500" />
                    {t}
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <p className="label-muted">All over the place today</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  "Order papers",
                  "Approvals",
                  "Supplier messages",
                  "Site photos",
                  "Delivery notes",
                  "The schedule",
                ].map((s) => (
                  <div
                    key={s}
                    className="rounded-xl border border-hairline bg-slate-50 px-3 py-3 text-sm text-slate-500"
                  >
                    {s}
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-center gap-2 text-primary-500">
                <ArrowRight className="h-4 w-4 rotate-90" />
              </div>
              <div className="mt-3 rounded-xl border border-primary-200 bg-primary-50/60 px-4 py-4 text-center">
                <p className="text-sm font-semibold text-slate-900">One simple place for everything</p>
                <p className="mt-1 text-xs text-slate-500">easy to read · tells you what to do</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it helps */}
      <section id="how" className="border-t border-hairline py-20">
        <div className="container-luxe">
          <div className="mx-auto max-w-2xl text-center">
            <p className="label-muted text-primary-600">How it helps</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
              Simple help, every single day
            </h2>
            <p className="mt-4 text-slate-500">
              It does not just show a list. It warns you early and tells you what to do.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-4">
            {[
              {
                icon: ListChecks,
                step: "1",
                title: "See everything in one place",
                body: "All your orders on one screen, in plain words. No digging through papers or messages.",
              },
              {
                icon: Bell,
                step: "2",
                title: "Get a warning early",
                body: "You find out an order might be late long before the crew is left standing around.",
              },
              {
                icon: TrendingUp,
                step: "3",
                title: "Know how bad it is",
                body: "See if a late order will hold up other work — and how many days it could cost you.",
              },
              {
                icon: CheckCircle2,
                step: "4",
                title: "Know what to do",
                body: "We give you one clear thing to do next, like calling the supplier or planning other work first.",
              },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.step} className="card card-hover p-5">
                  <div className="flex items-center justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-50 text-primary-600">
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-slate-100 text-sm font-bold text-slate-400">
                      {s.step}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-slate-900">{s.title}</h3>
                  <p className="mt-1.5 text-sm text-slate-500">{s.body}</p>
                </div>
              );
            })}
          </div>

          {/* Simple example */}
          <div className="card mt-6 overflow-hidden">
            <div className="grid divide-y divide-[color:theme(colors.hairline)] md:grid-cols-3 md:divide-x md:divide-y-0">
              {[
                {
                  icon: MessageSquareText,
                  tag: "You ask",
                  text: "“Is my steel going to be late?”",
                },
                {
                  icon: TrendingUp,
                  tag: "It tells you",
                  text: "Yes. Your steel is being made, but it will arrive about 3 days after you need it.",
                },
                {
                  icon: CheckCircle2,
                  tag: "What to do",
                  text: "Call the supplier to hurry it up, and pour the other areas first so the crew keeps working.",
                },
              ].map((c) => {
                const Icon = c.icon;
                return (
                  <div key={c.tag} className="p-5">
                    <div className="flex items-center gap-2 text-primary-600">
                      <Icon className="h-4 w-4" />
                      <span className="label-muted text-primary-600">{c.tag}</span>
                    </div>
                    <p className="mt-3 text-sm text-slate-600">{c.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Is it safe? */}
      <section id="tech" className="border-t border-hairline py-20">
        <div className="container-luxe">
          <div className="mx-auto max-w-2xl text-center">
            <p className="label-muted text-primary-600">Is it safe?</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
              Made for real construction sites
            </h2>
            <p className="mt-4 text-slate-500">
              Easy to use, safe to trust, and built for busy people on the ground.
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: ShieldCheck,
                title: "Your info is safe",
                body: "Everything is private and protected. Only your team can see your site.",
              },
              {
                icon: Smartphone,
                title: "Works on your phone",
                body: "Check your materials from anywhere — the site, the office, or home.",
              },
              {
                icon: MessageSquareText,
                title: "Plain, simple words",
                body: "No hard words and no training. If you can read a text message, you can use this.",
              },
              {
                icon: Camera,
                title: "No paperwork",
                body: "Just take a photo to update an order. No forms, no typing.",
              },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="card card-hover p-5">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-50 text-primary-600">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-slate-900">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-slate-500">{f.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-hairline py-20">
        <div className="container-luxe">
          <div className="card relative overflow-hidden p-10 text-center">
            <div className="grid-lines pointer-events-none absolute inset-0 opacity-50" />
            <div className="pointer-events-none absolute left-1/2 top-0 h-52 w-[36rem] -translate-x-1/2 rounded-full bg-primary-500/10 blur-3xl" />
            <div className="relative mx-auto max-w-2xl">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-800 text-white shadow-glow">
                <Camera className="h-6 w-6" />
              </span>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-900">
                Try it now — it is easy.
              </h2>
              <p className="mt-3 text-slate-500">
                Open your dashboard, see what is late, and get one clear thing to do next.
              </p>
              <div className="mt-7 flex justify-center">
                <Link href={ctaHref} className="btn-primary">
                  {ctaLabel} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-hairline py-8">
        <div className="container-luxe flex flex-col items-center justify-between gap-4 text-sm text-slate-500 sm:flex-row">
          <Logo />
          <p className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-success-500" /> ConstrAI — material chaos,
            engineered into a predictive timeline.
          </p>
        </div>
      </footer>
    </div>
  );
}
