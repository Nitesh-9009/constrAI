# Kayakalp — Predictive Material Control Tower for Construction

> Will the material be here when the crew needs it — and if not, what do we do right now?

Kayakalp fuses POs, submittals, drawings and job-site photos into one live, **predictive**
material timeline, then **acts** to prevent construction delays before they cascade.

**Hackathon Track 2 — Supply Chain.**

## What it does

- **Material Control Tower** — every order ranked by cost of delay, with calibrated on-time
  probabilities and ETAs.
- **Ask Kayakalp** — a grounded assistant that answers *"what's blocking the pour?"*, predicts
  the risk, and proposes a concrete action (draft escalation, re-sequence, flag submittal).
- **Delay cascade** — propagates any slip through the schedule DAG to price the true
  critical-path impact in dollars.
- **Update by photo** — a simulated VLM reads a fab-shop photo and auto-updates status, flagging
  spec mismatches with no data entry.

## Tech stack

- **Next.js 15** (App Router) · **TypeScript** · **Tailwind CSS**
- **Recharts** (probabilistic ETA visualization) · **lucide-react** · **framer-motion**
- API route `/api/assistant` — deterministic, domain-grounded intelligence that works with **no
  keys**, and upgrades to a live LLM when an OpenAI-compatible key is provided.

### Concept models (referenced in the design)

Qwen2.5-VL (site vision) · ColQwen2 (visual-document RAG) · Docling / GOT-OCR2.0 (extraction) ·
Chronos / Lag-Llama (probabilistic forecasting) · conformal prediction (calibration) · LangGraph
(agentic actions).

## Run locally

```bash
npm install
npm run dev
# http://localhost:3000
```

Optional — enable a live LLM for the assistant:

```bash
cp .env.example .env.local
# set OPENAI_API_KEY (works with OpenAI, Groq, Together, OpenRouter, Ollama…)
```

The app is fully functional without any API key — the assistant falls back to deterministic,
project-grounded answers so the demo is always reliable.

## Deploy

Optimized for **Vercel** — zero config. Push to `main` and import the repo, or use `vercel`.
