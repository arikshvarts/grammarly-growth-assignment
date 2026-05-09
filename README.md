# Grammarly AI Growth Specialist — Home Assignment

## Live deliverables

| Deliverable | Link |
|---|---|
| **Improved LP — Variant B** | [arikshvarts.github.io/.../lp/improved_humanizer.html](https://arikshvarts.github.io/grammarly-growth-assignment/lp/improved_humanizer.html) |
| **Campaign Performance Dashboard** | [grammarly-growth-assignment-arik.streamlit.app](https://grammarly-growth-assignment-arik.streamlit.app/) |

> LP is live on GitHub Pages. Dashboard is a deployed Streamlit app — no login or download required.

---

## What I built

### Mission 1 — LP Conversion Optimization

Redesigned the AI Humanizer landing page from a quiz-first funnel into a **preview-first personalization flow**.

**The problem:** The original LP loses 40% of users between Q1 and Q2 — not because the questions are bad, but because users arrive expecting an instant tool and get a long survey before seeing any output. The hard modal at the end converts only 23.5% of users who reach it.

**The solution — Variant B:**

```
Paste text → visible before/after preview → 3-question personalization quiz
→ refined preview + voice profile → inline unlock card
```

Key changes: paste box before any question, 8 questions → 3, partial preview before signup, inline unlock card replacing the hard modal, brand-safe copy throughout (no detector-evasion claims, no fake AI scores).

→ See full diagnosis and A/B decision rules: [`final/optimization_plan.md`](final/optimization_plan.md)

---

### Mission 2 — Campaign Performance Dashboard

Built a user-level campaign analytics pipeline measuring **Qualified Activated Users** — users who clicked the LP CTA, installed Grammarly, and triggered `try_grammarly` within a 7-day attribution window.

**Dataset:** 3,200 users · 2 LPs · February 2026 · first-touch attribution

**Top findings:**

| Metric | Academic Writing LP | Business Emails LP |
|---|---|---|
| Activation CVR (click → try) | **22.6%** | 18.5% |
| Repeat Try Rate | **75.3%** | 12.2% |
| Dead Install Rate | 43.0% | 50.6% |
| Campaign Quality Score | **1.00** | 0.87 |

The 4.1pp activation gap is consistent across all 28 cohort days. The repeat try rate gap (75% vs 12%) is the largest signal — academic users return; business users try once and stop. The shared highest-leverage fix is the 43–51% dead install rate, which is downstream of the LP and sits in the post-install onboarding experience.

→ See full analysis: [`final/dashboard_summary.md`](final/dashboard_summary.md)
→ Data pipeline: [`dashboard/data_cleaning.py`](dashboard/data_cleaning.py)
→ Metric definitions: [`dashboard/metric_definitions.md`](dashboard/metric_definitions.md)

---

## Project structure

```
grammarly-growth-assignment/
│
├── lp/
│   └── improved_humanizer.html        ← Variant B LP (live)
│
├── dashboard/
│   ├── dashboard.html                 ← Campaign dashboard (live)
│   ├── data_cleaning.py               ← Python pipeline (runs locally)
│   ├── metric_definitions.md          ← KPI definitions and attribution rules
│   ├── grammarly_campaign_data.xlsx   ← Source dataset
│   └── output/                        ← 9 pipeline output CSVs
│       ├── user_funnel.csv
│       ├── lp_funnel_metrics.csv
│       ├── feature_metrics.csv
│       ├── daily_event_metrics.csv
│       ├── cohort_metrics.csv
│       ├── growth_actions.csv
│       ├── qa_summary.csv
│       └── ...
│
├── final/
│   ├── optimization_plan.md           ← Mission 1 diagnosis + strategy
│   └── dashboard_summary.md          ← Mission 2 KPIs + insights
│
├── docs/
│   ├── assignment_brief.md
│   ├── mission_1_lp_conversion_ideas.md
│   └── mission_2_dashboard_ideas.md
│
└── original/
    └── humanizer_original.html        ← Original LP (control)
```

---

## Run the data pipeline locally

```bash
pip install -r requirements.txt
python dashboard/data_cleaning.py
```

Outputs 9 CSVs to `dashboard/output/`. The dashboard HTML reads embedded data from those outputs — no live database connection required.

---

## Design decisions worth noting

**LP:** Kept quiz format as required, but changed the quiz's role from friction gate to personalization layer. Value (preview) comes before commitment (quiz + signup). Inline unlock card replaces hard modal — user sees proof before the wall, not a blurred promise.

**Dashboard:** Chose user-level metrics over raw event counts to avoid inflating numbers. `did_click_lp` is treated as install-button click, not page render. Attribution anchors on the user's first LP CTA click. CAC, ROAS, LTV, and page-render CVR are explicitly excluded — the dataset does not support them.

**What's not built (and why):** No real LLM API calls, no auth, no backend. A polished standalone LP + correct analytics logic + honest writeups communicates the growth thinking more clearly than an overbuilt app.
