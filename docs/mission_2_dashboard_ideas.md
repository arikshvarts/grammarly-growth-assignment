# Mission 2 — Performance Analytics & Campaign Dashboarding

## 0. Final framing

Do **not** present this as only a dashboard.

Present it as:

> **A Growth Command Center that shows whether campaigns are driving real product activation, not just clicks or installs.**

Best one-liner:

> **Installs are not the value moment. `try_grammarly` is the first available proxy for real value. Therefore, the dashboard should optimize for qualified activation: users who click the LP CTA, install Grammarly, and actually try a feature.**

---

## 1. What Mission 2 is asking for

Mission 2 asks you to connect to the mock campaign dataset and create a visualization report showing the daily KPIs that matter most.

Required deliverables:

1. **A link to a functional visualization report.**
2. **A brief 1–2 paragraph explanation** of:
   - why you chose these metrics,
   - how they measure campaign success.

---

## 2. Important dataset clarification

Available fields:

```text
session_id
user_id
action
extra JSON:
  lp_name
  product_feature
timestamp
```

Available actions:

```text
did_click_lp              = user clicked the install/CTA button on the landing page
did_install_grammarly    = user installed Grammarly
try_grammarly            = user tried a Grammarly product feature
```

### Important correction

`did_click_lp` should **not** be treated as a page render.

It is the LP CTA/install-button click event. So in this dashboard, the first measurable funnel stage is:

```text
LP CTA Click → Install → Try Grammarly
```

The dataset does **not** include page renders, impressions, or ad clicks. Therefore, Mission 2 cannot measure page-render-to-click CVR or ad CTR unless more data is added.

---

## 3. What this dataset can and cannot measure

### It can measure behavioral funnel quality

- Which LPs generate CTA clickers.
- Which CTA clickers install Grammarly.
- Which installers actually try Grammarly.
- Which product features are tried.
- Which LPs drive stronger activation.
- Which campaigns create dead installs.
- Whether tracking data is missing or inconsistent.

### It cannot directly measure media efficiency

Without more fields, it cannot measure:

- CAC.
- ROAS.
- LTV.
- Payback period.
- Revenue.
- Subscription conversion.
- True profitability.
- Account expansion.
- PQL/PQA quality.
- Ad CTR.
- Page-render CVR.

Use this sentence:

> **Because the dataset does not include spend, impressions, page renders, or revenue, I focused the dashboard on behavioral activation quality rather than CAC, ROAS, LTV, or ad efficiency.**

---

## 4. Dashboard north star

The best north star for the available dataset is:

### Qualified Activated Users

Practical assignment version:

```text
Qualified Activated Users = distinct users who clicked the LP CTA, installed Grammarly, and triggered try_grammarly
```

Stronger production version:

```text
Qualified Activated Users = users who clicked the LP CTA, installed Grammarly,
tried the promised feature within 7 days, and returned or repeated meaningful usage
```

Why this is strong:

- It avoids overvaluing raw LP CTA clicks.
- It avoids overvaluing installs.
- It measures whether users reached a first product value moment.

Sentence to use:

> **I would not optimize for cheaper installs. I would optimize for cheaper qualified activations.**

---

## 5. Vanity metrics vs actionable metrics

### Vanity metrics

These can look good but mislead:

```text
Raw clicks
Raw installs
Raw feature tries
Total sessions
CTR alone, if available
Signup clicks alone
Average time on page without context
```

### Actionable metrics

These help decide what to do:

```text
LP CTA click → install rate
Install → try rate
LP CTA click → try / activation rate
Dead install rate
Activation yield
Time to install
Time to first value
LP → product-feature match
Repeat try rate
Activation by LP
Activation by product feature
```

Strong phrase:

> **Low-quality acquisition is traffic that converts cosmetically but fails behaviorally.**

---

## 6. Core KPI definitions

Use user-level cohorts where possible, not only raw event counts.

### Volume KPIs

```text
LP CTA Click Users = distinct users with did_click_lp
Install Users = distinct users with did_install_grammarly
Try Users = distinct users with try_grammarly
```

### Sequence-aware funnel KPIs

Best practice is to count users who move through the sequence in order.

```text
Install CVR = users with did_click_lp then did_install_grammarly / LP CTA Click Users

Install → Try Rate = users with did_install_grammarly then try_grammarly / Install Users

Activation CVR = users with did_click_lp then did_install_grammarly then try_grammarly / LP CTA Click Users

End-to-End Conversion = Qualified Activated Users / LP CTA Click Users
```

### Quality KPIs

```text
Dead Install Rate = users who installed after LP CTA click but never tried / Install Users

Activation Yield = Qualified Activated Users per 100 LP CTA Click Users

Time to Install = first install timestamp - first LP CTA click timestamp

Time to First Value = first try timestamp - first LP CTA click or install timestamp

Repeat Try Rate = users with 2+ try_grammarly events / users with 1+ try_grammarly event
```

### Product-feature KPIs

```text
Feature Try Users = distinct users who tried each product_feature

Feature Share = users who tried feature X / all try users

LP-to-Feature Match Rate = users who tried the feature promised by the LP / users who tried any feature after that LP
```

If exact LP-to-feature mapping is unavailable, include LP-to-Feature Match Rate as a production recommendation rather than a fully calculated metric.

---

## 7. Recommended dashboard structure

Use 3–4 pages max.

---

### Page 1 — Executive Overview

Purpose:

> Are campaigns healthy today?

Include:

- KPI cards.
- LP CTA Click Users.
- Install Users.
- Try Users.
- Install CVR.
- Activation CVR.
- Install → Try Rate.
- Dead Install Rate.
- Daily trend line.
- Best/worst LP.
- Short recommendation text.

Recommended visuals:

- KPI cards.
- Line chart of LP CTA clicks, installs, and tries by date.
- Small funnel summary.
- Top/bottom LP table.

---

### Page 2 — LP Funnel Diagnosis

Purpose:

> Where is the leak?

Include:

- Funnel chart: LP CTA click → install → try.
- Conversion rates by LP.
- Drop-off by stage.
- Dead install rate by LP.
- Traffic quality matrix.

Recommended visuals:

- Funnel chart.
- LP performance table.
- Bar chart by LP.
- Scatterplot: volume vs activation rate.

---

### Page 3 — Feature Activation

Purpose:

> Which product promises create real usage?

Include:

- Product feature tried.
- Try users by feature.
- Feature usage distribution.
- LP × product feature matrix.
- Feature activation trend.

Recommended visuals:

- Stacked bar chart: LP by product_feature.
- Heatmap: LP × feature.
- Feature table with try users, share, and activation rate.

---

### Page 4 — Data Quality / Monitoring

Purpose:

> Can we trust the dashboard?

Include checks for:

- Missing `lp_name`.
- Missing `product_feature`.
- Null `user_id`.
- Null `session_id`.
- Duplicate events.
- `try_grammarly` before `did_install_grammarly`.
- Install without LP CTA click.
- Try without install.
- Sudden drop in event volume.
- Abnormal conversion spikes.

This page is a strong differentiator. Most candidates make charts; this makes the report operational.

---

## 8. Recommended visuals

Use:

- KPI cards for executive snapshot.
- Funnel chart for LP CTA click → install → try.
- Line chart for daily trends.
- Bar chart for LP comparison.
- Heatmap for LP × feature.
- Scatterplot for volume vs quality.
- Conditional-formatting table for priorities.
- Data-quality table.
- Recommendation/action table.

Avoid:

- Too many pie charts.
- Decorative visuals without decisions.
- Showing 20 metrics with no hierarchy.
- Optimizing the dashboard around raw clicks only.

---

## 9. Growth Actions Table

This is one of the strongest additions.

The dashboard should not only show what happened. It should recommend what to do next.

Example:

| Segment | Signal | Diagnosis | Recommended action |
|---|---|---|---|
| Academic Writing LP | High activation CVR | Strong intent match | Scale budget / create variants |
| Business Email LP | High LP CTA clicks, low try rate | Weak downstream activation | Fix onboarding or CTA promise |
| Humanizer LP | High unlock/CTA interest, low install | Signup/install friction | Improve install bridge |
| Installed but no try | High dead install rate | Users did not reach value | Add guided first action |
| Feature X | Low usage after LP CTA click | Promise mismatch | Rework targeting/copy |

Why it matters:

> It turns the dashboard from a reporting artifact into a decision product.

---

## 10. Campaign Quality Score

A simple score can make the dashboard more executive-friendly.

Example formula:

```text
Campaign Quality Score =
0.35 × normalized Install CVR
+ 0.45 × normalized Activation CVR
+ 0.20 × normalized Install-to-Try Rate
```

Why Activation CVR gets the highest weight:

- It is closer to product value than install.
- It penalizes campaigns that create shallow installs but no usage.

Important caveat:

> **This score is a decision aid, not a replacement for raw KPIs. In production, it should include spend, revenue, retention, and experiment confidence.**

---

## 11. Traffic Quality Matrix

A strong visual for growth teams.

```text
X-axis = LP CTA Click Volume
Y-axis = Activation CVR
```

| Quadrant | Meaning | Action |
|---|---|---|
| High volume, high quality | Winner | Scale |
| High volume, low quality | Waste risk | Diagnose and fix |
| Low volume, high quality | Hidden gem | Increase budget / test more |
| Low volume, low quality | Weak | Pause or rebuild |

This makes the dashboard immediately actionable.

---

## 12. Anomaly detection idea

Use a simple monitoring layer, not a complex ML model.

Flag:

- Activation CVR drops below rolling average.
- Dead install rate spikes.
- LP CTA clicks spike but activation does not.
- Installs remain stable but tries drop.
- `product_feature` metadata disappears.
- Event volume drops to zero.

Simple method:

```text
Alert if metric deviates more than 2 standard deviations from 7-day rolling average
```

This is relevant because the assignment asks what to monitor daily.

---

## 13. Promise-Match Rate

This is one of the strongest strategic analytics ideas.

Definition:

```text
Promise-Match Rate = users who try the feature promised by the LP / users who try any feature after that LP
```

Example:

- User comes from AI Humanizer LP.
- Installs Grammarly.
- Tries grammar correction instead of Humanizer.

That still has value, but it may mean the campaign is acquiring broad Grammarly users rather than users with true Humanizer intent.

Why it matters:

> **The dashboard should detect whether landing page promises match actual product behavior.**

If the dataset does not include enough mapping to calculate this perfectly, mention it as a production recommendation.

---

## 14. Wasted Acquisition Ledger

A useful table for executives and growth managers.

Track users by leakage stage:

```text
Clicked LP CTA but did not install
Installed but did not try
Tried wrong/unrelated feature
Tried once and never returned
Long time-to-value
Missing tracking metadata
```

Why this is powerful:

> **It translates funnel leakage into money-saving decisions once spend data is added.**

---

## 15. Segments that matter

Use these dimensions:

```text
lp_name
product_feature
date
user cohort date
session_id
user_id
first LP CTA clicked
first feature tried
time-to-install bucket
time-to-try bucket
installed but no try
tried matching feature vs non-matching feature
```

Future dimensions to request:

```text
campaign
ad group
keyword
search term
device
country
browser
creative ID
experiment variant
paid spend
page renders / impressions
subscription outcome
revenue
account/company ID
retention events
```

Calling out missing fields is good. It shows senior thinking.

---

## 16. Data-quality checks

Add a QA section or table.

| Check | Why it matters |
|---|---|
| Missing `lp_name` on LP events | Breaks LP performance reporting |
| Missing `product_feature` on try events | Breaks feature adoption analysis |
| Null `user_id` | Prevents user-level funnel analysis |
| Null `session_id` | Prevents session-level QA |
| Duplicate events | Inflates metrics |
| Try before install | Sequence issue or tracking bug |
| Install without LP CTA click | Attribution gap |
| Try without install | Tracking or identity issue |
| Sudden zero events | Broken instrumentation |
| Conversion spike | Possible duplicate events or tracking change |

This is one of the easiest ways to make the dashboard look more professional.

---

## 17. Small ML ideas — use carefully

Small ML can add value, but only as a bonus.

### Best ML-ish addition: anomaly detection

Why:

- Directly relevant to daily monitoring.
- Easy to explain.
- Useful even with limited features.

### Good bonus: activation-risk scoring

Predict whether LP CTA clickers are likely to become activated users.

Frame carefully:

> **With more campaign, device, keyword, creative, and spend metadata, I would add a lightweight propensity model to predict activation risk and prioritize intervention. For this assignment, I prioritized interpretable funnel and cohort analytics.**

### Better than complex ML: quality score

A transparent campaign quality score may be more useful than a black-box model for this mock dataset.

Avoid:

- Neural networks.
- Complex clustering.
- XGBoost for no reason.
- Revenue prediction without revenue.
- CAC/ROAS without spend.

---

## 18. Tooling recommendation

### Best practical choice: Looker Studio

Why:

- Free.
- Easy to share as a link.
- Good enough for KPI cards, trends, filters, and tables.
- Lower sharing friction than Power BI for external reviewers.

Recommended workflow:

```text
CSV / Excel → Python cleaning script → Google Sheets → Looker Studio dashboard
```

### Power BI

Professional and strong, especially for Microsoft-heavy companies, but sharing can be harder unless using Publish to Web or sending a `.pbix`.

### Tableau

Strong for polished executive storytelling, but less convenient if the reviewer needs fast access.

### Looker

Best for production semantic governance, but likely overkill for this assignment.

### Custom HTML / Streamlit

Good if you want a more productized dashboard, but only worth it if polished and easy to open.

Final line:

> **For the assignment, I would use Looker Studio for easy sharing. In production, I would use a governed semantic layer so KPI definitions stay consistent across growth, product, and finance.**

---

## 19. Suggested report summary text

Use this as the 1–2 paragraph explanation in the report:

> **I chose to focus the dashboard on behavioral funnel quality rather than raw campaign volume. In this dataset, `did_click_lp` shows that a user clicked the LP install/CTA button, `did_install_grammarly` shows setup completion, and `try_grammarly` is the first available proxy for real product value. Because installs alone do not prove that users experienced Grammarly’s value, the most important KPIs are Install CVR, Install-to-Try Rate, Activation CVR, Dead Install Rate, and feature adoption by landing page.**

> **The dashboard is designed to help the growth team decide what to scale, fix, pause, or investigate daily. LPs with high LP CTA volume and high activation are candidates to scale; LPs with high clicks but weak activation may have a promise mismatch or onboarding issue; and high dead-install rates indicate users are failing to reach value after installation. Since the dataset does not include spend, page renders, or revenue, CAC, ROAS, page CVR, payback, and LTV are not calculated here, but the report includes a future instrumentation plan for adding those fields.**

---

## 20. Suggested final Mission 2 deliverables

Recommended package:

```text
dashboard_link.txt
dashboard_summary.md
metric_definitions.md
data_cleaning_script.py
cleaned_campaign_data.csv
optional_dashboard_screenshots/
```

### dashboard_summary.md should include

- What the dashboard monitors.
- Why the chosen KPIs matter.
- What success means.
- What data is missing.
- Recommended next instrumentation.

### metric_definitions.md should include

- KPI names.
- Formulas.
- Grain.
- Filters.
- Caveats.

### data_cleaning_script.py should include

- JSON parsing from `extra`.
- Date extraction from timestamp.
- User-level funnel table.
- LP-level aggregation.
- Feature-level aggregation.
- Data-quality flags.

---

## 21. Mission 2 top things to remember

1. The first available funnel stage in this dataset is LP CTA click, not page render.
2. Do not optimize for raw installs. Optimize for qualified activation.
3. `try_grammarly` is the first real value proxy in the dataset.
4. The dashboard should answer what to scale, fix, pause, or investigate.
5. Core metrics: LP CTA clicks, installs, tries, install CVR, activation CVR, install-to-try rate.
6. Senior metrics: dead install rate, activation yield, time to first value, repeat try rate.
7. Add an LP × product-feature view to detect intent and promise match.
8. Add a Growth Actions Table so the dashboard recommends decisions.
9. Add a Campaign Quality Score to rank LPs by downstream value.
10. Add data-quality checks because tracking issues can mislead growth decisions.
11. Be honest that the dataset cannot calculate CAC, ROAS, LTV, page CVR, or revenue quality without more fields.
12. Use anomaly detection as a practical ML-ish bonus.
13. Looker Studio is probably the easiest free shareable report option.

---

## 22. Final Mission 2 narrative

Use this in the submission:

> **For Mission 2, I built the dashboard as a daily Growth Command Center. Since the dataset does not include spend, page renders, or revenue, I focused on behavioral funnel quality: LP CTA clicks, installs, feature tries, Activation CVR, Install-to-Try Rate, Dead Install Rate, and feature adoption. The goal is to identify which campaigns create real product activation, not just traffic or installs.**

And:

> **The most important success signal is not whether users click or install. It is whether the campaign brings users who actually try Grammarly and reach a first value moment.**
