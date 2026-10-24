TL.registerLesson({
  id: 'components-microcontroller',
  title: 'Microcontrollers: the brain of a robot',
  hook: 'A robot reads its sensors, makes a decision and moves its motors, all by itself. Which part does the thinking?',
  cover: 'img/lessons/components-microcontroller.png',

  steps: [
    {
      caption:
        'A microcontroller is a tiny computer on one chip, built to control a device. Like the computer in the first chapter it has a processor and memory, but it also has pins that connect straight to the outside world: it can read a voltage on one pin and switch another pin on or off. It runs one program, over and over, from the moment it gets power.',
      looksLike: {
        title: 'A microcontroller board',
        src: 'img/real/microcontroller-board.png',
        alt: 'Photo of a small microcontroller development board with a black chip, rows of header pins and a USB connector, next to a breadboard with jumper wires',
        caption: 'A hobby board. The black chip is the microcontroller. The rows of pins on the edge are where you connect sensors and motors, and the USB plug loads the program.',
      },
      cards: [
        [
          { t: 'Processor', sub: 'runs the program', tone: 'cyan' },
          { t: 'Memory', sub: 'holds the program and data', tone: 'amber' },
          { t: 'Pins', sub: 'read and control the world', tone: 'green' },
        ],
      ],
      realLife: 'A computer runs many programs and has a screen and a disk. A microcontroller has one job and is small, cheap and uses very little power. A washing machine, a remote and a toy each have one.',
    },
    {
      caption:
        'The pins come in a few kinds. A digital pin reads or sends a simple yes or no: high (about 5 V or 3.3 V) or low (0 V). An analog input measures a voltage and turns it into a number, which is how a potentiometer or an infrared distance sensor is read. Some pins can also make a PWM signal, to set a motor speed or a servo angle.',
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'Kinds of pin',
          columns: ['Pin', 'What it does', 'Example'],
          rows: [
            ['Digital output', 'sets a pin high or low', 'turn an LED on, switch a transistor'],
            ['Digital input', 'reads high or low', 'is a button pressed?'],
            ['Analog input', 'reads a voltage as a number', 'a pot, an IR distance sensor'],
            ['PWM output', 'a fast on and off pattern', 'motor speed, servo angle'],
          ],
          tone: 'cyan',
        },
      ],
      realLife: 'A pin gives only a small current, about 20 mA. For anything bigger, such as a motor, it controls a transistor instead.',
    },
    {
      caption:
        'A robot has the same pattern in all of its parts: sense, think, act. Sensors feed signals into the input pins. The program in the microcontroller decides what to do. Output pins drive the actuators: motors, servos, LEDs. Then it starts again, hundreds or thousands of times a second.',
      cards: [
        [
          { t: 'Sense', sub: 'IR sensor, pot, button', tone: 'cyan' },
          { op: '→' },
          { t: 'Think', sub: 'the microcontroller program', tone: 'amber' },
          { op: '→' },
          { t: 'Act', sub: 'motors, servos, LEDs', tone: 'green' },
          { op: '↺' },
        ],
      ],
    },
    {
      caption:
        'Here is a tiny robot program in the style used by Arduino boards. It reads the infrared distance sensor, turns the number into a voltage and then into centimetres, with the rule from the infrared lesson. If something is closer than 20 cm it stops the motors, otherwise it drives forward. The loop function runs again and again.',
      cards: [
        {
          kind: 'viz',
          viz: 'code',
          file: 'robot.ino',
          lines: [
            'void loop() {',
            { t: '  int raw = analogRead(A0);', tone: 'cyan', note: 'a number from 0 to 1023' },
            { t: '  float volts = raw * 5.0 / 1023;', tone: 'cyan', note: 'back to volts' },
            { t: '  float cm = 27 / volts;', tone: 'amber', note: 'the distance rule' },
            '  if (cm < 20) stopMotors();',
            '  else driveForward();',
            '}',
          ],
        },
      ],
      realLife: 'The program is stored in the chip, so it starts when the power is switched on. To change the behaviour you load a new program through the USB socket.',
    },
    {
      caption:
        'There is a whole family of boards to start with. Arduino boards are simple and popular, and are programmed in a form of C++. The ESP32 adds wifi and Bluetooth. The Raspberry Pi Pico is small and cheap and can use Python. Bigger boards such as the Raspberry Pi are full computers that run an operating system, and are often used next to a microcontroller that handles the motors.',
      cards: [
        {
          kind: 'viz',
          viz: 'table',
          title: 'Boards a beginner meets',
          columns: ['Board', 'Notable for'],
          rows: [
            ['Arduino Uno', 'simple, a huge amount of help online'],
            ['ESP32', 'wifi and Bluetooth built in'],
            ['Raspberry Pi Pico', 'cheap, can be programmed in Python'],
            ['Raspberry Pi', 'a full computer, runs Linux'],
          ],
          tone: 'violet',
        },
      ],
    },
  ],

  quiz: [
    {
      type: 'choice',
      q: 'What is a microcontroller?',
      options: ['A tiny computer on one chip that can read and control pins', 'A very small battery', 'A kind of motor', 'A type of sensor'],
      answer: 0,
      why: 'It has a processor, memory and pins, and runs one program for a device.',
    },
    {
      type: 'choice',
      q: 'Which pin type reads a voltage from a potentiometer as a number?',
      options: ['An analog input', 'A digital output', 'A PWM output', 'A power pin'],
      answer: 0,
      why: 'An analog input measures a voltage and turns it into a number such as 0 to 1023.',
    },
    {
      type: 'choice',
      q: 'Why does a robot not drive a motor straight from a pin?',
      options: ['A pin gives only about 20 mA, so a transistor or driver handles the motor current', 'A motor has too few wires', 'Pins can only read, never write', 'Motors need a screen'],
      answer: 0,
      why: 'The pin sends a small signal, and a transistor or motor driver switches the large current.',
    },
    {
      type: 'choice',
      q: 'What does "sense, think, act" mean for a robot?',
      options: ['Read the sensors, decide in the program, then drive the motors', 'Think first, then switch off', 'Act, then sense, then stop', 'Sense the battery only'],
      answer: 0,
      why: 'Inputs feed the program, and the program drives the outputs, again and again.',
    },
    {
      type: 'choice',
      q: 'In the sample program, what happens when the sensor says an object is 10 cm away?',
      options: ['The motors stop, because 10 is less than 20', 'The robot speeds up', 'The program ends', 'Nothing, the program ignores the sensor'],
      answer: 0,
      why: 'The condition cm < 20 is true, so stopMotors() runs.',
    },
    {
      type: 'match',
      q: 'Match each part of a robot to its role.',
      items: [
        { id: 'sensor', label: 'Infrared distance sensor' },
        { id: 'mcu', label: 'Microcontroller' },
        { id: 'motor', label: 'DC motor' },
      ],
      targets: [
        { id: 'a', label: 'Senses: sends a voltage that tells the distance' },
        { id: 'b', label: 'Thinks: runs the program and decides' },
        { id: 'c', label: 'Acts: turns the wheels' },
      ],
      answer: { sensor: 'a', mcu: 'b', motor: 'c' },
      why: 'Sensor, brain and actuator: the three roles of every robot.',
    },
  ],

  recap: [
    'A microcontroller is a small computer on one chip, with pins that connect to the real world.',
    'Pins can be digital in or out, analog inputs that read a voltage, or PWM outputs.',
    'A robot repeats: sense, think, act.',
    'The program runs in a loop, reads the sensors and drives the motors through transistors or drivers.',
    'Arduino, ESP32 and Pico are common boards to start with.',
  ],
});
