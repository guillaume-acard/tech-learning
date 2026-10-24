TL.registerLesson({
  id: 'network-history',
  title: 'A short history of the internet, and the cables under the sea',
  hook: 'The internet was not invented in one day. It grew from four computers to billions of devices, and most of it still travels through cables on the ocean floor.',
  cover: 'img/lessons/network-history.png',

  steps: [
    {
      caption:
        'Long before computers, people already wanted to send messages across oceans. In 1858 a telegraph cable was laid on the seabed between Ireland and Newfoundland. It worked for only a few weeks, and one short message took many hours to send. A lasting cable followed in 1866. This is the first link in the story: the idea of a cable under the sea.',
      cards: [
        { kind: 'viz', viz: 'worldmap', groups: ['telegraph'], title: 'The first transatlantic cable, 1858' },
        [
          { t: 'Before', sub: 'a message by ship takes about 10 days', tone: 'dim' },
          { op: '→' },
          { t: 'After', sub: 'a message by cable takes minutes or hours', tone: 'amber' },
        ],
      ],
      looksLike: {
        title: 'A telegraph key',
        src: 'img/real/telegraph-key.png',
        alt: 'Photo of an old brass telegraph key with a paper tape',
        caption: 'An operator tapped this key to make short and long electric pulses (Morse code). The pulses travelled down the cable to the other side.',
      },
      realLife: 'Those early cables carried only clicks of Morse code, not bits of data as we know them. But the route they opened across the Atlantic is still one of the busiest today.',
    },
    {
      caption:
        'Now jump to 1969. In the United States, universities and researchers wanted computers to share work. A small network called ARPANET linked the first machines. On 29 October 1969 a student at UCLA tried to send the word "LOGIN" to a computer at Stanford Research Institute. The system crashed after two letters, so the first message ever sent was "LO". By the end of the year, four computers were connected.',
      cards: [
        {
          kind: 'viz',
          viz: 'sequence',
          title: 'The first message on ARPANET, 1969',
          actors: ['UCLA computer', 'Stanford computer'],
          messages: [
            { from: 0, to: 1, text: 'L', tone: 'cyan', note: 'first letter arrives' },
            { from: 0, to: 1, text: 'O', tone: 'cyan', note: 'second letter arrives' },
            { from: 0, to: 1, text: 'G...', tone: 'red', note: 'the system crashed here' },
          ],
        },
      ],
      looksLike: {
        title: 'A computer room from the 1960s',
        src: 'img/real/early-mainframe.png',
        alt: 'Photo of a 1960s computer room with large grey cabinets and tape reels',
        caption: 'The computers on ARPANET were as big as wardrobes and filled whole rooms. A single one cost as much as a house.',
      },
      realLife: 'ARPANET was a research project, not a public service. It already used the key idea you learned earlier: cut the data into small packets and send them across shared links.',
    },
    {
      caption:
        'In 1971 the first email was sent between two computers on this network, and the "@" sign was chosen to separate the user from the machine. But there was a problem: every network spoke its own language. In the 1970s Vint Cerf and Bob Kahn designed a common language, TCP/IP, so that different networks could join together. On 1 January 1983 ARPANET switched to it. That is why many people call 1983 the birth of the internet: a network of networks.',
      cards: [
        {
          kind: 'viz',
          viz: 'layers',
          title: 'One common language joins many networks',
          layers: [
            { t: 'Email, files, remote login', sub: 'what people used', tone: 'green' },
            { t: 'TCP/IP', sub: 'the shared rules for packets and addresses', tone: 'amber' },
            { t: 'University, military, research networks', sub: 'each with its own hardware', tone: 'cyan' },
          ],
          arrows: true,
        },
      ],
      realLife: 'The word "internet" comes from "inter-network": a network of networks. TCP/IP is still what every device you own uses to talk to it.',
    },
    {
      caption:
        'Names came next. People could not remember numeric addresses, so in 1983 the Domain Name System (DNS) was designed, the phone book you met in an earlier lesson. In 1985 the first .com name was registered. At the same time the cables were changing: in 1988 TAT-8, the first transatlantic cable made of optical fibre, was switched on. It carries signals as flashes of light in glass, instead of electricity in copper.',
      cards: [
        { kind: 'viz', viz: 'worldmap', groups: ['telegraph', 'tat8'], title: 'From telegraph to fibre: the Atlantic in 1988' },
      ],
      realLife: 'TAT-8 could carry about 40,000 phone calls at once. That was a huge leap over copper cables, and today a single modern cable carries millions of times more.',
    },
    {
      caption:
        'Until now the internet was mostly for experts. In 1989 Tim Berners-Lee, working at CERN in Switzerland, proposed the World Wide Web: pages with links that anyone could follow. The first website went public in 1991. In 1993 the Mosaic browser showed pictures with text, and the web became easy and fun. Remember: the web is one service that runs on the internet, not the internet itself.',
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'Three ideas that made the web',
          columns: ['Idea', 'What it is'],
          rows: [
            ['URL', 'an address for a page'],
            ['HTTP', 'the rules for asking a server for a page'],
            ['HTML', 'the format a page is written in'],
          ],
          tone: 'cyan',
          note: 'You met all three in the lessons about browsers and websites.',
        },
      ],
      realLife: 'In 1993 CERN made the web free for everyone to use. That choice is one big reason it spread so fast.',
    },
    {
      caption:
        'In the 1990s homes started to join through telephone lines with a dial-up modem, then in the 2000s through faster broadband, and today through fibre. Each step made the same download much faster, and that is what made video calls, streaming and photo sharing possible. Compare how long a 4 MB song takes to arrive.',
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'Downloading one 4 MB song',
          columns: ['Connection', 'Typical speed', 'Time'],
          rows: [
            ['Dial-up modem (1990s)', '56 thousand bits per second', 'about 10 minutes'],
            ['Early broadband (2000s)', '8 million bits per second', 'about 4 seconds'],
            ['Home fibre (today)', '1 billion bits per second', 'a fraction of a second'],
          ],
          highlight: [2],
          tone: 'green',
        },
      ],
      looksLike: {
        title: 'A dial-up modem',
        src: 'img/real/dial-up-modem.png',
        alt: 'Photo of an old beige modem next to a 1990s desktop computer',
        caption: 'A modem turned bits into sounds that could travel down a phone line. While it was connected, nobody could use the phone.',
      },
      realLife: 'The numbers are typical, not exact. Real speeds depend on your plan, your Wi-Fi and how busy the network is.',
    },
    {
      caption:
        'In 2007 the first iPhone made the internet something people carry in their pocket. Mobile networks (3G, then 4G and 5G) joined the story, and apps, social networks and streaming exploded. Today more than five billion people use the internet. Behind a phone there is still a tower, then cables, then more cables.',
      cards: [
        [
          { t: 'Your phone', sub: 'wireless to a tower', tone: 'cyan' },
          { op: '→' },
          { t: 'Tower and provider', sub: 'a cable or radio link', tone: 'amber' },
          { op: '→' },
          { t: 'Cables', sub: 'across land and under the sea', tone: 'green' },
          { op: '→' },
          { t: 'Data centre', sub: 'where the website lives', tone: 'violet' },
        ],
      ],
      looksLike: {
        title: 'A phone from 2007',
        src: 'img/real/early-smartphone.png',
        alt: 'Photo of a first-generation touchscreen smartphone held in a hand',
        caption: 'The first touchscreen smartphones had no keyboard and only a few apps. Today a phone like this would feel very small and slow.',
      },
    },
    {
      caption:
        'Here is the internet today, as a map of the main cables between continents. Each line is a bundle of undersea cables. Between them they hold up the global internet: the vast majority of data that crosses an ocean travels through them, not through satellites. Look at how they connect the big hubs: New York, London, Singapore, Tokyo.',
      cards: [
        { kind: 'viz', viz: 'worldmap', title: 'Main submarine cable routes (simplified)', note: 'A simplified picture. In reality there are hundreds of cables, many running side by side.' },
      ],
      looksLike: {
        title: 'A cable on the seabed',
        src: 'img/real/subsea-cable.png',
        alt: 'Photo of an armoured submarine cable lying on the seabed',
        caption: 'Out at sea a cable is about as thick as a garden hose. Near the coast it gets extra steel armour to protect it from anchors and fishing nets.',
      },
      realLife: 'Companies such as Google, Meta, Microsoft and Amazon now pay for many new cables, because their services need huge amounts of capacity between continents.',
    },
    {
      caption:
        'Zoom in on the Atlantic and the Pacific. The Atlantic is the oldest route and has many cables between North America and Europe. The Pacific links North America with Japan and Australia, with stops on islands such as Hawaii and Guam. Because these are the longest cables, they are also among the most expensive to build and to repair.',
      cards: [
        { kind: 'viz', viz: 'worldmap', focus: 'atlantic', title: 'The Atlantic routes' },
        { kind: 'viz', viz: 'worldmap', focus: 'pacific', title: 'The Pacific routes' },
      ],
    },
    {
      caption:
        'Europe and Asia are linked by a chain of cables that follows the Mediterranean, crosses Egypt by land, goes down the Red Sea, and then crosses the Indian Ocean. Lots of traffic squeezes through a few narrow places, which is why people worry about these chokepoints. Africa is circled by cables too, and many were laid only in the last 15 years.',
      cards: [
        { kind: 'viz', viz: 'worldmap', focus: 'eurasia', title: 'Europe to Asia, through Egypt and the Red Sea' },
        { kind: 'viz', viz: 'worldmap', focus: 'africa', title: 'Cables around Africa' },
      ],
      realLife: 'The dotted line across Egypt is a land route: the cables come out of the sea at one end, cross the country underground, and go back into the sea at the other.',
    },
    {
      caption:
        'What is inside? At the centre are hair-thin strands of glass, the optical fibres. Around them are layers: copper to carry electricity to the amplifiers that boost the light about every 50 to 100 km, then steel wires for strength, and a plastic coat. Special ships lay the cable by unrolling it as they sail. When a cable breaks, from an anchor, a fishing net or an earthquake, a repair ship lifts the cut ends and joins them back. This happens over a hundred times a year, and traffic is usually rerouted so most people never notice.',
      cards: [
        {
          kind: 'viz',
          viz: 'layers',
          title: 'Inside a deep-sea cable, from outside to centre',
          layers: [
            { t: 'Plastic sheath', sub: 'keeps the water out', tone: 'dim' },
            { t: 'Steel wires', sub: 'strength', tone: 'amber' },
            { t: 'Copper tube', sub: 'power for the amplifiers', tone: 'red' },
            { t: 'Optical fibres', sub: 'a few pairs of glass strands carrying light', tone: 'cyan' },
          ],
        },
      ],
      looksLike: {
        title: 'A cable-laying ship',
        src: 'img/real/cable-ship.png',
        alt: 'Photo of a cable-laying ship with large cable drums on deck at sea',
        caption: 'The cable is stored in huge drums on deck and slides off the back of the ship as it sails, sinking slowly to the seabed.',
      },
      realLife: 'This is why a cut cable rarely means "the internet is down": routers find another route, like drivers taking a detour, but the detour can be slower and more crowded.',
    },
  ],

  quiz: [
    {
      type: 'order',
      q: 'Put these events in order.',
      items: [
        { id: 'a', label: 'First telegraph cable across the Atlantic' },
        { id: 'b', label: 'First message on ARPANET' },
        { id: 'c', label: 'The World Wide Web is proposed' },
        { id: 'd', label: 'The first iPhone' },
      ],
      answer: ['a', 'b', 'c', 'd'],
      why: '1858, 1969, 1989 and 2007.',
    },
    {
      type: 'choice',
      q: 'What did TCP/IP make possible?',
      options: ['Different networks could join together into one network of networks', 'Pages could have pictures', 'Phones could use apps', 'Cables could go under the sea'],
      answer: 0,
      why: 'TCP/IP is the shared language of the internet. Pictures on pages came with the web and browsers, and apps came later.',
    },
    {
      type: 'choice',
      q: 'Are the internet and the World Wide Web the same thing?',
      options: [
        'No. The internet is the network, the web is one service that runs on it',
        'Yes, they are two names for the same thing',
        'No. The web is the cables and the internet is the pages',
        'Yes, both were invented on the same day',
      ],
      answer: 0,
      why: 'The internet dates from the 1970s and 1980s. The web arrived around 1990 and runs on top of it, together with email, games and more.',
    },
    {
      type: 'choice',
      q: 'How does most data travel between continents today?',
      options: ['Through cables on the ocean floor', 'Through satellites', 'Through radio towers', 'By ship, on hard drives'],
      answer: 0,
      why: 'Undersea fibre cables carry the vast majority of international traffic. Satellites carry only a small share.',
    },
    {
      type: 'choice',
      q: 'What carries the signal inside a modern undersea cable?',
      options: ['Pulses of light in glass fibres', 'Radio waves', 'Sound waves in water', 'Letters on paper'],
      answer: 0,
      why: 'Optical fibres carry light. Copper in the cable only supplies power to the amplifiers.',
    },
    {
      type: 'choice',
      q: 'A ship anchor cuts one undersea cable. What most likely happens?',
      options: ['Traffic is rerouted over other cables and a repair ship fixes the break', 'The whole internet stops', 'Every website is deleted', 'Satellites are launched the same day'],
      answer: 0,
      why: 'There are many cables, so routers send packets another way. Repair ships then lift and join the cut ends.',
    },
  ],

  recap: [
    'The idea of a cable under the sea is older than computers: the first transatlantic telegraph cable was laid in 1858.',
    'ARPANET (1969) sent the first message, TCP/IP (1983) joined networks into the internet, and the web (about 1990) made it easy for everyone.',
    'Cables changed from copper to optical fibre (TAT-8, 1988), and home access from dial-up to broadband to fibre, and then phones.',
    'Most data between continents crosses the oceans in undersea cables, which are mapped in a few main routes and can be repaired when they break.',
  ],
});
