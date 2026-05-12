# AI-Exhibits · Reinforcement Learning & Sliding Puzzles

Train a Q-learning agent on three sliding puzzles — watch it learn, then watch the curse of dimensionality bite. Browser-native, offline after first visit, four languages.

🔗 **Live:** https://erikaroldanroa.github.io/ai-exhibits-rl-public/
🌐 **FR · EN · DE · IT** · 📱 **No install** · ✋ **No data sent unless you explicitly submit**
📐 **Built by** [Dr. Erika Roldán Roa](https://erikaroldan.net) (MPI MiS) · **License** CC BY-NC-ND 4.0

---

**Contents.** [For teachers](#for-teachers--can-i-use-this-tomorrow) · [The three missions](#the-three-missions) · [How it teaches](#how-it-teaches) · [How to use it](#how-to-use-it) · [Optional submission](#optional-submitting-workshop-data) · [Run locally](#run-locally) · [Fork & translate](#forking-translating-contributing) · [Reproducibility](#reproducibility)

---

## For teachers — can I use this tomorrow?

| | |
|---|---|
| Ages | 13+ |
| Prior RL knowledge needed | None — Mission I teaches it from scratch on 12 states |
| Devices | One browser per 2 students. Any laptop, any tablet |
| Install / accounts | None |
| Time budget | 2 hours for all three missions; 30 min for Mission I alone |
| Print | `mission{1,2,3}_kit.html` (A4 landscape) per team + `print/fiche_equipe.html` team scoresheet |
| Project on screen | The hub (`index.html`) — students see the same coverage gauge climb together |

Anonymous play sends nothing. Submission is optional and requires a facilitator keyword — **organizers request one via [the event form](request.html)**.

---

## The three missions

| | **Mission I** | **Mission II** | **Mission III** |
|---|---|---|---|
| Puzzle | 2×2 | 2×3 | 3×3 |
| Reachable states | 12 | 360 | 181 440 |
| God's Number † | 6 | 21 | 31 |
| Default training time | ~5 seconds | ~1 minute | 10+ minutes, still incomplete |
| Q-table fits… | on a napkin | past one page | nowhere near memory |

† *God's Number = the worst-case shortest solution. Equal to the graph diameter on these state graphs (the goal sits at the centre of the "hardest" orbit). Half of n! permutations are unreachable — a parity invariant splits the configuration space in two; the goal lives in one half. Every value above is verified by breadth-first search; see [Reproducibility](#reproducibility).*

---

## How it teaches

Each mission follows the same arc: read the world → play by hand → train the agent → debrief. The three missions escalate; the algorithm is identical.

### Mission I — the napkin (2×2)

| Student does | Hub shows |
|---|---|
| Plays the 2×2 puzzle a few times by hand | The full 12-state graph, goal highlighted in pink |
| Trains a Q-learning agent (default 300 episodes) | Q-values cascade backward from the goal, edge by edge |
| Fills in the 24-row Q-table on the printed kit | Live coverage gauge reaches 100% in seconds |
| Verifies God's Number = 6 by tracing the longest shortest-path | The agent solves benchmark B6 in exactly 6 moves |

**By the end of M1, a student can explain in their own words what a Q-table is, and why optimal play on 2×2 takes at most 6 moves.**

### Mission II — the wave (2×3)

| Student does | Hub shows |
|---|---|
| Trains the agent (default 2 000 episodes) | Q-values propagate further with each episode |
| Drags γ from 0.5 to 0.99 and re-trains | Reward reaches further into the graph as γ → 1 |
| Drags ε from 0 to 0.5 and re-trains | Coverage gauge fills at very different rates |
| Compares: same algorithm, 30× more states than M1 | Training takes minutes, not seconds |

**By the end of M2, a student can explain why γ controls how far reward propagates and why ε > 0 keeps exploration alive.**

### Mission III — the curse (3×3)

| Student does | Hub shows |
|---|---|
| Trains 10 000 episodes on the same algorithm | Coverage gauge plateaus far below 100% |
| Reads the Économie card | Three cost tiers: **Démo** (~10⁻⁵ CHF) → **Fiable** (~10⁻³) → **Garanti** (~700 CHF) |
| Tries to push coverage higher by raising the episode budget | The gauge climbs ~1% per minute of training |
| Closes the laptop and asks "what could fix this?" | The trainer's pedagogy bridge into approximation methods |

**By the end of M3, a student can explain why a tabular Q-learner that worked on 2×2 fails on 3×3, and why this is the problem that approximation methods (neural Q, policy networks) were designed to solve.**

*Démo* / *Fiable* / *Garanti* are this project's labels for three quality tiers: **demo-quality** training (~10⁻⁵ CHF, a few seconds of compute), **reliable** training (~10⁻³ CHF, minutes of compute), and **publication-grade** convergence (~10² CHF — a laptop running for hours). The cost numbers come from `tools/verify_gods_numbers.py` × per-step compute estimates.

---

## How to use it

| | What you do | What you get |
|---|---|---|
| **Curious reader** | Open the [live site](https://erikaroldanroa.github.io/ai-exhibits-rl-public/), optionally type a name, click **Commencer** | Three missions, free play, nothing sent anywhere |
| **Workshop facilitator** | Same gate, then click the small **Animatrice / Facilitator →** link at the bottom; enter your keyword | 🚀 unlocked, 📤 submit appears, printable kits ready |
| **Paper reader** | Append `?ref=dmvm` to the URL | Permanent banner pointing at the starting mission |

---

## Optional: submitting workshop data

The hub supports anonymous play (the default) and an optional submission flow for workshop facilitators who want results across sessions in one place. **If you never click 📤, nothing leaves the browser.**

```
Welcome gate (everyone)               Submit modal (facilitators, click 📤)
┌──────────────────┐                  ┌──────────────────────────┐
│ Name (optional)  │                  │ Team name        (req)   │
│ [ Commencer ]    │     ─── 📤 ───▸  │ Event code       (req)   │
│ Animatrice →     │                  │ [ 🏆 Submit results ]    │
└──────────────────┘                  └──────────────────────────┘
```

The event code (e.g., `DMVM26`) is asked **at submit time, not at session start** — anonymous play stays one click.

**Privacy:** anonymous play sends nothing. Even facilitator mode sends nothing until 📤. Team names are free text the facilitator types. No tracking cookies, no analytics, no third-party scripts.

**Running a workshop or planning a tournament?** [Request an event](request.html) — every request is reviewed manually by Dr. Roldán; approval takes 1–2 weeks. Workshop events get time-bounded credentials (auto-expire at the end); permanent events (paper tournaments, ongoing installations) get open credentials.

---

## What's in this repo

```
ai-exhibits-rl-public/
├── index.html                       Hub: 3 mission cards, role gate, language switcher, glossary.
├── exhibit_2x2.html                 Mission I trainer (2×2).
├── exhibit_2x3.html                 Mission II trainer (2×3).
├── exhibit_3x3.html                 Mission III trainer (3×3) — includes the Économie card.
├── mission1_kit.html  ·  mission2_kit.html  ·  mission3_kit.html
│                                    Printable workshop kits (A4 landscape).
├── service-worker.js                Offline cache, bumped per deploy.
├── LICENSE  ·  README.md
│
├── app/                             Shared code:
│   ├── styles.css  ·  kit-shared.css                Visual design.
│   ├── i18n.js                                       Language switching (window.__i18nBase for subfolders).
│   ├── tutorial.js                                   First-visit walkthrough, replayable from 🎓.
│   ├── tooltips.js                                   Hover + focus + tap helper (touch-accessible).
│   ├── glossary.js                                   Chip glossary (4 chips M1 → 7 M2 → 10 M3).
│   ├── feedback.js                                   Suggest-correction button.
│   ├── learn-cards-translations.js                   M1 "Apprendre" flashcards.
│   └── manifest.json                                 Installable-web-app metadata.
│
├── translations/                    fr.json (canonical) · en.json · de.json · it.json — 495 keys × 4.
│
└── print/
    └── fiche_equipe.html            Team scoresheet, 3 missions on one A4 landscape.
```

The parent project (not in this public repo) holds:

- `tools/verify_gods_numbers.py` — BFS verifier (see Reproducibility)
- `papers/dmvm-sliding-puzzles/` — companion paper

---

## Run locally

It's a static site. Any HTTP server works.

```bash
git clone https://github.com/ErikaRoldanRoa/ai-exhibits-rl-public.git
cd ai-exhibits-rl-public
python3 -m http.server 8000     # or: npx serve .
# open http://localhost:8000
```

`open index.html` works too, but the service worker won't activate from `file://`, so you'll lose the offline-after-first-visit behaviour.

**Deploy:** push to your fork's `main`, then enable GitHub Pages (Settings → Pages → Branch: main / root).

---

## Forking, translating, contributing

**Read the license first.** This project is **CC BY-NC-ND 4.0** (Attribution-NonCommercial-NoDerivatives). That means:

- ✅ Share unmodified for non-commercial use, with attribution.
- ❌ Derivative works — including a Polish / Spanish / Mandarin translation — require **written permission** from the author.

If you want to contribute a translation or fork this for your own museum / classroom, [contact Erika](https://erikaroldan.net) first. Translations and adaptations are warmly invited, but they need a licensing conversation.

**Translation workflow** (once permission is granted): copy `translations/fr.json` → translate every value, keep every key → add to the language switcher in `index.html` and `app/i18n.js` → test the four trainer pages, the three kits, the team scoresheet, the role gate, and the submit modal.

---

## Reproducibility

`tools/verify_gods_numbers.py` (in the parent project) does breadth-first search on each reachable state graph and reports the reachable set size, the graph diameter, and every benchmark distance. Sub-second on a laptop. Every **state-graph and benchmark-distance** claim is reproducible from this single script. Cost figures (Démo / Fiable / Garanti) layer per-step compute estimates on top of those distances.

---

## Internationalisation

URL override `?lang=fr|en|de|it`. Preference persists in `localStorage`. Files use `data-i18n` attributes; `app/i18n.js` swaps strings on language change. Subfolders opt in with `<script>window.__i18nBase = '../';</script>` before loading the i18n script.

495 keys × 4 languages, at full parity.

---

## Workshops delivered

- **Maison Poincaré** (Paris) — n = 51, January 2026
- **Marmottes UNIGE** (Geneva) — n = 29, April 2026
- **Pi Day workshop** — March 2026
- **Bilingual DE/FR session** — February 2026 (materials in `workshops/2026-02-10-workshop/`)

A 2-hour workshop = hub + 3 printable kits + 1 team scoresheet. Multilingual rooms work: switch language, print, run.

---

## Tests & quality

Three test suites run before any push to `public/`:

- `tools/usability_harness.py` — functional + visual checks across hub, trainers, kits, scoresheet.
- `tools/gate_carryover_test.py` — non-empty-pre-state checks. Catches "stale animatrice credentials leaking into a participant session" — bugs the clean-slate harness misses.
- `tools/request_form_test.py` — every chip, every conditional, every consent, full E2E submission for `request.html`.

---

## License

**CC BY-NC-ND 4.0.** See [`LICENSE`](LICENSE). Modifications, derivatives, translations, and commercial use require written permission — contact [erikaroldan.net](https://erikaroldan.net).

---

## Author

**Dr. Erika Roldán Roa** — design, pedagogy, code, translations, visual identity, submission pipeline. Contact: [erikaroldan.net](https://erikaroldan.net).

---

## AI-Exhibits partnership

Developed in the frame of the **AI-Exhibits** Erasmus+ partnership: **IMAGINARY gGmbH** (Berlin), **Institut Henri Poincaré** (Paris), **Max Planck Institute for Mathematics in the Sciences** (Leipzig), **Citizens in Power** (Nicosia), and **ITT Giordani Striano** (Naples).
