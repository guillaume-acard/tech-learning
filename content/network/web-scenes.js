// Scenes for the network chapter, Parts B and C. Lessons reveal them step by step, like the home map.

TL.dnsScene = {
  label: 'DNS: a laptop asks a resolver, which asks the root, .com, .org and name servers',
  viewBox: [0, 0, 1100, 700],
  nodes: {
    laptop: { x: 70, y: 350, icon: 'laptop', label: 'Laptop', leaf: true },
    router: { x: 225, y: 350, icon: 'router', label: 'Router' },
    resolver: { x: 380, y: 350, icon: 'book', label: 'Resolver', sub: 'Your provider' },
    root: { x: 701, y: 129, icon: 'server', label: 'Root server', sub: 'Top of DNS' },
    tldcom: { x: 879, y: 227, icon: 'server', label: '.com server', sub: 'All .com sites' },
    tldorg: { x: 940, y: 350, icon: 'server', label: '.org server', sub: 'All .org sites' },
    nscom: { x: 879, y: 473, icon: 'server', label: 'Name server', sub: 'example.com' },
    nsorg: { x: 701, y: 571, icon: 'server', label: 'Name server', sub: 'example.org' },
  },
  links: [
    { from: 'laptop', to: 'router', type: 'wifi', hideLabel: true },
    { from: 'router', to: 'resolver', type: 'fibre', hideLabel: true },
    { from: 'resolver', to: 'root', type: 'backbone', hideLabel: true },
    { from: 'resolver', to: 'tldcom', type: 'backbone', hideLabel: true },
    { from: 'resolver', to: 'tldorg', type: 'backbone', hideLabel: true },
    { from: 'resolver', to: 'nscom', type: 'backbone', hideLabel: true },
    { from: 'resolver', to: 'nsorg', type: 'backbone', hideLabel: true },
  ],
};

TL.routeScene = {
  label: 'Packets travel from a laptop through several routers to a web server, with three possible roads',
  viewBox: [0, 0, 1100, 660],
  offlineLabel: 'Cut off',
  nodes: {
    laptop: { x: 80, y: 330, icon: 'laptop', label: 'Laptop', sub: 'You', leaf: true },
    router: { x: 270, y: 330, icon: 'router', label: 'Router', sub: 'At home' },
    isp: { x: 440, y: 330, icon: 'router', label: 'Provider', sub: 'Your provider' },
    t1: { x: 640, y: 140, icon: 'router', label: 'Router A' },
    t2: { x: 830, y: 140, icon: 'router', label: 'Router B' },
    m1: { x: 735, y: 330, icon: 'router', label: 'Router C' },
    b1: { x: 640, y: 520, icon: 'router', label: 'Router D' },
    b2: { x: 830, y: 520, icon: 'router', label: 'Router E' },
    server: { x: 1010, y: 330, icon: 'server', label: 'Web server', sub: 'example.com' },
  },
  links: [
    { from: 'laptop', to: 'router', type: 'wifi', hideLabel: true },
    { from: 'router', to: 'isp', type: 'fibre', hideLabel: true },
    { from: 'isp', to: 't1', type: 'backbone', hideLabel: true },
    { from: 't1', to: 't2', type: 'backbone', hideLabel: true },
    { from: 't2', to: 'server', type: 'backbone', hideLabel: true },
    { from: 'isp', to: 'm1', type: 'backbone', hideLabel: true },
    { from: 'm1', to: 'server', type: 'backbone', hideLabel: true },
    { from: 'isp', to: 'b1', type: 'backbone', hideLabel: true },
    { from: 'b1', to: 'b2', type: 'backbone', hideLabel: true },
    { from: 'b2', to: 'server', type: 'backbone', hideLabel: true },
  ],
};

TL.secureScene = {
  label: 'A laptop talks to a web server through a router, a provider and the internet, while a snooper listens in',
  viewBox: [0, 0, 1100, 600],
  nodes: {
    ca: { x: 110, y: 150, icon: 'cert', label: 'Authority', sub: 'Vouches for IDs' },
    spy: { x: 360, y: 150, icon: 'spy', label: 'Snooper', sub: 'Cafe Wi-Fi' },
    laptop: { x: 110, y: 400, icon: 'laptop', label: 'You', sub: 'Laptop', leaf: true },
    router: { x: 360, y: 400, icon: 'router', label: 'Router' },
    isp: { x: 610, y: 400, icon: 'router', label: 'Provider', sub: 'Your provider' },
    internet: { x: 800, y: 400, icon: 'globe', label: 'Internet', sub: 'Many routers' },
    server: { x: 990, y: 400, icon: 'server', label: 'Web server', sub: 'example.com' },
  },
  links: [
    { from: 'laptop', to: 'router', type: 'wifi' },
    { from: 'router', to: 'isp', type: 'fibre' },
    { from: 'isp', to: 'internet', type: 'backbone', hideLabel: true },
    { from: 'internet', to: 'server', type: 'backbone', hideLabel: true },
    { from: 'spy', to: 'router', type: 'tap' },
    { from: 'ca', to: 'laptop', type: 'trust' },
  ],
};

TL.tripScene = {
  label: 'The whole trip: laptop, router, provider, DNS servers, internet routers and the web server',
  viewBox: [0, 0, 1100, 640],
  offlineLabel: 'Cut off',
  nodes: {
    resolver: { x: 430, y: 150, icon: 'book', label: 'Resolver', sub: 'Provider DNS' },
    dns: { x: 720, y: 150, icon: 'server', label: 'DNS servers', sub: 'Root, .com...' },
    laptop: { x: 90, y: 410, icon: 'laptop', label: 'Laptop', sub: 'You', leaf: true },
    router: { x: 260, y: 410, icon: 'router', label: 'Router', sub: 'At home' },
    isp: { x: 430, y: 410, icon: 'router', label: 'Provider', sub: 'Your provider' },
    r1: { x: 620, y: 410, icon: 'router', label: 'Router A' },
    r2: { x: 800, y: 410, icon: 'router', label: 'Router B' },
    server: { x: 990, y: 410, icon: 'server', label: 'Web server', sub: 'example.com' },
  },
  links: [
    { from: 'laptop', to: 'router', type: 'wifi', hideLabel: true, cutNote: 'Nothing can leave the laptop. The browser says "No internet connection".' },
    { from: 'router', to: 'isp', type: 'fibre', hideLabel: true, cutNote: 'The house is cut off from the world. The browser says "No internet connection".' },
    { from: 'isp', to: 'resolver', type: 'backbone', hideLabel: true, cutNote: 'Your laptop can no longer look up names. The browser says "This site can’t be reached: DNS error", even though the web server itself is fine.' },
    { from: 'resolver', to: 'dns', type: 'backbone', hideLabel: true, cutNote: 'The resolver cannot find the answer to new names. The browser says "DNS error".' },
    { from: 'isp', to: 'r1', type: 'backbone', hideLabel: true, cutNote: 'The road to the website is cut.' },
    { from: 'r1', to: 'r2', type: 'backbone', hideLabel: true, cutNote: 'The road to the website is cut.' },
    { from: 'r2', to: 'server', type: 'backbone', hideLabel: true, cutNote: 'DNS still works, so the browser knows the address, but the server cannot be reached. The browser says "Connection timed out".' },
  ],
};

TL.browserScene = {
  label: 'A browser downloads a website, runs some code on your device, and sends requests to a server',
  viewBox: [0, 0, 1100, 580],
  nodes: {
    browser: { x: 160, y: 290, icon: 'laptop', label: 'Browser', sub: 'Your device' },
    server: { x: 570, y: 290, icon: 'server', label: 'Website server', sub: 'Checks requests' },
    records: { x: 930, y: 290, icon: 'book', label: 'Site records', sub: 'Account and data' },
  },
  links: [
    { from: 'browser', to: 'server', type: 'backbone', label: 'Web requests' },
    { from: 'server', to: 'records', type: 'tool', label: 'Server-side data' },
  ],
};
