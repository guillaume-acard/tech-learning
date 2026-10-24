TL.registerLesson({
  id: 'network-https',
  title: 'How HTTPS really works',
  hook: 'The little padlock in your browser hides a short conversation, called a handshake, that takes a few thousandths of a second.',
  cover: 'img/lessons/network-https.png',
  scene: TL.secureScene,

  steps: [
    {
      caption:
        'You open https://www.example.com. Before any page is sent, the browser and the website do a handshake. First, your browser says hello and asks the website to prove who it is.',
      show: {
        nodes: ['laptop', 'router', 'isp', 'internet', 'server'],
        links: ['laptop-router', 'router-isp', 'isp-internet', 'internet-server'],
      },
      highlight: ['laptop'],
      packets: [{ path: ['laptop', 'router', 'isp', 'internet', 'server'], color: '#ffa31a', label: 'hello' }],
    },
    {
      caption:
        'The website answers with its certificate: a digital ID card. It says "I am www.example.com" and carries the website\u2019s public key, the open chest from the last lessons.',
      show: {},
      badges: { server: ['cert', 'chestOpen'] },
      highlight: ['server'],
      packets: [{ path: ['server', 'internet', 'isp', 'router', 'laptop'], color: '#38e8ff', label: 'certificate' }],
      cards: [
        {
          kind: 'viz',
          viz: 'record',
          title: 'A certificate (an ID card for a website)',
          groups: [
            { label: 'Who it is for', tone: 'cyan', fields: [{ k: 'Website', v: 'www.example.com' }, { k: 'Valid until', v: 'a set date' }] },
            { label: 'Public key', tone: 'amber', fields: [{ k: 'Open chest', v: 'a very long number (public)' }] },
            { label: 'Vouched for by', tone: 'green', fields: [{ k: 'Authority', v: 'Example Trust CA' }, { k: 'Signature', v: 'a stamp only the authority can make' }] },
          ],
        },
      ],
    },
    {
      caption:
        'Anybody could print a fake ID card, so the browser checks it. The card must be signed by a certificate authority, an organisation that checks who owns a website before signing. Your browser comes with a list of authorities it trusts. A fake site cannot get a valid signature, so the browser would warn you.',
      show: { nodes: ['ca'], links: ['ca-laptop'] },
      badges: { server: ['cert', 'chestOpen'], laptop: ['cert'] },
      labels: { laptop: 'Checks the signature' },
      highlight: ['ca', 'ca-laptop', 'laptop'],
      cards: [
        [
          { t: 'Certificate', sub: 'www.example.com', tone: 'cyan' },
          { op: '←' },
          { t: 'Signed by', sub: 'Example Trust CA', tone: 'green' },
          { op: '←' },
          { t: 'Trusted by', sub: 'the list inside your browser', tone: 'amber' },
        ],
        [{ t: 'Signature fits and the authority is on the list', sub: 'padlock', tone: 'green' }, { t: 'Unknown authority, or wrong name', sub: 'warning page', tone: 'red' }],
      ],
    },
    {
      caption:
        'Now the browser invents a brand new secret key, used only for this visit. It locks the key in the website\u2019s public chest and sends it. A snooper may copy the locked chest, but cannot open it.',
      show: { nodes: ['spy'], links: ['spy-router'] },
      badges: { server: ['chestOpen', 'key'], laptop: ['key', 'chest'] },
      labels: { laptop: 'Invents a secret key', spy: 'Cannot open it' },
      highlight: ['laptop', 'spy'],
      packets: [
        { path: ['laptop', 'router', 'isp', 'internet', 'server'], color: '#ffa31a', label: 'locked key' },
        { path: ['router', 'spy'], color: '#ff4d6d', label: 'locked key' },
      ],
    },
    {
      caption:
        'The website opens the chest with its private key. Now both of them, and nobody else, know the same secret key. The handshake is over, and the padlock appears in your browser.',
      show: {},
      badges: { server: ['key', 'padlock'], laptop: ['key', 'padlock'] },
      labels: { server: 'Has the key too', laptop: 'Shared key' },
      highlight: ['laptop', 'server'],
      cards: [
        {
          kind: 'viz',
          viz: 'sequence',
          title: 'The handshake, in order',
          actors: ['Browser', 'Website'],
          messages: [
            { from: 0, to: 1, text: 'Hello', tone: 'amber' },
            { from: 1, to: 0, text: 'Certificate (ID + public key)', tone: 'cyan' },
            { from: 0, to: 0, text: 'checks the signature', tone: 'green' },
            { from: 0, to: 1, text: 'secret key, locked in the public chest', tone: 'amber' },
            { from: 1, to: 1, text: 'opens it with its private key', tone: 'violet' },
            { from: 0, to: 1, text: 'scrambled request', tone: 'green', note: 'same key on both sides' },
            { from: 1, to: 0, text: 'scrambled page', tone: 'green' },
          ],
        },
      ],
    },
    {
      caption:
        'From now on, every packet is scrambled with the shared key, in both directions. The snooper sees only gibberish. Why not keep using chests for everything? Because the prime-number maths is slow. The chest is used once to share a key, and then a fast, simple scrambling takes over.',
      show: {},
      badges: { server: ['key', 'padlock'], laptop: ['key', 'padlock'] },
      labels: { spy: 'Sees only gibberish' },
      highlight: ['laptop', 'server'],
      packets: [
        { path: ['laptop', 'router', 'isp', 'internet', 'server'], color: '#38e8ff', label: '#%&@$*?' },
        { path: ['router', 'spy'], color: '#ff4d6d', label: '#%&@$*?' },
        { path: ['server', 'internet', 'isp', 'router', 'laptop'], color: '#39ff88', label: '7Zq~X!' },
      ],
      cards: [
        {
          kind: 'viz',
          viz: 'encode',
          title: 'What the snooper sees',
          aLabel: 'What your browser sends',
          bLabel: 'What travels through the café Wi-Fi',
          arrow: 'scrambled with the shared key',
          pairs: [
            { a: 'H', b: 'c1', tone: 'cyan' },
            { a: 'e', b: '7a', tone: 'cyan' },
            { a: 'l', b: '9c', tone: 'violet' },
            { a: 'l', b: '2b', tone: 'violet' },
            { a: 'o', b: 'e4', tone: 'cyan' },
          ],
          note: 'The two letters "l" scramble to different values, so patterns do not show. Only someone with the key can turn it back.',
        },
      ],
    },
    {
      caption:
        'A few honest notes. The padlock means "private, and the site is who it claims to be", not "safe". A scam site can have a padlock too, so still check the domain name you see. And the real protocol, called TLS, is a little more subtle than our chest: modern versions (TLS 1.3) agree on the key with a related mathematical trick, so a recording of the conversation cannot be unlocked later, even if the website’s private key leaks. The chest story gives the right idea.',
      show: {},
      badges: { server: ['key', 'padlock'], laptop: ['key', 'padlock'] },
      labels: {},
      highlight: ['laptop', 'server'],
      realLife:
        'HTTPS is simply HTTP carried inside a TLS connection. TLS used to be called SSL, and you will still hear that name. Most browsers show the details if you click the padlock. A snooper can still see which website you connected to, just not what you sent or read.',
    },
  ],

  quiz: [
    {
      type: 'choice',
      q: 'What is the job of the website\u2019s certificate?',
      options: [
        'To prove that the website really is who it says it is',
        'To make the website faster',
        'To store your password',
        'To block snoopers from the caf\u00e9 Wi-Fi',
      ],
      answer: 0,
      why: 'It is the website\u2019s ID card. A trusted authority signed it, so your browser can check it.',
    },
    {
      type: 'choice',
      q: 'What does the browser send in the locked chest during the handshake?',
      options: [
        'A new secret key to be shared with the website',
        'Your password',
        'The web page',
        'The website\u2019s private key',
      ],
      answer: 0,
      why: 'The chest only carries the secret key. After that, both sides use it to scramble everything else.',
    },
    {
      type: 'choice',
      q: 'Why does HTTPS use a shared key for the page data instead of the chest for everything?',
      options: [
        'The chest maths is slow, and the shared key is fast',
        'Chests cannot hold text',
        'The shared key is more secret',
        'Snoopers cannot copy shared keys',
      ],
      answer: 0,
      why: 'Public-key maths takes much longer, so it is used only once to share a key.',
    },
    {
      type: 'choice',
      q: 'A website shows the padlock. What does that tell you?',
      options: [
        'The connection is private and the site is who it says it is, but it can still be a scam',
        'The website is honest and safe',
        'The website has no viruses',
        'Nobody can know that you visited it',
      ],
      answer: 0,
      why: 'The padlock protects the connection. It says nothing about whether the owner of the site is honest.',
    },
    {
      type: 'order',
      q: 'Put the HTTPS handshake in order.',
      items: [
        { id: 'a', label: 'The browser says hello' },
        { id: 'b', label: 'The website sends its certificate' },
        { id: 'c', label: 'The browser checks it and sends a locked secret key' },
        { id: 'd', label: 'Both sides scramble every packet with the shared key' },
      ],
      answer: ['a', 'b', 'c', 'd'],
      why: 'Hello, ID card, secret key in the chest, fast and private conversation.',
    },
  ],

  recap: [
    'HTTPS starts with a handshake: hello, the website\u2019s certificate, then a secret key sent in the locked chest.',
    'A certificate authority vouches for the website, and your browser checks the signature.',
    'After the handshake, both sides scramble every packet with the shared key.',
    'The padlock means a private connection to the right site. It does not mean the site is safe.',
  ],
});



