const fs = require('fs');
const path = require('path');

async function genOne({ outPath, prompt, size = '2048x1152' }) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY not set');
  if (!key.startsWith('sk-')) {
    throw new Error(\"OPENAI_API_KEY must be a platform API key (sk-...). This script does not use Codex device login.\");
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

  // Lesson cover images (Chapter 2)
  await genOne({
    outPath: 'img/lessons/ch2-https.png',
    prompt:
      `Lesson cover image. Theme: HTTPS and secure web browsing. Show a glowing encrypted tunnel between a laptop/browser and a web server, with a padlock symbol integrated into the tunnel. ${style}.`,
  });

  await genOne({
    outPath: 'img/lessons/ch2-capstone.png',
    prompt:
      `Lesson cover image. Theme: network recap / mission complete. Show a home router connected to devices (laptop, phone, TV) and to the internet cloud/globe, with multiple small packet dots traveling and a subtle checkmark-like completion symbol. ${style}.`,
  });

  // Photorealistic “looks like” images (real objects)
  await genOne({
    outPath: 'img/real/hdmi.png',
    prompt:
      'Photorealistic product-style photo of a modern HDMI cable (both connectors visible), on a clean neutral background, soft studio lighting, sharp focus, no text, no logos, no watermark.',
  });

  await genOne({
    outPath: 'img/real/cell-tower.png',
    prompt:
      'Photorealistic photo of a 4G/5G mobile phone tower (cell tower) outdoors, daylight, clear details of antennas, realistic sky background, no text, no logos, no watermark.',
  });
})().catch((err) => {
  console.error(err);
  process.exit(1);
});