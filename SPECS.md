# Tech Learning: Product Plan

## 1. Vision

An interactive, visual website that teaches newcomers how computers, the internet and AI work. Every concept is an animated diagram the learner can poke at, followed by a quiz that makes it stick.

The signature idea: **start from the learner's own home**. Instead of abstract boxes, Chapter 2 builds a map of the family's real devices (fibre box (router), desktop, laptop, TV, Switch, phones, watch) and follows their data out to the internet.

## 2. Audience and tone

- Primary learner: kids/teens (and adults) who are newcomers to tech. The author's kids are the first testers.
- Language: English only for now. Keep all text in data files, not hard-coded in the logic, so a translation can be added later.
- Tone: friendly, short sentences, analogies first, jargon introduced one word at a time and always attached to a picture.
- Prior knowledge assumed: basic arithmetic and **prime numbers** (no need to explain what a prime is). Nothing else.

## 3. Product principles

1. **Show, don't tell.** Every lesson has an animation before it has a paragraph.
2. **One idea per screen.** Short steps, "Next" to reveal, the learner controls the pace.
3. **Guided, then free.** Each lesson is a guided story followed by a sandbox "try it" scene.
4. **Test to remember.** Each lesson ends with a short quiz; stars reward it.
5. **Honest simplifications.** Simplify, but never say something false. Where the model is simplified, a small "In real life..." note gives the accurate version.
6. **Real-world anchors.** Use the family's real devices and real things (internet provider, 4G, Wi-Fi, HDMI) wherever it helps.

## 4. Learning model

Each lesson follows the same template:

| Step | What it is |
|---|---|
| Hook | One question or scene ("How does the Switch get online?") |
| Guided story | 4 to 8 animated steps, "Next/Back" controls, one caption each |
| Try it | Free-play sandbox on the same diagram with a small goal |
| Quiz | 3 to 5 questions (multiple choice and drag-and-drop on the diagram) |
| Recap | 3 bullet takeaways and the stars earned |

Lessons are short (5 to 10 minutes). Chapters unlock in order but any finished lesson can be replayed.

## 5. Features

### 5.1 Core (v1)

- **Diagram engine**: reusable SVG scene player. Scenes are described in data (nodes, links, steps, captions) and the engine renders them, animates packets and highlights.
- **Step player**: Next/Back/Replay, progress dots, a speed toggle (slow/normal), pause.
- **Packet animation**: small dots/envelopes travelling along links, colour-coded by type of data. Canvas particles only for the "electrons flowing" effects in Chapter 1.
- **Quiz system** (see 5.3).
- **Progress and rewards** (see 5.4).
- **Home map** (Chapter 2 lesson 1, see 6.2).
- **Break-it scenarios**: the learner unplugs/disables things on the home map and watches who loses connection (see 6.2).

### 5.2 Content features

- **Capstone: "What happens when you type a URL?"** The final lesson of Chapter 2 replays a full trip and ties every concept together: DNS, IP, routing, TLS handshake, response coming back.
- **"In real life..." notes**: a collapsible card on lessons where the animation is simplified.

### 5.3 Quiz system

Two formats:

1. **Multiple choice**: one correct answer, instant friendly feedback, a one-line "why" explanation on both right and wrong answers. Wrong answers can be retried; no one is told they "failed".
2. **Drag and drop on the diagram**: examples:
   - Drag each device to the right connection type (Wi-Fi, LAN cable, HDMI, 4G).
   - Put the steps of "type a URL" in the correct order.
   - Match components (CPU, RAM, Disk...) to their job.
   - Place the public key, private key and message in the chest analogy.

Rules: 3 to 5 questions per lesson, questions drawn from a data file, answer options shuffled, keyboard-accessible alternative for every drag-and-drop (click item, then click target).

Scoring: 3 stars per quiz based on first-try correctness (all right = 3, one or two wrong = 2, otherwise 1). Retake any time to improve.

### 5.4 Progress and rewards

- Stars per lesson quiz, one badge per completed chapter.
- Progress stored in the browser (`localStorage`). No accounts, no server, no tracking.
- A simple "My progress" page with the lesson map, stars and badges, and a "reset progress" button.
- Out of scope for now: multiple profiles, printable certificates.

### 5.5 Deferred ideas (not in v1)

- Glossary pop-ups on terms (strong candidate for v2).
- Friendly mascot/narrator.
- Mini-games and "predict what happens" quizzes.
- Additional languages.
- Diffie-Hellman "paint mixing" lesson.

## 6. Content plan

Structure: topics hold chapters, chapters hold lessons. The home page is a topic selector with a cover image per topic; choosing a topic shows its chapters. Chapter numbers are no longer used; the original "Chapter 1/2/3" below are now the chapters `computer`, `network` and `ai` under the topic Computer systems (lesson ids `computer-*`, `network-*`, `ai-*`). A second topic, Electronics, has the chapters `electricity` (voltage, current, power) and `components` (circuits, LEDs, resistors, series and parallel, transistors), with interactive circuit diagrams and the `electric` lab.

Build order: **Chapter 2 first**, then Chapter 1, then Chapter 3. Chapter 2 is the most personal and motivating, and it forces the diagram engine to get built well.

### 6.1 Chapter 1: How a computer works (v2)

Lessons:

1. **The parts and what they do.** Diagram of the inside of a computer: CPU (the brain), RAM (short-term memory / desk), Disk (long-term storage / bookshelf), Graphics card, Screen, Mouse, Keyboard. Hover/tap a part for its job and an everyday analogy.
2. **Follow a keypress.** Press a key on the on-screen keyboard and watch the signal travel: keyboard, CPU, RAM, graphics card, screen. Data/"electrons" flow along the paths.
3. **Run a program.** A tiny program starts: loaded from Disk into RAM, the CPU executes instructions step by step, the graphics card draws, the screen shows. Each step lights up the part involved.
4. **What is code?** Code as a list of instructions the CPU follows. A mini sandbox: arrange 4 to 5 simple instruction blocks and see the result.

Quiz formats: match parts to jobs (drag and drop), multiple choice on "where is it stored when...?".

### 6.2 Chapter 2: How a network and the internet work (v1)

**Part A: The home network.** The map is built device by device, each addition explaining the link and how it reaches the internet.

| Device | Connection | Teaching point |
|---|---|---|
| Fibre box (router/modem) | Optical fibre to the street | Light carries data; the router is the front door of the house, connecting the home to the Internet Service Provider |
| Desktop computer | LAN (Ethernet) cable | Wired = fast, stable, plugged into the router |
| Laptop | Wi-Fi | Radio waves instead of a cable; shares the air with others |
| Smart TV | Wi-Fi | A TV is also a computer on the network (streaming) |
| TV box (cable channels) | Wi-Fi to router, HDMI to the TV | Two different links with different jobs: Wi-Fi carries data, HDMI carries picture and sound only |
| Nintendo Switch | Wi-Fi to router, HDMI to the TV | Same lesson: the network link and the display link are separate |
| Two phones | Wi-Fi at home, 4G outside | Switching networks; phones use mobile cell towers when away from Wi-Fi |
| Smart watch with own SIM | Wi-Fi at home, 4G/SIM outside | A device can have its own mobile connection and does not need the router |

Concepts folded into this part:
- **Local vs public address.** Inside the house each device has a private address (e.g. 192.168.1.x); the outside world sees one public address for the whole house. The router translates (NAT), shown as a receptionist forwarding mail.
- **Wired vs wireless vs video cable** as three kinds of links, colour-coded the same way on every scene.

**Break-it scenarios (sandbox).** Buttons and clickable items: unplug the router, switch off Wi-Fi, unplug the LAN cable, walk phones into the garden (they flip from Wi-Fi to 4G), cut the fibre. The map shows which devices lose internet, which still talk to each other locally (e.g. laptop and TV on the home network), and which are unaffected (watch/phones on 4G). Quiz style: "predict what happens, then try".

**Part B: From your home to a website.**

1. **What is a URL?** Break `https://www.example.com/page` into protocol, domain, path, with colour-coded pieces.
2. **Addresses and the phone book (DNS).** Computers talk with numbers (IP addresses); DNS turns names into numbers. Animated lookup: your router asks the resolver, which asks the root, then the `.com` server, then the site's own server. Simplified to a clear chain.
3. **Packets and routing.** A message is split into numbered packets that hop from the router to the ISP, across several routers, to the server, and the replies come back. Show that packets can take different routes and be reassembled in order. Include a simplified traceroute-style hop list.
4. **Capstone: type a URL and press Enter.** (Placed last in the chapter, after Part C, so it can use HTTPS too.) Full replay linking the whole chapter: device, home router, ISP, DNS, routing, server, response, page appears.

**Part C: Staying secure (HTTPS).**

1. **The problem.** Anyone on the path (Wi-Fi, ISP, routers) could read a message. Show a postcard (open) vs a sealed envelope.
2. **The chests analogy.** The website hands out thousands of open padlocked chests (public key) to anyone. A visitor puts a secret in a chest and snaps it shut; only the website owns the key (private key) that opens it. Interactive: drag the message into a chest, close it, watch a spy fail to open it, the owner opens it.
3. **The maths behind the chests (toy RSA).** Uses prime numbers directly, with no primer on what a prime is:
   - Pick two primes, multiply them: easy. Given only the product, find the primes: very hard once the numbers are large.
   - Toy example with tiny primes (e.g. 3 and 11), a live calculator showing the public key, private key, encrypting a small number and decrypting it back.
   - A "try to crack it" sandbox: small numbers factor instantly, then watch the effort explode as digits are added (illustrating why large primes protect us).
4. **How HTTPS really works.** "In real life..." card: the browser uses this public-key trick only to agree on a shared secret key quickly, then both sides switch to faster symmetric encryption for the actual data. The padlock in the browser, what a certificate is (an ID card for the website, checked by a trusted authority).

Quiz formats: order the steps (drag and drop), match device to connection type (drag and drop), multiple choice on DNS/IP/HTTPS, "predict what happens" with break-it.

### 6.3 Chapter 3: How AI works (v3)

Lessons:

1. **What is an LLM?** A very large "predict the next word" machine. Interactive: the learner sees a sentence, a bar chart of the most likely next words, and picks or samples one, then repeats. Concepts: tokens, probabilities, "training on lots of text". All demos use pre-written/tiny local data, no real API calls.
2. **Why it sometimes gets things wrong.** Short demo of confident but incorrect answers and why predicting text is not the same as knowing facts.
3. **What is an agent?** An agent is a normal program (the "harness") that talks to an LLM that may run on the same machine (local) or on a server (remote). Diagram of the loop: user asks, harness sends the request to the LLM, LLM replies.
4. **Agents and tools.** The LLM asks the harness to use a tool (search, calculator, read a file, send a message); the harness runs it and passes the result back. A scripted step-through of a real-feeling task, then a sandbox where the learner picks which tool the agent should call.

Quiz formats: multiple choice, and drag and drop to label the parts of the agent loop (user, harness, LLM, tool).

## 7. Scope and milestones

| Milestone | Contents | Status |
|---|---|---|
| M0: Foundations | Project skeleton, diagram engine, step player, packet animation, quiz component, progress storage, base styling, one placeholder lesson end to end | Built |
| M1: Chapter 2 Part A | Home map, all devices, break-it scenarios, first quizzes, stars and badge | Built |
| M2: Chapter 2 Parts B and C | URL, DNS, routing, capstone, chests analogy, toy RSA, HTTPS real-life note | Built |
| M3: Test with the kids | Playtest, fix confusing steps, tune speed and wording | Waiting for the author's review and the kids (checklist below) |
| M4: Chapter 1 | Computer internals lessons and quizzes | Built |
| M5: Chapter 3 | LLM and agent lessons and quizzes | Built |
| M6: Polish | Progress page, accessibility pass, mobile layout, performance | Built (code side); visual check pending |

Version 1 means M0 to M3: one fully polished chapter that the kids can play and review.

**Status:** M0 is built (engine, story player, sandbox, three quiz types, stars and badges, one demo lesson "The front door: your router"). It passes a headless end-to-end test. A visual check in a real browser is still pending.

M1 is built and restyled in the sci-fi look. It has one shared home map (11 devices, fibre, 4G tower) and five lessons: the router, TV and games (Wi-Fi vs HDMI), phones and 4G, private vs public addresses (NAT), and "Break the house!" (five break-it scenarios). All pass the headless test: valid data, solvable sandbox goals, correct offline results per scenario, and a full click-through that earns 3 stars and the chapter badge. New engine features: `leaf` end devices, `data:false` links (HDMI), sandbox scenarios and optional sandbox, per-step `broken`, `labels` and `connectivity`.

M4 (Chapter 1) is also built, ahead of M2 at the user's request. One shared computer map (CPU, RAM, disk, graphics card, screen, keyboard, mouse) and four lessons: the parts (click-to-inspect sandbox), follow a key press, start a program, and "What is code?" (instruction-block puzzle with 3 challenges). New engine pieces: `inspect` sandbox mode, `TL.CodeLab` (`sandbox.type: 'code'`), keyboard-accessible devices, new icons and `bus`/`usb` link types. Same headless test passes for all 9 lessons.

M2 (Chapter 2 Parts B and C) is built: 8 new lessons (URL anatomy, DNS, packets and routing, who can read your messages, the chest trick, prime numbers and toy RSA, how HTTPS really works, and the capstone "type a URL and press Enter", shown last on the home page). The home page now groups Chapter 2 into Part A, Part B, Part C and a finale. New engine pieces: `TL.labs` registry (`sandbox.type` url, dns, chest, rsa, code), `TL.renderCards` (text-only lessons with colour cards, no scene), per-step `badges` (padlock, key, chest, certificate icons), `tap` and `trust` link types, per-link `cutNote`, sandbox options `okText`, `cutText`, `noLocal`, `rootName`, and a global `[hidden]` CSS fix. `TL.defaultSpeed` lets tests run animations fast. The headless test (17 lessons, all 3 stars) passes, but nothing has been looked at in a real browser yet: check long node labels, badge placement and lab layouts. Next: M3 playtest with the kids.

M5 (Chapter 3) is built: 4 lessons (what is an LLM, why AI gets things wrong, what is an agent, agents and tools), 21 lessons in total, all passing the headless test with 3 stars. Everything is local and pre-written, with no API calls. New labs: `nextword` (tiny made-up language model, build sentences word by word with a probability bar chart, pick or roll the dice), `judge` (spot the wrong or invented AI answers), `toolpick` (choose which tool the agent should call, or none). The agent lesson reuses the break-it sandbox with a local and a remote model. New scenes `TL.agentScene` and `TL.toolScene`, icons (person, neural, app, wrench, calc, cloud, folder, chat) and link types (chat, model, tool). Quizzes include drag and drop to label user, harness, LLM and tool. As before, the visuals have not been checked in a real browser. Next: M3 playtest with the kids, then M6 polish.

M6 (polish) is built on the code side: a "My progress" page (`#/progress`, linked from the star counter and the home footer) with stars per lesson, a progress bar and badge status per chapter, and the reset button (moved there from the home page). Accessibility: stars have `role="img"` labels, captions and lab status text are `aria-live`, focus moves to the main area when the page or lesson part changes, the page title follows the route, the step dots no longer claim a wrong `tablist` role. Mobile: the lesson grid no longer overflows at 320 px, tighter padding and bigger tap targets under 600 px. Reduced motion was already handled (CSS transitions off, packets skipped). No performance work was needed: no dependencies, no images, and only the current lesson's DOM exists. The headless test also checks the progress page, the reset and the page titles. Still pending: a visual check in a real browser on desktop and phone.

### M3 playtest checklist

For each lesson, watch (do not help) and note:
- Where did they hesitate or ask "what does this mean?" (wording or jargon to fix).
- Did they press Next before finishing the caption (steps too long or too fast; use the speed toggle).
- Could they find the goal of the "Try it" part without being told?
- Which quiz questions did they miss on the first try, and was the "why" enough to teach it?
- Could they explain the lesson in one sentence afterwards (router, IP address, HTTPS, next-word prediction, agent and tools)?
- Anything that looks wrong or cut off: long labels, overlapping icons, text too small on the phone.

## 8. Technical approach

- **Stack**: plain HTML, CSS and JavaScript, SVG for diagrams and CSS/JS animation, `<canvas>` only for particle effects. No build step; static files that can be opened by double-click or hosted on any static host (e.g. GitHub Pages).
- **Classic scripts, not ES modules**: browsers block ES modules and `fetch` on `file://` pages, so all code is loaded with plain `<script>` tags in `index.html` and shares one `window.TL` namespace. Content is `.js` files that call `TL.registerLesson({...})`, not JSON.
- **Data-driven content**: lessons, scenes, captions and quiz questions live in data files. The engine renders them. Adding a lesson means adding a content file and one `<script>` line plus an entry in `content/topics.js`, not new engine code.
- **Structure (as built in M0)**:
  - `index.html`: loads everything; the app is a single page using `#/lesson/<id>` routes
  - `css/style.css`: all styles and the link-type colours
  - `js/util.js`, `js/progress.js`: DOM helpers, localStorage wrapper
  - `js/engine/`: `icons.js` (device icons and link types), `scene.js` (SVG scene, packets, pathfinding, connectivity), `player.js` (story steps), `sandbox.js` (break-it mode)
  - `js/quiz/quiz.js`: multiple choice, match (drag and drop) and order questions
  - `js/app.js`: home page, lesson flow, recap
  - `content/topics.js` and `content/<chapter-id>/*.js`: topic and chapter list, lesson data
- **Visual consistency**: one palette and one icon set for the whole site; one colour/line style per link type (fibre, LAN cable, Wi-Fi, HDMI, 4G) used in every scene.
- **Accessibility and comfort**: keyboard operable, readable contrast, captions for every animation step, respects `prefers-reduced-motion` (steps shown statically), works on tablets and phones.
- **No external dependencies** in v1 (or at most a tiny drag-and-drop helper if hand-rolling proves painful).
- **No tracking, no accounts, no backend.**

## 9. Success criteria

- A child can complete Chapter 2 without help and explain, in their own words, what a router does, what an IP address is, and why HTTPS keeps messages private.
- Quiz stars improve on replay, showing that the learner is actually learning.
- Adding a new lesson takes data only, not engine changes.
- The site runs from static files with no setup.

## 10. Decisions

- **Home map privacy**: real devices and a named provider are fine, even if published. Keep it to device types and the provider name; no addresses or personal data.
- **Hosting**: local files only for v1. The code stays static-hosting friendly so publishing later needs no changes.
- **Chapter 3 depth**: next-word demo only (tokens, probabilities, why it can be wrong). No training or attention lessons.
- **Look and feel**: sci-fi control-room style, less cartoon. Dark navy background with a faint grid, thin glowing neon lines, monospace headings, line-drawn device icons, amber and cyan highlights. Link colours stay fixed across the site (fibre amber, LAN green, Wi-Fi blue, HDMI violet, 4G red). This replaces the earlier "bright flat cartoon" decision.

- **Device list**: the list in 6.2 is final for v1. More devices (e.g. printer, smart speaker) may be added later; the data-driven engine makes that a content change only.

## 11. Open questions

None. The plan is ready to build, starting with M0 (foundations).
