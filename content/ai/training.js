TL.registerLesson({
  id: 'ai-training',
  title: 'How AI models are trained',
  hook: 'A new AI model starts out knowing nothing. How does it end up writing essays and answering questions?',
  cover: 'img/lessons/ai-training.png',

  steps: [
    {
      caption:
        'Inside a model there are billions of numbers, called parameters. They work like billions of tiny dials. The settings of all the dials decide which answer the model gives. Training is the job of finding good settings. Before training, the dials are set at random.',
      cards: [
        {
          kind: 'viz',
          viz: 'vector',
          title: 'A few of the dials, before and after training',
          items: [
            { label: 'before', values: [0.12, -0.7, 0.33, 0.05, -0.41, 0.9], tone: 'dim' },
            { label: 'after', values: [0.52, -0.1, 0.78, -0.35, 0.2, 0.15], tone: 'green' },
          ],
          more: true,
          note: 'Made-up values. A real model has billions of these, and training changes almost all of them a little.',
        },
      ],
      realLife: 'The word "parameter" just means a number the model is allowed to change while it learns. Nobody sets them by hand: that would take forever.',
    },
    {
      caption:
        'A model with random dials writes nonsense, because it has no idea which words belong together. Look at what the same start gives before and after training. (The first answer is typical of what an untrained model does.)',
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'The same start, two models',
          columns: ['Text so far', 'Untrained model', 'Trained model'],
          rows: [
            ['The cat sat on the', 'banana quantum seven', 'mat'],
            ['Paris is the capital of', 'purple swim the', 'France'],
          ],
          highlight: [0, 1],
          tone: 'green',
        },
      ],
    },
    {
      caption:
        'To train a model we need examples with the right answers. For a language model we get them for free. Take any text, hide the next word, and the hidden word is the right answer. One short sentence already gives many practice questions, and the internet holds an enormous amount of text.',
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'One sentence, five practice questions',
          subtitle: 'The sentence: "The cat sat on the mat."',
          columns: ['Model sees', 'Hidden right answer'],
          rows: [
            ['The', 'cat'],
            ['The cat', 'sat'],
            ['The cat sat', 'on'],
            ['The cat sat on', 'the'],
            ['The cat sat on the', 'mat'],
          ],
          highlight: 4,
          tone: 'amber',
          note: 'Nobody had to write labels by hand. The text labels itself.',
        },
      ],
      realLife: 'This idea is called self-supervised learning. It is why models could be trained on so much text: no person had to mark the answers.',
    },
    {
      caption:
        'Now the training loop. Show the model a text, let it guess, compare with the real answer, and measure how wrong it was. Then nudge the dials a tiny bit so that next time the right answer is a little more likely. Repeat. This is the whole recipe.',
      cards: [
        [
          { t: '1. Guess', sub: 'give a chance to every token', tone: 'cyan' },
          { op: '→' },
          { t: '2. Compare', sub: 'look at the real next word', tone: 'amber' },
          { op: '→' },
          { t: '3. Measure the error', sub: 'how wrong was it?', tone: 'red' },
          { op: '→' },
          { t: '4. Nudge the dials', sub: 'a tiny step, to do better', tone: 'green' },
          { op: '↺' },
        ],
      ],
      realLife: 'The measure of "how wrong" is called the loss. Training tries to make the loss go down. The method that works out which way to nudge each dial is called backpropagation.',
    },
    {
      caption:
        'Here is what one example looks like over time. The text is "The cat sat on the" and the right answer is "mat". Early on the model gives "mat" a tiny chance. After many nudges the chance grows. The model never memorised this sentence: the same dials are shared by every sentence, so each nudge improves many answers at once.',
      cards: [
        {
          kind: 'viz',
          viz: 'bars',
          title: 'Start of training',
          items: [
            { label: 'mat', value: 1, text: '1%', tone: 'green' },
            { label: 'banana', value: 1, text: '1%', tone: 'dim' },
            { label: 'everything else', value: 98, text: '98%', tone: 'dim' },
          ],
          max: 100,
        },
        {
          kind: 'viz',
          viz: 'bars',
          title: 'After some training',
          items: [
            { label: 'mat', value: 20, text: '20%', tone: 'green' },
            { label: 'floor', value: 15, text: '15%', tone: 'cyan' },
            { label: 'everything else', value: 65, text: '65%', tone: 'dim' },
          ],
          max: 100,
        },
        {
          kind: 'viz',
          viz: 'bars',
          title: 'After a lot of training',
          items: [
            { label: 'mat', value: 45, text: '45%', tone: 'green' },
            { label: 'floor', value: 20, text: '20%', tone: 'cyan' },
            { label: 'sofa', value: 10, text: '10%', tone: 'cyan' },
            { label: 'everything else', value: 25, text: '25%', tone: 'dim' },
          ],
          max: 100,
          note: 'Made-up numbers. "mat" never reaches 100% because several words fit: the model learns likely words, not one fixed answer.',
        },
      ],
    },
    {
      caption:
        'Each nudge is tiny, so training needs an enormous number of them. Big models learn from trillions of tokens of text, and billions of nudges are made along the way. That takes thousands of special chips, called GPUs, working together for weeks or months.',
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'What it takes to train a large model (rough orders of magnitude)',
          columns: ['Ingredient', 'Rough size'],
          rows: [
            ['Text it reads', 'trillions of tokens: books, websites, code'],
            ['Dials (parameters)', 'billions to hundreds of billions'],
            ['Chips', 'thousands of GPUs in a data centre'],
            ['Time', 'weeks to months'],
            ['Cost', 'millions of dollars or more'],
          ],
          tone: 'violet',
          note: 'Companies do not publish exact numbers, and they change fast.',
        },
      ],
      looksLike: {
        title: 'A GPU, the chip that does the training',
        src: 'img/real/gpu.png',
        alt: 'Photo of a graphics card used for AI',
        caption: 'GPUs are good at doing a huge number of simple sums at the same time, which is exactly what nudging billions of dials needs.',
      },
      realLife: 'This is why only a few companies train the biggest models from scratch. Most people use a finished model instead.',
    },
    {
      caption:
        'A raw model that has only played the guessing game can finish text, but it is not yet a good assistant. So training comes in stages. First it reads a huge amount of text (pre-training). Then it studies examples of good questions and answers (fine-tuning). Finally people compare its answers and mark which are better, and it is nudged towards the answers people prefer.',
      cards: [
        {
          kind: 'viz',
          viz: 'layers',
          title: 'The stages, from first to last',
          arrows: true,
          layers: [
            { t: '1. Pre-training', sub: 'reads huge amounts of text, learns language and facts', tone: 'cyan' },
            { t: '2. Fine-tuning', sub: 'learns from examples of helpful answers', tone: 'amber' },
            { t: '3. Learning from feedback', sub: 'people rank answers, the model moves towards the better ones', tone: 'green' },
          ],
        },
      ],
      realLife: 'The third stage is often called reinforcement learning from human feedback. It is one reason chatbots are polite and try to refuse harmful requests.',
    },
    {
      caption:
        'Training and using are two different moments. Training changes the dials, once, in a giant data centre. Using a model, which is called inference, only reads the dials. When you chat, the model does not learn from you: it reads your messages as part of the text so far and then predicts the next token, as you saw earlier.',
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'Training versus using',
          columns: ['', 'Training', 'Using a model'],
          rows: [
            ['The dials', 'change a little at each step', 'stay fixed'],
            ['Where', 'a data centre with thousands of chips', 'a data centre or sometimes a laptop or phone'],
            ['How often', 'once per version, for weeks', 'every time someone asks'],
            ['Learns from your chat?', 'not directly', 'no'],
          ],
          tone: 'cyan',
        },
      ],
      realLife: 'Companies may later use conversations to train a new version, depending on their rules and your settings. But the model you are talking to does not change while you talk.',
    },
    {
      caption:
        'A model can only know what was in its training text, and only up to the day training stopped. This is called the knowledge cutoff. It can also copy the mistakes and unfair views that appear in that text. And a model can seem to know a fact only because it saw it often. That is why you saw earlier that AI can be wrong, and why tools like search and documents (the RAG lesson) are used to give it fresh facts.',
      cards: [
        [
          { t: 'Training text', sub: 'stops at a date', tone: 'amber' },
          { op: '→' },
          { t: 'Trained model', sub: 'knows only what it saw', tone: 'violet' },
          { op: '→' },
          { t: 'Needs help', sub: 'search, documents, tools', tone: 'green' },
        ],
      ],
    },
    {
      caption:
        'One more check. If we only ever tested the model on the text it practised with, we could not tell whether it had really learned or just memorised. So part of the text is kept hidden during training, and the model is tested on it afterwards. Good results on text it has never seen mean it learned patterns, not just a copy.',
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'Two piles of text',
          columns: ['Pile', 'Used for', 'What a good score means'],
          rows: [
            ['Training text', 'practice: dials are nudged', 'it can learn'],
            ['Held-back text', 'the exam: dials are not nudged', 'it learned patterns, not a copy'],
          ],
          highlight: 1,
          tone: 'green',
        },
      ],
      realLife: 'Learning a lesson by heart and understanding it are different, for people as well as for models. Testing on new questions is how we tell them apart.',
    },
  ],

  quiz: [
    {
      type: 'choice',
      q: 'What are the "parameters" of a model?',
      options: ['Numbers inside the model that training adjusts', 'The questions people ask it', 'The websites it was trained on', 'The chips it runs on'],
      answer: 0,
      why: 'Parameters are the billions of dials. Training is the work of finding good settings for them.',
    },
    {
      type: 'choice',
      q: 'Where does the "right answer" come from when training a language model on plain text?',
      options: [
        'The next word in the text itself, which is hidden for a moment',
        'A person writes it for every example',
        'The model invents it',
        'A search engine supplies it',
      ],
      answer: 0,
      why: 'Hide the next word of any text and it becomes a practice question with a known answer.',
    },
    {
      type: 'order',
      q: 'Put one step of the training loop in order.',
      items: [
        { id: 'a', label: 'The model guesses the next token' },
        { id: 'b', label: 'The guess is compared with the real next token' },
        { id: 'c', label: 'The error is measured' },
        { id: 'd', label: 'The dials are nudged a little' },
      ],
      answer: ['a', 'b', 'c', 'd'],
      why: 'Guess, compare, measure, nudge. Then repeat with the next example, billions of times.',
    },
    {
      type: 'match',
      q: 'Match each stage to what it does.',
      items: [
        { id: 'pre', label: 'Pre-training' },
        { id: 'fine', label: 'Fine-tuning' },
        { id: 'feed', label: 'Learning from feedback' },
      ],
      targets: [
        { id: 'a', label: 'Reads huge amounts of text to learn language and facts' },
        { id: 'b', label: 'Studies examples of helpful questions and answers' },
        { id: 'c', label: 'Moves towards the answers people prefer' },
      ],
      answer: { pre: 'a', fine: 'b', feed: 'c' },
      why: 'Each stage shapes the model a bit more: first knowledge, then helpful behaviour, then what people like.',
    },
    {
      type: 'choice',
      q: 'You chat with a trained model for an hour. What happens to its dials?',
      options: ['Nothing: they stay fixed while it answers', 'They change after every message', 'They reset to random', 'They copy your computer’s settings'],
      answer: 0,
      why: 'Using a model only reads the dials. Training is a separate, earlier process.',
    },
    {
      type: 'choice',
      q: 'Why does a model sometimes not know about last week’s news?',
      options: ['Its training text stopped at a certain date', 'It refuses to read the news', 'The internet was switched off', 'News is not made of words'],
      answer: 0,
      why: 'This is the knowledge cutoff. Search or documents can give the model fresh facts without retraining it.',
    },
  ],

  recap: [
    'A model is billions of numbers (dials). Training finds settings that make its guesses good.',
    'Training loop: guess the next token, compare with the real one, measure the error, nudge the dials, and repeat billions of times.',
    'Text gives its own answers, so huge amounts of it can be used. Then fine-tuning and human feedback make the model a helpful assistant.',
    'Using a model does not train it. What it knows stops at the training date, which is one reason it can be wrong or out of date.',
  ],
});
