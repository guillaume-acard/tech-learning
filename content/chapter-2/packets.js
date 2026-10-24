TL.registerLesson({
  id: 'ch2-packets',
  title: 'Packets and routing',
  hook: 'A web page is not sent in one piece. It is chopped up, and the pieces take different roads.',
  cover: 'img/lessons/ch2-packets.png',
  scene: TL.routeScene,

  steps: [
    {
      caption:
        'Now the laptop knows the address of the web server. It sends a request, and the answer will be a big web page. Big messages jam the network, so everything on the internet is chopped into small pieces called packets. Here the laptop sends four.',
      show: { nodes: ['laptop', 'router', 'isp'], links: ['laptop-router', 'router-isp'] },
      badges: { laptop: ['envelope'] },
      highlight: ['laptop'],
      packets: [
        { path: ['laptop', 'router', 'isp'], color: '#ffa31a', label: '1' },
        { path: ['laptop', 'router', 'isp'], color: '#ffa31a', label: '2' },
        { path: ['laptop', 'router', 'isp'], color: '#ffa31a', label: '3' },
        { path: ['laptop', 'router', 'isp'], color: '#ffa31a', label: '4' },
      ],
      cards: [
        {
          kind: 'viz',
          viz: 'encode',
          aLabel: 'One message',
          bLabel: 'Four packets',
          arrow: 'chopped into pieces',
          pairs: [
            { a: '"Hello "', b: 'packet 1', tone: 'amber' },
            { a: '"from "', b: 'packet 2', tone: 'cyan' },
            { a: '"my la"', b: 'packet 3', tone: 'violet' },
            { a: '"ptop!"', b: 'packet 4', tone: 'green' },
          ],
          note: 'A real request is much bigger, so it is cut into many more packets.',
        },
      ],
    },
    {
      caption:
        'Each packet is like a letter in an envelope. On the envelope are the address of the server, the address of the laptop, and a number: "packet 2 of 4". Beyond the provider lies the internet: a maze of routers, with several roads that all lead to the web server.',
      show: {
        nodes: ['t1', 't2', 'm1', 'b1', 'b2', 'server'],
        links: ['isp-t1', 't1-t2', 't2-server', 'isp-m1', 'm1-server', 'isp-b1', 'b1-b2', 'b2-server'],
      },
      badges: { laptop: ['envelope'], server: ['envelope'] },
      labels: { server: '198.51.100.20' },
      highlight: ['isp', 'server'],
      cards: [
        {
          kind: 'viz',
          viz: 'record',
          title: 'One packet, like a letter',
          groups: [
            { label: 'On the envelope (header)', tone: 'amber', fields: [{ k: 'To', v: '198.51.100.20' }, { k: 'From', v: '192.168.1.11' }, { k: 'Number', v: '2 of 4' }] },
            { label: 'Inside the envelope (payload)', tone: 'cyan', fields: [{ k: 'Data', v: '"from "' }] },
          ],
          note: 'On the way out, your router swaps the From address for your home public address (you saw this in the NAT lesson).',
        },
      ],
      realLife:
        'Real packets are a little different. The addresses and the numbering live in separate headers (IP and TCP), and TCP numbers bytes rather than "2 of 4". The idea is the same.',
    },
    {
      caption:
        'Each router that receives a packet looks at the destination address and decides which road to use next. It does not need to know the whole trip, only the next step. So packets of the same message can take different roads.',
      show: {},
      badges: { server: ['envelope'] },
      highlight: ['isp'],
      packets: [
        { path: ['laptop', 'router', 'isp', 't1', 't2', 'server'], color: '#ffa31a', label: '1' },
        { path: ['laptop', 'router', 'isp', 'm1', 'server'], color: '#38e8ff', label: '2' },
        { path: ['laptop', 'router', 'isp', 'b1', 'b2', 'server'], color: '#c084fc', label: '3' },
        { path: ['laptop', 'router', 'isp', 'm1', 'server'], color: '#39ff88', label: '4' },
      ],
      realLife:
        'You can watch the routers yourself! On Windows, open a terminal and type "tracert example.com" (on Mac and Linux, "traceroute"). It lists every router on the way. A typical trip crosses 10 to 20 of them, in a fraction of a second.',
    },
    {
      caption:
        'Short roads are faster, so packets can arrive in a different order than they left. That is fine! The numbers on the envelopes let the server put the pieces back in order: 1, 2, 3, 4.',
      show: {},
      badges: { server: ['envelope'] },
      labels: { server: 'Sorts 1-2-3-4' },
      highlight: ['server'],
      packets: [
        { path: ['laptop', 'router', 'isp', 'm1', 'server'], color: '#38e8ff', label: '2' },
        { path: ['laptop', 'router', 'isp', 't1', 't2', 'server'], color: '#ffa31a', label: '1' },
        { path: ['laptop', 'router', 'isp', 'b1', 'b2', 'server'], color: '#c084fc', label: '3' },
        { path: ['laptop', 'router', 'isp', 'm1', 'server'], color: '#39ff88', label: '4' },
      ],
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'What the server receives',
          columns: ['Arrived', 'Number on envelope', 'Piece', 'Road taken'],
          rows: [
            ['1st', '2', '"from "', 'via Router C'],
            ['2nd', '1', '"Hello "', 'via Routers A and B'],
            ['3rd', '4', '"ptop!"', 'via Router C'],
            ['4th', '3', '"my la"', 'via Routers D and E'],
          ],
          tone: 'amber',
          note: 'Arrival order is mixed up. The numbers say where each piece belongs.',
        },
        [
          { t: '"Hello "', sub: 'packet 1', tone: 'amber' },
          { op: '+' },
          { t: '"from "', sub: 'packet 2', tone: 'cyan' },
          { op: '+' },
          { t: '"my la"', sub: 'packet 3', tone: 'violet' },
          { op: '+' },
          { t: '"ptop!"', sub: 'packet 4', tone: 'green' },
          { op: '=' },
          { t: 'Hello from my laptop!', sub: 'back in order', tone: 'green' },
        ],
      ],
      realLife:
        'The rules that do this have names. IP puts the addresses on the envelopes and chooses the roads. TCP numbers the pieces, puts them back in order, and asks for a packet again if it never arrived.',
    },
    {
      caption:
        'What if a road breaks? A digger cuts the link between the provider and Router C. Routers notice quickly, and they simply send every packet along the other roads. The page still arrives, maybe a few milliseconds later.',
      show: {},
      broken: ['isp-m1'],
      badges: {},
      highlight: ['isp', 't1', 'b1'],
      looksLike: {
        title: 'A cable across the ocean',
        src: 'img/real/subsea-cable.png',
        alt: 'Photo of a ship laying a thick undersea cable',
        caption: 'Cables between continents are laid on the sea floor by special ships. Armour wraps the glass fibres inside.',
      },
      realLife:
        'Real cables get cut too: ship anchors and fishing nets sometimes damage undersea cables, and diggers cut street cables. Repair ships fix them, and meanwhile traffic takes other routes.',
      packets: [
        { path: ['laptop', 'router', 'isp', 't1', 't2', 'server'], color: '#ffa31a', label: '1' },
        { path: ['laptop', 'router', 'isp', 'b1', 'b2', 'server'], color: '#c084fc', label: '2' },
        { path: ['laptop', 'router', 'isp', 't1', 't2', 'server'], color: '#ffa31a', label: '3' },
        { path: ['laptop', 'router', 'isp', 'b1', 'b2', 'server'], color: '#c084fc', label: '4' },
      ],
    },
    {
      caption:
        'The server sends the web page back the same way: chopped into packets, each one finding its own way home. Your browser puts them together and shows the page. This is why the internet is so hard to break: there is always another road.',
      show: {},
      broken: [],
      highlight: ['server', 'laptop'],
      packets: [
        { path: ['server', 't2', 't1', 'isp', 'router', 'laptop'], color: '#39ff88', label: 'a' },
        { path: ['server', 'm1', 'isp', 'router', 'laptop'], color: '#39ff88', label: 'b' },
        { path: ['server', 'b2', 'b1', 'isp', 'router', 'laptop'], color: '#39ff88', label: 'c' },
      ],
    },
  ],
  sandbox: {
    root: 'server',
    rootName: 'the server',
    noLocal: true,
    cutText: 'Cut off from the server:',
    okText: 'Everyone can still reach the server. The packets simply use the other roads.',
    intro: 'Click a link to cut it, then click a node to send a packet to the server. How many roads can you cut before the laptop is cut off?',
    scenarios: [
      { label: 'Cut the top road', cut: ['isp-t1'], note: 'A digger cuts the top road.' },
      { label: 'Cut two roads', cut: ['isp-t1', 'isp-b1'], note: 'The top and the bottom roads are cut.' },
      { label: 'Cut the home fibre', cut: ['router-isp'], note: 'The fibre leaving the house is cut.' },
      { label: 'Cut all three entrances to the server', cut: ['t2-server', 'm1-server', 'b2-server'], note: 'All the roads into the web server are cut.' },
      {
        label: 'Max cuts (still works)',
        cut: ['isp-t1', 't1-t2', 't2-server', 'isp-b1', 'b1-b2', 'b2-server'],
        note: 'Top and bottom roads are completely gone. Only the middle road remains.',
      },
    ],
    levels: [
      {
        label: 'Warm-up',
        goal: {
          text: 'Cut 5 or more links and still let the laptop reach the server.',
          check: ({ offline, broken }) => broken.size >= 5 && !offline.has('laptop'),
        },
      },
      {
        label: 'Hard',
        goal: {
          text: 'Cut exactly 6 links (maximum) and still let the laptop reach the server.',
          check: ({ offline, broken }) => broken.size === 6 && !offline.has('laptop'),
        },
      },
    ],
  },

  quiz: [
    {
      type: 'choice',
      q: 'Why are messages chopped into packets?',
      options: [
        'Small pieces can share the roads and take different routes',
        'Computers can only read four letters at a time',
        'It makes the message secret',
        'Packets are free, big messages cost money',
      ],
      answer: 0,
      why: 'Small pieces can be mixed with other people\u2019s pieces, and each can find the best road.',
    },
    {
      type: 'choice',
      q: 'Packets 1, 2 and 3 arrive in the order 2, 1, 3. What happens?',
      options: [
        'The receiver uses the numbers to put them back in order',
        'The message is lost and everything starts again',
        'The web page shows up scrambled',
        'The router deletes packet 2',
      ],
      answer: 0,
      why: 'The numbers on the envelopes are there for exactly this reason.',
    },
    {
      type: 'choice',
      q: 'A road between two routers is cut. What do the routers do?',
      options: [
        'Send the packets along another road',
        'Wait until somebody repairs the road',
        'Send the packets back to the laptop',
        'Turn the internet off for everybody',
      ],
      answer: 0,
      why: 'The internet has many roads between any two places, so routers can detour around a break.',
    },
    {
      type: 'order',
      q: 'Put the trip of a web page in order.',
      items: [
        { id: 'a', label: 'The server chops the page into numbered packets' },
        { id: 'b', label: 'Routers pass the packets along, each choosing the next road' },
        { id: 'c', label: 'The packets arrive, maybe in a mixed order' },
        { id: 'd', label: 'The browser puts them in order and shows the page' },
      ],
      answer: ['a', 'b', 'c', 'd'],
      why: 'Chop, travel, arrive, reassemble.',
    },
    {
      type: 'match',
      q: 'Match each word to its meaning.',
      items: [
        { id: 'packet', label: 'Packet' },
        { id: 'router', label: 'Router' },
        { id: 'number', label: 'The numbers on the envelopes' },
      ],
      targets: [
        { id: 'p', label: 'A small piece of a message with an address on it' },
        { id: 'r', label: 'A machine that chooses the next road for each packet' },
        { id: 'n', label: 'They let the receiver put the pieces back in order' },
      ],
      answer: { packet: 'p', router: 'r', number: 'n' },
      why: 'Packets travel, routers steer, numbers keep the order.',
    },
    {
      type: 'choice',
      q: 'On this map, what is the maximum number of links you can cut and still let the laptop reach the server?',
      options: ['4', '5', '6', '7'],
      answer: 2,
      why: 'You must keep the 4-link middle route (laptop->router->provider->Router C->server), so at most 6 of the 10 links can be cut.',
      hint: 'Count how many links exist, and how many the shortest remaining route needs.',
    },  ],

  recap: [
    'Messages are chopped into small packets, each with an address and a number.',
    'Every router picks the next road for each packet, so packets can take different paths.',
    'The receiver uses the numbers to put the packets back in order.',
    'If a road breaks, packets take another one. That is why the internet is hard to break.',
  ],
});



