/* Contact burst: particle explosion on form submit */
(function () {
  const COLORS = [
    [107, 26, 42],
    [200, 151, 42],
    [229, 184, 74],
    [250, 247, 244],
    [139, 38, 54],
  ];

  const sketch = (p) => {
    let particles = [];
    let triggered = false;
    const container = document.getElementById('contact-burst-canvas');

    class Particle {
      constructor(x, y) {
        const angle = p.random(p.TWO_PI);
        const speed = p.random(3, 11);
        this.x = x;
        this.y = y;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - p.random(2, 6);
        this.life = 1.0;
        this.decay = p.random(0.016, 0.032);
        this.r = p.random(3, 9);
        this.col = COLORS[p.floor(p.random(COLORS.length))];
        this.gravity = p.random(0.18, 0.38);
      }
      update() {
        this.vx *= 0.96;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
      }
      draw() {
        if (this.life <= 0) return;
        const a = p.constrain(this.life, 0, 1) * 255;
        p.noStroke();
        p.fill(this.col[0], this.col[1], this.col[2], a);
        p.ellipse(this.x, this.y, this.r * this.life);
      }
      isDead() { return this.life <= 0; }
    }

    p.setup = () => {
      const c = p.createCanvas(280, 220);
      c.parent(container);
      p.frameRate(60);
      p.noLoop();
    };

    p.draw = () => {
      p.clear();
      particles = particles.filter(pt => !pt.isDead());
      particles.forEach(pt => { pt.update(); pt.draw(); });
      if (particles.length === 0 && triggered) {
        p.noLoop();
        triggered = false;
      }
    };

    window.fireBurst = () => {
      const btn = document.getElementById('submit-btn');
      const rect = btn.getBoundingClientRect();
      const cRect = container.getBoundingClientRect();
      const cx = rect.left + rect.width / 2 - cRect.left + container.offsetLeft;
      const cy = rect.top  + rect.height / 2 - cRect.top  + container.offsetTop;
      for (let i = 0; i < 90; i++) particles.push(new Particle(p.width / 2, p.height / 2));
      triggered = true;
      p.loop();
    };
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new p5(sketch));
  } else {
    new p5(sketch);
  }
})();
