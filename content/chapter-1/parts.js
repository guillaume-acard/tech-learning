TL.registerLesson({
  id: 'ch1-parts',
  title: 'The parts and what they do',
  hook: 'What is really inside a computer, and what is each part for?',
  cover: 'img/lessons/ch1-parts.png',
  scene: TL.computerScene,

  steps: [
    {
      caption:
        'The CPU is the brain. It does the thinking: it follows instructions and does calculations, billions of times every second.',
      looksLike: {
        title: 'A CPU chip',
        src: 'img/real/cpu.png',
        alt: 'Photo of a computer processor chip',
        caption: 'A real CPU is a small square chip, but it holds billions of tiny switches.',
      },
      show: { nodes: ['cpu'] },
      highlight: ['cpu'],
      realLife: 'The dark panel behind the parts is the motherboard: the big circuit board that every part plugs into, and that carries the signals between them.',
    },
    {
      caption:
        'RAM is the short-term memory, like the desk you are working on. The CPU keeps whatever it is using right now on the desk, because the desk is quick to reach.',
      looksLike: {
        title: 'A RAM stick',
        src: 'img/real/ram.png',
        alt: 'Photo of a computer RAM memory module',
        caption: 'RAM comes as a thin stick with memory chips on it that plugs into the motherboard.',
      },
      show: { nodes: ['ram'], links: ['cpu-ram'] },
      highlight: ['ram'],
      packets: [
        { path: ['cpu', 'ram'], color: '#ffa31a', label: 'save' },
        { path: ['ram', 'cpu'], color: '#39ff88', label: 'read' },
      ],
      realLife: 'RAM forgets everything when the power goes off. That is why unsaved work disappears in a power cut.',
    },
    {
      caption:
        'The disk is the long-term memory, like a bookshelf. It is much bigger than the desk, and it keeps your files even when the computer is switched off, but it is slower to reach.',
      looksLike: {
        title: 'SSD disks',
        src: 'img/real/ssd.png',
        alt: 'Photo of two solid state drives',
        caption: 'An SSD can be a small flat box or a tiny stick. Neither has any moving parts.',
      },
      show: { nodes: ['disk'], links: ['disk-cpu', 'cpu-ram'] },
      highlight: ['disk'],
      packets: [{ path: ['disk', 'cpu', 'ram'], color: '#ffa31a', label: 'file' }],
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'RAM and disk side by side',
          columns: ['', 'RAM (the desk)', 'Disk (the bookshelf)'],
          rows: [
            ['Speed', 'Very fast', 'Slower'],
            ['Size', 'Smaller (often 8 to 32 GB)', 'Bigger (often 256 GB to 2 TB)'],
            ['Power off', 'Forgets everything', 'Keeps everything'],
            ['Used for', 'What you are doing now', 'Files, apps, photos'],
          ],
          cells: [[2, 1], [2, 2]],
          note: 'The sizes are typical for a home computer. They change from machine to machine.',
        },
      ],
      realLife: 'Disks come as an SSD (no moving parts, very fast) or an older spinning hard drive. Both keep files without power.',
    },
    {
      caption:
        'The graphics card is the artist. The CPU tells it what to show and it works out the colour of every dot of the picture, which is a lot of dots. Games need a powerful one.',
      looksLike: {
        title: 'A graphics card',
        src: 'img/real/gpu.png',
        alt: 'Photo of a graphics card with two fans',
        caption: 'Graphics cards have their own fans because working out pictures makes them hot.',
      },
      show: { nodes: ['gpu'], links: ['cpu-gpu'] },
      highlight: ['gpu'],
      packets: [{ path: ['cpu', 'gpu'], color: '#ffa31a', label: 'draw this' }],
      cards: [
        {
          kind: 'viz',
          viz: 'pixels',
          title: 'A picture is a grid of dots (pixels)',
          grid: [
            ['#ff0000', '#00ff00', '#0000ff'],
            ['#ffff00', '#ffffff', '#00ffff'],
            ['#ff00ff', '#808080', '#000000'],
          ],
          values: [
            ['255,0,0', '0,255,0', '0,0,255'],
            ['255,255,0', '255,255,255', '0,255,255'],
            ['255,0,255', '128,128,128', '0,0,0'],
          ],
          size: 64,
          note: 'Each dot is three numbers: how much red, green and blue light, from 0 to 255. The graphics card works these numbers out for millions of dots, many times a second.',
        },
      ],
    },
    {
      caption: 'The screen is the output. It shows the finished picture that the graphics card sends along the video cable.',
      show: { nodes: ['screen'], links: ['gpu-screen'] },
      highlight: ['screen'],
      packets: [{ path: ['gpu', 'screen'], color: '#c084fc', label: 'picture' }],
    },
    {
      caption:
        'The keyboard and the mouse are the inputs. They are how you talk to the computer: every key press and every click travels to the CPU.',
      show: { nodes: ['keyboard', 'mouse'], links: ['keyboard-cpu', 'mouse-cpu'] },
      highlight: ['keyboard', 'mouse'],
      packets: [
        { path: ['keyboard', 'cpu'], color: '#a3e635', label: 'key' },
        { path: ['mouse', 'cpu'], color: '#a3e635', label: 'click' },
      ],
    },
    {
      caption:
        'The Wi-Fi chip is the wireless link. It turns the data from the CPU into radio waves, sends them through the air to the router, and turns the radio waves coming back into data again. It is how the computer reaches the internet without a cable.',
      show: { nodes: ['wifi', 'router'], links: ['cpu-wifi', 'wifi-router'] },
      highlight: ['wifi'],
      packets: [
        { path: ['cpu', 'wifi', 'router'], color: '#38bdf8', label: 'send' },
        { path: ['router', 'wifi', 'cpu'], color: '#39ff88', label: 'receive' },
      ],
      cards: [
        [
          { t: 'CPU', sub: 'data to send', tone: 'cyan' },
          { op: '→' },
          { t: 'Wi-Fi chip', sub: 'data becomes radio waves', tone: 'amber' },
          { op: '→' },
          { t: 'Router', sub: 'and on to the internet', tone: 'green' },
        ],
      ],
      realLife:
        'The Wi-Fi chip is often a tiny part soldered onto the motherboard, with a small antenna hidden in the case. Laptops and phones always have one. Many desktop computers do not, and use a network cable instead.',
    },
    {
      caption:
        'One last part holds all the others together: the motherboard. It is a large circuit board with thin copper lines printed on it. Every part plugs into it, and those lines carry the signals between them.',
      show: {},
      looksLike: {
        title: 'A motherboard',
        src: 'img/real/motherboard.png',
        alt: 'Photo of a computer motherboard with sockets and connectors',
        caption: 'The motherboard has a socket for the CPU, slots for RAM and the graphics card, and ports for cables.',
      },
    },
  ],

  sandbox: {
    inspect: {
      cpu: 'The brain. It follows instructions one by one and does the calculations. Like a chef following a recipe, very fast.',
      ram: 'Short-term memory. Holds what you are working on right now. Like the desk. It is emptied when the power goes off.',
      disk: 'Long-term storage. Keeps your files, apps and photos even when switched off. Like a bookshelf: big but slower.',
      gpu: 'The graphics card. Works out the colour of every dot on the screen. Like an artist painting the picture.',
      screen: 'The output. Shows the picture it receives. Like a window onto what the computer is doing.',
      keyboard: 'An input. Turns each key you press into a signal for the CPU.',
      mouse: 'An input. Tells the CPU where you moved and what you clicked.',
      wifi: 'The wireless link. Turns data into radio waves for the router, and radio waves back into data. Like a walkie-talkie for the computer.',
      router: 'Not a part of the computer. It is the box in your home that the Wi-Fi chip talks to, and that connects you to the internet.',
    },
    intro: 'Click (or press Enter on) any part to find out what it does.',
    goal: {
      text: 'Check out all 8 parts of the computer.',
      check: ({ visited }) => ['cpu', 'ram', 'disk', 'gpu', 'screen', 'keyboard', 'mouse', 'wifi'].every((id) => visited.has(id)),
    },
  },

  quiz: [
    {
      type: 'match',
      q: 'Match each part to its job.',
      items: [
        { id: 'cpu', label: 'CPU' },
        { id: 'ram', label: 'RAM' },
        { id: 'disk', label: 'Disk' },
        { id: 'gpu', label: 'Graphics card' },
        { id: 'screen', label: 'Screen' },
        { id: 'wifi', label: 'Wi-Fi chip' },
      ],
      targets: [
        { id: 'cpu', label: 'Follows instructions and calculates' },
        { id: 'ram', label: 'Holds what you are using right now' },
        { id: 'disk', label: 'Keeps files when switched off' },
        { id: 'gpu', label: 'Works out the picture' },
        { id: 'screen', label: 'Shows the picture' },
        { id: 'wifi', label: 'Sends and receives data by radio' },
      ],
      answer: { cpu: 'cpu', ram: 'ram', disk: 'disk', gpu: 'gpu', screen: 'screen', wifi: 'wifi' },
      why: 'Each part has one main job, and together they make the computer work.',
    },
    {
      type: 'choice',
      q: 'You are writing a story and the power goes off before you press save. Where was your unsaved text?',
      options: ['On the disk', 'In RAM, which forgets when the power goes off', 'Inside the screen', 'In the keyboard'],
      answer: 1,
      why: 'Unsaved work lives in RAM, the desk. Saving copies it to the disk, the bookshelf.',
      hint: 'Which memory is the short-term one?',
    },
    {
      type: 'choice',
      q: 'Which part keeps your photos for years, even when the computer is off?',
      options: ['RAM', 'CPU', 'Disk', 'Graphics card'],
      answer: 2,
      why: 'The disk is the long-term storage.',
    },
  ],

  recap: [
    'The CPU is the brain: it follows instructions and does calculations.',
    'RAM is the short-term memory (the desk), the disk is the long-term memory (the bookshelf).',
    'The graphics card draws the picture, the screen shows it, and the keyboard and mouse are how you send things in.',
    'The Wi-Fi chip is the wireless link: it turns data into radio waves for the router and back, so the computer can reach the internet without a cable.',
  ],
});
