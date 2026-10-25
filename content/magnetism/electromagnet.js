TL.registerLesson({
  id: 'magnetism-electromagnet',
  title: 'Electromagnets: when current makes a magnet',
  hook: 'A crane lifts a whole car with no glue and no hook, then drops it by flipping a switch. How can electricity turn a lump of iron into a magnet and back?',
  cover: 'img/lessons/magnetism-electromagnet.png',

  steps: [
    {
      caption:
        'A magnet is surrounded by an invisible magnetic field. The field pulls on iron and pushes or pulls other magnets. We draw it as lines that leave the north pole and come back into the south pole. Where the lines are close together, the pull is strongest, which is at the poles.',
      looksLike: {
        title: 'A magnetic field made visible',
        src: 'img/real/iron-filings.png',
        alt: 'Photo of tiny iron filings on white paper forming curved lines from one end of a bar magnet to the other',
        caption: 'Iron filings sprinkled on paper over a magnet line up along the field and show its shape.',
      },
      cards: [{ kind: 'viz', viz: 'field', diagram: 'bar' }],
    },
    {
      caption:
        'In 1820 Hans Christian Oersted noticed something odd during a lecture: a compass needle twitched when he switched on a current in a nearby wire. Electric current makes a magnetic field. The field forms circles around the wire, and the stronger the current, the stronger the field.',
      cards: [
        { kind: 'viz', viz: 'field', diagram: 'wire' },
        [
          { t: 'Current in a wire', sub: 'moving charges', tone: 'amber' },
          { op: '→' },
          { t: 'Magnetic field', sub: 'circles around the wire', tone: 'cyan' },
          { op: '→' },
          { t: 'Compass moves', sub: 'the needle feels the field', tone: 'green' },
        ],
      ],
      realLife: 'The field around a single wire is very weak. A wire carrying the current of a phone charger will not visibly move a compass from a few centimetres away.',
    },
    {
      caption:
        'To make the field stronger, wind the wire into a coil. Each loop adds its small circles of field to the others, and inside the coil they all point the same way. The coil now behaves like a bar magnet, with a north pole at one end and a south pole at the other. This is an electromagnet. Reverse the current and the poles swap.',
      looksLike: {
        title: 'A coil of copper wire',
        src: 'img/real/coil-electromagnet.png',
        alt: 'Photo of a copper wire coil wound on a plastic former with two wires coming out of it, on a workbench',
        caption: 'Many turns of thin copper wire. More turns and more current give a stronger field.',
      },
      cards: [{ kind: 'viz', viz: 'field', diagram: 'coil', on: true }],
    },
    {
      caption:
        'Push a bar of soft iron inside the coil, the core, and the field becomes hundreds of times stronger. Iron is made of tiny magnetic regions. The coil\'s field lines them up, and they add their own field to the coil\'s. When the current stops, the soft iron lets go and the extra field disappears.',
      cards: [
        { kind: 'viz', viz: 'field', diagram: 'coil', on: true, core: true },
        {
          kind: 'viz',
          viz: 'table',
          title: 'What makes an electromagnet stronger',
          columns: ['Change', 'Effect on pull'],
          rows: [
            ['More current', 'stronger'],
            ['More turns of wire', 'stronger'],
            ['Soft iron core inside', 'much stronger'],
            ['Current switched off', 'almost nothing'],
          ],
          tone: 'cyan',
        },
      ],
    },
    {
      caption:
        'The big advantage of an electromagnet is that you can switch it. A scrapyard crane has a huge coil in a flat disk. Switch the current on and the disk grabs scrap iron. Move the crane, then switch off and everything drops. A permanent magnet cannot do that.',
      looksLike: {
        title: 'A scrapyard electromagnet',
        src: 'img/real/electromagnet-crane.png',
        alt: 'Photo of a crane with a large round steel electromagnet lifting a heap of scrap metal above a scrapyard',
        caption: 'This disk holds scrap on while the current flows, and lets it go as soon as it is switched off.',
      },
      cards: [
        {
          kind: 'viz',
          viz: 'sequence',
          actors: ['Operator', 'Coil', 'Scrap'],
          messages: [
            { from: 0, to: 1, text: 'switch on: current flows', tone: 'amber', note: 'the coil becomes a magnet' },
            { from: 1, to: 2, text: 'pulls the scrap up', tone: 'green', note: 'crane moves it' },
            { from: 0, to: 1, text: 'switch off: no current', tone: 'red', note: 'no field left' },
            { from: 1, to: 2, text: 'scrap falls', tone: 'dim', note: 'released' },
          ],
        },
      ],
    },
    {
      caption:
        'Electromagnets are inside many things you already know. A relay is a switch pulled by an electromagnet, so a tiny current can switch a big one. A loudspeaker moves a coil in and out to push the air. And a DC motor uses electromagnets pushing and pulling on permanent magnets to spin the shaft, which is how the motors in the robot chapter work.',
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'Electromagnets at work',
          columns: ['Device', 'What the coil does'],
          rows: [
            ['Relay', 'pulls a small switch closed'],
            ['Loudspeaker', 'moves a cone to make sound'],
            ['DC motor', 'is pushed round by magnets so the shaft spins'],
            ['Scrapyard crane', 'holds and drops iron'],
          ],
          tone: 'amber',
        },
      ],
    },
    {
      caption:
        'The link goes both ways, and it is the key to everything in the previous chapter. A current makes a magnetic field, and a changing magnetic field makes a current. So a wiggling current in an antenna makes a wiggling field, and that makes a wiggling electric field that makes a wiggling magnetic field, and the wave carries itself away as a radio wave. That is why wi-fi is called electromagnetic.',
      cards: [
        [
          { t: 'Wiggling current', sub: 'in the antenna', tone: 'amber' },
          { op: '→' },
          { t: 'Changing magnetic field', sub: 'around it', tone: 'cyan' },
          { op: '→' },
          { t: 'Changing electric field', sub: 'which makes more field', tone: 'violet' },
          { op: '→' },
          { t: 'A wave', sub: 'that travels on its own', tone: 'green' },
        ],
      ],
      realLife: 'This chain was worked out by James Clerk Maxwell in the 1860s with a set of equations. Hertz later made the waves he predicted.',
    },
  ],

  quiz: [
    {
      type: 'choice',
      q: 'Who first noticed that an electric current moves a compass needle?',
      options: ['Oersted', 'Hertz', 'The compass itself', 'A scrapyard worker'],
      answer: 0,
      why: 'In 1820 Oersted saw the needle twitch when the current was on, which showed that currents make magnetic fields.',
    },
    {
      type: 'choice',
      q: 'What shape is the magnetic field around a straight wire?',
      options: ['Circles around the wire', 'A straight line along the wire', 'Nothing, there is no field', 'Squares'],
      answer: 0,
      why: 'The field curls round the wire. Its strength grows with the current.',
    },
    {
      type: 'choice',
      q: 'Why wind a wire into a coil?',
      options: ['The fields of the loops add up and make it much stronger', 'It makes the wire shorter', 'It stops the current', 'It makes the field point sideways'],
      answer: 0,
      why: 'Inside a coil all the loops\' fields point the same way, so they add together.',
    },
    {
      type: 'choice',
      q: 'What does a soft iron core do inside the coil?',
      options: ['It makes the magnet much stronger while the current flows', 'It cuts the current', 'It makes the coil a permanent magnet', 'It makes the coil colder'],
      answer: 0,
      why: 'The core\'s tiny magnetic regions line up with the coil\'s field and add their own.',
    },
    {
      type: 'choice',
      q: 'What can an electromagnet do that an ordinary magnet cannot?',
      options: ['Be switched on and off', 'Attract iron', 'Have two poles', 'Be made of iron'],
      answer: 0,
      why: 'With no current there is almost no field, so the crane can drop its load.',
    },
    {
      type: 'choice',
      q: 'How does this connect to wi-fi waves?',
      options: ['A wiggling current makes changing fields that travel away as an electromagnetic wave', 'Wi-fi is a very strong magnet', 'Wi-fi uses iron cores', 'It does not connect at all'],
      answer: 0,
      why: 'Changing electric and magnetic fields keep creating each other, so the wave travels by itself.',
    },
    {
      type: 'match',
      q: 'Match each device to what its coil does.',
      items: [
        { id: 'relay', label: 'Relay' },
        { id: 'speaker', label: 'Loudspeaker' },
        { id: 'motor', label: 'DC motor' },
        { id: 'crane', label: 'Scrapyard crane' },
      ],
      targets: [
        { id: 'a', label: 'Pulls a small switch closed' },
        { id: 'b', label: 'Moves a cone to push air and make sound' },
        { id: 'c', label: 'Pushes against magnets to spin the shaft' },
        { id: 'd', label: 'Holds scrap and then drops it' },
      ],
      answer: { relay: 'a', speaker: 'b', motor: 'c', crane: 'd' },
      why: 'All of them rely on the same idea: current in a coil makes a magnetic force you can control.',
    },
  ],

  recap: [
    'A magnet has a field that pulls on iron. Iron filings show its shape.',
    'An electric current makes a magnetic field that circles the wire, as Oersted found in 1820.',
    'Winding the wire into a coil adds the fields of the loops together, and a soft iron core makes it much stronger. That is an electromagnet.',
    'An electromagnet can be switched on and off, which makes it useful in cranes, relays, speakers and motors.',
    'A changing electric field makes a magnetic field and the other way round, so together they travel as an electromagnetic wave, the radio waves of wi-fi.',
  ],
});
