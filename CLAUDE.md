# CLAUDE.md — Project Context

This is a completed home assignment submission for an AI Growth Specialist role at Grammarly.

## What was built

### Mission 1 — LP Conversion Optimization

**Deliverable:** `lp/improved_humanizer.html` — a standalone HTML/CSS/JS landing page.

**Concept:** Preview-first micro-quiz. Users paste text, see a visible before/after preview, answer 3 personalization questions, receive a refined preview, and sign up only to copy/save the full rewrite.

**Flow:** Paste text → visible preview → 3-question quiz → refined preview → inline unlock card

**Key decisions:**
- 8 questions → 3 (use case, tone, rewrite strength)
- Inline unlock card instead of hard modal
- Brand-safe copy throughout — no detector-evasion claims, no fake AI scores
- 14 event tracking stubs with `variant_id`, `time_to_preview_ms`, `quiz_answers`
- Voice profile near signup, "Humanize anywhere" install bridge

**Supporting doc:** `final/optimization_plan.md`

---

### Mission 2 — Campaign Analytics Dashboard

**Deliverables:**
- `dashboard/data_cleaning.py` — Python pipeline producing 9 output CSVs
- `dashboard/streamlit_app.py` — interactive multi-tab Streamlit dashboard
- `dashboard/dashboard.html` — standalone static HTML fallback (Chart.js)
- `final/dashboard_summary.md` — KPI explanation and dataset insights
- `dashboard/metric_definitions.md` — metric formulas and attribution rules

**Concept:** Growth Command Center measuring Qualified Activated Users, not raw clicks or installs.

**Funnel:** `did_click_lp → did_install_grammarly → try_grammarly`

**Key decisions:**
- User-level metrics (not raw events)
- First-touch LP attribution, 7-day window
- `did_click_lp` = install-button click, not page render
- No CAC/ROAS/LTV/CTR claims — dataset doesn't support them

**Key findings (Feb 2026 mock dataset):**
- 3,200 users · 2 LPs · Feb 1–28
- Academic Writing LP: 22.6% Activation CVR, 75.3% Repeat Try Rate
- Business Emails LP: 18.5% Activation CVR, 12.2% Repeat Try Rate
- 43–51% shared dead install rate — post-install problem, not LP problem
- Feature alignment is strong (99.7% / 100%) — repeat behavior is the gap

---

## Live links (pending Streamlit Cloud deployment)

- LP (GitHub Pages): `https://arikshvarts.github.io/grammarly-growth-assignment/lp/improved_humanizer.html`
- Static dashboard (GitHub Pages): `https://arikshvarts.github.io/grammarly-growth-assignment/dashboard/dashboard.html`
- Streamlit dashboard: deploy at share.streamlit.io → `dashboard/streamlit_app.py`

---

## File map

```
lp/
  improved_humanizer.html        ← Mission 1 deliverable

dashboard/
  data_cleaning.py               ← Pipeline (run: python dashboard/data_cleaning.py)
  streamlit_app.py               ← Streamlit dashboard (run: streamlit run dashboard/streamlit_app.py)
  dashboard.html                 ← Static HTML fallback
  metric_definitions.md          ← KPI formulas and attribution rules
  grammarly_campaign_data.xlsx   ← Source dataset (gitignored)
  output/                        ← 9 output CSVs from data_cleaning.py

final/
  optimization_plan.md           ← Mission 1 writeup
  dashboard_summary.md           ← Mission 2 writeup
  event_tracking_spec.md         ← LP event schema

docs/
  assignment_brief.md            ← Original assignment
  mission_1_lp_conversion_ideas.md  ← Strategy doc (source of truth for Mission 1)
  mission_2_dashboard_ideas.md      ← Strategy doc (source of truth for Mission 2)
```

---

## Running the project

```bash
# Data pipeline
pip install -r requirements.txt
python dashboard/data_cleaning.py

# Streamlit dashboard (requires Python 3.11; Python 3.13 has a streamlit compatibility issue)
streamlit run dashboard/streamlit_app.py

# LP — just open in browser
open lp/improved_humanizer.html
```

---

## If continuing in a new chat

Point Claude to:
1. This file (`CLAUDE.md`) for project context
2. `final/optimization_plan.md` for Mission 1 strategy
3. `final/dashboard_summary.md` for Mission 2 insights
4. `docs/mission_1_lp_conversion_ideas.md` and `docs/mission_2_dashboard_ideas.md` for full strategy docs

The submission is complete. Remaining work is only:
- Paste the Streamlit Cloud URL into `dashboard/dashboard_link.txt` and `final/dashboard_summary.md`
- Any final polish requested before sending to Grammarly

---

## Copy constraints (Mission 1 — do not violate)

Never add to the LP:
- "undetectable", "bypass AI detectors", "pass AI checks", "100% human"
- Fake AI detector percentages or before/after detection scores
- "completely free" or "no paywalls" if signup is required

Always use instead:
- "free preview", "no credit card required"
- "natural writing", "improve clarity and flow", "keep your meaning"
- "create a free account to copy the full rewrite"

## Metric constraints (Mission 2 — do not violate)

Never claim unless the field exists in the dataset:
- CAC (needs ad spend), ROAS (needs spend + revenue), LTV (needs subscription events)
- Ad CTR (needs impressions), page-render CVR (needs render events)
