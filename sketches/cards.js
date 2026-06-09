/* Project card thumbnails: deterministic Perlin-noise field-line sketches */
(function () {
  const PALETTES = [
    [[107, 26, 42], [200, 151, 42], [250, 247, 244]],
    [[61, 13, 24],  [200, 151, 42], [139, 38, 54]],
    [[107, 26, 42], [229, 184, 74], [237, 232, 227]],
    [[61, 13, 24],  [250, 247, 244],[200, 151, 42]],
    [[139, 38, 54], [200, 151, 42], [250, 247, 244]],
    [[107, 26, 42], [200, 151, 42], [61, 13, 24]],
  ];

  function makeCardSketch(container, index) {
    const palette = PALETTES[index % PALETTES.length];

    const sketch = (p) => {
      let particles = [];
      const NUM = 80;
      const SEED = index * 137.5 + 42;

      class Particle {
        constructor() { this.reset(); }
        reset() {
          this.x = p.random(p.width);
          this.y = p.random(p.height);
          this.age = p.random(60);
          this.maxAge = p.random(80, 180);
          this.col = palette[p.floor(p.random(palette.length))];
        }
        update() {
          const angle = p.noise(this.x * 0.006, this.y * 0.006, p.frameCount * 0.004) * p.TWO_PI * 2.5;
          this.x += p.cos(angle) * 1.2;
          this.y += p.sin(angle) * 1.2;
          this.age++;
          if (this.age > this.maxAge || this.x < 0 || this.x > p.width || this.y < 0 || this.y > p.height) {
            this.reset();
          }
        }
        draw() {
          const alpha = p.map(this.age, 0, this.maxAge, 0, 180) * p.map(this.age, this.maxAge * 0.7, this.maxAge, 1, 0);
          p.fill(this.col[0], this.col[1], this.col[2], p.constrain(alpha, 0, 180));
          p.noStroke();
          p.ellipse(this.x, this.y, 2.5);
        }
      }

      p.setup = () => {
        const c = p.createCanvas(container.offsetWidth, container.offsetHeight);
        c.parent(container);
        p.noiseSeed(SEED);
        p.randomSeed(SEED);
        p.frameRate(20);
        p.background(palette[0][0], palette[0][1], palette[0][2]);
        for (let i = 0; i < NUM; i++) particles.push(new Particle());
      };

      p.draw = () => {
        p.fill(palette[0][0], palette[0][1], palette[0][2], 12);
        p.noStroke();
        p.rect(0, 0, p.width, p.height);
        particles.forEach(pt => { pt.update(); pt.draw(); });
      };
    };

    new p5(sketch);
  }

  function initCardSketches() {
    document.querySelectorAll('.project-thumb').forEach(thumb => {
      const idx = parseInt(thumb.dataset.index, 10);
      makeCardSketch(thumb, idx);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCardSketches);
  } else {
    initCardSketches();
  }
})();
