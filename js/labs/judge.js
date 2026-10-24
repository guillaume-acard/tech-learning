window.TL = window.TL || {};

(function (TL) {
  const el = TL.el;

  // Read confident AI answers and decide which ones are right and which are invented.
  class JudgeLab {
    constructor(root, lesson, { onFinish }) {
      this.cfg = lesson.sandbox;
      this.i = 0;
      this.right = 0;
      this.answered = false;

      this.goalBox = el('div', { class: 'goal' });
      this.status = el('p', { 'aria-live': 'polite', class: 'caption-text', text: this.cfg.intro });
      this.qBox = el('div', { class: 'judge-q' });
      this.aBox = el('div', { class: 'judge-a' });
      this.okBtn = el('button', { class: 'btn judge-ok', text: 'Correct', onclick: () => this.judge(true) });
      this.badBtn = el('button', { class: 'btn judge-bad', text: 'Wrong or made up', onclick: () => this.judge(false) });
      this.nextBtn = el('button', { class: 'btn primary', text: 'Next answer', hidden: true, onclick: () => this.load(this.i + 1) });
      this.result = el('p', { class: 'calc-out', 'aria-live': 'polite' });

      root.append(
        el('div', { class: 'caption' }, this.goalBox, this.status),
        el(
          'div',
          { class: 'lab-panel' },
          el('div', { class: 'lab-label', text: 'You asked the AI' }),
          this.qBox,
          el('div', { class: 'lab-label', text: 'The AI answered' }),
          this.aBox,
          el('div', { class: 'controls' }, this.okBtn, this.badBtn, this.nextBtn),
          this.result
        ),
        el('div', { class: 'controls' }, el('span', { class: 'spacer' }), el('button', { class: 'btn primary', text: 'Take the quiz', onclick: onFinish }))
      );
      this.load(0);
    }

    load(i) {
      this.i = i;
      const n = this.cfg.items.length;
      this.answered = false;
      this.okBtn.hidden = false;
      this.badBtn.hidden = false;
      this.nextBtn.hidden = true;
      this.result.textContent = '';
      this.result.className = 'calc-out';
      const it = this.cfg.items[i];
      this.qBox.textContent = it.q;
      this.aBox.textContent = it.a;
      TL.clear(this.goalBox);
      this.goalBox.classList.remove('done');
      this.goalBox.append(el('strong', { text: `Answer ${i + 1} of ${n}: ` }), 'Is the AI right? Decide before you press.');
    }

    judge(saysOk) {
      if (this.answered) return;
      this.answered = true;
      const it = this.cfg.items[this.i];
      const good = saysOk === it.ok;
      if (good) this.right++;
      this.result.className = 'calc-out ' + (good ? 'good' : 'bad');
      this.result.textContent = `${good ? 'Spot on! ' : 'Not quite. '}The AI’s answer is ${it.ok ? 'correct' : 'wrong'}. ${it.why}`;
      this.okBtn.hidden = true;
      this.badBtn.hidden = true;
      const last = this.i === this.cfg.items.length - 1;
      this.nextBtn.hidden = last;
      if (last) {
        TL.clear(this.goalBox);
        this.goalBox.classList.add('done');
        this.goalBox.append(el('strong', { text: 'Done! ' }), `You spotted ${this.right} of ${this.cfg.items.length}. ${this.cfg.outro}`);
      }
    }

    destroy() {}
  }

  TL.JudgeLab = JudgeLab;
  TL.labs = TL.labs || {};
  TL.labs.judge = JudgeLab;
})(window.TL);
