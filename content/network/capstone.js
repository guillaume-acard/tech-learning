TL.registerLesson({
  id: 'network-capstone',
  title: 'The whole trip: type a URL and press Enter',
  hook: 'You press Enter. Eight things happen in a few thousandths of a second. You know them all now.',
  cover: 'img/lessons/network-capstone.png',
  scene: TL.tripScene,

  steps: [
    {
      caption:
        'You type https://www.example.com into the browser and press Enter. The browser reads the address: protocol https, domain www.example.com, no path, so it wants the home page.',
      show: { nodes: ['laptop'], links: [] },
      highlight: ['laptop'],
      cards: [
        {
          kind: 'viz',
          viz: 'record',
          title: 'The browser splits the address into parts',
          groups: [
            {
              label: 'https://www.example.com',
              tone: 'cyan',
              fields: [
                { k: 'Protocol', v: 'https (secure web)' },
                { k: 'Domain', v: 'www.example.com' },
                { k: 'Path', v: '/ (none, so the home page)' },
              ],
            },
          ],
        },
      ],
    },
    {
      caption:
        'The laptop knows only the name, so it needs the numeric address. It asks the resolver of the internet provider, through the home router. The question travels as a packet.',
      show: {
        nodes: ['router', 'isp', 'resolver'],
        links: ['laptop-router', 'router-isp', 'isp-resolver'],
      },
      highlight: ['laptop', 'resolver'],
      packets: [{ path: ['laptop', 'router', 'isp', 'resolver'], color: '#ffa31a', label: 'www.example.com?' }],
    },
    {
      caption:
        'The resolver does not know this name yet, so it goes down the DNS tree: the root server, then the .com server, then the name server of example.com. Here we draw all of them as one box.',
      show: { nodes: ['dns'], links: ['resolver-dns'] },
      labels: { resolver: 'Looks it up' },
      highlight: ['resolver', 'dns'],
      packets: [
        { path: ['resolver', 'dns'], color: '#ffa31a', label: '?' },
        { path: ['dns', 'resolver'], color: '#39ff88', label: '198.51.100.20' },
      ],
    },
    {
      caption: 'The resolver sends the numeric address back to the laptop. The name has become a number: 198.51.100.20.',
      show: {},
      labels: { resolver: 'Found it', laptop: '198.51.100.20' },
      highlight: ['laptop'],
      packets: [{ path: ['resolver', 'isp', 'router', 'laptop'], color: '#39ff88', label: '198.51.100.20' }],
      cards: [
        {
          kind: 'viz',
          viz: 'encode',
          pairs: [{ a: 'www.example.com', b: '198.51.100.20', tone: 'green' }],
          aLabel: 'Name',
          bLabel: 'Address',
          arrow: 'DNS lookup',
        },
      ],
    },
    {
      caption:
        'Now the laptop contacts the web server. The packets cross the router, the provider and several routers on the internet, each one choosing the next road. The HTTPS handshake starts: the browser says hello and the server answers with its certificate.',
      show: { nodes: ['r1', 'r2', 'server'], links: ['isp-r1', 'r1-r2', 'r2-server'] },
      labels: { resolver: 'Provider DNS', laptop: 'You' },
      highlight: ['laptop', 'server'],
      packets: [
        { path: ['laptop', 'router', 'isp', 'r1', 'r2', 'server'], color: '#ffa31a', label: 'hello' },
        { path: ['server', 'r2', 'r1', 'isp', 'router', 'laptop'], color: '#38e8ff', label: 'certificate' },
      ],
    },
    {
      caption:
        'The browser checks the certificate, invents a secret key and sends it in the server\u2019s locked chest. Only the server can open it. Now both share a key and the padlock appears.',
      show: {},
      badges: { laptop: ['key', 'chest'], server: ['chestOpen', 'key'] },
      highlight: ['laptop', 'server'],
      packets: [{ path: ['laptop', 'router', 'isp', 'r1', 'r2', 'server'], color: '#ffa31a', label: 'locked key' }],
      cards: [
        {
          kind: 'viz',
          viz: 'sequence',
          title: 'The HTTPS handshake, simplified',
          actors: ['Browser', 'Web server'],
          messages: [
            { from: 0, to: 1, text: 'Hello', tone: 'amber' },
            { from: 1, to: 0, text: 'Certificate (+ public key)', tone: 'cyan' },
            { from: 0, to: 0, text: 'Checks the certificate', tone: 'green' },
            { from: 0, to: 1, text: 'Secret key in a locked chest', tone: 'amber' },
            { from: 1, to: 1, text: 'Opens it with the private key', tone: 'violet' },
            { from: 0, to: 1, text: 'Scrambled with the shared key', tone: 'green', note: 'From now on, both sides use the shared key.' },
          ],
        },
      ],
      realLife:
        'The chest story is a simplification. Modern HTTPS usually lets both sides build the shared key with a related trick (a key exchange), instead of sending a key inside a chest. The result is the same: a secret that only the two of you know.',
    },
    {
      caption:
        'The browser asks for the home page, scrambled with the shared key. The server chops the page into numbered packets, scrambles each one, and sends them back along whichever roads are free.',
      show: {},
      badges: { laptop: ['padlock'], server: ['padlock'] },
      highlight: ['server', 'laptop'],
      packets: [
        { path: ['laptop', 'router', 'isp', 'r1', 'r2', 'server'], color: '#38e8ff', label: 'GET /' },
        { path: ['server', 'r2', 'r1', 'isp', 'router', 'laptop'], color: '#39ff88', label: '1' },
        { path: ['server', 'r2', 'r1', 'isp', 'router', 'laptop'], color: '#39ff88', label: '2' },
        { path: ['server', 'r2', 'r1', 'isp', 'router', 'laptop'], color: '#39ff88', label: '3' },
      ],
    },
    {
      caption:
        'The laptop puts the packets back in order, unscrambles them and the browser draws the page. DNS, packets, routers and a locked chest, all in a fraction of a second. And now, you get to break it and see what each failure looks like!',
      show: {},
      badges: { laptop: ['padlock'], server: ['padlock'] },
      labels: { laptop: 'Page ready!' },
      highlight: ['laptop'],
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'The whole trip, step by step',
          columns: ['Step', 'What happens', 'Idea from this course'],
          rows: [
            ['1', 'Name to number', 'DNS'],
            ['2', 'Find the road to the server', 'Routers and packets'],
            ['3', 'Agree on a secret key', 'Certificate and locked chest (public/private keys)'],
            ['4', 'Send the page in scrambled, numbered packets', 'Encryption and packets'],
          ],
          tone: 'cyan',
        },
      ],
    },
  ],
  sandbox: {
    root: 'server',
    rootName: 'the website',
    noLocal: true,
    cutText: 'Cut off from the website:',
    okText: 'Everything still works.',
    intro: 'Cut a link, or pick a scenario, and read what the browser would say. Click a point to send it a packet to the website.',
    scenarios: [
      { label: 'Wi-Fi off', cut: ['laptop-router'], note: 'You switch off the Wi-Fi.' },
      { label: 'Home cable cut', cut: ['router-isp'], note: 'A digger cuts the fibre outside the house.' },
      { label: 'DNS down', cut: ['resolver-dns'], note: 'The resolver can no longer reach the DNS servers.' },
      { label: 'Road to the server cut', cut: ['r2-server'], note: 'The last road to the web server is cut.' },
    ],
    levels: [
      {
        label: 'DNS error',
        goal: {
          text: 'Cause a DNS error with exactly 1 cut (break DNS, but keep Wi-Fi and the home cable working).',
          check: ({ broken }) =>
            broken.size === 1 &&
            (broken.has('isp-resolver') || broken.has('resolver-dns')),
        },
      },
      {
        label: 'Timeout',
        goal: {
          text: 'Cause a connection timeout with exactly 1 cut (DNS still OK, but the server road is broken).',
          check: ({ broken }) =>
            broken.size === 1 &&
            (broken.has('isp-r1') || broken.has('r1-r2') || broken.has('r2-server')),
        },
      },
      {
        label: 'No connection',
        goal: {
          text: 'Cause "No internet connection" with exactly 1 cut (break Wi-Fi or the home cable).',
          check: ({ broken }) =>
            broken.size === 1 &&
            (broken.has('laptop-router') || broken.has('router-isp')),
        },
      },
    ],
  },

  quiz: [
    {
      type: 'order',
      q: 'Put the trip in order.',
      items: [
        { id: 'a', label: 'The browser asks the resolver for the address of the name' },
        { id: 'b', label: 'The resolver asks the DNS servers and returns the number' },
        { id: 'c', label: 'The browser does the HTTPS handshake with the web server' },
        { id: 'd', label: 'The server sends the page in packets, and the browser shows it' },
      ],
      answer: ['a', 'b', 'c', 'd'],
      why: 'First find the address, then make the connection private, then get the page.',
    },
    {
      type: 'choice',
      q: 'The browser shows "DNS error". What is most likely broken?',
      options: [
        'Looking up the name: the address could not be found',
        'The web server\u2019s hard drive',
        'The padlock',
        'The screen',
      ],
      answer: 0,
      why: 'A DNS error means the name could not be turned into a number, so the browser never even tried to contact the server.',
    },
    {
      type: 'choice',
      q: 'Why can a website still load after one road on the internet is cut?',
      options: [
        'Routers send the packets along another road',
        'The page is saved in the router',
        'The server moves to another country',
        'It cannot: the page would fail',
      ],
      answer: 0,
      why: 'There are many roads between any two places, and each router picks a working one.',
    },
    {
      type: 'match',
      q: 'Match each error message to the likely cause.',
      items: [
        { id: 'a', label: '"No internet connection"' },
        { id: 'b', label: '"DNS error"' },
        { id: 'c', label: '"Connection timed out"' },
      ],
      targets: [
        { id: 'home', label: 'Wi-Fi or the home cable is down' },
        { id: 'dns', label: 'The name lookup failed' },
        { id: 'road', label: 'The web server cannot be reached' },
      ],
      answer: { a: 'home', b: 'dns', c: 'road' },
      why: 'Each message points to a different step of the trip.',
    },
    {
      type: 'choice',
      q: 'DNS still works, but the last road to the server is cut. What would the browser most likely show?',
      options: ['DNS error', 'No internet connection', 'Connection timed out', 'A padlock warning'],
      answer: 2,
      why: 'The browser knows the address (DNS OK) but cannot reach the server at that address, so it times out.',
      hint: 'Does the browser know the address yet?',
    },  ],

  recap: [
    'A name becomes a number through DNS, like a phone book.',
    'The request and the page travel as numbered packets over many roads, steered by routers.',
    'HTTPS uses a handshake: a certificate, then a secret key sent in a locked chest.',
    'When something breaks, the error message tells you which step failed.',
  ],
});



