TL.registerLesson({
  id: 'components-potentiometer',
  title: 'Potentiometers: the adjustable resistor',
  hook: 'A volume knob, a joystick, the throttle on a toy car. Each one turns a movement of your hand into an electrical signal. How?',
  cover: 'img/lessons/components-potentiometer.png',

  steps: [
    {
      caption:
        'A potentiometer, or pot, is a resistor you can adjust by hand. Inside is a strip of resistive material, called the track, with a terminal at each end. A third terminal is connected to a sliding contact, the wiper, which you move by turning a knob or pushing a slider. Moving the wiper changes where on the track you are touching. In the water picture, a pot is a tap with a knob: turn it and the opening gets wider or narrower.',
      looksLike: {
        title: 'A real potentiometer',
        src: 'img/real/potentiometer.png',
        alt: 'Photo of a small blue rotary potentiometer with a round knob shaft and three metal pins',
        caption: 'A rotary pot. The three pins at the bottom are the two ends of the track and the wiper.',
      },
      cards: [
        {
          kind: 'viz',
          viz: 'circuit',
          diagram: 'hydro',
          title: 'A pot is a tap you turn',
          cases: [
            { part: 'tap', open: 0.25, caption: 'Tap almost shut: high resistance' },
            { part: 'tap', open: 1, caption: 'Tap wide open: low resistance' },
          ],
        },
        { kind: 'viz', viz: 'circuit', diagram: 'symbols', items: ['resistor', 'pot'] },
        [
          { t: 'End A', sub: 'one end of the track', tone: 'cyan' },
          { t: 'Wiper', sub: 'slides along the track', tone: 'amber' },
          { t: 'End B', sub: 'the other end', tone: 'cyan' },
        ],
      ],
    },
    {
      caption:
        'The simplest use is as a variable resistor. Use one end and the wiper, and the resistance between them goes from 0 up to the full value of the track as you turn the knob. A 10 kΩ pot can be anything from 0 to 10 000 Ω. Put it in series with an LED and its resistor and you have a dimmer: more resistance means less current and a dimmer LED. In the water picture, closing the tap a little lets less water through.',
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'A 10 kΩ pot used as a variable resistor',
          columns: ['Knob', 'Resistance', 'Current in a 5 V circuit'],
          rows: [
            ['Fully one way', '0 Ω', 'a lot'],
            ['Middle', '5 kΩ', 'less'],
            ['Fully the other way', '10 kΩ', '0.5 mA, very little'],
          ],
          tone: 'amber',
        },
      ],
      realLife: 'Always keep a fixed resistor in series too. With the pot at 0 Ω nothing would limit the current to the LED.',
    },
    {
      caption:
        'The more common use is as a voltage divider, with all three terminals. Connect one end to the supply, the other end to ground, and read the voltage at the wiper. At one end the wiper sits at the supply voltage, at the other end it sits at 0 V, and in between it gives a smooth range. Halfway along gives half the voltage. In the water picture, the pressure drops steadily along a long pipe, from full at the pump to nothing at the far end. A pressure gauge fitted partway along reads the pressure at that spot: the wiper is that gauge.',
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'The pressure gauge picture',
          columns: ['Gauge position on the pipe', 'Water pressure', 'Wiper voltage (5 V supply)'],
          rows: [
            ['Right at the pump', 'full pressure', '5 V'],
            ['Halfway along', 'half the pressure', '2.5 V'],
            ['At the far end', 'no pressure', '0 V'],
          ],
          tone: 'cyan',
        },
        {
          kind: 'viz',
          viz: 'bars',
          title: 'Wiper voltage on a 5 V supply',
          items: [
            { label: '0%', value: 0, text: '0 V', tone: 'dim' },
            { label: '25%', value: 1.25, text: '1.25 V', tone: 'cyan' },
            { label: '50%', value: 2.5, text: '2.5 V', tone: 'cyan' },
            { label: '75%', value: 3.75, text: '3.75 V', tone: 'amber' },
            { label: '100%', value: 5, text: '5 V', tone: 'green' },
          ],
          max: 5,
          note: 'The percentage is how far along the track the wiper is.',
        },
      ],
      realLife: 'The wiper voltage stays steady only if the thing you connect to it draws very little current, which is true for the input of a microcontroller.',
    },
    {
      caption:
        'A microcontroller can measure that voltage with an analog input, which turns it into a number. On a typical 5 V board the number runs from 0 to 1023: 0 V reads 0, 2.5 V reads about 512 and 5 V reads 1023. So turning a knob changes a number in a program. A program can then map it to anything: a brightness, a speed, an angle.',
      cards: [
        [
          { t: 'Knob', sub: 'you turn it', tone: 'cyan' },
          { op: '→' },
          { t: 'Voltage', sub: '0 to 5 V', tone: 'amber' },
          { op: '→' },
          { t: 'Number', sub: '0 to 1023', tone: 'green' },
          { op: '→' },
          { t: 'Action', sub: 'speed, angle, volume', tone: 'violet' },
        ],
      ],
    },
    {
      caption:
        'Pots are everywhere you adjust something by feel. Volume knobs, light dimmers, joysticks (two pots, one for each direction) and the throttle on a toy all use one. Robots use them to read a position: if a pot is attached to a joint, its voltage tells you the angle of that joint. A servo has exactly such a pot inside, as you will see later.',
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'Where pots are found',
          columns: ['Device', 'What the pot measures'],
          rows: [
            ['Volume knob', 'how loud you want it'],
            ['Joystick', 'stick position, left-right and up-down'],
            ['Remote control car', 'how far the throttle is pushed'],
            ['Robot joint', 'the angle of the joint'],
          ],
          tone: 'violet',
        },
      ],
      realLife: 'Pots wear out, because the wiper rubs on the track. Many modern controls use sensors with no contact instead, such as magnetic ones.',
    },
  ],

  quiz: [
    {
      type: 'choice',
      q: 'What is a potentiometer?',
      options: ['A resistor whose value you can adjust with a sliding contact', 'A battery that never runs out', 'A switch with two positions', 'A light sensor'],
      answer: 0,
      why: 'A pot is a resistive track with a wiper that slides along it.',
    },
    {
      type: 'choice',
      q: 'How many terminals does a normal potentiometer have?',
      options: ['Three', 'Two', 'Four', 'One'],
      answer: 0,
      why: 'Two ends of the track, plus the wiper.',
    },
    {
      type: 'choice',
      q: 'A pot has 5 V across its track and the wiper is exactly halfway. What is the wiper voltage?',
      options: ['2.5 V', '5 V', '0 V', '10 V'],
      answer: 0,
      why: 'In a voltage divider the wiper voltage is the supply voltage times how far along the track it is.',
    },
    {
      type: 'choice',
      q: 'A 5 V board reads a pot with its analog input and shows 1023. Where is the knob?',
      options: ['At the end that gives the full 5 V', 'In the middle', 'At the end that gives 0 V', 'Removed'],
      answer: 0,
      why: '1023 is the biggest number, which means the full 5 V.',
    },
    {
      type: 'choice',
      q: 'Why can a pot on a robot joint tell you the joint angle?',
      options: ['The wiper position, and so the voltage, changes with the angle', 'It measures the temperature of the joint', 'It counts the screws', 'It does not, pots only work as volume controls'],
      answer: 0,
      why: 'Attach the wiper to the joint and each angle gives a different voltage.',
    },
    {
      type: 'match',
      q: 'Match each way of using a pot to what it does.',
      items: [
        { id: 'var', label: 'Two terminals: end and wiper' },
        { id: 'div', label: 'Three terminals: supply, ground, read at the wiper' },
      ],
      targets: [
        { id: 'a', label: 'A variable resistor, a dimmer' },
        { id: 'b', label: 'A voltage divider, a knob that gives a voltage' },
      ],
      answer: { var: 'a', div: 'b' },
      why: 'Two terminals change the resistance. Three terminals split a voltage.',
    },
  ],

  recap: [
    'A potentiometer is a resistive track with a sliding contact, the wiper.',
    'Used with two terminals it is a variable resistor. Used with three it is a voltage divider.',
    'A microcontroller reads the wiper voltage as a number, for example 0 to 1023.',
    'Pots turn a movement of your hand, or of a robot joint, into a signal.',
  ],
});
