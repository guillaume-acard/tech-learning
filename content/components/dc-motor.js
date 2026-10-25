TL.registerLesson({
  id: 'components-dc-motor',
  title: 'DC motors: making things move',
  hook: 'Wheels, fans, drills, toy cars. Most things that spin in a battery-powered device are one kind of part. How does current make it turn?',
  cover: 'img/lessons/components-dc-motor.png',

  steps: [
    {
      caption:
        'A DC motor turns electric current into spinning. Inside, a coil of wire sits between magnets. A current in a wire in a magnetic field feels a push, so the coil is pushed round, and a part called the commutator flips the current at the right moments so the push keeps going the same way. Connect it to a battery and the shaft spins. In the water picture, a motor is a water wheel: the flow of water pushes the wheel round.',
      looksLike: {
        title: 'A gear motor on a robot wheel',
        src: 'img/real/dc-gear-motor.png',
        alt: 'Photo of a small yellow plastic gear motor with a silver DC motor and a black wheel on a workbench',
        caption: 'The silver cylinder is the motor. The yellow box is a gearbox that slows it down and makes it stronger, and the wheel sits on its shaft.',
      },
      cards: [
        {
          kind: 'viz',
          viz: 'circuit',
          diagram: 'hydro',
          title: 'A motor is a water wheel',
          cases: [
            { part: 'wheel', speed: 0.7, caption: 'Water flows: the wheel turns' },
          ],
        },
        { kind: 'viz', viz: 'circuit', diagram: 'symbols', items: ['motor', 'battery'] },
        [
          { t: 'Current', sub: 'flows through the coil', tone: 'amber' },
          { op: '+' },
          { t: 'Magnets', sub: 'make a magnetic field', tone: 'cyan' },
          { op: '→' },
          { t: 'Push', sub: 'the shaft turns', tone: 'green' },
        ],
      ],
    },
    {
      caption:
        'Two simple rules control a DC motor. More voltage makes it spin faster. Reverse the two wires and it spins the other way. How much current it draws depends on how hard it has to work: a free-spinning motor takes little, but a motor pushing against a heavy load takes a lot, and a motor held still (stalled) takes the most. In the water picture: a stronger pump spins the wheel faster, reversing the water spins it backwards, and a jammed wheel lets no water through while the pressure builds up.',
      cards: [
        {
          kind: 'viz',
          viz: 'circuit',
          diagram: 'hydro',
          title: 'Controlling the water wheel',
          cases: [
            { part: 'wheel', speed: 0.3, caption: 'Weak pump: slow' },
            { part: 'wheel', speed: 1, caption: 'Strong pump: fast' },
            { part: 'wheel', speed: 0.7, rev: true, caption: 'Pipes swapped: backwards' },
            { part: 'wheel', stalled: true, caption: 'Jammed: pressure builds, gets hot' },
          ],
        },
        {
          kind: 'viz',
          viz: 'table',
          title: 'Controlling a DC motor',
          columns: ['You change', 'The motor'],
          rows: [
            ['A higher voltage', 'spins faster'],
            ['Swap the two wires', 'spins the other way'],
            ['A heavier load', 'draws more current'],
            ['Stalled by a blocked wheel', 'draws the most current and gets hot'],
          ],
          tone: 'cyan',
        },
      ],
    },
    {
      caption:
        'You cannot connect a motor directly to the pin of a microcontroller. A pin can give only about 20 mA, and a small motor can need hundreds of mA, or amps when it starts. So the pin controls a transistor, as in the transistor lesson, and the transistor switches the big current from the battery. A small signal switches a large current. In the water picture, the pin is a thin control pipe that lifts a sluice gate in the big pipe feeding the wheel.',
      cards: [
        [
          { t: 'Microcontroller pin', sub: 'about 20 mA, a signal', tone: 'cyan' },
          { op: '→' },
          { t: 'Transistor', sub: 'the switch', tone: 'amber' },
          { op: '→' },
          { t: 'Motor', sub: 'hundreds of mA from the battery', tone: 'green' },
        ],
      ],
      realLife: 'Real robots use a ready-made motor driver chip. It holds the transistors and the safety parts in one small package.',
    },
    {
      caption:
        'A motor is a coil, and a coil fights a sudden change in current. When the transistor switches off, the coil produces a spike of voltage, much higher than the battery, that can destroy the transistor. A diode wired across the motor, pointing against the supply, gives that spike a safe path, so it is called a flyback diode. It normally does nothing, and only acts at switch off. In the water picture, the spinning wheel keeps pushing water along after you shut the gate, like a heavy wheel that will not stop at once. Without a bypass valve to let that water circulate, the pressure spikes against the closed gate.',
      cards: [
        { kind: 'viz', viz: 'circuit', diagram: 'symbols', items: ['diode', 'motor', 'nmos'] },
        {
          kind: 'viz',
          viz: 'table',
          title: 'Parts that drive a motor',
          columns: ['Part', 'Job'],
          rows: [
            ['Transistor', 'switches the motor current on and off'],
            ['Flyback diode', 'absorbs the voltage spike at switch off'],
            ['Capacitor', 'smooths the supply while the motor runs'],
          ],
          tone: 'violet',
        },
      ],
    },
    {
      caption:
        'To control the speed you switch the motor on and off very quickly, many times a second. This is called PWM, pulse width modulation. The motor does not stop each time, because it keeps spinning on its momentum, so it reacts to the average, like a heavy water wheel under a tap that is opened and shut quickly: the wheel turns at a steady speed in between. The share of time that it is on is the duty cycle: 25% on gives a slow turn, 100% on is full speed.',
      cards: [
        {
          kind: 'viz',
          viz: 'bars',
          title: 'Duty cycle and speed',
          items: [
            { label: '25% on', value: 25, text: 'slow', tone: 'cyan' },
            { label: '50% on', value: 50, text: 'half speed', tone: 'amber' },
            { label: '100% on', value: 100, text: 'full speed', tone: 'green' },
          ],
          max: 100,
          note: 'The switching is far too fast to see, often 1000 times a second or more.',
        },
      ],
      realLife: 'To reverse a motor with a microcontroller, four switches are arranged in an H shape with the motor in the middle. That is called an H-bridge, and motor driver chips include it.',
    },
  ],

  quiz: [
    {
      type: 'choice',
      q: 'What makes a DC motor spin?',
      options: ['A current in a coil inside a magnetic field', 'Heat', 'Light', 'A spring'],
      answer: 0,
      why: 'A current in a magnetic field feels a force, and that pushes the coil round.',
    },
    {
      type: 'choice',
      q: 'How do you make a DC motor spin the other way?',
      options: ['Swap the two wires', 'Add a resistor', 'Turn the battery upside down in the room', 'You cannot'],
      answer: 0,
      why: 'Reversing the current reverses the push.',
    },
    {
      type: 'choice',
      q: 'Why does a microcontroller pin switch a transistor instead of driving a motor directly?',
      options: ['A pin gives only about 20 mA, and the motor needs much more', 'Motors only work with transistors', 'A pin has too much voltage', 'It is just a habit'],
      answer: 0,
      why: 'The transistor lets a small signal switch a large current from the battery.',
    },
    {
      type: 'choice',
      q: 'What does a flyback diode protect against?',
      options: ['The voltage spike when the motor is switched off', 'The motor getting wet', 'The battery running down', 'The motor spinning too slowly'],
      answer: 0,
      why: 'The coil produces a spike when the current stops, and the diode gives it a safe path.',
    },
    {
      type: 'choice',
      q: 'A motor is driven with PWM at 50% duty cycle. About how fast does it spin compared with full speed?',
      options: ['About half speed', 'Full speed', 'It stops', 'Twice as fast'],
      answer: 0,
      why: 'The motor reacts to the average, and on half of the time is half the average.',
    },
    {
      type: 'match',
      q: 'Match each part to its job in a motor circuit.',
      items: [
        { id: 'tr', label: 'Transistor' },
        { id: 'di', label: 'Flyback diode' },
        { id: 'pw', label: 'PWM signal' },
      ],
      targets: [
        { id: 'a', label: 'Switches the large motor current' },
        { id: 'b', label: 'Absorbs the spike at switch off' },
        { id: 'c', label: 'Sets the speed by switching quickly' },
      ],
      answer: { tr: 'a', di: 'b', pw: 'c' },
      why: 'Each part has one clear job when a microcontroller runs a motor.',
    },
  ],

  recap: [
    'A DC motor turns current in a coil, inside a magnetic field, into spinning.',
    'More voltage means faster. Swapping the wires reverses it. A stalled motor draws the most current.',
    'A microcontroller pin cannot drive a motor, so a transistor switches the large current.',
    'A flyback diode absorbs the voltage spike when the motor switches off.',
    'PWM sets the speed: the share of time on is the duty cycle.',
  ],
});
