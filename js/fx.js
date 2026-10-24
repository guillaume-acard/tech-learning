// Ambient background: a few small, slow, glowing particles drifting upward on a fixed canvas behind the page.
(function () {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const canvas = document.createElement('canvas');
  canvas.id = 'fx-particles';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');
  const COLORS = ['56,232,255', '56,232,255', '255,60,200', '140,110,255'];
  let w = 0, h = 0, dpr = 1, parts = [], last = 0, raf = 0;

  const make = (anywhere) => ({
    x: Math.random() * w,
    y: anywhere ? Math.random() * h : h + 10,
    r: 0.6 + Math.random() * 1.4,
    vx: (Math.random() - 0.5) * 6,
    vy: -(3 + Math.random() * 9),
    a: 0.15 + Math.random() * 0.35,
    tw: Math.random() * Math.PI * 2,
    c: COLORS[Math.floor(Math.random() * COLORS.length)],
  });

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.max(25, Math.min(70, Math.round((w * h) / 22000)));
    while (parts.length < n) parts.push(make(true));
    parts.length = n;
  }

  function frame(t) {
    const dt = Math.min(0.05, (t - last) / 1000 || 0);
    last = t;
    ctx.clearRect(0, 0, w, h);
    parts.forEach((p, i) => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.tw += dt * 0.8;
      if (p.y < -10 || p.x < -10 || p.x > w + 10) parts[i] = make(false);
      const alpha = p.a * (0.65 + 0.35 * Math.sin(p.tw));
      ctx.beginPath();
      ctx.fillStyle = `rgba(${p.c},${alpha})`;
      ctx.shadowColor = `rgba(${p.c},${alpha})`;
      ctx.shadowBlur = 6;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    raf = requestAnimationFrame(frame);
  }

  resize();
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', () => {
    cancelAnimationFrame(raf);
    if (!document.hidden) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  });
  raf = requestAnimationFrame(frame);
})();
