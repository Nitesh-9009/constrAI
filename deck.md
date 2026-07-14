# Kayakalp — 10-Slide Deck (slide-by-slide copy)

Maximum 10 slides. Copy below is ready to paste into Google Slides / PDF.
Keep one idea per slide, big visuals, minimal text on screen.

---

## Slide 1 — Title

- **Kayakalp** — Predictive Material Control Tower for Construction
- Subtitle: *"Will the material be here when the crew needs it — and if not, what do we do right now?"*
- Track 2: Supply Chain · Team name · one-line tagline
- Visual: a single timeline turning red → green.

---

## Slide 2 — The problem (make them feel it)

- Once materials are ordered, chaos begins.
- Five questions asked daily, answered by nobody: **Approved? Fabricating? Delayed? Where is it? On time?**
- Data exists — but scattered across POs, emails, submittals, WhatsApp photos, delivery tickets, and P6 / MS Project.
- Result: delays discovered *after* crews are idle → cascading missed milestones and blown budgets.

---

## Slide 3 — Why it stays unsolved

- No system *fuses* the signals; each lives in a silo.
- Existing tools demand manual data entry crews won't do.
- Status is *reactive* (someone asks) and *point-in-time* — never predictive.
- Construction: massive industry, least-served by software.

---

## Slide 4 — The solution

- **Kayakalp = Material Control Tower.** Ingest → fuse into a Material Knowledge Graph →
  **predict** arrival → **simulate** schedule impact → **act** to prevent the delay.
- One screen answers all five questions + a ranked *"what's at risk this week, by $ impact."*
- Visual: the `Ingest → Predict → Simulate → Act` loop diagram.

---

## Slide 5 — How it works (the arc)

- **Question → Prediction → Action** in three beats:
  1. *"What's blocking next week's pour?"*
  2. *"Rebar PO #4471 60% fabricated, 78% chance it lands July 14 — you need July 11.
     HIGH risk, 4-day critical-path slip."*
  3. *"Draft escalation + move pour 3 days?"* → one-click approve.
- Emphasize: it doesn't just report — it *acts*.

---

## Slide 6 — Under the hood (go deeper than an API call)

- **VLM (Qwen2.5-VL):** understands site photos / video, delivery tickets, spec mismatches — no forms.
- **Doc Intelligence (ColPali visual-RAG):** retrieves over drawing / spec *pixels*, not broken OCR.
- **Forecasting (Chronos + survival + conformal):** calibrated arrival intervals.
- **Cascade sim (schedule DAG):** true critical-path + cost-of-delay.
- **Agent (LangGraph):** retrieve → draft → send → call.

---

## Slide 7 — The technique nobody else applies

- Three research-backed moats:
  1. **Visual-document retrieval (ColQwen2)** over construction drawings.
  2. **Conformal-calibrated probabilistic ETAs** (trustworthy, not point guesses).
  3. **Delay-cascade propagation on the schedule graph** (predict the *domino effect*, priced in $).
- All built on open-source models — cheap enough to run per project.

---

## Slide 8 — Why it's easy to adopt

- **Ingest by forwarding** an inbox — zero data entry.
- **Update by photo** — a phone picture updates status.
- **Ask in plain language** on web or WhatsApp — no training.
- Meets crews where they already work.

---

## Slide 9 — Architecture

- Diagram flow:
  Data sources (emails / POs / submittals / drawings / photos / P6)
  → Extraction (ColPali + Docling + Qwen-VL)
  → **Material Knowledge Graph**
  → ETA engine (Chronos / conformal)
  → Cascade simulator (DAG)
  → Agent (LangGraph, human-approval gate)
  → Web / WhatsApp UI.
- Note: open-source, on-prem-capable (data stays with the GC).

---

## Slide 10 — Impact & the ask

- Fewer idle crews · earlier warnings · protected milestones · lower cost.
- What we'll show at demo: the question → prediction → action arc, live, with a real photo update.
- Team + what we need (compute credits / pilot site).
- Closing line: *"Kayakalp — material chaos, rejuvenated into a predictive timeline."*

---

## Video (2 min) script beats

- **0:00–0:20 Problem:** the five questions, over a shot of scattered emails / photos.
- **0:20–1:40 Demo arc:** ask *"what's blocking the pour?"* → prediction with risk + cascade →
  agent drafts escalation + re-sequence → one-click approve → **photo update** live-changes a status.
- **1:40–2:00 Vision:** open-source, per-project, adoptable — "chaos → predictive control tower."
