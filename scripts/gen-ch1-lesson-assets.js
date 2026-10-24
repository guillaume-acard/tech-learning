const fs = require('fs');
const path = require('path');

async function genOne({ outPath, prompt, size = '2048x1152' }) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY not set');
  if (!key.startsWith('sk-')) {
    throw new Error("OPENAI_API_KEY must be a platform API key (sk-...). This script does not use Codex device login.");
  }

  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-image-1',
      prompt,
      size,
      n: 1,
      response_format: 'b64_json',
    }),
  });

  const json = await res.json();
  if (!res.ok) {
    const msg = json && json.error ? json.error.message : JSON.stringify(json);
    throw new Error(`Image API failed (${res.status}): ${msg}`);
  }

  const b64 = json.data?.[0]?.b64_json;
  if (!b64) throw new Error('No b64_json image returned');

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, Buffer.from(b64, 'base64'));
  console.log('Wrote', outPath);
}

(async () => {
  const style = [
    'sci-fi control room aesthetic',
    'dark navy background',
    'thin glowing neon lines',
    'cyan and amber highlights',
    'clean diagram-like illustration (but as raster image)',
    'high contrast, minimal noise',
    'no text, no letters, no numbers, no logos, no watermark',
    'wide banner composition with space for UI overlay',
  ].join(', ');

  await genOne({
    outPath: 'img/lessons/ch1-parts.png',
    prompt: `Lesson cover image. Theme: computer parts (CPU, RAM, disk, GPU, keyboard, screen). Show a stylized computer interior with those components connected by glowing data lines. ${style}.`,
  });

  await genOne({
    outPath: 'img/lessons/ch1-keypress.png',
    prompt: `Lesson cover image. Theme: follow a key press. Show a keyboard key press sending a glowing signal through CPU and RAM to a screen where the signal becomes pixels. ${style}.`,
  });

  await genOne({
    outPath: 'img/lessons/ch1-run-program.png',
    prompt: `Lesson cover image. Theme: starting a program. Show a mouse cursor double-clicking an app icon, and a stream of instructions loading from disk into RAM and CPU, with a progress-like glow (no text). ${style}.`,
  });

  await genOne({
    outPath: 'img/lessons/ch1-code.png',
    prompt: `Lesson cover image. Theme: what is code. Show a simple flow of instruction blocks feeding into a CPU/robot-like brain symbol, with branches and loops as glowing paths (no letters). ${style}.`,
  });
})();
