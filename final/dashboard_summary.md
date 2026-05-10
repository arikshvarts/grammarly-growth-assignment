# Dashboard Summary : Campaign Performance & Activation Quality

## Purpose & Strategy

This dashboard measures whether Grammarly's landing page campaigns are driving real product activation. By linking Mission 1 (Acquisition) and Mission 2 (Activation), we create a closed growth loop: acquire users through a value-first LP, then measure if they successfully reach the "Aha" moment in the product.

The North Star metric is **Qualified Activated Users**: users who clicked the LP CTA, installed Grammarly, and triggered `try_grammarly` within the 7-day attribution window.

---

## Dashboard Structure

The interactive dashboard is organized into four strategic views:

### Tab 1: Executive Overview
Shows whether campaigns are producing real activated users, not just raw clicks or installs. It tracks overall funnel health, Activation CVR trends, and volume distribution across the February 2026 dataset.

### Tab 2: Funnel Diagnostics
Identifies the specific drop-off points from initial click to product usage. Includes side-by-side funnel visualizations and LP comparison matrices to pinpoint which creative variants drive the highest quality traffic.

### Tab 3: Growth Actions
Provides automated, data-driven recommendations based on current performance. It features the "Wasted Acquisition Ledger" (categorizing leakage) and the "Experiment Backlog" (hypotheses for improvement).

### Tab 4: Methodology & Data Quality
Transparently defines all metric formulas, technical attribution rules, and automated data-cleaning results to ensure stakeholder trust in the numbers.

---

## Technical Methodology

### Metric Formulas
*   **LP CTA Click Users:** Total unique users who clicked an install trigger on the LP.
*   **Activation CVR:** Qualified Activated Users / LP CTA Click Users.
*   **Dead Install Rate:** (Installed users with no `try_grammarly` within 7 days) / Total Install Users.
*   **Repeat Try Rate:** Users with 2 or more try events / Users with at least 1 try event.

### Attribution & Logic
*   **Cohort-Based Tracking:** Conversion rates are anchored to the user's first click date, ensuring that performance is measured relative to the acquisition day.
*   **7-Day Window:** All conversions are capped at 168 hours from initial touch to maintain a consistent measurement standard.
*   **Right-Censoring:** To maintain data integrity, the latest 7 days are excluded from finalized cohort totals to prevent artificial deflation of conversion rates.

---

## Key Insights (February 2026 Dataset)

1.  **Activation Gap:** The Academic Writing LP converts **22.6%** of clicks to activation, significantly outperforming the Business Emails LP (**18.5%**).
2.  **Habit Formation:** 75.3% of academic users return for a second use, vs. only 12.2% for business users, indicating a divergence in long-term product utility for these audiences.
3.  **The Dead Install Problem:** Across both variants, 43–51% of users who install never actually use a feature. This points to a post-install onboarding friction point rather than an LP quality issue.

---

## Measurement Constraints

To maintain analytical rigor, we explicitly acknowledge the following limitations based on the provided dataset:

**Cannot calculate from this dataset:**
*   **CAC:** No ad spend data available.
*   **ROAS:** No revenue or subscription data available.
*   **LTV:** No retention or payment events.
*   **Ad CTR:** No impression data from top-of-funnel ad platforms.
*   **Page-render CVR:** Campaign data starts at the click event; full page-render logs are required for total CVR.

---

## Data Quality Assurance

The source data passed 8 automated validation checks with zero flagged rows, including:
*   Valid JSON metadata and non-null identifiers.
*   Chronological funnel sequence enforcement (no try events before installs).
*   Timestamp boundary checks (no future dates).
*   Deduplication of attribution events.
