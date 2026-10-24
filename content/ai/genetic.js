TL.registerLesson({
  id: 'ai-genetic',
  title: 'Genetic algorithms: evolving an answer',
  hook: 'A delivery driver must visit 20 towns and come home by the shortest road. There are more than 60 quadrillion possible routes. How do you find a good one?',
  cover: 'img/lessons/ai-genetic.png',

  steps: [
    {
      caption:
        'This is a famous puzzle, called the travelling salesperson problem. You have a list of towns. You must visit each one once and come back home, and you want the shortest total distance. With ten towns the route below, picked at random, zigzags across the map and is 1,710 km long. A good route is much shorter, but which one?',
      cards: [
        {
          kind: 'viz',
          viz: 'tour',
          frames: [{ order: [2, 1, 6, 5, 7, 4, 9, 0, 8, 3], label: 'A random route', tone: 'red' }],
          note: 'Ten towns. The home town is orange.',
        },
      ],
      realLife: 'The same puzzle hides inside parcel delivery, school buses, drilling holes in a circuit board and sequencing DNA.',
    },
    {
      caption:
        'The obvious answer is to try every route and keep the shortest. That works for a few towns, but the number of routes explodes as towns are added. Each extra town multiplies the count. Even a computer that checks a billion routes every second would need about two years for 20 towns, and for 30 towns far longer than the age of the universe.',
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'How many routes are there?',
          columns: ['Towns', 'Possible routes', 'Time at a billion routes a second'],
          rows: [
            ['5', '12', 'instant'],
            ['10', '181,440', 'less than a millisecond'],
            ['15', '43,589,145,600', 'about 44 seconds'],
            ['20', '60,822,550,204,416,000', 'about 2 years'],
            ['30', 'about 4 followed by 30 zeros', 'about 10,000 times the age of the universe'],
          ],
          tone: 'red',
        },
      ],
      realLife: 'Clever exact methods can solve far bigger cases than brute force. But a problem with many towns, or with extra rules, quickly becomes too hard to solve exactly, and a good answer found fast is worth more than a perfect one found never.',
    },
    {
      caption:
        'Nature solved a similar problem. Living things that fit their surroundings best survive and have young. The young are a mix of their parents, with the odd small random change, so some are better than their parents. Repeat that over many generations and the crowd improves. A genetic algorithm copies this recipe for any problem where you can score an answer.',
      cards: [
        [
          { t: '1. Crowd', sub: 'start with random routes', tone: 'cyan' },
          { op: '→' },
          { t: '2. Score', sub: 'shorter is better', tone: 'amber' },
          { op: '→' },
          { t: '3. Select', sub: 'the best get to be parents', tone: 'green' },
        ],
        [
          { t: '4. Crossover', sub: 'mix two parents into a child', tone: 'violet' },
          { op: '→' },
          { t: '5. Mutation', sub: 'a small random change', tone: 'red' },
          { op: '→' },
          { t: '6. Repeat', sub: 'the children are the next crowd', tone: 'cyan' },
          { op: '↺' },
        ],
      ],
    },
    {
      caption:
        'First, the answer has to be written as a list that can be mixed and changed. For our puzzle, a route is simply the list of towns in the order we visit them. Give the towns letters, and a route is a row of letters. The list is called the chromosome and each town in it is a gene, borrowing the words from biology. Every town must appear exactly once.',
      cards: [
        {
          kind: 'viz',
          viz: 'genes',
          title: 'Two routes through eight towns, A to H',
          rows: [
            { label: 'Route 1', genes: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'], tone: 'cyan' },
            { label: 'Route 2', genes: ['C', 'F', 'A', 'H', 'D', 'B', 'G', 'E'], tone: 'amber' },
          ],
          note: 'Route 1 goes A, then B, then C, and so on, and finally back to A.',
        },
      ],
      realLife: 'The same idea works for other problems: a timetable is a list of lessons and slots, and an antenna is a list of lengths and angles.',
    },
    {
      caption:
        'Next, score every route in the crowd. For this puzzle the score is simply its length, and shorter is fitter. The best routes are kept. Parents are then picked with a bit of luck: take a few routes at random and the shortest of them becomes a parent. So good routes are picked often, but weaker ones sometimes get a chance, which keeps the crowd varied.',
      cards: [
        {
          kind: 'viz',
          viz: 'bars',
          title: 'Length of five routes in km (shorter is better)',
          items: [
            { label: 'Route 4', value: 1203, text: '1,203', tone: 'green' },
            { label: 'Route 2', value: 1297, text: '1,297', tone: 'green' },
            { label: 'Route 5', value: 1388, text: '1,388', tone: 'amber' },
            { label: 'Route 1', value: 1534, text: '1,534', tone: 'red' },
            { label: 'Route 3', value: 1710, text: '1,710', tone: 'red' },
          ],
          max: 1800,
          note: 'Green routes are likely parents, red routes will mostly be dropped.',
        },
      ],
    },
    {
      caption:
        'Crossover makes a child from two parents. Pick a slice of parent A and copy it into the child at the same place. Then fill the empty places with the missing towns, in the order they appear in parent B. We cannot just copy half of each parent, because a town could end up twice or not at all. This way the child is always a valid route, with some of each parent in it.',
      cards: [
        {
          kind: 'viz',
          viz: 'genes',
          title: 'Crossover',
          rows: [
            { label: 'Parent A', genes: [{ t: 'A', tone: 'dim' }, { t: 'B', tone: 'dim' }, { t: 'C', tone: 'dim' }, 'D', 'E', 'F', { t: 'G', tone: 'dim' }, { t: 'H', tone: 'dim' }], tone: 'cyan' },
            { label: 'Parent B', genes: ['C', { t: 'F', tone: 'dim' }, 'A', 'H', { t: 'D', tone: 'dim' }, 'B', 'G', { t: 'E', tone: 'dim' }], tone: 'amber' },
            { arrow: 'keep D E F from A, then fill the gaps with C A H B G in B\'s order' },
            { label: 'Child', genes: ['C', 'A', 'H', { t: 'D', tone: 'cyan' }, { t: 'E', tone: 'cyan' }, { t: 'F', tone: 'cyan' }, 'B', 'G'], tone: 'amber' },
          ],
          note: 'Cyan genes come from parent A, orange genes from parent B.',
        },
      ],
      realLife: 'If a good route has a good stretch in the middle, such as a neat chain of towns, the child can inherit that stretch from one parent while taking something useful from the other.',
    },
    {
      caption:
        'Mutation is a small random change to a child, here swapping two towns, and it only happens now and then. Most mutations make a route slightly worse, but a few make it better. More importantly, it brings new variety. Without it the crowd slowly fills up with copies of the same few routes and stops improving. Try that yourself in the lab at the end.',
      cards: [
        {
          kind: 'viz',
          viz: 'genes',
          title: 'Mutation: swap two towns',
          rows: [
            { label: 'Before', genes: ['C', 'A', 'H', 'D', 'E', 'F', 'B', 'G'], tone: 'amber' },
            { arrow: 'swap E and G' },
            { label: 'After', genes: ['C', 'A', 'H', 'D', { t: 'G', tone: 'violet', mark: true }, 'F', 'B', { t: 'E', tone: 'violet', mark: true }], tone: 'amber' },
          ],
        },
      ],
      realLife: 'The mutation chance is a setting. Too low and the crowd gets stuck. Too high and every child is wrecked, so it becomes random guessing.',
    },
    {
      caption:
        'Put it all together and run it. Here is a crowd of 40 routes through the ten towns. The first generation is a tangle. By generation 5 the main shape is there. By generation 20 only small kinks are left, and generation 21 found the shortest possible route, 1,002 km. That took fewer than a thousand routes scored, instead of the 181,440 that checking every one would take.',
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
          note: 'The best route of each generation.',
        },
      ],
      realLife: 'It is luck-driven, so another run can end up on a slightly different route. For ten towns that is fine, but the point is that it keeps working when there are far too many routes to check.',
    },
    {
      caption:
        'The same loop solves very different problems. Only two things change: how a solution is written as a list of genes, and how it is scored. Here are some real uses.',
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'What genetic algorithms are used for',
          columns: ['Problem', 'The genes', 'The score'],
          rows: [
            ['Delivery or bus routes', 'the order of the stops', 'the total distance or time'],
            ['School or exam timetable', 'which lesson goes in which slot', 'how few clashes there are'],
            ['Antenna for a spacecraft', 'lengths and angles of the wire bends', 'the signal strength in a simulation'],
            ['Settings of a machine', 'a list of numbers for each knob', 'how well the machine performs'],
            ['Robot walking', 'timing of each joint movement', 'how far it walks without falling'],
          ],
          tone: 'violet',
        },
      ],
      realLife: 'In 2006 NASA flew a radio antenna on the ST5 satellites whose odd twisted shape was found by an evolutionary algorithm, not by an engineer.',
    },
    {
      caption:
        'It is good to know where it falls short. It needs a score for any attempt, which can be hard to write. It gives a good answer, but never proves that it is the best. It needs thousands of scored attempts, so scoring has to be cheap. And since it uses random choices, two runs can give different answers.',
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'Strengths and limits',
          columns: ['Good', 'Not so good'],
          rows: [
            ['Works when you can score an answer but cannot say how to build one', 'It needs a score for every attempt'],
            ['Finds good answers to huge problems fast', 'No proof that the answer is the very best'],
            ['Needs no examples to learn from', 'Many attempts, so each must be cheap to score'],
            ['Easy to adapt to a new problem', 'Different runs give different answers'],
          ],
          tone: 'cyan',
        },
      ],
      realLife: 'For some problems a method written for that exact problem beats a genetic algorithm. It is a general-purpose tool for when no such method is known.',
    },
  ],

  sandbox: {
    type: 'genetic',
    intro: 'Press Run and watch the crowd of routes (faint violet) evolve towards the best route (cyan).',
    goalText: 'Find the shortest possible route. Then set the mutation to 0% and start again: does the crowd still find it?',
  },

  quiz: [
    {
      type: 'choice',
      q: 'What does the travelling salesperson problem ask for?',
      options: ['The shortest route that visits every town once and returns home', 'The fastest road between two towns', 'The town with the most people', 'The cheapest hotel'],
      answer: 0,
      why: 'You must visit all the towns once, return to the start, and keep the total distance as short as you can.',
    },
    {
      type: 'choice',
      q: 'Why can a computer not simply try every route when there are 30 towns?',
      options: ['There are about 4 followed by 30 zeros of them, far too many to check', 'Computers cannot add distances', 'Maps do not have 30 towns', 'The routes are all the same length'],
      answer: 0,
      why: 'The number of routes multiplies with every extra town and quickly becomes impossible to count through.',
    },
    {
      type: 'choice',
      q: 'In the route puzzle, what is the score that decides which routes are the best?',
      options: ['The total length of the route, where shorter is better', 'The number of towns', 'The name of the first town', 'How many letters the route has'],
      answer: 0,
      why: 'The score is whatever you want to improve, here the total distance.',
    },
    {
      type: 'choice',
      q: 'What does crossover do?',
      options: ['Mixes two parent routes into a new child route', 'Deletes the worst town', 'Makes a random brand new route', 'Measures the route'],
      answer: 0,
      why: 'The child takes part of one parent and fills in the rest from the other, so good pieces can be combined.',
    },
    {
      type: 'choice',
      q: 'Why does a genetic algorithm add occasional mutations?',
      options: ['To bring in new variety so the crowd does not get stuck', 'To make every route longer', 'To reduce the number of towns', 'To stop the program'],
      answer: 0,
      why: 'Without mutation the crowd fills with near copies and stops improving.',
    },
    {
      type: 'choice',
      q: 'The algorithm finishes with a short route. What can you say about it?',
      options: ['It is probably very good, but it is not proved to be the very best', 'It is certainly the shortest possible', 'It is always the same on every run', 'It must be a random route'],
      answer: 0,
      why: 'A genetic algorithm gives a good answer, not a guarantee. Another run might end somewhere slightly different.',
    },
    {
      type: 'match',
      q: 'Match each word to what it means in the route puzzle.',
      items: [
        { id: 'pop', label: 'The crowd (population)' },
        { id: 'fit', label: 'Fitness' },
        { id: 'cross', label: 'Crossover' },
        { id: 'mut', label: 'Mutation' },
      ],
      targets: [
        { id: 'a', label: 'All the routes alive in this generation' },
        { id: 'b', label: 'How good a route is, here its shortness' },
        { id: 'c', label: 'Mixing two parents into a child' },
        { id: 'd', label: 'Swapping two towns at random' },
      ],
      answer: { pop: 'a', fit: 'b', cross: 'c', mut: 'd' },
      why: 'Each word is borrowed from evolution and has a simple job in the loop.',
    },
  ],

  recap: [
    'The travelling salesperson problem asks for the shortest round trip through many towns. There are far too many routes to check them all.',
    'A genetic algorithm copies evolution: a crowd of random answers, scored, the best picked as parents, mixed (crossover) and changed a little (mutation), generation after generation.',
    'You need two things: a way to write an answer as a list of genes, and a way to score an answer.',
    'It finds good answers fast, but does not prove they are the best, and different runs can differ.',
    'It is used for routes, timetables, designs and settings, wherever an answer can be scored.',
  ],
});
