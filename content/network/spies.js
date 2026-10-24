TL.registerLesson({
  id: 'network-spies',
  title: 'Who can read your messages?',
  hook: 'Your packets cross a caf\u00e9, a provider and a dozen routers. Anyone could be looking.',
  cover: 'img/lessons/network-spies.png',
  scene: TL.secureScene,

  steps: [
    {
      caption:
        'You log in to a website, and your password travels in packets. If the website uses plain "http", the packets are like a postcard: the message is written on the back for everybody to read.',
      show: {
        nodes: ['laptop', 'router', 'isp', 'internet', 'server'],
        links: ['laptop-router', 'router-isp', 'isp-internet', 'internet-server'],
      },
      badges: { laptop: ['envelope'] },
      highlight: ['laptop'],
      packets: [{ path: ['laptop', 'router', 'isp', 'internet', 'server'], color: '#ffa31a', label: 'pw: cats123' }],
      cards: [
        {
          kind: 'viz',
          viz: 'record',
          title: 'Inside one plain http packet',
          groups: [
            { label: 'Address label (routers need it)', tone: 'cyan', fields: [{ k: 'From', v: 'your laptop' }, { k: 'To', v: 'the website' }] },
            { label: 'Contents (readable by anyone)', tone: 'amber', fields: [{ k: 'user', v: 'sam' }, { k: 'password', v: 'cats123' }] },
          ],
          note: 'Everything is written in plain text. Whoever holds the packet can read both parts.',
        },
      ],
    },
    {
      caption:
        'Imagine you are in a caf\u00e9, on its public Wi-Fi. Somebody at another table runs a snooping tool that copies the packets that go through the router. Nothing stops them, and you would never notice.',
      show: { nodes: ['spy'], links: ['spy-router'] },
      labels: { spy: 'Copies everything' },
      highlight: ['spy', 'spy-router'],
      packets: [
        { path: ['laptop', 'router', 'isp', 'internet', 'server'], color: '#ffa31a', label: 'pw: cats123' },
        { path: ['router', 'spy'], color: '#ff4d6d', label: 'pw: cats123' },
      ],
    },
    {
      caption:
        'It is not only caf\u00e9 snoopers. Your packet crosses your router, your provider and many routers owned by different companies. Each one handles the packet, so each one could read a postcard. Most are honest, but you cannot check every one of them.',
      show: {},
      labels: {},
      highlight: ['router', 'isp', 'internet'],
      packets: [{ path: ['laptop', 'router', 'isp', 'internet', 'server'], color: '#ffa31a', label: 'pw: cats123' }],
    },
    {
      caption:
        'The fix: put the message in a sealed envelope. Your browser scrambles the message with a secret code, so everybody who handles the packet sees only gibberish. Only the website can unscramble it. Scrambling a message like this is called encryption.',
      show: {},
      badges: { laptop: ['padlock'], server: ['padlockOpen'] },
      labels: { spy: 'Sees only gibberish' },
      highlight: ['laptop', 'server'],
      packets: [
        { path: ['laptop', 'router', 'isp', 'internet', 'server'], color: '#38e8ff', label: '#%&@$*?!7Zq' },
        { path: ['router', 'spy'], color: '#ff4d6d', label: '#%&@$*?!7Zq' },
      ],
      cards: [
        {
          kind: 'viz',
          viz: 'record',
          title: 'The same packet, encrypted',
          groups: [
            { label: 'Address label (still readable)', tone: 'cyan', fields: [{ k: 'From', v: 'your laptop' }, { k: 'To', v: 'the website' }] },
            { label: 'Contents (scrambled)', tone: 'dim', fields: [{ k: 'data', v: '#%&@$*?!7Zq9v...' }] },
          ],
          note: 'Routers still see who talks to whom, because they need the label to deliver the packet. The password is hidden.',
        },
      ],
    },
    {
      caption:
        'But there is a catch. To unscramble, the website needs the secret code, and you two have never met. If you send the code across the network, the snooper copies it too, and then the envelope is useless. How can two strangers agree on a secret in public?',
      show: {},
      badges: { laptop: ['key'], server: ['padlockOpen'], spy: ['key'] },
      labels: { spy: 'Copied the code!' },
      highlight: ['spy'],
      packets: [
        { path: ['laptop', 'router', 'isp', 'internet', 'server'], color: '#ffa31a', label: 'secret code' },
        { path: ['router', 'spy'], color: '#ff4d6d', label: 'secret code' },
      ],
      cards: [
        {
          kind: 'viz',
          viz: 'sequence',
          title: 'Sending the code in the open does not work',
          actors: ['You', 'Snooper', 'Website'],
          messages: [
            { from: 0, to: 2, text: 'The secret code is 7Q2', tone: 'amber', note: 'The snooper sees this packet pass by.' },
            { from: 1, to: 1, text: 'Copies the code', tone: 'red' },
            { from: 0, to: 2, text: 'Scrambled message', tone: 'cyan', note: 'The snooper can unscramble it too.' },
          ],
        },
      ],
    },
    {
      caption:
        'There is a second catch: how do you know the website is really example.com, and not a fake one pretending to be it? Locking your message only helps if you are locking it for the right receiver. A trusted authority will help with that. Next lessons solve both problems with a clever trick.',
      show: { nodes: ['ca'], links: ['ca-laptop'] },
      badges: { ca: ['cert'] },
      labels: { ca: 'Vouches for IDs' },
      highlight: ['ca', 'ca-laptop'],
    },
  ],

  sandbox: {
    inspect: {
      laptop: 'Where your message starts. If you do nothing special, it leaves as a postcard that anybody can read.',
      router: 'Every packet passes here. On caf\u00e9 Wi-Fi this router belongs to somebody you do not know, so it could read a postcard.',
      isp: 'Your provider carries the packets. With http it could read them. With https it only sees which website you contact, not the pages or passwords.',
      internet: 'A maze of routers belonging to many companies. Each one handles your packets, so none should be able to read a secret.',
      server: 'The website. It is the intended receiver, so it is meant to read the message. The goal is that nobody else can.',
      spy: 'A snooper on the same Wi-Fi. A postcard is an open book for them. A sealed envelope is just gibberish.',
      ca: 'Not on the data path. A trusted organisation that checks who owns a website and vouches for it. You will meet it in the HTTPS lesson.',
    },
    intro: 'Click every point on the journey to see what it could learn about a message sent as a postcard.',
    goal: {
      text: 'Click all 7 points on the map to see who could see your message.',
      check: ({ visited }) => visited.size === 7,
    },
  },

  quiz: [
    {
      type: 'choice',
      q: 'You use a website with plain "http" on a caf\u00e9 Wi-Fi. Who could read your password?',
      options: [
        'Anyone who copies the packets: a snooper, or any router on the way',
        'Only the website',
        'Nobody, because packets are tiny',
        'Only your provider',
      ],
      answer: 0,
      why: 'Plain http is a postcard: whoever handles it can read it.',
    },
    {
      type: 'choice',
      q: 'What does encryption do to a message?',
      options: [
        'Scrambles it so only the right receiver can read it',
        'Makes it travel faster',
        'Hides the fact that you sent it',
        'Makes it smaller',
      ],
      answer: 0,
      why: 'Encryption turns the message into gibberish for everybody except the one who has the right key.',
    },
    {
      type: 'choice',
      q: 'What is the big problem with sending the secret code across the network?',
      options: [
        'A snooper can copy it, and then can unscramble everything',
        'The code is too long to fit in a packet',
        'The website refuses codes',
        'Codes only work in caf\u00e9s',
      ],
      answer: 0,
      why: 'If the code travels in the open, the snooper has it too. We need a cleverer way to agree on a secret.',
    },
    {
      type: 'match',
      q: 'Postcard or sealed envelope?',
      items: [
        { id: 'a', label: 'Anyone on the way can read it' },
        { id: 'b', label: 'A snooper sees only gibberish' },
        { id: 'c', label: 'http' },
        { id: 'd', label: 'https' },
      ],
      targets: [
        { id: 'post', label: 'Postcard' },
        { id: 'env', label: 'Sealed envelope' },
      ],
      answer: { a: 'post', b: 'env', c: 'post', d: 'env' },
      why: 'The "s" in https stands for secure: it is the sealed envelope.',
    },
  ],

  recap: [
    'Packets cross many machines. Anybody who handles an unprotected packet can read it, like a postcard.',
    'Encryption scrambles the message so that only the receiver can read it: a sealed envelope.',
    'Two problems remain: agreeing on a secret without meeting, and knowing who is on the other end.',
  ],
});



