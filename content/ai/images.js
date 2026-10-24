(function () {
  const SKY = '#38bdf8';
  const SUN = '#facc15';
  const GRASS = '#22c55e';
  const picture = [
    'SSSSSSSS',
    'SSSSSYYS',
    'SSSSSYYS',
    'SSSSSSSS',
    'SSGGSSSS',
    'SGGGGSGG',
    'GGGGGGGG',
    'GGGGGGGG',
  ].map((r) => [...r].map((c) => ({ S: SKY, Y: SUN, G: GRASS })[c]));

  const NIGHT = '#1e1b4b';
  const MOON = '#e5e7eb';
  const ROCK = '#78716c';
  const pictureB = [
    'NNNNNNNN',
    'NMMNNNNN',
    'MMMMNNNN',
    'NMMNNNNN',
    'NNNNNNNN',
    'NNNNNNNN',
    'RRNRRRRR',
    'RRRRRRRR',
  ].map((r) => [...r].map((c) => ({ N: NIGHT, M: MOON, R: ROCK })[c]));

  const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const toHex = (v) => '#' + v.map((n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0')).join('');

  const rng = (seed) => () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const noiseField = (seed) => {
    const r = rng(seed);
    return picture.map((row) => row.map(() => [r() * 255, r() * 255, r() * 255]));
  };

  const mix = (pic, noise, t) => pic.map((row, y) => row.map((c, x) => toHex(rgb(c).map((v, i) => (1 - t) * v + t * noise[y][x][i]))));

  const noiseA = noiseField(7);
  const noiseB = noiseField(99);
  const levels = [0, 0.25, 0.5, 0.8, 1];
  const noisyA = levels.map((t) => mix(picture, noiseA, t));
  const pureA = noisyA[4];
  const pureB = mix(pictureB, noiseB, 1);

  const forward = [
    { grid: noisyA[0], label: 'Step 0', sub: 'clean picture', tone: 'green' },
    { grid: noisyA[1], label: 'Step 1', sub: 'a little noise', tone: 'cyan' },
    { grid: noisyA[2], label: 'Step 2', sub: 'half noise', tone: 'cyan' },
    { grid: noisyA[3], label: 'Step 3', sub: 'mostly noise', tone: 'amber' },
    { grid: noisyA[4], label: 'Step 4', sub: 'pure noise', tone: 'red' },
  ];

  const backward = [
    { grid: noisyA[4], label: 'Start', sub: 'pure random noise', tone: 'red' },
    { grid: noisyA[3], label: 'Denoise 1', sub: 'a rough shape', tone: 'amber' },
    { grid: noisyA[2], label: 'Denoise 2', sub: 'colours appear', tone: 'cyan' },
    { grid: noisyA[1], label: 'Denoise 3', sub: 'details', tone: 'cyan' },
    { grid: noisyA[0], label: 'Done', sub: 'a clean picture', tone: 'green' },
  ];

  TL.registerLesson({
    id: 'ai-images',
    title: 'How AI models generate images',
    hook: 'You type a sentence and a picture that never existed appears. Where does it come from? From noise.',
    cover: 'img/lessons/ai-images.png',

    steps: [
      {
        caption:
          'First, what is a picture to a computer? A grid of tiny coloured squares called pixels. Each pixel is described by three numbers: how much red, green and blue it has. So a picture is just a big table of numbers, and a model can work with numbers.',
        cards: [
          {
            kind: 'viz',
            viz: 'pixels',
            title: 'A tiny 8 by 8 picture: sky, sun and grass',
            grid: picture,
            size: 30,
            note: 'Real pictures have millions of pixels, but the idea is the same.',
          },
          {
            kind: 'viz',
            viz: 'pixels',
            title: 'Zoom in: six pixels and their numbers (red, green, blue)',
            grid: [
              [SKY, SUN, SUN],
              [SKY, SUN, SUN],
            ],
            values: [
              ['56,189,248', '250,204,21', '250,204,21'],
              ['56,189,248', '250,204,21', '250,204,21'],
            ],
            size: 64,
          },
        ],
        realLife: 'Each of the three numbers goes from 0 (none of that colour) to 255 (the most). Yellow is a lot of red and green and not much blue.',
      },
      {
        caption:
          'Here is the surprising idea. Take a clean picture and add a little random noise to every pixel. Then add more, and more. After enough steps nothing is left of the picture: only random coloured dots, like the static on an old TV. This direction is easy: anyone can make a picture noisy.',
        cards: [
          {
            kind: 'viz',
            viz: 'frames',
            title: 'Adding noise, step by step',
            frames: forward,
            size: 16,
            note: 'Each step mixes in more of a fixed random pattern.',
          },
        ],
        looksLike: {
          title: 'Pure noise: TV static',
          src: 'img/real/tv-static.png',
          alt: 'Photo of an old television showing static',
          caption: 'The last picture is like this: no shape, no colour pattern, just random dots.',
        },
        realLife: 'Real systems add a special kind of random noise, called Gaussian noise, in many more steps (often hundreds). We use 4 steps and plain random numbers to keep it readable.',
      },
      {
        caption:
          'The hard direction is the other way round: start from noise and get a picture back. That is the job of the model. We train it by playing the noise game in reverse. Take a real picture from the training set, add a random amount of noise, and ask the model: which part of this is noise? Then compare with the noise we really added.',
        cards: [
          [
            { t: 'Real picture + known noise', sub: 'we make it ourselves', tone: 'amber' },
            { op: '→' },
            { t: 'Model guesses the noise', sub: 'from the noisy picture', tone: 'cyan' },
            { op: '→' },
            { t: 'Compare with the real noise', sub: 'measure the error', tone: 'red' },
            { op: '→' },
            { t: 'Nudge the dials', sub: 'same loop as a language model', tone: 'green' },
          ],
        ],
        realLife: 'Training works just like the language-model loop in the training lesson: guess, compare, measure the error, nudge. Only the thing to guess is different. And we know the right answer because we added the noise ourselves.',
      },
      {
        caption:
          'The model is also told what the picture shows. Every training picture comes with a caption written by people, such as "a sun above green hills". The caption is turned into a list of numbers (like the word vectors you saw earlier) and given to the model along with the noisy picture. After millions of examples, the model has learned that this kind of noise-free picture goes with those words.',
        cards: [
          {
            kind: 'viz',
            viz: 'encode',
            title: 'Words become numbers',
            aLabel: 'Caption',
            bLabel: 'Numbers the model reads',
            arrow: 'text encoder',
            pairs: [
              { a: 'a sun above green hills', b: '0.8, -0.2, 0.5, 0.1, ...', tone: 'amber' },
              { a: 'a cat on the moon', b: '-0.3, 0.7, 0.1, 0.9, ...', tone: 'cyan' },
            ],
            note: 'Made-up numbers. Similar meanings get similar numbers.',
          },
        ],
        realLife: 'Training uses hundreds of millions or even billions of pictures with captions, mostly collected from the web. That is also why there are debates about whose pictures were used.',
      },
      {
        caption:
          'Now we can make a new picture. Start with pure random noise: no picture at all. Ask the model: given this prompt, what noise is in here? Remove a small part of it. Ask again on the slightly cleaner result. Repeat. Each round the picture gets a bit clearer, until it is clean.',
        cards: [
          {
            kind: 'viz',
            viz: 'frames',
            title: 'Generating: from noise to picture',
            frames: backward,
            size: 16,
            note: 'The prompt guides every round, so the picture that appears matches the words.',
          },
        ],
        realLife: 'Real models use roughly 20 to 50 rounds and a very large neural network. Some newer ones use fewer, so images appear faster.',
      },
      {
        caption:
          'Where does the variety come from? From the random start. The same prompt with a different random noise gives a different picture. The model does not look anything up or copy a stored image: it builds a new one out of the patterns it learned.',
        cards: [
          {
            kind: 'viz',
            viz: 'frames',
            title: 'Two random starts, two results',
            frames: [
              { grid: pureA, label: 'Start 1', sub: 'random noise', tone: 'red' },
              { grid: picture, label: 'Picture 1', sub: 'sun and hills', tone: 'green' },
              { grid: pureB, label: 'Start 2', sub: 'other noise', tone: 'red' },
              { grid: pictureB, label: 'Picture 2', sub: 'moon at night', tone: 'green' },
            ],
            arrow: false,
            size: 16,
            note: 'The two results differ here because the prompts differ too. With the same prompt and a different start you would get two different versions of the same idea.',
          },
        ],
        realLife: 'Many tools let you fix the random start (called the seed) to get the same picture again.',
      },
      {
        caption:
          'It is not magic, so it has limits. The model learned patterns of how things usually look, not how the world works. So it can draw hands with the wrong number of fingers, struggle with exact text, or mix up details when a prompt asks for many things at once. And because it makes realistic pictures of things that never happened, a generated picture can be used to mislead people.',
        cards: [
          {
            kind: 'viz',
            viz: 'table',
            title: 'Strengths and limits',
            columns: ['It is good at', 'It struggles with'],
            rows: [
              ['Style, lighting, mood', 'Hands and fingers'],
              ['Combining ideas (a cat on the moon)', 'Exact words and numbers in the picture'],
              ['Many variations quickly', 'Counting objects, careful layouts'],
              ['Realistic textures', 'Knowing whether the scene is physically possible'],
            ],
            tone: 'violet',
          },
        ],
        realLife: 'These limits are shrinking with each new model. Still, a realistic picture is no proof that something happened.',
      },
      {
        caption:
          'Compare with the language model from the first lesson. A text model writes one token at a time and adds each new token to the end. An image model works on the whole picture at once and sharpens all of it round by round. Both learned from huge amounts of examples, and both produce something new from patterns rather than copying.',
        cards: [
          {
            kind: 'viz',
            viz: 'table',
            title: 'Two ways to generate',
            columns: ['', 'Text model', 'Image model (diffusion)'],
            rows: [
              ['Starts from', 'your prompt', 'random noise plus your prompt'],
              ['Each step', 'adds one token to the end', 'removes some noise from the whole picture'],
              ['Learned by', 'guessing the next token', 'guessing the noise'],
              ['Random choice', 'which token to pick', 'the starting noise'],
            ],
            tone: 'cyan',
          },
        ],
        realLife: 'This lesson shows the idea behind diffusion models, the most common kind. Other designs exist, and some new systems mix both approaches, even making images token by token.',
      },
    ],

    quiz: [
      {
        type: 'choice',
        q: 'To a computer, what is a picture?',
        options: ['A grid of pixels, each described by numbers', 'A long sentence', 'A sound wave', 'A list of file names'],
        answer: 0,
        why: 'Each pixel has red, green and blue numbers. That is what the model works with.',
      },
      {
        type: 'choice',
        q: 'What does the image model start from when it generates a picture?',
        options: ['Random noise', 'A copy of a stored picture', 'A blank white page', 'A search result'],
        answer: 0,
        why: 'It starts from pure noise and removes it round by round, guided by the prompt.',
      },
      {
        type: 'order',
        q: 'Put these in the order they look as the model generates a picture.',
        items: [
          { id: 'a', label: 'Pure random noise' },
          { id: 'b', label: 'A rough shape appears' },
          { id: 'c', label: 'Colours and details appear' },
          { id: 'd', label: 'A clean picture' },
        ],
        answer: ['a', 'b', 'c', 'd'],
        why: 'Each round removes a little noise, so the picture sharpens step by step.',
      },
      {
        type: 'choice',
        q: 'How can we train the model to find noise? What gives us the right answer?',
        options: [
          'We add the noise ourselves, so we know exactly what it is',
          'A person marks the noise on every picture',
          'The model checks the answer on the internet',
          'There is no right answer',
        ],
        answer: 0,
        why: 'Adding noise is easy, so we always know the correct answer to compare with.',
      },
      {
        type: 'match',
        q: 'Match each part to its job.',
        items: [
          { id: 'caption', label: 'The caption or prompt' },
          { id: 'noise', label: 'The random starting noise' },
          { id: 'model', label: 'The trained model' },
        ],
        targets: [
          { id: 'a', label: 'Tells the model what the picture should show' },
          { id: 'b', label: 'Makes each result different' },
          { id: 'c', label: 'Removes a little noise in every round' },
        ],
        answer: { caption: 'a', noise: 'b', model: 'c' },
        why: 'The words steer, the noise gives variety, and the model does the denoising.',
      },
      {
        type: 'choice',
        q: 'Which of these is something image models often get wrong?',
        options: ['Fingers on hands and exact text in the picture', 'Making pictures from words', 'Using colours', 'Running on a computer'],
        answer: 0,
        why: 'The model learned how things usually look, not how they work, so small exact details are hard.',
      },
    ],

    recap: [
      'A picture is a grid of pixels, each made of numbers, so a model can work with it.',
      'Training: add noise to real pictures, ask the model to find the noise, compare, and nudge the dials.',
      'Generating: start from random noise and remove a little each round, guided by the prompt as numbers.',
      'A new random start gives a new picture. The model builds from learned patterns, so it can be wrong in small details.',
    ],
  });
})();
