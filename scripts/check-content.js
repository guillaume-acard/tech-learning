// Loads every lesson with a tiny fake DOM and renders every step's cards, to catch bad visual specs.
// Usage: node scripts/check-content.js
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');

class FakeNode {
  constructor(tag) { this.tag = tag; this.children = []; this.nodeType = 1; this.attrs = {}; this.firstChild = null; }
  setAttribute(k, v) { this.attrs[k] = v; }
  addEventListener() {}
  append(...k) { k.forEach((c) => this.children.push(c)); this.firstChild = this.children[0] || null; }
  removeChild(c) { this.children = this.children.filter((x) => x !== c); this.firstChild = this.children[0] || null; }
}
global.document = {
  createElement: (t) => new FakeNode(t),
  createElementNS: (n, t) => new FakeNode(t),
  createTextNode: (d) => ({ nodeType: 3, data: String(d) }),
  documentElement: {},
};
global.getComputedStyle = () => ({ getPropertyValue: () => '' });
global.window = global;
global.setTimeout = () => 0;
global.matchMedia = () => ({ matches: false });

const load = (f) => new Function(fs.readFileSync(path.join(root, f), 'utf8')).call(global);
['js/util.js', 'js/engine/visuals.js', 'js/engine/worldmap-data.js', 'js/engine/worldmap-routes.js', 'js/engine/worldmap.js', 'js/engine/cards.js', 'content/chapters.js'].forEach(load);
const TL = global.TL;

// Scene files reference browser-only classes lazily; lesson files only need TL.registerLesson and scene globals.
const sceneFiles = ['content/chapter-1/computer-scene.js', 'content/chapter-2/home-scene.js', 'content/chapter-2/web-scenes.js', 'content/chapter-3/ai-scenes.js'];
sceneFiles.forEach((f) => load(f));
TL.chapters.forEach((c) => {
  const dir = path.join(root, 'content', c.id.replace('ch', 'chapter-'));
  fs.readdirSync(dir).filter((f) => f.endsWith('.js') && !/scene/.test(f)).forEach((f) => load(path.relative(root, path.join(dir, f))));
});

let problems = 0;
let visuals = 0;
const fail = (m) => { problems++; console.log(m); };
TL.chapters.forEach((c) => c.lessons.forEach((id) => { if (!TL.lessons[id]) fail(`Chapter ${c.id} lists unknown lesson ${id}`); }));
Object.values(TL.lessons).forEach((l) => {
  l.steps.forEach((s, i) => {
    try {
      TL.renderCards(new FakeNode('div'), s.cards);
      (Array.isArray(s.cards) ? s.cards : []).forEach((r) => {
        if (r && r.kind === 'viz') {
          visuals++;
          if (!TL.visuals[r.viz] && r.viz !== 'vectors' && r.viz !== 'vectors3d') fail(`${l.id} step ${i + 1}: unknown viz "${r.viz}"`);
        }
      });
    } catch (e) {
      fail(`FAIL ${l.id} step ${i + 1}: ${e.message}`);
    }
    if (s.looksLike && s.looksLike.src && !fs.existsSync(path.join(root, s.looksLike.src))) fail(`MISSING image ${s.looksLike.src}`);
  });
  if (l.cover && !fs.existsSync(path.join(root, l.cover))) fail(`MISSING cover ${l.cover}`);
});
console.log(`${Object.keys(TL.lessons).length} lessons, ${visuals} viz rows, ${problems} problems`);
process.exit(problems ? 1 : 0);
