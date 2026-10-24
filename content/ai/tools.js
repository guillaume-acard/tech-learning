TL.registerLesson({
  id: 'ai-tools',
  title: 'Agents and tools',
  hook: 'A language model only writes text. So how can an AI assistant check the weather or send a message for you?',
  cover: 'img/lessons/ai-tools.png',
  scene: TL.toolScene,

  steps: [
    {
      caption: 'Here is our agent again: you, the harness (a normal program) and the LLM. Remember, the LLM can only read text and write text. That is all it can do.',
      show: { nodes: ['you', 'harness', 'llm'], links: ['you-harness', 'harness-llm'] },
      highlight: ['you', 'harness', 'llm'],
    },
    {
      caption:
        'So the harness is given tools: small programs that really do things. A weather lookup, a calculator, a file reader, a messaging app. The harness can run them. The LLM cannot, but it can ask for them.',
      show: { nodes: ['weather', 'calc', 'files', 'message'], links: ['harness-weather', 'harness-calc', 'harness-files', 'harness-message'] },
      highlight: ['weather', 'calc', 'files', 'message'],
    },
    {
      caption: 'Let us follow a real-feeling job. You type: "Will it rain in Paris tomorrow? If it will, tell Sam to bring an umbrella." The message reaches the harness.',
      show: {},
      highlight: ['you', 'harness'],
      packets: [{ path: ['you', 'harness'], color: '#e2e8f0', label: 'Rain in Paris?' }],
    },
    {
      caption:
        'The harness sends the LLM your message plus a short list of the tools it has, written as text: "weather", "calculator", "files", "messages", with what each one does. This is how the LLM knows what it may ask for.',
      show: {},
      badges: { harness: ['wrench'] },
      highlight: ['harness', 'llm'],
      packets: [{ path: ['harness', 'llm'], color: '#e879f9', label: 'Question + tool list' }],
      cards: [
        {
          kind: 'viz',
          viz: 'record',
          title: 'Text the harness sends to the LLM',
          groups: [
            { label: 'Your message', tone: 'cyan', fields: [{ k: 'text', v: 'Will it rain in Paris tomorrow? If it will, tell Sam to bring an umbrella.' }] },
            {
              label: 'Tools it may ask for',
              tone: 'violet',
              fields: [
                { k: 'weather', v: 'gives the forecast for a city and a day' },
                { k: 'calculator', v: 'does exact maths' },
                { k: 'files', v: 'reads a file on this computer' },
                { k: 'message', v: 'sends a message to a person' },
              ],
            },
          ],
        },
      ],
    },
    {
      caption:
        'The LLM does not answer yet. It does not know tomorrow’s weather. Instead it writes a tool request, just text, something like: use weather, city Paris, day tomorrow. It cannot run it itself.',
      show: {},
      badges: { harness: ['wrench'] },
      highlight: ['llm'],
      packets: [{ path: ['llm', 'harness'], color: '#e879f9', label: 'use weather(Paris)' }],
      cards: [
        {
          kind: 'viz',
          viz: 'record',
          title: 'A tool request is just structured text',
          groups: [
            { label: 'Tool call written by the LLM', tone: 'violet', fields: [{ k: 'name', v: 'weather' }, { k: 'city', v: 'Paris' }, { k: 'day', v: 'tomorrow' }] },
          ],
          note: 'A name for the tool, plus arguments (the details). Because the format is strict, the harness can read it without guessing.',
        },
      ],
      realLife:
        'This is often called tool calling or function calling. The request is written in a strict format (often JSON) so that the harness can read it without guessing.',
    },
    {
      caption: 'The harness reads the request and runs the weather tool for real. The tool answers: rain, 11 degrees.',
      show: {},
      labels: { weather: 'Rain, 11°C' },
      highlight: ['harness', 'weather'],
      packets: [
        { path: ['harness', 'weather'], color: '#2dd4bf', label: 'Paris?' },
        { path: ['weather', 'harness'], color: '#39ff88', label: 'Rain, 11°C' },
      ],
    },
    {
      caption:
        'The harness sends the result back to the LLM, along with the whole conversation. The LLM reads it, sees rain, and decides the next step: ask for the messaging tool.',
      show: {},
      highlight: ['harness', 'llm'],
      packets: [
        { path: ['harness', 'llm'], color: '#e879f9', label: 'Result: rain' },
        { path: ['llm', 'harness'], color: '#e879f9', label: 'use message(Sam)' },
      ],
    },
    {
      caption: 'The harness runs the message tool and Sam gets: "Bring an umbrella!". The tool reports back that the message was sent.',
      show: {},
      labels: { message: 'Sent!' },
      highlight: ['harness', 'message'],
      packets: [
        { path: ['harness', 'message'], color: '#2dd4bf', label: 'Bring an umbrella!' },
        { path: ['message', 'harness'], color: '#39ff88', label: 'Sent' },
      ],
      realLife:
        'Actions with real effects, like sending a message or deleting a file, are where a good harness asks you "Allow this?" first. The LLM only suggests, and the harness decides what is really allowed to happen.',
    },
    {
      caption:
        'One more round with the LLM, and it writes the final answer. The harness shows it to you: "It will rain in Paris tomorrow. I told Sam to bring an umbrella." One question, two tools, several trips around the loop.',
      show: {},
      highlight: ['you', 'harness', 'llm'],
      packets: [
        { path: ['harness', 'llm'], color: '#e879f9', label: 'Sent!' },
        { path: ['llm', 'harness', 'you'], color: '#39ff88', label: 'It will rain. Sam knows.' },
      ],
      cards: [
        {
          kind: 'viz',
          viz: 'sequence',
          title: 'The whole job, one line per trip',
          actors: ['You', 'Harness', 'LLM', 'Tool'],
          messages: [
            { from: 0, to: 1, text: 'Rain in Paris? Tell Sam.', tone: 'cyan' },
            { from: 1, to: 2, text: 'Question + tool list', tone: 'violet' },
            { from: 2, to: 1, text: 'weather(Paris)', tone: 'violet' },
            { from: 1, to: 3, text: 'Run weather', tone: 'amber' },
            { from: 3, to: 1, text: 'Rain, 11°C', tone: 'green' },
            { from: 1, to: 2, text: 'Result: rain', tone: 'violet' },
            { from: 2, to: 1, text: 'message(Sam)', tone: 'violet' },
            { from: 1, to: 3, text: 'Send message', tone: 'amber' },
            { from: 3, to: 1, text: 'Sent', tone: 'green' },
            { from: 1, to: 2, text: 'Result: sent', tone: 'violet' },
            { from: 2, to: 1, text: 'Final answer', tone: 'green' },
            { from: 1, to: 0, text: 'It will rain. Sam knows.', tone: 'green' },
          ],
        },
      ],
    },
  ],

  sandbox: {
    type: 'toolpick',
    intro: 'You are the LLM. Choose the tool you would ask the harness to run.',
    tools: { weather: 'Weather', calc: 'Calculator', files: 'Files', message: 'Messages' },
    tasks: [
      {
        ask: 'What is 48,317 × 912?',
        tool: 'calc',
        result: 'The calculator gives 44,065,104. It is exact, while an LLM alone might guess some of the digits.',
        wrong: { none: 'An LLM alone can slip on long multiplications. An exact calculator is safer.', weather: 'The weather tool only reports weather.' },
      },
      {
        ask: 'Will it rain in Lyon tomorrow?',
        tool: 'weather',
        result: 'The weather tool answers "showers in the afternoon". The LLM turns that into a friendly sentence.',
        wrong: { none: 'The model was trained long ago and cannot know tomorrow’s weather. It needs a tool.' },
      },
      {
        ask: 'Summarise my file homework.txt.',
        tool: 'files',
        result: 'The harness reads homework.txt and gives the text to the LLM, which writes the summary.',
        wrong: { none: 'The LLM cannot see the files on your computer. The harness has to read the file and show it.' },
      },
      {
        ask: 'Tell Mum I will be late tonight.',
        tool: 'message',
        result: 'The harness sends the message to Mum, ideally after asking you to confirm.',
        wrong: { none: 'The LLM can write the words, but it cannot send them. Only a messaging tool can.' },
      },
      {
        ask: 'Write a short poem about a robot cat.',
        tool: 'none',
        result: 'No tool needed. Writing text is what an LLM does best, so it simply answers.',
        wrong: { weather: 'A poem does not need a weather forecast.', calc: 'A poem does not need maths.', files: 'There is no file to read here.', message: 'Nobody asked to send anything.' },
      },
    ],
  },

  quiz: [
    {
      type: 'match',
      q: 'Label the parts of the loop.',
      items: [
        { id: 'a', label: 'Asks for the job to be done' },
        { id: 'b', label: 'Reads the tool request and runs the tool' },
        { id: 'c', label: 'Writes the tool request as text' },
        { id: 'd', label: 'Does a real action, like looking up the weather' },
      ],
      targets: [
        { id: 'user', label: 'User' },
        { id: 'harness', label: 'Harness' },
        { id: 'llm', label: 'LLM' },
        { id: 'tool', label: 'Tool' },
      ],
      answer: { a: 'user', b: 'harness', c: 'llm', d: 'tool' },
      why: 'You ask, the LLM requests, the harness runs, and the tool acts.',
    },
    {
      type: 'order',
      q: 'Put the weather example in order.',
      items: [
        { id: 'a', label: 'You ask about the weather' },
        { id: 'b', label: 'The LLM writes a request to use the weather tool' },
        { id: 'c', label: 'The harness runs the weather tool' },
        { id: 'd', label: 'The harness gives the result to the LLM, which writes the final answer' },
      ],
      answer: ['a', 'b', 'c', 'd'],
      why: 'Ask, request, run, then answer with the result.',
    },
    {
      type: 'choice',
      q: 'Who actually runs the tool?',
      options: ['The harness', 'The LLM', 'The user’s keyboard', 'The internet provider'],
      answer: 0,
      why: 'The LLM only writes text. The harness is the program that can run things.',
    },
    {
      type: 'choice',
      q: 'Why does an agent need a calculator tool?',
      options: [
        'An exact calculator is more reliable than an LLM guessing digits',
        'LLMs cannot read numbers at all',
        'Calculators are free',
        'It makes the answer longer',
      ],
      answer: 0,
      why: 'Tools give exact, up-to-date results that an LLM predicting text cannot guarantee.',
    },
    {
      type: 'choice',
      q: 'The agent is about to delete a file. What does a careful harness do?',
      options: ['Asks the user to allow it first', 'Deletes it silently', 'Asks the LLM to delete it', 'Ignores the request'],
      answer: 0,
      why: 'Actions with real effects deserve a human "Allow?" check.',
    },
  ],

  recap: [
    'An LLM only writes text. Tools are programs that really act: search, calculate, read files, send messages.',
    'The LLM asks for a tool in text, the harness runs it, and the result goes back to the LLM.',
    'The loop repeats until the LLM can write the final answer. A careful harness asks you before risky actions.',
  ],
});
