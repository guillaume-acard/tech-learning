window.TL = window.TL || {};

TL.lessons = {};
TL.registerLesson = function (lesson) {
  TL.lessons[lesson.id] = lesson;
};

// Topics hold chapters, chapters hold lessons (directly in `lessons`, or grouped in `parts`).
TL.topics = [
  {
    id: 'computer-systems',
    title: 'Computer systems',
    cover: 'img/topics/computer-systems.png',
    blurb: 'How a computer works inside, how computers talk to each other over networks, and how AI runs on them.',
    chapters: [
      {
        id: 'computer',
        title: 'How a computer works',
        cover: 'img/chapters/computer.png',
        blurb: 'CPU, memory, disk and screen: what each part does and how they work together.',
        parts: [
          { title: 'Part A: Hardware', lessons: ['computer-hardware-software', 'computer-parts', 'computer-keypress'] },
          { title: 'Part B: Software', lessons: ['computer-run-program', 'computer-code', 'computer-machine-code'] },
        ],
      },
      {
        id: 'network',
        title: 'How a network and the internet work',
        cover: 'img/chapters/network.png',
        blurb: 'Follow your own home devices out to the internet and back, safely.',
        parts: [
          { title: 'Part A: Your home network', lessons: ['network-router-basics', 'network-tv-and-games', 'network-mobile', 'network-addresses', 'network-break-it'] },
          { title: 'Part B: From your home to a website', lessons: ['network-url', 'network-dns', 'network-packets'] },
          { title: 'Part C: Browsers, servers and cookies', lessons: ['network-google', 'network-browser'] },
          { title: 'Part D: Staying secure', lessons: ['network-spies', 'network-public-keys', 'network-primes', 'network-https'] },
          { title: 'Finale', lessons: ['network-history', 'network-capstone'] },
        ],
      },
      {
        id: 'ai',
        title: 'How AI works',
        cover: 'img/chapters/ai.png',
        blurb: 'The different types of AI, how language and image models work and are trained, and how agents use tools.',
        parts: [
          { title: 'Part A: Types of AI', lessons: ['ai-types', 'ai-genetic', 'ai-llm'] },
          { title: 'Part B: How AI models work', lessons: ['ai-training', 'ai-wrong', 'ai-images'] },
          { title: 'Part C: Using AI: prompts, agents and tools', lessons: ['ai-prompt', 'ai-agent', 'ai-tools', 'ai-rag'] },
        ],
      },
    ],
  },
  {
    id: 'electronics',
    title: 'Electronics',
    cover: 'img/topics/electronics.png',
    blurb: 'What electricity is, and the small parts that every electronic device is built from.',
    chapters: [
      {
        id: 'electricity',
        title: 'Basic electrical concepts',
        cover: 'img/chapters/electricity.png',
        blurb: 'Volts, amps and watts, then how circuits work: loops, switches, series and parallel wiring.',
        parts: [
          { title: 'Part A: Volts, amps and watts', lessons: ['electricity-voltage', 'electricity-current', 'electricity-power'] },
          { title: 'Part B: Circuit concepts', lessons: ['electricity-circuit', 'electricity-series-parallel'] },
        ],
      },
      {
        id: 'components',
        title: 'Basic electronic components',
        cover: 'img/chapters/components.png',
        blurb: 'From simple to complex: LEDs, resistors, potentiometers and capacitors, the transistor, an infrared sensor, motors and servos, and the microcontroller that runs a robot.',
        parts: [
          { title: 'Part A: Simple parts', lessons: ['components-led', 'components-resistor', 'components-potentiometer', 'components-capacitor'] },
          { title: 'Part B: The switch', lessons: ['components-transistors'] },
          { title: 'Part C: Sensors', lessons: ['components-ir-distance'] },
          { title: 'Part D: Motors', lessons: ['components-dc-motor', 'components-servo'] },
          { title: 'Part E: The brain', lessons: ['components-microcontroller'] },
        ],
      },
    ],
  },
];

TL.chapters = TL.topics.flatMap((t) => t.chapters.map((ch) => Object.assign(ch, { topic: t })));
TL.chapters.forEach((ch) => {
  if (ch.parts) ch.lessons = ch.parts.flatMap((p) => p.lessons);
});
