Introduction
Thank you so much for your time so far - we're excited to learn more about how you think about growth and optimization.
You may present your answers in a slide deck, document, or any format that best showcases your ideas. Feel free to reach out if you have any questions.
Assignment #1: LP Conversion Optimization for AI Humanizer
Context: Grammarly wants to tap into the AI Humanizer market. To do so, Grammarly added a new AI Humanizer feature to its product suite and is promoting it via a sponsored Google Search ad targeting users who searched for the keyword "free ai humanizer". Users who click the ad are directed to this landing page.
Current landing page
The current LP is attached below. Open the HTML file in a browser to interact with it, or download it to inspect the markup.
Current LP performance (last 30 days)
Page renders: 84,200
Signups (signup CTA clicks): 8,420
CVR (Signups / Page renders): 10.0%
Funnel breakdown (% of page renders)
Stage
% of Users
Users
Page render
100.0%
84,200
Clicked “Start Humanizing”
93.0%
78,300
Q1 — Sentence length
92.5%
77,900
Q2 — English variant
55.0%
46,300
Q3 — Formality
48.0%
40,400
Q4 — Vocabulary
47.4%
39,900
Q5 — Writing style
47.25%
39,800
Q6 — Main goal
46.0%
38,700
Q7 — Humanization slider
43.0%
36,200
Q8 — Light humor
42.5%
35,800
Signup / unlock modal viewed
32.5%
27,400
Signup CTA clicked (CVR)
10.0%
8,420
The LP currently does not perform well enough, and Grammarly wants to improve the landing page CVR.
The task
Improve the landing page and increase CVR (Signups / Page renders).
You are free to change anything on the LP — copy, layout, visual design, the quiz flow itself (add, remove, reorder, or replace questions), the CTA, the unlock/signup wall.
*The only exception → Keep the LP in Quiz Format
Your decisions should be grounded in:
Current performance: the funnel above — use the data to inform where to focus.
Market research: how leading AI humanizer / writing assistant competitors structure their landing pages, value propositions, and signup flows.
Your own product intuition: what you believe a user searching “free ai humanizer” on Google actually wants in their first few seconds on the page.
Your response should cover:
Diagnosis: What is likely hurting conversion in the current LP and why
Optimization strategy: What changes you would make to the LP and how it can improve performance
Deliverables
Deliverable #1: A concise optimization plan explaining your recommendations and rationale.
Deliverable #2: 1 functional HTML file with an improved LP experience designed to increase signups.
Assignment #2: Performance Analytics & Dashboarding
Context: Following the success of the AI Humanizer campaign, Grammarly has rolled out similar targeted campaigns for other features and audience segments (e.g., academic writing, business emails). Below is user-level mock analytics data collected across all of these campaigns, covering media buys and user actions.
The task
Connect to the provided dataset and create a visualization showing the metrics and KPIs that are most important to monitor daily.
Dataset
Source: grammarly_campaign_data
Data schema
session_id: Unique identifier for the user's session
user_id: Unique identifier for the user
action: The specific event triggered by the user. Possible values:
did_click_lp - the user clicked the install button on the LP  
did_install_grammarly
try_grammarly
extra: Additional metadata associated with the action (JSON format):
lp_name: The specific landing page visited (populated if the action is related to the LP)
product_feature: The specific product or feature the user interacted with (populated if the action is try_grammarly)
timestamp
Deliverables
A link to a functional visualization report.
A brief summary (1–2 paragraphs) within the report or as a separate document explaining:
why you chose to highlight these specific metrics
how they measure the success of the campaigns