# Optimization Plan — Grammarly AI Humanizer LP

**Live LP (Variant B):**
`https://arikshvarts.github.io/grammarly-growth-assignment/lp/improved_humanizer.html`
*(Replace with your GitHub Pages URL after deployment — see `dashboard/dashboard_link.txt` for steps.)*

---

## Executive summary

The original LP has strong top-of-funnel intent — 93% of users click "Start Humanizing" — but loses most of them during an 8-question quiz before they see any output. Variant B keeps the required quiz format but reorders the experience: users paste text, see a visible rewrite preview, answer three personalization questions, receive a refined preview, and sign up only when they want to copy or save the full result. This turns the quiz from a friction gate into a value-adding personalization step.

---

## Diagnosis: where the current funnel leaks

### Funnel data (last 30 days)

| Stage | Users | % of renders |
|---|---:|---:|
| Page render | 84,200 | 100.0% |
| Clicked "Start Humanizing" | 78,300 | 93.0% |
| Completed Q1 | 77,900 | 92.5% |
| Completed Q2 | 46,300 | 55.0% |
| Q3–Q8 (steady erosion) | 36,200–39,900 | 43–48% |
| Signup modal viewed | 35,800 | 42.5% |
| **Signup CTA clicked** | **8,420** | **10.0%** |

### Two dominant leaks

**Leak 1 — Q1 → Q2: −31,600 users (−40% of Q1 respondents).**
This is the single largest drop in the funnel. The quiz becomes friction almost immediately, not because Q2 is a bad question, but because users arrive expecting an instant humanizer tool and are instead given a long survey. They abandon before seeing any output.

**Leak 2 — Modal viewed → signup CTA: 35,800 → 8,420 (23.5% conversion).**
76.5% of users who reach the hard modal — after completing up to 8 questions and a 6-second loading screen — do not sign up. The blurred result and immediate modal popup feel like a bait-and-switch after that much investment.

**Root cause: value timing.**
Users are asked to commit (8 questions + signup) before seeing any result. The fix is to show value first, then ask for commitment.

---

## Market context

Tools in the brand-safe writing assistant lane (Grammarly's own other products, QuillBot's paraphraser, Ahrefs' AI humanizer, Scribbr's tools) share a common pattern: input box above the fold, immediate output or preview, tone and use-case controls, and account creation after the user has seen their result.

The detector-evasion lane (Undetectable AI, StealthGPT, Humanize AI) tends to gate immediately after showing fake detection scores — the pattern Grammarly's original LP mirrors, including "Pass AI checks" as a Q6 option and a "Natural Flow to Undetectable" slider label.

Grammarly's competitive advantage is trust and rewriting quality, not evasion claims. The flow and copy should reflect that positioning.

**Observed patterns (not measured performance — UX and positioning observations):**

- Brand-safe writing tools (Grammarly, QuillBot, Ahrefs, Scribbr) generally lead with a direct input box, a sample or paste flow, and a fast rewrite or preview experience. Account creation, if required, comes after the user has seen output.
- Several AI-humanizer competitors lead with detector-evasion language ("undetectable," "bypass AI detection," AI-score before/after frames). That positioning may match one slice of search intent but carries brand and trust risk that is inconsistent with Grammarly's positioning.
- The Variant B strategy borrows the immediate tool-like UX pattern from the brand-safe lane, but intentionally removes detector-bypass promises, fake AI-score claims, and hard gate walls — replacing them with a visible preview and an inline unlock.

---

## Variant B: preview-first micro-quiz

### New flow

```
Paste text → visible preview → 3 personalization questions → refined preview → inline signup unlock
```

### What changed and why

| Change | Problem fixed | Mechanism |
|---|---|---|
| Paste box before any question | Q1→Q2 cliff | Users see value before committing to questions |
| 8 questions → 3 (use case, tone, rewrite strength) | Quiz fatigue | 3 chips feel like personalization, 8 feel like a survey |
| Visible before/after preview (partial fade-lock, not full blur) | No output before signup | Creates endowment effect: "this is my improved text, I want the rest" |
| "What improved" panel (natural phrasing, flow, meaning, tone) | Opaque output | Explains value without fake detector scores or AI percentages |
| Inline unlock card instead of hard modal | Modal blocks page, feels like a trap | CTA appears below the refined preview, not over it; user feels in control |
| CTA copy: "Create free account to copy full rewrite" | Vague "Sign up" asks | Specific reward reduces signup anxiety |
| Voice profile near signup (Clear · Professional · Polished) | Generic account creation | Makes signup feel like saving something useful, not just passing a gate |
| "Humanize anywhere" install bridge in unlock card | One-time visit intent | Connects the LP action to daily product value across Gmail, Docs, LinkedIn |
| Brand-safe copy throughout | Brand and trust risk | No "undetectable," no fake AI detection percentages, no "100% human" |

### Prohibited copy removed

- "Unlimited AI text humanization — completely free, and no paywalls"
- "100% humanized result"
- Q6 option "Pass AI checks"
- Slider label "Natural Flow to Undetectable"
- Detection score display: 94% AI → 2% AI

### Copy used instead

- "Make AI writing sound natural and true to your voice"
- "Free preview. No credit card required."
- "Create free account to copy full rewrite"
- "Keep your meaning. Improve clarity and flow."

---

## Expected funnel impact

| Stage | Direction | Mechanism |
|---|---|---|
| Preview generation rate | ↑ | Paste box is the first interaction; lower barrier than "Start Humanizing" |
| Quiz completion rate | ↑ | 3 questions after visible value vs 8 questions before any value |
| Unlock CTA view rate | ↑ | More users reach unlock because fewer drop at each quiz step |
| Signup CTA click rate | ↑ | Users sign up having seen proof, not a promise |
| Install and try_grammarly rate | Maintain or ↑ | Brand-safe positioning attracts higher-intent signups |

---

## Experiment design

I would not launch this as a blind redesign. Variant B is structured as a proper A/B test against the existing LP, not a one-off page swap.

**Hypothesis:** Users searching "free AI humanizer" want immediate proof of value. A preview-first quiz flow — paste text, see a partial rewrite, answer 3 personalization questions, then sign up to copy the full result — will increase signup CVR because users commit only after seeing relevant output, not before.

**Control:** Current LP (quiz-first, 8 questions, hard signup modal after 6-second load)
**Variant B:** Preview-first micro-quiz (this deliverable)
**Split:** 50/50, cookie-level randomization on page render

**Primary metric:** Signup CVR = signups / page renders

**Secondary metrics — understanding the mechanism of lift:**

| Metric | Purpose |
|---|---|
| Preview requested rate | Did users engage with the paste box before questions? |
| Quiz completion rate | Did showing value first reduce quiz abandonment? |
| Unlock wall viewed rate | Did more users reach the signup gate? |
| Unlock wall → signup click rate | Was the inline card more persuasive than the hard modal? |
| Time to first value (`time_to_preview_ms`) | How quickly did users see a rewrite? |

**Guardrail metrics — protecting downstream quality:**

Signup CVR is not the only measure of success. The guardrails matter equally.

| Guardrail | Why it matters |
|---|---|
| Install rate (among signups) | A variant that drives low-quality signups who never install is not a win |
| `try_grammarly` rate (among installs) | The goal is qualified activation, not just account creation |
| Dead install rate | A lift in signups that produces more dead installs means weaker intent |
| Brand-risk signals | Qualitative feedback, support tickets, negative social signals |

The right framing is not "did Variant B get more signups?" It is "did Variant B get more users who installed and tried Grammarly?"

---

## A/B test decision rules

**Ship Variant B if, at 95% confidence:**
- Signup CVR (signups / page renders) improves vs control
- Quiz completion rate (users who answer all 3 questions) is higher than the current 8-question completion (~43%)
- Inline unlock → signup click rate exceeds 23.5% (current hard-modal conversion)

**Do not ship if:**
- Signup CVR improves but downstream install rate or `try_grammarly` rate declines — higher-volume but lower-quality signups is not a win
- Brand-risk escalation: negative feedback on copy, perceived evasion claims, or trust signals

**Test sizing (rough planning estimate):** At the current traffic level (~84,200 renders/month, about 2,800/day), a 2pp lift from 10% to 12% would require roughly 4,000 users per variant for a standard 95% confidence / 80% power test, so this could be evaluated in about 3–5 days with a 50/50 split. I would still define the final test duration using a power/MDE calculator before launch, and monitor install and `try_grammarly` as guardrails from day 1.

---

## Implemented in this deliverable

| Feature | Status |
|---|---|
| Paste box above the fold | ✓ |
| 5 sample text chips (Essay, Email, Marketing, LinkedIn, Job application) | ✓ |
| Before/after preview with partial fade-lock | ✓ |
| "What improved" panel (4 signals: phrasing, flow, meaning, tone) | ✓ |
| 3-question personalization quiz (use case → tone → rewrite strength) | ✓ |
| Auto-advance on selection (no Continue button needed) | ✓ |
| Refined before/after preview after quiz | ✓ |
| Dynamic "What improved" based on quiz answers | ✓ |
| Voice profile near signup (e.g. Clear · Professional · Polished) | ✓ |
| Inline unlock card | ✓ |
| "Humanize anywhere" install bridge (Gmail, Docs, LinkedIn, ChatGPT, Work docs) | ✓ |
| Event tracking stubs — 14 events with variant_id, device_type, quiz_answers | ✓ |
| Brand-safe copy throughout | ✓ |
| Responsive layout (desktop and mobile) | ✓ |

---

## Future ideas (not built, documented only)

**AI Campaign Experiment Builder** — an internal growth tool that generates LP headlines, quiz questions, CTA copy, and event schemas from keyword + audience + feature inputs. Not "AI writes HTML" — an experiment design assistant for growth PMs.

**Intent-to-LP Matching Engine** — a routing layer that maps search keywords to the best-fit LP experience. "Humanize academic essay" → academic tone LP; "business email rewrite" → professional tone LP. Paid traffic quality improves when keyword intent matches the LP's value proposition.

**Brand-safety checker** — an automated flag for risky copy phrases ("undetectable," "bypass detectors," "100% human") in LP generation and review pipelines.

**Real personalization model** — replace client-side phrase substitution with a server-side model that adapts rewrites to quiz answers and user context.
