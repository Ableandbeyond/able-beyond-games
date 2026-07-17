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
PRIMARY, ACCENT, BG, TEXT, CARD = "#C97C5D", "#A8BFA3", "#F5F2ED", "#1E293B", "#FFFFFF"

# ---------- STYLE ----------
st.markdown(f"""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&display=swap');

    /* Hide Default Streamlit Elements */
    header {{visibility: hidden;}}
    footer {{visibility: hidden;}}
    #MainMenu {{visibility: hidden;}}

    /* Global Typography & Background */
    html, body, [class*="css"] {{
        font-family: 'Outfit', sans-serif !important;
    }}
    .stApp {{ 
        background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%); 
        background-attachment: fixed;
    }}

    /* Container Styling */
    .block-container {{
        max-width: 900px;
        padding-top: 2rem !important;
        padding-bottom: 2rem !important;
        background: rgba(255, 255, 255, 0.4);
        backdrop-filter: blur(16px);
        border-radius: 30px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.04);
        margin-top: 2rem;
        border: 1px solid rgba(255,255,255,0.7);
        animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }}

    /* Animations */
    @keyframes slideUpFade {{
        0% {{ opacity: 0; transform: translateY(20px); }}
        100% {{ opacity: 1; transform: translateY(0); }}
    }}
    @keyframes popIn {{
        0% {{ opacity: 0; transform: scale(0.9); }}
        100% {{ opacity: 1; transform: scale(1); }}
    }}

    /* Header Styling */
    .ab-header {{ 
        background: linear-gradient(135deg, #ffffff, #f8fafc);
        padding: 40px 30px; 
        border-radius: 20px; 
        text-align: center; 
        border: 1px solid rgba(255,255,255,1); 
        box-shadow: 0 10px 30px rgba(0,0,0,0.03);
        margin-bottom: 30px; 
    }}
    .ab-title {{ 
        font-size: 2.6rem; 
        font-weight: 800; 
        background: linear-gradient(45deg, {PRIMARY}, #FF9A76); 
        -webkit-background-clip: text; 
        -webkit-text-fill-color: transparent; 
        margin-bottom: 12px; 
        letter-spacing: -1px;
    }}
    .ab-sub {{ 
        font-size: 1.15rem; 
        color: #475569; 
        line-height: 1.5;
        max-width: 80%;
        margin: 0 auto;
    }}

    /* Card Elements */
    .card {{ 
        background: rgba(255, 255, 255, 0.85); 
        border-radius: 20px; 
        padding: 24px; 
        margin-bottom: 20px; 
        text-align: center; 
        border: 1px solid rgba(255,255,255,0.9);
        box-shadow: 0 8px 24px rgba(0,0,0,0.04); 
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        animation: popIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }}
    .card:hover {{
        transform: translateY(-4px);
        box-shadow: 0 14px 30px rgba(0,0,0,0.08);
    }}
    .big {{ font-size: 1.45rem; font-weight: 800; color: {TEXT}; margin-bottom: 8px; letter-spacing: -0.5px;}}
    .small {{ font-size: 1rem; color: #64748B; font-weight: 400; line-height: 1.6;}}

    /* Native Buttons */
    div.stButton > button {{ 
        width: 100%; 
        min-height: 4.5rem; 
        background: linear-gradient(135deg, {ACCENT}, #8BA885); 
        color: white; 
        font-family: 'Outfit', sans-serif;
        font-weight: 700; 
        font-size: 1.15rem;
        border-radius: 16px; 
        border: none; 
        box-shadow: 0 6px 16px rgba(168, 191, 163, 0.4);
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }}
    div.stButton > button:hover {{ 
        transform: translateY(-4px) scale(1.02);
        box-shadow: 0 12px 24px rgba(168, 191, 163, 0.6);
        background: linear-gradient(135deg, #96B090, #7A9573);
        color: white !important;
        border-color: transparent !important;
    }}
    div.stButton > button:active {{
        transform: translateY(1px) scale(0.98);
        box-shadow: 0 4px 10px rgba(168, 191, 163, 0.3);
    }}
    div.stButton > button:focus:not(:focus-visible) {{
        color: white;
        background: linear-gradient(135deg, {ACCENT}, #8BA885);
    }}

    /* Global Image Styling */
    [data-testid="stImage"] {{
        text-align: center;
        display: flex;
        justify-content: center;
    }}
    [data-testid="stImage"] img {{
        border-radius: 16px;
        background: white;
        padding: 10px;
        box-shadow: 0 10px 20px rgba(0,0,0,0.06);
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        border: 1px solid rgba(0,0,0,0.03);
    }}
    [data-testid="stImage"] img:hover {{
        transform: translateY(-5px) scale(1.02);
        box-shadow: 0 15px 25px rgba(0,0,0,0.1);
    }}
</style>
""", unsafe_allow_html=True)

def render_header(subtitle="Play-based tools designed to support focus, emotional regulation, and independent thinking."):
    st.markdown(f"""<div class="ab-header"><div class="ab-title">Able & Beyond<br>Life Skills Lab</div><div class="ab-sub">{subtitle}</div></div>""", unsafe_allow_html=True)

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