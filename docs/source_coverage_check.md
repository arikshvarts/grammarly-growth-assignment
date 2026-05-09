# Source Coverage Check

Use this file to verify that the VS Code + Claude Code starter covers the important ideas from the two source strategy docs.

Canonical source files:

- `docs/mission_1_lp_conversion_ideas.md`
- `docs/mission_2_dashboard_ideas.md`

Do not delete or rewrite those source files unless explicitly asked. They are copied exactly from the latest Mission MD files.

---

## Mission 1 coverage

| Source idea | Where it appears / should be implemented | Status |
|---|---|---|
| Final framing: measurable growth experiment, not just nicer LP | `PROJECT_BRIEF.md`, `CLAUDE.md`, `final/optimization_plan.md` | Included |
| Required deliverables: optimization plan + functional HTML | `README.md`, `PROJECT_BRIEF.md`, `final/submission_checklist.md` | Included |
| Keep quiz format | `CLAUDE.md`, `prompts/03_build_lp.md`, `final/submission_checklist.md` | Included |
| Funnel diagnosis and Q1→Q2 / unlock-wall leaks | `docs/mission_1...`, `final/optimization_plan.md` | Included |
| User intent: free AI humanizer = fast paste/result/proof | `docs/mission_1...`, `final/optimization_plan.md`, build prompt | Included |
| Preview-first micro-quiz | `CLAUDE.md`, `PROJECT_BRIEF.md`, build prompt, HTML target | Included |
| 3 core questions | `CLAUDE.md`, build prompt, checklist | Included |
| Remove/merge original 8 questions | `docs/mission_1...`, optimization template | Included |
| Brand-safe positioning | `CLAUDE.md`, `final/market_research_sources.md`, checklist | Included |
| Avoid detector-evasion copy | `CLAUDE.md`, build/review prompts, checklist | Included |
| Competitor/market patterns | `docs/mission_1...`, `final/market_research_sources.md`, optimization template | Included |
| Conversion psychology | `docs/mission_1...`, optimization template | Included |
| CTA recommendations | `docs/mission_1...`, HTML build prompt | Included |
| Before/after preview | Build prompt + checklist | Included |
| Highlighted improvements / What improved panel | Build prompt + `CLAUDE.md` | Included |
| Naturalness preview score, not detector score | `CLAUDE.md`, build prompt | Included |
| Personal Voice Profile | `CLAUDE.md` as include-if-simple / final future idea | Included |
| Humanize Anywhere install bridge | `CLAUDE.md` as include-if-simple / final future idea | Included |
| Event tracking hooks | `CLAUDE.md`, build prompt, `final/event_tracking_spec.md` | Included |
| Experiment plan and A/B decision rules | `docs/mission_1...`, `final/optimization_plan.md` | Included |
| Optional AI Campaign Experiment Builder | `CLAUDE.md`, docs, final future section | Included |
| Intent-to-LP Matching Engine | `CLAUDE.md`, docs, final future section | Included |
| Brand-safety checker | `CLAUDE.md`, docs, final future section | Included |
| Do not overbuild | `CLAUDE.md`, `PROJECT_BRIEF.md`, README | Included |

---

## Mission 2 coverage

| Source idea | Where it appears / should be implemented | Status |
|---|---|---|
| Final framing: Growth Command Center | `PROJECT_BRIEF.md`, `CLAUDE.md`, `final/dashboard_summary.md` | Included |
| Required deliverable: functional visualization link + short explanation | README, `dashboard/dashboard_link.txt`, final docs | Included |
| Dataset clarification | `dashboard/metric_definitions.md`, `CLAUDE.md`, data script | Included |
| `did_click_lp` = LP CTA click, not page render | `CLAUDE.md`, metric definitions, prompts, checklist | Included |
| What dataset can/cannot measure | `final/dashboard_summary.md`, metric definitions, docs | Included |
| North star: Qualified Activated Users | `PROJECT_BRIEF.md`, dashboard summary, data script | Included |
| Vanity vs actionable metrics | Source doc + dashboard summary | Included |
| User-level KPI definitions | `dashboard/metric_definitions.md`, data script | Included |
| Sequence-aware funnel | `data_cleaning.py`, metric definitions, prompts | Included |
| First-touch attribution | `data_cleaning.py`, metric definitions, `CLAUDE.md` | Included |
| 7-day attribution window | `data_cleaning.py`, metric definitions, docs | Included |
| Event-date and cohort-date views | `data_cleaning.py`, metric definitions | Included |
| Executive Overview page | Source doc + dashboard summary template | Included |
| LP Funnel Diagnosis page | Source doc + dashboard summary template | Included |
| Feature Activation page | Source doc + dashboard summary template | Included |
| Data Quality / Monitoring page | `data_cleaning.py`, dashboard summary, checklist | Included |
| Growth Actions Table | `data_cleaning.py`, source doc, dashboard outputs | Included |
| Campaign Quality Score | `data_cleaning.py`, source doc | Included |
| Traffic Quality Matrix | Source doc; should be built in dashboard tool | Included as dashboard recommendation |
| Anomaly detection idea | Source doc; optional future/additional analysis | Included as recommendation |
| Promise-Match Rate | Source doc; production recommendation unless mapping exists | Included in `CLAUDE.md` caveat |
| Wasted Acquisition Ledger | Source doc; future/optional dashboard table | Included as recommendation |
| Segments and future dimensions | Source doc + final dashboard summary | Included |
| Data-quality checks | `data_cleaning.py`, source doc, checklist | Included |
| Small ML ideas: anomaly detection / risk scoring only as bonus | Source doc; not overbuilt in script | Included as recommendation |
| Tooling recommendation: Looker Studio fastest, Power BI optional | README + source doc | Included |
| Suggested report summary text | `final/dashboard_summary.md` | Included |

---

## Claude Code / VS Code best-practice coverage

| Best practice | Where it appears | Status |
|---|---|---|
| Use persistent project memory | `CLAUDE.md`, `AGENTS.md` | Included |
| Use concise source-of-truth | `PROJECT_BRIEF.md` | Included |
| Keep long strategy docs as canonical context | `docs/` | Included |
| Explore/plan before editing | README, `CLAUDE.md`, `/plan-submission` prompt | Included |
| Work in small staged tasks | `prompts/` and `.claude/commands/` | Included |
| Review diffs and avoid full auto-accept | README, `CLAUDE.md` | Included |
| Give Claude verification criteria | `CLAUDE.md`, checklist, tasks, prompts | Included |
| Use reusable slash-command prompts | `.claude/commands/` | Included |
| Provide fallback prompts if commands do not appear in extension | `prompts/` and README | Included |
| Provide runnable checks | `.vscode/tasks.json`, `dashboard/data_cleaning.py` | Included |
| Keep final docs decisive, not brainstormy | `CLAUDE.md`, write-final-docs prompt | Included |
