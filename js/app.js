(function (TL) {
  const el = TL.el;
  const app = document.getElementById('app');
  let current = null;

  const flatLessons = () => TL.chapters.flatMap((c) => c.lessons);
  const chapterForLesson = (lessonId) => TL.chapters.find((c) => c.lessons.includes(lessonId));
  const starsTotal = (lessonIds) => lessonIds.reduce((n, id) => n + TL.progress.stars(id), 0);

  function starsRow(n, big) {
    return el(
      'span',
      { class: 'stars' + (big ? ' big' : ''), role: 'img', 'aria-label': `${n} out of 3 stars` },
      [1, 2, 3].map((i) => el('span', { class: i <= n ? 'star on' : 'star', 'aria-hidden': 'true', text: '\u2605' }))
    );
  }

  function setTitle(t) {
    document.title = t ? `${t} | Tech Learning` : 'Tech Learning';
  }

  function focusMain(node) {
    if (!node) return;
    node.setAttribute('tabindex', '-1');
    if (node.focus) node.focus({ preventScroll: true });
  }

  function renderProgress() {
    teardown();
    TL.clear(app);
    setTitle('My progress');
    const all = flatLessons();
    const maxStars = all.length * 3;
    const total = TL.progress.totalStars();
    const doneCount = all.filter(TL.progress.isDone).length;
    const main = el('main', {});
    main.append(
      el('header', { class: 'lesson-head' }, el('a', { class: 'back', href: '#/', text: '\u2190 Chapters' }), el('h1', { text: 'My progress' })),
      el(
        'div',
        { class: 'prog-summary' },
el('div', { class: 'total', text: `${total} / ${maxStars} \u2605` }),
el('p', { class: 'blurb', text: `${doneCount} of ${all.length} lessons finished.` })
      )
    );
    TL.chapters.forEach((ch) => {
      const ids = ch.lessons;
      if (!ids.length) return;
      const got = ids.reduce((n, id) => n + TL.progress.stars(id), 0);
      const done = TL.progress.chapterComplete(ids);
      const section = el('section', { class: 'chapter' });
      section.append(
        el(
          'div',
          { class: 'chapter-head' },
          el('h2', { text: ch.title }),
          done ? el('span', { class: 'badge', text: 'Badge earned' }) : el('span', { class: 'badge soon', text: 'Badge locked' })
        ),
        el(
          'div',
          { class: 'prog-bar', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': String(ids.length * 3), 'aria-valuenow': String(got), 'aria-label': `${ch.title} stars` },
          el('span', { class: 'prog-fill', style: `width:${(got / (ids.length * 3)) * 100}%` })
        ),
        el('p', { class: 'blurb', text: `${got} of ${ids.length * 3} stars. ${done ? 'Every lesson finished.' : 'Finish every lesson quiz to earn the badge.'}` })
      );
      const list = el('ul', { class: 'prog-list' });
      ids.forEach((id) => {
        const s = TL.progress.stars(id);
        list.append(
          el(
            'li',
            {},
            el('a', { href: `#/lesson/${id}`, text: TL.lessons[id].title }),
            starsRow(s),
            el('span', { class: 'go', text: s === 3 ? 'Perfect' : s ? 'Improve' : 'Not started' })
          )
        );
      });
      section.append(list);
      main.append(section);
    });
    main.append(
      el(
        'div',
        { class: 'home-foot' },
        el('button', {
          class: 'btn ghost',
          text: 'Reset my progress',
          onclick: () => {
            if (window.confirm('Erase all stars and badges on this device?')) {
              TL.progress.reset();
              renderProgress();
            }
          },
        })
      )
    );
    app.append(main);
    focusMain(main);
  }

  function teardown() {
    if (current && current.destroy) current.destroy();
    current = null;
  }

  function renderChapters() {
    teardown();
    TL.clear(app);
    setTitle('');

    const total = TL.progress.totalStars();
    const main = el('main', {});

    main.append(
      el(
        'header',
        { class: 'home-head' },
        el('h1', { text: 'Tech Learning' }),
        el('p', { class: 'tagline', text: 'See how computers, the internet and AI really work. Watch, play, then test yourself!' }),
        el('a', { class: 'total', href: '#/progress', text: `Stars collected: ${total} \u2605` })
      )
    );

    const list = el('div', { class: 'chapter-list' });

    TL.chapters.forEach((ch) => {
      const got = starsTotal(ch.lessons);
      const max = ch.lessons.length * 3;
      const done = TL.progress.chapterComplete(ch.lessons);

      list.append(
        el(
          'a',
          { class: 'chapter-card' + (ch.comingSoon ? ' soon' : ''), href: `#/chapter/${ch.id}` },
          ch.cover ? el('img', { class: 'chapter-cover', src: ch.cover, alt: `${ch.title} cover` }) : null,
          el(
            'div',
            {},
            el(
              'div',
              { class: 'chapter-head' },
              el('h2', { text: ch.title }),
              done ? el('span', { class: 'badge', text: 'Chapter complete!' }) : null,
              ch.comingSoon ? el('span', { class: 'badge soon', text: 'Coming soon' }) : null
            ),
            el('p', { class: 'blurb', text: ch.blurb }),
            el(
              'div',
              { class: 'chapter-meta' },
              el('span', { class: 'pill', text: `${ch.lessons.length} lessons` }),
              el('span', { class: 'pill star-total', text: `${got} / ${max} \u2605` })
            )
          )
        )
      );
    });

    main.append(list);

    main.append(
      el(
        'footer',
        { class: 'home-foot' },
        el('a', { class: 'btn ghost', href: '#/progress', text: 'My progress' })
      )
    );

    app.append(main);
    focusMain(main);
  }

  function renderChapter(chId) {
    const ch = TL.chapters.find((c) => c.id === chId);
    if (!ch) return renderChapters();

    teardown();
    TL.clear(app);
    setTitle(ch.title);

    const got = starsTotal(ch.lessons);
    const max = ch.lessons.length * 3;
    const done = TL.progress.chapterComplete(ch.lessons);

    const main = el('main', {});

    main.append(
      el(
        'header',
        { class: 'lesson-head' },
        el('a', { class: 'back', href: '#/', text: '\u2190 Chapters' }),
        el('h1', { text: ch.title })
      ),
      el(
        'div',
        { class: 'chapter-hero' },
        ch.cover ? el('img', { class: 'chapter-cover', src: ch.cover, alt: `${ch.title} cover` }) : null,
        el(
          'div',
          {},
          el('p', { class: 'blurb', text: ch.blurb }),
          el(
            'div',
            { class: 'chapter-meta' },
            el('span', { class: 'pill', text: `${ch.lessons.length} lessons` }),
            el('span', { class: 'pill star-total', text: `${got} / ${max} \u2605` }),
            done ? el('span', { class: 'badge', text: 'Chapter complete!' }) : null
          )
        )
      )
    );

    const section = el('section', { class: 'chapter' + (ch.comingSoon ? ' soon' : '') });

    (ch.parts || (ch.lessons.length ? [{ lessons: ch.lessons }] : [])).forEach((part) => {
      if (part.title) section.append(el('h2', { class: 'part-title', text: part.title }));

      const grid = el('div', { class: 'lesson-grid' });
      part.lessons.forEach((id) => {
        const lesson = TL.lessons[id];
        const stars = TL.progress.stars(id);
        const hero = el(
          'div',
          { class: 'lesson-card-hero' + (lesson.cover ? '' : ' placeholder') },
          lesson.cover ? el('img', { class: 'lesson-card-cover', src: lesson.cover, alt: `${lesson.title} illustration`, loading: 'lazy' }) : null,
          el('div', { class: 'lesson-card-hero-overlay' }, el('h3', { class: 'lesson-card-title', text: lesson.title }))
        );

        grid.append(
          el(
            'a',
            { class: 'lesson-card', href: `#/lesson/${id}` },
            hero,
            el(
              'div',
              { class: 'lesson-card-body' },
              el('p', { text: lesson.hook }),
              el('div', { class: 'card-foot' }, starsRow(stars), el('span', { class: 'go', text: stars ? 'Replay' : 'Start' }))
            )
          )
        );
      });
      section.append(grid);
    });

    main.append(section);

    main.append(
      el(
        'footer',
        { class: 'home-foot' },
        el('a', { class: 'btn ghost', href: '#/progress', text: 'My progress' })
      )
    );

    app.append(main);
    focusMain(main);
  }
  function renderLesson(id) {
    const lesson = TL.lessons[id];
    if (!lesson) return renderChapters();
    const chapter = chapterForLesson(id);
    teardown();
    TL.clear(app);
    setTitle(lesson.title);

    const storyLesson = lesson;

    const state = { phase: 'story', quizDone: false };
    const main = el('main', { class: 'phase' });
    const tabs = el('nav', { class: 'tabs', 'aria-label': 'Lesson parts' });
    const phaseDefs = [
      { id: 'story', label: 'Watch' },
      lesson.sandbox ? { id: 'try', label: 'Try it' } : null,
      { id: 'quiz', label: 'Quiz' },
      { id: 'recap', label: 'Recap' },
    ].filter(Boolean);
    const phases = phaseDefs.map((p, i) => ({ id: p.id, label: `${i + 1}. ${p.label}` }));

    const drawTabs = () => {
      TL.clear(tabs);
      phases.forEach((p) => {
        tabs.append(
          el('button', {
            class: 'tab' + (state.phase === p.id ? ' active' : ''),
            text: p.label,
            disabled: p.id === 'recap' && !state.quizDone,
            'aria-current': state.phase === p.id ? 'step' : 'false',
            onclick: () => setPhase(p.id),
          })
        );
      });
    };

    const setPhase = (phase) => {
      if (current && current.destroy) current.destroy();
      current = null;
      TL.clear(main);
      state.phase = phase;
      if (phase === 'story') {
        current = new TL.StoryPlayer(main, storyLesson, { onFinish: () => setPhase(lesson.sandbox ? 'try' : 'quiz') });
      } else if (phase === 'try') {
        const Lab = (TL.labs && TL.labs[lesson.sandbox.type]) || TL.Sandbox;
        current = new Lab(main, lesson, { onFinish: () => setPhase('quiz') });
      } else if (phase === 'quiz') {
        current = new TL.Quiz(main, lesson.quiz, {
          onResult: (stars) => {
            TL.progress.setResult(id, stars);
            state.quizDone = true;
            drawTabs();
          },
          onContinue: () => setPhase('recap'),
        });
      } else renderRecap();
      drawTabs();
      window.scrollTo(0, 0);
      focusMain(main);
    };

    const renderRecap = () => {
      const order = flatLessons();
      const next = order[order.indexOf(id) + 1];
      main.append(
        el(
          'div',
          { class: 'recap' },
          el('h2', { text: 'What you learned' }),
          starsRow(TL.progress.stars(id), true),
          el('ul', {}, lesson.recap.map((r) => el('li', { text: r }))),
          chapter && TL.progress.chapterComplete(chapter.lessons)
            ? el('p', { class: 'badge', text: `Badge earned: ${chapter.title}` })
            : null,
          el(
            'div',
            { class: 'controls center' },
            el('button', { class: 'btn', text: 'Replay lesson', onclick: () => setPhase('story') }),
chapter ? el('a', { class: 'btn', href: `#/chapter/${chapter.id}`, text: 'Chapter overview' }) : null,
            el('a', { class: 'btn', href: '#/', text: 'Chapters' }),
            next ? el('a', { class: 'btn primary', href: `#/lesson/${next}`, text: 'Next lesson' }) : null
          )
        )
      );
    };

    const view = el('div', { class: 'lesson-view' });
    const title = el('h1', { text: lesson.title });
    const cover = lesson.cover ? el('img', { class: 'lesson-cover', src: lesson.cover, alt: lesson.title + ' illustration' }) : null;

    const startLesson = () => {
      if (!view.classList.contains('intro')) return;
      document.removeEventListener('keydown', introKey);
      const snap = (n) => {
        const r = n.getBoundingClientRect();
        return { top: r.top + window.scrollY, h: r.height, fs: getComputedStyle(n).fontSize };
      };
      const from = { title: snap(title), cover: snap(cover) };
      view.classList.remove('intro');
      setPhase('story');
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const to = { title: snap(title), cover: snap(cover) };
      const opts = { duration: 700, easing: 'cubic-bezier(0.22, 0.8, 0.25, 1)' };
      title.animate(
        [
          { transform: `translateY(${from.title.top - to.title.top}px)`, fontSize: from.title.fs },
          { transform: 'translateY(0)', fontSize: to.title.fs },
        ],
        opts
      );
      const coverDy = from.cover.top - to.cover.top - (from.title.h - to.title.h);
      cover.animate(
        [
          { transform: `translateY(${coverDy}px)`, height: from.cover.h + 'px' },
          { transform: 'translateY(0)', height: to.cover.h + 'px' },
        ],
        opts
      );
      [tabs, main].forEach((n) => n.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 450, delay: 300, easing: 'ease-out', fill: 'backwards' }));
    };

    const introKey = (e) => {
      if (!view.isConnected) return document.removeEventListener('keydown', introKey);
      if (e.key === 'Enter' || e.key === 'ArrowRight') {
        e.preventDefault();
        startLesson();
      }
    };

    view.append(
      el('a', { class: 'back', href: chapter ? `#/chapter/${chapter.id}` : '#/', text: chapter ? '← Chapter' : '← Chapters' }),
      el('header', { class: 'lesson-head' }, title),
      ...(cover ? [el('div', { class: 'lesson-hero' }, cover)] : []),
      el(
        'div',
        { class: 'lesson-intro-panel' },
        el('p', { class: 'lesson-hook', text: lesson.hook || '' }),
        el('button', { class: 'btn primary', text: 'Next', onclick: startLesson })
      ),
      tabs,
      main
    );
    app.append(view);
    drawTabs();

    if (cover) {
      view.classList.add('intro');
      document.addEventListener('keydown', introKey);
    } else {
      setPhase('story');
    }
  }

  function route() {
    const hash = window.location.hash || '#/';
    const lessonMatch = /^#\/lesson\/([\w-]+)$/.exec(hash);
    const chapterMatch = /^#\/chapter\/([\w-]+)$/.exec(hash);

    if (lessonMatch) renderLesson(lessonMatch[1]);
    else if (chapterMatch) renderChapter(chapterMatch[1]);
    else if (hash === '#/progress') renderProgress();
    else renderChapters();
    window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', route);
  route();
})(window.TL);





