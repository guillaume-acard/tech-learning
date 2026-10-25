window.TL = window.TL || {};

(function (TL) {
  const el = TL.el;
  const svg = TL.svg;

  // ---- simplified Bluetooth channel hopping model (also used by node tests) ----
  // Bluetooth uses 79 channels, 1 MHz apart, from 2402 to 2480 MHz. Wi-fi channels 1, 6 and 11 are about 22 MHz wide.
  const CHANNELS = 79;
  const WIFI = { 1: 2412, 6: 2437, 11: 2462 };
  const WIFI_HALF_WIDTH = 11;
  const FIXED_CHANNEL = 35;
  const MODES = { fixed: 'One fixed channel', hop: 'Hopping', adaptive: 'Adaptive hopping' };

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

  const wifiSpan = (ch) => {
    const centre = WIFI[ch] - 2402;
    return [Math.max(0, Math.ceil(centre - WIFI_HALF_WIDTH)), Math.min(CHANNELS - 1, Math.floor(centre + WIFI_HALF_WIDTH))];
  };
  const busy = (channel, wifiOn) => Object.keys(wifiOn).some((k) => wifiOn[k] && channel >= wifiSpan(k)[0] && channel <= wifiSpan(k)[1]);
  const nextChannel = (mode, rng, wifiOn) => {
    if (mode === 'fixed') return FIXED_CHANNEL;
    if (mode === 'hop') return Math.floor(rng() * CHANNELS);
    const free = [];
    for (let c = 0; c < CHANNELS; c++) if (!busy(c, wifiOn)) free.push(c);
    return free.length ? free[Math.floor(rng() * free.length)] : Math.floor(rng() * CHANNELS);
  };

  TL.bt = { CHANNELS, WIFI, FIXED_CHANNEL, MODES, seeded, wifiSpan, busy, nextChannel };

  // ---- the lab ----
  const ROWS = 12;
  const CW = 640 / CHANNELS;
  const RH = 17;
  const TOP = 6;

  class BluetoothLab {
    constructor(root, lesson, { onFinish }) {
      this.cfg = lesson.sandbox;
      this.mode = 'hop';
      this.wifiOn = { 1: false, 6: false, 11: false };
      this.rng = seeded(7);
      this.history = [];
      this.sent = 0;
      this.ok = 0;
      this.timer = null;

      this.goalBox = el('div', { class: 'goal' }, el('strong', { text: 'Goal: ' }), this.cfg.goalText || '');
      this.status = el('p', { 'aria-live': 'polite', class: 'caption-text', text: this.cfg.intro || '' });
      this.readout = el('p', { class: 'calc-out', 'aria-live': 'polite' });

      this.modeBtns = Object.keys(MODES).map((m) => el('button', { class: 'btn', text: MODES[m], onclick: () => this.setMode(m) }));
      this.wifiBtns = [1, 6, 11].map((ch) => el('button', { class: 'btn', text: `Wi-fi channel ${ch}: off`, onclick: () => this.toggleWifi(ch) }));
      this.runBtn = el('button', { class: 'btn', text: 'Pause', onclick: () => (this.timer ? this.pause() : this.run()) });

      this.map = svg('svg', { viewBox: `0 0 640 ${ROWS * RH + TOP + 30}`, class: 'bt-map', role: 'img', 'aria-label': 'Bluetooth channels over time with wi-fi channels shown as orange bands' });

      root.append(
        el('div', { class: 'caption' }, this.goalBox, this.status),
        el(
          'div',
          { class: 'lab-panel' },
          el('div', { class: 'lab-row' }, el('span', { class: 'lab-label', text: 'Bluetooth mode' }), this.modeBtns),
          el('div', { class: 'lab-row' }, el('span', { class: 'lab-label', text: 'Busy wi-fi' }), this.wifiBtns, this.runBtn),
          this.readout
        ),
        el('div', { class: 'stage plain bt-stage' }, this.map),
        el('div', { class: 'controls' }, el('span', { class: 'spacer' }), el('button', { class: 'btn primary', text: 'Take the quiz', onclick: onFinish }))
      );
      this.update();
      this.draw();
      this.run();
    }

    resetStats() {
      this.sent = 0;
      this.ok = 0;
      this.history = [];
    }

    setMode(m) {
      this.mode = m;
      this.resetStats();
      this.update();
      this.draw();
    }

    toggleWifi(ch) {
      this.wifiOn[ch] = !this.wifiOn[ch];
      this.resetStats();
      this.update();
      this.draw();
    }

    run() {
      if (this.timer) return;
      this.timer = setInterval(() => this.tick(), 160);
      this.runBtn.textContent = 'Pause';
    }

    pause() {
      clearInterval(this.timer);
      this.timer = null;
      this.runBtn.textContent = 'Run';
    }

    tick() {
      const ch = nextChannel(this.mode, this.rng, this.wifiOn);
      const lost = busy(ch, this.wifiOn);
      this.sent++;
      if (!lost) this.ok++;
      this.history.unshift({ ch, lost });
      this.history.length = Math.min(this.history.length, ROWS);
      this.update();
      this.draw();
    }

    update() {
      this.modeBtns.forEach((b, i) => b.classList.toggle('on', Object.keys(MODES)[i] === this.mode));
      [1, 6, 11].forEach((ch, i) => {
        this.wifiBtns[i].classList.toggle('on', this.wifiOn[ch]);
        this.wifiBtns[i].textContent = `Wi-fi channel ${ch}: ${this.wifiOn[ch] ? 'on' : 'off'}`;
      });
      const pct = this.sent ? Math.round((this.ok / this.sent) * 100) : 100;
      this.readout.textContent = `${MODES[this.mode]}. Packets delivered: ${this.ok} of ${this.sent} (${pct}%).`;
    }

    draw() {
      const kids = [];
      const H = ROWS * RH;
      [1, 6, 11].forEach((ch) => {
        if (!this.wifiOn[ch]) return;
        const [a, b] = wifiSpan(ch);
        kids.push(svg('rect', { class: 'bt-wifi', x: a * CW, y: TOP, width: (b - a + 1) * CW, height: H }));
        kids.push(svg('text', { class: 'bt-tag', x: ((a + b + 1) / 2) * CW, y: TOP + H + 12, 'text-anchor': 'middle', text: `wi-fi ${ch}` }));
      });
      if (this.mode === 'fixed') kids.push(svg('line', { class: 'pv-grid', x1: (FIXED_CHANNEL + 0.5) * CW, y1: TOP, x2: (FIXED_CHANNEL + 0.5) * CW, y2: TOP + H }));
      this.history.forEach((h, i) => {
        kids.push(
          svg('rect', {
            class: 'bt-ch' + (i === 0 ? ' now' : '') + (h.lost ? ' lost' : ''),
            x: h.ch * CW,
            y: TOP + i * RH + 3,
            width: Math.max(CW, 5),
            height: RH - 6,
            rx: 2,
            opacity: i === 0 ? 1 : Math.max(0.45, 1 - i * 0.05),
          })
        );
      });
      kids.push(svg('line', { class: 'pv-axis', x1: 0, y1: TOP + H + 18, x2: 640, y2: TOP + H + 18 }));
      kids.push(svg('text', { class: 'bt-axis', x: 2, y: TOP + H + 28, text: '2402 MHz' }));
      kids.push(svg('text', { class: 'bt-axis', x: 320, y: TOP + H + 28, 'text-anchor': 'middle', text: '2441 MHz' }));
      kids.push(svg('text', { class: 'bt-axis', x: 638, y: TOP + H + 28, 'text-anchor': 'end', text: '2480 MHz' }));
      this.map.replaceChildren(...kids);
    }

    destroy() {
      this.pause();
    }
  }

  TL.BluetoothLab = BluetoothLab;
  TL.labs = TL.labs || {};
  TL.labs.bluetooth = BluetoothLab;
})(window.TL);
