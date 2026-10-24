// Scenes for the AI chapter: the agent (a program plus a language model) and the tools it can call.

TL.agentScene = {
  label: 'You talk to an agent program, which uses a language model on this computer or on a server across the internet',
  viewBox: [0, 0, 1100, 560],
  offlineLabel: 'Unreachable',
  nodes: {
    you: { x: 110, y: 280, icon: 'person', label: 'You', sub: 'Typing a question', leaf: true },
    harness: { x: 400, y: 280, icon: 'app', label: 'Harness', sub: 'A normal program' },
    local: { x: 400, y: 80, icon: 'neural', label: 'Local LLM', sub: 'On this computer', leaf: true },
    net: { x: 700, y: 280, icon: 'globe', label: 'Internet', sub: 'Many routers' },
    remote: { x: 990, y: 280, icon: 'neural', label: 'Remote LLM', sub: 'On a big server', leaf: true },
  },
  links: [
    { from: 'you', to: 'harness', type: 'chat', hideLabel: true },
    { from: 'harness', to: 'local', type: 'model', hideLabel: true },
    { from: 'harness', to: 'net', type: 'fibre', hideLabel: true },
    { from: 'net', to: 'remote', type: 'backbone', hideLabel: true },
  ],
};

TL.toolScene = {
  label: 'An agent program sits between you, a language model and four tools: weather, calculator, files and messages',
  viewBox: [0, 0, 1100, 660],
  nodes: {
    you: { x: 110, y: 340, icon: 'person', label: 'You', leaf: true },
    harness: { x: 420, y: 340, icon: 'app', label: 'Harness', sub: 'Runs the actions' },
    llm: { x: 420, y: 90, icon: 'neural', label: 'LLM', sub: 'Only writes text', leaf: true },
    weather: { x: 840, y: 100, icon: 'cloud', label: 'Weather', sub: 'Looks it up online', leaf: true },
    calc: { x: 960, y: 260, icon: 'calc', label: 'Calculator', sub: 'Exact maths', leaf: true },
    files: { x: 960, y: 430, icon: 'folder', label: 'Files', sub: 'Reads your documents', leaf: true },
    message: { x: 840, y: 580, icon: 'chat', label: 'Messages', sub: 'Sends to people', leaf: true },
  },
  links: [
    { from: 'you', to: 'harness', type: 'chat', hideLabel: true },
    { from: 'harness', to: 'llm', type: 'model', hideLabel: true },
    { from: 'harness', to: 'weather', type: 'tool', hideLabel: true },
    { from: 'harness', to: 'calc', type: 'tool', hideLabel: true },
    { from: 'harness', to: 'files', type: 'tool', hideLabel: true },
    { from: 'harness', to: 'message', type: 'tool', hideLabel: true },
  ],
};

TL.ragScene = {
  label: 'RAG: a program embeds your documents and your question, searches by meaning, then feeds the best chunks to the LLM',
  viewBox: [0, 0, 1100, 640],
  nodes: {
    you: { x: 110, y: 320, icon: 'person', label: 'You', sub: 'Ask a question', leaf: true },
    app: { x: 360, y: 320, icon: 'app', label: 'RAG app', sub: 'Search + prompt' },
    embed: { x: 360, y: 120, icon: 'neural', label: 'Embedding model', sub: 'Text -> vector', leaf: true },
    docs: { x: 700, y: 120, icon: 'folder', label: 'Documents', sub: 'Your notes', leaf: true },
    vdb: { x: 700, y: 320, icon: 'book', label: 'Vector index', sub: 'Nearest meaning' },
    llm: { x: 990, y: 320, icon: 'neural', label: 'LLM', sub: 'Writes the answer', leaf: true },
  },
  links: [
    { from: 'you', to: 'app', type: 'chat', hideLabel: true },
    { from: 'docs', to: 'app', type: 'tool', hideLabel: true },
    { from: 'app', to: 'embed', type: 'model', hideLabel: true },
    { from: 'embed', to: 'vdb', type: 'tool', hideLabel: true },
    { from: 'app', to: 'vdb', type: 'tool', hideLabel: true },
    { from: 'app', to: 'llm', type: 'model', hideLabel: true },
  ],
};