# Tech Learning

Static, no-build vanilla JS app (global `window.TL`). Open `index.html`; there is no bundler. Lessons live in `content/<chapter-id>/*.js` (chapter ids: `computer`, `network`, `ai`, `electricity`, `components`) and are registered with `TL.registerLesson(...)`; topics, chapters and parts are listed in `content/topics.js` (a topic holds chapters, a chapter holds lessons or parts); every lesson script must also be added to `index.html`.

## Verifying changes

- `node --check <file>` for each edited JS file.
- `node scripts/check-content.js` renders every step's cards with a fake DOM and checks viz types and that cover/`looksLike` images exist. It must end with `0 problems`.
- Step `cards` can hold extra visuals (`bits`, `memory`, `pixels`, `record`, `table`, `layers`, `code`, `bars`, `encode`, `sequence`, `vector`, `circuit`); the field reference is the header comment of `js/engine/visuals.js`.

## Images: when to generate

- Every lesson needs a cover image at `img/lessons/<lesson-id>.png`, referenced by `cover: 'img/lessons/<lesson-id>.png'` in the lesson object. Without it the lesson intro screen is empty.
- Generate one whenever you add a new lesson (before reporting the work as done), and whenever `check-content.js` reports `MISSING cover`. Also check lessons added by others: every id in `content/topics.js` should have a matching file in `img/lessons/`.
- Chapter covers live in `img/chapters/<chapter-id>.png` (`cover` on the chapter in `topics.js`). Topic covers (shown on the home topic selector) live in `img/topics/<topic-id>.png` (`cover` on the topic); a new topic needs one, same command and style.
- Optional per-step pictures use `looksLike: { title, src, alt, caption }` in a step (one per step; it shows a "see what it looks like" button). Use them for real-world objects a learner can picture: cables, data centres, chips. Photos live in `img/real/<name>.png`, same command as below with `--out img/real/<name>.png` and the prompt `<subject>. Photorealistic documentary-style photograph, natural lighting, sharp detail, no text, no letters, no logos, no watermark.`

## Images: how to generate

Needs `OPENAI_API_KEY` in `.env` at the project root (never commit or print it). Run from the project root:

```
node scripts/generate-image.js "<prompt>" --model gpt-image-2 --size 2048x1152 --quality medium --out img/lessons/<lesson-id>.png
```

- Always use `--model gpt-image-2`, `--size 2048x1152` (wide banner), `--quality medium`. (`gpt-image-1` does not support this size.)
- Prompt = `Lesson cover image. Theme: <what the lesson is about>. <one concrete scene: the 2-3 objects that explain the idea, how they connect, and what flows between them>.` followed by the shared style, kept identical across lessons so covers look like a set:
  `Cinematic polished 3D render, dark navy night background, cyan and magenta neon data lines with glowing packet dots, no text, no letters, no numbers, no logos, no watermark, wide banner composition.`
- Describe symbols instead of words (abstract line glyphs, padlock, tokens); the model garbles text, so never ask for any.
- After generating, open the PNG (Read tool) to check it: no readable text, subject matches the lesson, nothing important cut off at the edges (the UI overlays the title/centre). Regenerate with a tweaked prompt if not.
- Do not use browser tools to preview; they hang in this setup.

## Working notes

- Other sessions may edit this folder at the same time: make small targeted edits and re-read a file right before editing it.
- No emojis in content or code. Keep lesson text short, beginner-friendly and accurate; add a `realLife` note when a simplification matters.
