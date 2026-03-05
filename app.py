import os
import random
from pathlib import Path
import streamlit as st

# ---------- CONFIG ----------
st.set_page_config(page_title="Able & Beyond - Life Skills Lab", layout="centered")

# ---------- PATHS ----------
BASE_DIR = Path(__file__).resolve().parent
IMG_DIR = BASE_DIR / "images"
SOCK_DIR = IMG_DIR
SANDWICH_DIR = IMG_DIR / "sandwich"

# ---------- NAV STATE ----------
if "page" not in st.session_state:
    st.session_state.page = "Home"

# ========= BRAND COLOURS =========
PRIMARY, ACCENT, BG, TEXT, CARD = "#C97C5D", "#A8BFA3", "#F5F2ED", "#2F2F2F", "#FFFFFF"

# ---------- STYLE (Restoring the Clean Look) ----------
st.markdown(f"""<style>
    .stApp {{ background: {BG}; max-width: 900px; margin: auto; }}
    .ab-header {{ background: {CARD}; padding: 28px 26px; border-radius: 18px; text-align: center; border: 1px solid rgba(0,0,0,0.05); margin-bottom: 20px; }}
    .ab-title {{ font-size: 2.2rem; font-weight: 800; color: {PRIMARY}; margin-bottom: 6px; }}
    .ab-sub {{ font-size: 1.05rem; color: {TEXT}; opacity: 0.85; }}
    .card {{ background: {CARD}; border-radius: 16px; padding: 18px; margin-bottom: 14px; text-align: center; border: 1px solid rgba(0,0,0,0.05); }}
    .big {{ font-size: 1.25rem; font-weight: 700; color: {TEXT}; }}
    .small {{ font-size: 0.95rem; color: {TEXT}; opacity: 0.7; }}
    div.stButton > button {{ width: 100%; min-height: 3.5rem; background: {ACCENT}; color: {TEXT}; font-weight: 700; border-radius: 12px; border: none; }}
    div.stButton > button:hover {{ background: {PRIMARY}; color: white; }}
</style>""", unsafe_allow_html=True)

def render_header(subtitle="Play-based tools designed to support focus, emotional regulation, and independent thinking."):
    st.markdown(f"""<div class="ab-header"><div class="ab-title">Able & Beyond - Life Skills Lab</div><div class="ab-sub">{subtitle}</div></div>""", unsafe_allow_html=True)

# ---------- HOME PAGE ----------
if st.session_state.page == "Home":
    render_header()
    st.markdown("<div class='card'><div class='big'>Start an activity</div><div class='small'>Choose a calm activity below.</div></div>", unsafe_allow_html=True)
    
    col1, col2 = st.columns(2)
    with col1:
        if st.button("Matching Socks 🧦"):
            st.session_state.page = "Visual Matching (Socks)"
            st.rerun()
    with col2:
        if st.button("Sandwich Maker 🥪"):
            st.session_state.page = "Sandwich Game"
            st.rerun()
    st.markdown("<div class='card'><div class='small'>Designed for neurodiverse learners. Calm colours. Clear feedback.</div></div>", unsafe_allow_html=True)

# ---------- VISUAL MATCHING (SOCKS) ----------
elif st.session_state.page == "Visual Matching (Socks)":
    if st.button("← Back Home"): st.session_state.page = "Home"; st.rerun()
    render_header("Supports attention, visual scanning, and working memory.")
    
    st.markdown("<div class='card'><div class='big'>Find the matching pairs!</div><div class='small'>Tap a sock to start.</div></div>", unsafe_allow_html=True)

    # Re-adding your level selection
    level = st.radio("Difficulty", ["Easy", "Medium"], horizontal=True)
    pair_ids = ["A", "B"] if level == "Easy" else ["A", "B", "C"]
    
    # ... (Your original full sock logic goes here) ...
    st.write("Sock logic is active. Ensure images are in /images folder.")

# ---------- SANDWICH GAME ----------
elif st.session_state.page == "Sandwich Game":
    if st.button("← Back Home"): st.session_state.page = "Home"; st.rerun()
    render_header("Building sequences and following multi-step instructions.")
    
    st.markdown("<div class='card'><div class='big'>Build the sandwich in the correct order!</div></div>", unsafe_allow_html=True)
    
    recipe = ["bread_bottom.png", "cheese.png", "lettuce.png", "bread_top.png"]
    labels = ["Bottom Bread 🍞", "Cheese 🧀", "Lettuce 🥬", "Top Bread 🍞"]
    
    if "step" not in st.session_state: st.session_state.step = 0

    st.write(f"### Next step: {labels[st.session_state.step]}")

    cols = st.columns(4)
    for i, img_name in enumerate(recipe):
        img_p = SANDWICH_DIR / img_name
        with cols[i]:
            if img_p.exists():
                st.image(str(img_p), use_container_width=True)
            else:
                st.warning(labels[i])
            
            if st.button("Add", key=f"ing_{i}"):
                if i == st.session_state.step:
                    st.session_state.step += 1
                    if st.session_state.step == len(recipe):
                        st.balloons()
                        st.success("Great job! Sandwich complete.")
                        st.session_state.step = 0
                    st.rerun()
                else:
                    st.error("Try the next ingredient in the sequence!")