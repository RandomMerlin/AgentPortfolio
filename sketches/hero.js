/* Hero: drifting node-edge network that reacts to mouse proximity */
(function () {
  const MAROON      = [107, 26, 42];
  const GOLD        = [200, 151, 42];
  const OFF_WHITE   = [250, 247, 244];
  const EDGE_DIST   = 140;
  const NODE_COUNT_DESKTOP = 60;
  const NODE_COUNT_MOBILE  = 28;

  const sketch = (p) => {
    let nodes = [];
    let count;

    class Node {
      constructor() { this.reset(); }
      reset() {
        this.x  = p.random(p.width);
        this.y  = p.random(p.height);
        this.vx = p.random(-0.35, 0.35);
        this.vy = p.random(-0.35, 0.35);
        this.r  = p.random(3, 7);
        this.baseR = this.r;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > p.width)  this.vx *= -1;
        if (this.y < 0 || this.y > p.height) this.vy *= -1;
        this.x = p.constrain(this.x, 0, p.width);
        this.y = p.constrain(this.y, 0, p.height);

        const dx = p.mouseX - this.x;
        const dy = p.mouseY - this.y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        const proximity = p.constrain(1 - d / 180, 0, 1);
        this.r = this.baseR + proximity * 8;
        this.proximity = proximity;
      }
      draw() {
        const col = p.lerpColor(
          p.color(...MAROON, 200),
          p.color(...GOLD,   230),
          this.proximity
        );
        p.noStroke();
        // glow
        p.fill(p.red(col), p.green(col), p.blue(col), 40);
        p.ellipse(this.x, this.y, this.r * 3.5);
        // core
        p.fill(col);
        p.ellipse(this.x, this.y, this.r);
      }
    }

    p.setup = () => {
      const c = p.createCanvas(
        document.getElementById('hero-canvas-container').offsetWidth,
        document.getElementById('hero-canvas-container').offsetHeight
      );
      c.parent('hero-canvas-container');
      p.frameRate(30);
      count = window.innerWidth < 640 ? NODE_COUNT_MOBILE : NODE_COUNT_DESKTOP;
      for (let i = 0; i < count; i++) nodes.push(new Node());
      window._heroP5 = p;
    };

    p.draw = () => {
      p.clear();
      p.background(61, 13, 24, 255);

      // edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d  = Math.sqrt(dx*dx + dy*dy);
          if (d < EDGE_DIST) {
            const alpha = p.map(d, 0, EDGE_DIST, 110, 0);
            const glow  = Math.max(nodes[i].proximity, nodes[j].proximity);
            const r = p.lerp(MAROON[0], GOLD[0], glow);
            const g = p.lerp(MAROON[1], GOLD[1], glow);
            const b = p.lerp(MAROON[2], GOLD[2], glow);
            p.stroke(r, g, b, alpha);
            p.strokeWeight(p.lerp(0.5, 1.8, glow));
            p.line(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
          }
        }
      }

      nodes.forEach(n => { n.update(); n.draw(); });
    };

    p.windowResized = () => {
      const container = document.getElementById('hero-canvas-container');
      p.resizeCanvas(container.offsetWidth, container.offsetHeight);
    };
  };

  new p5(sketch);
})();
