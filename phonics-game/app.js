// --- 1. Database Configuration ---
const rwiPhonicsData = {
    set1: {
      sounds: ['m','a','s','d','t','i','n','p','g','o','c','k','u','b','f','e','l','h','sh','r','j','v','y','w','th','z','ch','qu','x','ng','nk'],
      words: ['mat','sat','sad','mad','dad','pin','pit','tin','tan','net','pan','gap','top','cat','cot','kit','mud','up','cup','bad','bed','fin','fish','ship','shop','thin','thick','chop','chat','quit','quiz','sing','bang','think','wink']
    },
    set2: {
      sounds: ['ay','ee','igh','ow','oo_long','oo_short','ar','or','air','ir','ou','oy'],
      words: ['play','may','way','see','tree','green','night','high','light','blow','snow','show','zoo','spoon','pool','look','book','foot','car','start','part','door','sort','short','fair','hair','stair','girl','bird','twirl','shout','out','loud','toy','boy','enjoy']
    },
    set3: {
      sounds: ['ea','oi','a-e','i-e','o-e','u-e','aw','are','ur','er','ow_brown','ai','oa','ew'],
      words: ['clean','dream','seat','spoil','coin','voice','make','cake','late','smile','nice','hide','home','hope','spoke','huge','brute','use','dawn','saw','crawl','share','care','dare','burn','nurse','purse','never','better','letter','brown','cow','town','snail','rain','train','goat','boat','road','chew','new','grew']
    }
};

// --- 2. Audio Synthesis Mapping ---
// Each sound maps to a phonetic spelling for TTS, a visual mnemonic emoji, and a display string.
const audioMap = {
    // Set 1
    'm': { sound: 'm', mnemonic: '⛰️', display: 'm' },
    'a': { sound: 'a', mnemonic: '🍎', display: 'a' },
    's': { sound: 's', mnemonic: '🐍', display: 's' },
    'd': { sound: 'd', mnemonic: '🦖', display: 'd' },
    't': { sound: 't', mnemonic: '🗼', display: 't' },
    'i': { sound: 'i', mnemonic: '🐛', display: 'i' },
    'n': { sound: 'n', mnemonic: '🥅', display: 'n' },
    'p': { sound: 'p', mnemonic: '🏴‍☠️', display: 'p' },
    'g': { sound: 'g', mnemonic: '👧', display: 'g' },
    'o': { sound: 'o', mnemonic: '🍊', display: 'o' },
    'c': { sound: 'kuh', mnemonic: '🐛', display: 'c' },
    'k': { sound: 'kuh', mnemonic: '🦘', display: 'k' },
    'u': { sound: 'u', mnemonic: '☂️', display: 'u' },
    'b': { sound: 'b', mnemonic: '👢', display: 'b' },
    'f': { sound: 'f', mnemonic: '🌻', display: 'f' },
    'e': { sound: 'e', mnemonic: '🥚', display: 'e' },
    'l': { sound: 'l', mnemonic: '🦵', display: 'l' },
    'h': { sound: 'h', mnemonic: '🐎', display: 'h' },
    'sh': { sound: 'sh', mnemonic: '🤫', display: 'sh' },
    'r': { sound: 'r', mnemonic: '🤖', display: 'r' },
    'j': { sound: 'j', mnemonic: '📦', display: 'j' },
    'v': { sound: 'v', mnemonic: '🦅', display: 'v' },
    'y': { sound: 'y', mnemonic: '🐂', display: 'y' },
    'w': { sound: 'w', mnemonic: '🪱', display: 'w' },
    'th': { sound: 'th', mnemonic: '👍', display: 'th' },
    'z': { sound: 'z', mnemonic: '🤐', display: 'z' },
    'ch': { sound: 'ch', mnemonic: '🚂', display: 'ch' },
    'qu': { sound: 'kw', mnemonic: '👑', display: 'qu' },
    'x': { sound: 'ks', mnemonic: '🦊', display: 'x' },
    'ng': { sound: 'ng', mnemonic: '💍', display: 'ng' },
    'nk': { sound: 'nk', mnemonic: '🚰', display: 'nk' },
    
    // Set 2
    'ay': { sound: 'ay', mnemonic: '🕹️', display: 'ay' },
    'ee': { sound: 'ee', mnemonic: '👀', display: 'ee' },
    'igh': { sound: 'igh', mnemonic: '🌃', display: 'igh' },
    'ow': { sound: 'ow', mnemonic: '❄️', display: 'ow' },
    'oo_long': { sound: 'oo', mnemonic: '🦁', display: 'oo' },
    'oo_short': { sound: 'oo', mnemonic: '📖', display: 'oo' },
    'ar': { sound: 'ar', mnemonic: '🚗', display: 'ar' },
    'or': { sound: 'or', mnemonic: '🚪', display: 'or' },
    'air': { sound: 'air', mnemonic: '💇', display: 'air' },
    'ir': { sound: 'er', mnemonic: '🐦', display: 'ir' },
    'ou': { sound: 'ow', mnemonic: '🗣️', display: 'ou' },
    'oy': { sound: 'oy', mnemonic: '🧸', display: 'oy' },
    
    // Set 3
    'ea': { sound: 'ee', mnemonic: '☕', display: 'ea' },
    'oi': { sound: 'oy', mnemonic: '🗑️', display: 'oi' },
    'a-e': { sound: 'ay', mnemonic: '🎂', display: 'a-e' },
    'i-e': { sound: 'igh', mnemonic: '😃', display: 'i-e' },
    'o-e': { sound: 'oh', mnemonic: '🏠', display: 'o-e' },
    'u-e': { sound: 'yoo', mnemonic: '🐘', display: 'u-e' },
    'aw': { sound: 'aw', mnemonic: '🥱', display: 'aw' },
    'are': { sound: 'air', mnemonic: '🤝', display: 'are' },
    'ur': { sound: 'er', mnemonic: '👩‍⚕️', display: 'ur' },
    'er': { sound: 'er', mnemonic: '✉️', display: 'er' },
    'ow_brown': { sound: 'ow', mnemonic: '🐄', display: 'ow' },
    'ai': { sound: 'ay', mnemonic: '🐌', display: 'ai' },
    'oa': { sound: 'oh', mnemonic: '🐐', display: 'oa' },
    'ew': { sound: 'oo', mnemonic: '🍬', display: 'ew' }
};

// --- 3. State Management ---
let currentSetKey = 'set1';
let isBlendyMode = false;
let currentWordIndex = 0;
let currentWordProgress = 0;
const debounceTime = 1500; 

// --- 4. DOM Elements ---
const gridModeEl = document.getElementById('grid-mode');
const fredModeEl = document.getElementById('fred-mode');
const modeToggle = document.getElementById('mode-toggle');
const modeLabel = document.getElementById('mode-label');
const soundGrid = document.getElementById('sound-grid');
const blendingGrid = document.getElementById('blending-grid');
const nextWordBtn = document.getElementById('next-word-btn');
const rewardStar = document.getElementById('reward-star');
const rewardAnimation = document.getElementById('reward-animation');
const setSelectorBtns = document.querySelectorAll('#set-selector .set-btn');

// --- 5. Phoneme Parser Engine ---
function getPhonemes(word) {
    // Collect all sounds from sets up to the current set for valid parsing.
    // Actually, it's safer to just provide all sounds for maximum compatibility.
    const allSounds = [...rwiPhonicsData.set1.sounds, ...rwiPhonicsData.set2.sounds, ...rwiPhonicsData.set3.sounds];
    
    // Check for split digraphs first (e.g. m-a-k-e -> m, a-e, k)
    const splitMatch = word.match(/^(.*)([aeiou])([bcdfghjklmnpqrstvwxyz])e$/);
    if (splitMatch) {
        let prefix = getPhonemes(splitMatch[1]);
        return [...prefix, splitMatch[2]+'-e', splitMatch[3]];
    }

    let parsed = [];
    let i = 0;
    while (i < word.length) {
        if (i + 2 < word.length) {
            const tri = word.substr(i, 3);
            if (allSounds.includes(tri)) { parsed.push(tri); i+=3; continue; }
        }
        if (i + 1 < word.length) {
            const di = word.substr(i, 2);
            if (di === 'oo') {
                if (['zoo','spoon','pool'].includes(word)) { parsed.push('oo_long'); i+=2; continue; }
                else { parsed.push('oo_short'); i+=2; continue; }
            }
            if (di === 'ow') {
                if (['blow','snow','show'].includes(word)) { parsed.push('ow'); i+=2; continue; }
                else { parsed.push('ow_brown'); i+=2; continue; }
            }
            if (allSounds.includes(di)) { parsed.push(di); i+=2; continue; }
        }
        if (allSounds.includes(word[i])) {
            parsed.push(word[i]);
        } else {
            parsed.push(word[i]); 
        }
        i++;
    }
    return parsed;
}

// --- 6. Audio Engine ---
function playSound(text) {
    // HOOK: Replace this block with Audio('.mp3') when static files are ready
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8;
        utterance.pitch = 1.2;
        window.speechSynthesis.cancel(); 
        window.speechSynthesis.speak(utterance);
    }
}

// --- 7. UI Renderers ---
function createCard(soundKey, isBlending = false, targetIndex = -1) {
    const config = audioMap[soundKey] || { sound: soundKey, mnemonic: '🔤', display: soundKey };
    const card = document.createElement('button');
    card.className = 'sound-card';
    card.innerHTML = `
        <span class="mnemonic-icon">${config.mnemonic}</span>
        <span class="letter-text text-blue-600">${config.display}</span>
    `;

    card.addEventListener('click', (e) => {
        if (card.getAttribute('data-cooling') === 'true') return;

        // 1.5s Debounce
        card.setAttribute('data-cooling', 'true');
        setTimeout(() => {
            if(document.body.contains(card)) card.setAttribute('data-cooling', 'false');
        }, debounceTime);

        // Visual feedback
        card.classList.add('active-highlight');
        setTimeout(() => card.classList.remove('active-highlight'), 500);

        if (!isBlending) {
            playSound(config.sound);
        } else {
            handleBlendingClick(card, config.sound, targetIndex);
        }
    });

    return card;
}

function renderSoundGrid() {
    soundGrid.innerHTML = '';
    const sounds = rwiPhonicsData[currentSetKey].sounds;
    sounds.forEach(soundKey => {
        soundGrid.appendChild(createCard(soundKey));
    });
}

function renderBlendingWord() {
    blendingGrid.innerHTML = '';
    currentWordProgress = 0;
    nextWordBtn.classList.add('hidden');
    
    const words = rwiPhonicsData[currentSetKey].words;
    const word = words[currentWordIndex];
    const phonemes = getPhonemes(word);
    
    phonemes.forEach((phoneme, index) => {
        const card = createCard(phoneme, true, index);
        card.dataset.index = index;
        blendingGrid.appendChild(card);
    });
}

function handleBlendingClick(card, audioText, targetIndex) {
    if (targetIndex === currentWordProgress) {
        playSound(audioText);
        card.classList.add('blended-success');
        card.setAttribute('data-cooling', 'true');
        currentWordProgress++;

        const words = rwiPhonicsData[currentSetKey].words;
        const phonemes = getPhonemes(words[currentWordIndex]);

        if (currentWordProgress === phonemes.length) {
            setTimeout(() => triggerReward(words[currentWordIndex]), 1000);
        }
    } else {
        card.classList.add('border-red-400');
        setTimeout(() => card.classList.remove('border-red-400'), 500);
    }
}

function triggerReward(wordText) {
    setTimeout(() => playSound(wordText), 500);
    rewardAnimation.classList.remove('opacity-0');
    rewardStar.classList.add('animate-reward');
    
    setTimeout(() => {
        rewardAnimation.classList.add('opacity-0');
        rewardStar.classList.remove('animate-reward');
        nextWordBtn.classList.remove('hidden');
    }, 2000);
}

// --- 8. Event Listeners & Initialization ---
setSelectorBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        setSelectorBtns.forEach(b => b.classList.remove('active', 'bg-white', 'text-blue-600'));
        e.target.classList.add('active', 'bg-white', 'text-blue-600');
        currentSetKey = e.target.dataset.set;
        currentWordIndex = 0;
        
        if (isBlendyMode) renderBlendingWord();
        else renderSoundGrid();
    });
});

modeToggle.addEventListener('change', (e) => {
    isBlendyMode = e.target.checked;
    if (isBlendyMode) {
        modeLabel.textContent = 'Blendy Blending';
        gridModeEl.classList.add('hidden');
        fredModeEl.classList.remove('hidden');
        fredModeEl.classList.add('flex');
        currentWordIndex = 0;
        renderBlendingWord();
    } else {
        modeLabel.textContent = 'Sound Grid';
        gridModeEl.classList.remove('hidden');
        fredModeEl.classList.add('hidden');
        fredModeEl.classList.remove('flex');
        renderSoundGrid();
    }
});

nextWordBtn.addEventListener('click', () => {
    const words = rwiPhonicsData[currentSetKey].words;
    currentWordIndex = (currentWordIndex + 1) % words.length;
    renderBlendingWord();
});

// Initialize
renderSoundGrid();
