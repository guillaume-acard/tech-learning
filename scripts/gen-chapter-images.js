const fs = require('fs');
const path = require('path');

async function genOne({ outPath, prompt, size = '1536x1024' }) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY not set');

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
  const base = 'img/chapters';
  const commonStyle = [
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
    outPath: `${base}/computer.png`,
    prompt: `Chapter cover image. Theme: how a computer works. Show a stylized computer: CPU, RAM, disk and screen connected with glowing lines, simple icons. ${commonStyle}.`,
  });

  await genOne({
    outPath: `${base}/network.png`,
    prompt: `Chapter cover image. Theme: networks and the internet. Show a home router in the center connected to devices (laptop, phone, TV) and then to a globe/cloud, with packet dots traveling. ${commonStyle}.`,
  });

  await genOne({
    outPath: `${base}/ai.png`,
    prompt: `Chapter cover image. Theme: AI and language models. Show a stylized neural network / brain made of nodes and links, plus an abstract language token stream (blocks) with probability bars. ${commonStyle}.`,
  });
})();