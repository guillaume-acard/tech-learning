window.TL = window.TL || {};

// worldmap viz: a simplified world map with submarine cable routes.
//   { viz:'worldmap', groups:['atlantic','pacific',...], focus:'pacific', labels:true }
// groups defaults to the five modern ones. focus draws that group bold and fades the others.
// Group ids: atlantic pacific eurasia africa asia telegraph tat8 (see js/engine/worldmap-routes.js).
(function (TL) {
  const S = TL.svg;
  const el = TL.el;
  const DEFAULT_GROUPS = ['atlantic', 'pacific', 'eurasia', 'africa', 'asia'];
  const X = (lon) => lon + 180;
  const Y = (lat) => 80 - lat;
  const f = (n) => Math.round(n * 10) / 10;
  const wrap = (lon) => (lon >= 180 ? lon - 360 : lon);

  const ring = (r) => r.map((p) => f(X(p[0])) + ',' + f(Y(p[1]))).join(' ');

  function curve(pts) {
    const P = pts.map((p) => [X(p[0]), Y(p[1])]);
    let d = 'M' + f(P[0][0]) + ' ' + f(P[0][1]);
    for (let i = 0; i < P.length - 1; i++) {
      const p0 = P[i - 1] || P[i];
      const p1 = P[i];
      const p2 = P[i + 1];
      const p3 = P[i + 2] || p2;
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ' C' + [c1, c2, p2].map((q) => f(q[0]) + ' ' + f(q[1])).join(' ');
    }
    return d;
  }

  const ANCHOR = { l: ['end', -2.2, 1.6], r: ['start', 2.2, 1.6], t: ['middle', 0, -2.2], b: ['middle', 0, 4.6] };

  TL.visuals.worldmap = (row) => {
    const groups = row.groups || DEFAULT_GROUPS;
    const focus = row.focus || null;
    const routes = TL.worldRoutes.filter((r) => groups.includes(r.g));
    const svg = S('svg', { viewBox: '0 0 360 140', class: 'wm-svg', role: 'img', 'aria-label': row.ariaLabel || 'World map with cable routes' });
    svg.append(S('rect', { x: 0, y: 0, width: 360, height: 140, class: 'wm-sea' }));
    for (let lon = -150; lon <= 150; lon += 30) svg.append(S('line', { x1: X(lon), y1: 0, x2: X(lon), y2: 140, class: 'wm-grid' }));
    for (let lat = -30; lat <= 60; lat += 30) svg.append(S('line', { x1: 0, y1: Y(lat), x2: 360, y2: Y(lat), class: 'wm-grid' }));
    TL.worldLand.forEach((r) => svg.append(S('polygon', { points: ring(r), class: 'wm-land' })));
    TL.worldSeas.forEach((r) => svg.append(S('polygon', { points: ring(r), class: 'wm-sea-in' })));

    const drawn = routes.slice().sort((a, b) => (a.g === focus) - (b.g === focus));
    drawn.forEach((r) => {
      const cls = 'wm-cable tone-' + TL.worldGroups[r.g].tone + (r.land ? ' land' : '') + (focus ? (r.g === focus ? ' focus' : ' faded') : '');
      const d = curve(r.pts);
      svg.append(S('path', { d, class: cls }));
      if (r.pts.some((p) => p[0] > 180)) svg.append(S('path', { d, class: cls, transform: 'translate(-360,0)' }));
    });

    const seen = new Set();
    drawn.forEach((r) => r.ends.forEach((k) => seen.add(k)));
    const labels = row.labels !== false;
    seen.forEach((k) => {
      const h = TL.worldHubs[k];
      const x = X(wrap(h.p[0]));
      const y = Y(h.p[1]);
      svg.append(S('circle', { cx: f(x), cy: f(y), r: 1.4, class: 'wm-hub' }));
      if (labels && h.n) {
        const a = ANCHOR[h.side || 'r'];
        svg.append(S('text', { x: f(x + a[1]), y: f(y + a[2]), 'text-anchor': a[0], class: 'wm-label' }, h.n));
      }
    });

    const keys = groups.map((g) => TL.worldGroups[g]).filter(Boolean);
    const legend = el(
      'div',
      { class: 'vz-legend' },
      keys.map((g) => el('span', { class: 'vz-key tone-' + g.tone }, el('i'), g.label))
    );
    return el('div', { class: 'wm' }, svg, keys.length > 1 ? legend : null);
  };
})(window.TL);
