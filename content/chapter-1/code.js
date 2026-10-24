(function () {
const PROGRAM = ['Add 3', 'Double', 'Add 1'];
const file = (active, note) => ({ file: 'program.txt', lines: PROGRAM, active, note });
const memory = (number, nextLine, opts = {}) => [
  {
    title: 'RAM (memory)',
    cells: PROGRAM.map((src, i) => ({ addr: i + 1, value: src, label: `line ${i + 1}`, active: opts.active === i + 1 })),
  },
  {
    title: 'CPU (working memory)',
    cells: [
      { addr: '', value: number, label: 'the number', tone: 'green', changed: !!opts.changed },
      { addr: '', value: nextLine, label: 'next line to read', tone: 'amber' },
    ],
  },
];

TL.registerLesson({
  id: 'ch1-code',
  title: 'What is code?',
  hook: 'A program is a list of instructions. Can you write one?',
  cover: 'img/lessons/ch1-code.png',
  scene: TL.computerScene,

  steps: [
    {
      caption:
        'The CPU is powerful but very simple-minded. It cannot guess what you mean. It only follows tiny, exact instructions, such as "add 3" or "double the number".',
      show: { nodes: ['cpu'] },
      highlight: ['cpu'],
      labels: { cpu: 'Number: 2' },
      memory: { title: 'CPU (working memory)', cells: [{ value: 2, label: 'the number', tone: 'green' }] },
    },
    {
      caption:
        'Code is a list of such instructions, written by a person. It is stored in RAM, line by line. Here is a three-line program: 1. Add 3. 2. Double. 3. Add 1.',
      show: { nodes: ['ram'], links: ['cpu-ram'] },
      highlight: ['ram'],
      labels: { cpu: 'Number: 2', ram: 'Program stored' },
      code: file(0, 'The file is saved on the disk. When you run it, a copy is loaded into RAM.'),
      memory: memory(2, 1),
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'Each instruction has one exact meaning',
          columns: ['Instruction', 'What the CPU does'],
          rows: [
            ['Add 3', 'number = number + 3'],
            ['Double', 'number = number x 2'],
            ['Add 1', 'number = number + 1'],
          ],
          tone: 'violet',
        },
      ],
    },
    {
      caption: 'The CPU starts with the number 2. It reads line 1, "Add 3". The number becomes 5.',
      show: {},
      highlight: ['cpu'],
      labels: { cpu: 'Number: 5', ram: 'Line 1: Add 3' },
      packets: [{ path: ['ram', 'cpu'], color: '#39ff88', label: 'Add 3' }],
      code: file(1, 'Fetch: the CPU reads line 1 from RAM. Execute: 2 + 3 = 5. It keeps the result.'),
      memory: memory(5, 2, { active: 1, changed: true }),
    },
    {
      caption: 'Line 2: "Double". The number becomes 10.',
      show: {},
      highlight: ['cpu'],
      labels: { cpu: 'Number: 10', ram: 'Line 2: Double' },
      packets: [{ path: ['ram', 'cpu'], color: '#39ff88', label: 'Double' }],
      code: file(2, 'Fetch: line 2 comes from RAM. Execute: 5 x 2 = 10. The old 5 is overwritten.'),
      memory: memory(10, 3, { active: 2, changed: true }),
    },
    {
      caption:
        'Line 3: "Add 1". The number becomes 11, and the program is finished. The order matters: if the CPU had doubled first, the answer would have been different.',
      show: {},
      highlight: ['cpu'],
      labels: { cpu: 'Number: 11', ram: 'Line 3: Add 1' },
      packets: [{ path: ['ram', 'cpu'], color: '#39ff88', label: 'Add 1' }],
      code: file(3, 'Fetch: line 3 comes from RAM. Execute: 10 + 1 = 11. No more lines, so the program ends.'),
      memory: memory(11, 'end', { active: 3, changed: true }),
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'The whole run, step by step',
          columns: ['Step', 'Instruction', 'Number afterwards'],
          rows: [
            ['start', '-', '2'],
            ['1', 'Add 3', '5'],
            ['2', 'Double', '10'],
            ['3', 'Add 1', '11'],
          ],
          highlight: 3,
          tone: 'green',
        },
        {
          kind: 'viz',
          viz: 'table',
          title: 'Same instructions, different order: Double, Add 3, Add 1',
          columns: ['Step', 'Instruction', 'Number afterwards'],
          rows: [
            ['start', '-', '2'],
            ['1', 'Double', '4'],
            ['2', 'Add 3', '7'],
            ['3', 'Add 1', '8'],
          ],
          highlight: 3,
          tone: 'red',
          note: 'The answer is 8, not 11. The order of the lines changes the result.',
        },
      ],
      realLife:
        'Real programs work the same way, only with millions of lines and instructions like "show this letter" or "play this sound". Programming languages such as Python are a way for people to write the list in a form they can read.',
    },
  ],

  sandbox: {
    type: 'code',
    intro: 'Click the blocks to build a program, then press Run.',
    blocks: [
      { id: 'add1', label: 'Add 1', run: (n) => n + 1 },
      { id: 'add3', label: 'Add 3', run: (n) => n + 3 },
      { id: 'dbl', label: 'Double', run: (n) => n * 2 },
      { id: 'sub2', label: 'Subtract 2', run: (n) => n - 2 },
    ],
    challenges: [
      { text: 'Make the CPU reach the target number.', start: 2, target: 5, max: 3 },
      { text: 'Reach the target. Hint: use Double twice.', start: 3, target: 12, max: 3 },
      { text: 'Reach the target. The order of the blocks matters!', start: 1, target: 10, max: 4 },
    ],
  },

  quiz: [
    {
      type: 'choice',
      q: 'What is a program?',
      options: [
        'A list of instructions that the CPU follows',
        'A kind of screen',
        'A cable between the parts',
        'A copy of the internet',
      ],
      answer: 0,
      why: 'Code is a list of instructions, and the CPU follows them one at a time.',
    },
    {
      type: 'choice',
      q: 'The CPU starts at 2 and follows: 1. Add 3, 2. Double. What number does it end with?',
      options: ['5', '7', '10', '12'],
      answer: 2,
      why: '2 + 3 = 5, then 5 doubled = 10.',
      hint: 'Follow the lines from the top, one at a time.',
    },
    {
      type: 'choice',
      q: 'The CPU starts at 2 and follows: 1. Double, 2. Add 3. What number does it end with?',
      options: ['5', '7', '10', '12'],
      answer: 1,
      why: '2 doubled = 4, then 4 + 3 = 7. Same blocks, different order, different answer!',
    },
    {
      type: 'order',
      q: 'Put the life of a program in order.',
      items: [
        { id: 'a', label: 'A person writes the code' },
        { id: 'b', label: 'The code is saved on the disk' },
        { id: 'c', label: 'It is loaded into RAM' },
        { id: 'd', label: 'The CPU follows the instructions' },
      ],
      answer: ['a', 'b', 'c', 'd'],
      why: 'Written, saved, loaded, run.',
    },
  ],

  recap: [
    'Code is a list of exact, simple instructions.',
    'The CPU follows them one at a time, from the top, and the order matters.',
    'Every app and game is just a very long list of instructions like this.',
  ],
});
})();
