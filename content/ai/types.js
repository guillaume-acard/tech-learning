TL.registerLesson({
  id: 'ai-types',
  title: 'The different types of AI',
  hook: 'A chess program, a spam filter, a robot that learns to walk and a chatbot are all called AI. Are they the same thing?',
  cover: 'img/lessons/ai-types.png',

  steps: [
    {
      caption:
        'Artificial intelligence, or AI, is not one technique. It is a label for any program that does something we would normally expect a human mind to do: recognise a face, play a game, translate a sentence. There are many ways to build such a program, and they work very differently inside.',
      cards: [
        [
          { t: 'Rules', sub: 'written by people', tone: 'cyan' },
          { t: 'Learning from data', sub: 'machine learning', tone: 'green' },
          { t: 'Evolution', sub: 'genetic algorithms', tone: 'amber' },
          { t: 'Trial and reward', sub: 'reinforcement learning', tone: 'violet' },
        ],
      ],
      realLife: 'The families overlap. Real systems often mix several of them.',
    },
    {
      caption:
        'The oldest kind is rule-based AI. People write down the knowledge as "if this, then that" rules, and the program follows them. A tax helper or an early medical expert system works like this. It is easy to explain and check, but someone has to write every rule, and it fails on anything the rules did not foresee.',
      cards: [
        {
          kind: 'viz',
          viz: 'code',
          file: 'rules',
          lines: [
            'if temperature > 38 and cough:',
            { t: '    say "possible flu"', tone: 'amber', note: 'a rule a doctor wrote by hand' },
            'else if temperature > 38:',
            '    say "possible fever"',
          ],
        },
      ],
    },
    {
      caption:
        'Machine learning flips the idea. Instead of writing the rules, you show the program many examples and let it find the pattern itself. Show it thousands of emails labelled "spam" or "not spam", and it works out what spam looks like. The result is called a model, and it is built by training.',
      cards: [
        [
          { t: 'Examples', sub: 'emails marked spam or not', tone: 'cyan' },
          { op: '→' },
          { t: 'Training', sub: 'find the pattern', tone: 'amber' },
          { op: '→' },
          { t: 'Model', sub: 'sorts new emails', tone: 'green' },
        ],
      ],
      realLife: 'Machine learning is a family of methods, from simple ones such as decision trees to huge neural networks.',
    },
    {
      caption:
        'The most successful kind of machine learning is the neural network. It is made of many small units, called neurons, arranged in layers. Numbers go in on the left, flow through the hidden layers, and an answer comes out on the right. Every line carries a weight: a thick line means the signal counts a lot, and a magenta line pushes the other way.',
      cards: [
        {
          kind: 'viz',
          viz: 'network',
          layers: [
            { n: 4, label: 'Input', names: ['pointy ears', 'whiskers', 'long tail', 'barks'] },
            { n: 5, label: 'Hidden layer' },
            { n: 4, label: 'Hidden layer' },
            { n: 2, label: 'Output', names: ['cat 92%', 'dog 6%'], active: [0] },
          ],
          note: 'Thicker line = bigger weight. Cyan lines add to the next neuron, magenta lines subtract.',
        },
      ],
      realLife: 'A real image network gets pixels as its inputs, not ideas such as "pointy ears". The hidden layers find those patterns by themselves. And an artificial neuron is only loosely inspired by a brain cell.',
    },
    {
      caption:
        'Zoom in on one neuron and it is only a small sum. It takes the numbers coming in, multiplies each by its weight, adds the results up and passes the total on. A big weight makes an input matter. A negative weight makes it count against.',
      cards: [
        {
          kind: 'viz',
          viz: 'neuron',
          title: 'One neuron',
          inputs: [
            { label: 'pointy ears', x: 0.8, w: 0.9 },
            { label: 'barks', x: 0.2, w: -0.4 },
            { label: 'long tail', x: 0.5, w: 0.6 },
          ],
          result: 'passed on',
        },
      ],
      realLife: 'Real networks add one more step after the sum, which squashes the result so the signals stay in a sensible range. The idea stays the same.',
    },
    {
      caption:
        'Training is turning the weights. At first they are random, so the answer is poor. The program compares its answer with the right one, then nudges every weight a tiny bit in the direction that makes the error smaller. After millions of examples the weights settle into values that give the right answer.',
      cards: [
        {
          kind: 'viz',
          viz: 'neuron',
          title: 'Before training: random weights',
          inputs: [
            { label: 'pointy ears', x: 0.8, w: 0.1 },
            { label: 'barks', x: 0.2, w: 0.5 },
            { label: 'long tail', x: 0.5, w: -0.2 },
          ],
          result: 'cat score: weak',
        },
        {
          kind: 'viz',
          viz: 'neuron',
          title: 'After training: weights found by trial',
          inputs: [
            { label: 'pointy ears', x: 0.8, w: 0.9 },
            { label: 'barks', x: 0.2, w: -0.4 },
            { label: 'long tail', x: 0.5, w: 0.6 },
          ],
          result: 'cat score: strong',
        },
      ],
      realLife: 'A big model such as an LLM has billions of weights. The training lesson later in this chapter shows how that goes.',
    },
    {
      caption:
        'Neural networks come in several shapes, built for different data. Convolutional networks look at images. Recurrent networks and transformers read sequences such as text. Diffusion models make pictures from noise. All of them are neural networks, trained on data, but arranged differently.',
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'Kinds of neural network',
          columns: ['Kind', 'Good at', 'Example'],
          rows: [
            ['Convolutional', 'recognising things in images', 'unlocking a phone with your face'],
            ['Transformer', 'text and other sequences', 'chatbots, translation'],
            ['Diffusion', 'making images from noise', 'AI picture generators'],
          ],
          tone: 'violet',
        },
      ],
    },
    {
      caption:
        'A genetic algorithm borrows the idea of evolution. Take a delivery driver who must visit ten towns and come home by the shortest road. Start with a crowd of random routes: most are a mess. Score each one by its length, keep the best, then mix pairs of them (crossover) and change them a little at random (mutation) to make the next generation. After many generations the routes get much shorter.',
      cards: [
        {
          kind: 'viz',
          viz: 'tour',
          frames: [
            { order: [2, 1, 6, 5, 7, 4, 9, 0, 8, 3], label: 'Generation 1', tone: 'red' },
            { order: [9, 5, 6, 8, 7, 4, 2, 0, 3, 1], label: 'Generation 5', tone: 'amber' },
            { order: [5, 6, 8, 7, 4, 9, 2, 0, 1, 3], label: 'Generation 20', tone: 'cyan' },
            { order: [5, 8, 6, 7, 4, 9, 2, 0, 1, 3], label: 'Generation 21', tone: 'green' },
          ],
          note: 'The best route found in each generation. The home town is orange.',
        },
        [
          { t: 'Random crowd', sub: 'many guesses', tone: 'cyan' },
          { op: '→' },
          { t: 'Score', sub: 'keep the best', tone: 'amber' },
          { op: '→' },
          { t: 'Mix and mutate', sub: 'next generation, then repeat', tone: 'green' },
          { op: '↺' },
        ],
      ],
      realLife: 'Unlike a neural network, a genetic algorithm does not learn from a pile of examples. It only needs a way to score each attempt. The next lesson goes through it step by step.',
    },
    {
      caption:
        'Reinforcement learning is learning by trial and reward. An agent tries actions in a world, gets a reward when things go well and a penalty when they do not, and slowly learns which actions pay off. This is how programs have learned to play board games and video games, and how some robots learn to walk. It is often combined with neural networks.',
      cards: [
        {
          kind: 'viz',
          viz: 'sequence',
          actors: ['Agent', 'World'],
          messages: [
            { from: 0, to: 1, text: 'tries an action', tone: 'cyan' },
            { from: 1, to: 0, text: 'new situation and a reward', tone: 'green' },
            { from: 0, to: 1, text: 'tries a better action', tone: 'cyan' },
          ],
        },
      ],
    },
    {
      caption:
        'So where does an LLM fit? A Large Language Model is a neural network of the transformer kind, trained on a huge amount of text to guess the next piece of text. Reinforcement learning is also used afterwards to make its answers more helpful. After the genetic algorithm lesson, the rest of this chapter is about that branch of AI.',
      cards: [
        {
          kind: 'viz',
          viz: 'layers',
          layers: [
            { t: 'Artificial intelligence', sub: 'any program that does something that seems intelligent', tone: 'cyan' },
            { t: 'Machine learning', sub: 'learns the pattern from data', tone: 'amber' },
            { t: 'Neural networks', sub: 'layers of neurons with weights', tone: 'violet' },
            { t: 'Large language models', sub: 'transformers trained on text', tone: 'green' },
          ],
          arrows: false,
        },
      ],
      realLife: 'Genetic algorithms and rule-based systems are AI too, but they are not machine learning in the usual sense, so they sit outside this nesting.',
    },
  ],

  quiz: [
    {
      type: 'choice',
      q: 'What is the main difference between rule-based AI and machine learning?',
      options: ['Rules are written by people; machine learning finds the pattern from examples', 'Rule-based AI is always newer', 'Machine learning needs no data', 'There is no difference'],
      answer: 0,
      why: 'In rule-based AI a person writes the knowledge as rules. In machine learning the program finds the pattern in examples.',
    },
    {
      type: 'choice',
      q: 'What do the weights in a neural network do?',
      options: ['They decide how strongly each signal counts, and training adjusts them', 'They store the training pictures', 'They are the names of the layers', 'They set the screen brightness'],
      answer: 0,
      why: 'Each neuron multiplies its inputs by weights. Training is the process of adjusting those weights.',
    },
    {
      type: 'choice',
      q: 'A neuron gets two inputs: 1 with weight 3, and 2 with weight -1. What total does it add up?',
      options: ['1', '5', '3', '-1'],
      answer: 0,
      why: '1 x 3 = 3 and 2 x (-1) = -2, so the total is 3 - 2 = 1.',
    },
    {
      type: 'choice',
      q: 'In a genetic algorithm, what happens to the best solutions in each generation?',
      options: ['They are kept, mixed and slightly changed to make the next generation', 'They are deleted', 'They are shown to a human for a vote', 'They are turned into a neural network'],
      answer: 0,
      why: 'Selection, crossover and mutation make each generation a little better than the last.',
    },
    {
      type: 'choice',
      q: 'A robot tries to walk, gets a reward each time it moves forward and a penalty when it falls. Which kind of AI is this?',
      options: ['Reinforcement learning', 'Rule-based AI', 'A spam filter', 'A search engine'],
      answer: 0,
      why: 'Learning from rewards and penalties by trial and error is reinforcement learning.',
    },
    {
      type: 'choice',
      q: 'What kind of AI is an LLM?',
      options: ['A neural network, of the transformer kind, trained on text', 'A list of hand-written rules', 'A genetic algorithm', 'A database of answers'],
      answer: 0,
      why: 'An LLM is a transformer neural network trained to predict the next token.',
    },
    {
      type: 'match',
      q: 'Match each approach to how it works.',
      items: [
        { id: 'rules', label: 'Rule-based AI' },
        { id: 'nn', label: 'Neural network' },
        { id: 'ga', label: 'Genetic algorithm' },
        { id: 'rl', label: 'Reinforcement learning' },
      ],
      targets: [
        { id: 'a', label: 'If-then rules written by people' },
        { id: 'b', label: 'Layers of neurons with weights learned from data' },
        { id: 'c', label: 'Survival of the best guesses over many generations' },
        { id: 'd', label: 'Trial and error guided by rewards' },
      ],
      answer: { rules: 'a', nn: 'b', ga: 'c', rl: 'd' },
      why: 'Each approach has a different source of knowledge: people, data, selection, or rewards.',
    },
  ],

  recap: [
    'AI is a label for many techniques, not one technology.',
    'Rule-based AI follows rules people wrote. Machine learning finds the pattern from examples.',
    'A neural network is layers of simple neurons whose weights are adjusted by training.',
    'Genetic algorithms evolve solutions by selection and mutation. Reinforcement learning learns from rewards.',
    'An LLM is a transformer neural network trained on text to predict the next token.',
  ],
});
