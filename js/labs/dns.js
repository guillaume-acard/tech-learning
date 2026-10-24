window.TL = window.TL || {};

(function (TL) {
  const el = TL.el;

  // "Be the resolver": click the right DNS server at each step until you find the IP address.
  class DnsLab {
    constructor(root, lesson, { onFinish }) {
      this.cfg = lesson.sandbox;
      this.ri = 0;
      this.hop = 0;
      this.solved = false;
      this.asked = new Set();

      this.stage = el('div', { class: 'stage' });
      this.goalBox = el('div', { class: 'goal' });
      this.status = el('p', { 'aria-live': 'polite', class: 'caption-text', text: this.cfg.intro });
      this.log = el('ol', { class: 'dns-log', 'aria-label': 'What you found out' });
      this.answer = el('div', { class: 'dns-answer', 'aria-live': 'polite' });
      this.nextBtn = el('button', { class: 'btn', text: 'Next lookup', hidden: true, onclick: () => this.load(this.ri + 1) });

      root.append(
        this.stage,
        el('div', { class: 'caption' }, this.goalBox, this.status),
        el('div', { class: 'lab-panel' }, el('div', { class: 'lab-label', text: 'Your notes' }), this.log, this.answer),
        el('div', { class: 'controls' }, this.nextBtn, el('span', { class: 'spacer' }), el('button', { class: 'btn primary', text: 'Take the quiz', onclick: onFinish }))
      );

      this.scene = new TL.Scene(this.stage, lesson.scene);
      this.scene.showAll();
      this.scene.setInteractive({ links: false, nodes: true });
      this.scene.on('node', (id) => this.ask(id));
      this.load(0);
    }

    get round() {
      return this.cfg.rounds[this.ri];
    }

    load(i) {
      this.ri = Math.min(i, this.cfg.rounds.length - 1);
      this.hop = 0;
      this.solved = false;
      this.asked = new Set();
      this.goalBox.className = 'goal';
      TL.clear(this.goalBox);
      this.goalBox.append(
        el('strong', { text: `Lookup ${this.ri + 1} of ${this.cfg.rounds.length}: ` }),
        `Find the IP address of ${this.round.name}. You are the resolver, so click the server you want to ask.`
      );
      TL.clear(this.log);
      this.answer.textContent = '';
      this.status.textContent = this.cfg.intro;
      this.nextBtn.hidden = true;
      this.scene.highlight([]);
      this.scene.setSubs({});
      this.scene.setBadges({});
    }

    ask(id) {
      if (this.solved) return;
      const r = this.round;
      const label = this.scene.nodes[id].def.label + (this.scene.nodes[id].def.sub ? ` (${this.scene.nodes[id].def.sub})` : '');
      const idx = r.hops.findIndex((h) => h.ask === id);
      if (idx === -1) {
        this.status.textContent = (r.wrong && r.wrong[id]) || this.cfg.wrong[id] || 'That server cannot help with this name.';
        return;
      }
      if (idx < this.hop) {
        this.status.textContent = 'You already asked that one. Use what it told you to pick the next server.';
        return;
      }
      if (idx > this.hop) {
        this.status.textContent = this.cfg.early;
        return;
      }
      const hop = r.hops[idx];
      this.scene
        .sendPacket(['resolver', id], { color: '#ffa31a', label: '?' })
        .then((res) => (res.cancelled ? null : this.scene.sendPacket([id, 'resolver'], { color: '#39ff88', label: idx === r.hops.length - 1 ? r.ip : 'ask…' })));
      this.asked.add(id);
      this.scene.highlight([id]);
      this.log.append(el('li', { text: `${label}: ${hop.say}` }));
      this.status.textContent = hop.say;
      this.hop++;
      if (this.hop === r.hops.length) {
        this.solved = true;
        this.goalBox.classList.add('done');
        this.answer.textContent = `${r.name} is at ${r.ip}`;
        this.scene.setSubs({ resolver: r.ip });
        const last = this.ri === this.cfg.rounds.length - 1;
        this.status.textContent = `${hop.say} You found it! The resolver now gives ${r.ip} back to the laptop.${last ? ' That was the last lookup.' : ''}`;
        this.nextBtn.hidden = last;
      }
    }

    destroy() {
      this.scene.destroy();
    }
  }

  TL.DnsLab = DnsLab;
  TL.labs = TL.labs || {};
  TL.labs.dns = DnsLab;
})(window.TL);
