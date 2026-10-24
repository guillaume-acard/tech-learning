TL.registerLesson({
  id: 'computer-run-program',
  title: 'What happens when you start a program',
  hook: 'You double-click a game. What does the computer actually do?',
  cover: 'img/lessons/computer-run-program.png',
  scene: TL.computerScene,

  steps: [
    {
      caption:
        'A program is just a file. While the computer is idle, the game sleeps on the disk, like a book on the bookshelf.',
      show: { nodes: ['disk'] },
      highlight: ['disk'],
      labels: { disk: 'Game is saved here' },
      cards: [
        {
          kind: 'viz',
          viz: 'memory',
          title: 'On the disk: files, each with a name',
          cols: 4,
          cells: [
            { addr: 'notes.txt', value: '2 KB', label: 'file' },
            { addr: 'photo.jpg', value: '3 MB', label: 'file' },
            { addr: 'game', value: '5 GB', label: 'the program', tone: 'amber', active: true },
            { addr: 'song.mp3', value: '8 MB', label: 'file' },
          ],
          legend: [{ tone: 'amber', text: 'the game waits here, not running' }],
        },
      ],
    },
    {
      caption:
        'You double-click. The first thing that happens is that the game is copied from the disk into RAM, like carrying the book from the shelf to your desk. That is the "loading" you wait for.',
      show: { nodes: ['ram'], links: ['disk-cpu', 'cpu-ram'] },
      highlight: ['disk-cpu', 'cpu-ram', 'ram'],
      labels: { ram: 'Loading the game...' },
      packets: [{ path: ['disk', 'cpu', 'ram'], color: '#ffa31a', label: 'game' }],
      cards: [
        {
          kind: 'viz',
          viz: 'memory',
          title: 'Disk: the original stays',
          cols: 4,
          cells: [
            { addr: 'notes.txt', value: '2 KB' },
            { addr: 'photo.jpg', value: '3 MB' },
            { addr: 'game', value: '5 GB', tone: 'amber' },
            { addr: 'song.mp3', value: '8 MB' },
          ],
        },
        {
          kind: 'viz',
          viz: 'memory',
          title: 'RAM: a working copy is added',
          cols: 4,
          cells: [
            { addr: '0', value: 'game copy', label: 'part 1', tone: 'amber', active: true },
            { addr: '1', value: 'game copy', label: 'part 2', tone: 'amber', active: true },
            { addr: '2', value: 'game copy', label: 'part 3', tone: 'amber', active: true },
            { addr: '3', value: 'empty', empty: true },
          ],
        },
      ],
      realLife:
        'RAM is much faster than the disk, so the CPU works from a copy in RAM instead of waiting for the slow disk all the time. Real systems often load only the parts of a program that are needed first, and the data usually flows through a memory controller rather than being handled by the CPU piece by piece. The map is simplified.',
    },
    {
      caption:
        'The program is a long list of tiny instructions. The CPU reads the first one from RAM...',
      show: { nodes: ['cpu'], links: ['cpu-ram'] },
      highlight: ['cpu', 'ram'],
      labels: { ram: 'Game is ready', cpu: 'Reading instruction 1' },
      packets: [{ path: ['ram', 'cpu'], color: '#39ff88', label: 'instruction' }],
      cards: [
        {
          kind: 'viz',
          viz: 'memory',
          title: 'Inside the game in RAM: a numbered list of instructions',
          cols: 6,
          cells: [
            { addr: '1', value: '17', label: 'instr 1', tone: 'green', active: true },
            { addr: '2', value: '42', label: 'instr 2' },
            { addr: '3', value: '8', label: 'instr 3' },
            { addr: '4', value: '93', label: 'instr 4' },
            { addr: '5', value: '5', label: 'instr 5' },
            { addr: '6', value: '61', label: 'instr 6' },
          ],
          legend: [{ tone: 'green', text: 'the CPU reads this one first' }],
          note: 'Each instruction is stored as a number (made-up numbers here). The CPU knows which box to read next.',
        },
      ],
    },
    {
      caption:
        '...does what it says, then reads the next one, and the next one. Reading and doing, again and again. A modern CPU can do billions of these every second.',
      show: {},
      highlight: ['cpu'],
      labels: { ram: 'Game is ready', cpu: 'Doing it, next one!' },
      packets: [
        { path: ['ram', 'cpu'], color: '#39ff88', label: 'next' },
        { path: ['ram', 'cpu'], color: '#39ff88', label: 'next' },
        { path: ['ram', 'cpu'], color: '#39ff88', label: 'next' },
      ],
      realLife: 'A CPU speed of 3 GHz means about 3 billion clock ticks every second. A simple instruction can take about one tick, but some take more.',
      cards: [
        {
          kind: 'viz',
          viz: 'memory',
          title: 'The CPU moves along the list, one box at a time',
          cols: 6,
          cells: [
            { addr: '1', value: '17', label: 'done', tone: 'dim' },
            { addr: '2', value: '42', label: 'done', tone: 'dim' },
            { addr: '3', value: '8', label: 'doing now', tone: 'green', active: true },
            { addr: '4', value: '93', label: 'next' },
            { addr: '5', value: '5' },
            { addr: '6', value: '61' },
          ],
          legend: [
            { tone: 'dim', text: 'finished' },
            { tone: 'green', text: 'running' },
          ],
        },
      ],
    },
    {
      caption:
        'Some instructions say "draw this scene". The CPU sends them to the graphics card, which paints the picture and sends it to the screen. You see the game start.',
      show: { nodes: ['gpu', 'screen'], links: ['cpu-gpu', 'gpu-screen'] },
      highlight: ['gpu', 'screen'],
      labels: { ram: 'Game is ready', gpu: 'Painting the game', screen: 'Game!' },
      packets: [
        { path: ['cpu', 'gpu', 'screen'], color: '#c084fc', label: 'picture' },
      ],
    },
    {
      caption:
        'When you close the game or switch off, RAM is emptied but the game is still on the disk, ready for next time.',
      show: {},
      highlight: ['disk', 'ram'],
      labels: { disk: 'Game is still saved', ram: 'Empty' },
      cards: [
        {
          kind: 'viz',
          viz: 'memory',
          title: 'RAM after closing: emptied',
          cols: 4,
          cells: [
            { addr: '0', value: '', empty: true },
            { addr: '1', value: '', empty: true },
            { addr: '2', value: '', empty: true },
            { addr: '3', value: '', empty: true },
          ],
        },
        {
          kind: 'viz',
          viz: 'memory',
          title: 'Disk after closing: still there',
          cols: 4,
          cells: [
            { addr: 'notes.txt', value: '2 KB' },
            { addr: 'photo.jpg', value: '3 MB' },
            { addr: 'game', value: '5 GB', tone: 'amber', active: true },
            { addr: 'song.mp3', value: '8 MB' },
          ],
        },
      ],
    },
  ],

  quiz: [
    {
      type: 'order',
      q: 'Put the steps of starting a game in order.',
      items: [
        { id: 'a', label: 'The game is stored on the disk' },
        { id: 'b', label: 'It is copied into RAM' },
        { id: 'c', label: 'The CPU reads and follows its instructions' },
        { id: 'd', label: 'The graphics card paints the picture' },
        { id: 'e', label: 'You see the game on the screen' },
      ],
      answer: ['a', 'b', 'c', 'd', 'e'],
      why: 'Disk, RAM, CPU, graphics card, screen.',
    },
    {
      type: 'choice',
      q: 'Why is the game copied into RAM before the CPU runs it?',
      options: [
        'RAM is much faster to reach than the disk',
        'The disk cannot store games',
        'The screen needs it',
        'To delete it from the disk',
      ],
      answer: 0,
      why: 'The desk (RAM) is much quicker to reach than the bookshelf (disk), and the copy keeps the CPU from waiting.',
    },
    {
      type: 'match',
      q: 'Where is the game at each moment?',
      items: [
        { id: 'a', label: 'Before you double-click' },
        { id: 'b', label: 'While you are playing' },
        { id: 'c', label: 'After you switch off the computer' },
      ],
      targets: [
        { id: 'disk', label: 'Only on the disk' },
        { id: 'both', label: 'On the disk and a copy in RAM' },
      ],
      answer: { a: 'disk', b: 'both', c: 'disk' },
      why: 'The disk always keeps the game. RAM only holds a working copy while it runs.',
    },
  ],

  recap: [
    'Programs are files stored on the disk.',
    'When you start one, it is copied into RAM and the CPU follows its instructions, one after another, billions of times a second.',
    'The graphics card draws the picture and the screen shows it. When you switch off, RAM forgets but the disk remembers.',
  ],
});
