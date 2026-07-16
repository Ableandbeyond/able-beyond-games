// State
let state = {
  subject: 'recognition', // recognition, counting, addition, subtraction, multiplication, division, bonds
  level: 1, // 1: Look & Choose, 2: Build & Solve, 3: Hit the Button
  progress: 0,
  maxProgress: 10,
  stars: 0,
  settings: {
    speech: true,
    timer: false,
    maxNumber: 20,
    choicesCount: 4
  }
};

// DOM Elements
const body = document.body;
const instructionText = document.getElementById('instruction-text');
const gameArea = document.getElementById('game-area');
const progressBar = document.getElementById('progress-bar');
const starsContainer = document.getElementById('stars-container');
const reinforcementOverlay = document.getElementById('reinforcement-overlay');
const teacherModal = document.getElementById('teacher-modal');
const praiseText = document.getElementById('praise-text');

// Audio Context (Optional chime)
const playChime = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.5);
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch (e) {}
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
  // Top Nav Subjects
  document.querySelectorAll('.subject-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      state.subject = e.target.dataset.subject;
      body.setAttribute('data-theme', state.subject);
      renderLevel();
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
      if (action === 'say') speak(instruction);
      else if (action === 'look') speak('Look carefully at the screen.');
      else if (action === 'touch') speak('Touch the right answer.');
      else if (action === 'count') speak('Count the items slowly.');
      else if (action === 'finished') speak('Finished!');
    });
  });

  // Teacher Mode
  document.getElementById('teacher-mode-toggle').addEventListener('click', () => {
    teacherModal.classList.remove('hidden');
  });
  document.getElementById('close-teacher-modal').addEventListener('click', () => {
    teacherModal.classList.add('hidden');
    state.settings.speech = document.getElementById('setting-speech').checked;
    state.settings.timer = document.getElementById('setting-timer').checked;
    state.settings.maxNumber = parseInt(document.getElementById('setting-range').value);
    state.settings.choicesCount = parseInt(document.getElementById('setting-choices').value);
    renderLevel();
  });
  document.getElementById('reset-progress').addEventListener('click', () => {
    state.progress = 0;
    state.stars = 0;
    updateProgress();
    alert("Progress reset");
  });
};

const showReinforcement = () => {
  playChime();
  const praises = ["Great Job!", "Fantastic!", "Well Done!", "You Did It!"];
  const text = praises[Math.floor(Math.random() * praises.length)];
  praiseText.innerText = text;
  speak(text);
  reinforcementOverlay.classList.remove('hidden');
  
  state.progress++;
  if (state.progress >= state.maxProgress) {
    state.progress = 0;
    state.stars++;
  }
  updateProgress();

  setTimeout(() => {
    reinforcementOverlay.classList.add('hidden');
    renderLevel();
  }, 2000);
};

const updateProgress = () => {
  progressBar.style.width = `${(state.progress / state.maxProgress) * 100}%`;
  starsContainer.innerHTML = '⭐'.repeat(state.stars);
};

const shuffle = (array) => array.sort(() => Math.random() - 0.5);

// Math Question Generator
const generateQuestion = () => {
  let q = { instruction: '', text: '', answer: 0, choices: [] };
  const max = state.settings.maxNumber;
  let a, b;
  
  switch(state.subject) {
    case 'recognition':
      a = Math.floor(Math.random() * (max + 1));
      q.text = `Tap Number <span class="highlight">${a}</span>`;
      q.instruction = `Tap Number ${a}`;
      q.answer = a;
      break;
    case 'counting':
      a = Math.floor(Math.random() * 10) + 1; // keep visual counting to max 10
      q.text = `Count the apples`;
      q.instruction = `Count the apples`;
      q.answer = a;
      q.visualCount = a;
      break;
    case 'addition':
      a = Math.floor(Math.random() * (max / 2));
      b = Math.floor(Math.random() * (max / 2));
      q.text = `What is <span class="highlight">${a} + ${b}</span> ?`;
      q.instruction = `What is ${a} plus ${b}?`;
      q.answer = a + b;
      q.a = a; q.b = b; q.op = '+';
      break;
    case 'subtraction':
      a = Math.floor(Math.random() * max);
      b = Math.floor(Math.random() * a); // ensure no negative
      q.text = `What is <span class="highlight">${a} - ${b}</span> ?`;
      q.instruction = `What is ${a} minus ${b}?`;
      q.answer = a - b;
      q.a = a; q.b = b; q.op = '-';
      break;
    case 'multiplication':
      a = Math.floor(Math.random() * 11);
      b = Math.floor(Math.random() * 11);
      q.text = `What is <span class="highlight">${a} × ${b}</span> ?`;
      q.instruction = `What is ${a} times ${b}?`;
      q.answer = a * b;
      q.a = a; q.b = b; q.op = '×';
      break;
    case 'division':
      b = Math.floor(Math.random() * 10) + 1;
      a = b * (Math.floor(Math.random() * 10) + 1);
      q.text = `What is <span class="highlight">${a} ÷ ${b}</span> ?`;
      q.instruction = `What is ${a} divided by ${b}?`;
      q.answer = a / b;
      q.a = a; q.b = b; q.op = '÷';
      break;
    case 'bonds':
      const bondTarget = max === 5 ? 5 : (max <= 10 ? 10 : 20);
      a = Math.floor(Math.random() * bondTarget);
      b = bondTarget - a;
      q.text = `Make ${bondTarget}: <span class="highlight">${a} + ?</span>`;
      q.instruction = `What adds to ${a} to make ${bondTarget}?`;
      q.answer = b;
      q.a = a; q.b = '?'; q.op = '+'; q.target = bondTarget;
      break;
  }

  // Generate wrong choices
  let numChoices = state.level === 1 ? 2 : state.settings.choicesCount;
  if(state.level === 2 && state.subject !== 'recognition' && state.subject !== 'counting') numChoices = 4; // default for drag and drop
  
  q.choices.push(q.answer);
  while(q.choices.length < numChoices) {
    let wrong = q.answer + Math.floor(Math.random() * 10) - 5;
    if (wrong < 0 && state.subject !== 'subtraction') wrong = Math.abs(wrong) + 1;
    if (!q.choices.includes(wrong) && wrong !== q.answer) {
      q.choices.push(wrong);
    }
  }
  shuffle(q.choices);
  return q;
};

// Rendering Levels
const renderLevel = () => {
  gameArea.innerHTML = '';
  gameArea.className = '';
  
  const q = generateQuestion();
  instructionText.innerHTML = q.text;
  if(state.settings.speech) speak(q.instruction);

  if (state.level === 1 || state.level === 3) {
    // Look & Choose OR Hit the Button
    if(state.level === 1) gameArea.style.maxWidth = "600px"; // restrict width for 2 options

    // For counting subject, show apples
    if(state.subject === 'counting' && q.visualCount) {
      const vis = document.createElement('div');
      vis.style.fontSize = '4rem';
      vis.style.width = '100%';
      vis.style.textAlign = 'center';
      vis.style.marginBottom = '20px';
      vis.innerHTML = '🍎'.repeat(q.visualCount);
      gameArea.appendChild(vis);
    }

    q.choices.forEach(choice => {
      const btn = document.createElement('button');
      btn.className = 'math-card';
      btn.innerHTML = `<span class="value">${choice}</span>`;
      
      const onSelect = () => {
        if (choice === q.answer) {
          showReinforcement();
        } else {
          btn.style.transform = 'translateY(10px) rotate(5deg)';
          setTimeout(() => btn.style.transform = '', 300);
          if(state.settings.speech) speak("Try again.");
        }
      };

      btn.addEventListener('click', onSelect);
      gameArea.appendChild(btn);
    });

  } else if (state.level === 2) {
    // Build & Solve (Drag and Drop)
    gameArea.className = 'build-solve-container';

    if (state.subject === 'recognition' || state.subject === 'counting') {
      // Just fallback to level 1 style if it's too simple to build
      instructionText.innerHTML = "Match the number";
      q.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = 'math-card';
        btn.innerHTML = `<span class="value">${choice}</span>`;
        btn.onclick = () => (choice === q.answer) ? showReinforcement() : speak("Try again.");
        gameArea.appendChild(btn);
      });
      return;
    }

    // Interactive Equation
    const eqArea = document.createElement('div');
    eqArea.className = 'equation-area';
    
    let eqHTML = '';
    if(state.subject === 'bonds') {
       eqHTML = `<span>${q.a}</span> <span>${q.op}</span> <div class="answer-drop-zone" id="dropzone">?</div> <span>=</span> <span>${q.target}</span>`;
    } else {
       eqHTML = `<span>${q.a}</span> <span>${q.op}</span> <span>${q.b}</span> <span>=</span> <div class="answer-drop-zone" id="dropzone">?</div>`;
    }
    eqArea.innerHTML = eqHTML;
    gameArea.appendChild(eqArea);

    const dz = eqArea.querySelector('#dropzone');
    dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('drag-over'); });
    dz.addEventListener('dragleave', e => dz.classList.remove('drag-over'));
    dz.addEventListener('drop', e => {
      e.preventDefault();
      dz.classList.remove('drag-over');
      const val = parseInt(e.dataTransfer.getData('text/plain'));
      if (val === q.answer) {
        dz.innerText = val;
        dz.style.border = 'none';
        showReinforcement();
      } else {
        if(state.settings.speech) speak("Try again.");
      }
    });

    const choicesArea = document.createElement('div');
    choicesArea.style.display = 'flex';
    choicesArea.style.gap = '20px';
    
    q.choices.forEach(choice => {
      const el = document.createElement('div');
      el.className = 'draggable-number';
      el.draggable = true;
      el.innerText = choice;
      el.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', choice);
        setTimeout(() => el.style.opacity = '0.5', 0);
      });
      el.addEventListener('dragend', () => el.style.opacity = '1');
      choicesArea.appendChild(el);
    });

    gameArea.appendChild(choicesArea);
  }
};

window.onload = init;
