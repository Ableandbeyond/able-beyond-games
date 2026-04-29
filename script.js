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
        running: false,
        warning: false,
        completed: false
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
    app.innerHTML += `
        <div class="card">
            <div class="big">Start an activity</div>
            <div class="small">Choose a calm activity below.</div>
        </div>
        <div class="grid-4" style="margin-bottom: 20px;">
            <button onclick="navTo('Socks')">Matching Socks 🧦</button>
            <button onclick="navTo('Sandwich')">Sandwich Maker 🥪</button>
            <button onclick="navTo('Bus')">Bus Buddy 🚌</button>
            <button onclick="navTo('Pharmacy')">Healthy Hero 🏥</button>
        </div>
        <div class="grid-3" style="margin-bottom: 20px;">
            <button style="margin-top:0;" onclick="navTo('Zen')">The Zen Zone 🧹</button>
            <button style="margin-top:0;" onclick="navTo('Bubble')">Bubble Guard 🫧</button>
            <button style="margin-top:0;" onclick="navTo('Grocery')">Grocery Grab 🛒</button>
        </div>
        <div class="card">
            <div class="small">Designed for neurodiverse learners. Calm colours. Clear feedback.</div>
        </div>
    `;
}

function navTo(page) {
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
    textEl.innerText = \`Spent: £\${g.spent.toFixed(2)} / Budget: £\${g.budget.toFixed(2)}\`;
}

function renderGrocery() {
    let content = \`
        <div style="display:flex; justify-content:space-between; margin-bottom: 20px;">
            <button class="btn-secondary" style="width: 200px; min-height: 3rem;" onclick="navTo('Home')">← Back Home</button>
            <button class="btn-secondary" style="width: 200px; min-height: 3rem;" onclick="groceryActions.checkout()">Checkout 🛒</button>
        </div>
    \`;

    const g = state.grocery;

    if (!g.completed) {
        content += \`
            <div class="card">
                <div class="big">Grocery Grab</div>
                <div class="small">Choose items to put in your basket. Keep an eye on your budget!</div>
            </div>

            <div class="budget-buffer-container">
                <div id="budget-fill" class="budget-buffer-fill bg-green" style="width: 0%;"></div>
                <div id="budget-text" class="budget-buffer-text">Spent: £0.00 / Budget: £\${g.budget.toFixed(2)}</div>
            </div>

            <div class="grid-3" style="margin-top: 20px; gap: 20px;">
        \`;

        g.items.forEach(item => {
            content += \`
                <div class="grocery-item" onclick="groceryActions.selectItem(\${item.id}, event)">
                    <div class="grocery-icon">\${item.icon}</div>
                    <div class="grocery-name">\${item.name}</div>
                    <div class="grocery-price">£\${item.price.toFixed(2)}</div>
                </div>
            \`;
        });

        content += \`
            </div>
            
            <div id="grocery-basket" class="card" style="margin-top: 30px; border-style: dashed; border-width: 4px; border-color: #94A3B8;">
                <div class="big">Your Basket (\${g.basket.length} items)</div>
                <div style="display:flex; flex-wrap:wrap; gap: 10px; justify-content:center; margin-top: 10px; font-size: 2rem;">
                    \${g.basket.map(i => i.icon).join('')}
                </div>
            </div>
        \`;
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

        content += \`
            <div class="card">
                <div class="big text-success">🎉 Checkout Complete!</div>
                <div class="small">You spent £\${g.spent.toFixed(2)} out of your £\${g.budget.toFixed(2)} budget.</div>
                \${overBudget ? '<div class="text-error" style="font-weight:bold; margin-top:10px;">You went a bit over budget! Next time, try to keep the bar green or amber.</div>' : '<div class="text-success" style="font-weight:bold; margin-top:10px;">Great job staying within budget!</div>'}
            </div>

            <div class="sen-report card" style="text-align:left; background: #F8FAFC;">
                <div class="big" style="font-size: 1.2rem; margin-bottom: 15px;">SEN Report Sync Data</div>
                <div class="small" style="margin-bottom: 10px;">Copy this data for the Local Authority Report Generator to demonstrate Independent Living Skills progress.</div>
                <pre style="background: #E2E8F0; padding: 15px; border-radius: 8px; overflow-x: auto; font-family: monospace; font-size: 0.9rem; color: #1E293B;">\${JSON.stringify(reportData, null, 2)}</pre>
            </div>

            <button onclick="navTo('Grocery')">Play Again</button>
        \`;
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

// ------ THE BUBBLE GUARD (Three.js) ------
function renderBubbleGuard() {
    let content = `
        <div style="display:flex; justify-content:space-between; margin-bottom: 20px;">
            <button class="btn-secondary" style="width: 200px; min-height: 3rem;" onclick="navTo('Home')">← Back Home</button>
        </div>
        <div class="card">
            <div class="big">The Bubble Guard</div>
            <div class="small">Drag the blue bubble carefully to the Green Zone! Keep your personal space away from the other people!</div>
            <div id="bubbleWin" class="big text-success" style="display:none; margin-top:20px;">🎉 Reached the Goal safely!</div>
        </div>
        <div id="bubbleContainer" class="bubble-container"></div>
    `;
    app.innerHTML += content;
}

function initBubbleGuard() {
    if (!window.THREE) return;
    
    state.bubble.running = true;
    state.bubble.completed = false;
    state.bubble.warning = false;

    const container = document.getElementById('bubbleContainer');
    if(!container) return;

    // SCENE & CAMERA
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdce0e5);
    scene.fog = new THREE.Fog(0xdce0e5, 10, 50);

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 16, 12);
    camera.lookAt(0, 0, 0);

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // LIGHTING
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    // MATERIALS
    const bubbleMat = new THREE.MeshStandardMaterial({ color: 0x00CCFF, transparent: true, opacity: 0.4, roughness: 0.3 });
    const npcMat = new THREE.MeshStandardMaterial({ color: 0x64748B, roughness: 1 });
    const playerMat = new THREE.MeshStandardMaterial({ color: 0x3B82F6, roughness: 1 });
    const floorMat = new THREE.MeshStandardMaterial({ color: 0xF1F5F9, roughness: 1 });
    const finishMat = new THREE.MeshStandardMaterial({ color: 0x22C55E, roughness: 1 });

    // HUMAN FACTORY
    const bodyGeo = new THREE.CylinderGeometry(0.3, 0.4, 1.0, 12);
    const headGeo = new THREE.SphereGeometry(0.25, 12, 12);
    const armGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.8, 8);

    function createHuman(material) {
        const group = new THREE.Group();
        const body = new THREE.Mesh(bodyGeo, material);
        body.position.y = 0.5;
        group.add(body);
        
        const head = new THREE.Mesh(headGeo, material);
        head.position.y = 1.3;
        group.add(head);

        const leftArm = new THREE.Mesh(armGeo, material);
        leftArm.position.set(-0.5, 0.6, 0);
        leftArm.rotation.z = Math.PI / 8;
        group.add(leftArm);

        const rightArm = new THREE.Mesh(armGeo, material);
        rightArm.position.set(0.5, 0.6, 0);
        rightArm.rotation.z = -Math.PI / 8;
        group.add(rightArm);
        
        return group;
    }

    // GROUND & GOAL
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), floorMat);
    floor.rotation.x = -Math.PI/2;
    floor.position.y = -0.01;
    scene.add(floor);

    const finishZone = new THREE.Mesh(new THREE.BoxGeometry(20, 0.1, 4), finishMat);
    finishZone.position.set(0, 0, -10);
    scene.add(finishZone);

    // PLAYER PROTAGONIST
    const playerRoot = new THREE.Group();
    const bubbleMesh = new THREE.Mesh(new THREE.SphereGeometry(1.8, 32, 32), bubbleMat);
    playerRoot.add(bubbleMesh);
    
    const humanInside = createHuman(playerMat);
    humanInside.scale.set(0.8, 0.8, 0.8);
    playerRoot.add(humanInside);

    // PERSONAL SPACE RING
    const ringGeo = new THREE.RingGeometry(1.75, 1.85, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00CCFF, side: THREE.DoubleSide });
    const spaceRing = new THREE.Mesh(ringGeo, ringMat);
    spaceRing.rotation.x = -Math.PI / 2;
    spaceRing.position.y = 0.05;
    playerRoot.add(spaceRing);

    playerRoot.position.set(0, 0, 6);
    scene.add(playerRoot);

    // NPCs
    const npcs = [];
    for(let i=0; i<7; i++) {
        const npc = createHuman(npcMat);
        npc.position.set((Math.random()-0.5)*14, 0, (Math.random()-0.5)*10 - 2);
        npc.userData = { 
            speed: (Math.random() * 0.015) + 0.01, // Gentler pacing
            dir: Math.random() > 0.5 ? 1 : -1 
        };
        scene.add(npc);
        npcs.push(npc);
    }

    // INTERACTION (Pointer Events)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDragging = false;
    const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const planeIntersect = new THREE.Vector3();

    function onMove(e) {
        if(!isDragging || state.bubble.completed) return;
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        if(raycaster.ray.intersectPlane(dragPlane, planeIntersect)) {
            playerRoot.position.x = THREE.MathUtils.clamp(planeIntersect.x, -8, 8);
            playerRoot.position.z = THREE.MathUtils.clamp(planeIntersect.z, -12, 8);
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

    // LOOP
    function animate() {
        if(!state.bubble.running) return;
        requestAnimationFrame(animate);

        const time = Date.now() * 0.003;

        // Animate NPCs
        npcs.forEach(n => {
            n.position.x += n.userData.speed * n.userData.dir;
            if(Math.abs(n.position.x) > 8) n.userData.dir *= -1;
            // Subtle Bobbing
            n.position.y = Math.abs(Math.sin(time + n.position.x)) * 0.15;
        });

        // Player Bobbing if dragging
        if(isDragging) {
            humanInside.position.y = Math.abs(Math.sin(time * 2)) * 0.2;
        } else {
            humanInside.position.y = THREE.MathUtils.lerp(humanInside.position.y, 0, 0.1);
        }

        if(!state.bubble.completed) {
            let collision = false;
            npcs.forEach(n => {
                if(playerRoot.position.distanceTo(n.position) < 2.5) collision = true;
            });

            if(collision && !state.bubble.warning) {
                state.bubble.warning = true;
                bubbleMesh.material.color.setHex(0xFF9900);
                spaceRing.material.color.setHex(0xFF9900);
                container.classList.add('screen-shake');
                playHaptic();
                setTimeout(() => container.classList.remove('screen-shake'), 400);
            } else if(!collision && state.bubble.warning) {
                state.bubble.warning = false;
                bubbleMesh.material.color.setHex(0x00CCFF);
                spaceRing.material.color.setHex(0x00CCFF);
            }

            if(playerRoot.position.z < -8) {
                state.bubble.completed = true;
                bubbleMesh.material.color.setHex(0x22C55E);
                spaceRing.material.color.setHex(0x22C55E);
                confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 } });
                playTTS("Great job! You stayed safe!");
                document.getElementById('bubbleWin').style.display = 'block';
            }
        }
        renderer.render(scene, camera);
    }
    animate();
}

// INIT
render();
