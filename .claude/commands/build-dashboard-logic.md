Review and improve @dashboard/data_cleaning.py so it can read @dashboard/grammarly_campaign_data.xlsx or @dashboard/grammarly_campaign_data.csv and output clean dashboard-ready CSVs.

The script must:
- Parse extra JSON into lp_name and product_feature.
- Normalize timestamps.
- Use first LP CTA click per user as attribution anchor.
- Count install only after that click and within 7 days.
- Count try only after install and within 7 days of click.
- Create event-date and cohort-date outputs.
- Create LP-level funnel metrics.
- Create product-feature try metrics.
- Create QA checks.
- Keep repeat try logic separate.
- Create a Growth Actions table if possible.

Run the script if the dataset exists. Do not invent data insights. Summarize only what the real outputs show.
