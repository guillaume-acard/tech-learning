window.TL = window.TL || {};

// Cable hubs and simplified cable corridors for the `worldmap` visual. Waypoints are [lon, lat];
// a longitude above 180 means "east of the date line" so Pacific routes can cross the map edge.
// side = where the label sits (r, l, t, b).
TL.worldHubs = {
  nyc: { n: 'New York', p: [-74, 40.4], side: 'l' },
  mia: { n: 'Miami', p: [-80.2, 25.8], side: 'l' },
  lax: { n: 'Los Angeles', p: [-118.4, 33.8], side: 'l' },
  ore: { n: 'Oregon', p: [-123.9, 45.5], side: 'l' },
  hnl: { n: 'Hawaii', p: [-157.9, 21.3], side: 'b' },
  scl: { n: 'Chile', p: [-71.6, -33], side: 'r' },
  for: { n: 'Fortaleza', p: [-38.5, -3.7], side: 'r' },
  lis: { n: 'Portugal', p: [-9.4, 38.7], side: 'l' },
  uk: { n: 'UK', p: [-4.5, 50.8], side: 'l' },
  mrs: { n: 'Marseille', p: [5.4, 43.3], side: 't' },
  alx: { n: 'Egypt', p: [29.9, 31.2], side: 't' },
  suz: { n: '', p: [32.5, 29.9], side: 'r' },
  dji: { n: 'Djibouti', p: [43.1, 11.6], side: 'r' },
  fuj: { n: 'UAE', p: [56.4, 25.1], side: 't' },
  mum: { n: 'Mumbai', p: [72.8, 19], side: 'r' },
  sin: { n: 'Singapore', p: [104.1, 1], side: 'b' },
  hkg: { n: 'Hong Kong', p: [114.2, 22.3], side: 'r' },
  tyo: { n: 'Tokyo', p: [140.5, 35.2], side: 'r' },
  gum: { n: 'Guam', p: [144.8, 13.4], side: 'r' },
  per: { n: 'Perth', p: [114.9, -32], side: 'l' },
  syd: { n: 'Sydney', p: [151.6, -33.9], side: 'r' },
  akl: { n: 'Auckland', p: [175.6, -36.6], side: 'b' },
  lag: { n: 'Lagos', p: [3.4, 5.5], side: 'r' },
  dkr: { n: 'Dakar', p: [-17.4, 14.7], side: 'l' },
  lua: { n: 'Angola', p: [13.2, -8.8], side: 'r' },
  cpt: { n: 'Cape Town', p: [18.2, -34], side: 'r' },
  mba: { n: 'Mombasa', p: [40.1, -4], side: 'r' },
  val: { n: 'Ireland', p: [-10.3, 51.9], side: 'l' },
  tri: { n: 'Newfoundland', p: [-53, 48], side: 'b' },
  brt: { n: 'France', p: [-4.3, 47.8], side: 'b' },
};

TL.worldGroups = {
  atlantic: { label: 'Atlantic', tone: 'cyan' },
  pacific: { label: 'Pacific', tone: 'violet' },
  eurasia: { label: 'Europe to Asia', tone: 'amber' },
  africa: { label: 'Around Africa', tone: 'green' },
  asia: { label: 'Asia and Australia', tone: 'red' },
  telegraph: { label: '1858 telegraph cable', tone: 'amber' },
  tat8: { label: 'TAT-8 fibre cable, 1988', tone: 'cyan' },
};

TL.worldRoutes = [
  { g: 'telegraph', ends: ['val', 'tri'], pts: [[-10.3, 51.9], [-25, 52], [-40, 50], [-53, 48]] },
  { g: 'tat8', ends: ['nyc', 'uk'], pts: [[-74, 40.4], [-68, 38], [-45, 43], [-20, 48], [-8, 49.2], [-4.5, 50.8]] },
  { g: 'tat8', ends: ['brt'], pts: [[-20, 48], [-8, 47.3], [-4.3, 47.8]] },

  { g: 'atlantic', ends: ['nyc', 'uk'], pts: [[-74, 40.4], [-68, 38.5], [-45, 44], [-25, 49.5], [-10, 50.3], [-4.5, 50.8]] },
  { g: 'atlantic', ends: ['nyc', 'lis'], pts: [[-74, 40.4], [-68, 38], [-40, 38.5], [-20, 39.5], [-9.6, 38.7]] },
  { g: 'atlantic', ends: ['mia', 'for'], pts: [[-80.2, 25.8], [-76, 25], [-66, 21], [-55, 12], [-45, 2], [-38.5, -3.7]] },
  { g: 'atlantic', ends: ['for', 'lis'], pts: [[-38.5, -3.7], [-30, 5], [-22, 20], [-16, 30], [-11, 37], [-9.6, 38.7]] },
  { g: 'atlantic', ends: ['for', 'lua'], pts: [[-38.5, -3.7], [-30, -5], [-10, -8], [12, -8.8]] },

  { g: 'eurasia', ends: ['uk', 'lis'], pts: [[-4.5, 50.8], [-8, 48], [-11, 43], [-10.5, 39], [-9.6, 38.7]] },
  { g: 'eurasia', ends: ['lis', 'mrs'], pts: [[-9.6, 38.7], [-10, 36.4], [-5.6, 35.95], [0, 37.2], [3, 39.5], [5.4, 43.3]] },
  { g: 'eurasia', ends: ['mrs', 'alx'], pts: [[5.4, 43.3], [6, 39], [9, 38], [11.8, 36.2], [18, 34.5], [25, 33.5], [29.9, 31.2]] },
  { g: 'eurasia', ends: ['alx', 'suz'], land: true, pts: [[29.9, 31.2], [32.5, 29.9]] },
  { g: 'eurasia', ends: ['suz', 'dji'], pts: [[32.6, 29.9], [33, 29.2], [33.6, 28.2], [35, 26.5], [36, 24.5], [38.6, 20], [40.8, 15.5], [42.6, 13.6], [43.7, 12.1], [43.1, 11.6]] },
  { g: 'eurasia', ends: ['dji', 'fuj'], pts: [[43.1, 11.6], [48, 12.5], [54, 14.5], [60, 18], [61, 23], [58, 24.8], [56.4, 25.1]] },
  { g: 'eurasia', ends: ['fuj', 'mum'], pts: [[56.4, 25.1], [60, 23.5], [66, 21], [72.8, 19]] },
  { g: 'eurasia', ends: ['mum', 'sin'], pts: [[72.8, 19], [72, 14], [76, 6.5], [81, 5], [90, 6], [95, 6.5], [98, 5.8], [100.1, 3.2], [102, 1.8], [104.1, 1]] },

  { g: 'africa', ends: ['lis', 'dkr', 'lag'], pts: [[-9.6, 38.7], [-14, 30], [-20, 20], [-18, 14.7], [-16, 8], [-8, 2], [3.4, 2], [3.4, 5.5]] },
  { g: 'africa', ends: ['lag', 'cpt'], pts: [[3.4, 5.5], [3, 2], [8, -3], [10, -10], [11, -17], [13, -27], [16, -33], [17.2, -34], [18.2, -34]] },
  { g: 'africa', ends: ['mum', 'mba'], pts: [[72.8, 19], [66, 10], [55, 0], [45, -3], [40.1, -4]] },
  { g: 'africa', ends: ['mba', 'cpt'], pts: [[40.1, -4], [41.5, -9], [42, -14], [40, -20], [37, -27], [32.5, -31], [26, -35.5], [20, -36.2], [17.5, -35.2], [17.2, -34], [18.2, -34]] },
  { g: 'africa', ends: ['mba', 'dji'], pts: [[40.1, -4], [44, -2], [49.5, 2], [52.6, 10.5], [51.5, 13], [45, 12.2], [43.1, 11.6]] },

  { g: 'asia', ends: ['sin', 'hkg'], pts: [[104.1, 1], [106, 3], [108, 6], [111, 12], [114, 18], [114.2, 22.3]] },
  { g: 'asia', ends: ['hkg', 'tyo'], pts: [[114.2, 22.3], [119, 21], [123, 21], [128, 25], [135, 32], [140.5, 35.2]] },
  { g: 'asia', ends: ['sin', 'per'], pts: [[104.1, 1], [106.5, -3.5], [106.2, -6.1], [106, -8], [108, -11], [112, -16], [111.5, -26], [113, -32], [114.9, -32]] },
  { g: 'asia', ends: ['per', 'syd'], pts: [[114.9, -32], [113.5, -33.5], [114.5, -37], [125, -37.5], [140, -38.8], [146, -40], [150, -38.5], [151.6, -34]] },

  { g: 'pacific', ends: ['tyo', 'ore'], pts: [[140.5, 35.2], [150, 37], [170, 41], [190, 44], [215, 45], [236.1, 45.5]] },
  { g: 'pacific', ends: ['lax', 'hnl', 'gum', 'tyo'], pts: [[241.6, 33.8], [225, 29], [202.1, 21.3], [185, 17], [162, 14], [144.8, 13.4], [143, 20], [141.5, 28], [140.5, 35.2]] },
  { g: 'pacific', ends: ['hnl', 'akl'], pts: [[202.1, 21.3], [198, 8], [192, -8], [183, -22], [179, -31], [175.6, -36.6]] },
  { g: 'pacific', ends: ['akl', 'syd'], pts: [[175.6, -36.6], [176, -34], [170, -33.5], [160, -33.5], [155, -33.5], [151.6, -33.9]] },
  { g: 'pacific', ends: ['lax', 'scl'], pts: [[241.6, 33.8], [240, 31], [243, 24], [252, 14], [265, 5], [275, -5], [280, -15], [284, -25], [287.5, -31.5], [288.4, -33]] },
];
