window.TL = window.TL || {};

TL.lessons = {};
TL.registerLesson = function (lesson) {
  TL.lessons[lesson.id] = lesson;
};

TL.chapters = [
  {
    id: 'ch1',
    title: 'Chapter 1: How a computer works',
    cover: 'img/chapters/ch1.png',
    blurb: 'CPU, memory, disk and screen: what each part does and how they work together.',
    parts: [
      { title: 'Part A: Hardware', lessons: ['ch1-hardware-software', 'ch1-parts', 'ch1-transistors', 'ch1-keypress'] },
      { title: 'Part B: Software', lessons: ['ch1-run-program', 'ch1-code', 'ch1-machine-code'] },
    ],
  },
  {
    id: 'ch2',
    title: 'Chapter 2: How a network and the internet work',
    cover: 'img/chapters/ch2.png',
    blurb: 'Follow your own home devices out to the internet and back, safely.',
    parts: [
      { title: 'Part A: Your home network', lessons: ['ch2-router-basics', 'ch2-tv-and-games', 'ch2-mobile', 'ch2-addresses', 'ch2-break-it'] },
      { title: 'Part B: From your home to a website', lessons: ['ch2-url', 'ch2-dns', 'ch2-packets'] },
      { title: 'Part C: Browsers, servers and cookies', lessons: ['ch2-google', 'ch2-browser'] },
      { title: 'Part D: Staying secure', lessons: ['ch2-spies', 'ch2-public-keys', 'ch2-primes', 'ch2-https'] },
      { title: 'Finale', lessons: ['ch2-history', 'ch2-capstone'] },
    ],
  },
  {
    id: 'ch3',
    title: 'Chapter 3: How AI works',
    cover: 'img/chapters/ch3.png',
    blurb: 'How AI models predict words, how they are trained, how they make images, and how agents use tools.',
    lessons: ['ch3-llm', 'ch3-training', 'ch3-wrong', 'ch3-prompt', 'ch3-agent', 'ch3-tools', 'ch3-rag', 'ch3-images'],
  },
];

TL.chapters.forEach((ch) => {
  if (ch.parts) ch.lessons = ch.parts.flatMap((p) => p.lessons);
});
