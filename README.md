# AI-Exhibits · Reinforcement Learning & Sliding Puzzles

A small browser-native lab where you train an AI agent to solve sliding puzzles, watch the curse of dimensionality bite, and feel — at three different scales — what reinforcement learning is and is not.

**Live:** https://erikaroldanroa.github.io/ai-exhibits-rl-public/
**Languages:** 🇫🇷 FR · 🇬🇧 EN · 🇩🇪 DE · 🇮🇹 IT
**Offline:** works after first visit (PWA, no backend, no installation).

> *The article is the workshop. The screen is the lab. Open both at once.*

---

## Why this exists

Three sliding puzzles · three scales · one algorithm.

| | Mission I — *Make learning visible* | Mission II — *Propagation* | Mission III — *Scaling* |
|---|---|---|---|
| **Puzzle** | 2×2 | 2×3 | 3×3 |
| **Reachable states** | 12 | 360 | 181 440 |
| **God's Number** | 6 | 21 | 31 |
| **Q-table fits…** | on a napkin | past one page | nowhere near memory |
| **What you feel** | the algorithm is legible | the algorithm earns its place | the curse of dimensionality bites |

Each value is verified by a breadth-first search on the reachable state graph (`tools/verify_gods_numbers.py`, runs in under a second). Only half of *n!* permutations are reachable — a parity invariant splits the configuration space into two orbits; the goal lives in one of them.

---

## How to enter

**As a curious reader.** Open the live exhibit. Click **Mission I**. Click **Lancer l'agente aléatoire** to watch a random walk; play yourself; then click **🚀 Lancer l'Entraînement** to meet the third player — a Q-learning agent. Repeat for Mission II, then Mission III.

**As a workshop facilitator.** Switch to *Mode animatrice* on the role gate. The hub gives you four buttons: a printable kit per mission + a consolidated team scoresheet. Hand the kit to each team; project the hub on the room screen.

**As a DMVM-paper reader.** The companion paper guides you through the hub mission by mission. The hub respects the URL parameter `?ref=dmvm` and surfaces a permanent banner pointing at the recommended starting puzzle.

---

## What's inside

Every file in this repo earns its place. Nothing is scaffolding, nothing is dead code.

```
ai-exhibits-rl-public/
├── index.html                       The hub. Three mini-cards (one per mission) where participants
│                                    play themselves vs. a random agent. Role gate, glossary, language
│                                    switcher, tutorial replay.
│
├── exhibit_2x2.html                 Mission I trainer — 2×2 puzzle, the napkin-sized world. Q-table
│                                    visualisation, full state-space graph, "Apprendre" learn-cards.
├── exhibit_2x3.html                 Mission II trainer — 2×3, where the algorithm earns its place.
├── exhibit_3x3.html                 Mission III trainer — 3×3, where the curse bites. Live coverage
│                                    gauge, dedicated Économie card with Démo / Fiable / Garantie cost
│                                    staircase (5 orders of magnitude between hobby and guarantee).
│
├── mission1_kit.html                One printable workshop kit per mission. A4 landscape. Each kit
├── mission2_kit.html                carries: per-mission facts, a glossary subset (the chip-glossary
├── mission3_kit.html                widget grows from M1 → M2 → M3), a bench reference (B1…Bk), a
│                                    Q-update formula box, α/γ/ε tuning bullets, a current-attempt
│                                    strip, and collapsible facilitator notes that print expanded.
│
├── service-worker.js                Offline support. Network-first for HTML/JS/JSON, cache-first for
│                                    CSS/images. Fresh content on every reload; cached fallback when wifi
│                                    drops in a classroom.
├── LICENSE                          CC BY-NC-ND 4.0.
├── README.md                        This file.
│
├── app/
│   ├── styles.css                   Shared visual design for hub + 3 trainers.
│   ├── kit-shared.css               Shared visual design for the 3 workshop kits (extracted to one
│   │                                source of truth; per-mission HTML keeps only its goal-NxN grid).
│   ├── manifest.json                Installable-web-app metadata.
│   ├── i18n.js                      Language switching. Honours window.__i18nBase for files in
│   │                                subfolders (e.g. /print/).
│   ├── tutorial.js                  First-visit walkthrough; replayable from the 🎓 chip on the hub.
│   ├── tooltips.js                  Hover + focus + tap tooltip helper (touch-device accessible).
│   ├── glossary.js                  Shared chip-glossary widget. The same widget grows per mission:
│   │                                hub & M1 carry agent/state/action/q (4 chips); M2 adds episode/
│   │                                propagation/convergence (7); M3 adds curse/generalisation/budget
│   │                                (10). Definitions live once, in i18n.
│   ├── feedback.js                  "Suggest correction" mailto button.
│   └── learn-cards-translations.js  Mission I "Apprendre" flashcards (state, parity orbit, actions,
│                                    transition, reward, Q, update, policy, behaviour) — richer than
│                                    flat UI strings, kept separate from translations/*.json.
│
├── translations/                    User-interface, glossary, exhibit + kit copy. One file per language.
│   ├── fr.json                      Canonical French.
│   ├── en.json                      English.
│   ├── de.json                      German.
│   └── it.json                      Italian.
│
├── print/
│   └── fiche_equipe.html            Single consolidated team scoresheet — all 3 missions on one A4
│                                    landscape page, fillable with α, γ, ε, moves per benchmark per
│                                    attempt. i18n via __i18nBase shim.
│
└── archive/                         Pre-consolidation artifacts kept for reference.
    ├── facilitator_quickstart.html  Folded into per-mission kit notes.
    ├── fiche_participant.html       Folded into per-mission kits.
    └── print/                       Old per-language scoresheets + bilingual dictionaries; replaced
                                     by the i18n consolidated kits + scoresheet.
```

---

## How it teaches

The hub teaches by the puzzle, not by prose. Every page leans visual: a goal mini-icon instead of "[1 2 3 / 4 5 _]" text; a coverage gauge instead of "the agent has not seen all states"; an Économie staircase instead of a footnote on cost. Text earns its place behind a `(i)` icon if it's needed at all. The companion paper carries the math the hub stages.

Three pedagogical levers, one per mission:

- **Mission I — the napkin.** Twelve states, Q-table on a single sheet, optimum 6 moves verified by hand. The reader builds the algorithm's substrate by drawing it.
- **Mission II — the wave.** Q-values propagate backward from the goal, edge by edge, decaying by γ per hop. The reader watches an algorithm that was previously a paragraph become a moving picture.
- **Mission III — the curse.** Same algorithm. Same update rule. Same reward. The graph grew. The coverage gauge plateaus far below 100%, and the Économie card prices the gap in CHF — five orders of magnitude between a hobby script and a guarantee. The reader feels what motivated DQN, AlphaZero, and RLHF.

---

## How it's deployed in classrooms

Already delivered: **Maison Poincaré (Paris, n=51)**, **Marmottes UNIGE (n=29)**, **Pi Day workshop**, **Leipzig German+French session**. The hub plus one printable kit per mission plus the consolidated team scoresheet covers a 2-hour workshop end-to-end. Multilingual rooms work — switch the language, print, run.

The kits are designed for B&W laser print at A4 landscape. The team scoresheet captures all 3 missions on one page.

---

## Internationalisation

URL override: `?lang=fr|en|de|it` · preference persists in `localStorage`.

The kit and trainer files use `data-i18n` attributes; `app/i18n.js` swaps strings on language change. Files outside the public root (e.g. `print/fiche_equipe.html`) opt into a base path with `<script>window.__i18nBase = '../';</script>` before loading `app/i18n.js`.

---

## Reproducibility

`tools/verify_gods_numbers.py` (lives in the parent project, outside the public deliverable) is the citable artifact behind every numerical claim in this hub and the companion DMVM paper. It runs a breadth-first search on each reachable state graph and reports `|R|`, the diameter, and each benchmark distance. Sub-second on a laptop.

---

## License

**Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0).** See [`LICENSE`](LICENSE).

You may share for non-commercial purposes with attribution to **Dr. Erika Roldán Roa**. Modifications, derivative works, translations, and commercial use require written permission — contact via [erikaroldan.net](https://erikaroldan.net).

---

## Author

**Dr. Erika Roldán Roa** — author and developer of every word, every pixel, every line of code, every workshop instrument in this repository. The design, pedagogy, code, content, and visual identity are hers; the educational research and learning-analytics framework that drives the hub are her own work.

For questions, collaboration, or translation contributions: [erikaroldan.net](https://erikaroldan.net).

---

## AI-Exhibits partnership

Developed in the frame of the **AI-Exhibits** initiative — an Erasmus+ partnership between **IMAGINARY gGmbH** (Berlin), **Institut Henri Poincaré** (Paris), **Max Planck Institute for Mathematics in the Sciences** (Leipzig), **Citizens in Power** (Nicosia), and **ITT Giordani Striano** (Naples).
