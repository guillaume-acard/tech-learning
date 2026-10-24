window.TL = window.TL || {};

(function (TL) {
  const el = TL.el;

  TL.starsFor = function (missedCount) {
    if (missedCount === 0) return 3;
    return missedCount <= 2 ? 2 : 1;
  };

  class Quiz {
    constructor(root, questions, { onResult, onContinue }) {
      this.root = root;
      this.questions = questions;
      this.onResult = onResult;
      this.onContinue = onContinue;
      this.start();
    }

    start() {
      this.idx = 0;
      this.missed = new Set();
      this.render();
    }

    render() {
      TL.clear(this.root);
      if (this.idx >= this.questions.length) return this.renderResult();

      const q = this.questions[this.idx];
      const feedback = el('p', { class: 'feedback', 'aria-live': 'polite' });
      const nextBtn = el('button', {
        class: 'btn primary',
        hidden: true,
        text: this.idx === this.questions.length - 1 ? 'See my stars' : 'Next question',
        onclick: () => {
          this.idx++;
          this.render();
        },
      });
      const api = {
        miss: (msg) => {
          this.missed.add(this.idx);
          feedback.className = 'feedback bad';
          feedback.textContent = 'Wrong - ' + (msg || 'Try again.');
        },
        solved: (msg) => {
          feedback.className = 'feedback good';
          feedback.textContent = msg;
          nextBtn.hidden = false;
          nextBtn.focus();
        },
      };

      const body = el('div', { class: 'q-body' });
      this.root.append(
        el(
          'div',
          { class: 'quiz-card' },
          el('div', { class: 'q-count', text: `Question ${this.idx + 1} of ${this.questions.length}` }),
          el('h3', { class: 'q-prompt', text: q.q }),
          body,
          feedback,
          el('div', { class: 'controls' }, nextBtn)
        )
      );
      if (q.type === 'match') this.renderMatch(q, body, api);
      else if (q.type === 'order') this.renderOrder(q, body, api);
      else this.renderChoice(q, body, api);
    }

    renderChoice(q, body, api) {
      const list = el('div', { class: 'choices' });
      let solved = false;
      TL.shuffle(q.options.map((text, i) => ({ text, i }))).forEach((o) => {
        const btn = el('button', {
          class: 'choice',
          text: o.text,
          onclick: () => {
            if (solved) return;
            if (o.i === q.answer) {
              solved = true;
              btn.classList.add('right');
              list.querySelectorAll('button').forEach((b) => (b.disabled = true));
              api.solved(`Correct! ${q.why}`);
            } else {
              btn.classList.add('wrong');
              btn.disabled = true;
              api.miss(q.hint || 'Not quite. Have another look and try again.');
            }
          },
        });
        list.append(btn);
      });
      body.append(list);
    }

    renderMatch(q, body, api) {
      const placement = {};
      const items = TL.shuffle(q.items);
      let selected = null;
      let dragId = null;
      const tray = el('div', { class: 'tray', 'aria-label': 'Items to place' });
      const zonesBox = el('div', { class: 'zones' });
      const checkBtn = el('button', { class: 'btn primary', text: 'Check my answer', disabled: true });
      let locked = false;

      const place = (itemId, targetId) => {
        if (locked || !itemId) return;
        if (targetId) placement[itemId] = targetId;
        else delete placement[itemId];
        selected = null;
        draw();
      };

      const chip = (item) =>
        el('button', {
          class: 'chip' + (selected === item.id ? ' selected' : ''),
          draggable: 'true',
          text: item.label,
          ondragstart: (e) => {
            dragId = item.id;
            e.dataTransfer.setData('text/plain', item.id);
          },
          onclick: (e) => {
            e.stopPropagation();
            if (placement[item.id]) return place(item.id, null);
            selected = selected === item.id ? null : item.id;
            draw();
          },
        });

      const draw = () => {
        TL.clear(tray);
        TL.clear(zonesBox);
        items.filter((i) => !placement[i.id]).forEach((i) => tray.append(chip(i)));
        q.targets.forEach((t) => {
          const placed = items.filter((i) => placement[i.id] === t.id);
          const zone = el(
            'div',
            {
              class: 'zone' + (selected ? ' ready' : ''),
              role: 'button',
              tabindex: '0',
              'aria-label': `Drop zone: ${t.label}`,
              ondragover: (e) => e.preventDefault(),
              ondrop: (e) => {
                e.preventDefault();
                place(dragId || e.dataTransfer.getData('text/plain'), t.id);
              },
              onclick: () => selected && place(selected, t.id),
              onkeydown: (e) => {
                if ((e.key === 'Enter' || e.key === ' ') && selected) {
                  e.preventDefault();
                  place(selected, t.id);
                }
              },
            },
            el('div', { class: 'zone-label', text: t.label }),
            el('div', { class: 'zone-items' }, placed.map(chip))
          );
          zonesBox.append(zone);
        });
        tray.ondragover = (e) => e.preventDefault();
        tray.ondrop = (e) => {
          e.preventDefault();
          place(dragId || e.dataTransfer.getData('text/plain'), null);
        };
        checkBtn.disabled = Object.keys(placement).length !== items.length;
        const sel = tray.querySelector('.chip.selected');
        if (sel) sel.focus();
      };

      checkBtn.onclick = () => {
        const wrong = items.filter((i) => placement[i.id] !== q.answer[i.id]);
        if (!wrong.length) {
          locked = true;
          checkBtn.disabled = true;
          api.solved(`Perfect! ${q.why}`);
        } else {
          wrong.forEach((i) => delete placement[i.id]);
          api.miss(`${wrong.length === 1 ? 'One is' : wrong.length + ' are'} in the wrong place. They went back to the tray, so try again.`);
          draw();
        }
      };

      body.append(
        el('p', { class: 'hint', text: 'Drag each item onto its place, or click an item and then click where it belongs.' }),
        tray,
        zonesBox,
        el('div', { class: 'controls' }, checkBtn)
      );
      draw();
    }

    renderOrder(q, body, api) {
      const items = TL.shuffle(q.items);
      let placed = [];
      let dragId = null;
      let locked = false;
      const tray = el('div', { class: 'tray', 'aria-label': 'Steps to place' });
      const seq = el('ol', { class: 'sequence', 'aria-label': 'Your order' });
      const checkBtn = el('button', { class: 'btn primary', text: 'Check my order', disabled: true });
      const byId = (id) => items.find((i) => i.id === id);

      const add = (id) => {
        if (locked || !id || placed.includes(id)) return;
        placed.push(id);
        draw();
      };
      const remove = (id) => {
        if (locked) return;
        placed = placed.filter((p) => p !== id);
        draw();
      };

      const chip = (item, inSeq) =>
        el('button', {
          class: 'chip wide',
          draggable: 'true',
          text: item.label,
          ondragstart: (e) => {
            dragId = item.id;
            e.dataTransfer.setData('text/plain', item.id);
          },
          onclick: () => (inSeq ? remove(item.id) : add(item.id)),
        });

      const draw = () => {
        TL.clear(tray);
        TL.clear(seq);
        items.filter((i) => !placed.includes(i.id)).forEach((i) => tray.append(chip(i, false)));
        placed.forEach((id) => seq.append(el('li', {}, chip(byId(id), true))));
        if (!placed.length) seq.append(el('li', { class: 'empty', text: 'Your steps go here, first step at the top.' }));
        seq.ondragover = (e) => e.preventDefault();
        seq.ondrop = (e) => {
          e.preventDefault();
          add(dragId || e.dataTransfer.getData('text/plain'));
        };
        tray.ondragover = (e) => e.preventDefault();
        tray.ondrop = (e) => {
          e.preventDefault();
          remove(dragId || e.dataTransfer.getData('text/plain'));
        };
        checkBtn.disabled = placed.length !== items.length;
      };

      checkBtn.onclick = () => {
        if (placed.every((id, i) => id === q.answer[i])) {
          locked = true;
          checkBtn.disabled = true;
          api.solved(`That's the right order! ${q.why}`);
        } else {
          api.miss('Not the right order yet. Click a step to take it out, then place it again. Try again.');
        }
      };

      body.append(
        el('p', { class: 'hint', text: 'Drag the steps into the right order, or click them one by one.' }),
        tray,
        seq,
        el('div', { class: 'controls' }, checkBtn)
      );
      draw();
    }

    renderResult() {
      const stars = TL.starsFor(this.missed.size);
      this.onResult(stars);
      const messages = {
        3: 'Perfect! You got everything on the first try.',
        2: 'Great job! You can replay to try for all three stars.',
        1: 'Good effort! Replay the lesson and try again for more stars.',
      };
      this.root.append(
        el(
          'div',
          { class: 'quiz-card result' },
          el('h3', { text: 'Quiz finished!' }),
          el(
            'div',
            { class: 'stars big', role: 'img', 'aria-label': `${stars} out of 3 stars` },
            [1, 2, 3].map((n) => el('span', { class: n <= stars ? 'star on' : 'star', text: '\u2605' }))
          ),
          el('p', { text: messages[stars] }),
          el(
            'div',
            { class: 'controls center' },
            el('button', { class: 'btn', text: 'Try the quiz again', onclick: () => this.start() }),
            el('button', { class: 'btn primary', text: 'Continue', onclick: () => this.onContinue(stars) })
          )
        )
      );
    }

    destroy() {
      TL.clear(this.root);
    }
  }

  TL.Quiz = Quiz;
})(window.TL);
