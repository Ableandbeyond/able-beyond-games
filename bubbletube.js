/**
 * bubbletube.js
 * Mode A: Bubble Tube Room
 */

(function() {
  const canvases = [
    document.getElementById('tube-canvas-1'),
    document.getElementById('tube-canvas-2'),
    document.getElementById('tube-canvas-3')
  ];

  const tubeColors = [
    ['#00ffff', '#0077ff'], // cyan / blue
    ['#ff00ff', '#7700ff'], // purple / pink
    ['#00ff77', '#0077aa']  // green / turquoise
  ];

  class BubbleTube {
    constructor(canvas, index) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d', { alpha: false }); // optimize
      this.index = index;
      
      this.width = 0;
      this.height = 0;
      this.particles = [];
      this.baseColors = tubeColors[index];
      this.currentColorIndex = 0;
      
      // Setup audio freq based on index
      this.freq = AudioEngine.getPentaFreq(index * 2); // Spread them out
      
      this.resize();
      this.initParticles();
      this.bindEvents();
    }

    resize() {
      const rect = this.canvas.getBoundingClientRect();
      // Increase resolution for high DPI displays if needed, but keeping 1:1 for performance
      this.width = this.canvas.width = rect.width;
      this.height = this.canvas.height = rect.height;
    }

    initParticles() {
      this.particles = [];
      // Adjust density based on settings
      const density = AppState.settings.density;
      const count = Math.floor(20 * density);
      
      for (let i = 0; i < count; i++) {
        this.addParticle(true);
      }
    }

    addParticle(randomY = false) {
      const radius = MathUtils.randomRange(5, 20);
      const x = MathUtils.randomRange(radius, this.width - radius);
      const y = randomY ? MathUtils.randomRange(0, this.height) : this.height + radius;
      // Gentle upward speed
      const vy = MathUtils.randomRange(-30, -10); // per second
      // Gentle wobble
      const vx = MathUtils.randomRange(-5, 5); 
      
      const p = new Particle(x, y, vx, vy, radius, 'rgba(255,255,255,0.6)');
      // Add wobble offset
      p.wobbleOffset = Math.random() * Math.PI * 2;
      p.wobbleSpeed = MathUtils.randomRange(1, 3);
      this.particles.push(p);
    }

    cycleColor() {
      this.currentColorIndex = (this.currentColorIndex + 1) % tubeColors.length;
      this.baseColors = tubeColors[this.currentColorIndex];
      // Play sound
      AudioEngine.playTone(this.freq, 2.0, 'sine');
      
      // Visual feedback: burst of bubbles
      for(let i=0; i<10 * AppState.settings.density; i++) {
        this.addParticle();
      }
    }

    bindEvents() {
      // Mouse/Touch
      this.canvas.addEventListener('pointerdown', () => {
        if (AppState.mode !== 'bubble' || AppState.isFrozen) return;
        this.cycleColor();
      });

      // Keyboard
      this.canvas.addEventListener('keydown', (e) => {
        if (AppState.mode !== 'bubble' || AppState.isFrozen) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.cycleColor();
        }
      });
    }

    update(dt) {
      if (AppState.isFrozen) return;

      const speedMult = AppState.settings.animationSpeed;
      const timeScale = dt / 1000; // time in seconds

      // Maintain density
      const targetCount = Math.floor(20 * AppState.settings.density);
      if (this.particles.length < targetCount && Math.random() < 0.05 * speedMult) {
        this.addParticle();
      }

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        
        // Wobble X
        p.x += Math.sin(performance.now() / 1000 * p.wobbleSpeed + p.wobbleOffset) * 0.5 * speedMult;
        
        p.y += p.vy * timeScale * speedMult;

        if (p.y + p.radius < 0) {
          this.particles.splice(i, 1);
        }
      }
    }

    draw() {
      // Background gradient
      const grad = this.ctx.createLinearGradient(0, 0, 0, this.height);
      grad.addColorStop(0, this.baseColors[0]);
      grad.addColorStop(1, this.baseColors[1]);
      
      this.ctx.fillStyle = grad;
      this.ctx.fillRect(0, 0, this.width, this.height);

      // Draw bubbles
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      for (const p of this.particles) {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Specular highlight
        this.ctx.fillStyle = 'rgba(255,255,255,0.8)';
        this.ctx.beginPath();
        this.ctx.arc(p.x - p.radius*0.3, p.y - p.radius*0.3, p.radius*0.2, 0, Math.PI*2);
        this.ctx.fill();
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      }
      
      // Glass sheen
      this.ctx.fillStyle = 'rgba(255,255,255,0.1)';
      this.ctx.fillRect(0, 0, this.width * 0.2, this.height);
    }
  }

  let tubes = [];
  let isActive = false;
  let lastTime = 0;
  let rafId = null;

  function init() {
    tubes = canvases.map((c, i) => new BubbleTube(c, i));

    window.addEventListener('resize', () => {
      tubes.forEach(t => t.resize());
    });

    window.addEventListener('settingsChange', () => {
      // Re-init particles to respect density immediately if needed, 
      // but let it naturally cull/grow in update loop for smoothness.
    });

    window.addEventListener('modeChange', (e) => {
      isActive = (e.detail.mode === 'bubble');
      if (isActive) {
        lastTime = performance.now();
        if (!rafId) loop(lastTime);
      } else {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      }
    });

    // Start if initially active
    if (AppState.mode === 'bubble') {
      isActive = true;
      lastTime = performance.now();
      rafId = requestAnimationFrame(loop);
    }
  }

  function loop(now) {
    if (!isActive) return;
    
    rafId = requestAnimationFrame(loop);
    
    const dt = now - lastTime;
    lastTime = now;

    tubes.forEach(t => {
      t.update(dt);
      t.draw();
    });
  }

  window.addEventListener('DOMContentLoaded', init);
})();
