#!/usr/bin/env node
// Usage: node scripts/generate-image.js "a prompt" [--out img/foo.png] [--size 1536x1024]
//        [--quality low|medium|high|auto] [--n 1] [--model gpt-image-1] [--background transparent|opaque|auto]
// Reads OPENAI_API_KEY from .env in the project root (or the environment).

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function loadEnv() {
  const file = path.join(ROOT, '.env');
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*(?:export\s+)?([\w.]+)\s*=\s*(.*?)\s*$/);
    if (!m || line.trim().startsWith('#')) continue;
    let val = m[2];
    if (/^(['"]).*\1$/.test(val)) val = val.slice(1, -1);
    if (!(m[1] in process.env)) process.env[m[1]] = val;
  }
}

function parseArgs(argv) {
  const opts = { size: '1024x1024', quality: 'auto', n: 1, model: 'gpt-image-1', out: null, background: null };
  const words = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '-h' || a === '--help') opts.help = true;
    else if (a.startsWith('--')) {
      const key = a.slice(2);
      if (!(key in opts)) throw new Error(`Unknown option: ${a}`);
      opts[key] = argv[++i];
    } else words.push(a);
  }
  opts.n = parseInt(opts.n, 10);
  opts.prompt = words.join(' ').trim();
  return opts;
}

function slug(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'image';
}

async function main() {
  loadEnv();
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help || !opts.prompt) {
    console.log('Usage: node scripts/generate-image.js "prompt" [--out path.png] [--size 1024x1024|1536x1024|1024x1536|auto]\n' +
      '       [--quality low|medium|high|auto] [--n 1] [--model gpt-image-1] [--background transparent|opaque|auto]');
    process.exit(opts.help ? 0 : 1);
  }

  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY not set. Add it to .env in the project root.');

  const body = { model: opts.model, prompt: opts.prompt, size: opts.size, quality: opts.quality, n: opts.n };
  if (opts.background) body.background = opts.background;

  console.log(`Generating ${opts.n} image(s) with ${opts.model} (${opts.size}, ${opts.quality})...`);
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`Image API failed (${res.status}): ${json?.error?.message ?? JSON.stringify(json)}`);

  const images = json.data ?? [];
  if (!images.length) throw new Error('No images returned');

  const base = opts.out
    ? path.resolve(opts.out)
    : path.join(ROOT, 'img', 'generated', `${slug(opts.prompt)}-${Date.now()}.png`);
  fs.mkdirSync(path.dirname(base), { recursive: true });

  images.forEach((img, i) => {
    if (!img.b64_json) throw new Error('Response had no b64_json data');
    const ext = path.extname(base) || '.png';
    const file = images.length > 1 ? base.slice(0, base.length - ext.length) + `-${i + 1}${ext}` : base;
    fs.writeFileSync(file, Buffer.from(img.b64_json, 'base64'));
    console.log('Wrote', path.relative(process.cwd(), file));
  });
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
