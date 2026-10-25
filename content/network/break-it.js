TL.registerLesson({
  id: 'network-break-it',
  title: 'Break the house!',
  hook: 'Unplug the router, cut the fibre, switch off the Wi-Fi: who loses the internet?',
  cover: 'img/lessons/network-break-it.png',
  scene: TL.homeScene,

  steps: [
    {
      caption:
        'Here is the whole home network: a fibre to the internet, a cable, Wi-Fi, HDMI and 4G. Now that you know how everything connects, you can predict what happens when something breaks.',
      show: { nodes: Object.keys(TL.homeScene.nodes), links: TL.homeScene.links.map((l) => `${l.from}-${l.to}`) },
      highlight: ['router'],
      packets: [
        { path: ['desktop', 'router', 'internet'], color: '#ffa31a' },
        { path: ['laptop', 'router', 'internet'], color: '#ffa31a' },
        { path: ['phone2', 'tower', 'internet'], color: '#ff4d6d' },
      ],
    },
    {
      caption:
        'Here is how to play. Before you press a scenario, guess who will lose the internet. Then press it and check your guess. Remember: HDMI does not carry internet, and phones can use 4G.',
      show: {},
      highlight: [],
    },
  ],
  sandbox: {
    root: 'internet',
    intro: 'Pick a scenario below, or click any link to cut it yourself. Always guess first!',
    scenarios: [
      { label: 'Unplug the router', cutNode: 'router', note: 'You unplug the router.' },
      { label: 'Cut the fibre', cut: ['router-internet'], note: 'A digger cuts the optical fibre outside the house.' },
      { label: 'Switch off Wi-Fi', cutType: 'wifi', note: 'You switch off the Wi-Fi.' },
      {
        label: 'Walk in the garden',
        cut: ['phone1-router', 'phone2-router', 'watch-router'],
        note: 'Both phones and the watch go out into the garden.',
      },
      { label: 'Pull the desktop cable', cut: ['desktop-router'], note: 'You pull the LAN cable out of the desktop.' },
      {
        label: 'Phone 1 airplane mode',
        cut: ['phone1-router', 'phone1-tower'],
        note: 'Phone 1 loses both Wi-Fi and 4G at the same time.',
      },
      {
        label: 'Unplug the Smart TV',
        cutNode: 'tv',
        note: 'You unplug the Smart TV: its Wi-Fi and both HDMI cables go dark.',
      },
    ],
    ignore: ['voice'],
    levels: [
      {
        label: 'Warm-up',
        goal: {
          text: 'Cut exactly 1 link so that only the TV box loses the internet.',
          check: ({ offline, broken }) => broken.size === 1 && offline.size === 1 && offline.has('tvbox'),
        },
      },
      {
        label: 'Hard',
        goal: {
          text: 'Cut exactly 2 links so that only Phone 1 loses the internet (no Wi-Fi and no 4G).',
          check: ({ offline, broken }) =>
            broken.size === 2 &&
            offline.size === 1 &&
            offline.has('phone1') &&
            broken.has('phone1-router') &&
            broken.has('phone1-tower'),
        },
      },
      {
        label: 'Calls vs WhatsApp',
        intro: 'Phone 1 can still make WhatsApp calls, but not regular phone calls. Which link is cut?',
        goal: {
          text: 'Cut exactly 1 link so that Phone 1 still has the internet (WhatsApp works) but cannot make a regular phone call.',
          check: ({ offline, broken }) =>
            broken.size === 1 && !offline.has('phone1') && (broken.has('phone1-tower') || broken.has('tower-voice')),
        },
      },
      {
        label: 'Netflix vs TV',
        intro: 'You can watch Netflix on the Smart TV, but the regular TV channels do not show. Which link could be cut?',
        goal: {
          text: 'Cut exactly 1 link so that the Smart TV can still be used to watch Netflix but cannot show regular channels.',
          check: ({ offline, broken }) =>
            broken.size === 1 && !offline.has('tv') && (broken.has('tvbox-tv') || broken.has('tvbox-router')),
        },
      },
      {
        label: 'Calls but no internet',
        intro: 'Nothing can reach the internet anymore, but you can still make phone calls. Remember: the home has two roads to the internet (the router fibre and the mobile network), and phone calls use their own link to the tower. Which links are cut?',
        goal: {
          text: 'Cut the links so that every device loses internet access (including the phones and the watch on 4G), but the phone call link stays working.',
          check: ({ offline, broken }) =>
            ['laptop', 'desktop', 'phone1', 'phone2', 'watch', 'tv', 'tvbox', 'switch'].every((id) => offline.has(id)) &&
            !broken.has('tower-voice') &&
            !(broken.has('phone1-tower') && broken.has('phone2-tower')),
        },
      },
    ],
  },

  quiz: [
    {
      type: 'choice',
      q: 'The Wi-Fi is switched off in the house. Which of these still has internet?',
      options: ['Laptop', 'Smart TV', 'Desktop (LAN cable)', 'Nintendo Switch'],
      answer: 2,
      why: 'The desktop uses a cable, not Wi-Fi. The other three all depend on Wi-Fi.',
    },
    {
      type: 'choice',
      q: 'A digger cuts the optical fibre. Which device could still have internet?',
      options: ['Desktop', 'Laptop', 'Smart TV', 'A phone using 4G'],
      answer: 3,
      why: 'The phone can go through the mobile network. The others all depend on the fibre through the router.',
    },
    {
      type: 'choice',
      q: 'The fibre is cut. What is still true?',
      options: [
        'The laptop and the Smart TV can still talk to each other through the router',
        'Every device in the house still has internet',
        'Nothing at home can talk to anything else anymore',
        'The Wi-Fi turns itself into 4G',
      ],
      answer: 0,
      why: 'The router still links the home devices to each other. Only the way out to the internet is cut.',
    },
    {
      type: 'match',
      q: 'Match each problem to who is affected.',
      items: [
        { id: 'router', label: 'The router is unplugged' },
        { id: 'wifi', label: 'The Wi-Fi is switched off' },
        { id: 'cable', label: 'The desktop cable is pulled out' },
      ],
      targets: [
        { id: 'all', label: 'Every device that uses the router' },
        { id: 'wireless', label: 'Only devices on Wi-Fi' },
        { id: 'desktop', label: 'Only the desktop' },
      ],
      answer: { router: 'all', wifi: 'wireless', cable: 'desktop' },
      why: 'The more central the broken piece is, the more devices it affects.',
    },
    {
      type: 'choice',
      q: 'Phone 1 can use both Wi-Fi and 4G. To make it truly lose the internet, what must happen?',
      options: ['Only Wi-Fi must be cut', 'Only 4G must be cut', 'Both Wi-Fi and 4G must be cut', 'Nothing: phones never lose internet'],
      answer: 2,
      why: 'If only one network is cut, the phone can fall back on the other.',
    },
  ],

  recap: [
    'The router is central: unplug it and every device that depends on it goes offline.',
    'A cut link only affects the devices that rely on it, and phones and watches can fall back on 4G.',
    'Even with the internet cut, devices on the same router can still talk to each other.',
  ],
});



