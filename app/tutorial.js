/* ============================================================================
 * AI-Exhibits · Reinforcement Learning & Sliding Puzzles
 * Onboarding tutorial flow for first-time users.
 *
 * © 2026 Dr. Erika Roldán Roa. All rights reserved by the author.
 * Licensed: CC BY-NC-ND 4.0. See LICENSE.
 * ============================================================================ */

(function() {
  'use strict';

  // ------- Content per language -------------------------------------------
  const CONTENT = {
    fr: {
      ui: {
        skip: 'Passer le tutoriel ✕',
        prev: 'Retour',
        next: 'Suivant',
        finish: 'Terminer',
        launch: "Lancer l'entraînement !",
        stepOf: (i, n) => `Étape ${i} sur ${n}`,
        hint: 'Appuie sur <kbd>ESPACE</kbd> ou <kbd>ENTRÉE</kbd> pour continuer · <kbd>ÉCHAP</kbd> pour passer',
        skipConfirm: 'Passer tous les tutoriels ? Tu peux toujours le réinitialiser dans les paramètres.',
        completeTitle: 'Tu es prête à entraîner !',
        completeText: "Tu comprends maintenant les bases du Q-learning. Lance l'entraînement et regarde ton agente apprendre !"
      },
      configs: {
        '2x2': {
          mission: "🎮 Mission d'entraînement : 2×2",
          title: 'Bienvenue dans le Q-Learning !',
          subtitle: 'Apprenez à entraîner un agente IA à résoudre des puzzles à glissement',
          steps: [
            { icon: '🧩', title: 'Comprendre le Puzzle',
              text: "Ceci est un <strong>puzzle à glissement</strong>. Cliquez sur les tuiles adjacentes à la case vide pour les glisser. Ton objectif : arranger les tuiles dans l'ordre (1, 2, 3, case vide)." },
            { icon: '⚙️', title: "Paramètres d'Entraînement",
              text: "Ceux-ci contrôlent comment ton IA apprend. <strong>Épisodes</strong> = tours de pratique, <strong>Taux d'apprentissage (α)</strong> = à quelle vitesse elle apprend, <strong>Escompte (γ)</strong> = combien elle valorise les récompenses futures. Commence avec les valeurs par défaut !" },
            { icon: '🚀', title: 'Entraîne ton Agent',
              text: "Clique sur <code>Entraîner</code> et observe les <strong>valeurs Q</strong> se mettre à jour en temps réel à mesure que ton agente apprend quels coups mènent au succès." },
            { icon: '🏆', title: 'Tester & Comparer',
              text: "Utilise les <strong>Références</strong> pour tester ton agente entraînée sur des puzzles fixes. Compare sa performance aux coups aléatoires et aux solutions humaines. Peux-tu entraîner une agente qui bat les deux ?" }
          ]
        },
        '2x3': {
          mission: "🎮 Mission d'entraînement : 2×3",
          title: 'Monter en Échelle : Puzzles plus Grands',
          subtitle: 'Observe la propagation de valeur en action avec plus d\'états',
          steps: [
            { icon: '📈', title: "Espace d'États plus Complexe",
              text: "Un <strong>puzzle 2×3</strong> a <strong>360 états accessibles</strong> (contre 12 pour le 2×2) — c'est 30× plus ! La moitié des permutations est inaccessible à cause de la parité des mouvements. L'apprentissage prend plus de temps, mais les principes sont identiques." },
            { icon: '⏱️', title: "Ajuster le Temps d'Entraînement",
              text: "Il te faudra <strong>plus d'épisodes</strong> (essaye 500-1000) et plus d'<strong>étapes max</strong> (40-60) car le puzzle est plus grand. Sois patiente — une bonne IA prend du temps à entraîner !" },
            { icon: '🌊', title: 'Propagation de Valeur',
              text: "Regarde les <strong>valeurs Q</strong> se diffuser à rebours depuis l'objectif ! Un <strong>γ (escompte)</strong> plus élevé aide les valeurs à se propager plus loin dans l'espace d'états." },
            { icon: '🎯', title: 'Performance sur les Références',
              text: "Compare ton agente aux références. Remarque combien un agente entraînée est meilleur qu'une exploration aléatoire ! C'est la puissance de l'apprentissage par renforcement." }
          ]
        },
        '3x3': {
          mission: "🎮 Mission d'entraînement : 3×3",
          title: 'Mode Expert : Puzzle-8 Complet',
          subtitle: 'Le défi IA classique — ton agente peut-il le maîtriser ?',
          steps: [
            { icon: '💪', title: 'Le Défi Classique',
              text: "Le <strong>puzzle-8 (3×3)</strong> a 181 440 états ! C'est un vrai problème de référence en IA. Ton agente aura besoin d'un temps d'entraînement sérieux." },
            { icon: '🔥', title: 'Configuration Intensive',
              text: "Pour le 3×3, utilise <strong>2000+ épisodes</strong> et <strong>100+ étapes max</strong>. Envisage d'augmenter le taux d'apprentissage au départ. C'est ici que la patience paie !" },
            { icon: '🧠', title: "Regarde l'Intelligence Émerger",
              text: "À mesure que l'entraînement progresse, tu verras ton agente passer de coups aléatoires à une résolution intelligente. C'est l'<strong>émergence</strong> — un comportement complexe à partir de règles simples !" },
            { icon: '🏅', title: 'Atteindre la Maîtrise',
              text: "Un agent bien entraîné devrait résoudre les références en un nombre de coups presque optimal. Compare à la référence aléatoire — vois le chemin parcouru par ton agente ! Tu as entraîné une vraie IA." }
          ]
        }
      },
      tips: {
        '2x2': [
          { label: 'Astuce rapide', text: 'Commence avec les paramètres par défaut — ils marchent bien !' },
          { label: 'Astuce de pro', text: "Diminue epsilon (ε) une fois que l'agent commence à apprendre, pour plus d'exploitation." },
          { label: 'À observer', text: "Les valeurs Q se diffusant à rebours depuis l'état objectif." }
        ],
        '2x3': [
          { label: 'Astuce rapide', text: 'Augmente les épisodes à 500-1000 pour une meilleure convergence.' },
          { label: 'Astuce de pro', text: 'Un gamma élevé (γ ≈ 0,95-0,99) aide à la propagation des valeurs.' },
          { label: 'À observer', text: "L'agent qui découvre des chemins de solution efficaces." }
        ],
        '3x3': [
          { label: 'Astuce rapide', text: 'Sois patiente ! Il faut au minimum 2000+ épisodes.' },
          { label: 'Astuce de pro', text: 'Essaye α=0,5, γ=0,95, ε=0,10 pour de bons résultats.' },
          { label: 'À observer', text: "L'émergence d'un comportement intelligent après ~1000 épisodes." }
        ]
      }
    },
    en: {
      ui: {
        skip: 'Skip tutorial ✕',
        prev: 'Back',
        next: 'Next',
        finish: 'Finish',
        launch: 'Start training!',
        stepOf: (i, n) => `Step ${i} of ${n}`,
        hint: 'Press <kbd>SPACE</kbd> or <kbd>ENTER</kbd> to continue · <kbd>ESC</kbd> to skip',
        skipConfirm: 'Skip all tutorials? You can always reset them in the settings.',
        completeTitle: "You're ready to train!",
        completeText: 'You now understand the basics of Q-learning. Launch the training and watch your agent learn!'
      },
      configs: {
        '2x2': {
          mission: '🎮 Training mission: 2×2',
          title: 'Welcome to Q-Learning!',
          subtitle: 'Learn how to train an AI agent to solve sliding puzzles',
          steps: [
            { icon: '🧩', title: 'Understand the Puzzle',
              text: 'This is a <strong>sliding puzzle</strong>. Click tiles adjacent to the empty cell to slide them. Your goal: arrange the tiles in order (1, 2, 3, empty cell).' },
            { icon: '⚙️', title: 'Training Parameters',
              text: 'These control how your AI learns. <strong>Episodes</strong> = practice rounds, <strong>Learning rate (α)</strong> = how fast it learns, <strong>Discount (γ)</strong> = how much it values future rewards. Start with the defaults!' },
            { icon: '🚀', title: 'Train your Agent',
              text: 'Click <code>Train</code> and watch the <strong>Q-values</strong> update in real time as your agent learns which moves lead to success.' },
            { icon: '🏆', title: 'Test & Compare',
              text: 'Use the <strong>Benchmarks</strong> to test your trained agent on fixed puzzles. Compare its performance to random moves and human solutions. Can you train an agent that beats both?' }
          ]
        },
        '2x3': {
          mission: '🎮 Training mission: 2×3',
          title: 'Scaling Up: Larger Puzzles',
          subtitle: 'Watch value propagation at work with more states',
          steps: [
            { icon: '📈', title: 'Larger State Space',
              text: 'A <strong>2×3 puzzle</strong> has <strong>360 reachable states</strong> (vs. 12 for 2×2) — that\'s 30× more! Half of the permutations are unreachable because of move parity. Learning takes longer, but the principles are identical.' },
            { icon: '⏱️', title: 'Adjust the Training Time',
              text: "You'll need <strong>more episodes</strong> (try 500-1000) and more <strong>max steps</strong> (40-60) because the puzzle is larger. Be patient — a good AI takes time to train!" },
            { icon: '🌊', title: 'Value Propagation',
              text: 'Watch the <strong>Q-values</strong> diffuse backwards from the goal! A higher <strong>γ (discount)</strong> helps values propagate farther across the state space.' },
            { icon: '🎯', title: 'Benchmark Performance',
              text: "Compare your agent to the benchmarks. Notice how much better a trained agent is than random exploration! That's the power of reinforcement learning." }
          ]
        },
        '3x3': {
          mission: '🎮 Training mission: 3×3',
          title: 'Expert Mode: Full 8-Puzzle',
          subtitle: 'The classic AI challenge — can your agent master it?',
          steps: [
            { icon: '💪', title: 'The Classic Challenge',
              text: 'The <strong>8-puzzle (3×3)</strong> has 181,440 states! It\'s a genuine AI benchmark problem. Your agent will need serious training time.' },
            { icon: '🔥', title: 'Intensive Configuration',
              text: 'For 3×3, use <strong>2000+ episodes</strong> and <strong>100+ max steps</strong>. Consider raising the learning rate at the start. This is where patience pays off!' },
            { icon: '🧠', title: 'Watch Intelligence Emerge',
              text: 'As training progresses, you\'ll see your agent shift from random moves to intelligent solving. This is <strong>emergence</strong> — complex behaviour from simple rules!' },
            { icon: '🏅', title: 'Reach Mastery',
              text: 'A well-trained agent should solve the benchmarks in near-optimal moves. Compare to the random baseline — see how far your agent has come! You trained a real AI.' }
          ]
        }
      },
      tips: {
        '2x2': [
          { label: 'Quick tip', text: 'Start with the default parameters — they work well!' },
          { label: 'Pro tip', text: 'Lower epsilon (ε) once the agent starts learning, for more exploitation.' },
          { label: 'Watch for', text: 'Q-values diffusing backwards from the goal state.' }
        ],
        '2x3': [
          { label: 'Quick tip', text: 'Raise episodes to 500-1000 for better convergence.' },
          { label: 'Pro tip', text: 'A high gamma (γ ≈ 0.95-0.99) helps value propagation.' },
          { label: 'Watch for', text: 'The agent discovering efficient solution paths.' }
        ],
        '3x3': [
          { label: 'Quick tip', text: 'Be patient! You need at least 2000+ episodes.' },
          { label: 'Pro tip', text: 'Try α=0.5, γ=0.95, ε=0.10 for good results.' },
          { label: 'Watch for', text: 'Intelligent behaviour emerging around ~1000 episodes.' }
        ]
      }
    },
    de: {
      ui: {
        skip: 'Tutorial überspringen ✕',
        prev: 'Zurück',
        next: 'Weiter',
        finish: 'Fertig',
        launch: 'Training starten!',
        stepOf: (i, n) => `Schritt ${i} von ${n}`,
        hint: 'Drücke <kbd>LEERTASTE</kbd> oder <kbd>ENTER</kbd> zum Weitergehen · <kbd>ESC</kbd> zum Überspringen',
        skipConfirm: 'Alle Tutorials überspringen? Du kannst sie jederzeit in den Einstellungen zurücksetzen.',
        completeTitle: 'Du bist bereit zu trainieren!',
        completeText: 'Du verstehst jetzt die Grundlagen von Q-Learning. Starte das Training und sieh deinem Agenten beim Lernen zu!'
      },
      configs: {
        '2x2': {
          mission: '🎮 Trainingsmission: 2×2',
          title: 'Willkommen bei Q-Learning!',
          subtitle: 'Lerne, wie man eine KI-Agent*in trainiert, um Schiebepuzzles zu lösen',
          steps: [
            { icon: '🧩', title: 'Das Puzzle verstehen',
              text: 'Das ist ein <strong>Schiebepuzzle</strong>. Klicke auf Kacheln neben dem leeren Feld, um sie zu verschieben. Dein Ziel: die Kacheln in die richtige Reihenfolge bringen (1, 2, 3, leer).' },
            { icon: '⚙️', title: 'Trainingsparameter',
              text: 'Diese steuern, wie deine KI lernt. <strong>Episoden</strong> = Übungsrunden, <strong>Lernrate (α)</strong> = wie schnell sie lernt, <strong>Diskont (γ)</strong> = wie stark sie zukünftige Belohnungen gewichtet. Beginne mit den Standardwerten!' },
            { icon: '🚀', title: 'Trainiere deine Agent*in',
              text: 'Klicke auf <code>Trainieren</code> und schau zu! Du wirst die <strong>Q-Werte</strong> in Echtzeit aktualisiert sehen, während deine Agent*in lernt, welche Züge zum Erfolg führen.' },
            { icon: '🏆', title: 'Testen & Vergleichen',
              text: 'Nutze die <strong>Benchmarks</strong>, um deine trainierte Agent*in an festen Puzzles zu testen. Vergleiche ihre Leistung mit zufälligen Zügen und menschlichen Lösungen. Kannst du eine Agent*in trainieren, die beide schlägt?' }
          ]
        },
        '2x3': {
          mission: '🎮 Trainingsmission: 2×3',
          title: 'Skalieren: Größere Puzzles',
          subtitle: 'Beobachte Wertpropagation in Aktion mit mehr Zuständen',
          steps: [
            { icon: '📈', title: 'Größerer Zustandsraum',
              text: 'Ein <strong>2×3-Puzzle</strong> hat <strong>360 erreichbare Zustände</strong> (gegenüber 12 beim 2×2) — das sind 30× mehr! Die Hälfte der Permutationen ist wegen der Paritätsregel nicht erreichbar. Das Lernen dauert länger, aber die Prinzipien sind identisch.' },
            { icon: '⏱️', title: 'Trainingszeit anpassen',
              text: 'Du brauchst <strong>mehr Episoden</strong> (versuche 500-1000) und mehr <strong>max. Schritte</strong> (40-60), weil das Puzzle größer ist. Habe Geduld — eine gute KI braucht Zeit!' },
            { icon: '🌊', title: 'Wertpropagation',
              text: 'Sieh, wie sich die <strong>Q-Werte</strong> rückwärts vom Ziel ausbreiten! Ein höheres <strong>γ (Diskont)</strong> hilft Werten, weiter durch den Zustandsraum zu fließen.' },
            { icon: '🎯', title: 'Benchmark-Leistung',
              text: 'Vergleiche deine Agent*in mit den Benchmarks. Beachte, wie viel besser eine trainierte Agent*in ist als zufälliges Erkunden! Das ist die Kraft des Reinforcement Learnings.' }
          ]
        },
        '3x3': {
          mission: '🎮 Trainingsmission: 3×3',
          title: 'Expertenmodus: Das vollständige 8er-Puzzle',
          subtitle: 'Die klassische KI-Herausforderung — kann deine Agent*in sie meistern?',
          steps: [
            { icon: '💪', title: 'Die klassische Herausforderung',
              text: 'Das <strong>8er-Puzzle (3×3)</strong> hat 181.440 Zustände! Es ist ein echtes KI-Benchmark-Problem. Deine Agent*in wird ernsthafte Trainingszeit brauchen.' },
            { icon: '🔥', title: 'Intensive Konfiguration',
              text: 'Für das 3×3 nutze <strong>2000+ Episoden</strong> und <strong>100+ max. Schritte</strong>. Erwäge, die Lernrate anfangs zu erhöhen. Hier zahlt sich Geduld aus!' },
            { icon: '🧠', title: 'Intelligenz entsteht — beobachte sie',
              text: 'Während das Training fortschreitet, siehst du deine Agent*in von zufälligen Zügen zu intelligentem Lösen wechseln. Das ist <strong>Emergenz</strong> — komplexes Verhalten aus einfachen Regeln!' },
            { icon: '🏅', title: 'Meisterschaft erreichen',
              text: 'Eine gut trainierte Agent*in sollte die Benchmarks mit nahezu optimalen Zügen lösen. Vergleiche mit der Zufallsbasis — sieh, wie weit deine Agent*in gekommen ist! Du hast eine echte KI trainiert.' }
          ]
        }
      },
      tips: {
        '2x2': [
          { label: 'Schnelltipp', text: 'Beginne mit den Standardparametern — sie funktionieren gut!' },
          { label: 'Profitipp', text: 'Senke epsilon (ε), sobald die Agent*in zu lernen beginnt, für mehr Ausbeutung.' },
          { label: 'Achte auf', text: 'Q-Werte, die sich rückwärts vom Zielzustand ausbreiten.' }
        ],
        '2x3': [
          { label: 'Schnelltipp', text: 'Erhöhe die Episoden auf 500-1000 für bessere Konvergenz.' },
          { label: 'Profitipp', text: 'Ein hohes gamma (γ ≈ 0,95-0,99) hilft der Wertpropagation.' },
          { label: 'Achte auf', text: 'Die Agent*in, die effiziente Lösungswege entdeckt.' }
        ],
        '3x3': [
          { label: 'Schnelltipp', text: 'Habe Geduld! Du brauchst mindestens 2000+ Episoden.' },
          { label: 'Profitipp', text: 'Versuche α=0,5, γ=0,95, ε=0,10 für gute Ergebnisse.' },
          { label: 'Achte auf', text: 'Intelligentes Verhalten, das nach ~1000 Episoden entsteht.' }
        ]
      }
    },
    it: {
      ui: {
        skip: 'Salta il tutorial ✕',
        prev: 'Indietro',
        next: 'Avanti',
        finish: 'Termina',
        launch: "Avvia l'addestramento!",
        stepOf: (i, n) => `Passo ${i} di ${n}`,
        hint: 'Premi <kbd>SPAZIO</kbd> o <kbd>INVIO</kbd> per continuare · <kbd>ESC</kbd> per saltare',
        skipConfirm: 'Saltare tutti i tutorial? Puoi sempre ripristinarli dalle impostazioni.',
        completeTitle: 'Sei pronta ad addestrare!',
        completeText: "Ora conosci le basi del Q-learning. Avvia l'addestramento e guarda la tua agente imparare!"
      },
      configs: {
        '2x2': {
          mission: '🎮 Missione di addestramento: 2×2',
          title: 'Benvenuta nel Q-Learning!',
          subtitle: "Impara ad addestrare un'agente IA a risolvere puzzle a scorrimento",
          steps: [
            { icon: '🧩', title: 'Capire il Puzzle',
              text: 'Questo è un <strong>puzzle a scorrimento</strong>. Clicca le tessere adiacenti alla casella vuota per farle scivolare. Il tuo obiettivo: disporre le tessere in ordine (1, 2, 3, casella vuota).' },
            { icon: '⚙️', title: 'Parametri di Addestramento',
              text: "Questi controllano come impara la tua IA. <strong>Episodi</strong> = turni di pratica, <strong>Tasso di apprendimento (α)</strong> = quanto velocemente impara, <strong>Sconto (γ)</strong> = quanto valorizza le ricompense future. Inizia con i valori predefiniti!" },
            { icon: '🚀', title: 'Addestra la tua Agente',
              text: "Clicca su <code>Addestra</code> e guarda i <strong>valori Q</strong> aggiornarsi in tempo reale mentre la tua agente impara quali mosse portano al successo." },
            { icon: '🏆', title: 'Testare & Confrontare',
              text: "Usa i <strong>Benchmark</strong> per testare la tua agente addestrata su puzzle fissi. Confronta la sua prestazione con mosse casuali e soluzioni umane. Riesci ad addestrare un'agente che batte entrambi?" }
          ]
        },
        '2x3': {
          mission: '🎮 Missione di addestramento: 2×3',
          title: 'Scalare: Puzzle più Grandi',
          subtitle: 'Osserva la propagazione del valore in azione con più stati',
          steps: [
            { icon: '📈', title: 'Spazio degli Stati più Grande',
              text: "Un <strong>puzzle 2×3</strong> ha <strong>360 stati raggiungibili</strong> (contro 12 per il 2×2) — sono 30× in più! Metà delle permutazioni non è raggiungibile a causa della parità delle mosse. L'apprendimento richiede più tempo, ma i principi sono identici." },
            { icon: '⏱️', title: 'Regolare il Tempo di Addestramento',
              text: "Ti serviranno <strong>più episodi</strong> (prova 500-1000) e più <strong>passi massimi</strong> (40-60) perché il puzzle è più grande. Abbi pazienza — una buona IA richiede tempo!" },
            { icon: '🌊', title: 'Propagazione del Valore',
              text: "Guarda i <strong>valori Q</strong> diffondersi all'indietro dall'obiettivo! Un <strong>γ (sconto)</strong> più alto aiuta i valori a propagarsi più lontano nello spazio degli stati." },
            { icon: '🎯', title: 'Prestazione sui Benchmark',
              text: "Confronta la tua agente con i benchmark. Nota quanto un'agente addestrata è migliore dell'esplorazione casuale! Questa è la potenza dell'apprendimento per rinforzo." }
          ]
        },
        '3x3': {
          mission: '🎮 Missione di addestramento: 3×3',
          title: 'Modalità Esperto: Puzzle-8 Completo',
          subtitle: 'La classica sfida IA — la tua agente riesce a dominarla?',
          steps: [
            { icon: '💪', title: 'La Sfida Classica',
              text: "Il <strong>puzzle-8 (3×3)</strong> ha 181.440 stati! È un vero problema di benchmark in IA. La tua agente avrà bisogno di un serio tempo di addestramento." },
            { icon: '🔥', title: 'Configurazione Intensiva',
              text: "Per il 3×3, usa <strong>2000+ episodi</strong> e <strong>100+ passi massimi</strong>. Considera di aumentare il tasso di apprendimento all'inizio. Qui la pazienza ripaga!" },
            { icon: '🧠', title: "Guarda l'Intelligenza Emergere",
              text: "Man mano che l'addestramento avanza, vedrai la tua agente passare da mosse casuali a risoluzione intelligente. Questa è l'<strong>emergenza</strong> — comportamento complesso da regole semplici!" },
            { icon: '🏅', title: 'Raggiungere la Padronanza',
              text: "Un'agente ben addestrata dovrebbe risolvere i benchmark con mosse quasi ottimali. Confronta con la linea di base casuale — guarda quanta strada ha fatto la tua agente! Hai addestrato una vera IA." }
          ]
        }
      },
      tips: {
        '2x2': [
          { label: 'Suggerimento rapido', text: 'Inizia con i parametri predefiniti — funzionano bene!' },
          { label: 'Suggerimento pro', text: "Abbassa epsilon (ε) una volta che l'agente inizia a imparare, per più sfruttamento." },
          { label: 'Da osservare', text: "Valori Q che si diffondono all'indietro dallo stato obiettivo." }
        ],
        '2x3': [
          { label: 'Suggerimento rapido', text: 'Aumenta gli episodi a 500-1000 per una migliore convergenza.' },
          { label: 'Suggerimento pro', text: 'Un gamma alto (γ ≈ 0,95-0,99) aiuta la propagazione dei valori.' },
          { label: 'Da osservare', text: "L'agente che scopre percorsi di soluzione efficienti." }
        ],
        '3x3': [
          { label: 'Suggerimento rapido', text: 'Abbi pazienza! Servono almeno 2000+ episodi.' },
          { label: 'Suggerimento pro', text: 'Prova α=0,5, γ=0,95, ε=0,10 per buoni risultati.' },
          { label: 'Da osservare', text: 'Comportamento intelligente che emerge intorno ai ~1000 episodi.' }
        ]
      }
    }
  };

  // ------- Helpers --------------------------------------------------------
  function getLang() {
    const l = (document.documentElement.lang || 'fr').slice(0, 2).toLowerCase();
    return CONTENT[l] ? l : 'fr';
  }
  function L() { return CONTENT[getLang()]; }

  // ------- State ----------------------------------------------------------
  const STORAGE_PREFIX = 'ai-exhibits-tutorial-';
  const COMPLETION_KEY = STORAGE_PREFIX + 'completed';
  const SKIP_KEY = STORAGE_PREFIX + 'skip';

  let currentStep = 0;
  let config = null;
  let overlay = null;
  let highlightedElement = null;

  // ------- Init -----------------------------------------------------------
  function init() {
    const puzzleSize = detectPuzzleSize();
    if (!puzzleSize) return;

    config = L().configs[puzzleSize];
    if (!config) return;

    if (shouldShowTutorial()) {
      setTimeout(() => {
        createTutorialOverlay(puzzleSize);
        showTutorial();
      }, 800);
    }
  }

  function detectPuzzleSize() {
    const title = document.title;
    if (title.includes('2×2') || title.includes('2x2')) return '2x2';
    if (title.includes('2×3') || title.includes('2x3')) return '2x3';
    if (title.includes('3×3') || title.includes('3x3')) return '3x3';
    return null;
  }

  function shouldShowTutorial() {
    if (localStorage.getItem(SKIP_KEY) === 'true') return false;
    const puzzleSize = detectPuzzleSize();
    return !getCompletionData()[puzzleSize];
  }
  function getCompletionData() {
    const data = localStorage.getItem(COMPLETION_KEY);
    return data ? JSON.parse(data) : {};
  }
  function markCompleted() {
    const puzzleSize = detectPuzzleSize();
    const d = getCompletionData();
    d[puzzleSize] = true;
    localStorage.setItem(COMPLETION_KEY, JSON.stringify(d));
  }

  // ------- Overlay --------------------------------------------------------
  function createTutorialOverlay(puzzleSize) {
    const ui = L().ui;
    const STEP_SELECTORS = ['.puzzle', '.form', 'button[onclick*="train"]', '.menuRow'];

    overlay = document.createElement('div');
    overlay.className = 'tutorial-overlay';
    overlay.innerHTML = `
      <div class="tutorial-card">
        <button class="tutorial-skip" onclick="window.AIExhibitsTutorial.skip()">${ui.skip}</button>

        <div class="tutorial-header">
          <div class="tutorial-mission">${config.mission}</div>
          <h2 class="tutorial-title">${config.title}</h2>
          <p class="tutorial-subtitle">${config.subtitle}</p>
        </div>

        <div class="tutorial-content" id="tutorialContent">
          ${config.steps.map((step, i) => createStepHTML(step, i, config.steps.length, STEP_SELECTORS[i])).join('')}
          ${createCompletionHTML()}
        </div>

        <div class="tutorial-controls">
          <div class="tutorial-progress" id="tutorialProgress">
            ${config.steps.map((_, i) => `<div class="tutorial-dot ${i === 0 ? 'active' : ''}"></div>`).join('')}
          </div>
          <div class="tutorial-buttons">
            <button class="tutorial-btn" id="tutorialPrev" onclick="window.AIExhibitsTutorial.prevStep()" style="display: none;">
              <span class="tutorial-btn-icon">←</span> ${ui.prev}
            </button>
            <button class="tutorial-btn primary" id="tutorialNext" onclick="window.AIExhibitsTutorial.nextStep()">
              ${ui.next} <span class="tutorial-btn-icon">→</span>
            </button>
          </div>
        </div>

        <div class="tutorial-hint">${ui.hint}</div>
      </div>
    `;
    // Stash selectors on the config object for later use by goToStep
    config._selectors = STEP_SELECTORS;
    document.body.appendChild(overlay);
    setupKeyboardControls();
  }

  function createStepHTML(step, index, total, selector) {
    const label = L().ui.stepOf(index + 1, total);
    return `
      <div class="tutorial-step ${index === 0 ? 'active' : ''}" data-step="${index}" data-highlight="${selector}">
        <div class="tutorial-step-header">
          <div class="tutorial-step-icon">${step.icon}</div>
          <div>
            <div class="tutorial-step-label">${label}</div>
            <h3 class="tutorial-step-title">${step.title}</h3>
          </div>
        </div>
        <p class="tutorial-text">${step.text}</p>
      </div>
    `;
  }

  function createCompletionHTML() {
    const ui = L().ui;
    return `
      <div class="tutorial-step tutorial-complete" data-step="complete">
        <div class="tutorial-complete-icon">🎉</div>
        <h3 class="tutorial-complete-title">${ui.completeTitle}</h3>
        <p class="tutorial-complete-text">${ui.completeText}</p>
      </div>
    `;
  }

  function showTutorial() {
    if (!overlay) return;
    highlightElement(config._selectors[0]);
    requestAnimationFrame(() => overlay.classList.add('active'));
  }

  // ------- Navigation -----------------------------------------------------
  function nextStep() {
    if (currentStep < config.steps.length - 1) {
      goToStep(currentStep + 1);
    } else if (currentStep === config.steps.length - 1) {
      showCompletion();
    } else {
      closeTutorial(true);
    }
  }
  function prevStep() { if (currentStep > 0) goToStep(currentStep - 1); }

  function goToStep(stepIndex) {
    const steps = overlay.querySelectorAll('.tutorial-step');
    steps[currentStep].classList.remove('active');
    currentStep = stepIndex;
    steps[currentStep].classList.add('active');
    updateProgress();
    updateButtons();
    if (currentStep < config.steps.length) {
      highlightElement(config._selectors[currentStep]);
    }
  }

  function showCompletion() {
    const ui = L().ui;
    const steps = overlay.querySelectorAll('.tutorial-step');
    steps[currentStep].classList.remove('active');
    overlay.querySelector('[data-step="complete"]').classList.add('active');
    overlay.querySelectorAll('.tutorial-dot').forEach(d => d.classList.add('completed'));
    const nextBtn = document.getElementById('tutorialNext');
    nextBtn.innerHTML = `${ui.launch} <span class="tutorial-btn-icon">🚀</span>`;
    removeHighlight();
    currentStep = config.steps.length;
  }

  function updateProgress() {
    const dots = overlay.querySelectorAll('.tutorial-dot');
    dots.forEach((d, i) => {
      d.classList.remove('active', 'completed');
      if (i < currentStep) d.classList.add('completed');
      else if (i === currentStep) d.classList.add('active');
    });
  }

  function updateButtons() {
    const ui = L().ui;
    const prevBtn = document.getElementById('tutorialPrev');
    const nextBtn = document.getElementById('tutorialNext');
    prevBtn.style.display = currentStep > 0 ? 'flex' : 'none';
    if (currentStep < config.steps.length - 1) {
      nextBtn.innerHTML = `${ui.next} <span class="tutorial-btn-icon">→</span>`;
    } else if (currentStep === config.steps.length - 1) {
      nextBtn.innerHTML = `${ui.finish} <span class="tutorial-btn-icon">✓</span>`;
    }
  }

  // ------- Highlighting ---------------------------------------------------
  function highlightElement(selector) {
    removeHighlight();
    if (!selector) return;
    const el = document.querySelector(selector);
    if (el) {
      el.classList.add('tutorial-highlight');
      highlightedElement = el;
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    }
  }
  function removeHighlight() {
    if (highlightedElement) {
      highlightedElement.classList.remove('tutorial-highlight');
      highlightedElement = null;
    }
  }

  // ------- Close / skip ---------------------------------------------------
  function closeTutorial(completed = false) {
    if (overlay) {
      overlay.classList.remove('active');
      setTimeout(() => {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        overlay = null;
      }, 400);
    }
    removeHighlight();
    // Tear down the keyboard listener so it doesn't leak across opens.
    document.removeEventListener('keydown', keyboardHandler);
    if (completed) markCompleted();
  }
  function skip() {
    if (confirm(L().ui.skipConfirm)) {
      localStorage.setItem(SKIP_KEY, 'true');
      closeTutorial(false);
    }
  }

  // ------- Keyboard -------------------------------------------------------
  // Named, module-level handler so setupKeyboardControls can attach it and
  // closeTutorial/skip can remove it (no listener leak across re-opens).
  function keyboardHandler(e) {
    if (!overlay || !overlay.classList.contains('active')) return;
    switch (e.key) {
      case 'Escape': skip(); break;
      case 'Enter':
      case ' ':
      case 'ArrowRight': e.preventDefault(); nextStep(); break;
      case 'ArrowLeft':  e.preventDefault(); prevStep(); break;
    }
  }
  function setupKeyboardControls() {
    // Guard against double-binding if setup runs more than once.
    document.removeEventListener('keydown', keyboardHandler);
    document.addEventListener('keydown', keyboardHandler);
  }

  function reset() {
    localStorage.removeItem(COMPLETION_KEY);
    localStorage.removeItem(SKIP_KEY);
  }

  // ------- Public API -----------------------------------------------------
  window.AIExhibitsTutorial = { nextStep, prevStep, skip, reset, init };

  // Wait for i18n to apply (so <html lang> is correct) before first-run.
  // Fallback: still init after 1.2s even if i18n never fires.
  let started = false;
  function safeInit() { if (!started) { started = true; init(); } }
  document.addEventListener('i18n:applied', safeInit);
  setTimeout(safeInit, 1200);

})();
