TL.registerLesson({
  id: 'ch2-url',
  title: 'Anatomy of a web address',
  hook: 'https://www.example.com/games?level=3 looks like a spell. Every piece of it has a job.',
  cover: 'img/lessons/ch2-url.png',

  steps: [
    {
      caption:
        'This is a URL, the full address of one page on the web. It looks like one long word, but it is really several pieces glued together. Let us take it apart.',
      cards: [[{ t: 'https://www.example.com/games', sub: 'a web address (URL)', tone: 'cyan' }]],
    },
    {
      caption:
        'First comes the protocol: the language the browser will speak. "https" means "talk to the website, but in secret" (encrypted). Plain "http" is the same conversation without the secret part. After it always come three characters: ://',
      cards: [[{ t: 'https', sub: 'protocol', tone: 'amber' }, { op: '://' }, { t: 'www.example.com', sub: 'domain', tone: 'dim' }, { t: '/games', sub: 'path', tone: 'dim' }]],
    },
    {
      caption:
        'Next is the domain: the name of the computer, the web server, that holds the website. It works like the name of a shop in the street.',
      cards: [[{ t: 'https', sub: 'protocol', tone: 'dim' }, { op: '://' }, { t: 'www.example.com', sub: 'domain', tone: 'cyan' }, { t: '/games', sub: 'path', tone: 'dim' }]],
    },
    {
      caption:
        'Then comes the path. Once you are at the shop, the path tells which shelf you want. Here it is "/games". With no path at all, you get the home page.',
      cards: [[{ t: 'https', sub: 'protocol', tone: 'dim' }, { op: '://' }, { t: 'www.example.com', sub: 'domain', tone: 'dim' }, { t: '/games', sub: 'path', tone: 'green' }]],
    },
    {
      caption:
        'The domain has pieces of its own, read from right to left. ".com" is the top-level domain, the family it belongs to (others are .org, .fr, .edu). "example" is the name somebody registered. "www" is a subdomain: one particular part of that site, often the main website.',
      cards: [
        [
          { t: 'www', sub: 'subdomain', tone: 'violet' },
          { op: '.' },
          { t: 'example', sub: 'site name', tone: 'cyan' },
          { op: '.' },
          { t: 'com', sub: 'top-level domain', tone: 'amber' },
        ],
        {
          kind: 'viz',
          viz: 'table',
          title: 'Same site name, different subdomains',
          columns: ['Address', 'Subdomain', 'Site name + ending', 'Usually holds'],
          rows: [
            ['www.example.com', 'www', 'example.com', 'the main website'],
            ['mail.example.com', 'mail', 'example.com', 'e-mail'],
            ['shop.example.com', 'shop', 'example.com', 'the online shop'],
          ],
          cells: [[0, 1], [1, 1], [2, 1]],
          tone: 'violet',
        },
      ],
      realLife: 'Companies often use subdomains to split their site: for example "mail.example.com" for e-mail and "shop.example.com" for the shop.',
    },
    {
      caption:
        'A URL can carry extras. After a ? you can add information for the website, like what you searched for. After a # you can jump to a spot on the page.',
      cards: [
        [
          { t: 'https://search.example.com', sub: 'protocol and domain', tone: 'dim' },
          { t: '/find', sub: 'path', tone: 'green' },
          { t: '?q=cats', sub: 'extra info', tone: 'violet' },
          { t: '#top', sub: 'spot on the page', tone: 'red' },
        ],
        {
          kind: 'viz',
          viz: 'record',
          title: 'The same address, taken apart',
          subtitle: 'https://search.example.com/find?q=cats#top',
          groups: [
            { label: 'Protocol', tone: 'amber', fields: [{ k: 'Scheme', v: 'https' }] },
            { label: 'Domain', tone: 'cyan', fields: [{ k: 'Host', v: 'search.example.com' }, { k: 'Port', v: '443 (hidden: usual for https)' }] },
            { label: 'Path', tone: 'green', fields: [{ k: 'Page', v: '/find' }] },
            { label: 'Extra info', tone: 'violet', fields: [{ k: 'Name', v: 'q' }, { k: 'Value', v: 'cats' }] },
            { label: 'Spot on the page', tone: 'red', fields: [{ k: 'Fragment', v: 'top' }] },
          ],
          note: 'The # part stays in your browser. It is not sent to the server.',
        },
      ],
      realLife:
        'Web addresses can also contain a port, a number after the domain such as :8080. Browsers hide it when it is the usual one (443 for https, 80 for http).',
    },
    {
      caption:
        'There is one problem. A computer cannot find "www.example.com" by its name. Computers use numbers, like 198.51.100.20. So the browser needs somebody to turn the name into a number. That is the next lesson.',
      cards: [[{ t: 'www.example.com', sub: 'what you type', tone: 'cyan' }, { op: '\u2192' }, { t: '198.51.100.20', sub: 'what the network needs', tone: 'amber' }]],
    },
  ],

  sandbox: {
    type: 'url',
    start: 'https://www.example.com/games',
    challenges: [
      {
        text: 'Change the address so that the protocol is https and the domain is www.example.com.',
        start: 'http://www.example.org/games',
        check: (u) => u.protocol === 'https' && u.host === 'www.example.com',
      },
      {
        text: 'Make an address for the subdomain "kids" of example.org, with the path /games.',
        start: 'https://www.example.com',
        check: (u) => u.host === 'kids.example.org' && u.path === '/games',
      },
      {
        text: 'Make an address on search.example.com that searches for cats, with ?q=cats at the end.',
        start: 'https://search.example.com',
        check: (u) => u.host === 'search.example.com' && u.query === '?q=cats',
      },
    ],
  },

  quiz: [
    {
      type: 'choice',
      q: 'In https://www.example.com/games, which part is the path?',
      options: ['/games', 'https', 'www.example.com', '.com'],
      answer: 0,
      why: 'The path comes after the domain and tells which page you want, like the shelf in the shop.',
    },
    {
      type: 'choice',
      q: 'What does the protocol "https" tell the browser?',
      options: [
        'How to talk to the website: securely',
        'Which page to open',
        'Which country the website is in',
        'How fast the website is',
      ],
      answer: 0,
      why: 'The protocol is the language of the conversation. The "s" at the end stands for secure.',
    },
    {
      type: 'choice',
      q: 'In "shop.example.com", which part is the top-level domain?',
      options: ['com', 'shop', 'example', 'shop.example'],
      answer: 0,
      why: 'You read a domain from the right: .com is the family, example is the name, shop is a subdomain.',
    },
    {
      type: 'match',
      q: 'Match each piece of https://www.example.com/games?level=3 to its role.',
      items: [
        { id: 'a', label: 'https' },
        { id: 'b', label: 'www.example.com' },
        { id: 'c', label: '/games' },
        { id: 'd', label: '?level=3' },
      ],
      targets: [
        { id: 'protocol', label: 'Protocol' },
        { id: 'domain', label: 'Domain' },
        { id: 'path', label: 'Path' },
        { id: 'extra', label: 'Extra info' },
      ],
      answer: { a: 'protocol', b: 'domain', c: 'path', d: 'extra' },
      why: 'Protocol, domain, path, extra info: four pieces, four jobs.',
    },
  ],

  recap: [
    'A URL has a protocol (https), a domain (the web server) and often a path (the page).',
    'A domain reads from right to left: top-level domain, site name, then subdomains.',
    'Computers need numbers, not names, so the name must be turned into an address.',
  ],
});



