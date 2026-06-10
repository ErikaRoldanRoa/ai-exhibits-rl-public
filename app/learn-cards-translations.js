/* AI-Exhibits — Learn cards · EN / DE / IT translations.
 * Generated: keeps the structure of the original LEARN_TRANSLATIONS.
 * FR translations live inline in exhibit_2x2.html as LEARN_FR.
 */
window.LEARN_TRANSLATIONS = {
  en: [
    {
      id: "state",
      title: "State (s): what the puzzle looks like right now",
      tags: "state encoding configuration",
      public: "A **state** is the current arrangement of the tiles. It's the snapshot the agent looks at before choosing its next move.",
      math: "A **state** is an element s ∈ S. Here S is the finite set of all 2×2 tile configurations reachable by legal moves. We represent s as a 4-tuple (row by row) with 0 = empty.",
      sentence: "\"The state is the current snapshot of the puzzle: the position of every tile right now.\""
    },
    {
      id: "parity",
      title: "Parity orbit: why only 12 of the 24 arrangements are reachable",
      tags: "parity orbit reachable invariant n!/2 Wilson",
      public: "Of the 4! = 24 ways to arrange three tiles and a blank, only 12 are reachable from the goal — the other 12 are unsolvable. Every legal move flips **two** parities at once, and their product is invariant: half the world is invisible to the agent.",
      math: "Let σ ∈ S₄ be the permutation and b ∈ {0,1} the parity of (row + column) of the blank. Each legal move is a transposition, so sgn(σ) flips; it also moves the blank by one cell, so b flips. The product sgn(σ)·(−1)^b is invariant: it splits the 24 arrangements into two orbits of size 12, and only the goal's orbit is reachable. Wilson 1974 generalises this: for every r×c board with r,c ≥ 2, |R| = (rc)!/2.",
      sentence: "\"The state space is half what you'd expect — parity cuts it in two, and the agent only ever sees one half.\""
    },
    {
      id: "watkins-infinity",
      title: "Watkins 1992: convergence \"in the limit\"",
      tags: "Watkins theorem convergence asymptotic",
      public: "The Watkins & Dayan (1992) theorem guarantees that Q-learning converges to Q* — under one impossible condition: every (state, action) pair must be visited an **infinite number of times**. In a finite universe like Mission III, we never reach that condition. Watkins's guarantees are asymptotic; a finite budget never reaches them.",
      math: "**Theorem (Watkins & Dayan 1992).** For a finite MDP with bounded rewards and discount factor γ ∈ [0,1), the Q-learning update Q(s,a) ← Q(s,a) + α[r + γ·max_{a'} Q(s',a') − Q(s,a)] converges to Q* with probability 1 if (i) the step-size sequence α_t satisfies Σ α_t = ∞ and Σ α_t² < ∞ for every (s,a), and (ii) every (s,a) is visited **infinitely often** — an ε-greedy policy with constant ε > 0 on a *communicating* MDP supplies (ii) almost surely; if ε decays, you need Σε_t = ∞ (the GLIE condition). The result is asymptotic: it says nothing about the finite number of steps required to be close to Q*. On Mission III's 181,440 states, the default training budget is far below the convergence threshold.",
      sentence: "\"The theorem requires infinity; the curse is that we don't even reach one visit per state.\""
    },
    {
      id: "mixed-policy",
      title: "Greedy policy = uniform random in unexplored regions",
      tags: "policy greedy random mixed walk tie-breaking",
      public: "The **argmax** rule produces two different behaviours depending on accumulated experience. On a never-visited state, all Q-values are 0 — argmax picks uniformly at random among legal actions, and the policy becomes a uniform random walk. On a well-trained state, argmax returns the winning action deterministically. **One algorithm, two regimes.**",
      math: "Greedy policy with uniform tie-breaking: π(a|s) = 𝟙[a ∈ argmax_{a'} Q(s,a')] / |argmax_{a'} Q(s,a')|. On unvisited state (all Q=0), |argmax| = |A(s)| → π uniform = random walk. On well-trained state, |argmax|=1 → π deterministic. Consequence: the agent survives even with coverage |V|/|R| ≪ 1 via a **natural mixed strategy**: random walk in unexplored regions until hitting V, then argmax in the visited subgraph. Total time ≈ τ_V(s_0) (hitting time on V) + δ_V(s_τ, goal) (optimal distance within V).",
      sentence: "\"When the agent knows nothing, it acts at random. When it knows everything, it plays perfectly. Same rule, two regimes.\""
    },
    {
      id: "cost-curse",
      title: "The curse has a price",
      tags: "cost AlphaZero MuZero deep RL generalisation",
      public: "One Q-learning step on your laptop costs ≈ **10⁻¹¹ {cur}**. A full default Mission III run: a fraction of a centime. But the total bill depends on **how many steps** you need — and that number explodes with the state space.",
      math: "Marginal cost per Q-update ≈ 10⁻¹¹ {cur} (dominated by amortised hardware, not electricity). Default Mission III: ~10⁶ steps → ~10⁻⁵ {cur}. For chess (~10⁴⁴ legal positions), even at 10⁻¹¹ {cur}/step a tabular Q is unreachable: it would require orders of magnitude more steps than any machine could perform. **Beyond tabular Q:** several families bypass enumeration. DQN (Mnih et al. 2015) replaces the Q-table with a network f_θ(s,a) ≈ Q*(s,a) — this IS Q-learning, just with function approximation. AlphaZero (Silver et al. 2018) is different: it combines MCTS with a network learning a policy π_θ(a|s) and a value v_θ(s) — not Q-learning. Both share two benefits over tabular: (1) memory constant in θ, independent of |S|; (2) the function generalises — a state close to a visited one inherits a reasonable value. AlphaZero's training cost was not disclosed by DeepMind; external estimates put it in the millions to tens of millions of USD in TPU compute.",
      sentence: "\"Beyond a few thousand states, the Q-table is no longer learnable. That's why neural networks were invented.\""
    },
    {
      id: "episode-horizon",
      title: "Episode and horizon — two knobs, one budget",
      tags: "episode horizon max-steps budget reset bias variance",
      public: "Q-learning runs in **episodes**: shuffle the puzzle, try to solve it, stop on success or after **max-steps** moves, then reset to a new shuffle. Two knobs: how many episodes E and how long each one H. The total budget is B = E × H. But B alone is not enough — the *split* matters too: the reset between episodes is a structural lever on what the agent sees.",
      math: "Total step budget B = E × H. The two extremes:\n• High E, low H (many short episodes) — explores the vicinity of start states; low variance estimates.\n• Low E, high H (few long episodes) — explores deep into the state graph; richer reward propagation per episode.\n\n**Threshold**: H ≥ G (God's number) is recommended. With H < G, episodes that start more than H moves from the goal cannot finish — but warm starts land at all distances, and Q-learning bootstraps value across episodes, so it still propagates outward. Learning becomes slower, not impossible; what H ≥ G does guarantee is that the greedy evaluation of the hardest benchmark can succeed in a single attempt. M1: G=6, H=30 (5×). M2: G=21, H=60 (~3×). M3: G=31, H=120 (~4×). The c-factor is generous to accommodate ε-greedy meandering.",
      sentence: "\"Episodes are the experiments; max-steps is the patience per experiment. Same total compute, different policies.\""
    },
    {
      id: "actions",
      title: "Actions (A(s)): which moves are allowed",
      tags: "actions legal moves neighbors",
      public: "An **action** is a move you can legally make from the current position: sliding a neighboring tile into the empty square.",
      math: "A(s) ⊆ {Up, Down, Left, Right} depends on where the empty square is. The transition is deterministic: s' = f(s,a).",
      sentence: "\"From this state, my legal actions are exactly the moves that slide a tile into the empty square.\""
    },
    {
      id: "transition",
      title: "Transition (f): the puzzle's mechanics",
      tags: "transition dynamics deterministic",
      public: "The puzzle has fixed rules: if you pick a move, the puzzle changes in a predictable way.",
      math: "The transition function is f : S×A → S with s' = f(s,a). In this toy problem, P(s'|s,a) equals 1 for s'=f(s,a) and 0 otherwise.",
      sentence: "\"If I choose an action, the next state is determined by the puzzle's rules.\""
    },
    {
      id: "reward",
      title: "Reward (R): the feedback signal",
      tags: "reward feedback shaping",
      public: "A **reward** is a number that tells the agent how good the outcome is. Here, reaching the goal gives +1; other states give 0 (unless you change them).",
      math: "The reward is a function R : S → ℝ (we use the arrival reward r = R(s')). Default: R(goal)=1 and R(s)=0 otherwise. Optional shaping modifies R but can create local traps.",
      sentence: "\"The reward is the feedback number I receive after landing in the next state.\""
    },
    {
      id: "q",
      title: "Q-values (Q): how \"good\" each move is (learned)",
      tags: "Q table value function",
      public: "The **Q-table** is the agent's memory: for each state and each possible move, it stores a score — how promising that move looks.",
      math: "Q : S×A → ℝ estimates the optimal action-value function. A table stores the entries Q(s,a). It is not a transition matrix; it encodes the expected long-term return under an optimal continuation.",
      sentence: "\"Q is my learned score for 'if I take this move from here, how good will it be in the long run?'\""
    },
    {
      id: "update",
      title: "Learning update: how Q changes after an experience",
      tags: "update Bellman Q-learning",
      public: "After each move, the agent nudges its Q score using what just happened: the current reward plus an estimate of the best future reward.",
      math: "Q-learning update (off-policy): Q(s,a) ← Q(s,a) + α[r + γ max_{a'} Q(s',a') − Q(s,a)]. This happens at every step, even if r=0.",
      sentence: "\"I adjust my Q score using what I get now plus what I think I can get later.\""
    },
    {
      id: "policy",
      title: "Policy (π): how the agent picks actions",
      tags: "policy epsilon greedy behavior",
      public: "The **policy** is the rule for choosing moves. We use ε-greedy: usually pick the best known move, but sometimes explore at random.",
      math: "The policy π(a|s) is induced from Q via ε-greedy: with probability 1−ε choose an argmax action; with probability ε choose uniformly from A(s).",
      sentence: "\"Most of the time I follow my best guess, but sometimes I try something random to learn.\""
    },
    {
      id: "behavior",
      title: "Behavior: what you see happening on screen",
      tags: "sampling trajectory",
      public: "Behavior is the actual sequence of moves you're watching. It's generated by sampling actions from the policy, then applying the puzzle's mechanics.",
      math: "A trajectory is (s₀,a₀,r₀,s₁,…) where a_t ~ π(·|s_t) and s_{t+1}=f(s_t,a_t), r_t=R(s_{t+1}).",
      sentence: "\"Behavior is the path I walk through state space when I follow my policy.\""
    }
  ],
  de: [
    {
      id: "state",
      title: "Zustand (s): wie das Puzzle gerade aussieht",
      tags: "Zustand Kodierung Konfiguration state",
      public: "Ein **Zustand** ist die aktuelle Anordnung der Kacheln. Es ist die Momentaufnahme, die die Agent*in sich ansieht, bevor sie ihren nächsten Zug entscheidet.",
      math: "Ein **Zustand** ist ein Element s ∈ S. Hier ist S die endliche Menge aller 2×2-Kachelkonfigurationen, die durch legale Züge erreichbar sind. Wir stellen s als 4-Tupel (Zeile für Zeile) dar, mit 0 = leer.",
      sentence: "„Der Zustand ist die aktuelle Momentaufnahme des Puzzles: die Position jeder Kachel jetzt.\""
    },
    {
      id: "parity",
      title: "Paritätsbahn: warum nur 12 von 24 Anordnungen erreichbar sind",
      tags: "Parität Bahn erreichbar Invariante n!/2 Wilson parity",
      public: "Von 4! = 24 Anordnungen von drei Kacheln und einem leeren Feld sind nur 12 vom Ziel aus erreichbar — die anderen 12 sind unlösbar. Jeder legale Zug kehrt **zwei** Paritäten gleichzeitig um, und ihr Produkt bleibt invariant: die Hälfte der Welt ist für die Agent*in unsichtbar.",
      math: "Sei σ ∈ S₄ die Permutation und b ∈ {0,1} die Parität von (Zeile + Spalte) des leeren Feldes. Jeder legale Zug ist eine Transposition, also kehrt sgn(σ) um; er verschiebt das leere Feld um genau ein Feld, also kehrt b um. Das Produkt sgn(σ)·(−1)^b ist invariant: es zerlegt die 24 Anordnungen in zwei gleich große Bahnen, und nur die Bahn mit dem Ziel ist erreichbar. Wilson 1974 verallgemeinert: für jedes r×c-Brett mit r,c ≥ 2 gilt |R| = (rc)!/2.",
      sentence: "„Der Zustandsraum ist halb so groß, wie du erwarten würdest — Parität teilt ihn, und die Agent*in sieht nur eine Hälfte.\""
    },
    {
      id: "watkins-infinity",
      title: "Watkins 1992: Konvergenz „im Grenzwert\"",
      tags: "Watkins Theorem Konvergenz asymptotisch",
      public: "Der Satz von Watkins & Dayan (1992) garantiert, dass Q-Learning gegen Q* konvergiert — unter einer unmöglichen Bedingung: jedes (Zustand, Aktion)-Paar muss **unendlich oft** besucht werden. In einem endlichen Universum wie Mission III erreichen wir diese Bedingung nie. Watkins' Garantien sind asymptotisch; ein endliches Budget reicht nie.",
      math: "**Satz (Watkins & Dayan 1992).** Für ein endliches MDP mit beschränkten Belohnungen und Diskontfaktor γ ∈ [0,1) konvergiert das Q-Learning-Update Q(s,a) ← Q(s,a) + α[r + γ·max_{a'} Q(s',a') − Q(s,a)] mit Wahrscheinlichkeit 1 gegen Q*, sofern (i) die Schrittweite α_t für jedes (s,a) Σ α_t = ∞ und Σ α_t² < ∞ erfüllt und (ii) jedes (s,a) **unendlich oft** besucht wird — eine ε-greedy-Strategie mit konstantem ε > 0 auf einem *kommunizierenden* MDP liefert (ii) fast sicher; falls ε abnimmt, muss Σ ε_t = ∞ gelten (die GLIE-Bedingung). Das Ergebnis ist asymptotisch: es sagt nichts über die endliche Schrittanzahl bis zur Nähe von Q*. Bei Mission IIIs 181.440 Zuständen liegt das Standard-Trainingsbudget weit unter der Konvergenzschwelle.",
      sentence: "„Der Satz fordert Unendlichkeit; der Fluch ist, dass wir nicht einmal einen Besuch pro Zustand schaffen.\""
    },
    {
      id: "mixed-policy",
      title: "Greedy-Policy = uniform zufällig im unerforschten Gebiet",
      tags: "Policy greedy zufällig mixed Wanderung tie-breaking",
      public: "Die **argmax**-Regel erzeugt zwei Verhalten je nach gesammelter Erfahrung. Auf einem nie besuchten Zustand sind alle Q-Werte 0 — argmax wählt gleichverteilt unter den legalen Aktionen, und die Policy wird zur uniformen Zufallswanderung. Auf einem gut trainierten Zustand liefert argmax die Gewinneraktion deterministisch. **Ein Algorithmus, zwei Regime.**",
      math: "Greedy-Policy mit uniformem Tie-Breaking: π(a|s) = 𝟙[a ∈ argmax_{a'} Q(s,a')] / |argmax_{a'} Q(s,a')|. Auf unbesuchtem Zustand (alle Q=0), |argmax| = |A(s)| → π uniform = Zufallswanderung. Auf gut trainiertem Zustand, |argmax|=1 → π deterministisch. Konsequenz: die Agent*in überlebt auch mit Abdeckung |V|/|R| ≪ 1 durch **natürliche gemischte Strategie**: Zufallswanderung im unerforschten Bereich bis V erreicht ist, dann argmax im besuchten Teilgraphen. Gesamtzeit ≈ τ_V(s_0) + δ_V(s_τ, Ziel).",
      sentence: "„Wenn die Agent*in nichts weiß, handelt sie zufällig. Wenn sie alles weiß, spielt sie perfekt. Gleiche Regel, zwei Regime.\""
    },
    {
      id: "cost-curse",
      title: "Der Fluch hat einen Preis",
      tags: "Kosten AlphaZero MuZero deep RL Generalisierung",
      public: "Ein Q-Learning-Schritt auf deinem Laptop kostet ≈ **10⁻¹¹ {cur}**. Ein Standard-Mission-III-Lauf: ein Bruchteil eines Rappens. Aber die Gesamtkosten hängen davon ab, **wie viele Schritte** du brauchst — und diese Zahl explodiert mit dem Zustandsraum.",
      math: "Grenzkosten pro Q-Update ≈ 10⁻¹¹ {cur} (dominant ist amortisierte Hardware, nicht Strom). Standard-Mission-III: ~10⁶ Schritte → ~10⁻⁵ {cur}. Für Schach (~10⁴⁴ legale Stellungen) ist selbst bei 10⁻¹¹ {cur}/Schritt eine tabellierte Q-Funktion unerreichbar: es würde mehrere Größenordnungen mehr Schritte erfordern, als jede Maschine leisten könnte. **Jenseits des tabellarischen Q:** mehrere Algorithmusfamilien umgehen die Enumeration. DQN (Mnih et al. 2015) ersetzt die Q-Tabelle durch ein Netzwerk f_θ(s,a) ≈ Q*(s,a) — das IST immer noch Q-Learning, nur mit Funktionsapproximation. AlphaZero (Silver et al. 2018) ist anders: es kombiniert Baumsuche (MCTS) mit einem Netzwerk, das sowohl eine Politik π_θ(a|s) als auch einen Wert v_θ(s) lernt — es ist kein Q-Learning. Vorteile: (1) der Speicher ist konstant in θ, unabhängig von |S|; (2) die Funktion generalisiert — ein Zustand nahe einem besuchten erbt einen vernünftigen Wert. AlphaZeros Trainingskosten wurden von DeepMind nicht veröffentlicht; externe Schätzungen liegen im zweistelligen Millionen-USD-Bereich an TPU-Compute.",
      sentence: "„Jenseits einiger Tausend Zustände ist die Q-Tabelle nicht mehr lernbar. Deshalb wurden neuronale Netze erfunden.\""
    },
    {
      id: "episode-horizon",
      title: "Episode und Horizont — zwei Regler, ein Budget",
      tags: "Episode Horizont Max-Schritte Budget Reset Bias Varianz",
      public: "Q-Learning läuft in **Episoden**: Puzzle mischen, versuchen zu lösen, bei Erfolg oder nach **Max-Schritten** Zügen anhalten, dann auf neues Mischen zurücksetzen. Zwei Regler: wie viele Episoden E und wie lang jede H. Das Gesamtbudget ist B = E × H. Aber B allein reicht nicht — die *Aufteilung* zählt: der Reset zwischen Episoden ist ein struktureller Hebel auf das, was die Agent*in sieht.",
      math: "Gesamt-Schrittbudget B = E × H. Die zwei Extreme:\n• Viele E, kleines H (viele kurze Episoden) — erkundet die Umgebung der Startzustände; niedrige Varianz.\n• Wenige E, großes H (wenige lange Episoden) — dringt tief in den Zustandsgraphen ein; reichere Belohnungs-Propagation pro Episode.\n\n**Schwelle**: H ≥ G (Gottes Zahl) ist empfohlen. Bei H < G können Episoden, die mehr als H Züge vom Ziel entfernt starten, nicht abschließen — doch die Warmstarts landen auf allen Distanzen, und Q-Learning reicht den Wert per Bootstrap von Episode zu Episode weiter: Er breitet sich trotzdem nach außen aus. Das Lernen wird langsamer, nicht unmöglich; H ≥ G garantiert vor allem, dass die gierige Auswertung der schwersten Referenz in einem einzigen Versuch gelingen kann. M1: G=6, H=30 (5×). M2: G=21, H=60 (~3×). M3: G=31, H=120 (~4×). Der c-Faktor ist großzügig, um ε-greedy-Wanderungen zu erlauben.",
      sentence: "„Episoden sind die Experimente; Max-Schritte ist die Geduld pro Experiment. Gleiches Gesamt-Compute, unterschiedliche Strategien.\""
    },
    {
      id: "actions",
      title: "Aktionen (A(s)): welche Züge erlaubt sind",
      tags: "Aktionen legal Züge Nachbarn actions",
      public: "Eine **Aktion** ist ein Zug, den man von der aktuellen Position aus legal machen kann: eine benachbarte Kachel ins leere Feld schieben.",
      math: "A(s) ⊆ {Oben, Unten, Links, Rechts} hängt davon ab, wo das leere Feld ist. Der Übergang ist deterministisch: s' = f(s,a).",
      sentence: "„Von diesem Zustand aus sind meine legalen Aktionen genau die Züge, die eine Kachel ins leere Feld schieben.\""
    },
    {
      id: "transition",
      title: "Übergang (f): die Mechanik des Puzzles",
      tags: "Übergang Dynamik deterministisch transition",
      public: "Das Puzzle hat feste Regeln: wenn du einen Zug wählst, ändert sich das Puzzle auf vorhersehbare Weise.",
      math: "Die Übergangsfunktion ist f : S×A → S mit s' = f(s,a). In diesem Spielzeugproblem ist P(s'|s,a) gleich 1 für s'=f(s,a) und 0 sonst.",
      sentence: "„Wenn ich eine Aktion wähle, wird der nächste Zustand durch die Regeln des Puzzles bestimmt.\""
    },
    {
      id: "reward",
      title: "Belohnung (R): das Rückmeldesignal",
      tags: "Belohnung Rückmeldung Shaping reward",
      public: "Eine **Belohnung** ist eine Zahl, die der Agent*in sagt, wie gut das Ergebnis ist. Hier gibt das Erreichen des Ziels +1; andere Zustände geben 0 (es sei denn, du änderst sie).",
      math: "Die Belohnung ist eine Funktion R : S → ℝ (wir verwenden die Ankunftsbelohnung r = R(s')). Standard: R(Ziel)=1 und R(s)=0 sonst. Optionales Shaping modifiziert R, kann aber lokale Fallen erzeugen.",
      sentence: "„Die Belohnung ist die Rückmeldezahl, die ich erhalte, nachdem ich im nächsten Zustand gelandet bin.\""
    },
    {
      id: "q",
      title: "Q-Werte (Q): wie „gut\" jeder Zug ist (gelernt)",
      tags: "Q Tabelle Wert Funktion value",
      public: "Die **Q-Tabelle** ist das Gedächtnis der Agent*in: für jeden Zustand und jeden möglichen Zug speichert sie einen Wert — wie vielversprechend dieser Zug aussieht.",
      math: "Q : S×A → ℝ schätzt die optimale Aktionswertfunktion. Eine Tabelle speichert die Einträge Q(s,a). Es ist keine Übergangsmatrix; sie kodiert den erwarteten langfristigen Ertrag unter einer optimalen Fortsetzung.",
      sentence: "„Q ist mein gelernter Wert für ‚wenn ich von hier aus diesen Zug mache, wie gut wird es langfristig sein?'\""
    },
    {
      id: "update",
      title: "Lernupdate: wie sich Q nach einer Erfahrung ändert",
      tags: "Update Bellman Q-Learning Aktualisierung",
      public: "Nach jedem Zug justiert die Agent*in ihren Q-Wert anhand dessen, was gerade passiert ist: die aktuelle Belohnung plus eine Schätzung der besten zukünftigen Belohnung.",
      math: "Q-Learning-Update (off-policy): Q(s,a) ← Q(s,a) + α[r + γ max_{a'} Q(s',a') − Q(s,a)]. Dies geschieht bei jedem Schritt, auch wenn r=0.",
      sentence: "„Ich passe meinen Q-Wert an, indem ich das, was ich jetzt bekomme, mit dem verbinde, was ich glaube, später bekommen zu können.\""
    },
    {
      id: "policy",
      title: "Politik (π): wie die Agent*in Aktionen wählt",
      tags: "Politik Epsilon gierig Verhalten policy greedy",
      public: "Die **Politik** ist die Regel zur Auswahl der Züge. Wir verwenden ε-greedy: meist den besten bekannten Zug wählen, aber manchmal zufällig erkunden.",
      math: "Die Politik π(a|s) wird aus Q via ε-greedy abgeleitet: mit Wahrscheinlichkeit 1−ε wähle eine argmax-Aktion; mit Wahrscheinlichkeit ε wähle gleichverteilt aus A(s).",
      sentence: "„Meistens folge ich meiner besten Schätzung, aber manchmal probiere ich etwas Zufälliges, um zu lernen.\""
    },
    {
      id: "behavior",
      title: "Verhalten: was du auf dem Bildschirm passieren siehst",
      tags: "Sampling Trajektorie sampling trajectory",
      public: "Verhalten ist die tatsächliche Zugfolge, die du beobachtest. Sie wird erzeugt, indem Aktionen aus der Politik gezogen und dann die Puzzlemechanik angewendet wird.",
      math: "Eine Trajektorie ist (s₀,a₀,r₀,s₁,…) wobei a_t ~ π(·|s_t) und s_{t+1}=f(s_t,a_t), r_t=R(s_{t+1}).",
      sentence: "„Verhalten ist der Weg, den ich durch den Zustandsraum gehe, wenn ich meiner Politik folge.\""
    }
  ],
  it: [
    {
      id: "state",
      title: "Stato (s): com'è il puzzle in questo momento",
      tags: "stato codifica configurazione state",
      public: "Uno **stato** è la disposizione attuale delle tessere. È l'istantanea che l'agente guarda prima di decidere la sua prossima mossa.",
      math: "Uno **stato** è un elemento s ∈ S. Qui S è l'insieme finito di tutte le configurazioni di tessere 2×2 raggiungibili con mosse legali. Rappresentiamo s come una 4-upla (riga per riga) con 0 = vuoto.",
      sentence: "«Lo stato è l'istantanea attuale del puzzle: la posizione di ogni tessera adesso.»"
    },
    {
      id: "parity",
      title: "Orbita di parità: perché solo 12 disposizioni su 24 sono raggiungibili",
      tags: "parità orbita raggiungibile invariante n!/2 Wilson parity",
      public: "Delle 4! = 24 disposizioni di tre tessere e uno spazio vuoto, solo 12 sono raggiungibili dall'obiettivo — le altre 12 sono irrisolvibili. Ogni mossa legale inverte **due** parità insieme, e il loro prodotto resta invariante: metà del mondo è invisibile all'agente.",
      math: "Sia σ ∈ S₄ la permutazione e b ∈ {0,1} la parità di (riga + colonna) dello spazio vuoto. Ogni mossa legale è una trasposizione, quindi sgn(σ) si inverte; sposta lo spazio vuoto esattamente di una cella, quindi b si inverte. Il prodotto sgn(σ)·(−1)^b è invariante: divide le 24 disposizioni in due orbite di pari dimensione, e solo l'orbita dell'obiettivo è raggiungibile. Wilson 1974 generalizza: per ogni scacchiera r×c con r,c ≥ 2 vale |R| = (rc)!/2.",
      sentence: "«Lo spazio degli stati è la metà di quanto ti aspetteresti — la parità lo divide a metà, e l'agente vede solo una metà.»"
    },
    {
      id: "watkins-infinity",
      title: "Watkins 1992: convergenza «al limite»",
      tags: "Watkins teorema convergenza asintotico",
      public: "Il teorema di Watkins & Dayan (1992) garantisce che il Q-learning converge a Q* — a una condizione impossibile: ogni coppia (stato, azione) deve essere visitata un **numero infinito di volte**. In un universo finito come Missione III, non raggiungiamo mai questa condizione. Le garanzie di Watkins sono asintotiche; un budget finito non basta.",
      math: "**Teorema (Watkins & Dayan 1992).** Per un MDP finito con ricompense limitate e fattore di sconto γ ∈ [0,1), l'aggiornamento Q-learning Q(s,a) ← Q(s,a) + α[r + γ·max_{a'} Q(s',a') − Q(s,a)] converge a Q* con probabilità 1 se (i) la sequenza α_t soddisfa Σ α_t = ∞ e Σ α_t² < ∞ per ogni (s,a) e (ii) ogni (s,a) è visitato **infinite volte** — una politica ε-greedy con ε > 0 costante su un MDP *comunicante* fornisce (ii) quasi sicuramente; se ε decade, occorre Σε_t = ∞ (la condizione GLIE). Il risultato è asintotico: non dice nulla sul numero finito di passi necessari per essere vicini a Q*. Sui 181.440 stati di Missione III, il budget di addestramento standard è molto al di sotto della soglia di convergenza.",
      sentence: "«Il teorema richiede l'infinito; la maledizione è che non raggiungiamo nemmeno una visita per stato.»"
    },
    {
      id: "mixed-policy",
      title: "Politica greedy = casuale uniforme nelle zone inesplorate",
      tags: "politica greedy casuale mixed cammino tie-breaking",
      public: "La regola **argmax** produce due comportamenti diversi a seconda dell'esperienza accumulata. Su uno stato mai visitato, tutti i valori Q sono 0 — argmax sceglie uniformemente tra le azioni legali, e la politica diventa una passeggiata casuale uniforme. Su uno stato ben addestrato, argmax restituisce l'azione vincente in modo deterministico. **Un solo algoritmo, due regimi.**",
      math: "Politica greedy con tie-breaking uniforme: π(a|s) = 𝟙[a ∈ argmax_{a'} Q(s,a')] / |argmax_{a'} Q(s,a')|. Su stato non visitato (tutte Q=0), |argmax| = |A(s)| → π uniforme = passeggiata casuale. Su stato ben addestrato, |argmax|=1 → π deterministica. Conseguenza: l'agente sopravvive anche con copertura |V|/|R| ≪ 1 tramite **strategia mista naturale**: passeggiata casuale nell'inesplorato fino a raggiungere V, poi argmax nel sottografo visitato. Tempo totale ≈ τ_V(s_0) + δ_V(s_τ, obiettivo).",
      sentence: "«Quando l'agente non sa nulla, agisce a caso. Quando sa tutto, gioca perfettamente. Stessa regola, due regimi.»"
    },
    {
      id: "cost-curse",
      title: "La maledizione ha un prezzo",
      tags: "costo AlphaZero MuZero deep RL generalizzazione",
      public: "Un passo di Q-learning sul tuo laptop costa ≈ **10⁻¹¹ {cur}**. Una Missione III completa di default: una frazione di centesimo. Ma il costo totale dipende da **quanti passi** servono — e quel numero esplode con lo spazio degli stati.",
      math: "Costo marginale per aggiornamento Q ≈ 10⁻¹¹ {cur} (dominato dall'ammortamento hardware, non dall'elettricità). Missione III standard: ~10⁶ passi → ~10⁻⁵ {cur}. Per gli scacchi (~10⁴⁴ posizioni legali), anche a 10⁻¹¹ {cur}/passo una Q tabulare è irraggiungibile: richiederebbe ordini di grandezza più passi di quanti qualsiasi macchina possa eseguire. **Oltre il Q tabulare:** diverse famiglie evitano l'enumerazione. DQN (Mnih et al. 2015) sostituisce la tabella Q con una rete f_θ(s,a) ≈ Q*(s,a) — è ancora Q-learning, con approssimazione funzionale. AlphaZero (Silver et al. 2018) è diverso: combina MCTS con una rete che apprende una politica π_θ(a|s) e un valore v_θ(s) — non è Q-learning. Entrambi condividono due vantaggi rispetto al tabulare: (1) memoria costante in θ, indipendente da |S|; (2) la funzione generalizza — uno stato vicino a uno visitato eredita un valore ragionevole. Il costo di addestramento di AlphaZero non è stato divulgato da DeepMind; le stime esterne lo collocano in decine di milioni di USD in compute TPU.",
      sentence: "«Oltre qualche migliaio di stati, la tabella Q non è più apprendibile. Per questo si sono inventate le reti neurali.»"
    },
    {
      id: "episode-horizon",
      title: "Episodio e orizzonte — due manopole, un budget",
      tags: "episodio orizzonte passi-max budget reset bias varianza",
      public: "Il Q-learning gira in **episodi**: mescolare il puzzle, provare a risolverlo, fermarsi al successo o dopo **passi-max** mosse, poi ricominciare con un nuovo mescolamento. Due manopole: quanti episodi E e la lunghezza H di ciascuno. Il budget totale è B = E × H. Ma B da solo non basta — la *ripartizione* conta: il reset tra episodi è una leva strutturale su ciò che l'agente vede.",
      math: "Budget totale di passi B = E × H. I due estremi:\n• Grande E, piccolo H (molti episodi brevi) — esplora i dintorni degli stati di partenza; stime a bassa varianza.\n• Piccolo E, grande H (pochi episodi lunghi) — penetra in profondità nel grafo degli stati; propagazione di ricompensa più ricca per episodio.\n\n**Soglia**: H ≥ G (Numero di Dio) è raccomandato. Con H < G, gli episodi che partono a più di H mosse dall'obiettivo non possono concludersi — ma le partenze mescolate cadono a tutte le distanze, e il Q-learning trasmette il valore da un episodio all'altro per bootstrap: si propaga comunque verso l'esterno. L'apprendimento diventa più lento, non impossibile; H ≥ G garantisce soprattutto che la valutazione greedy del riferimento più difficile possa riuscire in un solo tentativo. M1: G=6, H=30 (5×). M2: G=21, H=60 (~3×). M3: G=31, H=120 (~4×). Il fattore c è generoso per accomodare i giri di ε-greedy.",
      sentence: "«Gli episodi sono gli esperimenti; passi-max è la pazienza per esperimento. Stesso calcolo totale, politiche diverse.»"
    },
    {
      id: "actions",
      title: "Azioni (A(s)): quali mosse sono permesse",
      tags: "azioni legale mosse vicini actions",
      public: "Un'**azione** è una mossa che si può fare legalmente dalla posizione attuale: far scivolare una tessera vicina nella casella vuota.",
      math: "A(s) ⊆ {Su, Giù, Sinistra, Destra} dipende da dove si trova la casella vuota. La transizione è deterministica: s' = f(s,a).",
      sentence: "«Da questo stato, le mie azioni legali sono esattamente le mosse che fanno scivolare una tessera nella casella vuota.»"
    },
    {
      id: "transition",
      title: "Transizione (f): la meccanica del puzzle",
      tags: "transizione dinamica deterministica transition",
      public: "Il puzzle ha regole fisse: se scegli una mossa, il puzzle cambia in modo prevedibile.",
      math: "La funzione di transizione è f : S×A → S con s' = f(s,a). In questo problema-giocattolo, P(s'|s,a) vale 1 per s'=f(s,a) e 0 altrimenti.",
      sentence: "«Se scelgo un'azione, lo stato successivo è determinato dalle regole del puzzle.»"
    },
    {
      id: "reward",
      title: "Ricompensa (R): il segnale di ritorno",
      tags: "ricompensa feedback modellamento reward",
      public: "Una **ricompensa** è un numero che indica all'agente quanto è buono il risultato. Qui, raggiungere l'obiettivo dà +1; gli altri stati danno 0 (a meno che tu non li modifichi).",
      math: "La ricompensa è una funzione R : S → ℝ (usiamo la ricompensa di arrivo r = R(s')). Predefinito: R(obiettivo)=1 e R(s)=0 altrimenti. Il modellamento opzionale modifica R ma può creare trappole locali.",
      sentence: "«La ricompensa è il numero di ritorno che ricevo dopo essere arrivata nello stato successivo.»"
    },
    {
      id: "q",
      title: "Valori Q (Q): quanto è «buona» ogni mossa (appreso)",
      tags: "Q tabella valore funzione value",
      public: "La **tabella Q** è la memoria dell'agente: per ogni stato e ogni mossa possibile, memorizza un punteggio — quanto quella mossa sembra promettente.",
      math: "Q : S×A → ℝ stima la funzione di valore d'azione ottimale. Una tabella memorizza le voci Q(s,a). Non è una matrice di transizione; codifica il ritorno atteso a lungo termine sotto una continuazione ottimale.",
      sentence: "«Q è il mio punteggio appreso per «se faccio questa mossa da qui, quanto sarà buona a lungo termine?»»"
    },
    {
      id: "update",
      title: "Aggiornamento dell'apprendimento: come Q cambia dopo un'esperienza",
      tags: "aggiornamento Bellman Q-learning update",
      public: "Dopo ogni mossa, l'agente aggiusta il suo punteggio Q usando ciò che è appena successo: la ricompensa attuale più una stima della migliore ricompensa futura.",
      math: "Aggiornamento Q-learning (off-policy): Q(s,a) ← Q(s,a) + α[r + γ max_{a'} Q(s',a') − Q(s,a)]. Questo avviene a ogni passo, anche se r=0.",
      sentence: "«Aggiusto il mio punteggio Q usando ciò che ricevo ora più ciò che penso di poter ottenere dopo.»"
    },
    {
      id: "policy",
      title: "Politica (π): come l'agente sceglie le azioni",
      tags: "politica epsilon goloso comportamento policy greedy",
      public: "La **politica** è la regola per scegliere le mosse. Usiamo ε-greedy: di solito scegliere la migliore mossa conosciuta, ma a volte esplorare a caso.",
      math: "La politica π(a|s) è indotta da Q tramite ε-greedy: con probabilità 1−ε scegliere un'azione argmax; con probabilità ε scegliere uniformemente da A(s).",
      sentence: "«La maggior parte del tempo seguo la mia migliore stima, ma a volte provo qualcosa a caso per imparare.»"
    },
    {
      id: "behavior",
      title: "Comportamento: ciò che vedi accadere sullo schermo",
      tags: "campionamento traiettoria sampling trajectory",
      public: "Il comportamento è la sequenza reale di mosse che stai guardando. È generata campionando azioni dalla politica, poi applicando la meccanica del puzzle.",
      math: "Una traiettoria è (s₀,a₀,r₀,s₁,…) dove a_t ~ π(·|s_t) e s_{t+1}=f(s_t,a_t), r_t=R(s_{t+1}).",
      sentence: "«Il comportamento è il percorso che faccio nello spazio degli stati quando seguo la mia politica.»"
    }
  ]
};
