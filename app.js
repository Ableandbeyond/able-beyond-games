/**
 * app.js
 * Core application state, UI logic, and Settings management.
 */

const AppState = {
  mode: 'bubble', // 'bubble', 'disco', 'soundboard'
  isMuted: false,
  isFrozen: false,
  isFullscreen: false,
  
  settings: {
    masterVolume: 0.5,
    animationSpeed: 1,
    density: 1,
    highContrast: false,
    reducedMotion: false
  }
};

// Elements
const elModes = {
  bubble: document.getElementById('mode-bubble'),
  disco: document.getElementById('mode-disco'),
  soundboard: document.getElementById('mode-soundboard')
};
const elNavBtns = document.querySelectorAll('.nav-modes .nav-btn');
const btnMute = document.getElementById('btn-mute');
const btnFreeze = document.getElementById('btn-freeze');
const btnFullscreen = document.getElementById('btn-fullscreen');
const btnSettings = document.getElementById('btn-settings');
const btnCloseSettings = document.getElementById('btn-close-settings');
const settingsOverlay = document.getElementById('settings-overlay');
const settingsPanel = document.getElementById('settings-panel');

// Input Elements
const inputVolume = document.getElementById('master-volume');
const inputSpeed = document.getElementById('animation-speed');
const inputDensity = document.getElementById('bubble-density');
const inputHighContrast = document.getElementById('high-contrast');
const inputReducedMotion = document.getElementById('reduced-motion');

// Initialize
function init() {
  loadSettings();
  bindEvents();
  applySettings();
  switchMode(AppState.mode);
}

// Event Bindings
function bindEvents() {
  // Navigation
  elNavBtns.forEach(btn => {
    btn.addEventListener('click', () => switchMode(btn.dataset.mode));
  });

  // Controls
  btnMute.addEventListener('click', toggleMute);
  btnFreeze.addEventListener('click', toggleFreeze);
  btnFullscreen.addEventListener('click', toggleFullscreen);

  // Settings
  btnSettings.addEventListener('click', openSettings);
  btnCloseSettings.addEventListener('click', closeSettings);
  settingsOverlay.addEventListener('click', closeSettings);
  
  // Prevent closing when clicking inside panel
  settingsPanel.addEventListener('click', e => e.stopPropagation());

  // Input changes
  inputVolume.addEventListener('input', e => updateSetting('masterVolume', parseFloat(e.target.value)));
  inputSpeed.addEventListener('input', e => updateSetting('animationSpeed', parseFloat(e.target.value)));
  inputDensity.addEventListener('input', e => updateSetting('density', parseFloat(e.target.value)));
  inputHighContrast.addEventListener('change', e => updateSetting('highContrast', e.target.checked));
  inputReducedMotion.addEventListener('change', e => updateSetting('reducedMotion', e.target.checked));
}

function switchMode(newMode) {
  if (AppState.mode === newMode && !elModes[newMode].classList.contains('hidden')) return;

  // Update State
  AppState.mode = newMode;

  // Update UI Buttons
  elNavBtns.forEach(btn => {
    const isActive = btn.dataset.mode === newMode;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive.toString());
  });

  // Update Containers
  Object.keys(elModes).forEach(key => {
    if (key === newMode) {
      elModes[key].classList.remove('hidden');
      elModes[key].setAttribute('aria-hidden', 'false');
    } else {
      elModes[key].classList.add('hidden');
      elModes[key].setAttribute('aria-hidden', 'true');
    }
  });

  // Dispatch custom event for modes to hook into (start/stop rendering)
  window.dispatchEvent(new CustomEvent('modeChange', { detail: { mode: newMode } }));
}

function toggleMute() {
  AppState.isMuted = !AppState.isMuted;
  btnMute.setAttribute('aria-pressed', AppState.isMuted.toString());
  
  const iconUse = btnMute.querySelector('use');
  if (AppState.isMuted) {
    iconUse.setAttribute('href', '#icon-mute');
  } else {
    iconUse.setAttribute('href', '#icon-unmute');
  }
  
  window.dispatchEvent(new CustomEvent('muteChange', { detail: { isMuted: AppState.isMuted } }));
}

function toggleFreeze() {
  AppState.isFrozen = !AppState.isFrozen;
  btnFreeze.setAttribute('aria-pressed', AppState.isFrozen.toString());
  
  const iconUse = btnFreeze.querySelector('use');
  if (AppState.isFrozen) {
    iconUse.setAttribute('href', '#icon-play');
  } else {
    iconUse.setAttribute('href', '#icon-freeze');
  }

  window.dispatchEvent(new CustomEvent('freezeChange', { detail: { isFrozen: AppState.isFrozen } }));
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      console.warn(`Error attempting to enable fullscreen: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
}

document.addEventListener('fullscreenchange', () => {
  AppState.isFullscreen = !!document.fullscreenElement;
});

// Settings Management
function openSettings() {
  settingsOverlay.classList.remove('hidden');
  settingsPanel.classList.remove('hidden');
  settingsOverlay.setAttribute('aria-hidden', 'false');
  settingsPanel.setAttribute('aria-hidden', 'false');
  btnSettings.setAttribute('aria-expanded', 'true');
  btnCloseSettings.focus();
}

function closeSettings() {
  settingsOverlay.classList.add('hidden');
  settingsPanel.classList.add('hidden');
  settingsOverlay.setAttribute('aria-hidden', 'true');
  settingsPanel.setAttribute('aria-hidden', 'true');
  btnSettings.setAttribute('aria-expanded', 'false');
  btnSettings.focus();
}

function updateSetting(key, value) {
  AppState.settings[key] = value;
  saveSettings();
  applySettings();
  window.dispatchEvent(new CustomEvent('settingsChange', { detail: { settings: AppState.settings } }));
}

function applySettings() {
  // UI Updates
  document.body.classList.toggle('high-contrast', AppState.settings.highContrast);
  document.body.classList.toggle('reduced-motion', AppState.settings.reducedMotion);
  
  // Set values to inputs
  inputVolume.value = AppState.settings.masterVolume;
  inputSpeed.value = AppState.settings.animationSpeed;
  inputDensity.value = AppState.settings.density;
  inputHighContrast.checked = AppState.settings.highContrast;
  inputReducedMotion.checked = AppState.settings.reducedMotion;
}

function loadSettings() {
  try {
    const saved = localStorage.getItem('sensoryRoomSettings');
    if (saved) {
      AppState.settings = { ...AppState.settings, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn("Could not load settings", e);
  }
}

function saveSettings() {
  try {
    localStorage.setItem('sensoryRoomSettings', JSON.stringify(AppState.settings));
  } catch (e) {
    console.warn("Could not save settings", e);
  }
}

// Start app
window.addEventListener('DOMContentLoaded', init);
