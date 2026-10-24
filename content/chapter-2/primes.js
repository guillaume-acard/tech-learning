TL.registerLesson({
  id: 'ch2-primes',
  title: 'Prime numbers make the lock',
  hook: 'A lock that is easy to snap shut but nearly impossible to open: you can build it with multiplication.',
  cover: 'img/lessons/ch2-primes.png',

  steps: [
    {
      caption:
        'Remember prime numbers? A prime can only be divided by 1 and by itself. 7 is prime, 9 is not (it is 3 \u00d7 3). Primes are the atoms of numbers: every number is a product of primes. This is the secret ingredient of the chest.',
      cards: [
        [
          { t: '2', sub: 'prime', tone: 'green' },
          { t: '3', sub: 'prime', tone: 'green' },
          { t: '5', sub: 'prime', tone: 'green' },
          { t: '7', sub: 'prime', tone: 'green' },
          { t: '9', sub: '3 \u00d7 3', tone: 'dim' },
          { t: '11', sub: 'prime', tone: 'green' },
          { t: '13', sub: 'prime', tone: 'green' },
        ],
      ],
    },
    {
      caption:
        'Multiplying is easy. 89 \u00d7 97: a computer, or you with a calculator, gets 8633 in a blink. But go backwards: which two primes multiply to 8633? Try it by hand and you will see it is much harder.',
      cards: [
        [{ t: '89', sub: 'prime', tone: 'cyan' }, { op: '\u00d7' }, { t: '97', sub: 'prime', tone: 'cyan' }, { op: '=' }, { t: '8633', sub: 'easy!', tone: 'green' }],
        [{ t: '8633', sub: 'start here', tone: 'amber' }, { op: '=' }, { t: '?', sub: 'prime', tone: 'red' }, { op: '\u00d7' }, { t: '?', sub: 'prime', tone: 'red' }],
      ],
    },
    {
      caption:
        'For small numbers, a computer finds the answer fast by trying every possibility. But make the primes bigger and bigger, and the number of tries explodes. With primes of 300 digits, the best known methods would need longer than the age of the universe. This one-way street is our lock.',
      cards: [
        [
          { t: 'easy', sub: 'multiply two primes', tone: 'green' },
          { op: '\u2192' },
          { t: '600-digit number', sub: 'published to everyone', tone: 'cyan' },
          { op: '\u2192' },
          { t: 'impossible', sub: 'to split back into primes', tone: 'red' },
        ],
        {
          kind: 'viz',
          viz: 'table',
          title: 'Splitting by trying every divisor gets out of hand',
          columns: ['Size of the number', 'Multiplying the primes', 'Trying divisors (rough count)'],
          rows: [
            ['4 digits (like 8633)', '1 step', 'about 90 tries'],
            ['10 digits', '1 step', 'about 100,000 tries'],
            ['20 digits', '1 step', 'about 10 billion tries'],
            ['600 digits', '1 step', 'about 1 followed by 300 zeros'],
          ],
          highlight: 3,
          tone: 'red',
          note: 'Smarter methods than "try every divisor" exist, but they still take far too long for 600 digits. For comparison, the universe holds about 1 followed by 80 zeros atoms.',
        },
      ],
    },
    {
      caption:
        'Let us build a toy version with tiny numbers. Step 1: the website secretly picks two primes, p = 3 and q = 11, and multiplies them: n = 33. Step 2: it works out a helper number, (3 \u2212 1) \u00d7 (11 \u2212 1) = 20. Step 3: it picks e = 3 and finds d = 7. The reason it works: 3 \u00d7 7 = 21, which is one more than a multiple of 20.',
      cards: [
        [{ t: '3', sub: 'p (secret)', tone: 'dim' }, { op: '\u00d7' }, { t: '11', sub: 'q (secret)', tone: 'dim' }, { op: '=' }, { t: '33', sub: 'n', tone: 'cyan' }],
        [
          { t: '33 and 3', sub: 'public key (n and e)', tone: 'cyan' },
          { t: '7', sub: 'private key (d)', tone: 'red' },
        ],
        {
          kind: 'viz',
          viz: 'table',
          title: 'Who knows which number',
          columns: ['Name', 'Value', 'Where it comes from', 'Who knows it'],
          rows: [
            ['p, q', '3 and 11', 'two secret primes', 'only the website'],
            ['n', '33', 'p × q', 'everybody'],
            ['helper', '20', '(p − 1) × (q − 1)', 'only the website'],
            ['e', '3', 'picked by the website', 'everybody'],
            ['d', '7', 'e × d = 21, one more than a multiple of 20', 'only the website'],
          ],
          cells: [[1, 1], [3, 1]],
          tone: 'cyan',
          note: 'Highlighted: the public key is n and e. The rest stays secret.',
        },
      ],
      realLife:
        'The helper number comes from a theorem by Euler, in a method named RSA after its inventors Rivest, Shamir and Adleman. We use tiny numbers so you can check the maths on a calculator.',
    },
    {
      caption:
        'Locking. You want to send the secret number 4. Multiply it by itself e = 3 times: 4 \u00d7 4 \u00d7 4 = 64. Divide by n = 33 and keep only the remainder: 64 = 1 \u00d7 33 + 31, so the remainder is 31. You send 31, and the snooper sees only 31.',
      cards: [
        [
          { t: '4', sub: 'your secret', tone: 'amber' },
          { op: '\u2192' },
          { t: '4\u00d74\u00d74 = 64', sub: 'multiply 3 times', tone: 'cyan' },
          { op: '\u2192' },
          { t: '64 \u2212 33 = 31', sub: 'keep the remainder', tone: 'cyan' },
          { op: '\u2192' },
          { t: '31', sub: 'locked!', tone: 'green' },
        ],
      ],
    },
    {
      caption:
        'Unlocking. The website uses its private key d = 7: multiply 31 by itself 7 times, which gives 27,512,614,111. Divide by 33 and keep the remainder: it is exactly 4. The secret is back. The maths guarantees it, because 3 \u00d7 7 is one more than a multiple of 20.',
      cards: [
        [
          { t: '31', sub: 'received', tone: 'green' },
          { op: '\u2192' },
          { t: '31\u2077 = 27,512,614,111', sub: 'multiply 7 times', tone: 'cyan' },
          { op: '\u2192' },
          { t: 'remainder 4', sub: 'after dividing by 33', tone: 'cyan' },
          { op: '\u2192' },
          { t: '4', sub: 'the secret!', tone: 'amber' },
        ],
      ],
    },
    {
      caption:
        'Now be the snooper. You know n = 33, e = 3 and the locked 31. To find d, you first need the helper number 20, and for that you need p and q. So you must split 33 into primes. For 33 that is easy (3 \u00d7 11). For a 600-digit n, nobody can. That is the whole trick.',
      cards: [
        [
          { t: '33', sub: 'known by everybody', tone: 'cyan' },
          { op: '=' },
          { t: '?', sub: 'p', tone: 'red' },
          { op: '\u00d7' },
          { t: '?', sub: 'q', tone: 'red' },
          { op: '\u2192' },
          { t: '20', sub: 'helper number', tone: 'dim' },
          { op: '\u2192' },
          { t: '7', sub: 'private key d', tone: 'dim' },
        ],
      ],
      realLife:
        'Real keys use primes of hundreds of digits, so n has 600 or more digits (a "2048-bit" key). Nobody has ever found a fast way to split such numbers on today\u2019s computers. Quantum computers could one day do it, which is why researchers are already designing replacements.',
    },
  ],

  sandbox: {
    type: 'rsa',
    intro: 'Pick two primes to build your own keys, lock a secret number, then try to crack a lock.',
  },

  quiz: [
    {
      type: 'choice',
      q: 'Which of these numbers is prime?',
      options: ['13', '15', '21', '27'],
      answer: 0,
      why: '15 = 3 \u00d7 5, 21 = 3 \u00d7 7 and 27 = 3 \u00d7 9. Only 13 can be divided by just 1 and itself.',
    },
    {
      type: 'choice',
      q: 'Why is the lock hard to open for a snooper?',
      options: [
        'Splitting a huge number back into its two primes takes far too long',
        'The snooper has no computer',
        'The primes are written in a secret language',
        'Packets disappear after one second',
      ],
      answer: 0,
      why: 'Multiplying two primes is quick, but finding them again from the product is not.',
    },
    {
      type: 'match',
      q: 'In our toy example (n = 33, e = 3, d = 7), which numbers are public and which are secret?',
      items: [
        { id: 'n', label: 'n = 33' },
        { id: 'e', label: 'e = 3' },
        { id: 'd', label: 'd = 7' },
      ],
      targets: [
        { id: 'pub', label: 'Public: everybody may know it' },
        { id: 'priv', label: 'Private: only the website knows it' },
      ],
      answer: { n: 'pub', e: 'pub', d: 'priv' },
      why: 'Locking only needs n and e. Unlocking needs d, which comes from the secret primes.',
    },
    {
      type: 'order',
      q: 'Put the toy lock in order.',
      items: [
        { id: 'a', label: 'The website picks two secret primes and multiplies them' },
        { id: 'b', label: 'It publishes the public key' },
        { id: 'c', label: 'You lock your number with the public key' },
        { id: 'd', label: 'The website unlocks it with the private key' },
      ],
      answer: ['a', 'b', 'c', 'd'],
      why: 'Primes make the keys, the public key locks, the private key unlocks.',
    },
  ],

  recap: [
    'Multiplying two primes is easy. Splitting the result back into primes is incredibly hard when the primes are huge.',
    'The public key (n and e) locks a number, and only the private key (d) unlocks it.',
    'The private key can only be found by knowing the secret primes, which is why real keys use primes with hundreds of digits.',
  ],
});



