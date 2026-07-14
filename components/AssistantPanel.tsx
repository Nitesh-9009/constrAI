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
import { materialById } from "@/lib/data";
import { cn } from "@/lib/utils";

interface Action {
  id: string;
  label: string;
  kind: "escalate" | "resequence" | "reorder" | "flag";
  detail: string;
}
interface Msg {
  role: "user" | "assistant";
  text: string;
  materialIds?: string[];
  actions?: Action[];
  mode?: string;
}

const SUGGESTIONS = [
  "What's blocking the Level 3 pour?",
  "What's at risk this week?",
  "Tell me about PO-4155",
  "Which supplier is weakest?",
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
      <strong key={i} className="font-semibold text-white">
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
      text: "I'm your material control tower. Ask about what's blocking the schedule, a specific PO, or which supplier is weakest — I'll predict the risk and propose an action.",
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
          materialIds: data.materialIds,
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
      <div className="flex items-center gap-2 border-b border-ink-700 px-5 py-4">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-500/15 text-brand-400">
          <Sparkles className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-semibold text-white">Ask Kayakalp</p>
          <p className="text-xs text-slate-500">Predict → act, grounded in your project</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
        {messages.map((m, i) => (
          <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                m.role === "user"
                  ? "bg-brand-500 text-ink-950"
                  : "border border-ink-700 bg-ink-850/80 text-slate-200"
              )}
            >
              <p className="whitespace-pre-wrap">{renderRich(m.text)}</p>

              {m.role === "assistant" && m.mode && (
                <div className="mt-2">
                  <span
                    className={cn(
                      "chip text-[10px]",
                      m.mode === "llm"
                        ? "border-brand-500/40 bg-brand-500/10 text-brand-300"
                        : "border-ink-600 bg-ink-800 text-slate-500"
                    )}
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        m.mode === "llm" ? "bg-brand-400" : "bg-slate-500"
                      )}
                    />
                    {m.mode === "llm" ? "AI · Llama-3.3-70B" : "Grounded reasoning"}
                  </span>
                </div>
              )}

              {m.materialIds && m.materialIds.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {m.materialIds.map((id) => {
                    const mat = materialById(id);
                    if (!mat) return null;
                    return (
                      <Link
                        key={id}
                        href={`/dashboard/materials/${id}`}
                        className="chip border-ink-600 bg-ink-800 text-slate-300 hover:border-brand-500 hover:text-brand-300"
                      >
                        {mat.poNumber} · {mat.name.split("—")[0].trim()}
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    );
                  })}
                </div>
              )}

              {m.actions && m.actions.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="label-muted">Recommended actions</p>
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
                            ? "border-brand-500/40 bg-brand-500/10"
                            : "border-ink-600 bg-ink-800/60 hover:border-brand-500/60 hover:bg-ink-700/60"
                        )}
                      >
                        <span
                          className={cn(
                            "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg",
                            isDone ? "bg-brand-500 text-ink-950" : "bg-ink-700 text-brand-400"
                          )}
                        >
                          {isDone ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
                        </span>
                        <span>
                          <span className="block text-xs font-semibold text-white">
                            {isDone ? "Approved · queued" : a.label}
                          </span>
                          <span className="block text-xs text-slate-400">{a.detail}</span>
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
            <div className="flex items-center gap-2 rounded-2xl border border-ink-700 bg-ink-850/80 px-4 py-3 text-sm text-slate-400">
              <Loader2 className="h-4 w-4 animate-spin text-brand-400" />
              Predicting…
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-ink-700 px-5 py-4">
        <div className="mb-3 flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => ask(s)}
              disabled={loading}
              className="chip border-ink-600 bg-ink-800/60 text-slate-400 hover:border-brand-500/50 hover:text-brand-300"
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
            placeholder="Ask about any material, PO, or the schedule…"
            className="flex-1 rounded-xl border border-ink-700 bg-ink-800/70 px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:border-brand-500 focus:outline-none"
          />
          <button type="submit" disabled={loading || !input.trim()} className="btn-primary px-3">
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
