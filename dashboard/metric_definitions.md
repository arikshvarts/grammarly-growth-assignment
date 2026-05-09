# Metric Definitions — Mission 2

## Grain and attribution

All funnel metrics should be calculated at the **user level**, not raw event level, to avoid overcounting repeated clicks, installs, or feature tries.

For each user, use:

1. First LP CTA click timestamp.
2. First install timestamp after that LP CTA click.
3. First `try_grammarly` timestamp after install.

A user is counted as activated only if events happen in sequence:

```text
LP CTA click → install → try_grammarly
```

## Attribution rule

For the main dashboard, attribute each user to their **first LP CTA click** within the selected date range.

Count install and try events only if they occur:
- after that click,
- in the correct order,
- within the 7-day attribution window.

If a user clicks multiple LP CTAs, use first-touch attribution for the executive view. In production, compare this with last-touch attribution in deeper analysis.

## Date views

Use both event-date and cohort-date views:

- **Event-date view:** useful for daily monitoring of event volume.
- **Cohort-date view:** groups users by first LP CTA click date and measures later installs/tries within a fixed window.

## Core KPIs

| KPI | Definition |
|---|---|
| LP CTA Click Users | Distinct users with `did_click_lp` |
| Install Users | Distinct users with install after LP CTA click within window |
| Try Users | Distinct users with try after install within window |
| Install CVR | Install Users / LP CTA Click Users |
| Install → Try Rate | Try Users / Install Users |
| Activation CVR | Try Users / LP CTA Click Users |
| Dead Install Rate | Installed users who did not try / Install Users |
| Activation Yield | Qualified Activated Users per 100 LP CTA Click Users |
| Repeat Try Rate | Users with 2+ try events / users with 1+ try events |

## Limitations

Do not calculate CAC, ROAS, LTV, payback, page-render CVR, or ad CTR unless spend, revenue, page render, and impression fields are added.
