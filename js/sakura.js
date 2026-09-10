/**
 * Japanese Sakura Petal Particle Physics Simulation
 * Lightweight, 60fps canvas simulation with gentle flutter, 3D perspective rotation,
 * and mouse-responsive wind breeze.
 */

class SakuraSimulation {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.petals = [];
    this.maxPetals = 38; // optimized for silky smooth performance
    this.isRunning = true;
    this.wind = { current: 0.8, target: 0.8 };
    this.mouse = { x: -1000, y: -1000, vx: 0, prevX: 0 };
    
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    // Mouse breeze interaction
    window.addEventListener('mousemove', (e) => {
      const deltaX = e.clientX - this.mouse.prevX;
      this.mouse.vx = deltaX * 0.05;
      this.mouse.prevX = e.clientX;
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.wind.target = Math.max(-2, Math.min(2.5, 0.8 + this.mouse.vx));
    });

    // Populate initial petals
    for (let i = 0; i < this.maxPetals; i++) {
      this.petals.push(this.createPetal(true));
    }

    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createPetal(randomY = false) {
    const width = this.canvas.width;
    const height = this.canvas.height;
    
    return {
      x: Math.random() * (width + 200) - 100,
      y: randomY ? Math.random() * height : -20 - Math.random() * 50,
      size: 9 + Math.random() * 11, // petal size
      speedY: 1.2 + Math.random() * 1.6,
      speedX: -0.5 + Math.random() * 1,
      angle: Math.random() * Math.PI * 2,
      angularSpeed: (Math.random() - 0.5) * 0.02,
      flip: Math.random() * Math.PI * 2,
      flipSpeed: 0.015 + Math.random() * 0.02,
      opacity: 0.45 + Math.random() * 0.45,
      // Subtle color variation: cherry blossom pink to soft white blush
      color: Math.random() > 0.35 ? 'rgba(255, 183, 197, ' : 'rgba(254, 215, 226, ',
      swing: Math.random() * 2,
      swingSpeed: 0.02 + Math.random() * 0.02
    };
  }

  drawPetal(petal) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(petal.x, petal.y);
    ctx.rotate(petal.angle);
    ctx.scale(1, Math.cos(petal.flip)); // 3D flip effect

    ctx.beginPath();
    // Elegant Sakura Petal Curvature
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(
      petal.size / 2, -petal.size / 2, 
      petal.size, -petal.size / 4, 
      petal.size, petal.size / 2
    );
    ctx.bezierCurveTo(
      petal.size, petal.size, 
      petal.size / 4, petal.size, 
      0, petal.size * 1.2
    );
    ctx.bezierCurveTo(
      -petal.size / 4, petal.size, 
      -petal.size, petal.size, 
      -petal.size, petal.size / 2
    );
    ctx.bezierCurveTo(
      -petal.size, -petal.size / 4, 
      -petal.size / 2, -petal.size / 2, 
      0, 0
    );
    
    // Petal notch indent (typical of sakura blossoms)
    ctx.lineTo(0, petal.size * 0.2);

    ctx.fillStyle = petal.color + petal.opacity + ')';
    ctx.shadowColor = 'rgba(255, 150, 180, 0.3)';
    ctx.shadowBlur = 6;
    ctx.fill();
    ctx.closePath();

    ctx.restore();
  }

  update() {
    // Smooth wind easing
    this.wind.current += (this.wind.target - this.wind.current) * 0.05;
    // Gradually return target to natural breeze
    this.wind.target += (0.8 - this.wind.target) * 0.01;

    for (let i = 0; i < this.petals.length; i++) {
      const p = this.petals[i];
      p.y += p.speedY;
      p.x += p.speedX + this.wind.current + Math.sin(p.swing) * 0.8;
      p.angle += p.angularSpeed;
      p.flip += p.flipSpeed;
      p.swing += p.swingSpeed;

      // Reset when off screen
      if (p.y > this.canvas.height + 30 || p.x > this.canvas.width + 100 || p.x < -100) {
        this.petals[i] = this.createPetal(false);
      }
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let i = 0; i < this.petals.length; i++) {
      this.drawPetal(this.petals[i]);
    }
  }

  animate() {
    if (!this.isRunning) return;
    this.update();
    this.render();
    requestAnimationFrame(() => this.animate());
  }

  toggle() {
    this.isRunning = !this.isRunning;
    if (this.isRunning) {
      this.animate();
    } else {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    return this.isRunning;
  }
}

// Global instance setup
document.addEventListener('DOMContentLoaded', () => {
  window.sakuraSim = new SakuraSimulation('sakura-canvas');
});
