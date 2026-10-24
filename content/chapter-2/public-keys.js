TL.registerLesson({
  id: 'ch2-public-keys',
  title: 'Public and private keys',
  hook: 'How can you lock a message for somebody you have never met? Hand out open padlocks.',
  cover: 'img/lessons/ch2-public-keys.png',
  scene: TL.secureScene,

  steps: [
    {
      caption:
        'Here is the trick, told with chests. The website makes a special chest with a lock that snaps shut with no key. Once it is closed, only one key in the world opens it, and the website keeps that key to itself.',
      show: {
        nodes: ['laptop', 'router', 'isp', 'internet', 'server', 'spy'],
        links: ['laptop-router', 'router-isp', 'isp-internet', 'internet-server', 'spy-router'],
      },
      badges: { server: ['chestOpen', 'key'] },
      highlight: ['server'],
    },
    {
      caption:
        'The website makes thousands of copies of the open chest and gives them to everybody who asks. It does not matter who gets one, even the snooper. An open chest is useless without the key.',
      show: {},
      badges: { server: ['chestOpen', 'key'] },
      highlight: ['server'],
      packets: [{ path: ['server', 'internet', 'isp', 'router', 'laptop'], color: '#38e8ff', label: 'open chest' }],
    },
    {
      caption:
        'You write your message, drop it in your open chest and snap the lock shut. Now not even you can open it again. Locking needed no secret at all.',
      show: {},
      badges: { server: ['chestOpen', 'key'], laptop: ['chest'], spy: ['chestOpen'] },
      highlight: ['laptop'],
    },
    {
      caption:
        'The locked chest travels to the website. The snooper can grab it, shake it, even copy it. But the lock does not open, and the message inside stays secret.',
      show: {},
      badges: { server: ['chestOpen', 'key'], spy: ['chest'] },
      labels: { spy: 'Cannot open it' },
      highlight: ['spy'],
      packets: [
        { path: ['laptop', 'router', 'isp', 'internet', 'server'], color: '#ffa31a', label: 'locked chest' },
        { path: ['router', 'spy'], color: '#ff4d6d', label: 'locked chest' },
      ],
      cards: [
        {
          kind: 'viz',
          viz: 'encode',
          title: 'What goes in, and what the snooper copies',
          aLabel: 'Inside the chest',
          bLabel: 'What the snooper sees',
          arrow: 'locked with the public lock',
          pairs: [{ a: 'my password is cats123', b: '9f3A7c0Qe1b8Zr2K...', tone: 'amber' }],
          note: 'The snooper holds the locked result and the public lock. Neither one gets the message back.',
        },
      ],
    },
    {
      caption: 'At the website, the owner uses the one key to open the chest. Only the owner has it, so only the owner can read the message.',
      show: {},
      badges: { server: ['key', 'chestOpen'] },
      labels: { server: 'Opens the chest' },
      highlight: ['server'],
    },
    {
      caption:
        'In computer words, the open chest with its lock is the public key: it can be shared with everyone. The key that opens it is the private key: it never leaves the website. This pair of keys is the heart of internet security. How can a computer build a lock that is easy to snap shut but impossible to open? With maths.',
      show: {},
      badges: { server: ['chestOpen', 'key'] },
      labels: {},
      highlight: ['server'],
      realLife:
        'This is called public-key cryptography, or asymmetric encryption. It was invented in the 1970s, and it is what lets strangers share secrets over the internet.',
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'Two keys, two jobs',
          columns: ['Key', 'Chest story', 'Who has it', 'What it does'],
          rows: [
            ['Public key', 'Open chest with a lock', 'Everybody', 'Locks a message'],
            ['Private key', 'The one key', 'Only the website', 'Unlocks it'],
          ],
          highlight: 1,
          tone: 'cyan',
        },
      ],
    },
  ],

  sandbox: {
    type: 'chest',
    message: 'my password is cats123',
    intro: 'Type a secret message, then send it in the open and in a locked chest. Compare what the snooper sees each time.',
    goalText: 'Send your message both ways and compare what the snooper sees.',
  },

  quiz: [
    {
      type: 'choice',
      q: 'In the chest story, who has the key that opens the locked chest?',
      options: ['Only the website', 'You', 'The snooper', 'Everybody'],
      answer: 0,
      why: 'The key is private. The website never shares it, so only the website can open chests locked with its lock.',
    },
    {
      type: 'choice',
      q: 'The snooper gets an open chest from the website. Can they read your message?',
      options: [
        'No: they can lock a chest too, but they cannot open yours',
        'Yes, an open chest shows everything',
        'Yes, if they are fast enough',
        'Only if they are on the same Wi-Fi',
      ],
      answer: 0,
      why: 'An open chest only lets you lock things. Opening a locked one needs the private key.',
    },
    {
      type: 'match',
      q: 'Match the story to the computer words.',
      items: [
        { id: 'a', label: 'The open chest, given to everybody' },
        { id: 'b', label: 'The key that only the website keeps' },
      ],
      targets: [
        { id: 'pub', label: 'Public key' },
        { id: 'priv', label: 'Private key' },
      ],
      answer: { a: 'pub', b: 'priv' },
      why: 'Public means everyone may have it. Private means it stays secret with its owner.',
    },
    {
      type: 'order',
      q: 'Put the chest trick in order.',
      items: [
        { id: 'a', label: 'The website sends out open chests' },
        { id: 'b', label: 'You put your message in one and lock it' },
        { id: 'c', label: 'The locked chest travels over the network' },
        { id: 'd', label: 'The website opens it with its private key' },
      ],
      answer: ['a', 'b', 'c', 'd'],
      why: 'Share the lock, use the lock, send, open with the secret key.',
    },
  ],

  recap: [
    'The public key is an open chest anybody may have: it can lock, but not unlock.',
    'The private key opens the chest, and the website never shares it.',
    'A snooper can see the locked chest but cannot read what is inside.',
  ],
});



