TL.registerLesson({
  id: 'network-browser',
  title: 'How browsers and websites work',
  hook: 'When you open a website, what runs on your device and what runs on the server?',
  cover: 'img/lessons/network-browser.png',
  scene: TL.browserScene,

  steps: [
    {
      caption:
        'When you visit a website, the server sends files such as HTML, CSS and JavaScript to your browser. HTML describes the page, CSS styles it, and JavaScript can make it interactive.',
      show: { nodes: ['browser', 'server'], links: ['browser-server'] },
      highlight: ['browser', 'server', 'browser-server'],
      packets: [{ path: ['server', 'browser'], color: '#39ff88', label: 'page files' }],
      cards: [
        {
          kind: 'viz',
          viz: 'code',
          file: 'index.html (what the server sends first)',
          lines: [
            { t: '<link rel="stylesheet" href="style.css">', tone: 'violet', note: 'CSS: colours, fonts, layout' },
            { t: '<h1>Welcome to the bike shop</h1>', tone: 'cyan', note: 'HTML: what is on the page' },
            { t: '<button id="menu">Menu</button>', tone: 'cyan', note: 'HTML: a button' },
            { t: '<script src="app.js"></script>', tone: 'amber', note: 'JavaScript: what the page can do' },
          ],
          note: 'The browser reads the HTML, then asks the server for the extra files it mentions (style.css and app.js).',
        },
      ],
    },
    {
      caption:
        'The browser runs much of that JavaScript locally on your device. It can open menus, check that a form looks complete, update the screen, or do a calculation without asking the server each time.',
      show: {},
      highlight: ['browser'],
      labels: { browser: 'Runs page code locally' },
      cards: [
        [{ t: 'Browser code', sub: 'runs on your device', tone: 'cyan' }, { op: '->' }, { t: 'Updated page', sub: 'no server trip needed', tone: 'green' }],
        {
          kind: 'viz',
          viz: 'code',
          file: 'app.js (runs in your browser)',
          lines: [
            { t: "menu.onclick = () => panel.show()", tone: 'cyan', note: 'click the button: the menu opens at once' },
            { t: 'if (name.value === "") warn("Please add a name")', tone: 'amber', note: 'a quick check, no waiting for the server' },
          ],
        },
      ],
    },
    {
      caption:
        'Other actions need the server: signing in, searching a large catalogue, loading new information, or saving a change. The browser sends a request; the server processes it and sends a response.',
      show: { nodes: ['records'], links: ['server-records'] },
      highlight: ['browser-server', 'server', 'records'],
      looksLike: {
        title: 'A rack of servers',
        src: 'img/real/server-rack.png',
        alt: 'Photo of a rack of servers with cables and blinking lights',
        caption: 'A website server is a computer without a screen. Many of them are stacked in racks like this.',
      },
      packets: [
        { path: ['browser', 'server'], color: '#ffa31a', label: 'request' },
        { path: ['server', 'browser'], color: '#39ff88', label: 'response' },
      ],
      cards: [
        [{ t: 'Browser', sub: 'asks', tone: 'cyan' }, { op: '->' }, { t: 'Server', sub: 'checks + does work', tone: 'violet' }, { op: '->' }, { t: 'Browser', sub: 'shows result', tone: 'green' }],
        {
          kind: 'viz',
          viz: 'sequence',
          title: 'Searching a catalogue',
          actors: ['Browser', 'Server', 'Site records'],
          messages: [
            { from: 0, to: 1, text: 'GET /search?q=lamp', tone: 'amber', note: 'request' },
            { from: 1, to: 2, text: 'find items named lamp', tone: 'violet', note: 'the server looks up the data' },
            { from: 2, to: 1, text: '14 items', tone: 'violet' },
            { from: 1, to: 0, text: 'results page', tone: 'green', note: 'response' },
          ],
        },
      ],
    },
    {
      caption:
        'The browser belongs to the visitor and runs on their device. A curious or malicious visitor can change the page, edit a request, or skip a browser-side check. So the server must not trust browser data just because the website sent it.',
      show: {},
      highlight: ['browser', 'server'],
      labels: { browser: 'Can be changed', server: 'Must verify' },
      cards: [
        {
          kind: 'viz',
          viz: 'record',
          title: 'A price the visitor edits',
          groups: [
            { label: 'The page showed', tone: 'cyan', fields: [{ k: 'Item', v: 'Bike light' }, { k: 'Price', v: '20' }] },
            { label: 'The visitor sends', tone: 'red', fields: [{ k: 'Item', v: 'Bike light' }, { k: 'Price', v: '1' }] },
            { label: 'The server must', tone: 'green', fields: [{ k: 'Check', v: 'look up the real price (20)' }, { k: 'Result', v: 'ignore the 1' }] },
          ],
        },
      ],
      realLife:
        'A browser check can make a form easier to use, but it is not a security barrier. The server must check permissions, prices, and important data itself before accepting a change.',
    },
    {
      caption:
        'A cookie is a small piece of text that a website asks the browser to save. On later requests to that site, the browser usually sends the cookie back automatically.',
      show: {},
      highlight: ['browser', 'browser-server'],
      labels: { browser: 'Stores cookie', server: 'Sets cookie' },
      packets: [
        { path: ['server', 'browser'], color: '#c084fc', label: 'save cookie' },
        { path: ['browser', 'server'], color: '#ffa31a', label: 'send cookie' },
      ],
      cards: [
        [{ t: 'Server', sub: 'sets a cookie', tone: 'violet' }, { op: '->' }, { t: 'Browser', sub: 'stores it', tone: 'cyan' }, { op: '->' }, { t: 'Next request', sub: 'cookie sent back', tone: 'amber' }],
        {
          kind: 'viz',
          viz: 'sequence',
          title: 'A cookie, step by step',
          actors: ['Browser', 'Server'],
          messages: [
            { from: 0, to: 1, text: 'sign in (over HTTPS)', tone: 'amber' },
            { from: 1, to: 0, text: 'Set-Cookie: session=k7Q2x9', tone: 'violet', note: 'save this' },
            { from: 0, to: 0, text: 'stores the cookie', tone: 'cyan' },
            { from: 0, to: 1, text: 'GET /account + Cookie: session=k7Q2x9', tone: 'amber', note: 'sent back automatically' },
          ],
        },
      ],
    },
    {
      caption:
        'A common cookie stores a random session ID. The server uses it to recognize that several requests belong to the same signed-in session, without putting your password in the cookie.',
      show: {},
      highlight: ['browser-server', 'server', 'records'],
      labels: { browser: 'Session ID cookie', server: 'Looks up session' },
      cards: [
        { kind: 'viz', viz: 'record', groups: [{ label: 'In your browser', tone: 'cyan', fields: [{ k: 'Cookie', v: 'session=k7Q2x9' }] }] },
        {
          kind: 'viz',
          viz: 'table',
          title: 'On the server: the list of sessions',
          columns: ['Session ID', 'Signed-in user', 'Expires'],
          rows: [
            ['m3Zp81', 'Alex', 'in 40 minutes'],
            ['k7Q2x9', 'Sam', 'in 2 hours'],
            ['v0Rb5t', 'Priya', 'in 10 minutes'],
          ],
          highlight: 1,
          note: 'The cookie holds only the random ID. Everything else stays on the server.',
        },
      ],
      realLife:
        'A session cookie is like a numbered claim ticket: the browser presents it, and the server looks up the session. A well-designed site keeps it hard to guess and protects it with settings such as Secure and HttpOnly.',
    },
    {
      caption:
        'Cookies can also remember choices, like language or a shopping basket. Some sites and advertising systems use identifiers to recognize a browser over time and track activity. Cookie rules and browser settings can limit this.',
      show: {},
      highlight: ['browser', 'server'],
      labels: { browser: 'Preferences + IDs' },
      realLife:
        'Cookies are not all the same and are not automatically bad. A first-party cookie is set by the site you are visiting; third-party tracking may involve other services embedded in that site.',
    },
  ],

  quiz: [
    {
      type: 'choice',
      q: 'After the browser downloads JavaScript from a website, where does much of it run?',
      options: [
        'It runs locally in the browser on your device',
        'It runs only inside the router',
        'It is sent to every website on the internet',
        'It is printed by the server',
      ],
      answer: 0,
      why: 'The browser runs downloaded page code locally, while other actions can send requests to the server.',
    },
    {
      type: 'choice',
      q: 'Why must a server verify important data instead of trusting the browser?',
      options: [
        'The visitor can change browser code or edit requests on their own device',
        'Browsers cannot display numbers',
        'Servers cannot receive forms',
        'Cookies always change the page',
      ],
      answer: 0,
      why: 'The visitor controls their browser, so client-side checks can be bypassed. The server must enforce permissions and validate important changes.',
    },
    {
      type: 'choice',
      q: 'How can a cookie help a site remember that you are signed in?',
      options: [
        'It can hold a session ID that the browser sends with later requests',
        'It stores your password in every web page',
        'It makes the server remember everything without requests',
        'It connects the browser directly to the database',
      ],
      answer: 0,
      why: 'The server can use a session ID in a cookie to look up the signed-in session. The password should not be stored in the cookie.',
    },
    {
      type: 'choice',
      q: 'Which is an example of cookie-based tracking?',
      options: [
        'A site or service uses an identifier to recognize a browser over time',
        'A browser downloads the page style once',
        'A server checks a price before accepting an order',
        'A router sends a packet to the website',
      ],
      answer: 0,
      why: 'Identifiers can help sites or embedded services connect activity across visits. Cookies can also have ordinary uses like preferences and sessions.',
    },
  ],

  recap: [
    'A browser downloads website files and runs much of the page code locally; other actions send requests to a server.',
    'The visitor controls their browser, so servers must independently validate important data and permissions.',
    'Cookies are small pieces of data stored by the browser and sent back to a site, often to manage sessions, preferences, or tracking.',
  ],
});
