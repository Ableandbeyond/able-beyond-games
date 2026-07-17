/**
 * particles.js
 * Utility class for shared particle logic (used in Bubble Tubes and Cosmic Disco).
 */

class Particle {
  constructor(x, y, vx, vy, radius, color) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = radius;
    this.color = color;
    this.life = 1; // 1 to 0
    this.decay = 0; // if 0, immortal
  }

  update(speedMultiplier = 1, dt = 16) {
    // Normalise dt to 60fps equivalent (16.6ms) to keep speed consistent regardless of framerate
    const timeScale = dt / 16.66;
    
    this.x += this.vx * speedMultiplier * timeScale;
    this.y += this.vy * speedMultiplier * timeScale;

    if (this.decay > 0) {
      this.life -= this.decay * speedMultiplier * timeScale;
    }
  }

  draw(ctx) {
    if (this.life <= 0) return;
    
    ctx.save();
    ctx.globalAlpha = this.life;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }
}

// Utility functions
const MathUtils = {
  randomRange: (min, max) => Math.random() * (max - min) + min,
  colorWithAlpha: (hex, alpha) => {
    // Basic hex to rgba converter, assumes 6 char hex
    const r = parseInt(hex.slice(1, 3), 16) || 255;
    const g = parseInt(hex.slice(3, 5), 16) || 255;
    const b = parseInt(hex.slice(5, 7), 16) || 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
};
