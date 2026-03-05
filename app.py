import os
import random
from pathlib import Path
import streamlit as st

# ---------- CONFIG ----------
st.set_page_config(page_title="Able & Beyond - Life Skills Lab", layout="centered")

# ---------- PATHS ----------
BASE_DIR = Path(__file__).resolve().parent
IMG_DIR = BASE_DIR / "images"
SANDWICH_IMG_DIR = IMG_DIR / "sandwich"

# ---------- NAV STATE ----------
if "page" not in st.session_state:
    st.session_state.page = "Home"

# ========= BRAND COLOURS =========
PRIMARY, ACCENT, BG, TEXT, CARD = "#C97C5D", "#A8BFA3", "#F5F2ED", "#2F2F2F", "#FFFFFF"

# ---------- STYLE ----------
st.markdown(f"""<style>
    .stApp {{ background: {BG}; max-width: 900px; margin: auto; }}
    .ab-header {{ background: {CARD}; padding: 20px; border-radius: 18px; text-align: center; border: 1px solid rgba(0,0,0,0.05); }}
    .ab-title {{ font-size: 2rem; font-weight: 800; color: {PRIMARY}; }}
    .card {{ background: {CARD}; border-radius: 16px; padding: 15px; margin-bottom: 10px; text-align: center; border: 1px solid rgba(0,0,0,0.05); }}
    div.stButton > button {{ width: 100%; min-height: 3.5rem; background: {ACCENT}; font-weight: 700; border-radius: 12px; border: none; }}
    div.stButton > button:hover {{ background: {PRIMARY}; color: white; }}
</style>""", unsafe_allow_html=True)

def render_header(subtitle):
    st.markdown(f'<div class="ab-header"><div class="ab-title">Able & Beyond</div><div>{subtitle}</div></div>', unsafe_allow_html=True)

# ---------- HOME PAGE ----------
if st.session_state.page == "Home":
    render_header("Life Skills Lab")
    st.markdown("<div class='card'><h3>Choose an Activity</h3></div>", unsafe_allow_html=True)
    
    col1, col2 = st.columns(2)
    with col1:
        if st.button("Matching Socks 🧦"):
            st.session_state.page = "Visual Matching (Socks)"
            st.rerun()
    with col2:
        if st.button("Sandwich Maker 🥪"):
            st.session_state.page = "Sandwich Game"
            st.rerun()

# ---------- VISUAL MATCHING (SOCKS) ----------
elif st.session_state.page == "Visual Matching (Socks)":
    if st.button("← Back Home"): st.session_state.page = "Home"; st.rerun()
    render_header("Sock Matching")
    
    # ... (Keep your existing Sock Game Logic here) ...
    st.info("Your existing sock game logic is active here.")
    if st.button("Play Socks"): st.write("Socks Game Logic Running...")

# ---------- SANDWICH GAME ----------
elif st.session_state.page == "Sandwich Game":
    if st.button("← Back Home"): st.session_state.page = "Home"; st.rerun()
    render_header("Sandwich Maker")
    
    st.markdown("<div class='card'>Build the sandwich in the correct order!</div>", unsafe_allow_html=True)
    
    recipe = ["Bottom Bread 🍞", "Cheese 🧀", "Lettuce 🥬", "Top Bread 🍞"]
    
    if "sandwich_step" not in st.session_state:
        st.session_state.sandwich_step = 0

    current_target = recipe[st.session_state.sandwich_step]
    
    st.subheader(f"Next step: {current_target}")
    
    # Displaying ingredients as buttons
    cols = st.columns(4)
    ingredients = ["Bottom Bread 🍞", "Lettuce 🥬", "Cheese 🧀", "Top Bread 🍞"]
    
    for i, ing in enumerate(ingredients):
        if cols[i].button(ing):
            if ing == current_target:
                st.session_state.sandwich_step += 1
                if st.session_state.sandwich_step == len(recipe):
                    st.balloons()
                    st.success("Sandwich Complete! 🥪")
                    st.session_state.sandwich_step = 0
                st.rerun()
            else:
                st.error("Oops! That's not the next ingredient.")