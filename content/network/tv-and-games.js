TL.registerLesson({
  id: 'network-tv-and-games',
  title: 'Screens and games: Wi-Fi vs HDMI',
  hook: 'The TV box and the Switch both use two connections. Why?',
  cover: 'img/lessons/network-tv-and-games.png',
  scene: TL.homeScene,

  steps: [
    {
      caption:
        'A smart TV is really a computer with a big screen. It joins the router by Wi-Fi so it can stream videos from the internet.',
      show: { nodes: ['router', 'internet', 'tv'], links: ['router-internet', 'tv-router'] },
      highlight: ['tv', 'tv-router'],
      cards: [
        {
          kind: 'viz',
          viz: 'bars',
          title: 'Roughly how much data per second each activity needs',
          items: [
            { label: 'Online game', value: 3, text: '~3 Mbit/s', tone: 'violet' },
            { label: 'HD video', value: 5, text: '~5 Mbit/s', tone: 'cyan' },
            { label: '4K video', value: 25, text: '~25 Mbit/s', tone: 'amber' },
          ],
          max: 30,
          note: 'Mbit/s means millions of bits per second. Video needs a steady flow. A game needs little data but a very quick reply.',
        },
      ],
      packets: [{ path: ['internet', 'router', 'tv'], color: '#39ff88', label: 'video' }],
      realLife: 'These numbers are rough guides. Real services vary with picture quality and how they compress the video.',
    },
    {
      caption:
        'The TV box brings you the TV channels. It also joins the router by Wi-Fi, because the programmes arrive from the internet.',
      show: { nodes: ['tvbox'], links: ['tvbox-router'] },
      highlight: ['tvbox', 'tvbox-router'],
      packets: [{ path: ['internet', 'router', 'tvbox'], color: '#39ff88', label: 'channels' }],
    },
    {
      caption:
        'But the box is not a screen. A second cable, HDMI, carries the finished picture and sound from the box to the TV.',
      looksLike: {
        title: 'An HDMI cable',
        src: 'img/real/hdmi.png',
        alt: 'A close-up photo of an HDMI cable and its connectors',
        caption: 'HDMI is a display cable: it carries the finished picture and sound to a screen.',
      },
      show: { links: ['tvbox-tv'] },
      highlight: ['tvbox-tv'],
      cards: [
        {
          kind: 'viz',
          viz: 'sequence',
          actors: ['Internet', 'Router', 'TV box', 'TV'],
          messages: [
            { from: 0, to: 1, text: 'programme data', tone: 'green', note: 'internet data' },
            { from: 1, to: 2, text: 'Wi-Fi', tone: 'green', note: 'data link' },
            { from: 2, to: 3, text: 'picture + sound', tone: 'violet', note: 'HDMI: display link' },
          ],
        },
      ],
      packets: [{ path: ['tvbox', 'tv'], color: '#c084fc', label: 'picture + sound' }],
      realLife:
        'HDMI only carries picture and sound to a screen. Internet data never travels through it: the box gets the programmes over Wi-Fi, then sends the finished picture over HDMI.',
    },
    {
      caption:
        'The Nintendo Switch does the same. Wi-Fi to the router for online games and updates, HDMI to the TV when you play on the big screen.',
      show: { nodes: ['switch'], links: ['switch-router', 'switch-tv'] },
      highlight: ['switch', 'switch-router', 'switch-tv'],
      packets: [
        { path: ['switch', 'router', 'internet'], color: '#ffa31a', label: 'online game' },
        { path: ['switch', 'tv'], color: '#c084fc', label: 'picture + sound' },
      ],
    },
    {
      caption:
        'So there are two kinds of links. Data links (Wi-Fi, LAN, fibre) reach the internet. Display links (HDMI) only show a picture. Here the TV box has lost its Wi-Fi: it is offline, but the TV is still online on its own Wi-Fi.',
      show: {},
      broken: ['tvbox-router'],
      connectivity: true,
      highlight: ['tvbox-router'],
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'What each link carries, and what happens if it breaks',
          columns: ['Link', 'Kind', 'Carries', 'If it is cut'],
          rows: [
            ['TV box to router (Wi-Fi)', 'Data link', 'internet data', 'TV box is offline'],
            ['TV box to TV (HDMI)', 'Display link', 'picture and sound', 'no picture, still online'],
            ['Smart TV to router (Wi-Fi)', 'Data link', 'internet data', 'Smart TV is offline'],
          ],
          highlight: 0,
          tone: 'violet',
        },
      ],
    },
  ],
  sandbox: {
    root: 'internet',
    show: {
      nodes: ['router', 'internet', 'tv', 'tvbox', 'switch'],
      links: ['router-internet', 'tv-router', 'tvbox-router', 'switch-router', 'tvbox-tv', 'switch-tv'],
    },
    intro: 'Click any link to cut it, even the HDMI cables. Click a device to send a message to the internet.',
    levels: [
      {
        label: 'Warm-up',
        goal: {
          text: 'Make the TV box lose the internet while the Smart TV and the Switch stay online.',
          check: ({ offline }) => offline.has('tvbox') && !offline.has('tv') && !offline.has('switch'),
        },
      },
      {
        label: 'Hard',
        goal: {
          text: 'Cut exactly 2 links so the TV box loses internet but still shows picture, and the Switch stays online but loses the TV picture.',
          check: ({ offline, broken }) =>
            broken.size === 2 &&
            broken.has('tvbox-router') &&
            broken.has('switch-tv') &&
            !broken.has('tvbox-tv') &&
            offline.has('tvbox') &&
            !offline.has('tv') &&
            !offline.has('switch'),
        },
      },
    ],
  },

  quiz: [
    {
      type: 'choice',
      q: 'Which cable carries picture and sound from the TV box to the TV?',
      options: ['LAN cable', 'Optical fibre', 'HDMI cable', 'Wi-Fi'],
      answer: 2,
      why: 'HDMI sends the finished picture and sound to the screen.',
    },
    {
      type: 'match',
      q: 'What does each link carry?',
      items: [
        { id: 'a', label: 'TV box to router (Wi-Fi)' },
        { id: 'b', label: 'TV box to TV (HDMI)' },
        { id: 'c', label: 'Switch to router (Wi-Fi)' },
        { id: 'd', label: 'Switch to TV (HDMI)' },
      ],
      targets: [
        { id: 'data', label: 'Internet data' },
        { id: 'video', label: 'Picture and sound' },
      ],
      answer: { a: 'data', b: 'video', c: 'data', d: 'video' },
      why: 'Wi-Fi links bring internet data to the device, and HDMI links only show the picture on the screen.',
    },
    {
      type: 'choice',
      q: 'You unplug the HDMI cable from the TV box. What happens?',
      options: [
        'The TV box loses the internet but the picture stays',
        'The picture and sound stop, but the internet connection is not affected',
        'The whole house loses the internet',
        'Nothing changes',
      ],
      answer: 1,
      why: 'HDMI is a display link. The TV box is still connected to the router by Wi-Fi.',
      hint: 'Which job does the HDMI cable do?',
    },
    {
      type: 'choice',
      q: 'You cut the HDMI cable from the Switch to the TV, but keep Wi-Fi. What happens?',
      options: ['The Switch loses internet', 'The Switch stays online, but the TV shows no Switch picture', 'The TV loses internet', 'Nothing changes'],
      answer: 1,
      why: 'HDMI is only for picture and sound. The internet data still goes through Wi-Fi.',
      hint: 'Which link is for data, and which is for display?',
    },  ],

  recap: [
    'Wi-Fi, LAN and fibre are data links: they connect devices to the internet.',
    'HDMI is a display link: it only carries picture and sound to a screen.',
    'The TV box and the Switch need both: a data link for the internet, a display link for the TV.',
  ],
});



