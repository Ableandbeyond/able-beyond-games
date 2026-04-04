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
                        : "Relaxing sorting activity with gentle touch interactions.";

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
        <button style="margin-top:0;" onclick="navTo('Zen')">The Zen Zone 🧹</button>
        <div class="card" style="margin-top:20px;">
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
    }
    render();
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

// INIT
render();
