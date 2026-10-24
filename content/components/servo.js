TL.registerLesson({
  id: 'components-servo',
  title: 'Servo motors: turn to an exact angle',
  hook: 'A robot arm moves its elbow to exactly 90 degrees and holds it there. An ordinary motor just spins, so what is different about a servo?',
  cover: 'img/lessons/components-servo.png',

  steps: [
    {
      caption:
        'A servo is a small box that turns to an angle you ask for, and holds it. A normal DC motor spins until you cut the power, and you have no idea where it stopped. A hobby servo turns its output arm, the horn, to a position between 0 and about 180 degrees, and then stays there, even if you push on it.',
      looksLike: {
        title: 'A hobby servo',
        src: 'img/real/servo.png',
        alt: 'Photo of a small blue hobby servo motor with a white plastic control arm and a three-wire cable in black, red and orange',
        caption: 'A small servo, about the size of a matchbox. The white arm is the horn. The three wires are power, ground and signal.',
      },
      cards: [
        [
          { t: 'DC motor', sub: 'spins until you stop it', tone: 'amber' },
          { op: 'vs' },
          { t: 'Servo', sub: 'goes to an angle and holds it', tone: 'green' },
        ],
      ],
    },
    {
      caption:
        'Inside the box are four things working together: a small DC motor, a gearbox that slows it down and makes it strong, a potentiometer attached to the output shaft that tells the servo its current angle, and a small control circuit. The circuit compares the angle you asked for with the angle the pot reports, and drives the motor until the two match. This is called feedback.',
      cards: [
        {
          kind: 'viz',
          viz: 'layers',
          layers: [
            { t: 'Control circuit', sub: 'compares wanted angle with real angle', tone: 'cyan' },
            { t: 'DC motor', sub: 'turns until the angles match', tone: 'amber' },
            { t: 'Gearbox', sub: 'slower, but stronger', tone: 'violet' },
            { t: 'Output shaft and potentiometer', sub: 'the horn, and a sensor of its angle', tone: 'green' },
          ],
          arrows: '▼ drives',
        },
      ],
      realLife: 'This is a closed loop: the part measures its own result and corrects it. A DC motor on its own is an open loop, it has no idea what it did.',
    },
    {
      caption:
        'A servo has three wires: power, ground and signal. You do not set the angle with a voltage. You send a short pulse on the signal wire, repeated about every 20 milliseconds, and the width of the pulse is the angle. A 1 millisecond pulse means one end, 1.5 milliseconds means the middle, 2 milliseconds means the other end.',
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'Pulse width and angle (typical hobby servo)',
          columns: ['Pulse width', 'Angle'],
          rows: [
            ['1.0 ms', '0 degrees'],
            ['1.5 ms', '90 degrees, the middle'],
            ['2.0 ms', '180 degrees'],
          ],
          tone: 'cyan',
          note: 'The pulse is repeated about 50 times a second. Exact limits differ between models.',
        },
      ],
      realLife: 'This is another kind of PWM. In the motor lesson the width of the pulse set the speed. Here it sets a position.',
    },
    {
      caption:
        'To command a servo from a microcontroller you just give it the angle you want, and a library makes the pulses. Servos are the joints of hobby robots: arms, grippers, legs, a head that turns a distance sensor from side to side. They also steer model cars and move the flaps of model aircraft.',
      cards: [
        {
          kind: 'viz',
          viz: 'code',
          file: 'servo.ino',
          lines: [
            'servo.write(0);    // one end',
            { t: 'servo.write(90);   // the middle', tone: 'amber', note: 'the library makes the 1.5 ms pulses' },
            'servo.write(180);  // the other end',
          ],
        },
      ],
      realLife: 'The code shown is Arduino style. Every board has a similar library, and the idea is the same everywhere.',
    },
    {
      caption:
        'Servos are not the only choice. A DC motor is the simplest and spins fast, which suits wheels. A servo goes to an exact angle but only over a limited range. A stepper motor moves in small fixed steps, so it can turn any number of times and still know where it is, which is why 3D printers use them. The right one depends on the job.',
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'Three kinds of motor in robots',
          columns: ['Motor', 'Good at', 'Example'],
          rows: [
            ['DC motor', 'spinning fast and simply', 'wheels, fans'],
            ['Servo', 'going to an angle and holding it', 'robot arm joint, gripper'],
            ['Stepper', 'many exact steps, any number of turns', '3D printer axes'],
          ],
          tone: 'violet',
        },
      ],
      realLife: 'Continuous-rotation servos exist too. They keep the gearbox but drop the angle sensor, so the pulse width sets the speed instead.',
    },
  ],

  quiz: [
    {
      type: 'choice',
      q: 'What does a servo do that a plain DC motor does not?',
      options: ['Goes to a chosen angle and holds it', 'Spins faster', 'Makes its own electricity', 'Runs without power'],
      answer: 0,
      why: 'A servo has a sensor and a control circuit that steer it to the angle you ask for.',
    },
    {
      type: 'choice',
      q: 'What sensor inside the servo reports the angle of the output shaft?',
      options: ['A potentiometer', 'A camera', 'A thermometer', 'A speaker'],
      answer: 0,
      why: 'The pot is attached to the output shaft, so its voltage changes with the angle.',
    },
    {
      type: 'choice',
      q: 'How do you tell a hobby servo which angle to go to?',
      options: ['With the width of a pulse on the signal wire', 'By the battery voltage', 'By swapping the power wires', 'By turning it by hand'],
      answer: 0,
      why: 'Typically 1 ms is one end, 1.5 ms the middle and 2 ms the other end.',
    },
    {
      type: 'choice',
      q: 'A servo gets a 1.5 ms pulse. Where does it go?',
      options: ['The middle, about 90 degrees', 'One end', 'The other end', 'It spins freely'],
      answer: 0,
      why: '1.5 ms is the middle of the usual 1 to 2 ms range.',
    },
    {
      type: 'choice',
      q: 'What does feedback mean in a servo?',
      options: ['It measures its own angle and corrects the motor until it is right', 'It makes a squealing noise', 'It copies the battery voltage', 'It sends data to the internet'],
      answer: 0,
      why: 'The control circuit compares the wanted angle with the measured one and keeps correcting.',
    },
    {
      type: 'match',
      q: 'Match each motor to the job it suits best.',
      items: [
        { id: 'dc', label: 'DC motor' },
        { id: 'sv', label: 'Servo' },
        { id: 'st', label: 'Stepper' },
      ],
      targets: [
        { id: 'a', label: 'Wheels of a small robot' },
        { id: 'b', label: 'Elbow of a robot arm' },
        { id: 'c', label: 'Moving the print head of a 3D printer' },
      ],
      answer: { dc: 'a', sv: 'b', st: 'c' },
      why: 'Spin, hold an angle, move in exact steps: each motor suits one of these.',
    },
  ],

  recap: [
    'A servo turns to an angle and holds it, within about 180 degrees.',
    'Inside: a DC motor, a gearbox, a potentiometer and a control circuit with feedback.',
    'The angle is set by the width of a pulse, repeated about every 20 ms: 1 ms to 2 ms.',
    'DC motors, servos and steppers each suit different jobs in a robot.',
  ],
});
