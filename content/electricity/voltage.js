TL.registerLesson({
  id: 'electricity-voltage',
  title: 'Voltage: the electrical push',
  hook: 'A battery says 1.5 V and a wall socket says 230 V. What is a volt, and why does it matter?',
  cover: 'img/lessons/electricity-voltage.png',

  steps: [
    {
      caption:
        'Every wire is full of tiny charged particles that are free to move. On their own they just wander. To make them flow in one direction you need a push. That push is called voltage. A good way to picture it is water: voltage is like the water pressure. A tank filled high pushes hard, a tank that is almost empty pushes gently.',
      cards: [
        {
          kind: 'viz',
          viz: 'circuit',
          diagram: 'water',
          title: 'Same pipe, different pressure',
          cases: [
            { level: 0.3, pipe: 0.5, caption: 'Low pressure (low voltage): a gentle push' },
            { level: 1, pipe: 0.5, caption: 'High pressure (high voltage): a strong push' },
          ],
        },
      ],
      realLife: 'Electricity is the movement of charge, which in a metal wire means electrons. The water picture is an analogy: it is not what is really inside the wire, but it gets the behaviour right.',
    },
    {
      caption: 'Voltage is measured in volts, written V. The water picture gives you a small dictionary that we will use in all the electricity lessons.',
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'Water and electricity side by side',
          columns: ['With water', 'With electricity', 'Unit'],
          rows: [
            ['Pressure that pushes the water', 'Voltage', 'volt (V)'],
            ['Amount of water flowing', 'Current', 'ampere, amp (A)'],
            ['A narrow pipe that slows the flow', 'Resistance', 'ohm'],
            ['A pump that lifts the water up', 'A battery or power supply', ''],
          ],
          highlight: 0,
          tone: 'cyan',
          note: 'This lesson is about the first row. Current and resistance have their own lessons.',
        },
      ],
    },
    {
      caption: 'Different things use very different voltages. A bigger voltage is a bigger push. Tiny chips need only a little. The wall socket pushes much harder than a battery, which is also why it is far more dangerous.',
      looksLike: {
        title: 'Batteries of different sizes',
        src: 'img/real/batteries.png',
        alt: 'A coin cell, an AA cell, a 9 volt battery and a large car battery side by side on a table',
        caption: 'From the left: a coin cell (3 V), an AA cell (1.5 V), a 9 V battery and a car battery (12 V). The size says how much energy they hold, the number on them says the push.',
      },
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'Voltages around you',
          columns: ['Where', 'Voltage'],
          rows: [
            ['Inside a modern computer chip', 'about 1 V'],
            ['AA or AAA battery', '1.5 V'],
            ['Phone battery', 'about 3.7 V'],
            ['USB port', '5 V'],
            ['Car battery', '12 V'],
            ['Wall socket in Europe', '230 V'],
            ['Wall socket in the USA', '120 V'],
            ['Long-distance power lines', '100 000 V and more'],
          ],
          tone: 'amber',
        },
      ],
      realLife: 'Voltages above roughly 50 V can be dangerous to touch. Never experiment with the wall socket: all the circuits in these lessons use batteries.',
    },
    {
      caption:
        'You can raise the voltage by putting batteries in a row, one after the other. Their pushes add up: two 1.5 V cells give 3 V, three give 4.5 V. This matters when a part is made for a certain voltage. Here is a small bulb made for 3 V. Too little push and it glows weakly. Too much and it burns out.',
      looksLike: {
        title: 'Batteries in a row',
        src: 'img/real/batteries-in-series.png',
        alt: 'Three AA batteries lying end to end in a single row on a table',
        caption: 'Cells placed end to end, plus touching minus, add their voltages. A torch with three cells works this way.',
      },
      cards: [
        {
          kind: 'viz',
          viz: 'circuit',
          diagram: 'cells',
          title: 'Cells in a row add their voltages',
          cases: [
            { n: 1, caption: '1.5 V: too weak' },
            { n: 2, caption: '3 V: just right' },
            { n: 3, caption: '4.5 V: too much' },
          ],
        },
      ],
      realLife: 'A 9 V battery is not one big cell. Inside it are six small 1.5 V cells in a row.',
    },
    {
      caption:
        'Voltage is always measured between two points, like the height difference between the top and the bottom of a slide. A battery has a plus side and a minus side, and 1.5 V is the difference between them. The minus side is usually treated as the zero point, 0 V, also called ground. When someone says "this wire is at 5 V", they mean 5 V compared with ground.',
      cards: [
        [
          { t: '+ side', sub: 'at 1.5 V', tone: 'amber' },
          { op: 'minus' },
          { t: '- side', sub: 'at 0 V (ground)', tone: 'cyan' },
          { op: '=' },
          { t: '1.5 V', sub: 'the voltage', tone: 'green' },
        ],
      ],
      realLife: 'A bird can sit on a bare power line without harm because both its feet are at the same voltage. There is no difference between them, so there is no push through its body.',
    },
    {
      caption:
        'A push alone does not make anything flow. A battery on a shelf has a voltage between its two ends, but nothing moves, like a closed tap on a full tank. Water only flows when the path is complete. In the same way, current only flows when the wires make a complete loop from one side of the battery back to the other.',
      cards: [
        {
          kind: 'viz',
          viz: 'circuit',
          diagram: 'switch',
          title: 'The same voltage, with and without a loop',
          cases: [
            { on: false, caption: 'Voltage is there, the loop is open: nothing flows' },
            { on: true, caption: 'The loop is closed: current flows' },
          ],
        },
      ],
    },
  ],

  sandbox: {
    type: 'electric',
    mode: 'cells',
    intro: 'This bulb needs 3 V. Add and remove 1.5 V cells and watch what the voltage does.',
  },

  quiz: [
    {
      type: 'choice',
      q: 'What does voltage measure?',
      options: ['The push that makes charge move', 'How much charge flows each second', 'How long a wire is', 'How hot a wire gets'],
      answer: 0,
      why: 'Voltage is the electrical push, like water pressure. How much flows each second is the current.',
    },
    {
      type: 'choice',
      q: 'You put two 1.5 V cells in a row. What voltage do you get?',
      options: ['3 V', '1.5 V', '0.75 V', '2.25 V'],
      answer: 0,
      why: 'Cells in a row add their voltages: 1.5 + 1.5 = 3 V.',
    },
    {
      type: 'choice',
      q: 'A battery sits on a table, not connected to anything. What is true?',
      options: ['It has a voltage between its ends, but no current flows', 'Current flows, but there is no voltage', 'Nothing at all is there', 'It is at 0 V'],
      answer: 0,
      why: 'The push exists, but without a complete loop nothing can flow.',
    },
    {
      type: 'choice',
      q: 'In the water picture, what does voltage match?',
      options: ['The water pressure', 'The width of the pipe', 'The amount of water in the pipe per second', 'The colour of the water'],
      answer: 0,
      why: 'Voltage is the pressure, current is the flow, resistance is the narrow pipe.',
    },
    {
      type: 'choice',
      q: 'Which voltage does a USB port give?',
      options: ['5 V', '230 V', '0.5 V', '5000 V'],
      answer: 0,
      why: 'USB is 5 V, a small and safe voltage that is enough for phones and many small devices.',
    },
    {
      type: 'choice',
      q: 'A bulb made for 3 V is connected to three 1.5 V cells in a row. What happens?',
      options: ['It gets too much push and can burn out', 'It glows dimly', 'It works perfectly', 'Nothing, because voltage is harmless'],
      answer: 0,
      why: '3 x 1.5 = 4.5 V, well above the 3 V the bulb was made for.',
    },
    {
      type: 'match',
      q: 'Match each part of the water picture to its electrical twin.',
      items: [
        { id: 'pressure', label: 'The pressure in the tank' },
        { id: 'flow', label: 'The water flowing in the pipe' },
        { id: 'pump', label: 'The pump that lifts the water' },
      ],
      targets: [
        { id: 'voltage', label: 'Voltage' },
        { id: 'current', label: 'Current' },
        { id: 'battery', label: 'Battery' },
      ],
      answer: { pressure: 'voltage', flow: 'current', pump: 'battery' },
      why: 'Pressure is voltage, flow is current, and the pump that keeps the push going is the battery.',
    },
  ],

  recap: [
    'Voltage is the electrical push that moves charge, measured in volts (V). Think of it as water pressure.',
    'Voltage is measured between two points. Ground is the usual 0 V reference.',
    'Cells in a row add their voltages: two 1.5 V cells make 3 V.',
    'A part is made for a certain voltage: too little and it does not work well, too much and it can burn out.',
    'A voltage alone does not make anything move. Current only flows round a complete loop.',
  ],
});
