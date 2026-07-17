/**
 * audio.js
 * Procedural Audio Engine using Web Audio API.
 * Generates soft sine waves with gentle envelopes.
 */

const AudioEngine = (function() {
  let ctx = null;
  let masterGain = null;
  let limiter = null;
  let isInitialized = false;

  // Pentatonic scale frequencies (C Major Pentatonic, starting around C4)
  const PENTATONIC_FREQUENCIES = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33];

  function init() {
    if (isInitialized) return;
    
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      ctx = new AudioContext();

      // Master Gain for volume control
      masterGain = ctx.createGain();
      
      // Dynamics Compressor acting as a limiter to prevent harsh clipping
      limiter = ctx.createDynamicsCompressor();
      limiter.threshold.setValueAtTime(-10, ctx.currentTime);
      limiter.knee.setValueAtTime(40, ctx.currentTime);
      limiter.ratio.setValueAtTime(12, ctx.currentTime);
      limiter.attack.setValueAtTime(0, ctx.currentTime);
      limiter.release.setValueAtTime(0.25, ctx.currentTime);

      masterGain.connect(limiter);
      limiter.connect(ctx.destination);

      updateVolume();
      isInitialized = true;
    } catch (e) {
      console.warn('Web Audio API not supported in this browser', e);
    }
  }

  function resumeContext() {
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }
  }

  function updateVolume() {
    if (!masterGain || !ctx) return;
    
    // Mute or set volume based on AppState
    const targetVolume = AppState.isMuted ? 0 : AppState.settings.masterVolume;
    
    // Smooth transition
    masterGain.gain.setTargetAtTime(targetVolume, ctx.currentTime, 0.1);
  }

  // Listen to state changes from app.js
  window.addEventListener('muteChange', updateVolume);
  window.addEventListener('settingsChange', updateVolume);

  // Initialize audio context on first user interaction
  const initEvents = ['mousedown', 'touchstart', 'keydown'];
  const onUserInteraction = () => {
    init();
    resumeContext();
    initEvents.forEach(evt => document.removeEventListener(evt, onUserInteraction));
  };
  initEvents.forEach(evt => document.addEventListener(evt, onUserInteraction, { once: true }));

  /**
   * Play a soft procedural tone.
   * @param {number} freq - Frequency in Hz
   * @param {number} duration - Total duration in seconds
   * @param {string} type - Oscillator type (sine, triangle)
   */
  function playTone(freq, duration = 2.0, type = 'sine') {
    if (!isInitialized || !ctx || AppState.isMuted) return;

    const osc = ctx.createOscillator();
    const envelope = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Envelope shaping (gentle attack, soft release)
    // Reduce volume heavily so it's ambient
    const maxVolume = 0.15; 
    
    envelope.gain.setValueAtTime(0, ctx.currentTime);
    envelope.gain.linearRampToValueAtTime(maxVolume, ctx.currentTime + 0.1); // Attack
    
    // Sustain
    envelope.gain.setValueAtTime(maxVolume, ctx.currentTime + duration * 0.5); 
    
    // Release
    envelope.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(envelope);
    envelope.connect(masterGain);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);

    // Cleanup
    osc.onended = () => {
      osc.disconnect();
      envelope.disconnect();
    };
  }

  return {
    playTone,
    getPentaFreq: (index) => PENTATONIC_FREQUENCIES[index % PENTATONIC_FREQUENCIES.length]
  };
})();
