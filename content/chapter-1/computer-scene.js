// The inside of a computer on one map. Lessons reveal parts of it step by step.
TL.computerScene = {
  label: 'Inside a computer: CPU, RAM, disk, graphics card, Wi-Fi chip, screen, keyboard and mouse',
  viewBox: [0, 0, 1100, 600],
  background: [
    { kind: 'rect', x: 360, y: 170, width: 520, height: 410, rx: 26, fill: 'rgba(10, 24, 44, 0.55)', stroke: 'rgba(56, 232, 255, 0.22)', strokeWidth: 2, label: 'MOTHERBOARD' },
  ],
  nodes: {
    keyboard: { x: 150, y: 100, icon: 'keyboard', label: 'Keyboard', sub: 'Input' },
    mouse: { x: 150, y: 290, icon: 'mouse', label: 'Mouse', sub: 'Input' },
    disk: { x: 150, y: 490, icon: 'disk', label: 'Disk', sub: 'Long-term storage' },
    cpu: { x: 500, y: 290, icon: 'cpu', label: 'CPU', sub: 'The brain' },
    ram: { x: 500, y: 490, icon: 'ram', label: 'RAM', sub: 'Short-term memory' },
    gpu: { x: 740, y: 290, icon: 'gpu', label: 'Graphics card', sub: 'The artist' },
    screen: { x: 990, y: 290, icon: 'screen', label: 'Screen', sub: 'Output' },
    wifi: { x: 740, y: 490, icon: 'wifi', label: 'Wi-Fi chip', sub: 'Wireless link' },
    router: { x: 990, y: 490, icon: 'router', label: 'Router', sub: 'Not in the computer', leaf: true },
  },
  links: [
    { from: 'keyboard', to: 'cpu', type: 'usb', label: 'USB' },
    { from: 'mouse', to: 'cpu', type: 'usb', label: 'USB' },
    { from: 'cpu', to: 'ram', type: 'bus', label: 'Fast path' },
    { from: 'disk', to: 'cpu', type: 'bus', label: 'Storage bus' },
    { from: 'cpu', to: 'gpu', type: 'bus', label: 'Data path' },
    { from: 'gpu', to: 'screen', type: 'hdmi', label: 'Video cable' },
    { from: 'cpu', to: 'wifi', type: 'bus', label: 'Data path' },
    { from: 'wifi', to: 'router', type: 'wifi', label: 'Radio' },
  ],
};

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
