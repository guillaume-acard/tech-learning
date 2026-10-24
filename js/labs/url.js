window.TL = window.TL || {};

(function (TL) {
  const el = TL.el;

  TL.parseUrl = function (text) {
    const m = /^([a-z][a-z0-9+.-]*):\/\/([^\/?#:\s]+)(?::(\d+))?([^?#\s]*)(\?[^#\s]*)?(#\S*)?$/i.exec(text.trim());
    if (!m) return null;
    return { protocol: m[1].toLowerCase(), host: m[2].toLowerCase(), port: m[3] || '', path: m[4] || '', query: m[5] || '', hash: m[6] || '' };
  };

  // Type any web address and see its pieces light up in colour. Challenges ask for specific addresses.
  class UrlLab {
    constructor(root, lesson, { onFinish }) {
      this.cfg = lesson.sandbox;
      this.ci = 0;
      this.solved = false;

      this.goalBox = el('div', { class: 'goal' });
      this.status = el('p', { 'aria-live': 'polite', class: 'caption-text' });
      this.input = el('input', {
        class: 'text-input url-input',
        type: 'text',
        spellcheck: 'false',
        autocomplete: 'off',
        'aria-label': 'Web address',
        oninput: () => this.update(),
      });
      this.cards = el('div', { class: 'cards' });
      this.nextBtn = el('button', { class: 'btn', text: 'Next challenge', hidden: true, onclick: () => this.load(this.ci + 1) });

      root.append(
        el('div', { class: 'caption' }, this.goalBox, this.status),
        el('div', { class: 'lab-panel' }, el('label', { class: 'lab-label', text: 'Type a web address:' }), this.input),
        el('div', { class: 'stage plain' }, this.cards),
        el('div', { class: 'controls' }, this.nextBtn, el('span', { class: 'spacer' }), el('button', { class: 'btn primary', text: 'Take the quiz', onclick: onFinish }))
      );
      this.load(0);
    }

    get challenge() {
      return this.cfg.challenges[this.ci];
    }

    load(i) {
      this.ci = Math.min(i, this.cfg.challenges.length - 1);
      this.solved = false;
      this.nextBtn.hidden = true;
      this.goalBox.className = 'goal';
      TL.clear(this.goalBox);
      this.goalBox.append(el('strong', { text: `Challenge ${this.ci + 1} of ${this.cfg.challenges.length}: ` }), this.challenge.text);
      this.input.value = this.challenge.start || this.cfg.start;
      this.update();
    }

    update() {
      const u = TL.parseUrl(this.input.value);
      const rows = [];
      if (!u) {
        TL.renderCards(this.cards, []);
        this.status.textContent = 'A web address needs a protocol, then ://, then a domain. For example: https://www.example.com/page';
        return;
      }
      const row1 = [{ t: u.protocol, sub: 'protocol', tone: 'amber' }, { op: '://' }, { t: u.host, sub: 'domain', tone: 'cyan' }];
      if (u.port) row1.push({ op: ':' }, { t: u.port, sub: 'port', tone: 'red' });
      if (u.path) row1.push({ t: u.path, sub: 'path', tone: 'green' });
      if (u.query) row1.push({ t: u.query, sub: 'extra info', tone: 'violet' });
      if (u.hash) row1.push({ t: u.hash, sub: 'spot on the page', tone: 'red' });
      rows.push(row1);
      const labels = u.host.split('.');
      if (labels.length >= 2) {
        const row2 = [];
        labels.forEach((l, i) => {
          if (i) row2.push({ op: '.' });
          const fromEnd = labels.length - 1 - i;
          row2.push({ t: l, sub: fromEnd === 0 ? 'top-level domain' : fromEnd === 1 ? 'site name' : 'subdomain', tone: fromEnd === 0 ? 'amber' : fromEnd === 1 ? 'cyan' : 'violet' });
        });
        rows.push(row2);
      }
      TL.renderCards(this.cards, rows);
      this.status.textContent = u.protocol === 'https' ? 'Secure connection (https). The website is at ' + u.host + (u.path ? ', page ' + u.path : ', home page') + '.' : `The browser will talk to ${u.host} using ${u.protocol}.`;

      if (!this.solved && this.challenge.check(u)) {
        this.solved = true;
        this.goalBox.classList.add('done');
        const last = this.ci === this.cfg.challenges.length - 1;
        this.status.textContent = `That works! ${last ? 'That was the last challenge.' : ''}`.trim();
        this.nextBtn.hidden = last;
      }
    }

    destroy() {}
  }

  TL.UrlLab = UrlLab;
  TL.labs = TL.labs || {};
  TL.labs.url = UrlLab;
})(window.TL);
