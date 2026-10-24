TL.registerLesson({
  id: 'electricity-circuit',
  title: 'Circuits: a loop for current',
  hook: 'Every electronic device, from a torch to a computer, is built on one idea: a complete loop. What does a simple circuit need?',
  cover: 'img/lessons/electricity-circuit.png',

  steps: [
    {
      caption:
        'A circuit is a closed loop that current can travel round. The simplest useful one has three kinds of part. A source gives the push (a battery). Wires give the path. A load is the part that uses the energy and does something useful, such as a lamp that turns it into light.',
      cards: [
        [
          { t: 'Source', sub: 'battery: the push', tone: 'amber' },
          { op: '→' },
          { t: 'Wires', sub: 'the path', tone: 'cyan' },
          { op: '→' },
          { t: 'Load', sub: 'lamp: uses the energy', tone: 'green' },
          { op: '→' },
          { t: 'Back to the source', sub: 'the loop closes', tone: 'amber' },
        ],
        {
          kind: 'viz',
          viz: 'circuit',
          diagram: 'switch',
          title: 'A battery, wires, a switch and a lamp',
          cases: [{ on: true, caption: 'The loop is complete: current flows and the lamp lights' }],
        },
      ],
    },
    {
      caption:
        'The loop has to be complete. A switch is a deliberate gap you can open and close. Open the switch and the path is broken, so nothing flows and the lamp goes out, even though the battery is still pushing. Close it and the current flows again.',
      cards: [
        {
          kind: 'viz',
          viz: 'circuit',
          diagram: 'switch',
          title: 'Open and closed circuits',
          cases: [
            { on: false, caption: 'Open: broken loop, no current' },
            { on: true, caption: 'Closed: complete loop, current flows' },
          ],
        },
      ],
    },
    {
      caption:
        'Engineers do not draw what the parts look like. They draw a diagram called a schematic, with a standard symbol for each part and straight lines for wires. A schematic shows how things are connected, not where they sit. These are the symbols you will meet, and a few new ones appear in the next chapter.',
      cards: [
        {
          kind: 'viz',
          viz: 'circuit',
          diagram: 'symbols',
          items: ['battery', 'switch', 'lamp', 'resistor', 'led', 'ground'],
        },
      ],
    },
    {
      caption:
        'Why does current flow through wires but not through the plastic around them? Some materials let charge move freely and are called conductors, such as copper and other metals. Others hold on to it and are called insulators, such as plastic, rubber, glass and dry air. A wire is a conductor wrapped in an insulator so the current stays on its path.',
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'Conductors and insulators',
          columns: ['Conducts well', 'Blocks the current'],
          rows: [
            ['Copper (most wires)', 'Plastic (wire coating)'],
            ['Aluminium, gold, silver', 'Rubber'],
            ['Salty water', 'Glass, ceramic'],
            ['The human body', 'Dry air'],
          ],
          tone: 'cyan',
          note: 'Pure water is a poor conductor, but ordinary water has salts in it and does conduct. Never mix water and mains electricity.',
        },
      ],
    },
    {
      caption:
        'What if the current finds an easier path than the load? Add a bare wire across the lamp and the current takes the wire, which has almost no resistance. A huge current flows, the wire and the battery heat up, and the lamp goes out. This is called a short circuit, and it is dangerous. It is the reason fuses and breakers exist.',
      cards: [
        {
          kind: 'viz',
          viz: 'circuit',
          diagram: 'short',
          title: 'A short circuit',
          cases: [
            { on: false, caption: 'Normal: the current goes through the lamp' },
            { on: true, caption: 'Short circuit: a bare wire gives the current an easy path' },
          ],
        },
      ],
      realLife: 'Water takes the easiest path. So does current. The load is a deliberate obstacle that makes the current do useful work on its way round.',
    },
    {
      caption:
        'In bigger circuits, drawing the return wire from every part back to the battery makes a mess. So the minus side of the supply is treated as a shared 0 V point called ground, and each part just connects to the ground symbol. Every symbol marked ground is joined together. This is how the circuits in the transistor lesson were drawn.',
      cards: [
        {
          kind: 'viz',
          viz: 'circuit',
          diagram: 'symbols',
          items: ['ground'],
          note: 'Ground is the 0 V reference. Voltages are measured compared with it.',
        },
      ],
    },
    {
      caption:
        'The next chapter looks at the parts that every electronic circuit is made of. Each one does a different job with the current.',
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'The basic building blocks',
          columns: ['Part', 'Its job'],
          rows: [
            ['Battery', 'gives the push'],
            ['Switch', 'opens or closes the loop'],
            ['LED', 'turns current into light, one way only'],
            ['Resistor', 'limits the current'],
            ['Transistor', 'a switch worked by an electrical signal'],
          ],
          tone: 'amber',
        },
      ],
    },
  ],

  quiz: [
    {
      type: 'choice',
      q: 'What does a circuit need for current to flow?',
      options: ['A complete closed loop', 'Only a battery', 'Only a lamp', 'Two batteries'],
      answer: 0,
      why: 'Current needs a closed loop from one side of the source, through the load, and back to the other side.',
    },
    {
      type: 'choice',
      q: 'What happens when you open the switch in a simple lamp circuit?',
      options: ['The loop is broken, so no current flows and the lamp goes off', 'The lamp gets brighter', 'The battery explodes', 'More current flows'],
      answer: 0,
      why: 'An open switch is a gap in the loop, and current cannot cross a gap.',
    },
    {
      type: 'choice',
      q: 'What is a schematic?',
      options: ['A diagram that uses standard symbols to show how parts are connected', 'A photo of the circuit', 'A list of prices', 'A kind of battery'],
      answer: 0,
      why: 'A schematic shows connections with standard symbols and straight lines, not what things look like.',
    },
    {
      type: 'choice',
      q: 'Which material is a good insulator?',
      options: ['Plastic', 'Copper', 'Silver', 'Salty water'],
      answer: 0,
      why: 'Plastic does not let charge move easily, which is why wires are coated in it.',
    },
    {
      type: 'choice',
      q: 'What is a short circuit?',
      options: ['An easy path that bypasses the load, letting a huge current flow', 'A very short wire', 'A switch that is open', 'A circuit with no battery'],
      answer: 0,
      why: 'A bare wire across the load has almost no resistance, so the current is huge and things heat up.',
    },
    {
      type: 'choice',
      q: 'What is ground in a schematic?',
      options: ['The shared 0 V reference point', 'The highest voltage', 'The floor of the room', 'A kind of switch'],
      answer: 0,
      why: 'Ground is the 0 V point that other voltages are measured against, and the return path for current.',
    },
    {
      type: 'match',
      q: 'Match each part of a simple circuit to its job.',
      items: [
        { id: 'battery', label: 'Battery' },
        { id: 'wire', label: 'Wire' },
        { id: 'lamp', label: 'Lamp' },
        { id: 'switch', label: 'Switch' },
      ],
      targets: [
        { id: 'push', label: 'Gives the push' },
        { id: 'path', label: 'Carries the current' },
        { id: 'load', label: 'Uses the energy to make light' },
        { id: 'gap', label: 'Opens or closes the loop' },
      ],
      answer: { battery: 'push', wire: 'path', lamp: 'load', switch: 'gap' },
      why: 'Source, path, load and a way to open and close the loop: that is a circuit.',
    },
  ],

  recap: [
    'A circuit is a closed loop: a source gives the push, wires give the path, a load uses the energy.',
    'Current only flows round a complete loop. A switch opens and closes it.',
    'Schematics use standard symbols to show how parts connect.',
    'Conductors (metals) let charge flow, insulators (plastic) do not.',
    'A short circuit is an easy path that bypasses the load. It makes a huge current, so fuses and breakers protect against it.',
  ],
});
