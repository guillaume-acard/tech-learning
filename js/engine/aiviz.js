window.TL = window.TL || {};

// Extra visuals for the AI lessons (same `cards` format as js/engine/visuals.js):
//  network  layers:[{ n:4, label:'Input', names:['ears','tail'], active:[0] }], seed:1
//           A neural network drawn as circles and lines. Line thickness = weight, cyan = positive, magenta = negative.
//           names label the circles (left of the first layer, right of the last); active lights up circles in green.
//  neuron   inputs:[{ label:'pointy ears', x:0.8, w:0.9 }], result?:'cat' (small label under the output)
//           One neuron worked out: inputs times weights, added up, passed on.
//  tour     frames:[{ order:[0,3,1,...], label:'Generation 1', sub?, tone }], cities?:[[x,y],...], scale?:4, unit?:'km'
//           Small maps of cities with a closed route. The length of each route is worked out and shown.
//  genes    rows:[{ label:'Parent A', genes:['A','B',{ t:'C', tone:'amber', mark:true }] } | { arrow:'cut and join' }]
//           Rows of boxes, for the genes of a genetic algorithm. mark draws a box with a changed outline.
(function (TL) {
  const el = TL.el;
  const S = TL.svg;
  const V = (TL.visuals = TL.visuals || {});
  const tone = (t) => 'tone-' + (t || 'cyan');

  const DEFAULT_CITIES = [[10, 40], [20, 12], [30, 52], [40, 24], [52, 60], [58, 14], [70, 40], [82, 58], [90, 22], [48, 40]];
  TL.aiviz = { DEFAULT_CITIES };

  const hash = (a, b, c, seed) => {
    const x = Math.sin(a * 12.9898 + b * 78.233 + c * 37.719 + seed * 4.1414) * 43758.5453;
    return x - Math.floor(x);
  };
  const num = (v) => String(+v.toFixed(2));

  V.network = (row) => {
    const layers = row.layers || [];
    const seed = row.seed || 1;
    const W = 640;
    const H = row.height || 270;
    const first = layers[0] || {};
    const last = layers[layers.length - 1] || {};
    const x0 = first.names ? 130 : 50;
    const x1 = W - (last.names ? 130 : 50);
    const maxN = Math.max(...layers.map((l) => l.n));
    const gap = Math.min(52, (H - 70) / Math.max(1, maxN - 1));
    const midY = (H - 24) / 2;
    const pos = layers.map((l, i) => {
      const x = layers.length > 1 ? x0 + (i * (x1 - x0)) / (layers.length - 1) : (x0 + x1) / 2;
      return Array.from({ length: l.n }, (_, k) => [x, midY + (k - (l.n - 1) / 2) * gap]);
    });

    const edges = [];
    for (let i = 0; i < layers.length - 1; i++) {
      pos[i].forEach((a, p) =>
        pos[i + 1].forEach((b, q) => {
          const w = hash(i, p, q, seed) * 2 - 1;
          const strong = Math.abs(w);
          edges.push(
            S('line', {
              class: 'nn-edge ' + (w >= 0 ? 'pos' : 'neg') + (strong > 0.8 ? ' flow' : ''),
              x1: a[0],
              y1: a[1],
              x2: b[0],
              y2: b[1],
              'stroke-width': (0.5 + strong * 2.4).toFixed(2),
              'stroke-opacity': (0.18 + strong * 0.6).toFixed(2),
            })
          );
        })
      );
    }

    const nodes = [];
    const texts = [];
    layers.forEach((l, i) => {
      pos[i].forEach((p, k) => {
        const on = (l.active || []).includes(k);
        const level = on ? 1 : 0.25 + hash(i, k, 9, seed) * 0.6;
        nodes.push(S('circle', { class: 'nn-back', cx: p[0], cy: p[1], r: 11 }));
        nodes.push(S('circle', { class: 'nn-node' + (on ? ' on' : ''), cx: p[0], cy: p[1], r: 11, 'fill-opacity': level.toFixed(2) }));
        if (l.names && l.names[k] != null) {
          const isLast = i === layers.length - 1;
          texts.push(S('text', { class: 'nn-text' + (on ? ' on' : ''), x: p[0] + (isLast ? 18 : -18), y: p[1] + 4, 'text-anchor': isLast ? 'start' : 'end', text: l.names[k] }));
        }
      });
      if (l.label) texts.push(S('text', { class: 'nn-label', x: pos[i][0][0], y: H - 6, 'text-anchor': 'middle', text: l.label }));
    });

    return el('div', { class: 'nn' }, S('svg', { viewBox: `0 0 ${W} ${H}`, class: 'nn-svg', role: 'img', 'aria-label': row.ariaLabel || 'A neural network: circles in layers joined by lines' }, edges, nodes, texts));
  };

  V.neuron = (row) => {
    const ins = row.inputs || [];
    const W = 600;
    const rowH = 62;
    const H = ins.length * rowH + 30;
    const midY = H / 2 - 4;
    const total = ins.reduce((s, i) => s + i.x * i.w, 0);
    const out = Math.max(0, total);
    const shapes = [];
    const texts = [];
    ins.forEach((inp, k) => {
      const y = 28 + k * rowH + 8;
      shapes.push(S('line', { class: 'nn-edge ' + (inp.w >= 0 ? 'pos' : 'neg'), x1: 198, y1: y, x2: 396, y2: midY, 'stroke-width': (1 + Math.abs(inp.w) * 3).toFixed(2), 'stroke-opacity': 0.8 }));
      shapes.push(S('circle', { class: 'nn-node on-in', cx: 180, cy: y, r: 18 }));
      texts.push(S('text', { class: 'nn-num', x: 180, y: y + 4, 'text-anchor': 'middle', text: num(inp.x) }));
      texts.push(S('text', { class: 'nn-text', x: 154, y: y + 4, 'text-anchor': 'end', text: inp.label }));
      texts.push(S('text', { class: 'nn-weight ' + (inp.w >= 0 ? 'pos' : 'neg'), x: 262, y: y + (midY - y) * 0.3 - 6, 'text-anchor': 'middle', text: 'x ' + num(inp.w) }));
    });
    shapes.push(S('line', { class: 'nn-edge pos', x1: 432, y1: midY, x2: 500, y2: midY, 'stroke-width': 3, 'stroke-opacity': 0.85 }));
    shapes.push(S('circle', { class: 'nn-node sum', cx: 414, cy: midY, r: 28 }));
    texts.push(S('text', { class: 'nn-sigma', x: 414, y: midY + 8, 'text-anchor': 'middle', text: 'Σ' }));
    texts.push(S('text', { class: 'nn-sub', x: 414, y: midY + 48, 'text-anchor': 'middle', text: 'add up: ' + num(total) }));
    shapes.push(S('circle', { class: 'nn-node on', cx: 530, cy: midY, r: 28, 'fill-opacity': (0.2 + 0.8 * Math.min(1, out)).toFixed(2) }));
    texts.push(S('text', { class: 'nn-num big', x: 530, y: midY + 5, 'text-anchor': 'middle', text: num(out) }));
    texts.push(S('text', { class: 'nn-sub', x: 530, y: midY + 48, 'text-anchor': 'middle', text: row.result || 'passed on' }));
    const sum = ins.map((i) => `${num(i.x)} x ${num(i.w)}`).join(' + ');
    return el(
      'div',
      { class: 'nn' },
      S('svg', { viewBox: `0 0 ${W} ${H}`, class: 'nn-svg', role: 'img', 'aria-label': 'One neuron: ' + sum + ' = ' + num(total) }, shapes, texts),
      el('div', { class: 'nn-eq', text: sum + ' = ' + num(total) })
    );
  };

  V.tour = (row) => {
    const cities = row.cities || DEFAULT_CITIES;
    const scale = row.scale || 4;
    const unit = row.unit || 'km';
    const frames = (row.frames || []).map((f) => {
      const order = f.order;
      let len = 0;
      for (let i = 0; i < order.length; i++) {
        const a = cities[order[i]];
        const b = cities[order[(i + 1) % order.length]];
        len += Math.hypot(a[0] - b[0], a[1] - b[1]);
      }
      const pts = order.concat(order[0]).map((c) => cities[c].join(',')).join(' ');
      const map = S(
        'svg',
        { viewBox: '-4 -4 108 76', class: 'tour-svg', role: 'img', 'aria-label': (f.label || 'Route') + ', ' + Math.round(len * scale) + ' ' + unit },
        S('polyline', { class: 'tour-line', points: pts }),
        cities.map((c, i) => S('circle', { class: 'tour-city' + (i === order[0] ? ' home' : ''), cx: c[0], cy: c[1], r: i === order[0] ? 3.2 : 2.2 }))
      );
      return el('figure', { class: 'tour-frame ' + tone(f.tone) }, map, el('strong', { text: f.label || '' }), el('span', { text: f.sub || Math.round(len * scale).toLocaleString('en-US') + ' ' + unit }));
    });
    return el('div', { class: 'tour' + (frames.length > 3 ? ' many' : '') }, frames);
  };

  V.genes = (row) =>
    el(
      'div',
      { class: 'vz-genes' },
      (row.rows || []).map((r) =>
        r.arrow
          ? el('div', { class: 'vz-gene-arrow', text: r.arrow })
          : el(
              'div',
              { class: 'vz-gene-row' },
              el('span', { class: 'vz-gene-label', text: r.label || '' }),
              el(
                'div',
                { class: 'vz-gene-cells' },
                (r.genes || []).map((g) => {
                  const o = typeof g === 'string' ? { t: g } : g;
                  return el('span', { class: 'vz-gene ' + tone(o.tone || r.tone) + (o.mark ? ' mark' : ''), text: o.t });
                })
              )
            )
      )
    );
})(window.TL);
