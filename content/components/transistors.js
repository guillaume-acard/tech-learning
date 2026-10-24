TL.registerLesson({
  id: 'components-transistors',
  title: 'Transistors: tiny switches for bits',
  hook: 'How can a tiny electronic switch help a computer store and use 0s and 1s?',
  cover: 'img/lessons/components-transistors.png',
  scene: TL.transistorScene,

  steps: [
    {
      caption:
        'Start with something familiar: a switch in a circuit. Electrical diagrams use standard symbols: a battery pushes current round a loop, and the switch decides whether the loop is complete. Closed: current flows and the lamp lights. Open: the loop is broken and the lamp is off.',
      show: {},
      cards: [
        { kind: 'viz', viz: 'circuit', diagram: 'symbols', items: ['battery', 'switch', 'lamp'] },
        {
          kind: 'viz',
          viz: 'circuit',
          diagram: 'switch',
          title: 'A plain switch controls the lamp',
          cases: [
            { on: false, caption: 'You open the switch by hand: no current' },
            { on: true, caption: 'You close it by hand: current flows' },
          ],
        },
      ],
    },
    {
      caption:
        'Inside a computer are billions of transistors. A transistor is a tiny electronic component that works like that switch, but nobody pushes it by hand: an electrical signal does. That is why a chip can flip billions of them every second.',
      show: { nodes: ['transistor'] },
      highlight: ['transistor'],
      labels: { transistor: 'Tiny electronic switch' },
      looksLike: {
        title: 'A single transistor',
        src: 'img/real/transistor.png',
        alt: 'Photo of one transistor in a black plastic case with three metal legs, next to some resistors',
        caption: 'This is one transistor, large enough to hold. The three legs are the gate, drain and source. The ones inside a chip are millions of times smaller.',
      },
      cards: [
        {
          kind: 'viz',
          viz: 'circuit',
          diagram: 'symbols',
          items: ['nmos', 'resistor', 'ground'],
          title: 'The transistor symbol',
          note: 'This one is an N-channel MOSFET, the kind used inside chips. G = gate (the control), D = drain, S = source (the path the current takes).',
        },
      ],
    },
    {
      caption:
        'What exactly is the gate input? It is not a flow of current. It is a voltage: an electrical push, measured between the gate wire and ground (0 V). Inside, the gate is a metal plate separated from the silicon by a very thin insulator, so no current flows through it. The voltage puts charge on the plate instead. Charge on the plate pulls electrons up into the silicon right under it, and they form a thin channel between source and drain. That channel is the path that conducts.',
      show: {},
      highlight: ['transistor'],
      cards: [
        {
          kind: 'viz',
          viz: 'circuit',
          diagram: 'mosfet',
          title: 'Inside the transistor, seen from the side',
          cases: [
            { on: false, caption: 'Gate at 0 V: no channel, path blocked' },
            { on: true, caption: 'Gate at +5 V: electrons gather, a channel forms' },
          ],
        },
        {
          kind: 'viz',
          viz: 'table',
          title: 'The two gate voltages',
          columns: ['Gate voltage', 'Called', 'Bit', 'The channel'],
          rows: [
            ['About 0 V (same as ground)', 'LOW', '0', 'None: path blocked'],
            ['The supply voltage (+5 V here)', 'HIGH', '1', 'Forms: path conducts'],
          ],
          tone: 'amber',
        },
      ],
      realLife:
        'No negative voltage is needed: low is simply near 0 V and high is near the supply voltage, both measured against ground. Old chips used 5 V, modern ones about 1 V. The gate only takes a tiny burst of current when it flips, to charge the plate up.',
    },
    {
      caption:
        'So the control signal is just a voltage level at the gate. Gate low: the path from drain to source is blocked, like an open switch. Gate high: the path conducts, like a closed switch. Same loop as before, but the signal replaces your finger.',
      show: { nodes: ['control'], links: ['control-transistor'] },
      highlight: ['control', 'control-transistor', 'transistor'],
      labels: { control: 'Control: low or high', transistor: 'Switches the path' },
      packets: [{ path: ['control', 'transistor'], color: '#ffa31a', label: 'control' }],
      cards: [
        {
          kind: 'viz',
          viz: 'circuit',
          diagram: 'transistor',
          title: 'A transistor used as a switch',
          cases: [
            { on: false, caption: 'Gate LOW: path blocked, lamp off' },
            { on: true, caption: 'Gate HIGH: path conducts, lamp on' },
          ],
        },
      ],
      realLife: 'The gate takes almost no current. A tiny signal controls a much bigger flow, which is also why transistors can amplify signals.',
    },
    {
      caption:
        'Computer circuits treat two ranges of voltage as two states: low is read as 0, and high is read as 1. Here the output is taken between the resistor and the transistor. Input 0: the transistor is off and the resistor holds the output high (1). Input 1: the transistor conducts and pulls the output down to ground (0). The output is the opposite of the input, which is a NOT gate.',
      show: { nodes: ['output'], links: ['transistor-output'] },
      highlight: ['transistor', 'transistor-output', 'output'],
      labels: { output: 'OFF = 0 / ON = 1' },
      packets: [{ path: ['transistor', 'output'], color: '#39ff88', label: 'bit' }],
      cards: [
        {
          kind: 'viz',
          viz: 'circuit',
          diagram: 'inverter',
          title: 'One transistor and a resistor make a NOT gate',
          cases: [
            { on: false, caption: 'Input 0: transistor off, output 1' },
            { on: true, caption: 'Input 1: transistor on, output 0' },
          ],
        },
      ],
      realLife:
        'Real circuits use voltage ranges, not a perfect zero volts or one fixed voltage. Modern chips use pairs of transistors (CMOS) instead of a resistor so almost no current is wasted, but the idea is the same.',
    },
    {
      caption:
        'One transistor and a resistor make a NOT gate. Now put two transistors in a row, A and B, between the resistor and ground. Current can only reach ground if both are on, and only then is the output pulled down to 0. In every other case the road to ground is broken and the output stays 1. This is a NAND gate, "NOT AND". Watch the amber current: the logic is just a question of where electricity is allowed to flow.',
      show: {},
      highlight: ['transistor', 'output'],
      cards: [
        {
          kind: 'viz',
          viz: 'circuit',
          diagram: 'nand',
          title: 'Two transistors in a row: a NAND gate',
          cases: [
            { a: 0, b: 0, caption: 'A 0, B 0: both off, output 1' },
            { a: 0, b: 1, caption: 'A 0, B 1: A is off, road broken, output 1' },
            { a: 1, b: 0, caption: 'A 1, B 0: B is off, road broken, output 1' },
            { a: 1, b: 1, caption: 'A 1, B 1: both on, current flows, output 0' },
          ],
        },
      ],
      realLife:
        'A real chip builds a NAND from 4 transistors (CMOS): two in a row to pull the output down, and two side by side that pull it up in place of the resistor, so almost no current is wasted.',
    },
    {
      caption:
        'Now put the two transistors side by side instead. Either one can open a road to ground. If A or B is on, current flows and the output is pulled down to 0. Only when both are off does the output stay at 1. This is a NOR gate, "NOT OR". Same parts as before, wired differently, and a different logic.',
      show: {},
      highlight: ['transistor', 'output'],
      cards: [
        {
          kind: 'viz',
          viz: 'circuit',
          diagram: 'nor',
          title: 'Two transistors side by side: a NOR gate',
          cases: [
            { a: 0, b: 0, caption: 'A 0, B 0: both off, output 1' },
            { a: 0, b: 1, caption: 'A 0, B 1: B opens a road, output 0' },
            { a: 1, b: 0, caption: 'A 1, B 0: A opens a road, output 0' },
            { a: 1, b: 1, caption: 'A 1, B 1: two roads, output 0' },
          ],
        },
      ],
    },
    {
      caption:
        'In a row means "both must be on". Side by side means "either can be on". That is all it takes. Because these circuits flip their output, they are called NAND and NOR. Add a NOT after a NAND and you get a plain AND. Wire the outputs of some gates to the inputs of others and you can build any logic you want. In the end, every gate is the same thing: transistors opening and closing roads for electricity.',
      show: {},
      highlight: ['transistor', 'output'],
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'What each gate outputs',
          columns: ['A', 'B', 'NOT A', 'NAND', 'NOR', 'AND', 'OR'],
          rows: [
            ['0', '0', '1', '1', '1', '0', '0'],
            ['0', '1', '1', '1', '0', '0', '1'],
            ['1', '0', '0', '1', '0', '0', '1'],
            ['1', '1', '0', '0', '0', '1', '1'],
          ],
          tone: 'violet',
        },
        [
          { t: 'NAND', sub: 'two in a row', tone: 'amber' },
          { op: '+' },
          { t: 'NOT', sub: 'flips the output', tone: 'cyan' },
          { op: '=' },
          { t: 'AND', sub: 'both must be 1', tone: 'green' },
        ],
      ],
      realLife:
        'NAND alone is enough to build every other gate, which is why chip designers like it. Billions of these tiny gates, wired together, make a processor.',
    },
    {
      caption:
        'One 0 or 1 is called a bit. Put bits together and they can represent larger numbers. For example, 0101 means 5 in binary: 0 eights + 1 four + 0 twos + 1 one.',
      show: {},
      highlight: ['output'],
      labels: { output: '0101 = 5' },
      cards: [{ kind: 'viz', viz: 'bits', rows: [{ bits: '0101', weights: true, label: '5', sub: 'decimal', tone: 'green' }], note: 'Each place is worth double the one to its right. A 1 adds its value, a 0 adds nothing.' }],
    },
    {
      caption:
        'Gates can already do arithmetic. Add two single bits, A and B. The answer needs two digits: a sum bit and a carry bit, like 9 + 1 = 10 on paper. The sum bit is 1 when exactly one input is 1 (an XOR gate). The carry bit is 1 only when both are 1 (an AND gate). Two gates give a half adder. Chain more adders, passing the carry along, and you can add numbers of any size.',
      show: {},
      highlight: ['output'],
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'Adding two bits',
          columns: ['A', 'B', 'Sum bit (XOR)', 'Carry bit (AND)', 'Answer'],
          rows: [
            ['0', '0', '0', '0', '00 (0)'],
            ['0', '1', '1', '0', '01 (1)'],
            ['1', '0', '1', '0', '01 (1)'],
            ['1', '1', '0', '1', '10 (2)'],
          ],
          cells: [[3, 2], [3, 3], [3, 4]],
          tone: 'green',
          note: '1 + 1 = 10 in binary: the sum bit is 0 and a 1 is carried to the next place.',
        },
        [
          { t: 'A and B', sub: 'two input bits', tone: 'cyan' },
          { op: '→' },
          { t: 'XOR gate', sub: 'gives the sum bit', tone: 'amber' },
          { t: 'AND gate', sub: 'gives the carry bit', tone: 'amber' },
        ],
      ],
      realLife: 'A processor adds large numbers with long chains of such adders, built from thousands of transistors, in a tiny fraction of a second.',
    },
    {
      caption:
        'Gates are combined into larger circuits that can store bits and do logic and arithmetic. Large groups of bits can represent numbers, letters, pictures, sounds, or instructions for the CPU.',
      show: {},
      highlight: ['transistor', 'output'],
      labels: { transistor: 'Part of a circuit', output: 'Bits carry information' },
      looksLike: {
        title: 'A silicon wafer',
        src: 'img/real/silicon-wafer.png',
        alt: 'Photo of a round silicon wafer covered in rows of identical chips',
        caption: 'Chips are made in bulk on a round wafer of silicon. Each small square becomes one chip, holding billions of transistors.',
      },
      cards: [
        {
          kind: 'viz',
          viz: 'layers',
          title: 'Small switches build up into a computer',
          arrows: true,
          layers: [
            { t: 'CPU and memory', sub: 'run instructions, hold data', tone: 'green' },
            { t: 'Circuits', sub: 'adders, memory cells', tone: 'cyan' },
            { t: 'Logic gates', sub: 'NOT, AND, OR', tone: 'violet' },
            { t: 'Transistors', sub: 'tiny switches', tone: 'amber' },
          ],
        },
      ],
      realLife:
        'A computer does not use one transistor for one whole number or instruction. Many transistors work together in memory and processor circuits.',
    },
  ],

  quiz: [
    {
      type: 'choice',
      q: 'What is a transistor doing in this simple explanation?',
      options: ['Acting like a tiny electronic switch', 'Showing a picture on the screen', 'Keeping a file on the disk', 'Sending a Wi-Fi signal'],
      answer: 0,
      why: 'A transistor can control whether an electrical signal passes through a path.',
    },
    {
      type: 'choice',
      q: 'In the simple digital model, what do the two signal states represent?',
      options: ['0 and 1', 'A and Z', 'Two letters only', 'Two different websites'],
      answer: 0,
      why: 'Circuits use low and high voltage ranges to represent binary 0 and 1.',
    },
    {
      type: 'choice',
      q: 'What number is binary 0101?',
      options: ['5', '4', '10', '15'],
      answer: 0,
      why: 'The places are 8, 4, 2, 1: 0 + 4 + 0 + 1 = 5.',
    },
    {
      type: 'choice',
      q: 'What is the input at the gate of a transistor?',
      options: ['A voltage level, low or high, not a flow of current', 'A strong current flowing through the gate', 'A negative charge only', 'A radio signal'],
      answer: 0,
      why: 'The gate is insulated from the silicon. Its voltage creates an electric field that opens or closes the channel, with almost no current.',
    },
    {
      type: 'choice',
      q: 'Two transistors are placed in a row between the output and ground. When is the output pulled down to 0?',
      options: ['Only when both inputs are 1', 'When at least one input is 1', 'Only when both inputs are 0', 'Never'],
      answer: 0,
      why: 'In a row, current only reaches ground if both transistors conduct. That is a NAND gate.',
    },
    {
      type: 'choice',
      q: 'Two transistors are placed side by side between the output and ground. When is the output pulled down to 0?',
      options: ['When at least one input is 1', 'Only when both inputs are 1', 'Only when both inputs are 0', 'Never'],
      answer: 0,
      why: 'Side by side, either transistor opens a road to ground. That is a NOR gate.',
    },
    {
      type: 'choice',
      q: 'How can groups of bits be used?',
      options: ['To represent numbers, text, images, sound, or instructions', 'Only to represent the number zero', 'Only to tell the screen to turn on', 'Only to store passwords'],
      answer: 0,
      why: 'Bits are patterns that a computer system interprets according to an agreed format.',
    },
  ],

  recap: [
    'A transistor is a tiny electronic component that can act like a switch.',
    'Its gate input is a voltage level, not a flow of current: low (near 0 V) blocks the path, high (near the supply) opens it.',
    'Computer circuits use two signal states to represent binary 0 and 1.',
    'Transistors in a row or side by side make logic gates (NAND, NOR, and from them AND, OR, NOT). Underneath, it is always electricity flowing along different paths.',
    'Gates build adders and memory, and groups of bits can represent numbers, text, images, sound, and CPU instructions.',
  ],
});
