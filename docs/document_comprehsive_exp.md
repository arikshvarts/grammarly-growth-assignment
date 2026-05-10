Unified Main Observation

This assignment should not be framed as two separate tasks: one landing page and one dashboard.

It should be framed as one connected growth system.

Mission 1 improves the acquisition experience. Mission 2 measures whether that acquisition experience creates real product activation.

The full growth loop is:

Search intent → Landing page experience → Signup/install → First product value → Dashboard monitoring → Next experiment

The strongest overall story is:

This is not just an LP redesign and not just a dashboard. It is a connected growth system: Mission 1 gets users to value faster, and Mission 2 proves whether those users actually reach product activation after acquisition.

Another strong way to say it:

I optimized for real product value, not vanity conversion.

The assignment is testing whether you think like an AI Growth Builder: diagnose a growth problem from data, understand user intent, build a better product experience, measure the right KPIs, and communicate clearly.

The sharpest one-liner:

The LP should create the value moment faster, and the dashboard should prove whether that value moment turns into real product activation.

Mission 1 — LP Conversion Optimization
Core diagnosis

The current AI Humanizer LP does not mainly suffer from weak intent.

Users clearly show interest. The landing page has:

84,200 page renders
78,300 users clicked “Start Humanizing”
93.0% clicked “Start Humanizing”
8,420 signup CTA clicks
10.0% final signup CVR

This means the top of the page is not the main problem.

The strongest diagnosis is:

The issue is not traffic intent. The issue is value timing.

Users searching “free AI humanizer” likely want a fast, tool-like experience:

paste text → humanize → see result → copy/use

But the current LP delays the value behind a long quiz and then asks for signup before the user has seen enough proof.

The current funnel shows that users start with high intent, but drop heavily once the quiz begins:

Stage	% of Users	Users
Page render	100.0%	84,200
Clicked “Start Humanizing”	93.0%	78,300
Q1 — Sentence length	92.5%	77,900
Q2 — English variant	55.0%	46,300
Q3 — Formality	48.0%	40,400
Q4 — Vocabulary	47.4%	39,900
Q5 — Writing style	47.25%	39,800
Q6 — Main goal	46.0%	38,700
Q7 — Humanization slider	43.0%	36,200
Q8 — Light humor	42.5%	35,800
Signup / unlock modal viewed	32.5%	27,400
Signup CTA clicked	10.0%	8,420

The major signals are:

Users are willing to click the first CTA.
The biggest early drop is from Q1: 92.5% to Q2: 55.0%.
The quiz creates friction before value is shown.
The unlock/signup wall appears before users fully trust the result.
Only 10.0% of page renders become signup CTA clicks.
The page likely loses users because it asks too much before proving value.

So the main growth problem is not:

“How do we get more users to click Start Humanizing?”

It is:

“How do we show value earlier so signup feels like the natural next step?”

A strong sentence to include:

The goal is not to trick more users into signing up; it is to make the product value obvious earlier, so the signup becomes a natural continuation of the experience.

Mission 1 — Main Solution

The solution is to keep the required quiz format, but change the role of the quiz.

Do not make it:

quiz-first → delayed value → blurred result → hard signup wall

Make it:

paste text → visible preview → 3-question personalization quiz → refined preview → signup to copy/save full result

This keeps the quiz format, but turns the quiz from friction into personalization.

Use this framing:

I treated the current LP as the control and built Variant B designed to reduce quiz friction, show value earlier, and improve signup intent.

Another strong sentence:

I kept the quiz format, but changed its role from blocking value to improving the output.

The user should feel:

“I pasted my text, Grammarly already improved it, and now signing up lets me keep/copy/save the full version.”

Not:

“I have to answer a long survey before I know whether this works.”

Mission 1 — What to Build in the HTML LP

Build a polished standalone HTML LP that feels like a real tool, not a generic landing page or survey.

The improved flow should be:

Paste text → visible preview → 3-question quiz → refined preview → inline unlock/signup card

Above the fold

Show:

Paste box immediately visible.
Clear headline around natural rewriting.
Outcome-focused subheadline.
Sample text chips.
Primary CTA connected to preview/result, not generic signup.

Sample text chips can include:

Essay
Work email
Marketing copy
LinkedIn post
Job application

The user searching “free AI humanizer” should immediately understand:

“I can paste my AI text here and see a better version.”

Preview before signup

This is the most important product change.

Do not blur the entire result before the user sees value.

Show:

Partial before/after preview.
Highlighted rewritten phrases.
A visible improved result.
Enough value to create trust and desire.
A clear reason to continue.

The page should show proof before friction.

3-question quiz

Use only three useful personalization questions:

Where will you use this?
How should it sound?
How much should Grammarly change?

These questions are useful because they directly improve the output.

Remove, merge, or avoid overemphasizing questions like:

Sentence length
English variant
Formality
Vocabulary
Writing style
Humanization slider
Light humor

The reason is that many of these overlap, feel abstract, or create unnecessary friction before value.

Refined preview

After the quiz, show a refined result that feels personalized.

For example:

“Here’s a more natural version for a work email.”
“Here’s a clearer version that keeps your meaning.”
“Here’s a more confident version for LinkedIn.”
“What improved” panel

Include a small panel that explains what Grammarly improved.

Possible bullets:

Natural phrasing
Smoother rhythm
Meaning preserved
Clearer tone
Less robotic wording
Better flow
More authentic voice

This helps users understand the value instead of just seeing a rewrite.

Inline unlock/signup card

Use an inline card instead of a harsh modal-only wall.

CTA copy should be outcome-based:

Create free account to copy full rewrite

or:

Unlock my full humanized version

or:

Create free account to save my voice and copy the full version

The signup wall should come after value is demonstrated, not before.

Mission 1 — Brand-Safe Positioning

This is one of the most impressive strategic points.

Grammarly should not copy shady AI detector bypass tools. It can borrow their fast, tool-like UX, but not their risky language.

Avoid:

“Undetectable”
“Bypass detectors”
“Pass AI checks”
“100% human”
“Completely free” if signup is required
“No paywalls” if there is an unlock
Fake AI detector scores
“Before: 94% AI / After: 2% AI”
Anything that makes the page feel like a detector-evasion tool

Use:

“Make AI writing sound natural”
“Reduce robotic phrasing”
“Keep your meaning”
“Improve clarity, tone, and flow”
“Rewrite in your voice”
“Free preview”
“No credit card required”
“Create free account to copy full rewrite”
“Sound more natural without losing your message”
“Turn rough AI text into clearer, more authentic writing”

Strong sentence:

Grammarly should not compete with bypass tools on deception. It should compete on trustworthy, high-quality rewriting.

This shows you understand both conversion and brand trust.

Mission 1 — Experiment Logic

Present Mission 1 as a growth experiment, not only a redesign.

Current LP:

Control

New LP:

Variant B

Variant B hypothesis:

If Grammarly shows a useful preview before signup and reduces the quiz from 8 questions to 3 personalization questions, more users will trust the result and click the signup CTA.

Primary metric:

Signup CVR

Secondary metrics:

Preview generation rate
Quiz start rate
Quiz completion rate
Unlock card view rate
Unlock CTA click rate
Signup CTA click rate
Time to preview
Text entered rate
Sample text clicked rate

Guardrail metrics:

Install rate
try_grammarly rate
Repeat try rate
Downstream activation quality

A/B tests to mention:

Short quiz vs long quiz
Preview-before-signup vs signup-first
Input-first vs quiz-first
CTA copy tests
Use-case-specific flows
Different unlock moments
Different sample text chips
Different levels of preview visibility
Mission 1 — Event Tracking Hooks

Add tracking stubs in the HTML.

This is a small technical addition that looks very “AI Growth Builder” because it proves the LP is measurable, not just designed.

Suggested events:

lp_rendered
text_entered
sample_text_clicked
preview_requested
preview_generated
quiz_started
quiz_step_completed
quiz_completed
unlock_wall_viewed
unlock_wall_dismissed
unlock_cta_clicked
signup_cta_clicked
time_to_preview

This connects Mission 1 directly to Mission 2.

The important idea:

The LP is not only a page. It is an experiment surface with measurable behavior.

Mission 1 — Product Psychology

Users searching “free AI humanizer” have:

High intent
Low patience
A practical goal
A desire for immediate proof
Some concern about quality, trust, and effort

They probably do not want to answer eight abstract questions before seeing whether the tool works.

They want:

Fast proof
Low friction
A visible result
Control over tone
Confidence that the meaning is preserved
A simple way to copy/save the final output

The improved LP should create a “wow moment” before signup.

A strong product sentence:

The signup should not feel like a wall. It should feel like the next step after the user already owns a better version of their text.

Mission 1 — Impressive Extras to Mention Lightly

These should not become the main deliverable. Mention them as future extensions or appendix ideas.

1. Personal Voice Profile

Make signup feel useful, not arbitrary.

Instead of:

“Sign up to continue”

Frame it as:

“Create a free account to save your voice and reuse this style.”

This turns signup into a product benefit.

2. Humanize Anywhere install bridge

Connect one-time LP intent to Grammarly extension adoption.

The idea:

After the user sees value on the LP, position Grammarly as:

“Use this same natural rewriting anywhere you write.”

This bridges:

LP rewrite → install Grammarly → use in real writing contexts

3. AI Campaign Experiment Builder

A future internal tool that generates:

LP variants
Quiz questions
CTA copy
Hypotheses
KPIs
Tracking schemas
Experiment summaries
Brand-safe copy alternatives

This shows AI-native growth thinking.

4. Intent-to-LP Matching Engine

Different search intents should receive different LP experiences.

Examples:

“free AI humanizer” → fast paste-and-preview flow
“business email rewrite” → professional tone flow
“academic writing help” → clarity and citation-safe wording flow
“LinkedIn post rewrite” → confident personal-brand tone flow
“job application rewrite” → polished and authentic application tone
5. Brand Safety Checker

A checker that prevents risky language like:

“Undetectable”
“Bypass”
“Beat AI detectors”
“100% human”
Fake AI scores

This is especially relevant for Grammarly because trust is part of the brand.

Mission 1 — What to Avoid

Avoid:

Fake AI detector scores
“Pass AI checks”
“Bypass detectors”
“Undetectable”
“100% human”
Overbuilt backend
Real API calls in the submission
Exposed API keys
Anything that makes the page look like a detector-evasion tool
A generic LLM-looking UI
A long quiz before any value appears
A hard signup wall before proof
Too many extra ideas that distract from the core build

Keep the actual deliverable focused:

A polished, responsive, preview-first quiz LP with measurable tracking hooks.

Mission 1 — Current Implementation Notes / Finishing Gaps

If describing the current built implementation, say it is mostly strong if it includes:

Quiz format preserved
Paste box above the fold
Sample text chips
Before/after preview
3-question quiz
Refined preview
Inline unlock card
Brand-safe copy
Event tracking stubs

Small finishing gaps to consider:

Add “Keep editing preview” secondary CTA.
Add unlock_wall_dismissed.
Track real elapsed time_to_preview.
Make sure the page feels responsive and polished.
Make sure the flow does not look like a fake AI detector tool.
Mission 2 — Performance Analytics Dashboard
Core diagnosis

Mission 2 should not be framed as:

“I made charts.”

It should be framed as:

“I built a Growth Command Center that shows whether campaigns drive real product activation, not just clicks or installs.”

The strongest sentence:

Installs are not the value moment. try_grammarly is the first available proxy for real value.

The dashboard should not celebrate raw clicks or installs. It should answer:

Which campaigns create real product usage?

Mission 2 — Important Dataset Correction

A very important point:

did_click_lp is not a page render. It is the LP CTA/install-button click.

So the measurable funnel is:

LP CTA Click → Install Grammarly → Try Grammarly

This matters because the dataset starts after the page-render stage.

Therefore, the dashboard should not calculate:

Page-render CVR
Ad CTR
CAC
ROAS
LTV
Revenue per user

The dataset does not include:

Spend
Impressions
Page renders
Revenue
Ad clicks before the LP
True acquisition cost
Long-term retention/revenue

So the honest caveat is:

Because the dataset does not include spend, impressions, page renders, or revenue, I focused on behavioral activation quality rather than CAC, ROAS, LTV, ad CTR, or page CVR.

This shows data maturity.

Mission 2 — North-Star Metric

The strongest north-star metric is:

Qualified Activated Users = users who clicked the LP CTA, installed Grammarly, and triggered try_grammarly.

This is stronger than reporting raw clicks or installs.

Strong sentence:

I would not optimize for cheaper installs. I would optimize for cheaper qualified activations.

Another strong framing:

Good growth is not only getting more users to click. It is getting the right users to reach product value.

Mission 2 — Core Funnel

The dashboard should track:

did_click_lp → did_install_grammarly → try_grammarly

But in user-facing labels, use:

LP CTA Click → Install Grammarly → Try Grammarly

This is the measurable acquisition-to-activation journey.

The dashboard should use user-level, sequence-aware metrics.

That means:

Count users, not only events.
Check whether users move through the ordered sequence.
Avoid treating a try_grammarly event before install as a valid funnel completion.
Avoid double-counting repeat events as unique users.
Separate first try from repeat tries.
Mission 2 — Core KPIs

Show these as main KPI cards and/or dashboard sections:

LP CTA Click Users
Install Users
Try Users
Install CVR
Install → Try Rate
Activation CVR
Dead Install Rate
Activation Yield
Time to Install
Time to First Value
Repeat Try Rate
Feature adoption
Unique users
Unique sessions
Daily trend
Drop-off rate

Definitions:

LP CTA Click Users

Users who triggered did_click_lp.

This is the first measurable step in the dataset.

Install Users

Users who triggered did_install_grammarly.

Try Users

Users who triggered try_grammarly.

Install CVR

Users who installed divided by users who clicked LP CTA.

Install → Try Rate

Users who tried Grammarly divided by users who installed.

This is very important because it measures whether installation became product usage.

Activation CVR

Users who clicked LP CTA and eventually triggered try_grammarly.

Dead Install Rate

Users who installed Grammarly but never tried it.

This is one of the strongest hidden leak metrics.

Activation Yield

How many activated users are produced from the acquisition funnel.

Time to Install

Time between LP CTA click and install.

Time to First Value

Time between LP CTA click or install and first try_grammarly.

Repeat Try Rate

Users who try Grammarly more than once.

This separates one-time curiosity from real engagement.

Mission 2 — Dashboard Structure

Build the dashboard as a Growth Command Center, not just a report.

It should answer:

What is working?
What is leaking?
Which campaign is best?
Which LP is leaking users?
Which LP brings activated users?
Which product feature drives real activation?
Which users install but never try?
What changed today?
Where should the growth team focus tomorrow?
What should we scale, fix, pause, or investigate?
Page / Section 1: Executive Overview

Include:

KPI cards
Daily trend
LP CTA Click Users
Install Users
Try Users
Install CVR
Activation CVR
Install → Try Rate
Dead Install Rate
Repeat Try Rate
Short written executive summary

The executive summary should say things like:

Best-performing LP
Worst funnel step
Highest activation segment
Biggest leak
Suggested next experiment
Page / Section 2: Funnel Diagnosis

Show the funnel:

LP CTA Click → Install Grammarly → Try Grammarly

Break it down by:

LP name
Product feature
Date
Campaign/audience if available

The point is to diagnose where users drop.

Page / Section 3: LP Quality Comparison

Compare landing pages by downstream activation, not just volume.

A good LP is not only one that gets clicks. A good LP creates users who:

Install
Try Grammarly
Try the relevant feature
Return or repeat

This connects Mission 1 and Mission 2 directly.

Page / Section 4: Feature Activation

Show which product_feature values users actually tried.

This answers:

Which product experiences activate users?
Which LPs lead to which features?
Are users trying what the LP promised?
Page / Section 5: LP × Product Feature Heatmap

This is a very strong addition.

It shows whether the landing page promise matches actual product usage.

Example idea:

Academic LP → academic writing feature
Business email LP → business email feature
AI Humanizer LP → rewriting/humanizing feature

This can expose promise mismatch.

Page / Section 6: Dead Install Diagnosis

Highlight:

Installed but never tried Grammarly

This is important because it means acquisition worked, but product value did not happen.

This is a post-install onboarding or product-value leak.

Page / Section 7: Data Quality / Monitoring

Include checks for:

Missing lp_name
Missing product_feature
Missing IDs
Duplicate events
Try before install
Install without LP CTA click
Sudden event drops
Wrong event order
Invalid timestamps
Sessions with impossible sequences

This is especially impressive because many candidates will only show charts.

It makes the dashboard operational and trustworthy.

Mission 2 — Impressive Dashboard Additions
1. Growth Actions Table

This is one of the most impressive additions.

Add a decision-support table with actions like:

Scale
Fix
Pause
Investigate

Example logic:

Scale

High volume
High activation
Good repeat try rate
Low dead install rate

Fix

High volume
Low activation
High dead install rate

Pause

Low activation
Poor downstream quality
Consistent waste

Investigate

Sudden anomaly
Data-quality issue
Weird LP-feature mismatch
Unexpected drop or spike

This turns the dashboard from reporting into decision support.

2. Traffic Quality Matrix

Show volume vs activation quality.

This can create four quadrants:

High volume / high activation → scale
High volume / low activation → fix
Low volume / high activation → test more budget
Low volume / low activation → pause or deprioritize

This is more useful than a simple bar chart.

3. Campaign Quality Score

Create a transparent score that ranks campaigns, LPs, or segments by downstream value.

Possible inputs:

Install CVR
Install → Try Rate
Activation CVR
Repeat Try Rate
Dead Install Rate
Time to First Value
Promise-Match Rate

This creates an executive-friendly ranking metric.

4. Promise-Match Rate

Measure whether users tried the feature promised by the LP.

For example:

If a user came from an academic writing LP, did they try the academic feature?

If a user came from a business email LP, did they try a business writing feature?

This helps detect whether the LP promise matches product behavior.

5. Wasted Acquisition Ledger

Show where users are wasted.

Examples:

Clicked but did not install
Installed but did not try
Tried the wrong feature
Tried once but did not repeat
Took too long to reach first value
Came through an LP but activated on an unrelated feature

This makes the dashboard feel like a growth operating system.

6. Simple Anomaly Detection

Use a simple baseline:

7-day rolling average
2 standard deviations

Flag:

Sudden activation drops
Dead install spikes
Try rate drops
Event volume drops
LP-specific anomalies
Product-feature anomalies

This does not need to be complex ML. A simple statistical rule is enough and looks professional.

7. Data Quality / QA Checks Table

Show QA checks directly in the dashboard.

Examples:

Missing lp_name
Missing product_feature
Duplicate events
Try before install
Install without click
Missing timestamps
Invalid event order
Event drops

This makes the dashboard trustworthy.

Mission 2 — Specific Dashboard Findings to Mention if They Come from Your Analysis

If these numbers are from your actual dashboard output, they are very valuable and should be included as concrete insights.

Key findings:

Activation quality gap is real, not random.

Academic LP converts 22.6% all the way to try_grammarly.

Business LP converts 18.5% all the way to try_grammarly.

That is a 4.1 percentage point gap on around 1,600 users each, consistent over 28 cohort days.

Repeat try rate gap is the most important number.

Academic users have a 75% repeat try rate.

Business users have a 12% repeat try rate.

This suggests academic users come back, while business users try once and stop.

That points to either:

Product-feature fit issue
Onboarding friction
Promise mismatch
Wrong business audience
Weak post-install value experience
Dead install rate is high for both.

Dead install rate is around 43–51%.

This means nearly half of users who install never try a single feature.

That is a shared funnel leak in:

Install → Try

Data is clean.

There were zero flagged rows on all 8 QA checks.

This means the dataset is safe to use directly in the dashboard.

Outputs are ready.

The outputs are in:

dashboard/output/

There are 9 CSVs ready to use for the dashboard/report.

These findings are strong because they turn the dashboard from generic charts into real growth diagnosis.

Mission 2 — How to Interpret the Academic vs Business Insight

The important thing is not just that academic performs better.

The real insight is:

Academic users do not only activate more. They repeat more.

That means the Academic LP likely attracts users whose need matches Grammarly’s product value better.

Business users may still click and install, but their lower repeat try rate suggests the business campaign may have:

weaker promise-product fit
unclear first use case
less urgent value
less relevant post-install onboarding
wrong feature mapping
too broad audience
lower intent quality

Recommended action:

Scale or further test Academic if volume can grow.
Fix Business onboarding or LP promise before scaling.
Investigate which business feature users expected vs which feature they actually tried.
Use the LP × product-feature matrix to check promise match.
Use dead install analysis to see whether business users fail before or after first try.
Mission 2 — What Not to Claim

Do not calculate or claim:

CAC
ROAS
LTV
Revenue
Profitability
Ad CTR
Page-render CVR
Impression-to-click conversion
Signup CVR from page renders using this dataset

Unless those fields are actually available.

The correct caveat:

The dataset starts at did_click_lp, so I can measure post-CTA acquisition quality and activation, but not full ad-to-page conversion or financial efficiency.

Cross-Mission Connection

The strongest connecting idea is:

Mission 1 creates a better experiment. Mission 2 creates the measurement system that decides whether that experiment actually worked.

Mission 1 should not only increase signup clicks.

It should improve downstream quality:

Signup → Install → Try Grammarly → Repeat use

The LP redesign should be judged not only by signup CVR, but also by whether those signups become activated users.

So in the final submission, do not say:

“I redesigned the LP and made a dashboard.”

Say:

“I built a growth loop: the LP gets users to value faster, and the dashboard measures whether those users become qualified activated users.”

This makes you sound like an AI Growth Builder, not just a designer or analyst.

Final Submission Story

Use this as the main story:

I approached the assignment as one connected growth system. In Mission 1, I redesigned the AI Humanizer LP around faster time-to-value: users paste text, see a preview, personalize it through a short quiz, and only then are asked to sign up to copy or save the full result. This keeps the quiz format but turns the quiz from friction into personalization.

In Mission 2, I built the dashboard around qualified activation, not vanity metrics. Since did_click_lp represents an LP CTA/install-button click rather than a page render, the measurable funnel is LP CTA Click → Install Grammarly → Try Grammarly. The key success metric is not raw installs, but users who click, install, and actually try Grammarly.

Together, the LP and dashboard form a growth loop: the LP creates the value moment faster, and the dashboard proves whether that value moment turns into real product activation.