TL.registerLesson({
  id: 'waves-bluetooth',
  title: 'Wi-fi vs Bluetooth: two radios, one crowded band',
  hook: 'Your earbuds and your router both talk on about 2.4 GHz, yet your music rarely stutters while the wi-fi is busy. How do two radios share the same air?',
  cover: 'img/lessons/waves-bluetooth.png',

  steps: [
    {
      caption:
        'Wi-fi and Bluetooth are both radios in the microwave part of the spectrum, but they are built for different jobs. Wi-fi is a fast, wide pipe that joins a device to a network and the internet. Bluetooth is a gentle short-range link that joins two nearby devices: earbuds to phone, keyboard to laptop, watch to phone.',
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'Same kind of wave, different job',
          columns: ['', 'Wi-fi', 'Bluetooth'],
          rows: [
            ['Main job', 'internet and network', 'link two nearby devices'],
            ['Typical range', 'a house (30 m or more)', 'a room (about 10 m)'],
            ['Typical power', 'about 0.1 W', 'about 0.01 W'],
            ['Typical speed', 'hundreds of Mbit/s', 'about 1 to 2 Mbit/s'],
            ['Battery use', 'higher', 'very low'],
          ],
          tone: 'cyan',
        },
      ],
      realLife: 'The figures are typical values. Newer versions of both are faster and some Bluetooth devices reach much further, but the balance stays the same: wi-fi for speed, Bluetooth for low power.',
    },
    {
      caption:
        'Earbuds are tiny, so they have tiny batteries. Sending at low power and at a modest speed lets them play for hours. Bluetooth trades speed and range for energy: a short, gentle signal is enough to cross a desk, and audio needs far fewer bits than a video.',
      looksLike: {
        title: 'Wireless earbuds',
        src: 'img/real/bluetooth-earbuds.png',
        alt: 'Photo of a pair of white wireless earbuds resting in their open charging case on a desk',
        caption: 'Inside each earbud is a coin-sized battery and a tiny radio and antenna, all talking to the phone with a very weak signal.',
      },
      cards: [
        {
          kind: 'viz',
          viz: 'bars',
          title: 'Transmit power (rough, for comparing)',
          items: [
            { label: 'Bluetooth earbuds', value: 1, text: 'about 0.01 W', tone: 'green' },
            { label: 'Wi-fi router', value: 10, text: 'about 0.1 W', tone: 'cyan' },
            { label: 'Microwave oven', value: 100, text: 'about 1000 W', tone: 'amber' },
          ],
          max: 100,
        },
      ],
    },
    {
      caption:
        'The problem: both live in the 2.4 GHz band. That band is only about 80 MHz wide. Each wi-fi channel takes 20 MHz of it, so just three wi-fi channels (1, 6 and 11) fill most of it. Bluetooth has to squeeze in between them, along with baby monitors, mice and microwave ovens.',
      cards: [
        { kind: 'viz', viz: 'spectrum', highlight: [1] },
        {
          kind: 'viz',
          viz: 'table',
          title: 'Who shares the 2.4 GHz band',
          columns: ['Who', 'How much of the band it takes'],
          rows: [
            ['Wi-fi channel 1, 6 or 11', 'about 20 MHz each, about a quarter'],
            ['Bluetooth', 'only 1 MHz at a time, but it moves'],
            ['Microwave oven', 'a smear across a lot of it when running'],
          ],
          tone: 'amber',
        },
      ],
    },
    {
      caption:
        'Suppose Bluetooth picked one channel and stayed there. If a wi-fi network sits on top of it, every packet is lost. In this grid, time goes left to right and frequency goes bottom to top. The orange stripe is a busy wi-fi channel and the dots are Bluetooth packets. Every dot lands inside the stripe, so every one is lost.',
      cards: [
        {
          kind: 'viz',
          viz: 'hop',
          wifi: [3, 6],
          hops: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
        },
      ],
      realLife: 'This is the worst case. In practice wi-fi is not busy all the time, but one bad spot would still wreck a call.',
    },
    {
      caption:
        'Bluetooth\'s answer is to never stay still. It splits the band into 79 channels, 1 MHz each, and jumps to a new one about 1600 times every second. Both devices follow the same secret-looking pattern, so they always know where the other will be. A wi-fi network now only ruins the few hops that land on it, and those packets are simply sent again.',
      cards: [
        {
          kind: 'viz',
          viz: 'hop',
          wifi: [3, 6],
          hops: [9, 2, 11, 5, 0, 7, 3, 10, 1, 8, 4, 6],
        },
      ],
      realLife: 'The grid shows 12 channels for clarity. Real Bluetooth has 79, so a wi-fi channel covers only about a quarter of the hops.',
    },
    {
      caption:
        'How do two devices agree where to jump? When they pair, one of them (the leader) shares a clock and a number that both use to compute the same sequence of channels. Nobody has to announce each jump, so no airtime is wasted. If the pattern is lost, the link drops until it is found again.',
      cards: [
        {
          kind: 'viz',
          viz: 'sequence',
          actors: ['Phone (leader)', 'Earbuds'],
          messages: [
            { from: 0, to: 1, text: 'pairing: here is my clock and my number', tone: 'cyan', note: 'shared once' },
            { from: 0, to: 1, text: 'packet on channel 17', tone: 'amber', note: 'both know the pattern' },
            { from: 1, to: 0, text: 'reply on channel 52', tone: 'green', note: 'next hop, a fraction of a second later' },
          ],
        },
      ],
    },
    {
      caption:
        'Modern Bluetooth is smarter still. It listens to which channels are noisy, for example where your wi-fi is, and takes them out of its pattern. This is called adaptive hopping. Now the dots stay out of the orange stripe, and almost nothing is lost.',
      cards: [
        {
          kind: 'viz',
          viz: 'hop',
          wifi: [3, 6],
          hops: [9, 2, 11, 0, 7, 10, 1, 8, 9, 2, 11, 0],
        },
      ],
      realLife: 'Real devices do this on a bigger scale, marking channels as good or bad every few seconds. The same idea helps with other noisy things such as microwave ovens.',
    },
    {
      caption:
        'Engineers check this by watching the band with a spectrum analyser. Wi-fi shows up as a wide, steady hump. Bluetooth shows up as thin flicks that jump around the whole band, and a good analyser can even show that after wi-fi turns on, the flicks avoid its hump. The same kind of instrument is used to certify that devices do not shout over each other.',
      looksLike: {
        title: 'A spectrum analyser',
        src: 'img/real/spectrum-analyzer.png',
        alt: 'Photo of a bench spectrum analyser with a screen showing coloured peaks over a grid, connected to a small antenna on a stand',
        caption: 'A wide hump is wi-fi. Thin flicks hopping across the screen are Bluetooth.',
      },
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'What each looks like on a spectrum analyser',
          columns: ['Source', 'On the screen'],
          rows: [
            ['Wi-fi', 'a wide, steady hump about 20 MHz across'],
            ['Bluetooth', 'thin flicks that jump all over the band'],
            ['Microwave oven', 'a wide smear that comes and goes'],
          ],
          tone: 'violet',
        },
      ],
    },
  ],

  sandbox: {
    type: 'bluetooth',
    intro: 'The map shows Bluetooth channels from 2402 to 2480 MHz. Orange bands are wi-fi. Each row is a recent packet, red when lost.',
    goalText: 'Turn on wi-fi channel 6 and compare the three modes. Which mode loses every packet? Which keeps delivery at 100%?',
  },

  quiz: [
    {
      type: 'choice',
      q: 'Why does Bluetooth use less power than wi-fi?',
      options: ['It sends a weaker signal over a shorter distance and at a lower speed', 'It uses sound instead of radio', 'It does not use radio', 'It is wired inside'],
      answer: 0,
      why: 'Short range and modest speed let small devices like earbuds run for hours on a tiny battery.',
    },
    {
      type: 'choice',
      q: 'Which of these is the job of Bluetooth rather than wi-fi?',
      options: ['Linking earbuds to a phone', 'Streaming a film to the whole house', 'Connecting to the internet through a router', 'Linking two cities'],
      answer: 0,
      why: 'Bluetooth links two nearby devices. Wi-fi gives a network connection.',
    },
    {
      type: 'choice',
      q: 'Why would a Bluetooth link on one fixed channel be a bad idea?',
      options: ['A wi-fi network on the same frequencies could destroy every packet', 'Bluetooth cannot choose a channel', 'It would be too fast', 'The earbuds would run out of power'],
      answer: 0,
      why: 'If something noisy sits on your one channel, there is nowhere to go. Hopping spreads the damage thin.',
    },
    {
      type: 'choice',
      q: 'What does Bluetooth do about crowded channels?',
      options: ['It hops among 79 channels, about 1600 times a second', 'It waits until the neighbours switch off', 'It uses a cable', 'It increases power to 1000 W'],
      answer: 0,
      why: 'Only the few hops that land on a busy channel are lost, and those packets are sent again.',
    },
    {
      type: 'choice',
      q: 'How does adaptive hopping improve things?',
      options: ['It removes the noisy channels from the hop pattern', 'It slows down the music', 'It turns wi-fi off', 'It picks a single quiet channel and stays on it'],
      answer: 0,
      why: 'Avoiding the busy channels means almost no hops are wasted, while still moving around.',
    },
    {
      type: 'choice',
      q: 'On a spectrum analyser, how would you tell Bluetooth from wi-fi?',
      options: ['Bluetooth is thin flicks jumping around, wi-fi is a wide steady hump', 'Bluetooth is always brighter', 'Wi-fi is always thinner', 'You cannot tell them apart'],
      answer: 0,
      why: 'The two use the air differently: wi-fi holds a wide channel, Bluetooth uses narrow channels and keeps moving.',
    },
    {
      type: 'match',
      q: 'Match each technology to how it deals with a shared band.',
      items: [
        { id: 'wifi', label: 'Wi-fi' },
        { id: 'bt', label: 'Bluetooth' },
        { id: 'abt', label: 'Adaptive Bluetooth' },
        { id: 'oven', label: 'Microwave oven' },
      ],
      targets: [
        { id: 'a', label: 'Holds a wide channel and waits its turn' },
        { id: 'b', label: 'Hops among narrow channels all the time' },
        { id: 'c', label: 'Hops but skips channels that are noisy' },
        { id: 'd', label: 'Does not take part: it just makes noise' },
      ],
      answer: { wifi: 'a', bt: 'b', abt: 'c', oven: 'd' },
      why: 'Each one copes in a different way with a band that cannot be kept quiet.',
    },
  ],

  recap: [
    'Wi-fi and Bluetooth are both microwave radios around 2.4 GHz, but wi-fi is built for speed and range, Bluetooth for low power and short links.',
    'The 2.4 GHz band is small and shared with ovens, baby monitors and many wi-fi networks.',
    'Bluetooth survives by hopping among 79 narrow channels about 1600 times a second, so interference only hits a few packets, which are resent.',
    'Adaptive hopping drops the noisy channels from the pattern so almost nothing is lost.',
    'A spectrum analyser shows wi-fi as a wide hump and Bluetooth as thin flicks jumping around.',
  ],
});
