window.TL = window.TL || {};

// Extra visuals for the physics lessons (same `cards` format as js/engine/visuals.js):
//  wave      waves:[{ label, cycles:3, amp?:30, tone, kind?:'plain'|'am'|'fm', bits?:'1011' }], annotate?:true
//            Sine waves. annotate marks the wavelength and the height on the first wave. am/fm waves carry the given bits.
//  spectrum  highlight?:[1]   The electromagnetic spectrum as a row of bands, long waves on the left. highlight lights bands up.
//  hop       rows?:12, slots?:12, wifi?:[from,to], hops:[3,9,...], fixed?:false
//            Channels (rows) over time (columns). Orange stripe = a wi-fi channel, dots = a Bluetooth link; red = lost.
//  field     diagram:'bar'|'wire'|'coil', on?:true, core?:false
//            Magnetic field drawn around a bar magnet, a wire with current coming out of the page, or a coil.
(function (TL) {
  const el = TL.el;
  const S = TL.svg;
  const V = (TL.visuals = TL.visuals || {});
  const tone = (t) => 'tone-' + (t || 'cyan');
  const f1 = (n) => +n.toFixed(1);

  V.wave = (row) => {
    const waves = row.waves || [];
    const W = 640;
    const X0 = 40;
    const X1 = 600;
    const span = X1 - X0;
    const bandH = 112;
    const H = waves.length * bandH + 8;
    const kids = [];
    waves.forEach((w, i) => {
      const mid = i * bandH + bandH / 2 + 8;
      const amp = w.amp || 30;
      const pts = [];
      const bits = w.bits ? String(w.bits) : '';
      const seg = bits ? span / bits.length : span;
      let phase = 0;
      const N = 360;
      for (let k = 0; k <= N; k++) {
        const x = X0 + (span * k) / N;
        let a = amp;
        let cyc = w.cycles || 3;
        if (bits && w.kind === 'am') {
          a = bits[Math.min(bits.length - 1, Math.floor((x - X0) / seg))] === '1' ? amp : amp * 0.3;
          cyc = (w.cycles || 12) / bits.length;
          phase = (2 * Math.PI * cyc * (x - X0)) / seg;
        } else if (bits && w.kind === 'fm') {
          const one = bits[Math.min(bits.length - 1, Math.floor((x - X0) / seg))] === '1';
          cyc = one ? 5 : 2.5;
          phase += (2 * Math.PI * cyc) / seg * (span / N);
        } else {
          phase = (2 * Math.PI * cyc * (x - X0)) / span;
        }
        pts.push(`${f1(x)},${f1(mid - a * Math.sin(phase))}`);
      }
      kids.push(S('line', { class: 'pv-axis', x1: X0, y1: mid, x2: X1, y2: mid }));
      const annotated = row.annotate && i === 0 && !bits;
      if (w.label) {
        kids.push(S('text', { class: 'pv-label ' + tone(w.tone), x: annotated ? X1 : X0, y: mid - amp - 14, 'text-anchor': annotated ? 'end' : null, text: w.label }));
      }
      if (bits) {
        [...bits].forEach((b, k) => {
          const cx = X0 + seg * k + seg / 2;
          kids.push(S('text', { class: 'pv-bit', x: cx, y: mid + amp + 22, 'text-anchor': 'middle', text: b }));
          if (k) kids.push(S('line', { class: 'pv-sep', x1: X0 + seg * k, y1: mid - amp - 6, x2: X0 + seg * k, y2: mid + amp + 6 }));
        });
      }
      kids.push(S('polyline', { class: 'pv-wave ' + tone(w.tone), points: pts.join(' ') }));
      if (row.annotate && i === 0 && !bits) {
        const cyc = w.cycles || 3;
        const wl = span / cyc;
        const c1 = X0 + wl / 4;
        const c2 = c1 + wl;
        const y = mid - amp - 6;
        kids.push(S('line', { class: 'pv-dim', x1: c1, y1: y, x2: c2, y2: y }));
        kids.push(S('line', { class: 'pv-dim', x1: c1, y1: y - 4, x2: c1, y2: y + 4 }));
        kids.push(S('line', { class: 'pv-dim', x1: c2, y1: y - 4, x2: c2, y2: y + 4 }));
        kids.push(S('text', { class: 'pv-dimtext', x: (c1 + c2) / 2, y: y - 6, 'text-anchor': 'middle', text: 'one wavelength' }));
        const ax = X0 - 14;
        kids.push(S('line', { class: 'pv-dim', x1: ax, y1: mid, x2: ax, y2: mid - amp }));
        kids.push(S('line', { class: 'pv-dim', x1: ax - 4, y1: mid - amp, x2: ax + 4, y2: mid - amp }));
        kids.push(S('text', { class: 'pv-dimtext', x: ax - 6, y: mid - amp / 2 + 3, 'text-anchor': 'end', text: 'height' }));
      }
    });
    return el('div', { class: 'pv' }, S('svg', { viewBox: `-30 0 ${W + 30} ${H}`, class: 'pv-svg', role: 'img', 'aria-label': row.ariaLabel || 'Waves drawn as smooth curves' }, kids));
  };

  const BANDS = [
    { name: 'Radio', sub: 'metres to km', use: 'FM, TV, mobile', tone: 'cyan' },
    { name: 'Microwaves', sub: 'centimetres', use: 'wi-fi, Bluetooth, oven', tone: 'cyan' },
    { name: 'Infrared', sub: 'micrometres', use: 'heat, remotes', tone: 'red' },
    { name: 'Visible light', sub: '400-700 nm', use: 'what we see', tone: 'green', visible: true },
    { name: 'Ultraviolet', sub: 'tens of nm', use: 'sunburn', tone: 'violet' },
    { name: 'X-rays', sub: 'under 10 nm', use: 'hospital scans', tone: 'violet' },
    { name: 'Gamma rays', sub: 'tiny', use: 'space, nuclear', tone: 'violet' },
  ];

  V.spectrum = (row) => {
    const hi = new Set(row.highlight || []);
    const bands = BANDS.map((b, i) =>
      el(
        'div',
        { class: 'sp-band ' + tone(b.tone) + (b.visible ? ' visible' : '') + (hi.has(i) ? ' hi' : '') },
        el('strong', { text: b.name }),
        el('span', { class: 'sp-sub', text: b.sub }),
        el('span', { class: 'sp-use', text: b.use })
      )
    );
    return el(
      'div',
      { class: 'sp' },
      el('div', { class: 'sp-bands' }, bands),
      el('div', { class: 'sp-axis' }, el('span', { text: '← longer waves, lower frequency' }), el('span', { text: 'shorter waves, higher frequency →' }))
    );
  };

  V.hop = (row) => {
    const rows = row.rows || 12;
    const slots = row.slots || 12;
    const cw = 40;
    const ch = 17;
    const X0 = 48;
    const W = X0 + slots * cw + 12;
    const H = rows * ch + 34;
    const wifi = row.wifi || null;
    const kids = [];
    for (let r = 0; r <= rows; r++) kids.push(S('line', { class: 'pv-grid', x1: X0, y1: r * ch + 4, x2: X0 + slots * cw, y2: r * ch + 4 }));
    for (let c = 0; c <= slots; c++) kids.push(S('line', { class: 'pv-grid', x1: X0 + c * cw, y1: 4, x2: X0 + c * cw, y2: rows * ch + 4 }));
    if (wifi) {
      kids.push(S('rect', { class: 'pv-wifi', x: X0, y: wifi[0] * ch + 4, width: slots * cw, height: (wifi[1] - wifi[0] + 1) * ch }));
      kids.push(S('text', { class: 'pv-wifitext', x: X0 + 6, y: wifi[0] * ch + 4 + 13, text: 'wi-fi channel' }));
    }
    (row.hops || []).slice(0, slots).forEach((ch0, c) => {
      const inWifi = wifi && ch0 >= wifi[0] && ch0 <= wifi[1];
      kids.push(S('rect', { class: 'pv-hop' + (inWifi ? ' lost' : ''), x: X0 + c * cw + 6, y: ch0 * ch + 6, width: cw - 12, height: ch - 4, rx: 3 }));
    });
    kids.push(S('text', { class: 'pv-axistext', x: X0 + (slots * cw) / 2, y: H - 6, 'text-anchor': 'middle', text: 'time →' }));
    kids.push(S('text', { class: 'pv-axistext', x: 12, y: (rows * ch) / 2 + 4, 'text-anchor': 'middle', transform: `rotate(-90 12 ${(rows * ch) / 2 + 4})`, text: 'frequency →' }));
    return el('div', { class: 'pv' }, S('svg', { viewBox: `0 0 ${W} ${H}`, class: 'pv-svg hop', role: 'img', 'aria-label': 'A grid of channels over time showing where the Bluetooth link sits' }, kids));
  };

  const arrow = (x, y, dir) => {
    const dx = dir === 'left' ? -1 : dir === 'right' ? 1 : 0;
    const dy = dir === 'up' ? -1 : dir === 'down' ? 1 : 0;
    const bx = x - 4 * dx;
    const by = y - 4 * dy;
    const pts = [[x + 6 * dx, y + 6 * dy], [bx - 5 * dy, by + 5 * dx], [bx + 5 * dy, by - 5 * dx]];
    return S('polygon', { class: 'fld-arrow', points: pts.map((p) => `${f1(p[0])},${f1(p[1])}`).join(' ') });
  };

  const fieldLoops = (xr, xl, yc, spread, on) => {
    const out = [];
    for (let k = 1; k <= 3; k++) {
      [-1, 1].forEach((s) => {
        const y0 = yc + s * 8 * (k - 1);
        const yk = yc + s * (30 + 36 * k);
        out.push(S('path', { class: 'fld-line' + (on ? '' : ' off'), d: `M ${xr} ${y0} C ${xr + 34 + spread * k} ${yk}, ${xl - 34 - spread * k} ${yk}, ${xl} ${y0}` }));
        if (on) out.push(arrow(f1((xr + xl) / 2), f1(0.25 * y0 + 0.75 * yk), 'left'));
      });
    }
    return out;
  };

  V.field = (row) => {
    const kind = row.diagram || 'bar';
    const on = row.on !== false;
    const kids = [];
    const W = 360;
    const H = 210;
    if (kind === 'wire') {
      [34, 58, 82].forEach((r) => kids.push(S('circle', { class: 'fld-line', cx: 180, cy: 105, r })));
      [34, 58, 82].forEach((r) => kids.push(arrow(180, 105 - r, 'left')));
      kids.push(S('circle', { class: 'fld-wire', cx: 180, cy: 105, r: 13 }));
      kids.push(S('circle', { class: 'fld-dot', cx: 180, cy: 105, r: 3.5 }));
      kids.push(S('line', { class: 'fld-needle', x1: 238, y1: 112, x2: 238, y2: 98 }));
      kids.push(S('line', { class: 'fld-needle n', x1: 238, y1: 98, x2: 238, y2: 92 }));
      kids.push(S('circle', { class: 'fld-compass', cx: 238, cy: 105, r: 11 }));
      kids.push(S('text', { class: 'fld-text', x: 180, y: 204, 'text-anchor': 'middle', text: 'current comes out of the page' }));
    } else {
      const xl = 120;
      const xr = 240;
      kids.push(...fieldLoops(xr, xl, 105, 26, on));
      if (kind === 'bar') {
        kids.push(S('rect', { class: 'fld-s', x: xl, y: 90, width: 60, height: 30 }));
        kids.push(S('rect', { class: 'fld-n', x: xl + 60, y: 90, width: 60, height: 30 }));
        kids.push(S('text', { class: 'fld-pole', x: xl + 30, y: 111, 'text-anchor': 'middle', text: 'S' }));
        kids.push(S('text', { class: 'fld-pole', x: xl + 90, y: 111, 'text-anchor': 'middle', text: 'N' }));
      } else {
        if (row.core) kids.push(S('rect', { class: 'fld-core', x: xl + 6, y: 96, width: 108, height: 18, rx: 2 }));
        for (let i = 0; i < 7; i++) kids.push(S('ellipse', { class: 'fld-coil' + (on ? ' on' : ''), cx: xl + 12 + i * 16, cy: 105, rx: 5, ry: 24 }));
        kids.push(S('path', { class: 'fld-lead', d: `M ${xl + 12} 129 L ${xl + 12} 178 L 40 178` }));
        kids.push(S('path', { class: 'fld-lead', d: `M ${xl + 108} 129 L ${xl + 108} 178 L 320 178` }));
        if (on) {
          kids.push(S('text', { class: 'fld-pole s', x: xl - 10, y: 109, 'text-anchor': 'end', text: 'S' }));
          kids.push(S('text', { class: 'fld-pole n', x: xr + 10, y: 109, 'text-anchor': 'start', text: 'N' }));
        }
      }
    }
    return el('div', { class: 'pv' }, S('svg', { viewBox: `0 0 ${W} ${H}`, class: 'pv-svg field', role: 'img', 'aria-label': row.ariaLabel || 'Magnetic field lines' }, kids));
  };
})(window.TL);
