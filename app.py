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

# ---------- GAME STATES ----------
if "sock_matched" not in st.session_state:
    st.session_state.sock_matched = []
if "sandwich_step" not in st.session_state:
    st.session_state.sandwich_step = 0
if "sock_cards" not in st.session_state:
    st.session_state.sock_cards = []
if "sock_attempts" not in st.session_state:
    st.session_state.sock_attempts = 0
if "sock_selected" not in st.session_state:
    st.session_state.sock_selected = None

# ========= BRAND COLOURS =========
PRIMARY, ACCENT, BG, TEXT, CARD = "#C97C5D", "#A8BFA3", "#F5F2ED", "#2F2F2F", "#FFFFFF"

# ---------- STYLE ----------
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
            st.session_state.page = "Socks"
            st.session_state.sock_matched = []
            st.session_state.sock_attempts = 0
            st.session_state.sock_cards = []
            st.session_state.sock_selected = None
            st.rerun()
    with col2:
        if st.button("Sandwich Maker 🥪"):
            st.session_state.page = "Sandwich"
            st.session_state.sandwich_step = 0
            st.rerun()
    st.markdown("<div class='card'><div class='small'>Designed for neurodiverse learners. Calm colours. Clear feedback.</div></div>", unsafe_allow_html=True)

# ---------- SOCKS GAME ----------
elif st.session_state.page == "Socks":
    if st.button("← Back Home"): 
        st.session_state.page = "Home"
        st.rerun()
    render_header("Supports attention, visual scanning, and working memory.")
    
    st.markdown("<div class='card'><div class='big'>Find the matching pairs!</div><div class='small'>Click on TWO matching socks to pair them up.</div></div>", unsafe_allow_html=True)

    level = st.radio("Difficulty", ["Easy (4 cards)", "Medium (6 cards)"], horizontal=True, key="difficulty")
    
    # Setup socks
    if level == "Easy (4 cards)":
        sock_types = ["a", "b"]
    else:
        sock_types = ["a", "b", "c"]
    
    # Create pairs
    cards = []
    for sock in sock_types:
        cards.append(f"sock_{sock}1.png")
        cards.append(f"sock_{sock}2.png")
    
    # Shuffle once
    if not st.session_state.sock_cards or len(st.session_state.sock_cards) != len(cards):
        random.shuffle(cards)
        st.session_state.sock_cards = cards
    
    cards = st.session_state.sock_cards
    
    # Show message if one card selected
    if st.session_state.sock_selected is not None:
        current_selected = st.session_state.sock_selected
        current_type = cards[current_selected].split('_')[1][0]
        st.info(f"You selected Sock {current_type.upper()} - now find the other {current_type.upper()}!")
    
    # Show attempts
    pairs_found = len(st.session_state.sock_matched) // 2
    total_pairs = len(cards) // 2
    st.write(f"Pairs found: {pairs_found} of {total_pairs}")
    
    # Create grid - ALL CARDS VISIBLE
    cols = st.columns(3)
    for i, card_file in enumerate(cards):
        with cols[i % 3]:
            # Already matched - show faded
            if i in st.session_state.sock_matched:
                img_path = SOCK_DIR / card_file
                if img_path.exists():
                    st.image(str(img_path), width=120)
                st.success("✓ Paired!")
            
            # Currently selected - highlight
            elif st.session_state.sock_selected == i:
                img_path = SOCK_DIR / card_file
                if img_path.exists():
                    st.image(str(img_path), width=120)
                st.warning("👆 Selected")
                if st.button("Cancel", key=f"cancel_{i}"):
                    st.session_state.sock_selected = None
                    st.rerun()
            
            # Not matched - show image and clickable button
            else:
                img_path = SOCK_DIR / card_file
                if img_path.exists():
                    st.image(str(img_path), width=120)
                else:
                    st.error("Missing")
                
                # Get sock type
                sock_type = card_file.split('_')[1][0]
                
                # Click to select or match
                if st.button(f"Select {sock_type.upper()}", key=f"select_{i}"):
                    if st.session_state.sock_selected is None:
                        # First selection
                        st.session_state.sock_selected = i
                        st.rerun()
                    else:
                        # Second selection - check if match
                        first_idx = st.session_state.sock_selected
                        first_card = cards[first_idx]
                        first_type = first_card.split('_')[1][0]
                        
                        current_card = cards[i]
                        current_type = current_card.split('_')[1][0]
                        
                        if first_type == current_type and first_idx != i:
                            # Match!
                            st.session_state.sock_matched.extend([first_idx, i])
                            st.session_state.sock_selected = None
                            st.session_state.sock_attempts += 1
                            st.rerun()
                        else:
                            # Not a match
                            st.session_state.sock_selected = None
                            st.error("Not a match! Try again.")
                            st.rerun()
    
    # Win check
    if len(st.session_state.sock_matched) == len(cards):
        st.balloons()
        st.success(f"🎉 Great job! You found all pairs in {st.session_state.sock_attempts} attempts!")
        if st.button("Play Again"):
            st.session_state.sock_matched = []
            st.session_state.sock_attempts = 0
            st.session_state.sock_cards = []
            st.session_state.sock_selected = None
            st.rerun()

# ---------- SANDWICH GAME ----------
elif st.session_state.page == "Sandwich":
    if st.button("← Back Home"): 
        st.session_state.page = "Home"
        st.session_state.sandwich_step = 0
        st.rerun()
    render_header("Building sequences and following multi-step instructions.")
    
    st.markdown("<div class='card'><div class='big'>Build the sandwich in the correct order!</div></div>", unsafe_allow_html=True)
    
    recipe = ["bread_bottom.png", "cheese.png", "lettuce.png", "bread_top.png"]
    labels = ["Bottom Bread 🍞", "Cheese 🧀", "Lettuce 🥬", "Top Bread 🍞"]
    
    current_step = st.session_state.sandwich_step
    
    if current_step < len(recipe):
        st.markdown(f"<div class='card'><div class='big'>Next step: {labels[current_step]}</div></div>", unsafe_allow_html=True)
    else:
        st.balloons()
        st.success("🎉 Great job! Sandwich complete!")
        if st.button("Make Another Sandwich"):
            st.session_state.sandwich_step = 0
            st.rerun()

    cols = st.columns(4)
    for i, (img_name, label) in enumerate(zip(recipe, labels)):
        img_path = SANDWICH_DIR / img_name
        with cols[i]:
            if img_path.exists():
                st.image(str(img_path), width=100)
            else:
                st.error(f"Missing: {img_name}")
            
            if i == current_step:
                if st.button(f"Add {label}", key=f"add_{i}"):
                    st.session_state.sandwich_step += 1
                    st.rerun()
            elif i < current_step:
                st.success("✓ Added")
            else:
                st.button(f"Add {label}", key=f"add_{i}", disabled=True)