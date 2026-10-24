TL.registerLesson({
  id: 'components-led',
  title: 'LEDs: lights that work one way',
  hook: 'LEDs are in every screen, remote and bulb. What is inside one, and why do they burn out so easily?',
  cover: 'img/lessons/components-led.png',

  steps: [
    {
      caption:
        'LED stands for Light Emitting Diode. It is a tiny light that turns electricity straight into light without heating a wire first. That makes it efficient and long lasting. An old filament bulb wastes most of its energy as heat. An LED bulb gives the same light with a fraction of the power.',
      looksLike: {
        title: 'A real LED',
        src: 'img/real/led.png',
        alt: 'Photo of a red LED with two metal legs, one longer than the other, on a table',
        caption: 'A small LED. The longer leg is the plus side. Inside the clear dome is a tiny chip of semiconductor that glows.',
      },
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'Same light, different power',
          columns: ['Bulb', 'Power', 'Lifetime'],
          rows: [
            ['Old filament bulb', '60 W', 'about 1000 hours'],
            ['LED bulb', '8 W', 'about 25 000 hours'],
          ],
          highlight: 1,
          tone: 'green',
        },
      ],
    },
    {
      caption:
        'The word diode matters. A diode is a one-way valve for current: it lets current through in one direction and blocks it in the other. The LED symbol shows this: the triangle points the way current may flow, and the bar is the wall that stops it coming back. The little arrows mean it gives out light.',
      cards: [
        {
          kind: 'viz',
          viz: 'circuit',
          diagram: 'symbols',
          items: ['led'],
        },
        {
          kind: 'viz',
          viz: 'circuit',
          diagram: 'led',
          title: 'The right way and the wrong way round',
          cases: [
            { state: 'on', volts: 9, ohms: 470, caption: 'Right way round: current flows, the LED glows' },
            { state: 'reversed', volts: 9, ohms: 470, caption: 'Backwards: the current is blocked, the LED stays dark' },
          ],
        },
      ],
      realLife: 'This is why LEDs have a plus and a minus leg. The longer leg is the anode (plus), the shorter one is the cathode (minus), and the cathode side of the case is often flat.',
    },
    {
      caption:
        'An LED will not light just because the voltage is above zero. It needs a minimum push before it conducts at all, called its forward voltage. Below that, nothing flows. The value depends on the colour, because the colour comes from the material. A red LED needs about 2 V, a blue or white one needs about 3 V.',
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'Typical forward voltage',
          columns: ['Colour', 'Forward voltage'],
          rows: [
            ['Red', 'about 2.0 V'],
            ['Yellow and orange', 'about 2.1 V'],
            ['Green', 'about 2.2 V'],
            ['Blue and white', 'about 3.0 to 3.3 V'],
          ],
          tone: 'amber',
        },
        {
          kind: 'viz',
          viz: 'circuit',
          diagram: 'led',
          cases: [{ state: 'dark', volts: 1.5, ohms: 100, caption: 'A 1.5 V cell is below the 2 V a red LED needs: dark' }],
        },
      ],
    },
    {
      caption:
        'Above the forward voltage, the LED behaves very differently from a lamp. A small extra push makes the current rise steeply. An LED has almost no resistance of its own to hold it back, so it cannot limit its own current. A typical LED is happy at about 20 mA. Several times that, and it overheats and burns out in a flash.',
      cards: [
        {
          kind: 'viz',
          viz: 'circuit',
          diagram: 'led',
          title: 'An LED connected straight to a battery',
          cases: [{ state: 'noresistor', volts: 9, caption: 'No limit on the current: the LED burns out' }],
        },
        {
          kind: 'viz',
          viz: 'bars',
          title: 'Current through a red LED',
          items: [
            { label: '1 mA', value: 1, text: 'barely lit', tone: 'dim' },
            { label: '10 mA', value: 10, text: 'clearly lit', tone: 'green' },
            { label: '20 mA', value: 20, text: 'full brightness (the limit)', tone: 'amber' },
            { label: '30 mA+', value: 30, text: 'too much: it dies', tone: 'red' },
          ],
          max: 30,
        },
      ],
      realLife: 'A bright LED looks like it is nearly free, but it is the circuit around it that keeps it alive.',
    },
    {
      caption:
        'The fix is simple. Put a resistor in the loop, in a row with the LED. The resistor takes the extra voltage and limits the current to a safe value. The next lesson shows how to choose it. For now, remember the rule: an LED always needs a resistor, the right way round, with a battery above its forward voltage.',
      cards: [
        {
          kind: 'viz',
          viz: 'circuit',
          diagram: 'led',
          title: 'The standard LED circuit',
          cases: [{ state: 'on', volts: 9, ohms: 470, caption: 'Battery, resistor and LED in a loop' }],
        },
        [
          { t: 'Enough voltage', sub: 'above the forward voltage', tone: 'cyan' },
          { op: '+' },
          { t: 'Right way round', sub: 'plus to the long leg', tone: 'amber' },
          { op: '+' },
          { t: 'A resistor', sub: 'limits the current', tone: 'green' },
        ],
      ],
    },
    {
      caption:
        'LEDs are everywhere. The same part, in different sizes and colours, lights a standby button, a TV backlight, a street lamp, a car brake light and a phone flash. In a screen, every single tiny dot of colour is a very small LED or is lit by one.',
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'Where LEDs are used',
          columns: ['Where', 'What the LED does'],
          rows: [
            ['A device status light', 'tells you it is on or charging'],
            ['TV and monitor', 'lights up the picture'],
            ['Remote control', 'an invisible infrared LED sends the button code'],
            ['Light bulb', 'lights the room using little power'],
            ['Fibre-optic internet', 'a related light source sends the data as flashes'],
          ],
          tone: 'cyan',
        },
      ],
    },
  ],

  sandbox: {
    type: 'electric',
    mode: 'led',
    intro: 'Pick a battery and a resistor. This LED needs 2 V and is happy at about 20 mA. Try the challenges.',
  },

  quiz: [
    {
      type: 'choice',
      q: 'What does LED stand for?',
      options: ['Light Emitting Diode', 'Low Energy Device', 'Linked Electric Display', 'Large Electronic Dot'],
      answer: 0,
      why: 'It is a diode, a one-way component, that gives out light.',
    },
    {
      type: 'choice',
      q: 'What does a diode do?',
      options: ['Lets current through in one direction only', 'Stores electricity', 'Increases the voltage', 'Works only in the dark'],
      answer: 0,
      why: 'A diode is a one-way valve for current.',
    },
    {
      type: 'choice',
      q: 'You connect an LED backwards to a battery. What happens?',
      options: ['No current flows and it stays dark', 'It glows twice as bright', 'It explodes at once', 'It turns blue'],
      answer: 0,
      why: 'In the wrong direction the diode blocks the current.',
    },
    {
      type: 'choice',
      q: 'A red LED needs about 2 V. Will it light with a single 1.5 V cell?',
      options: ['No: 1.5 V is below its forward voltage', 'Yes, at full brightness', 'Yes, but dimly', 'Only if it is facing up'],
      answer: 0,
      why: 'Below the forward voltage, an LED does not conduct at all.',
    },
    {
      type: 'choice',
      q: 'Why does an LED connected straight to a 9 V battery burn out?',
      options: ['Nothing limits the current, so far too much flows', 'The battery is too weak', 'LEDs hate batteries', 'The voltage is too low'],
      answer: 0,
      why: 'An LED has almost no resistance of its own. Without a limit, the current rises until it overheats.',
    },
    {
      type: 'choice',
      q: 'What is the usual safe current for a small LED?',
      options: ['About 20 mA', 'About 20 A', 'About 2 A', 'About 0.2 mA'],
      answer: 0,
      why: 'Small LEDs are rated around 20 mA, and often run at 5 to 15 mA.',
    },
    {
      type: 'choice',
      q: 'What protects an LED in a simple circuit?',
      options: ['A resistor in a row with it', 'A second battery', 'A longer wire', 'A bigger LED'],
      answer: 0,
      why: 'The resistor limits the current to a safe value.',
    },
  ],

  recap: [
    'An LED is a light emitting diode: an efficient light that lets current flow one way only.',
    'It must be connected the right way round: plus to the long leg.',
    'It needs a minimum voltage (its forward voltage) before it lights: about 2 V for red, about 3 V for blue and white.',
    'An LED cannot limit its own current, and above about 20 mA it can burn out.',
    'Always put a resistor in a row with an LED.',
  ],
});
