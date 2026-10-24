// Occasional electrical-interference glitch on titles and boxes, done with the Web Animations API
// (it stacks on top of the existing CSS animations and leaves no classes or styles behind).
(function () {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!Element.prototype.animate) return;

  const TEXT = 'h1, h2, h3, .part-title, .lesson-card-title';
  const BOX = '.stage, .caption, .lab-panel, .goal, .chapter, .lesson-card, .chapter-card';
  const MAG = '255,60,200';
  const CYAN = '56,232,255';
  const rand = (a, b) => a + Math.random() * (b - a);
  const sign = () => (Math.random() < 0.5 ? -1 : 1);
  const jump = { easing: 'steps(1, end)', composite: 'add' };

  const glitchText = (el) => {
    const d = () => Math.round(rand(2, 5)) * sign();
    const shadow = (x) => `${x}px 0 rgba(${MAG},0.85), ${-x}px 0 rgba(${CYAN},0.85)`;
    const slice = () => {
      const top = Math.round(rand(0, 40));
      return `inset(${top}% -12px ${Math.round(rand(0, 55 - top))}% -12px)`;
    };
    const x1 = d(), x2 = d(), x3 = d();
    el.animate(
      [
        { ...jump, offset: 0, translate: '0 0', textShadow: shadow(0) },
        { ...jump, offset: 0.14, translate: `${x1}px 0`, textShadow: shadow(x1), clipPath: slice() },
        { ...jump, offset: 0.3, translate: `${-x1}px 0`, textShadow: shadow(-x2), clipPath: 'inset(0 -12px 0 -12px)' },
        { ...jump, offset: 0.46, translate: `${x2}px 0`, textShadow: shadow(x2), clipPath: slice(), opacity: 0.8 },
        { ...jump, offset: 0.62, translate: '0 0', textShadow: shadow(x3), clipPath: 'inset(0 -12px 0 -12px)', opacity: 1 },
        { ...jump, offset: 0.8, translate: `${-x3}px 0`, textShadow: shadow(0) },
        { ...jump, offset: 1, translate: '0 0', textShadow: shadow(0) },
      ],
      { duration: Math.round(rand(220, 380)) }
    );
  };

  const glitchBox = (el) => {
    const x = Math.round(rand(2, 5)) * sign();
    const edge = (v) => `${v}px 0 0 rgba(${MAG},0.55), ${-v}px 0 0 rgba(${CYAN},0.55)`;
    el.animate(
      [
        { ...jump, offset: 0, translate: '0 0', boxShadow: edge(0) },
        { ...jump, offset: 0.12, translate: `${x}px 0`, boxShadow: edge(x), opacity: 0.8 },
        { ...jump, offset: 0.24, translate: `${x * 2}px 0`, boxShadow: edge(x), filter: 'brightness(1.5)', opacity: 1 },
        { ...jump, offset: 0.34, translate: `${-x}px 0`, boxShadow: edge(-x), filter: 'brightness(1)' },
        { ...jump, offset: 0.6, translate: '0 0', boxShadow: edge(x), opacity: 0.88 },
        { ...jump, offset: 0.75, translate: `${-x}px 0`, boxShadow: edge(0), opacity: 1 },
        { ...jump, offset: 1, translate: '0 0', boxShadow: edge(0) },
      ],
      { duration: Math.round(rand(200, 320)) }
    );
  };

  const onScreen = (el) => {
    const r = el.getBoundingClientRect();
    return r.width > 20 && r.height > 12 && r.bottom > 0 && r.top < window.innerHeight;
  };
  const pick = (selector) => {
    const list = Array.prototype.filter.call(document.querySelectorAll(selector), onScreen);
    return list.length ? list[Math.floor(Math.random() * list.length)] : null;
  };

  const fire = () => {
    const t = pick(TEXT);
    if (t) glitchText(t);
    if (Math.random() < 0.4) {
      const b = pick(BOX);
      if (b) setTimeout(() => glitchBox(b), Math.round(rand(0, 160)));
    }
    if (Math.random() < 0.15) setTimeout(() => t && glitchText(t), 330);
  };

  const loop = () => {
    if (!document.hidden) fire();
    setTimeout(loop, rand(7000, 16000));
  };
  setTimeout(loop, 4000);

  const cooldown = new WeakMap();
  document.addEventListener('pointerover', (e) => {
    const card = e.target.closest && e.target.closest('.lesson-card, .chapter-card');
    if (!card || (e.relatedTarget && card.contains(e.relatedTarget))) return;
    const now = performance.now();
    if (now - (cooldown.get(card) || 0) < 6000) return;
    cooldown.set(card, now);
    glitchBox(card);
    const title = card.querySelector('h2, h3');
    if (title) glitchText(title);
  });
})();
