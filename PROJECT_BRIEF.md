# Project Brief — Grammarly AI Growth Specialist Home Assignment

## Goal
Build a focused, submission-ready package for a two-part AI Growth Specialist home assignment.

The final submission should communicate:

> I built a measurable growth experiment system: a preview-first quiz LP plus a campaign dashboard that measures downstream activation quality.

## Mission 1 — LP Conversion Optimization

Deliverables:
1. `final/optimization_plan.md`
2. `lp/improved_humanizer.html`

Core strategy:

> Convert the AI Humanizer LP from quiz-first friction into preview-first personalization.

Required constraints:
- Keep the LP in quiz format.
- Use a standalone functional HTML/CSS/JS file.
- Show value before signup.
- Reduce the original 8-question quiz to 3 high-value questions.
- Use Grammarly-safe language: natural writing, clarity, tone, meaning preserved.
- Avoid detector-evasion claims.

Recommended LP flow:

```text
Paste text → visible preview → 3-question personalization quiz → refined preview → inline signup unlock
```

## Mission 2 — Performance Analytics & Dashboarding

Deliverables:
1. Link to a functional dashboard/report.
2. `final/dashboard_summary.md` with 1–2 paragraph KPI explanation.
3. Optional supporting files: `dashboard/metric_definitions.md`, `dashboard/data_cleaning.py`, cleaned CSVs, screenshots.

Core strategy:

> Optimize for Qualified Activated Users, not raw clicks or installs.

Funnel sequence:

```text
did_click_lp → did_install_grammarly → try_grammarly
```

Important correction:
- `did_click_lp` is LP CTA/install-button click, not page render.
- Use user-level sequence metrics, not raw event counts.
- Use first-touch LP attribution for the executive view.
- Use a 7-day attribution window.

## Do not overbuild

Do not build:
- real auth,
- backend services,
- real LLM/API calls,
- exposed API keys,
- payment flow,
- complex React app,
- real AI detector claims.

A polished standalone HTML + correct analytics logic + concise final writeups is stronger than an overbuilt app.
