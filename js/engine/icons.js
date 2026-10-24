window.TL = window.TL || {};

(function (TL) {
  const s = TL.svg;
  const line = (attrs) => s('path', Object.assign({ class: 'ic' }, attrs));
  const rect = (x, y, w, h, rx = 3) => s('rect', { class: 'ic', x, y, width: w, height: h, rx });
  const dot = (cx, cy, r = 2.5) => s('circle', { class: 'ic-dot', cx, cy, r });

  // Each icon is drawn in a 64x64 box centred on (0,0). Styling lives in CSS (.ic, .ic-dot).
  TL.icons = {
    router: () => [
      line({ d: 'M-16 6 L-22 -22 M16 6 L22 -22' }),
      rect(-28, 6, 56, 20, 4),
      dot(-14, 16),
      dot(0, 16),
      dot(14, 16),
    ],
    desktop: () => [rect(-26, -26, 52, 34, 3), line({ d: 'M0 8 V20 M-14 22 H14' }), line({ d: 'M-20 -20 L-12 -20' })],
    laptop: () => [rect(-21, -24, 42, 28, 3), line({ d: 'M-30 10 H30 L24 20 H-24 Z' })],
    globe: () => [
      s('circle', { class: 'ic', cx: 0, cy: 0, r: 24 }),
      s('ellipse', { class: 'ic', cx: 0, cy: 0, rx: 10, ry: 24 }),
      line({ d: 'M-24 0 H24 M-20 -12 Q0 -6 20 -12 M-20 12 Q0 6 20 12' }),
    ],
    tv: () => [rect(-28, -24, 56, 38, 3), line({ d: 'M-12 22 H12 M0 14 V22' }), line({ d: 'M-20 -16 L-8 -16' })],
    tvbox: () => [rect(-26, -10, 52, 22, 3), dot(-16, 1), dot(-8, 1), line({ d: 'M2 1 H20' }), line({ d: 'M-20 16 V20 M20 16 V20' })],
    switch: () => [
      rect(-30, -14, 60, 28, 6),
      rect(-16, -10, 32, 20, 2),
      s('circle', { class: 'ic', cx: -23, cy: -4, r: 3 }),
      s('circle', { class: 'ic', cx: 23, cy: 4, r: 3 }),
    ],
    phone: () => [rect(-13, -26, 26, 52, 5), line({ d: 'M-4 -21 H4' }), dot(0, 20, 2)],
    watch: () => [
      line({ d: 'M-8 -14 L-6 -28 H6 L8 -14 M-8 14 L-6 28 H6 L8 14' }),
      rect(-14, -14, 28, 28, 7),
      line({ d: 'M0 -6 V0 L6 4' }),
    ],
    tower: () => [
      dot(0, -14, 3.5),
      line({ d: 'M-12 -24 A16 16 0 0 0 -12 -4 M12 -24 A16 16 0 0 1 12 -4' }),
      line({ d: 'M-20 -30 A26 26 0 0 0 -20 2 M20 -30 A26 26 0 0 1 20 2' }),
      line({ d: 'M0 -8 L-12 26 M0 -8 L12 26 M-7 10 H7 M-10 18 H10' }),
    ],
    cpu: () => [
      rect(-16, -16, 32, 32, 3),
      rect(-7, -7, 14, 14, 2),
      line({ d: 'M-8 -16 V-24 M0 -16 V-24 M8 -16 V-24 M-8 16 V24 M0 16 V24 M8 16 V24' }),
      line({ d: 'M-16 -8 H-24 M-16 0 H-24 M-16 8 H-24 M16 -8 H24 M16 0 H24 M16 8 H24' }),
    ],
    transistor: () => [
      line({ d: 'M-28 0 H-8 M8 -16 V-28 M8 16 V28 M-8 -12 V12 M8 -16 V16 M-8 0 H8 M8 0 L20 -12 M8 0 L20 12' }),
      dot(-28, 0, 2.5),
      dot(8, -28, 2.5),
      dot(8, 28, 2.5),
    ],
    ram: () => [
      rect(-30, -12, 60, 24, 3),
      rect(-24, -6, 10, 12, 1),
      rect(-5, -6, 10, 12, 1),
      rect(14, -6, 10, 12, 1),
      line({ d: 'M-26 12 V20 M-18 12 V20 M-10 12 V20 M-2 12 V20 M6 12 V20 M14 12 V20 M22 12 V20' }),
    ],
    disk: () => [
      rect(-26, -22, 52, 44, 5),
      s('circle', { class: 'ic', cx: -2, cy: -2, r: 13 }),
      line({ d: 'M-2 -2 L16 -14' }),
      dot(-2, -2, 2.5),
      dot(18, 14, 2),
    ],
    gpu: () => [
      rect(-30, -14, 60, 28, 3),
      s('circle', { class: 'ic', cx: -8, cy: 0, r: 9 }),
      s('circle', { class: 'ic', cx: 14, cy: 0, r: 6 }),
      line({ d: 'M-26 14 V22 M-18 14 V22 M-10 14 V22' }),
    ],
    screen: () => [rect(-30, -22, 60, 38, 3), line({ d: 'M-8 22 H8 M0 16 V22' }), line({ d: 'M-22 -12 H-6 M-22 -4 H8 M-22 4 H-2' })],
    keyboard: () => [
      rect(-30, -14, 60, 28, 4),
      line({ d: 'M-22 -6 H-18 M-12 -6 H-8 M-2 -6 H2 M8 -6 H12 M18 -6 H22 M-22 2 H-18 M-12 2 H-8 M-2 2 H2 M8 2 H12 M18 2 H22 M-14 9 H14' }),
    ],
    mouse: () => [rect(-14, -24, 28, 48, 14), line({ d: 'M0 -24 V-6 M-14 -6 H14' })],
    server: () => [
      rect(-22, -26, 44, 15, 3),
      rect(-22, -7, 44, 15, 3),
      rect(-22, 12, 44, 15, 3),
      dot(-14, -18.5, 2),
      dot(-14, 0.5, 2),
      dot(-14, 19.5, 2),
      line({ d: 'M-4 -18.5 H14 M-4 0.5 H14 M-4 19.5 H14' }),
    ],
    book: () => [
      rect(-26, -22, 52, 44, 3),
      line({ d: 'M0 -22 V22 M-19 -10 H-7 M-19 0 H-7 M-19 10 H-7 M7 -10 H19 M7 0 H19' }),
    ],
    cert: () => [
      rect(-28, -20, 56, 40, 4),
      s('circle', { class: 'ic', cx: -14, cy: -4, r: 7 }),
      line({ d: 'M-18 2 L-20 14 L-14 10 L-8 14 L-10 2' }),
      line({ d: 'M0 -10 H20 M0 -2 H16 M0 6 H20' }),
    ],
    spy: () => [
      line({ d: 'M-18 -8 H18 M-11 -8 L-8 -24 H8 L11 -8' }),
      line({ d: 'M-14 -2 H14 V12 Q14 22 0 24 Q-14 22 -14 12 Z' }),
      line({ d: 'M-9 4 H-3 M3 4 H9' }),
    ],
    envelope: () => [rect(-24, -16, 48, 32, 3), line({ d: 'M-24 -16 L0 4 L24 -16' })],
    padlock: () => [rect(-14, -2, 28, 22, 3), line({ d: 'M-8 -2 V-10 A8 8 0 0 1 8 -10 V-2' }), dot(0, 9, 2.5)],
    padlockOpen: () => [rect(-14, -2, 28, 22, 3), line({ d: 'M-8 -2 V-12 A8 8 0 0 1 8 -12 V-9' }), dot(0, 9, 2.5)],
    key: () => [s('circle', { class: 'ic', cx: -14, cy: 0, r: 8 }), line({ d: 'M-6 0 H24 M16 0 V9 M23 0 V7' })],
    chest: () => [rect(-24, -2, 48, 22, 3), line({ d: 'M-24 -2 Q-24 -20 0 -20 Q24 -20 24 -2 M-24 6 H24' }), rect(-5, 2, 10, 9, 2)],
    chestOpen: () => [rect(-24, 2, 48, 20, 3), line({ d: 'M-24 2 L-18 -20 H18 L24 2' }), dot(0, 12, 2.5)],
    person: () => [s('circle', { class: 'ic', cx: 0, cy: -12, r: 10 }), line({ d: 'M-20 24 V16 Q-20 4 0 4 Q20 4 20 16 V24 Z' })],
    neural: () => [
      line({
        d: 'M-20 -8 L0 -16 M-20 -8 L0 0 M-20 -8 L0 16 M-20 8 L0 -16 M-20 8 L0 0 M-20 8 L0 16 M0 -16 L20 -8 M0 0 L20 -8 M0 16 L20 -8 M0 -16 L20 8 M0 0 L20 8 M0 16 L20 8',
      }),
      dot(-20, -8, 4),
      dot(-20, 8, 4),
      dot(0, -16, 4),
      dot(0, 0, 4),
      dot(0, 16, 4),
      dot(20, -8, 4),
      dot(20, 8, 4),
    ],
    app: () => [rect(-26, -22, 52, 44, 4), line({ d: 'M-26 -10 H26 M-16 2 H16 M-16 11 H6' }), dot(-20, -16, 1.8), dot(-13, -16, 1.8)],
    wrench: () => [line({ d: 'M-22 22 L4 -4' }), s('circle', { class: 'ic', cx: 11, cy: -11, r: 12 }), line({ d: 'M5 -23 L11 -11 L23 -17' })],
    calc: () => [
      rect(-18, -26, 36, 52, 4),
      rect(-12, -20, 24, 10, 1),
      dot(-9, 0, 2),
      dot(0, 0, 2),
      dot(9, 0, 2),
      dot(-9, 8, 2),
      dot(0, 8, 2),
      dot(9, 8, 2),
      dot(-9, 16, 2),
      dot(0, 16, 2),
      dot(9, 16, 2),
    ],
    cloud: () => [line({ d: 'M-22 8 H20 A9 9 0 0 0 18 -10 A14 14 0 0 0 -8 -16 A14 14 0 0 0 -22 8 Z' }), line({ d: 'M-12 14 L-15 22 M0 14 L-3 22 M12 14 L9 22' })],
    folder: () => [line({ d: 'M-26 -14 H-8 L-2 -8 H26 V20 H-26 Z M-26 -2 H26' })],
    chat: () => [rect(-26, -22, 52, 32, 6), line({ d: 'M-10 10 L-14 22 L2 10' }), dot(-10, -6, 2.5), dot(0, -6, 2.5), dot(10, -6, 2.5)],
    wifi: () => [
      line({ d: 'M-25.5 -7.5 A36 36 0 0 1 25.5 -7.5' }),
      line({ d: 'M-18.4 -0.4 A26 26 0 0 1 18.4 -0.4' }),
      line({ d: 'M-11.3 6.7 A16 16 0 0 1 11.3 6.7' }),
      dot(0, 20, 3),
    ],
    generic: () => [rect(-22, -22, 44, 44, 6)],
  };

  // One colour/line style per kind of link, reused in every scene.
  // data:false means the cable carries picture/sound, not internet traffic.
  TL.linkTypes = {
    fibre: { name: 'Optical fibre', color: '#ffa31a', width: 6, dash: '' },
    lan: { name: 'LAN cable', color: '#39ff88', width: 5, dash: '' },
    wifi: { name: 'Wi-Fi', color: '#38bdf8', width: 4, dash: '3 9' },
    hdmi: { name: 'HDMI cable', color: '#c084fc', width: 5, dash: '', data: false, cutNote: 'The picture and sound stop, but the internet connection is not affected.' },
    mobile: { name: '4G', color: '#ff4d6d', width: 4, dash: '2 8' },
    backbone: { name: 'Operator network', color: '#64748b', width: 5, dash: '' },
    voice: { name: 'Phone calls', color: '#22c55e', width: 4, dash: '' },
    bus: { name: 'Data path', color: '#38e8ff', width: 5, dash: '' },
    usb: { name: 'USB', color: '#a3e635', width: 4, dash: '' },
    tap: { name: 'Listening in', color: '#ff4d6d', width: 3, dash: '6 6', data: false },
    trust: { name: 'Trusted list', color: '#c084fc', width: 3, dash: '2 8', data: false },
    chat: { name: 'Messages', color: '#e2e8f0', width: 4, dash: '2 6' },
    model: { name: 'Model request', color: '#e879f9', width: 4, dash: '' },
    tool: { name: 'Tool call', color: '#2dd4bf', width: 4, dash: '' },
  };
})(window.TL);
