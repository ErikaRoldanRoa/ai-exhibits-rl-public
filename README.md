# AI-Exhibits · Reinforcement Learning & Sliding Puzzles

Train a Q-learning agent on three sliding puzzles — watch it learn, then watch the curse of dimensionality bite. Browser-native, offline after first visit, four languages.

**Created by [Dr. Erika Roldán Roa](https://erikaroldan.net)** — Max Planck Institute for Mathematics in the Sciences (MPI MiS), Leipzig.

- 🔗 **Live:** https://erikaroldanroa.github.io/ai-exhibits-rl-public/
- 🌐 **Languages:** FR · EN · DE · IT — no install, runs in any browser
- ⚠️ **License:** CC BY-NC-ND 4.0 — translations and adaptations require [written permission](#license)

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
| Fills in the 24-row Q-table on the printed kit | States explored reaches 100% in seconds |
| Traces the longest shortest path | Agent solves benchmark B6 in 6 moves |

**By the end: a student can explain a Q-table in their own words and why optimal 2×2 play takes at most 6 moves.**

### Mission II — the wave (2×3)

| Student does | Hub shows |
|---|---|
| Trains the agent (2 000 episodes) | Q-values propagate further with each episode |
| Sets γ from 0.5 to 0.99 and re-trains | Reward reaches deeper as γ → 1 |
| Raises ε from 0 to 0.5 and re-trains | The explored-states bar fills at very different rates |

**By the end: a student can explain why γ controls how far reward propagates, and why ε > 0 keeps exploration alive.**

### Mission III — the curse (3×3)

| Student does | Hub shows |
|---|---|
| Trains 10 000 episodes on the same algorithm | Explored states plateau far below 100% |
| Reads the Économie card | **Démo** ~0,0001 € → **Fiable** ~0,01 € → **Garantie** ~730 € — five orders of magnitude between *Fiable* and *Garantie* (switch to CHF in the hub) |
| Tries to push coverage higher | The bar climbs ~1% per minute |
| Asks "what could fix this?" | The bar can't fill — the lookup table has hit its ceiling. (What comes next — function approximation, neural Q and policy networks — is introduced back in Mission I.) |

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
| Project on screen | The hub (`index.html`) — so the room sees the explored-states bar climb together |

Anonymous play sends nothing. The hub is fully usable with no contact, no keyword, no setup beyond opening the URL.

---

## Running a workshop · tournament · permanent installation

If you'd like to collect data across teams or run a tournament tied to a paper, [request an event](request.html) *(form opens July 2026)*. Approval takes 1–2 weeks. Time-bounded workshops get credentials that auto-expire; permanent events (paper tournaments, museum installations) get open credentials.

When approved, the 📤 button in the hub becomes active for facilitators and submissions get tagged to your event for later analysis.

The 🔧 button on every page lets anyone send general feedback — a translation suggestion, a bug report, a comment, or any suggestion — open to all, no account needed.

---

## License

**CC BY-NC-ND 4.0** (Attribution-NonCommercial-NoDerivatives) — see [`LICENSE`](LICENSE).

- ✅ Share unmodified for non-commercial use, with attribution to Dr. Erika Roldán Roa.
- ❌ Modifications, derivative works, translations, and commercial use require [written permission](https://erikaroldan.net).

---

Developed in the **AI-Exhibits** Erasmus+ partnership: **Max Planck Institute for Mathematics in the Sciences** (Leipzig) · **IMAGINARY gGmbH** (Berlin) · **Institut Henri Poincaré** (Paris) · **Citizens in Power** (Nicosia) · **ITT Giordani Striano** (Naples).
