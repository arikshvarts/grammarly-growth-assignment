# CLAUDE.md — Instructions for Claude Code

You are helping implement a home assignment for an AI Growth Specialist / AI Growth Builder role.

## How to work

Follow this workflow:

```text
Explore → Plan → Implement → Verify → Write final docs → Final review
```

Before major edits, explain the plan. Keep changes small and reviewable. After edits, list what changed and how to test it.

Use Plan Mode first for any broad task. Do not start by editing many files.

## Canonical source files

Read these before making major changes:

- `PROJECT_BRIEF.md`
- `docs/assignment_brief.md`
- `docs/mission_1_lp_conversion_ideas.md`
- `docs/mission_2_dashboard_ideas.md`

The files in `docs/` are source-of-truth strategy docs. Do not rewrite them unless explicitly asked.

## Overall framing

Do not treat this as a generic landing page/dashboard project.

The final submission should communicate:

> I built a measurable growth experiment system: a preview-first quiz LP plus a dashboard that measures downstream activation quality.

## Mission 1 constraints

Use `docs/mission_1_lp_conversion_ideas.md` as the full source of truth. The build should preserve the main ideas from that file, especially: preview-first micro-quiz, 3-question personalization, visible before/after preview, inline unlock, brand-safe positioning, event tracking, expected funnel impact mapping, and A/B decision rules.

- Keep the LP in quiz format.
- Build one functional standalone HTML file: `lp/improved_humanizer.html`.
- Main concept: preview-first AI Humanizer quiz.
- Paste box should appear before or very early in the quiz.
- Use 3 core quiz questions, not the original 8.
- Show partial before/after preview before signup.
- Use an inline unlock card, not an aggressive hard modal.
- Include sample text chips.
- Include event tracking stubs using `trackEvent()` / console logging.
- No real API calls.
- No exposed API keys.
- No fake AI detector scores.

### Mission 1 high-value additions to include when simple

Prefer including these in the HTML if they can be done cleanly without overbuilding:

- A small “What improved” panel: natural phrasing, smoother flow, meaning preserved, tone matched.
- A brand-safe naturalness/quality preview, not an AI detector score.
- A lightweight “voice profile” moment near signup, for example: Clear · Confident · Natural.
- A “Humanize anywhere” install bridge mentioning Gmail, Docs, LinkedIn, ChatGPT, and work documents.

Keep these as future ideas in final docs, not necessarily code:

- AI Campaign Experiment Builder.
- Intent-to-LP Matching Engine.
- Brand-safety checker.

### Mission 1 copy rules

Avoid:

- undetectable
- bypass AI detectors
- pass AI checks
- 100% human
- fake AI detector percentages
- no paywalls, if signup is required
- completely free, if signup is required for full result

Prefer:

- natural writing
- reduce robotic phrasing
- keep your meaning
- improve clarity and flow
- match your voice
- free preview
- no credit card required
- create a free account to copy the full rewrite

## Mission 2 constraints

Use `docs/mission_2_dashboard_ideas.md` as the full source of truth. The build should preserve the main ideas from that file, especially: Growth Command Center framing, Qualified Activated Users, sequence-aware funnel metrics, attribution/deduplication rules, event-date vs cohort-date views, Growth Actions Table, Campaign Quality Score, Traffic Quality Matrix, QA checks, and honest data limitations.

- Metrics must be user-level, not raw-event-level.
- Funnel sequence: `did_click_lp → did_install_grammarly → try_grammarly`.
- `did_click_lp` means LP CTA/install-button click, not page render.
- Use first-touch LP attribution for the executive dashboard.
- Use a 7-day attribution window.
- Separate event-date monitoring from cohort-date conversion.
- Keep repeated `try_grammarly` events only for Repeat Try Rate.
- Add QA checks for missing metadata and impossible sequences.
- Do not invent actual insights before analyzing the dataset.
- Do not claim CAC, ROAS, LTV, revenue, payback, or ad CTR unless the required fields exist.
- Include actual dataset insights only after running the script and/or inspecting the dashboard outputs.
- If exact LP-to-feature mapping is unavailable, keep Promise-Match Rate as a production recommendation, not a calculated metric.

## Claude Code / VS Code workflow rules

- Start broad tasks in Plan Mode. Approve the plan before implementation.
- Keep edits small and review diffs before accepting.
- Use @-mentions for specific files when asking for changes.
- Run verification commands after code changes when possible.
- Use checkpoints/rewind if Claude makes a bad multi-file change.
- Avoid auto-accept for the entire assignment. Use it only for small, low-risk edits.
- Manage context: if the conversation gets long, start a new conversation and point Claude back to `CLAUDE.md`, `PROJECT_BRIEF.md`, and the relevant prompt file.

## Verification checklist

Before calling work complete, verify:

### Mission 1
- HTML opens locally.
- Quiz format is preserved.
- User sees value before signup.
- There are exactly 3 core personalization questions.
- Sample chips work.
- Preview/refined preview/unlock card work.
- Event hooks fire in console.
- No risky detector-evasion copy.
- Responsive enough for desktop and mobile.

### Mission 2
- `dashboard/data_cleaning.py` runs.
- Output CSVs are created in `dashboard/output/`.
- Metrics use sequence-aware user-level logic.
- Attribution window is documented.
- Data limitations are documented.
- Actual dashboard insights come from data, not guessing.

## Final docs style

Final docs should be decisive, not brainstormy.

Use this structure:
- What I built.
- Why it matters.
- How it improves the funnel or measurement.
- What is implemented now.
- What is future/production recommendation.

Separate implemented features from future ideas.
