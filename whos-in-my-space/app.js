// Default Roster Template
function getEmptyCard() {
    return { 
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5), 
        name: '', 
        role: '', 
        emoji: '👋', 
        isHere: true, 
        isAvailable: true 
    };
}

let defaultStaff = [
    { id: '1', name: '', role: '', emoji: '👋', isHere: true, isAvailable: true },
    { id: '2', name: '', role: '', emoji: '👋', isHere: true, isAvailable: true },
    { id: '3', name: '', role: '', emoji: '👋', isHere: true, isAvailable: true },
    { id: '4', name: '', role: '', emoji: '👋', isHere: true, isAvailable: true }
];

// Determine emoji based on position keywords
function getEmojiForRole(role) {
    if (!role) return '👋';
    const r = role.toLowerCase();
    
    // Medical / Health
    if (r.includes('nurse') || r.includes('medical') || r.includes('first aid') || r.includes('health')) return '🧑‍⚕️';
    
    // Therapy
    if (r.includes('therap') || r.includes('speech') || r.includes('ot') || r.includes('physio') || r.includes('salt')) return '🧩';
    
    // Leadership
    if (r.includes('head') || r.includes('principal') || r.includes('senco') || r.includes('director')) return '🧑‍💼';
    
    // Teachers & Support
    if (r.includes('teacher')) return '🧑‍🏫';
    if (r.includes('assist') || r.includes('ta ') || r.includes('support') || r.includes('lsa') || r.includes('hlta')) return '🤝';
    
    // Other Staff
    if (r.includes('clean') || r.includes('janitor') || r.includes('caretaker')) return '🧹';
    if (r.includes('cook') || r.includes('chef') || r.includes('food') || r.includes('dinner')) return '🧑‍🍳';
    if (r.includes('music')) return '🎵';
    if (r.includes('sport') || r.includes('pe ') || r.includes('gym')) return '⚽';
    if (r.includes('art')) return '🎨';
    if (r.includes('bus') || r.includes('driver')) return '🚌';
    if (r.includes('office') || r.includes('admin') || r.includes('reception')) return '🏢';
    if (r.includes('play')) return '⚽';
    
    return '👋';
}

let staff = JSON.parse(localStorage.getItem('whosInMySpaceStaff_V4')) || defaultStaff;
let lowStimMode = JSON.parse(localStorage.getItem('lowStimMode_V4')) || false;

// DOM Elements
const activeContainer = document.getElementById('active-staff-container');
const benchContainer = document.getElementById('bench-staff-container');
const stimBtn = document.getElementById('toggle-stim-btn');
const addStaffBtn = document.getElementById('add-staff-btn');
const resetBtn = document.getElementById('reset-board-btn');
const actionBtns = document.querySelectorAll('#quick-filters button');
const dropzones = document.querySelectorAll('.dropzone');

// Initialize
function init() {
    applyStimMode();
    renderBoard();
    setupDragAndDrop();
    setupGlobalEventListeners();
}

function saveState() {
    localStorage.setItem('whosInMySpaceStaff_V4', JSON.stringify(staff));
    localStorage.setItem('lowStimMode_V4', JSON.stringify(lowStimMode));
}

// Render the main board
function renderBoard() {
    activeContainer.innerHTML = '';
    benchContainer.innerHTML = '';

    const template = document.getElementById('staff-card-template');

    staff.forEach(person => {
        const clone = template.content.cloneNode(true);
        const card = clone.querySelector('.staff-card');
        
        card.dataset.id = person.id;
        card.dataset.role = person.role || '';
        
        // Populate inputs
        const emojiInput = clone.querySelector('.emoji-avatar-input');
        emojiInput.value = person.emoji;
        
        const nameInput = clone.querySelector('.name-input');
        nameInput.value = person.name;

        const roleInput = clone.querySelector('.role-input');
        roleInput.value = person.role;

        const statusBtn = clone.querySelector('.status-indicator');
        statusBtn.classList.add(person.isAvailable ? 'status-available' : 'status-busy');

        // Setup individual card events
        
        // Emoji Input (sets flag if they manually changed it)
        emojiInput.addEventListener('input', (e) => {
            person.emoji = e.target.value;
            person.emojiManuallySet = true; // flag to stop auto-updating
            saveState();
        });

        // Name Input
        nameInput.addEventListener('input', (e) => {
            person.name = e.target.value;
            saveState();
        });

        // Role Input + Auto Emoji + TTS
        let typingTimer;
        roleInput.addEventListener('input', (e) => {
            const newRole = e.target.value;
            person.role = newRole;
            card.dataset.role = newRole;

            // Auto-update emoji unless they manually set one
            if (!person.emojiManuallySet) {
                const suggestedEmoji = getEmojiForRole(newRole);
                person.emoji = suggestedEmoji;
                emojiInput.value = suggestedEmoji;
            }
            saveState();

            // Speak the word they are typing
            clearTimeout(typingTimer);
            typingTimer = setTimeout(() => {
                if (newRole.trim().length > 0 && !lowStimMode) {
                    speakText(newRole);
                }
            }, 800);
        });

        // Toggle Status
        statusBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent drag
            person.isAvailable = !person.isAvailable;
            statusBtn.classList.toggle('status-available', person.isAvailable);
            statusBtn.classList.toggle('status-busy', !person.isAvailable);
            saveState();
        });

        // Delete Card
        const delBtn = clone.querySelector('.delete-card-btn');
        delBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            staff = staff.filter(p => p.id !== person.id);
            saveState();
            card.remove();
        });

        // Speak Full Card
        const speakBtn = clone.querySelector('.speak-btn');
        speakBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!lowStimMode) {
                const text = `Hello. I am ${person.name || 'a helper'}. I am a ${person.role || 'staff member'}.`;
                speakText(text);
            }
        });

        // Prevent drag when interacting with inputs
        const inputs = clone.querySelectorAll('input, button');
        inputs.forEach(inp => {
            inp.addEventListener('mousedown', (e) => {
                card.setAttribute('draggable', false);
            });
            inp.addEventListener('mouseup', (e) => {
                card.setAttribute('draggable', true);
            });
            inp.addEventListener('focus', (e) => {
                card.setAttribute('draggable', false);
            });
            inp.addEventListener('blur', (e) => {
                card.setAttribute('draggable', true);
            });
        });

        if (person.isHere) {
            activeContainer.appendChild(clone);
        } else {
            benchContainer.appendChild(clone);
        }
    });

    setupDragAndDrop();
}

// Drag and Drop Logic
function setupDragAndDrop() {
    const cards = document.querySelectorAll('.staff-card');
    
    cards.forEach(card => {
        card.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', card.dataset.id);
            setTimeout(() => card.style.opacity = '0.5', 0);
        });
        
        card.addEventListener('dragend', () => {
            card.style.opacity = '1';
        });
    });

    dropzones.forEach(zone => {
        zone.addEventListener('dragover', e => {
            e.preventDefault();
        });

        zone.addEventListener('drop', e => {
            e.preventDefault();
            const id = e.dataTransfer.getData('text/plain');
            const targetZone = zone.dataset.zone;
            
            const personIndex = staff.findIndex(p => p.id === id);
            if (personIndex > -1) {
                staff[personIndex].isHere = (targetZone === 'active');
                saveState();
                renderBoard(); // re-render to move element
            }
        });
    });
}

function speakText(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); 
        const msg = new SpeechSynthesisUtterance(text);
        msg.rate = 0.85; 
        msg.pitch = 1.1; 

        const voices = window.speechSynthesis.getVoices();
        const friendlyVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Google UK English Female'));
        if (friendlyVoice) msg.voice = friendlyVoice;

        window.speechSynthesis.speak(msg);
    }
}

// Global UI Events
function setupGlobalEventListeners() {
    // Action / Needs Bar
    actionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            const textContent = btn.textContent.replace(/[^\w\s]/g, '').trim();
            const cards = document.querySelectorAll('.staff-card');
            
            if (action === 'reset') {
                cards.forEach(card => card.classList.remove('dimmed'));
                return;
            }

            // Speak the need
            if(!lowStimMode) speakText(textContent);

            // Highlight relevant staff
            cards.forEach(card => {
                const r = (card.dataset.role || '').toLowerCase();
                let isMatch = false;
                
                if (action === 'toilet' || action === 'snack' || action === 'help') {
                    if (r.includes('assist') || r.includes('ta ') || r.includes('support') || r.includes('teacher') || r.includes('care')) {
                        isMatch = true; 
                    }
                } else if (action === 'nurse') {
                    if (r.includes('nurse') || r.includes('medical') || r.includes('first aid')) {
                        isMatch = true;
                    }
                } else if (action === 'break') {
                    if (r.includes('support') || r.includes('ta') || r.includes('therap') || r.includes('senco')) {
                        isMatch = true;
                    }
                }

                if (isMatch && card.closest('#active-room')) {
                    card.classList.remove('dimmed');
                } else {
                    card.classList.add('dimmed');
                }
            });
        });
    });

    stimBtn.addEventListener('click', () => {
        lowStimMode = !lowStimMode;
        applyStimMode();
        saveState();
    });

    addStaffBtn.addEventListener('click', () => {
        staff.push(getEmptyCard());
        saveState();
        renderBoard();
    });

    resetBtn.addEventListener('click', () => {
        if(confirm("Clear all names and move everyone to the bench?")) {
            staff = [
                getEmptyCard(), getEmptyCard(), getEmptyCard(), getEmptyCard(), getEmptyCard(), getEmptyCard()
            ];
            staff.forEach(p => p.isHere = false); // move all to bench
            saveState();
            renderBoard();
        }
    });
}

function applyStimMode() {
    if (lowStimMode) {
        document.body.classList.add('low-stim');
        stimBtn.textContent = '☀️ Standard Mode';
    } else {
        document.body.classList.remove('low-stim');
        stimBtn.textContent = '🌙 Low Stim Mode';
    }
}

// Run
init();
