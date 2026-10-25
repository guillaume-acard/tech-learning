window.TL = window.TL || {};

// Extra visuals for the hardware and software lessons (same `cards` format as js/engine/visuals.js):
//  split     left:{ title, sub?, tone, items:[{ t, sub?, icon? }] }, right:{ ...same }
//            Two columns separated by a vertical line, e.g. physical things on the left, virtual things on the right.
//            icon is a name from TL.icons (js/engine/icons.js).
//  computer  machines:[{ screen:'game'|'browser', t, sub? }], arrow?:'▲ both run on', hardware?:{ t, sub? }
//            One or more monitors drawn with a program on screen, a label under each, and a bar for the shared hardware.
(function (TL) {
  const el = TL.el;
  const S = TL.svg;
  const V = (TL.visuals = TL.visuals || {});
  const tone = (t) => 'tone-' + (t || 'cyan');
  const rect = (cls, x, y, w, h, rx) => S('rect', { class: cls, x, y, width: w, height: h, rx: rx || 0 });
  const path = (cls, d) => S('path', { class: cls, d });

  V.split = (row) => {
    const side = (spec) =>
      el(
        'div',
        { class: 'vz-side ' + tone(spec.tone) },
        el('div', { class: 'vz-side-head' }, el('strong', { text: spec.title }), spec.sub ? el('span', { text: spec.sub }) : null),
        (spec.items || []).map((it) =>
          el('div', { class: 'vz-side-item' }, it.icon ? TL.iconSvg(it.icon, 34) : null, el('div', {}, el('b', { text: it.t }), it.sub ? el('span', { text: it.sub }) : null))
        )
      );
    return el('div', { class: 'vz-split' }, side(row.left), el('div', { class: 'vz-split-line', 'aria-hidden': 'true' }), side(row.right));
  };

  // Screen contents are drawn inside the 204 x 124 area starting at (18, 14).
  function gameScreen() {
    const out = [];
    [[30, 40], [196, 30], [72, 112], [168, 98]].forEach(([x, y]) => out.push(S('circle', { class: 'pc-dim-fill', cx: x, cy: y, r: 1.2 })));
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 6; c++) out.push(rect('pc-fill' + (r === 1 ? ' soft' : ''), 46 + c * 26, 26 + r * 20, 14, 10, 2));
    }
    out.push(S('path', { class: 'pc-bullet', d: 'M120 92 V106' }));
    out.push(rect('pc-fill', 106, 118, 28, 8, 2), rect('pc-fill', 116, 111, 8, 8, 1));
    out.push(S('path', { class: 'pc-dim', d: 'M26 130 H214' }));
    return out;
  }

  function browserScreen() {
    const lines = [[104, 70, 100], [104, 80, 88], [104, 90, 96], [104, 100, 70], [104, 110, 92], [104, 120, 60]];
    return [
      rect('pc-tabbar', 18, 14, 204, 16),
      rect('pc-sw', 24, 17, 58, 13, 3),
      rect('pc-sw dim', 26, 37, 188, 12, 6),
      S('text', { class: 'pc-text', x: 36, y: 46 }, 'example.com'),
      rect('pc-fill', 30, 58, 80, 8, 2),
      rect('pc-sw', 30, 74, 64, 52, 3),
      S('path', { class: 'pc-sw', d: 'M30 118 L52 98 L66 112 L76 104 L94 120' }),
      S('circle', { class: 'pc-sw', cx: 44, cy: 86, r: 4 }),
      lines.map(([x, y, w]) => S('path', { class: 'pc-line', d: `M${x} ${y} h${w}` })),
    ];
  }

  const SCREENS = { game: gameScreen, browser: browserScreen };

  function monitor(kind) {
    const draw = SCREENS[kind];
    if (!draw) throw new Error('Unknown computer screen "' + kind + '"');
    return S(
      'svg',
      { class: 'vz-pc', viewBox: '0 0 240 184', role: 'img', 'aria-label': 'A computer screen running ' + kind },
      rect('pc-hw', 10, 6, 220, 140, 8),
      rect('pc-screen', 18, 14, 204, 124, 3),
      draw(),
      path('pc-hw', 'M108 146 L104 166 H136 L132 146'),
      path('pc-hw', 'M84 170 H156')
    );
  }

  V.computer = (row) =>
    el(
      'div',
      { class: 'vz-pcs' },
      el(
        'div',
        { class: 'vz-machines' },
        (row.machines || []).map((m) =>
          el('div', { class: 'vz-machine' }, monitor(m.screen), el('div', { class: 'vz-machine-label tone-violet' }, el('strong', { text: m.t }), m.sub ? el('span', { text: m.sub }) : null))
        )
      ),
      row.hardware ? el('div', { class: 'vz-uses', text: row.arrow || '▲ run on' }) : null,
      row.hardware ? el('div', { class: 'vz-hwbar tone-green' }, el('strong', { text: row.hardware.t }), row.hardware.sub ? el('span', { text: row.hardware.sub }) : null) : null
    );
})(window.TL);
