TL.registerLesson({
  id: 'components-resistor',
  title: 'Resistors and Ohm\'s law',
  hook: 'The humble resistor is the most common part in electronics. What does it do, and how do you pick the right one?',
  cover: 'img/lessons/components-resistor.png',

  steps: [
    {
      caption:
        'A resistor is a part that makes it harder for current to flow. In the water picture it is a narrow section of pipe. The more resistance, the less current gets through for the same push. Resistance is measured in ohms, written with the Greek letter omega (Ω). Small resistors are tens of ohms, many are thousands (kΩ, kilo-ohms) or millions (MΩ).',
      looksLike: {
        title: 'Real resistors',
        src: 'img/real/resistor.png',
        alt: 'Photo of several small cylindrical resistors with coloured bands and thin metal legs',
        caption: 'Small resistors, with coloured bands that show their value. They are about the size of a grain of rice.',
      },
      cards: [
        {
          kind: 'viz',
          viz: 'circuit',
          diagram: 'hydro',
          title: 'Resistance is a narrow pipe',
          cases: [
            { part: 'resistor', pipe: 'wide', caption: 'Low resistance: lots of current' },
            { part: 'resistor', pipe: 'narrow', caption: 'High resistance: little current' },
          ],
        },
        {
          kind: 'viz',
          viz: 'table',
          title: 'The water picture and the circuit',
          columns: ['Water', 'Electricity'],
          rows: [
            ['Pump', 'Battery'],
            ['Pressure, the push', 'Voltage (volts)'],
            ['Flow of water', 'Current (amps)'],
            ['Narrow pipe', 'Resistor (ohms)'],
          ],
          tone: 'cyan',
        },
        { kind: 'viz', viz: 'circuit', diagram: 'symbols', items: ['resistor'] },
      ],
    },
    {
      caption:
        'The three ideas, voltage, current and resistance, are tied together by Ohm\'s law. Current is voltage divided by resistance: amps = volts / ohms. Double the voltage and the current doubles. Double the resistance and the current is halved. It is written V = I x R, and you can rearrange it to find whichever one you do not know. In the water picture: a stronger pump (more volts) pushes more water, and a narrower pipe (more ohms) lets less through.',
      cards: [
        [
          { t: 'Current', sub: 'amps', tone: 'green' },
          { op: '=' },
          { t: 'Voltage', sub: 'volts', tone: 'cyan' },
          { op: '÷' },
          { t: 'Resistance', sub: 'ohms', tone: 'amber' },
        ],
        {
          kind: 'viz',
          viz: 'table',
          title: 'Ohm\'s law in action',
          columns: ['Voltage', 'Resistance', 'Current'],
          rows: [
            ['9 V', '90 Ω', '0.1 A (100 mA)'],
            ['9 V', '900 Ω', '0.01 A (10 mA)'],
            ['18 V', '900 Ω', '0.02 A (20 mA)'],
            ['5 V', '1000 Ω', '0.005 A (5 mA)'],
          ],
          tone: 'cyan',
          note: 'Ten times the resistance gives a tenth of the current. Twice the voltage gives twice the current.',
        },
      ],
      realLife: 'Ohm\'s law is exact for resistors. It is only approximate for other parts: an LED, for example, does not follow it.',
    },
    {
      caption:
        'A resistor does not make the energy disappear. The energy it takes from the current becomes heat. Its power is volts x amps, as in the power lesson. A resistor with 7 V across it and 15 mA through it gets 7 x 0.015 = 0.1 W, a little warmth. Small resistors are rated for about a quarter of a watt. Ask them for more and they get hot, change colour and fail. Think of water forced through a very narrow pipe: it rubs on the walls and the pipe warms up.',
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'Heat in a resistor',
          columns: ['Across the resistor', 'Current', 'Power as heat', 'Verdict'],
          rows: [
            ['7 V', '15 mA', '0.1 W', 'Fine for a 0.25 W resistor'],
            ['9 V', '90 mA', '0.8 W', 'Too hot: use a bigger one'],
          ],
          cells: [[1, 3]],
          tone: 'amber',
        },
      ],
    },
    {
      caption:
        'Here is the most common job: protecting an LED. A 9 V battery, a red LED that needs 2 V and should get about 15 mA. The LED keeps 2 V for itself, so the resistor has to take the remaining 9 - 2 = 7 V. Ohm\'s law then gives the size: 7 V / 0.015 A = 467 Ω. Resistors only come in standard values, so choose the nearest one, 470 Ω. In the water picture, the LED is a valve that takes 2 units of pressure, so the narrow pipe has to use up the other 7.',
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'Choosing the resistor for an LED',
          columns: ['Step', 'Working', 'Result'],
          rows: [
            ['Battery voltage', '', '9 V'],
            ['Minus the LED forward voltage', '9 V - 2 V', '7 V left for the resistor'],
            ['Wanted current', '', '15 mA = 0.015 A'],
            ['Resistance', '7 V / 0.015 A', '467 Ω'],
            ['Nearest standard value', '', '470 Ω'],
          ],
          highlight: 4,
          tone: 'green',
        },
        {
          kind: 'viz',
          viz: 'circuit',
          diagram: 'led',
          cases: [{ state: 'on', volts: 9, ohms: 470, caption: 'The result: about 15 mA, a healthy glow' }],
        },
      ],
      realLife: 'If you pick a slightly larger resistor, the LED is a bit dimmer but lives forever. If you pick a smaller one, it is brighter but shorter lived. Err on the larger side.',
    },
    {
      caption:
        'Resistors are used for more than protecting LEDs. They set the current in many circuits. They also work in pairs to share a voltage, and as the load that a transistor pulls against: the resistor in the NOT gate from the transistor lesson holds the output high until the transistor pulls it low.',
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'What resistors are for',
          columns: ['Job', 'Example'],
          rows: [
            ['Limit the current', 'in series with an LED'],
            ['Share a voltage', 'two resistors in a row, to get a smaller voltage'],
            ['Hold a wire at a level', 'the resistor in a NOT gate holds the output at 1'],
            ['Make heat on purpose', 'an electric heater or a toaster element'],
          ],
          tone: 'violet',
        },
      ],
    },
  ],

  sandbox: {
    type: 'electric',
    mode: 'led',
    intro: 'Choose the right resistor. The LED needs 2 V and should get between 10 and 20 mA.',
    challenges: [
      { text: 'Use the 9 V battery and pick a resistor that gives 10 to 20 mA.', check: (s) => s.volts === 9 && s.kind === 'on' && s.amps >= 0.01 && s.amps <= 0.0205 },
      { text: 'Now power it from 5 V (like a USB port) and still keep 10 to 20 mA.', check: (s) => s.volts === 5 && s.kind === 'on' && s.amps >= 0.01 && s.amps <= 0.0205 },
      { text: 'Use the 12 V battery and keep the current at 20 mA or less.', check: (s) => s.volts === 12 && s.kind === 'on' && s.amps >= 0.005 && s.amps <= 0.0205 },
    ],
  },

  quiz: [
    {
      type: 'choice',
      q: 'What does a resistor do?',
      options: ['Makes it harder for current to flow', 'Stores electricity', 'Adds voltage', 'Makes light'],
      answer: 0,
      why: 'In the water picture, a resistor is a narrow pipe.',
    },
    {
      type: 'choice',
      q: 'What is the unit of resistance?',
      options: ['The ohm (Ω)', 'The volt (V)', 'The amp (A)', 'The watt (W)'],
      answer: 0,
      why: 'Volts measure the push, amps the flow, ohms the resistance and watts the power.',
    },
    {
      type: 'choice',
      q: 'A 9 V battery is connected across a 900 Ω resistor. What is the current?',
      options: ['10 mA', '100 mA', '1 A', '8100 A'],
      answer: 0,
      why: 'Current = volts / ohms = 9 / 900 = 0.01 A = 10 mA.',
    },
    {
      type: 'choice',
      q: 'You double the resistance and keep the same voltage. What happens to the current?',
      options: ['It is halved', 'It doubles', 'It stays the same', 'It drops to zero'],
      answer: 0,
      why: 'Current = voltage / resistance, so doubling the resistance halves the current.',
    },
    {
      type: 'choice',
      q: 'A 5 V supply lights a 2 V LED at 15 mA. Roughly what resistor do you need?',
      options: ['200 Ω', '20 Ω', '2000 Ω', '2 Ω'],
      answer: 0,
      why: 'The resistor must take 5 - 2 = 3 V. 3 V / 0.015 A = 200 Ω, so use the nearest standard value (220 Ω).',
    },
    {
      type: 'choice',
      q: 'What happens to the energy a resistor takes from the current?',
      options: ['It becomes heat', 'It is stored for later', 'It becomes light', 'It disappears'],
      answer: 0,
      why: 'A resistor turns the energy into heat, which is why a resistor has a power rating.',
    },
    {
      type: 'match',
      q: 'Match each question to the formula that answers it.',
      items: [
        { id: 'i', label: 'What current flows?' },
        { id: 'p', label: 'How much power is used?' },
        { id: 'r', label: 'What resistance do I need?' },
      ],
      targets: [
        { id: 'a', label: 'Volts / ohms' },
        { id: 'b', label: 'Volts x amps' },
        { id: 'c', label: 'Volts / amps' },
      ],
      answer: { i: 'a', p: 'b', r: 'c' },
      why: 'Current = V / R, power = V x I, resistance = V / I.',
    },
  ],

  recap: [
    'A resistor limits current, like a narrow pipe. Resistance is measured in ohms (Ω).',
    'Ohm\'s law: current = voltage / resistance (I = V / R).',
    'More voltage gives more current, more resistance gives less.',
    'A resistor turns the energy it takes into heat, so it has a power rating.',
    'To protect an LED, the resistor takes the leftover voltage: R = (battery voltage - LED voltage) / wanted current.',
  ],
});
