TL.registerLesson({
  id: 'electricity-series-parallel',
  title: 'Series and parallel',
  hook: 'When one old Christmas bulb dies the whole string goes dark, but one dead lamp in your home does not. What is the difference?',
  cover: 'img/lessons/electricity-series-parallel.png',

  steps: [
    {
      caption:
        'Once a circuit has more than one part, you have a choice of how to connect them. In series, the parts are in a row, one after the other: there is only one path for the current. In parallel, the parts are side by side: the current has several paths, one for each part.',
      cards: [
        {
          kind: 'viz',
          viz: 'circuit',
          diagram: 'bulbs',
          title: 'Two ways to wire two bulbs',
          cases: [
            { mode: 'series', caption: 'In series: one path, in a row' },
            { mode: 'parallel', caption: 'In parallel: two paths, side by side' },
          ],
        },
      ],
    },
    {
      caption:
        'In series, the same current flows through every part, because there is only one road. The battery voltage is shared between the parts: two equal bulbs get half each. And if one part is removed or breaks, the road is cut and everything stops. That is exactly why old Christmas lights all went out together.',
      cards: [
        {
          kind: 'viz',
          viz: 'circuit',
          diagram: 'bulbs',
          title: 'In series',
          cases: [
            { mode: 'series', caption: 'Both bulbs get half the voltage' },
            { mode: 'series', out: true, caption: 'Unscrew one: the loop is broken, both go dark' },
          ],
        },
      ],
    },
    {
      caption:
        'In parallel, every part is connected straight across the battery, so each one gets the full voltage. The current splits between the branches and joins up again. If one branch is removed, the others keep working because their own path is untouched. This is how the lamps and sockets in your home are wired.',
      cards: [
        {
          kind: 'viz',
          viz: 'circuit',
          diagram: 'bulbs',
          title: 'In parallel',
          cases: [
            { mode: 'parallel', caption: 'Each bulb gets the full voltage' },
            { mode: 'parallel', out: true, caption: 'Unscrew one: the other stays on' },
          ],
        },
      ],
    },
    {
      caption: 'Here are the rules side by side. The mirror pattern is easy to remember: series shares the voltage and keeps the current, parallel shares the current and keeps the voltage.',
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'Series and parallel',
          columns: ['', 'In series', 'In parallel'],
          rows: [
            ['Paths for the current', 'one', 'one for each part'],
            ['Current', 'the same in every part', 'splits between the parts'],
            ['Voltage', 'shared between the parts', 'the full voltage on each part'],
            ['One part breaks', 'everything stops', 'the others keep working'],
            ['Seen in', 'a string of old lights, a switch with its lamp', 'house wiring, car lights'],
          ],
          tone: 'cyan',
        },
      ],
    },
    {
      caption:
        'Resistors combine too. A resistor is a part that limits the current, and its resistance is measured in ohms (Ω). In series the resistance adds up: the current has to squeeze through one narrow pipe after another. In parallel the current has more paths, like adding pipes side by side, so the total resistance goes down, and it is always smaller than the smallest one.',
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'Two resistors together',
          columns: ['Wiring', 'Total resistance', 'Example with two 100 Ω'],
          rows: [
            ['In series', 'R1 + R2', '200 Ω'],
            ['In parallel', '1 / (1/R1 + 1/R2)', '50 Ω'],
          ],
          tone: 'amber',
          note: 'Two equal resistors in parallel always give half the value of one.',
        },
      ],
    },
    {
      caption:
        'Batteries can be combined too. Cells in series add their voltages, so the push grows: 3 x 1.5 V is 4.5 V. Cells in parallel keep the same voltage but share the work, so the battery lasts longer. Torches and remotes put cells in series. Power banks use both.',
      cards: [
        {
          kind: 'viz',
          viz: 'circuit',
          diagram: 'cells',
          cases: [
            { n: 2, caption: 'Two cells in series: 3 V' },
            { n: 3, caption: 'Three cells in series: 4.5 V' },
          ],
        },
        {
          kind: 'viz',
          viz: 'table',
          title: 'Cells combined',
          columns: ['', 'Voltage', 'Lasts'],
          rows: [
            ['One cell', '1.5 V', 'normal'],
            ['Two in series', '3 V', 'normal'],
            ['Two in parallel', '1.5 V', 'twice as long'],
          ],
          tone: 'violet',
        },
      ],
    },
    {
      caption:
        'A very common series circuit is an LED with its resistor, which the next chapter explains. They sit in a row, so the same current goes through both, and the battery voltage is split between them. The LED takes about 2 V and the resistor takes the rest. That is also why the resistor protects the LED: whatever limits the current in the resistor limits it in the LED too.',
      cards: [
        {
          kind: 'viz',
          viz: 'circuit',
          diagram: 'led',
          cases: [{ state: 'on', volts: 9, ohms: 470, caption: 'Series: the LED takes 2 V, the resistor takes 7 V, the same 15 mA flows through both' }],
        },
      ],
    },
  ],

  sandbox: {
    type: 'electric',
    mode: 'bulbs',
    intro: 'Rewire the bulbs and unscrew one to see what happens.',
  },

  quiz: [
    {
      type: 'choice',
      q: 'Two bulbs are in series and one is unscrewed. What happens to the other?',
      options: ['It goes out, because the loop is broken', 'It gets brighter', 'It stays on', 'It gets half as bright'],
      answer: 0,
      why: 'In series there is only one path. Removing one bulb breaks it.',
    },
    {
      type: 'choice',
      q: 'Two bulbs are in parallel and one is unscrewed. What happens to the other?',
      options: ['It stays on', 'It goes out', 'It explodes', 'It flickers forever'],
      answer: 0,
      why: 'Each bulb has its own path across the battery.',
    },
    {
      type: 'choice',
      q: 'Two identical bulbs in series on a 6 V battery. How much voltage does each bulb get?',
      options: ['3 V', '6 V', '12 V', '1 V'],
      answer: 0,
      why: 'In series the voltage is shared. Two equal bulbs get half each.',
    },
    {
      type: 'choice',
      q: 'Two identical bulbs in parallel on a 6 V battery. How much voltage does each bulb get?',
      options: ['6 V', '3 V', '12 V', '0 V'],
      answer: 0,
      why: 'In parallel each bulb is connected straight across the battery.',
    },
    {
      type: 'choice',
      q: 'How are the sockets in a house wired?',
      options: ['In parallel, so each gets the full voltage and one can be off without affecting the others', 'In series, so they share the voltage', 'Both at once', 'They are not connected'],
      answer: 0,
      why: 'Parallel wiring gives every appliance the full mains voltage, independent of the others.',
    },
    {
      type: 'choice',
      q: 'You connect a 100 Ω and a 200 Ω resistor in series. What is the total?',
      options: ['300 Ω', '100 Ω', '67 Ω', '20 000 Ω'],
      answer: 0,
      why: 'In series, resistances add: 100 + 200 = 300 Ω.',
    },
    {
      type: 'match',
      q: 'Which description fits which wiring?',
      items: [
        { id: 's1', label: 'One path, the same current everywhere' },
        { id: 'p1', label: 'Several paths, the full voltage on each part' },
        { id: 's2', label: 'One broken part stops everything' },
        { id: 'p2', label: 'One broken part does not affect the others' },
      ],
      targets: [
        { id: 'series', label: 'Series' },
        { id: 'parallel', label: 'Parallel' },
      ],
      answer: { s1: 'series', p1: 'parallel', s2: 'series', p2: 'parallel' },
      why: 'Series is one road that is easily cut. Parallel gives each part its own road.',
    },
  ],

  recap: [
    'In series, parts are in a row: one path, the same current everywhere, and the voltage is shared.',
    'In parallel, parts are side by side: each gets the full voltage and the current is shared.',
    'Break one part in series and everything stops. In parallel, the others keep working.',
    'Resistors in series add up. In parallel the total resistance goes down.',
    'Cells in series add their voltages. An LED and its resistor are a series circuit.',
  ],
});
