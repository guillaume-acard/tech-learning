window.TL = window.TL || {};

(function (TL) {
  const el = TL.el;

  // ---- pure electrical models (also used by node tests) ----
  const fmtA = (a) => (a === 0 ? '0 A' : a >= 1 ? `${+a.toFixed(2)} A` : `${+(a * 1000).toFixed(a < 0.01 ? 1 : 0)} mA`);
  const fmtW = (w) => (w >= 1000 ? `${+(w / 1000).toFixed(2)} kW` : `${+w.toFixed(w < 10 ? 2 : 0)} W`);

  const LED = { vf: 2, normal: 0.02, burn: 0.03, faint: 0.004 };
  const BULB_OHMS = 12;
  const CELL_VOLTS = 1.5;

  const electric = {
    fmtA,
    fmtW,
    LED,
    BULB_OHMS,
    cells: (n) => ({ volts: n * CELL_VOLTS, kind: n < 2 ? 'dim' : n === 2 ? 'ok' : 'burnt' }),
    ohm: ({ volts, ohms }) => {
      const amps = volts / ohms;
      return { amps, watts: volts * amps };
    },
    led: ({ volts, ohms, reversed }) => {
      if (reversed) return { kind: 'reversed', amps: 0 };
      if (volts <= LED.vf) return { kind: 'dark', amps: 0 };
      const amps = (volts - LED.vf) / Math.max(ohms, 0.1);
      if (amps > LED.burn) return { kind: 'burnt', amps };
      return { kind: amps < LED.faint ? 'dim' : 'on', amps };
    },
    breaker: (volts) => (volts >= 200 ? 16 : 15),
    load: (watts, volts) => ({ watts, amps: watts / volts }),
    ir: ({ dist, dark }) => {
      const volts = TL.circuit.irVolts(dist, dark);
      const guess = volts > 0.31 ? 27 / volts : null;
      return { volts, guess };
    },
    bulbs: ({ mode, out, volts }) => {
      if (mode === 'parallel') return { v1: volts, v2: out ? 0 : volts, lit1: true, lit2: !out, amps: (volts / BULB_OHMS) * (out ? 1 : 2) };
      if (out) return { v1: 0, v2: 0, lit1: false, lit2: false, amps: 0 };
      return { v1: volts / 2, v2: volts / 2, lit1: true, lit2: true, amps: volts / (2 * BULB_OHMS) };
    },
  };

  const circuitRow = (diagram, c) => ({ kind: 'viz', viz: 'circuit', diagram, cases: [c] });

  function slider(label, { min, max, step, value, show }, onchange) {
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
  }

  const toggleBtn = (text, onclick) => el('button', { class: 'btn', text, onclick });

  // Each model returns { controls: [nodes], view(): { rows, readout, state }, challenges: [{ text, check(state) }] }.
  const MODELS = {
    cells(lab) {
      let n = 1;
      let burnt = false;
      const more = toggleBtn('Add a cell', () => {
        n = Math.min(3, n + 1);
        lab.refresh();
      });
      const fewer = toggleBtn('Remove a cell', () => {
        n = Math.max(1, n - 1);
        lab.refresh();
      });
      return {
        controls: [el('div', { class: 'lab-row' }, more, fewer)],
        view() {
          const m = electric.cells(n);
          burnt = m.kind === 'burnt';
          const word = { dim: 'The bulb glows dimly: the push is too weak.', ok: 'The bulb is bright and happy: 3 V is what it was made for.', burnt: 'Too much push for a 3 V bulb. It would burn out!' }[m.kind];
          return {
            rows: [circuitRow('cells', { n })],
            readout: `${n} cell${n > 1 ? 's' : ''} x 1.5 V = ${m.volts} V. ${word}`,
            state: { n, kind: m.kind, burnt },
          };
        },
        challenges: [
          { text: 'Make the bulb glow only dimly.', check: (s) => s.kind === 'dim' },
          { text: 'Give the bulb exactly the 3 V it needs.', check: (s) => s.kind === 'ok' },
          { text: 'Add too many cells and see the bulb burn out.', check: (s) => s.kind === 'burnt' },
        ],
      };
    },

    ohm(lab) {
      const v = slider('Battery voltage', { min: 1, max: 24, step: 1, value: 9, show: (x) => `${x} V` }, () => lab.refresh());
      const r = slider('Resistance', { min: 10, max: 1000, step: 10, value: 450, show: (x) => `${x} ohm` }, () => lab.refresh());
      return {
        controls: [el('div', { class: 'lab-row' }, v.node, r.node)],
        view() {
          const volts = v.get();
          const ohms = r.get();
          const m = electric.ohm({ volts, ohms });
          const pipe = Math.max(0.15, Math.min(1, 1 - (Math.log10(ohms) - 1) / 2.4));
          return {
            rows: [circuitRow('water', { level: 0.25 + (volts / 24) * 0.75, pipe })],
            readout: `Current = ${volts} V / ${ohms} ohm = ${fmtA(m.amps)}. Power = ${volts} V x ${fmtA(m.amps)} = ${fmtW(m.watts)}.`,
            state: { volts, ohms, amps: m.amps, watts: m.watts },
          };
        },
        challenges: [
          { text: 'Make the current exactly 100 mA (0.1 A).', check: (s) => Math.abs(s.amps - 0.1) < 0.002 },
          { text: 'Keep the 9 V battery but squeeze the current below 20 mA.', check: (s) => s.volts === 9 && s.amps < 0.02 },
          { text: 'Find a setting that burns more than 5 watts.', check: (s) => s.watts > 5 },
        ],
      };
    },

    led(lab) {
      const OPTIONS = [0, 47, 100, 220, 330, 470, 1000, 4700];
      let reversed = false;
      let dead = false;
      const v = slider('Battery voltage', { min: 1, max: 12, step: 1, value: 9, show: (x) => `${x} V` }, () => lab.refresh());
      const sel = el(
        'select',
        { class: 'text-input', 'aria-label': 'Resistor', onchange: () => lab.refresh() },
        OPTIONS.map((o) => el('option', { value: String(o), text: o ? `${o} ohm` : 'no resistor', selected: o === 4700 }))
      );
      const flip = toggleBtn('Flip the LED', () => {
        reversed = !reversed;
        lab.refresh();
      });
      const fresh = toggleBtn('Fit a new LED', () => {
        dead = false;
        lab.refresh();
      });
      return {
        controls: [
          el('div', { class: 'lab-row' }, v.node, el('label', { class: 'lab-field' }, el('span', { class: 'lab-label', text: 'Resistor' }), sel)),
          el('div', { class: 'lab-row' }, flip, fresh),
        ],
        view() {
          const volts = v.get();
          const ohms = +sel.value;
          let m = electric.led({ volts, ohms, reversed });
          if (m.kind === 'burnt') dead = true;
          if (dead) m = { kind: 'burnt', amps: m.amps };
          const state = ohms === 0 && m.kind === 'burnt' ? 'noresistor' : m.kind;
          const text = {
            on: `Current ${fmtA(m.amps)}. The LED keeps about ${electric.LED.vf} V and the resistor takes the other ${+(volts - electric.LED.vf).toFixed(1)} V.`,
            dim: `Current only ${fmtA(m.amps)}: the LED barely glows.`,
            dark: `${volts} V is not more than the ${electric.LED.vf} V the LED needs, so no current flows.`,
            reversed: 'The LED is the wrong way round, so it blocks the current. Nothing flows and nothing is damaged.',
            burnt: `More than ${electric.LED.burn * 1000} mA tried to flow, far above the 20 mA limit. The LED is dead. Fit a new one.`,
          }[m.kind];
          return {
            rows: [circuitRow('led', { state, volts, ohms })],
            readout: text,
            state: { volts, ohms, kind: m.kind, amps: m.amps, reversed },
          };
        },
        challenges: [
          { text: 'Light the LED with the 9 V battery, safely (about 5 to 20 mA).', check: (s) => s.volts === 9 && s.kind === 'on' && s.amps >= 0.005 && s.amps <= 0.021 },
          { text: 'Light it from a 3 V battery. Which resistor works?', check: (s) => s.volts === 3 && s.kind === 'on' },
          { text: 'Flip the LED round and see that it stays dark.', check: (s) => s.reversed },
          { text: 'Burn an LED out (no resistor, or one that is too small).', check: (s) => s.kind === 'burnt' },
        ],
      };
    },

    power(lab) {
      const APPLIANCES = [
        { name: 'LED bulb', watts: 8 },
        { name: 'Phone charger', watts: 10 },
        { name: 'Laptop', watts: 60 },
        { name: 'TV', watts: 100 },
        { name: 'Microwave', watts: 1200 },
        { name: 'Toaster', watts: 1000 },
        { name: 'Hair dryer', watts: 1800 },
        { name: 'Kettle', watts: 2200 },
      ];
      const on = new Set();
      let tripped = false;
      let volts = 230;
      const buttons = APPLIANCES.map((a) =>
        el('button', {
          class: 'btn',
          'aria-pressed': 'false',
          text: `${a.name} (${a.watts} W)`,
          onclick: (e) => {
            if (tripped) return;
            if (on.has(a.name)) on.delete(a.name);
            else on.add(a.name);
            e.currentTarget.setAttribute('aria-pressed', String(on.has(a.name)));
            e.currentTarget.classList.toggle('primary', on.has(a.name));
            lab.refresh();
          },
        })
      );
      const sel = el(
        'select',
        {
          class: 'text-input',
          'aria-label': 'Mains voltage',
          onchange: (e) => {
            volts = +e.target.value;
            lab.refresh();
          },
        },
        el('option', { value: '230', text: '230 V (Europe, 16 A breaker)', selected: true }),
        el('option', { value: '120', text: '120 V (USA, 15 A breaker)' })
      );
      const reset = el('button', {
        class: 'btn',
        text: 'Reset the breaker',
        onclick: () => {
          tripped = false;
          on.clear();
          buttons.forEach((b) => {
            b.setAttribute('aria-pressed', 'false');
            b.classList.remove('primary');
          });
          lab.refresh();
        },
      });
      let everTripped = false;
      return {
        controls: [
          el('div', { class: 'lab-row' }, el('label', { class: 'lab-field' }, el('span', { class: 'lab-label', text: 'Wall socket' }), sel), reset),
          el('div', { class: 'lab-label', text: 'Plug in and switch on' }),
          el('div', { class: 'lab-row' }, buttons),
        ],
        view() {
          const limit = electric.breaker(volts);
          const watts = APPLIANCES.filter((a) => on.has(a.name)).reduce((n, a) => n + a.watts, 0);
          const m = electric.load(watts, volts);
          if (m.amps > limit) {
            tripped = true;
            everTripped = true;
          }
          const hours = watts / 1000;
          const readout = tripped
            ? `CLICK! ${fmtW(m.watts)} at ${volts} V would need ${fmtA(m.amps)}, more than the ${limit} A breaker allows. The breaker cut the power. Reset it.`
            : `Total power ${fmtW(m.watts)}. Current = ${fmtW(m.watts)} / ${volts} V = ${fmtA(m.amps)} of the ${limit} A the breaker allows.${watts ? ` Left on for one hour: ${+hours.toFixed(2)} kWh.` : ''}`;
          return {
            rows: [{ kind: 'viz', viz: 'bars', items: [{ label: 'Current', value: Math.min(m.amps, limit * 1.3), text: fmtA(m.amps), tone: m.amps > limit ? 'red' : m.amps > limit * 0.75 ? 'amber' : 'green' }, { label: 'Breaker limit', value: limit, text: `${limit} A`, tone: 'dim' }], max: limit * 1.3 }],
            readout,
            state: { watts, volts, tripped, everTripped, on: Array.from(on) },
          };
        },
        challenges: [
          { text: 'Switch on the kettle. How many amps does it pull?', check: (s) => s.on.includes('Kettle') && !s.tripped },
          { text: 'Trip the breaker by switching on too much.', check: (s) => s.everTripped },
          { text: 'Reset it, then use more than 3000 W without tripping the breaker (try the 230 V socket).', check: (s) => !s.tripped && s.volts === 230 && s.watts > 3000 },
        ],
      };
    },

    ir(lab) {
      let dark = false;
      const d = slider('Distance to the object', { min: 5, max: 100, step: 5, value: 30, show: (x) => `${x} cm` }, () => lab.refresh());
      const surf = el('button', {
        class: 'btn',
        onclick: () => {
          dark = !dark;
          lab.refresh();
        },
      });
      return {
        controls: [el('div', { class: 'lab-row' }, d.node), el('div', { class: 'lab-row' }, surf)],
        view() {
          const dist = d.get();
          surf.textContent = dark ? 'Use a white object' : 'Use a black object';
          const m = electric.ir({ dist, dark });
          const reading = m.guess == null ? 'nothing in range' : `${Math.round(m.guess)} cm`;
          return {
            rows: [circuitRow('ir', { dist, dark })],
            readout: `The sensor outputs ${+m.volts.toFixed(2)} V. Using distance = 27 / volts, a program would say: ${reading}. The object is really ${dist} cm away.`,
            state: { dist, dark, volts: m.volts, guess: m.guess },
          };
        },
        challenges: [
          { text: 'Put a white object 20 cm away. Note the voltage.', check: (s) => s.dist === 20 && !s.dark },
          { text: 'Move it closer and closer. Below 10 cm the voltage falls again: the sensor cannot tell 5 cm from 20 cm.', check: (s) => s.dist < 10 && !s.dark },
          { text: 'Move it beyond 80 cm and see the reading stop changing.', check: (s) => s.dist > 80 && !s.dark },
          { text: 'Put a black object at 30 cm. The program thinks it is much farther away than it is.', check: (s) => s.dark && s.dist === 30 && s.guess != null && s.guess > 40 },
        ],
      };
    },

    bulbs(lab) {
      let mode = 'series';
      let out = false;
      const modeBtn = el('button', {
        class: 'btn',
        onclick: () => {
          mode = mode === 'series' ? 'parallel' : 'series';
          lab.refresh();
        },
      });
      const outBtn = el('button', {
        class: 'btn',
        onclick: () => {
          out = !out;
          lab.refresh();
        },
      });
      const v = slider('Battery voltage', { min: 2, max: 12, step: 2, value: 6, show: (x) => `${x} V` }, () => lab.refresh());
      return {
        controls: [el('div', { class: 'lab-row' }, v.node), el('div', { class: 'lab-row' }, modeBtn, outBtn)],
        view() {
          const volts = v.get();
          modeBtn.textContent = mode === 'series' ? 'Rewire: side by side' : 'Rewire: in a row';
          outBtn.textContent = out ? 'Screw bulb 2 back in' : 'Unscrew bulb 2';
          const m = electric.bulbs({ mode, out, volts });
          return {
            rows: [circuitRow('bulbs', { mode, out, volts })],
            readout: `${mode === 'series' ? 'In a row (series)' : 'Side by side (parallel)'}: bulb 1 gets ${m.v1} V, bulb 2 gets ${m.v2} V. The battery supplies ${fmtA(m.amps)}.`,
            state: { mode, out, volts, lit1: m.lit1, lit2: m.lit2, v1: m.v1 },
          };
        },
        challenges: [
          { text: 'Wire the bulbs in a row and unscrew one. What happens to the other?', check: (s) => s.mode === 'series' && s.out },
          { text: 'Now wire them side by side and unscrew one.', check: (s) => s.mode === 'parallel' && s.out },
          { text: 'Find the wiring where each bulb gets the full battery voltage.', check: (s) => s.mode === 'parallel' && !s.out && s.v1 === s.volts },
        ],
      };
    },
  };

  class ElectricLab {
    constructor(root, lesson, { onFinish }) {
      this.cfg = lesson.sandbox;
      const build = MODELS[this.cfg.mode];
      if (!build) throw new Error('electric lab: unknown mode "' + this.cfg.mode + '"');
      this.ci = 0;
      this.solved = false;

      this.goalBox = el('div', { class: 'goal' });
      this.status = el('p', { 'aria-live': 'polite', class: 'caption-text', text: this.cfg.intro || '' });
      this.readout = el('p', { class: 'calc-out', 'aria-live': 'polite' });
      this.cards = el('div', { class: 'cards' });
      this.nextBtn = el('button', { class: 'btn', text: 'Next challenge', hidden: true, onclick: () => this.load(this.ci + 1) });
      this.model = build(this);
      this.challenges = this.cfg.challenges || this.model.challenges;

      root.append(
        el('div', { class: 'caption' }, this.goalBox, this.status),
        el('div', { class: 'lab-panel' }, this.model.controls, this.readout),
        el('div', { class: 'stage plain' }, this.cards),
        el('div', { class: 'controls' }, this.nextBtn, el('span', { class: 'spacer' }), el('button', { class: 'btn primary', text: 'Take the quiz', onclick: onFinish }))
      );
      this.load(0);
    }

    load(i) {
      this.ci = Math.min(i, this.challenges.length - 1);
      this.solved = false;
      this.nextBtn.hidden = true;
      this.goalBox.className = 'goal';
      TL.clear(this.goalBox);
      this.goalBox.append(el('strong', { text: `Challenge ${this.ci + 1} of ${this.challenges.length}: ` }), this.challenges[this.ci].text);
      this.refresh();
    }

    refresh() {
      const v = this.model.view();
      TL.renderCards(this.cards, v.rows);
      this.readout.textContent = v.readout;
      if (!this.solved && this.challenges[this.ci].check(v.state)) {
        this.solved = true;
        this.goalBox.classList.add('done');
        const last = this.ci === this.challenges.length - 1;
        this.status.textContent = last ? 'That works! That was the last challenge.' : 'That works!';
        this.nextBtn.hidden = last;
      }
    }

    destroy() {}
  }

  TL.electric = electric;
  TL.ElectricLab = ElectricLab;
  TL.labs = TL.labs || {};
  TL.labs.electric = ElectricLab;
})(window.TL);
