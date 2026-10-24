TL.registerLesson({
  id: 'ch2-mobile',
  title: 'Away from Wi-Fi: phones, watch and 4G',
  hook: 'What happens to the phones when you walk out into the garden?',
  cover: 'img/lessons/ch2-mobile.png',
  scene: TL.homeScene,

  steps: [
    {
      caption: 'At home, the phones join the Wi-Fi, just like the laptop. Every message goes through the router.',
      show: {
        nodes: ['router', 'internet', 'phone1', 'phone2'],
        links: ['router-internet', 'phone1-router', 'phone2-router'],
      },
      highlight: ['phone1', 'phone2'],
      packets: [{ path: ['phone1', 'router', 'internet'], color: '#ffa31a' }],
    },
    {
      caption:
        'Our smart watch has its own SIM card, like a tiny phone. At home it uses the Wi-Fi when it can.',
      show: { nodes: ['watch'], links: ['watch-router'] },
      highlight: ['watch', 'watch-router'],
      looksLike: {
        title: 'A SIM card',
        src: 'img/real/sim-card.png',
        alt: 'Close-up photo of a nano SIM card and a phone SIM tray',
        caption: 'A SIM card is a tiny chip that identifies your subscription to the mobile operator. The gold part is the contacts.',
      },
      packets: [{ path: ['watch', 'router', 'internet'], color: '#ffa31a' }],
    },
    {
      caption:
        'There is a second way to the internet: the mobile network. 4G towers are connected to the internet by the mobile operator. The SIM card lets a phone or watch talk to the nearest tower by radio.',
      looksLike: {
        title: 'A mobile phone tower',
        src: 'img/real/cell-tower.png',
        alt: 'A mobile phone tower with multiple antennas',
        caption: 'Mobile towers send and receive signals by radio, then connect back to the internet.',
      },
      show: {
        nodes: ['tower'],
        links: ['tower-internet', 'phone1-tower', 'phone2-tower', 'watch-tower'],
      },
      highlight: ['tower', 'phone1-tower', 'phone2-tower', 'watch-tower'],
      cards: [
        {
          kind: 'viz',
          viz: 'sequence',
          actors: ['Phone', '4G tower', 'Operator network', 'Internet'],
          messages: [
            { from: 0, to: 1, text: 'radio + SIM identity', tone: 'red', note: 'the SIM says who the phone is' },
            { from: 1, to: 2, text: 'cable or fibre', tone: 'amber', note: 'the operator checks the SIM and your plan' },
            { from: 2, to: 3, text: 'your request', tone: 'cyan', note: 'then out to the internet' },
          ],
        },
      ],
      packets: [
        { path: ['phone1', 'tower', 'internet'], color: '#ff4d6d' },
        { path: ['watch', 'tower', 'internet'], color: '#ff4d6d' },
      ],
    },
    {
      caption:
        'Two kinds of calls can look similar: a WhatsApp call is voice sent as internet data, while a classic phone call uses the mobile operator phone call service. If the internet path is broken, WhatsApp can fail while a classic call can still work (as long as you have tower signal).',
      show: {
        nodes: ['phone1', 'phone2', 'router', 'internet', 'tower', 'voice'],
        links: [
          'phone1-router',
          'phone2-router',
          'router-internet',
          'phone1-tower',
          'phone2-tower',
          'tower-internet',
          'tower-voice',
        ],
      },
      highlight: ['internet', 'voice'],
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'Two kinds of call',
          columns: ['Call type', 'Travels as', 'Needs', 'Internet path broken?'],
          rows: [
            ['WhatsApp call', 'internet data', 'Wi-Fi or mobile data that reaches the internet', 'fails'],
            ['Classic phone call', 'operator call service', 'tower signal', 'can still work'],
          ],
          cells: [[0, 3], [1, 3]],
          tone: 'green',
        },
      ],
      packets: [
        { path: ['phone1', 'router', 'internet'], color: '#ffa31a' },
        { path: ['phone1', 'tower', 'voice'], color: '#22c55e' },
      ],
      realLife:
        'Some operators also support Wi-Fi calling, but the key idea stays the same: WhatsApp needs an internet path; classic calls need a working mobile signal.',
    },
    {
      caption:
        'Now you walk into the garden. The Wi-Fi signal gets too weak, so the phones and the watch switch to 4G on their own. They stay online without you doing anything.',
      show: {},
      broken: ['phone1-router', 'phone2-router', 'watch-router'],
      connectivity: true,
      highlight: ['phone1-tower', 'phone2-tower', 'watch-tower'],
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'What the phone sees, and what it picks',
          columns: ['Where', 'Wi-Fi signal', '4G signal', 'Phone uses'],
          rows: [
            ['Living room', 'strong', 'ok', 'Wi-Fi'],
            ['Garden', 'too weak', 'ok', '4G'],
          ],
          highlight: 1,
          tone: 'red',
        },
      ],
      packets: [{ path: ['phone2', 'tower', 'internet'], color: '#ff4d6d' }],
    },
    {
      caption:
        'Back inside, they hop back onto the Wi-Fi. Wi-Fi works only near the router; 4G works almost anywhere there is a tower, but it uses the mobile plan.',
      show: {},
      highlight: ['phone1-router', 'phone2-router', 'watch-router'],
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'What the phone sees, and what it picks',
          columns: ['Where', 'Wi-Fi signal', '4G signal', 'Phone uses'],
          rows: [
            ['Living room', 'strong', 'ok', 'Wi-Fi'],
            ['Garden', 'too weak', 'ok', '4G'],
          ],
          highlight: 0,
          tone: 'red',
        },
      ],
      packets: [{ path: ['phone2', 'router', 'internet'], color: '#ffa31a' }],
      realLife:
        'At home your router gives each device an address. Outside, the mobile operator gives your phone a different one, so the phone has a new address whenever it switches network.',
    },
  ],

  sandbox: {
    levels: [
      {
        label: 'Stay online',
        root: 'internet',
        rootName: 'the internet',
        show: {
          nodes: ['router', 'internet', 'phone1', 'phone2', 'watch', 'tower'],
          links: [
            'router-internet',
            'phone1-router',
            'phone2-router',
            'watch-router',
            'phone1-tower',
            'phone2-tower',
            'watch-tower',
            'tower-internet',
          ],
        },
        intro: 'Click links to cut them, or use a scenario. Click a device to send a message.',
        scenarios: [
          { label: 'Walk into the garden', cutType: 'wifi', note: 'You walk out into the garden and the Wi-Fi fades.' },
          { label: '4G network down', cutType: 'mobile', note: 'The mobile network has a problem.' },
          {
            label: 'Deep in a tunnel',
            cut: ['phone1-router', 'phone2-router', 'watch-router', 'phone1-tower', 'phone2-tower', 'watch-tower'],
            note: 'You are far from the Wi-Fi and the tower cannot reach you either.',
          },
        ],
        goal: {
          text: 'Take both phones and the watch out of Wi-Fi range, but keep them all online.',
          check: ({ offline, broken }) =>
            ['phone1-router', 'phone2-router', 'watch-router'].every((id) => broken.has(id)) && offline.size === 0,
        },
      },
      {
        label: 'WhatsApp call',
        root: 'internet',
        rootName: 'the internet',
        show: {
          nodes: ['router', 'internet', 'phone1', 'phone2', 'tower'],
          links: ['router-internet', 'phone1-router', 'phone2-router', 'phone1-tower', 'phone2-tower', 'tower-internet'],
        },
        intro: 'WhatsApp calls are voice over the internet. Make Phone 1 able to reach the internet.',
        scenarios: [
          { label: 'No Wi-Fi', cut: ['phone1-router'], note: 'Phone 1 is out of Wi-Fi range.' },
          { label: 'No mobile signal', cut: ['phone1-tower'], note: 'Phone 1 has no tower signal.' },
          { label: 'Internet outage', cut: ['router-internet', 'tower-internet'], note: 'The internet path is down.' },
          {
            label: 'Both problems',
            cut: ['phone1-router', 'phone1-tower'],
            note: 'Phone 1 has no Wi-Fi and no tower signal. WhatsApp cannot work until one comes back.',
          },
        ],
        goal: {
          text: 'Make Phone 1 reach the internet (WhatsApp).',
          check: ({ offline }) => !offline.has('phone1'),
        },
      },
      {
        label: 'Classic call',
        root: 'voice',
        rootName: 'the phone call service',
        noLocal: true,
        show: {
          nodes: ['router', 'internet', 'phone1', 'phone2', 'tower', 'voice'],
          links: [
            'router-internet',
            'phone1-router',
            'phone2-router',
            'phone1-tower',
            'phone2-tower',
            'tower-internet',
            'tower-voice',
          ],
        },
        intro:
          'Classic phone calls use the tower and the operator phone call service. They can still work even when the internet path is broken.',
        okText: 'Phone 1 can reach the phone call service.',
        cutText: 'No phone call service:',
        scenarios: [
          {
            label: 'Internet down',
            cut: ['router-internet', 'tower-internet'],
            note: 'The internet path is broken. A WhatsApp call will fail, but a classic call may still work.',
          },
          { label: 'Airplane mode', cut: ['phone1-tower'], note: 'Phone 1 has no tower signal. Classic calls fail.' },
          {
            label: 'No signal and no Wi-Fi',
            cut: ['phone1-tower', 'phone1-router'],
            note: 'Phone 1 is offline. Nothing can work until one network comes back.',
          },
        ],
        goal: {
          text: 'Make Phone 1 reach the phone call service (classic call).',
          check: ({ offline }) => !offline.has('phone1'),
        },
      },
    ],
  },

  quiz: [
    {
      type: 'choice',
      q: 'You walk from the living room into the garden. What do your phone and watch do?',
      options: ['Switch to 4G and stay online', 'Turn themselves off', 'Look for a LAN cable', 'Lose the connection until you come back'],
      answer: 0,
      why: 'When the Wi-Fi gets too weak they use the mobile network through the SIM card.',
    },
    {
      type: 'choice',
      q: 'What does a smart watch need to use 4G on its own?',
      options: ['A SIM card', 'An HDMI cable', 'A LAN cable', 'A second router'],
      answer: 0,
      why: 'The SIM card identifies the watch to the mobile operator, just like in a phone.',
    },
    {
      type: 'choice',
      q: 'Your home internet is down, but you still have strong 4G signal. Which is most likely to still work?',
      options: ['A classic phone call', 'A WhatsApp call', 'HDMI', 'A LAN cable'],
      answer: 0,
      why: 'A WhatsApp call needs an internet path. A classic call needs tower signal and the operator phone call service.',
    },
    {
      type: 'choice',
      q: 'You have Wi-Fi, but no tower signal (no mobile network). Which is most likely to still work?',
      options: ['A WhatsApp call', 'A classic phone call', 'Neither', 'Both'],
      answer: 0,
      why: 'WhatsApp can use Wi-Fi to reach the internet. A classic call needs tower signal (unless Wi-Fi calling is enabled, which is special).',
    },
    {
      type: 'match',
      q: 'Which connection is each device most likely using?',
      items: [
        { id: 'a', label: 'Phone in the living room' },
        { id: 'b', label: 'Phone in the garden' },
        { id: 'c', label: 'Watch on a bike ride, far from home' },
      ],
      targets: [
        { id: 'wifi', label: 'Wi-Fi' },
        { id: 'mobile', label: '4G' },
      ],
      answer: { a: 'wifi', b: 'mobile', c: 'mobile' },
      why: 'Wi-Fi only reaches around the router. Everywhere else, 4G takes over.',
    },
  ],

  recap: [
    'Phones and watches can use two networks: Wi-Fi near the router, and 4G through a SIM card anywhere with a tower.',
    'WhatsApp calls are voice sent as internet data, so they need an internet path (Wi-Fi or mobile data).',
    'Classic phone calls use the tower and the operator phone call service, so they can still work when the internet path is broken.',
  ],
});