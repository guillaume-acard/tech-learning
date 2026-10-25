window.TL = window.TL || {};

// Water-analogy diagrams for the components lessons: the same loop as the circuit, drawn as pipes.
//   circuit  diagram:'hydro', cases:[{ part, caption, ...part fields }]
//   part:'resistor'  pipe:'narrow'|'wide'
//   part:'tap'       open:0..1                          (potentiometer)
//   part:'valve'     state:'forward'|'reversed'|'dark'|'noresistor'   (diode / LED)
//   part:'tank'      mode:'charge'|'full'|'discharge', fill:0..1      (capacitor, a tank split by a rubber sheet)
//   part:'gate'      on:false|true                      (transistor, a sluice gate worked by a small pipe)
//   part:'wheel'     speed:0..1, rev?:true, stalled?:true             (motor)
//   all parts accept note (text under the picture) and pumpLabel:[line1, line2].
(function (TL) {
  const { DRAW, CASE_ON, S, T } = TL.circuit;
  const PIPE = 16;
  const pts = (a) => a.map((p) => p.join(',')).join(' ');
  const svg = (box, label, ...kids) => S('svg', { viewBox: box, class: 'cz-svg', role: 'img', 'aria-label': label }, kids);

  // segs: [{ pts, w?, dry?, flow? }]. Walls first, then bores, water and flow dots, so joints merge.
  function pipes(segs, { live, rev, dur, hot }) {
    const list = segs.map((g) => ({ w: g.w || PIPE, p: pts(rev ? g.pts.slice().reverse() : g.pts), dry: g.dry, flow: g.flow == null ? live : g.flow }));
    const line = (cls, g, w, extra) => S('polyline', { class: cls, points: g.p, style: `stroke-width:${w}px${extra || ''}` });
    return [
      list.map((g) => line('hy-wall', g, g.w + 4)),
      list.map((g) => line('hy-bore', g, g.w)),
      list.map((g) => (g.dry ? null : line('hy-water' + (hot ? ' hot' : ''), g, g.w))),
      list.map((g) => (g.flow ? line('hy-flow' + (hot ? ' hot' : ''), g, Math.max(2.5, g.w / 4), `;animation-duration:${dur}s`) : null)),
    ];
  }

  const pump = (rev) => [
    S('circle', { cx: 60, cy: 110, r: 20, class: 'hy-pump' }),
    S('polygon', { class: 'hy-pumparrow', points: rev ? '60,121 68,107 52,107' : '60,99 68,113 52,113' }),
  ];

  const PARTS = {
    resistor: (c) => {
      const narrow = c.pipe === 'narrow';
      return {
        flow: narrow ? 0.25 : 0.95,
        right: [{ pts: [[300, 40], [300, 70]] }, { pts: [[300, 70], [300, 150]], w: narrow ? 5 : 24 }, { pts: [[300, 150], [300, 180]] }],
        body: [],
        label: [narrow ? 'Narrow pipe' : 'Wide pipe', '(resistor)'],
        note: narrow ? 'Little water gets through: a small current' : 'Lots of water gets through: a big current',
      };
    },

    tap: (c) => {
      const open = c.open == null ? 0.5 : c.open;
      const deg = open * 90;
      return {
        flow: open > 0.05 ? open : 0,
        right: [{ pts: [[300, 40], [300, 94]] }, { pts: [[300, 126], [300, 180]] }],
        body: [
          S('rect', { x: 284, y: 94, width: 32, height: 32, rx: 4, class: 'hy-body' }),
          S('line', { x1: 316, y1: 110, x2: 334, y2: 110, class: 'hy-stem' }),
          S('g', { transform: `translate(300,110) rotate(${deg})` }, S('line', { x1: -9, y1: 0, x2: 9, y2: 0, class: 'hy-plate' })),
          S('g', { transform: `translate(334,110) rotate(${deg})` }, S('line', { x1: -10, y1: 0, x2: 10, y2: 0, class: 'hy-handle' })),
        ],
        label: ['Tap', '(potentiometer)'],
        note: c.note || (open < 0.05 ? 'Tap shut: no water' : `Tap ${Math.round(open * 100)}% open: ${open < 0.4 ? 'a little' : open < 0.8 ? 'some' : 'lots of'} water flows`),
      };
    },

    valve: (c) => {
      const state = c.state || 'forward';
      const open = state === 'forward' || state === 'noresistor';
      const hot = state === 'noresistor';
      const notes = {
        forward: 'Water flows through: the LED glows',
        reversed: 'Valve the wrong way round: blocked',
        dark: 'Pump too weak to push the valve open',
        noresistor: 'No narrow pipe: far too much water',
      };
      return {
        flow: hot ? 1 : open ? 0.55 : 0,
        hot,
        narrowTop: !hot,
        right: [{ pts: [[300, 40], [300, 92]] }, { pts: [[300, 128], [300, 180]] }],
        body: [
          open ? S('circle', { cx: 300, cy: 110, r: 27, class: 'hy-glow' + (hot ? ' hot' : '') }) : null,
          S('rect', { x: 286, y: 92, width: 28, height: 36, rx: 4, class: 'hy-body' + (hot ? ' hot' : '') }),
          open ? S('line', { x1: 291, y1: 98, x2: 291, y2: 122, class: 'hy-flap' }) : S('line', { x1: 288, y1: 110, x2: 312, y2: 110, class: 'hy-flap shut' }),
        ],
        label: ['One-way valve', '(LED)'],
        pumpLabel: state === 'dark' ? ['Weak pump', '(1.5 V)'] : null,
        note: c.note || notes[state],
        noteBad: state !== 'forward',
      };
    },

    tank: (c) => {
      const mode = c.mode || 'charge';
      const fill = c.fill == null ? (mode === 'full' ? 1 : 0) : c.fill;
      const d = fill * 30;
      const sheet = `M270,110 Q300,${110 + 2 * d} 330,110`;
      const notes = {
        charge: `Water pushes the sheet: ${Math.round(fill * 100)}% full`,
        full: 'Sheet fully stretched: the flow stops',
        discharge: 'No pump: the sheet pushes the water back',
      };
      return {
        flow: mode === 'full' ? 0 : Math.max(0.2, mode === 'charge' ? 1 - fill : fill),
        rev: mode === 'discharge',
        pump: mode !== 'discharge',
        right: [{ pts: [[300, 40], [300, 66]] }, { pts: [[300, 154], [300, 180]] }],
        body: [
          S('path', { d: `M270,66 L330,66 L330,110 Q300,${110 + 2 * d} 270,110 Z`, class: 'hy-tankwater' }),
          S('path', { d: `M270,110 Q300,${110 + 2 * d} 330,110 L330,154 L270,154 Z`, class: 'hy-tankwater' }),
          S('rect', { x: 270, y: 66, width: 60, height: 88, rx: 4, class: 'hy-body hy-open' }),
          S('path', { d: sheet, class: 'hy-sheet' }),
        ],
        label: ['Sheet tank', '(capacitor)'],
        pumpLabel: mode === 'discharge' ? ['No pump', ''] : null,
        note: c.note || notes[mode],
      };
    },

    gate: (c) => {
      const on = !!c.on;
      return {
        flow: on ? 1 : 0,
        right: [
          { pts: [[300, 40], [300, 180]] },
          { pts: [[326, 224], [326, 122]], w: 8, dry: !on, flow: false },
        ],
        body: [
          S('rect', { x: 308, y: 98, width: 36, height: 24, class: 'hy-body' + (on ? ' wet' : '') }),
          S('rect', { x: on ? 316 : 292, y: 107, width: on ? 22 : 16, height: 6, class: 'hy-gatebar' }),
          T(318, 196, 'Gate pipe', 'cz-dim', 'end'),
          T(318, 210, on ? 'pushed hard' : 'no push', on ? 'cz-hi' : 'cz-dim', 'end'),
        ],
        label: ['Sluice gate', '(transistor)'],
        note: c.note || (on ? 'Pushed: the gate lifts, water flows' : 'No push: the gate blocks the water'),
        noteX: 150,
      };
    },

    wheel: (c) => {
      const speed = c.stalled ? 0 : c.speed == null ? 0.7 : c.speed;
      const blades = [[22, 0], [-22, 0], [0, 22], [0, -22]];
      return {
        flow: speed,
        rev: !!c.rev,
        hot: !!c.stalled,
        right: [{ pts: [[300, 40], [300, 82]] }, { pts: [[300, 138], [300, 180]] }],
        body: [
          S('circle', { cx: 300, cy: 110, r: 29, class: 'hy-body' + (c.stalled ? ' hot' : '') }),
          S(
            'g',
            { transform: 'translate(300,110)' },
            S(
              'g',
              { class: 'hy-wheel' + (speed > 0.02 ? ' spin' : '') + (c.rev ? ' rev' : ''), style: `animation-duration:${(2.4 - 1.8 * speed).toFixed(2)}s` },
              S('line', { x1: -22, y1: 0, x2: 22, y2: 0 }),
              S('line', { x1: 0, y1: -22, x2: 0, y2: 22 }),
              blades.map((b, i) => S('circle', { cx: b[0], cy: b[1], r: 5, class: i === 0 ? 'mark' : '' }))
            )
          ),
        ],
        label: ['Water wheel', '(motor)'],
        note: c.note || (c.stalled ? 'Wheel jammed: no flow, the pressure builds up' : speed < 0.05 ? 'No water: the wheel stays still' : c.rev ? 'Reversed water: wheel turns backwards' : `Wheel turns ${speed > 0.8 ? 'fast' : speed > 0.4 ? 'at a medium speed' : 'slowly'}`),
        noteBad: !!c.stalled,
      };
    },
  };

  function drawHydro(on, c) {
    const make = PARTS[c.part];
    if (!make) throw new Error('hydro: unknown part "' + c.part + '"');
    const p = make(c);
    const live = p.flow > 0.02;
    const rev = !!p.rev;
    const segs = [];
    const hasPump = p.pump !== false;
    if (p.narrowTop) {
      segs.push({ pts: [[60, hasPump ? 90 : 130], [60, 40], [150, 40]] }, { pts: [[150, 40], [210, 40]], w: 5 }, { pts: [[210, 40], [300, 40]] });
    } else {
      segs.push({ pts: [[60, hasPump ? 90 : 130], [60, 40], [300, 40]] });
    }
    segs.push(...p.right, { pts: [[300, 180], [60, 180], [60, 130]] });
    if (!hasPump) segs.push({ pts: [[60, 130], [60, 90]] });
    const dur = +(1.7 - 1.2 * Math.min(1, p.flow)).toFixed(2);
    const pl = p.pumpLabel || ['Pump', '(battery)'];
    return svg(
      '0 0 360 232',
      `Water picture: ${p.note}`,
      pipes(segs, { live, rev, dur, hot: p.hot }),
      hasPump ? pump(rev) : null,
      p.body,
      T(88, 102, pl[0], 'cz-dim'),
      pl[1] ? T(88, 118, pl[1], 'cz-dim') : null,
      T(262, 102, p.label[0], 'cz-dim', 'end'),
      T(262, 118, p.label[1], 'cz-dim', 'end'),
      p.narrowTop ? T(180, 24, 'Narrow pipe (resistor)', 'cz-dim', 'middle') : null,
      T(p.noteX || 180, 226, p.note, p.noteBad ? 'cz-bad' : 'cz-hi', 'middle')
    );
  }

  DRAW.hydro = drawHydro;
  CASE_ON.hydro = (c) => PARTS[c.part](c).flow > 0.02;
})(window.TL);
