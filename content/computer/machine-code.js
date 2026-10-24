TL.registerLesson({
  id: 'computer-machine-code',
  title: 'From code to machine code',
  hook: 'How does a CPU run your code if it only understands numbers?',
  cover: 'img/lessons/computer-machine-code.png',
  scene: TL.computerScene,

  steps: [
    {
      caption:
        'When you write code, you write text for people. It is saved on the disk like any other file: each letter is stored as a number.',
      show: { nodes: ['disk'] },
      highlight: ['disk'],
      labels: { disk: 'Source code (text)' },
      cards: [
        { kind: 'viz', viz: 'code', file: 'total.c', lines: ['int total = 2 + 3;'], note: 'Source code: text that a person can read.' },
        {
          kind: 'viz',
          viz: 'encode',
          title: 'On the disk, even the text is stored as numbers',
          aLabel: 'Letters in the file',
          bLabel: 'Bytes saved',
          arrow: 'ASCII table',
          pairs: [
            { a: 'i', b: '105', tone: 'cyan' },
            { a: 'n', b: '110', tone: 'cyan' },
            { a: 't', b: '116', tone: 'cyan' },
            { a: 'space', b: '32', tone: 'dim' },
            { a: 't', b: '116', tone: 'cyan' },
          ],
          note: 'Only the first few characters are shown. These numbers are just the letters. The CPU cannot run them as instructions yet.',
        },
      ],
    },
    {
      caption:
        'For many languages (like C, C++ or Rust), a compiler turns that text into machine code: a long list of numbers the CPU can follow.',
      show: { nodes: ['cpu'], links: ['disk-cpu'] },
      highlight: ['cpu', 'disk-cpu'],
      labels: { disk: 'Machine code (bytes)', cpu: 'Running the compiler' },
      packets: [{ path: ['disk', 'cpu'], color: '#39ff88', label: 'translate' }],
      cards: [
        [
          { t: 'Source code', sub: 'text for people', tone: 'cyan' },
          { op: '->' },
          { t: 'Compiler', sub: 'a translator program', tone: 'amber' },
          { op: '->' },
          { t: 'Machine code', sub: 'numbers for the CPU', tone: 'green' },
        ],
      ],
      realLife:
        'A compiler is just another program. The CPU runs it like any other app, and it produces a new file (the machine code program).',
    },
    {
      caption:
        'Machine code is a sequence of bit patterns. The CPU follows its instruction-set rules to decode each pattern as an action, such as add, move data, or jump to another instruction.',
      show: { nodes: ['cpu'] },
      highlight: ['cpu'],
      labels: { cpu: 'Reads instruction bits' },
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'A made-up instruction set: bit pattern to action',
          columns: ['Bit pattern', 'Action'],
          rows: [
            ['0001', 'ADD'],
            ['0011', 'MULTIPLY'],
            ['0101', 'SUBTRACT'],
          ],
          tone: 'violet',
          note: 'The CPU hardware is built so each pattern triggers the matching action. Real instruction sets have hundreds of these.',
        },
      ],
    },
    {
      caption:
        'Here is a made-up example for a tiny teaching CPU: 0001 could mean ADD, and 0010 could mean the number 2. Together, 0001 0010 means the instruction ADD 2. The compiler turns the human-written instruction into this binary pattern, and the CPU decodes it using its instruction set.',
      show: {},
      highlight: ['cpu'],
      labels: { cpu: 'Decodes bit patterns' },
      cards: [
        [{ t: '0001', sub: 'ADD action', tone: 'violet' }, { t: '0010', sub: 'number 2', tone: 'amber' }, { op: '->' }, { t: 'ADD 2', sub: 'toy instruction', tone: 'green' }],
        {
          kind: 'viz',
          viz: 'bits',
          title: 'One toy instruction is one byte (8 bits)',
          rows: [{ bits: '00010010', group: 4, label: 'ADD 2', sub: 'first 4 bits: action, last 4 bits: number', tone: 'green' }],
        },
        {
          kind: 'viz',
          viz: 'encode',
          title: 'Instructions from the code lesson, in the toy format',
          aLabel: 'Instruction',
          bLabel: 'Machine code',
          arrow: 'compiler',
          pairs: [
            { a: 'Add 3', b: '0001 0011', tone: 'green' },
            { a: 'Double', b: '0011 0010', tone: 'green' },
            { a: 'Add 1', b: '0001 0001', tone: 'green' },
          ],
          note: 'Double is MULTIPLY by 2 here. Still made up, but the idea is real: instructions become bit patterns.',
        },
      ],
      realLife:
        'This encoding is invented for the example. Real CPUs have their own instruction sets and more detailed formats; the exact bit patterns are different.',
    },
    {
      caption:
        'When you press Run, the computer loads the machine code from disk into RAM, because RAM is much faster to read than the disk.',
      show: { nodes: ['ram'], links: ['cpu-ram', 'disk-cpu'] },
      highlight: ['ram'],
      labels: { disk: 'Program on disk', ram: 'Program in RAM' },
      packets: [{ path: ['disk', 'cpu', 'ram'], color: '#ffa31a', label: 'load' }],
      cards: [
        {
          kind: 'viz',
          viz: 'memory',
          title: 'The program in RAM: one instruction per box',
          cols: 3,
          cells: [
            { addr: '0', value: '00010011', label: 'Add 3' },
            { addr: '1', value: '00110010', label: 'Double' },
            { addr: '2', value: '00010001', label: 'Add 1' },
          ],
          note: 'Same toy format as before. The label under each box is only for you; RAM holds the bits.',
        },
      ],
    },
    {
      caption:
        'Then the CPU repeats a loop: fetch the next instruction from RAM, do it, then fetch the next one.',
      show: {},
      highlight: ['cpu', 'cpu-ram'],
      labels: { ram: 'Next instruction', cpu: 'Do it' },
      packets: [{ path: ['ram', 'cpu'], color: '#39ff88', label: 'next' }],
      cards: [
        {
          kind: 'viz',
          viz: 'sequence',
          title: 'Fetch, decode, do (the toy CPU)',
          actors: ['CPU', 'RAM'],
          messages: [
            { from: 0, to: 1, text: 'give me box 0', tone: 'amber' },
            { from: 1, to: 0, text: '0001 0011', tone: 'green' },
            { from: 0, to: 0, text: 'decode: ADD 3, then do it', tone: 'violet' },
            { from: 0, to: 1, text: 'give me box 1', tone: 'amber' },
          ],
          note: 'Fetch the instruction, decode its bits, do it, then fetch the next one.',
        },
      ],
    },
    {
      caption:
        'Different CPU families use different machine code. That is why a program built for one type of CPU may not run on another.',
      show: {},
      highlight: ['cpu'],
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'The same bits can mean different things (made-up CPUs)',
          columns: ['Bits', 'CPU family X reads it as', 'CPU family Y reads it as'],
          rows: [['0001 0010', 'ADD 2', 'MOVE 2'], ['0011 0010', 'MULTIPLY by 2', 'JUMP to box 2']],
          tone: 'red',
        },
      ],
      realLife:
        'Some languages (like Python or JavaScript) often run inside an interpreter, which is a program that reads your code and runs it step by step. Many systems also use JIT compilation, which compiles parts while the program runs.',
    },
  ],

  quiz: [
    {
      type: 'choice',
      q: 'What is machine code?',
      options: [
        'A list of 0s and 1s (bytes) that the CPU can follow',
        'A picture drawn by the graphics card',
        'A Wi-Fi password',
        'A cable inside the computer',
      ],
      answer: 0,
      why: 'The CPU does not understand human words. It follows numbers (bits and bytes) called machine code.',
    },
    {
      type: 'choice',
      q: 'What does a compiler do?',
      options: [
        'Turns source code (text) into machine code',
        'Turns the screen on',
        'Stores your photos',
        'Connects your computer to Wi-Fi',
      ],
      answer: 0,
      why: 'A compiler translates human-written code into instructions the CPU can run.',
    },
    {
      type: 'choice',
      q: 'In the made-up example, what does 0001 0010 mean?',
      options: ['ADD 2', 'Move the screen', 'Save a photo', 'Connect to Wi-Fi'],
      answer: 0,
      why: 'In this toy format, 0001 means the ADD action and 0010 means the value 2. Real CPUs use different encodings.',
    },
    {
      type: 'choice',
      q: 'Before the CPU can run a program, where is it usually loaded?',
      options: ['RAM', 'The keyboard', 'The screen', 'The mouse'],
      answer: 0,
      why: 'Programs are loaded into RAM because it is fast. The CPU reads the instructions from RAM while it runs.',
    },
    {
      type: 'choice',
      q: 'Why might a program compiled for one CPU not run on a different CPU?',
      options: [
        'They can use different machine code instructions',
        'The disk is too big',
        'Wi-Fi is too slow',
        'The mouse is unplugged',
      ],
      answer: 0,
      why: 'Different CPU families can have different instruction sets, so the same bits can mean different things.',
    },
  ],

  recap: [
    'Source code is text for humans, saved on the disk.',
    'A compiler can translate source code into binary machine instructions, which the CPU decodes using its instruction set.',
    'The CPU runs by fetching instructions from RAM and doing them one by one.',
  ],
});
