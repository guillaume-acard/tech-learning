TL.registerLesson({
  id: 'waves-wifi',
  title: 'How wi-fi carries data through the air',
  hook: 'No cable, yet your phone loads a video from a box across the room. What actually travels through the air, and why does one wall make it so much slower?',
  cover: 'img/lessons/waves-wifi.png',

  steps: [
    {
      caption:
        'A wi-fi router is a small radio transmitter and receiver. The two sticks on top are antennas. Electricity wiggling quickly in an antenna makes a radio wave leave it, and when that wave hits another antenna it makes a tiny matching wiggle of electricity there. That is the whole trick: a signal in one antenna, a copy in another, and nothing joining them.',
      looksLike: {
        title: 'A home wi-fi router',
        src: 'img/real/wifi-router.png',
        alt: 'Photo of a black wi-fi router with two upright antennas and small green lights standing on a wooden shelf in a living room',
        caption: 'The antennas are often hidden inside the case. Wi-fi waves are microwaves a few centimetres long, so the antennas can be small.',
      },
      cards: [
        [
          { t: 'Router', sub: 'electricity wiggles in the antenna', tone: 'cyan' },
          { op: '→' },
          { t: 'Radio wave', sub: 'travels through the air', tone: 'amber' },
          { op: '→' },
          { t: 'Phone', sub: 'matching wiggle in its antenna', tone: 'green' },
        ],
      ],
    },
    {
      caption:
        'A steady wave on its own carries no information, just like a lamp that stays on tells you nothing. To send data you must change the wave in a way the receiver can spot. This is called modulation. Remember from the computer chapter that all data is bits, ones and zeros, so the job is to turn each bit into a change of the wave.',
      cards: [
        {
          kind: 'viz',
          viz: 'wave',
          waves: [{ label: 'A steady wave: carries nothing', cycles: 12, amp: 30, tone: 'dim' }],
        },
      ],
    },
    {
      caption:
        'The simplest way is to change the height of the wave. A tall wave means 1 and a short wave means 0. This is called amplitude modulation, and it is how old AM radio worked. The receiver only has to measure how tall each wiggle is.',
      cards: [
        {
          kind: 'viz',
          viz: 'wave',
          waves: [{ label: 'Amplitude modulation: tall = 1, short = 0', kind: 'am', bits: '1011', cycles: 12, amp: 34, tone: 'cyan' }],
        },
      ],
      realLife: 'Real wi-fi does not use this simple version, but the idea is the same: a tiny change in the wave stands for bits.',
    },
    {
      caption:
        'You can also change how fast the wave wiggles. A faster wiggle means 1 and a slower one means 0. This is frequency modulation, used by FM radio. Strong noise changes height more easily than it changes frequency, so this stays clearer. Wi-fi uses a clever mix: it changes the height and the timing of the wave together, which lets each tiny change carry many bits at once.',
      cards: [
        {
          kind: 'viz',
          viz: 'wave',
          waves: [{ label: 'Frequency modulation: fast = 1, slow = 0', kind: 'fm', bits: '1011', amp: 34, tone: 'violet' }],
        },
        {
          kind: 'viz',
          viz: 'table',
          title: 'More bits per change means more speed, but needs a cleaner signal',
          columns: ['Signal', 'Bits per change', 'Needs'],
          rows: [
            ['Weak or noisy', '1 or 2', 'very little'],
            ['Good', '4 or 6', 'a clear, strong signal'],
            ['Excellent (close to the router)', '8 or more', 'a very clean signal'],
          ],
          tone: 'cyan',
        },
      ],
      realLife: 'When your phone is close to the router it uses the fast, tightly packed mode. Further away it quietly drops to a slower, safer mode. That is why speed falls as you walk away.',
    },
    {
      caption:
        'Wi-fi uses two main bands. 2.4 GHz has longer waves: they go further and pass through walls better, but there is less room and it is crowded. 5 GHz has shorter waves: it is faster and less crowded, but it fades quicker with distance and walls. Each band is cut into channels, like lanes on a road.',
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: '2.4 GHz and 5 GHz compared',
          columns: ['', '2.4 GHz', '5 GHz'],
          rows: [
            ['Range through walls', 'better', 'worse'],
            ['Top speed', 'lower', 'higher'],
            ['Crowding (neighbours, Bluetooth, ovens)', 'very crowded', 'much quieter'],
            ['Best for', 'far rooms, smart plugs', 'laptop and TV near the router'],
          ],
          tone: 'cyan',
        },
      ],
    },
    {
      caption:
        'Everyone on a channel shares the same air, and two devices talking at once garble each other. So wi-fi devices are polite. Before sending, a device listens. If the channel is busy it waits a random short time and tries again. Only when it is quiet does it send, and the receiver replies with a short confirmation.',
      cards: [
        {
          kind: 'viz',
          viz: 'sequence',
          actors: ['Phone', 'Air', 'Router'],
          messages: [
            { from: 0, to: 1, text: 'listens: is anyone talking?', tone: 'dim', note: 'busy, wait a random time' },
            { from: 0, to: 1, text: 'listens again: quiet', tone: 'dim', note: 'now it is free' },
            { from: 0, to: 2, text: 'sends the data', tone: 'amber', note: 'a burst of waves' },
            { from: 2, to: 0, text: 'confirms: got it', tone: 'green', note: 'if no confirmation, send again' },
          ],
        },
      ],
      realLife: 'This is why wi-fi gets slow in a block of flats: hundreds of networks are all taking turns on the same few channels.',
    },
    {
      caption:
        'A radio wave spreads out in all directions, like a ripple on a pond, so its energy thins out quickly with distance. Double the distance and the signal is not half as strong, it is many times weaker. Walls absorb more, and brick, concrete and metal absorb the most. Signal strength is measured in dBm: closer to zero is stronger, and each 10 steps down is ten times weaker.',
      cards: [
        {
          kind: 'viz',
          viz: 'bars',
          title: 'Typical signal strength (dBm, higher is better)',
          items: [
            { label: 'Next to router', value: 95, text: '-30 dBm', tone: 'green' },
            { label: 'Same room, 5 m', value: 80, text: '-50 dBm', tone: 'green' },
            { label: 'Next room, one wall', value: 55, text: '-65 dBm', tone: 'amber' },
            { label: 'Far end, two walls', value: 25, text: '-80 dBm', tone: 'red' },
          ],
          max: 100,
        },
      ],
      realLife: 'The values are rounded and depend on the building. Metal, mirrors, water pipes, and even a fish tank can block more than you would think, because water absorbs 2.4 GHz waves.',
    },
    {
      caption:
        'How do engineers see these invisible waves? A spectrum analyser is a receiver that sweeps across the frequencies and draws how strong the signal is at each one. A peak is a transmitter. Wi-fi routers, Bluetooth devices and even a running microwave oven show up as separate peaks and smears.',
      looksLike: {
        title: 'A spectrum analyser',
        src: 'img/real/spectrum-analyzer.png',
        alt: 'Photo of a bench spectrum analyser with a screen showing coloured peaks over a grid, connected to a small antenna on a stand',
        caption: 'Each peak on the screen is a transmitter. The small antenna on the right picks up the waves and the screen draws them.',
      },
      cards: [
        {
          kind: 'viz',
          viz: 'bars',
          title: 'What a sweep over the 2.4 GHz band might show (made-up numbers)',
          items: [
            { label: 'Wi-fi, channel 1', value: 70, text: 'strong peak', tone: 'cyan' },
            { label: 'Wi-fi, channel 6', value: 90, text: 'strongest peak', tone: 'cyan' },
            { label: 'Bluetooth', value: 25, text: 'short flicks', tone: 'violet' },
            { label: 'Microwave oven', value: 45, text: 'wide smear when running', tone: 'amber' },
          ],
          max: 100,
        },
      ],
    },
    {
      caption:
        'To test an antenna fairly you need a place with no echoes and no other signals. A radio testing room, called an anechoic chamber, has walls covered with spikes of foam soaked in carbon, which soak up waves instead of reflecting them. Inside, engineers point a test antenna at a device and measure exactly how its signal spreads in each direction.',
      looksLike: {
        title: 'An anechoic chamber',
        src: 'img/real/anechoic-chamber.png',
        alt: 'Photo of the inside of a room completely covered by grey-blue foam pyramids, with a horn antenna on a stand in the middle and a person standing at the door',
        caption: 'The foam pyramids turn waves into a tiny bit of heat so nothing bounces back. A device under test sits in the middle.',
      },
      realLife: 'In your home the opposite happens: walls, furniture and people reflect waves in many directions, so wi-fi arrives along several paths at once. Moving a router by a metre can change the signal a lot.',
    },
  ],

  sandbox: {
    type: 'wifi',
    intro: 'The router is in the living room. Drag the phone around the house and watch the signal.',
    goalText: 'Find a spot where 5 GHz is slower than 2.4 GHz. Then find a place near the oven where switching it on kills the 2.4 GHz connection but 5 GHz still works.',
  },

  quiz: [
    {
      type: 'choice',
      q: 'What actually travels from the router to your phone?',
      options: ['A radio wave', 'Electricity along the air', 'Sound', 'Small particles of plastic'],
      answer: 0,
      why: 'The router makes a radio wave in its antenna, and the phone\'s antenna turns the wave back into a signal.',
    },
    {
      type: 'choice',
      q: 'Why can a steady, unchanging wave not carry a message?',
      options: ['There is nothing in it for the receiver to tell apart', 'It is too fast', 'It is too weak', 'It cannot cross walls'],
      answer: 0,
      why: 'Data needs changes. Modulation changes the height, speed or timing of the wave so bits can be told apart.',
    },
    {
      type: 'choice',
      q: 'What does changing the height of a wave to mean 1 or 0 do?',
      options: ['It encodes bits in the wave, which is called modulation', 'It makes the wave faster', 'It adds a password', 'It makes the wave louder'],
      answer: 0,
      why: 'The receiver measures each change and reads the bits back out.',
    },
    {
      type: 'choice',
      q: 'Why does wi-fi speed drop as you walk away from the router?',
      options: ['The signal gets weaker, so the phone switches to a slower, safer way of packing bits', 'The router gets tired', 'The phone runs out of data', 'The waves slow down'],
      answer: 0,
      why: 'A weaker, noisier signal cannot carry the tightly packed modes, so devices fall back to fewer bits per change.',
    },
    {
      type: 'choice',
      q: 'You are two rooms away from the router with two walls in between. Which band is likely to work better?',
      options: ['2.4 GHz', '5 GHz', 'Both are exactly equal', 'Neither can work'],
      answer: 0,
      why: 'Longer 2.4 GHz waves lose less on the way through walls. 5 GHz is faster but fades quicker.',
    },
    {
      type: 'choice',
      q: 'What does a device do before sending on a busy wi-fi channel?',
      options: ['It listens, waits a random short time and tries again', 'It sends louder', 'It shuts down the other device', 'It changes its address'],
      answer: 0,
      why: 'Being polite and waiting avoids two devices garbling each other.',
    },
    {
      type: 'match',
      q: 'Match each tool or place to its job.',
      items: [
        { id: 'sa', label: 'Spectrum analyser' },
        { id: 'an', label: 'Anechoic chamber' },
        { id: 'mo', label: 'Modulation' },
        { id: 'db', label: 'dBm' },
      ],
      targets: [
        { id: 'a', label: 'Draws how strong the signal is at each frequency' },
        { id: 'b', label: 'A room with no echoes for testing antennas' },
        { id: 'c', label: 'Changing a wave so it carries bits' },
        { id: 'd', label: 'A way to measure signal strength' },
      ],
      answer: { sa: 'a', an: 'b', mo: 'c', db: 'd' },
      why: 'Each one is part of how engineers build and test wireless devices.',
    },
  ],

  recap: [
    'A wi-fi router and your phone are small radios. Electricity wiggling in one antenna makes a wave that creates a matching signal in the other.',
    'To carry data, the wave is changed in tiny ways (its height, speed or timing). This is modulation, and each change stands for one or more bits.',
    'Close to the router the signal is clean, so many bits ride on each change. Far away, devices fall back to fewer bits, so it is slower.',
    '2.4 GHz travels further and through walls but is crowded. 5 GHz is faster but fades sooner. Devices on one channel take turns.',
    'Engineers see invisible waves with spectrum analysers and test antennas in rooms that absorb all echoes.',
  ],
});
