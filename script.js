const app = document.getElementById('app');

// State
let state = {
    page: 'Home',
    socks: {
        cards: [],
        matched: [],
        selected: null,
        attempts: 0,
        difficulty: 4 // or 6
    },
    sandwich: {
        step: 0
    },
    bus: {
        stage: 1,
        timer: null
    },
    pharmacy: {
        stage: 1,
        simpleView: false,
        day: new Date().getDay() || 7 // 1-7
    },
    zen: {
        items: [],
        completed: false
    },
    bubble: {
        level: 1,
        running: false,
        warning: false,
        completed: false,
        starsCollected: 0,
        starsTotal: 1,
        status: 'comfy'
    },
    grocery: {
        budget: 10.00,
        spent: 0.00,
        basket: [],
        items: [
            { id: 1, name: 'Milk', price: 1.50, icon: '🥛' },
            { id: 2, name: 'Bread', price: 1.20, icon: '🍞' },
            { id: 3, name: 'Apples', price: 2.00, icon: '🍎' },
            { id: 4, name: 'Cheese', price: 3.00, icon: '🧀' },
            { id: 5, name: 'Bananas', price: 1.80, icon: '🍌' },
            { id: 6, name: 'Juice', price: 2.50, icon: '🧃' }
        ],
        startTime: null,
        decisionTimes: [],
        completed: false
    }
};

function playTTS(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.rate = 0.9;
        window.speechSynthesis.speak(u);
    }
}

function playHaptic() {
    if ('vibrate' in navigator) navigator.vibrate([200]);
}

function render() {
    app.innerHTML = ''; // clear

    // Header
    const headerTitle = "Able & Beyond - Life Skills Lab";
    const headerSub = state.page === 'Home' 
        ? "Play-based tools designed to support focus, emotional regulation, and independent thinking."
        : state.page === 'Socks' 
            ? "Supports attention, visual scanning, and working memory."
            : state.page === 'Sandwich'
                ? "Building sequences and following multi-step instructions."
                : state.page === 'Bus'
                    ? "Learning public transport routines and timing."
                    : state.page === 'Pharmacy'
                        ? "Practicing communication, daily routines and pharmacy visits."
                        : state.page === 'Zen'
                            ? "Relaxing sorting activity with gentle touch interactions."
                            : state.page === 'Bubble'
                                ? "Practicing personal space boundaries with tactile 3D feedback."
                                : "A low-pressure shopping simulation for financial literacy.";

    app.innerHTML += `
        <div class="ab-header">
            <div class="ab-title">${headerTitle}</div>
            <div class="ab-sub">${headerSub}</div>
        </div>
    `;

    if (state.page === 'Home') renderHome();
    else if (state.page === 'Socks') renderSocks();
    else if (state.page === 'Sandwich') renderSandwich();
    else if (state.page === 'Bus') renderBus();
    else if (state.page === 'Pharmacy') renderPharmacy();
    else if (state.page === 'Zen') renderZenZone();
    else if (state.page === 'Bubble') renderBubbleGuard();
    else if (state.page === 'Grocery') renderGrocery();

    if (state.pharmacy && state.pharmacy.simpleView) {
        document.body.classList.add('simple-view');
    } else {
        document.body.classList.remove('simple-view');
    }
}

function renderHome() {
    const isUnlocked = localStorage.getItem('ab_access_code') === 'HEROES26';
    const lockIcon = isUnlocked ? '🔓' : '🔒';
    const lockNote = isUnlocked ? '🟢 Access Pass Active' : '🔒 Access Code Required';

    app.innerHTML += `
        <div class="game-card card" style="text-align: center; margin-bottom: 24px; background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border: 2px solid #f59e0b;">
          <h3 style="margin-top: 0; font-size: 1.4rem; color: #92400e;">🌟 Teacher Portfolio, Pricing &amp; IEP Dashboard</h3>
          <p style="margin: 8px 0 14px 0; color: #78350f; font-weight: 600;">Explore how each game aligns with EHCP/IEP targets, view school co-creation pricing, and test our free showcase interventions!</p>
          <a href="portfolio.html" class="play-btn" style="text-decoration: none;"><button style="background: linear-gradient(135deg, #d97706, #b45309); max-width: 340px; margin: 0 auto; display: block;">View Teacher Portfolio &amp; Free Demos &rarr;</button></a>
        </div>

        <!-- SECTION 1: FREE & UNLOCKED GAMES FOR TESTING -->
        <div class="arcade-section-box arcade-section-free">
            <div class="arcade-section-header">
                <div>
                    <div style="font-size: 1.45rem; font-weight: 800; color: #14532d;">🔓 Free &amp; Unlocked Games (Open for Testing)</div>
                    <div style="font-size: 0.98rem; color: #166534; font-weight: 600; margin-top: 4px;">
                        These 7 showcase games are 100% unlocked—no password needed! Click any game below to test it live.
                    </div>
                </div>
                <span class="arcade-badge-free">🟢 Free Classroom Testing</span>
            </div>

            <div class="grid-4" style="margin-bottom: 18px;">
                <div class="game-tile-wrapper">
                    <button class="btn-free-game" onclick="window.location.href='emotion-explorer/'">Emotion Explorer 😊</button>
                    <div class="under-game-note under-game-note-free">🔓 Free &amp; Unlocked for Testing</div>
                </div>
                <div class="game-tile-wrapper">
                    <button class="btn-free-game" onclick="window.location.href='community-heroes/'">Community Heroes 👩‍🚒</button>
                    <div class="under-game-note under-game-note-free">🔓 Free &amp; Unlocked for Testing</div>
                </div>
                <div class="game-tile-wrapper">
                    <button class="btn-free-game" onclick="window.location.href='recycling-rover/'">Recycling Rover ♻️</button>
                    <div class="under-game-note under-game-note-free">🔓 Free &amp; Unlocked for Testing</div>
                </div>
                <div class="game-tile-wrapper">
                    <button class="btn-free-game" onclick="window.location.href='sensory-physics-board/'">Sensory Choice Board ✨</button>
                    <div class="under-game-note under-game-note-free">🔓 Free &amp; Unlocked for Testing</div>
                </div>
            </div>

            <div class="grid-3">
                <div class="game-tile-wrapper">
                    <button class="btn-free-game" onclick="window.location.href='animal-matching/'">Animal Matching 🦁</button>
                    <div class="under-game-note under-game-note-free">🔓 Free &amp; Unlocked for Testing</div>
                </div>
                <div class="game-tile-wrapper">
                    <button class="btn-free-game" onclick="window.location.href='build-a-body/'">Build a Body 🧍</button>
                    <div class="under-game-note under-game-note-free">🔓 Free &amp; Unlocked for Testing</div>
                </div>
                <div class="game-tile-wrapper">
                    <button class="btn-free-game" onclick="window.location.href='./timetable-orbit/'">Visual Timetable Orbit 📅</button>
                    <div class="under-game-note under-game-note-free">🔓 Free &amp; Unlocked for Testing</div>
                </div>
            </div>

            <div style="margin-top: 18px; padding: 12px 16px; border-radius: 14px; background: #dcfce7; border: 1px solid #86efac; color: #14532d; font-size: 0.92rem; font-weight: 700; text-align: center;">
                ✅ Testing Notice: All 7 games above are open-access demos so educators, SENCOs, and parents can test gameplay, audio, and Smartboard touch controls before booking or purchasing.
            </div>
        </div>

        <!-- SECTION 2: PREMIUM ARCADE GAMES -->
        <div class="arcade-section-box arcade-section-premium">
            <div class="arcade-section-header">
                <div>
                    <div style="font-size: 1.4rem; font-weight: 800; color: #1e293b;">${lockIcon} Full Premium Arcade Library</div>
                    <div style="font-size: 0.95rem; color: #475569; font-weight: 600; margin-top: 4px;">
                        ${isUnlocked ? 'Your Premium Access Pass is active! All games below are unlocked.' : 'Requires your TES / TpT Access Code to unlock.'}
                    </div>
                </div>
                <span class="arcade-badge-locked">${lockIcon} ${isUnlocked ? 'Unlocked Pass' : 'Premium Pass'}</span>
            </div>

            <div class="grid-4" style="margin-bottom: 18px;">
                <div class="game-tile-wrapper">
                    <button style="margin-top:0;" onclick="navTo('Socks')">Matching Socks 🧦</button>
                    <div class="under-game-note under-game-note-locked">${lockNote}</div>
                </div>
                <div class="game-tile-wrapper">
                    <button style="margin-top:0;" onclick="navTo('Sandwich')">Sandwich Maker 🥪</button>
                    <div class="under-game-note under-game-note-locked">${lockNote}</div>
                </div>
                <div class="game-tile-wrapper">
                    <button style="margin-top:0;" onclick="navTo('Bus')">Bus Buddy 🚌</button>
                    <div class="under-game-note under-game-note-locked">${lockNote}</div>
                </div>
                <div class="game-tile-wrapper">
                    <button style="margin-top:0;" onclick="navTo('Pharmacy')">Healthy Hero 🏥</button>
                    <div class="under-game-note under-game-note-locked">${lockNote}</div>
                </div>
            </div>

            <div class="grid-4" style="margin-bottom: 18px;">
                <div class="game-tile-wrapper">
                    <button style="margin-top:0;" onclick="navTo('Zen')">The Zen Zone 🧹</button>
                    <div class="under-game-note under-game-note-locked">${lockNote}</div>
                </div>
                <div class="game-tile-wrapper">
                    <button style="margin-top:0;" onclick="navTo('Bubble')">Bubble Guard 🫧</button>
                    <div class="under-game-note under-game-note-locked">${lockNote}</div>
                </div>
                <div class="game-tile-wrapper">
                    <button style="margin-top:0;" onclick="navTo('Grocery')">Grocery Grab 🛒</button>
                    <div class="under-game-note under-game-note-locked">${lockNote}</div>
                </div>
                <div class="game-tile-wrapper">
                    <button style="margin-top:0;" onclick="navToExternal('phonics-game/')">Blendy Bot 🤖</button>
                    <div class="under-game-note under-game-note-locked">${lockNote}</div>
                </div>
            </div>

            <div class="grid-4" style="margin-bottom: 18px;">
                <div class="game-tile-wrapper">
                    <button style="margin-top:0;" onclick="navToExternal('smartboard-shapes/')">Smartboard Shapes 🔺</button>
                    <div class="under-game-note under-game-note-locked">${lockNote}</div>
                </div>
                <div class="game-tile-wrapper">
                    <button style="margin-top:0;" onclick="navToExternal('my-future-launchpad/')">My Future Launchpad 🚀</button>
                    <div class="under-game-note under-game-note-locked">${lockNote}</div>
                </div>
                <div class="game-tile-wrapper">
                    <button style="margin-top:0;" onclick="navToExternal('colours/')">Colour Sorting 🎨</button>
                    <div class="under-game-note under-game-note-locked">${lockNote}</div>
                </div>
                <div class="game-tile-wrapper">
                    <button style="margin-top:0;" onclick="navToExternal('maths/')">Maths Game 🔢</button>
                    <div class="under-game-note under-game-note-locked">${lockNote}</div>
                </div>
            </div>

            <div class="grid-2">
                <div class="game-tile-wrapper">
                    <button style="margin-top:0;" onclick="navToExternal('sensory-room.html')">Sensory Room ✨</button>
                    <div class="under-game-note under-game-note-locked">${lockNote}</div>
                </div>
                <div class="game-tile-wrapper">
                    <button style="margin-top:0;" onclick="navToExternal('whos-in-my-space/')">Who's In My Space? 🏫</button>
                    <div class="under-game-note under-game-note-locked">${lockNote}</div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="small">Designed for neurodiverse learners. Calm colours. Clear feedback.</div>
        </div>
    `;
}

function checkAccess() {
    const correctCode = 'HEROES26'; // The Master Password to sell on TES
    const storedCode = localStorage.getItem('ab_access_code');
    
    if (storedCode === correctCode) {
        return true;
    }
    
    const userCode = prompt("Premium Game Locked 🔒\n\nPlease enter your Access Code (found in your TES PDF) to unlock the premium games:");
    if (userCode && userCode.trim().toUpperCase() === correctCode) {
        localStorage.setItem('ab_access_code', correctCode);
        alert("Access Granted! Enjoy the games.");
        return true;
    } else {
        alert("Incorrect code. You can purchase a Premium Access Pass on our TES store.");
        return false;
    }
}

function navToExternal(url) {
    if (checkAccess()) {
        window.location.href = url;
    }
}

function navTo(page) {
    if (page !== 'Home') {
        if (!checkAccess()) return;
    }
    state.page = page;
    if (page === 'Socks') {
        initSocks(state.socks.difficulty);
    } else if (page === 'Sandwich') {
        state.sandwich.step = 0;
    } else if (page === 'Bus') {
        state.bus.stage = 1;
        state.bus.target = null;
        clearTimeout(state.bus.timer);
    } else if (page === 'Pharmacy') {
        state.pharmacy.stage = 1;
        state.pharmacy.simpleView = false;
        playTTS("Welcome to Healthy Hero");
    } else if (page === 'Zen') {
        initZenZone();
    } else if (page === 'Grocery') {
        initGrocery();
    }
    
    // Shut down bubble loop if leaving
    if (page !== 'Bubble') state.bubble.running = false;

    render();

    // Boot up Three.js directly after DOM renders
    if (page === 'Bubble') {
        setTimeout(initBubbleGuard, 50);
    }
}

// ------ GROCERY GRAB ------
function initGrocery() {
    state.grocery.spent = 0.00;
    state.grocery.basket = [];
    state.grocery.decisionTimes = [];
    state.grocery.completed = false;
    state.grocery.startTime = Date.now();
}

window.groceryActions = {
    selectItem: function(itemId, event) {
        if (state.grocery.completed) return;
        
        const item = state.grocery.items.find(i => i.id === itemId);
        if (!item) return;

        // Calculate decision time
        const now = Date.now();
        const decisionTimeSec = ((now - state.grocery.startTime) / 1000).toFixed(1);
        state.grocery.decisionTimes.push({ item: item.name, time: parseFloat(decisionTimeSec) });
        state.grocery.startTime = now; // reset timer for next item

        // Update budget
        state.grocery.spent += item.price;
        state.grocery.basket.push(item);

        playHaptic();

        // Antigravity visual effect
        const el = event.currentTarget;
        const rect = el.getBoundingClientRect();
        const clone = el.cloneNode(true);
        
        // Setup clone for floating
        clone.style.position = 'fixed';
        clone.style.left = rect.left + 'px';
        clone.style.top = rect.top + 'px';
        clone.style.width = rect.width + 'px';
        clone.style.height = rect.height + 'px';
        clone.style.margin = '0';
        clone.style.zIndex = '1000';
        clone.style.pointerEvents = 'none';
        clone.classList.add('antigravity-float');
        
        document.body.appendChild(clone);

        // Calculate basket position for animation
        const basketEl = document.getElementById('grocery-basket');
        let destY = window.innerHeight;
        let destX = window.innerWidth / 2;
        if (basketEl) {
            const basketRect = basketEl.getBoundingClientRect();
            destY = basketRect.top + (basketRect.height / 2) - (rect.height / 2);
            destX = basketRect.left + (basketRect.width / 2) - (rect.width / 2);
        }

        setTimeout(() => {
            clone.style.top = destY + 'px';
            clone.style.left = destX + 'px';
            clone.style.transform = 'scale(0.5)';
            clone.style.opacity = '0.5';
        }, 50);

        setTimeout(() => {
            if (clone.parentNode) clone.parentNode.removeChild(clone);
            render(); // re-render to update budget UI and basket
        }, 1500); // Wait for animation

        // Immediately update budget buffer visual without full re-render
        renderBudgetBuffer();
    },
    checkout: function() {
        state.grocery.completed = true;
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        render();
    }
};

function renderBudgetBuffer() {
    const fillEl = document.getElementById('budget-fill');
    const textEl = document.getElementById('budget-text');
    if (!fillEl || !textEl) return;

    const g = state.grocery;
    let percentage = (g.spent / g.budget) * 100;
    if (percentage > 100) percentage = 100;

    fillEl.style.width = percentage + '%';

    let colorClass = 'bg-green';
    if (percentage > 90) colorClass = 'bg-red';
    else if (percentage > 60) colorClass = 'bg-amber';

    fillEl.className = 'budget-buffer-fill ' + colorClass;
    textEl.innerText = `Spent: £${g.spent.toFixed(2)} / Budget: £${g.budget.toFixed(2)}`;
}

function renderGrocery() {
    let content = `
        <div style="display:flex; justify-content:space-between; margin-bottom: 20px;">
            <button class="btn-secondary" style="width: 200px; min-height: 3rem;" onclick="navTo('Home')">← Back Home</button>
            <button class="btn-secondary" style="width: 200px; min-height: 3rem;" onclick="groceryActions.checkout()">Checkout 🛒</button>
        </div>
    `;

    const g = state.grocery;

    if (!g.completed) {
        content += `
            <div class="card">
                <div class="big">Grocery Grab</div>
                <div class="small">Choose items to put in your basket. Keep an eye on your budget!</div>
            </div>

            <div class="budget-buffer-container">
                <div id="budget-fill" class="budget-buffer-fill bg-green" style="width: 0%;"></div>
                <div id="budget-text" class="budget-buffer-text">Spent: £0.00 / Budget: £${g.budget.toFixed(2)}</div>
            </div>

            <div class="grid-3" style="margin-top: 20px; gap: 20px;">
        `;

        g.items.forEach(item => {
            content += `
                <div class="grocery-item" onclick="groceryActions.selectItem(${item.id}, event)">
                    <div class="grocery-icon">${item.icon}</div>
                    <div class="grocery-name">${item.name}</div>
                    <div class="grocery-price">£${item.price.toFixed(2)}</div>
                </div>
            `;
        });

        content += `
            </div>
            
            <div id="grocery-basket" class="card" style="margin-top: 30px; border-style: dashed; border-width: 4px; border-color: #94A3B8;">
                <div class="big">Your Basket (${g.basket.length} items)</div>
                <div style="display:flex; flex-wrap:wrap; gap: 10px; justify-content:center; margin-top: 10px; font-size: 2rem;">
                    ${g.basket.map(i => i.icon).join('')}
                </div>
            </div>
        `;
    } else {
        // Completion / SEN Report screen
        const overBudget = g.spent > g.budget;
        const accuracyMsg = overBudget ? "Over Budget" : "Within Budget";
        
        let avgDecisionTime = 0;
        if (g.decisionTimes.length > 0) {
            const sum = g.decisionTimes.reduce((acc, curr) => acc + curr.time, 0);
            avgDecisionTime = (sum / g.decisionTimes.length).toFixed(1);
        }

        const reportData = {
            activity: "Grocery Grab",
            date: new Date().toISOString().split('T')[0],
            metrics: {
                budgetLimit: g.budget,
                totalSpent: g.spent,
                budgetAccuracy: overBudget ? (g.budget / g.spent).toFixed(2) : 1.0, // simplified accuracy metric
                status: accuracyMsg,
                itemsSelected: g.basket.length,
                averageDecisionTimeSeconds: parseFloat(avgDecisionTime),
                detailedTimes: g.decisionTimes
            }
        };

        content += `
            <div class="card">
                <div class="big text-success">🎉 Checkout Complete!</div>
                <div class="small">You spent £${g.spent.toFixed(2)} out of your £${g.budget.toFixed(2)} budget.</div>
                ${overBudget ? '<div class="text-error" style="font-weight:bold; margin-top:10px;">You went a bit over budget! Next time, try to keep the bar green or amber.</div>' : '<div class="text-success" style="font-weight:bold; margin-top:10px;">Great job staying within budget!</div>'}
            </div>

            <div class="sen-report card" style="text-align:left; background: #F8FAFC;">
                <div class="big" style="font-size: 1.2rem; margin-bottom: 15px;">SEN Report Sync Data</div>
                <div class="small" style="margin-bottom: 10px;">Copy this data for the Local Authority Report Generator to demonstrate Independent Living Skills progress.</div>
                <pre style="background: #E2E8F0; padding: 15px; border-radius: 8px; overflow-x: auto; font-family: monospace; font-size: 0.9rem; color: #1E293B;">${JSON.stringify(reportData, null, 2)}</pre>
            </div>

            <button onclick="navTo('Grocery')">Play Again</button>
        `;
    }

    app.innerHTML += content;
    if (!g.completed) {
        renderBudgetBuffer(); // Ensure initial state is correct
    }
}

// ------ SOCKS ------
function initSocks(numCards) {
    state.socks.difficulty = numCards;
    state.socks.matched = [];
    state.socks.selected = null;
    state.socks.attempts = 0;
    
    let sockTypes = ["a", "b"];
    if (numCards === 6) sockTypes.push("c");
    
    let cards = [];
    sockTypes.forEach(type => {
        cards.push(`sock_${type}1.png`);
        cards.push(`sock_${type}2.png`);
    });
    
    // shuffle
    cards.sort(() => Math.random() - 0.5);
    state.socks.cards = cards;
}

window.sockClick = function(index) {
    if (state.socks.matched.includes(index)) return;
    
    const s = state.socks;
    if (s.selected === null) {
        s.selected = index;
    } else {
        if (s.selected !== index) {
            const firstType = s.cards[s.selected].split('_')[1][0];
            const currentType = s.cards[index].split('_')[1][0];
            s.attempts++;
            
            if (firstType === currentType) {
                s.matched.push(s.selected, index);
                s.selected = null;
                if (s.matched.length === s.cards.length) {
                    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
                }
            } else {
                // mismatch logic? just clear after a moment?
                // for UI simplicity we let them click and if wrong we show error
                alert("Not a match! Try again.");
                s.selected = null;
            }
        } else {
            s.selected = null; // deselect
        }
    }
    render();
}

function renderSocks() {
    let content = `<button class="btn-secondary" style="width: 200px; min-height: 3rem; margin-bottom: 20px;" onclick="navTo('Home')">← Back Home</button>`;
    
    content += `
        <div class="card">
            <div class="big">Find the matching pairs!</div>
            <div class="small">Click on TWO matching socks to pair them up.</div>
            <div style="margin-top:15px; display:flex; justify-content:center; gap: 10px;">
                <label><input type="radio" name="diff" ${state.socks.difficulty===4?'checked':''} onclick="initSocks(4);render()"> Easy (4 cards)</label>
                <label><input type="radio" name="diff" ${state.socks.difficulty===6?'checked':''} onclick="initSocks(6);render()"> Medium (6 cards)</label>
            </div>
        </div>
    `;
    
    let s = state.socks;
    let pairsFound = Math.floor(s.matched.length / 2);
    let totalPairs = s.cards.length / 2;
    
    if (s.matched.length === s.cards.length) {
        content += `<div class="card"><div class="big text-success">🎉 Great job! You found all pairs in ${s.attempts} attempts!</div>
        <button onclick="initSocks(${s.difficulty});render()">Play Again</button></div>`;
    } else {
        content += `<div style="text-align:center; font-weight:bold; margin-bottom: 15px;">Pairs found: ${pairsFound} of ${totalPairs}</div>`;
        if (s.selected !== null) {
            let type = s.cards[s.selected].split('_')[1][0].toUpperCase();
            content += `<div style="text-align:center; color:#a16207; font-weight:bold; margin-bottom:15px;">You selected Sock ${type} - now find the other!</div>`;
        }
    }

    content += `<div class="grid-3">`;
    s.cards.forEach((card, i) => {
        let isMatched = s.matched.includes(i);
        let isSelected = s.selected === i;
        let cClass = isMatched ? 'sock-matched' : isSelected ? 'sock-selected' : '';
        let status = isMatched ? '<div class="feedback-msg text-success">✓ Paired!</div>' : 
                     isSelected ? '<div class="feedback-msg text-warning">👆 Selected</div>' : 
                     `<button onclick="sockClick(${i})">Select</button>`;
        
        content += `
            <div class="img-card ${cClass}">
                <img src="images/${card}" alt="sock">
                ${status}
            </div>
        `;
    });
    content += `</div>`;
    app.innerHTML += content;
}

// ------ SANDWICH ------
window.addIngredient = function() {
    state.sandwich.step++;
    if(state.sandwich.step === 4) {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }
    render();
}

function renderSandwich() {
    let content = `<button class="btn-secondary" style="width: 200px; min-height: 3rem; margin-bottom: 20px;" onclick="navTo('Home')">← Back Home</button>`;
    
    const recipe = ["bread_bottom.png", "cheese.png", "lettuce.png", "bread_top.png"];
    const labels = ["Bottom Bread 🍞", "Cheese 🧀", "Lettuce 🥬", "Top Bread 🍞"];
    let step = state.sandwich.step;
    
    if (step < 4) {
        content += `<div class='card'><div class='big'>Next step: ${labels[step]}</div></div>`;
    } else {
        content += `<div class='card'><div class='big text-success'>🎉 Great job! Sandwich complete!</div>
        <button onclick="state.sandwich.step=0;render()">Make Another Sandwich</button></div>`;
    }

    content += `<div class="grid-4" style="margin-top:20px;">`;
    recipe.forEach((img, i) => {
        let btnStatus = (i === step) ? `<button onclick="addIngredient()">Add ${labels[i]}</button>` :
                        (i < step) ? `<div class="feedback-msg text-success">✓ Added</div>` :
                        `<button disabled>Add ${labels[i]}</button>`;
        
        content += `
            <div class="img-card">
                <img src="images/sandwich/${img}" style="max-height:80px; width:auto; margin-bottom:10px;">
                ${btnStatus}
            </div>
        `;
    });
    content += `</div>`;

    // Visual Sandwich builder
    content += `<div class="sandwich-container">`;
    for(let i=0; i<step; i++) {
        content += `<div class="sandwich-layer" style="z-index:${i}">
            <img src="images/sandwich/${recipe[i]}">
        </div>`;
    }
    content += `</div>`;

    app.innerHTML += content;
}

// ------ BUS BUDDY ------
window.busActions = {
    catchBus: function() {
        state.bus.stage = 2;
        render();
    },
    paymentDragStart: function(e) {
        e.dataTransfer.setData('text/plain', 'card');
    },
    paymentDragOver: function(e) {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
    },
    paymentDragLeave: function(e) {
        e.currentTarget.classList.remove('drag-over');
    },
    paymentDrop: function(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        const data = e.dataTransfer.getData('text/plain');
        if (data === 'card') {
            e.currentTarget.classList.add('scanner-success');
            e.currentTarget.innerHTML = "Payment Accepted! ✅";
            setTimeout(() => {
                state.bus.stage = 3;
                render();
            }, 1000);
        }
    },
    pressStop: function() {
        if (!window.busActions.currentActiveSign) {
            alert("Wait for a stop!");
            return;
        }
        if (window.busActions.currentActiveSign.id === state.bus.target.id) {
            clearTimeout(state.bus.timer);
            state.bus.stage = 4;
            confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 } });
            render();
        } else {
            alert("Oops! That was the " + window.busActions.currentActiveSign.text + " stop. Wait for your real stop.");
        }
    }
}

function renderBus() {
    let content = `<button class="btn-secondary" style="width: 200px; min-height: 3rem; margin-bottom: 20px;" onclick="navTo('Home')">← Back Home</button>`;

    if (state.bus.stage === 1) {
        content += `
            <div class="card">
                <div class="big">Stage 1: The Stop</div>
                <div class="small">Wait for Bus 42, then click it to get on!</div>
            </div>
            <div class="bus-container">
                <div class="bus-sprite" onclick="busActions.catchBus()" id="bus42">🚌 <span style="font-size:1.5rem; font-weight:bold; position:absolute; top:20px; left:40px; color:white; background:red; border-radius:4px; padding:2px;">42</span></div>
            </div>
        `;
        setTimeout(() => {
            const bus = document.getElementById('bus42');
            if(bus) bus.style.left = '40%';
        }, 100);
    } 
    else if (state.bus.stage === 2) {
        content += `
            <div class="card">
                <div class="big">Stage 2: The Payment</div>
                <div class="small">Drag your Travel Card onto the green scanner.</div>
            </div>
            <div class="travel-card" draggable="true" ondragstart="busActions.paymentDragStart(event)">Transit Card 💳</div>
            <div class="scanner-zone" ondragover="busActions.paymentDragOver(event)" ondragleave="busActions.paymentDragLeave(event)" ondrop="busActions.paymentDrop(event)">
                Scanner Ready
            </div>
        `;
    }
    else if (state.bus.stage === 3) {
        const stops = [
            { id: "school", icon: "🏫", text: "SCHOOL", color: "#B91C1C" },
            { id: "home", icon: "🏠", text: "HOME", color: "#15803D" },
            { id: "cinema", icon: "🎬", text: "CINEMA", color: "#4338CA" },
            { id: "library", icon: "🏛️", text: "LIBRARY", color: "#A16207" }
        ];

        if (!state.bus.target) {
            state.bus.target = stops.find(s => s.id === "home");
            state.bus.sequence = [
                stops.find(s => s.id === "school"),
                stops.find(s => s.id === "cinema"),
                stops.find(s => s.id === "home")
            ];
        }

        content += `
            <div class="card">
                <div class="big">Stage 3: The Journey</div>
                <div class="small">Press the STOP button when you reach the <strong>${state.bus.target.icon} ${state.bus.target.text}</strong>!</div>
            </div>
            <div class="scenery-view" id="scenery-view">
                <div class="scenery-road"></div>
            </div>
            <button class="stop-btn" onclick="busActions.pressStop()">STOP</button>
        `;
        
        clearTimeout(state.bus.timer);
        window.busActions.currentActiveSign = null;
        
        state.bus.timer = setTimeout(() => {
            const view = document.getElementById('scenery-view');
            if(!view) return;
            state.bus.sequence.forEach((stop, index) => {
                const delay = index * 4000;
                setTimeout(() => {
                    window.busActions.currentActiveSign = stop;
                    const signEl = document.createElement('div');
                    signEl.innerHTML = `${stop.icon} <div style="font-size:1rem; font-weight:bold; text-align:center; background:${stop.color}; color:white; padding:2px; border-radius:4px;">${stop.text}</div>`;
                    signEl.style.position = 'absolute';
                    signEl.style.bottom = '40px';
                    signEl.style.right = '-200px';
                    signEl.style.fontSize = '5rem';
                    signEl.style.transition = 'right 3.5s linear';
                    view.appendChild(signEl);
                    
                    setTimeout(() => { signEl.style.right = '120%'; }, 50);
                    
                    setTimeout(() => {
                        if (window.busActions.currentActiveSign === stop) {
                            window.busActions.currentActiveSign = null;
                            if (stop.id === state.bus.target.id && state.bus.stage === 3) {
                                alert("Oh no! You missed your stop.");
                                state.bus.target = null;
                                render();
                            }
                        }
                    }, 3500);
                }, delay + 500); 
            });
        }, 100);
    }
    else if (state.bus.stage === 4) {
        content += `
            <div class="card">
                <div class="big text-success">🎉 Safe Travels!</div>
                <div class="small">You successfully completed the bus journey.</div>
            </div>
            <button onclick="navTo('Bus')">Play Again</button>
        `;
    }

    app.innerHTML += content;
}

// ------ THE HEALTHY HERO ------
window.pharmacyActions = {
    toggleSimpleView: function() {
        state.pharmacy.simpleView = !state.pharmacy.simpleView;
        render();
    },
    pickSymptom: function(symptom) {
        playHaptic();
        playTTS(`I have a ${symptom}.`);
        setTimeout(() => {
            state.pharmacy.stage = 2;
            playTTS("How can I help you?");
            render();
        }, 1200);
    },
    dragStart: function(e, id) {
        e.dataTransfer.setData('text/plain', id);
        playHaptic();
    },
    dragOver: function(e) {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
    },
    dragLeave: function(e) {
        e.currentTarget.classList.remove('drag-over');
    },
    dropPrescription: function(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        const data = e.dataTransfer.getData('text/plain');
        if (data === 'prescription') {
            playHaptic();
            e.currentTarget.innerHTML = "Processing... ⏳";
            playTTS("Thank you, let me get that for you.");
            setTimeout(() => {
                state.pharmacy.stage = 3;
                playTTS("Remember to take your vitamins each day.");
                render();
            }, 2000);
        }
    },
    dropVitamin: function(e, day) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        const data = e.dataTransfer.getData('text/plain');
        if (data === 'vitamin') {
            if (day === state.pharmacy.day) {
                playHaptic();
                e.currentTarget.innerHTML = "💊";
                playTTS("Great job! All set for today.");
                confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 } });
                setTimeout(() => {
                    state.pharmacy.stage = 4;
                    render();
                }, 2000);
            } else {
                playTTS("Oops, wrong day!");
                alert("That's the wrong day slot!");
            }
        }
    }
}

function renderPharmacy() {
    let content = `
        <div style="display:flex; justify-content:space-between; margin-bottom: 20px;">
            <button class="btn-secondary" style="width: 200px; min-height: 3rem;" onclick="navTo('Home')">← Back Home</button>
            <button class="btn-secondary" style="width: 200px; min-height: 3rem; background: ${state.pharmacy.simpleView ? '#F59E0B' : '#94A3B8'};" onclick="pharmacyActions.toggleSimpleView()">
                ${state.pharmacy.simpleView ? 'Normal View' : 'Simple View'}
            </button>
        </div>
    `;

    if (state.pharmacy.stage === 1) {
        content += `
            <div class="card">
                <div class="big">Stage 1: Arrival</div>
                <div class="small">How are you feeling today? Check in with the receptionist.</div>
            </div>
            <div class="grid-3" style="margin-top:20px;">
                <button class="symptom-btn" onclick="pharmacyActions.pickSymptom('Fever')">🤒 <span>Fever</span></button>
                <button class="symptom-btn" onclick="pharmacyActions.pickSymptom('Headache')">🤕 <span>Headache</span></button>
                <button class="symptom-btn" onclick="pharmacyActions.pickSymptom('Cough')">🤧 <span>Cough</span></button>
            </div>
        `;
    }
    else if (state.pharmacy.stage === 2) {
        content += `
            <div class="card">
                <div class="big">Stage 2: The Counter</div>
                <div class="small">Hand over your prescription to the pharmacist.</div>
            </div>
            <div class="pharmacy-counter">
                🧑‍⚕️ <span style="font-size:4rem; margin-left:20px;">🏥</span>
                <div class="counter-dropzone" ondragover="pharmacyActions.dragOver(event)" ondragleave="pharmacyActions.dragLeave(event)" ondrop="pharmacyActions.dropPrescription(event)">
                    Drop Prescription Here
                </div>
            </div>
            <div class="prescription-drag" draggable="true" ondragstart="pharmacyActions.dragStart(event, 'prescription')">📄</div>
        `;
    }
    else if (state.pharmacy.stage === 3) {
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const todayIdx = state.pharmacy.day - 1; // 0-6
        let slotsHTML = "";
        
        days.forEach((dayLabel, idx) => {
            let addClass = (idx === todayIdx) ? "active-day" : "";
            slotsHTML += `
                <div class="pill-slot ${addClass}" ondragover="pharmacyActions.dragOver(event)" ondragleave="pharmacyActions.dragLeave(event)" ondrop="pharmacyActions.dropVitamin(event, ${idx + 1})">
                    ${dayLabel}
                    ${idx === todayIdx ? '<div>(Today)</div>' : ''}
                </div>
            `;
        });

        content += `
            <div class="card">
                <div class="big">Stage 3: The Routine</div>
                <div class="small">Sort your daily vitamin! Drag the token to Today's slot.</div>
            </div>
            <div class="pill-organizer">
                ${slotsHTML}
            </div>
            <div class="vitamin-token" draggable="true" ondragstart="pharmacyActions.dragStart(event, 'vitamin')">V</div>
        `;
    }
    else if (state.pharmacy.stage === 4) {
        content += `
            <div class="card">
                <div class="big text-success">🎉 Healthy Hero!</div>
                <div class="small">You successfully visited the pharmacy and sorted your medicine.</div>
            </div>
            <button onclick="navTo('Pharmacy')">Play Again</button>
        `;
    }

    app.innerHTML += content;
}

// ------ THE ZEN ZONE ------
function initZenZone() {
    state.zen.completed = false;
    state.zen.items = [
        { id: 'item1', type: 'toys', emoji: '🧸', startX: 120, startY: 50 },
        { id: 'item2', type: 'clothes', emoji: '👕', startX: 180, startY: 20 },
        { id: 'item3', type: 'books', emoji: '📖', startX: 250, startY: 60 },
        { id: 'item4', type: 'toys', emoji: '🚗', startX: 100, startY: 100 },
        { id: 'item5', type: 'clothes', emoji: '🧦', startX: 220, startY: 110 },
        { id: 'item6', type: 'books', emoji: '📓', startX: 160, startY: 120 }
    ];
    state.zen.items.forEach(i => {
        i.x = i.startX;
        i.y = i.startY;
        i.isDragging = false;
        i.snapped = false;
    });
}

window.zenActions = {
    down: function(e, id) {
        let item = state.zen.items.find(i => i.id === id);
        if(!item || item.snapped) return;

        item.isDragging = true;
        const el = e.currentTarget;
        el.setPointerCapture(e.pointerId);
        
        let rect = el.getBoundingClientRect();
        item.dragOffsetX = e.clientX - rect.left;
        item.dragOffsetY = e.clientY - rect.top;

        const container = document.getElementById('zenContainer');
        item.containerRect = container.getBoundingClientRect();

        el.classList.add('zen-dragging');
        playHaptic();
    },
    move: function(e, id) {
        let item = state.zen.items.find(i => i.id === id);
        if(!item || !item.isDragging) return;

        let newX = e.clientX - item.containerRect.left - item.dragOffsetX;
        let newY = e.clientY - item.containerRect.top - item.dragOffsetY;

        item.x = newX;
        item.y = newY;

        const el = e.currentTarget;
        el.style.transform = `translate(${item.x}px, ${item.y}px)`;
    },
    up: function(e, id) {
        let item = state.zen.items.find(i => i.id === id);
        if(!item || !item.isDragging) return;

        item.isDragging = false;
        const el = e.currentTarget;
        el.releasePointerCapture(e.pointerId);
        el.classList.remove('zen-dragging');

        const bins = document.querySelectorAll('.zen-bin');
        let matchedBin = null;

        let itemRect = el.getBoundingClientRect();
        let itemCenterX = itemRect.left + itemRect.width/2;
        let itemCenterY = itemRect.top + itemRect.height/2;

        bins.forEach(bin => {
            let bRect = bin.getBoundingClientRect();
            if (itemCenterX > bRect.left && itemCenterX < bRect.right &&
                itemCenterY > bRect.top && itemCenterY < bRect.bottom) {
                matchedBin = bin;
            }
        });

        if (matchedBin) {
            let binType = matchedBin.getAttribute('data-type');
            if (binType === item.type) {
                item.snapped = true;
                playHaptic();
                
                let bRect = matchedBin.getBoundingClientRect();
                let parentRect = document.getElementById('zenContainer').getBoundingClientRect();
                
                item.x = (bRect.left - parentRect.left) + (bRect.width/2) - (itemRect.width/2);
                item.y = (bRect.top - parentRect.top) + (bRect.height/2) - (itemRect.height/2);
                
                el.style.transition = 'transform 0.3s ease-out';
                el.style.transform = `translate(${item.x}px, ${item.y}px)`;
                
                matchedBin.classList.add('pulse');
                setTimeout(() => matchedBin.classList.remove('pulse'), 400);

                if(state.zen.items.every(i => i.snapped)){
                    setTimeout(() => {
                        confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 } });
                        playTTS("The room is perfectly clean. Great job.");
                        let winmsg = document.getElementById('zenWin');
                        if (winmsg) winmsg.style.display = 'block';
                    }, 500);
                }
            } else {
                window.floatBack(item, el);
            }
        } else {
            window.floatBack(item, el);
        }
    }
};

window.floatBack = function(item, el) {
    el.classList.add('zen-floating');
    item.x = item.startX;
    item.y = item.startY;
    el.style.transform = `translate(${item.startX}px, ${item.startY}px)`;
    setTimeout(() => {
        el.classList.remove('zen-floating');
    }, 600);
}

function renderZenZone() {
    let content = `
        <button class="btn-secondary" style="width: 200px; min-height: 3rem;" onclick="navTo('Home')">← Back Home</button>
        <div class="card" style="margin-top: 20px;">
            <div class="big">The Zen Zone</div>
            <div class="small">Tidy the room by dragging objects into their bins. If you make a mistake, they gently float back!</div>
            <div id="zenWin" class="big text-success" style="display:none; margin-top:20px;">🎉 Room Cleaned!</div>
        </div>
        
        <div class="zen-container" id="zenContainer">
            <div class="zen-bins-row">
                <div class="zen-bin" data-type="toys">
                    <span style="font-size:2rem; margin-bottom:5px;">🧩</span>
                    Toys
                </div>
                <div class="zen-bin" data-type="clothes">
                    <span style="font-size:2rem; margin-bottom:5px;">👕</span>
                    Clothes
                </div>
                <div class="zen-bin" data-type="books">
                    <span style="font-size:2rem; margin-bottom:5px;">📚</span>
                    Books
                </div>
            </div>
            <div class="zen-play-area">
    `;

    state.zen.items.forEach(item => {
        let styleStr = `transform: translate(${item.x}px, ${item.y}px);`;
        content += `
            <div class="zen-item" id="${item.id}"
                 style="${styleStr}"
                 onpointerdown="zenActions.down(event, '${item.id}')"
                 onpointermove="zenActions.move(event, '${item.id}')"
                 onpointerup="zenActions.up(event, '${item.id}')"
                 onpointercancel="zenActions.up(event, '${item.id}')">
                ${item.emoji}
            </div>
        `;
    });

    content += `
            </div>
        </div>
    `;
    
    app.innerHTML += content;
}

// ------ THE BUBBLE GUARD (Three.js Upgraded) ------
const BUBBLE_LEVELS = {
    1: {
        name: "Level 1: School Corridor 🏫",
        goalName: "Classroom Door",
        desc: "Collect 1 Gold Star ⭐ and walk safely to the Green Classroom Door!",
        bgHex: 0xE0F2FE,
        floorHex: 0xF1F5F9,
        stars: [{ x: 0, z: 0 }],
        npcs: [
            { x: -3.5, z: 2.5, speed: 0.025, dir: 1, range: 6, color: 0xEC4899 },
            { x: 3.0, z: -1.5, speed: 0.03, dir: -1, range: 6, color: 0x8B5CF6 },
            { x: -2.0, z: -5.0, speed: 0.025, dir: 1, range: 6.5, color: 0xF59E0B }
        ]
    },
    2: {
        name: "Level 2: Busy Playground 🛝",
        goalName: "Park Gate",
        desc: "Collect 2 Gold Stars ⭐! Walk carefully around friends who are chatting.",
        bgHex: 0xDCFCE7,
        floorHex: 0xECFDF5,
        stars: [{ x: -4.8, z: 1.5 }, { x: 4.8, z: -3.5 }],
        npcs: [
            // Chatting friend group in the center
            { x: -0.7, z: 0.5, speed: 0, dir: 1, range: 0, color: 0xEC4899 },
            { x: 0.7, z: 0.5, speed: 0, dir: -1, range: 0, color: 0x6366F1 },
            // Moving students
            { x: -4.0, z: 3.5, speed: 0.032, dir: 1, range: 7, color: 0xF97316 },
            { x: 3.5, z: -2.0, speed: 0.035, dir: -1, range: 7, color: 0x14B8A6 },
            { x: 0.0, z: -5.5, speed: 0.03, dir: 1, range: 7, color: 0xEAB308 }
        ]
    },
    3: {
        name: "Level 3: Supermarket Aisle 🛒",
        goalName: "Checkout Zone",
        desc: "Collect all 3 Gold Stars ⭐ in the busy shop! Use 'Excuse Me' if you need space.",
        bgHex: 0xFEF3C7,
        floorHex: 0xFFFBEB,
        stars: [{ x: -5.0, z: 3.0 }, { x: 0, z: -0.5 }, { x: 5.0, z: -4.5 }],
        npcs: [
            { x: -3.0, z: 3.8, speed: 0.035, dir: 1, range: 6.5, color: 0xEF4444 },
            { x: 3.0, z: 1.5, speed: 0.04, dir: -1, range: 6.5, color: 0x8B5CF6 },
            { x: -1.2, z: -0.5, speed: 0, dir: 1, range: 0, color: 0x06B6D4 },
            { x: -4.0, z: -2.8, speed: 0.038, dir: 1, range: 7, color: 0xEC4899 },
            { x: 4.0, z: -5.2, speed: 0.042, dir: -1, range: 7, color: 0x10B981 }
        ]
    }
};

function playBubbleTone(type) {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const now = ctx.currentTime;

        if (type === 'step') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(320, now);
            osc.frequency.exponentialRampToValueAtTime(420, now + 0.06);
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.07);
        } else if (type === 'star') {
            [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now + i * 0.07);
                gain.gain.setValueAtTime(0.18, now + i * 0.07);
                gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.25);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now + i * 0.07);
                osc.stop(now + i * 0.07 + 0.25);
            });
        } else if (type === 'bump') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(220, now);
            osc.frequency.linearRampToValueAtTime(150, now + 0.25);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.28);
        } else if (type === 'excuse') {
            [440, 554.37, 659.25].forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + i * 0.09);
                gain.gain.setValueAtTime(0.16, now + i * 0.09);
                gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.3);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now + i * 0.09);
                osc.stop(now + i * 0.09 + 0.3);
            });
        }
    } catch (e) {}
}

window.bubbleActions = {
    setLevel: function(lvl) {
        state.bubble.running = false;
        state.bubble.level = lvl;
        render();
        setTimeout(initBubbleGuard, 50);
    },
    nextLevel: function() {
        const next = state.bubble.level < 3 ? state.bubble.level + 1 : 1;
        this.setLevel(next);
    },
    move: function(dx, dz) {
        if (window.bubbleMovePlayer) {
            window.bubbleMovePlayer(dx, dz);
        }
    },
    excuseMe: function() {
        if (window.bubbleExcuseMe) {
            window.bubbleExcuseMe();
        }
    }
};

function renderBubbleGuard() {
    const lvl = state.bubble.level || 1;
    const cfg = BUBBLE_LEVELS[lvl];

    let content = `
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom: 16px;">
            <button class="btn-secondary" style="width: 180px; min-height: 3.2rem; margin-top:0;" onclick="navTo('Home')">← Back Home</button>
            <div class="bubble-levels">
                <button class="bubble-lvl-btn ${lvl === 1 ? 'active' : ''}" onclick="bubbleActions.setLevel(1)">1. Corridor 🏫</button>
                <button class="bubble-lvl-btn ${lvl === 2 ? 'active' : ''}" onclick="bubbleActions.setLevel(2)">2. Playground 🛝</button>
                <button class="bubble-lvl-btn ${lvl === 3 ? 'active' : ''}" onclick="bubbleActions.setLevel(3)">3. Supermarket 🛒</button>
            </div>
        </div>

        <div class="card" style="margin-bottom: 12px; padding: 18px 22px;">
            <div class="big">${cfg.name}</div>
            <div class="small" style="font-size:1.1rem; color:#334155; font-weight:600;">${cfg.desc}</div>

            <div class="bubble-hud">
                <div id="bubbleStatusPill" class="bubble-status-pill status-comfy">
                    <span>😊</span>
                    <span id="bubbleStatusText">Comfy Space Bubble!</span>
                </div>
                <div class="bubble-star-pill">
                    <span>⭐ Stars:</span>
                    <span id="bubbleStarCount">0 / ${cfg.stars.length}</span>
                </div>
            </div>

            <div id="bubbleWin" style="display:none; margin-top:18px; padding:16px; background:#DCFCE7; border:3px solid #22C55E; border-radius:16px;">
                <div class="big text-success" style="font-size:1.6rem;">🎉 Amazing Job! You respected everyone's Personal Space!</div>
                <button onclick="bubbleActions.nextLevel()" style="max-width:320px; margin:10px auto 0 auto; background:linear-gradient(135deg, #16A34A, #15803D); font-size:1.3rem;">
                    ${lvl < 3 ? 'Next Level ➔' : 'Play Again from Level 1 🔄'}
                </button>
            </div>
        </div>

        <div id="bubbleContainer" class="bubble-container"></div>

        <div class="bubble-controls-wrap">
            <div class="bubble-dpad">
                <div></div>
                <button class="dpad-btn" onclick="bubbleActions.move(0, -1.25)" aria-label="Move Up">
                    <span style="font-size:1.8rem;">⬆️</span>
                    <span>UP</span>
                </button>
                <div></div>
                <button class="dpad-btn" onclick="bubbleActions.move(-1.25, 0)" aria-label="Move Left">
                    <span style="font-size:1.8rem;">⬅️</span>
                    <span>LEFT</span>
                </button>
                <button class="dpad-btn" onclick="bubbleActions.move(0, 1.25)" aria-label="Move Down">
                    <span style="font-size:1.8rem;">⬇️</span>
                    <span>DOWN</span>
                </button>
                <button class="dpad-btn" onclick="bubbleActions.move(1.25, 0)" aria-label="Move Right">
                    <span style="font-size:1.8rem;">➡️</span>
                    <span>RIGHT</span>
                </button>
            </div>

            <button id="excuseBtn" class="excuse-btn" onclick="bubbleActions.excuseMe()">
                <span style="font-size:2.6rem;">✋🗣️</span>
                <span>"Excuse Me, Space Please!"</span>
                <span style="font-size:0.95rem; font-weight:500; opacity:0.9;">Tap to politely ask people to step back</span>
            </button>
        </div>
    `;
    app.innerHTML += content;
}

function initBubbleGuard() {
    if (!window.THREE) return;

    const lvl = state.bubble.level || 1;
    const cfg = BUBBLE_LEVELS[lvl];

    state.bubble.running = true;
    state.bubble.completed = false;
    state.bubble.warning = false;
    state.bubble.starsCollected = 0;
    state.bubble.starsTotal = cfg.stars.length;
    state.bubble.status = 'comfy';

    const container = document.getElementById('bubbleContainer');
    if (!container) return;

    // SCENE & CAMERA
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(cfg.bgHex);
    scene.fog = new THREE.Fog(cfg.bgHex, 14, 45);

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 16.5, 12.5);
    camera.lookAt(0, 0, -1);

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // LIGHTING
    scene.add(new THREE.AmbientLight(0xffffff, 0.85));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    // MATERIALS
    const bubbleMat = new THREE.MeshStandardMaterial({ color: 0x00CCFF, transparent: true, opacity: 0.38, roughness: 0.2 });
    const playerMat = new THREE.MeshStandardMaterial({ color: 0x2563EB, roughness: 0.6 });
    const floorMat = new THREE.MeshStandardMaterial({ color: cfg.floorHex, roughness: 0.9 });
    const borderMat = new THREE.MeshStandardMaterial({ color: 0x94A3B8, roughness: 0.8 });
    const finishMat = new THREE.MeshStandardMaterial({ color: 0x22C55E, roughness: 0.7 });
    const starMat = new THREE.MeshStandardMaterial({ color: 0xFACC15, emissive: 0xCA8A04, emissiveIntensity: 0.35, roughness: 0.3 });

    // HUMAN FACTORY
    const bodyGeo = new THREE.CylinderGeometry(0.32, 0.42, 1.0, 14);
    const headGeo = new THREE.SphereGeometry(0.28, 14, 14);
    const armGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.75, 10);

    function createHuman(material) {
        const group = new THREE.Group();
        const body = new THREE.Mesh(bodyGeo, material);
        body.position.y = 0.5;
        group.add(body);

        const head = new THREE.Mesh(headGeo, new THREE.MeshStandardMaterial({ color: 0xFDE68A, roughness: 0.6 }));
        head.position.y = 1.32;
        group.add(head);

        const leftArm = new THREE.Mesh(armGeo, material);
        leftArm.position.set(-0.48, 0.6, 0);
        leftArm.rotation.z = Math.PI / 8;
        group.add(leftArm);

        const rightArm = new THREE.Mesh(armGeo, material);
        rightArm.position.set(0.48, 0.6, 0);
        rightArm.rotation.z = -Math.PI / 8;
        group.add(rightArm);

        group.userData.rightArm = rightArm;
        return group;
    }

    // GROUND, SIDE WALLS & GOAL ZONE
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 26), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.01;
    scene.add(floor);

    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.2, 24), borderMat);
    leftWall.position.set(-8.6, 0.6, -1);
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.2, 24), borderMat);
    rightWall.position.set(8.6, 0.6, -1);
    scene.add(rightWall);

    const finishZone = new THREE.Mesh(new THREE.BoxGeometry(16.5, 0.12, 3.2), finishMat);
    finishZone.position.set(0, 0.02, -9.2);
    scene.add(finishZone);

    // PLAYER PROTAGONIST
    const playerRoot = new THREE.Group();
    const bubbleMesh = new THREE.Mesh(new THREE.SphereGeometry(1.75, 32, 32), bubbleMat);
    playerRoot.add(bubbleMesh);

    const humanInside = createHuman(playerMat);
    humanInside.scale.set(0.85, 0.85, 0.85);
    playerRoot.add(humanInside);

    // PERSONAL SPACE RING
    const ringGeo = new THREE.RingGeometry(1.65, 1.82, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00CCFF, side: THREE.DoubleSide });
    const spaceRing = new THREE.Mesh(ringGeo, ringMat);
    spaceRing.rotation.x = -Math.PI / 2;
    spaceRing.position.y = 0.05;
    playerRoot.add(spaceRing);

    playerRoot.position.set(0, 0, 6.8);
    let targetPos = new THREE.Vector3(0, 0, 6.8);
    scene.add(playerRoot);

    // COLLECTIBLE STARS
    const starMeshes = [];
    const starGeo = new THREE.OctahedronGeometry(0.55, 0);
    const starRingGeo = new THREE.RingGeometry(0.6, 0.78, 32);
    const starRingMat = new THREE.MeshBasicMaterial({ color: 0xEAB308, side: THREE.DoubleSide });

    cfg.stars.forEach((sPos) => {
        const starGroup = new THREE.Group();
        const mesh = new THREE.Mesh(starGeo, starMat);
        mesh.position.y = 0.7;
        starGroup.add(mesh);

        const sRing = new THREE.Mesh(starRingGeo, starRingMat);
        sRing.rotation.x = -Math.PI / 2;
        sRing.position.y = 0.04;
        starGroup.add(sRing);

        starGroup.position.set(sPos.x, 0, sPos.z);
        starGroup.userData = { collected: false, mesh: mesh };
        scene.add(starGroup);
        starMeshes.push(starGroup);
    });

    // NPCs
    const npcs = [];
    const npcRingGeo = new THREE.RingGeometry(0.85, 0.98, 32);
    cfg.npcs.forEach((nCfg) => {
        const mat = new THREE.MeshStandardMaterial({ color: nCfg.color, roughness: 0.7 });
        const npc = createHuman(mat);

        const nRingMat = new THREE.MeshBasicMaterial({ color: 0x94A3B8, side: THREE.DoubleSide });
        const nRing = new THREE.Mesh(npcRingGeo, nRingMat);
        nRing.rotation.x = -Math.PI / 2;
        nRing.position.y = 0.03;
        npc.add(nRing);

        npc.position.set(nCfg.x, 0, nCfg.z);
        npc.userData = {
            baseSpeed: nCfg.speed,
            dir: nCfg.dir,
            range: nCfg.range || 6.5,
            pausedUntil: 0,
            ringMat: nRingMat
        };
        scene.add(npc);
        npcs.push(npc);
    });

    // HUD UPDATER
    function updateStatusUI(mode, customMsg) {
        const pill = document.getElementById('bubbleStatusPill');
        const textEl = document.getElementById('bubbleStatusText');
        if (!pill || !textEl) return;

        pill.className = 'bubble-status-pill';
        if (mode === 'comfy') {
            pill.classList.add('status-comfy');
            pill.firstElementChild.textContent = '😊';
            textEl.textContent = customMsg || 'Comfy Space Bubble!';
            container.style.borderColor = '#38BDF8';
        } else if (mode === 'close') {
            pill.classList.add('status-close');
            pill.firstElementChild.textContent = '😮';
            textEl.textContent = customMsg || 'Getting Close! Watch Your Bubble';
            container.style.borderColor = '#F59E0B';
        } else if (mode === 'bump') {
            pill.classList.add('status-bump');
            pill.firstElementChild.textContent = '🛑';
            textEl.textContent = customMsg || 'Too Close! Stepping Back Safely';
            container.style.borderColor = '#EF4444';
        }
    }

    function updateStarUI() {
        const el = document.getElementById('bubbleStarCount');
        if (el) {
            el.textContent = `${state.bubble.starsCollected} / ${state.bubble.starsTotal}`;
        }
    }

    // D-PAD & KEYBOARD MOVEMENT HOOK
    window.bubbleMovePlayer = function(dx, dz) {
        if (!state.bubble.running || state.bubble.completed) return;
        targetPos.x = THREE.MathUtils.clamp(targetPos.x + dx, -7.2, 7.2);
        targetPos.z = THREE.MathUtils.clamp(targetPos.z + dz, -9.5, 7.2);
        playBubbleTone('step');
    };

    // SELF-ADVOCACY "EXCUSE ME" HOOK
    window.bubbleExcuseMe = function() {
        if (!state.bubble.running || state.bubble.completed) return;
        playBubbleTone('excuse');
        playTTS("Excuse me, can I have some space please?");
        updateStatusUI('comfy', '✋ "Excuse me!" — Friends are giving you space!');

        const now = Date.now();
        npcs.forEach((n) => {
            n.userData.pausedUntil = now + 4000;
            n.userData.ringMat.color.setHex(0x22C55E);
            const dist = n.position.distanceTo(playerRoot.position);
            if (dist < 5.0) {
                const pushDir = new THREE.Vector3().subVectors(n.position, playerRoot.position);
                pushDir.y = 0;
                if (pushDir.lengthSq() < 0.01) pushDir.set(1, 0, 0);
                pushDir.normalize();
                n.position.x = THREE.MathUtils.clamp(n.position.x + pushDir.x * 2.2, -7.5, 7.5);
                n.position.z = THREE.MathUtils.clamp(n.position.z + pushDir.z * 1.4, -7.8, 5.8);
            }
        });
    };

    // KEYBOARD SUPPORT
    function onKeyDown(e) {
        if (state.page !== 'Bubble' || state.bubble.completed) return;
        if (e.key === 'ArrowUp' || e.key === 'w') { e.preventDefault(); window.bubbleMovePlayer(0, -1.2); }
        else if (e.key === 'ArrowDown' || e.key === 's') { e.preventDefault(); window.bubbleMovePlayer(0, 1.2); }
        else if (e.key === 'ArrowLeft' || e.key === 'a') { e.preventDefault(); window.bubbleMovePlayer(-1.2, 0); }
        else if (e.key === 'ArrowRight' || e.key === 'd') { e.preventDefault(); window.bubbleMovePlayer(1.2, 0); }
        else if (e.key === ' ') { e.preventDefault(); window.bubbleExcuseMe(); }
    }
    window.addEventListener('keydown', onKeyDown);

    // POINTER DRAG SUPPORT
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDragging = false;
    const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const planeIntersect = new THREE.Vector3();

    function onMove(e) {
        if (!isDragging || state.bubble.completed) return;
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        if (raycaster.ray.intersectPlane(dragPlane, planeIntersect)) {
            targetPos.x = THREE.MathUtils.clamp(planeIntersect.x, -7.2, 7.2);
            targetPos.z = THREE.MathUtils.clamp(planeIntersect.z, -9.5, 7.2);
        }
    }

    function onDown(e) {
        isDragging = true;
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
        onMove(e);
    }

    function onUp() {
        isDragging = false;
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
    }

    container.addEventListener('pointerdown', onDown);

    let lastBumpTime = 0;

    // ANIMATION LOOP
    function animate() {
        if (!state.bubble.running) {
            window.removeEventListener('keydown', onKeyDown);
            return;
        }
        requestAnimationFrame(animate);

        const now = Date.now();
        const time = now * 0.003;

        // Smoothly move player toward targetPos
        playerRoot.position.x = THREE.MathUtils.lerp(playerRoot.position.x, targetPos.x, 0.22);
        playerRoot.position.z = THREE.MathUtils.lerp(playerRoot.position.z, targetPos.z, 0.22);

        // Animate Stars & Check Collection
        starMeshes.forEach((sGroup) => {
            if (!sGroup.userData.collected) {
                sGroup.userData.mesh.rotation.y += 0.04;
                sGroup.userData.mesh.position.y = 0.7 + Math.sin(time * 2) * 0.15;

                if (playerRoot.position.distanceTo(sGroup.position) < 2.1) {
                    sGroup.userData.collected = true;
                    sGroup.visible = false;
                    state.bubble.starsCollected++;
                    updateStarUI();
                    playBubbleTone('star');
                    playHaptic();
                    if (state.bubble.starsCollected < state.bubble.starsTotal) {
                        playTTS("Star collected!");
                    } else {
                        playTTS(`All stars collected! Now walk to the green ${cfg.goalName}!`);
                    }
                }
            }
        });

        // Animate NPCs
        npcs.forEach((n) => {
            if (now < n.userData.pausedUntil) {
                // Paused politely after "Excuse Me"
                n.position.y = 0;
                return;
            } else {
                n.userData.ringMat.color.setHex(0x94A3B8);
            }

            if (n.userData.baseSpeed > 0) {
                n.position.x += n.userData.baseSpeed * n.userData.dir;
                if (Math.abs(n.position.x) > n.userData.range) {
                    n.userData.dir *= -1;
                }
                n.position.y = Math.abs(Math.sin(time + n.position.x)) * 0.14;
            }
        });

        // Player subtle bobbing
        const moving = playerRoot.position.distanceTo(targetPos) > 0.08 || isDragging;
        if (moving) {
            humanInside.position.y = Math.abs(Math.sin(time * 2.5)) * 0.18;
        } else {
            humanInside.position.y = THREE.MathUtils.lerp(humanInside.position.y, 0, 0.15);
        }

        if (!state.bubble.completed) {
            let minDistance = 999;
            let closestNpc = null;

            npcs.forEach((n) => {
                const d = playerRoot.position.distanceTo(n.position);
                if (d < minDistance) {
                    minDistance = d;
                    closestNpc = n;
                }
            });

            if (minDistance < 2.25 && closestNpc) {
                // BUMP! Gentle bounce back to respect personal space
                const pushVec = new THREE.Vector3().subVectors(playerRoot.position, closestNpc.position);
                pushVec.y = 0;
                if (pushVec.lengthSq() < 0.01) pushVec.set(0, 0, 1);
                pushVec.normalize();

                targetPos.x = THREE.MathUtils.clamp(playerRoot.position.x + pushVec.x * 1.6, -7.2, 7.2);
                targetPos.z = THREE.MathUtils.clamp(playerRoot.position.z + pushVec.z * 1.6, -9.5, 7.2);

                bubbleMesh.material.color.setHex(0xEF4444);
                spaceRing.material.color.setHex(0xEF4444);
                updateStatusUI('bump');

                if (now - lastBumpTime > 2200) {
                    lastBumpTime = now;
                    container.classList.add('screen-shake');
                    playBubbleTone('bump');
                    playHaptic();
                    playTTS("Oops, too close! Let's step back and give space.");
                    setTimeout(() => container.classList.remove('screen-shake'), 400);
                }
            } else if (minDistance < 3.2) {
                // AMBER WARNING ZONE
                bubbleMesh.material.color.setHex(0xF59E0B);
                spaceRing.material.color.setHex(0xF59E0B);
                updateStatusUI('close');
            } else if (now - lastBumpTime > 900) {
                // COMFY SPACE ZONE
                bubbleMesh.material.color.setHex(0x00CCFF);
                spaceRing.material.color.setHex(0x00CCFF);
                updateStatusUI('comfy');
            }

            // CHECK GOAL ZONE
            if (playerRoot.position.z < -7.8) {
                if (state.bubble.starsCollected >= state.bubble.starsTotal) {
                    state.bubble.completed = true;
                    bubbleMesh.material.color.setHex(0x22C55E);
                    spaceRing.material.color.setHex(0x22C55E);
                    updateStatusUI('comfy', '🎉 Goal Reached Safely with All Stars!');
                    playBubbleTone('star');
                    confetti({ particleCount: 180, spread: 80, origin: { y: 0.6 } });
                    playTTS(`Fantastic job! You collected all the stars and reached the ${cfg.goalName} safely!`);
                    const winEl = document.getElementById('bubbleWin');
                    if (winEl) winEl.style.display = 'block';
                } else {
                    // Gently remind student to collect the remaining stars first
                    targetPos.z = -6.8;
                    updateStatusUI('close', `⭐ Collect all ${state.bubble.starsTotal} Gold Stars before entering the Green Zone!`);
                    if (now - lastBumpTime > 2500) {
                        lastBumpTime = now;
                        playTTS(`Almost there! Collect the gold star first!`);
                    }
                }
            }
        }

        renderer.render(scene, camera);
    }
    animate();
}

// INIT
render();
