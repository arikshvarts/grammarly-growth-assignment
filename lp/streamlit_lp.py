"""
Grammarly AI Humanizer — Interactive LP powered by Claude Haiku
Preview-first quiz: paste → AI preview → 3 questions → personalized rewrite → signup

API key: add ANTHROPIC_API_KEY to Streamlit secrets (Settings → Secrets)
         or set the ANTHROPIC_API_KEY environment variable locally.
         NEVER hardcode the key in this file.

Deploy:  streamlit run lp/streamlit_lp.py
         Or deploy as a second app on share.streamlit.io using this file as the entry point.

Cost:    Claude Haiku is the cheapest Anthropic model (~$0.001 per session).
         Prompt caching reduces system-prompt costs further on repeated calls.
         Note: Haiku 4.5 requires ≥4096 tokens to cache — the system prompt below
         is shorter, so cache_control is included for production-readiness but
         won't trigger at this scale. Add more context to hit the threshold.
"""

import html
import os

import anthropic
import streamlit as st

# ── Page config ───────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="Grammarly AI Humanizer",
    layout="centered",
    initial_sidebar_state="collapsed",
)

# ── Custom CSS (matches HTML LP brand palette) ────────────────────────────────
st.markdown(
    """
<style>
  #MainMenu, footer, header { visibility: hidden; }
  .main .block-container { max-width: 740px; padding-top: 1.5rem; padding-bottom: 4rem; }
  div[data-testid="stButton"] > button {
    border-radius: 12px; font-weight: 600; font-size: 14px;
    transition: all 0.15s; width: 100%; padding: 10px 18px;
  }
  div[data-testid="stTextArea"] textarea { border-radius: 12px; font-size: 15px; }
  div[data-testid="stLinkButton"] a {
    border-radius: 12px; font-weight: 700; font-size: 15px;
    background: #14a46c; color: white; border: none;
    padding: 14px 24px; display: block; text-align: center;
  }
  .stSpinner > div { border-top-color: #14a46c !important; }
</style>
""",
    unsafe_allow_html=True,
)

# ── Brand constants ───────────────────────────────────────────────────────────
GREEN = "#14a46c"
MUTED = "#5f6b7a"

# ── System prompt (attached with cache_control for cost efficiency) ───────────
SYSTEM_PROMPT = """You are Grammarly's AI writing assistant. Your role is to rewrite AI-generated text so it sounds more natural, clear, and authentic.

Strict rules:
- Preserve the complete original meaning — do not add, remove, or change ideas
- Improve naturalness, sentence rhythm, and clarity
- Reduce formulaic or robotic phrasing common in AI-generated writing
- Match the tone and use case context when provided
- Keep length within 20% of the original
- Return ONLY the rewritten text — no explanations, no preamble, no labels, no quotes around the output
- Do NOT use phrases like "undetectable", "bypass AI detectors", "pass AI checks", or "100% human"
- Focus on: natural voice, smoother sentence flow, preserved meaning, authentic tone

Use case context (apply when specified):
- Work email or report: clear, professional, readable; formal enough for the workplace
- Essay or application: precise, articulate, well-structured; appropriate for academic/formal contexts
- Marketing or social post: engaging, punchy, human-sounding; conversational where appropriate
- General writing: natural, clear, accessible

Tone adjustments (apply when specified):
- Natural: conversational and authentic — sounds like a real person wrote it
- Professional: clear and credible, slightly more formal
- Conversational: warm and approachable — friendly without being unprofessional
- Confident: assertive and direct — no hedging, no padding

Rewrite strength adjustments (apply when specified):
- Light polish: minimal changes — preserve most word choices and sentence structure, fix only awkward phrasing
- Balanced rewrite: noticeable improvements — rework sentences where needed, preserve core ideas and flow
- Stronger rewrite: significant improvements — restructure for clarity, vary sentence length, remove filler words"""


# ── Anthropic client (API key from secrets only — never hardcoded) ────────────
@st.cache_resource
def get_client() -> anthropic.Anthropic:
    """Load API key from Streamlit secrets or environment variable."""
    key = ""
    try:
        key = st.secrets.get("ANTHROPIC_API_KEY", "")
    except Exception:
        pass
    if not key:
        key = os.environ.get("ANTHROPIC_API_KEY", "")
    if not key:
        st.error(
            "**ANTHROPIC_API_KEY not configured.**\n\n"
            "- **Streamlit Cloud:** go to app Settings → Secrets and add "
            "`ANTHROPIC_API_KEY = 'sk-ant-...'`\n"
            "- **Local:** set the `ANTHROPIC_API_KEY` environment variable before running"
        )
        st.stop()
    return anthropic.Anthropic(api_key=key)


# ── Claude Haiku rewrite call ─────────────────────────────────────────────────
def call_claude(text: str, quiz: dict | None = None) -> str:
    """
    Call Claude Haiku to rewrite text.
    Uses prompt caching on the system prompt (ephemeral, 5-minute TTL).
    Two API calls max per user session: initial preview + personalized refinement.
    """
    client = get_client()

    user_parts = [f"Rewrite this text:\n\n{text}"]
    if quiz:
        user_parts.append(
            f"\nPersonalization:\n"
            f"- Use case: {quiz.get('use_case', 'general writing')}\n"
            f"- Tone: {quiz.get('tone', 'natural')}\n"
            f"- Rewrite strength: {quiz.get('strength', 'balanced rewrite')}"
        )

    response = client.messages.create(
        model="claude-haiku-4-5",
        max_tokens=500,
        system=[
            {
                "type": "text",
                "text": SYSTEM_PROMPT,
                "cache_control": {"type": "ephemeral"},  # 5-min cache on system prompt
            }
        ],
        messages=[{"role": "user", "content": "\n".join(user_parts)}],
    )
    return response.content[0].text.strip()


# ── Session state ─────────────────────────────────────────────────────────────
DEFAULTS: dict = {
    "stage": "paste",          # paste | preview | q2 | q3 | refined
    "text": "",
    "initial_rewrite": "",
    "quiz": {},
    "refined_rewrite": "",
}
for k, v in DEFAULTS.items():
    if k not in st.session_state:
        st.session_state[k] = v

# ── Sample texts ──────────────────────────────────────────────────────────────
SAMPLES = {
    "Essay intro": (
        "This essay will discuss how technology has changed communication in modern society. "
        "The internet has made it possible for people to communicate across the world. "
        "This is important because it allows for the sharing of information and ideas between different cultures."
    ),
    "Work email": (
        "I am writing to follow up on our previous conversation about the project timeline. "
        "I wanted to check in to see if there are any updates. "
        "Please let me know if you need any additional information from my side "
        "and I will be happy to provide it."
    ),
    "LinkedIn post": (
        "I am very excited to share that I have recently started a new position at a leading technology company. "
        "This role is focused on using AI to improve writing and communication across teams. "
        "I am looking forward to the challenges and opportunities ahead."
    ),
    "Job application": (
        "I am applying for this position because I believe I have the skills and experience that are needed for this role. "
        "I have worked in this field for several years and have developed strong abilities in the relevant areas."
    ),
}

# ── Voice profile lookup ──────────────────────────────────────────────────────
VOICE_MAP = {
    ("work", "professional"):     ["Clear", "Professional", "Polished"],
    ("work", "confident"):        ["Clear", "Confident", "Direct"],
    ("work", "natural"):          ["Clear", "Authentic", "Readable"],
    ("work", "conversational"):   ["Clear", "Approachable", "Warm"],
    ("essay", "professional"):    ["Precise", "Professional", "Articulate"],
    ("essay", "conversational"):  ["Precise", "Accessible", "Natural"],
    ("essay", "natural"):         ["Precise", "Natural", "Structured"],
    ("essay", "confident"):       ["Precise", "Confident", "Authoritative"],
    ("marketing", "confident"):   ["Engaging", "Confident", "Sharp"],
    ("marketing", "natural"):     ["Engaging", "Warm", "Readable"],
    ("marketing", "conversational"): ["Engaging", "Conversational", "Punchy"],
    ("marketing", "professional"): ["Engaging", "Professional", "Polished"],
    ("general", "natural"):       ["Clear", "Natural", "Authentic"],
    ("general", "professional"):  ["Clear", "Professional", "Readable"],
    ("general", "conversational"): ["Clear", "Warm", "Approachable"],
    ("general", "confident"):     ["Clear", "Confident", "Direct"],
}


def get_voice_tags(quiz: dict) -> list[str]:
    return VOICE_MAP.get(
        (quiz.get("use_case", ""), quiz.get("tone", "")),
        ["Clear", "Natural", "Authentic"],
    )


# ── UI helpers ────────────────────────────────────────────────────────────────
def render_before_after(original: str, rewritten: str, locked: bool = True) -> None:
    col_a, col_b = st.columns(2)
    orig_esc = html.escape(original[:600])
    rewrit_esc = html.escape(rewritten[:600])
    with col_a:
        st.markdown(
            f"<div style='background:#fdfbf6; border:1px solid #e8e2d5; "
            f"border-radius:12px; padding:14px; min-height:120px;'>"
            f"<div style='font-size:10px; font-weight:700; text-transform:uppercase; "
            f"letter-spacing:0.6px; color:{MUTED}; margin-bottom:8px;'>Original</div>"
            f"<div style='font-size:13px; line-height:1.7; color:#1b2333;'>{orig_esc}</div>"
            f"</div>",
            unsafe_allow_html=True,
        )
    with col_b:
        fade = (
            "<div style='position:absolute; bottom:0; left:0; right:0; height:56px; "
            "background:linear-gradient(transparent,#f0faf5); border-radius:0 0 12px 12px;'></div>"
            if locked
            else ""
        )
        st.markdown(
            f"<div style='background:#f0faf5; border:1px solid #c5e8d8; border-radius:12px; "
            f"padding:14px; min-height:120px; position:relative; overflow:hidden;'>"
            f"<div style='font-size:10px; font-weight:700; text-transform:uppercase; "
            f"letter-spacing:0.6px; color:{MUTED}; margin-bottom:8px;'>Grammarly suggestion</div>"
            f"<div style='font-size:13px; line-height:1.7; color:#1b2333;'>{rewrit_esc}</div>"
            f"{fade}</div>",
            unsafe_allow_html=True,
        )


def render_improvements(quiz: dict | None = None) -> None:
    items = [
        ("More natural phrasing", "Reduced robotic sentence patterns"),
        ("Smoother flow", "Better rhythm and transitions"),
        ("Meaning preserved", "Your ideas stay intact"),
    ]
    tone_labels = {
        "professional": "Professional, credible tone",
        "conversational": "Warm, approachable tone",
        "confident": "Confident, direct tone",
        "natural": "Authentic, natural tone",
    }
    if quiz:
        items.append((tone_labels.get(quiz.get("tone", ""), "Tone matched"), "Matched to your preference"))
    else:
        items.append(("Tone matched", "Writing feels more like you"))

    cols = st.columns(2)
    for i, (title, sub) in enumerate(items):
        with cols[i % 2]:
            st.markdown(
                f"<div style='background:#eaf7f1; border-radius:10px; padding:10px 12px; margin-bottom:8px;'>"
                f"<div style='font-size:12px; font-weight:600; color:#1b2333;'>✓ {title}</div>"
                f"<div style='font-size:11px; color:{MUTED}; margin-top:2px;'>{sub}</div>"
                f"</div>",
                unsafe_allow_html=True,
            )


def render_voice_profile(quiz: dict) -> None:
    tags = get_voice_tags(quiz)
    pills = "".join(
        f"<span style='background:#ede8fb; color:#6b4bb5; font-size:12px; font-weight:600; "
        f"padding:5px 12px; border-radius:999px; margin-right:6px;'>{t}</span>"
        for t in tags
    )
    st.markdown(
        f"<div style='background:#f6f2ff; border:1px solid #ddd4f7; border-radius:10px; "
        f"padding:12px 16px; margin-top:12px; display:flex; align-items:center; gap:12px;'>"
        f"<span style='font-size:10px; font-weight:700; text-transform:uppercase; "
        f"letter-spacing:0.5px; color:#7c5cbf; white-space:nowrap;'>Your voice</span>"
        f"{pills}</div>",
        unsafe_allow_html=True,
    )


def divider() -> None:
    st.markdown(
        "<hr style='margin:18px 0; border:none; border-top:1px solid #dde4e1;'>",
        unsafe_allow_html=True,
    )


# ═══════════════════════════════════════════════════════════════════════════════
# HEADER (always visible)
# ═══════════════════════════════════════════════════════════════════════════════
st.markdown(
    f"<div style='text-align:center; margin-bottom:4px;'>"
    f"<span style='font-size:22px; font-weight:800; color:#1b2333; letter-spacing:-0.4px;'>"
    f"<span style='color:{GREEN}'>Grammarly</span> AI Humanizer</span></div>",
    unsafe_allow_html=True,
)

# ═══════════════════════════════════════════════════════════════════════════════
# STAGE: PASTE
# ═══════════════════════════════════════════════════════════════════════════════
if st.session_state["stage"] == "paste":
    st.markdown(
        f"<h1 style='font-size:30px; font-weight:800; text-align:center; line-height:1.12; "
        f"letter-spacing:-0.5px; margin:10px 0;'>"
        f"Make AI writing sound natural<br>and true to your voice</h1>"
        f"<p style='text-align:center; color:{MUTED}; font-size:15px; margin-bottom:22px;'>"
        f"Paste your text and preview a clearer, more natural version — free.<br>"
        f"Then personalize in three quick questions.</p>",
        unsafe_allow_html=True,
    )

    text_val = st.text_area(
        "Your text",
        value=st.session_state["text"],
        placeholder="Paste AI-assisted writing here...",
        height=160,
        label_visibility="collapsed",
        key="text_input",
    )
    st.session_state["text"] = text_val

    st.markdown(
        f"<div style='font-size:12px; color:{MUTED}; margin-bottom:6px;'>Or try a sample:</div>",
        unsafe_allow_html=True,
    )
    chip_cols = st.columns(len(SAMPLES))
    for col, (label, sample) in zip(chip_cols, SAMPLES.items()):
        with col:
            if st.button(label, key=f"chip_{label}"):
                st.session_state["text"] = sample
                st.rerun()

    st.markdown("<br>", unsafe_allow_html=True)

    if st.button("Preview my rewrite →", type="primary"):
        if not st.session_state["text"].strip():
            st.warning("Paste some text first, or try a sample above.")
        else:
            with st.spinner("Generating your preview…"):
                try:
                    st.session_state["initial_rewrite"] = call_claude(st.session_state["text"])
                    st.session_state["stage"] = "preview"
                    st.session_state["quiz"] = {}
                    st.session_state["refined_rewrite"] = ""
                    st.rerun()
                except anthropic.AuthenticationError:
                    st.error("Invalid API key. Check your Streamlit secrets configuration.")
                except anthropic.RateLimitError:
                    st.error("Rate limit reached. Please wait a moment and try again.")
                except Exception as e:
                    st.error(f"Rewrite failed: {e}")

    st.markdown(
        f"<div style='text-align:center; font-size:12px; color:#94a3b8; margin-top:8px;'>"
        f"Free preview. No credit card required.</div>",
        unsafe_allow_html=True,
    )

# ═══════════════════════════════════════════════════════════════════════════════
# STAGES: PREVIEW → Q2 → Q3 → REFINED
# ═══════════════════════════════════════════════════════════════════════════════
elif st.session_state["stage"] in ("preview", "q2", "q3", "refined"):
    stage = st.session_state["stage"]

    if st.button("← Start over", key="restart"):
        for k, v in DEFAULTS.items():
            st.session_state[k] = v
        st.rerun()

    divider()

    # Section label
    pill_color = "#6b4bb5" if stage == "refined" else GREEN
    pill_label = "Personalized" if stage == "refined" else "Preview"
    section_title = "Your personalized rewrite" if stage == "refined" else "Here's a more natural version"
    st.markdown(
        f"<div style='font-size:10px; font-weight:700; text-transform:uppercase; "
        f"letter-spacing:0.6px; color:{pill_color}; margin-bottom:6px;'>{pill_label}</div>"
        f"<div style='font-size:18px; font-weight:700; margin-bottom:14px;'>{section_title}</div>",
        unsafe_allow_html=True,
    )

    # Before/after
    rewrite_shown = st.session_state.get("refined_rewrite") or st.session_state["initial_rewrite"]
    render_before_after(st.session_state["text"], rewrite_shown, locked=(stage != "refined"))

    st.markdown("<br>", unsafe_allow_html=True)
    render_improvements(st.session_state["quiz"] if stage == "refined" else None)

    if stage == "refined":
        render_voice_profile(st.session_state["quiz"])

    # ── Q1 ─────────────────────────────────────────────────────────────────────
    if stage == "preview":
        divider()
        st.markdown(
            f"<div style='font-size:11px; font-weight:700; text-transform:uppercase; "
            f"letter-spacing:0.6px; color:{GREEN};'>Personalize your rewrite — 1 of 3</div>",
            unsafe_allow_html=True,
        )
        st.markdown("**Where will you use this?**")
        c1, c2 = st.columns(2)
        q1_opts = {
            "Work email or report":    "work",
            "Essay or application":    "essay",
            "Marketing or social post": "marketing",
            "General writing":         "general",
        }
        for i, (label, val) in enumerate(q1_opts.items()):
            with (c1 if i % 2 == 0 else c2):
                if st.button(label, key=f"q1_{val}"):
                    st.session_state["quiz"]["use_case"] = val
                    st.session_state["stage"] = "q2"
                    st.rerun()

    # ── Q2 ─────────────────────────────────────────────────────────────────────
    elif stage == "q2":
        divider()
        st.markdown(
            f"<div style='font-size:11px; font-weight:700; text-transform:uppercase; "
            f"letter-spacing:0.6px; color:{GREEN};'>Personalize your rewrite — 2 of 3</div>",
            unsafe_allow_html=True,
        )
        st.markdown("**How should it sound?**")
        c1, c2 = st.columns(2)
        q2_opts = {
            "Natural":        "natural",
            "Professional":   "professional",
            "Conversational": "conversational",
            "Confident":      "confident",
        }
        for i, (label, val) in enumerate(q2_opts.items()):
            with (c1 if i % 2 == 0 else c2):
                if st.button(label, key=f"q2_{val}"):
                    st.session_state["quiz"]["tone"] = val
                    st.session_state["stage"] = "q3"
                    st.rerun()

    # ── Q3 ─────────────────────────────────────────────────────────────────────
    elif stage == "q3":
        divider()
        st.markdown(
            f"<div style='font-size:11px; font-weight:700; text-transform:uppercase; "
            f"letter-spacing:0.6px; color:{GREEN};'>Personalize your rewrite — 3 of 3</div>",
            unsafe_allow_html=True,
        )
        st.markdown("**How much should Grammarly change?**")
        c1, c2, c3 = st.columns(3)
        q3_opts = [
            ("Light polish",     "light polish"),
            ("Balanced rewrite", "balanced rewrite"),
            ("Stronger rewrite", "stronger rewrite"),
        ]
        for col, (label, val) in zip([c1, c2, c3], q3_opts):
            with col:
                if st.button(label, key=f"q3_{val.replace(' ', '_')}"):
                    st.session_state["quiz"]["strength"] = val
                    with st.spinner("Personalizing your rewrite…"):
                        try:
                            st.session_state["refined_rewrite"] = call_claude(
                                st.session_state["text"],
                                quiz=st.session_state["quiz"],
                            )
                            st.session_state["stage"] = "refined"
                            st.rerun()
                        except anthropic.AuthenticationError:
                            st.error("Invalid API key. Check your Streamlit secrets configuration.")
                        except anthropic.RateLimitError:
                            st.error("Rate limit reached. Please wait a moment and try again.")
                        except Exception as e:
                            st.error(f"Rewrite failed: {e}")

    # ── Unlock card ─────────────────────────────────────────────────────────────
    if stage == "refined":
        st.markdown(
            f"<div style='background:white; border:2px solid {GREEN}; border-radius:16px; "
            f"padding:28px 24px; text-align:center; margin-top:20px; "
            f"box-shadow:0 4px 24px rgba(20,164,108,0.12);'>"
            f"<div style='font-size:28px; margin-bottom:10px;'>✦</div>"
            f"<div style='font-size:22px; font-weight:800; margin-bottom:8px;'>"
            f"Your full rewrite is ready</div>"
            f"<div style='font-size:15px; color:{MUTED}; margin-bottom:24px; line-height:1.6;'>"
            f"You've seen the preview. Create a free account to copy the full rewrite, "
            f"save your voice settings, and keep editing your tone.</div>",
            unsafe_allow_html=True,
        )
        _, mid, _ = st.columns([1, 2, 1])
        with mid:
            st.link_button(
                "Create free account to copy full rewrite",
                "https://www.grammarly.com/signup",
                use_container_width=True,
            )
        st.markdown(
            f"<div style='text-align:center; font-size:12px; color:{MUTED}; "
            f"margin-top:8px; margin-bottom:24px;'>No credit card required.</div>"
            f"<div style='border-top:1px solid #dde4e1; padding-top:18px; text-align:center;'>"
            f"<div style='font-size:13px; font-weight:600; color:{MUTED}; margin-bottom:12px;'>"
            f"Humanize and polish text anywhere you write</div>"
            + "".join(
                f"<span style='display:inline-block; background:#f2f5f3; "
                f"border:1px solid #dde4e1; border-radius:999px; padding:6px 14px; "
                f"font-size:12px; color:{MUTED}; margin:3px;'>{p}</span>"
                for p in ["Gmail", "Google Docs", "LinkedIn", "ChatGPT", "Work documents"]
            )
            + "</div></div>",
            unsafe_allow_html=True,
        )

        if st.button("Keep editing preview", key="keep_editing"):
            st.session_state["stage"] = "preview"
            st.session_state["refined_rewrite"] = ""
            st.session_state["quiz"] = {}
            st.rerun()
