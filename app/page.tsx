import Link from "next/link";
import {
  ArrowRight,
  ScanEye,
  FileSearch,
  TrendingUp,
  Workflow,
  Boxes,
  Camera,
  MessageSquareText,
  GitBranch,
  ShieldCheck,
  Github,
} from "lucide-react";
import { Logo } from "@/components/ui";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-hairline bg-white/80 backdrop-blur-xl">
        <div className="container-luxe flex items-center justify-between py-4">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm text-slate-500 md:flex">
            <a href="#problem" className="transition hover:text-slate-900">Problem</a>
            <a href="#how" className="transition hover:text-slate-900">How it works</a>
            <a href="#tech" className="transition hover:text-slate-900">Technology</a>
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
            <Link href="/dashboard" className="btn-primary text-sm">
              Open Control Tower <ArrowRight className="h-4 w-4" />
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
              Track 2 · Construction Supply Chain
            </span>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight text-slate-900 sm:text-6xl">
              The predictive{" "}
              <span className="bg-gradient-to-r from-primary-500 to-primary-800 bg-clip-text text-transparent">
                material control tower
              </span>{" "}
              for construction
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-500">
              ConstrAI fuses POs, submittals, drawings and job-site photos into one live,
              predictive timeline — and answers the only question that matters:{" "}
              <span className="text-slate-800">
                will the material be here when the crew needs it, and if not, what do we do right
                now?
              </span>
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/dashboard" className="btn-primary">
                Open the live demo <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#how" className="btn-ghost">
                See how it works
              </a>
            </div>
          </div>

          {/* Five questions */}
          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-5">
            {[
              "Approved?",
              "Fabricating?",
              "Delayed?",
              "Where is it?",
              "On time?",
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
                The data to answer the daily questions exists — but it&apos;s scattered across POs,
                submittal logs, supplier emails, WhatsApp photos, delivery tickets, and the
                schedule. No system fuses it, so a slipping order is discovered{" "}
                <span className="font-medium text-slate-800">after the crew is already standing idle</span>.
                Small material delays cascade along the critical path into missed milestones and
                blown budgets.
              </p>
              <div className="mt-6 space-y-3">
                {[
                  "Status is reactive and point-in-time — never predictive",
                  "Existing tools demand data entry crews will never do",
                  "Nobody prices the downstream cascade of a single late order",
                ].map((t) => (
                  <div key={t} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-danger-500" />
                    {t}
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <p className="label-muted">Scattered today</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  "PO PDFs",
                  "Submittal logs",
                  "Supplier emails",
                  "WhatsApp photos",
                  "Delivery tickets",
                  "P6 / MS Project",
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
                <p className="text-sm font-semibold text-slate-900">One live Material Knowledge Graph</p>
                <p className="mt-1 text-xs text-slate-500">predict → simulate → act</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works — the loop */}
      <section id="how" className="border-t border-hairline py-20">
        <div className="container-luxe">
          <div className="mx-auto max-w-2xl text-center">
            <p className="label-muted text-primary-600">How it works</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
              Ingest → Predict → Simulate → Act
            </h2>
            <p className="mt-4 text-slate-500">
              A closed loop that doesn&apos;t just report status — it prevents the delay.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-4">
            {[
              {
                icon: Boxes,
                step: "01",
                title: "Ingest & fuse",
                body: "Forward an inbox. POs, submittals, drawings and photos link into one graph — zero data entry.",
              },
              {
                icon: TrendingUp,
                step: "02",
                title: "Predict",
                body: "A probabilistic forecaster returns a calibrated arrival window and on-time probability per material.",
              },
              {
                icon: GitBranch,
                step: "03",
                title: "Simulate cascade",
                body: "Propagate any slip through the schedule DAG to price the true critical-path impact in dollars.",
              },
              {
                icon: Workflow,
                step: "04",
                title: "Act",
                body: "The agent drafts the escalation, proposes a re-sequence, flags the spec issue — one-click approve.",
              },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.step} className="card card-hover p-5">
                  <div className="flex items-center justify-between">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-50 text-primary-600">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-mono text-xs text-slate-300">{s.step}</span>
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-slate-900">{s.title}</h3>
                  <p className="mt-1.5 text-sm text-slate-500">{s.body}</p>
                </div>
              );
            })}
          </div>

          {/* Arc example */}
          <div className="card mt-6 overflow-hidden">
            <div className="grid divide-y divide-[color:theme(colors.hairline)] md:grid-cols-3 md:divide-x md:divide-y-0">
              {[
                {
                  icon: MessageSquareText,
                  tag: "Question",
                  text: "“What's blocking next week's Level 3 pour?”",
                },
                {
                  icon: TrendingUp,
                  tag: "Prediction",
                  text: "Rebar PO-4471 is 60% fabricated — 22% chance it lands on time. Forecast Jul 14 vs need Jul 11. High risk, 4-day critical-path slip.",
                },
                {
                  icon: Workflow,
                  tag: "Action",
                  text: "Draft escalation to Atlas Rebar + move the pour 3 days? → one-click approve.",
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

      {/* Technology */}
      <section id="tech" className="border-t border-hairline py-20">
        <div className="container-luxe">
          <div className="mx-auto max-w-2xl text-center">
            <p className="label-muted text-primary-600">Go deeper than an API call</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
              Five techniques, combined
            </h2>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: ScanEye,
                title: "Vision-Language Models",
                body: "Qwen2.5-VL reads job-site photos, delivery tickets and video — flagging spec mismatches with no forms.",
              },
              {
                icon: FileSearch,
                title: "Document Intelligence",
                body: "ColPali visual retrieval over drawing & spec pixels — not the OCR pipeline that destroys them.",
              },
              {
                icon: TrendingUp,
                title: "Forecasting & Optimization",
                body: "Chronos + survival + conformal prediction for calibrated, trustworthy arrival intervals.",
              },
              {
                icon: Workflow,
                title: "Agentic Systems",
                body: "A LangGraph agent retrieves, drafts, sends and re-sequences — with a human-approval gate.",
              },
              {
                icon: Boxes,
                title: "Construction-Specific AI",
                body: "RAG grounded on this project's specs, SKUs and vendors, with a construction ontology.",
              },
              {
                icon: GitBranch,
                title: "Cascade on the schedule DAG",
                body: "Predict the domino effect through the critical path — the technique nobody else applies.",
              },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="card card-hover p-5">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-50 text-primary-600">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-slate-900">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-slate-500">{f.body}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
            {[
              "Qwen2.5-VL",
              "ColQwen2",
              "Docling",
              "Chronos",
              "Lag-Llama",
              "LangGraph",
              "Conformal prediction",
              "Open-source · on-prem capable",
            ].map((t) => (
              <span key={t} className="chip border-hairline bg-white text-slate-500 shadow-soft">
                {t}
              </span>
            ))}
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
                See it predict, then act.
              </h2>
              <p className="mt-3 text-slate-500">
                Open the control tower, ask what&apos;s blocking the pour, and watch a photo update
                a material&apos;s status live.
              </p>
              <div className="mt-7 flex justify-center">
                <Link href="/dashboard" className="btn-primary">
                  Open Control Tower <ArrowRight className="h-4 w-4" />
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
