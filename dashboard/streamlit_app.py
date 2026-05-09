"""
Grammarly Campaign Performance Dashboard
User-level funnel · first-touch LP attribution · 7-day window · Feb 2026

Run:    streamlit run dashboard/streamlit_app.py
Deploy: share.streamlit.io — set main file to dashboard/streamlit_app.py
"""

import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from pathlib import Path

# ── Page config ──────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="Grammarly Campaign Dashboard",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ── Custom CSS ───────────────────────────────────────────────────────────────
st.markdown("""
<style>
  #MainMenu, footer { visibility: hidden; }
  .main .block-container { padding-top: 1.2rem; padding-bottom: 3rem; max-width: 1240px; }
  div[data-testid="metric-container"] {
    background: #fff; border: 1px solid #dde4e1;
    border-radius: 12px; padding: 14px 16px;
    box-shadow: 0 2px 8px rgba(23,35,51,.05);
  }
  section[data-testid="stSidebar"] { background: #f8faf9; border-right: 1px solid #dde4e1; }
  div[data-testid="stTabs"] button[role="tab"] {
    font-weight: 600; font-size: 13px; color: #5f6b7a; padding: 10px 18px;
  }
  div[data-testid="stTabs"] button[aria-selected="true"] { color: #14a46c; }
  .stAlert { border-radius: 10px; }
  .stDataFrame { border-radius: 10px; overflow: hidden; }
</style>
""", unsafe_allow_html=True)

# ── Constants ─────────────────────────────────────────────────────────────────
C = {
    "academic": "#14a46c",
    "business": "#3d7dd4",
    "warn":     "#e2813a",
    "neutral":  "#94a3b8",
    "text":     "#1b2333",
    "muted":    "#5f6b7a",
}
LP_MAP = {
    "lp_academic_writing": "Academic Writing",
    "lp_business_emails":  "Business Emails",
}
COLOR_MAP   = {"Academic Writing": C["academic"], "Business Emails": C["business"]}
TOOLTIP_CFG = dict(bgcolor=C["text"], font_color="#fff", bordercolor=C["text"], font_size=12)

# ── Data loading ──────────────────────────────────────────────────────────────
OUTPUT = Path(__file__).parent / "output"

@st.cache_data
def load_all():
    uf = pd.read_csv(OUTPUT / "user_funnel.csv")
    uf["cohort_date"] = pd.to_datetime(uf["cohort_date"], errors="coerce")
    daily = pd.read_csv(OUTPUT / "daily_event_metrics.csv")
    daily["event_date"] = pd.to_datetime(daily["event_date"], errors="coerce")
    coh = pd.read_csv(OUTPUT / "cohort_metrics.csv")
    coh["cohort_date"] = pd.to_datetime(coh["cohort_date"], errors="coerce")
    return {
        "user_funnel": uf,
        "feature":     pd.read_csv(OUTPUT / "feature_metrics.csv"),
        "daily":       daily,
        "cohort":      coh,
        "qa":          pd.read_csv(OUTPUT / "qa_summary.csv"),
    }

raw = load_all()

# ── Dynamic metric computation ────────────────────────────────────────────────
def compute_lp_metrics(uf: pd.DataFrame) -> pd.DataFrame:
    """Re-aggregate LP metrics from a filtered user_funnel slice."""
    if uf.empty:
        return pd.DataFrame(columns=["attributed_lp_name", "LP", "lp_cta_click_users",
                                     "install_users", "try_users", "install_cvr",
                                     "activation_cvr", "install_to_try_rate",
                                     "dead_install_rate", "repeat_try_rate",
                                     "median_time_to_install_hours",
                                     "median_time_to_first_value_hours"])
    g = uf.groupby("attributed_lp_name", dropna=False)
    m = g.agg(
        lp_cta_click_users         =("user_id",               "nunique"),
        install_users              =("installed_after_click",  "sum"),
        try_users                  =("tried_after_install",    "sum"),
        repeat_try_users           =("is_repeat_try_user",     "sum"),
        median_time_to_install_hours      =("time_to_install_hours",      "median"),
        median_time_to_first_value_hours  =("time_to_first_value_hours",  "median"),
    ).reset_index()
    dc = m["lp_cta_click_users"].replace(0, float("nan"))
    di = m["install_users"].replace(0, float("nan"))
    dt = m["try_users"].replace(0, float("nan"))
    m["install_cvr"]       = m["install_users"] / dc
    m["activation_cvr"]    = m["try_users"]     / dc
    m["install_to_try_rate"] = m["try_users"]   / di
    m["dead_install_rate"] = (m["install_users"] - m["try_users"]) / di
    m["repeat_try_rate"]   = m["repeat_try_users"] / dt
    m["LP"] = m["attributed_lp_name"].map(LP_MAP)
    return m.fillna(0)

# ── Sidebar ───────────────────────────────────────────────────────────────────
with st.sidebar:
    st.markdown("### Grammarly Campaigns")
    st.caption("Feb 2026 · 2 LPs · 3,200 users")
    st.divider()

    # LP filter
    all_lps = raw["user_funnel"]["attributed_lp_name"].dropna().unique().tolist()
    sel_lps = st.multiselect(
        "Landing Page",
        options=all_lps,
        default=all_lps,
        format_func=lambda x: LP_MAP.get(x, x),
    )
    if not sel_lps:
        sel_lps = all_lps

    # Date range filter (cohort date)
    uf_all = raw["user_funnel"]
    date_min = uf_all["cohort_date"].dt.date.min()
    date_max = uf_all["cohort_date"].dt.date.max()
    date_range = st.date_input(
        "Cohort Date Range",
        value=(date_min, date_max),
        min_value=date_min,
        max_value=date_max,
        help="Filters users by their first LP CTA click date.",
    )
    # Normalize date_range to always be a tuple
    if isinstance(date_range, tuple) and len(date_range) == 2:
        d_start, d_end = pd.Timestamp(date_range[0]), pd.Timestamp(date_range[1])
    else:
        d_start, d_end = pd.Timestamp(date_min), pd.Timestamp(date_max)

    # Rolling average toggle
    show_rolling = st.checkbox("Show 7-day rolling avg on cohort chart", value=True)

    if st.button("Reset all filters", use_container_width=True):
        st.rerun()

    st.divider()
    st.markdown("**Grain:** user-level")
    st.markdown("**Attribution:** first-touch, 7-day window")
    st.markdown("`did_click_lp` = install-button click, not page render")
    st.divider()
    st.caption("Source: `data_cleaning.py` · mock dataset · Feb 2026")

# ── Filter data ───────────────────────────────────────────────────────────────
uf_f = raw["user_funnel"][
    raw["user_funnel"]["attributed_lp_name"].isin(sel_lps) &
    (raw["user_funnel"]["cohort_date"] >= d_start) &
    (raw["user_funnel"]["cohort_date"] <= d_end)
].copy()

lp_f  = compute_lp_metrics(uf_f)
feat_f = raw["feature"][raw["feature"]["attributed_lp_name"].isin(sel_lps)].copy()
feat_f["LP"] = feat_f["attributed_lp_name"].map(LP_MAP)

coh_f = raw["cohort"][
    raw["cohort"]["attributed_lp_name"].isin(sel_lps) &
    (raw["cohort"]["cohort_date"] >= d_start) &
    (raw["cohort"]["cohort_date"] <= d_end)
].copy()
coh_f["LP"] = coh_f["attributed_lp_name"].map(LP_MAP)
coh_f = coh_f.sort_values(["LP", "cohort_date"])

# Week-over-week deltas (Week 4 = last 7 cohort days vs Week 3)
uf_full = raw["user_funnel"][raw["user_funnel"]["attributed_lp_name"].isin(sel_lps)]
w4_start = uf_full["cohort_date"].max() - pd.Timedelta(days=6)
w3_start = w4_start - pd.Timedelta(days=7)
uf_w4 = uf_full[uf_full["cohort_date"] >= w4_start]
uf_w3 = uf_full[(uf_full["cohort_date"] >= w3_start) & (uf_full["cohort_date"] < w4_start)]
lp_w4 = compute_lp_metrics(uf_w4)
lp_w3 = compute_lp_metrics(uf_w3)

def wow(metric: str, lp_w4=lp_w4, lp_w3=lp_w3) -> float | None:
    """Return aggregate WoW delta for a metric across selected LPs."""
    try:
        v4 = lp_w4[metric].mean()
        v3 = lp_w3[metric].mean()
        return float(v4 - v3) if v3 != 0 else None
    except Exception:
        return None

# ── Aggregate totals ──────────────────────────────────────────────────────────
tot_clicks   = int(uf_f["user_id"].nunique())
tot_installs = int(uf_f["installed_after_click"].sum())
tot_tries    = int(uf_f["tried_after_install"].sum())
act_cvr      = tot_tries / tot_clicks if tot_clicks else 0
dead_rate    = (tot_installs - tot_tries) / tot_installs if tot_installs else 0
install_cvr  = tot_installs / tot_clicks if tot_clicks else 0

# Context banner
date_label = (
    f"{d_start.strftime('%b %-d')}–{d_end.strftime('%b %-d, %Y')}"
    if d_start != pd.Timestamp(date_min) or d_end != pd.Timestamp(date_max)
    else "Full period: Feb 1–28, 2026"
)
lp_label = " · ".join(LP_MAP.get(l, l) for l in sel_lps)
st.markdown(
    f"<div style='background:#f8faf9; border:1px solid #dde4e1; border-radius:10px; "
    f"padding:10px 16px; font-size:12px; color:#5f6b7a; margin-bottom:12px;'>"
    f"<strong style='color:#1b2333'>Viewing:</strong> {date_label} &nbsp;·&nbsp; {lp_label}"
    f"</div>",
    unsafe_allow_html=True,
)

# ── Tabs ──────────────────────────────────────────────────────────────────────
tabs = st.tabs(["Overview", "LP Funnel", "Activation", "Growth Actions", "Methodology"])

# ═════════════════════════════════════════════════════════════════════════════
# TAB 1 — OVERVIEW
# ═════════════════════════════════════════════════════════════════════════════
with tabs[0]:
    st.markdown("#### Campaign KPIs")
    st.caption("User-level funnel · first-touch LP attribution · 7-day attribution window · WoW = Week 4 vs Week 3")

    # KPI strip
    c1, c2, c3, c4, c5, c6 = st.columns(6)
    c1.metric("LP CTA Click Users",  f"{tot_clicks:,}",
              help="Distinct users who clicked the LP install CTA. Not page renders.")
    c2.metric("Install Users",        f"{tot_installs:,}",
              f"{install_cvr:.1%} Install CVR",
              help="Users who installed after LP CTA click within 7 days.")
    c3.metric("Qualified Activated",  f"{tot_tries:,}",
              help="Click → install → try_grammarly, in order, within 7 days.")
    w = wow("activation_cvr")
    c4.metric("Activation CVR",       f"{act_cvr:.1%}",
              f"{w:+.1%} WoW" if w is not None else None,
              delta_color="normal",
              help="Try users / LP CTA click users. End-to-end campaign quality.")
    w2 = wow("dead_install_rate")
    c5.metric("Dead Install Rate",    f"{dead_rate:.1%}",
              f"{w2:+.1%} WoW" if w2 is not None else None,
              delta_color="inverse",
              help="Installed but never triggered try_grammarly within 7 days.")
    c6.metric("QA Issues",            "0 / 8",
              help="Selected automated checks on mock dataset — see Methodology tab.")

    st.divider()
    col_charts, col_insight = st.columns([3, 2])

    with col_charts:
        # Activation CVR bar
        fig = px.bar(
            lp_f, x="LP", y="activation_cvr", color="LP",
            color_discrete_map=COLOR_MAP,
            text=lp_f["activation_cvr"].map("{:.1%}".format),
            title="Activation CVR by LP",
            labels={"activation_cvr": "Activation CVR", "LP": ""},
        )
        fig.update_layout(showlegend=False, plot_bgcolor="white",
                          yaxis_tickformat=".0%", yaxis_range=[0, 0.30],
                          hoverlabel=TOOLTIP_CFG, margin=dict(t=40, b=20))
        fig.update_traces(textposition="outside", marker_line_width=0)
        st.plotly_chart(fig, use_container_width=True)

        # Repeat try rate bar
        fig2 = px.bar(
            lp_f, x="LP", y="repeat_try_rate", color="LP",
            color_discrete_map=COLOR_MAP,
            text=lp_f["repeat_try_rate"].map("{:.1%}".format),
            title="Repeat Try Rate — activated users who returned within 7 days",
            labels={"repeat_try_rate": "Repeat Try Rate", "LP": ""},
        )
        fig2.update_layout(showlegend=False, plot_bgcolor="white",
                           yaxis_tickformat=".0%", yaxis_range=[0, 1.0],
                           hoverlabel=TOOLTIP_CFG, margin=dict(t=40, b=20))
        fig2.update_traces(textposition="outside", marker_line_width=0)
        st.plotly_chart(fig2, use_container_width=True)

    with col_insight:
        st.markdown("##### Key findings")
        st.info(
            "**4.1pp activation gap** on near-identical volume.\n\n"
            "Academic Writing converts **22.6%** of clicks to "
            "`try_grammarly` vs **18.5%** for Business Emails. "
            "The aggregate gap holds across the month; daily cohorts vary."
        )
        st.warning(
            "**43–51% dead install rate** across both LPs. "
            "This is a post-install onboarding problem, "
            "not an LP acquisition problem."
        )
        st.success(
            "**Feature alignment is near-perfect.**\n\n"
            "99.7% of academic users → `academic_citation_helper`\n\n"
            "100% of business users → `smart_email_reply`\n\n"
            "The gap is in repeat behavior, not feature discovery."
        )
        st.markdown("##### Impact sizing")
        st.markdown(
            "If Business Emails matched Academic's **22.6%** Activation CVR, "
            "it would generate approximately **+66 additional activated users** "
            "from the same February traffic — a 22% lift at zero extra cost."
        )

# ═════════════════════════════════════════════════════════════════════════════
# TAB 2 — LP FUNNEL
# ═════════════════════════════════════════════════════════════════════════════
with tabs[1]:
    st.markdown("#### LP Funnel Analysis")

    col_a, col_b = st.columns(2)

    with col_a:
        # Horizontal funnel bar
        rows = []
        for _, r in lp_f.iterrows():
            for stage, val in [("LP CTA Clicks", r["lp_cta_click_users"]),
                                ("Installs",      r["install_users"]),
                                ("Try Grammarly", r["try_users"])]:
                rows.append({"LP": r["LP"], "Stage": stage, "Users": int(val)})
        fd = pd.DataFrame(rows)
        fig = px.bar(
            fd, x="Users", y="Stage", color="LP", barmode="group", orientation="h",
            color_discrete_map=COLOR_MAP, text="Users",
            title="Funnel Volume by LP",
            labels={"Users": "Unique Users", "Stage": ""},
            category_orders={"Stage": ["Try Grammarly", "Installs", "LP CTA Clicks"]},
        )
        fig.update_layout(plot_bgcolor="white", hoverlabel=TOOLTIP_CFG,
                          legend=dict(orientation="h", yanchor="bottom", y=1.02),
                          margin=dict(t=50, b=10))
        fig.update_traces(texttemplate="%{text:,}", textposition="outside")
        st.plotly_chart(fig, use_container_width=True)

    with col_b:
        # Traffic Quality Matrix
        med_x = lp_f["lp_cta_click_users"].median() if not lp_f.empty else 1600
        med_y = lp_f["activation_cvr"].median() if not lp_f.empty else 0.2
        fig = px.scatter(
            lp_f, x="lp_cta_click_users", y="activation_cvr",
            color="LP", color_discrete_map=COLOR_MAP, text="LP",
            title="Traffic Quality Matrix — Volume vs Activation CVR",
            labels={"lp_cta_click_users": "LP CTA Click Volume",
                    "activation_cvr": "Activation CVR", "LP": ""},
        )
        fig.add_hline(y=med_y, line_dash="dash", line_color="#94a3b8", line_width=1,
                      annotation_text=f"Median {med_y:.1%}", annotation_position="right")
        fig.add_vline(x=med_x, line_dash="dash", line_color="#94a3b8", line_width=1,
                      annotation_text="Median vol", annotation_position="top")
        fig.update_traces(marker_size=18, textposition="top center")
        fig.update_layout(showlegend=False, plot_bgcolor="white",
                          yaxis_tickformat=".1%", hoverlabel=TOOLTIP_CFG,
                          margin=dict(t=50, b=10))
        st.plotly_chart(fig, use_container_width=True)
        st.caption(
            "Both LPs have near-identical volume (1,596 vs 1,604 — an 8-user gap). "
            "The gap is entirely in activation quality."
        )

    # Full metrics table
    st.markdown("#### Full Metrics Comparison")
    if not lp_f.empty:
        display_cols = {
            "LP": "LP",
            "lp_cta_click_users":   "CTA Clicks",
            "install_users":         "Installs",
            "try_users":             "Try Users",
            "install_cvr":           "Install CVR",
            "activation_cvr":        "Activation CVR",
            "install_to_try_rate":   "Install→Try",
            "dead_install_rate":     "Dead Install",
            "repeat_try_rate":       "Repeat Try",
            "median_time_to_first_value_hours": "Time to Value (hrs)",
        }
        tbl = lp_f[[c for c in display_cols if c in lp_f.columns]].rename(columns=display_cols)
        rate_cols = ["Install CVR", "Activation CVR", "Install→Try", "Dead Install", "Repeat Try"]
        fmt = {c: "{:.1%}" for c in rate_cols}
        fmt.update({"CTA Clicks": "{:,.0f}", "Installs": "{:,.0f}",
                    "Try Users": "{:,.0f}", "Time to Value (hrs)": "{:.1f}"})
        good_cols = ["Activation CVR", "Install CVR", "Install→Try", "Repeat Try"]
        bad_cols  = ["Dead Install"]
        sty = tbl.style.format(fmt)
        if len(tbl) > 1:
            sty = sty.highlight_max(subset=[c for c in good_cols if c in tbl.columns], color="#eaf7f1")
            sty = sty.highlight_max(subset=[c for c in bad_cols  if c in tbl.columns], color="#fdf2e9")
        st.dataframe(sty, use_container_width=True, hide_index=True)

    # Cohort chart
    st.markdown("#### Cohort Activation CVR Over Time")
    st.caption(
        "% of each cohort day's clickers who reached try_grammarly within 7 days. "
        "Daily values vary — the trend matters more than individual days."
    )
    if not coh_f.empty:
        plot_df = coh_f.copy()
        if show_rolling:
            plot_df["Rolling 7-day avg"] = plot_df.groupby("LP")["activation_cvr"] \
                .transform(lambda x: x.rolling(7, min_periods=3).mean())

        fig = go.Figure()
        for lp_name, color in COLOR_MAP.items():
            sub = plot_df[plot_df["LP"] == lp_name]
            if sub.empty:
                continue
            fig.add_trace(go.Scatter(
                x=sub["cohort_date"], y=sub["activation_cvr"],
                name=lp_name, mode="lines+markers",
                line=dict(color=color, width=1.5),
                marker=dict(size=4), opacity=0.5,
                hovertemplate="%{x|%b %-d}<br>Activation CVR: %{y:.1%}<extra>" + lp_name + "</extra>",
            ))
            if show_rolling and "Rolling 7-day avg" in sub.columns:
                fig.add_trace(go.Scatter(
                    x=sub["cohort_date"], y=sub["Rolling 7-day avg"],
                    name=f"{lp_name} — 7d avg", mode="lines",
                    line=dict(color=color, width=2.5),
                    hovertemplate="%{x|%b %-d}<br>7-day avg: %{y:.1%}<extra>" + lp_name + "</extra>",
                ))
        fig.update_layout(
            plot_bgcolor="white", yaxis_tickformat=".0%",
            yaxis_range=[0, 0.45], hoverlabel=TOOLTIP_CFG,
            legend=dict(orientation="h", yanchor="bottom", y=1.02),
            xaxis_title="Cohort Date", yaxis_title="Activation CVR",
            margin=dict(t=20, b=20),
        )
        st.plotly_chart(fig, use_container_width=True)

# ═════════════════════════════════════════════════════════════════════════════
# TAB 3 — ACTIVATION
# ═════════════════════════════════════════════════════════════════════════════
with tabs[2]:
    st.markdown("#### Feature Activation & Engagement Quality")

    col_a, col_b = st.columns(2)

    with col_a:
        st.markdown("##### LP × Feature Matrix")
        st.caption("First product feature triggered after install — activated users only")

        features = ["academic_citation_helper", "smart_email_reply"]
        matrix_rows = []
        for lp_key in sel_lps:
            lp_label = LP_MAP.get(lp_key, lp_key)
            total = int(lp_f[lp_f["attributed_lp_name"] == lp_key]["try_users"].sum()) if not lp_f.empty else 0
            for feat in features:
                row = feat_f[(feat_f["attributed_lp_name"] == lp_key) &
                             (feat_f["first_product_feature"] == feat)]
                count = int(row["try_users"].sum()) if not row.empty else 0
                share = count / total if total > 0 else 0.0
                matrix_rows.append({"LP": lp_label, "Feature": feat,
                                     "Users": count, "Share": share})

        mdf = pd.DataFrame(matrix_rows)
        if not mdf.empty:
            pivot_z = mdf.pivot(index="LP", columns="Feature", values="Share").fillna(0)
            pivot_u = mdf.pivot(index="LP", columns="Feature", values="Users").fillna(0)
            fig = go.Figure(go.Heatmap(
                z=pivot_z.values,
                x=pivot_z.columns.tolist(),
                y=pivot_z.index.tolist(),
                colorscale=[[0, "#f4f6f5"], [0.5, "#a8dfc4"], [1, C["academic"]]],
                text=[[f"{int(pivot_u.at[r, c]):,} users · {pivot_z.at[r, c]:.1%}"
                       for c in pivot_z.columns] for r in pivot_z.index],
                texttemplate="%{text}",
                showscale=False,
                hovertemplate="%{y} → %{x}<br>%{text}<extra></extra>",
            ))
            fig.update_layout(
                title="Activated Users by LP × Feature",
                height=220, margin=dict(t=40, b=10, l=10, r=10),
                plot_bgcolor="white",
            )
            st.plotly_chart(fig, use_container_width=True)

        st.info(
            "Feature routing is near-perfect. "
            "The activation problem is not discovery — it is habit formation. "
            "Academic users return within 7 days (75.3% repeat try); "
            "business users do not (12.2%)."
        )

    with col_b:
        st.markdown("##### Activation Depth")
        fig = go.Figure()
        for _, r in lp_f.iterrows():
            color = C["academic"] if "academic" in str(r.get("attributed_lp_name", "")) else C["business"]
            fig.add_trace(go.Bar(
                name=r["LP"],
                x=["Dead Install Rate", "Repeat Try Rate"],
                y=[r["dead_install_rate"], r.get("repeat_try_rate", 0)],
                marker_color=color,
                text=[f"{r['dead_install_rate']:.1%}", f"{r.get('repeat_try_rate', 0):.1%}"],
                textposition="outside",
            ))
        fig.update_layout(
            barmode="group", plot_bgcolor="white",
            yaxis_tickformat=".0%", yaxis_range=[0, 1.0],
            title="Dead Install Rate vs Repeat Try Rate",
            hoverlabel=TOOLTIP_CFG,
            legend=dict(orientation="h", yanchor="bottom", y=1.02),
            margin=dict(t=50, b=20),
        )
        st.plotly_chart(fig, use_container_width=True)
        st.warning(
            "Business Emails: **50.6% dead install rate** and **12.2% repeat try rate**. "
            "Users reach `smart_email_reply` but do not build a habit. "
            "This points to post-install friction, not LP targeting."
        )

    # Daily volume
    st.divider()
    st.markdown("##### Daily Event Volume — February 2026")
    st.caption("Event-date view. Try events after Feb 28 are attribution window spill from late-February cohorts.")
    daily = raw["daily"].copy()
    action_labels = {
        "did_click_lp":         "LP CTA Clicks",
        "did_install_grammarly": "Installs",
        "try_grammarly":         "Try Grammarly",
    }
    daily["Action"] = daily["action"].map(action_labels)
    daily_agg = daily.groupby(["event_date", "Action"])["users"].sum().reset_index()
    fig = px.line(
        daily_agg, x="event_date", y="users", color="Action",
        color_discrete_map={
            "LP CTA Clicks": C["text"],
            "Installs":      C["business"],
            "Try Grammarly": C["academic"],
        },
        title="Daily Event Volume",
        labels={"event_date": "Date", "users": "Unique Users", "Action": ""},
    )
    fig.update_layout(plot_bgcolor="white", hoverlabel=TOOLTIP_CFG, margin=dict(t=40, b=20))
    st.plotly_chart(fig, use_container_width=True)

# ═════════════════════════════════════════════════════════════════════════════
# TAB 4 — GROWTH ACTIONS
# ═════════════════════════════════════════════════════════════════════════════
with tabs[3]:
    st.markdown("#### Growth Actions & Experiment Backlog")

    col_a, col_b = st.columns([3, 2])

    with col_a:
        st.markdown("##### Campaign Signals")
        action_map = {
            "Academic Writing": (
                C["academic"], "#eaf7f1",
                "Scale or create close variants. Strong Activation CVR (22.6%) and 6× "
                "repeat engagement vs Business Emails. Test budget expansion and lookalike audiences."
            ),
            "Business Emails": (
                C["warn"], "#fdf2e9",
                "Business Emails attracts relevant users — feature alignment is strong — "
                "but the post-install experience does not create repeat value. "
                "Diagnose the first-use and repeat-use loop for smart_email_reply. "
                "The 50.6% dead install rate and 12.2% repeat try rate indicate "
                "users are not building a habit after first use."
            ),
        }
        for lp_label in [LP_MAP.get(lp, lp) for lp in sel_lps]:
            if lp_label not in action_map:
                continue
            color, bg, text = action_map[lp_label]
            st.markdown(
                f"<div style='border-left:4px solid {color}; padding:14px 18px; "
                f"background:{bg}; border-radius:0 10px 10px 0; margin-bottom:12px;'>"
                f"<strong style='color:{color}'>{lp_label}</strong><br/>"
                f"<span style='font-size:13px; color:{C[\"muted\"]}; line-height:1.6'>{text}</span>"
                f"</div>",
                unsafe_allow_html=True,
            )

        st.success(
            "**Impact sizing:** If Business Emails matched Academic Writing's 22.6% Activation CVR, "
            "it would generate approximately **+66 additional activated users** from the same "
            "February traffic — a 22% lift at zero additional acquisition cost."
        )

        st.markdown("##### Experiment Backlog")
        exp_df = pd.DataFrame([
            {"Experiment":    "Academic LP budget scale test",
             "Hypothesis":    "Academic audience has stronger intent; scaling does not dilute activation quality",
             "Success Metric": "Activation CVR stays ≥ 22% while click volume increases"},
            {"Experiment":    "Business LP onboarding audit",
             "Hypothesis":    "Business users need a faster, more guided path to first email value",
             "Success Metric": "Dead install rate drops from 50.6% toward Academic benchmark (43%)"},
            {"Experiment":    "Business LP promise test",
             "Hypothesis":    "LP copy or targeting attracts users with weaker product-fit",
             "Success Metric": "Repeat try rate improves from 12.2% toward 40%+"},
            {"Experiment":    "Post-install nudge",
             "Hypothesis":    "Installed users who have not tried need a trigger (email or in-app)",
             "Success Metric": "Install→Try Rate improves; dead install rate falls"},
        ])
        st.dataframe(exp_df, use_container_width=True, hide_index=True)

    with col_b:
        st.markdown("##### Campaign Quality Score")
        st.caption("0.35 × Install CVR + 0.45 × Activation CVR + 0.20 × Install→Try Rate (normalized within dataset)")
        for _, r in lp_f.iterrows():
            # Recompute score relative to the filtered dataset
            denom_install = lp_f["install_cvr"].max() or 1
            denom_act     = lp_f["activation_cvr"].max() or 1
            denom_i2t     = lp_f["install_to_try_rate"].max() or 1
            score = (0.35 * r["install_cvr"] / denom_install +
                     0.45 * r["activation_cvr"] / denom_act +
                     0.20 * r["install_to_try_rate"] / denom_i2t)
            st.metric(label=r["LP"], value=f"{score:.2f}")
            st.progress(min(float(score), 1.0))

        st.divider()
        st.markdown("##### Funnel Drop-off")
        for _, r in lp_f.iterrows():
            color = C["academic"] if "academic" in str(r.get("attributed_lp_name", "")) else C["business"]
            st.markdown(f"**{r['LP']}**")
            step_data = pd.DataFrame({
                "Stage": ["LP CTA Clicks", "Installs", "Try Grammarly"],
                "Users": [int(r["lp_cta_click_users"]), int(r["install_users"]), int(r["try_users"])],
            })
            fig = px.funnel(step_data, x="Users", y="Stage",
                            color_discrete_sequence=[color])
            fig.update_layout(height=180, margin=dict(t=10, b=10, l=10, r=10),
                              showlegend=False, plot_bgcolor="white")
            st.plotly_chart(fig, use_container_width=True)

# ═════════════════════════════════════════════════════════════════════════════
# TAB 5 — METHODOLOGY
# ═════════════════════════════════════════════════════════════════════════════
with tabs[4]:
    st.markdown("#### Methodology, Metric Definitions & Data Quality")

    col_a, col_b = st.columns(2)

    with col_a:
        st.markdown("##### Methodology")
        st.markdown(
            "Metrics are calculated at the **user level**, not raw event level, "
            "to avoid overcounting repeated clicks, installs, or feature tries. "
            "For each user this dashboard uses the first LP CTA click, the first install "
            "after that click, and the first `try_grammarly` event after install. "
            "Activation requires the ordered sequence "
            "**LP CTA click → install → try_grammarly** within a 7-day attribution window. "
            "If a user clicked multiple LP CTAs, first-touch LP attribution is applied. "
            "`did_click_lp` is an install-button click — not a page render — "
            "so page-render CVR cannot be calculated from this dataset."
        )

        st.markdown("##### Metric Definitions")
        defs = pd.DataFrame([
            {"Metric": "LP CTA Click Users",
             "Formula": "DISTINCT users with did_click_lp",
             "Notes": "Install-button click, not page render"},
            {"Metric": "Install CVR",
             "Formula": "Install Users / LP CTA Click Users",
             "Notes": ""},
            {"Metric": "Activation CVR",
             "Formula": "Try Users / LP CTA Click Users",
             "Notes": "End-to-end campaign quality metric"},
            {"Metric": "Install → Try Rate",
             "Formula": "Try Users / Install Users",
             "Notes": "Isolates onboarding quality from LP quality"},
            {"Metric": "Dead Install Rate",
             "Formula": "(Installs − Tries) / Installs",
             "Notes": "Installed, never tried within 7 days"},
            {"Metric": "Repeat Try Rate",
             "Formula": "Users with 2+ try events / users with 1+",
             "Notes": "Within 7-day attribution window"},
            {"Metric": "Campaign Quality Score",
             "Formula": "0.35 × norm(Install CVR) + 0.45 × norm(Act CVR) + 0.20 × norm(I→T Rate)",
             "Notes": "Decision aid; normalized within the selected period"},
            {"Metric": "Attribution window",
             "Formula": "7 days from first LP CTA click per user",
             "Notes": "First-touch LP attribution for executive view"},
        ])
        st.dataframe(defs, use_container_width=True, hide_index=True)

        st.markdown("##### Data Limitations")
        st.error(
            "Cannot calculate without additional fields:\n\n"
            "- **CAC** — needs ad spend per LP\n"
            "- **ROAS** — needs spend + revenue events\n"
            "- **LTV** — needs subscription/upgrade events\n"
            "- **Ad CTR** — needs impression data\n"
            "- **Page-render CVR** — needs render events\n"
            "- **Retention beyond 7 days** — outside attribution window"
        )
        st.markdown("##### Next Instrumentation Priorities")
        st.markdown(
            "1. **Page render events** → enables LP page-render CVR\n"
            "2. **Ad spend per LP** → enables CAC and ROAS\n"
            "3. **Subscription events** → enables LTV and payback\n"
            "4. **Onboarding step events** between install and first try "
            "→ diagnose the 43–51% dead install cohort\n"
            "5. **Extend attribution to 14 and 30 days** "
            "→ capture slower business decision cycles"
        )

    with col_b:
        st.markdown("##### Data Quality Checks")
        st.caption(
            "Automated checks from `data_cleaning.py` · mock dataset · "
            "validate against production data before drawing quality conclusions."
        )
        qa = raw["qa"].copy()
        qa["Status"] = qa["flagged_rows"].apply(
            lambda x: "Passed" if x == 0 else f"{int(x)} flagged"
        )
        qa["Severity"] = qa["severity"].str.capitalize()
        qa_disp = qa[["check", "Severity", "flagged_rows", "Status", "explanation"]].rename(columns={
            "check": "Check", "flagged_rows": "Flagged Rows", "explanation": "Why It Matters"
        })
        def _qa_style(row):
            bg = "background-color: #eaf7f1" if row["Flagged Rows"] == 0 else "background-color: #fdf2e9"
            return [bg] * len(row)
        st.dataframe(
            qa_disp.style.apply(_qa_style, axis=1),
            use_container_width=True, hide_index=True,
        )
        st.info(
            "All 8 automated checks returned 0 flagged rows on this mock dataset. "
            "Selected checks passed — not a guarantee of perfect production data quality."
        )
