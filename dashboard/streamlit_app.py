"""
Grammarly Campaign Performance Dashboard — Streamlit app
Run: streamlit run dashboard/streamlit_app.py
Deploy: https://share.streamlit.io (connect GitHub repo, set main file to dashboard/streamlit_app.py)
"""
import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from pathlib import Path

# ── Page config ─────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="Grammarly Campaign Dashboard",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ── Brand colours ────────────────────────────────────────────────────────────
C = {
    "academic": "#14a46c",
    "business": "#3d7dd4",
    "warn":     "#e2813a",
    "muted":    "#5f6b7a",
    "bg":       "#f4f6f5",
}

LP_MAP = {
    "lp_academic_writing": "Academic Writing",
    "lp_business_emails":  "Business Emails",
}
COLOR_MAP = {"Academic Writing": C["academic"], "Business Emails": C["business"]}

TOOLTIP_STYLE = dict(
    bgcolor="#1b2333", font_color="white",
    bordercolor="#1b2333", font_size=12,
)

# ── Data loading ─────────────────────────────────────────────────────────────
OUTPUT = Path(__file__).parent / "output"

@st.cache_data
def load():
    return {
        "lp":      pd.read_csv(OUTPUT / "lp_funnel_metrics.csv"),
        "feature": pd.read_csv(OUTPUT / "feature_metrics.csv"),
        "daily":   pd.read_csv(OUTPUT / "daily_event_metrics.csv"),
        "cohort":  pd.read_csv(OUTPUT / "cohort_metrics.csv"),
        "growth":  pd.read_csv(OUTPUT / "growth_actions.csv"),
        "qa":      pd.read_csv(OUTPUT / "qa_summary.csv"),
    }

raw = load()

# ── Sidebar ──────────────────────────────────────────────────────────────────
with st.sidebar:
    st.markdown("## 📊 Grammarly Campaigns")
    st.caption("Feb 2026 · 2 LPs · 3,200 users")
    st.divider()

    all_lps = raw["lp"]["attributed_lp_name"].dropna().tolist()
    sel_lps = st.multiselect(
        "Landing Page",
        options=all_lps,
        default=all_lps,
        format_func=lambda x: LP_MAP.get(x, x),
    )
    if not sel_lps:
        sel_lps = all_lps

    if st.button("↺ Reset filters", use_container_width=True):
        st.rerun()

    st.divider()
    st.markdown("**Grain:** user-level (not raw events)")
    st.markdown("**Attribution:** first-touch LP, 7-day window")
    st.markdown("**`did_click_lp`:** install-button click — not page render")
    st.divider()
    st.caption("Source: `data_cleaning.py` · mock dataset · Feb 2026")

# ── Filter data ───────────────────────────────────────────────────────────────
lp_f = raw["lp"][raw["lp"]["attributed_lp_name"].isin(sel_lps)].copy()
lp_f["LP"] = lp_f["attributed_lp_name"].map(LP_MAP)

feat_f = raw["feature"][raw["feature"]["attributed_lp_name"].isin(sel_lps)].copy()
feat_f["LP"] = feat_f["attributed_lp_name"].map(LP_MAP)

coh_f = raw["cohort"][raw["cohort"]["attributed_lp_name"].isin(sel_lps)].copy()
coh_f["LP"] = coh_f["attributed_lp_name"].map(LP_MAP)
coh_f["cohort_date"] = pd.to_datetime(coh_f["cohort_date"])

# ── Tabs ──────────────────────────────────────────────────────────────────────
t1, t2, t3, t4, t5 = st.tabs([
    "📊  Overview",
    "🔍  LP Funnel",
    "⚡  Activation",
    "🎯  Growth Actions",
    "📋  Methodology & QA",
])

# ═══════════════════════════════════════════════════════════════════════════════
# TAB 1 — OVERVIEW
# ═══════════════════════════════════════════════════════════════════════════════
with t1:
    st.markdown("### Executive Overview")
    st.caption("Aggregate metrics across selected LPs · user-level funnel · 7-day attribution window")

    # KPI row
    tot_clicks   = int(lp_f["lp_cta_click_users"].sum())
    tot_installs = int(lp_f["install_users"].sum())
    tot_tries    = int(lp_f["try_users"].sum())
    act_cvr      = tot_tries / tot_clicks if tot_clicks else 0
    dead_rate    = (tot_installs - tot_tries) / tot_installs if tot_installs else 0
    install_cvr  = tot_installs / tot_clicks if tot_clicks else 0

    c1, c2, c3, c4, c5, c6 = st.columns(6)
    c1.metric("LP CTA Clicks",      f"{tot_clicks:,}",    help="Distinct users who clicked the LP install CTA (not page renders)")
    c2.metric("Install Users",       f"{tot_installs:,}",  f"{install_cvr:.1%} Install CVR")
    c3.metric("Qualified Activated", f"{tot_tries:,}",     help="click → install → try within 7 days")
    c4.metric("Activation CVR",      f"{act_cvr:.1%}",    help="Try users / LP CTA click users — end-to-end quality")
    c5.metric("Dead Install Rate",   f"{dead_rate:.1%}",
              delta=f"↑ concern" if dead_rate > 0.43 else None,
              delta_color="inverse",
              help="Installed but never triggered try_grammarly within 7 days")
    c6.metric("QA Issues", "0 / 8", help="Selected automated checks on mock dataset — see Methodology tab")

    st.divider()

    col_left, col_right = st.columns([3, 2])

    with col_left:
        # Activation CVR comparison
        fig = px.bar(
            lp_f, x="LP", y="activation_cvr", color="LP",
            color_discrete_map=COLOR_MAP,
            text=lp_f["activation_cvr"].map("{:.1%}".format),
            title="Activation CVR by LP  (click → install → try_grammarly)",
            labels={"activation_cvr": "Activation CVR", "LP": ""},
        )
        fig.update_layout(showlegend=False, plot_bgcolor="white",
                          yaxis_tickformat=".0%", yaxis_range=[0, 0.30],
                          hoverlabel=TOOLTIP_STYLE)
        fig.update_traces(textposition="outside")
        st.plotly_chart(fig, use_container_width=True)

        # Repeat try rate comparison
        fig2 = px.bar(
            lp_f, x="LP", y="repeat_try_rate", color="LP",
            color_discrete_map=COLOR_MAP,
            text=lp_f["repeat_try_rate"].map("{:.1%}".format),
            title="Repeat Try Rate  (activated users who returned within 7 days)",
            labels={"repeat_try_rate": "Repeat Try Rate", "LP": ""},
        )
        fig2.update_layout(showlegend=False, plot_bgcolor="white",
                           yaxis_tickformat=".0%", yaxis_range=[0, 1.0],
                           hoverlabel=TOOLTIP_STYLE)
        fig2.update_traces(textposition="outside")
        st.plotly_chart(fig2, use_container_width=True)

    with col_right:
        st.markdown("#### Key Findings")
        st.info(
            "**4.1pp activation gap** on near-identical traffic.\n\n"
            "Academic Writing converts **22.6%** of clicks to `try_grammarly` "
            "vs **18.5%** for Business Emails.\n\n"
            "The aggregate gap holds across the month, though daily cohorts vary."
        )
        st.warning(
            "**43–51% dead install rate** shared across both LPs.\n\n"
            "This is a post-install activation problem, not an LP acquisition problem."
        )
        st.success(
            "**Feature alignment is near-perfect.**\n\n"
            "99.7% of academic users → `academic_citation_helper`\n\n"
            "100% of business users → `smart_email_reply`\n\n"
            "The issue is repeat behavior, not feature discovery."
        )
        st.markdown("#### Impact Sizing")
        st.markdown(
            "> If Business Emails matched Academic's **22.6% Activation CVR**, "
            "it would generate approximately **+66 additional activated users** "
            "from the same February traffic — a 22% lift at zero extra acquisition cost."
        )


# ═══════════════════════════════════════════════════════════════════════════════
# TAB 2 — LP FUNNEL
# ═══════════════════════════════════════════════════════════════════════════════
with t2:
    st.markdown("### LP Funnel Analysis")

    col_a, col_b = st.columns(2)

    with col_a:
        # Horizontal funnel bar
        funnel_rows = []
        for _, r in lp_f.iterrows():
            for stage, val in [
                ("LP CTA Clicks", r["lp_cta_click_users"]),
                ("Installs", r["install_users"]),
                ("Try Grammarly", r["try_users"]),
            ]:
                funnel_rows.append({"LP": r["LP"], "Stage": stage, "Users": val})
        fd = pd.DataFrame(funnel_rows)

        fig = px.bar(
            fd, x="Users", y="Stage", color="LP", barmode="group", orientation="h",
            color_discrete_map=COLOR_MAP, text="Users",
            title="Funnel Volume by LP",
            labels={"Users": "Unique Users", "Stage": ""},
            category_orders={"Stage": ["Try Grammarly", "Installs", "LP CTA Clicks"]},
        )
        fig.update_layout(plot_bgcolor="white", hoverlabel=TOOLTIP_STYLE,
                          legend=dict(orientation="h", yanchor="bottom", y=1.02))
        fig.update_traces(texttemplate="%{text:,}", textposition="outside")
        st.plotly_chart(fig, use_container_width=True)

    with col_b:
        # Traffic Quality Matrix
        med_x = lp_f["lp_cta_click_users"].median()
        med_y = lp_f["activation_cvr"].median()

        fig = px.scatter(
            lp_f, x="lp_cta_click_users", y="activation_cvr",
            color="LP", color_discrete_map=COLOR_MAP, text="LP",
            title="Traffic Quality Matrix — Volume vs Activation CVR",
            labels={"lp_cta_click_users": "LP CTA Click Volume",
                    "activation_cvr": "Activation CVR", "LP": ""},
        )
        fig.add_hline(y=med_y, line_dash="dash", line_color="gray",
                      annotation_text=f"Median {med_y:.1%}", annotation_position="right")
        fig.add_vline(x=med_x, line_dash="dash", line_color="gray",
                      annotation_text="Median vol", annotation_position="top")
        fig.update_traces(marker_size=18, textposition="top center")
        fig.update_layout(showlegend=False, plot_bgcolor="white",
                          yaxis_tickformat=".1%",
                          xaxis_range=[1570, 1630], yaxis_range=[0.14, 0.27],
                          hoverlabel=TOOLTIP_STYLE)
        st.plotly_chart(fig, use_container_width=True)
        st.caption(
            "Both LPs have near-identical volume (1,596 vs 1,604 — an 8-user gap). "
            "The matrix shows the gap is entirely in activation quality."
        )

    # Full metrics table
    st.markdown("#### Full Metrics Comparison")
    display = lp_f[[
        "LP", "lp_cta_click_users", "install_users", "try_users",
        "install_cvr", "activation_cvr", "install_to_try_rate",
        "dead_install_rate", "repeat_try_rate",
        "median_time_to_first_value_hours", "campaign_quality_score",
    ]].rename(columns={
        "lp_cta_click_users": "CTA Clicks",
        "install_users": "Installs",
        "try_users": "Try Users",
        "install_cvr": "Install CVR",
        "activation_cvr": "Activation CVR",
        "install_to_try_rate": "Install→Try",
        "dead_install_rate": "Dead Install",
        "repeat_try_rate": "Repeat Try",
        "median_time_to_first_value_hours": "Time to Value (hrs)",
        "campaign_quality_score": "Quality Score",
    })

    rate_cols = ["Install CVR", "Activation CVR", "Install→Try", "Dead Install", "Repeat Try"]
    fmt = {c: "{:.1%}" for c in rate_cols}
    fmt.update({"CTA Clicks": "{:,.0f}", "Installs": "{:,.0f}",
                "Try Users": "{:,.0f}", "Time to Value (hrs)": "{:.1f}",
                "Quality Score": "{:.2f}"})

    st.dataframe(
        display.style
            .format(fmt)
            .highlight_max(subset=["Activation CVR", "Install CVR", "Install→Try", "Repeat Try", "Quality Score"],
                           color="#eaf7f1")
            .highlight_max(subset=["Dead Install"], color="#fdf2e9"),
        use_container_width=True,
        hide_index=True,
    )

    # Cohort chart
    st.markdown("#### Cohort Activation CVR Over Time")
    st.caption("% of each day's clickers who reached try_grammarly within 7 days · daily cohorts vary naturally")

    fig = px.line(
        coh_f.sort_values("cohort_date"),
        x="cohort_date", y="activation_cvr", color="LP",
        color_discrete_map=COLOR_MAP, markers=True,
        title="Daily Cohort Activation CVR",
        labels={"cohort_date": "Cohort Date", "activation_cvr": "Activation CVR", "LP": ""},
    )
    # Dotted average lines
    for lp_name, color in COLOR_MAP.items():
        subset = coh_f[coh_f["LP"] == lp_name]
        if not subset.empty:
            avg = subset["activation_cvr"].mean()
            fig.add_hline(y=avg, line_dash="dot", line_color=color,
                          line_width=1.5, opacity=0.6,
                          annotation_text=f"{lp_name} avg {avg:.1%}",
                          annotation_position="left")
    fig.update_layout(plot_bgcolor="white", yaxis_tickformat=".0%",
                      yaxis_range=[0, 0.40], hoverlabel=TOOLTIP_STYLE)
    st.plotly_chart(fig, use_container_width=True)


# ═══════════════════════════════════════════════════════════════════════════════
# TAB 3 — ACTIVATION
# ═══════════════════════════════════════════════════════════════════════════════
with t3:
    st.markdown("### Feature Activation & Engagement Quality")

    col_a, col_b = st.columns(2)

    with col_a:
        st.markdown("#### LP × Feature Matrix")
        st.caption("First product feature triggered after install — activated users only")

        features = ["academic_citation_helper", "smart_email_reply"]
        matrix_rows = []
        for lp_key in sel_lps:
            lp_label = LP_MAP.get(lp_key, lp_key)
            total = lp_f[lp_f["LP"] == lp_label]["try_users"].sum()
            for feat in features:
                row = feat_f[(feat_f["attributed_lp_name"] == lp_key) &
                             (feat_f["first_product_feature"] == feat)]
                count = int(row["try_users"].sum()) if not row.empty else 0
                share = count / total if total > 0 else 0
                matrix_rows.append({"LP": lp_label, "Feature": feat,
                                     "Users": count, "Share": share,
                                     "Label": f"{count:,}\n{share:.1%}"})

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
                hovertemplate="%{y}<br>%{x}<br>%{text}<extra></extra>",
            ))
            fig.update_layout(
                title="LP × Feature Activation Heatmap",
                height=220, margin=dict(t=40, b=10, l=10, r=10),
                plot_bgcolor="white",
            )
            st.plotly_chart(fig, use_container_width=True)

        st.info(
            "Feature routing is near-perfect. The problem is not discovery — "
            "it is habit formation. Academic users return (75.3% repeat try); "
            "business users do not (12.2% repeat try)."
        )

    with col_b:
        st.markdown("#### Activation Depth — Dead Install vs Repeat Try")

        fig = go.Figure()
        for _, r in lp_f.iterrows():
            color = C["academic"] if "academic" in r["attributed_lp_name"] else C["business"]
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
            hoverlabel=TOOLTIP_STYLE,
            legend=dict(orientation="h", yanchor="bottom", y=1.02),
        )
        st.plotly_chart(fig, use_container_width=True)

        st.warning(
            "Business Emails LP: **50.6% dead install rate** and only **12.2% repeat try rate**. "
            "Users reach `smart_email_reply` but do not build a habit — "
            "pointing to post-install onboarding friction, not an LP targeting problem."
        )

    # Daily volume
    st.divider()
    st.markdown("#### Daily Event Volume — February 2026")
    st.caption("Event-date view. Try events after Feb 28 are attribution window spill from late-February cohorts.")

    daily = raw["daily"].copy()
    daily["event_date"] = pd.to_datetime(daily["event_date"])
    action_labels = {
        "did_click_lp": "LP CTA Clicks",
        "did_install_grammarly": "Installs",
        "try_grammarly": "Try Grammarly",
    }
    daily["Action"] = daily["action"].map(action_labels)
    daily_agg = daily.groupby(["event_date", "Action"])["users"].sum().reset_index()

    fig = px.line(
        daily_agg, x="event_date", y="users", color="Action",
        color_discrete_map={
            "LP CTA Clicks": "#1b2333",
            "Installs": C["business"],
            "Try Grammarly": C["academic"],
        },
        title="Daily Event Volume",
        labels={"event_date": "Date", "users": "Unique Users", "Action": ""},
        markers=False,
    )
    fig.update_layout(plot_bgcolor="white", hoverlabel=TOOLTIP_STYLE)
    st.plotly_chart(fig, use_container_width=True)


# ═══════════════════════════════════════════════════════════════════════════════
# TAB 4 — GROWTH ACTIONS
# ═══════════════════════════════════════════════════════════════════════════════
with t4:
    st.markdown("### Growth Actions & Experiment Backlog")

    col_a, col_b = st.columns([3, 2])

    with col_a:
        st.markdown("#### Campaign Signals")

        action_texts = {
            "Academic Writing": (
                C["academic"],
                "Scale or create close variants. Strong Activation CVR (22.6%) and 6× repeat "
                "engagement vs Business Emails. Test budget expansion and audience lookalikes."
            ),
            "Business Emails": (
                C["warn"],
                "Business Emails attracts relevant users — feature alignment is strong — but the "
                "post-install experience does not create repeat value. Diagnose the first-use and "
                "repeat-use loop for smart_email_reply. The 50.6% dead install rate and 12.2% "
                "repeat try rate suggest users are not building a habit after first use."
            ),
        }

        for lp_label in [LP_MAP.get(lp, lp) for lp in sel_lps]:
            if lp_label not in action_texts:
                continue
            color, text = action_texts[lp_label]
            bg = "#eaf7f1" if color == C["academic"] else "#fdf2e9"
            st.markdown(
                f"""<div style="border-left:4px solid {color}; padding:14px 18px;
                background:{bg}; border-radius:0 10px 10px 0; margin-bottom:12px;">
                <strong style="color:{color}; font-size:14px;">{lp_label}</strong><br/>
                <span style="font-size:13px; color:#5f6b7a; line-height:1.6">{text}</span>
                </div>""",
                unsafe_allow_html=True,
            )

        st.success(
            "**Impact sizing:** If Business Emails matched Academic Writing's 22.6% Activation CVR, "
            "it would generate approximately **+66 additional activated users** from the same "
            "February traffic — a 22% lift at zero additional acquisition cost."
        )

        st.markdown("#### Experiment Backlog")
        exp_df = pd.DataFrame([
            {
                "Experiment": "Academic LP budget scale test",
                "Hypothesis": "Academic audience has stronger intent; scaling does not dilute activation quality",
                "Success Metric": "Activation CVR stays ≥ 22% while click volume increases",
            },
            {
                "Experiment": "Business LP onboarding audit",
                "Hypothesis": "Business users need a faster, more guided path to first email value",
                "Success Metric": "Dead install rate drops from 50.6% toward Academic benchmark (43%)",
            },
            {
                "Experiment": "Business LP promise test",
                "Hypothesis": "LP copy or targeting attracts users with weaker product-fit",
                "Success Metric": "Repeat try rate improves from 12.2% toward 40%+",
            },
            {
                "Experiment": "Post-install nudge / re-engagement",
                "Hypothesis": "Installed users who have not tried need a trigger (email, in-app prompt)",
                "Success Metric": "Install→Try Rate improves; dead install rate falls",
            },
        ])
        st.dataframe(exp_df, use_container_width=True, hide_index=True)

    with col_b:
        st.markdown("#### Campaign Quality Scores")
        st.caption("Composite: 35% Install CVR + 45% Activation CVR + 20% Install→Try Rate (normalized)")

        for _, r in lp_f.iterrows():
            score = r["campaign_quality_score"]
            delta_str = f"{score - 0.87:.2f} vs benchmark" if r["LP"] == "Academic Writing" else None
            st.metric(label=r["LP"], value=f"{score:.2f} / 1.00", delta=delta_str)
            st.progress(float(score))

        st.divider()
        st.markdown("#### Funnel Drop-off Summary")

        for _, r in lp_f.iterrows():
            color = C["academic"] if "academic" in r["attributed_lp_name"] else C["business"]
            st.markdown(f"**{r['LP']}**")
            step_data = pd.DataFrame({
                "Stage": ["LP CTA Clicks", "Installs", "Try Grammarly"],
                "Users": [r["lp_cta_click_users"], r["install_users"], r["try_users"]],
            })
            fig = px.funnel(step_data, x="Users", y="Stage",
                            color_discrete_sequence=[color])
            fig.update_layout(height=180, margin=dict(t=10, b=10, l=10, r=10),
                              showlegend=False, plot_bgcolor="white")
            st.plotly_chart(fig, use_container_width=True)


# ═══════════════════════════════════════════════════════════════════════════════
# TAB 5 — METHODOLOGY & QA
# ═══════════════════════════════════════════════════════════════════════════════
with t5:
    st.markdown("### Methodology, Metric Definitions & Data Quality")

    col_a, col_b = st.columns(2)

    with col_a:
        st.markdown("#### Methodology")
        st.markdown(
            "Metrics are calculated at the **user level**, not raw event level, to avoid "
            "overcounting repeated clicks, installs, or feature tries. For each user, this "
            "dashboard uses the first LP CTA click, the first install after that click, and "
            "the first `try_grammarly` event after install. Activation requires the ordered "
            "sequence **LP CTA click → install → try_grammarly** within a 7-day attribution "
            "window. If a user clicked multiple LP CTAs, first-touch LP attribution is applied. "
            "`did_click_lp` is an install-button click — not a page render — so page-render CVR "
            "cannot be calculated from this dataset."
        )

        st.markdown("#### Metric Definitions")
        defs = pd.DataFrame([
            {"Metric": "LP CTA Click Users",     "Formula": "DISTINCT users with did_click_lp",                          "Notes": "Install-button click, not page render"},
            {"Metric": "Install CVR",             "Formula": "Install Users / LP CTA Click Users",                       "Notes": ""},
            {"Metric": "Activation CVR",          "Formula": "Try Users / LP CTA Click Users",                          "Notes": "End-to-end campaign quality metric"},
            {"Metric": "Install → Try Rate",      "Formula": "Try Users / Install Users",                               "Notes": "Isolates onboarding quality from LP quality"},
            {"Metric": "Dead Install Rate",       "Formula": "(Installs − Tries) / Installs",                           "Notes": "Installed, never tried within 7 days"},
            {"Metric": "Repeat Try Rate",         "Formula": "Users with 2+ try events / users with 1+ try events",    "Notes": "Within 7-day attribution window"},
            {"Metric": "Campaign Quality Score",  "Formula": "0.35×norm(Install CVR) + 0.45×norm(Act CVR) + 0.20×norm(I→T Rate)", "Notes": "Decision aid only; normalized within dataset"},
            {"Metric": "Attribution window",      "Formula": "7 days from first LP CTA click per user",                "Notes": "First-touch LP attribution for executive view"},
        ])
        st.dataframe(defs, use_container_width=True, hide_index=True)

        st.markdown("#### Data Limitations")
        st.error(
            "**Cannot calculate without additional fields:**\n\n"
            "- **CAC** — needs ad spend per LP\n"
            "- **ROAS** — needs spend + revenue events\n"
            "- **LTV** — needs subscription/upgrade events\n"
            "- **Ad CTR** — needs impression data\n"
            "- **Page-render CVR** — needs render events\n"
            "- **Retention > 7 days** — outside attribution window"
        )
        st.markdown("#### Next Instrumentation Priorities")
        st.markdown(
            "1. **Page render events** → enables LP page-render CVR\n"
            "2. **Ad spend per LP** → enables CAC and ROAS\n"
            "3. **Subscription events** → enables LTV and payback\n"
            "4. **Onboarding step events** between install and first try → "
            "diagnose the 43–51% dead install cohort\n"
            "5. **Extend attribution to 14/30 days** → capture slower business-use decision cycles"
        )

    with col_b:
        st.markdown("#### Data Quality Checks")
        st.caption(
            "Selected automated checks from `data_cleaning.py` · mock dataset · "
            "validate against production data before drawing quality conclusions."
        )

        qa = raw["qa"].copy()
        qa["Status"] = qa["flagged_rows"].apply(
            lambda x: "✅ Passed" if x == 0 else f"⚠️ {int(x)} flagged"
        )
        qa["Severity"] = qa["severity"].str.capitalize()
        qa_display = qa[["check", "Severity", "flagged_rows", "Status", "explanation"]].rename(columns={
            "check": "Check", "flagged_rows": "Flagged Rows", "explanation": "Why It Matters"
        })

        def color_rows(row):
            bg = "background-color: #eaf7f1" if row["Flagged Rows"] == 0 else "background-color: #fdf2e9"
            return [bg] * len(row)

        st.dataframe(
            qa_display.style.apply(color_rows, axis=1),
            use_container_width=True,
            hide_index=True,
        )

        st.info(
            "All 8 automated checks returned 0 flagged rows. "
            "This reflects the mock nature of the dataset — selected checks passed, "
            "not a guarantee of perfect production data quality."
        )
