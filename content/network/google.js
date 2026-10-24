TL.registerLesson({
  id: 'network-google',
  title: 'Google is not the internet (or your browser)',
  hook: 'Many people say "I opened Google" when they mean the browser, the search, or the internet. Those are three different things.',
  cover: 'img/lessons/network-google-vs-internet.png',

  steps: [
    {
      caption:
        'Here is a very common mix-up. Someone says "the internet is down" when a website will not load. Someone else says "I googled it" when they used another search site. And many people think the window they type in is "Google". Let us untangle three things: the internet, the browser, and the search engine.',
      cards: [
        [
          { t: 'The internet', sub: 'the network', tone: 'cyan' },
          { t: 'A browser', sub: 'the app you use', tone: 'green' },
          { t: 'A search engine', sub: 'a website that finds websites', tone: 'amber' },
        ],
      ],
    },
    {
      caption:
        'The internet is the giant network of connected computers, cables, routers and servers all over the world. You saw it in the earlier lessons: your home network, your provider, packets crossing between them. It is the roads, not any one shop or app.',
      cards: [
        [
          { t: 'Cables and wireless links', sub: 'the roads', tone: 'cyan' },
          { t: 'Routers', sub: 'the junctions', tone: 'cyan' },
          { t: 'Servers', sub: 'the places to visit', tone: 'cyan' },
        ],
      ],
      looksLike: {
        title: 'A satellite dish',
        src: 'img/real/satellite-dish.png',
        alt: 'Photo of a satellite dish pointing at the sky',
        caption: 'Some links are wireless: a dish like this talks to a satellite. Most of the internet, though, runs through cables.',
      },
      realLife:
        'Nobody owns the whole internet. It is thousands of networks, run by providers, companies, universities and governments, agreeing to pass packets to each other. Most data between continents travels through fibre cables on the sea floor; satellites carry only a small share.',
    },
    {
      caption:
        'The web is one thing that runs on the internet: the collection of websites you can visit with a browser. The internet carries much more than the web: email, video calls, online games, app updates, and the messages between your phone apps and their servers.',
      cards: [
        [
          { t: 'The internet', sub: 'carries everything', tone: 'cyan' },
          { op: '⊃' },
          { t: 'The web', sub: 'websites', tone: 'green' },
          { t: 'Email', sub: 'also on the internet', tone: 'dim' },
          { t: 'Games', sub: 'also on the internet', tone: 'dim' },
        ],
      ],
    },
    {
      caption:
        'A browser is a program on your device. Its job is to ask servers for web pages and show them to you. It downloads HTML, CSS and JavaScript files and turns them into a page you can read and click. Chrome, Safari, Firefox and Edge are browsers.',
      cards: [
        [
          { t: 'Chrome', sub: 'browser', tone: 'green' },
          { t: 'Safari', sub: 'browser', tone: 'green' },
          { t: 'Firefox', sub: 'browser', tone: 'green' },
          { t: 'Edge', sub: 'browser', tone: 'green' },
        ],
      ],
      realLife:
        'A browser is like a window onto the web. It does not contain the websites. It fetches them from servers, the way a TV does not contain the shows.',
    },
    {
      caption:
        'A search engine is a website, so it lives on a server, not on your device. Its job is to help you find other websites. It keeps a gigantic index of pages, a bit like the index at the back of a book, and when you type words it lists the pages that look most useful.',
      cards: [
        [
          { t: 'You type words', sub: 'dog training tips', tone: 'cyan' },
          { op: '→' },
          { t: 'Search engine', sub: 'looks in its index', tone: 'amber' },
          { op: '→' },
          { t: 'A list of links', sub: 'pages that may help', tone: 'green' },
        ],
        {
          kind: 'viz',
          viz: 'table',
          title: 'A tiny piece of a search index',
          subtitle: 'Built earlier, by visiting pages. Each word points to the pages that contain it.',
          columns: ['Word', 'Pages that contain it'],
          rows: [
            ['bike', 'bikeshop.example, cycling-news.example'],
            ['dog', 'petcare.example, dogclub.example, vet-tips.example'],
            ['training', 'dogclub.example, gym-guide.example, vet-tips.example'],
          ],
          highlight: [1, 2],
          note: 'You typed "dog training tips", so the engine looks up "dog" and "training" and ranks the pages that appear for both, such as dogclub.example and vet-tips.example.',
        },
      ],
      realLife:
        'Google Search, Bing and DuckDuckGo are search engines. When you search, the engine does not scan the whole internet live. It looks in an index it built earlier by visiting pages automatically, a process called crawling.',
    },
    {
      caption:
        'So where does the confusion come from? Google is a company that makes all three kinds of things: a search engine (Google Search), a browser (Chrome), and many other services (Gmail, Maps, YouTube). Because you often meet them together, they blur into one word: "Google".',
      cards: [
        [
          { t: 'Google Search', sub: 'search engine', tone: 'amber' },
          { t: 'Chrome', sub: 'browser', tone: 'green' },
          { t: 'Gmail, Maps, YouTube', sub: 'websites and apps', tone: 'violet' },
        ],
        [{ t: 'One company, many different products', sub: '', tone: 'dim' }],
      ],
      realLife:
        'The same happens with other names. Microsoft makes the Edge browser and the Bing search engine. Apple makes the Safari browser. A search engine and a browser from the same company are still two separate things.',
    },
    {
      caption:
        'You can see the difference yourself. In the browser, the address bar is where you type a website address, like a street address, to go straight there. A search box is where you type words, to ask a search engine for suggestions. Many browsers let you do both from one bar, which blurs the line even more.',
      cards: [
        [
          { t: 'Address: example.com', sub: 'go straight to that site', tone: 'green' },
          { t: 'Words: cheap bike lights', sub: 'ask a search engine', tone: 'amber' },
        ],
      ],
    },
    {
      caption:
        'Put together: you use a browser (an app on your device) to visit websites on the web (which runs on the internet). One of those websites can be a search engine, which helps you find the others. If the search site is down, the internet still works. If you use a different browser, the same websites still load.',
      cards: [
        [
          { t: 'You', sub: 'at your device', tone: 'cyan' },
          { op: '→' },
          { t: 'Browser', sub: 'asks for pages', tone: 'green' },
          { op: '→' },
          { t: 'Internet', sub: 'carries the request', tone: 'cyan' },
          { op: '→' },
          { t: 'Website or search engine', sub: 'answers', tone: 'amber' },
        ],
        {
          kind: 'viz',
          viz: 'layers',
          title: 'Who uses what',
          arrows: '▲ uses',
          layers: [
            { t: 'Your browser', sub: 'an app on your device', tone: 'green' },
            { t: 'The web', sub: 'websites, including search engines', tone: 'amber' },
            { t: 'The internet', sub: 'the network that carries the web, email, games and more', tone: 'cyan' },
          ],
        },
        {
          kind: 'viz',
          viz: 'sequence',
          title: 'Searching, then visiting a site',
          subtitle: 'Two different websites, one browser. Every arrow travels over the internet.',
          actors: ['Browser', 'Search engine', 'Another website'],
          messages: [
            { from: 0, to: 1, text: 'dog training tips', tone: 'amber', note: 'ask the search site' },
            { from: 1, to: 0, text: 'list of links', tone: 'green', note: 'it found them in its index' },
            { from: 0, to: 2, text: 'give me that page', tone: 'cyan', note: 'you clicked a link' },
            { from: 2, to: 0, text: 'the page', tone: 'green', note: 'the browser shows it' },
          ],
        },
      ],
    },
  ],

  quiz: [
    {
      type: 'match',
      q: 'Match each thing to what it is.',
      items: [
        { id: 'a', label: 'Chrome, Safari and Firefox' },
        { id: 'b', label: 'Google Search and Bing' },
        { id: 'c', label: 'Cables, routers and servers all over the world' },
      ],
      targets: [
        { id: 'browser', label: 'Browsers' },
        { id: 'search', label: 'Search engines' },
        { id: 'net', label: 'The internet' },
      ],
      answer: { a: 'browser', b: 'search', c: 'net' },
      why: 'Browsers are apps on your device, search engines are websites that help you find websites, and the internet is the network underneath everything.',
    },
    {
      type: 'choice',
      q: 'Your browser works, but the Google Search website is down. What is true?',
      options: [
        'Other websites can still load, because the internet and your browser are fine',
        'The whole internet is down',
        'Your browser has been deleted',
        'No website anywhere can load',
      ],
      answer: 0,
      why: 'A search engine is just one website. If it is down, the browser and the internet still work for other sites.',
    },
    {
      type: 'choice',
      q: 'What does a search engine do?',
      options: [
        'It keeps an index of web pages and lists the ones that match your words',
        'It connects your device to the internet',
        'It draws web pages on your screen',
        'It is the cable between your home and the internet',
      ],
      answer: 0,
      why: 'A search engine builds an index of pages and helps you find the right one. Connecting is done by the network, and showing pages is the browser’s job.',
    },
    {
      type: 'choice',
      q: 'Is Chrome the same thing as Google Search?',
      options: [
        'No. Chrome is a browser app, Google Search is a search engine website, and the same company makes both',
        'Yes, they are two names for the same thing',
        'No, Chrome is the internet and Google Search is the router',
        'Yes, Chrome only works with Google Search',
      ],
      answer: 0,
      why: 'You can use Chrome to visit any website, including other search engines, and you can use Google Search from any browser.',
    },
    {
      type: 'order',
      q: 'Put the steps in order when you search for something.',
      items: [
        { id: 'a', label: 'You open a browser on your device' },
        { id: 'b', label: 'The browser asks the search engine website for results' },
        { id: 'c', label: 'The search engine replies with a list of links' },
        { id: 'd', label: 'You click a link and the browser loads that website' },
      ],
      answer: ['a', 'b', 'c', 'd'],
      why: 'The browser is the app, the internet carries the requests, and the search engine is one of the websites it talks to.',
    },
  ],

  recap: [
    'The internet is the global network. The web is the websites that run on it. A browser is the app on your device that visits them.',
    'A search engine is a website that keeps an index of pages and helps you find the right one.',
    '"Google" is a company that makes a search engine, a browser and more, but those are separate things you can mix and match.',
  ],
});
