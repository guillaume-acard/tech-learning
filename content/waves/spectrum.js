TL.registerLesson({
  id: 'waves-spectrum',
  title: 'Waves and the invisible spectrum',
  hook: 'Wi-fi, a microwave oven, the light from a lamp and an X-ray are all the same kind of thing. What are they, and why are some harmless and others not?',
  cover: 'img/lessons/waves-spectrum.png',

  steps: [
    {
      caption:
        'Start with something you can picture: a wave on a rope. Flick one end and a bump travels along it, but the rope itself does not travel. It only moves up and down. A wave is a way of carrying energy from one place to another without carrying the stuff along.',
      cards: [
        {
          kind: 'viz',
          viz: 'wave',
          annotate: true,
          waves: [{ label: 'A wave: a smooth repeating up and down', cycles: 3, amp: 34, tone: 'cyan' }],
        },
        [
          { t: 'Wavelength', sub: 'the length of one full up and down', tone: 'amber' },
          { op: '+' },
          { t: 'Height', sub: 'how strong the wave is', tone: 'cyan' },
        ],
      ],
      realLife: 'Sound is also a wave, but it needs air to travel through. The waves in this lesson do not need anything: they cross empty space, which is how sunlight reaches us.',
    },
    {
      caption:
        'Waves are described by how often they repeat. The number of up-and-downs per second is the frequency, measured in hertz (Hz). Short waves wiggle fast and have a high frequency. Long waves wiggle slowly and have a low frequency. All the waves in this lesson move at the same speed, the speed of light, so a shorter wavelength always means a higher frequency.',
      cards: [
        {
          kind: 'viz',
          viz: 'wave',
          waves: [
            { label: 'Long waves: low frequency', cycles: 2, amp: 28, tone: 'cyan' },
            { label: 'Short waves: high frequency', cycles: 8, amp: 28, tone: 'violet' },
          ],
        },
        {
          kind: 'viz',
          viz: 'table',
          title: 'Units you will meet',
          columns: ['Unit', 'Means', 'Example'],
          rows: [
            ['1 kHz (kilohertz)', '1 thousand waves a second', 'old AM radio'],
            ['1 MHz (megahertz)', '1 million a second', 'FM radio'],
            ['1 GHz (gigahertz)', '1 billion a second', 'wi-fi, Bluetooth, phones'],
          ],
          tone: 'cyan',
        },
      ],
    },
    {
      caption:
        'Light is a wave too, a wave of electric and magnetic fields that push on each other as they travel, which is why it is called electromagnetic. Light we can see is only a tiny slice. Put the same kind of wave at a much longer wavelength and you get radio. Put it at a shorter one and you get ultraviolet, then X-rays. The full range is called the electromagnetic spectrum.',
      looksLike: {
        title: 'White light split into its colours',
        src: 'img/real/prism-light.png',
        alt: 'Photo of a glass prism on a dark surface splitting a beam of white light into a rainbow',
        caption: 'A glass prism bends each colour by a different amount, so white light fans out. Red has the longest wavelength we can see, violet the shortest.',
      },
      cards: [{ kind: 'viz', viz: 'spectrum' }],
      realLife: 'The picture is not to scale. The range from radio to gamma rays covers about fifteen steps of ten, and visible light fits in less than one of them.',
    },
    {
      caption:
        'Radio waves are the longest, from about a hand span to many kilometres. They go through walls and clouds easily, so they carry radio, television, mobile phone calls and, further up, wi-fi and Bluetooth. Telescopes can also listen to radio waves coming from distant stars and galaxies.',
      looksLike: {
        title: 'A radio telescope',
        src: 'img/real/radio-telescope.png',
        alt: 'Photo of a large white radio telescope dish under a starry evening sky',
        caption: 'A dish collects very faint radio waves and focuses them on a small receiver. Space is full of radio waves that our eyes cannot see.',
      },
      cards: [{ kind: 'viz', viz: 'spectrum', highlight: [0, 1] }],
    },
    {
      caption:
        'Microwaves sit just above radio, with wavelengths of a few centimetres. Wi-fi, Bluetooth and mobile phones live here. So does a microwave oven, which uses waves of about 12 centimetres to shake the water molecules in food until it heats up. The oven uses roughly a thousand times more power than a wi-fi router, and its metal box and mesh door keep the waves inside.',
      looksLike: {
        title: 'Inside a microwave oven',
        src: 'img/real/microwave-oven.png',
        alt: 'Photo of a microwave oven with a bowl of food glowing behind a small-holed metal mesh door',
        caption: 'The little holes in the door are much smaller than the waves, so the light from the lamp gets out but the microwaves do not.',
      },
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'Same kind of wave, very different jobs',
          columns: ['Device', 'Frequency', 'Power'],
          rows: [
            ['Wi-fi router', '2.4 or 5 GHz', 'about 0.1 W'],
            ['Bluetooth earbuds', '2.4 GHz', 'about 0.01 W'],
            ['Microwave oven', '2.45 GHz', 'about 1000 W'],
          ],
          highlight: 2,
          tone: 'amber',
        },
      ],
      realLife: 'This is why a running microwave oven can disturb wi-fi: they share nearly the same frequency, and a little of the oven\'s power leaks out.',
    },
    {
      caption:
        'Infrared is the heat you feel from a fire or a warm hand. Every warm object gives it off, and special cameras turn it into a picture. Next comes visible light, the narrow band our eyes evolved to use because the Sun gives out so much of it. The colours of the rainbow are just different wavelengths: red long, violet short.',
      looksLike: {
        title: 'A hand seen by a thermal camera',
        src: 'img/real/thermal-camera.png',
        alt: 'Photo of a handheld thermal camera showing a warm orange hand against a cool dark blue background',
        caption: 'Warmer things give out more infrared. The camera shows it as false colours: orange is warm, blue is cool.',
      },
      cards: [{ kind: 'viz', viz: 'spectrum', highlight: [2, 3] }],
    },
    {
      caption:
        'Past violet come the waves that carry so much energy per wiggle that they can damage living cells. Ultraviolet gives sunburn. X-rays pass through soft tissue and are stopped by bone, which is why hospitals use them. Gamma rays come from nuclear reactions and space. The rule is simple: the higher the frequency, the more energy each wave carries, and the more careful you must be.',
      cards: [
        { kind: 'viz', viz: 'spectrum', highlight: [4, 5, 6] },
        {
          kind: 'viz',
          viz: 'bars',
          title: 'Energy carried by each wiggle (very rough, made to compare)',
          items: [
            { label: 'Wi-fi', value: 2, text: 'tiny', tone: 'green' },
            { label: 'Visible light', value: 25, text: 'bigger', tone: 'amber' },
            { label: 'Ultraviolet', value: 55, text: 'can burn skin', tone: 'violet' },
            { label: 'X-rays', value: 100, text: 'can damage cells', tone: 'red' },
          ],
          max: 100,
        },
      ],
      realLife: 'The bar lengths are only for comparing. Wi-fi really is far lower in energy per wave: its waves cannot knock electrons out of atoms, so they cannot cause sunburn or damage DNA the way ultraviolet and X-rays can.',
    },
    {
      caption:
        'How did anyone find out these invisible waves exist? In the 1880s Heinrich Hertz built a spark gap, two brass balls with a tiny gap between them. A spark jumping across it should send out a wave. Across the room he placed a loop of wire with its own tiny gap. When the first spark jumped, a small spark also jumped in the loop, with no wire between them. Something invisible had crossed the room.',
      looksLike: {
        title: 'A Hertz-style experiment',
        src: 'img/real/hertz-experiment.png',
        alt: 'Photo of old brass equipment on a wooden table: two brass spheres on a stand on the left and a large thin wire ring on a small stand on the right',
        caption: 'The brass balls send the wave, and the wire ring on the right is the detector. The ring is cut by a tiny gap where the second spark appeared.',
      },
      cards: [
        {
          kind: 'viz',
          viz: 'sequence',
          actors: ['Spark gap', 'The room', 'Wire loop'],
          messages: [
            { from: 0, to: 1, text: 'a spark sends out a wave', tone: 'amber', note: 'no wires between the two' },
            { from: 1, to: 2, text: 'the wave arrives: a tiny spark jumps the loop gap', tone: 'green', note: 'detected, at the speed of light' },
          ],
        },
      ],
      realLife: 'Hertz also showed these waves bounce, bend and travel at the speed of light, which proved they were the same thing as light. The unit hertz is named after him.',
    },
  ],

  sandbox: {
    type: 'wave',
    intro: 'Drag the three sliders and watch the wave. Then pick what carries the message and flip the bits.',
    goalText: 'Change the frequency, the height and the degree one at a time. Then send the same message by height (AM), by frequency (FM) and by degree (PM).',
  },

  quiz: [
    {
      type: 'choice',
      q: 'Which pair of words are all used to describe a wave?',
      options: ['Wavelength and frequency', 'Voltage and resistance', 'Pixel and byte', 'Port and packet'],
      answer: 0,
      why: 'Wavelength is the length of one up and down. Frequency is how many of them happen every second.',
    },
    {
      type: 'choice',
      q: 'A wave has a short wavelength. What can you say about its frequency?',
      options: ['It is high', 'It is low', 'It is zero', 'It cannot be known'],
      answer: 0,
      why: 'All these waves travel at the same speed, so the shorter each wave is, the more of them pass every second.',
    },
    {
      type: 'choice',
      q: 'What is visible light?',
      options: ['A narrow slice of the electromagnetic spectrum', 'A different thing from radio waves', 'The only kind of electromagnetic wave', 'A sound wave'],
      answer: 0,
      why: 'Light, radio, microwaves and X-rays are all electromagnetic waves. They differ only in wavelength and frequency.',
    },
    {
      type: 'choice',
      q: 'Why can a microwave oven disturb a nearby wi-fi connection?',
      options: ['They use nearly the same frequency, and some oven power leaks out', 'The oven cuts the cable', 'Microwaves are visible light', 'The oven uses Bluetooth'],
      answer: 0,
      why: 'The oven works at about 2.45 GHz, right in the 2.4 GHz wi-fi band, and it is about a thousand times more powerful.',
    },
    {
      type: 'choice',
      q: 'Why are X-rays more dangerous than wi-fi waves?',
      options: ['Each wave carries far more energy, enough to damage cells', 'They are slower', 'They are made by routers', 'They are visible'],
      answer: 0,
      why: 'Energy per wave grows with frequency. X-rays have enough to break molecules in living tissue; wi-fi does not.',
    },
    {
      type: 'choice',
      q: 'In Hertz\'s experiment, what showed that a wave had crossed the room?',
      options: ['A tiny spark jumped across the gap in the distant wire loop', 'A bell rang', 'A lamp lit up on the ceiling', 'A wire was heated'],
      answer: 0,
      why: 'No wire joined the two devices, so the energy in the second spark had to travel through the air as a wave.',
    },
    {
      type: 'match',
      q: 'Match each wave to something that uses it.',
      items: [
        { id: 'radio', label: 'Radio waves' },
        { id: 'micro', label: 'Microwaves' },
        { id: 'ir', label: 'Infrared' },
        { id: 'xray', label: 'X-rays' },
      ],
      targets: [
        { id: 'a', label: 'Television, radio, telescopes' },
        { id: 'b', label: 'Wi-fi, Bluetooth, ovens' },
        { id: 'c', label: 'Thermal cameras, heat from a fire' },
        { id: 'd', label: 'Hospital bone scans' },
      ],
      answer: { radio: 'a', micro: 'b', ir: 'c', xray: 'd' },
      why: 'Each part of the spectrum is useful for something different, depending on how it passes through walls, air and bodies.',
    },
  ],

  recap: [
    'A wave carries energy without carrying matter along. Wavelength is the length of one up and down, frequency is how many happen every second.',
    'Light, radio, microwaves, infrared, ultraviolet, X-rays and gamma rays are all the same kind of wave, electromagnetic waves, in different sizes. Together they form the spectrum.',
    'Longer wavelength means lower frequency and lower energy per wave. Wi-fi and Bluetooth are microwaves in the radio end and are low in energy.',
    'Very high frequencies (ultraviolet, X-rays, gamma rays) can damage cells. Low ones like wi-fi cannot.',
    'Hertz proved invisible waves exist by making a spark in one place and detecting another spark across the room.',
  ],
});
