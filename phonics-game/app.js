// --- 1. Audio Architecture & Mnemonic Map ---
// Editable audio mapping for future .mp3/.wav replacement
const audioMap = {
    's': { sound: 'ssss', mnemonic: '🐍' },
    'a': { sound: 'ah', mnemonic: '🍎' },
    't': { sound: 'tuh', mnemonic: '🗼' },
    'p': { sound: 'puh', mnemonic: '🏴‍☠️' },
    'i': { sound: 'ih', mnemonic: '🐛' },
    'n': { sound: 'n', mnemonic: '🥅' }
};

const wordsList = [
    ['s', 'a', 't'],
    ['p', 'i', 'n'],
    ['p', 'a', 't'],
    ['t', 'i', 'n'],
    ['n', 'i', 'p'],
    ['p', 'i', 't']
];

// --- 2. State Management ---
let isFredMode = false;
let currentWordIndex = 0;
let currentWordProgress = 0;
const debounceTime = 1500; // 1.5 seconds cool-down

// Student Tracker State
let students = JSON.parse(localStorage.getItem('phonicsStudents')) || [
    { id: 1, name: 'Student 1', scores: {} },
    { id: 2, name: 'Student 2', scores: {} },
    { id: 3, name: 'Student 3', scores: {} },
    { id: 4, name: 'Student 4', scores: {} },
    { id: 5, name: 'Student 5', scores: {} },
    { id: 6, name: 'Student 6', scores: {} }
];

// --- 3. DOM Elements ---
const gridModeEl = document.getElementById('grid-mode');
const fredModeEl = document.getElementById('fred-mode');
const modeToggle = document.getElementById('mode-toggle');
const modeLabel = document.getElementById('mode-label');
const soundGrid = document.getElementById('sound-grid');
const blendingGrid = document.getElementById('blending-grid');
const nextWordBtn = document.getElementById('next-word-btn');
const rewardStar = document.getElementById('reward-star');
const rewardAnimation = document.getElementById('reward-animation');
const studentsContainer = document.getElementById('students-container');
const panelToggle = document.getElementById('panel-toggle');
const teacherPanel = document.getElementById('teacher-panel');
const panelChevron = document.getElementById('panel-chevron');
const resetDataBtn = document.getElementById('reset-data-btn');

// --- 4. Audio Engine ---
function playSound(text) {
    // If you add direct links to custom .mp3 later, you can replace this block:
    // const audio = new Audio(`sounds/${text}.mp3`);
    // audio.play();
    
    // Fallback to Native Web Audio API / window.speechSynthesis
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8;
        utterance.pitch = 1.2;
        window.speechSynthesis.cancel(); // stop any current audio
        window.speechSynthesis.speak(utterance);
    }
}

// --- 5. UI Renderers ---

// Create a Card
function createCard(letter, isBlending = false, targetIndex = -1) {
    const card = document.createElement('button');
    card.className = 'sound-card';
    card.innerHTML = `
        <span class="mnemonic-icon">${audioMap[letter].mnemonic}</span>
        <span class="letter-text text-blue-600">${letter}</span>
    `;

    card.addEventListener('click', (e) => {
        if (card.getAttribute('data-cooling') === 'true') return;

        // Apply debounce
        card.setAttribute('data-cooling', 'true');
        setTimeout(() => {
            if(document.body.contains(card)) card.setAttribute('data-cooling', 'false');
        }, debounceTime);

        // Visual feedback
        card.classList.add('active-highlight');
        setTimeout(() => card.classList.remove('active-highlight'), 500);

        if (!isBlending) {
            playSound(audioMap[letter].sound);
        } else {
            handleBlendingClick(card, letter, targetIndex);
        }
    });

    return card;
}

// Render Sound Grid
function renderSoundGrid() {
    soundGrid.innerHTML = '';
    Object.keys(audioMap).forEach(letter => {
        soundGrid.appendChild(createCard(letter));
    });
}

// Render Blending Word
function renderBlendingWord() {
    blendingGrid.innerHTML = '';
    currentWordProgress = 0;
    nextWordBtn.classList.add('hidden');
    
    const word = wordsList[currentWordIndex];
    
    // Shuffle the cards visually to make it a game? Or present them in order?
    // RWI usually presents them in a jumbled state, or in order to just tap and blend.
    // Let's present them in order for now to tap left-to-right.
    word.forEach((letter, index) => {
        const card = createCard(letter, true, index);
        card.dataset.index = index;
        blendingGrid.appendChild(card);
    });
}

// Handle logic when a card in blending mode is clicked
function handleBlendingClick(card, letter, targetIndex) {
    if (targetIndex === currentWordProgress) {
        // Correct tap
        playSound(audioMap[letter].sound);
        card.classList.add('blended-success');
        card.setAttribute('data-cooling', 'true'); // lock it
        currentWordProgress++;

        if (currentWordProgress === wordsList[currentWordIndex].length) {
            // Word blended!
            setTimeout(() => triggerReward(wordsList[currentWordIndex].join('')), 1000);
        }
    } else {
        // Wrong tap (too early)
        card.classList.add('border-red-400');
        setTimeout(() => card.classList.remove('border-red-400'), 500);
    }
}

// Trigger Success Reward
function triggerReward(wordText) {
    // Play full word
    setTimeout(() => playSound(wordText), 500);

    // Show animation
    rewardAnimation.classList.remove('opacity-0');
    rewardStar.classList.add('animate-reward');
    
    setTimeout(() => {
        rewardAnimation.classList.add('opacity-0');
        rewardStar.classList.remove('animate-reward');
        nextWordBtn.classList.remove('hidden');
    }, 2000);
}

// --- 6. Teacher Progress Tracker ---
function saveStudents() {
    localStorage.setItem('phonicsStudents', JSON.stringify(students));
}

function renderTracker() {
    studentsContainer.innerHTML = '';
    students.forEach((student, index) => {
        const div = document.createElement('div');
        div.className = 'bg-white border rounded-lg p-3 shadow-sm';
        
        div.innerHTML = `
            <div class="flex items-center gap-2 mb-2">
                <input type="text" value="${student.name}" class="font-bold text-slate-700 bg-transparent border-b border-dashed border-slate-300 focus:outline-none focus:border-blue-500 w-full" data-index="${index}">
            </div>
            <div class="grid grid-cols-6 gap-1">
                ${Object.keys(audioMap).map(letter => {
                    const status = student.scores[letter] || 0; // 0: none, 1: rec, 2: blended
                    let bgClass = 'bg-slate-100 text-slate-400';
                    if (status === 1) bgClass = 'bg-yellow-200 text-yellow-800 border-yellow-400';
                    if (status === 2) bgClass = 'bg-green-200 text-green-800 border-green-500';
                    
                    return `
                        <button class="text-xs font-bold py-1 rounded border border-slate-200 ${bgClass} transition-colors" data-student="${index}" data-letter="${letter}">
                            ${letter}
                        </button>
                    `;
                }).join('')}
            </div>
        `;
        studentsContainer.appendChild(div);
    });

    // Add event listeners for inputs
    studentsContainer.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', (e) => {
            students[e.target.dataset.index].name = e.target.value;
            saveStudents();
        });
    });

    // Add event listeners for score buttons
    studentsContainer.querySelectorAll('button[data-student]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const studentIdx = e.target.dataset.student;
            const letter = e.target.dataset.letter;
            let currentScore = students[studentIdx].scores[letter] || 0;
            currentScore = (currentScore + 1) % 3; // Cycle: 0 -> 1 -> 2 -> 0
            students[studentIdx].scores[letter] = currentScore;
            saveStudents();
            renderTracker();
        });
    });
}

resetDataBtn.addEventListener('click', () => {
    if(confirm('Are you sure you want to reset all student progress?')) {
        students.forEach(s => s.scores = {});
        saveStudents();
        renderTracker();
    }
});


// --- 7. Event Listeners & Initialization ---

modeToggle.addEventListener('change', (e) => {
    isFredMode = e.target.checked;
    if (isFredMode) {
        modeLabel.textContent = 'Blendy Blending';
        gridModeEl.classList.add('hidden');
        fredModeEl.classList.remove('hidden');
        fredModeEl.classList.add('flex');
        renderBlendingWord();
    } else {
        modeLabel.textContent = 'Sound Grid';
        gridModeEl.classList.remove('hidden');
        fredModeEl.classList.add('hidden');
        fredModeEl.classList.remove('flex');
    }
});

nextWordBtn.addEventListener('click', () => {
    currentWordIndex = (currentWordIndex + 1) % wordsList.length;
    renderBlendingWord();
});

panelToggle.addEventListener('click', () => {
    teacherPanel.classList.toggle('translate-y-[calc(100%-4rem)]');
    panelChevron.style.transform = teacherPanel.classList.contains('translate-y-[calc(100%-4rem)]') ? 'rotate(0deg)' : 'rotate(180deg)';
});

// Initialize
renderSoundGrid();
renderTracker();
