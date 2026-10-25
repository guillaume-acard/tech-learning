window.TL = window.TL || {};

(function (TL) {
  const el = TL.el;
  const svg = TL.svg;

  // ---- simplified indoor wi-fi model (also used by node tests) ----
  // 1 map unit = 1/40 metre. Signal power is measured in dBm (less negative = stronger).
  const PX_PER_M = 40;
  const MAP = { w: 640, h: 400 };
  const ROUTER = { x: 90, y: 200 };
  const OVEN = { x: 350, y: 70 };
  const WALLS = [
    { x1: 260, y1: 20, x2: 260, y2: 160 },
    { x1: 260, y1: 240, x2: 260, y2: 380 },
    { x1: 440, y1: 20, x2: 440, y2: 380 },
    { x1: 440, y1: 200, x2: 620, y2: 200 },
  ];
  const BANDS = {
    '2.4': { name: '2.4 GHz', pl1: 40, wall: 5, speedFactor: 1 },
    '5': { name: '5 GHz', pl1: 47, wall: 9, speedFactor: 2 },
  };
  const TX_DBM = 20;
  const EXPONENT = 3;
  const NOISE_DBM = -92;
  const OVEN_DBM_AT_1M = -40;

  const ccw = (a, b, c) => (c.y - a.y) * (b.x - a.x) > (b.y - a.y) * (c.x - a.x);
  const crosses = (p1, p2, w) => {
    const a = p1;
    const b = p2;
    const c = { x: w.x1, y: w.y1 };
    const d = { x: w.x2, y: w.y2 };
    return ccw(a, c, d) !== ccw(b, c, d) && ccw(a, b, c) !== ccw(a, b, d);
  };
  const wallsBetween = (p) => WALLS.filter((w) => crosses(ROUTER, p, w)).length;
  const metres = (a, b) => Math.max(1, Math.hypot(a.x - b.x, a.y - b.y) / PX_PER_M);
  const dbmSum = (a, b) => 10 * Math.log10(Math.pow(10, a / 10) + Math.pow(10, b / 10));

  const bars = (snr) => (snr >= 35 ? 4 : snr >= 25 ? 3 : snr >= 15 ? 2 : snr >= 6 ? 1 : 0);
  const mbps = (snr, factor) => {
    const tiers = [[40, 300], [30, 150], [22, 80], [15, 40], [10, 15], [6, 4]];
    for (const [min, speed] of tiers) if (snr >= min) return speed * factor;
    return 0;
  };

  function link(p, band, ovenOn) {
    const b = BANDS[band];
    const d = metres(ROUTER, p);
    const walls = wallsBetween(p);
    const rx = TX_DBM - (b.pl1 + 10 * EXPONENT * Math.log10(d)) - walls * b.wall;
    let noise = NOISE_DBM;
    if (ovenOn && band === '2.4') noise = dbmSum(NOISE_DBM, OVEN_DBM_AT_1M - 10 * EXPONENT * Math.log10(metres(OVEN, p)));
    const snr = rx - noise;
    return { distance: d, walls, rx, noise, snr, bars: bars(snr), mbps: mbps(snr, b.speedFactor) };
  }

  TL.wifi = { MAP, ROUTER, OVEN, WALLS, BANDS, link, wallsBetween };

  // ---- the lab ----
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  class WifiLab {
    constructor(root, lesson, { onFinish }) {
      this.cfg = lesson.sandbox;
      this.band = '2.4';
      this.oven = false;
      this.pos = { x: 560, y: 120 };

      this.goalBox = el('div', { class: 'goal' }, el('strong', { text: 'Goal: ' }), this.cfg.goalText || '');
      this.status = el('p', { 'aria-live': 'polite', class: 'caption-text', text: this.cfg.intro || '' });
      this.readout = el('p', { class: 'calc-out', 'aria-live': 'polite' });
      this.barsNode = el('span', { class: 'wf-bars', 'aria-hidden': 'true' }, [0, 1, 2, 3].map(() => el('span')));

      this.b24 = el('button', { class: 'btn', text: '2.4 GHz', onclick: () => this.setBand('2.4') });
      this.b5 = el('button', { class: 'btn', text: '5 GHz', onclick: () => this.setBand('5') });
      this.ovenBtn = el('button', { class: 'btn', text: 'Microwave oven: off', onclick: () => this.toggleOven() });

      this.ovenDot = svg('circle', { class: 'wf-oven off', cx: OVEN.x, cy: OVEN.y, r: 11 });
      this.phone = svg('circle', { class: 'wf-phone', r: 11 });
      this.map = svg(
        'svg',
        { viewBox: `0 0 ${MAP.w} ${MAP.h}`, class: 'wf-map', role: 'img', tabindex: '0', 'aria-label': 'Floor plan of a house with a router. Drag the phone, or use the arrow keys, to move it.' },
        [
          svg('rect', { x: 20, y: 20, width: 600, height: 360, fill: 'none', stroke: 'var(--line)', 'stroke-width': 2 }),
          ...WALLS.map((w) => svg('line', Object.assign({ class: 'wf-wall' }, w))),
          svg('text', { class: 'wf-room', x: 40, y: 44, text: 'living room' }),
          svg('text', { class: 'wf-room', x: 280, y: 44, text: 'kitchen' }),
          svg('text', { class: 'wf-room', x: 460, y: 44, text: 'bedroom' }),
          svg('text', { class: 'wf-room', x: 460, y: 224, text: 'office' }),
          ...[0, 1, 2].map((i) => svg('circle', { class: 'wf-ring', cx: ROUTER.x, cy: ROUTER.y, r: 170, style: `animation-delay:${i}s` })),
          svg('circle', { class: 'wf-router', cx: ROUTER.x, cy: ROUTER.y, r: 12 }),
          svg('text', { class: 'wf-tag', x: ROUTER.x, y: ROUTER.y + 28, 'text-anchor': 'middle', text: 'router' }),
          this.ovenDot,
          svg('text', { class: 'wf-tag', x: OVEN.x, y: OVEN.y + 26, 'text-anchor': 'middle', text: 'microwave oven' }),
          this.phone,
        ]
      );

      this.map.addEventListener('pointerdown', (e) => {
        this.dragging = true;
        try {
          this.map.setPointerCapture(e.pointerId);
        } catch (err) {}
        this.moveTo(e);
      });
      this.map.addEventListener('pointermove', (e) => this.dragging && this.moveTo(e));
      const stop = () => (this.dragging = false);
      this.map.addEventListener('pointerup', stop);
      this.map.addEventListener('pointercancel', stop);
      this.map.addEventListener('keydown', (e) => {
        const step = { ArrowLeft: [-20, 0], ArrowRight: [20, 0], ArrowUp: [0, -20], ArrowDown: [0, 20] }[e.key];
        if (!step) return;
        e.preventDefault();
        this.place(this.pos.x + step[0], this.pos.y + step[1]);
      });

      root.append(
        el('div', { class: 'caption' }, this.goalBox, this.status),
        el(
          'div',
          { class: 'lab-panel' },
          el('div', { class: 'lab-row' }, el('span', { class: 'lab-label', text: 'Wi-fi band' }), this.b24, this.b5, this.ovenBtn),
          el('p', { class: 'calc-out' }, el('span', { text: 'Signal' }), this.barsNode),
          this.readout
        ),
        el('div', { class: 'stage plain wf-stage' }, this.map, el('div', { class: 'wf-legend' }, el('span', { text: 'Drag the orange dot (your phone) around the house.' }), el('span', { text: 'Thick lines are walls.' }))),
        el('div', { class: 'controls' }, el('span', { class: 'spacer' }), el('button', { class: 'btn primary', text: 'Take the quiz', onclick: onFinish }))
      );
      this.update();
    }

    moveTo(e) {
      const r = this.map.getBoundingClientRect();
      this.place(((e.clientX - r.left) / r.width) * MAP.w, ((e.clientY - r.top) / r.height) * MAP.h);
    }

    place(x, y) {
      this.pos = { x: clamp(x, 32, MAP.w - 32), y: clamp(y, 32, MAP.h - 32) };
      this.update();
    }

    setBand(b) {
      this.band = b;
      this.update();
    }

    toggleOven() {
      this.oven = !this.oven;
      this.update();
    }

    update() {
      const l = link(this.pos, this.band, this.oven);
      this.phone.setAttribute('cx', this.pos.x);
      this.phone.setAttribute('cy', this.pos.y);
      this.b24.classList.toggle('on', this.band === '2.4');
      this.b5.classList.toggle('on', this.band === '5');
      this.ovenBtn.classList.toggle('on', this.oven);
      this.ovenBtn.textContent = 'Microwave oven: ' + (this.oven ? 'on' : 'off');
      this.ovenDot.setAttribute('class', 'wf-oven' + (this.oven ? '' : ' off'));
      [...this.barsNode.children].forEach((s, i) => s.classList.toggle('on', i < l.bars));
      const speed = l.mbps ? `about ${l.mbps} Mbit/s` : 'no connection';
      this.readout.textContent =
        `${BANDS[this.band].name}. ${l.distance.toFixed(1)} m from the router, ${l.walls} wall${l.walls === 1 ? '' : 's'} in the way. ` +
        `Signal ${Math.round(l.rx)} dBm, noise ${Math.round(l.noise)} dBm: ${speed}.`;
    }

    destroy() {
      this.dragging = false;
    }
  }

  TL.WifiLab = WifiLab;
  TL.labs = TL.labs || {};
  TL.labs.wifi = WifiLab;
})(window.TL);
