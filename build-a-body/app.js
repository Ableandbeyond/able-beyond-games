// --- Web Audio & Speech Synthesis ---
const AudioCtx = window.AudioContext || window.webkitAudioContext;
const audioCtx = AudioCtx ? new AudioCtx() : null;

function playTone(type) {
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const now = audioCtx.currentTime;

    if (type === 'pickup') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(380, now);
        osc.frequency.exponentialRampToValueAtTime(580, now + 0.08);
        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
    } else if (type === 'success') {
        [523.25, 659.25, 783.99].forEach((freq, idx) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.06);
            gain.gain.setValueAtTime(0.25, now + idx * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.06 + 0.22);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now + idx * 0.06);
            osc.stop(now + idx * 0.06 + 0.22);
        });
    } else if (type === 'error') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(190, now);
        osc.frequency.linearRampToValueAtTime(135, now + 0.2);
        gain.gain.setValueAtTime(0.16, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
    } else if (type === 'win') {
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.09);
            gain.gain.setValueAtTime(0.3, now + idx * 0.09);
            gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.09 + 0.35);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now + idx * 0.09);
            osc.stop(now + idx * 0.09 + 0.35);
        });
    }
}

function speakTTS(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.rate = 0.92;
        u.pitch = 1.05;
        window.speechSynthesis.speak(u);
    }
}

// --- Customizer Palettes ---
const SKIN_PALETTES = [
    { fill: "#FFDCA8", stroke: "#C68B59", hair: "#451A03", cheek: "#FDA4AF" },
    { fill: "#F3C69F", stroke: "#B47B4E", hair: "#27272A", cheek: "#FB7185" },
    { fill: "#C68642", stroke: "#7C4D25", hair: "#18181B", cheek: "#F43F5E" },
    { fill: "#7B4B2A", stroke: "#432818", hair: "#09090B", cheek: "#E11D48" }
];

const OUTFIT_PALETTES = [
    { shirt: "#10B981", shirtLine: "#047857", pants: "#2563EB", pantsLine: "#1E40AF", shoe: "#F43F5E", shoeLine: "#BE123C" },
    { shirt: "#3B82F6", shirtLine: "#1D4ED8", pants: "#334155", pantsLine: "#0F172A", shoe: "#F59E0B", shoeLine: "#B45309" },
    { shirt: "#F43F5E", shirtLine: "#BE123C", pants: "#1E3A8A", pantsLine: "#172554", shoe: "#10B981", shoeLine: "#047857" },
    { shirt: "#8B5CF6", shirtLine: "#5B21B6", pants: "#0284C7", pantsLine: "#0369A1", shoe: "#EC4899", shoeLine: "#9D174D" }
];

let skinIdx = 0;
let outfitIdx = 0;

function getPartsCatalog() {
    const s = SKIN_PALETTES[skinIdx];
    const o = OUTFIT_PALETTES[outfitIdx];

    return {
        head: {
            id: 'head',
            name: 'Head',
            fact: 'Head! I use my head to think, see, listen, and smile!',
            cropBox: '130 15 140 140',
            path: `
                <!-- Ears -->
                <circle cx="150" cy="92" r="11" fill="${s.fill}" stroke="${s.stroke}" stroke-width="4"/>
                <circle cx="250" cy="92" r="11" fill="${s.fill}" stroke="${s.stroke}" stroke-width="4"/>
                <!-- Neck -->
                <rect x="184" y="128" width="32" height="24" rx="6" fill="${s.fill}" stroke="${s.stroke}" stroke-width="4"/>
                <!-- Face -->
                <ellipse cx="200" cy="88" rx="46" ry="52" fill="${s.fill}" stroke="${s.stroke}" stroke-width="4"/>
                <!-- Hair -->
                <path d="M 152 72 C 148 20 252 20 248 72 C 232 42 168 42 152 72 Z" fill="${s.hair}"/>
                <path d="M 150 72 Q 154 84 160 78 Q 155 58 172 44 Q 150 46 150 72 Z" fill="${s.hair}"/>
                <path d="M 250 72 Q 246 84 240 78 Q 245 58 228 44 Q 250 46 250 72 Z" fill="${s.hair}"/>
                <!-- Eyebrows -->
                <path d="M 170 68 Q 180 63 190 68" fill="none" stroke="${s.hair}" stroke-width="3.5" stroke-linecap="round"/>
                <path d="M 210 68 Q 220 63 230 68" fill="none" stroke="${s.hair}" stroke-width="3.5" stroke-linecap="round"/>
                <!-- Eyes with shine -->
                <ellipse cx="180" cy="84" rx="5.5" ry="7.5" fill="#0F172A"/>
                <circle cx="178" cy="81" r="2" fill="#FFFFFF"/>
                <ellipse cx="220" cy="84" rx="5.5" ry="7.5" fill="#0F172A"/>
                <circle cx="218" cy="81" r="2" fill="#FFFFFF"/>
                <!-- Nose -->
                <path d="M 200 88 Q 194 101 203 102" fill="none" stroke="${s.stroke}" stroke-width="3.5" stroke-linecap="round"/>
                <!-- Cheeks -->
                <circle cx="165" cy="99" r="8" fill="${s.cheek}" opacity="0.45"/>
                <circle cx="235" cy="99" r="8" fill="${s.cheek}" opacity="0.45"/>
                <!-- Big Friendly Smile -->
                <path d="M 183 111 Q 200 127 217 111" fill="none" stroke="#0F172A" stroke-width="4" stroke-linecap="round"/>
            `
        },
        torso: {
            id: 'torso',
            name: 'Torso (Tummy & Chest)',
            shortName: 'Torso',
            fact: 'Torso! My torso holds my heart and lungs and wears my comfy shirt!',
            cropBox: '125 135 150 150',
            path: `
                <!-- T-Shirt Body -->
                <path d="M 148 145 C 160 143 240 143 252 145 C 264 152 260 258 260 272 L 140 272 C 140 258 136 152 148 145 Z" fill="${o.shirt}" stroke="${o.shirtLine}" stroke-width="4" stroke-linejoin="round"/>
                <!-- Collar -->
                <path d="M 178 145 Q 200 164 222 145" fill="none" stroke="${o.shirtLine}" stroke-width="4" stroke-linecap="round"/>
                <!-- Star Badge on Chest -->
                <polygon points="200,180 206,194 221,196 210,206 213,221 200,213 187,221 190,206 179,196 194,194" fill="#FDE047" stroke="#CA8A04" stroke-width="2.5" stroke-linejoin="round"/>
            `
        },
        l_arm: {
            id: 'l_arm',
            name: 'Left Arm',
            fact: 'Left Arm! Arms help me reach, hug, and carry things!',
            cropBox: '70 135 100 130',
            path: `
                <path d="M 148 146 L 108 170 L 124 196 L 156 176 Z" fill="${o.shirt}" stroke="${o.shirtLine}" stroke-width="4" stroke-linejoin="round"/>
                <path d="M 114 182 L 84 242 L 106 252 L 134 192 Z" fill="${s.fill}" stroke="${s.stroke}" stroke-width="4" stroke-linejoin="round"/>
            `
        },
        r_arm: {
            id: 'r_arm',
            name: 'Right Arm',
            fact: 'Right Arm! My strong arms help me lift and play!',
            cropBox: '230 135 100 130',
            path: `
                <path d="M 252 146 L 292 170 L 276 196 L 244 176 Z" fill="${o.shirt}" stroke="${o.shirtLine}" stroke-width="4" stroke-linejoin="round"/>
                <path d="M 286 182 L 316 242 L 294 252 L 266 192 Z" fill="${s.fill}" stroke="${s.stroke}" stroke-width="4" stroke-linejoin="round"/>
            `
        },
        l_hand: {
            id: 'l_hand',
            name: 'Left Hand',
            fact: 'Left Hand! Hands and fingers help me wave, draw, and hold things!',
            cropBox: '62 232 72 72',
            path: `
                <g stroke="${s.stroke}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="83" y1="260" x2="78" y2="278"/>
                    <line x1="90" y1="260" x2="86" y2="288"/>
                    <line x1="98" y1="262" x2="96" y2="293"/>
                    <line x1="106" y1="260" x2="108" y2="285"/>
                    <line x1="106" y1="250" x2="122" y2="265"/>
                    <polygon points="85,242 105,248 108,262 82,258" />
                </g>
                <g stroke="${s.fill}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="83" y1="260" x2="78" y2="278"/>
                    <line x1="90" y1="260" x2="86" y2="288"/>
                    <line x1="98" y1="262" x2="96" y2="293"/>
                    <line x1="106" y1="260" x2="108" y2="285"/>
                    <line x1="106" y1="250" x2="122" y2="265"/>
                    <polygon points="85,242 105,248 108,262 82,258" fill="${s.fill}" stroke="none"/>
                </g>
            `
        },
        r_hand: {
            id: 'r_hand',
            name: 'Right Hand',
            fact: 'Right Hand! High five! Hands help us wave hello to friends!',
            cropBox: '266 232 72 72',
            path: `
                <g stroke="${s.stroke}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="317" y1="260" x2="322" y2="278"/>
                    <line x1="310" y1="260" x2="314" y2="288"/>
                    <line x1="302" y1="262" x2="304" y2="293"/>
                    <line x1="294" y1="260" x2="292" y2="285"/>
                    <line x1="294" y1="250" x2="278" y2="265"/>
                    <polygon points="295,248 315,242 318,258 292,262" />
                </g>
                <g stroke="${s.fill}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="317" y1="260" x2="322" y2="278"/>
                    <line x1="310" y1="260" x2="314" y2="288"/>
                    <line x1="302" y1="262" x2="304" y2="293"/>
                    <line x1="294" y1="260" x2="292" y2="285"/>
                    <line x1="294" y1="250" x2="278" y2="265"/>
                    <polygon points="295,248 315,242 318,258 292,262" fill="${s.fill}" stroke="none"/>
                </g>
            `
        },
        l_leg: {
            id: 'l_leg',
            name: 'Left Leg',
            fact: 'Left Leg! My legs help me stand tall, walk, run, and jump!',
            cropBox: '128 262 85 170',
            path: `
                <path d="M 142,270 L 200,270 L 194,385 L 142,385 Z" fill="${o.pants}" stroke="${o.pantsLine}" stroke-width="4" stroke-linejoin="round"/>
                <path d="M 156 330 Q 168 325 180 330" fill="none" stroke="${o.pantsLine}" stroke-width="2.5" stroke-linecap="round" opacity="0.6"/>
                <rect x="155" y="385" width="26" height="35" fill="${s.fill}" stroke="${s.stroke}" stroke-width="4"/>
            `
        },
        r_leg: {
            id: 'r_leg',
            name: 'Right Leg',
            fact: 'Right Leg! Strong legs help us walk and climb stairs!',
            cropBox: '187 262 85 170',
            path: `
                <path d="M 200,270 L 258,270 L 258,385 L 206,385 Z" fill="${o.pants}" stroke="${o.pantsLine}" stroke-width="4" stroke-linejoin="round"/>
                <path d="M 220 330 Q 232 325 244 330" fill="none" stroke="${o.pantsLine}" stroke-width="2.5" stroke-linecap="round" opacity="0.6"/>
                <rect x="219" y="385" width="26" height="35" fill="${s.fill}" stroke="${s.stroke}" stroke-width="4"/>
            `
        },
        l_foot: {
            id: 'l_foot',
            name: 'Left Foot',
            fact: 'Left Foot! Feet help me balance, kick a ball, and wear cool shoes!',
            cropBox: '105 405 88 72',
            path: `
                <path d="M 165 415 L 130 425 Q 114 430 114 445 L 114 456 L 182 456 L 182 435 Z" fill="${o.shoe}" stroke="${o.shoeLine}" stroke-width="4" stroke-linejoin="round"/>
                <line x1="145" y1="425" x2="160" y2="435" stroke="#FFF" stroke-width="3" stroke-linecap="round"/>
                <line x1="138" y1="431" x2="153" y2="441" stroke="#FFF" stroke-width="3" stroke-linecap="round"/>
                <path d="M 114 456 L 182 456 L 182 466 Q 114 466 114 456 Z" fill="#FFFFFF" stroke="#64748B" stroke-width="3"/>
            `
        },
        r_foot: {
            id: 'r_foot',
            name: 'Right Foot',
            fact: 'Right Foot! My feet take me everywhere I want to go!',
            cropBox: '207 405 88 72',
            path: `
                <path d="M 235 415 L 270 425 Q 286 430 286 445 L 286 456 L 218 456 L 218 435 Z" fill="${o.shoe}" stroke="${o.shoeLine}" stroke-width="4" stroke-linejoin="round"/>
                <line x1="255" y1="425" x2="240" y2="435" stroke="#FFF" stroke-width="3" stroke-linecap="round"/>
                <line x1="262" y1="431" x2="247" y2="441" stroke="#FFF" stroke-width="3" stroke-linecap="round"/>
                <path d="M 218 456 L 286 456 L 286 466 Q 218 466 218 456 Z" fill="#FFFFFF" stroke="#64748B" stroke-width="3"/>
            `
        }
    };
}

function getLevelParts(lvl) {
    const c = getPartsCatalog();
    if (lvl === 1) {
        return [
            c.head,
            c.torso,
            {
                id: 'l_arm',
                name: 'Left Arm',
                fact: c.l_arm.fact,
                cropBox: '65 135 105 170',
                path: c.l_arm.path + c.l_hand.path
            },
            {
                id: 'r_arm',
                name: 'Right Arm',
                fact: c.r_arm.fact,
                cropBox: '230 135 105 170',
                path: c.r_arm.path + c.r_hand.path
            },
            {
                id: 'l_leg',
                name: 'Left Leg',
                fact: c.l_leg.fact,
                cropBox: '108 262 98 212',
                path: c.l_leg.path + c.l_foot.path
            },
            {
                id: 'r_leg',
                name: 'Right Leg',
                fact: c.r_leg.fact,
                cropBox: '194 262 98 212',
                path: c.r_leg.path + c.r_foot.path
            }
        ];
    }
    return [
        c.head, c.torso,
        c.l_arm, c.r_arm,
        c.l_hand, c.r_hand,
        c.l_leg, c.r_leg,
        c.l_foot, c.r_foot
    ];
}

// --- Level 3: Functional Body Quiz Questions ---
const QUIZ_QUESTIONS = [
    {
        q: "Which body part helps me THINK, SEE, and SMILE? 😊",
        sub: "Tap the Head on the character or choose the card on the right!",
        accept: ['head'],
        options: ['head', 'torso', 'l_foot']
    },
    {
        q: "Which body part helps me WAVE HELLO and DRAW pictures? 👋",
        sub: "Tap a Hand on the character or choose the card!",
        accept: ['l_hand', 'r_hand'],
        options: ['r_hand', 'head', 'l_leg']
    },
    {
        q: "Which body part wears SHOES and kicks a FOOTBALL? ⚽👟",
        sub: "Tap a Foot on the character or choose the card!",
        accept: ['l_foot', 'r_foot'],
        options: ['l_foot', 'torso', 'r_arm']
    },
    {
        q: "Which body part holds my HEART beating inside my chest? ❤️",
        sub: "Tap the Torso (T-Shirt) on the character or choose the card!",
        accept: ['torso'],
        options: ['torso', 'head', 'r_hand']
    },
    {
        q: "Which body part helps me RUN, JUMP, and CLIMB stairs? 🏃",
        sub: "Tap a Leg on the character or choose the card!",
        accept: ['l_leg', 'r_leg'],
        options: ['l_leg', 'head', 'l_hand']
    }
];

// --- Game State ---
let currentLevel = 1;
let placedIds = new Set();
let selectedPartId = null;
let quizIndex = 0;

// UI References
const dock = document.getElementById('dock');
const bodySvg = document.getElementById('body-svg');
const promptTitle = document.getElementById('prompt-title');
const promptSub = document.getElementById('prompt-sub');
const progressText = document.getElementById('progress-text');
const dockTitle = document.getElementById('dock-title');
const dockHint = document.getElementById('dock-hint');
const celebrationOverlay = document.getElementById('celebration-overlay');

function setPrompt(title, sub, speak = false) {
    promptTitle.textContent = title;
    promptSub.textContent = sub;
    if (speak) speakTTS(title);
}

function repeatPrompt() {
    speakTTS(promptTitle.textContent);
}

function setSkinTone(idx) {
    skinIdx = idx;
    document.querySelectorAll('.swatch-btn').forEach((btn, i) => {
        btn.classList.toggle('active', i === idx);
    });
    playTone('pickup');
    refreshBoardVisuals();
}

function setOutfitTheme(idx) {
    outfitIdx = idx;
    document.querySelectorAll('.outfit-btn').forEach((btn, i) => {
        btn.classList.toggle('active', i === idx);
    });
    playTone('pickup');
    refreshBoardVisuals();
}

function startGame(level) {
    currentLevel = level;
    placedIds.clear();
    selectedPartId = null;
    quizIndex = 0;
    celebrationOverlay.classList.add('hidden');

    document.querySelectorAll('.lvl-tab').forEach((tab, idx) => {
        tab.classList.toggle('active', idx + 1 === level);
    });

    if (level === 3) {
        initQuizMode();
    } else {
        initBuildMode();
    }
}

function nextLevelAction() {
    const next = currentLevel < 3 ? currentLevel + 1 : 1;
    startGame(next);
}

// --- Build Mode (Levels 1 & 2) ---
function initBuildMode() {
    const parts = getLevelParts(currentLevel);
    dockTitle.textContent = '🧩 Body Parts Tray';
    dockHint.textContent = 'Tap or Drag';
    progressText.textContent = `0 / ${parts.length}`;

    setPrompt(
        currentLevel === 1
            ? "Level 1: Let's build our friend using 6 main body parts!"
            : "Level 2: Full 10-Part Body Builder! Tap or drag any part.",
        "Accessibility Tip: Tap a card once to highlight where it goes, then tap the glowing outline!",
        true
    );

    renderBuildSvg();
    renderBuildDock(true);
}

function refreshBoardVisuals() {
    if (currentLevel === 3) {
        renderQuizBoard();
        renderQuizOptions();
    } else {
        renderBuildSvg();
        renderBuildDock(false);
    }
}

function renderBuildSvg() {
    const parts = getLevelParts(currentLevel);
    bodySvg.innerHTML = `
        <!-- Soft Studio Pedestal -->
        <ellipse cx="200" cy="466" rx="115" ry="18" fill="#DBEAFE" stroke="#93C5FD" stroke-width="3"/>
    `;

    parts.forEach(part => {
        const isPlaced = placedIds.has(part.id);
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.setAttribute('id', `zone-${part.id}`);
        g.innerHTML = part.path;

        if (isPlaced) {
            g.setAttribute('class', 'placed-svg-part');
            g.addEventListener('click', () => {
                playTone('pickup');
                setPrompt(part.fact, "Tap another part in the tray to keep building!", true);
            });
        } else {
            g.setAttribute('class', 'drop-zone' + (selectedPartId === part.id ? ' target-glow' : ''));
            const isTarget = selectedPartId === part.id;
            Array.from(g.querySelectorAll('*')).forEach(child => {
                child.setAttribute('fill', isTarget ? 'rgba(254, 240, 138, 0.78)' : 'rgba(226, 232, 240, 0.55)');
                child.setAttribute('stroke', isTarget ? '#CA8A04' : '#64748B');
                child.setAttribute('stroke-dasharray', isTarget ? 'none' : '8 6');
                child.setAttribute('stroke-width', isTarget ? '5' : '4');
            });

            // Tap-to-Place handler on the SVG outline
            g.addEventListener('click', () => {
                if (selectedPartId === part.id) {
                    placePart(part.id);
                } else if (selectedPartId) {
                    playTone('error');
                    const selPart = parts.find(p => p.id === selectedPartId);
                    setPrompt(
                        `Look for the glowing yellow outline for the ${selPart.shortName || selPart.name}!`,
                        "Tap the glowing yellow spot on the character!",
                        true
                    );
                } else {
                    selectPart(part.id);
                }
            });
        }

        bodySvg.appendChild(g);
    });
}

let currentDockOrder = [];

function renderBuildDock(reshuffle = false) {
    const parts = getLevelParts(currentLevel);
    if (reshuffle || currentDockOrder.length === 0) {
        currentDockOrder = parts.map(p => p.id).sort(() => Math.random() - 0.5);
    }

    dock.innerHTML = '';
    currentDockOrder.forEach(partId => {
        if (placedIds.has(partId)) return;
        const part = parts.find(p => p.id === partId);
        if (!part) return;

        const piece = document.createElement('div');
        piece.className = 'piece' + (selectedPartId === part.id ? ' selected' : '');
        piece.id = `dock-${part.id}`;
        piece.setAttribute('data-id', part.id);

        piece.innerHTML = `
            <div class="piece-svg-wrap">
                <svg viewBox="${part.cropBox}">
                    ${part.path}
                </svg>
            </div>
            <div class="piece-label">${part.shortName || part.name}</div>
        `;

        piece.addEventListener('pointerdown', onDragStart);
        dock.appendChild(piece);
    });
}

function selectPart(partId) {
    const parts = getLevelParts(currentLevel);
    const part = parts.find(p => p.id === partId);
    if (!part) return;

    // If tapping the already-selected card a second time, auto-place it for effortless Switch/Eye-Gaze support!
    if (selectedPartId === partId) {
        placePart(partId);
        return;
    }

    selectedPartId = partId;
    playTone('pickup');
    setPrompt(
        `${part.shortName || part.name}! Tap the glowing yellow outline on the body (or tap this card again) to place it!`,
        part.fact,
        true
    );
    renderBuildSvg();
    renderBuildDock(false);
}

// --- Drag & Tap Hybrid Controller ---
let draggedPiece = null;
let dragStartX = 0, dragStartY = 0;
let initialLeft = 0, initialTop = 0;
let hasMovedSignificantly = false;

function onDragStart(e) {
    if (currentLevel === 3) return;
    const piece = e.currentTarget;
    const partId = piece.getAttribute('data-id');

    draggedPiece = { id: partId, el: piece };
    hasMovedSignificantly = false;

    const rect = piece.getBoundingClientRect();
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    initialLeft = rect.left;
    initialTop = rect.top;

    window.addEventListener('pointermove', onDragMove);
    window.addEventListener('pointerup', onDragEnd);
}

function onDragMove(e) {
    if (!draggedPiece) return;
    const dx = e.clientX - dragStartX;
    const dy = e.clientY - dragStartY;

    if (!hasMovedSignificantly && Math.hypot(dx, dy) > 8) {
        hasMovedSignificantly = true;
        const rect = draggedPiece.el.getBoundingClientRect();
        draggedPiece.el.style.position = 'fixed';
        draggedPiece.el.style.width = rect.width + 'px';
        draggedPiece.el.style.height = rect.height + 'px';
        draggedPiece.el.style.left = rect.left + 'px';
        draggedPiece.el.style.top = rect.top + 'px';
        draggedPiece.el.style.zIndex = '1500';
        draggedPiece.el.classList.add('selected');

        selectedPartId = draggedPiece.id;
        renderBuildSvg();
    }

    if (hasMovedSignificantly) {
        draggedPiece.el.style.left = (initialLeft + dx) + 'px';
        draggedPiece.el.style.top = (initialTop + dy) + 'px';
    }
}

function onDragEnd() {
    if (!draggedPiece) return;

    window.removeEventListener('pointermove', onDragMove);
    window.removeEventListener('pointerup', onDragEnd);

    const partId = draggedPiece.id;

    // If user just tapped the card without dragging, trigger Accessible Tap-to-Select!
    if (!hasMovedSignificantly) {
        draggedPiece = null;
        selectPart(partId);
        return;
    }

    const draggedRect = draggedPiece.el.getBoundingClientRect();
    const draggedCenterX = draggedRect.left + (draggedRect.width / 2);
    const draggedCenterY = draggedRect.top + (draggedRect.height / 2);

    const zone = document.getElementById(`zone-${partId}`);
    const zoneRect = zone.getBoundingClientRect();
    const zoneCenterX = zoneRect.left + (zoneRect.width / 2);
    const zoneCenterY = zoneRect.top + (zoneRect.height / 2);

    const distance = Math.hypot(draggedCenterX - zoneCenterX, draggedCenterY - zoneCenterY);

    if (distance < 165) {
        placePart(partId);
    } else {
        playTone('error');
        renderBuildDock(false);
    }

    draggedPiece = null;
}

function placePart(partId) {
    if (placedIds.has(partId)) return;
    placedIds.add(partId);
    selectedPartId = null;

    const parts = getLevelParts(currentLevel);
    const part = parts.find(p => p.id === partId);

    playTone('success');
    progressText.textContent = `${placedIds.size} / ${parts.length}`;
    setPrompt(`Awesome! ${part.fact}`, "Keep going! Pick the next body part.", true);

    renderBuildSvg();
    renderBuildDock(false);

    if (placedIds.size === parts.length) {
        setTimeout(() => {
            celebrate(
                "Amazing Job! Body Complete!",
                "You built the entire character and learned all the body parts!"
            );
        }, 900);
    }
}

// --- Level 3: "What Does It Do?" Quiz Mode ---
function initQuizMode() {
    quizIndex = 0;
    dockTitle.textContent = '🧠 Choose the Answer';
    dockHint.textContent = 'Tap Body or Card';
    renderQuizStep();
}

function renderQuizStep() {
    const qObj = QUIZ_QUESTIONS[quizIndex];
    progressText.textContent = `${quizIndex + 1} / ${QUIZ_QUESTIONS.length}`;
    setPrompt(qObj.q, qObj.sub, true);
    renderQuizBoard();
    renderQuizOptions();
}

function renderQuizBoard() {
    const c = getPartsCatalog();
    const allParts = [
        c.head, c.torso,
        c.l_arm, c.r_arm,
        c.l_hand, c.r_hand,
        c.l_leg, c.r_leg,
        c.l_foot, c.r_foot
    ];

    bodySvg.innerHTML = `
        <ellipse cx="200" cy="466" rx="115" ry="18" fill="#EDE9FE" stroke="#C4B5FD" stroke-width="3"/>
    `;

    allParts.forEach(part => {
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.setAttribute('class', 'placed-svg-part');
        g.innerHTML = part.path;
        g.addEventListener('click', () => handleQuizAnswer(part.id));
        bodySvg.appendChild(g);
    });
}

function renderQuizOptions() {
    const qObj = QUIZ_QUESTIONS[quizIndex];
    const c = getPartsCatalog();
    dock.innerHTML = '';

    qObj.options.forEach(optId => {
        const part = c[optId];
        const card = document.createElement('div');
        card.className = 'quiz-card';
        card.innerHTML = `
            <div class="piece-svg-wrap" style="width:80px; height:80px; background:#FFF; border-radius:14px; border:2px solid #E2E8F0; padding:6px;">
                <svg viewBox="${part.cropBox}">
                    ${part.path}
                </svg>
            </div>
            <div style="flex:1;">
                <div style="font-size:1.35rem; font-weight:800; color:#0F172A;">${part.shortName || part.name}</div>
                <div style="font-size:0.95rem; color:#475569; margin-top:2px;">Tap to select this answer</div>
            </div>
        `;
        card.addEventListener('click', () => handleQuizAnswer(optId));
        dock.appendChild(card);
    });
}

function handleQuizAnswer(partId) {
    const qObj = QUIZ_QUESTIONS[quizIndex];
    const c = getPartsCatalog();
    const tappedPart = c[partId];

    if (qObj.accept.includes(partId)) {
        playTone('success');
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
        setPrompt(`Correct! ${tappedPart.fact}`, "Get ready for the next question!", true);

        setTimeout(() => {
            quizIndex++;
            if (quizIndex < QUIZ_QUESTIONS.length) {
                renderQuizStep();
            } else {
                celebrate(
                    "Body Quiz Champion! 🏆",
                    "You answered every single question about what our body parts do!"
                );
            }
        }, 1800);
    } else {
        playTone('error');
        setPrompt(
            `That's the ${tappedPart.shortName || tappedPart.name}! Let's try again: ${qObj.q}`,
            "Listen carefully and tap the matching body part!",
            true
        );
    }
}

function celebrate(title, desc) {
    playTone('win');
    speakTTS(title + " " + desc);
    confetti({ particleCount: 200, spread: 90, origin: { y: 0.6 } });
    document.getElementById('win-title').textContent = title;
    document.getElementById('win-desc').textContent = desc;
    celebrationOverlay.classList.remove('hidden');
}

// Boot into Level 1 immediately so students don't face an extra menu wall
startGame(1);
