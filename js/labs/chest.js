window.TL = window.TL || {};

(function (TL) {
  const el = TL.el;
  const OUT = ['server', 'internet', 'isp', 'router', 'laptop'];
  const BACK = OUT.slice().reverse();

  TL.scramble = function (text) {
    const chars = '#%&@$*?!7ZqX~';
    let h = 7;
    return [...text]
      .map((c, i) => {
        h = (h * 31 + c.charCodeAt(0) + i) % 997;
        return chars[h % chars.length];
      })
      .join('');
  };

  const short = (t) => (t.length > 14 ? t.slice(0, 13) + '…' : t);

  // Send a secret in the open or in a locked chest, and see what the snooper and the website see.
  class ChestLab {
    constructor(root, lesson, { onFinish }) {
      this.cfg = lesson.sandbox;
      this.token = 0;
      this.busy = false;
      this.used = new Set();

      this.stage = el('div', { class: 'stage' });
      this.goalBox = el('div', { class: 'goal' }, el('strong', { text: 'Goal: ' }), this.cfg.goalText);
      this.status = el('p', { 'aria-live': 'polite', class: 'caption-text', text: this.cfg.intro });
      this.input = el('input', { class: 'text-input', type: 'text', maxlength: '40', value: this.cfg.message, spellcheck: 'false', 'aria-label': 'Your secret message' });
      this.openBtn = el('button', { class: 'btn', text: 'Send it in the open', onclick: () => this.send(false) });
      this.chestBtn = el('button', { class: 'btn primary', text: 'Send it in a locked chest', onclick: () => this.send(true) });
      this.seeSpy = el('div', { class: 'see-box' });
      this.seeSite = el('div', { class: 'see-box' });

      root.append(
        this.stage,
        el('div', { class: 'caption' }, this.goalBox, this.status),
        el(
          'div',
          { class: 'lab-panel' },
          el('label', { class: 'lab-label', text: 'Your secret message:' }),
          this.input,
          el('div', { class: 'controls' }, this.openBtn, this.chestBtn),
          el(
            'div',
            { class: 'see-grid' },
            el('div', {}, el('div', { class: 'lab-label', text: 'The snooper sees' }), this.seeSpy),
            el('div', {}, el('div', { class: 'lab-label', text: 'The website reads' }), this.seeSite)
          )
        ),
        el('div', { class: 'controls' }, el('button', { class: 'btn', text: 'Reset', onclick: () => this.reset() }), el('span', { class: 'spacer' }), el('button', { class: 'btn primary', text: 'Take the quiz', onclick: onFinish }))
      );

      this.scene = new TL.Scene(this.stage, lesson.scene);
      this.scene.showAll();
      this.reset();
    }

    sleep(ms) {
      return new Promise((r) => setTimeout(r, ms / (TL.defaultSpeed || 1)));
    }

    reset() {
      this.token++;
      this.busy = false;
      this.used.clear();
      this.scene.cancelPackets();
      this.scene.highlight([]);
      this.scene.setSubs({});
      this.scene.setBadges({});
      this.seeSpy.textContent = '...';
      this.seeSite.textContent = '...';
      this.status.textContent = this.cfg.intro;
      this.goalBox.classList.remove('done');
      this.goalBox.firstChild.textContent = 'Goal: ';
      this.goalBox.lastChild.textContent = this.cfg.goalText;
      this.openBtn.disabled = false;
      this.chestBtn.disabled = false;
    }

    async send(chest) {
      if (this.busy) return;
      const msg = this.input.value.trim() || this.cfg.message;
      const my = ++this.token;
      this.busy = true;
      this.openBtn.disabled = true;
      this.chestBtn.disabled = true;
      this.seeSpy.textContent = '...';
      this.seeSite.textContent = '...';
      const alive = () => my === this.token;
      const sc = this.scene;
      sc.setBadges({});
      sc.setSubs({});

      if (chest) {
        this.status.textContent = 'The website sends you its open chest. This is its public key, and anybody may have a copy.';
        sc.setBadges({ server: ['chestOpen', 'key'] });
        sc.highlight(['server']);
        await sc.sendPacket(BACK, { color: '#38e8ff', label: 'open chest' });
        if (!alive()) return;
        sc.setBadges({ server: ['chestOpen', 'key'], laptop: ['chestOpen'], spy: ['chestOpen'] });
        this.status.textContent = 'You put your message inside and snap the lock shut. Locking needs no key, but now even you cannot open it.';
        sc.highlight(['laptop']);
        await this.sleep(900);
        if (!alive()) return;
        sc.setBadges({ server: ['chestOpen', 'key'], laptop: ['chest'], spy: ['chestOpen'] });
        this.status.textContent = 'The locked chest travels to the website. The snooper can look at it, but cannot open it.';
        sc.highlight(['spy']);
        const out = sc.sendPacket(OUT, { color: '#ffa31a', label: 'locked chest' });
        this.seeSpy.textContent = `A locked chest. Inside: ${TL.scramble(msg)}`;
        await out;
        if (!alive()) return;
        sc.setBadges({ server: ['chestOpen', 'key'], spy: ['chestOpen'] });
        sc.highlight(['server']);
        this.seeSite.textContent = msg;
        this.status.textContent = 'The website opens the chest with its private key, the only key that fits, and reads your message.';
      } else {
        this.status.textContent = 'You send the message as it is, like a postcard.';
        sc.highlight(['laptop']);
        await this.sleep(500);
        if (!alive()) return;
        sc.highlight(['spy']);
        const out = sc.sendPacket(OUT, { color: '#ffa31a', label: short(msg) });
        this.seeSpy.textContent = msg;
        await out;
        if (!alive()) return;
        sc.highlight(['server']);
        this.seeSite.textContent = msg;
        this.status.textContent = 'The snooper read your message. The website got it too, but so did the spy.';
      }
      this.used.add(chest ? 'chest' : 'open');
      this.busy = false;
      this.openBtn.disabled = false;
      this.chestBtn.disabled = false;
      if (this.used.size === 2) {
        this.goalBox.classList.add('done');
        this.goalBox.firstChild.textContent = 'Done! ';
        this.goalBox.lastChild.textContent = 'You compared both ways. The locked chest keeps the snooper out.';
      }
    }

    destroy() {
      this.token++;
      this.scene.destroy();
    }
  }

  TL.ChestLab = ChestLab;
  TL.labs = TL.labs || {};
  TL.labs.chest = ChestLab;
})(window.TL);
