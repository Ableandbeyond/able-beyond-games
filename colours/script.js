// Data
const colors = ['red', 'blue', 'yellow', 'green', 'orange', 'purple', 'white', 'black'];

const objectsData = {
  red: [
    { name: 'Apple', icon: '🍎' },
    { name: 'Fire Engine', icon: '🚒' },
    { name: 'Balloon', icon: '🎈' },
    { name: 'Car', icon: '🚗' },
    { name: 'Rose', icon: '🌹' }
  ],
  blue: [
    { name: 'Fish', icon: '🐟' },
    { name: 'Blue Book', icon: '📘' },
    { name: 'Blueberry', icon: '🫐' },
    { name: 'Wave', icon: '🌊' },
    { name: 'Diamond', icon: '💎' }
  ],
  yellow: [
    { name: 'Banana', icon: '🍌' },
    { name: 'Sun', icon: '☀️' },
    { name: 'Chick', icon: '🐥' },
    { name: 'Cheese', icon: '🧀' },
    { name: 'Lemon', icon: '🍋' }
  ],
  green: [
    { name: 'Leaf', icon: '🍃' },
    { name: 'Frog', icon: '🐸' },
    { name: 'Tree', icon: '🌳' },
    { name: 'Turtle', icon: '🐢' },
    { name: 'Broccoli', icon: '🥦' }
  ],
  orange: [
    { name: 'Orange', icon: '🍊' },
    { name: 'Carrot', icon: '🥕' },
    { name: 'Tiger', icon: '🐅' },
    { name: 'Basketball', icon: '🏀' },
    { name: 'Pumpkin', icon: '🎃' }
  ],
  purple: [
    { name: 'Grapes', icon: '🍇' },
    { name: 'Eggplant', icon: '🍆' },
    { name: 'Umbrella', icon: '🌂' },
    { name: 'Crystal', icon: '🔮' },
    { name: 'Monster', icon: '👾' }
  ],
  white: [
    { name: 'Cloud', icon: '☁️' },
    { name: 'Snowman', icon: '⛄' },
    { name: 'Milk', icon: '🥛' },
    { name: 'Ghost', icon: '👻' },
    { name: 'Rabbit', icon: '🐇' }
  ],
  black: [
    { name: 'Cat', icon: '🐈‍⬛' },
    { name: 'Bat', icon: '🦇' },
    { name: 'Spider', icon: '🕷️' },
    { name: '8 Ball', icon: '🎱' },
    { name: 'Gorilla', icon: '🦍' }
  ]
};

// State
let state = {
  themeColor: 'red',
  level: 1, // 1: Look & Match, 2: Match & Sort, 3: Categorise
  progress: 0,
  maxProgress: 10,
  stars: 0,
  settings: {
    speech: true,
    text: true,
    difficulty: 'beginner'
  }
};

// DOM Elements
const body = document.body;
const instructionText = document.getElementById('instruction-text');
const instructionColorWord = document.getElementById('instruction-color-word');
const gameArea = document.getElementById('game-area');
const progressBar = document.getElementById('progress-bar');
const starsContainer = document.getElementById('stars-container');
const reinforcementOverlay = document.getElementById('reinforcement-overlay');
const teacherModal = document.getElementById('teacher-modal');

// Audio Context (Optional chime)
const playChime = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.5); // C6
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch (e) {
    console.log("Audio not supported", e);
  }
};

// Speech Synthesis
const speak = (text) => {
  if (!state.settings.speech) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-GB';
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
};

// Initializer
const init = () => {
  bindEvents();
  renderLevel();
};

const bindEvents = () => {
  // Top Nav Colors
  document.querySelectorAll('.color-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      setTheme(e.target.dataset.color);
    });
  });

  // Activity Tabs
  document.querySelectorAll('.activity-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      document.querySelectorAll('.activity-tab').forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      state.level = parseInt(e.target.dataset.level);
      renderLevel();
    });
  });

  // Left Menu Actions
  document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const action = e.currentTarget.dataset.action;
      const instruction = instructionText.innerText;
      if (action === 'say') {
        speak(instruction);
      } else if (action === 'look') {
        speak('Look carefully at the screen.');
      } else if (action === 'touch') {
        speak('Touch the right answer.');
      } else if (action === 'drag') {
        speak('Drag the object to the matching color.');
      } else if (action === 'finished') {
        speak('Finished!');
      }
    });
  });

  // Teacher Mode
  document.getElementById('teacher-mode-toggle').addEventListener('click', () => {
    teacherModal.classList.remove('hidden');
  });
  document.getElementById('close-teacher-modal').addEventListener('click', () => {
    teacherModal.classList.add('hidden');
    // Save settings
    state.settings.speech = document.getElementById('setting-speech').checked;
    state.settings.text = document.getElementById('setting-text').checked;
    state.settings.difficulty = document.getElementById('setting-difficulty').value;
    
    instructionText.style.visibility = state.settings.text ? 'visible' : 'hidden';
    renderLevel();
  });
  document.getElementById('reset-progress').addEventListener('click', () => {
    state.progress = 0;
    state.stars = 0;
    updateProgress();
    alert("Progress reset");
  });
};

const setTheme = (color) => {
  state.themeColor = color;
  body.setAttribute('data-theme', color);
  renderLevel();
};

const showReinforcement = () => {
  playChime();
  speak("Great job!");
  reinforcementOverlay.classList.remove('hidden');
  
  // Update progress
  state.progress++;
  if (state.progress > state.maxProgress) {
    state.progress = 0;
    state.stars++;
  }
  updateProgress();

  setTimeout(() => {
    reinforcementOverlay.classList.add('hidden');
    renderLevel(); // load next problem
  }, 2000);
};

const updateProgress = () => {
  progressBar.style.width = `${(state.progress / state.maxProgress) * 100}%`;
  starsContainer.innerHTML = '⭐'.repeat(state.stars);
};

// Utils
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (array) => array.sort(() => Math.random() - 0.5);

// Rendering Levels
const renderLevel = () => {
  gameArea.innerHTML = ''; // clear
  const colorObj = objectsData[state.themeColor];
  
  if (state.level === 1) {
    // LOOK & MATCH
    instructionColorWord.innerText = state.themeColor.toUpperCase();
    instructionColorWord.style.color = `var(--color-${state.themeColor})`;
    instructionText.innerHTML = `Tap the <span style="color: var(--color-${state.themeColor})">${state.themeColor.toUpperCase()}</span> object`;
    
    if (state.settings.speech) {
      speak(`Tap the ${state.themeColor} object`);
    }

    // Pick 1 correct object, 1 incorrect color object
    const targetObj = getRandomElement(colorObj);
    
    let otherColors = colors.filter(c => c !== state.themeColor);
    let wrongColor = getRandomElement(otherColors);
    let wrongObj = getRandomElement(objectsData[wrongColor]);
    
    let cards = [
      { obj: targetObj, isCorrect: true, color: state.themeColor },
      { obj: wrongObj, isCorrect: false, color: wrongColor }
    ];
    
    shuffle(cards);
    
    cards.forEach(card => {
      const el = document.createElement('div');
      el.className = 'game-card';
      el.tabIndex = 0; // Accessible
      el.innerHTML = `
        <div class="object-icon">${card.obj.icon}</div>
        <div class="object-name">${card.obj.name}</div>
      `;
      
      const onSelect = () => {
        if (card.isCorrect) {
          showReinforcement();
        } else {
          el.style.transform = 'translateY(10px) rotate(5deg)';
          setTimeout(() => el.style.transform = '', 300); // slight jiggle
          if(state.settings.speech) speak("Try again.");
        }
      };

      el.addEventListener('click', onSelect);
      el.addEventListener('keydown', (e) => { if (e.key === 'Enter') onSelect() });
      
      gameArea.appendChild(el);
    });
  } 
  else if (state.level === 2 || state.level === 3) {
    // MATCH & SORT or CATEGORISE
    // We will do a drag and drop
    let colorCount = state.level === 2 ? (state.settings.difficulty === 'advanced' ? 4 : 2) : 4;
    
    instructionText.innerText = "Sort the objects into the matching boxes";
    if (state.settings.speech) speak("Sort the objects into the matching boxes");
    
    gameArea.className = 'level-2-layout';
    
    // Pick active colors (must include theme color)
    let activeColors = [state.themeColor];
    let availableColors = colors.filter(c => c !== state.themeColor);
    shuffle(availableColors);
    for(let i=1; i<colorCount; i++) {
      activeColors.push(availableColors.pop());
    }
    shuffle(activeColors);
    
    // Create Drop Zones
    const dropZoneContainer = document.createElement('div');
    dropZoneContainer.className = 'drop-zones-container';
    activeColors.forEach(c => {
      const zone = document.createElement('div');
      zone.className = 'drop-zone';
      zone.dataset.color = c;
      zone.style.backgroundColor = `var(--color-${c})`;
      zone.innerText = c.toUpperCase();
      
      // Drag events
      zone.addEventListener('dragover', e => {
        e.preventDefault();
        zone.classList.add('drag-over');
      });
      zone.addEventListener('dragleave', e => {
        zone.classList.remove('drag-over');
      });
      zone.addEventListener('drop', e => {
        e.preventDefault();
        zone.classList.remove('drag-over');
        const color = e.dataTransfer.getData('text/plain');
        if (color === c) {
          // Correct match
          const draggableId = e.dataTransfer.getData('draggableId');
          const el = document.getElementById(draggableId);
          if(el) {
            el.draggable = false;
            el.style.opacity = '0';
            setTimeout(() => el.remove(), 300);
            
            // Check if all are matched
            setTimeout(() => {
              const remaining = document.querySelectorAll('.draggable-item');
              if(remaining.length === 0) {
                showReinforcement();
              } else {
                 playChime(); // small chime for partial success
              }
            }, 50);
          }
        } else {
          if(state.settings.speech) speak("Try again.");
        }
      });
      dropZoneContainer.appendChild(zone);
    });
    
    // Create Draggable Items
    const draggablesContainer = document.createElement('div');
    draggablesContainer.className = 'draggables-container';
    
    let itemsToSort = [];
    activeColors.forEach(c => {
      // Pick 1 or 2 items per color
      const objs = objectsData[c];
      itemsToSort.push({ obj: getRandomElement(objs), color: c });
      if(state.level === 3) { // more items
        itemsToSort.push({ obj: getRandomElement(objs), color: c });
      }
    });
    shuffle(itemsToSort);
    
    itemsToSort.forEach((item, index) => {
      const el = document.createElement('div');
      el.className = 'draggable-item';
      el.id = 'draggable-' + index;
      el.draggable = true;
      el.innerText = item.obj.icon;
      
      el.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', item.color);
        e.dataTransfer.setData('draggableId', el.id);
        setTimeout(() => el.style.opacity = '0.5', 0);
      });
      el.addEventListener('dragend', () => {
        el.style.opacity = '1';
      });
      
      draggablesContainer.appendChild(el);
    });
    
    gameArea.appendChild(dropZoneContainer);
    gameArea.appendChild(draggablesContainer);
  }
};

window.onload = init;
