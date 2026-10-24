// A transistor as a tiny electronic switch, used by the transistors lesson.
TL.transistorScene = {
  label: 'A transistor acts as a tiny electronic switch: a control signal changes whether the output is off or on',
  viewBox: [0, 0, 900, 420],
  nodes: {
    control: { x: 130, y: 210, icon: 'keyboard', label: 'Control signal', sub: 'Voltage in', leaf: true },
    transistor: { x: 440, y: 210, icon: 'transistor', label: 'Transistor', sub: 'Tiny switch' },
    output: { x: 760, y: 210, icon: 'ram', label: 'Output', sub: 'Bit: 0 or 1', leaf: true },
  },
  links: [
    { from: 'control', to: 'transistor', type: 'bus', label: 'Control' },
    { from: 'transistor', to: 'output', type: 'bus', label: 'Signal' },
  ],
};
