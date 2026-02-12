import os
import random
import streamlit as st

st.set_page_config(page_title="Able & Beyond – Life Skills Games", layout="centered")

# ========= BRAND COLOURS (change later) =========
PRIMARY = "#2F6BFF"
ACCENT  = "#19C37D"
BG      = "#F6F8FF"
TEXT    = "#0F172A"

# ---------- STYLE ----------
st.markdown(
    f"""
    <style>
      .stApp {{
        background: {BG};
      }}

      .ab-header {{
        background: linear-gradient(135deg, {PRIMARY}, #6A5CFF);
        padding: 18px 18px;
        border-radius: 16px;
        color: white;
        margin-bottom: 14px;
        box-shadow: 0 10px 30px rgba(15, 23, 42, 0.10);
      }}
      .ab-title {{
        font-size: 2.0rem;
        font-weight: 900;
        margin: 0;
        line-height: 1.15;
      }}
      .ab-sub {{
        margin: 6px 0 0 0;
        opacity: 0.92;
        font-size: 1.05rem;
      }}

      .card {{
        background: white;
        border: 2px solid rgba(15, 23, 42, 0.06);
        border-radius: 18px;
        padding: 14px 16px;
        box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
        margin-bottom: 12px;
      }}
      .big {{
        font-size: 1.25rem;
        font-weight: 900;
        color: {TEXT};
      }}
      .small {{
        font-size: 1rem;
        color: rgba(15, 23, 42, 0.72);
      }}

      div.stButton > button {{
        width: 100%;
        padding: 0.95rem 1rem;
        font-size: 1.05rem;
        font-weight: 900;
        border-radius: 14px;
        border: 0;
      }}

      div.stButton > button[kind="primary"] {{
        background: {PRIMARY};
        color: white;
      }}
      div.stButton > button[kind="primary"]:hover {{
        background: #2457D6;
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

# ---------- HEADER ----------
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

"""
    <div class='card'>
      <div class='small'>
        Designed for neurodiverse learners. Calm colours. Clear feedback. No overstimulation.
      </div>
    </div>
    """,
unsafe_allow_html=True,


st.markdown(
    "<div class='card'><div class='big'>Match the Socks 🧦</div>"
    "<div class='small'>Tap two socks to find a matching pair.</div></div>",
    unsafe_allow_html=True,
)

# ---------- LEVEL SELECT ----------
st.markdown(
    "<div class='card'><div class='big'>Choose difficulty</div>"
    "<div class='small'>Easy = 4 socks • Medium = 6 socks</div></div>",
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

# ---------- FUNCTIONS ----------
def reset_game():
    st.session_state.order = random.sample(SOCKS, k=len(SOCKS))
    st.session_state.first_pick = None
    st.session_state.matched = set()
    st.session_state.message = "New round! Tap a sock."

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
    if st.button("🔄 New game", type="primary"):
        reset_game()
with c2:
    if st.session_state.first_pick is None:
        if st.button("🎲 Mix socks"):
            reshuffle_unmatched()
    else:
        st.write("Find the match 👀")
with c3:
    st.markdown(
        f"<div class='card'><div class='big'>{st.session_state.message}</div></div>",
        unsafe_allow_html=True,
    )

# Progress
st.progress(len(st.session_state.matched) / len(st.session_state.order))

# ---------- GRID ----------
cols = st.columns(3)

for i, (fname, pid) in enumerate(st.session_state.order):
    col = cols[i % 3]

    if i in st.session_state.matched:
        with col:
            st.image(os.path.join(IMG_DIR, fname), use_container_width=True)
            st.success("Matched ✅")
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
                st.session_state.message = "Good — now find the matching sock."
            else:
                first_i, first_pid = st.session_state.first_pick
                if i == first_i:
                    st.session_state.message = "Pick a different sock."
                elif pid == first_pid:
                    st.session_state.matched.add(first_i)
                    st.session_state.matched.add(i)
                    st.session_state.message = "Great match! ⭐"
                else:
                    st.session_state.message = "Not a match — try again."
                st.session_state.first_pick = None
                reshuffle_unmatched()

# ---------- FINISH ----------
if len(st.session_state.matched) == len(st.session_state.order):
    st.balloons()
    st.success("All matched! Well done ⭐")
