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
    }
};

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
                : "Learning public transport routines and timing.";

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
}

function renderHome() {
    app.innerHTML += `
        <div class="card">
            <div class="big">Start an activity</div>
            <div class="small">Choose a calm activity below.</div>
        </div>
        <div class="grid-3">
            <button onclick="navTo('Socks')">Matching Socks 🧦</button>
            <button onclick="navTo('Sandwich')">Sandwich Maker 🥪</button>
            <button onclick="navTo('Bus')">Bus Buddy 🚌</button>
        </div>
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

// INIT
render();
