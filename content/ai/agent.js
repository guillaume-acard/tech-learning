TL.registerLesson({
  id: 'ai-agent',
  title: 'What is an agent?',
  hook: 'When you chat with an AI, you are not talking to the model directly. A normal program stands in between.',
  cover: 'img/lessons/ai-agent.png',
  scene: TL.agentScene,

  steps: [
    {
      caption: 'You open an AI assistant on your computer or phone and type a question. It feels like you are talking straight to the AI. But look at what is really in the middle.',
      show: { nodes: ['you'], links: [] },
      highlight: ['you'],
    },
    {
      caption:
        'The window you type into belongs to a normal program, called the harness. It is plain code, like any other app: it shows your message, it keeps the conversation, and it decides what to send where. It is not intelligent by itself.',
      show: { nodes: ['harness'], links: ['you-harness'] },
      highlight: ['harness'],
      packets: [{ path: ['you', 'harness'], color: '#e2e8f0', label: 'Question' }],
    },
    {
      caption:
        'The harness sends your text to the Large Language Model, the next-word machine from the last lessons. Often the model runs far away, on a big server in a data centre. So the message crosses the internet, protected by HTTPS, and the reply comes back.',
      show: { nodes: ['net', 'remote'], links: ['harness-net', 'net-remote'] },
      highlight: ['remote'],
      looksLike: {
        title: 'An AI data centre',
        src: 'img/real/ai-datacenter.png',
        alt: 'Photo of rows of GPU servers in a large AI data centre',
        caption: 'Big models run on racks of servers full of powerful chips, in buildings that need lots of power and cooling.',
      },
      packets: [
        { path: ['harness', 'net', 'remote'], color: '#e879f9', label: 'Prompt' },
        { path: ['remote', 'net', 'harness'], color: '#39ff88', label: 'Reply' },
      ],
      realLife:
        'Big models need powerful computers with special chips, which is why the best ones usually live on servers and are rented by the minute.',
    },
    {
      caption:
        'The model can also run locally, on your own computer, with no internet at all. Your text never leaves the machine, and it works offline. The price: a small or medium model on a normal computer is usually less capable than the biggest ones on servers.',
      show: { nodes: ['local'], links: ['harness-local'] },
      highlight: ['local'],
      packets: [
        { path: ['harness', 'local'], color: '#e879f9', label: 'Prompt' },
        { path: ['local', 'harness'], color: '#39ff88', label: 'Reply' },
      ],
    },
    {
      caption:
        'Here is a surprise: the model has no memory between requests. Each time, the harness sends the whole conversation again, from the first message to the newest one. The harness is what remembers; the model just reads and continues the text.',
      show: {},
      badges: { harness: ['chat'] },
      labels: { harness: 'Keeps the chat' },
      highlight: ['harness'],
      packets: [
        { path: ['you', 'harness'], color: '#e2e8f0', label: 'New message' },
        { path: ['harness', 'local'], color: '#e879f9', label: 'Whole chat' },
      ],
      cards: [
        {
          kind: 'viz',
          viz: 'record',
          title: 'What the harness sends to the model each time',
          groups: [
            { label: 'Request 1', tone: 'cyan', fields: [{ k: 'You', v: 'What is the capital of France?' }] },
            {
              label: 'Request 2 (the whole chat again)',
              tone: 'amber',
              fields: [
                { k: 'You', v: 'What is the capital of France?' },
                { k: 'AI', v: 'Paris.' },
                { k: 'You', v: 'And how many people live there?' },
              ],
            },
          ],
          note: 'Without the first two lines, the model would not know what "there" means.',
        },
      ],
    },
    {
      caption:
        'An agent is this combination: a harness plus an LLM, working in a loop. The harness collects the request, the LLM decides what to write next, and the harness can act on it and ask again, until the job is done. In the next lesson the loop gets real power: tools.',
      show: {},
      labels: { harness: 'Runs the loop' },
      highlight: ['you', 'harness', 'local'],
      packets: [
        { path: ['you', 'harness', 'local'], color: '#e2e8f0', label: 'Ask' },
        { path: ['local', 'harness', 'you'], color: '#39ff88', label: 'Answer' },
      ],
      cards: [
        {
          kind: 'viz',
          viz: 'sequence',
          title: 'The agent loop',
          actors: ['You', 'Harness', 'LLM'],
          messages: [
            { from: 0, to: 1, text: 'Your request', tone: 'cyan' },
            { from: 1, to: 2, text: 'The whole chat so far', tone: 'violet' },
            { from: 2, to: 1, text: 'Next text', tone: 'green' },
            { from: 1, to: 1, text: 'Acts on it, adds to chat', tone: 'amber', note: 'Not finished? Ask the LLM again.' },
            { from: 1, to: 0, text: 'The final answer', tone: 'green' },
          ],
        },
      ],
    },
  ],

  sandbox: {
    root: 'harness',
    rootName: 'the agent',
    noLocal: true,
    cutText: 'The agent cannot reach:',
    okText: 'The agent can reach both language models.',
    intro: 'Cut a link, or pick a scenario, to see which language model the agent can still use. Click a point to send it a packet.',
    scenarios: [
      { label: 'Internet down', cut: ['harness-net'], note: 'Your internet connection stops working.' },
      { label: 'Local model deleted', cut: ['harness-local'], note: 'You uninstall the local model.' },
      { label: 'Server crashes', cut: ['net-remote'], note: 'The big server is switched off.' },
    ],
    goal: {
      text: 'Make the remote model unreachable while the agent can still use the local one.',
      check: ({ offline }) => offline.has('remote') && !offline.has('local'),
    },
  },

  quiz: [
    {
      type: 'match',
      q: 'Label the parts of the agent.',
      items: [
        { id: 'you', label: 'Types the question' },
        { id: 'harness', label: 'A normal program that keeps the conversation' },
        { id: 'llm', label: 'Predicts the next words' },
      ],
      targets: [
        { id: 'user', label: 'You (the user)' },
        { id: 'harness', label: 'The harness' },
        { id: 'llm', label: 'The LLM' },
      ],
      answer: { you: 'user', harness: 'harness', llm: 'llm' },
      why: 'You ask, the harness handles the conversation, and the LLM writes the text.',
    },
    {
      type: 'choice',
      q: 'Where can the LLM run?',
      options: [
        'On your own computer (local) or on a server across the internet (remote)',
        'Only in a data centre',
        'Only on phones',
        'Only inside the screen',
      ],
      answer: 0,
      why: 'Both are possible. Local keeps your text on your machine and works offline; remote usually has a more powerful model.',
    },
    {
      type: 'choice',
      q: 'Who remembers the conversation from one message to the next?',
      options: [
        'The harness, which sends the whole chat to the model every time',
        'The LLM, which stores every chat inside itself',
        'The router',
        'The keyboard',
      ],
      answer: 0,
      why: 'The model reads the text it is given and continues it. The harness keeps the history.',
    },
    {
      type: 'order',
      q: 'Put one round of the agent loop in order.',
      items: [
        { id: 'a', label: 'You type a message' },
        { id: 'b', label: 'The harness sends the conversation to the LLM' },
        { id: 'c', label: 'The LLM writes a reply' },
        { id: 'd', label: 'The harness shows the reply to you' },
      ],
      answer: ['a', 'b', 'c', 'd'],
      why: 'The harness is always in the middle: it passes your words to the model and the model’s words back to you.',
    },
  ],

  recap: [
    'The harness is a normal program. It talks to you and to the LLM, and it keeps the conversation.',
    'The LLM can run locally on your computer or remotely on a server.',
    'An agent is a harness and an LLM working together in a loop.',
  ],
});
