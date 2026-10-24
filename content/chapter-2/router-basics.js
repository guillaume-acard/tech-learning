TL.registerLesson({
  id: 'ch2-router-basics',
  title: 'The front door: your router',
  hook: 'How does a laptop in the living room talk to the whole internet?',
  cover: 'img/lessons/ch2-router-basics.png',
  scene: TL.homeScene,

  steps: [
    {
      caption:
        'This is your home router. Think of it as the front door of the house: everything going to the internet, or coming back from it, passes through here.',
      show: { nodes: ['router'] },
      highlight: ['router'],
      looksLike: { title: 'A home Wi-Fi router', src: 'img/real/router.png', alt: 'Photo of a home Wi-Fi router', caption: 'Real routers come in many shapes, but they all have power, network ports and Wi-Fi inside.' },
    },
    {
      caption:
        'A hair-thin glass cable called optical fibre links the router to your internet provider and through them to the whole internet. Data travels as tiny flashes of light.',
      show: { nodes: ['internet'], links: ['router-internet'] },
      highlight: ['router-internet'],
      looksLike: { title: 'Optical fibre cable', src: 'img/real/fiber.png', alt: 'Photo of an optical fibre cable', caption: 'Optical fibre is a thin glass strand that carries data as flashes of light.' },
      packets: [
        { path: ['router', 'internet'], color: '#ffa31a' },
        { path: ['internet', 'router'], color: '#39ff88' },
      ],
      realLife:
        'Depending on the box, the part that turns light into data (the optical terminal) is either a separate small box or built into the router. We draw them as one to keep things simple.',
    },
    {
      caption:
        'The desktop computer is plugged into the router with a LAN cable (also called an Ethernet cable). A cable is fast and steady, which is why it is great for computers that stay in one place.',
      show: { nodes: ['desktop'], links: ['desktop-router'] },
      highlight: ['desktop', 'desktop-router'],
      packets: [{ path: ['desktop', 'router', 'internet'], color: '#ffa31a' }],
      looksLike: { title: 'Ethernet (LAN) cable', src: 'img/real/ethernet.png', alt: 'Photo of an Ethernet cable', caption: 'An Ethernet cable uses an RJ45 plug and gives a fast, stable wired connection.' },
    },
    {
      caption:
        'The laptop has no cable at all. It talks to the router with invisible radio waves: Wi-Fi. That is why you can carry it from room to room and stay online.',
      show: { nodes: ['laptop'], links: ['laptop-router'] },
      highlight: ['laptop', 'laptop-router'],
      packets: [{ path: ['laptop', 'router', 'internet'], color: '#ffa31a' }],
    },
    {
      caption:
        'How does the router know which way to send things? It keeps a list of who is plugged in where, like a reception desk with a list of rooms. An answer for the laptop goes out by Wi-Fi. A message for the internet goes out through the fibre.',
      show: {},
      highlight: ['router'],
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'What the router knows about its connections',
          columns: ['Who or what', 'Connected by', 'Router sends it out through'],
          rows: [
            ['Desktop', 'LAN cable', 'the LAN port the cable is in'],
            ['Laptop', 'Wi-Fi', 'its Wi-Fi radio'],
            ['The internet', 'Optical fibre', 'the fibre port'],
          ],
          highlight: 1,
          tone: 'cyan',
          note: 'Highlighted: an answer arrives for the laptop, so the router uses Wi-Fi. The next lessons show how it tells devices apart with addresses.',
        },
      ],
      packets: [{ path: ['internet', 'router', 'laptop'], color: '#39ff88' }],
      realLife:
        'The real router does not store words like "laptop". It stores each device number (its address) and which port or Wi-Fi link that device is on. You will see this in the lesson about addresses.',
    },
    {
      caption:
        'Whatever the connection, a message follows the same road: device, router, fibre, internet. The answer comes back the same way. Next, you will meet more devices: TVs and game consoles.',
      show: {},
      highlight: ['router'],
      looksLike: { title: 'A street cabinet', src: 'img/real/street-cabinet.png', alt: 'Photo of an open green street cabinet full of network equipment', caption: 'The fibre from your house usually runs to a cabinet like this in the street, then on to your provider.' },
      packets: [
        { path: ['laptop', 'router', 'internet'], color: '#ffa31a' },
        { path: ['internet', 'router', 'laptop'], color: '#39ff88' },
        { path: ['desktop', 'router', 'internet'], color: '#ffa31a' },
        { path: ['internet', 'router', 'desktop'], color: '#39ff88' },
      ],
    },
  ],
  sandbox: {
    root: 'internet',
    show: {
      nodes: ['router', 'internet', 'desktop', 'laptop', 'phone1', 'tower'],
      links: ['router-internet', 'desktop-router', 'laptop-router', 'phone1-router', 'phone1-tower', 'tower-internet'],
    },
    intro: 'Click a cable or Wi-Fi link to cut it. Click a device to send a message to the internet.',
    levels: [
      {
        label: 'Warm-up',
        goal: {
          text: 'Make the laptop lose the internet while the desktop stays online (with 1 cut).',
          check: ({ offline, broken }) => broken.size === 1 && offline.has('laptop') && !offline.has('desktop'),
        },
      },
      {
        label: 'Hard',
        scenarios: [{ label: 'Switch off Wi-Fi', cutType: 'wifi', note: 'You switch off the Wi-Fi.' }],
        goal: {
          text: 'Switch off Wi-Fi: laptop should lose internet, but the phone stays online on 4G and the desktop stays online.',
          check: ({ offline, broken }) =>
            broken.has('laptop-router') &&
            broken.has('phone1-router') &&
            offline.has('laptop') &&
            !offline.has('desktop') &&
            !offline.has('phone1'),
        },
      },
    ],
  },

  quiz: [
    {
      type: 'choice',
      q: 'Which cable carries your data as flashes of light?',
      options: ['LAN (Ethernet) cable', 'Optical fibre', 'HDMI cable', 'Phone charger cable'],
      answer: 1,
      why: 'Optical fibre is a thin glass cable that carries light, so it can carry a huge amount of data very fast.',
      hint: 'Think about the cable that goes from the router out to your internet provider.',
    },
    {
      type: 'match',
      q: 'Match each connection to the way it is made.',
      items: [
        { id: 'desktop', label: 'Desktop to router' },
        { id: 'laptop', label: 'Laptop to router' },
        { id: 'router', label: 'Router to the internet' },
      ],
      targets: [
        { id: 'lan', label: 'LAN cable' },
        { id: 'wifi', label: 'Wi-Fi' },
        { id: 'fibre', label: 'Optical fibre' },
      ],
      answer: { desktop: 'lan', laptop: 'wifi', router: 'fibre' },
      why: 'Cable for the desktop, radio waves for the laptop, and fibre for the long trip out of the house.',
    },
    {
      type: 'order',
      q: 'Put the journey of a message from your laptop to the internet in order.',
      items: [
        { id: 'a', label: 'The laptop sends the message by Wi-Fi' },
        { id: 'b', label: 'The router receives it' },
        { id: 'c', label: 'It travels along the optical fibre' },
        { id: 'd', label: 'It reaches the internet' },
      ],
      answer: ['a', 'b', 'c', 'd'],
      why: 'Every message goes through the router, the front door of your home network.',
    },
    {
      type: 'choice',
      q: 'If the Wi-Fi is switched off but your phone has 4G, what can still be true?',
      options: ['The phone can still have internet through the tower', 'The desktop loses its LAN connection', 'The router turns into a tower', 'HDMI carries the internet instead'],
      answer: 0,
      why: 'Wi-Fi and 4G are two different roads to the internet. If Wi-Fi is off, the phone can fall back on 4G.',
      hint: 'Think about the SIM card and the tower.',
    },  ],

  recap: [
    'The router is the front door of your home network: all traffic to the internet goes through it.',
    'Devices connect to the router by cable (LAN) or by radio waves (Wi-Fi). The router connects to the internet by optical fibre.',
    'The router keeps a list of who is connected and how, so it knows which way to send each message.',
    'If one link is cut, only the devices that depend on it lose the internet.',
  ],
});







