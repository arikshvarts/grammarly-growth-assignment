# CLAUDE.md : Project Context

This is a completed home assignment submission for an AI Growth Specialist role at Grammarly.

## What was built

### Mission 1 : LP Conversion Optimization

**Deliverable:** Next.js landing page (Deployed on Vercel).

**Concept:** Paste-first hero with inline input. Users paste text directly in the hero section, see an instant two-column before/after preview, answer 3 personalization questions that each visibly improve the output, receive a refined final version, and sign up only to copy/save the full rewrite + writing profile.

**Flow:** Hero paste, followed by an instant 2-column preview, a 3-question personalization quiz, refined output, a locked result with a writing profile card, and finally a signup unlock.

**Key decisions:**
- 8 questions → 3 (use case, tone, rewrite strength)
- Inline unlock card instead of hard modal
- Brand-safe copy throughout : no detector-evasion claims, no fake AI scores
- 14 event tracking stubs with `variant_id`, `time_to_preview_ms`, `quiz_answers`
- Voice profile near signup, "Humanize anywhere" install bridge
- **Predefined light rewrites** for sample texts (4-10 word changes only)
- **Adaptive system prompts** for light/balanced/strong rewrite modes via Claude API

**API:** `/api/rewrite` : Vercel serverless function calling Claude Haiku 4.5 with dynamic personalization

**Supporting doc:** `final/optimization_plan.md`

---

### Mission 2 : Campaign Analytics Dashboard

**Deliverables:**
- `dashboard/data_cleaning.py` : Python pipeline producing 9 output CSVs
- `web/src/app/dashboard/page.tsx` : React/Next.js interactive multi-tab dashboard
- `final/dashboard_summary.md` : KPI explanation and dataset insights
- `dashboard/metric_definitions.md` : metric formulas and attribution rules

**Concept:** Growth Command Center measuring Qualified Activated Users, not raw clicks or installs.

**Funnel:** The sequence of `did_click_lp`, followed by `did_install_grammarly`, and finally `try_grammarly`.

**Dashboard UX enhancements:**
- **Hover states** on KPI cards with shadow lift and color transitions
- **Color filtering** : click LP color dots to toggle filter (44×44px touch targets)
- **Tooltips** on all metrics with detailed explanations
- **Interactive bar charts** with hover highlighting
- **Responsive design** following accessibility guidelines (WCAG 4.5:1 contrast)

**Key decisions:**
- User-level metrics (not raw events)
- First-touch LP attribution, 7-day window
- `did_click_lp` = install-button click, not page render
- No CAC/ROAS/LTV/CTR claims : dataset doesn't support them

**Key findings (Feb 2026 mock dataset):**
- 3,200 users · 2 LPs · Feb 1–28
- Academic Writing LP: 22.6% Activation CVR, 75.3% Repeat Try Rate
- Business Emails LP: 18.5% Activation CVR, 12.2% Repeat Try Rate
- 43–51% shared dead install rate : post-install problem, not LP problem
- Feature alignment is strong (99.7% for Academic, 100% for Business). Repeat behavior remains the primary optimization gap.

---

## Deliverable Access

- **Live Deployed App:** https://web-tau-six-48.vercel.app/
- **LP:** https://web-tau-six-48.vercel.app/ (root `/`)
- **Dashboard:** https://web-tau-six-48.vercel.app/dashboard

> **API Key on Vercel:** Add `ANTHROPIC_API_KEY` as an Environment Variable in the Vercel project dashboard for the rewrite API to work in production.

---

## File map

```
web/
  (Next.js + Tailwind + TypeScript app)
  src/app/page.tsx               ← Mission 1 Landing Page (paste-first hero)
  src/app/dashboard/page.tsx     ← Mission 2 Dashboard
  src/app/api/rewrite/route.ts   ← Claude Haiku API endpoint
  public/data/*.csv              ← Dashboard CSV data (bundled for Vercel deploy)

dashboard/
  data_cleaning.py               ← Pipeline (run: python dashboard/data_cleaning.py)
  metric_definitions.md          ← KPI formulas and attribution rules
  grammarly_campaign_data.xlsx   ← Source dataset (gitignored)
  output/                        ← 9 output CSVs from data_cleaning.py

final/
  optimization_plan.md           ← Mission 1 writeup
  dashboard_summary.md           ← Mission 2 writeup
  event_tracking_spec.md         ← LP event schema
  submission_checklist.md        ← Final verification list

docs/
  assignment_brief.md            ← Original assignment
  mission_1_lp_conversion_ideas.md  ← Strategy doc (source of truth for Mission 1)
  mission_2_dashboard_ideas.md      ← Strategy doc (source of truth for Mission 2)
```

---

## UI/UX skill (required for UI work)

This repo includes the `ui-ux-pro-max` skill under `.claude/skills/ui-ux-pro-max/`.
Use it for any UI/UX task. Before redesigning pages, generate a design system and
persist it to `design-system/` so layouts and styles follow the skill guidance.

Example:

```bash
python .claude/skills/ui-ux-pro-max/scripts/search.py "AI writing assistant SaaS professional" --design-system --persist -p "Grammarly Growth"
python .claude/skills/ui-ux-pro-max/scripts/search.py "dashboard analytics" --design-system --persist -p "Grammarly Growth" --page "dashboard"
```

---

## Running the project

```bash
# 1. Prepare Data
pip install -r requirements.txt
python dashboard/data_cleaning.py

# 2. Copy CSV data for dashboard (already done, re-run if data changes)
cp dashboard/output/*.csv web/public/data/

# 3. Run React App (LP & Dashboard)
cd web
npm install
ANTHROPIC_API_KEY=your_key_here npm run dev
# Visit http://localhost:3000 for LP
# Visit http://localhost:3000/dashboard for Analytics

# 4. Deploy to Vercel
cd web
npx vercel --prod --yes
# Then: add ANTHROPIC_API_KEY env var in Vercel dashboard > Settings > Environment Variables
```

**Important:** 
- Set `ANTHROPIC_API_KEY` environment variable for the rewrite API to work. The API uses Claude 4.5 Haiku model.
- On Vercel, add the key at: Project → Settings → Environment Variables → `ANTHROPIC_API_KEY`
- Dashboard data is bundled in `web/public/data/` so no separate data preparation is required after deployment.

---

## If continuing in a new chat

Point Claude to:
1. This file (`CLAUDE.md`) for project context
2. `final/optimization_plan.md` for Mission 1 strategy
3. `final/dashboard_summary.md` for Mission 2 insights
4. `docs/mission_1_lp_conversion_ideas.md` and `docs/mission_2_dashboard_ideas.md` for full strategy docs

The submission is complete. Remaining work is only:
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
