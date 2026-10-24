window.TL = window.TL || {};

(function (TL) {
  const el = TL.el;
  const svg = TL.svg;

  // ---- pure genetic algorithm for the travelling salesperson problem (also used by node tests) ----
  const KM = 4;
  const MAP = { w: 100, h: 70 };

  const seeded = (seed) => {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  const makeCities = (n, random) => {
    const pts = [];
    let gap = 13;
    let tries = 0;
    while (pts.length < n) {
      const p = [6 + random() * (MAP.w - 12), 6 + random() * (MAP.h - 12)];
      if (pts.every((q) => Math.hypot(p[0] - q[0], p[1] - q[1]) >= gap)) pts.push(p);
      else if (++tries > 300) {
        gap -= 1;
        tries = 0;
      }
    }
    return pts;
  };

  const distances = (cities) => cities.map((a) => cities.map((b) => Math.hypot(a[0] - b[0], a[1] - b[1])));

  const tourLength = (order, D) => {
    let sum = 0;
    for (let i = 0; i < order.length; i++) sum += D[order[i]][order[(i + 1) % order.length]];
    return sum;
  };

  // Exact answer with the Held-Karp method; fine up to about 14 cities.
  const optimal = (D) => {
    const n = D.length;
    if (n > 14 || n < 3) return null;
    const m = n - 1;
    const full = (1 << m) - 1;
    const dp = new Float64Array((1 << m) * m).fill(Infinity);
    const prev = new Int8Array((1 << m) * m).fill(-1);
    for (let j = 0; j < m; j++) dp[(1 << j) * m + j] = D[0][j + 1];
    for (let mask = 1; mask <= full; mask++) {
      for (let j = 0; j < m; j++) {
        if (!(mask & (1 << j))) continue;
        const cur = dp[mask * m + j];
        if (cur === Infinity) continue;
        for (let k = 0; k < m; k++) {
          if (mask & (1 << k)) continue;
          const nm = mask | (1 << k);
          const v = cur + D[j + 1][k + 1];
          if (v < dp[nm * m + k]) {
            dp[nm * m + k] = v;
            prev[nm * m + k] = j;
          }
        }
      }
    }
    let best = Infinity;
    let last = 0;
    for (let j = 0; j < m; j++) {
      const v = dp[full * m + j] + D[j + 1][0];
      if (v < best) {
        best = v;
        last = j;
      }
    }
    const order = [];
    let mask = full;
    let j = last;
    while (j !== -1) {
      order.push(j + 1);
      const p = prev[mask * m + j];
      mask &= ~(1 << j);
      j = p;
    }
    order.push(0);
    return { length: best, order: order.reverse() };
  };

  // Keep a slice of parent A in place, fill the other places with the missing cities in the order parent B has them.
  const crossover = (a, b, i, j) => {
    const n = a.length;
    const child = new Array(n).fill(-1);
    const used = new Set();
    for (let k = i; k <= j; k++) {
      child[k] = a[k];
      used.add(a[k]);
    }
    let at = 0;
    b.forEach((c) => {
      if (used.has(c)) return;
      while (child[at] !== -1) at++;
      child[at] = c;
    });
    return child;
  };

  class Evolution {
    constructor(D, { size = 60, mutation = 0.1, random = Math.random } = {}) {
      this.D = D;
      this.size = size;
      this.mutation = mutation;
      this.random = random;
      this.gen = 1;
      const n = D.length;
      this.pop = [];
      for (let i = 0; i < size; i++) {
        const order = [...Array(n).keys()];
        for (let k = n - 1; k > 0; k--) {
          const r = Math.floor(random() * (k + 1));
          [order[k], order[r]] = [order[r], order[k]];
        }
        this.pop.push({ order, len: tourLength(order, D) });
      }
      this.sort();
      this.history = [this.best.len];
    }

    get best() {
      return this.pop[0];
    }

    sort() {
      this.pop.sort((x, y) => x.len - y.len);
    }

    pick() {
      let win = null;
      for (let i = 0; i < 3; i++) {
        const c = this.pop[Math.floor(this.random() * this.pop.length)];
        if (!win || c.len < win.len) win = c;
      }
      return win;
    }

    step() {
      const n = this.D.length;
      const next = this.pop.slice(0, Math.min(2, this.size));
      while (next.length < this.size) {
        let i = Math.floor(this.random() * n);
        let j = Math.floor(this.random() * n);
        if (i > j) [i, j] = [j, i];
        const order = crossover(this.pick().order, this.pick().order, i, j);
        if (this.random() < this.mutation) {
          const x = Math.floor(this.random() * n);
          const y = Math.floor(this.random() * n);
          [order[x], order[y]] = [order[y], order[x]];
        }
        next.push({ order, len: tourLength(order, this.D) });
      }
      this.pop = next;
      this.sort();
      this.gen++;
      this.history.push(this.best.len);
    }
  }

  TL.genetic = { KM, MAP, seeded, makeCities, distances, tourLength, optimal, crossover, Evolution };

  // ---- the lab ----
  const MAX_GEN = 1500;
  const polyPoints = (cities, order) => order.map((c) => cities[c].map((v) => +v.toFixed(2)).join(',')).join(' ');
  const km = (len) => Math.round(len * KM);

  function slider(label, { min, max, step, value, show }, onchange) {
    const out = el('strong', { class: 'digits-val' });
    const input = el('input', { class: 'digits-input', type: 'range', min: String(min), max: String(max), step: String(step), value: String(value), 'aria-label': label });
    const sync = () => {
      out.textContent = show(+input.value);
    };
    input.addEventListener('input', () => {
      sync();
      onchange(+input.value);
    });
    sync();
    return { node: el('label', { class: 'lab-field wide' }, el('span', { class: 'lab-label', text: label }), input, out), get: () => +input.value };
  }

  class GeneticLab {
    constructor(root, lesson, { onFinish }) {
      this.cfg = lesson.sandbox;
      this.seed = 11;
      this.timer = null;
      this.solved = false;
      this.showBest = false;

      this.goalBox = el('div', { class: 'goal' }, el('strong', { text: 'Goal: ' }), this.cfg.goalText || '');
      this.status = el('p', { 'aria-live': 'polite', class: 'caption-text', text: this.cfg.intro || '' });
      this.readout = el('p', { class: 'calc-out', 'aria-live': 'polite' });
      this.map = svg('svg', { viewBox: `0 0 ${MAP.w} ${MAP.h}`, class: 'gl-map', role: 'img', 'aria-label': 'Map of cities with the best route found so far' });
      this.chart = svg('svg', { viewBox: '0 0 300 80', class: 'gl-chart', role: 'img', 'aria-label': 'Length of the best route in each generation' });

      this.cities = slider('Number of cities', { min: 6, max: 14, step: 1, value: 12, show: (x) => String(x) }, () => this.newCities(false));
      this.popSize = slider('Crowd size', { min: 10, max: 200, step: 10, value: 80, show: (x) => `${x} routes` }, () => this.restart());
      this.mutation = slider('Mutation chance', { min: 0, max: 50, step: 1, value: 10, show: (x) => `${x}%` }, (v) => {
        if (this.evo) this.evo.mutation = v / 100;
      });

      this.runBtn = el('button', { class: 'btn primary', text: 'Run', onclick: () => (this.timer ? this.pause() : this.run()) });
      this.stepBtn = el('button', { class: 'btn', text: 'One generation', onclick: () => this.tick() });
      this.restartBtn = el('button', { class: 'btn', text: 'Start again', onclick: () => this.restart() });
      this.newBtn = el('button', { class: 'btn', text: 'New cities', onclick: () => this.newCities(true) });
      this.optBox = el('input', { type: 'checkbox', onchange: (e) => {
        this.showBest = e.target.checked;
        this.draw();
      } });

      root.append(
        el('div', { class: 'caption' }, this.goalBox, this.status),
        el(
          'div',
          { class: 'lab-panel' },
          el('div', { class: 'lab-row' }, this.cities.node, this.popSize.node, this.mutation.node),
          el('div', { class: 'lab-row' }, this.runBtn, this.stepBtn, this.restartBtn, this.newBtn, el('label', { class: 'lab-field gl-check' }, this.optBox, ' Show the shortest possible route')),
          this.readout
        ),
        el('div', { class: 'stage plain gl-stage' }, this.map, this.chart),
        el('div', { class: 'controls' }, el('span', { class: 'spacer' }), el('button', { class: 'btn primary', text: 'Take the quiz', onclick: onFinish }))
      );
      this.newCities(false);
    }

    newCities(fresh) {
      if (fresh) this.seed += 1;
      this.pts = TL.genetic.makeCities(this.cities.get(), seeded(this.seed * 7919 + this.cities.get()));
      this.D = distances(this.pts);
      this.opt = optimal(this.D);
      this.restart();
    }

    restart() {
      this.pause();
      this.solved = false;
      this.goalBox.classList.remove('done');
      this.status.textContent = this.cfg.intro || '';
      this.evo = new Evolution(this.D, { size: this.popSize.get(), mutation: this.mutation.get() / 100 });
      this.draw();
    }

    run() {
      if (this.solved) return;
      this.runBtn.textContent = 'Pause';
      this.timer = setInterval(() => this.tick(), 70);
    }

    pause() {
      if (this.timer) clearInterval(this.timer);
      this.timer = null;
      this.runBtn.textContent = 'Run';
    }

    tick() {
      if (this.solved) return;
      this.evo.step();
      this.draw();
      const best = this.evo.best.len;
      if (this.opt && best <= this.opt.length + 1e-6) {
        this.solved = true;
        this.pause();
        this.goalBox.classList.add('done');
        this.status.textContent = `Found the shortest possible route after ${this.evo.gen} generations.`;
      } else if (this.evo.gen >= MAX_GEN) {
        this.pause();
        this.status.textContent = `Stopped after ${MAX_GEN} generations without reaching the shortest route. Try a bigger crowd or a different mutation chance.`;
      }
    }

    draw() {
      const evo = this.evo;
      const closed = (order) => polyPoints(this.pts, order.concat(order[0]));
      TL.clear(this.map);
      const step = Math.max(1, Math.floor(evo.pop.length / 14));
      evo.pop.forEach((p, i) => {
        if (i > 0 && i % step === 0) this.map.append(svg('polyline', { class: 'gl-ghost', points: closed(p.order) }));
      });
      if (this.showBest && this.opt) this.map.append(svg('polyline', { class: 'gl-opt', points: closed(this.opt.order) }));
      this.map.append(svg('polyline', { class: 'gl-best' + (this.solved ? ' done' : ''), points: closed(evo.best.order) }));
      this.pts.forEach((p, i) => this.map.append(svg('circle', { class: 'gl-city' + (i === 0 ? ' home' : ''), cx: p[0], cy: p[1], r: i === 0 ? 2.6 : 1.8 })));

      const h = evo.history;
      const top = Math.max(...h);
      const low = this.opt ? Math.min(this.opt.length, ...h) : Math.min(...h);
      const span = Math.max(top - low, 1e-6);
      const xMax = Math.max(40, h.length - 1);
      const pts = h.map((v, i) => `${(6 + (i / xMax) * 288).toFixed(1)},${(8 + (1 - (v - low) / span) * 54).toFixed(1)}`).join(' ');
      TL.clear(this.chart);
      this.chart.append(svg('line', { class: 'gl-axis', x1: 6, y1: 68, x2: 294, y2: 68 }));
      if (this.opt) this.chart.append(svg('line', { class: 'gl-optline', x1: 6, y1: 62, x2: 294, y2: 62 }));
      this.chart.append(svg('polyline', { class: 'gl-line', points: pts }));
      this.chart.append(svg('text', { class: 'gl-label', x: 6, y: 78, text: 'Generations (the line goes down as routes get shorter)' }));

      const gap = this.opt ? Math.round(((evo.best.len - this.opt.length) / this.opt.length) * 100) : null;
      this.readout.textContent =
        `Generation ${evo.gen}. Best route so far: ${km(evo.best.len)} km.` +
        (this.opt ? ` Shortest possible: ${km(this.opt.length)} km${gap > 0 ? ` (the best so far is ${gap}% longer)` : ' (reached)'}.` : '');
    }

    destroy() {
      this.pause();
    }
  }

  TL.GeneticLab = GeneticLab;
  TL.labs = TL.labs || {};
  TL.labs.genetic = GeneticLab;
})(window.TL);
