window.TL = window.TL || {};

// Extra visual types for step `cards`. Use them as a row in a step's `cards` array:
//   cards: [ { kind: 'viz', viz: '<type>', title?, subtitle?, note?, ...type fields } ]
// Common optional fields: title, subtitle, note (small footer text). Tones: cyan amber green violet red dim.
//
//  bits      rows:[{ bits:'01000001', label:'A', sub:'letter', equals:'65', weights:true, group:4, tone }]
//            Row of 0/1 cells. weights:true shows place values (128 64 ...) and the sum. Or give a single `bits`.
//  memory    cells:[{ addr:'0', value:'72', label:'H', tone, active }], cols:8, legend:[{ tone, text }]
//            Numbered boxes, like RAM or a disk. `value` is what is stored, `addr` the box number.
//  pixels    grid:['.#.','###'] + palette:{'.':'#0a1424','#':'#38e8ff'}  OR  grid:[['#ff0000','#00ff00']] of CSS colours;
//            values:[['255,0,0',...]] (same shape) prints numbers in cells; size:36 sets cell px.
//  frames    frames:[{ grid:[['#fff',...]], label:'Step 1', sub:'a little noise', tone }], size:22, arrow:'→' | false
//            A row of small pixel pictures side by side (same grid format as `pixels`), e.g. an image getting noisier.
//  record    groups:[{ label:'Header', tone, fields:[{ k:'From', v:'192.168.1.5' }] }]
//            A labelled data record such as a packet, an HTTP request, a cookie.
//  table     columns:['Name','Address'], rows:[['example.com','93.184.216.34']], highlight:1 | [rows], cells:[[row,col]], tone
//  layers    layers:[{ t:'Apps', sub:'games, browser', tone }]  (top to bottom), arrows:true shows "uses" arrows
//  code      file:'index.html', lines:['<h1>Hi</h1>', { t:'<p>x</p>', tone:'amber', note:'a paragraph' }]
//  bars      items:[{ label:'blue', value:60, text:'60%', tone }], max:100
//  encode    pairs:[{ a:'H', b:'72', tone }], aLabel:'Letter', bLabel:'Number', arrow:'ASCII table'
//            Things on top turned into things below (text to numbers, name to address, word to token id).
//  sequence  actors:['Browser','Server'], messages:[{ from:0, to:1, text:'GET /page', tone, note }]
//            Who sends what to whom, top to bottom in time order. from/to are actor indexes.
//  vector    items:[{ label:'cat', values:[0.8,-0.2,0.1], tone }], more:true
//            Lists of numbers shaded by size (cyan = positive, magenta = negative), e.g. an embedding.
//  circuit   diagram:'symbols' (items:['battery','switch','lamp','resistor','ground','nmos']) | 'switch' | 'transistor' | 'inverter'
//            | 'mosfet' (cross-section of the gate) | 'nand' | 'nor' (cases:[{ a:0|1, b:0|1, caption }]),
//            cases:[{ on:false, caption }, { on:true, caption }]. Electrical schematics drawn with the standard symbols;
//            on = switch closed / gate high, and current flows along the wires (animated).
//  worldmap  groups:['atlantic','pacific','eurasia','africa','asia'] (also 'telegraph','tat8'), focus:'pacific', labels:true
//            Simplified world map with submarine cable routes (data in js/engine/worldmap-*.js).
(function (TL) {
  const el = TL.el;
  const tone = (t) => 'tone-' + (t || 'cyan');
  const V = (TL.visuals = {});

  V.bits = (row) => {
    const rows = row.rows || [{ bits: row.bits, label: row.label, sub: row.sub, equals: row.equals, weights: row.weights, tone: row.tone }];
    const box = el('div', { class: 'vz-bits' });
    rows.forEach((r) => {
      const bits = String(r.bits).replace(/\s/g, '');
      const n = bits.length;
      const group = r.group || (n > 8 ? 8 : 0);
      const cells = el('div', { class: 'vz-bitcells' });
      let sum = 0;
      const terms = [];
      [...bits].forEach((b, i) => {
        const w = Math.pow(2, n - 1 - i);
        if (b === '1') {
          sum += w;
          terms.push(w);
        }
        const cell = el('div', { class: 'vz-bit' + (b === '1' ? ' on' : '') + (group && i && i % group === 0 ? ' gap' : '') }, r.weights ? el('span', { class: 'vz-w', text: String(w) }) : null, el('span', { class: 'vz-b', text: b }));
        cells.append(cell);
      });
      const equals = r.equals != null ? r.equals : r.weights ? (terms.length > 1 ? terms.join(' + ') + ' = ' : '') + sum : '';
      box.append(
        el(
          'div',
          { class: 'vz-bitrow ' + tone(r.tone) },
          r.label != null ? el('div', { class: 'vz-bitlabel' }, el('strong', { text: String(r.label) }), r.sub ? el('span', { text: r.sub }) : null) : null,
          cells,
          equals !== '' ? el('div', { class: 'vz-equals', text: '= ' + equals.toString().replace(/^= /, '') }) : null
        )
      );
    });
    return box;
  };

  V.memory = (row) => {
    const cols = row.cols || 8;
    const grid = el('div', { class: 'vz-mem', style: `grid-template-columns: repeat(${cols}, minmax(0, 1fr))` });
    (row.cells || []).forEach((c) => {
      grid.append(
        el(
          'div',
          { class: 'vz-memcell ' + tone(c.tone) + (c.active ? ' active' : '') + (c.empty ? ' empty' : '') },
          el('span', { class: 'vz-addr', text: c.addr != null ? String(c.addr) : '' }),
          el('span', { class: 'vz-val', text: c.value != null ? String(c.value) : '' }),
          c.label ? el('span', { class: 'vz-lab', text: c.label }) : null
        )
      );
    });
    const legend = row.legend
      ? el('div', { class: 'vz-legend' }, row.legend.map((l) => el('span', { class: 'vz-key ' + tone(l.tone) }, el('i'), l.text)))
      : null;
    return el('div', {}, grid, legend);
  };

  V.pixels = (row) => {
    const size = row.size || 36;
    const grid = (row.grid || []).map((r) => (typeof r === 'string' ? [...r].map((ch) => (row.palette && row.palette[ch]) || ch) : r));
    const cols = Math.max(...grid.map((r) => r.length));
    const box = el('div', { class: 'vz-pixels', style: `grid-template-columns: repeat(${cols}, ${size}px)` });
    grid.forEach((r, y) =>
      r.forEach((color, x) => {
        const v = row.values && row.values[y] && row.values[y][x];
        box.append(el('div', { class: 'vz-px', style: `width:${size}px;height:${size}px;background:${color}` }, v != null ? el('span', { text: String(v) }) : null));
      })
    );
    return el('div', { class: 'vz-center' }, box);
  };

  V.frames = (row) =>
    el(
      'div',
      { class: 'vz-frames' },
      (row.frames || []).map((f, i) => [
        i && row.arrow !== false ? el('span', { class: 'vz-frarrow', text: row.arrow || '→' }) : null,
        el('div', { class: 'vz-frame ' + tone(f.tone) }, V.pixels({ grid: f.grid, size: row.size || 22 }), f.label ? el('strong', { text: f.label }) : null, f.sub ? el('span', { text: f.sub }) : null),
      ])
    );

  V.record = (row) =>
    el(
      'div',
      { class: 'vz-record' },
      (row.groups || []).map((g) =>
        el(
          'div',
          { class: 'vz-group ' + tone(g.tone) },
          el('div', { class: 'vz-grouplabel', text: g.label || '' }),
          el('div', { class: 'vz-fields' }, (g.fields || []).map((f) => el('div', { class: 'vz-field' }, el('span', { class: 'vz-k', text: f.k }), el('span', { class: 'vz-v', text: String(f.v) }))))
        )
      )
    );

  V.table = (row) => {
    const rowsHi = new Set([].concat(row.highlight == null ? [] : row.highlight));
    const cellHi = new Set((row.cells || []).map((c) => c.join(',')));
    return el(
      'div',
      { class: 'vz-tablewrap ' + tone(row.tone || 'amber') },
      el(
        'table',
        { class: 'vz-table' },
        el('thead', {}, el('tr', {}, (row.columns || []).map((c) => el('th', { text: c })))),
        el(
          'tbody',
          {},
          (row.rows || []).map((r, i) => el('tr', { class: rowsHi.has(i) ? 'hi' : '' }, r.map((c, j) => el('td', { class: cellHi.has(i + ',' + j) ? 'hi' : '', text: String(c) }))))
        )
      )
    );
  };

  V.layers = (row) => {
    const box = el('div', { class: 'vz-layers' });
    (row.layers || []).forEach((l, i) => {
      if (i && row.arrows) box.append(el('div', { class: 'vz-uses', text: typeof row.arrows === 'string' ? row.arrows : '▲ runs on' }));
      box.append(el('div', { class: 'vz-layer ' + tone(l.tone) }, el('strong', { text: l.t }), l.sub ? el('span', { text: l.sub }) : null));
    });
    return box;
  };

  V.code = (row) =>
    el(
      'div',
      { class: 'vz-code' },
      row.file ? el('div', { class: 'vz-file', text: row.file }) : null,
      el(
        'ol',
        {},
        (row.lines || []).map((ln) => {
          const o = typeof ln === 'string' ? { t: ln } : ln;
          return el('li', { class: o.tone ? tone(o.tone) + ' mark' : '' }, el('code', { text: o.t }), o.note ? el('span', { class: 'vz-note', text: o.note }) : null);
        })
      )
    );

  V.bars = (row) => {
    const max = row.max || 100;
    return el(
      'div',
      { class: 'vz-bars' },
      (row.items || []).map((it) =>
        el(
          'div',
          { class: 'vz-bar ' + tone(it.tone) },
          el('span', { class: 'vz-barlabel', text: it.label }),
          el('span', { class: 'vz-track' }, el('span', { class: 'vz-fill', style: `width:${Math.max(1, Math.min(100, (it.value / max) * 100))}%` })),
          el('span', { class: 'vz-barval', text: it.text != null ? it.text : it.value + '%' })
        )
      )
    );
  };

  V.encode = (row) =>
    el(
      'div',
      { class: 'vz-encode' },
      row.aLabel || row.bLabel ? el('div', { class: 'vz-enc-labels' }, el('span', { text: row.aLabel || '' }), el('span', { class: 'mid', text: row.arrow ? '↓ ' + row.arrow : '↓' }), el('span', { text: row.bLabel || '' })) : null,
      el(
        'div',
        { class: 'vz-enc-cols' },
        (row.pairs || []).map((p) => el('div', { class: 'vz-pair ' + tone(p.tone) }, el('div', { class: 'a', text: p.a }), el('div', { class: 'arr', text: '↓' }), el('div', { class: 'b', text: p.b })))
      )
    );

  V.sequence = (row) => {
    const actors = row.actors || [];
    const n = actors.length;
    const cols = `grid-template-columns: repeat(${n}, minmax(0, 1fr))`;
    const box = el('div', { class: 'vz-seq' }, el('div', { class: 'vz-seq-head', style: cols }, actors.map((a) => el('div', { class: 'vz-actor', text: a }))));
    (row.messages || []).forEach((m) => {
      const lo = Math.min(m.from, m.to);
      const hi = Math.max(m.from, m.to);
      const same = lo === hi;
      const left = ((lo + 0.5) / n) * 100;
      const width = same ? 0 : ((hi - lo) / n) * 100;
      const arrow = same
        ? el('div', { class: 'vz-self ' + tone(m.tone), style: `left:${left}%` }, el('span', { text: m.text }))
        : el('div', { class: 'vz-arrow ' + tone(m.tone) + (m.to < m.from ? ' rtl' : ''), style: `left:${left}%;width:${width}%` }, el('span', { text: m.text }));
      box.append(
        el(
          'div',
          { class: 'vz-seq-row' + (m.note ? ' has-note' : ''), style: cols },
          actors.map(() => el('div', { class: 'vz-life' })),
          arrow,
          m.note ? el('div', { class: 'vz-seq-note', text: m.note }) : null
        )
      );
    });
    return box;
  };

  V.vector = (row) =>
    el(
      'div',
      { class: 'vz-vectors' },
      (row.items || []).map((it) =>
        el(
          'div',
          { class: 'vz-vec ' + tone(it.tone) },
          el('span', { class: 'vz-veclabel', text: it.label }),
          el(
            'span',
            { class: 'vz-veccells' },
            it.values.map((v) => {
              const a = Math.min(1, Math.abs(v));
              const color = v >= 0 ? '56, 232, 255' : '232, 90, 220';
              return el('span', { class: 'vz-vc', style: `background: rgba(${color}, ${0.12 + a * 0.7})`, text: (v > 0 ? '+' : '') + v.toFixed(1) });
            }),
            row.more ? el('span', { class: 'vz-more', text: '…' }) : null
          )
        )
      )
    );

  // ---- circuit: electrical schematics with standard symbols (SVG) ----
  const S = TL.svg;
  const W = (pts, live, extra) => S('polyline', { class: 'cz-wire' + (live ? ' live' : '') + (extra ? ' ' + extra : ''), points: pts.map((p) => p.join(',')).join(' ') });
  const T = (x, y, text, cls, anchor) => S('text', { x, y, class: 'cz-text' + (cls ? ' ' + cls : ''), 'text-anchor': anchor || 'start', text });
  const G = (x, y, kids) => S('g', { transform: `translate(${x},${y})` }, kids);
  const part = (tag, props) => S(tag, Object.assign({ class: 'cz-part' }, props));
  const dot = (x, y) => S('circle', { cx: x, cy: y, r: 3, class: 'cz-dot' });

  // Each symbol is drawn around (0,0). Two-terminal parts have terminals 20 units away.
  const SYM = {
    battery: (live) => [W([[0, -20], [0, -4]], live), W([[0, 4], [0, 20]], live), part('line', { x1: -14, y1: -4, x2: 14, y2: -4 }), part('line', { x1: -8, y1: 4, x2: 8, y2: 4 }), T(18, -6, '+', 'cz-dim')],
    switch: (live) => [
      W([[-20, 0], [-14, 0]], live),
      W([[14, 0], [20, 0]], live),
      S('circle', { cx: -14, cy: 0, r: 2.5, class: 'cz-dot' }),
      S('circle', { cx: 14, cy: 0, r: 2.5, class: 'cz-dot' }),
      live ? W([[-14, 0], [14, 0]], true) : part('line', { x1: -14, y1: 0, x2: 10, y2: -14 }),
    ],
    lamp: (live) => [W([[0, -20], [0, -14]], live), W([[0, 14], [0, 20]], live), S('circle', { r: 14, class: 'cz-part' + (live ? ' lit' : '') }), part('line', { x1: -10, y1: -10, x2: 10, y2: 10 }), part('line', { x1: 10, y1: -10, x2: -10, y2: 10 })],
    resistor: (live) => [W([[0, -20], [0, -14]], live), W([[0, 14], [0, 20]], live), part('rect', { x: -6, y: -14, width: 12, height: 28 })],
    ground: () => [W([[0, -20], [0, -4]]), part('line', { x1: -12, y1: -4, x2: 12, y2: -4 }), part('line', { x1: -8, y1: 2, x2: 8, y2: 2 }), part('line', { x1: -4, y1: 8, x2: 4, y2: 8 })],
    // N-channel MOSFET: gate plate on the left, channel in the middle, drain (top) and source (bottom) on the right.
    nmos: (on, live) => {
      const lv = live === undefined ? on : live;
      return [
        part('line', { x1: -12, y1: -37, x2: -12, y2: 37 }),
        S('polyline', { class: 'cz-chan' + (on ? ' on' : ''), points: '0,-37 0,-21', fill: 'none' }),
        S('polyline', { class: 'cz-chan' + (on ? ' on' : ''), points: '0,-9 0,9', fill: 'none' }),
        S('polyline', { class: 'cz-chan' + (on ? ' on' : ''), points: '0,21 0,37', fill: 'none' }),
        W([[20, -29], [0, -29]], lv),
        W([[0, 29], [20, 29]], lv),
        W([[20, 0], [0, 0]]),
        W([[20, 0], [20, 29]]),
        S('polygon', { class: 'cz-arrow', points: '0,0 9,-5 9,5' }),
      ];
    },
  };

  function drawSwitch(on) {
    return S(
      'svg',
      { viewBox: '0 0 360 220', class: 'cz-svg', role: 'img', 'aria-label': on ? 'A closed switch lets current flow and the lamp lights' : 'An open switch breaks the loop so the lamp is off' },
      W([[60, 90], [60, 40], [150, 40]], on),
      W([[190, 40], [300, 40], [300, 90]], on),
      W([[300, 130], [300, 180], [60, 180], [60, 130]], on),
      G(60, 110, SYM.battery(on)),
      G(170, 40, SYM.switch(on)),
      G(300, 110, SYM.lamp(on)),
      T(76, 114, 'Battery', 'cz-dim'),
      T(170, 22, on ? 'Switch closed' : 'Switch open', on ? 'cz-hi' : 'cz-dim', 'middle'),
      T(280, 114, 'Lamp', 'cz-dim', 'end'),
      T(180, 125, on ? 'current flows' : 'no current', on ? 'cz-hi' : 'cz-dim', 'middle')
    );
  }

  function transistorBase(on, top) {
    return [
      W([[60, 155], [184, 155]], on, 'gate' + (on ? ' hi' : '')),
      dot(60, 155),
      T(40, 136, 'Gate input'),
      T(40, 178, on ? '1 = HIGH' : '0 = LOW', 'cz-bit' + (on ? ' hi' : '')),
      T(138, 147, 'Gate', 'cz-dim', 'middle'),
      G(196, 155, SYM.nmos(on)),
      T(226, 129, 'Drain', 'cz-dim'),
      T(226, 187, 'Source', 'cz-dim'),
      W([[216, 184], [216, 206]], on),
      G(216, 226, SYM.ground()),
      part('line', { x1: 204, y1: 14, x2: 228, y2: 14 }),
      T(236, 18, '+5 V supply', 'cz-dim'),
    ].concat(top);
  }

  function drawTransistor(on) {
    return S(
      'svg',
      { viewBox: '0 0 360 250', class: 'cz-svg', role: 'img', 'aria-label': on ? 'High voltage on the gate lets current flow through the transistor and the lamp lights' : 'Low voltage on the gate blocks the transistor so the lamp is off' },
      transistorBase(on, [W([[216, 14], [216, 56]], on), G(216, 76, SYM.lamp(on)), W([[216, 96], [216, 126]], on), T(240, 80, 'Lamp', 'cz-dim')])
    );
  }

  function drawInverter(on) {
    const outHigh = !on;
    return S(
      'svg',
      { viewBox: '0 0 360 250', class: 'cz-svg', role: 'img', 'aria-label': on ? 'Input 1 turns the transistor on, which pulls the output down to 0' : 'Input 0 keeps the transistor off, so the resistor holds the output at 1' },
      transistorBase(on, [
        W([[216, 14], [216, 36]], on),
        G(216, 56, SYM.resistor(on)),
        T(236, 60, 'Resistor', 'cz-dim'),
        W([[216, 76], [216, 126]], on),
        dot(216, 100),
        W([[216, 100], [300, 100]], false, 'sig' + (outHigh ? ' hi' : '')),
        dot(300, 100),
        T(300, 84, 'Output', '', 'middle'),
        T(300, 124, outHigh ? '1 = HIGH' : '0 = LOW', 'cz-bit' + (outHigh ? ' hi' : ''), 'middle'),
      ])
    );
  }

  // Cross-section of a MOSFET: the gate is a metal plate separated from the silicon by an insulator.
  function drawMosfet(on) {
    const plus = on ? [130, 160, 190, 220].map((x) => T(x, 42, '+', 'cz-hi', 'middle')) : [];
    const minus = on ? [138, 160, 182, 204, 222].map((x) => T(x, 69, '-', 'cz-hi', 'middle')) : [];
    return S(
      'svg',
      { viewBox: '0 0 360 180', class: 'cz-svg', role: 'img', 'aria-label': on ? 'A high voltage on the gate plate pulls electrons into a channel, so a path forms between source and drain' : 'With no voltage on the gate plate there is no channel, so the path between source and drain is blocked' },
      S('rect', { x: 40, y: 58, width: 280, height: 100, class: 'cz-fill cz-si' }),
      S('rect', { x: 56, y: 58, width: 70, height: 40, class: 'cz-fill cz-n' }),
      S('rect', { x: 234, y: 58, width: 70, height: 40, class: 'cz-fill cz-n' }),
      on ? S('rect', { x: 126, y: 58, width: 108, height: 12, class: 'cz-fill cz-chfill' }) : null,
      S('rect', { x: 110, y: 46, width: 140, height: 12, class: 'cz-fill cz-ins' }),
      S('rect', { x: 110, y: 30, width: 140, height: 16, class: 'cz-fill cz-metal' + (on ? ' on' : '') }),
      W([[180, 30], [180, 20]], false, 'gate' + (on ? ' hi' : '')),
      T(180, 14, on ? '+5 V = HIGH (1)' : '0 V = LOW (0)', 'cz-bit' + (on ? ' hi' : ''), 'middle'),
      T(104, 42, 'Gate', 'cz-dim', 'end'),
      T(256, 56, 'Insulator', 'cz-dim'),
      plus,
      minus,
      on ? W([[126, 64], [234, 64]], true) : null,
      T(180, 90, on ? 'electrons flow' : 'no path', on ? 'cz-hi' : 'cz-dim', 'middle'),
      T(91, 116, 'Source', 'cz-dim', 'middle'),
      T(269, 116, 'Drain', 'cz-dim', 'middle'),
      T(180, 148, 'Silicon', 'cz-dim', 'middle')
    );
  }

  const logicIn = (x, y, name, v, anchor) => [
    T(x, y - 18, 'Input ' + name, '', anchor),
    T(x, y + 22, v ? '1 = HIGH' : '0 = LOW', 'cz-bit' + (v ? ' hi' : ''), anchor),
  ];
  const logicOut = (x, y, high, anchor) => [
    T(x, y - 16, 'Output', '', anchor),
    T(x, y + 24, high ? '1 = HIGH' : '0 = LOW', 'cz-bit' + (high ? ' hi' : ''), anchor),
  ];
  const supply = (x) => [part('line', { x1: x - 12, y1: 14, x2: x + 12, y2: 14 }), T(x + 20, 18, '+5 V supply', 'cz-dim')];

  // Two transistors in a row (series): current reaches ground only if A and B are both on.
  function drawNand(a, b) {
    const flow = a && b;
    const outHigh = !flow;
    return S(
      'svg',
      { viewBox: '0 0 360 290', class: 'cz-svg', role: 'img', 'aria-label': flow ? 'Both transistors are on, so current flows to ground and the output is 0' : 'At least one transistor is off, so the path to ground is broken and the output stays 1' },
      W([[60, 135], [184, 135]], false, 'gate' + (a ? ' hi' : '')),
      dot(60, 135),
      logicIn(40, 135, 'A', a),
      W([[60, 215], [184, 215]], false, 'gate' + (b ? ' hi' : '')),
      dot(60, 215),
      logicIn(40, 215, 'B', b),
      supply(216),
      W([[216, 14], [216, 36]], flow),
      G(216, 56, SYM.resistor(flow)),
      T(236, 60, 'Resistor', 'cz-dim'),
      W([[216, 76], [216, 106]], flow),
      dot(216, 90),
      W([[216, 90], [300, 90]], false, 'sig' + (outHigh ? ' hi' : '')),
      dot(300, 90),
      logicOut(300, 90, outHigh, 'middle'),
      G(196, 135, SYM.nmos(a, flow)),
      W([[216, 164], [216, 186]], flow),
      G(196, 215, SYM.nmos(b, flow)),
      T(236, 177, 'A and B in a row', 'cz-dim'),
      W([[216, 244], [216, 256]], flow),
      G(216, 276, SYM.ground())
    );
  }

  // Two transistors side by side (parallel): current reaches ground if A or B is on.
  function drawNor(a, b) {
    const flow = a || b;
    const outHigh = !flow;
    return S(
      'svg',
      { viewBox: '0 0 360 290', class: 'cz-svg', role: 'img', 'aria-label': flow ? 'At least one transistor is on, so current flows to ground and the output is 0' : 'Both transistors are off, so the path to ground is broken and the output stays 1' },
      W([[60, 170], [138, 170]], false, 'gate' + (a ? ' hi' : '')),
      dot(60, 170),
      logicIn(40, 170, 'A', a),
      W([[282, 170], [330, 170]], false, 'gate' + (b ? ' hi' : '')),
      dot(330, 170),
      logicIn(350, 170, 'B', b, 'end'),
      supply(210),
      W([[210, 14], [210, 40]], flow),
      G(210, 60, SYM.resistor(flow)),
      T(230, 64, 'Resistor', 'cz-dim'),
      W([[210, 80], [210, 100]], flow),
      W([[170, 141], [170, 100], [210, 100]], a),
      W([[250, 141], [250, 100], [210, 100]], b),
      dot(210, 100),
      dot(250, 100),
      W([[250, 100], [330, 100]], false, 'sig' + (outHigh ? ' hi' : '')),
      dot(330, 100),
      logicOut(340, 100, outHigh, 'end'),
      G(150, 170, SYM.nmos(a, a)),
      S('g', { transform: 'translate(270,170) scale(-1,1)' }, SYM.nmos(b, b)),
      W([[170, 199], [170, 240], [210, 240]], a),
      W([[250, 199], [250, 240], [210, 240]], b),
      dot(210, 240),
      W([[210, 240], [210, 256]], flow),
      G(210, 276, SYM.ground())
    );
  }

  const DRAW = { switch: drawSwitch, transistor: drawTransistor, inverter: drawInverter, mosfet: drawMosfet, nand: (on, c) => drawNand(!!c.a, !!c.b), nor: (on, c) => drawNor(!!c.a, !!c.b) };
  const CASE_ON = { nand: (c) => c.a && c.b, nor: (c) => c.a || c.b };
  const LEGEND = {
    battery: ['Battery / supply', 'pushes current round the loop'],
    switch: ['Switch', 'closed lets current through, open breaks the loop'],
    lamp: ['Lamp / output', 'lights up when current flows'],
    resistor: ['Resistor', 'limits how much current flows'],
    ground: ['Ground (0 V)', 'where the current returns to'],
    nmos: ['Transistor', 'a switch worked by the gate'],
  };

  function drawSymbols(row) {
    const keys = row.items || ['battery', 'switch', 'lamp', 'resistor', 'ground'];
    return el(
      'div',
      { class: 'cz-legend' },
      keys.map((k) => {
        const item = typeof k === 'string' ? { s: k } : k;
        const [name, sub] = LEGEND[item.s] || [item.s, ''];
        const svg = S('svg', { viewBox: '-46 -44 92 88', class: 'cz-symsvg', role: 'img', 'aria-label': item.t || name }, SYM[item.s](false));
        if (item.s === 'nmos') svg.append(W([[-12, 0], [-34, 0]]), T(-45, -5, 'G', 'cz-dim'), T(25, -26, 'D', 'cz-dim'), T(25, 41, 'S', 'cz-dim'));
        return el('div', { class: 'cz-sym' }, svg, el('strong', { text: item.t || name }), el('span', { text: item.sub || sub }));
      })
    );
  }

  // circuit: diagram:'symbols' | 'switch' | 'transistor' | 'inverter' | 'mosfet' (cross-section) | 'nand' | 'nor'
  // cases:[{ on:false, caption:'Gate low' }, { on:true, caption:'Gate high' }] draws OFF/ON side by side.
  // 'nand' and 'nor' take cases:[{ a:0, b:1, caption }] (the two inputs) instead of `on`.
  V.circuit = (row) => {
    if (row.diagram === 'symbols') return drawSymbols(row);
    const draw = DRAW[row.diagram];
    if (!draw) throw new Error('circuit: unknown diagram "' + row.diagram + '"');
    const cases = row.cases || [{ on: !!row.on, caption: row.caption }];
    const isOn = (c) => (CASE_ON[row.diagram] ? !!CASE_ON[row.diagram](c) : !!c.on);
    return el(
      'div',
      { class: 'cz' },
      cases.map((c) => el('figure', { class: 'cz-case' + (isOn(c) ? ' on' : '') }, draw(!!c.on, c), c.caption ? el('figcaption', { class: 'cz-cap', text: c.caption }) : null))
    );
  };
})(window.TL);
