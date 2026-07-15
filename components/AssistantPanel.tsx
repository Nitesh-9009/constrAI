"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Send,
  Sparkles,
  Mail,
  CalendarClock,
  Flag,
  RefreshCw,
  Loader2,
  ArrowRight,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Action {
  id: string;
  label: string;
  kind: "escalate" | "resequence" | "reorder" | "flag";
  detail: string;
}
interface MaterialLink {
  id: string;
  name: string;
}
interface Msg {
  role: "user" | "assistant";
  text: string;
  materialLinks?: MaterialLink[];
  actions?: Action[];
  mode?: string;
}

const SUGGESTIONS = [
  "What is late?",
  "What should I do today?",
  "When will my steel arrive?",
  "Which supplier is often late?",
];

const actionIcon = {
  escalate: Mail,
  resequence: CalendarClock,
  reorder: RefreshCw,
  flag: Flag,
};

function renderRich(text: string) {
  // minimal **bold** support
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? (
      <strong key={i} className="font-semibold text-slate-900">
        {p.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{p}</span>
    )
  );
}

export function AssistantPanel() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      text: "Hi! Ask me anything about your materials in plain words. For example: **what is late?** or **what should I do today?**",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function ask(question: string) {
    if (!question.trim() || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: question }]);
    setLoading(true);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: data.answer ?? "Sorry, I couldn't process that.",
          materialLinks: data.materialLinks,
          actions: data.actions,
          mode: data.mode,
        },
      ]);
    } catch (err) {
      const aborted = err instanceof DOMException && err.name === "AbortError";
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: aborted
            ? "That took too long to respond. Please try again."
            : "I couldn't reach the engine just now — please try again.",
        },
      ]);
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 border-b border-hairline px-5 py-4">
        <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-800 text-white shadow-glow">
          <Sparkles className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 animate-glow-pulse rounded-full bg-success-500 ring-2 ring-white" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">Ask ConstrAI</p>
          <p className="text-xs text-slate-400">Ask about your materials in plain words</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
        {messages.map((m, i) => (
          <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                m.role === "user"
                  ? "bg-primary-600 text-white shadow-soft"
                  : "border border-hairline bg-slate-50 text-slate-700"
              )}
            >
              <p className="whitespace-pre-wrap">{renderRich(m.text)}</p>

              {m.role === "assistant" && m.mode && (
                <div className="mt-2">
                  <span
                    className={cn(
                      "chip text-[10px]",
                      m.mode === "ai"
                        ? "border-primary-200 bg-primary-50 text-primary-700"
                        : "border-hairline bg-white text-slate-400"
                    )}
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        m.mode === "ai" ? "bg-primary-500" : "bg-slate-400"
                      )}
                    />
                    {m.mode === "ai" ? "AI answer" : "Answer"}
                  </span>
                </div>
              )}

              {m.materialLinks && m.materialLinks.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {m.materialLinks.map((mat) => (
                    <Link
                      key={mat.id}
                      href={`/dashboard/materials/${mat.id}`}
                      className="chip border-hairline bg-white text-slate-600 transition hover:border-primary-300 hover:text-primary-700"
                    >
                      {mat.name.split("—")[0].trim()}
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  ))}
                </div>
              )}

              {m.actions && m.actions.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="label-muted">What to do</p>
                  {m.actions.map((a) => {
                    const Icon = actionIcon[a.kind];
                    const isDone = done[a.id];
                    return (
                      <button
                        key={a.id}
                        onClick={() => setDone((d) => ({ ...d, [a.id]: true }))}
                        className={cn(
                          "flex w-full items-start gap-2.5 rounded-xl border px-3 py-2.5 text-left transition",
                          isDone
                            ? "border-success-500/30 bg-success-50"
                            : "border-hairline bg-white hover:border-primary-300 hover:bg-primary-50/50"
                        )}
                      >
                        <span
                          className={cn(
                            "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg",
                            isDone ? "bg-success-500 text-white" : "bg-primary-50 text-primary-600"
                          )}
                        >
                          {isDone ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
                        </span>
                        <span>
                          <span className="block text-xs font-semibold text-slate-900">
                            {isDone ? "Approved · queued" : a.label}
                          </span>
                          <span className="block text-xs text-slate-500">{a.detail}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-2xl border border-hairline bg-slate-50 px-4 py-3 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin text-primary-600" />
              Predicting…
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-hairline px-5 py-4">
        <div className="mb-3 flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => ask(s)}
              disabled={loading}
              className="chip border-hairline bg-slate-50 text-slate-500 transition hover:border-primary-300 hover:text-primary-700"
            >
              {s}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
          className="flex items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question here…"
            className="flex-1 rounded-xl border border-hairline bg-slate-50 px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 transition focus:border-primary-300 focus:bg-white focus:outline-none"
          />
          <button type="submit" disabled={loading || !input.trim()} className="btn-primary px-3">
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
