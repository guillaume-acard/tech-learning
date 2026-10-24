TL.registerLesson({
  id: 'ch1-hardware-software',
  title: 'Hardware and software',
  hook: 'You can kick a keyboard, but you cannot kick a game. What is the difference between hardware and software?',
  cover: 'img/lessons/ch1-hardware-software.png',

  steps: [
    {
      caption:
        'A computer is made of two kinds of things. Hardware is everything you can touch: the screen, the keyboard, the chips inside, the cables. If you could drop it on your foot, it is hardware.',
      cards: [
        [
          { t: 'Screen', sub: 'you can touch it', tone: 'green' },
          { t: 'Keyboard', sub: 'you can touch it', tone: 'green' },
          { t: 'CPU chip', sub: 'you can touch it', tone: 'green' },
          { t: 'Cable', sub: 'you can touch it', tone: 'green' },
        ],
      ],
    },
    {
      caption:
        'Software is the instructions that tell the hardware what to do: a game, a web browser, a music player, the operating system. You cannot touch it. It is information, stored as 0s and 1s.',
      cards: [
        [
          { t: 'A game', sub: 'instructions', tone: 'violet' },
          { t: 'A browser', sub: 'instructions', tone: 'violet' },
          { t: 'Your photos', sub: 'information', tone: 'violet' },
          { t: 'The operating system', sub: 'instructions', tone: 'violet' },
        ],
        {
          kind: 'viz',
          viz: 'bits',
          title: 'What software looks like inside',
          rows: [
            { bits: '01001000', label: 'byte 1', sub: 'of a file', tone: 'violet' },
            { bits: '01101001', label: 'byte 2', sub: 'of a file', tone: 'violet' },
            { bits: '00100001', label: 'byte 3', sub: 'of a file', tone: 'violet' },
          ],
          note: 'A program or a photo is a long list of bytes (8 bits each). What the bytes mean depends on the software that reads them.',
        },
      ],
      realLife:
        'Software is also called programs or apps. Even your photos and documents are not hardware: they are data, which software knows how to read.',
    },
    {
      caption:
        'Think of a game console. The console, the controller and the TV are the hardware. The game is the software: it decides what you see and what the buttons do. Put in a racing game and you drive a car. Swap it for a football game and the very same console lets you play football.',
      cards: [
        [
          { t: 'Game console', sub: 'hardware', tone: 'green' },
          { op: '+' },
          { t: 'A game', sub: 'software', tone: 'violet' },
          { op: '→' },
          { t: 'What you play', sub: 'what you get', tone: 'amber' },
        ],
      ],
      realLife: 'Your phone works the same way: it is one piece of hardware, and each app you install gives it a new job, such as a camera, a map or a game.',
    },
    {
      caption:
        'That is why one computer can do thousands of different jobs. The hardware does not change. Install a different program and the same chips now edit video, play a game or run a chat. Without software, the hardware has nothing to do.',
      cards: [
        [
          { t: 'Same hardware', sub: 'nothing changes', tone: 'green' },
          { op: '+' },
          { t: 'Different software', sub: 'new job each time', tone: 'violet' },
        ],
      ],
    },
    {
      caption:
        'And software without hardware is just an idea. A program has to be stored on a disk, loaded into memory, and run by the CPU. They need each other: hardware is the body, software is what it does.',
      cards: [
        [
          { t: 'Hardware', sub: 'does the work', tone: 'green' },
          { op: '↔' },
          { t: 'Software', sub: 'says what work', tone: 'violet' },
        ],
        {
          kind: 'viz',
          viz: 'layers',
          title: 'Software runs on hardware',
          arrows: true,
          layers: [
            { t: 'Apps and games', sub: 'software you choose', tone: 'violet' },
            { t: 'Operating system', sub: 'software that manages the parts', tone: 'violet' },
            { t: 'Firmware', sub: 'software inside a chip', tone: 'amber' },
            { t: 'Hardware', sub: 'CPU, RAM, disk, screen...', tone: 'green' },
          ],
        },
      ],
      realLife: 'Notice the amber layer in the middle: firmware. It sits right between software and hardware, and the next steps are about it.',
    },
    {
      caption:
        'Firmware is software that lives inside the hardware itself. It is a small program stored in a chip on the device, so it is there even when the power is off. Its job is basic: wake the device up and control its parts. Almost every electronic thing has some.',
      cards: [
        [
          { t: 'Computer', sub: 'startup program on the motherboard', tone: 'amber' },
          { t: 'Router', sub: 'the program that routes packets', tone: 'amber' },
          { t: 'TV remote', sub: 'reads buttons, sends signals', tone: 'amber' },
          { t: 'Washing machine', sub: 'runs the wash cycles', tone: 'amber' },
        ],
      ],
      realLife:
        'The chip is usually flash memory: it keeps its content without power, but it can be rewritten when the maker sends a firmware update.',
    },
    {
      caption:
        'So how is firmware different from the software you install? Both are instructions. The difference is where they live, who they are for, and how often they change. Firmware belongs to one device and is made by its maker. Software belongs to you: you choose it, add it and remove it.',
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'Firmware compared to software',
          columns: ['', 'Firmware', 'Software (apps)'],
          rows: [
            ['Where it lives', 'In a chip on the device', 'On the disk or SSD'],
            ['Its job', 'Start and control one device', 'Whatever you want to do'],
            ['Who chooses it', 'The device maker', 'You'],
            ['How often it changes', 'Rarely, with a special update', 'Often, install or remove any time'],
            ['When it runs', 'First, as soon as power comes on', 'After the operating system has started'],
          ],
        },
      ],
      realLife:
        'Firmware is software in the full sense of the word: it is also instructions stored as 0s and 1s. The line between them is blurry, which is why it is called a middle ground.',
    },
    {
      caption:
        'Here is why firmware matters. A computer cannot run the operating system until something has loaded it, and the operating system is stored on the disk. The firmware is the first program that runs: it checks the hardware, finds the operating system on the disk, and hands over to it.',
      cards: [
        {
          kind: 'viz',
          viz: 'sequence',
          title: 'What happens when you press the power button',
          actors: ['You', 'Firmware', 'Disk', 'Operating system'],
          messages: [
            { from: 0, to: 1, text: 'Press power', tone: 'cyan', note: 'The chip wakes up and runs' },
            { from: 1, to: 2, text: 'Find the operating system', tone: 'amber' },
            { from: 2, to: 3, text: 'Load it into memory', tone: 'violet', note: 'Firmware hands over' },
            { from: 3, to: 0, text: 'Desktop appears', tone: 'green', note: 'Now apps can run' },
          ],
        },
      ],
      realLife:
        'On a PC this startup firmware is called BIOS or UEFI. If a firmware update is interrupted halfway, the device can stop working completely. That is called "bricking" it.',
    },
    {
      caption:
        'Here is the plan for this chapter. First the hardware: what the parts are, how tiny switches make 0s and 1s, and how a key press travels through the machine. Then the software: how a program starts, what code is, and how code becomes numbers the CPU understands.',
      cards: [
        [
          { t: 'Part A: Hardware', sub: 'parts, switches, a key press', tone: 'green' },
          { op: '→' },
          { t: 'Part B: Software', sub: 'programs, code, machine code', tone: 'violet' },
        ],
      ],
    },
  ],

  quiz: [
    {
      type: 'match',
      q: 'Is it hardware or software?',
      items: [
        { id: 'a', label: 'The keyboard' },
        { id: 'b', label: 'A web browser' },
        { id: 'c', label: 'The CPU chip' },
        { id: 'd', label: 'A video game' },
      ],
      targets: [
        { id: 'hw', label: 'Hardware' },
        { id: 'sw', label: 'Software' },
      ],
      answer: { a: 'hw', b: 'sw', c: 'hw', d: 'sw' },
      why: 'Hardware is what you can touch. Software is the instructions that run on it.',
    },
    {
      type: 'choice',
      q: 'Which sentence is true?',
      options: [
        'Installing a new program changes what the same hardware can do',
        'Software is a part inside the computer that you can hold',
        'Hardware can work without any software telling it what to do',
        'Software is the same thing as the screen',
      ],
      answer: 0,
      why: 'The hardware stays the same. The software decides the job.',
    },
    {
      type: 'choice',
      q: 'In the game console example, what is the software?',
      options: ['The game', 'The controller', 'The console box', 'The TV'],
      answer: 0,
      why: 'The game decides what happens on screen. The console, controller and TV are all hardware.',
    },
    {
      type: 'choice',
      q: 'Your photos are stored on your computer. What are they?',
      options: ['Data, which is not hardware', 'Hardware, because they are on a disk', 'A cable', 'A CPU'],
      answer: 0,
      why: 'The disk is hardware, but the photos on it are information that software reads.',
    },
    {
      type: 'choice',
      q: 'What is firmware?',
      options: [
        'Software stored in a chip inside a device, which starts and controls it',
        'A cable that connects two devices',
        'A game that you install from the internet',
        'Another word for the screen',
      ],
      answer: 0,
      why: 'Firmware is software that lives in the hardware itself, so the device can start even with nothing installed.',
    },
    {
      type: 'match',
      q: 'Where does each one live?',
      items: [
        { id: 'a', label: 'The startup program of the computer' },
        { id: 'b', label: 'A video game you downloaded' },
        { id: 'c', label: 'The program inside a TV remote' },
        { id: 'd', label: 'A web browser' },
      ],
      targets: [
        { id: 'fw', label: 'Firmware (in a chip on the device)' },
        { id: 'sw', label: 'Software (stored on the disk)' },
      ],
      answer: { a: 'fw', b: 'sw', c: 'fw', d: 'sw' },
      why: 'Firmware belongs to the device and is put there by its maker. Apps are chosen and installed by you.',
    },
    {
      type: 'order',
      q: 'Put the startup in order.',
      items: [
        { id: 'a', label: 'You press the power button' },
        { id: 'b', label: 'The firmware wakes up and checks the hardware' },
        { id: 'c', label: 'The firmware loads the operating system from the disk' },
        { id: 'd', label: 'You open an app' },
      ],
      answer: ['a', 'b', 'c', 'd'],
      why: 'Firmware runs first because nothing else is loaded yet. Apps come last, after the operating system.',
    },
  ],

  recap: [
    'Hardware is the physical parts you can touch. Software is the instructions and data that tell it what to do.',
    'The same hardware can do many jobs, just by running different software.',
    'They need each other: hardware does the work, software says which work.',
    'Firmware is software stored in a chip on the device. It runs first at power on, then the operating system and your apps take over.',
  ],
});
