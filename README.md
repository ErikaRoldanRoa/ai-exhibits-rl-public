# AI-Exhibits · Reinforcement Learning & Sliding Puzzles

Interactive pedagogical platform for teaching **Q-learning** through sliding puzzles (2×2 · 2×3 · 3×3). Browser-based, offline-capable (PWA), internationalisation-ready.

**Live:** https://erikaroldanroa.github.io/ai-exhibits-rl-public/
**Languages:** 🇫🇷 FR · 🇬🇧 EN · 🇩🇪 DE · 🇮🇹 IT — all four loaded, native-speaker feedback welcome.

---

## Author

**Dr. Erika Roldán Roa**
Research Group Leader · Max Planck Institute for Mathematics in the Sciences (MPI MiS), Leipzig
Visiting Researcher · Université de Genève, Section de Mathématiques

- **Educational design** — pedagogical framework, learning objectives, multi-level scenario (2×2 → 2×3 → 3×3), workshop methodology, facilitator & participant materials, pre/post learning-analytics instruments.
- **Development of all interactive digital elements** — Q-learning engine, Q-table visualisations, trainer UI, state-graph tools, PWA architecture, offline hub, internationalisation system (FR/EN/DE/IT), print kits.

Developed in the frame of the **AI-Exhibits** initiative (IMAGINARY · IHP · MPI MiS · CIP).

For questions, collaboration, or translation contributions: [redacted] · [erikaroldan.net](https://erikaroldan.net)

---

## The three missions

| Mission | Puzzle | Reachable states | Nombre de Dieu |
|---|---|---:|---:|
| I — Fondations | 2×2 | 12 | **6** |
| II — Propagation | 2×3 | 360 | **21** |
| III — Mise à l'échelle | 3×3 | **181 440** | **31** |

Only half of *n!* permutations are reachable — a parity invariant splits the state space into two orbits, one containing the goal. The **Nombre de Dieu** (God's number) is the smallest number of moves guaranteed to solve the hardest starting configuration; all three values above are verified by a breadth-first search on the reachable state graph.

---

## What's inside

Every file below has a reason to be in the repo. Nothing is scaffolding, nothing is dead code.

```
ai-exhibits-rl-public/
├── index.html                       The hub — where participants and facilitators land, pick a puzzle, and enter the exhibit.
├── exhibit_2x2.html                 Trainer for the 2×2 sliding puzzle (12 solvable configurations) — first contact with Q-learning.
├── exhibit_2x3.html                 Trainer for the 2×3 sliding puzzle (360 configurations) — builds on the 2×2.
├── exhibit_3x3.html                 Trainer for the 3×3 sliding puzzle (181 440 configurations) — shows how problem complexity scales.
├── fiche_participant.html           Printable A4 reference card handed out to participants.
├── facilitator_quickstart.html      Self-contained guide for anyone running the 2-hour workshop.
├── service-worker.js                Makes the exhibit work offline after the first visit (useful for classrooms with patchy wifi).
├── LICENSE                          Three-tier open license (code MIT · documentation CC-BY-SA 4.0 · assets CC-BY 4.0).
├── README.md                        This file.
│
├── app/                             All runtime code and shared styles.
│   ├── styles.css                   Shared visual design for the hub and the three trainers.
│   ├── manifest.json                Installable-web-app metadata (name, icons).
│   ├── i18n.js                      Runs the language switch and swaps translated strings into the page.
│   ├── tutorial.js                  First-visit walkthrough that introduces Q-learning step by step.
│   ├── tooltips.js                  Shared tooltip helper used by the trainers.
│   ├── feedback.js                  "Suggest a correction" button that opens the user's email client with a pre-filled message.
│   └── learn-cards-translations.js  Translations of the tutorial flashcards (kept separate from translations/*.json because the card structure is richer than flat UI strings).
│
├── translations/                    User-interface, glossary, and exhibit copy — one file per language.
│   ├── fr.json                      French.
│   ├── en.json                      English.
│   ├── de.json                      German.
│   └── it.json                      Italian.
│
└── print/                           Printable A4 materials used in classroom delivery.
    ├── briefing_mission_fr.html     Mission briefing handed out to open the workshop — French.
    ├── briefing_mission_de.html     Mission briefing handed out to open the workshop — German.
    ├── briefing_mission_it.html     Mission briefing handed out to open the workshop — Italian.
    ├── dictionnaire_fr.html         Bilingual glossary (FR ↔ EN) for bilingual classrooms.
    ├── dictionnaire_de.html         Bilingual glossary (DE ↔ EN).
    ├── dictionnaire_it.html         Bilingual glossary (IT ↔ EN).
    ├── fiche_equipe_fr.html         Score sheet filled in by each participant team — French.
    ├── fiche_equipe_de.html         Score sheet filled in by each participant team — German.
    └── fiche_equipe_it.html         Score sheet filled in by each participant team — Italian.
```

---

## How to use

1. **Open** the live exhibit: https://erikaroldanroa.github.io/ai-exhibits-rl-public/
2. **Facilitators** — see [`facilitator_quickstart.html`](facilitator_quickstart.html) for the 2-hour workshop flow.
3. **Print kits** — download the classroom handouts from [`print/`](print/).

No installation, no backend, works offline after first visit.

---

## Internationalisation

URL override: `?lang=fr|en|de|it` · preference persists via `localStorage`.
Contributions for 🇩🇪 DE and 🇮🇹 IT are welcome — drop a filled JSON into `translations/`.

---

## Workshops and presentations

**Maison Poincaré — Paris, 30 January 2026** · Prototype testing with two *Seconde* classes (15–16 yrs), n = 25.

- **92 %** of participants reported being *interested or very interested*.
- Mean satisfaction **3.35 / 4** across the group.

**CoSMO 2026 — EPFL Lausanne, 2 February 2026** · *Collaborative Swiss Math Outreach Conference*. Presentation of the Sliding Puzzles exhibit and the Maison Poincaré results to the Swiss math-outreach community (Espace des Inventions, Caravane des maths, Mathilda programme, and other national outreach projects).

**Marmottes Filles et Maths — UNIGE, 13–18 April 2026** · Multi-day RL workshop scenario at the *Marmottes Filles et Maths* camp. Teen girls; n = 29 opening poll, 93 % already engaged with AI in their daily life; full multi-day closing instrument collected across the week.

---

## License

Tiered · see [`LICENSE`](LICENSE) for the full text:

- **Code** (HTML · CSS · JS · JSON) — MIT
- **Pedagogical documentation** (`print/`, facilitator & participant texts) — CC-BY-SA 4.0
- **Photos and other assets** — CC-BY 4.0

Attribution in all cases: **Dr. Erika Roldán Roa (MPI MiS).**

---

## AI-Exhibits partnership

**IMAGINARY gGmbH** (Berlin) · **Institut Henri Poincaré** (Paris) · **Max Planck Institute for Mathematics in the Sciences** (Leipzig) · **Citizens in Power** (Nicosia).
