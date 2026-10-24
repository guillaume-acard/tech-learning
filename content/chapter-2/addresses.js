TL.registerLesson({
  id: 'ch2-addresses',
  title: 'IP addresses: private and public',
  hook: 'Dozens of devices share one internet connection. How do the answers find the right one?',
  cover: 'img/lessons/ch2-addresses.png',
  scene: TL.homeScene,

  steps: [
    {
      caption:
        'First, what is an IP address? Think of the address on an envelope. Every message sent over the internet is like a letter: to arrive, it needs a "To" address, and to get an answer back it needs a "From" address. An IP address is that address: a number given to every device that is connected to a network.',
      show: {
        nodes: ['laptop', 'router', 'internet'],
        links: ['laptop-router', 'router-internet'],
      },
      cards: [[{ t: '192.168.1.11', sub: 'From: the sender', tone: 'amber' }, { op: '→' }, { t: '203.0.113.9', sub: 'To: the receiver', tone: 'green' }]],
      labels: { laptop: '192.168.1.11' },
      highlight: ['laptop'],
      packets: [{ path: ['laptop', 'router', 'internet'], color: '#ffa31a', label: 'letter' }],
      realLife:
        'IP stands for Internet Protocol, the set of rules for how these addresses are written and used. Just like a postal address, no two devices can use the same one on the same network at the same time.',
    },
    {
      caption:
        'Inside the house, the router gives every device its own private address, like a room number. They look like 192.168.1.12.',
      show: {
        nodes: ['router', 'internet', 'desktop', 'laptop', 'tv', 'phone1'],
        links: ['router-internet', 'desktop-router', 'laptop-router', 'tv-router', 'phone1-router'],
      },
      labels: {
        router: '192.168.1.1',
        desktop: '192.168.1.10',
        laptop: '192.168.1.11',
        tv: '192.168.1.12',
        phone1: '192.168.1.13',
      },
      highlight: ['desktop', 'laptop', 'tv', 'phone1'],
      cards: [
        {
          kind: 'viz',
          viz: 'record',
          title: 'Reading one address: four numbers',
          groups: [
            { label: 'The street (this home network)', tone: 'cyan', fields: [{ k: 'number 1', v: '192' }, { k: 'number 2', v: '168' }, { k: 'number 3', v: '1' }] },
            { label: 'The room (this device)', tone: 'amber', fields: [{ k: 'number 4', v: '11' }] },
          ],
          note: 'Each number goes from 0 to 255. Here: network 192.168.1, device number 11, the laptop.',
        },
        {
          kind: 'viz',
          viz: 'table',
          title: 'Private addresses handed out by the router',
          columns: ['Device', 'Private address'],
          rows: [
            ['Router', '192.168.1.1'],
            ['Desktop', '192.168.1.10'],
            ['Laptop', '192.168.1.11'],
            ['Smart TV', '192.168.1.12'],
            ['Phone 1', '192.168.1.13'],
          ],
          tone: 'cyan',
        },
      ],
      realLife:
        'Splitting the number into "street" and "room" is how most home networks work. The real split can be in a different place, but the idea is the same: part of the address names the network, part names the device.',
    },
    {
      caption:
        'The internet does not know your room numbers. The whole house shows up under a single public address given by your internet provider, like a building that has one street address for all its flats.',
      show: {},
      labels: { router: '203.0.113.42', internet: 'via your provider' },
      highlight: ['router'],
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'Two kinds of address',
          columns: ['Address', 'Who can see it', 'Belongs to'],
          rows: [
            ['192.168.1.11', 'only inside the house', 'the laptop (room number)'],
            ['192.168.1.12', 'only inside the house', 'the Smart TV (room number)'],
            ['203.0.113.42', 'the whole internet', 'the router, for the whole house (street address)'],
          ],
          highlight: 2,
          tone: 'amber',
        },
      ],
      packets: [{ path: ['desktop', 'router', 'internet'], color: '#ffa31a' }],
      realLife:
        'The numbers 203.0.113.x are reserved for examples, so we use one here. A real public address looks the same: four numbers separated by dots. Private addresses like 192.168.x.x are reserved for use inside homes, so every home can reuse them.',
    },
    {
      caption:
        'Now the router has a job: when a message arrives, where does it go? The router keeps a routing table. It is a list that says: for this destination address, send it out this way. Here is a simplified one for our house.',
      show: {},
      highlight: ['router'],
      labels: { router: '192.168.1.1' },
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'The router\'s routing table (simplified)',
          columns: ['Destination address', 'Send it out through'],
          rows: [
            ['192.168.1.10', 'Desktop (LAN cable)'],
            ['192.168.1.11', 'Laptop (Wi-Fi)'],
            ['192.168.1.12', 'Smart TV (Wi-Fi)'],
            ['192.168.1.13', 'Phone 1 (Wi-Fi)'],
            ['anything else', 'the internet (fibre to the provider)'],
          ],
          tone: 'cyan',
          note: 'The last row is called the default route: "if nothing above matches, send it to the provider".',
        },
      ],
      realLife:
        'A real home router keeps this as two short lists. One says "192.168.1.x is inside the house". Another list remembers which cable or Wi-Fi link each device is on. We merge them into one table to keep the idea simple.',
    },
    {
      caption:
        'Packet one: the laptop sends a file to the TV. The router reads the destination address on the packet, 192.168.1.12. It finds the matching row and sends the packet out that way: by Wi-Fi to the TV.',
      show: {},
      highlight: ['laptop', 'router', 'tv'],
      labels: { laptop: '192.168.1.11', tv: '192.168.1.12' },
      cards: [
        [{ t: '192.168.1.12', sub: 'destination on the packet', tone: 'amber' }, { op: '→' }, { t: 'Smart TV (Wi-Fi)', sub: 'matching row', tone: 'green' }],
        {
          kind: 'viz',
          viz: 'table',
          columns: ['Destination address', 'Send it out through'],
          rows: [
            ['192.168.1.10', 'Desktop (LAN cable)'],
            ['192.168.1.11', 'Laptop (Wi-Fi)'],
            ['192.168.1.12', 'Smart TV (Wi-Fi)'],
            ['192.168.1.13', 'Phone 1 (Wi-Fi)'],
            ['anything else', 'the internet (fibre to the provider)'],
          ],
          highlight: 2,
          tone: 'cyan',
        },
      ],
      packets: [{ path: ['laptop', 'router', 'tv'], color: '#ffa31a', label: 'file' }],
    },
    {
      caption:
        'Packet two: the desktop sends something to the laptop. The destination is 192.168.1.11, so the router picks a different row and sends it by Wi-Fi to the laptop. Different packet, different row, different way out.',
      show: {},
      highlight: ['desktop', 'router', 'laptop'],
      labels: { desktop: '192.168.1.10', laptop: '192.168.1.11' },
      cards: [
        [{ t: '192.168.1.11', sub: 'destination on the packet', tone: 'amber' }, { op: '→' }, { t: 'Laptop (Wi-Fi)', sub: 'matching row', tone: 'green' }],
        {
          kind: 'viz',
          viz: 'table',
          columns: ['Destination address', 'Send it out through'],
          rows: [
            ['192.168.1.10', 'Desktop (LAN cable)'],
            ['192.168.1.11', 'Laptop (Wi-Fi)'],
            ['192.168.1.12', 'Smart TV (Wi-Fi)'],
            ['192.168.1.13', 'Phone 1 (Wi-Fi)'],
            ['anything else', 'the internet (fibre to the provider)'],
          ],
          highlight: 1,
          tone: 'cyan',
        },
      ],
      packets: [{ path: ['desktop', 'router', 'laptop'], color: '#ffa31a', label: 'message' }],
    },
    {
      caption:
        'Packet three: the laptop asks for a website at 203.0.113.9. No device in the house has that address, so none of the first rows match. The router uses the last row, the default route, and sends the packet to the internet.',
      show: {},
      highlight: ['laptop', 'router', 'internet'],
      labels: { laptop: '192.168.1.11', internet: 'via your provider' },
      cards: [
        [{ t: '203.0.113.9', sub: 'destination on the packet', tone: 'amber' }, { op: '→' }, { t: 'the internet', sub: 'default route', tone: 'green' }],
        {
          kind: 'viz',
          viz: 'table',
          columns: ['Destination address', 'Send it out through'],
          rows: [
            ['192.168.1.10', 'Desktop (LAN cable)'],
            ['192.168.1.11', 'Laptop (Wi-Fi)'],
            ['192.168.1.12', 'Smart TV (Wi-Fi)'],
            ['192.168.1.13', 'Phone 1 (Wi-Fi)'],
            ['anything else', 'the internet (fibre to the provider)'],
          ],
          highlight: 4,
          tone: 'cyan',
        },
      ],
      packets: [{ path: ['laptop', 'router', 'internet'], color: '#ffa31a', label: 'request' }],
      realLife:
        'The internet itself is made of many routers, and each one has a routing table like this. They pass the packet on, hop by hop, until it arrives.',
    },
    {
      caption:
        'But the internet cannot reply to 192.168.1.11: that room number only exists inside the house. So the router acts like a receptionist. When the laptop asks for a website, the router writes it in a second list, the connection table, and sends the request out under the house address.',
      show: {},
      labels: { router: 'remembers who asked', laptop: '192.168.1.11' },
      highlight: ['router', 'laptop'],
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'The connection table (NAT)',
          columns: ['Who asked inside the house', 'Sent out as', 'Talking to'],
          rows: [
            ['Laptop 192.168.1.11 : port 50001', '203.0.113.42 : port 40001', 'website 203.0.113.9'],
            ['Smart TV 192.168.1.12 : port 51000', '203.0.113.42 : port 40002', 'video site 203.0.113.50'],
            ['Phone 1 192.168.1.13 : port 52000', '203.0.113.42 : port 40003', 'website 203.0.113.9'],
          ],
          highlight: 0,
          tone: 'amber',
          note: 'A port number is like an extension number: it tells the separate conversations of one address apart.',
        },
      ],
      packets: [{ path: ['laptop', 'router', 'internet'], color: '#ffa31a', label: 'request' }],
      realLife:
        'This trick is called NAT (Network Address Translation). It is why many devices can share one public address. The router swaps the private address and port for the public ones, and the port number is what lets it tell the conversations apart.',
    },
    {
      caption:
        'When the answer comes back, it is addressed to the house, port 40001. The router looks up port 40001 in its connection table, finds the laptop, swaps the address back and hands the answer over.',
      show: {},
      labels: { router: '203.0.113.42', laptop: '192.168.1.11' },
      highlight: ['router', 'laptop'],
      cards: [
        {
          kind: 'viz',
          viz: 'sequence',
          actors: ['Laptop', 'Router', 'Website'],
          messages: [
            { from: 0, to: 1, text: 'from 192.168.1.11:50001', tone: 'amber', note: 'request leaves the laptop' },
            { from: 1, to: 2, text: 'from 203.0.113.42:40001', tone: 'amber', note: 'router swaps in the house address' },
            { from: 2, to: 1, text: 'to 203.0.113.42:40001', tone: 'green', note: 'answer comes back to the house' },
            { from: 1, to: 0, text: 'to 192.168.1.11:50001', tone: 'green', note: 'router looks up the table, swaps back' },
          ],
        },
      ],
      packets: [{ path: ['internet', 'router', 'laptop'], color: '#39ff88', label: 'answer' }],
    },
    {
      caption:
        'Outside the house, a phone on 4G gets a different address from the mobile operator. That is why its address changes whenever it switches from Wi-Fi to 4G.',
      show: { nodes: ['tower'], links: ['phone1-tower', 'tower-internet'] },
      broken: ['phone1-router'],
      labels: { phone1: '198.51.100.7', tower: 'Mobile operator' },
      highlight: ['phone1', 'phone1-tower'],
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'One phone, two networks, two addresses',
          columns: ['Where the phone is', 'Network it joined', 'Its address'],
          rows: [
            ['In the living room', 'Home Wi-Fi (your router)', '192.168.1.13'],
            ['In the garden, on 4G', 'Mobile operator', '198.51.100.7'],
          ],
          highlight: 1,
          tone: 'violet',
        },
      ],
      packets: [{ path: ['phone1', 'tower', 'internet'], color: '#ff4d6d' }],
      realLife:
        'Many mobile operators also share one public address between lots of phones, using the same NAT trick your router uses. We show a simple one here.',
    },
  ],

  quiz: [
    {
      type: 'choice',
      q: 'What is an IP address, in one sentence?',
      options: [
        'The address of a device, so messages know where to go and where to come back to',
        'The password of the Wi-Fi',
        'The name of your internet provider',
        'The speed of your connection',
      ],
      answer: 0,
      why: 'Like the address on an envelope, it says who a message is for and who sent it.',
    },
    {
      type: 'choice',
      q: 'Which of these is a private address that only works inside a home?',
      options: ['192.168.1.12', '203.0.113.42', 'www.example.com', 'https://example.com'],
      answer: 0,
      why: 'Addresses starting with 192.168 are private room numbers, handed out by your router.',
    },
    {
      type: 'choice',
      q: 'The laptop asks for a website. What does the router do?',
      options: [
        'Sends it out under the house address and remembers who asked',
        'Deletes the request',
        'Gives the laptop a new public address',
        'Sends it to the TV first',
      ],
      answer: 0,
      why: 'This is NAT: the router remembers who asked, so the answer returns to the right device.',
    },
    {
      type: 'choice',
      q: 'A packet arrives at the router with the destination 192.168.1.12. How does the router know where to send it?',
      options: [
        'It finds that address in its routing table and uses the matching row',
        'It sends a copy to every device and waits',
        'It asks the internet provider',
        'It always sends it to the TV',
      ],
      answer: 0,
      why: 'The routing table lists destination addresses and which way out to use. The router finds the matching row.',
      hint: 'Think of looking up a name in a list.',
    },
    {
      type: 'choice',
      q: 'A packet is for 203.0.113.9, and no device in the house has that address. Which row does the router use?',
      options: ['The default route: send it to the internet', 'The row for the laptop', 'It throws the packet away', 'The row for the TV'],
      answer: 0,
      why: 'The last row, "anything else", is the default route. It sends every unknown destination out to the provider.',
    },
    {
      type: 'choice',
      q: 'What does the router use its connection table (NAT) for?',
      options: [
        'To remember which device asked, so the answer goes back to the right one',
        'To store your passwords',
        'To speed up the fibre',
        'To give the TV an HDMI cable',
      ],
      answer: 0,
      why: 'The connection table links a private address and port inside the house to the public address and port used outside.',
    },
    {
      type: 'choice',
      q: 'Your phone leaves the Wi-Fi and uses 4G. What happens to its address?',
      options: [
        'It gets a different address from the mobile operator',
        'It keeps exactly the same address',
        'It becomes 192.168.1.1',
        'It has no address',
      ],
      answer: 0,
      why: 'Each network gives its own addresses, so the phone gets a new one on the mobile network.',
    },
  ],

  recap: [
    'Each device at home has a private address (a room number) given by the router.',
    'The whole house shares one public address (the street address) seen by the internet.',
    'The router reads the destination address on each packet, finds the matching row in its routing table and sends the packet out that way. If nothing matches, the default route sends it to the internet.',
    'The router remembers who asked (NAT, using a connection table) so every answer reaches the right device.',
  ],
});



