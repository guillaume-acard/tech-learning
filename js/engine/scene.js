window.TL = window.TL || {};

(function (TL) {
  const s = TL.svg;
  const NODE_W = 112;
  const NODE_H = 100;
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  class Scene {
    constructor(container, def) {
      this.def = def;
      this.nodes = {};
      this.links = {};
      this.broken = new Set();
      this.visibleNodes = new Set();
      this.visibleLinks = new Set();
      this.handlers = {};
      this.speed = TL.defaultSpeed || 1;
      this.paused = false;
      this.token = 0;

      const [x, y, w, h] = def.viewBox;
      this.svg = s('svg', {
        class: 'scene',
        viewBox: `${x} ${y} ${w} ${h}`,
        role: 'img',
        'aria-label': def.label || 'Diagram',
      });
      this.layerBack = s('g', { class: 'scene-back' });
      this.layerLinks = s('g');
      this.layerNodes = s('g');
      this.layerPackets = s('g');
      this.svg.append(this.layerBack, this.layerLinks, this.layerNodes, this.layerPackets);

      (def.background || []).forEach((b) => {
        if (b && b.kind === 'label') {
          this.layerBack.append(s('text', { class: 'scene-bg-label', x: b.x, y: b.y, text: b.text }));
          return;
        }
        if (!b || b.kind !== 'rect') return;
        this.layerBack.append(
          s('rect', {
            class: 'scene-bg',
            x: b.x,
            y: b.y,
            width: b.width,
            height: b.height,
            rx: b.rx || 0,
            fill: b.fill || 'rgba(10, 24, 44, 0.5)',
            stroke: b.stroke || 'rgba(56, 232, 255, 0.25)',
            'stroke-width': b.strokeWidth || 2,
            'stroke-dasharray': b.dash || null,
          })
        );
        if (b.label) {
          this.layerBack.append(
            s('text', { class: 'scene-bg-label', x: b.x + 22, y: b.y + 28, text: b.label })
          );
        }
      });

      (def.links || []).forEach((l) => this.addLink(l));
      Object.entries(def.nodes).forEach(([id, n]) => this.addNode(id, n));
      container.append(this.svg);
    }

    addNode(id, n) {
      const icon = (TL.icons[n.icon] || TL.icons.generic)();
      const badges = s('g', { class: 'badges', transform: `translate(0 ${-NODE_H / 2 - 20})` });
      const sub = s('text', { class: 'node-sub', y: 45, 'text-anchor': 'middle', text: n.sub || '' });
      const g = s(
        'g',
        { class: 'node hidden', transform: `translate(${n.x} ${n.y})` },
        s('rect', { class: 'card', x: -NODE_W / 2, y: -NODE_H / 2, width: NODE_W, height: NODE_H, rx: 8 }),
        s('g', { transform: 'translate(0 -16)' }, icon),
        s('text', { class: 'node-label', y: 30, 'text-anchor': 'middle', text: n.label }),
        sub,
        badges,
        s(
          'g',
          { class: 'offline-badge', transform: `translate(0 ${NODE_H / 2 + 16})` },
          s('rect', { x: -48, y: -12, width: 96, height: 24, rx: 12 }),
          s('text', { y: 5, 'text-anchor': 'middle', text: this.def.offlineLabel || 'No internet' })
        )
      );
      const activate = () => this.handlers.node && this.handlers.node(id);
      g.addEventListener('click', activate);
      g.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activate();
        }
      });
      this.nodes[id] = { id, def: n, el: g, sub, badges };
      this.layerNodes.append(g);
    }

    setBadges(map = {}) {
      Object.values(this.nodes).forEach((n) => {
        TL.clear(n.badges);
        const icons = map[n.id] || [];
        icons.forEach((name, i) => {
          const x = (i - (icons.length - 1) / 2) * 40;
          n.badges.append(s('g', { transform: `translate(${x} 0) scale(0.6)` }, (TL.icons[name] || TL.icons.generic)()));
        });
      });
    }

    setSubs(map = {}) {
      Object.values(this.nodes).forEach((n) => {
        n.sub.textContent = map[n.id] != null ? map[n.id] : n.def.sub || '';
      });
    }

    addLink(l) {
      const id = l.id || `${l.from}-${l.to}`;
      const type = TL.linkTypes[l.type] || TL.linkTypes.lan;
      const a = this.def.nodes[l.from];
      const b = this.def.nodes[l.to];
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;
      const label = l.label || type.name;
      const labelW = label.length * 8 + 20;
      const g = s(
        'g',
        { class: 'link hidden', 'data-type': l.type },
        s('line', { class: 'hit', x1: a.x, y1: a.y, x2: b.x, y2: b.y }),
        s('line', {
          class: 'wire',
          x1: a.x,
          y1: a.y,
          x2: b.x,
          y2: b.y,
          stroke: type.color,
          'stroke-width': type.width,
          'stroke-dasharray': type.dash,
          'stroke-linecap': 'round',
        }),
        s(
          'g',
          { class: 'link-label' + (l.hideLabel ? ' nolabel' : ''), transform: `translate(${mx} ${my})` },
          s('rect', { x: -labelW / 2, y: -13, width: labelW, height: 26, rx: 13, stroke: type.color }),
          s('text', { y: 5, 'text-anchor': 'middle', text: label })
        ),
        s(
          'g',
          { class: 'cut', transform: `translate(${mx} ${my})` },
          s('circle', { r: 16 }),
          s('path', { d: 'M-7 -7 L7 7 M7 -7 L-7 7', stroke: '#fff', 'stroke-width': 4, 'stroke-linecap': 'round' })
        )
      );
      const activate = () => this.handlers.link && this.handlers.link(id);
      g.addEventListener('click', activate);
      g.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activate();
        }
      });
      this.links[id] = { id, def: l, type, label, el: g };
      this.layerLinks.append(g);
    }

    setInteractive({ links, nodes }) {
      Object.values(this.links).forEach((l) => {
        l.el.classList.toggle('clickable', !!links);
        if (links) {
          l.el.setAttribute('tabindex', '0');
          l.el.setAttribute('role', 'button');
          l.el.setAttribute('aria-label', `Cut or restore the ${l.label} link`);
        } else {
          l.el.removeAttribute('tabindex');
          l.el.removeAttribute('role');
        }
      });
      Object.values(this.nodes).forEach((n) => {
        n.el.classList.toggle('clickable', !!nodes);
        if (nodes) {
          n.el.setAttribute('tabindex', '0');
          n.el.setAttribute('role', 'button');
          n.el.setAttribute('aria-label', n.def.label);
        } else {
          n.el.removeAttribute('tabindex');
          n.el.removeAttribute('role');
        }
      });
    }

    on(kind, cb) {
      this.handlers[kind] = cb;
    }

    setVisible({ nodes = [], links = [] }) {
      this.visibleNodes = new Set(nodes);
      this.visibleLinks = new Set(links);
      Object.values(this.nodes).forEach((n) => n.el.classList.toggle('hidden', !this.visibleNodes.has(n.id)));
      Object.values(this.links).forEach((l) => l.el.classList.toggle('hidden', !this.visibleLinks.has(l.id)));
      this.fitTop();
    }

    // With def.fitTop, trim the empty band above the highest visible node or background box.
    fitTop() {
      if (!this.def.fitTop) return;
      const [x, y, w, h] = this.def.viewBox;
      let top = Infinity;
      (this.def.background || []).forEach((b) => {
        if (b && b.kind === 'rect') top = Math.min(top, b.y - 8);
      });
      this.visibleNodes.forEach((id) => {
        top = Math.min(top, this.def.nodes[id].y - NODE_H / 2 - 50);
      });
      const cut = Number.isFinite(top) ? Math.max(0, Math.min(top - y, h / 2)) : 0;
      this.svg.setAttribute('viewBox', `${x} ${y + cut} ${w} ${h - cut}`);
    }

    showAll() {
      this.setVisible({ nodes: Object.keys(this.nodes), links: Object.keys(this.links) });
    }

    highlight(ids = []) {
      const set = new Set(ids);
      Object.values(this.nodes).forEach((n) => n.el.classList.toggle('hl', set.has(n.id)));
      Object.values(this.links).forEach((l) => l.el.classList.toggle('hl', set.has(l.id)));
    }

    toggleBroken(linkId) {
      const isBroken = !this.broken.has(linkId);
      if (isBroken) this.broken.add(linkId);
      else this.broken.delete(linkId);
      this.links[linkId].el.classList.toggle('broken', isBroken);
      return isBroken;
    }

    resetBroken() {
      this.setBroken([]);
    }

    setBroken(ids) {
      this.broken = new Set(ids);
      Object.values(this.links).forEach((l) => l.el.classList.toggle('broken', this.broken.has(l.id)));
    }

    linksOfNode(nodeId) {
      return Object.values(this.links)
        .filter((l) => l.def.from === nodeId || l.def.to === nodeId)
        .map((l) => l.id);
    }

    linksOfType(type) {
      return Object.values(this.links)
        .filter((l) => l.def.type === type)
        .map((l) => l.id);
    }

    isLeaf(id) {
      return !!this.def.nodes[id].leaf;
    }

    components() {
      const groups = [];
      const inGroup = new Set();
      this.visibleNodes.forEach((start) => {
        if (this.isLeaf(start) || inGroup.has(start)) return;
        const group = [start];
        inGroup.add(start);
        for (let i = 0; i < group.length; i++) {
          if (this.isLeaf(group[i])) continue;
          this.neighbours(group[i], false).forEach((n) => {
            if (this.visibleNodes.has(n) && !group.includes(n)) {
              group.push(n);
              inGroup.add(n);
            }
          });
        }
        groups.push(group);
      });
      this.visibleNodes.forEach((id) => {
        if (!inGroup.has(id)) groups.push([id]);
      });
      return groups;
    }

    findLink(a, b) {
      return Object.values(this.links).find(
        (l) => (l.def.from === a && l.def.to === b) || (l.def.from === b && l.def.to === a)
      );
    }

    neighbours(id, ignoreBroken) {
      const out = [];
      Object.values(this.links).forEach((l) => {
        if (!this.visibleLinks.has(l.id)) return;
        if (l.type.data === false) return;
        if (!ignoreBroken && this.broken.has(l.id)) return;
        if (l.def.from === id) out.push(l.def.to);
        else if (l.def.to === id) out.push(l.def.from);
      });
      return out;
    }

    path(from, to, { ignoreBroken = false } = {}) {
      const prev = { [from]: null };
      const queue = [from];
      while (queue.length) {
        const cur = queue.shift();
        if (cur === to) break;
        if (cur !== from && this.isLeaf(cur)) continue;
        this.neighbours(cur, ignoreBroken).forEach((n) => {
          if (!(n in prev)) {
            prev[n] = cur;
            queue.push(n);
          }
        });
      }
      if (!(to in prev)) return null;
      const out = [];
      for (let c = to; c != null; c = prev[c]) out.unshift(c);
      return out;
    }

    reachable(from) {
      const seen = new Set([from]);
      const queue = [from];
      while (queue.length) {
        const cur = queue.shift();
        if (cur !== from && this.isLeaf(cur)) continue;
        this.neighbours(cur, false).forEach((n) => {
          if (!seen.has(n)) {
            seen.add(n);
            queue.push(n);
          }
        });
      }
      return seen;
    }

    applyConnectivity(rootId) {
      const ok = this.reachable(rootId);
      const offline = new Set();
      Object.values(this.nodes).forEach((n) => {
        const isOff = this.visibleNodes.has(n.id) && !ok.has(n.id);
        n.el.classList.toggle('offline', isOff);
        if (isOff) offline.add(n.id);
      });
      return offline;
    }

    clearConnectivity() {
      Object.values(this.nodes).forEach((n) => n.el.classList.remove('offline'));
    }

    pathIsBlocked(path) {
      for (let i = 0; i < path.length - 1; i++) {
        const l = this.findLink(path[i], path[i + 1]);
        if (!l || this.broken.has(l.id) || !this.visibleLinks.has(l.id)) return true;
      }
      return false;
    }

    sendPacket(path, opts = {}) {
      if (TL.reducedMotion()) return Promise.resolve({ delivered: !this.pathIsBlocked(path) });

      const myToken = this.token;
      const color = opts.color || '#ff7a00';
      const segs = [];
      for (let i = 0; i < path.length - 1; i++) {
        const a = this.def.nodes[path[i]];
        const b = this.def.nodes[path[i + 1]];
        const link = this.findLink(path[i], path[i + 1]);
        const blocked = !link || this.broken.has(link.id) || !this.visibleLinks.has(link.id);
        const len = Math.hypot(b.x - a.x, b.y - a.y);
        segs.push({ a, b, len, blocked, limit: blocked ? len / 2 : len });
      }
      const dot = s(
        'g',
        { class: 'packet' },
        s('circle', { r: 10, fill: color, stroke: '#fff', 'stroke-width': 3 }),
        opts.label ? s('text', { y: -16, 'text-anchor': 'middle', text: opts.label }) : null
      );
      this.layerPackets.append(dot);

      return new Promise((resolve) => {
        let si = 0;
        let dist = 0;
        let last = null;
        const end = (result) => {
          dot.remove();
          resolve(result);
        };
        const place = () => {
          const seg = segs[Math.min(si, segs.length - 1)];
          const t = seg.len ? dist / seg.len : 0;
          dot.setAttribute('transform', `translate(${seg.a.x + (seg.b.x - seg.a.x) * t} ${seg.a.y + (seg.b.y - seg.a.y) * t})`);
        };
        if (!segs.length) return end({ delivered: true });
        place();
        const frame = (now) => {
          if (myToken !== this.token) return end({ delivered: false, cancelled: true });
          if (last == null) last = now;
          const dt = now - last;
          last = now;
          if (!this.paused) {
            dist += dt * 0.28 * this.speed;
            let seg = segs[si];
            if (dist >= seg.limit) {
              if (seg.blocked) {
                dist = seg.limit;
                place();
                dot.classList.add('blocked');
                return setTimeout(() => end({ delivered: false }), 700);
              }
              dist -= seg.len;
              si++;
              if (si >= segs.length) {
                const lastSeg = segs[segs.length - 1];
                dot.setAttribute('transform', `translate(${lastSeg.b.x} ${lastSeg.b.y})`);
                return end({ delivered: true });
              }
            }
            place();
          }
          requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);
      });
    }

    loopPackets(defs) {
      this.cancelPackets();
      if (!defs.length) return;
      if (TL.reducedMotion()) {
        const ids = [];
        defs.forEach((d) => {
          d.path.forEach((n, i) => {
            ids.push(n);
            if (i > 0) {
              const l = this.findLink(d.path[i - 1], n);
              if (l) ids.push(l.id);
            }
          });
        });
        const set = new Set(ids);
        Object.values(this.nodes).forEach((n) => set.has(n.id) && n.el.classList.add('hl'));
        Object.values(this.links).forEach((l) => set.has(l.id) && l.el.classList.add('hl'));
        return;
      }
      const my = this.token;
      (async () => {
        while (my === this.token) {
          for (const d of defs) {
            if (my !== this.token) return;
            await this.sendPacket(d.path, d);
            await wait(300);
          }
          await wait(900);
        }
      })();
    }

    cancelPackets() {
      this.token++;
      TL.clear(this.layerPackets);
    }

    destroy() {
      this.cancelPackets();
      this.svg.remove();
    }
  }

  TL.Scene = Scene;
})(window.TL);
