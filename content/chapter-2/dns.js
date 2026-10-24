TL.registerLesson({
  id: 'ch2-dns',
  title: 'DNS: the internet phone book',
  hook: 'You type a name. The network needs a number. Who looks it up, and how?',
  cover: 'img/lessons/ch2-dns.png',
  scene: TL.dnsScene,

  steps: [
    {
      caption:
        'You type www.example.com. Your laptop knows the web server by name only, but the network needs its numeric address. So the laptop asks a helper: the resolver, a server run by your internet provider for its customers.',
      show: { nodes: ['laptop', 'router', 'resolver'], links: ['laptop-router', 'router-resolver'] },
      highlight: ['laptop', 'resolver'],
      packets: [{ path: ['laptop', 'router', 'resolver'], color: '#ffa31a', label: 'www.example.com?' }],
      cards: [
        {
          kind: 'viz',
          viz: 'encode',
          aLabel: 'What the browser has',
          bLabel: 'What the network needs',
          arrow: 'DNS lookup',
          pairs: [{ a: 'www.example.com', b: '198.51.100.20', tone: 'amber' }],
        },
      ],
    },
    {
      caption:
        'The resolver is like a librarian with a phone book. If somebody asked about this name recently, it already knows the answer and replies at once. This time it does not know, so it has to go and ask.',
      show: {},
      labels: { resolver: 'I do not know it' },
      highlight: ['resolver'],
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'The resolver checks its memory (cache)',
          columns: ['Name', 'Address'],
          rows: [
            ['www.example.org', '192.0.2.55'],
            ['news.example.net', '203.0.113.8'],
            ['www.example.com', 'not here yet'],
          ],
          cells: [[2, 1]],
          tone: 'red',
          note: 'A miss. The resolver has to go and ask the DNS servers.',
        },
      ],
    },
    {
      caption:
        'First stop: a root server. It does not know every website, but it knows who handles each ending: .com, .org, .fr and so on. It answers: "For .com names, ask the .com server."',
      show: { nodes: ['root'], links: ['resolver-root'] },
      labels: { resolver: 'Asking the root' },
      highlight: ['resolver', 'root'],
      looksLike: {
        title: 'Inside a data centre',
        src: 'img/real/data-center.png',
        alt: 'Photo of rows of server racks in a data centre',
        caption: 'DNS servers, like most servers, live in data centres: rooms full of racks of computers with power, cooling and fast network links.',
      },
      packets: [
        { path: ['resolver', 'root'], color: '#ffa31a', label: '?' },
        { path: ['root', 'resolver'], color: '#39ff88', label: 'ask .com' },
      ],
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'What the root server knows',
          subtitle: 'Only who handles each ending',
          columns: ['Ending', 'Ask this server'],
          rows: [
            ['.com', '.com server'],
            ['.org', '.org server'],
            ['.fr', '.fr server'],
          ],
          highlight: 0,
        },
      ],
    },
    {
      caption:
        'Second stop: the .com server. It keeps the list of every .com name and who is responsible for it. It answers: "For example.com, ask the name server of example.com."',
      show: { nodes: ['tldcom'], links: ['resolver-tldcom'] },
      labels: { resolver: 'Asking .com' },
      highlight: ['resolver', 'tldcom'],
      packets: [
        { path: ['resolver', 'tldcom'], color: '#ffa31a', label: '?' },
        { path: ['tldcom', 'resolver'], color: '#39ff88', label: 'ask example.com' },
      ],
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'What the .com server knows',
          subtitle: 'Only who looks after each .com name',
          columns: ['Name', 'Ask this name server'],
          rows: [
            ['example.com', 'name server of example.com'],
            ['bikes.com', 'name server of bikes.com'],
            ['news.com', 'name server of news.com'],
          ],
          highlight: 0,
        },
      ],
    },
    {
      caption:
        'Third stop: the name server of example.com, run by the owner of the site. This one knows the final answer: "www.example.com is at 198.51.100.20."',
      show: { nodes: ['nscom'], links: ['resolver-nscom'] },
      labels: { resolver: 'Asking example.com' },
      highlight: ['resolver', 'nscom'],
      packets: [
        { path: ['resolver', 'nscom'], color: '#ffa31a', label: '?' },
        { path: ['nscom', 'resolver'], color: '#39ff88', label: '198.51.100.20' },
      ],
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'What the name server of example.com knows',
          subtitle: 'The real addresses',
          columns: ['Name', 'Address'],
          rows: [
            ['example.com', '198.51.100.10'],
            ['www.example.com', '198.51.100.20'],
            ['mail.example.com', '198.51.100.30'],
          ],
          highlight: 1,
        },
      ],
    },
    {
      caption:
        'The resolver sends the number back to your laptop, and keeps a copy for a while so the next person who asks gets an instant answer. Now the browser can contact the web server. The whole lookup usually takes a few thousandths of a second.',
      show: {},
      labels: { resolver: 'Saved 198.51.100.20', laptop: '198.51.100.20' },
      highlight: ['laptop', 'resolver'],
      packets: [{ path: ['resolver', 'router', 'laptop'], color: '#39ff88', label: '198.51.100.20' }],
      cards: [
        {
          kind: 'viz',
          viz: 'sequence',
          title: 'The whole lookup',
          actors: ['Laptop', 'Resolver', 'Root', '.com server', 'Name server'],
          messages: [
            { from: 0, to: 1, text: 'www.example.com?', tone: 'amber' },
            { from: 1, to: 2, text: 'www.example.com?', tone: 'amber' },
            { from: 2, to: 1, text: 'ask .com', tone: 'green' },
            { from: 1, to: 3, text: 'www.example.com?', tone: 'amber' },
            { from: 3, to: 1, text: 'ask example.com', tone: 'green' },
            { from: 1, to: 4, text: 'www.example.com?', tone: 'amber' },
            { from: 4, to: 1, text: '198.51.100.20', tone: 'green', note: 'the resolver saves a copy' },
            { from: 1, to: 0, text: '198.51.100.20', tone: 'green' },
          ],
        },
      ],
      realLife:
        'The number 198.51.100.20 is reserved for examples. Real lookups work the same way. There are 13 named root server addresses (A to M), but each one is run as many copies in places around the world, so DNS keeps working even when some of them fail.',
    },
    {
      caption:
        'Why so many steps? Nobody could keep one giant list of all websites up to date. Instead, DNS is a tree of small lists. Each level only knows who to ask next, just like a phone book split by country, then town, then street.',
      show: { nodes: ['tldorg', 'nsorg'], links: ['resolver-tldorg', 'resolver-nsorg'] },
      labels: { resolver: 'Provider DNS' },
      highlight: ['root', 'tldcom', 'tldorg'],
      cards: [
        {
          kind: 'viz',
          viz: 'layers',
          title: 'DNS is a tree of small lists',
          arrows: '▼ points to',
          layers: [
            { t: 'Root', sub: 'knows the endings: .com, .org, .fr...', tone: 'cyan' },
            { t: 'Ending servers (.com, .org...)', sub: 'know which name server looks after each name', tone: 'amber' },
            { t: 'Name servers (example.com, example.org...)', sub: 'know the real addresses', tone: 'green' },
          ],
        },
      ],
    },
  ],

  sandbox: {
    type: 'dns',
    intro: 'You are the resolver. Click the server you want to ask next. Start from the top!',
    early: 'You do not know who to ask yet. Go back to the beginning: ask the root server first.',
    wrong: {
      laptop: 'The laptop is the one who asked. You are the resolver now, so you must ask the servers on the right.',
      router: 'The router just passes messages along. It does not know the answer.',
      resolver: 'That is you! Click one of the servers on the right.',
    },
    rounds: [
      {
        name: 'www.example.com',
        ip: '198.51.100.20',
        hops: [
          { ask: 'root', say: 'I do not know www.example.com, but .com names are handled by the .com server. Ask it.' },
          { ask: 'tldcom', say: 'I know who looks after example.com: its own name server. Ask that one.' },
          { ask: 'nscom', say: 'www.example.com is at 198.51.100.20.' },
        ],
        wrong: {
          tldorg: 'The .org server only knows names that end in .org. This name ends in .com. Try again.',
          nsorg: 'That name server belongs to example.org, not example.com.',
        },
      },
      {
        name: 'www.example.org',
        ip: '192.0.2.55',
        hops: [
          { ask: 'root', say: 'I do not know www.example.org, but .org names are handled by the .org server. Ask it.' },
          { ask: 'tldorg', say: 'I know who looks after example.org: its own name server. Ask that one.' },
          { ask: 'nsorg', say: 'www.example.org is at 192.0.2.55.' },
        ],
        wrong: {
          tldcom: 'The .com server only knows names that end in .com. This name ends in .org. Try again.',
          nscom: 'That name server belongs to example.com, not example.org.',
        },
      },
    ],
  },

  quiz: [
    {
      type: 'choice',
      q: 'What is the job of DNS?',
      options: [
        'Turn a name like www.example.com into a numeric address',
        'Make websites load faster by compressing them',
        'Protect your computer from viruses',
        'Store the web pages themselves',
      ],
      answer: 0,
      why: 'DNS is the internet phone book: you give a name, it gives back a number.',
    },
    {
      type: 'order',
      q: 'Put the lookup of www.example.com in order.',
      items: [
        { id: 'a', label: 'The resolver asks the root server' },
        { id: 'b', label: 'The resolver asks the .com server' },
        { id: 'c', label: 'The resolver asks the name server of example.com' },
        { id: 'd', label: 'The resolver gives the address to your laptop' },
      ],
      answer: ['a', 'b', 'c', 'd'],
      why: 'Each server points to the next one, until the last one knows the real address.',
    },
    {
      type: 'choice',
      q: 'Your friend looked up the same site a minute ago, using the same resolver. What is likely to happen for you?',
      options: [
        'The resolver remembers the answer and replies at once',
        'The resolver has to ask the root server again every time',
        'The website refuses to answer',
        'Your laptop must ask the .com server itself',
      ],
      answer: 0,
      why: 'Resolvers keep answers for a while (a cache), which makes the web faster.',
    },
    {
      type: 'match',
      q: 'What does each server know?',
      items: [
        { id: 'root', label: 'Root server' },
        { id: 'tld', label: '.com server' },
        { id: 'ns', label: 'Name server of example.com' },
      ],
      targets: [
        { id: 'r', label: 'Which server handles each ending (.com, .org...)' },
        { id: 't', label: 'Which name server looks after each .com name' },
        { id: 'n', label: 'The real address of www.example.com' },
      ],
      answer: { root: 'r', tld: 't', ns: 'n' },
      why: 'Each level knows a bit more detail than the one above it.',
    },
  ],

  recap: [
    'DNS turns a name into a number, like a phone book.',
    'The resolver asks the root server, then the .com server, then the site\u2019s own name server.',
    'Each server only knows who to ask next, so no single list has to hold everything.',
    'Resolvers remember answers for a while, which is why most lookups are instant.',
  ],
});



