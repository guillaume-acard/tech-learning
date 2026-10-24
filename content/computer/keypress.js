TL.registerLesson({
  id: 'computer-keypress',
  title: 'Follow a key press',
  hook: 'You press the letter A. How does it end up on the screen?',
  cover: 'img/lessons/computer-keypress.png',
  scene: TL.computerScene,

  steps: [
    {
      caption: 'You are typing in a text editor. Your finger presses the A key. Everything starts here.',
      show: { nodes: ['keyboard'] },
      highlight: ['keyboard'],
      labels: { keyboard: 'Key A pressed!' },
      looksLike: {
        title: 'Inside a keyboard key',
        src: 'img/real/keyboard.png',
        alt: 'Close-up photo of a keyboard with one key cap removed, showing the switch underneath',
        caption: 'Under each key is a switch. Pressing the key closes the switch, and the keyboard notices which one it was.',
      },
    },
    {
      caption:
        'The keyboard turns the press into a tiny electrical signal that means "the A key went down". The signal runs along the USB cable to the CPU.',
      show: { nodes: ['cpu'], links: ['keyboard-cpu'] },
      highlight: ['keyboard-cpu'],
      packets: [{ path: ['keyboard', 'cpu'], color: '#a3e635', label: 'A' }],
      cards: [
        {
          kind: 'viz',
          viz: 'sequence',
          title: 'What travels along the cable',
          actors: ['Keyboard', 'Computer'],
          messages: [
            { from: 0, to: 1, text: 'key code: A key went down', tone: 'green' },
            { from: 0, to: 1, text: 'key code: A key came up', tone: 'green', note: 'Releasing is a second signal' },
          ],
          note: 'The keyboard sends which key moved, not a finished letter. The computer decides what that key means (a, A or something else).',
        },
      ],
      realLife:
        'On a real computer the signal first reaches a USB controller. The operating system turns the key code into a letter (using your keyboard layout and whether Shift is held) and hands it to the program that is open.',
    },
    {
      caption:
        'The CPU runs the text editor program. The program says: "when a letter arrives, add it to the page". So the CPU saves the letter A in the page, which lives in RAM. Memory only holds numbers, so A is stored as the number 65.',
      show: { nodes: ['ram'], links: ['cpu-ram'] },
      highlight: ['cpu', 'ram'],
      labels: { cpu: 'Add it to the page', ram: 'Page: "...A"' },
      packets: [{ path: ['cpu', 'ram'], color: '#ffa31a', label: 'A' }],
      cards: [
        {
          kind: 'viz',
          viz: 'encode',
          title: 'Memory only holds numbers, so the letter is stored as one',
          aLabel: 'Letter',
          bLabel: 'Number',
          arrow: 'ASCII table',
          pairs: [
            { a: 'H', b: '72', tone: 'cyan' },
            { a: 'i', b: '105', tone: 'cyan' },
            { a: 'space', b: '32', tone: 'dim' },
            { a: 'A', b: '65', tone: 'amber' },
          ],
        },
        { kind: 'viz', viz: 'bits', rows: [{ bits: '01000001', weights: true, label: 'A', sub: 'stored as one byte', tone: 'amber' }], note: 'The number 65 is kept as 8 bits, which is one byte.' },
        {
          kind: 'viz',
          viz: 'memory',
          title: 'The page in RAM: "Hi A"',
          cols: 4,
          cells: [
            { addr: '100', value: '72', label: 'H' },
            { addr: '101', value: '105', label: 'i' },
            { addr: '102', value: '32', label: 'space' },
            { addr: '103', value: '65', label: 'A', tone: 'amber', active: true },
          ],
          legend: [{ tone: 'amber', text: 'the new letter goes in the next free box' }],
        },
      ],
      realLife:
        'Here is one simple scheme, called ASCII, where A is 65. Real text uses a bigger table called Unicode, which also covers emoji and other alphabets. The letter A has the same number in both.',
    },
    {
      caption:
        'Now the screen has to change. The CPU tells the graphics card: "draw the page with the new letter". The graphics card works out which dots on the screen should be which colour.',
      show: { nodes: ['gpu'], links: ['cpu-gpu'] },
      highlight: ['gpu'],
      labels: { gpu: 'Painting dots...' },
      packets: [{ path: ['cpu', 'gpu'], color: '#ffa31a', label: 'draw A' }],
      cards: [
        {
          kind: 'viz',
          viz: 'pixels',
          title: 'The letter A as a grid of dots',
          grid: ['..#..', '.#.#.', '#...#', '#...#', '#####', '#...#', '#...#'],
          palette: { '.': '#0a1424', '#': '#38e8ff' },
          size: 30,
          note: 'The graphics card decides the colour of each dot. Each dot is stored as red, green and blue numbers.',
        },
      ],
    },
    {
      caption:
        'The picture travels along the video cable to the screen, and the letter A appears. All of this took far less than a blink of an eye, and a fast typist can do it ten times a second.',
      show: { nodes: ['screen'], links: ['gpu-screen'] },
      highlight: ['screen'],
      labels: { screen: 'A' },
      packets: [{ path: ['gpu', 'screen'], color: '#c084fc', label: 'picture' }],
      cards: [
        {
          kind: 'viz',
          viz: 'sequence',
          title: 'The whole journey of one key press',
          actors: ['Keyboard', 'CPU', 'RAM', 'Graphics card', 'Screen'],
          messages: [
            { from: 0, to: 1, text: 'key code', tone: 'green' },
            { from: 1, to: 2, text: 'store 65', tone: 'amber' },
            { from: 1, to: 3, text: 'draw page', tone: 'amber' },
            { from: 3, to: 4, text: 'picture', tone: 'violet' },
          ],
        },
      ],
      realLife:
        'The disk is not used here at all. The letter only reaches the disk when you press save, or when the program saves for you.',
    },
  ],

  quiz: [
    {
      type: 'order',
      q: 'Put the journey of a key press in order.',
      items: [
        { id: 'a', label: 'You press a key' },
        { id: 'b', label: 'The signal reaches the CPU' },
        { id: 'c', label: 'The CPU saves the letter in RAM' },
        { id: 'd', label: 'The graphics card draws the page' },
        { id: 'e', label: 'The letter appears on the screen' },
      ],
      answer: ['a', 'b', 'c', 'd', 'e'],
      why: 'Keyboard, CPU, RAM, graphics card, screen.',
    },
    {
      type: 'choice',
      q: 'Where does the text editor keep the page while you are typing?',
      options: ['In the keyboard', 'In RAM', 'In the screen', 'In the USB cable'],
      answer: 1,
      why: 'The page you are working on is kept in RAM until you save it.',
    },
    {
      type: 'choice',
      q: 'Who works out the colour of every dot of the picture?',
      options: ['The keyboard', 'The disk', 'The graphics card', 'The mouse'],
      answer: 2,
      why: 'The graphics card is the artist that paints the picture for the screen.',
    },
  ],

  recap: [
    'A key press becomes a small signal that travels to the CPU.',
    'The CPU follows the program: it stores the letter in RAM and asks the graphics card to redraw the page.',
    'The graphics card sends the picture to the screen, and the letter appears almost instantly.',
  ],
});
