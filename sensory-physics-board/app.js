// Audio Setup for immediate feedback
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    if (type === 'pop') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    } else if (type === 'deep') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.8, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
    } else if (type === 'chime') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
    } else if (type === 'tick') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
    }
}

// Matter.js Setup
const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      MouseConstraint = Matter.MouseConstraint,
      Mouse = Matter.Mouse,
      World = Matter.World,
      Bodies = Matter.Bodies,
      Body = Matter.Body,
      Composite = Matter.Composite,
      Constraint = Matter.Constraint,
      Events = Matter.Events;

const canvasContainer = document.getElementById('canvas-container');
let width = canvasContainer.clientWidth;
let height = canvasContainer.clientHeight;

const engine = Engine.create();
const world = engine.world;

const render = Render.create({
    element: canvasContainer,
    engine: engine,
    options: {
        width: width,
        height: height,
        wireframes: false,
        background: 'transparent'
    }
});

Render.run(render);
const runner = Runner.create();
Runner.run(runner, engine);

// Add Mouse Interaction
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: { visible: false }
    }
});
World.add(world, mouseConstraint);
render.mouse = mouse;

// Play sound on click/touch in canvas
Events.on(mouseConstraint, 'mousedown', function(event) {
    playSound('pop');
});

// Resize handler
window.addEventListener('resize', () => {
    width = canvasContainer.clientWidth;
    height = canvasContainer.clientHeight;
    render.canvas.width = width;
    render.canvas.height = height;
    render.options.width = width;
    render.options.height = height;
    resetBoundaries();
});

function playVoice(text, actionName) {
    const audioUrl = `audio/${actionName.toLowerCase()}.mp3`;
    const audio = new Audio(audioUrl);
    audio.play().catch(e => {
        // Fallback to TTS if file is missing
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(text);
            u.rate = 0.9;
            u.pitch = 1.1; // Friendly tone
            u.volume = 1.0; // Max volume
            window.speechSynthesis.speak(u);
        }
    });
}

let boundaries = [];
let defaultShapes = [];
let sensoryInterval, walkInterval, timerInterval, breakInterval;
let pendulumElements = [];

function resetBoundaries() {
    if (boundaries.length > 0) {
        World.remove(world, boundaries);
    }
    const thickness = 60;
    boundaries = [
        Bodies.rectangle(width / 2, -thickness / 2, width, thickness, { isStatic: true }), // Top
        Bodies.rectangle(width / 2, height + thickness / 2, width, thickness, { isStatic: true }), // Bottom
        Bodies.rectangle(-thickness / 2, height / 2, thickness, height, { isStatic: true }), // Left
        Bodies.rectangle(width + thickness / 2, height / 2, thickness, height, { isStatic: true }) // Right
    ];
    World.add(world, boundaries);
}

const colors = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];

function spawnDefaultShapes() {
    // If shapes already exist, just move them to center
    if (defaultShapes.length > 0) {
        defaultShapes.forEach(b => {
            Body.setPosition(b, {
                x: width / 2 + (Math.random() - 0.5) * 100,
                y: height / 2 + (Math.random() - 0.5) * 100
            });
            Body.setVelocity(b, { x: 0, y: 0 });
            Matter.Sleeping.set(b, false);
        });
        return;
    }
    for (let i = 0; i < 8; i++) {
        const size = 60 + Math.random() * 60;
        const color = colors[Math.floor(Math.random() * colors.length)];
        let body;
        if (Math.random() > 0.5) {
            body = Bodies.circle(Math.random() * width, Math.random() * height * 0.5, size / 2, {
                render: { fillStyle: color },
                restitution: 0.8
            });
        } else {
            body = Bodies.rectangle(Math.random() * width, Math.random() * height * 0.5, size, size, {
                render: { fillStyle: color },
                restitution: 0.8,
                chamfer: { radius: 10 }
            });
        }
        defaultShapes.push(body);
    }
    World.add(world, defaultShapes);
}

function clearState() {
    // Stop intervals
    clearInterval(sensoryInterval);
    clearInterval(walkInterval);
    clearInterval(timerInterval);
    clearInterval(breakInterval);
    
    // Reset Engine & Gravity (Matter.js 0.19.0 uses engine.gravity, some older use world.gravity)
    engine.timing.timeScale = 1;
    if (engine.gravity) {
        engine.gravity.y = 1;
        engine.gravity.x = 0;
    }
    if (world.gravity) {
        world.gravity.y = 1;
        world.gravity.x = 0;
    }
    
    // Reset UI Overlays
    document.getElementById('pulse-overlay').classList.add('hidden');
    document.getElementById('timer-overlay').classList.add('hidden');
    document.getElementById('break-overlay').classList.add('hidden');
    document.body.classList.remove('dark-mode');
    
    // Clear special bodies
    if (pendulumElements.length > 0) {
        World.remove(world, pendulumElements);
        pendulumElements = [];
    }
    
    // Ensure default shapes exist and are visible in bounds
    if (defaultShapes.length === 0) {
        spawnDefaultShapes();
    } else {
        defaultShapes.forEach(b => {
            Body.setStatic(b, false);
            b.render.visible = true;
            b.render.opacity = 1;
            Matter.Sleeping.set(b, false);
            
            // If body fell out of bounds somehow, reset to center
            if (b.position.y > height + 200 || b.position.y < -200 || b.position.x > width + 200 || b.position.x < -200) {
                Body.setPosition(b, {
                    x: width / 2 + (Math.random() - 0.5) * 100,
                    y: height / 2 + (Math.random() - 0.5) * 100
                });
                Body.setVelocity(b, { x: 0, y: 0 });
            }
        });
    }
}

// Initial Setup
resetBoundaries();
spawnDefaultShapes();

// -- Button Handlers --
document.querySelectorAll('.node-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Haptic feedback if available
        if ('vibrate' in navigator) navigator.vibrate(50);
        
        // Prevent click from getting stuck on child elements (like emoji spans)
        const btnElement = e.target.closest('.node-btn');
        const action = btnElement.getAttribute('data-action');
        handleAction(action);
    });
});

function handleAction(action) {
    clearState();
    
    // Speak the action name
    const friendlyName = action.replace('_', ' ');
    playVoice(friendlyName, action);
    
    switch (action) {
        case 'STOP':
            playSound('deep');
            engine.timing.timeScale = 0; // Freeze physics
            document.getElementById('pulse-overlay').classList.remove('hidden');
            break;
            
        case 'GO':
            playSound('chime');
            engine.timing.timeScale = 1.2;
            if (engine.gravity) engine.gravity.y = 0; // Remove gravity so they float around actively
            if (world.gravity) world.gravity.y = 0;
            
            defaultShapes.forEach(b => {
                Matter.Sleeping.set(b, false);
                Body.setVelocity(b, {
                    x: (Math.random() - 0.5) * 30,
                    y: (Math.random() - 0.5) * 30
                });
            });
            break;
            
        case 'BREAK':
            playSound('chime');
            document.getElementById('break-overlay').classList.remove('hidden');
            let breakTime = 60;
            const breakTimerEl = document.querySelector('.break-timer');
            breakTimerEl.innerText = breakTime;
            breakInterval = setInterval(() => {
                breakTime--;
                breakTimerEl.innerText = breakTime;
                if (breakTime % 10 === 0) playSound('tick'); // Gentle tick
                if (breakTime <= 0) {
                    clearInterval(breakInterval);
                    document.getElementById('break-overlay').classList.add('hidden');
                    playSound('chime');
                }
            }, 1000);
            break;
            
        case 'SENSORY_ROOM':
            playSound('chime');
            document.body.classList.add('dark-mode');
            if (engine.gravity) engine.gravity.y = 0.05; // Float gently
            if (world.gravity) world.gravity.y = 0.05;
            
            // Turn default shapes into 'glow' mode
            defaultShapes.forEach(b => {
                b.render.opacity = 0.3;
            });
            
            // Spawn temporary light particles
            sensoryInterval = setInterval(() => {
                const particle = Bodies.circle(Math.random() * width, height + 20, Math.random() * 15 + 5, {
                    render: { 
                        fillStyle: ['#00FFFF', '#FF00FF', '#FFFF00', '#00FF00'][Math.floor(Math.random() * 4)],
                        opacity: 0.8
                    },
                    frictionAir: 0.02,
                    restitution: 0.9,
                    isSensor: true
                });
                World.add(world, particle);
                Body.setVelocity(particle, { x: (Math.random() - 0.5) * 5, y: -5 - Math.random() * 5 });
                
                // Remove particle after a few seconds
                setTimeout(() => { World.remove(world, particle); }, 4000);
            }, 300);
            break;
            
        case 'SWING':
            playSound('pop');
            // Hide default shapes temporarily
            defaultShapes.forEach(b => Body.setPosition(b, { x: -1000, y: -1000 }));
            
            const anchor = { x: width / 2, y: 50 };
            const bob = Bodies.circle(width / 2 + 200, 200, 80, {
                render: { fillStyle: '#EA580C' },
                density: 0.05,
                restitution: 0.9
            });
            const constraint = Constraint.create({
                pointA: anchor,
                bodyB: bob,
                length: Math.min(width, height) * 0.4,
                stiffness: 0.1,
                render: { lineWidth: 10, strokeStyle: '#333' }
            });
            
            pendulumElements = [bob, constraint];
            World.add(world, pendulumElements);
            
            // Give initial push
            Body.applyForce(bob, bob.position, { x: 5, y: 0 });
            break;
            
        case 'WALK':
            playSound('tick');
            let walkStep = 0;
            walkInterval = setInterval(() => {
                playSound('tick');
                walkStep++;
                const isRight = walkStep % 2 === 0;
                
                defaultShapes.forEach(b => {
                    Matter.Sleeping.set(b, false); // Keep awake
                    // Nudge shapes side to side strongly
                    Body.setVelocity(b, { 
                        x: isRight ? 15 : -15, 
                        y: -5 
                    });
                });
                
                // Visual pulse on background
                canvasContainer.style.backgroundColor = isRight ? '#CBD5E1' : '#E2E8F0';
            }, 800); // Rhythmic walk pace
            break;
            
        case 'TIME':
            playSound('chime');
            document.getElementById('timer-overlay').classList.remove('hidden');
            let timeleft = 10;
            const timerText = document.getElementById('timer-text');
            const progressCircle = document.querySelector('.timer-progress');
            
            timerText.innerText = timeleft;
            progressCircle.style.strokeDashoffset = '0';
            
            timerInterval = setInterval(() => {
                timeleft--;
                timerText.innerText = timeleft;
                const offset = 283 - (timeleft / 10) * 283;
                progressCircle.style.strokeDashoffset = offset;
                
                playSound('tick');
                
                if (timeleft <= 0) {
                    clearInterval(timerInterval);
                    document.getElementById('timer-overlay').classList.add('hidden');
                    playSound('pop');
                }
            }, 1000);
            break;
            
        case 'SPACE':
            playSound('chime');
            if (engine.gravity) {
                engine.gravity.y = -1; // Reverse gravity (fly to ceiling)
                engine.gravity.x = 0;
            }
            if (world.gravity) {
                world.gravity.y = -1;
                world.gravity.x = 0;
            }
            
            defaultShapes.forEach(b => {
                Matter.Sleeping.set(b, false);
                // Give a gentle bump so they start floating if they were resting
                Body.applyForce(b, b.position, { x: (Math.random() - 0.5) * 0.1, y: -0.2 });
            });
            break;
    }
}
