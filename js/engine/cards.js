window.TL = window.TL || {};

(function (TL) {
  const el = TL.el;

  function cssVar(name, fallback) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name);
    return (v && v.trim()) || fallback;
  }

  function toneColor(tone) {
    const map = {
      cyan: cssVar('--cyan', '#38e8ff'),
      amber: cssVar('--amber', '#ffa31a'),
      green: cssVar('--green', '#39ff88'),
      violet: cssVar('--violet', '#c084fc'),
      red: cssVar('--red', '#ff4d6d'),
      dim: cssVar('--muted', '#94a3b8'),
    };
    return map[tone] || map.cyan;
  }

  // Shared between steps so the cloud keeps the angle the learner rotated it to.
  const view3d = { yaw: -0.65, pitch: 0.32, spin: null };

  const dist3 = (a, b) => Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);

  // A rotatable 3D scatter plot: points are chunk vectors, the query is a red marker,
  // and lines show the distance from the query to each point.
  function drawVectorViz3D(canvas, cfg, controls) {
    const w = cfg.width || 640;
    const h = cfg.height || 400;
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const C = {
      bg: cssVar('--panel', 'rgba(6, 11, 20, 0.9)'),
      line: cssVar('--line', '#1e3550'),
      ink: cssVar('--ink', '#e2e8f0'),
      muted: cssVar('--muted', '#94a3b8'),
      cyanDim: cssVar('--cyan-dim', '#1b8aa0'),
      green: toneColor('green'),
      amber: toneColor('amber'),
      red: toneColor('red'),
    };
    const FONT = '12px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
    const D = 3.4;
    const S = Math.min(w, h) * 0.3;
    const cx = w / 2;
    const cy = h / 2 + 6;
    const hitSet = new Set(cfg.hits || []);
    const points = cfg.points || [];
    const q = cfg.query || null;

    let dirty = true;

    function project(p) {
      const cyw = Math.cos(view3d.yaw), syw = Math.sin(view3d.yaw);
      const cp = Math.cos(view3d.pitch), sp = Math.sin(view3d.pitch);
      const x1 = p.x * cyw + p.z * syw;
      const z1 = -p.x * syw + p.z * cyw;
      const y2 = p.y * cp - z1 * sp;
      const z2 = p.y * sp + z1 * cp;
      const k = D / (D + z2);
      return { x: cx + x1 * k * S, y: cy - y2 * k * S, k, z: z2, near: Math.max(0, Math.min(1, (1.7 - z2) / 3.4)) };
    }

    function seg(a, b, style, width, dash) {
      const pa = project(a), pb = project(b);
      ctx.strokeStyle = style;
      ctx.lineWidth = width;
      ctx.setLineDash(dash || []);
      ctx.beginPath();
      ctx.moveTo(pa.x, pa.y);
      ctx.lineTo(pb.x, pb.y);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    function label(text, x, y, color) {
      ctx.font = FONT;
      ctx.textBaseline = 'middle';
      const tw = ctx.measureText(text).width;
      let tx = x + 10;
      if (tx + tw > w - 6) tx = x - tw - 10;
      if (tx < 6) tx = 6;
      ctx.fillStyle = 'rgba(6, 11, 20, 0.75)';
      ctx.fillRect(tx - 3, y - 9, tw + 6, 18);
      ctx.fillStyle = color;
      ctx.fillText(text, tx, y);
    }

    function circle3(center, r, plane) {
      const n = 48;
      ctx.beginPath();
      for (let i = 0; i <= n; i++) {
        const a = (i / n) * Math.PI * 2;
        const c = Math.cos(a) * r, s = Math.sin(a) * r;
        const p = project({
          x: center.x + (plane === 'yz' ? 0 : c),
          y: center.y + (plane === 'xz' ? 0 : plane === 'yz' ? c : s),
          z: center.z + (plane === 'xy' ? 0 : s),
        });
        if (i) ctx.lineTo(p.x, p.y);
        else ctx.moveTo(p.x, p.y);
      }
      ctx.stroke();
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, w, h);

      // floor grid + bounding box give the depth cues
      ctx.globalAlpha = 0.55;
      for (let i = -1; i <= 1.001; i += 0.5) {
        seg({ x: i, y: -1, z: -1 }, { x: i, y: -1, z: 1 }, C.line, 1);
        seg({ x: -1, y: -1, z: i }, { x: 1, y: -1, z: i }, C.line, 1);
      }
      [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([x, z]) => seg({ x, y: -1, z }, { x, y: 1, z }, C.line, 1));
      ctx.globalAlpha = 1;
      seg({ x: -1, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }, C.cyanDim, 1.5);
      seg({ x: 0, y: -1, z: 0 }, { x: 0, y: 1, z: 0 }, C.cyanDim, 1.5);
      seg({ x: 0, y: 0, z: -1 }, { x: 0, y: 0, z: 1 }, C.cyanDim, 1.5);

      // Optional axis names, e.g. axes:[{ name:'Size', low:'small', high:'big' }, ...] for x, y, z.
      const axisLabels = [];
      (cfg.axes || []).forEach((ax, i) => {
        if (!ax) return;
        const dir = [{ x: 1, y: 0, z: 0 }, { x: 0, y: 1, z: 0 }, { x: 0, y: 0, z: 1 }][i];
        if (!dir) return;
        const at = (s, text) => axisLabels.push({ text, p: project({ x: dir.x * 1.1 * s, y: dir.y * 1.1 * s, z: dir.z * 1.1 * s }) });
        at(1, ax.high ? `${ax.name}: ${ax.high}` : ax.name);
        if (ax.low) at(-1, `${ax.name}: ${ax.low}`);
      });

      const items = points.map((p) => ({ p, pr: project(p) }));
      let qp = null;

      if (q) {
        qp = project(q);
        seg({ x: 0, y: 0, z: 0 }, q, 'rgba(255, 77, 109, 0.45)', 1.5, [4, 4]);
        if (cfg.radius) {
          ctx.strokeStyle = 'rgba(57, 255, 136, 0.35)';
          ctx.lineWidth = 1.5;
          ['xy', 'xz', 'yz'].forEach((pl) => circle3(q, cfg.radius, pl));
        }
        if (cfg.distances) {
          items.forEach(({ p }) => {
            const hit = hitSet.has(p.id);
            seg(q, p, hit ? C.green : 'rgba(127, 149, 173, 0.55)', hit ? 3 : 1.5, hit ? [] : [5, 5]);
          });
        }
      }

      items.sort((a, b) => b.pr.z - a.pr.z);
      items.forEach(({ p, pr }) => {
        const hit = hitSet.has(p.id);
        const col = hit ? C.green : toneColor(p.tone || 'cyan');
        const r = (hit ? 8 : 6.5) * pr.k;
        ctx.globalAlpha = 0.5 + 0.5 * pr.near;
        // drop line to the floor so the height of each point is readable
        const fl = project({ x: p.x, y: -1, z: p.z });
        ctx.strokeStyle = C.line;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pr.x, pr.y);
        ctx.lineTo(fl.x, fl.y);
        ctx.stroke();
        ctx.fillStyle = hit ? 'rgba(57, 255, 136, 0.3)' : 'rgba(56, 232, 255, 0.14)';
        ctx.strokeStyle = col;
        ctx.lineWidth = hit ? 3 : 2;
        ctx.beginPath();
        ctx.arc(pr.x, pr.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.globalAlpha = 1;
        if (p.label) label(p.label, pr.x + r, pr.y - 12, hit ? C.green : C.ink);
      });

      if (q && qp) {
        const r = 8 * qp.k;
        ctx.fillStyle = 'rgba(255, 77, 109, 0.25)';
        ctx.strokeStyle = C.red;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(qp.x, qp.y - r - 3);
        ctx.lineTo(qp.x + r + 3, qp.y);
        ctx.lineTo(qp.x, qp.y + r + 3);
        ctx.lineTo(qp.x - r - 3, qp.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        label(q.label || 'Query', qp.x + r, qp.y + 16, C.red);
        if (cfg.distances) {
          points.forEach((p) => {
            const mid = project({ x: (p.x + q.x) / 2, y: (p.y + q.y) / 2, z: (p.z + q.z) / 2 });
            label(dist3(p, q).toFixed(2), mid.x - 10, mid.y, hitSet.has(p.id) ? C.green : C.muted);
          });
        }
      }

      axisLabels.forEach((a) => label(a.text, a.p.x - 10, a.p.y, C.amber));

      if (cfg.note) {
        ctx.font = '12px system-ui, -apple-system, Segoe UI, Roboto, Arial';
        ctx.fillStyle = C.muted;
        ctx.textBaseline = 'alphabetic';
        ctx.fillText(cfg.note, 12, h - 10);
      }
    }

    let last = 0;
    function frame(t) {
      if (!canvas.isConnected) return;
      if (view3d.spin && !controls.dragging) {
        view3d.yaw += (t - (last || t)) * 0.00022;
        dirty = true;
      }
      last = t;
      if (dirty) {
        dirty = false;
        draw();
      }
      requestAnimationFrame(frame);
    }

    let lx = 0, ly = 0;
    canvas.addEventListener('pointerdown', (e) => {
      controls.dragging = true;
      lx = e.clientX;
      ly = e.clientY;
      canvas.setPointerCapture(e.pointerId);
    });
    canvas.addEventListener('pointermove', (e) => {
      if (!controls.dragging) return;
      view3d.yaw += (e.clientX - lx) * 0.01;
      view3d.pitch = Math.max(-1.2, Math.min(1.2, view3d.pitch + (e.clientY - ly) * 0.01));
      lx = e.clientX;
      ly = e.clientY;
      dirty = true;
    });
    const stop = () => (controls.dragging = false);
    canvas.addEventListener('pointerup', stop);
    canvas.addEventListener('pointercancel', stop);

    requestAnimationFrame(frame);
  }

  function renderViz(container, row) {
    const title = row.title ? el('div', { class: 'viz-title', text: row.title }) : null;
    const subtitle = row.subtitle ? el('div', { class: 'viz-sub', text: row.subtitle }) : null;

    if (row.viz === 'vectors3d') {
      const canvas = el('canvas', { class: 'viz-canvas grab', role: 'img', 'aria-label': row.ariaLabel || '3D view of vectors as points in space' });
      const spinBtn = el('button', { class: 'btn small ghost', type: 'button' });
      const syncSpin = () => (spinBtn.textContent = view3d.spin ? 'Stop spinning' : 'Spin');
      spinBtn.addEventListener('click', () => {
        view3d.spin = !view3d.spin;
        syncSpin();
      });
      view3d.spin = view3d.spin === null ? !TL.reducedMotion() : view3d.spin;
      syncSpin();
      // Draw after it is in the DOM so CSS vars resolve.
      setTimeout(() => drawVectorViz3D(canvas, row, { dragging: false }), 0);
      return el(
        'div',
        { class: 'viz viz-vectors' },
        title,
        subtitle,
        canvas,
        el('div', { class: 'viz-tools' }, el('span', { class: 'viz-hint', text: 'Drag the picture to rotate it.' }), spinBtn)
      );
    }

    if (TL.visuals && TL.visuals[row.viz]) {
      const body = TL.visuals[row.viz](row);
      return el('div', { class: 'viz viz-' + row.viz, role: 'group', 'aria-label': row.ariaLabel || row.title || 'Illustration' }, title, subtitle, body, row.note ? el('div', { class: 'viz-note', text: row.note }) : null);
    }

    return el('div', { class: 'viz' }, title, subtitle, el('div', { class: 'viz-fallback', text: 'Visualization not supported.' }));
  }

  // Labelled text blocks, e.g. a document cut into chunks or a prompt sent to an LLM.
  // item: { group, label, text, sub, tag, tone }
  function renderBlocks(row) {
    const kids = [];
    let group = null;
    (row.items || []).forEach((it) => {
      if (it.group && it.group !== group) {
        group = it.group;
        kids.push(el('div', { class: 'blk-group', text: group }));
      }
      kids.push(
        el(
          'div',
          { class: `blk tone-${it.tone || 'cyan'}` },
          el('div', { class: 'blk-head' }, el('span', { class: 'blk-label', text: it.label || '' }), it.tag ? el('span', { class: 'blk-tag', text: it.tag }) : null),
          el('div', { class: 'blk-text', text: it.text }),
          it.sub ? el('div', { class: 'blk-sub', text: it.sub }) : null
        )
      );
    });
    return el(
      'div',
      { class: 'viz viz-blocks' },
      row.title ? el('div', { class: 'viz-title', text: row.title }) : null,
      row.subtitle ? el('div', { class: 'viz-sub', text: row.subtitle }) : null,
      kids
    );
  }

  // Left-hand panel next to the scene: a code file with the running line marked, plus memory tables.
  // code: { file, lines: ['Add 3', ...], active: 1-based line or 0, note }
  // memory: one table or an array of tables: { title, cells: [{ addr, value, label, tone, changed, active }] }
  TL.renderSide = function (container, spec) {
    TL.clear(container);
    const { code, memory } = spec || {};
    const tables = Array.isArray(memory) ? memory : memory ? [memory] : [];
    container.hidden = !code && !tables.length;
    if (container.hidden) return;

    if (code) {
      const active = code.active || 0;
      container.append(
        el(
          'div',
          { class: 'side-box file' },
          el('div', { class: 'side-head', text: code.file || 'program' }),
          el(
            'ol',
            { class: 'file-lines' },
            (code.lines || []).map((src, idx) => {
              const n = idx + 1;
              const state = n === active ? ' active' : active && n < active ? ' done' : '';
              return el(
                'li',
                { class: 'file-line' + state, 'aria-current': n === active ? 'step' : false },
                el('span', { class: 'ln', text: n === active ? '>' : String(n) }),
                el('span', { class: 'src', text: src })
              );
            })
          ),
          code.note ? el('p', { class: 'file-note', text: code.note }) : null
        )
      );
    }

    tables.forEach((t) => {
      container.append(
        el(
          'div',
          { class: 'side-box mem' },
          el('div', { class: 'side-head', text: t.title || 'Memory' }),
          (t.cells || []).map((c) =>
            el(
              'div',
              { class: `mem-cell tone-${c.tone || 'cyan'}` + (c.changed ? ' changed' : '') + (c.active ? ' active' : '') },
              el('span', { class: 'mem-addr', text: c.addr != null ? String(c.addr) : '' }),
              el('span', { class: 'mem-val', text: String(c.value) }),
              c.label ? el('span', { class: 'mem-label', text: c.label }) : null
            )
          )
        )
      );
    });
  };

  // Rows of big labelled tiles for lessons about text and numbers (URLs, primes, keys).
  // A row can be:
  // - An array of items: { t, sub, tone, icon? } for a tile (icon = a name from TL.icons) or { op } for a symbol between tiles.
  // - A visualization object: { kind:'viz', viz:'vectors3d', ... } or { kind:'blocks', items:[...] }
  TL.renderCards = function (container, cards) {
    TL.clear(container);

    const rows = Array.isArray(cards) ? cards : cards ? [cards] : [];
    container.hidden = !rows.length;

    rows.forEach((row) => {
      if (row && row.kind === 'viz') {
        container.append(renderViz(container, row));
        return;
      }
      if (row && row.kind === 'blocks') {
        container.append(renderBlocks(row));
        return;
      }

      const items = Array.isArray(row) ? row : [];
      container.append(
        el(
          'div',
          { class: 'card-row' },
          items.map((it) =>
            it.op != null
              ? el('div', { class: 'cx-op', text: it.op })
              : el(
                  'div',
                  { class: `cx tone-${it.tone || 'cyan'}` + (it.icon ? ' has-icon' : '') },
                  it.icon ? TL.iconSvg(it.icon, 44) : null,
                  el('div', { class: 'cx-t', text: it.t }),
                  it.sub ? el('div', { class: 'cx-sub', text: it.sub }) : null
                )
          )
        )
      );
    });
  };
})(window.TL);