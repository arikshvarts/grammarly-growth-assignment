# Metric Definitions & Attribution Logic

## Funnel Rigor

All metrics are calculated at the **user level** (Distinct User IDs), not raw event level, to avoid overcounting. A user is only counted as "Activated" if they complete the full funnel in chronological order within a 7-day window.

**Attribution Rule:** First-touch LP attribution. The LP name from the user's first `did_click_lp` event is used as the cohort anchor.

---

## Core Formulas

| KPI | Formula | Why it matters |
|---|---|---|
| **LP CTA Click Users** | Total unique users who clicked the install button on the landing page. | Entry point of the post-click campaign funnel. |
| **Install CVR** | Percentage of LP clickers who successfully installed the app. | Measures acquisition quality and install-bridge friction. |
| **Activation CVR** | Percentage of LP clickers who successfully completed a feature try. | North Star metric: end-to-end campaign quality. |
| **Install → Try Rate** | Percentage of users who used a feature after installing the app. | Isolates onboarding success from LP quality. |
| **Dead Install Rate** | Percentage of users who installed but never used a feature within 7 days. | Identifies users who abandoned after the hard step (install). |
| **Repeat Try Rate** | Percentage of users who used features more than once. | Measures initial habit formation and utility. |

---

## Technical Considerations

### 1. Cohort-Based Calculations
Daily conversion rates in the dashboard are **cohort-anchored** on the user's first LP CTA click date. This ensures that a "20% Activation CVR" on Monday truly represents 20% of Monday's clickers, regardless of whether they installed/tried on Tuesday or Wednesday.

### 2. Attribution Window
The window is set to **7 days**.
*   Any install after day 7 is counted as "unattributed" in production (not in this dashboard).
*   Any `try_grammarly` after day 7 is excluded from the Activation CVR calculation.

### 3. Right-Censoring
To avoid artificially low conversion rates for recent dates, the latest 7 days in the dashboard are marked as "incomplete" or excluded from finalized cohort totals.

### 4. Definition of "Repeat"
"Repeat Try Rate" specifically measures users who triggered the `try_grammarly` event two or more times within the 7-day window. This is used as a proxy for product-market fit for that specific landing page's audience.

---

## Limitations (Mission 2 Constraints)

The following metrics **cannot** be calculated from the provided dataset:
*   **CAC / ROAS / LTV:** Requires ad spend and subscription revenue data.
*   **Ad CTR:** Requires impression data from the ad platform.
*   **Page-render CVR:** Requires a separate `page_render` event.
*   **Funnel Step Completion:** Requires granular instrumentation for each onboarding step.
