# Grammarly AI Growth Specialist : Home Assignment

## Project Status: ✅ Complete

A full-stack growth assignment solution with a **preview-first landing page** and **campaign analytics dashboard** built with Next.js, React, and TypeScript.

---

## Quick Start

```bash
# Install and run
cd web && npm install
ANTHROPIC_API_KEY=your_key_here npm run dev

# Then visit:
# - http://localhost:3000 (Landing Page)
# - http://localhost:3000/dashboard (Analytics Dashboard)
```

---

## What I built

### Mission 1 : LP Conversion Optimization

Redesigned the AI Humanizer landing page from a quiz-first funnel into a **preview-first personalization flow**.

**The problem:** The original LP loses 40% of users between Q1 and Q2 : not because the questions are bad, but because users arrive expecting an instant tool and get a long survey before seeing any output. The hard modal at the end converts only 30.7% of users who reach it.

**The solution : Variant B:**

The solution consists of a "Paste-first" hero where users input text, see an immediate before-and-after preview, complete a 3-question personalization quiz, and receive a refined output leading to an inline unlock card.

Key changes: paste box before any question, 8 questions → 3, partial preview before signup, inline unlock card replacing the hard modal, brand-safe copy throughout (no detector-evasion claims, no fake AI scores).

→ See full diagnosis and A/B decision rules: [`final/optimization_plan.md`](final/optimization_plan.md)

---

### Mission 2 : Campaign Performance Dashboard

Built a user-level campaign analytics pipeline measuring **Qualified Activated Users** : users who clicked the LP CTA, installed Grammarly, and triggered `try_grammarly` within a 7-day attribution window.

**Dataset:** 3,200 users · 2 LPs · February 2026 · first-touch attribution

**Top findings:**

| Metric | Academic Writing LP | Business Emails LP |
|---|---|---|
| Activation CVR (click → try) | **22.6%** | 18.5% |
| Repeat Try Rate | **75.3%** | 12.2% |
| Dead Install Rate | 43.0% | 50.6% |
| Campaign Quality Score | **1.00** | 0.87 |

The 4.1pp activation gap is consistent across all 28 cohort days. The repeat try rate gap (75% vs 12%) is the largest signal : academic users return; business users try once and stop. The shared highest-leverage fix is the 43–51% dead install rate, which is downstream of the LP and sits in the post-install onboarding experience.

→ See full analysis: [`final/dashboard_summary.md`](final/dashboard_summary.md)
→ Data pipeline: [`dashboard/data_cleaning.py`](dashboard/data_cleaning.py)
→ Metric definitions: [`dashboard/metric_definitions.md`](dashboard/metric_definitions.md)

---

## Project structure

```
grammarly-growth-assignment/
│
├── web/                               ← Next.js + React + TypeScript app
│   ├── src/app/page.tsx              ← Mission 1 Landing Page
│   ├── src/app/dashboard/page.tsx    ← Mission 2 Analytics Dashboard
│   ├── src/app/api/rewrite/route.ts  ← Anthropic API (Claude Haiku 4.5)
│   └── src/components/               ← React components
│
├── dashboard/
│   ├── data_cleaning.py              ← Python data pipeline (CSVs → metrics)
│   ├── metric_definitions.md         ← KPI definitions and attribution rules
│   ├── grammarly_campaign_data.xlsx  ← Source dataset (mock, Feb 2026)
│   └── output/                       ← 9 pipeline output CSVs
│
└── final/
    ├── optimization_plan.md          ← Mission 1 full strategy
    ├── dashboard_summary.md          ← Mission 2 full analysis
    ├── event_tracking_spec.md        ← LP event tracking schema
    └── submission_checklist.md       ← Final verification list
```

---

## UI/UX Enhancements

### Landing Page
- **Preview-first flow** : users see before/after immediately after pasting text
- **Light rewrites** : predefined examples change only 4-10 words to show quality
- **Adaptive personalization** : system prompts adjust based on rewrite strength (light/balanced/strong)
- **Responsive design** : works on mobile and desktop with accessible contrast

### Analytics Dashboard
- **Interactive KPI cards** : hover states with shadow lift and color transitions
- **Color filtering** : click LP color dots to toggle filter (44×44px touch targets per WCAG guidelines)
- **Number tooltips** : all metrics show detailed explanations on hover
- **Bar chart highlighting** : hover to see exact values and compare metrics
- **Responsive dashboard** : works on all screen sizes

---

## API & Data

**Rewrite API:** `/api/rewrite` calls Claude Haiku 4.5 with dynamic system prompts based on:
- Use case (work, essay, marketing, general)
- Tone preference (natural, professional, conversational, confident)
- Rewrite strength (light, balanced, strong)

**Data Pipeline:** `python dashboard/data_cleaning.py` produces 9 CSVs:
- `user_funnel.csv` : user-level funnel data
- `cohort_metrics.csv` : activation metrics by LP and cohort date
- `daily_event_metrics.csv` : daily event volumes
- `feature_metrics.csv` : first product feature alignment
- And more...

---

## Design decisions worth noting

**LP:** Preview comes before quiz. 8 questions → 3. Inline unlock card (not hard modal). Brand-safe copy (no detector-evasion claims, no fake AI scores).

**Dashboard:** User-level metrics, not raw events. First-touch attribution, 7-day window. `did_click_lp` = install-button click (not page render). No CAC/ROAS/LTV claims : dataset doesn't support them.

**Why Next.js:** Modern React app with API routes, easy deployment to Vercel, hot module reloading for rapid iteration, built-in optimization and TypeScript support.

