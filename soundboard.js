/**
 * soundboard.js
 * Mode C: Interactive Soundboard
 */

(function() {
  const container = document.getElementById('mode-soundboard');
  const buttons = document.querySelectorAll('.shape-btn');
  let isActive = false;

  function init() {
    buttons.forEach((btn, index) => {
      // Map each button to a specific pentatonic frequency
      const freq = AudioEngine.getPentaFreq(index);
      
      btn.addEventListener('pointerdown', (e) => {
        if (!isActive || AppState.isFrozen) return;
        
        // Play sound
        AudioEngine.playTone(freq, 1.5, 'sine');
        
        // Add visual playing state
        btn.classList.add('playing');
        
        // Create ripple or extra visual flair? The CSS handles scaling and shadow.
        
        // Ensure screen readers know something happened? 
        // We can just rely on the visual feedback and audio, as aria-pressed might be overkill for a momentary button.
      });

      btn.addEventListener('pointerup', () => {
        btn.classList.remove('playing');
      });
      
      btn.addEventListener('pointerleave', () => {
        btn.classList.remove('playing');
      });

      // Keyboard support
      btn.addEventListener('keydown', (e) => {
        if (!isActive || AppState.isFrozen) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          AudioEngine.playTone(freq, 1.5, 'sine');
          btn.classList.add('playing');
        }
      });
      
      btn.addEventListener('keyup', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          btn.classList.remove('playing');
        }
      });
    });

    window.addEventListener('modeChange', (e) => {
      isActive = (e.detail.mode === 'soundboard');
    });
  }

  // Initialize after DOM load
  window.addEventListener('DOMContentLoaded', init);
})();
