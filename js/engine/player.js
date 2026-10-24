window.TL = window.TL || {};

(function (TL) {
  const el = TL.el;

  class StoryPlayer {
    constructor(root, lesson, { onFinish }) {
      this.lesson = lesson;
      this.steps = lesson.steps;
      this.onFinish = onFinish;
      this.i = 0;
      this.slow = false;
      this.paused = false;
      this.looksLike = null;

      this.stage = el('div', { class: 'stage' });

      this.stepImage = el('img', { class: 'step-image', alt: '', loading: 'lazy' });
      this.stepImageWrap = el('div', { class: 'step-image-wrap', hidden: true }, this.stepImage);

      this.captionText = el('p', { 'aria-live': 'polite', class: 'caption-text' });
      this.lookBtn = el('button', { class: 'btn ghost look-btn', text: 'See what it looks like', hidden: true, onclick: () => this.openLooksLike() });
      this.realLife = el('details', { class: 'real-life' }, el('summary', { text: 'In real life...' }), el('p'));
      this.captionBox = el('div', { class: 'caption' }, this.captionText, el('div', { class: 'caption-actions' }, this.lookBtn), this.realLife);

      this.dots = el('div', { class: 'dots', role: 'group', 'aria-label': 'Steps' });
      this.backBtn = el('button', { class: 'btn', text: 'Back', onclick: () => this.go(this.i - 1) });
      this.nextBtn = el('button', { class: 'btn primary', onclick: () => this.next() });
      this.replayBtn = el('button', { class: 'btn', text: 'Replay step', onclick: () => this.go(this.i) });
      this.pauseBtn = el('button', { class: 'btn ghost', text: 'Pause', hidden: !lesson.scene, onclick: () => this.togglePause() });
      this.speedBtn = el('button', { class: 'btn ghost', text: 'Speed: normal', hidden: !lesson.scene, onclick: () => this.toggleSpeed() });

      root.append(
        this.stage,
        this.stepImageWrap,
        this.captionBox,
        this.dots,
        el('div', { class: 'controls' }, this.backBtn, this.replayBtn, this.nextBtn, el('span', { class: 'spacer' }), this.pauseBtn, this.speedBtn)
      );

      this.cards = el('div', { class: 'cards', hidden: true });
      this.side = el('div', { class: 'side', hidden: true });
      this.stage.append(this.cards, this.side);
      this.scene = lesson.scene ? new TL.Scene(this.stage, lesson.scene) : null;
      if (!this.scene) this.stage.classList.add('plain');

      this.steps.forEach((_, idx) => {
        this.dots.append(el('button', { class: 'dot', 'aria-label': `Step ${idx + 1}`, onclick: () => this.go(idx) }));
      });

      this.modalImg = el('img', { class: 'photo-modal-img', alt: '' });
      this.modalCaption = el('p', { class: 'photo-modal-caption' });
      this.modalTitle = el('div', { class: 'photo-modal-title' });
      this.modal = el(
        'div',
        { class: 'photo-modal', hidden: true },
        el('div', { class: 'photo-modal-backdrop', onclick: () => this.closeLooksLike() }),
        el(
          'div',
          { class: 'photo-modal-card', role: 'dialog', 'aria-modal': 'true' },
          el(
            'div',
            { class: 'photo-modal-head' },
            this.modalTitle,
            el('button', { class: 'btn ghost', text: 'Close', onclick: () => this.closeLooksLike() })
          ),
          this.modalImg,
          this.modalCaption
        )
      );
      document.body.append(this.modal);

      this.keyHandler = (e) => {
        if (!root.isConnected) return this.destroy();
        if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
        if (e.key === 'Escape' && !this.modal.hidden) return this.closeLooksLike();
        if (e.key === 'ArrowRight') this.next();
        if (e.key === 'ArrowLeft') this.go(this.i - 1);
      };
      document.addEventListener('keydown', this.keyHandler);
      this.go(0);
    }

    openLooksLike() {
      if (!this.looksLike) return;
      const item = this.looksLike;
      this.modalTitle.textContent = item.title || 'Real world';
      this.modalImg.src = item.src;
      this.modalImg.alt = item.alt || item.title || 'Real world photo';
      this.modalCaption.textContent = item.caption || '';
      this.modal.hidden = false;
    }

    closeLooksLike() {
      this.modal.hidden = true;
      this.modalImg.removeAttribute('src');
    }

    next() {
      if (this.i >= this.steps.length - 1) this.onFinish();
      else this.go(this.i + 1);
    }

    go(i) {
      this.i = Math.max(0, Math.min(this.steps.length - 1, i));
      const sc = this.scene;
      const nodes = new Set();
      const links = new Set();
      for (let k = 0; k <= this.i; k++) {
        const show = this.steps[k].show || {};
        (show.nodes || []).forEach((n) => nodes.add(n));
        (show.links || []).forEach((l) => links.add(l));
      }
      const step = this.steps[this.i];

      TL.renderCards(this.cards, step.cards);
      TL.renderSide(this.side, step);
      this.stage.classList.toggle('has-side', !this.side.hidden);
      if (sc) {
        sc.cancelPackets();
        sc.setVisible({ nodes: [...nodes], links: [...links] });
        sc.setBroken(step.broken || []);
        sc.setSubs(step.labels || {});
        sc.setBadges(step.badges || {});
        if (step.connectivity) sc.applyConnectivity(typeof step.connectivity === 'string' ? step.connectivity : 'internet');
        else sc.clearConnectivity();
        sc.highlight(step.highlight || []);
        sc.loopPackets(step.packets || []);
      }

      if (step.image && !step.suppressPlayerImage) {
        this.stepImageWrap.hidden = false;
        this.stepImage.src = step.image;
        this.stepImage.alt = step.imageAlt || 'Lesson illustration';
      } else {
        this.stepImageWrap.hidden = true;
        this.stepImage.removeAttribute('src');
      }

      this.captionText.textContent = step.caption;

      this.looksLike = step.looksLike || null;
      this.lookBtn.hidden = !this.looksLike;

      this.realLife.hidden = !step.realLife;
      this.realLife.open = false;
      if (step.realLife) this.realLife.querySelector('p').textContent = step.realLife;

      this.backBtn.disabled = this.i === 0;
      const last = this.i === this.steps.length - 1;
      this.nextBtn.textContent = last ? (this.lesson.sandbox ? 'Try it yourself' : 'Take the quiz') : 'Next';
      [...this.dots.children].forEach((d, idx) => {
        d.classList.toggle('active', idx === this.i);
        d.classList.toggle('seen', idx < this.i);
        d.setAttribute('aria-current', idx === this.i ? 'step' : 'false');
      });
    }

    togglePause() {
      if (this.scene) this.scene.paused = !this.scene.paused;
      this.paused = !this.paused;
      this.pauseBtn.textContent = this.paused ? 'Play' : 'Pause';
    }

    toggleSpeed() {
      this.slow = !this.slow;
      if (this.scene) this.scene.speed = this.slow ? 0.5 : 1;
      this.speedBtn.textContent = this.slow ? 'Speed: slow' : 'Speed: normal';
    }

    destroy() {
      document.removeEventListener('keydown', this.keyHandler);
      if (this.scene) this.scene.destroy();
      if (this.modal && this.modal.parentNode) this.modal.parentNode.removeChild(this.modal);
    }
  }

  TL.StoryPlayer = StoryPlayer;
})(window.TL);
