TL.registerLesson({
  id: 'electricity-current',
  title: 'Current: how much flows',
  hook: 'Voltage is the push. What is the amp, and what decides how much flows?',
  cover: 'img/lessons/electricity-current.png',

  steps: [
    {
      caption:
        'Current is how much charge flows past a point every second. In the water picture it is the number of litres per second through the pipe. It is measured in amperes, called amps for short and written A. A wide pipe lets a lot through, a narrow pipe only a trickle, even when the pressure is the same.',
      cards: [
        {
          kind: 'viz',
          viz: 'circuit',
          diagram: 'water',
          title: 'Same pressure, different pipes',
          cases: [
            { level: 0.8, pipe: 0.2, caption: 'Narrow pipe: small current' },
            { level: 0.8, pipe: 1, caption: 'Wide pipe: large current' },
          ],
        },
      ],
    },
    {
      caption:
        'Volts and amps are easy to mix up. Voltage is the push and exists between two points, even when nothing moves. Current is the flow and happens through a wire, and only when there is a closed loop. A waterfall makes a good picture: the voltage is how high it is, the current is how much water falls each second.',
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'Voltage and current',
          columns: ['', 'Voltage', 'Current'],
          rows: [
            ['It is', 'the push', 'the flow'],
            ['Unit', 'volt (V)', 'amp (A)'],
            ['Water picture', 'pressure', 'litres per second'],
            ['Measured', 'between two points', 'through a wire'],
            ['Needs a loop?', 'No', 'Yes'],
          ],
          tone: 'cyan',
        },
      ],
    },
    {
      caption:
        'An amp is a lot, so small devices use thousandths of an amp, called milliamps (mA). 1 A is 1000 mA. A small indicator LED uses about 20 mA. A phone charger delivers a couple of amps. A kettle pulls around ten.',
      looksLike: {
        title: 'Measuring current',
        src: 'img/real/multimeter.png',
        alt: 'A yellow digital multimeter with test leads next to a small breadboard circuit with a red LED and a resistor',
        caption: 'A multimeter can measure amps, volts and ohms. To measure current it is connected in the loop, so the current flows through it.',
      },
      cards: [
        {
          kind: 'viz',
          viz: 'bars',
          title: 'Typical currents',
          items: [
            { label: 'Indicator LED', value: 0.02, text: '0.02 A (20 mA)', tone: 'green' },
            { label: 'Phone charging', value: 2, text: '2 A', tone: 'cyan' },
            { label: 'Laptop charger', value: 3, text: '3 A', tone: 'cyan' },
            { label: 'Kettle', value: 10, text: '10 A', tone: 'amber' },
            { label: 'House breaker', value: 16, text: '16 A limit', tone: 'red' },
          ],
          max: 16,
        },
      ],
      realLife: 'It is current, not voltage, that does the harm in an electric shock. Even a few tens of milliamps through the chest can be dangerous.',
    },
    {
      caption:
        'What decides how much current flows? Two things. A bigger push (more volts) gives more current. A narrower pipe (more resistance) gives less current. Resistance is measured in ohms. The next lessons turn this into a simple rule; for now just keep the picture: more pressure, more flow; narrower pipe, less flow.',
      cards: [
        {
          kind: 'viz',
          viz: 'circuit',
          diagram: 'water',
          title: 'What changes the flow',
          cases: [
            { level: 0.4, pipe: 0.6, caption: 'Low pressure: little flow' },
            { level: 1, pipe: 0.6, caption: 'More pressure: more flow' },
            { level: 1, pipe: 0.15, caption: 'More pressure but a very narrow pipe: little flow again' },
          ],
        },
      ],
    },
    {
      caption:
        'A common mistake is to think the lamp "uses up" the current, so there is less after it. It does not. Charge is not used up: the same current flows all the way round a simple loop, like water in a closed ring of pipes. What the lamp uses is the energy the charge carries, and it turns it into light and heat.',
      cards: [
        {
          kind: 'viz',
          viz: 'circuit',
          diagram: 'switch',
          title: 'Same current everywhere in the loop',
          cases: [{ on: true, caption: 'The current leaving the battery equals the current coming back' }],
        },
      ],
    },
    {
      caption:
        'Which way does the current go? By an old convention, current is drawn flowing from the plus side of the battery, round the loop, back to the minus side. The electrons in a wire actually drift the other way, but the maths and all the diagrams use the convention. A battery gives a current that always flows one way (DC, direct current). The wall socket swaps direction 50 or 60 times a second (AC, alternating current).',
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'Two kinds of current',
          columns: ['', 'DC (direct)', 'AC (alternating)'],
          rows: [
            ['Direction', 'always the same way', 'swaps back and forth'],
            ['Comes from', 'batteries, USB, chargers', 'the wall socket'],
            ['Used by', 'electronics and chips', 'lamps, kettles, motors at home'],
          ],
          tone: 'violet',
        },
      ],
      realLife: 'Your phone charger turns the AC from the wall into the steady DC that electronics need.',
    },
  ],

  sandbox: {
    type: 'electric',
    mode: 'ohm',
    intro: 'Slide the voltage and the resistance and read the current. You are playing with the water tank.',
  },

  quiz: [
    {
      type: 'choice',
      q: 'What does current measure?',
      options: ['How much charge flows each second', 'The size of the push', 'The length of a wire', 'The colour of the light'],
      answer: 0,
      why: 'Current is the flow, measured in amps. The push is voltage.',
    },
    {
      type: 'choice',
      q: 'What is 20 mA in amps?',
      options: ['0.02 A', '20 A', '2 A', '0.0002 A'],
      answer: 0,
      why: 'A milliamp is a thousandth of an amp, so 20 mA = 20 / 1000 = 0.02 A.',
    },
    {
      type: 'choice',
      q: 'You keep the voltage the same but make the resistance bigger. What happens to the current?',
      options: ['It gets smaller', 'It gets bigger', 'It stays the same', 'It reverses'],
      answer: 0,
      why: 'A narrower pipe lets less water through at the same pressure.',
    },
    {
      type: 'choice',
      q: 'In a simple loop with a battery and one lamp, how does the current before the lamp compare with the current after it?',
      options: ['They are the same', 'It is larger before the lamp', 'It is larger after the lamp', 'There is no current after the lamp'],
      answer: 0,
      why: 'Charge is not used up. The lamp uses the energy, not the current.',
    },
    {
      type: 'choice',
      q: 'Which of these can exist even when nothing is flowing?',
      options: ['Voltage', 'Current', 'Both', 'Neither'],
      answer: 0,
      why: 'A battery on a shelf has a voltage between its ends. Current needs a closed loop.',
    },
    {
      type: 'choice',
      q: 'Which type of electricity comes from a battery?',
      options: ['DC: it always flows the same way', 'AC: it swaps direction 50 times a second', 'Neither', 'Both at once'],
      answer: 0,
      why: 'Batteries give direct current. The wall socket gives alternating current.',
    },
    {
      type: 'match',
      q: 'Match each question to the quantity that answers it.',
      items: [
        { id: 'push', label: 'How hard is the push?' },
        { id: 'flow', label: 'How much is flowing?' },
        { id: 'slow', label: 'How much does the part resist the flow?' },
      ],
      targets: [
        { id: 'v', label: 'Voltage (volts)' },
        { id: 'a', label: 'Current (amps)' },
        { id: 'r', label: 'Resistance (ohms)' },
      ],
      answer: { push: 'v', flow: 'a', slow: 'r' },
      why: 'Push is voltage, flow is current, and the narrow pipe is resistance.',
    },
  ],

  recap: [
    'Current is how much charge flows each second, measured in amps (A). Small currents are in milliamps (mA).',
    'Voltage is the push and can exist without a flow. Current is the flow and needs a closed loop.',
    'More voltage gives more current, more resistance gives less.',
    'Current is not used up in a loop: the same current flows everywhere in a simple circuit.',
    'Batteries give DC (one direction), the wall socket gives AC (swapping direction).',
  ],
});
