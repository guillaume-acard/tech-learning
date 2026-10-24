window.TL = window.TL || {};

// More circuit diagrams for the Electronics topic. Registers into the tables exported by visuals.js.
//   water   cases:[{ level:0..1, pipe:0..1, caption }]       tank + pipe analogy (pressure = volts, flow = amps)
//   cells   cases:[{ n:1|2|3, caption }]                      1.5 V cells in a row lighting a 3 V bulb
//   short   cases:[{ on:false|true, caption }]                a bulb, with or without a bare wire across it
//   led     cases:[{ state:'on'|'dim'|'reversed'|'dark'|'noresistor'|'burnt', volts:9, ohms, caption }]   battery, resistor and LED
//   bulbs   cases:[{ mode:'series'|'parallel', out:false|true, volts:6, caption }]   two bulbs, one maybe removed
//   photo   cases:[{ light:0|1|2, caption }]                  photodiode and resistor: more light, more output voltage
//   ir      cases:[{ dist:5..100 (cm), dark:false|true, caption }]   infrared distance sensor and an object; shows the output voltage
//   symbols also has 'photodiode'.
(function (TL) {
  const { SYM, DRAW, CASE_ON, LEGEND, S, W, T, G, dot, part } = TL.circuit;

  const R = (x, y, deg, kids) => S('g', { transform: `translate(${x},${y}) rotate(${deg})` }, kids);
  const svg = (box, label, ...kids) => S('svg', { viewBox: box, class: 'cz-svg', role: 'img', 'aria-label': label }, kids);

  // ---- new symbol: LED (current enters at the top, the triangle points the way it may flow) ----
  SYM.led = (live, state) => [
    W([[0, -20], [0, -10]], live),
    W([[0, 10], [0, 20]], live),
    part('polygon', { points: '-10,-10 10,-10 0,10', class: 'cz-part' + (state === 'burnt' ? ' hot' : state === 'faint' ? ' faint' : state === 'lit' || (live && state === undefined) ? ' lit' : '') }),
    part('line', { x1: -10, y1: 10, x2: 10, y2: 10 }),
    part('line', { x1: 14, y1: -4, x2: 24, y2: -14 }),
    part('line', { x1: 20, y1: 2, x2: 30, y2: -8 }),
    S('polygon', { class: 'cz-arrow', points: '24,-14 18,-12 22,-8' }),
    S('polygon', { class: 'cz-arrow', points: '30,-8 24,-6 28,-2' }),
  ];
  LEGEND.led = ['LED', 'lets current through one way only, and glows'];

  const lamp = (mode) =>
    [
      W([[0, -20], [0, -14]], mode !== 'off'),
      W([[0, 14], [0, 20]], mode !== 'off'),
      S('circle', { r: 14, class: 'cz-part' + (mode === 'lit' ? ' lit' : mode === 'faint' ? ' faint' : mode === 'hot' ? ' hot' : '') }),
      part('line', { x1: -10, y1: -10, x2: 10, y2: 10 }),
      part('line', { x1: 10, y1: -10, x2: -10, y2: 10 }),
    ];

  // ---- water analogy ----
  function drawWater(on, c) {
    const level = c.level == null ? 0.7 : c.level;
    const pipe = c.pipe == null ? 0.6 : c.pipe;
    const flow = level * pipe;
    const half = 4 + pipe * 14;
    const cy = 150;
    const h = Math.round(level * 140);
    const pressure = level > 0.6 ? 'high' : 'low';
    const width = pipe > 0.5 ? 'wide' : 'narrow';
    const amount = flow > 0.55 ? 'lots of water' : flow > 0.25 ? 'some water' : 'a trickle';
    return svg(
      '0 0 360 230',
      `A tank with ${pressure} pressure drains through a ${width} pipe, giving ${amount}`,
      S('rect', { x: 22, y: 150 - h - 10, width: 96, height: h + 40, class: 'cz-fill cz-water' }),
      part('polyline', { points: '22,10 22,190 118,190 118,' + (cy + half) }),
      part('line', { x1: 118, y1: cy - half, x2: 118, y2: 10 }),
      S('rect', { x: 118, y: cy - half, width: 214, height: half * 2, class: 'cz-fill cz-pipe' }),
      S('polyline', { class: 'cz-wire live', points: `122,${cy} 328,${cy}`, style: `stroke-width:${(2 + flow * 8).toFixed(1)}` }),
      S('polyline', { class: 'cz-wire', points: `50,${150 - h - 10} 90,${150 - h - 10}`, style: 'stroke:var(--cyan)' }),
      T(70, 208, 'Pressure (volts)', 'cz-dim', 'middle'),
      T(70, 224, pressure, 'cz-hi', 'middle'),
      T(225, cy - half - 8, `Pipe: ${width}`, 'cz-dim', 'middle'),
      T(225, cy + half + 18, 'Flow (amps)', 'cz-dim', 'middle'),
      T(225, cy + half + 34, amount, 'cz-hi', 'middle')
    );
  }

  // ---- 1.5 V cells in a row ----
  function cellStack(n, live) {
    const H = n * 14;
    const top = -H / 2;
    const out = [W([[0, -50], [0, top + 3]], live), W([[0, top + (n - 1) * 14 + 10], [0, 50]], live)];
    for (let i = 0; i < n; i++) {
      const y = top + i * 14 + 3;
      out.push(part('line', { x1: -14, y1: y, x2: 14, y2: y }), part('line', { x1: -8, y1: y + 7, x2: 8, y2: y + 7 }));
      if (i < n - 1) out.push(W([[0, y + 7], [0, y + 17]], live));
    }
    out.push(T(20, top + 2, '+', 'cz-dim'));
    return out;
  }

  function drawCells(on, c) {
    const n = c.n || 1;
    const volts = n * 1.5;
    const mode = n === 1 ? 'faint' : n === 2 ? 'lit' : 'hot';
    const note = n === 1 ? 'dim: not enough push' : n === 2 ? 'just right' : 'too much: burns out';
    const live = n < 3;
    return svg(
      '0 0 360 220',
      `${n} cell${n > 1 ? 's' : ''} in a row give ${volts} volts: ${note}`,
      W([[60, 60], [60, 40], [300, 40], [300, 90]], live),
      W([[300, 130], [300, 180], [60, 180], [60, 160]], live),
      G(60, 110, cellStack(n, live)),
      G(300, 110, lamp(mode)),
      T(86, 114, `${n} x 1.5 V`, 'cz-dim'),
      T(86, 130, `= ${volts} V`, 'cz-hi'),
      T(280, 114, 'Bulb (3 V)', 'cz-dim', 'end'),
      T(180, 208, note, n === 3 ? 'cz-bad' : n === 2 ? 'cz-hi' : 'cz-dim', 'middle')
    );
  }

  // ---- a short circuit ----
  function drawShort(on) {
    const endX = on ? 250 : 150;
    const hot = on ? 'hot' : '';
    return svg(
      '0 0 360 220',
      on ? 'A bare wire across the bulb gives the current an easy path, so the bulb goes out and the wire heats up' : 'Current flows through the bulb and it lights',
      W([[60, 90], [60, 40], [endX, 40]], true, hot),
      W([[endX, 180], [60, 180], [60, 130]], true, hot),
      on ? W([[250, 40], [250, 180]], true, 'hot') : null,
      on ? [dot(150, 40), dot(150, 180)] : null,
      W([[150, 40], [150, 90]], !on),
      W([[150, 130], [150, 180]], !on),
      G(60, 110, SYM.battery(true)),
      G(150, 110, lamp(on ? 'off' : 'lit')),
      T(80, 114, 'Battery', 'cz-dim'),
      T(162, 76, 'Bulb', 'cz-dim'),
      on ? T(270, 114, 'Bare wire', 'cz-bad') : null,
      on ? T(180, 208, 'Huge current: wire and battery heat up', 'cz-bad', 'middle') : T(180, 208, 'Normal current', 'cz-hi', 'middle')
    );
  }

  // ---- battery, resistor, LED ----
  // state: on | dim (little current) | reversed | dark (battery too weak) | noresistor (burns out) | burnt (resistor too small)
  function drawLed(on, c) {
    const state = c.state || 'on';
    const volts = c.volts || 9;
    const flows = state === 'on' || state === 'dim' || state === 'noresistor';
    const noRes = state === 'noresistor';
    const burnt = state === 'noresistor' || state === 'burnt';
    const ledMode = burnt ? 'burnt' : state === 'on' ? 'lit' : state === 'dim' ? 'faint' : 'off';
    const aria = {
      on: 'The current passes through the resistor and then the LED the right way round, so the LED glows',
      dim: 'Only a little current gets through, so the LED glows faintly',
      reversed: 'The LED is the wrong way round, so it blocks the current and stays dark',
      dark: 'The battery voltage is too low to push current through the LED, so it stays dark',
      noresistor: 'With no resistor the LED receives too much current and burns out',
      burnt: 'The resistor is too small, so too much current flows and the LED burns out',
    };
    const msg = { on: 'LED glows', dim: 'faint glow', reversed: 'wrong way: blocked', dark: 'not enough voltage', noresistor: 'too much current', burnt: 'too much current' };
    return svg(
      '0 0 360 230',
      aria[state],
      W([[60, 90], [60, 40], noRes ? [300, 40] : [120, 40]], flows),
      noRes ? null : W([[180, 40], [300, 40]], flows),
      W([[300, 40], [300, 90]], flows),
      W([[300, 130], [300, 180], [60, 180], [60, 130]], flows),
      G(60, 110, SYM.battery(flows)),
      noRes ? null : R(150, 40, 90, SYM.resistor(flows)),
      G(300, 110, state === 'reversed' ? [R(0, 0, 180, SYM.led(false))] : SYM.led(flows, ledMode)),
      T(80, 114, `${volts} V`, 'cz-hi'),
      noRes ? T(150, 28, 'no resistor', 'cz-bad', 'middle') : T(150, 22, c.ohms ? `Resistor ${c.ohms} ohm` : 'Resistor', 'cz-dim', 'middle'),
      T(280, 114, 'LED', 'cz-dim', 'end'),
      T(180, 125, msg[state], state === 'on' || state === 'dim' ? 'cz-hi' : burnt ? 'cz-bad' : 'cz-dim', 'middle')
    );
  }

  // ---- two bulbs in series or in parallel ----
  function drawBulbs(on, c) {
    const volts = c.volts || 6;
    const parallel = c.mode === 'parallel';
    const out = !!c.out;
    const bulbText = (x, y, v, off) => T(x, y, off ? 'removed' : `${v} V`, off ? 'cz-dim' : 'cz-hi', 'middle');
    if (!parallel) {
      return svg(
        '0 0 360 230',
        out ? 'Bulbs in a row: taking one out opens the loop and both go dark' : 'Two bulbs in a row share the voltage and the same current flows through both',
        W([[60, 90], [60, 40], [130, 40]], !out),
        W([[170, 40], [230, 40]], !out),
        W([[270, 40], [320, 40], [320, 180], [60, 180], [60, 130]], !out),
        G(60, 110, SYM.battery(!out)),
        R(150, 40, 90, lamp(out ? 'off' : 'lit')),
        out ? [part('line', { x1: 230, y1: 40, x2: 238, y2: 40 }), part('line', { x1: 262, y1: 40, x2: 270, y2: 40 }), T(250, 30, 'gap', 'cz-bad', 'middle')] : R(250, 40, 90, lamp('lit')),
        T(80, 114, `${volts} V`, 'cz-hi'),
        T(150, 20, 'Bulb 1', 'cz-dim', 'middle'),
        out ? null : T(250, 20, 'Bulb 2', 'cz-dim', 'middle'),
        T(150, 70, out ? '0 V' : `${volts / 2} V`, out ? 'cz-dim' : 'cz-hi', 'middle'),
        out ? null : T(250, 70, `${volts / 2} V`, 'cz-hi', 'middle'),
        T(190, 208, out ? 'One loop, broken: everything is off' : 'One loop: same current, voltage shared', out ? 'cz-bad' : 'cz-hi', 'middle')
      );
    }
    return svg(
      '0 0 420 230',
      out ? 'Bulbs side by side: taking one out leaves the other lit' : 'Two bulbs side by side each get the full battery voltage',
      W([[60, 90], [60, 40], [310, 40]], true),
      W([[310, 180], [60, 180], [60, 130]], true),
      W([[190, 40], [190, 90]], true),
      W([[190, 130], [190, 180]], true),
      out ? [part('line', { x1: 310, y1: 40, x2: 310, y2: 90 }), part('line', { x1: 310, y1: 130, x2: 310, y2: 180 }), T(310, 114, 'gap', 'cz-bad', 'middle')] : [W([[310, 40], [310, 90]], true), W([[310, 130], [310, 180]], true)],
      dot(190, 40),
      dot(190, 180),
      out ? null : [dot(310, 40), dot(310, 180)],
      G(60, 110, SYM.battery(true)),
      G(190, 110, lamp('lit')),
      out ? null : G(310, 110, lamp('lit')),
      T(80, 114, `${volts} V`, 'cz-hi'),
      T(168, 114, 'Bulb 1', 'cz-dim', 'end'),
      out ? null : T(332, 114, 'Bulb 2', 'cz-dim'),
      T(190, 20, `${volts} V`, 'cz-hi', 'middle'),
      bulbText(310, 20, volts, out),
      T(210, 208, out ? 'Two paths: the other bulb stays lit' : 'Two paths: each bulb gets the full voltage', 'cz-hi', 'middle')
    );
  }

  // ---- photodiode (drawn reverse-biased: current enters at the top, against the triangle) ----
  SYM.photodiode = (live, lit) => [
    W([[0, -20], [0, -10]], live),
    W([[0, 10], [0, 20]], live),
    part('polygon', { points: '-10,10 10,10 0,-10', class: 'cz-part' + (lit ? ' lit' : '') }),
    part('line', { x1: -10, y1: -10, x2: 10, y2: -10 }),
    part('line', { x1: -28, y1: -12, x2: -14, y2: -2 }),
    part('line', { x1: -28, y1: -2, x2: -14, y2: 8 }),
    S('polygon', { class: 'cz-arrow', points: '-14,-2 -21.4,-3.7 -18,-8.5' }),
    S('polygon', { class: 'cz-arrow', points: '-14,8 -21.4,6.3 -18,1.5' }),
  ];
  LEGEND.photodiode = ['Photodiode', 'light on it makes a small current flow'];

  // ---- diode, capacitor, potentiometer, motor ----
  SYM.diode = (live) => [
    W([[0, -20], [0, -10]], live),
    W([[0, 10], [0, 20]], live),
    part('polygon', { points: '-10,-10 10,-10 0,10', class: 'cz-part' + (live ? ' lit' : '') }),
    part('line', { x1: -10, y1: 10, x2: 10, y2: 10 }),
  ];
  LEGEND.diode = ['Diode', 'lets current through one way only'];
  SYM.capacitor = (live) => [
    W([[0, -20], [0, -4]], live),
    W([[0, 4], [0, 20]], live),
    part('line', { x1: -12, y1: -4, x2: 12, y2: -4 }),
    part('line', { x1: -12, y1: 4, x2: 12, y2: 4 }),
  ];
  LEGEND.capacitor = ['Capacitor', 'stores a little charge, then gives it back'];
  SYM.pot = (live) => [
    W([[0, -20], [0, -14]], live),
    W([[0, 14], [0, 20]], live),
    part('rect', { x: -6, y: -14, width: 12, height: 28 }),
    W([[-24, 0], [-6, 0]], live),
    S('polygon', { class: 'cz-arrow', points: '-6,0 -13,-4 -13,4' }),
  ];
  LEGEND.pot = ['Potentiometer', 'a resistor with a sliding contact'];
  SYM.motor = (live) => [
    W([[0, -20], [0, -14]], live),
    W([[0, 14], [0, 20]], live),
    S('circle', { r: 14, class: 'cz-part' + (live ? ' lit' : '') }),
    T(0, 5, 'M', 'cz-hi', 'middle'),
  ];
  LEGEND.motor = ['Motor', 'turns current into spinning'];

  // Typical Sharp-style analog sensor: about 27 / distance volts between 10 and 80 cm.
  // Too close it falls again (it cannot tell 5 cm from 20 cm), too far it sits at a floor, a black surface reads as farther away.
  const IR_NEAR = 10;
  const IR_FAR = 80;
  function irVolts(dist, dark) {
    const eff = dark ? dist * 1.6 : dist;
    if (dist < IR_NEAR) return (27 / IR_NEAR) * (dist / IR_NEAR) * (dark ? 0.6 : 1);
    if (eff > IR_FAR) return 0.3;
    return 27 / eff;
  }

  // ---- photodiode and resistor: the light level becomes a voltage ----
  function drawPhoto(on, c) {
    const light = c.light || 0;
    const volts = [0, 1.5, 4][light];
    const word = ['no light', 'a little light', 'strong light'][light];
    const beams = [];
    for (let i = 0; i < light + (light ? 1 : 0); i++) beams.push(W([[40, 52 + i * 14], [170, 64 + i * 8]], true));
    return svg(
      '0 0 360 230',
      `A photodiode with ${word} on it lets ${light ? 'current' : 'almost no current'} through the resistor, so the output is ${volts} volts`,
      part('line', { x1: 188, y1: 14, x2: 212, y2: 14 }),
      T(220, 18, '+5 V supply', 'cz-dim'),
      W([[200, 14], [200, 50]], light > 0),
      G(200, 70, SYM.photodiode(light > 0, light > 0)),
      W([[200, 90], [200, 130]], light > 0),
      dot(200, 110),
      W([[200, 110], [300, 110]], false, 'sig' + (light === 2 ? ' hi' : '')),
      dot(300, 110),
      T(300, 94, 'Output', '', 'middle'),
      T(300, 134, `${volts} V`, 'cz-bit' + (light === 2 ? ' hi' : ''), 'middle'),
      G(200, 150, SYM.resistor(light > 0)),
      T(220, 154, 'Resistor', 'cz-dim'),
      W([[200, 170], [200, 185]], light > 0),
      G(200, 205, SYM.ground()),
      beams,
      T(100, 100, light ? (light === 2 ? 'strong light' : 'a little light') : 'dark', light ? 'cz-hi' : 'cz-dim', 'middle'),
      T(110, 192, 'Photodiode', 'cz-dim', 'middle')
    );
  }

  // ---- infrared distance sensor: LED on top, lens and position strip below, an object at some distance ----
  function drawIr(on, c) {
    const dist = c.dist || 30;
    const dark = !!c.dark;
    const volts = c.volts != null ? c.volts : irVolts(dist, dark);
    const X = 100 + dist * 2.4;
    const spotY = Math.min(194, 150 + (70 * 34) / (X - 70));
    const tooClose = dist < IR_NEAR;
    const tooFar = !tooClose && (dark ? dist * 1.6 : dist) > IR_FAR;
    const note = tooClose ? 'too close: the reading falls' : tooFar ? 'too far to measure' : dark ? 'black absorbs light: reads as farther' : '';
    return svg(
      '0 0 360 235',
      `An infrared sensor sends light to an object ${dist} centimetres away and reads ${+volts.toFixed(2)} volts${note ? ': ' + note : ''}`,
      S('rect', { x: 10, y: 56, width: 60, height: 148, rx: 4, class: 'cz-fill cz-si' }),
      part('rect', { x: 10, y: 56, width: 60, height: 148, rx: 4 }),
      S('circle', { cx: 70, cy: 80, r: 6, class: 'cz-part lit' }),
      T(18, 84, 'LED', 'cz-dim'),
      S('ellipse', { cx: 70, cy: 150, rx: 4, ry: 14, class: 'cz-part' }),
      S('rect', { x: 30, y: 150, width: 6, height: 46, class: 'cz-fill cz-metal' }),
      S('circle', { cx: 33, cy: spotY, r: 4, class: 'cz-part lit' }),
      T(42, 221, 'Sensor', 'cz-dim', 'middle'),
      S('rect', { x: X, y: 40, width: 8, height: 150, class: 'cz-fill cz-metal' + (dark ? '' : ' on') }),
      T(X + 4, 32, dark ? 'black object' : 'object', 'cz-dim', 'middle'),
      W([[76, 80], [X, 80]], true),
      W([[X, 80], [76, 150]], !dark),
      dist < 15 ? T(X - 5, 72, `${dist} cm`, 'cz-hi', 'end') : T((76 + X) / 2, 72, `${dist} cm`, 'cz-hi', 'middle'),
      T(350, 226, `Output: ${+volts.toFixed(2)} V`, 'cz-hi', 'end'),
      note ? T(350, 212, note, tooClose || tooFar || dark ? 'cz-bad' : 'cz-dim', 'end') : null
    );
  }

  DRAW.water = drawWater;
  DRAW.cells = drawCells;
  DRAW.short = drawShort;
  DRAW.led = drawLed;
  DRAW.bulbs = drawBulbs;
  DRAW.photo = drawPhoto;
  DRAW.ir = drawIr;
  CASE_ON.water = () => true;
  CASE_ON.cells = (c) => (c.n || 1) === 2;
  CASE_ON.short = (c) => !c.on;
  CASE_ON.led = (c) => (c.state || 'on') === 'on' || c.state === 'dim';
  CASE_ON.bulbs = (c) => c.mode === 'parallel' || !c.out;
  CASE_ON.photo = (c) => (c.light || 0) > 0;
  CASE_ON.ir = (c) => !c.dark && (c.dist || 30) >= IR_NEAR && (c.dist || 30) <= IR_FAR;
  TL.circuit.irVolts = irVolts;
})(window.TL);
