TL.registerLesson({
  id: 'ch3-llm',
  title: 'What is an LLM? A next-word machine',
  hook: 'Chatbots seem to think. Underneath, they do one simple thing, over and over: guess the next word.',
  cover: 'img/lessons/ch3-llm.png',

  steps: [
    {
      caption:
        'Your phone suggests the next word while you type. You write "I am going to" and it offers "the", "be" or "bed". A Large Language Model, or LLM, is the same idea, but trained on a gigantic amount of text, so its guesses are far better.',
      cards: [
        [
          { t: 'I am going to', sub: 'what you typed', tone: 'cyan' },
          { op: '→' },
          { t: 'the', sub: 'suggestion', tone: 'green' },
          { t: 'be', sub: 'suggestion', tone: 'green' },
          { t: 'bed', sub: 'suggestion', tone: 'green' },
        ],
      ],
    },
    {
      caption:
        'A model does not read letters or whole words. It reads tokens: small pieces of text. Short common words are one token, longer words are cut into pieces. In English, a token is about three quarters of a word on average.',
      cards: [
        [
          { t: 'Learn', sub: 'token 1', tone: 'amber' },
          { t: 'ing', sub: 'token 2', tone: 'amber' },
          { t: ' is', sub: 'token 3', tone: 'amber' },
          { t: ' fun', sub: 'token 4', tone: 'amber' },
        ],
        {
          kind: 'viz',
          viz: 'encode',
          title: 'Each token is stored as a number',
          aLabel: 'Token',
          bLabel: 'Token number',
          arrow: 'the model’s token list',
          pairs: [
            { a: 'Learn', b: '4521', tone: 'amber' },
            { a: 'ing', b: '278', tone: 'amber' },
            { a: ' is', b: '318', tone: 'amber' },
            { a: ' fun', b: '1257', tone: 'amber' },
          ],
          note: 'The numbers here are made up. Every model has its own list.',
        },
        {
          kind: 'viz',
          viz: 'vector',
          title: 'Then each number becomes a list of numbers that captures meaning',
          items: [
            { label: 'cat', values: [0.8, -0.2, 0.1, 0.6], tone: 'cyan' },
            { label: 'dog', values: [0.7, -0.1, 0.2, 0.5], tone: 'cyan' },
            { label: 'car', values: [-0.6, 0.7, 0.4, -0.3], tone: 'violet' },
          ],
          more: true,
          note: 'Made-up values. Words with similar meanings get similar lists (cat and dog), unrelated ones differ (car). Real lists have hundreds or thousands of numbers.',
        },
      ],
      realLife:
        'The exact cut depends on each model. A computer can only work with numbers, so every token is also given a number, and the model works with those numbers.',
    },
    {
      caption:
        'For the text so far, the model gives a score to every possible next token, and the scores add up to 100%. Take "The sky is": "blue" gets the biggest share, because that is what people wrote most often. The other options are less likely but not impossible. (These percentages are made up to show the idea.)',
      cards: [
        [{ t: 'The sky is', sub: 'the text so far', tone: 'cyan' }],
        {
          kind: 'viz',
          viz: 'bars',
          title: 'Chance of each possible next token',
          items: [
            { label: 'blue', value: 60, text: '60%', tone: 'green' },
            { label: 'clear', value: 15, text: '15%', tone: 'cyan' },
            { label: 'falling', value: 1, text: '1%', tone: 'dim' },
            { label: 'cheese', value: 0.01, text: '0.01%', tone: 'dim' },
            { label: 'thousands of others', value: 23.99, text: '23.99% together', tone: 'dim' },
          ],
          max: 100,
          note: 'All the chances add up to 100%.',
        },
      ],
    },
    {
      caption:
        'Now choose one token, add it to the text, and ask again with the longer text. Sometimes the model takes the top one, sometimes it rolls weighted dice, so a likely word usually wins but not always. That is why asking the same question twice can give two different answers.',
      cards: [
        [{ t: 'The sky is', sub: 'start', tone: 'cyan' }, { op: '+' }, { t: 'blue', sub: 'picked', tone: 'green' }, { op: '→' }, { t: 'The sky is blue', sub: 'ask again', tone: 'cyan' }],
        [{ t: 'The sky is blue', sub: 'now', tone: 'cyan' }, { op: '+' }, { t: 'today', sub: 'picked', tone: 'green' }, { op: '→' }, { t: 'The sky is blue today', sub: 'and again…', tone: 'cyan' }],
      ],
    },
    {
      caption:
        'A whole answer, even a long essay, is built like this: one token at a time, each one chosen from a list of likely tokens, using everything written before it. There is no hidden list of ready-made answers.',
      cards: [
        [
          { t: 'Your question', sub: 'text so far', tone: 'cyan' },
          { op: '→' },
          { t: 'LLM', sub: 'scores every token', tone: 'violet' },
          { op: '→' },
          { t: 'one token', sub: 'chosen', tone: 'green' },
          { op: '↺', },
          { t: 'repeat', sub: 'until it ends', tone: 'amber' },
        ],
      ],
    },
    {
      caption:
        'Where do the scores come from? From training. The model reads a huge amount of text (books, websites, code) and plays this guessing game billions of times. Each time it guesses wrong, millions of tiny numbers inside it are nudged, so its guesses get better. At the end, those numbers are the model.',
      cards: [
        [
          { t: 'Lots of text', sub: 'books, websites, code', tone: 'amber' },
          { op: '→' },
          { t: 'Guess, check, nudge', sub: 'billions of times', tone: 'violet' },
          { op: '→' },
          { t: 'A trained model', sub: 'billions of numbers', tone: 'green' },
        ],
      ],
      realLife:
        'The numbers are called parameters, and big models have hundreds of billions. A trained model looks at the whole text so far, not just the last word, which is why its sentences stay on topic. Our toy below is much simpler: it only looks at the last one or two words.',
    },
    {
      caption: 'Your turn! The next screen has a tiny model with made-up scores. Build sentences by picking each next word, then roll the dice to let the model choose for you.',
      cards: [
        [
          { t: 'Pick', sub: 'click a word', tone: 'green' },
          { t: 'Dice', sub: 'let it choose', tone: 'amber' },
          { t: 'END', sub: 'sentence done', tone: 'cyan' },
        ],
      ],
    },
  ],

  sandbox: {
    type: 'nextword',
    intro: 'This toy model only looks at the last word or two. Pick a word, or let the model choose.',
    maxWords: 14,
    starts: ['The', 'Once upon a', 'My robot'],
    fallback: [['.', 62], ['and', 23], ['too', 15]],
    model: {
      'upon a':[['time', 88], ['hill', 5], ['planet', 4], ['pizza', 3]],
      time: [['there', 60], ['in', 40]],
      there: [['was', 55], ['lived', 45]],
      was: [['a', 40], ['very', 35], ['once', 25]],
      lived: [['in', 60], ['with', 40]],
      with: [['the', 50], ['a', 50]],
      in: [['a', 50], ['the', 50]],
      'in the': [['forest', 45], ['garden', 30], ['moon', 25]],
      the: [['cat', 32], ['dog', 28], ['robot', 20], ['moon', 10], ['pizza', 10]],
      a: [['cat', 28], ['dog', 24], ['robot', 24], ['pizza', 14], ['moon', 10]],
      my: [['cat', 30], ['dog', 25], ['robot', 30], ['pizza', 15]],
      cat: [['sat', 36], ['jumped', 26], ['ate', 24], ['saw', 14]],
      dog: [['ran', 34], ['barked', 28], ['ate', 24], ['saw', 14]],
      robot: [['learned', 28], ['said', 26], ['saw', 24], ['ate', 22]],
      moon: [['is', 40], ['was', 35], ['shone', 25]],
      pizza: [['is', 40], ['was', 35], ['vanished', 25]],
      sat: [['on', 60], ['near', 25], ['there', 15]],
      ate: [['the', 45], ['a', 35], ['pizza', 20]],
      jumped: [['over', 55], ['on', 25], ['up', 20]],
      ran: [['to', 40], ['away', 40], ['home', 20]],
      barked: [['at', 55], ['loudly', 30], ['.', 15]],
      saw: [['the', 50], ['a', 40], ['it', 10]],
      said: [['hello', 45], ['nothing', 30], ['.', 25]],
      learned: [['to', 60], ['fast', 25], ['.', 15]],
      shone: [['brightly', 70], ['.', 30]],
      is: [['very', 35], ['a', 30], ['here', 20], ['.', 15]],
      vanished: [['.', 60], ['quickly', 40]],
      on: [['the', 60], ['a', 40]],
      near: [['the', 60], ['a', 40]],
      over: [['the', 60], ['a', 40]],
      at: [['the', 50], ['a', 30], ['night', 20]],
      to: [['the', 60], ['a', 25], ['school', 15]],
      away: [['.', 70], ['quickly', 30]],
      home: [['.', 80], ['and', 20]],
      hello: [['.', 60], ['there', 25], ['robot', 15]],
      quickly: [['.', 80], ['and', 20]],
      loudly: [['.', 80], ['and', 20]],
      brightly: [['.', 85], ['and', 15]],
      and: [['then', 45], ['the', 30], ['a', 25]],
      then: [['the', 40], ['a', 30], ['it', 30]],
      too: [['.', 85], ['and', 15]],
    },
  },

  quiz: [
    {
      type: 'choice',
      q: 'What does a language model do, at its core?',
      options: ['It predicts a likely next token, again and again', 'It looks up the answer in a giant list of answers', 'It searches the internet for every question', 'It understands the world exactly like a person'],
      answer: 0,
      why: 'Every answer is built token by token, each one chosen from a list of likely next tokens.',
    },
    {
      type: 'choice',
      q: 'Why can you get two different answers to the same question?',
      options: ['The model sometimes picks a less likely word, like rolling weighted dice', 'The model forgets the question', 'The internet changes every second', 'One of the answers is always a mistake'],
      answer: 0,
      why: 'The top word usually wins but not always, so the text can branch in different directions.',
    },
    {
      type: 'match',
      q: 'Match each word to what it means.',
      items: [
        { id: 'tok', label: 'Token' },
        { id: 'train', label: 'Training' },
        { id: 'prob', label: 'Probability' },
      ],
      targets: [
        { id: 'a', label: 'A small piece of text the model reads and writes' },
        { id: 'b', label: 'Reading a huge amount of text to get better at guessing' },
        { id: 'c', label: 'How likely each next token is' },
      ],
      answer: { tok: 'a', train: 'b', prob: 'c' },
      why: 'Text is cut into tokens, training tunes the numbers, and the model gives each token a probability.',
    },
    {
      type: 'order',
      q: 'Put the steps of writing one answer in order.',
      items: [
        { id: 'a', label: 'The model reads the text so far' },
        { id: 'b', label: 'It gives every possible next token a probability' },
        { id: 'c', label: 'One token is chosen' },
        { id: 'd', label: 'The token is added and the loop repeats' },
      ],
      answer: ['a', 'b', 'c', 'd'],
      why: 'Read, score, choose, add, repeat until the answer is finished.',
    },
  ],

  recap: [
    'An LLM predicts the next token (a small piece of text), over and over, to write an answer.',
    'It gives every token a probability, then picks one, so answers can differ each time.',
    'Training on huge amounts of text is how it learned the probabilities.',
  ],
});
