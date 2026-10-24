TL.registerLesson({
  id: 'ai-wrong',
  title: 'Why AI sometimes gets it wrong',
  hook: 'An AI can sound completely sure and still be completely wrong. Why does that happen?',
  cover: 'img/lessons/ai-wrong.png',

  steps: [
    {
      caption:
        'Remember: an LLM picks the most likely next words. Likely is not the same as true. Often the likely answer is the true one, because true things were written down a lot. But not always.',
      cards: [
        [
          { t: 'likely', sub: 'what the model aims for', tone: 'violet' },
          { op: '≠' },
          { t: 'true', sub: 'what you want', tone: 'green' },
        ],
      ],
    },
    {
      caption:
        'Picture the question "The capital of Australia is…". Sydney and Melbourne are huge, famous cities, so they appear in far more texts than Canberra, the real capital. A model that leans on what it saw most can drift to the famous wrong answer.',
      cards: [
        [{ t: 'The capital of Australia is', sub: 'the text so far', tone: 'cyan' }],
        [
          { t: 'Canberra', sub: 'true', tone: 'green' },
          { t: 'Sydney', sub: 'famous, but wrong', tone: 'red' },
          { t: 'Melbourne', sub: 'famous, but wrong', tone: 'red' },
        ],
        {
          kind: 'viz',
          viz: 'bars',
          title: 'An example of how the scores could look (made up)',
          items: [
            { label: 'Sydney', value: 45, text: '45%', tone: 'red' },
            { label: 'Canberra', value: 40, text: '40%', tone: 'green' },
            { label: 'Melbourne', value: 10, text: '10%', tone: 'red' },
            { label: 'others', value: 5, text: '5%', tone: 'dim' },
          ],
          max: 100,
          note: 'If the wrong answer scores higher, it is picked more often, and it still sounds just as sure.',
        },
      ],
      realLife:
        'Today’s big models get this particular question right most of the time. The point is the mechanism: they pick likely text, so rarer or trickier facts are where mistakes hide.',
    },
    {
      caption:
        'When the model does not know something, it has no built-in feeling of "I don’t know". It still has to write something, so it writes what a good answer would look like. Made-up facts that sound real are called hallucinations: invented book titles, fake quotes, web links that do not exist.',
      cards: [
        [
          { t: 'Tell me about the book…', sub: 'a book that does not exist', tone: 'cyan' },
          { op: '→' },
          { t: 'A confident summary', sub: 'author, plot, even reviews', tone: 'amber' },
          { op: '→' },
          { t: 'All invented', sub: 'sounds right, is not', tone: 'red' },
        ],
        {
          kind: 'viz',
          viz: 'table',
          title: 'Same confident voice, different truth',
          columns: ['You ask about', 'What the model saw in training', 'What it writes', 'Is it true?'],
          rows: [
            ['The author of Harry Potter', 'Millions of mentions', 'J. K. Rowling, said confidently', 'Yes'],
            ['A book that does not exist', 'Nothing at all', 'A detailed plot, said just as confidently', 'No'],
          ],
          highlight: 1,
          tone: 'red',
          note: 'Nothing inside the text tells you which answer is the invented one.',
        },
      ],
    },
    {
      caption:
        'Tokens cause funny mistakes. The model sees "strawberry" as a few pieces, something like "str", "aw" and "berry", not as ten letters. So counting the letters r inside it can go wrong, even though a child can do it. The model works with pieces of text, not individual letters.',
      cards: [
        [
          { t: 'str', sub: 'token', tone: 'amber' },
          { t: 'aw', sub: 'token', tone: 'amber' },
          { t: 'berry', sub: 'token', tone: 'amber' },
        ],
        [{ t: 'How many r?', sub: 'answer: 3', tone: 'green' }],
        {
          kind: 'viz',
          viz: 'encode',
          title: 'What the model actually receives',
          aLabel: 'Text',
          bLabel: 'What the model sees',
          arrow: 'cut into tokens',
          pairs: [{ a: 'strawberry', b: '[ 496 ] [ 675 ] [ 15717 ]', tone: 'amber' }],
          note: 'Token numbers are made up. The model gets three numbers. The letters inside each piece are not directly in front of it.',
        },
      ],
      realLife:
        'Some models have famously answered 2 to this question. Newer ones often get it right, sometimes because they have been helped by extra tricks or tools (you will meet tools in the next lessons).',
    },
    {
      caption:
        'A model is also frozen in time. It learned from text collected up to a certain date, its knowledge cutoff. It has not read yesterday’s news unless the program around it gives it that news.',
      cards: [
        [
          { t: 'Training ends', sub: 'knowledge cutoff', tone: 'amber' },
          { op: '→' },
          { t: 'Months pass', sub: 'the world moves on', tone: 'dim' },
          { op: '→' },
          { t: 'You ask', sub: 'it does not know the news', tone: 'cyan' },
        ],
      ],
    },
    {
      caption:
        'So how do you use AI safely? Treat it like a very well-read friend who sometimes bluffs. Great for ideas, explanations and drafts. For facts that matter (health, money, homework dates), check another source, ask for where it comes from, and be most suspicious when an answer sounds very specific.',
      cards: [
        [
          { t: 'Use it for', sub: 'ideas, drafts, explaining', tone: 'green' },
          { t: 'Check it for', sub: 'facts, numbers, quotes', tone: 'amber' },
          { t: 'Be careful with', sub: 'anything important', tone: 'red' },
        ],
      ],
    },
  ],

  sandbox: {
    type: 'judge',
    intro: 'Every answer below sounds equally sure of itself. Which ones would you trust?',
    outro: 'They all sounded confident, which is exactly why checking matters.',
    items: [
      {
        q: 'Who wrote the Harry Potter books?',
        a: 'The Harry Potter books were written by J. K. Rowling.',
        ok: true,
        why: 'This fact appears in millions of texts, so the likely answer is also the true one.',
      },
      {
        q: 'What is the capital of Australia?',
        a: 'The capital of Australia is Sydney.',
        ok: false,
        why: 'It is Canberra. Sydney is bigger and more famous, which makes it a tempting, likely-sounding answer.',
      },
      {
        q: 'How many times does the letter r appear in the word "strawberry"?',
        a: 'The word "strawberry" contains the letter r two times.',
        ok: false,
        why: 'It is three: st-r-awbe-r-r-y. Models read pieces of words, not letters, so letter counting is a classic stumble.',
      },
      {
        q: 'Tell me about the novel "The Glass Dragon of Tolmar" by Ellen Marsh.',
        a: 'It is a fantasy novel from 1998 about a young glassmaker who finds a dragon made of glass. Critics praised its rich world-building.',
        ok: false,
        why: 'We invented that title and author just now, so there is nothing to summarise. A model may still write a smooth, detailed, completely made-up answer.',
      },
      {
        q: 'What is 7 × 8?',
        a: '7 × 8 is 56.',
        ok: true,
        why: 'Small multiplications appear all over the training text. For long numbers, though, models are much shakier, and a calculator tool is safer.',
      },
    ],
  },

  quiz: [
    {
      type: 'choice',
      q: 'An AI invents a book that does not exist and describes it in detail. What is this called?',
      options: ['A hallucination', 'A virus', 'A software update', 'A token'],
      answer: 0,
      why: 'A hallucination is made-up text that sounds believable.',
    },
    {
      type: 'choice',
      q: 'Why can an LLM make mistakes about facts?',
      options: [
        'It picks likely text, and likely is not always true',
        'It is switched off when the internet is slow',
        'It only knows one language',
        'It refuses to read books',
      ],
      answer: 0,
      why: 'Predicting plausible text is not the same as checking facts.',
    },
    {
      type: 'choice',
      q: 'You ask for yesterday’s football score and the AI gets it wrong. What is the most likely reason?',
      options: [
        'Its training stopped before yesterday, so it never read the result',
        'Football is too hard for computers',
        'The AI is lying on purpose',
        'The score was written in tokens',
      ],
      answer: 0,
      why: 'A model only knows what was in its training text, up to its knowledge cutoff.',
    },
    {
      type: 'match',
      q: 'Which of these should you trust the AI with, and which should you double-check?',
      items: [
        { id: 'a', label: 'Ideas for a birthday party' },
        { id: 'b', label: 'A quote from a famous speech' },
        { id: 'c', label: 'A long multiplication' },
        { id: 'd', label: 'A first draft of a story' },
      ],
      targets: [
        { id: 'ok', label: 'Great to use as it is' },
        { id: 'check', label: 'Check it before you rely on it' },
      ],
      answer: { a: 'ok', b: 'check', c: 'check', d: 'ok' },
      why: 'Ideas and drafts are meant to be reworked. Exact quotes and exact numbers are where models bluff.',
    },
  ],

  recap: [
    'An LLM aims for likely text, not true text, so it can be confidently wrong.',
    'Hallucinations are made-up facts that sound real, and models only know what they read before their knowledge cutoff.',
    'Use AI for ideas and drafts, and check facts, numbers and quotes elsewhere.',
  ],
});
