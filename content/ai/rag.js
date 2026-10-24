(function () {
  // Four tiny chunks with made-up 3D vectors. Real vectors have hundreds of numbers, but 3 can be drawn.
  // Here each axis is given a simple name so the numbers mean something: [computers, network, how-to], -1 to 1.
  const CHUNKS = [
    { id: 'c1', file: 'wifi-guide.txt', short: 'Wi-Fi: restart the router', tone: 'cyan', v: [0.5, 0.8, 0.7], text: 'If the Wi-Fi is slow, restart the router: unplug it for 30 seconds, then plug it back in.' },
    { id: 'c2', file: 'wifi-guide.txt', short: 'Wi-Fi: router position', tone: 'cyan', v: [0.4, 0.6, 0.5], text: 'Put the router in the open, away from thick walls and metal, for a stronger signal.' },
    { id: 'c3', file: 'computer-notes.txt', short: 'CPU and RAM', tone: 'amber', v: [0.9, -0.5, -0.4], text: 'The CPU follows instructions. RAM holds what the CPU is using right now.' },
    { id: 'c4', file: 'recipes.txt', short: 'Pizza dough', tone: 'dim', v: [-0.8, -0.7, 0.4], text: 'Pizza dough: mix flour, water, yeast and salt, then let it rest for an hour.' },
  ];
  const QUERY = { x: 0.5, y: 0.7, z: 0.6, label: 'Question: why is my Wi-Fi slow?', tone: 'red' };
  const QUESTION = 'Why is my Wi-Fi slow?';

  const IDEAS = ['computers', 'network', 'how-to'];
  // Which of the three ideas a chunk is clearly about (value above 0.3), shown as a tag.
  const about = (c) => IDEAS.filter((_, i) => c.v[i] > 0.3).join(' + ') || 'none of these';
  const fmt = (v) => `[ ${v.map((n) => n.toFixed(2)).join(', ')} ]`;
  const dist = (c) => Math.hypot(c.v[0] - QUERY.x, c.v[1] - QUERY.y, c.v[2] - QUERY.z);
  const points = CHUNKS.map((c) => ({ id: c.id, x: c.v[0], y: c.v[1], z: c.v[2], label: c.short, tone: c.tone }));
  const HITS = CHUNKS.filter((c) => dist(c) < 0.5).map((c) => c.id);
  const top = CHUNKS.filter((c) => HITS.includes(c.id));
  const nth = (c) => CHUNKS.indexOf(c) + 1;

  const AXES = [
    { name: 'About computers', low: 'no', high: 'yes' },
    { name: 'About the network', low: 'no', high: 'yes' },
    { name: 'A how-to', low: 'no', high: 'yes' },
  ];
  const space = (extra) => ({
    kind: 'viz',
    viz: 'vectors3d',
    height: 360,
    points,
    axes: AXES,
    ...extra,
  });

  // Toy example: animals described by three ideas we can name.
  const ANIMAL_AXES = [
    { name: 'Size', low: 'small', high: 'big' },
    { name: 'Legs', low: 'none', high: 'many' },
    { name: 'Fur', low: 'none', high: 'furry' },
  ];
  const ANIMALS = [
    { id: 'cat', label: 'Cat', v: [-0.4, 0.2, 0.8], tone: 'cyan' },
    { id: 'dog', label: 'Dog', v: [0.0, 0.2, 0.7], tone: 'cyan' },
    { id: 'horse', label: 'Horse', v: [0.7, 0.2, 0.5], tone: 'amber' },
    { id: 'ant', label: 'Ant', v: [-0.9, 0.6, -0.8], tone: 'dim' },
    { id: 'snake', label: 'Snake', v: [0.1, -0.9, -0.9], tone: 'dim' },
  ];
  const ANIMAL_QUERY = { x: -0.3, y: 0.2, z: 0.8, label: 'Small, furry, 4 legs?', tone: 'red' };
  const animalPoints = ANIMALS.map((a) => ({ id: a.id, x: a.v[0], y: a.v[1], z: a.v[2], label: a.label, tone: a.tone }));
  const animalDist = (a) => Math.hypot(a.v[0] - ANIMAL_QUERY.x, a.v[1] - ANIMAL_QUERY.y, a.v[2] - ANIMAL_QUERY.z);
  const animalHits = ANIMALS.filter((a) => animalDist(a) < 0.5).map((a) => a.id);
  const animalSpace = (extra) => ({ kind: 'viz', viz: 'vectors3d', height: 360, points: animalPoints, axes: ANIMAL_AXES, ...extra });

  TL.registerLesson({
    id: 'ai-rag',
    title: 'Search by meaning: vectors and RAG',
    hook: 'How can a chatbot answer using your own documents?',
    cover: 'img/lessons/ai-rag.png',
    scene: TL.ragScene,

    steps: [
      {
        caption:
          'A plain LLM writes using what it learned during training. But it does not automatically know your private notes, your company wiki, or what changed yesterday.',
        show: { nodes: ['llm'] },
        highlight: ['llm'],
        realLife:
          'Some systems connect the LLM to tools. One common tool pattern is RAG: Retrieval-Augmented Generation.',
      },
      {
        caption:
          'RAG starts by preparing your documents. A whole document is too long to search precisely and too long to hand to an LLM, so the RAG app first cuts each document into chunks: a few sentences each, like index cards cut from a book.',
        show: { nodes: ['docs', 'app'], links: ['docs-app'] },
        highlight: ['docs', 'app'],
        packets: [{ path: ['docs', 'app'], color: '#ffa31a', label: 'documents' }],
        cards: [
          {
            kind: 'blocks',
            title: 'Step 1: cut the documents into chunks',
            subtitle: 'Three files became four chunks (a real library has thousands). The tag on each shows what it is about, using three ideas we will measure soon: computers, network, how-to.',
            items: CHUNKS.map((c) => ({ group: c.file, label: `Chunk ${nth(c)}`, text: c.text, tag: about(c), tone: c.tone })),
          },
        ],
        realLife:
          'Real chunks are often 100 to 500 words, and they usually overlap a little so a sentence is not cut in half. Chunk size is a trade-off: too big and the search gets vague, too small and the chunk loses its context.',
      },
      {
        caption:
          'Before the next step, a toy example. Imagine describing any animal with just three numbers, each measuring one idea: how big it is, how many legs it has, how furry it is. Each idea is an axis. An animal becomes a point in 3D space, and similar animals land close together: cat and dog sit side by side, the ant and the snake are far away.',
        show: {},
        cards: [
          animalSpace({
            title: 'Toy example: animals as points',
            subtitle: 'Three named axes: Size, Legs, Fur. Further along an axis means more of that idea.',
            note: 'Drag to rotate. The numbers below are the positions of the dots.',
          }),
          {
            kind: 'viz',
            viz: 'table',
            columns: ['Animal', 'Size', 'Legs', 'Fur'],
            rows: ANIMALS.map((a) => [a.label, ...a.v.map((n) => n.toFixed(1))]),
            tone: 'cyan',
          },
        ],
        realLife: 'A list of numbers like [-0.4, 0.2, 0.8] is called a vector. It is just the coordinates of the point, one number per axis.',
      },
      {
        caption:
          'Searching works the same way. Turn the question "a small, furry animal with four legs" into numbers on the same three axes: that is a new point. The animals closest to it are the best answers: cat first, then dog. Horse, ant and snake are far away. This is searching by meaning instead of by exact words.',
        show: {},
        cards: [
          animalSpace({
            title: 'Toy example: the question is a point too',
            subtitle: 'Small (Size low), four legs (Legs middle), furry (Fur high). Lines show the distance to each animal.',
            query: ANIMAL_QUERY,
            distances: true,
            radius: 0.5,
            hits: animalHits,
            note: 'Green = the closest animals. Smaller distance = more similar.',
          }),
        ],
      },
      {
        caption:
          'Now the same idea for text. The app gives each chunk to an embedding model. The model reads the chunk and turns its meaning into a vector: a list of numbers, one per axis, like size, legs and fur for animals. Every chunk gets its own vector.',
        show: { nodes: ['embed'], links: ['app-embed'] },
        highlight: ['embed'],
        packets: [
          { path: ['app', 'embed'], color: '#ffa31a', label: 'chunk' },
          { path: ['embed', 'app'], color: '#c084fc', label: 'vector' },
        ],
        cards: [
          {
            kind: 'blocks',
            title: 'Step 2: read each chunk and turn it into a vector',
            subtitle: 'Here a vector is just 3 numbers (computers, network, how-to) so we can draw it in the next step.',
            items: CHUNKS.map((c) => ({ label: `Chunk ${nth(c)}`, text: c.text, tag: about(c), sub: `${fmt(c.v)}  <- computers, network, how-to`, tone: c.tone })),
          },
        ],
        realLife:
          'In this lesson we named the three axes to make them easy to read. A real embedding model has hundreds or thousands of axes, and nobody names them: the model learned from huge amounts of text which directions are useful, so a single axis is usually a blend of ideas that has no simple label.',
      },
      {
        caption:
          'The vectors are saved in the vector index, each one next to the text it came from. Each vector is a point in 3D space, using the three axes: how much the chunk is about computers, about the network, and how much it is a how-to. The two Wi-Fi chunks land together (network, how-to), away from the CPU note (computers, but not network) and the pizza recipe (not computers at all).',
        show: { nodes: ['vdb'], links: ['embed-vdb'] },
        highlight: ['vdb'],
        packets: [{ path: ['embed', 'vdb'], color: '#c084fc', label: 'vector + text' }],
        cards: [
          space({
            title: 'Step 3: the vector index (3D view)',
            subtitle: 'Each dot is a chunk. The 3 numbers of its vector are its position.',
            note: 'Like the animals: each axis is one idea. Real models have far more axes, without tidy names.',
          }),
        ],
      },
      {
        caption:
          'Now someone asks a question. The app sends it to the same embedding model, which turns it into a vector too. That is a new point (the red diamond) landing in the same space. It must be the same model, or the numbers would not mean the same thing.',
        show: { nodes: ['you'], links: ['you-app'] },
        highlight: ['you', 'app', 'embed'],
        packets: [
          { path: ['you', 'app'], color: '#38e8ff', label: 'question' },
          { path: ['app', 'embed'], color: '#38e8ff', label: 'question' },
          { path: ['embed', 'app'], color: '#c084fc', label: 'vector' },
        ],
        cards: [
          space({
            title: 'Step 4: the question becomes a point',
            subtitle: `"${QUESTION}" ${fmt([QUERY.x, QUERY.y, QUERY.z])}`,
            query: QUERY,
            note: 'The red diamond lands near the Wi-Fi chunks. Rotate to check.',
          }),
        ],
      },
      {
        caption:
          'The vector index measures the distance from the question point to every chunk point. The smallest distances win. Here the two Wi-Fi chunks are the closest, inside the green sphere, and the CPU and pizza chunks are far away. We keep the top 2.',
        show: { links: ['app-vdb'] },
        highlight: ['app', 'vdb'],
        packets: [
          { path: ['app', 'vdb'], color: '#38e8ff', label: 'question vector' },
          { path: ['vdb', 'app'], color: '#39ff88', label: 'closest IDs' },
        ],
        cards: [
          space({
            title: 'Step 5: find the nearest chunks',
            subtitle: 'The numbers on the lines are distances. Smaller means closer in meaning.',
            query: QUERY,
            distances: true,
            radius: 0.5,
            hits: HITS,
            note: 'Green = the top 2 chunks that will be used.',
          }),
        ],
        realLife:
          'Many systems compare the angle between two vectors instead of the straight-line distance. That is called cosine similarity. The idea is the same: a better match gets a better score. A vector index uses clever shortcuts so it can do this among millions of chunks in a blink.',
      },
      {
        caption:
          'The index only hands back IDs and scores, not text. So the app uses those IDs to pull out the original text of the winning chunks. These pieces are the extracts. The CPU and pizza chunks stay on the shelf.',
        show: {},
        highlight: ['app', 'vdb'],
        packets: [{ path: ['vdb', 'app'], color: '#39ff88', label: 'chunk text' }],
        cards: [
          {
            kind: 'blocks',
            title: 'Step 6: extract the best chunks',
            subtitle: 'The app now holds the real sentences, not just numbers.',
            items: top.map((c) => ({
              group: c.file,
              label: `Chunk ${nth(c)}`,
              text: c.text,
              tag: `distance ${dist(c).toFixed(2)}`,
              tone: 'green',
            })),
          },
        ],
      },
      {
        caption:
          'The app builds one prompt for the LLM: an instruction, the extracts pasted in as context, and the original question. This is the "augmented" in RAG: the LLM gets exactly the pages it needs, even though it has never seen your files.',
        show: { nodes: ['llm'], links: ['app-llm'] },
        highlight: ['app', 'llm'],
        packets: [{ path: ['app', 'llm'], color: '#ffa31a', label: 'prompt' }],
        cards: [
          {
            kind: 'blocks',
            title: 'Step 7: the prompt sent to the LLM',
            subtitle: 'Everything below is plain text in one message.',
            items: [
              { label: 'Instruction', text: 'Answer using only the context below. If the answer is not there, say you do not know.', tone: 'dim' },
              { label: 'Context (the extracts)', text: top.map((c, i) => `[${i + 1}] ${c.text}`).join('\n'), tone: 'green' },
              { label: 'Question', text: QUESTION, tone: 'cyan' },
            ],
          },
        ],
        realLife:
          'An LLM can only read a limited amount of text at once (its context window). That is another reason RAG sends a few good chunks instead of the whole library.',
      },
      {
        caption:
          'The LLM writes the answer using that context, so it can be accurate about your documents, and the app can show which chunks it came from.',
        show: {},
        highlight: ['llm', 'you'],
        packets: [
          { path: ['llm', 'app', 'you'], color: '#39ff88', label: 'answer' },
        ],
        cards: [
          {
            kind: 'blocks',
            title: 'Step 8: the answer',
            items: [
              {
                label: 'LLM answer',
                text: 'Your Wi-Fi may be slow because the router needs a restart or is badly placed. Unplug it for 30 seconds, and move it into the open, away from thick walls and metal. [1][2]',
                tag: 'sources: wifi-guide.txt',
                tone: 'violet',
              },
            ],
          },
        ],
        realLife:
          'RAG does not guarantee truth. It reduces guessing by giving the model the right context, but the model can still misunderstand or mix things up. Good systems cite sources and keep chunks short.',
      },
    ],

    quiz: [
      {
        type: 'choice',
        q: 'Why are documents cut into chunks before they are turned into vectors?',
        options: [
          'Small chunks can be searched precisely and fit into the LLM prompt',
          'To make the files smaller on the disk',
          'Because an LLM can only read one letter at a time',
          'To hide private information',
        ],
        answer: 0,
        why: 'A whole document is too vague to match and too long for a prompt. A chunk of a few sentences is just the right size.',
      },
      {
        type: 'choice',
        q: 'In RAG, what does vectorization (embeddings) do?',
        options: [
          'Turns text into numbers so you can search by meaning',
          'Turns pictures into Wi-Fi',
          'Encrypts the hard drive',
          'Makes the CPU faster',
        ],
        answer: 0,
        why: 'Embeddings turn text into vectors (numbers). Similar meanings map to vectors that are close together.',
      },
      {
        type: 'choice',
        q: 'What does a vector database help you do?',
        options: [
          'Find the nearest vectors quickly',
          'Predict the next word in a sentence',
          'Replace RAM',
          'Turn 0s and 1s into letters',
        ],
        answer: 0,
        why: 'A vector database is optimized to find the closest matches (nearest neighbors) among many vectors.',
      },
      {
        type: 'choice',
        q: 'In the 3D picture, the question point is 0.33 away from one chunk and 1.10 away from another. Which chunk is the better match?',
        options: [
          'The one at 0.33, because a smaller distance means more similar meaning',
          'The one at 1.10, because bigger numbers are better',
          'They are equally good',
          'Neither: distance has nothing to do with meaning',
        ],
        answer: 0,
        why: 'Close points mean similar meaning, so the smallest distances are the best matches.',
      },
      {
        type: 'choice',
        q: 'The vector index says chunks 1 and 2 are the closest. What does the app do next?',
        options: [
          'Fetches the original text of those chunks and adds it to the prompt',
          'Sends only the numbers of the vectors to the LLM',
          'Deletes all the other chunks',
          'Asks the embedding model to write the answer',
        ],
        answer: 0,
        why: 'The LLM reads text, not vectors. The app pulls out the matching extracts and pastes them into the prompt with the question.',
      },
      {
        type: 'choice',
        q: 'In RAG, what is sent to the LLM?',
        options: [
          'Your question plus the retrieved chunks',
          'Only the retrieved chunks, without your question',
          'Only your question, without any documents',
          'A screenshot of the app',
        ],
        answer: 0,
        why: 'The app builds a prompt that includes the question and the most relevant chunks, then asks the LLM to answer using that context.',
      },
      {
        type: 'choice',
        q: 'What does "close" mean in vector search?',
        options: [
          'The vectors are similar in meaning',
          'The files are in the same folder',
          'The internet is turned off',
          'The CPU is hot',
        ],
        answer: 0,
        why: 'Vector search compares meaning. If two vectors are close, the texts are likely about similar topics.',
      },
    ],

    recap: [
      'RAG first cuts documents into chunks, then an embedding model turns each chunk into a vector (numbers) that is stored in a vector index.',
      'The question becomes a vector too, and the index finds the chunks whose vectors are nearest: closest means most similar in meaning.',
      'The app extracts the text of those chunks and pastes it into the prompt with the question, so the LLM can answer using your documents.',
    ],
  });
})();
