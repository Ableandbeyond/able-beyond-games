let currentStep = 1;

function goToStep(step) {
    currentStep = step;
    
    // Hide all steps
    document.querySelectorAll('.step-content').forEach(el => {
        el.classList.add('hidden');
        el.classList.remove('flex');
    });
    
    // Hide all TA guides
    document.querySelectorAll('.ta-guide').forEach(el => el.classList.add('hidden'));
    
    // Show current step
    const stepEl = document.getElementById('step' + step);
    stepEl.classList.remove('hidden');
    stepEl.classList.add('flex');
    
    // Show current TA guide
    document.getElementById('ta-guide-' + step).classList.remove('hidden');
    
    // Update progress bar UI
    for(let i=1; i<=3; i++) {
        const btn = document.getElementById('nav-step' + i);
        if(i === step) {
            btn.className = 'px-8 py-4 rounded-full font-bold text-2xl transition-colors bg-blue-500 text-white shadow-lg';
        } else if (i < step) {
            btn.className = 'px-8 py-4 rounded-full font-bold text-2xl transition-colors bg-green-500 text-white shadow-md';
        } else {
            btn.className = 'px-8 py-4 rounded-full font-bold text-2xl transition-colors bg-gray-200 text-gray-500';
        }
    }

    const nextBtn = document.getElementById('next-step-btn');
    if (step === 3) {
        nextBtn.classList.add('hidden');
    } else {
        nextBtn.classList.remove('hidden');
    }
}

function nextStep() {
    if(currentStep < 3) goToStep(currentStep + 1);
}

// Step 1: Emotions
document.querySelectorAll('.emotion-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const word = btn.getAttribute('data-word');
        
        // Speak using Web Speech API
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // stop previous
            const utterance = new SpeechSynthesisUtterance(word);
            utterance.rate = 0.9; // slightly slower for clarity
            utterance.pitch = 1.1;
            window.speechSynthesis.speak(utterance);
        }
        
        // Button burst animation
        btn.classList.remove('animate-burst');
        void btn.offsetWidth; // trigger reflow
        btn.classList.add('animate-burst');
        
        // Create Confetti
        createConfetti(e.clientX, e.clientY);
    });
});

function createConfetti(x, y) {
    const colors = ['#f87171', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa'];
    for(let i=0; i<15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = 60 + Math.random() * 120;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 1000);
    }
}

// Step 2: Explore Rooms
const modal = document.getElementById('room-modal');
const modalContent = document.getElementById('modal-content');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalVideo = document.getElementById('modal-video');

document.querySelectorAll('.room-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const room = btn.getAttribute('data-room');
        const desc = btn.getAttribute('data-desc');
        const video = btn.getAttribute('data-video');
        
        modalTitle.textContent = room;
        modalDesc.textContent = desc;
        modalVideo.src = video; // Automatically load embedded video
        
        modal.classList.remove('hidden');
        setTimeout(() => {
            modalContent.classList.remove('scale-95');
            modalContent.classList.add('scale-100');
        }, 10);
    });
});

function closeModal() {
    modalContent.classList.remove('scale-100');
    modalContent.classList.add('scale-95');
    setTimeout(() => {
        modal.classList.add('hidden');
        modalVideo.src = ''; // stop video playing when closed
    }, 200);
}

// Step 3: Build Future
let hobbiesAdded = 0;
document.querySelectorAll('.hobby-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Prevent double clicking same item
        if (btn.style.opacity === '0.5') return;
        
        const rect = btn.getBoundingClientRect();
        const clone = btn.cloneNode(true);
        
        // Style clone to fly
        clone.classList.remove('massive-btn', 'hover:border-gray-200');
        clone.classList.add('flying-hobby', 'w-32', 'h-32', 'rounded-2xl', 'text-xl', 'shadow-2xl', 'border-blue-400');
        clone.style.left = rect.left + 'px';
        clone.style.top = rect.top + 'px';
        clone.style.margin = '0';
        
        document.body.appendChild(clone);
        
        const rocketZone = document.getElementById('rocket-items');
        const rocketRect = rocketZone.getBoundingClientRect();
        
        // Calculate destination (center of rocket zone with some randomness)
        setTimeout(() => {
            const targetX = rocketRect.left + rocketRect.width / 2 - 64 + (Math.random() * 60 - 30);
            const targetY = rocketRect.top + rocketRect.height / 2 - 64 + (Math.random() * 60 - 30);
            
            clone.style.transform = `translate(${targetX - rect.left}px, ${targetY - rect.top}px) scale(0.7) rotate(${Math.random() * 20 - 10}deg)`;
            
            setTimeout(() => {
                clone.remove();
                
                // Add permanent item inside rocket outline
                const finalItem = document.createElement('div');
                finalItem.className = 'bg-white p-3 rounded-2xl shadow-lg flex flex-col items-center justify-center font-bold hobby-in-rocket border-4 border-blue-200 text-lg m-1';
                finalItem.innerHTML = btn.innerHTML;
                rocketZone.appendChild(finalItem);
                
                hobbiesAdded++;
                if(hobbiesAdded >= 1) { 
                    document.getElementById('launch-btn').classList.remove('hidden');
                }
                
                // Popping sound
                if ('speechSynthesis' in window) {
                    const utterance = new SpeechSynthesisUtterance('Pop!');
                    utterance.rate = 2.0;
                    utterance.pitch = 1.5;
                    window.speechSynthesis.speak(utterance);
                }
                
            }, 800); // wait for fly animation to finish
            
        }, 50);
        
        // Visual feedback on the original button
        btn.style.opacity = '0.5';
        btn.style.transform = 'scale(0.95)';
    });
});

// Launch Button
document.getElementById('launch-btn').addEventListener('click', () => {
    const overlay = document.getElementById('launch-overlay');
    const rocket = document.getElementById('flying-rocket');
    
    overlay.classList.remove('hidden');
    
    // Launch sound/announcement
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance('Blast off! To the future!');
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    }
    
    // Trigger CSS animation for rocket
    setTimeout(() => {
        rocket.classList.add('rocket-launching');
    }, 500);
});

// Initialize first step
goToStep(1);
