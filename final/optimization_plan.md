# Optimization Plan : Grammarly AI Humanizer LP

**Primary deliverable:** Next.js Landing Page (Deployed on Vercel)  
**URL:** [https://web-tau-six-48.vercel.app/](https://web-tau-six-48.vercel.app/)

---

## Executive Recommendation

The current conversion bottleneck is not a lack of intent. **93% of users click "Start Humanizing"**, proving strong initial interest. However, users are forced through an 8-question quiz before seeing any output, resulting in a 40% abandonment rate by Q2.

**Recommendation:** Pivot to a **"Preview-First"** flow that delivers immediate value.
1.  **Immediate Input:** Users paste text above the fold without prior friction.
2.  **Instant Preview:** Show a high-quality before/after rewrite (partially blurred) immediately.
3.  **Value-Adding Quiz:** Repurpose the quiz into a 3-step personalization layer (Tone, Use Case, Strength).
4.  **Inline Unlock:** Transition from a "hard modal" to an inline signup card that rewards the user's personalization efforts.

This strategy converts the quiz from a barrier into a tool for quality control, aligning value delivery with user momentum.

---

## Funnel Diagnosis: The "Value Gap"

### Baseline Performance (Assignment Data)

| Stage | Users | % of renders |
|---|---:|---:|
| Page render | 84,200 | 100.0% |
| Clicked "Start Humanizing" | 78,300 | 93.0% |
| Completed Q1 | 77,900 | 92.5% |
| Completed Q2 | 46,300 | 55.0% |
| Q8 completed | 35,800 | 42.5% |
| Signup modal viewed | 27,400 | 32.5% |
| **Signup CTA clicked** | **8,420** | **10.0%** |

### Critical Failure Points

**Leak 1 : The Q2 Drop: 31,600 users lost.**
This is the single largest point of failure. Users arrive expecting a utility and are met with a survey. By the second question, nearly half the audience abandons the flow before seeing proof of the tool's quality.

**Leak 2 : Modal Conversion: 30.7% success rate.**
Of the 27,400 users who reach the signup modal, nearly 70% do not convert. This suggests that the "bait-and-switch" of a 8-question quiz followed by a hard wall creates significant friction.

---

## Market & Positioning Context

There are two distinct competitive lanes for AI Humanizers:
*   **The Trusted Assistant Lane:** Grammarly, QuillBot, and Ahrefs. These tools lead with a direct input box and immediate transformation. They emphasize quality, readability, and brand safety.
*   **The Evasion Lane:** Undetectable AI and StealthGPT. These tools lead with detection scores and "bypass" claims.

**Strategic Choice:** Grammarly must borrow the immediate-interaction pattern from the market leaders while rejecting the "detector-evasion" promise. Our strongest asset is **trust**. The flow is designed to demonstrate high-quality, natural writing that stays true to the user's original message, rather than focusing on bypass scores.

---

## Proposed Experiment: Variant B (Preview-First)

### Measurement Framework

**Primary Metric:** Signup CVR (Page Render → Signup CTA Click).

**Mechanism Metrics:**
*   **Preview Requested Rate:** Do users engage with the paste-first experience?
*   **Time to First Value:** How many seconds until the user sees their first rewrite?
*   **Quiz Completion Rate:** Does a 3-question personalized flow reduce abandonment compared to 8 questions?
*   **Unlock View Rate:** Proportion of users who reach the final signup trigger.

**Guardrail Metrics:**
*   **Meaning-Preservation Score:** Qualitative check to ensure rewrites do not change the user's intent.
*   **Activation CVR (Mission 2):** Ensuring that higher signup volume translates into post-install product usage.

---

## Future Growth Extensions

To move beyond a simple redesign, I recommend implementing the following strategic components:

1.  **Intent-to-LP Matching Engine:** Dynamically route keywords like "academic essay" or "business email" to tailored LP variants with pre-filled sample text.
2.  **Brand-Safety Checker:** An automated guardrail that flags and prevents the generation of risky copy (e.g., "undetectable," "bypass AI") to protect Grammarly's platform reputation.
3.  **AI Experiment Builder:** A system for Growth PMs to rapidly generate compliant LP copy, quiz logic, and event tracking schemas for different verticals.

---

## Implementation Details

*   **Trust Cue:** Added a privacy reassurance near the input box: "Paste text to preview. No credit card required."
*   **A/B Test Duration:** Run for 7-10 days to capture a full business cycle.
*   **Ship Criteria:** Deploy if Signup CVR improves by ≥5% with neutral or positive impact on Activation CVR.
