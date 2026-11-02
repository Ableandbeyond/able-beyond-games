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
        osc.type = 'sine';
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.linearRampToValueAtTime(180, now + 0.18);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
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

window._activeUtterance = null;
function speakTTS(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        window._activeUtterance = u;
        u.lang = 'en-GB';
        u.rate = 0.92;
        u.pitch = 1.06;
        window.speechSynthesis.speak(u);
    }
}

// --- Customizer Palettes ---
const SKIN_PALETTES = [
    { fill: "#FFE0BD", shade: "#F5C693", stroke: "#B47B4E", hair: "#5C2D0C", hairLight: "#854D27", cheek: "#FB7185" },
    { fill: "#F1C27D", shade: "#E0AC69", stroke: "#9C6639", hair: "#27272A", hairLight: "#52525B", cheek: "#F43F5E" },
    { fill: "#C68642", shade: "#B07232", stroke: "#784719", hair: "#18181B", hairLight: "#3F3F46", cheek: "#E11D48" },
    { fill: "#7B4B2A", shade: "#653B1F", stroke: "#3E2211", hair: "#09090B", hairLight: "#27272A", cheek: "#F43F5E" }
];

const OUTFIT_PALETTES = [
    { shirt: "#10B981", shirtDark: "#059669", shirtLine: "#047857", pants: "#2563EB", pantsDark: "#1D4ED8", pantsLine: "#1E3A8A", shoe: "#F43F5E", shoeLine: "#BE123C" },
    { shirt: "#3B82F6", shirtDark: "#2563EB", shirtLine: "#1D4ED8", pants: "#334155", pantsDark: "#1E293B", pantsLine: "#0F172A", shoe: "#F59E0B", shoeLine: "#B45309" },
    { shirt: "#F43F5E", shirtDark: "#E11D48", shirtLine: "#BE123C", pants: "#1E40AF", pantsDark: "#1E3A8A", pantsLine: "#172554", shoe: "#10B981", shoeLine: "#047857" },
    { shirt: "#8B5CF6", shirtDark: "#7C3AED", shirtLine: "#5B21B6", pants: "#0284C7", pantsDark: "#0369A1", pantsLine: "#075985", shoe: "#EC4899", shoeLine: "#9D174D" }
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
            zOrder: 6,
            fact: 'Head! I use my head to think, see, listen, and smile!',
            cropBox: '130 12 140 142',
            silhouette: `<ellipse cx="200" cy="84" rx="50" ry="54" />`,
            path: `
                <!-- Neck -->
                <rect x="184" y="126" width="32" height="26" rx="10" fill="${s.shade}" stroke="${s.stroke}" stroke-width="3.5"/>
                <!-- Ears -->
                <circle cx="146" cy="88" r="12" fill="${s.fill}" stroke="${s.stroke}" stroke-width="3.5"/>
                <path d="M 144 84 Q 148 88 144 92" fill="none" stroke="${s.stroke}" stroke-width="2.5" stroke-linecap="round"/>
                <circle cx="254" cy="88" r="12" fill="${s.fill}" stroke="${s.stroke}" stroke-width="3.5"/>
                <path d="M 256 84 Q 252 88 256 92" fill="none" stroke="${s.stroke}" stroke-width="2.5" stroke-linecap="round"/>
                <!-- Main Head Shape -->
                <ellipse cx="200" cy="84" rx="50" ry="52" fill="${s.fill}" stroke="${s.stroke}" stroke-width="4"/>
                <!-- Soft Chin Shadow -->
                <path d="M 164 114 Q 200 138 236 114" fill="none" stroke="${s.shade}" stroke-width="4" stroke-linecap="round" opacity="0.7"/>
                <!-- Layered Bouncy Hair -->
                <path d="M 149 76 C 144 20 256 20 251 76 C 242 54 224 46 200 48 C 176 46 158 54 149 76 Z" fill="${s.hair}" stroke="#1E1B4B" stroke-width="2.5" stroke-linejoin="round"/>
                <path d="M 165 36 Q 200 22 232 38" fill="none" stroke="${s.hairLight}" stroke-width="5" stroke-linecap="round" opacity="0.65"/>
                <path d="M 192 26 Q 202 14 214 25" fill="none" stroke="${s.hair}" stroke-width="6" stroke-linecap="round"/>
                <!-- Eyebrows -->
                <path d="M 169 66 Q 179 60 189 65" fill="none" stroke="${s.hair}" stroke-width="3.8" stroke-linecap="round"/>
                <path d="M 211 65 Q 221 60 231 66" fill="none" stroke="${s.hair}" stroke-width="3.8" stroke-linecap="round"/>
                <!-- Glossy Cartoon Eyes -->
                <ellipse cx="179" cy="82" rx="7.5" ry="9" fill="#0F172A"/>
                <circle cx="176.5" cy="78.5" r="3" fill="#FFFFFF"/>
                <circle cx="181.5" cy="85.5" r="1.4" fill="#FFFFFF"/>
                <ellipse cx="221" cy="82" rx="7.5" ry="9" fill="#0F172A"/>
                <circle cx="218.5" cy="78.5" r="3" fill="#FFFFFF"/>
                <circle cx="223.5" cy="85.5" r="1.4" fill="#FFFFFF"/>
                <!-- Rosy Cheeks -->
                <ellipse cx="163" cy="96" rx="9" ry="5.5" fill="${s.cheek}" opacity="0.45"/>
                <ellipse cx="237" cy="96" rx="9" ry="5.5" fill="${s.cheek}" opacity="0.45"/>
                <!-- Cute Button Nose -->
                <path d="M 197 89 Q 200 96 205 90" fill="none" stroke="${s.stroke}" stroke-width="3.5" stroke-linecap="round"/>
                <!-- Happy Open Smile -->
                <path d="M 182 104 Q 200 124 218 104 Z" fill="#991B1B" stroke="#0F172A" stroke-width="3.5" stroke-linejoin="round"/>
                <path d="M 190 112 Q 200 119 210 112" fill="#FB7185"/>
            `
        },
        torso: {
            id: 'torso',
            name: 'Torso (Tummy & Chest)',
            shortName: 'Torso',
            zOrder: 5,
            fact: 'Torso! My torso holds my heart and lungs and wears my comfy shirt!',
            cropBox: '126 136 148 148',
            silhouette: `<rect x="142" y="144" width="116" height="128" rx="26" />`,
            path: `
                <!-- Main Rounded T-Shirt Body -->
                <path d="M 154 144 Q 200 140 246 144 Q 260 148 258 170 L 256 264 Q 256 274 244 274 L 156 274 Q 144 274 144 264 L 142 170 Q 140 148 154 144 Z" fill="${o.shirt}" stroke="${o.shirtLine}" stroke-width="4" stroke-linejoin="round"/>
                <!-- Bottom Shirt Hem Ribbing -->
                <rect x="144" y="258" width="112" height="15" rx="6" fill="${o.shirtDark}" stroke="${o.shirtLine}" stroke-width="3.5"/>
                <!-- Crew Neck Collar -->
                <path d="M 174 144 Q 200 165 226 144 Q 200 152 174 144 Z" fill="${o.shirtDark}" stroke="${o.shirtLine}" stroke-width="3.5" stroke-linejoin="round"/>
                <!-- Cheerful Star Emblem -->
                <circle cx="200" cy="202" r="24" fill="rgba(255,255,255,0.22)"/>
                <polygon points="200,180 206,193 220,195 210,205 212,219 200,212 188,219 190,205 180,195 194,193" fill="#FDE047" stroke="#CA8A04" stroke-width="2.8" stroke-linejoin="round"/>
            `
        },
        l_arm: {
            id: 'l_arm',
            name: 'Left Arm',
            zOrder: 3,
            fact: 'Left Arm! Arms help me reach, hug, and carry things!',
            cropBox: '74 138 92 126',
            silhouette: `<path d="M 148 148 Q 112 154 90 238 Q 104 252 118 244 L 152 178 Z" />`,
            path: `
                <!-- Smooth Rounded Forearm -->
                <path d="M 134 172 Q 106 202 88 242 C 85 250 106 258 112 248 Q 128 214 148 184 Z" fill="${s.fill}" stroke="${s.stroke}" stroke-width="4" stroke-linejoin="round"/>
                <!-- Curved T-Shirt Sleeve -->
                <path d="M 152 146 Q 122 150 108 180 L 136 198 Q 148 180 156 168 Z" fill="${o.shirt}" stroke="${o.shirtLine}" stroke-width="4" stroke-linejoin="round"/>
                <line x1="110" y1="176" x2="136" y2="193" stroke="${o.shirtDark}" stroke-width="4" stroke-linecap="round"/>
            `
        },
        r_arm: {
            id: 'r_arm',
            name: 'Right Arm',
            zOrder: 3,
            fact: 'Right Arm! My strong arms help me lift and play!',
            cropBox: '234 138 92 126',
            silhouette: `<path d="M 252 148 Q 288 154 310 238 Q 296 252 282 244 L 248 178 Z" />`,
            path: `
                <!-- Smooth Rounded Forearm -->
                <path d="M 266 172 Q 294 202 312 242 C 315 250 294 258 288 248 Q 272 214 252 184 Z" fill="${s.fill}" stroke="${s.stroke}" stroke-width="4" stroke-linejoin="round"/>
                <!-- Curved T-Shirt Sleeve -->
                <path d="M 248 146 Q 278 150 292 180 L 264 198 Q 252 180 244 168 Z" fill="${o.shirt}" stroke="${o.shirtLine}" stroke-width="4" stroke-linejoin="round"/>
                <line x1="290" y1="176" x2="264" y2="193" stroke="${o.shirtDark}" stroke-width="4" stroke-linecap="round"/>
            `
        },
        l_hand: {
            id: 'l_hand',
            name: 'Left Hand',
            zOrder: 4,
            fact: 'Left Hand! Hands and fingers help me wave, draw, and hold things!',
            cropBox: '60 228 70 70',
            silhouette: `<circle cx="95" cy="262" r="22" />`,
            path: `
                <!-- Cute Rounded Cartoon Hand (Left) -->
                <g transform="translate(96, 258) rotate(22)">
                    <!-- 4 Rounded Fingers -->
                    <rect x="-15" y="-2" width="7.5" height="22" rx="4" fill="${s.fill}" stroke="${s.stroke}" stroke-width="3"/>
                    <rect x="-7"  y="-1" width="7.5" height="25" rx="4" fill="${s.fill}" stroke="${s.stroke}" stroke-width="3"/>
                    <rect x="1"   y="-1" width="7.5" height="24" rx="4" fill="${s.fill}" stroke="${s.stroke}" stroke-width="3"/>
                    <rect x="9"   y="-2" width="7"   height="20" rx="3.5" fill="${s.fill}" stroke="${s.stroke}" stroke-width="3"/>
                    <!-- Thumb -->
                    <rect x="6" y="-12" width="18" height="9" rx="4.5" transform="rotate(25 12 -8)" fill="${s.fill}" stroke="${s.stroke}" stroke-width="3"/>
                    <!-- Soft Rounded Palm -->
                    <ellipse cx="0" cy="-2" rx="16" ry="13" fill="${s.fill}" stroke="${s.stroke}" stroke-width="3.5"/>
                    <path d="M -8 -2 Q 0 4 8 -2" fill="none" stroke="${s.shade}" stroke-width="2.5" stroke-linecap="round"/>
                </g>
            `
        },
        r_hand: {
            id: 'r_hand',
            name: 'Right Hand',
            zOrder: 4,
            fact: 'Right Hand! High five! Hands help us wave hello to friends!',
            cropBox: '270 228 70 70',
            silhouette: `<circle cx="305" cy="262" r="22" />`,
            path: `
                <!-- Cute Rounded Cartoon Hand (Right) -->
                <g transform="translate(304, 258) rotate(-22)">
                    <!-- 4 Rounded Fingers -->
                    <rect x="7.5"  y="-2" width="7.5" height="22" rx="4" fill="${s.fill}" stroke="${s.stroke}" stroke-width="3"/>
                    <rect x="-0.5" y="-1" width="7.5" height="25" rx="4" fill="${s.fill}" stroke="${s.stroke}" stroke-width="3"/>
                    <rect x="-8.5" y="-1" width="7.5" height="24" rx="4" fill="${s.fill}" stroke="${s.stroke}" stroke-width="3"/>
                    <rect x="-16"  y="-2" width="7"   height="20" rx="3.5" fill="${s.fill}" stroke="${s.stroke}" stroke-width="3"/>
                    <!-- Thumb -->
                    <rect x="-24" y="-12" width="18" height="9" rx="4.5" transform="rotate(-25 -12 -8)" fill="${s.fill}" stroke="${s.stroke}" stroke-width="3"/>
                    <!-- Soft Rounded Palm -->
                    <ellipse cx="0" cy="-2" rx="16" ry="13" fill="${s.fill}" stroke="${s.stroke}" stroke-width="3.5"/>
                    <path d="M -8 -2 Q 0 4 8 -2" fill="none" stroke="${s.shade}" stroke-width="2.5" stroke-linecap="round"/>
                </g>
            `
        },
        l_leg: {
            id: 'l_leg',
            name: 'Left Leg',
            zOrder: 1,
            fact: 'Left Leg! My legs help me stand tall, walk, run, and jump!',
            cropBox: '130 264 80 168',
            silhouette: `<rect x="145" y="270" width="52" height="150" rx="22" />`,
            path: `
                <!-- Warm Ankle -->
                <rect x="155" y="382" width="30" height="40" rx="10" fill="${s.fill}" stroke="${s.stroke}" stroke-width="3.5"/>
                <!-- White Crew Sock -->
                <rect x="153" y="398" width="34" height="24" rx="6" fill="#FFFFFF" stroke="#94A3B8" stroke-width="3"/>
                <line x1="155" y1="405" x2="185" y2="405" stroke="${o.shoe}" stroke-width="3"/>
                <!-- Comfy Rounded Jogger / Jeans Leg -->
                <path d="M 146 268 L 200 268 L 194 384 Q 194 392 184 392 L 154 392 Q 144 392 144 384 Z" fill="${o.pants}" stroke="${o.pantsLine}" stroke-width="4" stroke-linejoin="round"/>
                <!-- Pocket & Cuff Detail -->
                <path d="M 146 282 Q 162 296 164 272" fill="none" stroke="${o.pantsLine}" stroke-width="3" stroke-linecap="round"/>
                <rect x="144" y="378" width="50" height="14" rx="6" fill="${o.pantsDark}" stroke="${o.pantsLine}" stroke-width="3"/>
            `
        },
        r_leg: {
            id: 'r_leg',
            name: 'Right Leg',
            zOrder: 1,
            fact: 'Right Leg! Strong legs help us walk and climb stairs!',
            cropBox: '190 264 80 168',
            silhouette: `<rect x="203" y="270" width="52" height="150" rx="22" />`,
            path: `
                <!-- Warm Ankle -->
                <rect x="215" y="382" width="30" height="40" rx="10" fill="${s.fill}" stroke="${s.stroke}" stroke-width="3.5"/>
                <!-- White Crew Sock -->
                <rect x="213" y="398" width="34" height="24" rx="6" fill="#FFFFFF" stroke="#94A3B8" stroke-width="3"/>
                <line x1="215" y1="405" x2="245" y2="405" stroke="${o.shoe}" stroke-width="3"/>
                <!-- Comfy Rounded Jogger / Jeans Leg -->
                <path d="M 200 268 L 254 268 L 256 384 Q 256 392 246 392 L 216 392 Q 206 392 206 384 Z" fill="${o.pants}" stroke="${o.pantsLine}" stroke-width="4" stroke-linejoin="round"/>
                <!-- Pocket & Cuff Detail -->
                <path d="M 254 282 Q 238 296 236 272" fill="none" stroke="${o.pantsLine}" stroke-width="3" stroke-linecap="round"/>
                <rect x="206" y="378" width="50" height="14" rx="6" fill="${o.pantsDark}" stroke="${o.pantsLine}" stroke-width="3"/>
            `
        },
        l_foot: {
            id: 'l_foot',
            name: 'Left Foot',
            zOrder: 2,
            fact: 'Left Foot! Feet help me balance, kick a ball, and wear cool shoes!',
            cropBox: '104 405 92 72',
            silhouette: `<rect x="114" y="418" width="74" height="46" rx="22" />`,
            path: `
                <!-- Cute Rounded Sneaker (Left) -->
                <path d="M 152 416 L 184 416 Q 190 416 190 426 L 190 454 L 114 454 Q 112 432 132 426 L 148 418 Z" fill="${o.shoe}" stroke="${o.shoeLine}" stroke-width="4" stroke-linejoin="round"/>
                <!-- White Toe Cap -->
                <path d="M 114 454 Q 113 434 132 429 Q 138 441 136 454 Z" fill="#FFFFFF" stroke="${o.shoeLine}" stroke-width="3"/>
                <!-- Velcro Straps -->
                <line x1="142" y1="426" x2="156" y2="436" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round"/>
                <line x1="150" y1="421" x2="164" y2="431" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round"/>
                <!-- Thick Cushioned Sneaker Sole -->
                <rect x="110" y="452" width="82" height="13" rx="6.5" fill="#FFFFFF" stroke="#64748B" stroke-width="3.5"/>
            `
        },
        r_foot: {
            id: 'r_foot',
            name: 'Right Foot',
            zOrder: 2,
            fact: 'Right Foot! My feet take me everywhere I want to go!',
            cropBox: '204 405 92 72',
            silhouette: `<rect x="212" y="418" width="74" height="46" rx="22" />`,
            path: `
                <!-- Cute Rounded Sneaker (Right) -->
                <path d="M 248 416 L 216 416 Q 210 416 210 426 L 210 454 L 286 454 Q 288 432 268 426 L 252 418 Z" fill="${o.shoe}" stroke="${o.shoeLine}" stroke-width="4" stroke-linejoin="round"/>
                <!-- White Toe Cap -->
                <path d="M 286 454 Q 287 434 268 429 Q 262 441 264 454 Z" fill="#FFFFFF" stroke="${o.shoeLine}" stroke-width="3"/>
                <!-- Velcro Straps -->
                <line x1="258" y1="426" x2="244" y2="436" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round"/>
                <line x1="250" y1="421" x2="236" y2="431" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round"/>
                <!-- Thick Cushioned Sneaker Sole -->
                <rect x="208" y="452" width="82" height="13" rx="6.5" fill="#FFFFFF" stroke="#64748B" stroke-width="3.5"/>
            `
        }
    };
}

function getLevelParts(lvl) {
    const c = getPartsCatalog();
    if (lvl === 1) {
        return [
            {
                id: 'l_leg',
                name: 'Left Leg',
                zOrder: 1,
                fact: c.l_leg.fact,
                cropBox: '106 262 94 212',
                silhouette: `<path d="M 145 270 L 195 270 L 190 462 L 114 462 Q 114 432 145 424 Z" />`,
                path: c.l_leg.path + c.l_foot.path
            },
            {
                id: 'r_leg',
                name: 'Right Leg',
                zOrder: 1,
                fact: c.r_leg.fact,
                cropBox: '200 262 94 212',
                silhouette: `<path d="M 205 270 L 255 270 L 255 424 Q 286 432 286 462 L 210 462 Z" />`,
                path: c.r_leg.path + c.r_foot.path
            },
            {
                id: 'l_arm',
                name: 'Left Arm',
                zOrder: 3,
                fact: c.l_arm.fact,
                cropBox: '60 138 106 160',
                silhouette: `<path d="M 148 148 Q 108 158 80 268 Q 98 282 114 264 L 152 180 Z" />`,
                path: c.l_arm.path + c.l_hand.path
            },
            {
                id: 'r_arm',
                name: 'Right Arm',
                zOrder: 3,
                fact: c.r_arm.fact,
                cropBox: '234 138 106 160',
                silhouette: `<path d="M 252 148 Q 292 158 320 268 Q 302 282 286 264 L 248 180 Z" />`,
                path: c.r_arm.path + c.r_hand.path
            },
            c.torso,
            c.head
        ];
    }
    // Ordered by zOrder so placed parts layer naturally (Legs -> Feet -> Arms -> Hands -> Torso -> Head)
    return [
        c.l_leg, c.r_leg,
        c.l_foot, c.r_foot,
        c.l_arm, c.r_arm,
        c.l_hand, c.r_hand,
        c.torso, c.head
    ];
}

// --- Level 3: Functional Body Quiz Questions ---
const QUIZ_QUESTIONS = [
    {
        q: "Which body part helps me THINK, SEE, and SMILE? 😊",
        sub: "👉 Tap the Head on the character or choose the card on the right!",
        accept: ['head'],
        options: ['head', 'torso', 'l_foot']
    },
    {
        q: "Which body part helps me WAVE HELLO and DRAW pictures? 👋",
        sub: "👉 Tap a Hand on the character or choose the card!",
        accept: ['l_hand', 'r_hand'],
        options: ['r_hand', 'head', 'l_leg']
    },
    {
        q: "Which body part wears SHOES and kicks a FOOTBALL? ⚽👟",
        sub: "👉 Tap a Foot on the character or choose the card!",
        accept: ['l_foot', 'r_foot'],
        options: ['l_foot', 'torso', 'r_arm']
    },
    {
        q: "Which body part holds my HEART beating inside my chest? ❤️",
        sub: "👉 Tap the Torso (T-Shirt) on the character or choose the card!",
        accept: ['torso'],
        options: ['torso', 'head', 'r_hand']
    },
    {
        q: "Which body part helps me RUN, JUMP, and CLIMB stairs? 🏃",
        sub: "👉 Tap a Leg on the character or choose the card!",
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
        "👉 Tap a card once to highlight where it goes, then tap the glowing outline!",
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
        <!-- Soft Studio Shadow Pedestal -->
        <ellipse cx="200" cy="466" rx="115" ry="18" fill="#BAE6FD" stroke="#7DD3FC" stroke-width="3"/>
    `;

    parts.forEach(part => {
        const isPlaced = placedIds.has(part.id);
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.setAttribute('id', `zone-${part.id}`);

        if (isPlaced) {
            g.innerHTML = part.path;
            g.setAttribute('class', 'placed-svg-part');
            g.addEventListener('click', () => {
                playTone('pickup');
                setPrompt(part.fact, "👉 Tap another part in the tray to keep building!", true);
            });
        } else {
            // Render clean single-shape silhouette instead of messy overlapping internal sub-paths!
            const isTarget = selectedPartId === part.id;
            g.innerHTML = part.silhouette;
            g.setAttribute('class', 'drop-zone' + (isTarget ? ' target-glow' : ''));
            Array.from(g.querySelectorAll('*')).forEach(child => {
                child.setAttribute('fill', isTarget ? 'rgba(254, 240, 138, 0.88)' : 'rgba(224, 242, 254, 0.65)');
                child.setAttribute('stroke', isTarget ? '#D97706' : '#60A5FA');
                child.setAttribute('stroke-dasharray', isTarget ? 'none' : '8 6');
                child.setAttribute('stroke-width', isTarget ? '5' : '3.5');
                child.setAttribute('stroke-linejoin', 'round');
            });

            g.addEventListener('click', () => {
                if (selectedPartId === part.id) {
                    placePart(part.id);
                } else if (selectedPartId) {
                    playTone('error');
                    const selPart = parts.find(p => p.id === selectedPartId);
                    setPrompt(
                        `Look for the glowing yellow outline for the ${selPart.shortName || selPart.name}!`,
                        "👉 Tap the glowing yellow spot on the character!",
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
    setPrompt(`Awesome! ${part.fact}`, "👉 Keep going! Pick the next body part.", true);

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
        c.l_leg, c.r_leg,
        c.l_foot, c.r_foot,
        c.l_arm, c.r_arm,
        c.l_hand, c.r_hand,
        c.torso, c.head
    ];

    bodySvg.innerHTML = `
        <ellipse cx="200" cy="466" rx="115" ry="18" fill="#DDD6FE" stroke="#C4B5FD" stroke-width="3"/>
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
            <div class="piece-svg-wrap" style="width:82px; height:82px; background:#F8FAFC; border-radius:18px; border:3px solid #E2E8F0; padding:6px;">
                <svg viewBox="${part.cropBox}">
                    ${part.path}
                </svg>
            </div>
            <div style="flex:1;">
                <div style="font-family:'Fredoka',sans-serif; font-size:1.4rem; color:#0F172A;">${part.shortName || part.name}</div>
                <div style="font-size:0.98rem; font-weight:800; color:#475569; margin-top:2px;">Tap to select this answer</div>
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
        setPrompt(`Correct! ${tappedPart.fact}`, "🎉 Get ready for the next question!", true);

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
        }, 1900);
    } else {
        playTone('error');
        setPrompt(
            `That's the ${tappedPart.shortName || tappedPart.name}! Let's try again: ${qObj.q}`,
            "👉 Listen carefully and tap the matching body part!",
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

// Boot into Level 1 immediately
startGame(1);
