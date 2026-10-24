window.TL = window.TL || {};

(function (TL) {
  const el = TL.el;

  // Be the LLM: for each request, choose which tool the agent should ask the harness to run (or none).
  class ToolLab {
    constructor(root, lesson, { onFinish }) {
      this.cfg = lesson.sandbox;
      this.ti = 0;
      this.solved = [];
      this.busy = false;
      this.token = 0;

      this.stage = el('div', { class: 'stage' });
      this.goalBox = el('div', { class: 'goal' });
      this.status = el('p', { 'aria-live': 'polite', class: 'caption-text', text: this.cfg.intro });
      this.ask = el('div', { class: 'judge-q' });
      this.result = el('p', { class: 'calc-out', 'aria-live': 'polite' });
      this.btns = el('div', { class: 'controls tool-btns' });
      this.nextBtn = el('button', { class: 'btn primary', text: 'Next request', hidden: true, onclick: () => this.load(this.ti + 1) });

      root.append(
        this.stage,
        el('div', { class: 'caption' }, this.goalBox, this.status),
        el('div', { class: 'lab-panel' }, el('div', { class: 'lab-label', text: 'The user asks' }), this.ask, el('div', { class: 'lab-label', text: 'Which tool should the LLM ask for?' }), this.btns, this.result),
        el('div', { class: 'controls' }, this.nextBtn, el('span', { class: 'spacer' }), el('button', { class: 'btn primary', text: 'Take the quiz', onclick: onFinish }))
      );

      this.scene = new TL.Scene(this.stage, lesson.scene);
      this.scene.showAll();
      this.scene.setInteractive({ links: false, nodes: true });
      this.scene.on('node', (id) => {
        if (this.cfg.tools[id]) this.choose(id);
      });
      Object.keys(this.cfg.tools).forEach((id) => this.btns.append(el('button', { class: 'btn tool-btn', 'data-tool': id, text: this.cfg.tools[id], onclick: () => this.choose(id) })));
      this.btns.append(el('button', { class: 'btn tool-btn', 'data-tool': 'none', text: 'No tool: just answer', onclick: () => this.choose('none') }));
      this.load(0);
    }

    sleep(ms) {
      return new Promise((r) => setTimeout(r, ms / (TL.defaultSpeed || 1)));
    }

    load(i) {
      this.token++;
      this.ti = Math.min(i, this.cfg.tasks.length - 1);
      this.busy = false;
      this.done = false;
      this.scene.cancelPackets();
      this.scene.highlight([]);
      this.scene.setSubs({});
      this.scene.setBadges({});
      this.ask.textContent = this.cfg.tasks[this.ti].ask;
      this.result.textContent = '';
      this.result.className = 'calc-out';
      this.status.textContent = this.cfg.intro;
      this.nextBtn.hidden = true;
      TL.clear(this.goalBox);
      this.goalBox.classList.remove('done');
      this.goalBox.append(el('strong', { text: `Request ${this.ti + 1} of ${this.cfg.tasks.length}: ` }), 'Pick the right tool for the job.');
    }

    async choose(id) {
      if (this.busy || this.done) return;
      const task = this.cfg.tasks[this.ti];
      if (id !== task.tool) {
        const msg = (task.wrong && task.wrong[id]) || (id === 'none' ? 'The LLM cannot do this one alone: it needs a tool.' : 'That tool does not fit this request.');
        this.result.className = 'calc-out bad';
        this.result.textContent = msg;
        this.status.textContent = 'Not that one. Try another tool.';
        return;
      }
      this.busy = true;
      const my = ++this.token;
      const sc = this.scene;
      this.result.className = 'calc-out good';
      this.result.textContent = task.result;
      this.status.textContent = task.tool === 'none' ? 'The LLM writes the answer itself. No tool needed.' : `The LLM writes a tool request. The harness runs ${this.cfg.tools[id]} and passes the result back.`;
      if (task.tool === 'none') {
        sc.highlight(['llm']);
        await sc.sendPacket(['harness', 'llm'], { color: '#e879f9', label: 'poem?' });
        if (my === this.token) await sc.sendPacket(['llm', 'harness'], { color: '#39ff88', label: 'poem' });
      } else {
        sc.highlight(['llm']);
        await sc.sendPacket(['llm', 'harness'], { color: '#e879f9', label: 'use ' + task.tool });
        if (my !== this.token) return;
        sc.highlight([id]);
        await sc.sendPacket(['harness', id], { color: '#2dd4bf', label: 'run' });
        if (my !== this.token) return;
        await sc.sendPacket([id, 'harness'], { color: '#39ff88', label: 'result' });
      }
      if (my !== this.token) return;
      this.busy = false;
      this.done = true;
      if (!this.solved.includes(this.ti)) this.solved.push(this.ti);
      const all = this.solved.length === this.cfg.tasks.length;
      const last = this.ti === this.cfg.tasks.length - 1;
      this.nextBtn.hidden = last;
      if (all) {
        TL.clear(this.goalBox);
        this.goalBox.classList.add('done');
        this.goalBox.append(el('strong', { text: 'Done! ' }), 'You matched every request to the right tool, and saw that some need no tool at all.');
      }
    }

    destroy() {
      this.token++;
      this.scene.destroy();
    }
  }

  TL.ToolLab = ToolLab;
  TL.labs = TL.labs || {};
  TL.labs.toolpick = ToolLab;
})(window.TL);
