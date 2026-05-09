"""
Mission 2 dashboard data-cleaning script.

Reads dashboard/grammarly_campaign_data.xlsx or dashboard/grammarly_campaign_data.csv
and creates dashboard-ready CSV outputs under dashboard/output/.

Core logic:
- Parse extra JSON into lp_name and product_feature.
- Use user-level funnel sequencing.
- Anchor attribution on first LP CTA click per user.
- Count install only after LP CTA click and within 7 days.
- Count try only after install and within 7 days of LP CTA click.
- Preserve repeated try events only for Repeat Try Rate.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, Optional

import pandas as pd

ROOT = Path(__file__).resolve().parent
INPUT_XLSX = ROOT / "grammarly_campaign_data.xlsx"
INPUT_CSV = ROOT / "grammarly_campaign_data.csv"
OUTPUT_DIR = ROOT / "output"
ATTRIBUTION_DAYS = 7

REQUIRED_COLUMNS = {"session_id", "user_id", "action", "extra", "timestamp"}
ACTIONS = {"did_click_lp", "did_install_grammarly", "try_grammarly"}


def _load_input() -> pd.DataFrame:
    if INPUT_XLSX.exists():
        return pd.read_excel(INPUT_XLSX)
    if INPUT_CSV.exists():
        return pd.read_csv(INPUT_CSV)
    raise FileNotFoundError(
        "No input dataset found. Place grammarly_campaign_data.xlsx or "
        "grammarly_campaign_data.csv in the dashboard/ folder."
    )


def _safe_parse_extra(value: Any) -> Dict[str, Any]:
    if pd.isna(value):
        return {}
    if isinstance(value, dict):
        return value
    if isinstance(value, str):
        text = value.strip()
        if not text:
            return {}
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            # Some mock datasets use single quotes. Try a conservative fallback.
            try:
                return json.loads(text.replace("'", '"'))
            except json.JSONDecodeError:
                return {"_parse_error": text}
    return {}


def clean_events(df: pd.DataFrame) -> pd.DataFrame:
    missing = REQUIRED_COLUMNS - set(df.columns)
    if missing:
        raise ValueError(f"Missing required columns: {sorted(missing)}")

    events = df.copy()
    events["timestamp"] = pd.to_datetime(events["timestamp"], errors="coerce", utc=True)
    events["event_date"] = events["timestamp"].dt.date
    events["action"] = events["action"].astype(str).str.strip()

    parsed = events["extra"].apply(_safe_parse_extra)
    events["lp_name"] = parsed.apply(lambda x: x.get("lp_name"))
    events["product_feature"] = parsed.apply(lambda x: x.get("product_feature"))
    events["extra_parse_error"] = parsed.apply(lambda x: x.get("_parse_error"))
    events["is_known_action"] = events["action"].isin(ACTIONS)

    return events.sort_values(["user_id", "timestamp", "action"], na_position="last").reset_index(drop=True)


def first_event_after(events: pd.DataFrame, user_id: Any, action: str, after_ts: pd.Timestamp, before_ts: pd.Timestamp) -> Optional[pd.Series]:
    subset = events[
        (events["user_id"] == user_id)
        & (events["action"] == action)
        & (events["timestamp"] >= after_ts)
        & (events["timestamp"] <= before_ts)
    ].sort_values("timestamp")
    if subset.empty:
        return None
    return subset.iloc[0]


def build_user_funnel(events: pd.DataFrame, attribution_days: int = ATTRIBUTION_DAYS) -> pd.DataFrame:
    click_events = events[events["action"] == "did_click_lp"].sort_values("timestamp")
    first_clicks = click_events.dropna(subset=["user_id", "timestamp"]).groupby("user_id", as_index=False).first()

    rows = []
    for _, click in first_clicks.iterrows():
        user_id = click["user_id"]
        click_ts = click["timestamp"]
        window_end = click_ts + pd.Timedelta(days=attribution_days)

        install = first_event_after(events, user_id, "did_install_grammarly", click_ts, window_end)
        install_ts = install["timestamp"] if install is not None else pd.NaT

        if install is not None:
            try_event = first_event_after(events, user_id, "try_grammarly", install_ts, window_end)
        else:
            try_event = None
        try_ts = try_event["timestamp"] if try_event is not None else pd.NaT

        repeated_tries = events[
            (events["user_id"] == user_id)
            & (events["action"] == "try_grammarly")
            & (events["timestamp"] >= click_ts)
            & (events["timestamp"] <= window_end)
        ]

        rows.append({
            "user_id": user_id,
            "attributed_lp_name": click.get("lp_name"),
            "first_lp_cta_click_ts": click_ts,
            "cohort_date": click_ts.date() if pd.notna(click_ts) else pd.NaT,
            "first_install_ts": install_ts,
            "first_try_ts": try_ts,
            "first_product_feature": try_event.get("product_feature") if try_event is not None else None,
            "installed_after_click": install is not None,
            "tried_after_install": try_event is not None,
            "qualified_activated": try_event is not None,
            "repeat_try_count_7d": int(len(repeated_tries)),
            "is_repeat_try_user": int(len(repeated_tries) >= 2),
            "time_to_install_hours": ((install_ts - click_ts).total_seconds() / 3600) if install is not None else None,
            "time_to_first_value_hours": ((try_ts - click_ts).total_seconds() / 3600) if try_event is not None else None,
            "attribution_window_days": attribution_days,
        })

    return pd.DataFrame(rows)


def _safe_div(num: pd.Series | float, den: pd.Series | float) -> pd.Series | float:
    return num / den.replace(0, pd.NA) if isinstance(den, pd.Series) else (num / den if den else 0)


def build_lp_metrics(user_funnel: pd.DataFrame) -> pd.DataFrame:
    if user_funnel.empty:
        return pd.DataFrame()

    grouped = user_funnel.groupby("attributed_lp_name", dropna=False)
    metrics = grouped.agg(
        lp_cta_click_users=("user_id", "nunique"),
        install_users=("installed_after_click", "sum"),
        try_users=("tried_after_install", "sum"),
        repeat_try_users=("is_repeat_try_user", "sum"),
        median_time_to_install_hours=("time_to_install_hours", "median"),
        median_time_to_first_value_hours=("time_to_first_value_hours", "median"),
    ).reset_index()

    metrics["install_cvr"] = metrics["install_users"] / metrics["lp_cta_click_users"].replace(0, pd.NA)
    metrics["install_to_try_rate"] = metrics["try_users"] / metrics["install_users"].replace(0, pd.NA)
    metrics["activation_cvr"] = metrics["try_users"] / metrics["lp_cta_click_users"].replace(0, pd.NA)
    metrics["dead_install_rate"] = (metrics["install_users"] - metrics["try_users"]) / metrics["install_users"].replace(0, pd.NA)
    metrics["activation_yield_per_100"] = metrics["activation_cvr"] * 100
    metrics["repeat_try_rate"] = metrics["repeat_try_users"] / metrics["try_users"].replace(0, pd.NA)

    # Transparent decision aid. Normalize relative to current dataset.
    for col in ["install_cvr", "activation_cvr", "install_to_try_rate"]:
        max_val = metrics[col].max(skipna=True)
        metrics[f"norm_{col}"] = metrics[col] / max_val if pd.notna(max_val) and max_val else 0

    metrics["campaign_quality_score"] = (
        0.35 * metrics["norm_install_cvr"]
        + 0.45 * metrics["norm_activation_cvr"]
        + 0.20 * metrics["norm_install_to_try_rate"]
    )

    return metrics.sort_values("campaign_quality_score", ascending=False).reset_index(drop=True)


def build_feature_metrics(user_funnel: pd.DataFrame) -> pd.DataFrame:
    activated = user_funnel[user_funnel["qualified_activated"]].copy()
    if activated.empty:
        return pd.DataFrame()

    feature = activated.groupby(["attributed_lp_name", "first_product_feature"], dropna=False).agg(
        try_users=("user_id", "nunique")
    ).reset_index()
    total_by_lp = activated.groupby("attributed_lp_name", dropna=False)["user_id"].nunique().rename("total_try_users").reset_index()
    feature = feature.merge(total_by_lp, on="attributed_lp_name", how="left")
    feature["feature_share_within_lp"] = feature["try_users"] / feature["total_try_users"].replace(0, pd.NA)
    return feature.sort_values(["attributed_lp_name", "try_users"], ascending=[True, False])


def build_daily_event_metrics(events: pd.DataFrame) -> pd.DataFrame:
    if events.empty:
        return pd.DataFrame()
    return events.groupby(["event_date", "action"], dropna=False).agg(
        events=("action", "size"),
        users=("user_id", "nunique"),
        sessions=("session_id", "nunique"),
    ).reset_index()


def build_cohort_metrics(user_funnel: pd.DataFrame) -> pd.DataFrame:
    if user_funnel.empty:
        return pd.DataFrame()
    cohort = user_funnel.groupby(["cohort_date", "attributed_lp_name"], dropna=False).agg(
        lp_cta_click_users=("user_id", "nunique"),
        install_users=("installed_after_click", "sum"),
        try_users=("tried_after_install", "sum"),
    ).reset_index()
    cohort["install_cvr"] = cohort["install_users"] / cohort["lp_cta_click_users"].replace(0, pd.NA)
    cohort["activation_cvr"] = cohort["try_users"] / cohort["lp_cta_click_users"].replace(0, pd.NA)
    cohort["install_to_try_rate"] = cohort["try_users"] / cohort["install_users"].replace(0, pd.NA)
    return cohort


def build_qa(events: pd.DataFrame) -> tuple[pd.DataFrame, pd.DataFrame]:
    qa_rows = []

    def add_check(name: str, mask: pd.Series, severity: str, explanation: str) -> None:
        flagged = events[mask].copy()
        qa_rows.append({
            "check": name,
            "severity": severity,
            "flagged_rows": int(mask.sum()),
            "explanation": explanation,
        })

    add_check(
        "missing_lp_name_on_lp_click",
        (events["action"] == "did_click_lp") & (events["lp_name"].isna()),
        "high",
        "Breaks LP performance attribution.",
    )
    add_check(
        "missing_product_feature_on_try",
        (events["action"] == "try_grammarly") & (events["product_feature"].isna()),
        "high",
        "Breaks feature adoption analysis.",
    )
    add_check("null_user_id", events["user_id"].isna(), "high", "Prevents user-level funnel analysis.")
    add_check("null_session_id", events["session_id"].isna(), "medium", "Weakens session-level QA.")
    add_check("invalid_timestamp", events["timestamp"].isna(), "high", "Breaks sequencing and attribution windows.")
    add_check("unknown_action", ~events["is_known_action"], "medium", "Unexpected action value.")
    add_check("extra_parse_error", events["extra_parse_error"].notna(), "medium", "Could not parse metadata JSON.")

    duplicate_cols = ["session_id", "user_id", "action", "timestamp"]
    duplicate_mask = events.duplicated(subset=duplicate_cols, keep=False)
    add_check("duplicate_events", duplicate_mask, "medium", "May inflate raw event counts.")

    # Sequence QA at user level.
    firsts = events.pivot_table(index="user_id", columns="action", values="timestamp", aggfunc="min")
    sequence_issues = []
    for user_id, row in firsts.iterrows():
        click = row.get("did_click_lp", pd.NaT)
        install = row.get("did_install_grammarly", pd.NaT)
        try_ts = row.get("try_grammarly", pd.NaT)
        if pd.notna(install) and pd.isna(click):
            sequence_issues.append({"user_id": user_id, "issue": "install_without_lp_click"})
        if pd.notna(try_ts) and pd.isna(install):
            sequence_issues.append({"user_id": user_id, "issue": "try_without_install"})
        if pd.notna(try_ts) and pd.notna(install) and try_ts < install:
            sequence_issues.append({"user_id": user_id, "issue": "try_before_install"})
    qa_sequence = pd.DataFrame(sequence_issues)

    if not qa_sequence.empty:
        for issue, count in qa_sequence["issue"].value_counts().items():
            qa_rows.append({
                "check": issue,
                "severity": "high",
                "flagged_rows": int(count),
                "explanation": "User-level event sequence issue.",
            })

    return pd.DataFrame(qa_rows), qa_sequence


def build_growth_actions(lp_metrics: pd.DataFrame) -> pd.DataFrame:
    if lp_metrics.empty:
        return pd.DataFrame()

    volume_median = lp_metrics["lp_cta_click_users"].median()
    activation_median = lp_metrics["activation_cvr"].median()
    rows = []
    for _, row in lp_metrics.iterrows():
        high_volume = row["lp_cta_click_users"] >= volume_median
        high_activation = row["activation_cvr"] >= activation_median
        if high_volume and high_activation:
            diagnosis = "High volume, high activation"
            action = "Scale or create close variants"
        elif high_volume and not high_activation:
            diagnosis = "High volume, low activation"
            action = "Diagnose promise mismatch or onboarding friction"
        elif not high_volume and high_activation:
            diagnosis = "Low volume, high activation"
            action = "Hidden gem: test more budget or audience expansion"
        else:
            diagnosis = "Low volume, low activation"
            action = "Pause, rebuild, or keep as low priority"
        rows.append({
            "lp_name": row["attributed_lp_name"],
            "signal": diagnosis,
            "activation_cvr": row["activation_cvr"],
            "lp_cta_click_users": row["lp_cta_click_users"],
            "recommended_action": action,
        })
    return pd.DataFrame(rows)


def main() -> None:
    OUTPUT_DIR.mkdir(exist_ok=True)

    try:
        raw = _load_input()
    except FileNotFoundError as exc:
        print(exc)
        print("No outputs created. Add the dataset and rerun the script.")
        return

    events = clean_events(raw)
    user_funnel = build_user_funnel(events)
    lp_metrics = build_lp_metrics(user_funnel)
    feature_metrics = build_feature_metrics(user_funnel)
    daily_event_metrics = build_daily_event_metrics(events)
    cohort_metrics = build_cohort_metrics(user_funnel)
    qa_summary, qa_events = build_qa(events)
    growth_actions = build_growth_actions(lp_metrics)

    outputs = {
        "cleaned_events.csv": events,
        "user_funnel.csv": user_funnel,
        "lp_funnel_metrics.csv": lp_metrics,
        "feature_metrics.csv": feature_metrics,
        "daily_event_metrics.csv": daily_event_metrics,
        "cohort_metrics.csv": cohort_metrics,
        "qa_summary.csv": qa_summary,
        "qa_events.csv": qa_events,
        "growth_actions.csv": growth_actions,
    }

    for filename, frame in outputs.items():
        frame.to_csv(OUTPUT_DIR / filename, index=False)

    print(f"Created {len(outputs)} dashboard outputs in {OUTPUT_DIR}")
    if not lp_metrics.empty:
        print("Top LPs by campaign_quality_score:")
        print(lp_metrics[["attributed_lp_name", "lp_cta_click_users", "activation_cvr", "campaign_quality_score"]].head())
    if not qa_summary.empty:
        print("QA summary:")
        print(qa_summary)


if __name__ == "__main__":
    main()
