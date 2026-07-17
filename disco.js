/**
 * disco.js
 * Mode B: Cosmic Disco Lava Lamp
 */

(function() {
  const canvas = document.getElementById('disco-canvas');
  const ctx = canvas.getContext('2d', { alpha: false }); // alpha false for performance, we paint bg manually
  
  let width, height;
  let blobs = [];
  let stars = [];
  let rippleParticles = [];
  
  let isActive = false;
  let lastTime = 0;
  let rafId = null;

  class Blob {
    constructor() {
      this.radius = MathUtils.randomRange(50, 150);
      this.x = MathUtils.randomRange(this.radius, width - this.radius);
      this.y = MathUtils.randomRange(this.radius, height - this.radius);
      this.vx = MathUtils.randomRange(-20, 20); // pixels per second
      this.vy = MathUtils.randomRange(-20, 20);
      this.color = `hsl(${MathUtils.randomRange(200, 300)}, 80%, 50%)`;
      this.targetVx = this.vx;
      this.targetVy = this.vy;
    }

    update(dt, speedMult) {
      const timeScale = dt / 1000;
      
      // Smoothly interpolate towards target velocity (allows gentle reverse on tap)
      this.vx += (this.targetVx - this.vx) * timeScale * 0.5;
      this.vy += (this.targetVy - this.vy) * timeScale * 0.5;

      this.x += this.vx * speedMult * timeScale;
      this.y += this.vy * speedMult * timeScale;

      // Gentle bounds bouncing
      if (this.x - this.radius < 0) { this.x = this.radius; this.targetVx *= -1; this.vx *= -1; }
      if (this.x + this.radius > width) { this.x = width - this.radius; this.targetVx *= -1; this.vx *= -1; }
      if (this.y - this.radius < 0) { this.y = this.radius; this.targetVy *= -1; this.vy *= -1; }
      if (this.y + this.radius > height) { this.y = height - this.radius; this.targetVy *= -1; this.vy *= -1; }
    }

    draw(ctx) {
      // Draw as radial gradient to simulate softness/glow
      const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
      grad.addColorStop(0, this.color);
      grad.addColorStop(1, 'transparent');
      
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = canvas.width = rect.width;
    height = canvas.height = rect.height;
  }

  function initEntities() {
    blobs = [];
    stars = [];
    const density = AppState.settings.density;
    
    // Blobs
    const blobCount = Math.floor(6 * density);
    for (let i = 0; i < blobCount; i++) {
      blobs.push(new Blob());
    }

    // Stars
    const starCount = Math.floor(100 * density);
    for (let i = 0; i < starCount; i++) {
      stars.push(new Particle(
        MathUtils.randomRange(0, width),
        MathUtils.randomRange(0, height),
        MathUtils.randomRange(-2, 2),
        MathUtils.randomRange(-5, 5),
        MathUtils.randomRange(1, 3),
        'rgba(255, 255, 255, 0.5)'
      ));
    }
  }

  function spawnRipple(x, y) {
    // Play ethereal sound
    AudioEngine.playTone(AudioEngine.getPentaFreq(Math.floor(Math.random() * 5)), 3.0, 'triangle');

    // Create expanding particle ring
    const count = 30 * AppState.settings.density;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i;
      const speed = MathUtils.randomRange(50, 100);
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      
      const p = new Particle(x, y, vx, vy, MathUtils.randomRange(2, 6), '#ffffff');
      p.decay = 0.5; // lose 50% life per second
      rippleParticles.push(p);
    }

    // Reverse nearby blobs softly
    blobs.forEach(b => {
      const dx = b.x - x;
      const dy = b.y - y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 300) {
        b.targetVx *= -1;
        b.targetVy *= -1;
      }
    });
  }

  function bindEvents() {
    canvas.addEventListener('pointerdown', (e) => {
      if (AppState.mode !== 'disco' || AppState.isFrozen) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spawnRipple(x, y);
    });

    canvas.addEventListener('keydown', (e) => {
      if (AppState.mode !== 'disco' || AppState.isFrozen) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        spawnRipple(width / 2, height / 2);
      }
    });

    window.addEventListener('resize', () => {
      if (isActive) resize();
    });
  }

  function init() {
    resize();
    initEntities();
    bindEvents();

    window.addEventListener('settingsChange', () => {
      // Re-init if density changes significantly, else just let it be
      if (Math.abs(blobs.length - Math.floor(6 * AppState.settings.density)) > 2) {
        initEntities();
      }
    });

    window.addEventListener('modeChange', (e) => {
      isActive = (e.detail.mode === 'disco');
      if (isActive) {
        resize();
        lastTime = performance.now();
        if (!rafId) loop(lastTime);
      } else {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      }
    });

    if (AppState.mode === 'disco') {
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

    if (!AppState.isFrozen) {
      update(dt);
    }
    draw();
  }

  function update(dt) {
    const speedMult = AppState.settings.animationSpeed;
    const timeScale = dt / 1000;

    // Background stars
    stars.forEach(s => {
      s.y += s.vy * speedMult * timeScale;
      s.x += s.vx * speedMult * timeScale;
      if (s.y > height) s.y = 0;
      if (s.y < 0) s.y = height;
      if (s.x > width) s.x = 0;
      if (s.x < 0) s.x = width;
    });

    blobs.forEach(b => b.update(dt, speedMult));

    // Update ripples
    for (let i = rippleParticles.length - 1; i >= 0; i--) {
      const rp = rippleParticles[i];
      // Note: Particle update takes dt as ms to normalize, but our particle class 
      // is written to accept ms and scale internally.
      rp.update(speedMult, dt);
      if (rp.life <= 0) {
        rippleParticles.splice(i, 1);
      }
    }
  }

  function draw() {
    // Clear background
    ctx.fillStyle = '#0a0515'; // Dark indigo/space
    ctx.fillRect(0, 0, width, height);

    // To create the 'Lava Lamp' gooey effect without SVG filters (which are slow),
    // we use globalCompositeOperation 'lighter' or 'screen' for soft merging.
    ctx.globalCompositeOperation = 'screen';
    
    blobs.forEach(b => b.draw(ctx));

    // Reset composite operation for stars and ripples
    ctx.globalCompositeOperation = 'source-over';
    
    stars.forEach(s => s.draw(ctx));
    rippleParticles.forEach(rp => rp.draw(ctx));
  }

  window.addEventListener('DOMContentLoaded', init);
})();
