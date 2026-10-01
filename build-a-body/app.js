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
        <!-- Ears -->
        <circle cx="150" cy="95" r="10" fill="${skin}" stroke="${skinOutline}" stroke-width="4"/>
        <circle cx="250" cy="95" r="10" fill="${skin}" stroke="${skinOutline}" stroke-width="4"/>
        <!-- Neck -->
        <rect x="185" y="130" width="30" height="25" fill="${skin}" stroke="${skinOutline}" stroke-width="4"/>
        <!-- Face -->
        <ellipse cx="200" cy="90" rx="45" ry="55" fill="${skin}" stroke="${skinOutline}" stroke-width="4"/>
        <!-- Hair (More realistic cut) -->
        <path d="M 155 70 C 150 20 250 20 245 70 C 230 40 170 40 155 70 Z" fill="#451A03"/>
        <path d="M 150 70 Q 155 85 160 80 Q 155 60 170 45 Q 150 45 150 70 Z" fill="#451A03"/>
        <path d="M 250 70 Q 245 85 240 80 Q 245 60 230 45 Q 250 45 250 70 Z" fill="#451A03"/>
        <!-- Eyebrows -->
        <path d="M 170 70 Q 180 65 190 70" fill="none" stroke="#451A03" stroke-width="3" stroke-linecap="round"/>
        <path d="M 210 70 Q 220 65 230 70" fill="none" stroke="#451A03" stroke-width="3" stroke-linecap="round"/>
        <!-- Eyes -->
        <ellipse cx="180" cy="85" rx="5" ry="7" fill="#1E293B"/>
        <ellipse cx="220" cy="85" rx="5" ry="7" fill="#1E293B"/>
        <!-- Nose -->
        <path d="M 200 90 L 195 105 L 205 105 Z" fill="${skinOutline}" opacity="0.5"/>
        <!-- Cheeks -->
        <circle cx="165" cy="100" r="8" fill="#FCA5A5" opacity="0.5"/>
        <circle cx="235" cy="100" r="8" fill="#FCA5A5" opacity="0.5"/>
        <!-- Smile -->
        <path d="M 185 115 Q 200 130 215 115" fill="none" stroke="#1E293B" stroke-width="4" stroke-linecap="round"/>
        <!-- Lower lip -->
        <path d="M 195 122 Q 200 126 205 122" fill="none" stroke="#F43F5E" stroke-width="2" stroke-linecap="round"/>
        `
    },
    torso: { 
        id: 'torso', name: 'Torso', 
        path: `
        <!-- T-Shirt Body -->
        <path d="M 150 145 C 160 145 240 145 250 145 C 265 150 260 260 260 270 L 140 270 C 140 260 135 150 150 145 Z" fill="${shirt}" stroke="${shirtOutline}" stroke-width="4" stroke-linejoin="round"/>
        <!-- Collar -->
        <path d="M 180 145 Q 200 165 220 145" fill="none" stroke="${shirtOutline}" stroke-width="4" stroke-linecap="round"/>
        <!-- Wrinkles -->
        <path d="M 160 250 Q 170 260 180 250" fill="none" stroke="${shirtOutline}" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
        <path d="M 240 245 Q 230 255 220 245" fill="none" stroke="${shirtOutline}" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
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
        <!-- Hand Outline (Thick Stroke) -->
        <g stroke="${skinOutline}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round">
            <!-- Fingers -->
            <line x1="83" y1="260" x2="78" y2="278"/> <!-- Pinky -->
            <line x1="90" y1="260" x2="86" y2="288"/> <!-- Ring -->
            <line x1="98" y1="262" x2="96" y2="293"/> <!-- Middle -->
            <line x1="106" y1="260" x2="108" y2="285"/> <!-- Index -->
            <line x1="106" y1="250" x2="122" y2="265"/> <!-- Thumb -->
            <!-- Palm Base -->
            <polygon points="85,242 105,248 108,262 82,258" />
        </g>
        <!-- Hand Fill (Inner Stroke) -->
        <g stroke="${skin}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
            <line x1="83" y1="260" x2="78" y2="278"/>
            <line x1="90" y1="260" x2="86" y2="288"/>
            <line x1="98" y1="262" x2="96" y2="293"/>
            <line x1="106" y1="260" x2="108" y2="285"/>
            <line x1="106" y1="250" x2="122" y2="265"/>
            <polygon points="85,242 105,248 108,262 82,258" fill="${skin}" stroke="none"/>
        </g>
        `
    },
    r_hand: { 
        id: 'r_hand', name: 'Right Hand', 
        path: `
        <!-- Hand Outline (Thick Stroke) -->
        <g stroke="${skinOutline}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round">
            <line x1="317" y1="260" x2="322" y2="278"/> <!-- Pinky -->
            <line x1="310" y1="260" x2="314" y2="288"/> <!-- Ring -->
            <line x1="302" y1="262" x2="304" y2="293"/> <!-- Middle -->
            <line x1="294" y1="260" x2="292" y2="285"/> <!-- Index -->
            <line x1="294" y1="250" x2="278" y2="265"/> <!-- Thumb -->
            <polygon points="295,248 315,242 318,258 292,262" />
        </g>
        <!-- Hand Fill (Inner Stroke) -->
        <g stroke="${skin}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
            <line x1="317" y1="260" x2="322" y2="278"/>
            <line x1="310" y1="260" x2="314" y2="288"/>
            <line x1="302" y1="262" x2="304" y2="293"/>
            <line x1="294" y1="260" x2="292" y2="285"/>
            <line x1="294" y1="250" x2="278" y2="265"/>
            <polygon points="295,248 315,242 318,258 292,262" fill="${skin}" stroke="none"/>
        </g>
        `
    },
    l_leg: { 
        id: 'l_leg', name: 'Left Leg', 
        path: `
        <!-- Pant Leg with slight bell/taper -->
        <path d="M 145,270 L 200,270 L 195,385 L 140,385 Z" fill="${pants}" stroke="${pantsOutline}" stroke-width="4" stroke-linejoin="round"/>
        <!-- Knee wrinkle -->
        <path d="M 160 330 Q 170 325 180 330" fill="none" stroke="${pantsOutline}" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
        <!-- Calf/Ankle -->
        <rect x="155" y="385" width="25" height="35" fill="${skin}" stroke="${skinOutline}" stroke-width="4"/>
        `
    },
    r_leg: { 
        id: 'r_leg', name: 'Right Leg', 
        path: `
        <!-- Pant Leg -->
        <path d="M 200,270 L 255,270 L 260,385 L 205,385 Z" fill="${pants}" stroke="${pantsOutline}" stroke-width="4" stroke-linejoin="round"/>
        <!-- Knee wrinkle -->
        <path d="M 220 330 Q 230 325 240 330" fill="none" stroke="${pantsOutline}" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
        <!-- Calf/Ankle -->
        <rect x="220" y="385" width="25" height="35" fill="${skin}" stroke="${skinOutline}" stroke-width="4"/>
        `
    },
    l_foot: { 
        id: 'l_foot', name: 'Left Foot', 
        path: `
        <!-- Sneaker Main -->
        <path d="M 165 415 L 130 425 Q 115 430 115 445 L 115 455 L 180 455 L 180 435 Z" fill="${shoe}" stroke="${shoeOutline}" stroke-width="4" stroke-linejoin="round"/>
        <!-- Laces -->
        <line x1="145" y1="425" x2="160" y2="435" stroke="#FFF" stroke-width="3" stroke-linecap="round"/>
        <line x1="140" y1="430" x2="155" y2="440" stroke="#FFF" stroke-width="3" stroke-linecap="round"/>
        <!-- Sole -->
        <path d="M 115 455 L 180 455 L 180 465 Q 115 465 115 455 Z" fill="#FFFFFF" stroke="#94A3B8" stroke-width="3"/>
        `
    },
    r_foot: { 
        id: 'r_foot', name: 'Right Foot', 
        path: `
        <!-- Sneaker Main -->
        <path d="M 235 415 L 270 425 Q 285 430 285 445 L 285 455 L 220 455 L 220 435 Z" fill="${shoe}" stroke="${shoeOutline}" stroke-width="4" stroke-linejoin="round"/>
        <!-- Laces -->
        <line x1="255" y1="425" x2="240" y2="435" stroke="#FFF" stroke-width="3" stroke-linecap="round"/>
        <line x1="260" y1="430" x2="245" y2="440" stroke="#FFF" stroke-width="3" stroke-linecap="round"/>
        <!-- Sole -->
        <path d="M 220 455 L 285 455 L 285 465 Q 220 465 220 455 Z" fill="#FFFFFF" stroke="#94A3B8" stroke-width="3"/>
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
