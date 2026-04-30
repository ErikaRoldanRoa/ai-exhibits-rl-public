/* ============================================================================
 * AI-Exhibits · Reinforcement Learning & Sliding Puzzles
 * Tutorial card content in all four exhibit languages.
 *
 * © 2026 Dr. Erika Roldán Roa · Max Planck Institute for Mathematics in the Sciences (MPI MiS), Leipzig · Université de Genève, Section de Mathématiques.
 * Licensed: MIT (code) · CC-BY-SA 4.0 (pedagogical documentation) · CC-BY 4.0 (assets). See LICENSE.
 * ============================================================================ */

window.LEARN_TRANSLATIONS = {
  en: [
    {
      id: "state",
      title: "State (s): what the puzzle looks like right now",
      tags: "state encoding configuration",
      public: "A **state** is simply the current arrangement of the tiles. It's the snapshot the agent looks at before deciding her next move.",
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
      tags: "Watkins theorem convergence Robbins-Monro Even-Dar PAC",
      public: "Watkins's 1992 theorem guarantees that Q-learning converges to Q* — under one impossible condition: that every (state, action) pair is visited an **infinite number of times**. In a finite universe like a Saturday-afternoon Mission III, we never reach that condition. That's the curse of dimensionality: not that the algorithm is wrong, but that its guarantees are asymptotic.",
      math: "**Theorem (Watkins-Dayan 1992).** For a finite MDP with bounded rewards, the Q-learning update Q(s,a) ← Q(s,a) + α[r + γ max_{a'} Q(s',a') − Q(s,a)] converges to Q* with probability 1 provided (i) Σ α_t(s,a) = ∞ and Σ α_t²(s,a) < ∞ for every (s,a) (Robbins-Monro 1951), and (ii) every (s,a) is visited **infinitely often**. The finite-time version (Even-Dar & Mansour 2003) gives Õ(|S|·|A|/ε²(1−γ)⁴) steps to reach |Q − Q*|_∞ ≤ ε with confidence 1−δ. For M3 at ε=0.1, γ=0.99: ~7×10¹² steps — five orders of magnitude beyond the default budget.",
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
      tags: "cost curse PAC Even-Dar AlphaZero MuZero deep RL",
      public: "On your laptop, one Q-learning step costs about **10⁻⁹ CHF** (a billionth). A full default Mission III run costs cents — basically free. But the total cost doesn't depend on the laptop alone: it depends on how many steps **the theorem** needs to learn. And that number explodes with the state-space size. AlphaZero cost ~$25M in TPU compute, and yet visited only 10⁻³⁶ of chess's state space.",
      math: "PAC bound (Even-Dar & Mansour 2003): N* = Õ(|S|·|A| · log(|S||A|/δ) / (ε²(1−γ)⁴)) steps for |Q − Q*|_∞ ≤ ε with probability ≥ 1−δ. Total cost = N* · c where c ≈ 10⁻⁹ CHF/step. For M3 (|S|=181 440, ε=0.1, γ=0.99): ~7×10¹² steps → ~7,000 CHF. For chess (|S|≈10⁴⁶): ~10⁵⁰ CHF — more than the entire world GDP. AlphaZero (Silver et al. 2018) sidesteps the curse: replaces the Q-table with a neural network f_θ(s,a) ≈ Q*(s,a). Training cost: ~$25M; inference cost: essentially zero. The function generalises to states never seen — and AlphaZero saw only ~10⁻³⁶ of the chess graph.",
      sentence: "\"Beyond a few thousand states, the Q-table is no longer learnable, not even with all the money in the world. That's why neural networks were invented.\""
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
      public: "After each move, the agent slightly revises her Q score using what just happened: the current reward plus an estimate of the best future reward.",
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
      public: "Ein **Zustand** ist einfach die aktuelle Anordnung der Kacheln. Es ist die Momentaufnahme, die die Agent*in sich ansieht, bevor sie ihren nächsten Zug entscheidet.",
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
      tags: "Watkins Theorem Konvergenz Robbins-Monro Even-Dar PAC",
      public: "Watkins' Satz von 1992 garantiert, dass Q-Learning gegen Q* konvergiert — unter einer unmöglichen Bedingung: jedes (Zustand, Aktion)-Paar muss **unendlich oft** besucht werden. In einem endlichen Universum wie einem Samstagnachmittag-Mission-III erreichen wir diese Bedingung nie. Das ist der Fluch der Dimensionalität: nicht dass der Algorithmus falsch wäre, sondern dass seine Garantien asymptotisch sind.",
      math: "**Satz (Watkins-Dayan 1992).** Für ein endliches MDP mit beschränkten Belohnungen konvergiert das Q-Learning-Update Q(s,a) ← Q(s,a) + α[r + γ max_{a'} Q(s',a') − Q(s,a)] mit Wahrscheinlichkeit 1 gegen Q*, sofern (i) Σ α_t(s,a) = ∞ und Σ α_t²(s,a) < ∞ für jedes (s,a) (Robbins-Monro 1951) und (ii) jedes (s,a) **unendlich oft** besucht wird. Die endliche Version (Even-Dar & Mansour 2003): Õ(|S|·|A|/ε²(1−γ)⁴) Schritte für |Q − Q*|_∞ ≤ ε mit Konfidenz 1−δ. Für M3 mit ε=0,1, γ=0,99: ~7×10¹² Schritte — fünf Größenordnungen über dem Standard-Budget.",
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
      tags: "Kosten curse PAC Even-Dar AlphaZero MuZero deep RL",
      public: "Auf deinem Laptop kostet ein Q-Learning-Schritt etwa **10⁻⁹ CHF** (ein Milliardstel). Ein Standard-Mission-III-Lauf kostet ein paar Rappen — praktisch nichts. Aber die Gesamtkosten hängen nicht nur vom Laptop ab: sie hängen davon ab, wie viele Schritte **der Satz** zum Lernen braucht. Und diese Zahl explodiert mit der Größe des Zustandsraums. AlphaZero kostete ~25 Millionen Dollar an TPU-Compute und besuchte trotzdem nur 10⁻³⁶ des Schach-Zustandsraums.",
      math: "PAC-Schranke (Even-Dar & Mansour 2003): N* = Õ(|S|·|A| · log(|S||A|/δ) / (ε²(1−γ)⁴)) Schritte für |Q − Q*|_∞ ≤ ε mit Wahrscheinlichkeit ≥ 1−δ. Gesamtkosten = N* · c mit c ≈ 10⁻⁹ CHF/Schritt. Für M3 (|S|=181.440, ε=0,1, γ=0,99): ~7×10¹² Schritte → ~7.000 CHF. Für Schach (|S|≈10⁴⁶): ~10⁵⁰ CHF — mehr als das gesamte Welt-BIP. AlphaZero (Silver et al. 2018) umgeht den Fluch: ersetzt die Q-Tabelle durch ein neuronales Netz f_θ(s,a) ≈ Q*(s,a). Trainingskosten: ~25 M$; Inferenzkosten: praktisch null. Die Funktion generalisiert auf nie gesehene Zustände — und AlphaZero sah nur ~10⁻³⁶ des Schachgraphen.",
      sentence: "„Jenseits einiger Tausend Zustände ist die Q-Tabelle nicht mehr lernbar, nicht einmal mit allem Geld der Welt. Deshalb wurden neuronale Netze erfunden.\""
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
      public: "Nach jedem Zug revidiert die Agent*in ihren Q-Wert leicht anhand dessen, was gerade passiert ist: die aktuelle Belohnung plus eine Schätzung der besten zukünftigen Belohnung.",
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
      public: "Uno **stato** è semplicemente la disposizione attuale delle tessere. È l'istantanea che l'agente guarda prima di decidere la sua prossima mossa.",
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
      tags: "Watkins teorema convergenza Robbins-Monro Even-Dar PAC",
      public: "Il teorema di Watkins (1992) garantisce che il Q-learning converge a Q* — a una condizione impossibile: che ogni coppia (stato, azione) sia visitata un **numero infinito di volte**. In un universo finito come un sabato pomeriggio di Missione III, non raggiungiamo mai questa condizione. Questa è la maledizione della dimensionalità: non che l'algoritmo sia sbagliato, ma che le sue garanzie siano asintotiche.",
      math: "**Teorema (Watkins-Dayan 1992).** Per un MDP finito con ricompense limitate, l'aggiornamento Q-learning Q(s,a) ← Q(s,a) + α[r + γ max_{a'} Q(s',a') − Q(s,a)] converge a Q* con probabilità 1 se (i) Σ α_t(s,a) = ∞ e Σ α_t²(s,a) < ∞ per ogni (s,a) (Robbins-Monro 1951) e (ii) ogni (s,a) è visitato **infinite volte**. La versione finita (Even-Dar & Mansour 2003): Õ(|S|·|A|/ε²(1−γ)⁴) passi per |Q − Q*|_∞ ≤ ε con confidenza 1−δ. Per M3 con ε=0,1, γ=0,99: ~7×10¹² passi — cinque ordini di grandezza oltre il budget standard.",
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
      tags: "costo curse PAC Even-Dar AlphaZero MuZero deep RL",
      public: "Sul tuo laptop, un passo di Q-learning costa circa **10⁻⁹ CHF** (un miliardesimo). Una sessione completa di Missione III costa qualche centesimo — praticamente gratis. Ma il costo totale non dipende solo dal laptop: dipende da quanti passi **il teorema** richiede per imparare. E quel numero esplode con la dimensione dello spazio degli stati. AlphaZero è costato ~25 milioni di dollari in TPU compute, e ha visitato solo 10⁻³⁶ dello spazio degli stati degli scacchi.",
      math: "Limite PAC (Even-Dar & Mansour 2003): N* = Õ(|S|·|A| · log(|S||A|/δ) / (ε²(1−γ)⁴)) passi per |Q − Q*|_∞ ≤ ε con probabilità ≥ 1−δ. Costo totale = N* · c con c ≈ 10⁻⁹ CHF/passo. Per M3 (|S|=181.440, ε=0,1, γ=0,99): ~7×10¹² passi → ~7.000 CHF. Per gli scacchi (|S|≈10⁴⁶): ~10⁵⁰ CHF — più del PIL mondiale. AlphaZero (Silver et al. 2018) aggira la maledizione: sostituisce la tabella Q con una rete neurale f_θ(s,a) ≈ Q*(s,a). Costo di addestramento: ~25 M$; costo di inferenza: praticamente nullo. La funzione generalizza a stati mai visti — e AlphaZero ha visto solo ~10⁻³⁶ del grafo degli scacchi.",
      sentence: "«Oltre qualche migliaio di stati, la tabella Q non è più apprendibile, nemmeno con tutto il denaro del mondo. Per questo si sono inventate le reti neurali.»"
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
      public: "Dopo ogni mossa, l'agente rivede leggermente il suo punteggio Q usando ciò che è appena successo: la ricompensa attuale più una stima della migliore ricompensa futura.",
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
