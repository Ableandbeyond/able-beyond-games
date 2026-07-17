import { animals } from './data.js';
import { SpeechService } from './speech.js';
import { AudioService } from './audio.js';
import { UIManager } from './ui.js';

class App {
    constructor() {
        this.speech = new SpeechService();
        this.audio = new AudioService();
        this.ui = new UIManager(this.handleCardInteraction.bind(this));
        
        this.pairsPerPage = 4;
        this.currentPage = 0;
        this.totalPages = Math.ceil(animals.length / this.pairsPerPage);
        
        this.selection = {
            image: null,
            word: null
        };
        
        this.matchedCount = 0;
        
        this.initPreferences();
        this.initToolbar();
        this.loadPage(0);
    }

    initPreferences() {
        const theme = localStorage.getItem('theme') || 'light';
        const highContrast = localStorage.getItem('highContrast') === 'true';
        const volume = localStorage.getItem('volume') || '0.5';
        const muteSounds = localStorage.getItem('muteSounds') === 'true';
        const tts = localStorage.getItem('tts') !== 'false'; // default true
        
        this.applyTheme(theme, highContrast);
        
        document.getElementById('volume-slider').value = volume;
        this.audio.setVolume(volume);
        
        this.audio.setAnimalSoundsMuted(muteSounds);
        document.getElementById('btn-mute').setAttribute('aria-pressed', muteSounds.toString());
        
        this.speech.setEnabled(tts);
        document.getElementById('btn-tts').setAttribute('aria-pressed', tts.toString());
    }

    savePreference(key, value) {
        localStorage.setItem(key, value);
    }

    applyTheme(theme, highContrast) {
        const root = document.documentElement;
        if (highContrast) {
            root.setAttribute('data-theme', 'high-contrast');
        } else {
            root.setAttribute('data-theme', theme);
        }
        
        document.getElementById('btn-theme').setAttribute('aria-pressed', (theme === 'dark').toString());
        document.getElementById('btn-contrast').setAttribute('aria-pressed', highContrast.toString());
        
        this.savePreference('theme', theme);
        this.savePreference('highContrast', highContrast);
    }

    initToolbar() {
        document.getElementById('btn-home').addEventListener('click', () => {
            this.loadPage(0);
        });

        document.getElementById('btn-theme').addEventListener('click', (e) => {
            const isDark = e.currentTarget.getAttribute('aria-pressed') === 'true';
            this.applyTheme(isDark ? 'light' : 'dark', localStorage.getItem('highContrast') === 'true');
        });

        document.getElementById('btn-contrast').addEventListener('click', (e) => {
            const isHc = e.currentTarget.getAttribute('aria-pressed') === 'true';
            this.applyTheme(localStorage.getItem('theme') || 'light', !isHc);
        });

        document.getElementById('volume-slider').addEventListener('input', (e) => {
            const val = e.target.value;
            this.audio.setVolume(val);
            this.savePreference('volume', val);
        });

        document.getElementById('btn-mute').addEventListener('click', (e) => {
            const isMuted = e.currentTarget.getAttribute('aria-pressed') === 'true';
            this.audio.setAnimalSoundsMuted(!isMuted);
            e.currentTarget.setAttribute('aria-pressed', (!isMuted).toString());
            this.savePreference('muteSounds', !isMuted);
        });

        document.getElementById('btn-tts').addEventListener('click', (e) => {
            const isTts = e.currentTarget.getAttribute('aria-pressed') === 'true';
            this.speech.setEnabled(!isTts);
            e.currentTarget.setAttribute('aria-pressed', (!isTts).toString());
            this.savePreference('tts', !isTts);
        });

        document.getElementById('btn-fullscreen').addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => {
                    console.log(`Error attempting to enable full-screen mode: ${err.message}`);
                });
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
        });

        document.getElementById('btn-prev').addEventListener('click', () => {
            if (this.currentPage > 0) this.loadPage(this.currentPage - 1);
        });

        document.getElementById('btn-next').addEventListener('click', () => {
            if (this.currentPage < this.totalPages - 1) this.loadPage(this.currentPage + 1);
        });
    }

    loadPage(pageIndex) {
        this.currentPage = pageIndex;
        this.matchedCount = 0;
        this.selection = { image: null, word: null };
        
        const start = pageIndex * this.pairsPerPage;
        const end = start + this.pairsPerPage;
        const pairs = animals.slice(start, end);
        
        this.ui.renderPairs(pairs);
        this.updatePagination();
    }

    updatePagination() {
        document.getElementById('btn-prev').disabled = this.currentPage === 0;
        document.getElementById('btn-next').disabled = this.currentPage === this.totalPages - 1;
    }

    handleCardInteraction(id, type, cardElement) {
        // Init audio context on first interaction
        this.audio.init();

        const animal = animals.find(a => a.id === id);

        if (type === 'word') {
            this.speech.speak(animal.name);
        } else if (type === 'image') {
            this.audio.playAnimalSound(animal.sound);
        }

        // Handle Selection Logic
        if (this.selection[type]) {
            // Deselect previous of same type
            this.ui.deselectCard(this.selection[type].cardElement);
        }
        
        this.selection[type] = { id, cardElement };
        this.ui.selectCard(cardElement);

        // Check Match
        if (this.selection.image && this.selection.word) {
            if (this.selection.image.id === this.selection.word.id) {
                // Correct Match
                this.audio.playChime();
                this.ui.markMatched(this.selection.image.cardElement, this.selection.word.cardElement);
                this.matchedCount++;
                this.selection = { image: null, word: null };
                
                // If all matched, maybe pre-load next?
                // Left intentionally empty to avoid rushing the learner
            } else {
                // Incorrect Match - clear gently after a tiny delay
                const imgCard = this.selection.image.cardElement;
                const wordCard = this.selection.word.cardElement;
                this.selection = { image: null, word: null };
                
                setTimeout(() => {
                    this.ui.deselectCard(imgCard);
                    this.ui.deselectCard(wordCard);
                }, 800);
            }
        }
    }
}

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
