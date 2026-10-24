# Tech Learning

An interactive, visual website that teaches newcomers how computers, the internet and AI work. Every concept is an animated diagram the learner can poke at, followed by a short quiz. Progress and stars are saved in the browser (`localStorage`).

It is a static, no-build vanilla JS app: no bundler, no dependencies, no server.

## Run it

Open `index.html` in a browser. That is all.

## Content

| Chapter | Topic |
|---|---|
| 1 | How a computer works: hardware (CPU, memory, transistors) and software (programs, code, machine code) |
| 2 | How a network and the internet work: home network, URLs, DNS, packets, browsers, security, HTTPS |
| 3 | How AI works: language models, training, prompts, agents, tools, RAG, image generation |

The full product plan is in [SPECS.md](SPECS.md).

## Project layout

```
index.html          entry point; loads every script
css/                styles (style.css, visuals.css)
js/app.js           app shell and routing
js/engine/          scene player, step cards, visuals, code lab, world map
js/labs/            interactive labs (DNS, RSA, URL, next-word, ...)
js/quiz/            quiz system
js/progress.js      progress and stars (localStorage)
content/chapters.js chapter and part list
content/chapter-N/  one script per lesson
img/                chapter covers, lesson covers, real-world photos
scripts/            Node helper scripts (content check, image generation)
```

Everything hangs off a single global, `window.TL`.

## Adding a lesson

1. Create `content/chapter-N/<name>.js` and register it with `TL.registerLesson({ id, title, cover, steps, ... })`.
2. Add the lesson id to its chapter in `content/chapters.js`.
3. Add a `<script>` tag for the file in `index.html`.
4. Add a cover image at `img/lessons/<lesson-id>.png` (see below).

The field reference for step `cards` (bits, memory, table, code, circuit, ...) is the header comment of `js/engine/visuals.js`.

## Checking your changes

```
node --check <file>            # syntax check each edited JS file
node scripts/check-content.js  # renders every step and checks visuals and images
```

`check-content.js` must end with `0 problems`.

## Generating images

Cover images are generated with the OpenAI image API. Copy `.env.example` to `.env`, set `OPENAI_API_KEY` (`.env` is git-ignored), then run from the project root:

```
node scripts/generate-image.js "<prompt>" --model gpt-image-2 --size 2048x1152 --quality medium --out img/lessons/<lesson-id>.png
```

See [CLAUDE.md](CLAUDE.md) for the shared prompt style and image conventions.
