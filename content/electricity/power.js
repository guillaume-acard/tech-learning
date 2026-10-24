TL.registerLesson({
  id: 'electricity-power',
  title: 'Power: watts and energy',
  hook: 'A kettle is 2200 W and an LED bulb is 8 W. What is a watt, and how does it connect volts and amps?',
  cover: 'img/lessons/electricity-power.png',

  steps: [
    {
      caption:
        'Volts tell you the push, amps tell you the flow. Power tells you how fast energy is being used and turned into something useful: light, heat, motion or sound. It is measured in watts, written W. A bigger number means more energy per second. An 8 W bulb gives a gentle light, a 2200 W kettle boils water fast.',
      looksLike: {
        title: 'A kettle and an LED bulb',
        src: 'img/real/kettle-led-bulb.png',
        alt: 'A stainless steel electric kettle and an LED light bulb on a kitchen counter in front of two wall sockets',
        caption: 'The kettle (about 2200 W) and the LED bulb (about 8 W) plug into the same kind of socket, but the kettle uses hundreds of times more power.',
      },
      cards: [
        {
          kind: 'viz',
          viz: 'bars',
          title: 'How much power things use',
          items: [
            { label: 'LED bulb', value: 8, text: '8 W', tone: 'green' },
            { label: 'Phone charger', value: 10, text: '10 W', tone: 'green' },
            { label: 'Laptop', value: 60, text: '60 W', tone: 'cyan' },
            { label: 'TV', value: 100, text: '100 W', tone: 'cyan' },
            { label: 'Microwave', value: 1200, text: '1200 W', tone: 'amber' },
            { label: 'Kettle', value: 2200, text: '2200 W', tone: 'red' },
          ],
          max: 2200,
        },
      ],
    },
    {
      caption:
        'The three quantities are tied together by one simple rule. Power is the voltage times the current: watts = volts x amps. In the water picture, the power of a water jet depends on both how hard it pushes (pressure) and how much comes out (flow). Double either one and the power doubles.',
      cards: [
        [
          { t: 'Watts', sub: 'power', tone: 'amber' },
          { op: '=' },
          { t: 'Volts', sub: 'the push', tone: 'cyan' },
          { op: '×' },
          { t: 'Amps', sub: 'the flow', tone: 'green' },
        ],
        {
          kind: 'viz',
          viz: 'table',
          title: 'Working it out',
          columns: ['Device', 'Volts', 'Amps', 'Watts'],
          rows: [
            ['Phone charger', '5 V', '2 A', '10 W'],
            ['Car headlight', '12 V', '5 A', '60 W'],
            ['Kettle (Europe)', '230 V', '10 A', '2300 W'],
          ],
          tone: 'amber',
        },
      ],
    },
    {
      caption:
        'You can turn the rule around. If you know the watts and the volts, the current is amps = watts / volts. That is how you find out how much current a device takes from the wall. A 2300 W kettle on a 230 V socket draws 2300 / 230 = 10 A. The same kettle on a 12 V car battery would need almost 200 A, which is why cars do not have kettles.',
      looksLike: {
        title: 'Power lines',
        src: 'img/real/power-lines.png',
        alt: 'A tall steel pylon carrying high-voltage power cables across open countryside at sunset',
        caption: 'Power lines run at tens or hundreds of thousands of volts, so the current stays small. It is stepped down before it reaches your home.',
      },
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'The same 2300 W at different voltages',
          columns: ['Voltage', 'Current needed'],
          rows: [
            ['230 V', '10 A'],
            ['120 V', 'about 19 A'],
            ['12 V', 'about 192 A'],
          ],
          highlight: 0,
          tone: 'violet',
          note: 'The lower the voltage, the more current you need for the same power.',
        },
      ],
      realLife: 'This is why long-distance power lines use a very high voltage: the same power needs far less current, so thinner wires can be used and less energy is wasted as heat.',
    },
    {
      caption:
        'Power is a rate, like speed. Energy is the total, like the distance travelled. Energy = power x time. The electricity company measures it in kilowatt-hours (kWh). One kilowatt is 1000 watts. A 1000 W device left on for one hour uses 1 kWh. That is the number on your bill.',
      looksLike: {
        title: 'An electricity meter',
        src: 'img/real/electricity-meter.png',
        alt: 'A grey electricity meter with a small display, mounted on the outside wall of a house',
        caption: 'The meter counts the kilowatt-hours your home uses. That is the number you pay for.',
      },
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'Energy = power x time',
          columns: ['Device', 'Power', 'Time on', 'Energy'],
          rows: [
            ['LED bulb', '8 W', '10 hours', '0.08 kWh'],
            ['TV', '100 W', '3 hours', '0.3 kWh'],
            ['Kettle', '2200 W', '3 minutes', '0.11 kWh'],
            ['Heater', '2000 W', '5 hours', '10 kWh'],
          ],
          tone: 'cyan',
          note: 'A big device used briefly can cost less than a small one left on for hours. The kettle (0.11 kWh) uses about as much as the LED bulb left on for 14 hours.',
        },
      ],
    },
    {
      caption:
        'Power ends up as heat sooner or later, and heat is why wires have limits. The wires in the wall can safely carry only so much current. A breaker (or a fuse) watches the current and cuts the power if it gets too high. A 16 A breaker on a 230 V socket allows 230 x 16 = 3680 W. Plug in a kettle, a toaster and a hair dryer together and the breaker trips.',
      looksLike: {
        title: 'A breaker panel',
        src: 'img/real/breaker-panel.png',
        alt: 'The open front of a household breaker panel with a row of circuit breakers and many wires',
        caption: 'Each switch is a breaker for one circuit of the house. It trips when the current is too high.',
      },
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'What a 16 A breaker allows',
          columns: ['Switched on together', 'Total power', 'Current at 230 V', 'Result'],
          rows: [
            ['TV + laptop', '160 W', '0.7 A', 'Fine'],
            ['Kettle', '2200 W', '9.6 A', 'Fine'],
            ['Kettle + toaster', '3200 W', '13.9 A', 'Close to the limit'],
            ['Kettle + toaster + hair dryer', '5000 W', '21.7 A', 'Breaker trips'],
          ],
          cells: [[3, 3]],
          tone: 'red',
        },
      ],
      realLife: 'The breaker is a safety device. Without it, the wires would heat up until they could start a fire.',
    },
  ],

  sandbox: {
    type: 'electric',
    mode: 'power',
    intro: 'Switch on appliances and watch the current climb towards the limit of the breaker.',
  },

  quiz: [
    {
      type: 'choice',
      q: 'What does power measure?',
      options: ['How fast energy is used', 'The size of the push', 'The amount of charge in a wire', 'How long a battery lasts in total'],
      answer: 0,
      why: 'Power is energy per second, measured in watts.',
    },
    {
      type: 'choice',
      q: 'A charger delivers 5 V at 2 A. What is its power?',
      options: ['10 W', '7 W', '2.5 W', '3 W'],
      answer: 0,
      why: 'Watts = volts x amps = 5 x 2 = 10 W.',
    },
    {
      type: 'choice',
      q: 'A 2300 W kettle is plugged into a 230 V socket. How much current does it draw?',
      options: ['10 A', '230 A', '0.1 A', '2300 A'],
      answer: 0,
      why: 'Amps = watts / volts = 2300 / 230 = 10 A.',
    },
    {
      type: 'choice',
      q: 'A 1000 W heater runs for 2 hours. How much energy does it use?',
      options: ['2 kWh', '1 kWh', '500 kWh', '2000 kWh'],
      answer: 0,
      why: 'Energy = power x time = 1 kW x 2 h = 2 kWh.',
    },
    {
      type: 'choice',
      q: 'Why do long-distance power lines use a very high voltage?',
      options: ['The same power then needs less current, so less energy is lost as heat', 'High voltage is safer to touch', 'It makes the wires thicker', 'It makes the electricity travel faster'],
      answer: 0,
      why: 'For a given power, more volts means fewer amps, and the heating of the wire depends on the current.',
    },
    {
      type: 'choice',
      q: 'What does a breaker do when too many appliances are on?',
      options: ['It cuts the power when the current gets too high', 'It makes the voltage higher', 'It stores the extra current', 'It speeds up the appliances'],
      answer: 0,
      why: 'Too much current heats the wires. The breaker cuts the circuit before they get dangerous.',
    },
    {
      type: 'match',
      q: 'Match each unit to what it measures.',
      items: [
        { id: 'v', label: 'Volt' },
        { id: 'a', label: 'Amp' },
        { id: 'w', label: 'Watt' },
        { id: 'k', label: 'Kilowatt-hour' },
      ],
      targets: [
        { id: 'push', label: 'The push' },
        { id: 'flow', label: 'The flow' },
        { id: 'rate', label: 'How fast energy is used' },
        { id: 'total', label: 'Total energy used' },
      ],
      answer: { v: 'push', a: 'flow', w: 'rate', k: 'total' },
      why: 'Volts push, amps flow, watts are the rate of energy use, and kilowatt-hours are the total.',
    },
  ],

  recap: [
    'Power is how fast energy is used, measured in watts (W).',
    'Watts = volts x amps. Turned around, amps = watts / volts.',
    'The same power at a lower voltage needs a bigger current, which is why power lines use very high voltages.',
    'Energy = power x time, billed in kilowatt-hours (kWh).',
    'Too much power means too much current and hot wires, so breakers and fuses cut the circuit.',
  ],
});
