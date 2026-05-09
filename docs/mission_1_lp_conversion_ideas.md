# Mission 1 — LP Conversion Optimization for Grammarly AI Humanizer

## 0. Final framing

Do **not** present this as only a nicer landing page.

Present it as:

> **A measurable growth experiment that turns the AI Humanizer LP from a quiz-first funnel into a preview-first personalization flow.**

Best one-liner:

> **The original LP already captures intent, but loses users by delaying value behind a long quiz and a hard unlock wall. My variant keeps the quiz format, but turns the quiz into a short personalization layer: users see value fast, refine the result in three questions, and sign up only when they want to copy or save the full rewrite.**

---

## 1. What Mission 1 is asking for

Mission 1 asks you to improve the conversion rate of the AI Humanizer landing page.

Required deliverables:

1. **Concise optimization plan** explaining diagnosis, recommendations, and rationale.
2. **One functional HTML file** with an improved landing page experience.

Hard constraint:

> The LP must stay in **quiz format**.

Important interpretation:

> “Quiz format” does **not** mean the page must start with eight questions. The quiz can be a short personalization step inside a tool-like experience.

---

## 2. Funnel diagnosis

Current 30-day funnel:

| Stage | Users | % of page renders |
|---|---:|---:|
| Page render | 84,200 | 100.0% |
| Clicked “Start Humanizing” | 78,300 | 93.0% |
| Q1 — Sentence length | 77,900 | 92.5% |
| Q2 — English variant | 46,300 | 55.0% |
| Q3 — Formality | 40,400 | 48.0% |
| Q4 — Vocabulary | 39,900 | 47.4% |
| Q5 — Writing style | 39,800 | 47.25% |
| Q6 — Main goal | 38,700 | 46.0% |
| Q7 — Humanization slider | 36,200 | 43.0% |
| Q8 — Light humor | 35,800 | 42.5% |
| Signup / unlock modal viewed | 27,400 | 32.5% |
| Signup CTA clicked | 8,420 | 10.0% |

### Main diagnosis

The top of the funnel is **not** the main problem.

A 93% click rate on “Start Humanizing” means users are interested. The major issue starts after users realize the experience is not an instant humanizer tool, but a long questionnaire.

Biggest leaks:

1. **Q1 → Q2:** 77,900 → 46,300 users.  
   This suggests the quiz becomes friction almost immediately.

2. **Signup modal viewed → signup CTA clicked:** 27,400 → 8,420 users.  
   This suggests the signup wall is too hard, too vague, too early, or not justified by enough visible value.

Key sentence to use:

> **The issue is not traffic intent. The issue is value timing.**

---

## 3. User intent

A user searching **“free AI humanizer”** likely wants to:

- Paste text immediately.
- Get a humanized result quickly.
- See proof before signup.
- Make AI-assisted writing sound natural.
- Reduce robotic phrasing.
- Preserve meaning.
- Avoid a bait-and-switch where “free” becomes a hard signup/paywall.

They probably do **not** want to answer eight abstract questions before seeing whether the tool works.

So the LP should feel like:

> **A useful writing tool with personalization, not a long survey.**

---

## 4. Core product concept: Preview-First Micro-Quiz

### Current pattern to avoid

```text
Hero → Start Humanizing → 8 questions → processing → blurred result → signup modal
```

### Recommended pattern

```text
Paste text → visible preview → 3 personalization questions → refined preview → signup to copy/save full result
```

This keeps the quiz format, but changes its role:

- Bad quiz role: blocks value.
- Good quiz role: improves/personalizes value.

---

## 5. Recommended LP flow

### Step 1 — Hero + paste box

Suggested headline:

> **Make AI writing sound natural and true to your voice**

Suggested subheadline:

> Paste your text and get a clearer, more natural version with Grammarly’s writing suggestions. Preview it free — no credit card required.

CTA:

> **Preview my rewrite**

Supporting microcopy:

> Keep your meaning. Improve tone, clarity, and flow.

---

### Step 2 — Sample text chips

Add chips below the paste box:

- Essay intro
- Work email
- Marketing blurb
- LinkedIn post
- Job application

Why this is useful:

- Reduces blank-page friction.
- Lets the reviewer test the HTML quickly.
- Makes the page feel like a real tool.
- Matches common competitor UX patterns.

---

### Step 3 — Visible before/after preview

Show a partial result **before signup**.

Recommended layout:

| Original | Grammarly preview |
|---|---|
| User text | Rewritten preview |

Add:

- Highlighted changed phrases.
- 2–4 visible rewritten lines.
- A soft fade/lock for the rest.
- Short notes explaining what improved.

Do **not** blur the entire result before showing value.

User should feel:

> “This is my improved text. I want the full version.”

---

### Step 4 — Three-question personalization quiz

Use progress text:

```text
Personalize your rewrite — 1 of 3
```

The quiz should appear as quick answer chips, not a heavy form.

---

### Step 5 — Refined preview

After the three answers, show a better preview and a “what changed” panel:

```text
✓ More natural phrasing
✓ Smoother sentence rhythm
✓ Meaning preserved
✓ Tone matched to your goal
```

This makes the quiz feel useful instead of random.

---

### Step 6 — Inline unlock card

Use a soft inline unlock instead of a hard full-screen modal.

Example:

```text
Your full rewrite is ready

You’ve seen the preview. Create a free account to copy the full rewrite,
keep editing tone, and save your preferred style.

[Create free account to copy full rewrite]
[Keep editing preview]
```

Why this works:

- The user already saw proof.
- The CTA explains the reward.
- The unlock feels like the next step, not a trick.

---

## 6. Recommended quiz questions

Replace the current 8-step quiz with 3 high-value questions.

### Q1 — Where will you use this?

Options:

- Work email / report
- Essay / application
- Marketing / social post
- General writing

Why:

- Captures use case.
- Helps personalize examples and tone.
- Maps to user jobs-to-be-done.

---

### Q2 — How should it sound?

Options:

- Natural
- Professional
- Conversational
- Confident

Why:

- Combines formality, writing style, vocabulary, and tone.
- Feels directly connected to the rewrite result.

---

### Q3 — How much should Grammarly change?

Options:

- Light polish
- Balanced rewrite
- Stronger rewrite

Why:

- Gives control.
- Replaces vague/risky “humanization strength” language.
- Avoids detector-evasion framing.

---

### Questions to remove, merge, or move

| Current question | Recommended handling | Reason |
|---|---|---|
| Sentence length | Merge into rewrite strength | Not worth a separate step |
| English variant | Move to advanced settings or infer | Too early; high friction |
| Formality | Merge into tone question | Overlaps with style |
| Vocabulary | Merge into tone/rewrite strength | Overlaps with style/formality |
| Writing style | Merge into tone question | Too similar to formality |
| Main goal | Keep as Q1/use case | Valuable |
| Humanization slider | Replace with rewrite strength | Safer, clearer |
| Light humor | Remove | Novelty friction; not core intent |

---

## 7. Brand-safe positioning

This is critical for Grammarly.

The market has two lanes:

### Lane 1 — Brand-safe writing assistance

Examples:

- Grammarly
- QuillBot
- Ahrefs
- Scribbr

Positioning:

- Natural writing.
- Clarity.
- Readability.
- Preserving meaning.
- Authentic voice.
- Signup after value.

### Lane 2 — Detector-evasion tools

Examples:

- Undetectable AI
- StealthGPT
- Humanize AI
- NoteGPT
- Aggressive “AI detector bypass” tools

Positioning:

- Undetectable.
- Bypass AI detectors.
- Pass AI checks.
- 100% human.
- No signup / unlimited.

### Recommended Grammarly stance

> **Grammarly should not compete with bypass tools on deception. It should compete on trustworthy, high-quality rewriting.**

Avoid:

```text
Undetectable
Pass AI checks
Bypass AI detectors
100% human
Completely free
No paywalls
Unlimited free
Before: 94% AI / After: 2% AI
```

Use instead:

```text
Make AI writing sound natural
Reduce robotic phrasing
Keep your meaning
Improve clarity, tone, and flow
Rewrite in your voice
Free preview
No credit card required
Create a free account to copy the full rewrite
```

---

## 8. Competitor insights

Common competitor patterns worth borrowing:

- Input box above the fold.
- Sample text option.
- Immediate “Humanize” / “Rewrite” CTA.
- Before/after preview.
- Tone controls.
- Visible result before signup.
- Trust/privacy microcopy.
- Signup or upgrade after value.

Main conclusion:

> **The quiz should not replace the tool experience. It should enhance the tool experience.**

Grammarly’s advantage:

> Competitors can offer a quick tool, but Grammarly can offer a trusted writing assistant experience that improves clarity, tone, and authenticity without shady detector-evasion claims.

---

## 9. Conversion psychology

### Time-to-value

Users want proof quickly. Every question before visible value increases drop-off risk.

### Commitment effect

Once users paste their own text, they are more likely to continue.

### Endowment effect

Once users see their improved text, they feel ownership over the result.

### Curiosity gap

Show enough output to prove value, then gate the full result.

### Loss aversion

“Your full rewrite is ready” is stronger than “Sign up.”

### Friction compression

Three questions feel like personalization. Eight questions feel like work.

### Trust before wall

Signup should happen after proof, not before.

### Avoid bait-and-switch

Do not say “completely free / no paywalls” if there is a signup wall. Better:

> **Free preview. Create a free account to copy the full rewrite.**

---

## 10. CTA recommendations

Weak CTAs:

```text
Continue
Sign up
Unlock
Start
```

Better CTAs:

```text
Preview my rewrite
Generate my natural version
Refine my rewrite
Create free account to copy full rewrite
Save my voice profile
Keep editing preview
```

Best signup CTA:

> **Create free account to copy full rewrite**

Why:

- It is specific.
- It explains the reward.
- It reduces signup anxiety.
- It matches the user’s goal.

---

## 11. Strong product additions

### 1. Before/after preview

The most important feature. It proves value before signup.

### 2. Highlighted improvements

Highlight changed phrases and label them:

- More natural phrase
- Clearer transition
- Warmer tone
- Less repetitive wording

This feels more Grammarly-like than fake AI detector scores.

### 3. “Why this sounds more natural” panel

Example:

```text
✓ Reduced robotic phrasing
✓ Improved sentence rhythm
✓ Preserved original meaning
✓ Matched a professional tone
```

### 4. Naturalness preview score

Use a brand-safe quality score, not an AI detector score.

Dimensions:

- Clarity
- Tone warmth
- Sentence variety
- AI-like phrasing reduced

Avoid calling it “AI detection.”

### 5. Personal Voice Profile

Turn signup into a useful product moment.

Instead of:

> Sign up to unlock.

Use:

> Create a free account to save your voice profile.

Example:

```text
Your voice profile:
Clear · Confident · Natural · Slightly warm
```

Why:

- Makes signup feel useful.
- Creates retention logic.
- Connects to Grammarly’s broader product.
- Differentiates Grammarly from generic humanizer tools.

### 6. Humanize Anywhere install bridge

After preview, explain why installing Grammarly matters:

```text
Humanize and polish text anywhere you write:
Gmail · Google Docs · LinkedIn · ChatGPT · Work documents
```

Why:

- Turns one-time tool intent into product adoption.
- Makes installation feel practical.

---

## 12. Event tracking hooks for the HTML

Adding event hooks makes the LP measurable.

Recommended events:

```text
lp_rendered
text_entered
sample_text_clicked
preview_requested
preview_generated
quiz_started
quiz_step_viewed
quiz_step_completed
preview_refined
unlock_wall_viewed
unlock_cta_clicked
unlock_wall_dismissed
signup_cta_clicked
```

Recommended properties:

```text
variant_id
lp_name
device_type
traffic_source
ad_keyword
chars_bucket
sample_used
quiz_answers
wall_type
cta_copy
preview_visible_lines
time_to_preview
```

Important metric this enables:

> **Time to preview** — how quickly users reach visible value.

---

## 13. Experiment plan

Treat the current LP as **Control** and your improved LP as **Variant B**.

### Primary metric

```text
Signup CVR = signup CTA clicks / page renders
```

### Secondary metrics

```text
Text input rate
Sample text click rate
Preview generation rate
Quiz completion rate
Unlock wall view rate
Unlock wall → signup click rate
Time to preview
```

### Guardrail metrics

```text
Install rate
Try Grammarly rate
Bounce rate
Page load time
Downstream activation quality
Brand-risk complaints or negative feedback
```

### A/B test backlog

| Experiment | Hypothesis | Priority |
|---|---|---|
| Preview-first vs quiz-first | Showing value earlier increases signup intent | Very high |
| 3 questions vs 8 questions | Less friction improves quiz completion | Very high |
| Visible partial preview vs blurred result | Proof before signup improves trust | Very high |
| Inline unlock vs hard modal | Softer wall improves signup CTA clicks | High |
| “Copy full rewrite” CTA vs “Sign up” | Specific reward increases clicks | High |
| Sample chips vs no samples | Reduces blank-state hesitation | Medium-high |
| Brand-safe copy vs detector-evasion copy | Safer copy improves downstream quality and trust | Medium |
| Voice profile signup framing | Makes account creation feel more useful | Medium-high |

---

## 14. Optional above-and-beyond ideas

These are good to mention, but they should not distract from the main LP.

### AI Campaign Experiment Builder

An internal tool for growth managers.

Input:

- Keyword
- Audience
- Product feature
- Brand constraints
- Goal metric
- Quiz length
- CTA strategy
- Signup wall strategy

Output:

- LP headline and subheadline
- Quiz questions
- CTA copy
- Unlock wall copy
- Variant hypothesis
- Primary KPI
- Event tracking schema
- Brand-safety warnings
- HTML-ready sections

Best framing:

> **This is not “AI writes HTML.” It is an experiment design assistant for growth teams.**

### Intent-to-LP Matching Engine

Map search intent to landing page experience.

| Search term | Best LP experience |
|---|---|
| free ai humanizer | Fast paste + preview + free account to copy |
| humanize academic essay | Academic tone + integrity-safe rewrite |
| business email rewrite | Professional tone + email examples |
| resume AI rewrite | Recruiter-friendly bullet polishing |
| LinkedIn post rewrite | Confident/conversational social tone |

Why it matters:

> Paid traffic quality depends on matching keyword intent to the right experience.

### Brand-safety checker

A small internal checker that warns when generated LP copy uses risky language like “undetectable,” “bypass detectors,” or “100% human.”

---

## 15. What not to overbuild

Avoid:

- Real authentication.
- Real Claude/OpenAI API calls inside frontend.
- Exposed API keys in HTML.
- Complex backend.
- Huge React app.
- Payment flow.
- Real AI detector claims.
- Overcomplicated agent system.

For this assignment, a polished standalone HTML + strong optimization plan is better than an over-engineered app.

---

## 16. Suggested final Mission 1 deliverables

Recommended package:

```text
README.md
optimization_plan.md
improved_ai_humanizer_lp.html
event_tracking_spec.md
optional_screenshots/
```

### README.md should include

- What the assignment is.
- What you built.
- How to open the HTML.
- Main hypothesis.
- What changed vs control.
- Assumptions.
- Next steps.

### optimization_plan.md should include

- Funnel diagnosis.
- Search-intent insight.
- Competitor insight.
- Brand-risk notes.
- Recommended LP strategy.
- Experiment plan.

### improved_ai_humanizer_lp.html should include

- Responsive design.
- Paste box.
- Sample text chips.
- Three-question quiz.
- Before/after preview.
- Inline unlock/signup card.
- Event tracking stubs.

### event_tracking_spec.md should include

- Events.
- Properties.
- Funnel metrics enabled.
- Experiment-readout logic.

---

## 17. Mission 1 top things to remember

1. The top of funnel works; the leak is after intent is captured.
2. The biggest problem is delayed value.
3. The LP should feel like a tool, not a survey.
4. Keep quiz format, but make the quiz a personalization layer.
5. Reduce 8 questions to 3.
6. Show partial value before signup.
7. Use an inline unlock card instead of an aggressive wall.
8. Avoid “undetectable/pass AI checks/bypass detectors.”
9. Use brand-safe naturalness, clarity, tone, and voice language.
10. Add tracking hooks so the variant is measurable.
11. Treat the final HTML as Variant B against the current LP.
12. Mention the AI Campaign Experiment Builder only as an optional future growth system.

---

## 18. Final Mission 1 narrative

Use this in the final submission:

> **For Mission 1, I redesigned the LP around the actual search intent of users looking for a free AI humanizer: fast value, visible output, low friction, and trust. I kept the quiz format, but changed the quiz from a long survey into a short personalization layer that improves the user’s result before asking for signup. The redesigned flow gives users proof before the wall, uses brand-safe Grammarly positioning, and includes tracking hooks so the growth team can learn which variant improves signups and downstream activation.**
