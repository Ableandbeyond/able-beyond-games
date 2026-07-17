// Speech Synthesis Module
export class SpeechService {
    constructor() {
        this.synth = window.speechSynthesis;
        this.enabled = true;
        this.voice = null;
        this.rate = 0.8; // Slow rate for SEN learners
        this.pitch = 1.0;
        
        // Wait for voices to load (async in some browsers)
        if (this.synth && this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = this.loadVoices.bind(this);
        } else {
            this.loadVoices();
        }
    }

    loadVoices() {
        if (!this.synth) return;
        const voices = this.synth.getVoices();
        // Try to find a clear English voice
        this.voice = voices.find(v => v.lang.startsWith('en-GB')) || 
                     voices.find(v => v.lang.startsWith('en-US')) || 
                     voices[0];
    }

    setEnabled(isEnabled) {
        this.enabled = isEnabled;
    }

    speak(text) {
        if (!this.enabled || !this.synth) return;
        
        // Cancel any ongoing speech so it doesn't overlap
        this.synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        if (this.voice) {
            utterance.voice = this.voice;
        }
        utterance.rate = this.rate;
        utterance.pitch = this.pitch;
        
        this.synth.speak(utterance);
    }
}
