window.TL = window.TL || {};

(function (TL) {
  const el = TL.el;
  const clean = (w) => w.toLowerCase().replace(/[^a-z']/g, '');

  // Options for the next word, as [word, percent] pairs sorted high to low. Looks at the last two words, then the last one.
  TL.nextWords = function (cfg, words) {
    let table = null;
    if (words.length >= cfg.maxWords - 1) table = [['.', 100]];
    else {
      const last = words.map(clean);
      const k2 = last.slice(-2).join(' ');
      const k1 = last[last.length - 1];
      table = cfg.model[k2] || cfg.model[k1] || cfg.fallback;
    }
    const total = table.reduce((a, [, w]) => a + w, 0);
    return table
      .map(([w, n]) => [w, (n / total) * 100])
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  };

  // Build a sentence one word at a time from a tiny made-up language model.
  class NextWordLab {
    constructor(root, lesson, { onFinish }) {
      this.cfg = lesson.sandbox;
      this.words = [];
      this.finished = 0;
      this.dice = 0;
      this.done = false;

      this.goalBox = el('div', { class: 'goal' });
      this.status = el('p', { 'aria-live': 'polite', class: 'caption-text', text: this.cfg.intro });
      this.sentence = el('div', { class: 'nw-sentence', 'aria-live': 'polite' });
      this.bars = el('div', { class: 'nw-bars' });
      this.startBox = el('div', { class: 'lab-row' });
      this.topBtn = el('button', { class: 'btn', text: 'Pick the most likely word', onclick: () => this.pick(this.options()[0][0], false) });
      this.diceBtn = el('button', { class: 'btn primary', text: 'Roll the dice', onclick: () => this.roll() });
      this.againBtn = el('button', { class: 'btn', text: 'Start again', onclick: () => this.restart() });

      root.append(
        el('div', { class: 'caption' }, this.goalBox, this.status),
        el(
          'div',
          { class: 'lab-panel' },
          el('div', { class: 'lab-label', text: 'Choose a starting line' }),
          this.startBox,
          el('div', { class: 'lab-label', text: 'The sentence so far' }),
          this.sentence,
          el('div', { class: 'lab-label', text: 'What the model thinks comes next (click a word, or let the model choose)' }),
          this.bars,
          el('div', { class: 'controls' }, this.topBtn, this.diceBtn, this.againBtn)
        ),
        el('div', { class: 'controls' }, el('span', { class: 'spacer' }), el('button', { class: 'btn primary', text: 'Take the quiz', onclick: onFinish }))
      );
      this.cfg.starts.forEach((s) => this.startBox.append(el('button', { class: 'btn nw-start', text: s, onclick: () => this.restart(s) })));
      this.restart(this.cfg.starts[0]);
    }

    options() {
      return TL.nextWords(this.cfg, this.words);
    }

    restart(start) {
      if (typeof start === 'string') this.start = start;
      this.words = this.start.split(' ');
      this.done = false;
      this.status.textContent = this.cfg.intro;
      this.draw();
      this.refreshGoal();
    }

    roll() {
      const opts = this.options();
      let r = Math.random() * 100;
      let chosen = opts[opts.length - 1][0];
      for (const [w, p] of opts) {
        r -= p;
        if (r <= 0) {
          chosen = w;
          break;
        }
      }
      this.pick(chosen, true);
    }

    pick(word, byDice) {
      if (this.done) return;
      if (byDice) this.dice++;
      this.words.push(word);
      if (word === '.') {
        this.finish(this.words.length >= this.cfg.maxWords);
      } else if (this.words.length >= this.cfg.maxWords) {
        this.finish(true);
      }
      this.draw();
      this.refreshGoal();
    }

    finish(cut) {
      this.done = true;
      this.finished++;
      this.status.textContent = cut
        ? `The sentence was cut at ${this.cfg.maxWords} words. If you always take the top word, the model can go round in circles!`
        : 'The model chose a full stop, so the sentence is finished. Try another starting line, or roll the dice for a different one.';
    }

    draw() {
      TL.clear(this.sentence);
      this.words.forEach((w) => this.sentence.append(el('span', { class: 'nw-tok' + (w === '.' ? ' end' : ''), text: w === '.' ? 'END' : w })));
      TL.clear(this.bars);
      if (this.done) {
        this.bars.append(el('p', { class: 'hint', text: 'Sentence finished. Press "Start again" or pick another starting line.' }));
      } else {
        this.options().forEach(([w, p]) =>
          this.bars.append(
            el(
              'button',
              { class: 'nw-opt', onclick: () => this.pick(w, false), 'aria-label': `${w === '.' ? 'end of sentence' : w}, ${Math.round(p)} percent` },
              el('span', { class: 'nw-word', text: w === '.' ? 'END' : w }),
              el('span', { class: 'nw-track' }, el('span', { class: 'nw-fill', style: `width:${Math.max(2, p)}%` })),
              el('span', { class: 'nw-pct', text: `${Math.round(p)}%` })
            )
          )
        );
      }
      this.topBtn.disabled = this.done;
      this.diceBtn.disabled = this.done;
    }

    refreshGoal() {
      const ok = this.finished >= 3 && this.dice >= 1;
      TL.clear(this.goalBox);
      this.goalBox.classList.toggle('done', ok);
      this.goalBox.append(
        el('strong', { text: ok ? 'Done! ' : 'Goal: ' }),
        ok
          ? 'You built sentences one word at a time, just like a real language model.'
          : `${this.finished >= 3 ? '✓' : '○'} Finish 3 sentences (${Math.min(this.finished, 3)}/3).   ${this.dice >= 1 ? '✓' : '○'} Press "Roll the dice" at least once.`
      );
    }

    destroy() {}
  }

  TL.NextWordLab = NextWordLab;
  TL.labs = TL.labs || {};
  TL.labs.nextword = NextWordLab;
})(window.TL);
