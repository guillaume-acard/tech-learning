window.TL = window.TL || {};

(function (TL) {
  const el = TL.el;
  const svg = TL.svg;

  // ---- wave maths (also used by node tests) ----
  // cycles = waves across the box, amp = height, phase = start angle in degrees.
  // A bit of 1 means: tall (am), fast (fm) or flipped over, shifted by 180 degrees (pm).
  const W = 640;
  const H = 240;
  const MID = 112;
  const MODES = { none: 'Plain wave', am: 'Change the height (AM)', fm: 'Change the frequency (FM)', pm: 'Change the degree (PM)' };

  function points({ cycles, amp, phase, mode, bits }, n = 640) {
    const p0 = (phase * Math.PI) / 180;
    const out = [];
    let acc = p0;
    for (let k = 0; k <= n; k++) {
      const t = k / n;
      const bit = bits.length ? bits[Math.min(bits.length - 1, Math.floor(t * bits.length))] : 0;
      let a = amp;
      let ph = p0 + 2 * Math.PI * cycles * t;
      if (mode === 'am' && !bit) a = amp * 0.3;
      else if (mode === 'pm' && bit) ph += Math.PI;
      else if (mode === 'fm') {
        if (k) acc += (2 * Math.PI * (bit ? cycles * 2 : cycles)) / n;
        ph = acc;
      }
      out.push([(W * t), MID - a * Math.sin(ph)]);
    }
    return out;
  }

  TL.wave = { points, MODES };

  // ---- the lab ----
  const slider = (label, { min, max, step, value, show }, onchange) => {
    const out = el('strong', { class: 'digits-val' });
    const input = el('input', { class: 'digits-input', type: 'range', min: String(min), max: String(max), step: String(step), value: String(value), 'aria-label': label });
    const sync = () => {
      out.textContent = show(+input.value);
    };
    input.addEventListener('input', () => {
      sync();
      onchange();
    });
    sync();
    return { node: el('label', { class: 'lab-field wide' }, el('span', { class: 'lab-label', text: label }), input, out), get: () => +input.value };
  };

  const EXPLAIN = {
    none: 'A plain wave carries no message, it just exists. Move the sliders to see what each one changes.',
    am: 'Tall waves mean 1, short waves mean 0. The receiver only has to measure the height. This is amplitude modulation (AM), used by old AM radio.',
    fm: 'Fast wiggles mean 1, slow wiggles mean 0. The receiver only has to count the wiggles. This is frequency modulation (FM), used by FM radio.',
    pm: 'A 1 flips the wave over: it jumps by 180 degrees, as if it started half a wave later. The receiver watches for the jumps. Phase shifts like this are used by wi-fi and mobile phones.',
  };

  class WaveLab {
    constructor(root, lesson, { onFinish }) {
      this.cfg = lesson.sandbox;
      this.mode = 'none';
      this.bits = [1, 0, 1, 1, 0, 0];

      this.goalBox = el('div', { class: 'goal' }, el('strong', { text: 'Goal: ' }), this.cfg.goalText || '');
      this.status = el('p', { 'aria-live': 'polite', class: 'caption-text', text: this.cfg.intro || '' });
      this.readout = el('p', { class: 'calc-out', 'aria-live': 'polite' });

      const redraw = () => this.draw();
      this.freq = slider('Frequency (waves across the box)', { min: 2, max: 12, step: 1, value: 6, show: (x) => `${x} waves` }, redraw);
      this.height = slider('Height', { min: 10, max: 50, step: 5, value: 40, show: (x) => String(x) }, redraw);
      this.degree = slider('Degree (where the wave starts)', { min: 0, max: 360, step: 15, value: 0, show: (x) => `${x} degrees` }, redraw);

      this.modeBtns = Object.keys(MODES).map((m) => el('button', { class: 'btn', text: MODES[m], onclick: () => this.setMode(m) }));
      this.bitBtns = this.bits.map((_, i) => el('button', { class: 'btn', onclick: () => this.flip(i) }));
      this.bitRow = el('div', { class: 'lab-row' }, el('span', { class: 'lab-label', text: 'Message (click a bit to flip it)' }), this.bitBtns);

      this.map = svg('svg', { viewBox: `0 0 ${W} ${H}`, class: 'bt-map', role: 'img', 'aria-label': 'A wave you can change with the sliders' });

      root.append(
        el('div', { class: 'caption' }, this.goalBox, this.status),
        el(
          'div',
          { class: 'lab-panel' },
          el('div', { class: 'lab-row' }, this.freq.node, this.height.node, this.degree.node),
          el('div', { class: 'lab-row' }, el('span', { class: 'lab-label', text: 'What carries the message' }), this.modeBtns),
          this.bitRow,
          this.readout
        ),
        el('div', { class: 'stage plain bt-stage' }, this.map),
        el('div', { class: 'controls' }, el('span', { class: 'spacer' }), el('button', { class: 'btn primary', text: 'Take the quiz', onclick: onFinish }))
      );
      this.draw();
    }

    setMode(m) {
      this.mode = m;
      this.draw();
    }

    flip(i) {
      this.bits[i] = this.bits[i] ? 0 : 1;
      this.draw();
    }

    draw() {
      const cycles = this.freq.get();
      const amp = this.height.get();
      const phase = this.degree.get();
      const coded = this.mode !== 'none';
      const kids = [];

      this.modeBtns.forEach((b, i) => b.classList.toggle('on', Object.keys(MODES)[i] === this.mode));
      this.bitBtns.forEach((b, i) => {
        b.textContent = String(this.bits[i]);
        b.classList.toggle('on', !!this.bits[i]);
      });
      this.bitRow.style.display = coded ? '' : 'none';

      kids.push(svg('line', { class: 'pv-axis', x1: 0, y1: MID, x2: W, y2: MID }));
      if (!coded && phase) {
        const ref = points({ cycles, amp, phase: 0, mode: 'none', bits: [] });
        kids.push(svg('polyline', { class: 'wv-ref', points: ref.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ') }));
        kids.push(svg('text', { class: 'pv-axistext', x: 4, y: 14, text: 'dashed: the same wave starting at 0 degrees' }));
      }
      if (coded) {
        const seg = W / this.bits.length;
        this.bits.forEach((b, k) => {
          kids.push(svg('text', { class: 'pv-bit', x: seg * k + seg / 2, y: H - 12, 'text-anchor': 'middle', text: String(b) }));
          if (k) kids.push(svg('line', { class: 'pv-sep', x1: seg * k, y1: 10, x2: seg * k, y2: H - 30 }));
        });
      }
      const pts = points({ cycles, amp, phase, mode: this.mode, bits: this.bits });
      kids.push(svg('polyline', { class: 'pv-wave tone-cyan', points: pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ') }));
      this.map.replaceChildren(...kids);

      this.readout.textContent = `${EXPLAIN[this.mode]} Now: ${cycles} waves, height ${amp}, start ${phase} degrees.`;
    }

    destroy() {}
  }

  TL.WaveLab = WaveLab;
  TL.labs = TL.labs || {};
  TL.labs.wave = WaveLab;
})(window.TL);
