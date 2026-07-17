// Audio Module
export class AudioService {
    constructor() {
        this.audioContext = null; // Initialize on first interaction
        this.masterVolume = 0.5;
        this.animalSoundsMuted = false;
    }

    init() {
        if (!this.audioContext) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.audioContext = new AudioContext();
            }
        }
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    setVolume(value) {
        this.masterVolume = parseFloat(value);
    }

    setAnimalSoundsMuted(isMuted) {
        this.animalSoundsMuted = isMuted;
    }

    playChime() {
        this.init();
        if (!this.audioContext || this.masterVolume === 0) return;
        
        // Create a gentle, positive chime using Web Audio API
        const osc = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, this.audioContext.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(1046.50, this.audioContext.currentTime + 0.1); // C6
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.3, this.audioContext.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1.5);
        
        osc.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        osc.start();
        osc.stop(this.audioContext.currentTime + 1.5);
    }

    async playAnimalSound(soundUrl) {
        if (this.animalSoundsMuted || this.masterVolume === 0) return;
        this.init();
        
        try {
            // For MVP and missing assets, gracefully catch 404s
            const audio = new Audio(soundUrl);
            audio.volume = this.masterVolume;
            await audio.play();
        } catch (e) {
            console.log(`Animal sound not available yet: ${soundUrl}`);
            // Fallback: we could synthesize an approximation or just fail silently.
            // Silently failing is best for SEN as unexpected errors are disruptive.
        }
    }
}
