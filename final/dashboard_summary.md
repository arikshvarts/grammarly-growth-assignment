# Dashboard Summary — Campaign Performance & Activation Quality

## Purpose

This dashboard measures whether Grammarly's landing page campaigns are driving real product activation, not just installs. The North Star metric is **Qualified Activated Users**: users who clicked the LP CTA, installed Grammarly, and triggered `try_grammarly` within the 7-day attribution window.

---

## Metric design

**Grain:** All funnel metrics are user-level, not raw event counts. A user who triggers `try_grammarly` five times counts as one activated user. Repeated events are preserved only for Repeat Try Rate, which measures re-engagement within the attribution window.

**Funnel sequence:**
```
did_click_lp → did_install_grammarly → try_grammarly
```
`did_click_lp` is an LP install-button click, not a page render. `did_install_grammarly` confirms setup completion. `try_grammarly` is the first available proxy for product value delivery.

**Attribution:** First-touch LP attribution. The LP associated with a user's first `did_click_lp` event is credited for all downstream conversions. Attribution window: 7 days from that first click.

**Date views:** Event-date views monitor daily volume. Cohort-date views measure conversion quality — the correct lens for understanding whether a given day's cohort activated within the window.

---

## Why these metrics, not others

Raw click and install counts are incomplete success signals. A campaign that drives high install volume but low `try_grammarly` rate is wasting acquisition spend — users installed but never experienced Grammarly's value. The dashboard therefore prioritizes:

- **Activation CVR** (LP click → `try_grammarly`): the most complete single-metric measure of campaign quality
- **Dead Install Rate** (installed but never tried): isolates the onboarding failure between install and first use
- **Install → Try Rate**: measures whether the post-install experience is working, independent of LP quality
- **Repeat Try Rate**: a short-term retention proxy — users who return within 7 days are more likely to retain long-term
- **Campaign Quality Score**: a weighted composite (35% Install CVR + 45% Activation CVR + 20% Install→Try Rate), normalized within the current dataset, for ranking LPs at a glance

---

## Actual insights — February 2026 dataset

**Scope:** 3,200 unique users, 2 LPs (`lp_academic_writing` and `lp_business_emails`), Feb 1–28 2026. QA result: all 8 automated checks returned zero flagged rows — no missing metadata, no null user IDs, no sequence violations, no duplicate events. No issues were flagged by these checks; that reflects the mock nature of the dataset and should be validated against production data before drawing conclusions about data quality.

### LP funnel comparison

| Metric | lp_academic_writing | lp_business_emails |
|---|---:|---:|
| LP CTA click users | 1,596 | 1,604 |
| Install CVR | 39.6% | 37.3% |
| **Activation CVR** | **22.6%** | **18.5%** |
| Install → Try Rate | 57.0% | 49.4% |
| Dead Install Rate | 43.0% | 50.6% |
| **Repeat Try Rate** | **75.3%** | **12.2%** |
| Median time to install | 5 min | 8 min |
| Median time to first value | 37 min | 44 min |
| Campaign Quality Score | **1.00** | 0.87 |

### Finding 1: Activation quality gap — 4.1pp, consistent

`lp_academic_writing` converts 22.6% of LP clicks all the way to `try_grammarly`, vs 18.5% for `lp_business_emails` — a 4.1 percentage point gap that holds across 28 daily cohorts with roughly equal click volume on each side (1,596 vs 1,604). This is a reliable signal, not noise.

### Finding 2: Repeat try rate divergence is the biggest signal in the dataset

75.3% of activated academic LP users triggered `try_grammarly` more than once within 7 days. Only 12.2% of business LP users did. That is a 63 percentage point gap between two campaigns of identical volume. It suggests `academic_citation_helper` retains users within their session, while `smart_email_reply` delivers single-use utility that does not pull users back. The business LP's activation problem starts after the first try, not before it.

### Finding 3: Dead install rate is high for both — the shared funnel leak

43–51% of users who install Grammarly never trigger `try_grammarly` within 7 days. This is not specific to one LP; it affects both campaigns equally. The leak is in the post-install onboarding experience, not in the LP itself. Fixing this is a higher-leverage opportunity than further LP optimization.

### Finding 4: Feature-LP alignment is strong

99.7% of activated academic LP users' first feature was `academic_citation_helper`. 100% of activated business LP users' first feature was `smart_email_reply`. The campaigns are routing users to the correct feature. The problem is downstream engagement quality, not targeting.

### Finding 5: Volume is equal; quality is not

Both LPs attracted nearly identical click volume throughout February (average ~57 users/day each). The performance gap is entirely in conversion quality, not reach.

### Growth action summary

| LP | Signal | Recommended action |
|---|---|---|
| lp_academic_writing | Comparable volume, stronger activation quality | Scale or create close variants — higher Activation CVR and much stronger repeat engagement. |
| lp_business_emails | High volume, lower activation, low repeat try | Diagnose promise mismatch or post-install onboarding friction on the business email flow |

---

## Dashboard structure

**Live dashboard:**
`https://arikshvarts.github.io/grammarly-growth-assignment/dashboard/dashboard.html`
*(Replace with your GitHub Pages URL after deployment — see `dashboard/dashboard_link.txt` for steps.)*

1. **Executive Overview** — KPI cards for total users at each funnel stage, daily click/install/try trends by LP, overall Activation CVR
2. **LP Funnel Diagnosis** — per-LP funnel metrics, Campaign Quality Score ranking, Traffic Quality Matrix (volume vs. activation CVR scatterplot)
3. **Feature Activation** — feature share by LP, first value moment distribution, LP × feature heatmap
4. **Cohort Quality** — activation CVR and Install→Try Rate by cohort date, 7-day attribution window view
5. **Data Quality & Growth Actions** — QA check results, growth actions table with signals, diagnoses, and recommended actions

---

## What this dataset cannot measure

The following standard campaign metrics require fields not present in this dataset. They are not calculated here and should not be inferred.

| Metric | Missing field |
|---|---|
| CAC (Cost per Acquisition) | Ad spend per campaign |
| ROAS | Ad spend + revenue |
| LTV | Subscription outcome, revenue events |
| Payback period | Ad spend + revenue |
| Ad CTR | Impressions, ad-level click data |
| LP page-render CVR | Page render events |
| Retention beyond 7 days | Events outside the attribution window |

---

## Recommended next instrumentation

1. **Add page render events** — required to calculate LP page-render CVR (signups / renders), the primary metric from the original brief
2. **Add ad spend per LP** — enables CAC, ROAS, and budget efficiency analysis
3. **Add subscription events** (trial start, upgrade, cancellation) — enables LTV, payback, and true ROAS
4. **Add onboarding step events** between `did_install_grammarly` and `try_grammarly` — pinpoints where the 43–51% dead install cohort drops off
5. **Extend attribution window to 14 and 30 days** — business use cases may have longer decision cycles; a 7-day window may undercount business LP conversions
6. **Add post-window engagement signal** (30-day DAU or feature usage) — validates whether Repeat Try Rate within 7 days predicts long-term retention
