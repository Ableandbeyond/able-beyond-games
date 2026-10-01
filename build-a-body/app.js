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
    // Modular audio implementation: Try audio file first, fallback to TTS
    if (audioFileUrl) {
        const audio = new Audio(audioFileUrl);
        audio.play().catch(e => {
            console.log("Audio file failed or missing, falling back to TTS", e);
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

// Geometry for 10 distinct parts (viewBox 0 0 400 600)
const partsData = {
    head: { id: 'head', name: 'Head', path: '<ellipse cx="200" cy="100" rx="45" ry="55" fill="#FDE047" stroke="#CA8A04" stroke-width="4"/> <circle cx="185" cy="95" r="5" fill="#000"/> <circle cx="215" cy="95" r="5" fill="#000"/> <path d="M 190 120 Q 200 130 210 120" fill="transparent" stroke="#000" stroke-width="3" stroke-linecap="round"/>' },
    torso: { id: 'torso', name: 'Torso', path: '<rect x="145" y="160" width="110" height="160" rx="20" fill="#60A5FA" stroke="#2563EB" stroke-width="4"/>' },
    l_arm: { id: 'l_arm', name: 'Left Arm', path: '<rect x="95" y="170" width="35" height="130" rx="17.5" fill="#FDE047" stroke="#CA8A04" stroke-width="4" transform="rotate(15, 112, 170)"/>' },
    r_arm: { id: 'r_arm', name: 'Right Arm', path: '<rect x="270" y="170" width="35" height="130" rx="17.5" fill="#FDE047" stroke="#CA8A04" stroke-width="4" transform="rotate(-15, 287, 170)"/>' },
    l_hand: { id: 'l_hand', name: 'Left Hand', path: '<circle cx="70" cy="310" r="22" fill="#FDE047" stroke="#CA8A04" stroke-width="4"/>' },
    r_hand: { id: 'r_hand', name: 'Right Hand', path: '<circle cx="330" cy="310" r="22" fill="#FDE047" stroke="#CA8A04" stroke-width="4"/>' },
    l_leg: { id: 'l_leg', name: 'Left Leg', path: '<rect x="155" y="325" width="40" height="150" rx="20" fill="#34D399" stroke="#059669" stroke-width="4"/>' },
    r_leg: { id: 'r_leg', name: 'Right Leg', path: '<rect x="205" y="325" width="40" height="150" rx="20" fill="#34D399" stroke="#059669" stroke-width="4"/>' },
    l_foot: { id: 'l_foot', name: 'Left Foot', path: '<rect x="135" y="480" width="60" height="35" rx="15" fill="#F87171" stroke="#DC2626" stroke-width="4"/>' },
    r_foot: { id: 'r_foot', name: 'Right Foot', path: '<rect x="205" y="480" width="60" height="35" rx="15" fill="#F87171" stroke="#DC2626" stroke-width="4"/>' },
};

// Level configurations
const levels = {
    1: [
        partsData.head,
        partsData.torso,
        { id: 'arms', name: 'Arms', path: partsData.l_arm.path + partsData.r_arm.path + partsData.l_hand.path + partsData.r_hand.path },
        { id: 'legs', name: 'Legs', path: partsData.l_leg.path + partsData.r_leg.path + partsData.l_foot.path + partsData.r_foot.path }
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
let selectedPartId = null;
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
    
    // Resume audio context on first user interaction
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    initLevel();
}

function initLevel() {
    selectedPartId = null;
    partsPlaced = 0;
    
    const parts = levels[currentLevel];
    totalParts = parts.length;
    
    // 1. Render Drop Zones in SVG Workspace
    bodySvg.innerHTML = '';
    parts.forEach(part => {
        // Create an invisible drop zone hit box by wrapping the path in a group
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.setAttribute('class', 'drop-zone');
        g.setAttribute('id', `zone-${part.id}`);
        g.innerHTML = part.path; // Generates the dashed outline version
        
        // Strip fills and set outline classes via JS
        Array.from(g.children).forEach(child => {
            child.setAttribute('fill', 'transparent');
            child.setAttribute('stroke', '#94A3B8'); // dashed line color
            child.setAttribute('stroke-dasharray', '10 10');
            child.setAttribute('stroke-width', '6');
        });
        
        g.addEventListener('click', () => handleZoneClick(part.id));
        bodySvg.appendChild(g);
    });

    // 2. Render Dock Pieces (Randomized Order)
    dock.innerHTML = '';
    let shuffledParts = [...parts].sort(() => Math.random() - 0.5);
    
    shuffledParts.forEach(part => {
        const piece = document.createElement('div');
        piece.className = 'piece';
        piece.id = `dock-${part.id}`;
        
        // Need to calculate bounding box to scale SVG nicely in dock
        // For simplicity, we just use the same 400x600 viewbox and scale it down via CSS
        piece.innerHTML = `
            <svg viewBox="0 0 400 600" style="width: 100px; height: 150px;">
                ${part.path}
            </svg>
        `;
        
        piece.addEventListener('click', () => selectPart(part.id));
        dock.appendChild(piece);
    });
}

function selectPart(partId) {
    if (selectedPartId === partId) {
        // Deselect
        document.getElementById(`dock-${partId}`).classList.remove('selected');
        selectedPartId = null;
        return;
    }
    
    // Remove previous selection
    if (selectedPartId) {
        document.getElementById(`dock-${selectedPartId}`).classList.remove('selected');
    }
    
    selectedPartId = partId;
    document.getElementById(`dock-${partId}`).classList.add('selected');
    
    // Play a tiny selection blip
    playTone('success'); 
}

function handleZoneClick(zoneId) {
    if (!selectedPartId) return; // Nothing selected
    
    if (selectedPartId === zoneId) {
        // Correct Placement
        placePart(zoneId);
    } else {
        // Wrong Placement - silent fail or gentle error
        playTone('error');
        // Visually shake the zone
        const zone = document.getElementById(`zone-${zoneId}`);
        zone.style.transform = "translateX(5px)";
        setTimeout(() => zone.style.transform = "translateX(-5px)", 100);
        setTimeout(() => zone.style.transform = "translateX(0)", 200);
    }
}

function placePart(partId) {
    // 1. Remove from dock
    const dockPiece = document.getElementById(`dock-${partId}`);
    if (dockPiece) dockPiece.remove();
    selectedPartId = null;
    
    // 2. Fill the drop zone with the actual colored SVG path
    const zone = document.getElementById(`zone-${partId}`);
    const partData = levels[currentLevel].find(p => p.id === partId);
    zone.innerHTML = partData.path; // Restores original colors
    zone.classList.remove('drop-zone'); // removes dashed outline styles
    
    // 3. Audio Feedback (Name the part!)
    playVoice(partData.name, `audio/${partId}.mp3`);
    playTone('success');
    
    // 4. Check Win Condition
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
