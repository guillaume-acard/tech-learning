TL.registerLesson({
  id: 'components-capacitor',
  title: 'Capacitors: a tiny rechargeable store',
  hook: 'A camera flash fires with a burst far bigger than its small battery could give. Where does the sudden energy come from?',
  cover: 'img/lessons/components-capacitor.png',

  steps: [
    {
      caption:
        'A capacitor stores a little electric charge and gives it back later. Inside are two metal plates very close together, with an insulator between them. When you connect a battery, charge piles up on one plate and leaves the other, so the plates hold opposite charges, like a tiny rechargeable battery that charges and empties in a flash.',
      looksLike: {
        title: 'Real capacitors',
        src: 'img/real/capacitors.png',
        alt: 'Photo of blue and black cylindrical capacitors and small orange ceramic disc capacitors with thin metal legs',
        caption: 'The tall cylinders are electrolytic capacitors, the small orange discs are ceramic ones. Bigger usually means more storage.',
      },
      cards: [
        { kind: 'viz', viz: 'circuit', diagram: 'symbols', items: ['capacitor', 'battery'] },
        [
          { t: 'Plate +', sub: 'holds extra charge', tone: 'amber' },
          { t: 'Insulator', sub: 'charge cannot cross', tone: 'dim' },
          { t: 'Plate -', sub: 'holds the opposite', tone: 'cyan' },
        ],
      ],
      realLife: 'A capacitor holds far less energy than a battery of the same size, but it can charge and release it thousands of times faster.',
    },
    {
      caption:
        'Capacity is measured in farads (F). One farad is huge, so real parts are in microfarads (µF, a millionth of a farad) or smaller. A small ceramic one might be 100 nF, a common electrolytic 100 µF. When the capacitor is full, the voltage across it equals the supply and no more current flows. It stops the steady flow of a battery, but lets changes through.',
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'Common sizes',
          columns: ['Kind', 'Typical size', 'Used for'],
          rows: [
            ['Ceramic disc', '10 nF to 1 µF', 'cleaning up fast noise next to a chip'],
            ['Electrolytic cylinder', '10 µF to 4700 µF', 'smoothing a power supply'],
            ['Supercapacitor', 'up to many farads', 'short backup power'],
          ],
          tone: 'cyan',
        },
      ],
    },
    {
      caption:
        'A capacitor does not charge instantly. Put a resistor in front of it and the charge builds up like water filling a tank through a narrow pipe: fast at first, then slower and slower. The time it takes is set by the resistance times the capacitance, written RC. After one RC the capacitor is at about 63% of the supply, after five RC it is practically full.',
      cards: [
        {
          kind: 'viz',
          viz: 'bars',
          title: 'How full the capacitor is',
          items: [
            { label: 'after 1 RC', value: 63, text: '63%', tone: 'amber' },
            { label: 'after 2 RC', value: 86, text: '86%', tone: 'amber' },
            { label: 'after 3 RC', value: 95, text: '95%', tone: 'green' },
            { label: 'after 5 RC', value: 99, text: '99%', tone: 'green' },
          ],
          max: 100,
        },
        [
          { t: '1 kΩ', sub: 'resistor', tone: 'amber' },
          { op: '×' },
          { t: '1000 µF', sub: 'capacitor', tone: 'cyan' },
          { op: '=' },
          { t: '1 second', sub: 'one RC', tone: 'green' },
        ],
      ],
      realLife: 'Ohms times farads really do give seconds. That is why RC is called the time constant.',
    },
    {
      caption:
        'This slow filling is useful. Capacitors are used for timing, because the time to reach a level is predictable. They smooth a power supply: when the supply wobbles, the capacitor gives charge back to fill the dips and soaks up the peaks. They also sit right next to chips to supply the sudden bursts of current the chip needs, which helps keep the voltage steady.',
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'What capacitors are for',
          columns: ['Job', 'Example'],
          rows: [
            ['Smooth a supply', 'next to the voltage regulator in a robot'],
            ['Give quick bursts', 'a camera flash, a motor starting up'],
            ['Timing', 'a blinking light, a delay of a few seconds'],
            ['Pass changes, block steady voltage', 'audio signals through an amplifier'],
          ],
          tone: 'violet',
        },
      ],
    },
    {
      caption:
        'Capacitors need a little care. Electrolytic ones have a plus and a minus leg and must be connected the right way round. Connected backwards, or to a voltage above their rating, they can overheat and burst. Large ones can also keep their charge long after the power is off, so a big capacitor in a power supply or a flash unit can give a nasty shock.',
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'Care with capacitors',
          columns: ['Rule', 'Why'],
          rows: [
            ['Check the polarity of electrolytics', 'wrong way round, they can burst'],
            ['Use a voltage rating above the supply', 'too much voltage breaks the insulator'],
            ['Discharge big ones before touching', 'they hold charge when unplugged'],
          ],
          tone: 'red',
        },
      ],
    },
  ],

  quiz: [
    {
      type: 'choice',
      q: 'What does a capacitor do?',
      options: ['Stores a little charge and gives it back', 'Makes light', 'Makes a voltage from nothing', 'Limits the current like a resistor'],
      answer: 0,
      why: 'Two plates hold opposite charges, which can be released later.',
    },
    {
      type: 'choice',
      q: 'What is the unit of capacitance?',
      options: ['The farad (F)', 'The ohm (Ω)', 'The watt (W)', 'The henry (H)'],
      answer: 0,
      why: 'Real capacitors use microfarads (µF) or smaller, because one farad is huge.',
    },
    {
      type: 'choice',
      q: 'A capacitor is charging through a resistor. After one RC time, how full is it, about?',
      options: ['63%', '100%', '10%', '25%'],
      answer: 0,
      why: 'The capacitor fills fast at first, and one time constant gives about 63%.',
    },
    {
      type: 'choice',
      q: 'A 10 kΩ resistor charges a 100 µF capacitor. What is one RC?',
      options: ['1 second', '10 milliseconds', '10 seconds', '100 seconds'],
      answer: 0,
      why: '10 000 Ω x 0.0001 F = 1 second.',
    },
    {
      type: 'choice',
      q: 'Why is a capacitor placed next to a chip on a robot board?',
      options: ['It supplies quick bursts of current and keeps the voltage steady', 'It makes the chip run faster', 'It stores the program', 'It lights up when the chip works'],
      answer: 0,
      why: 'The capacitor fills the small dips that fast changes in current would cause.',
    },
    {
      type: 'choice',
      q: 'What can happen if an electrolytic capacitor is connected backwards?',
      options: ['It can overheat and burst', 'It stores twice as much', 'Nothing at all', 'It turns into a resistor'],
      answer: 0,
      why: 'Electrolytics have a polarity and can fail violently with the wrong one.',
    },
  ],

  recap: [
    'A capacitor is two plates with an insulator between, storing a little charge.',
    'Capacity is measured in farads, usually microfarads (µF).',
    'Through a resistor it charges on a curve: 63% after one RC, nearly full after five.',
    'It smooths supplies, gives quick bursts, and times things.',
    'Mind the polarity and the voltage rating, and discharge big ones.',
  ],
});
