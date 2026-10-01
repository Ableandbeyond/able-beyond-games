// Audio Fallback and TTS
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playTone(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    } else if (type === 'error') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
    } else if (type === 'win') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(600, audioCtx.currentTime + 0.2);
        osc.frequency.linearRampToValueAtTime(800, audioCtx.currentTime + 0.4);
        gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.6);
    }
}

function playVoice(text, audioFileUrl = null) {
    if (audioFileUrl) {
        const audio = new Audio(audioFileUrl);
        audio.play().catch(e => {
            speakTTS(text);
        });
    } else {
        speakTTS(text);
    }
}

function speakTTS(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.rate = 0.9;
        u.pitch = 1.1; // Friendly tone
        window.speechSynthesis.speak(u);
    }
}

// Improved, cute character SVGs
const skin = "#FFDCA8";
const skinOutline = "#D29D64";
const shirt = "#34D399";
const shirtOutline = "#059669";
const pants = "#3B82F6";
const pantsOutline = "#1D4ED8";
const shoe = "#F43F5E";
const shoeOutline = "#BE123C";

const partsData = {
    head: { 
        id: 'head', name: 'Head', 
        path: `
        <!-- Neck -->
        <rect x="185" y="130" width="30" height="20" fill="${skin}" stroke="${skinOutline}" stroke-width="4"/>
        <!-- Face -->
        <circle cx="200" cy="90" r="50" fill="${skin}" stroke="${skinOutline}" stroke-width="4"/>
        <!-- Hair -->
        <path d="M 150 90 C 150 40 250 40 250 90 C 230 50 170 50 150 90 Z" fill="#78350F"/>
        <!-- Eyes -->
        <circle cx="180" cy="85" r="6" fill="#1E293B"/>
        <circle cx="220" cy="85" r="6" fill="#1E293B"/>
        <!-- Cheeks -->
        <circle cx="165" cy="95" r="8" fill="#FCA5A5" opacity="0.6"/>
        <circle cx="235" cy="95" r="8" fill="#FCA5A5" opacity="0.6"/>
        <!-- Smile -->
        <path d="M 185 110 Q 200 125 215 110" fill="none" stroke="#1E293B" stroke-width="4" stroke-linecap="round"/>
        `
    },
    torso: { 
        id: 'torso', name: 'Torso', 
        path: `
        <!-- T-Shirt Body -->
        <path d="M 150 145 L 250 145 L 260 270 L 140 270 Z" fill="${shirt}" stroke="${shirtOutline}" stroke-width="4" stroke-linejoin="round"/>
        <!-- Collar -->
        <path d="M 180 145 Q 200 160 220 145" fill="none" stroke="${shirtOutline}" stroke-width="4" stroke-linecap="round"/>
        <!-- Star Graphic -->
        <polygon points="200,180 205,195 220,195 208,205 212,220 200,210 188,220 192,205 180,195 195,195" fill="#FDE047"/>
        `
    },
    l_arm: { 
        id: 'l_arm', name: 'Left Arm', 
        path: `
        <!-- Sleeve -->
        <path d="M 148 145 L 110 170 L 125 195 L 158 175 Z" fill="${shirt}" stroke="${shirtOutline}" stroke-width="4" stroke-linejoin="round"/>
        <!-- Arm -->
        <path d="M 115 180 L 85 240 L 105 250 L 135 190 Z" fill="${skin}" stroke="${skinOutline}" stroke-width="4" stroke-linejoin="round"/>
        `
    },
    r_arm: { 
        id: 'r_arm', name: 'Right Arm', 
        path: `
        <!-- Sleeve -->
        <path d="M 252 145 L 290 170 L 275 195 L 242 175 Z" fill="${shirt}" stroke="${shirtOutline}" stroke-width="4" stroke-linejoin="round"/>
        <!-- Arm -->
        <path d="M 285 180 L 315 240 L 295 250 L 265 190 Z" fill="${skin}" stroke="${skinOutline}" stroke-width="4" stroke-linejoin="round"/>
        `
    },
    l_hand: { 
        id: 'l_hand', name: 'Left Hand', 
        path: `
        <!-- Hand / Mitten -->
        <circle cx="95" cy="265" r="18" fill="${skin}" stroke="${skinOutline}" stroke-width="4"/>
        <path d="M 85 255 Q 75 260 80 270" fill="none" stroke="${skinOutline}" stroke-width="3" stroke-linecap="round"/>
        `
    },
    r_hand: { 
        id: 'r_hand', name: 'Right Hand', 
        path: `
        <!-- Hand / Mitten -->
        <circle cx="305" cy="265" r="18" fill="${skin}" stroke="${skinOutline}" stroke-width="4"/>
        <path d="M 315 255 Q 325 260 320 270" fill="none" stroke="${skinOutline}" stroke-width="3" stroke-linecap="round"/>
        `
    },
    l_leg: { 
        id: 'l_leg', name: 'Left Leg', 
        path: `
        <!-- Pant Leg -->
        <path d="M 145 270 L 200 270 L 190 380 L 140 380 Z" fill="${pants}" stroke="${pantsOutline}" stroke-width="4" stroke-linejoin="round"/>
        <!-- Calf/Ankle -->
        <rect x="150" y="380" width="30" height="40" fill="${skin}" stroke="${skinOutline}" stroke-width="4"/>
        `
    },
    r_leg: { 
        id: 'r_leg', name: 'Right Leg', 
        path: `
        <!-- Pant Leg -->
        <path d="M 200 270 L 255 270 L 260 380 L 210 380 Z" fill="${pants}" stroke="${pantsOutline}" stroke-width="4" stroke-linejoin="round"/>
        <!-- Calf/Ankle -->
        <rect x="220" y="380" width="30" height="40" fill="${skin}" stroke="${skinOutline}" stroke-width="4"/>
        `
    },
    l_foot: { 
        id: 'l_foot', name: 'Left Foot', 
        path: `
        <!-- Sneaker -->
        <path d="M 165 420 L 130 420 Q 120 420 120 435 L 120 450 L 180 450 L 180 435 Z" fill="${shoe}" stroke="${shoeOutline}" stroke-width="4" stroke-linejoin="round"/>
        <!-- Sole -->
        <rect x="118" y="450" width="64" height="10" rx="4" fill="#FFFFFF" stroke="#94A3B8" stroke-width="3"/>
        `
    },
    r_foot: { 
        id: 'r_foot', name: 'Right Foot', 
        path: `
        <!-- Sneaker -->
        <path d="M 235 420 L 270 420 Q 280 420 280 435 L 280 450 L 220 450 L 220 435 Z" fill="${shoe}" stroke="${shoeOutline}" stroke-width="4" stroke-linejoin="round"/>
        <!-- Sole -->
        <rect x="218" y="450" width="64" height="10" rx="4" fill="#FFFFFF" stroke="#94A3B8" stroke-width="3"/>
        `
    },
};

// Level configurations
const levels = {
    1: [
        partsData.head,
        partsData.torso,
        { id: 'l_arm', name: 'Left Arm', path: partsData.l_arm.path + partsData.l_hand.path },
        { id: 'r_arm', name: 'Right Arm', path: partsData.r_arm.path + partsData.r_hand.path },
        { id: 'l_leg', name: 'Left Leg', path: partsData.l_leg.path + partsData.l_foot.path },
        { id: 'r_leg', name: 'Right Leg', path: partsData.r_leg.path + partsData.r_foot.path }
    ],
    2: [
        partsData.head, partsData.torso, 
        partsData.l_arm, partsData.r_arm, 
        partsData.l_hand, partsData.r_hand, 
        partsData.l_leg, partsData.r_leg, 
        partsData.l_foot, partsData.r_foot
    ]
};

let currentLevel = 1;
let partsPlaced = 0;
let totalParts = 0;

// UI Elements
const homeScreen = document.getElementById('home-screen');
const gameScreen = document.getElementById('game-screen');
const dock = document.getElementById('dock');
const bodySvg = document.getElementById('body-svg');
const celebrationOverlay = document.getElementById('celebration-overlay');

function showHome() {
    homeScreen.classList.remove('hidden');
    gameScreen.classList.add('hidden');
    celebrationOverlay.classList.add('hidden');
}

function startGame(level) {
    currentLevel = level;
    homeScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    celebrationOverlay.classList.add('hidden');
    
    if (audioCtx.state === 'suspended') audioCtx.resume();
    initLevel();
}

function initLevel() {
    partsPlaced = 0;
    const parts = levels[currentLevel];
    totalParts = parts.length;
    
    // 1. Render Drop Zones
    bodySvg.innerHTML = '';
    parts.forEach(part => {
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.setAttribute('class', 'drop-zone');
        g.setAttribute('id', `zone-${part.id}`);
        g.innerHTML = part.path;
        
        // Strip colors to make it a dashed outline target
        Array.from(g.children).forEach(child => {
            child.setAttribute('fill', 'rgba(241, 245, 249, 0.5)'); // light fill for easier tapping/visibility
            child.setAttribute('stroke', '#94A3B8');
            child.setAttribute('stroke-dasharray', '8 8');
            child.setAttribute('stroke-width', '5');
        });
        
        bodySvg.appendChild(g);
    });

    // 2. Render Dock Pieces (Randomized)
    dock.innerHTML = '';
    let shuffledParts = [...parts].sort(() => Math.random() - 0.5);
    
    shuffledParts.forEach(part => {
        const piece = document.createElement('div');
        piece.className = 'piece';
        piece.id = `dock-${part.id}`;
        piece.setAttribute('data-id', part.id);
        
        piece.innerHTML = `
            <svg viewBox="0 0 400 600" style="width: 100px; height: 150px; pointer-events: none;">
                ${part.path}
            </svg>
        `;
        
        // Setup Drag Events
        piece.addEventListener('pointerdown', onDragStart);
        dock.appendChild(piece);
    });
}

// --- Drag and Drop Logic ---
let draggedPiece = null;
let dragStartX = 0, dragStartY = 0;
let initialLeft = 0, initialTop = 0;

function onDragStart(e) {
    const piece = e.currentTarget;
    draggedPiece = { id: piece.getAttribute('data-id'), el: piece };
    
    const rect = piece.getBoundingClientRect();
    
    // Lock size and position it absolutely over the mouse
    piece.style.position = 'fixed';
    piece.style.width = rect.width + 'px';
    piece.style.height = rect.height + 'px';
    piece.style.left = rect.left + 'px';
    piece.style.top = rect.top + 'px';
    piece.style.zIndex = '1000';
    piece.classList.add('selected');
    
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    initialLeft = rect.left;
    initialTop = rect.top;
    
    playTone('success'); // Pick up sound
    
    // Bind move/up to window to catch fast dragging
    window.addEventListener('pointermove', onDragMove);
    window.addEventListener('pointerup', onDragEnd);
}

function onDragMove(e) {
    if (!draggedPiece) return;
    const dx = e.clientX - dragStartX;
    const dy = e.clientY - dragStartY;
    draggedPiece.el.style.left = (initialLeft + dx) + 'px';
    draggedPiece.el.style.top = (initialTop + dy) + 'px';
}

function onDragEnd(e) {
    if (!draggedPiece) return;
    
    window.removeEventListener('pointermove', onDragMove);
    window.removeEventListener('pointerup', onDragEnd);
    
    // Distance-based collision detection (highly forgiving for SEND)
    const draggedRect = draggedPiece.el.getBoundingClientRect();
    const draggedCenterX = draggedRect.left + (draggedRect.width / 2);
    const draggedCenterY = draggedRect.top + (draggedRect.height / 2);
    
    const zone = document.getElementById(`zone-${draggedPiece.id}`);
    const zoneRect = zone.getBoundingClientRect();
    const zoneCenterX = zoneRect.left + (zoneRect.width / 2);
    const zoneCenterY = zoneRect.top + (zoneRect.height / 2);
    
    // Calculate distance between centers
    const distance = Math.hypot(draggedCenterX - zoneCenterX, draggedCenterY - zoneCenterY);
    
    // 150px threshold is very generous for smartboards
    if (distance < 150) {
        // Correct Placement
        placePart(draggedPiece.id);
    } else {
        // Incorrect: Bounce back to dock smoothly
        playTone('error');
        draggedPiece.el.style.position = 'static';
        draggedPiece.el.style.zIndex = 'auto';
        draggedPiece.el.style.left = 'auto';
        draggedPiece.el.style.top = 'auto';
        draggedPiece.el.style.width = 'auto';
        draggedPiece.el.style.height = 'auto';
        draggedPiece.el.classList.remove('selected');
    }
    
    draggedPiece = null;
}

function placePart(partId) {
    const dockPiece = document.getElementById(`dock-${partId}`);
    if (dockPiece) dockPiece.remove();
    
    const zone = document.getElementById(`zone-${partId}`);
    const partData = levels[currentLevel].find(p => p.id === partId);
    zone.innerHTML = partData.path; // Restores original colors
    zone.classList.remove('drop-zone'); // removes dashed outline styles
    
    playVoice(partData.name, `audio/${partId}.mp3`);
    playTone('success');
    
    partsPlaced++;
    if (partsPlaced === totalParts) {
        setTimeout(celebrate, 1000);
    }
}

function celebrate() {
    playTone('win');
    playVoice("Great job! Body complete!", "audio/win.mp3");
    confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 } });
    celebrationOverlay.classList.remove('hidden');
}
