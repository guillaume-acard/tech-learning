TL.registerLesson({
  id: 'components-ir-distance',
  title: 'Infrared distance sensors',
  hook: 'A robot vacuum stops before it hits a chair and a hand dryer knows your hands are there. How does a tiny part measure distance with invisible light?',
  cover: 'img/lessons/components-ir-distance.png',

  steps: [
    {
      caption:
        'An infrared distance sensor tells you how far away an object is without touching it. It sends out a beam of infrared light, which our eyes cannot see. The light bounces off the object, and a small detector catches the echo. How the echo arrives tells the sensor the distance, and it reports it as a voltage that a circuit can read.',
      looksLike: {
        title: 'A real infrared distance sensor',
        src: 'img/real/ir-distance-sensor.png',
        alt: 'Photo of a small black rectangular infrared distance sensor with two round lens windows and a three-wire cable',
        caption: 'A small distance sensor, about the size of a matchbox. One window sends out the light, the other looks for the echo. Three wires: power, ground and the output voltage.',
      },
      cards: [
        [
          { t: 'IR LED', sub: 'sends invisible light', tone: 'amber' },
          { op: '→' },
          { t: 'Object', sub: 'bounces it back', tone: 'cyan' },
          { op: '→' },
          { t: 'Detector', sub: 'catches the echo', tone: 'green' },
          { op: '→' },
          { t: 'Output voltage', sub: 'tells the distance', tone: 'violet' },
        ],
      ],
    },
    {
      caption:
        'Infrared (IR) is light with a longer wavelength than red, too long for our eyes to see. The sender in these sensors is simply an LED that gives out infrared, usually at about 940 nanometres. It follows the same rules as the LED lesson: it needs a resistor, it must be the right way round, and it has a forward voltage, a little lower than a red one at about 1.2 V.',
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'Where infrared sits',
          columns: ['Light', 'Wavelength', 'Can we see it?'],
          rows: [
            ['Blue', 'about 450 nm', 'yes'],
            ['Red', 'about 650 nm', 'yes'],
            ['Infrared (sensor LED)', 'about 940 nm', 'no'],
          ],
          highlight: 2,
          tone: 'amber',
        },
      ],
      realLife: 'A phone camera can often see infrared. Point it at a TV remote and press a button: the IR LED shows up as a flashing purple dot on the screen, even though your eyes see nothing.',
    },
    {
      caption:
        'The receiver is a photodiode. It is a diode that reacts to light: when light falls on it, a small current flows, and the more light, the more current. Put it in a row with a resistor and that current becomes a voltage, the same idea as Ohm\'s law. Dark gives about 0 V, a little light gives a bit, and strong light gives a lot.',
      cards: [
        {
          kind: 'viz',
          viz: 'circuit',
          diagram: 'symbols',
          items: ['led', 'photodiode'],
        },
        {
          kind: 'viz',
          viz: 'circuit',
          diagram: 'photo',
          title: 'Light becomes a voltage',
          cases: [
            { light: 0, caption: 'Dark: almost no current, 0 V' },
            { light: 1, caption: 'A little light: some current' },
            { light: 2, caption: 'Strong light: lots of current, high voltage' },
          ],
        },
      ],
      realLife: 'A photodiode is wired backwards on purpose: with no light it blocks the current, and light lets a small current leak through. A phototransistor is a similar part with a built-in amplifier, so it is more sensitive but slower.',
    },
    {
      caption:
        'The simplest detector only answers yes or no. Put an IR LED and a photodiode side by side, both facing the same way. With nothing in front, almost no light comes back. With an object close by, the light bounces into the detector and its voltage jumps. A part called a comparator checks it against a set level and gives out one clean on or off signal.',
      looksLike: {
        title: 'An infrared obstacle module',
        src: 'img/real/ir-obstacle-module.png',
        alt: 'Photo of a small blue circuit board with a clear infrared LED dome and a dark photodiode dome side by side, a small chip and a blue adjustable dial',
        caption: 'A cheap obstacle sensor board. The clear dome is the IR LED, the dark one is the photodiode. The blue dial sets the level the comparator uses.',
      },
      cards: [
        {
          kind: 'viz',
          viz: 'bars',
          title: 'How strong the echo is',
          items: [
            { label: '2 cm', value: 100, text: 'strong echo', tone: 'green' },
            { label: '4 cm', value: 25, text: 'weaker', tone: 'amber' },
            { label: '8 cm', value: 6, text: 'faint', tone: 'dim' },
            { label: '16 cm', value: 1.6, text: 'almost nothing', tone: 'red' },
          ],
          max: 100,
          note: 'Each time the distance doubles, the echo is about four times weaker.',
        },
        {
          kind: 'viz',
          viz: 'table',
          title: 'Parts of a yes or no detector',
          columns: ['Part', 'Job'],
          rows: [
            ['IR LED and its resistor', 'send the light'],
            ['Photodiode and its resistor', 'turn the echo into a voltage'],
            ['Comparator', 'says "object" when the voltage is above the set level'],
          ],
          tone: 'cyan',
        },
      ],
      realLife: 'Line-following robots, automatic taps and hand dryers use this. It works well up close but cannot tell you how far away something is.',
    },
    {
      caption:
        'To measure the distance, better sensors use a trick called triangulation. The LED and a small lens are a fixed distance apart, and behind the lens sits a thin strip that can tell where light lands on it. Light from a close object comes back at a steep angle and lands far along the strip. Light from a far object comes back almost parallel and lands near the start.',
      cards: [
        {
          kind: 'viz',
          viz: 'circuit',
          diagram: 'ir',
          title: 'Where the echo lands',
          cases: [
            { dist: 10, caption: 'Close: the spot lands far down the strip, high voltage' },
            { dist: 40, caption: 'Far: the spot lands near the start, low voltage' },
          ],
        },
      ],
      realLife: 'Surveyors use the same idea. Look at an object with one eye, then the other: a close object seems to jump more than a far one.',
    },
    {
      caption:
        'The spot position is turned into an output voltage. Close gives a high voltage and far gives a low one, and it is not a straight line: the voltage is roughly 27 divided by the distance in centimetres. A microcontroller reads the voltage with an analog input and does that sum to get the distance. A typical sensor of this kind works from about 10 cm to 80 cm.',
      cards: [
        [
          { t: 'Distance', sub: 'in cm', tone: 'cyan' },
          { op: '≈' },
          { t: '27', sub: 'typical sensor', tone: 'dim' },
          { op: '÷' },
          { t: 'Voltage', sub: 'in volts', tone: 'amber' },
        ],
        {
          kind: 'viz',
          viz: 'table',
          title: 'Typical output of an analog IR sensor',
          columns: ['Distance', 'Output voltage'],
          rows: [
            ['10 cm', 'about 2.7 V'],
            ['20 cm', 'about 1.35 V'],
            ['30 cm', 'about 0.9 V'],
            ['40 cm', 'about 0.7 V'],
            ['60 cm', 'about 0.45 V'],
            ['80 cm', 'about 0.35 V'],
          ],
          tone: 'violet',
        },
      ],
      realLife: 'These numbers are typical. Every sensor model has its own curve in its datasheet, and real readings are a little noisy.',
    },
    {
      caption:
        'Infrared sensors can be fooled, and knowing how helps you use them. Black objects soak up the light, so the echo is weak and the object looks farther than it is. Mirrors and glass send the beam away or let it through. Sunlight is full of infrared and can drown the echo. Closer than the minimum range, the reading drops again, so 5 cm can look like 20 cm.',
      cards: [
        {
          kind: 'viz',
          viz: 'circuit',
          diagram: 'ir',
          title: 'When the reading lies',
          cases: [
            { dist: 30, caption: 'A white object at 30 cm: the right reading' },
            { dist: 30, dark: true, caption: 'A black object at 30 cm: looks like 48 cm' },
          ],
        },
        {
          kind: 'viz',
          viz: 'table',
          title: 'What fools an IR sensor',
          columns: ['Situation', 'What happens'],
          rows: [
            ['Black or dark object', 'weak echo, reads as farther'],
            ['Mirror or clear glass', 'beam bounces away or passes through'],
            ['Bright sunlight', 'drowns the echo, bad outdoors'],
            ['Closer than about 10 cm', 'the reading falls again'],
            ['Farther than about 80 cm', 'no usable reading'],
          ],
          tone: 'red',
        },
      ],
      realLife: 'Good sensors flash the LED on and off many times a second and only react to light that flashes in the same rhythm. That cancels most steady sunlight and lamp light. A TV remote uses the same trick.',
    },
    {
      caption:
        'Infrared sensors are one of several ways to measure distance. Time-of-flight sensors send a very short pulse of light and time how long it takes to come back, which is how a phone camera focuses fast. Ultrasonic sensors do the same with sound. Each has strengths, so engineers pick the one that fits the job and the price.',
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'Three ways to measure distance',
          columns: ['Sensor', 'How it works', 'Good for'],
          rows: [
            ['IR triangulation', 'angle of the echo', 'cheap robots, 10 to 80 cm'],
            ['Time of flight', 'timing a light pulse', 'phones, drones, up to a few metres'],
            ['Ultrasonic', 'timing a sound echo', 'parking sensors, up to 4 m or more'],
          ],
          tone: 'cyan',
        },
      ],
      realLife: 'When you hold a phone to your ear and the screen turns off, a small IR LED and detector inside it noticed your head close to the glass.',
    },
  ],

  sandbox: {
    type: 'electric',
    mode: 'ir',
    intro: 'Move the object and watch the echo land on the strip. The sensor outputs a voltage, and distance is about 27 divided by that voltage.',
  },

  quiz: [
    {
      type: 'choice',
      q: 'What does an infrared distance sensor send out?',
      options: ['Invisible infrared light', 'Sound waves', 'Radio waves', 'A visible laser beam'],
      answer: 0,
      why: 'An IR LED sends light that our eyes cannot see, and the sensor looks for its echo.',
    },
    {
      type: 'choice',
      q: 'Which part catches the light that bounces back?',
      options: ['A photodiode', 'A resistor', 'The battery', 'A switch'],
      answer: 0,
      why: 'A photodiode lets a small current flow when light falls on it.',
    },
    {
      type: 'choice',
      q: 'A photodiode is in a row with a resistor. More light falls on it. What happens to the output voltage?',
      options: ['It rises', 'It falls', 'It stays the same', 'It reverses'],
      answer: 0,
      why: 'More light means more current, and more current through the resistor means more voltage.',
    },
    {
      type: 'choice',
      q: 'An object moves closer to an analog IR distance sensor (inside its normal range). What happens to its output voltage?',
      options: ['It rises', 'It falls', 'It stays the same', 'It switches off'],
      answer: 0,
      why: 'A close object sends the echo to the far end of the strip, which gives a high voltage.',
    },
    {
      type: 'choice',
      q: 'The sensor outputs 0.9 V and the rule is distance = 27 / voltage. About how far is the object?',
      options: ['30 cm', '3 cm', '0.9 cm', '243 cm'],
      answer: 0,
      why: '27 divided by 0.9 is 30, so about 30 cm.',
    },
    {
      type: 'choice',
      q: 'Why does a black object look farther away than a white one at the same distance?',
      options: ['It absorbs the infrared light, so the echo is weak', 'It is heavier', 'Black objects block the sensor', 'It reflects more light'],
      answer: 0,
      why: 'A weak echo is the same as the echo from a far object, so the sensor is fooled.',
    },
    {
      type: 'match',
      q: 'Match each part to its job.',
      items: [
        { id: 'led', label: 'Infrared LED' },
        { id: 'pd', label: 'Photodiode' },
        { id: 'cmp', label: 'Comparator' },
      ],
      targets: [
        { id: 'a', label: 'Sends the invisible light' },
        { id: 'b', label: 'Turns light into a small current' },
        { id: 'c', label: 'Turns a voltage into a yes or no' },
      ],
      answer: { led: 'a', pd: 'b', cmp: 'c' },
      why: 'The LED sends, the photodiode receives, and the comparator decides.',
    },
  ],

  recap: [
    'An IR distance sensor sends invisible infrared light and listens for the echo.',
    'The sender is an infrared LED. The receiver is a photodiode, where more light means more current.',
    'A simple detector says only yes or no. Triangulation, where the echo lands on a strip, measures distance.',
    'The output voltage falls as the object gets farther: distance is about 27 divided by the voltage.',
    'Black objects, mirrors, sunlight and very short or long range can fool it.',
  ],
});
