import os
import random
import streamlit as st

st.set_page_config(page_title="Able & Beyond - Life Skills Lab", layout="centered")

# ---------- NAV STATE ----------
PAGES = ["Home", "Visual Matching (Socks)"]
if "page" not in st.session_state:
    st.session_state.page = "Home"

# ---------- SIDEBAR NAV (DESKTOP) ----------
if st.session_state.page == "Home":
    st.sidebar.markdown("## Activities")
    st.session_state.page = st.sidebar.radio(
        "Choose an activity",
        PAGES,
        index=PAGES.index(st.session_state.page),
        label_visibility="collapsed",
    )

# ========= BRAND COLOURS (Able & Beyond) =========
PRIMARY = "#C97C5D"   # terracotta
ACCENT  = "#A8BFA3"   # sage green
BG      = "#F5F2ED"   # warm neutral
TEXT    = "#2F2F2F"
CARD    = "#FFFFFF"

# ---------- STYLE ----------
st.markdown(
    f"""
    <style>
    .stApp {{
        background: {BG};
        max-width: 900px;
        margin: auto;
    }}

    .ab-header {{
        background: {CARD};
        padding: 28px 26px;
        border-radius: 18px;
        margin-bottom: 20px;
        text-align: center;
        border: 1px solid rgba(0,0,0,0.05);
    }}

    .ab-title {{
        font-size: 2.2rem;
        font-weight: 800;
        color: {PRIMARY};
        margin-bottom: 6px;
    }}

    .ab-sub {{
        font-size: 1.05rem;
        color: {TEXT};
        opacity: 0.85;
    }}

    .card {{
        background: {CARD};
        border-radius: 16px;
        padding: 18px;
        margin-bottom: 14px;
        border: 1px solid rgba(0,0,0,0.05);
        text-align: center;
    }}

    .big {{
        font-size: 1.25rem;
        font-weight: 700;
        color: {TEXT};
    }}

    .small {{
        font-size: 0.95rem;
        color: {TEXT};
        opacity: 0.7;
    }}

    /* Bigger touch targets */
    div.stButton > button {{
        width: 100%;
        min-height: 3.2rem;
        font-size: 1.05rem;
        background: {ACCENT};
        color: {TEXT};
        border-radius: 12px;
        font-weight: 700;
        border: none;
        padding: 0.75rem 1rem;
    }}

    div.stButton > button:hover {{
        background: {PRIMARY};
        color: white;
    }}

    div[data-testid="stProgress"] > div > div > div > div {{
        background-color: {ACCENT};
    }}
    </style>
    """,
    unsafe_allow_html=True,
)

BASE_DIR = os.path.dirname(__file__)
IMG_DIR = os.path.join(BASE_DIR, "images")


def render_header():
    st.markdown(
        "<div class='small'>Part of the Able & Beyond therapeutic learning tools</div>",
        unsafe_allow_html=True,
    )
    st.markdown(
        """
        <div class="ab-header">
          <div class="ab-title">Able & Beyond - Life Skills Lab</div>
          <div class="ab-sub">
            Play-based tools designed to support focus, emotional regulation, and independent thinking.
          </div>
        </div>
        """,
        unsafe_allow_html=True,
    )


def render_intro_card():
    st.markdown(
        """
        <div class='card'>
          <div class='small'>
            Designed for neurodiverse learners. Calm colours. Clear feedback. No overstimulation.
          </div>
        </div>
        """,
        unsafe_allow_html=True,
    )


# ---------- HOME ----------
if st.session_state.page == "Home":
    render_header()
    render_intro_card()

    st.markdown(
        """
        <div class='card'>
          <div class='big'>Start an activity</div>
          <div class='small'>Choose a calm activity below.</div>
        </div>
        """,
        unsafe_allow_html=True,
    )

    # BIG THERAPEUTIC BUTTON
    if st.button("Visual Matching 🧦"):
        st.session_state.page = "Visual Matching (Socks)"
        st.rerun()

    st.markdown(
        """
        <div class='card'>
          <div class='small'>
            More activities coming soon.
          </div>
        </div>
        """,
        unsafe_allow_html=True,
    )


# ---------- VISUAL MATCHING (SOCKS) ----------
elif st.session_state.page == "Visual Matching (Socks)":

    col1, col2 = st.columns([1, 4])

    with col1:
        if st.button("← Home"):
            st.session_state.page = "Home"
            st.rerun()

    with col2:
        st.markdown(
            "<div class='small' style='padding-top:8px;'>Visual Matching</div>",
            unsafe_allow_html=True,
        )

    render_header()
    render_intro_card()


    # Back button (mobile friendly)
    if st.button("← Back to Home"):
        st.session_state.page = "Home"
        st.rerun()

    st.markdown(
        "<div class='card'>"
        "<div class='big'>Visual Matching Activity 🧦</div>"
        "<div class='small'>Supports attention, visual scanning, and working memory.</div>"
        "</div>",
        unsafe_allow_html=True,
    )

    level = st.radio(
        "Difficulty",
        ["Easy (4 socks)", "Medium (6 socks)"],
        horizontal=True,
        key="sock_level",
    )

    pair_ids = ["A", "B"] if level.startswith("Easy") else ["A", "B", "C"]

    PAIRS = {
        "A": [("sock_a1.png", "A"), ("sock_a2.png", "A")],
        "B": [("sock_b1.png", "B"), ("sock_b2.png", "B")],
        "C": [("sock_c1.png", "C"), ("sock_c2.png", "C")],
    }

    SOCKS = []
    for pid in pair_ids:
        SOCKS.extend(PAIRS[pid])

    def reset_game():
        st.session_state.order = random.sample(SOCKS, k=len(SOCKS))
        st.session_state.first_pick = None
        st.session_state.matched = set()
        st.session_state.message = "New round. Tap a sock."

    def reshuffle_unmatched():
        unmatched = []
        for i, item in enumerate(st.session_state.order):
            if i not in st.session_state.matched:
                unmatched.append(item)
        random.shuffle(unmatched)

        new_order = []
        u = 0
        for i in range(len(st.session_state.order)):
            if i in st.session_state.matched:
                new_order.append(st.session_state.order[i])
            else:
                new_order.append(unmatched[u])
                u += 1
        st.session_state.order = new_order

    # ---------- STATE ----------
    if "order" not in st.session_state:
        st.session_state.order = random.sample(SOCKS, k=len(SOCKS))
    if "first_pick" not in st.session_state:
        st.session_state.first_pick = None
    if "matched" not in st.session_state:
        st.session_state.matched = set()
    if "message" not in st.session_state:
        st.session_state.message = "Tap a sock to start."

    # Reset game if level changes
    if "level" not in st.session_state:
        st.session_state.level = level
    if st.session_state.level != level:
        st.session_state.level = level
        reset_game()

    # ---------- CONTROLS ----------
    c1, c2, c3 = st.columns(3)
    with c1:
        if st.button("New round", type="primary"):
            reset_game()
    with c2:
        if st.session_state.first_pick is None:
            if st.button("Mix socks"):
                reshuffle_unmatched()
        else:
            st.write("Find the pair")
    with c3:
        st.markdown(
            f"<div class='card'><div class='big'>{st.session_state.message}</div></div>",
            unsafe_allow_html=True,
        )

    st.progress(len(st.session_state.matched) / len(st.session_state.order))

    # ---------- GRID ----------
    cols = st.columns(3)

    for i, (fname, pid) in enumerate(st.session_state.order):
        col = cols[i % 3]

        if i in st.session_state.matched:
            with col:
                st.image(os.path.join(IMG_DIR, fname), use_container_width=True)
                st.success("Paired ✓")
            continue

        with col:
            img_path = os.path.join(IMG_DIR, fname)
            if os.path.exists(img_path):
                st.image(img_path, use_container_width=True)
            else:
                st.error(f"Missing image: {fname}")

            if st.button("Tap", key=f"pick_{i}"):
                if st.session_state.first_pick is None:
                    st.session_state.first_pick = (i, pid)
                    st.session_state.message = "Good. Now find the matching sock."
                else:
                    first_i, first_pid = st.session_state.first_pick
                    if i == first_i:
                        st.session_state.message = "Pick a different sock."
                    elif pid == first_pid:
                        st.session_state.matched.add(first_i)
                        st.session_state.matched.add(i)
                        st.session_state.message = "That’s a pair. Well spotted."
                    else:
                        st.session_state.message = "Not the same yet. Try again."
                    st.session_state.first_pick = None
                    reshuffle_unmatched()

    if len(st.session_state.matched) == len(st.session_state.order):
        st.balloons()
        st.success("All pairs found. Well done.")
