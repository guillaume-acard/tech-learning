window.TL = window.TL || {};

(function (TL) {
  const el = TL.el;
  const STEP_MS = 650;

  // Instruction-block puzzle: build a short program, run it, and watch the "CPU number" change.
  class CodeLab {
    constructor(root, lesson, { onFinish }) {
      this.cfg = lesson.sandbox;
      this.blocks = this.cfg.blocks;
      this.ci = 0;
      this.program = [];
      this.running = false;
      this.token = 0;

      this.goalBox = el('div', { class: 'goal' });
      this.status = el('p', { 'aria-live': 'polite', class: 'caption-text', text: this.cfg.intro });
      this.palette = el('div', { class: 'code-blocks' });
      this.list = el('ol', { class: 'code-program', 'aria-label': 'Your program' });
      this.value = el('div', { class: 'cpu-value', 'aria-live': 'polite' });
      this.target = el('div', { class: 'cpu-target' });
      this.runBtn = el('button', { class: 'btn primary', text: 'Run the program', onclick: () => this.run() });
      this.clearBtn = el('button', { class: 'btn', text: 'Clear', onclick: () => this.clear() });
      this.nextBtn = el('button', { class: 'btn', text: 'Next challenge', hidden: true, onclick: () => this.load(this.ci + 1) });

      root.append(
        el('div', { class: 'caption' }, this.goalBox, this.status),
        el(
          'div',
          { class: 'code-grid' },
          el('div', { class: 'code-col' }, el('h3', { text: 'Instruction blocks' }), el('p', { class: 'hint', text: 'Click a block to add it to your program.' }), this.palette),
          el('div', { class: 'code-col' }, el('h3', { text: 'Your program' }), this.list),
          el('div', { class: 'code-col cpu-box' }, el('h3', { text: 'The CPU' }), el('p', { class: 'hint', text: 'It follows the instructions one at a time, from the top.' }), this.value, this.target)
        ),
        el(
          'div',
          { class: 'controls' },
          this.runBtn,
          this.clearBtn,
          this.nextBtn,
          el('span', { class: 'spacer' }),
          el('button', { class: 'btn primary', text: 'Take the quiz', onclick: onFinish })
        )
      );
      this.blocks.forEach((b) =>
        this.palette.append(el('button', { class: 'btn small block', text: b.label, onclick: () => this.add(b.id) }))
      );
      this.load(0);
    }

    get challenge() {
      return this.cfg.challenges[this.ci];
    }

    load(i) {
      this.ci = Math.min(i, this.cfg.challenges.length - 1);
      this.program = [];
      this.solved = false;
      this.token++;
      this.running = false;
      const c = this.challenge;
      this.goalBox.className = 'goal';
      TL.clear(this.goalBox);
      this.goalBox.append(
        el('strong', { text: `Challenge ${this.ci + 1} of ${this.cfg.challenges.length}: ` }),
        c.text
      );
      this.value.textContent = String(c.start);
      this.target.textContent = `Target: ${c.target} (start: ${c.start}, at most ${c.max} blocks)`;
      this.status.textContent = this.cfg.intro;
      this.nextBtn.hidden = true;
      this.draw();
    }

    add(id) {
      if (this.running || this.solved || this.program.length >= this.challenge.max) return;
      this.program.push(id);
      this.value.textContent = String(this.challenge.start);
      this.draw();
    }

    remove(i) {
      if (this.running || this.solved) return;
      this.program.splice(i, 1);
      this.draw();
    }

    clear() {
      this.token++;
      this.running = false;
      this.program = [];
      this.solved = false;
      this.goalBox.classList.remove('done');
      this.nextBtn.hidden = true;
      this.value.textContent = String(this.challenge.start);
      this.status.textContent = this.cfg.intro;
      this.draw();
    }

    draw(active = -1) {
      TL.clear(this.list);
      if (!this.program.length) this.list.append(el('li', { class: 'empty', text: 'Empty. Add some blocks!' }));
      this.program.forEach((id, i) => {
        const b = this.blocks.find((x) => x.id === id);
        this.list.append(
          el(
            'li',
            { class: 'code-line' + (i === active ? ' running' : '') },
            el('span', { text: b.label }),
            el('button', { class: 'btn ghost small', text: '×', 'aria-label': `Remove ${b.label}`, onclick: () => this.remove(i) })
          )
        );
      });
      this.runBtn.disabled = this.running || !this.program.length || this.solved;
      this.clearBtn.disabled = this.running;
      this.palette.querySelectorAll('button').forEach((b) => (b.disabled = this.running || this.solved || this.program.length >= this.challenge.max));
    }

    async run() {
      if (this.running || !this.program.length) return;
      const my = ++this.token;
      this.running = true;
      let n = this.challenge.start;
      this.value.textContent = String(n);
      this.draw(-1);
      this.status.textContent = 'The CPU starts at the top of the list...';
      for (let i = 0; i < this.program.length; i++) {
        await new Promise((r) => setTimeout(r, STEP_MS));
        if (my !== this.token) return;
        const b = this.blocks.find((x) => x.id === this.program[i]);
        n = b.run(n);
        this.draw(i);
        this.value.textContent = String(n);
        this.status.textContent = `Step ${i + 1}: ${b.label}. The number is now ${n}.`;
      }
      await new Promise((r) => setTimeout(r, STEP_MS));
      if (my !== this.token) return;
      this.running = false;
      if (n === this.challenge.target) {
        this.solved = true;
        this.goalBox.classList.add('done');
        const last = this.ci === this.cfg.challenges.length - 1;
        this.status.textContent = `You wrote a working program! The CPU ended on ${n}.${last ? ' That was the last challenge.' : ''}`;
        this.nextBtn.hidden = last;
      } else {
        this.status.textContent = `The CPU ended on ${n}, but the target is ${this.challenge.target}. A program is just a list of instructions, so change the list and run it again.`;
      }
      this.draw();
    }

    destroy() {
      this.token++;
    }
  }

  TL.CodeLab = CodeLab;
  TL.labs = TL.labs || {};
  TL.labs.code = CodeLab;
})(window.TL);
