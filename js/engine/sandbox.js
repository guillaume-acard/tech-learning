window.TL = window.TL || {};

(function (TL) {
  const el = TL.el;

  class Sandbox {
    constructor(root, lesson, { onFinish }) {
      this.baseCfg = lesson.sandbox;
      this.levels = Array.isArray(this.baseCfg.levels) && this.baseCfg.levels.length ? this.baseCfg.levels : null;
      this.levelIndex = 0;
      this.unlocked = this.levels ? 1 : 0;
      this.cfg = this.levels ? this.makeCfg(this.levelIndex) : this.baseCfg;

      this.stage = el('div', { class: 'stage' });
      this.status = el('p', { class: 'caption-text', text: this.cfg.intro });
      this.feedback = el('p', { class: 'feedback', 'aria-live': 'polite' });
      this.goalBox = this.cfg.goal ? el('div', { class: 'goal' }, el('strong', { text: 'Goal: ' }), this.cfg.goal.text) : null;

      this.sending = false;
      this.goalDone = false;

      this.levelBar = this.levels
        ? el('div', { class: 'levels', role: 'group', 'aria-label': 'Difficulty levels' })
        : null;

      this.scenarioBar = el('div', { class: 'scenarios', hidden: true });

      this.resetBtn = el('button', { class: 'btn', text: 'Reset', onclick: () => this.reset() });
      this.primaryBtn = el('button', {
        class: 'btn primary',
        text: this.levels ? 'Next level' : 'Take the quiz',
        onclick: () => this.primary(onFinish),
      });

      root.append(
        this.stage,
        el('div', { class: 'caption' }, this.levelBar, this.goalBox, this.status, this.feedback),
        this.scenarioBar,
        el('div', { class: 'controls' }, this.resetBtn, el('span', { class: 'spacer' }), this.primaryBtn)
      );

      this.scene = new TL.Scene(this.stage, lesson.scene);
      this.visited = new Set();
      this.scene.on('link', (id) => this.toggle(id));
      this.scene.on('node', (id) => (this.cfg.inspect ? this.inspect(id) : this.send(id)));

      this.applyCfg();
    }

    makeCfg(i) {
      const lv = (this.levels && this.levels[i]) || {};
      const cfg = Object.assign({}, this.baseCfg, lv);
      delete cfg.levels;
      return cfg;
    }

    clearFeedback() {
      this.feedback.className = 'feedback';
      this.feedback.textContent = '';
    }

    setFeedback(kind, msg) {
      if (!msg) return this.clearFeedback();
      this.feedback.className = `feedback ${kind}`;
      this.feedback.textContent = msg;
    }

    setLevel(i) {
      if (!this.levels) return;
      if (i < 0 || i >= this.levels.length) return;
      if (i >= this.unlocked) return;
      this.levelIndex = i;
      this.cfg = this.makeCfg(i);
      this.applyCfg();
    }

    updateLevelUI() {
      if (!this.levels) return;
      TL.clear(this.levelBar);
      this.levels.forEach((lv, i) => {
        this.levelBar.append(
          el('button', {
            class: 'btn small' + (i === this.levelIndex ? ' primary' : ''),
            text: lv.label || `Level ${i + 1}`,
            disabled: i >= this.unlocked,
            onclick: () => this.setLevel(i),
          })
        );
      });
      const last = this.levelIndex === this.levels.length - 1;
      this.primaryBtn.textContent = last ? 'Take the quiz' : 'Next level';
    }

    renderScenarioBar() {
      TL.clear(this.scenarioBar);
      const scenarios = this.cfg.scenarios;
      if (!scenarios || !scenarios.length) {
        this.scenarioBar.hidden = true;
        return;
      }
      this.scenarioBar.hidden = false;
      this.scenarioBar.append(
        el('span', { class: 'scenarios-title', text: 'Try a scenario:' }),
        ...scenarios.map((sc) => el('button', { class: 'btn small', text: sc.label, onclick: () => this.runScenario(sc) }))
      );
    }

    applyCfg() {
      if (this.cfg.show) this.scene.setVisible({ nodes: this.cfg.show.nodes || [], links: this.cfg.show.links || [] });
      else this.scene.showAll();
      this.scene.setInteractive({ links: !this.cfg.inspect, nodes: true });
      this.renderScenarioBar();
      this.updateLevelUI();
      this.reset();
    }

    inspect(id) {
      this.visited.add(id);
      this.scene.highlight([id]);
      this.status.textContent = `${this.scene.nodes[id].def.label}: ${this.cfg.inspect[id]}`;
      this.clearFeedback();
      this.refresh();
    }

    names(ids) {
      return ids.map((id) => this.scene.nodes[id].def.label);
    }

    summary() {
      if (this.cfg.inspect) return { offline: new Set(), text: '' };
      const offline = this.scene.applyConnectivity(this.cfg.root);
      const ignore = this.cfg.ignore || [];
      ignore.forEach((id) => {
        offline.delete(id);
        if (this.scene.nodes[id]) this.scene.nodes[id].el.classList.remove('offline');
      });
      const offIds = [...offline];
      if (!this.scene.broken.size) return { offline, text: '' };
      if (!offIds.length) return { offline, text: this.cfg.okText || 'Everyone still has the internet.' };
      let text = `${this.cfg.cutText || 'No internet:'} ${this.names(offIds).join(', ')}.`;
      const local = this.cfg.noLocal
        ? []
        : this.scene
            .components()
            .map((g) => g.filter((id) => !ignore.includes(id)))
            .filter((g) => g.length > 1 && !g.includes(this.cfg.root));
      local.forEach((g) => {
        text += ` Still talking to each other on the home network: ${this.names(g).join(', ')}.`;
      });
      return { offline, text };
    }

    toggle(linkId) {
      const isBroken = this.scene.toggleBroken(linkId);
      const l = this.scene.links[linkId];
      const cutNote = l.def.cutNote || l.type.cutNote;
      const note = cutNote ? ` ${cutNote}` : '';
      const lead = isBroken ? `You cut the ${l.label} link.` : `You plugged the ${l.label} link back in.`;
      const sum = this.refresh();
      this.status.textContent = `${lead}${note} ${sum}`.trim();
      this.clearFeedback();
    }

    runScenario(sc) {
      const visible = this.scene.visibleLinks;
      const ids = new Set(sc.cut || []);
      if (sc.cutNode) this.scene.linksOfNode(sc.cutNode).forEach((id) => ids.add(id));
      if (sc.cutType) this.scene.linksOfType(sc.cutType).forEach((id) => ids.add(id));
      this.scene.setBroken([...ids].filter((id) => visible.has(id)));
      const sum = this.refresh();
      this.status.textContent = `${sc.note} ${sum}`.trim();
      this.clearFeedback();
    }

    refresh() {
      const { offline, text } = this.summary();
      if (this.goalBox) {
        const done = this.cfg.goal.check({ offline, broken: this.scene.broken, visited: this.visited });
        this.goalDone = done;
        this.goalBox.classList.toggle('done', done);
        this.goalBox.firstChild.textContent = done ? 'Done! ' : 'Goal: ';
        const more = this.levels && this.levelIndex < this.levels.length - 1;
        const doneText = more ? 'You reached the goal. Well done! Press "Next level" to continue.' : 'You reached the goal. Well done!';
        this.goalBox.lastChild.textContent = done ? doneText : this.cfg.goal.text;
        if (done && more && this.unlocked < this.levelIndex + 2) {
          this.unlocked = this.levelIndex + 2;
          this.updateLevelUI();
        }
      }
      return text;
    }

    async send(nodeId) {
      if (this.sending || nodeId === this.cfg.root) return;
      const path = this.scene.path(nodeId, this.cfg.root) || this.scene.path(nodeId, this.cfg.root, { ignoreBroken: true });
      if (!path) return;
      this.sending = true;
      const name = this.scene.nodes[nodeId].def.label;
      const rn = this.cfg.rootName || 'the internet';
      this.status.textContent = `${name} sends a message to ${rn}...`;
      this.clearFeedback();
      const out = await this.scene.sendPacket(path, { color: '#ffa31a' });
      if (!out.cancelled) {
        if (!out.delivered) {
          this.status.textContent = `The message from ${name} got stuck: a link on the way is cut.`;
          this.setFeedback('bad', 'Wrong - the packet got stuck. Try again.');
        } else {
          const back = await this.scene.sendPacket(path.slice().reverse(), { color: '#39ff88' });
          if (!back.cancelled)
            this.status.textContent = `${rn.charAt(0).toUpperCase() + rn.slice(1)} answered ${name}. The round trip worked!`;
        }
      }
      this.sending = false;
    }

    primary(onFinish) {
      if (this.cfg.goal && !this.goalDone) {
        this.setFeedback('bad', 'Wrong - not yet. Try again.');
        return;
      }

      if (this.levels && this.levelIndex < this.levels.length - 1) {
        this.unlocked = Math.max(this.unlocked, this.levelIndex + 2);
        this.levelIndex++;
        this.cfg = this.makeCfg(this.levelIndex);
        this.applyCfg();
        const label = (this.levels[this.levelIndex] && this.levels[this.levelIndex].label) || `Level ${this.levelIndex + 1}`;
        this.setFeedback('good', `Nice! ${label} unlocked.`);
        return;
      }

      onFinish();
    }

    reset() {
      this.scene.resetBroken();
      this.visited.clear();
      this.scene.highlight([]);
      this.status.textContent = this.cfg.intro;
      this.clearFeedback();
      this.refresh();
    }

    destroy() {
      this.scene.destroy();
    }
  }

  TL.Sandbox = Sandbox;
})(window.TL);