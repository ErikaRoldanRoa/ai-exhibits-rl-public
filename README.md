# AI-Exhibits · Reinforcement Learning & Sliding Puzzles

Train a Q-learning agent on three sliding puzzles — watch it learn, then watch the curse of dimensionality bite. Browser-native, offline after first visit, four languages.

🔗 **Live:** https://erikaroldanroa.github.io/ai-exhibits-rl-public/
🌐 **FR · EN · DE · IT** · 📱 **No install** · ✋ **No data sent unless you explicitly submit**
📐 **Built by** [Dr. Erika Roldán Roa](https://erikaroldan.net) (Max Planck Institute MiS, Leipzig)
⚠️ **License: CC BY-NC-ND 4.0** — translations and adaptations require [written permission](#license) before you start

---

## The three missions

Three sliding puzzles · three scales · one Q-learning algorithm.

| | **Mission I** | **Mission II** | **Mission III** |
|---|---|---|---|
| Puzzle | 2×2 | 2×3 | 3×3 |
| Reachable states | 12 | 360 | 181 440 |
| God's Number † | 6 | 21 | 31 |
| Default training | ~5 s | ~1 min | 10+ min, still incomplete |
| Q-table fits… | on a napkin | past one page | nowhere near memory |

† *God's Number = the worst-case shortest solution. Half of n! permutations are unreachable: a parity invariant splits the state space in two, and the goal lives in one half. Verified by breadth-first search.*

**Glossary (one-line):** **Q-learning** — an agent learns a number (a *Q-value*) for every (state, move) pair. **Q-table** — that lookup table. **γ** — how far reward propagates from the goal. **ε** — probability of trying a random move.

---

## How it teaches

Each mission follows the same arc: read the world → play by hand → train the agent → debrief. The algorithm is identical; the scale escalates.

### Mission I — the napkin (2×2)

| Student does | Hub shows |
|---|---|
| Plays the 2×2 puzzle by hand | The 12-state graph, goal highlighted |
| Trains a Q-learning agent (300 episodes) | Q-values cascade backward, edge by edge |
| Fills in the 24-row Q-table on the printed kit | Coverage gauge reaches 100% in seconds |
| Traces the longest shortest path | Agent solves benchmark B6 in 6 moves |

**By the end: a student can explain a Q-table in their own words and why optimal 2×2 play takes at most 6 moves.**

### Mission II — the wave (2×3)

| Student does | Hub shows |
|---|---|
| Trains the agent (2 000 episodes) | Q-values propagate further with each episode |
| Drags γ from 0.5 to 0.99 and re-trains | Reward reaches deeper as γ → 1 |
| Drags ε from 0 to 0.5 and re-trains | Coverage gauge fills at very different rates |

**By the end: a student can explain why γ controls how far reward propagates, and why ε > 0 keeps exploration alive.**

### Mission III — the curse (3×3)

| Student does | Hub shows |
|---|---|
| Trains 10 000 episodes on the same algorithm | Coverage gauge plateaus far below 100% |
| Reads the Économie card | **Démo** 0,0001 CHF (seconds) → **Fiable** 0,01 CHF (minutes) → **Garantie** 700 CHF (hours) — five orders of magnitude |
| Tries to push coverage higher | Gauge climbs ~1% per minute |
| Closes the laptop and asks "what could fix this?" | An on-screen card pointing at function approximation |

**By the end: a student can explain why tabular Q-learning fails on 3×3 — and why neural Q and policy networks exist.**

---

## For teachers — can I use this tomorrow?

| | |
|---|---|
| Ages | 13+ |
| Prior RL knowledge | None — Mission I teaches it from scratch |
| Devices | One browser per pair, group, or workstation |
| Install / accounts | None |
| Time | 2 hours for all three missions; 30 min for Mission I alone |
| Print | `mission{1,2,3}_kit.html` per team (A4 landscape, facilitator runbook + cheat-sheet) + `mission1_student.html` per student (A4 landscape worksheet: 12-state orbit, 24-row Q-table grid, benchmarks) + `print/fiche_equipe.html` team scoresheet |
| Project on screen | The hub (`index.html`) — so the room sees the coverage gauge climb together |

Anonymous play sends nothing. The hub is fully usable with no contact, no keyword, no setup beyond opening the URL.

---

## Running a workshop · tournament · permanent installation

If you'd like to collect data across teams or run a tournament tied to a paper, [request an event](request.html) *(form opens June 1, 2026)*. Approval takes 1–2 weeks. Time-bounded workshops get credentials that auto-expire; permanent events (paper tournaments, museum installations) get open credentials.

When approved, the 📤 button in the hub becomes active for facilitators and submissions get tagged to your event for later analysis.

The 🔧 button on every page lets anyone suggest a translation or content correction — open to all, no account needed.

---

## Workshops delivered

- **Maison Poincaré** (Paris) — n = 51, January 2026
- **Marmottes UNIGE** (Geneva) — n = 29, April 2026
- **Bilingual DE/FR session** — February 2026
- **Pi Day workshop** — March 2026

---

## For developers · forkers · translators

**Run locally.** Static site; any HTTP server works.

```bash
git clone https://github.com/ErikaRoldanRoa/ai-exhibits-rl-public.git
cd ai-exhibits-rl-public
python3 -m http.server 8000     # or: npx serve .
# open http://localhost:8000
```

`file://` works for content but disables the service worker — use a local server to test offline-after-first-visit.

**Repo layout.**

```
ai-exhibits-rl-public/
├── index.html                       Hub: 3 mission cards, role gate, language switcher.
├── exhibit_2x2.html  ·  exhibit_2x3.html  ·  exhibit_3x3.html   Mission I/II/III trainers.
├── mission1_kit.html  ·  mission2_kit.html  ·  mission3_kit.html   Printable workshop kits (A4 landscape).
├── mission1_student.html               Printable student worksheet for Mission I (A4 landscape, 4 langs).
├── request.html                     Event-request form (gated until 2026-06-01).
├── service-worker.js · LICENSE · README.md
│
├── app/                             Shared code: styles.css, kit-shared.css, i18n.js,
│                                    tutorial.js, tooltips.js, glossary.js, feedback.js,
│                                    learn-cards-translations.js, manifest.json.
│
├── translations/                    fr.json (canonical) · en.json · de.json · it.json — full parity.
│
└── print/
    └── fiche_equipe.html            Team scoresheet, 3 missions on one A4 landscape.
```

**Backend.** The hub posts to a backend for three flows (submit results, request event, suggest correction) and works fully standalone if you strip those features. Implementation lives outside this public deliverable.

**i18n.** URL override `?lang=fr|en|de|it`; preference persists in `localStorage`. Files in subfolders opt in with `<script>window.__i18nBase = '../';</script>`. All translation files are at key-set parity (578 keys each, enforced by `tools/i18n_parity_test.py`).

**Tests.** Five suites in the parent project's `tools/`: `i18n_parity_test.py` (4-lang key + reference parity, 0 tolerance), `usability_harness.py` (functional + visual, 85 checks), `gate_carryover_test.py` (non-empty pre-state, 19 checks), `request_form_test.py` (event form, 31 checks), `feedback_test.py` (🔧 widget, 32 checks). The parent project also contains `tools/verify_gods_numbers.py` — BFS verifier behind the state-graph and benchmark-distance claims.

**Translating.** Read the license first. Adaptations require permission; [contact](https://erikaroldan.net) before starting. The workflow once approved: copy `translations/fr.json` (canonical) → translate every value, keep every key → add to the language switcher in `index.html` and `app/i18n.js` → run `tools/i18n_parity_test.py` (must PASS) → test the trainers, kits, student worksheet, scoresheet, role gate, request form, and feedback widget.

---

## License

**CC BY-NC-ND 4.0** (Attribution-NonCommercial-NoDerivatives) — see [`LICENSE`](LICENSE).

- ✅ Share unmodified for non-commercial use, with attribution to Dr. Erika Roldán Roa.
- ❌ Modifications, derivative works, translations, and commercial use require [written permission](https://erikaroldan.net).

---

Developed in the **AI-Exhibits** Erasmus+ partnership: **IMAGINARY gGmbH** (Berlin) · **Institut Henri Poincaré** (Paris) · **Max Planck Institute for Mathematics in the Sciences** (Leipzig) · **Citizens in Power** (Nicosia) · **ITT Giordani Striano** (Naples).
