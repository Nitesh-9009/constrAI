"use client";

import { useState } from "react";
import { Camera, Loader2, ScanLine, Check, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  "Uploading site photo…",
  "Qwen2.5-VL reading fabrication state…",
  "Cross-checking against detail S-204…",
  "Updating Material Knowledge Graph…",
];

export function PhotoUpload() {
  const [state, setState] = useState<"idle" | "scanning" | "done">("idle");
  const [step, setStep] = useState(0);

  function run() {
    if (state === "scanning") return;
    setState("scanning");
    setStep(0);
    let i = 0;
    const iv = setInterval(() => {
      i += 1;
      if (i >= STEPS.length) {
        clearInterval(iv);
        setState("done");
      } else {
        setStep(i);
      }
    }, 750);
  }

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-ink-700 px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-500/15 text-brand-400">
            <Camera className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-white">Update by photo</p>
            <p className="text-xs text-slate-500">No forms — the VLM reads the site</p>
          </div>
        </div>
      </div>

      <div className="p-5">
        {state === "idle" && (
          <button
            onClick={run}
            className="grid w-full place-items-center gap-3 rounded-xl border border-dashed border-ink-600 bg-ink-850/40 py-8 text-center transition hover:border-brand-500/50 hover:bg-ink-800/40"
          >
            <span className="grid h-12 w-12 place-items-center rounded-full bg-ink-800 text-brand-400">
              <ScanLine className="h-6 w-6" />
            </span>
            <span className="text-sm font-medium text-slate-300">
              Drop a fab-shop photo to auto-update status
            </span>
            <span className="text-xs text-slate-500">Tap to simulate — rebar bay, Level 3</span>
          </button>
        )}

        {state === "scanning" && (
          <div className="space-y-3 py-2">
            {STEPS.map((s, i) => (
              <div
                key={s}
                className={cn(
                  "flex items-center gap-3 text-sm transition",
                  i < step ? "text-brand-300" : i === step ? "text-white" : "text-slate-600"
                )}
              >
                {i < step ? (
                  <Check className="h-4 w-4 text-brand-400" />
                ) : i === step ? (
                  <Loader2 className="h-4 w-4 animate-spin text-brand-400" />
                ) : (
                  <span className="h-4 w-4 rounded-full border border-ink-600" />
                )}
                {s}
              </div>
            ))}
          </div>
        )}

        {state === "done" && (
          <div className="animate-fade-up space-y-3">
            <div className="rounded-xl border border-brand-500/30 bg-brand-500/5 p-4">
              <p className="text-sm font-medium text-white">
                #8 Rebar — Level 3 · <span className="text-brand-300">60% fabricated</span>
              </p>
              <p className="mt-1 text-xs text-slate-400">
                VLM counted 11 of 18.4 tons bent & tagged. Status auto-updated to{" "}
                <span className="text-amber-300">fabricating</span> and written to the graph.
              </p>
            </div>
            <div className="flex items-start gap-2 rounded-xl border border-risk-high/30 bg-risk-high/5 p-4">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-risk-high" />
              <p className="text-xs text-slate-300">
                <span className="font-semibold text-risk-high">Spec mismatch flagged:</span> 2
                bundles show wrong bar mark vs detail S-204. Kayakalp opened an RFI draft for the
                foreman to approve.
              </p>
            </div>
            <button onClick={() => setState("idle")} className="btn-ghost w-full text-xs">
              Run again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
