// Data and Configuration
const SHAPES = {
    triangle: {
        name: 'Triangle',
        color: '#22c55e', // Green
        svg: `<svg class="shape-svg" viewBox="0 0 100 100"><polygon points="50,10 90,90 10,90" fill="#22c55e" stroke="#166534" stroke-width="2" stroke-linejoin="round"/></svg>`,
        traceSvg: `<svg class="trace-svg" viewBox="0 0 100 100"><polygon points="50,10 90,90 10,90" fill="none" stroke="#16a34a" stroke-width="6" stroke-dasharray="6,6" stroke-linejoin="round"/></svg>`,
        countSvg: `<svg class="count-svg" viewBox="0 0 100 100"><polygon points="50,10 90,90 10,90" fill="#bbf7d0" stroke="#22c55e" stroke-width="4" stroke-linejoin="round"/></svg>`,
        dots: [
            { x: 50, y: 10 },
            { x: 90, y: 90 },
            { x: 10, y: 90 }
        ]
    },
    square: {
        name: 'Square',
        color: '#3b82f6', // Blue
        svg: `<svg class="shape-svg" viewBox="0 0 100 100"><rect x="15" y="15" width="70" height="70" fill="#3b82f6" stroke="#1e3a8a" stroke-width="2" rx="4"/></svg>`,
        traceSvg: `<svg class="trace-svg" viewBox="0 0 100 100"><rect x="15" y="15" width="70" height="70" fill="none" stroke="#2563eb" stroke-width="6" stroke-dasharray="6,6" rx="4"/></svg>`,
        countSvg: `<svg class="count-svg" viewBox="0 0 100 100"><rect x="15" y="15" width="70" height="70" fill="#bfdbfe" stroke="#3b82f6" stroke-width="4" rx="4"/></svg>`,
        dots: [
            { x: 15, y: 15 },
            { x: 85, y: 15 },
            { x: 85, y: 85 },
            { x: 15, y: 85 }
        ]
    },
    circle: {
        name: 'Circle',
        color: '#ef4444', // Red
        svg: `<svg class="shape-svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#ef4444" stroke="#7f1d1d" stroke-width="2"/></svg>`,
        traceSvg: `<svg class="trace-svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#dc2626" stroke-width="6" stroke-dasharray="6,6"/></svg>`,
        countSvg: `<svg class="count-svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#fecaca" stroke="#ef4444" stroke-width="4"/></svg>`,
        dots: [
            { x: 50, y: 10 },
            { x: 90, y: 50 },
            { x: 50, y: 90 },
            { x: 10, y: 50 }
        ]
    },
    rectangle: {
        name: 'Rectangle',
        color: '#facc15', // Yellow
        svg: `<svg class="shape-svg" viewBox="0 0 100 100"><rect x="10" y="25" width="80" height="50" fill="#facc15" stroke="#713f12" stroke-width="2" rx="4"/></svg>`,
        traceSvg: `<svg class="trace-svg" viewBox="0 0 100 100"><rect x="10" y="25" width="80" height="50" fill="none" stroke="#ca8a04" stroke-width="6" stroke-dasharray="6,6" rx="4"/></svg>`,
        countSvg: `<svg class="count-svg" viewBox="0 0 100 100"><rect x="10" y="25" width="80" height="50" fill="#fef08a" stroke="#facc15" stroke-width="4" rx="4"/></svg>`,
        dots: [
            { x: 10, y: 25 },
            { x: 90, y: 25 },
            { x: 90, y: 75 },
            { x: 10, y: 75 }
        ]
    }
};

let currentShape = 'triangle';
let currentStep = '1';

// DOM Elements
const navBtns = document.querySelectorAll('.nav-shape-btn');
const stepBtns = document.querySelectorAll('.step-tab-btn');
const viewports = document.querySelectorAll('.viewport');
const makatonCards = document.querySelectorAll('.makaton-card');

// Step 1 Elements
const matchNameEl = document.getElementById('match-target-name');
let matchOption1 = document.getElementById('match-option-1');
let matchOption2 = document.getElementById('match-option-2');
const aacBtn = document.getElementById('aac-btn');

// Step 2 Elements
const canvas = document.getElementById('drawing-canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const clearBtn = document.getElementById('clear-canvas-btn');
const traceTemplateContainer = document.getElementById('trace-template-container');
const canvasContainer = document.getElementById('canvas-container');

// Step 3 Elements
const countShapeContainer = document.getElementById('count-shape-container');

// Audio Helpers
function playChime() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const audioCtx = new AudioContext();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
        osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
        console.log("Audio API issue", e);
    }
}

function speak(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.85;
        utterance.pitch = 1.1;
        window.speechSynthesis.speak(utterance);
    }
}

// Initialization
function init() {
    setupEventListeners();
    updateUI();
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
}

function setupEventListeners() {
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentShape = btn.dataset.shape;
            updateUI();
            if(currentStep === '2') clearCanvas();
        });
    });

    stepBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentStep = btn.dataset.step;
            updateUI();
        });
    });

    makatonCards.forEach(card => {
        card.addEventListener('click', () => {
            playChime();
            card.classList.add('makaton-active');
            setTimeout(() => card.classList.remove('makaton-active'), 1000);
        });
    });

    aacBtn.addEventListener('click', () => {
        speak(SHAPES[currentShape].name);
    });

    clearBtn.addEventListener('click', clearCanvas);

    // Canvas drawing
    setupCanvasDrawing();
}

function updateUI() {
    // Update Title
    const titleEl = document.getElementById('current-shape-title');
    if (titleEl) titleEl.textContent = SHAPES[currentShape].name;
    
    // Update Nav Buttons
    navBtns.forEach(btn => {
        if (btn.dataset.shape === currentShape) {
            btn.classList.add('opacity-100', 'ring-4', 'ring-offset-2', 'ring-gray-400');
            btn.classList.remove('opacity-70');
        } else {
            btn.classList.remove('opacity-100', 'ring-4', 'ring-offset-2', 'ring-gray-400');
            btn.classList.add('opacity-70');
        }
    });

    // Update Step Tabs
    stepBtns.forEach(btn => {
        if (btn.dataset.step === currentStep) {
            btn.classList.add('bg-indigo-600', 'text-white', 'border-indigo-800');
            btn.classList.remove('bg-white', 'text-gray-600', 'border-gray-200');
        } else {
            btn.classList.remove('bg-indigo-600', 'text-white', 'border-indigo-800');
            btn.classList.add('bg-white', 'text-gray-600', 'border-gray-200');
        }
    });

    // Show active viewport
    viewports.forEach(vp => {
        if (vp.id === `viewport-step-${currentStep}`) {
            vp.classList.remove('hidden');
            vp.classList.add('active');
        } else {
            vp.classList.add('hidden');
            vp.classList.remove('active');
        }
    });

    // Update specific step content
    if (currentStep === '1') setupStep1();
    if (currentStep === '2') setupStep2();
    if (currentStep === '3') setupStep3();
}

function setupStep1() {
    // Refresh DOM elements in case they were replaced
    matchOption1 = document.getElementById('match-option-1');
    matchOption2 = document.getElementById('match-option-2');

    const activeShapeData = SHAPES[currentShape];
    matchNameEl.textContent = activeShapeData.name;
    matchNameEl.className = "uppercase text-" + activeShapeData.name.toLowerCase(); // Just keep uppercase
    matchNameEl.style.color = activeShapeData.color;

    // Pick a wrong shape
    const shapeKeys = Object.keys(SHAPES);
    let wrongShapeKey = currentShape;
    while (wrongShapeKey === currentShape) {
        wrongShapeKey = shapeKeys[Math.floor(Math.random() * shapeKeys.length)];
    }

    const wrongShapeData = SHAPES[wrongShapeKey];

    // Randomize placement
    const isCorrectFirst = Math.random() > 0.5;
    
    matchOption1.innerHTML = isCorrectFirst ? activeShapeData.svg : wrongShapeData.svg;
    matchOption2.innerHTML = isCorrectFirst ? wrongShapeData.svg : activeShapeData.svg;

    // Use standard onclick to avoid cloneNode issues accumulating
    matchOption1.onclick = () => handleMatchClick(isCorrectFirst, matchOption1);
    matchOption2.onclick = () => handleMatchClick(!isCorrectFirst, matchOption2);
}

function handleMatchClick(isCorrect, element) {
    if (isCorrect) {
        speak("Great job!");
        confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: [SHAPES[currentShape].color, '#ffffff', '#fcd34d']
        });
        setTimeout(setupStep1, 2000); // refresh after 2s
    } else {
        speak("Try again");
        element.classList.add('shake');
        setTimeout(() => element.classList.remove('shake'), 600);
    }
}

function setupStep2() {
    traceTemplateContainer.innerHTML = SHAPES[currentShape].traceSvg;
    // Resize is handled globally, but let's ensure it's sized correctly after unhiding
    setTimeout(resizeCanvas, 50);
}

let isDrawing = false;
let lastX = 0;
let lastY = 0;

function resizeCanvas() {
    if(currentStep !== '2') return;
    const rect = canvasContainer.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 15;
    ctx.strokeStyle = SHAPES[currentShape].color;
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function setupCanvasDrawing() {
    function getMousePos(e) {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }

    function startDraw(e) {
        e.preventDefault();
        isDrawing = true;
        const pos = getMousePos(e);
        lastX = pos.x;
        lastY = pos.y;
    }

    function draw(e) {
        if (!isDrawing) return;
        e.preventDefault();
        const pos = getMousePos(e);
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        lastX = pos.x;
        lastY = pos.y;
    }

    function endDraw(e) {
        e.preventDefault();
        isDrawing = false;
    }

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', endDraw);
    canvas.addEventListener('mouseout', endDraw);

    canvas.addEventListener('touchstart', startDraw, {passive: false});
    canvas.addEventListener('touchmove', draw, {passive: false});
    canvas.addEventListener('touchend', endDraw, {passive: false});
    canvas.addEventListener('touchcancel', endDraw, {passive: false});
}

function setupStep3() {
    const data = SHAPES[currentShape];
    countShapeContainer.innerHTML = data.countSvg;
    
    // Add dots
    data.dots.forEach((dot, index) => {
        const dotEl = document.createElement('div');
        dotEl.className = 'counting-dot';
        dotEl.style.left = \`\${dot.x}%\`;
        dotEl.style.top = \`\${dot.y}%\`;
        dotEl.dataset.number = index + 1;
        
        dotEl.addEventListener('click', function() {
            if(!this.classList.contains('active')) {
                this.classList.add('active');
                this.textContent = this.dataset.number;
                speak(this.dataset.number);
            }
        });

        countShapeContainer.appendChild(dotEl);
    });
}

// Start
init();
