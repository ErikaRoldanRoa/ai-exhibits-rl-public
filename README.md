# AI-Exhibits · Reinforcement Learning & Sliding Puzzles

An interactive lab where you watch a computer learn to solve sliding puzzles — and watch it choke when the puzzle grows. Three sizes, three lessons, one algorithm. Runs in the browser, works offline, four languages.

🔗 **Live:** https://erikaroldanroa.github.io/ai-exhibits-rl-public/
🌐 **FR · EN · DE · IT** · 📱 **No install** · ✋ **No data collected by default**
🔒 **License:** CC BY-NC-ND 4.0 — share with attribution, but translations & forks need permission (see [License](#license))

---

## For teachers — can I use this tomorrow?

Yes. Here's what to know in 60 seconds:

- **Ages 13+.** No prior reinforcement-learning knowledge required — Mission I teaches the algorithm from scratch on 12 states.
- **Devices: one per 2 students.** Any browser. No accounts. No install.
- **Time: 2 hours** for all three missions. 30 minutes for Mission I alone.
- **Print:** one of `mission1_kit.html`, `mission2_kit.html`, `mission3_kit.html` per team (A4 landscape) + one consolidated team scoresheet (`print/fiche_equipe.html`).
- **Project the hub on the room screen** so everyone sees the same coverage gauge climb.
- You don't need to submit student data anywhere — anonymous play is the default.

If you want to compare results across sessions/schools, see [Optional: submitting workshop data](#optional-submitting-workshop-data) below.

---

## What it is

Three sliding puzzles · three scales · one Q-learning algorithm. The puzzle grows from 4 tiles to 9; the math stays the same; the consequences explode.

| | **Mission I** | **Mission II** | **Mission III** |
|---|---|---|---|
| Puzzle | 2×2 | 2×3 | 3×3 |
| Reachable states | 12 | 360 | 181 440 |
| God's Number † | 6 | 21 | 31 |
| What it teaches | the algorithm is legible | reward propagates back, edge by edge | the curse of dimensionality |
| Lookup table fits… | on a napkin | past one page | nowhere near memory |

† *God's Number = the worst-case optimal solution length, equal to the diameter of the reachable state graph. Half the n! permutations are unreachable — a parity invariant splits the configuration space in two, and the goal lives in one half.*

Every value is verified by breadth-first search (see [Reproducibility](#reproducibility)).

---

## How it teaches

The hub teaches by the puzzle, not by prose. A goal mini-icon, not "[1 2 3 / _]" text. A coverage gauge, not the sentence "the agent has not yet seen every state." An Économie staircase, not a footnote on cost. Text earns its place behind a `(i)` icon.

- **Mission I — the napkin.** Twelve states. Q-table on a single sheet. Optimum 6 moves you can verify by hand. The student builds the algorithm's substrate by drawing it.
- **Mission II — the wave.** Q-values propagate backward from the goal, edge by edge, decaying by γ per hop. What was a paragraph becomes a moving picture.
- **Mission III — the curse.** Same algorithm, same update rule, same reward — the graph just grew to 181 440 states. The coverage gauge plateaus far below 100 %; the Économie card prices the gap (five orders of magnitude from a Démo run to a Garantie run). The student feels what motivated DQN, AlphaZero, and modern deep RL.

---

## How to use it

**As a curious reader.** Open the live site → optionally type your name → **Commencer**. On the hub, click **Mission I**, watch the random baseline, play yourself, then **🚀 Lancer l'Entraînement**. Move on to Mission II, then III. Nothing is sent anywhere.

**As a facilitator (running a workshop).** On the welcome gate, click the small **Animatrice / Facilitator →** link at the bottom. Enter your keyword (request one from the author). Facilitator mode unlocks the 🚀 training buttons across the three trainers and reveals the 📤 submit button in the hub header.

**As a paper reader.** The companion DMVM paper walks through the hub mission by mission. Append `?ref=dmvm` to the URL — a permanent banner appears with the recommended starting puzzle. ([What is DMVM?](https://www.deutsche-mathematiker-vereinigung.de/dmv-mathematik-verbindet) — the German Mathematical Society's journal.)

---

## Optional: submitting workshop data

The hub ships with an optional tournament backend (Google Apps Script + Google Sheet) for facilitators who want to collect results across sessions. **If you don't submit, nothing leaves the browser.**

Flow:

```
Welcome gate (everyone)               Submit modal (facilitators only, click 📤)
┌──────────────────┐                  ┌──────────────────────────┐
│ Name (optional)  │                  │ Team name        (req)   │
│ [ Commencer ]    │     ─── 📤 ───▸  │ Event code       (req)   │
│ Animatrice →     │                  │ [ 🏆 Submit results ]    │
└──────────────────┘                  └──────────────────────────┘
```

The event code (e.g., `DMVM26`) is asked **at submit time, not at session start** — anonymous play stays one click.

**Privacy:**
- Anonymous play sends nothing.
- Even in facilitator mode, nothing is sent until an explicit 📤 click.
- Team names are free text controlled by the facilitator (no real names required).
- Event codes are short slugs that map to a friendly name.
- No tracking cookies, no analytics, no third-party scripts.

**Forking the backend:** the Apps Script source lives in the parent project (`tournament-api/clasp-project/`), separate from this public hub. The hub works fully standalone — remove the 📤 button and the `submitResultsBtn` block if you don't need submission.

---

## What's in this repo

```
ai-exhibits-rl-public/
├── index.html                       Hub: 3 mission cards, role gate, language switcher, glossary.
├── exhibit_2x2.html                 Mission I trainer (2×2, napkin world).
├── exhibit_2x3.html                 Mission II trainer (2×3, propagation visible).
├── exhibit_3x3.html                 Mission III trainer (3×3, curse + Économie staircase).
├── mission1_kit.html  · mission2_kit.html  · mission3_kit.html
│                                    Printable workshop kits (A4 landscape).
├── service-worker.js                Offline cache, bumped per deploy.
├── LICENSE  ·  README.md
│
├── app/                             Shared code: styles.css, kit-shared.css, i18n.js,
│                                    tutorial.js, tooltips.js, glossary.js, feedback.js,
│                                    learn-cards-translations.js, manifest.json.
│
├── translations/                    fr.json (canonical) · en.json · de.json · it.json.
│                                    494 keys per language, at full parity.
│
└── print/
    └── fiche_equipe.html            Consolidated team scoresheet (3 missions on one A4).
```

The parent project (not in this public repo) contains:

- `tools/verify_gods_numbers.py` — BFS verifier (Reproducibility).
- `tournament-api/clasp-project/` — Apps Script backend.
- `papers/dmvm-sliding-puzzles/` — the companion paper.

---

## Run locally

It's a static site. Any HTTP server works.

```bash
git clone https://github.com/ErikaRoldanRoa/ai-exhibits-rl-public.git
cd ai-exhibits-rl-public
python3 -m http.server 8000      # or: npx serve .
# open http://localhost:8000
```

Or just `open index.html` — but the service worker won't activate from `file://`, so you'll lose offline-after-first-visit testing.

**Deploy:** push to your fork's `main`, then enable GitHub Pages (Settings → Pages → Branch: main / root). The site is served from `https://<your-org>.github.io/<your-repo>/`.

---

## Forking, translating, contributing

**Read the license first.** This project is **CC BY-NC-ND 4.0** (Attribution-NonCommercial-NoDerivatives). That means:

- ✅ Share unmodified for non-commercial use, with attribution.
- ❌ Derivative works — including a Polish/Spanish/Mandarin translation — require **written permission** from the author.

If you want to contribute a translation or fork this for your own museum/classroom, please [contact Erika](https://erikaroldan.net) first — translations and adaptations are warmly invited, but they need a separate licensing conversation.

When you do contribute a translation, the workflow is: copy `translations/fr.json` (canonical voice) → translate every value, keep every key → add to the language switcher in `index.html` and `app/i18n.js` → test the four trainer pages, the three kits, the team scoresheet, and the role gate.

---

## Reproducibility

`tools/verify_gods_numbers.py` (in the parent project, not this public repo) does breadth-first search on each reachable state graph and reports `|R|` (reachable set size), the graph diameter, and each benchmark distance. Sub-second on a laptop. Every numerical claim in this hub and the companion DMVM paper is reproducible from this single script.

A pedagogical note: God's Number = graph diameter when the goal's eccentricity equals the maximum over all vertex pairs — true for these state graphs. The kit lists this number once as "Nombre de Dieu," not twice as two different concepts.

---

## Internationalisation

URL override `?lang=fr|en|de|it`. Preference persists in `localStorage`. Files use `data-i18n` attributes; `app/i18n.js` swaps strings on language change. Files in subfolders (e.g., `print/`) opt in with `<script>window.__i18nBase = '../';</script>` before loading the i18n script.

All 4 languages at full parity (494/494 keys each).

---

## Workshops delivered

- **Maison Poincaré** (Paris) — n = 51, January 2026
- **Marmottes UNIGE** (Geneva) — n = 29, April 2026
- **Pi Day workshop** — March 2026

One 2-hour workshop = hub + 3 printable kits + 1 team scoresheet. Multilingual rooms work: switch the language, print, run.

---

## License

**Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0).** See [`LICENSE`](LICENSE) for the full text.

Modifications, derivative works, translations, and commercial use require written permission. Contact: [erikaroldan.net](https://erikaroldan.net).

---

## Author

**Dr. Erika Roldán Roa** — design, pedagogy, code, translations, visual identity, and the learning-analytics backbone.

Contact for questions, collaboration, translation contributions: [erikaroldan.net](https://erikaroldan.net).

---

## AI-Exhibits partnership

Developed in the frame of the **AI-Exhibits** initiative — an Erasmus+ partnership between **IMAGINARY gGmbH** (Berlin), **Institut Henri Poincaré** (Paris), **Max Planck Institute for Mathematics in the Sciences** (Leipzig), **Citizens in Power** (Nicosia), and **ITT Giordani Striano** (Naples).
