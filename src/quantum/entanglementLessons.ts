import { InteractiveLesson } from './lessonTypes'

export type EntanglementScene =
  | 'pair-register'
  | 'joint-probabilities'
  | 'correlation-sample'
  | 'pair-check'
  | 'entangle-builder'
  | 'local-randomness'
  | 'shared-measurements'
  | 'entanglement-check'
  | 'hidden-instructions'
  | 'analyzer-angles'
  | 'bell-trials'
  | 'bell-check'
  | 'phase-branches'
  | 'environment-record'
  | 'interference-decay'
  | 'decoherence-check'
  | 'cat-apparatus'
  | 'cat-branches'
  | 'cat-environment'
  | 'entanglement-checkpoint'
  | 'entanglement-complete'

export const ENTANGLEMENT_LESSON_CONTENT: InteractiveLesson[] = [
  {
    slug: 'two-particle-states', title: 'Two-particle states', number: 19, minutes: 8, accent: '#22d3ee', canvas: 'entanglement', stageNumber: 4, stageLabel: 'Entanglement', nextSlug: 'entanglement',
    steps: [
      {
        label: 'Pair', eyebrow: 'Combine two systems', title: 'Two particles need one joint state description',
        lede: 'A pair of two-state particles has four possible joint outcomes: 00, 01, 10, and 11.',
        body: 'Prepare a product state. Each symbol still describes its own particle, and the full state is built by placing those two descriptions together.',
        scene: 'pair-register', control: 'pair-state',
      },
      {
        label: 'Table', eyebrow: 'Joint probabilities', title: 'A joint table remembers relationships',
        lede: 'Single-particle probabilities cannot always tell you how two results are connected.',
        body: 'Raise the correlation. The local outcomes remain balanced, while probability moves toward matched pairs 00 and 11.',
        scene: 'joint-probabilities', control: 'pair-correlation',
      },
      {
        label: 'Sample', eyebrow: 'Turn a state into data', title: 'Repeated pair measurements reveal the joint pattern',
        lede: 'Each trial returns one ordinary pair of detector clicks.',
        body: 'Measure a batch. The four counters reconstruct the joint probability table, including correlations hidden from either side alone.',
        scene: 'correlation-sample', control: 'correlation-sample',
      },
      {
        label: 'Check', eyebrow: 'Concept check', title: 'Does correlation alone prove entanglement?',
        lede: 'Separate a joint pattern from its possible explanations.',
        body: 'Classical systems can also be correlated. Entanglement requires a joint quantum state that cannot be separated into independent states.',
        scene: 'pair-check', control: 'check',
      },
      {
        label: 'Complete', eyebrow: 'Lesson complete', title: 'One table can describe two systems',
        lede: 'You can now read product outcomes, marginals, and correlations from a shared state.',
        body: 'Next, you will build a state whose parts no longer have complete independent descriptions.',
        scene: 'entanglement-complete',
      },
    ],
    questions: [{
      question: 'Which observation, by itself, is not enough to prove entanglement?',
      options: ['The two detectors often return matching results.', 'The joint state cannot be factored into separate particle states.', 'The correlations violate a Bell inequality.'], correct: 0,
      success: 'Correct. Matching results can come from a classical shared cause; stronger tests are needed to identify entanglement.',
    }],
    takeaways: ['Two two-state particles have four joint outcomes.', 'Marginal probabilities and joint correlations carry different information.', 'Correlation alone does not establish entanglement.'],
  },
  {
    slug: 'entanglement', title: 'Entanglement', number: 20, minutes: 9, accent: '#a78bfa', canvas: 'entanglement', stageNumber: 4, stageLabel: 'Entanglement', nextSlug: 'bells-experiment',
    steps: [
      {
        label: 'Link', eyebrow: 'Build a Bell pair', title: 'Entanglement makes the pair the fundamental system',
        lede: 'At full entanglement, the joint state is definite even though neither particle has its own definite outcome.',
        body: 'Increase the entanglement strength. Independent state arrows fade into one shared correlation structure connecting the pair.',
        scene: 'entangle-builder', control: 'entangle-strength',
      },
      {
        label: 'Local', eyebrow: 'Look at one side', title: 'Each local stream can be random while the pair is ordered',
        lede: 'Alice alone sees an unpredictable sequence, and Bob alone sees another.',
        body: 'Switch measurement axes. Neither side can read the shared pattern without later comparing both records.',
        scene: 'local-randomness', control: 'pair-axis',
      },
      {
        label: 'Compare', eyebrow: 'Reveal the relationship', title: 'Bring the records together and correlation appears',
        lede: 'The information lives in relationships between outcomes, not in either outcome list by itself.',
        body: 'Measure a batch along the same axis. Individual results vary, but the paired outcomes obey the structure of the Bell state.',
        scene: 'shared-measurements', control: 'entangled-sample',
      },
      {
        label: 'Check', eyebrow: 'Concept check', title: 'What belongs to each particle?',
        lede: 'Avoid smuggling independent hidden answers back into the model.',
        body: 'For an entangled pure state, only the joint state is complete. The parts cannot be assigned pure states that reproduce it.',
        scene: 'entanglement-check', control: 'check',
      },
      {
        label: 'Complete', eyebrow: 'Lesson complete', title: 'The whole carries more structure than the parts',
        lede: 'You can now distinguish local randomness from joint quantum order.',
        body: 'Bell’s experiment will test whether prewritten local answers could imitate that order.',
        scene: 'entanglement-complete',
      },
    ],
    questions: [{
      question: 'Why can an entangled pair resist separate pure-state descriptions?',
      options: ['Its complete state contains joint amplitudes that cannot be factored into one state per particle.', 'The particles exchange secret messages after every measurement.', 'Each particle has too little energy to own a state.'], correct: 0,
      success: 'Exactly. The nonfactorable joint amplitudes are the defining structure of pure-state entanglement.',
    }],
    takeaways: ['An entangled state cannot be factored into independent states.', 'Each local record can look random while the joint record is structured.', 'Entanglement creates correlation, not a controllable faster-than-light signal.'],
  },
  {
    slug: 'bells-experiment', title: "Bell's experiment", number: 21, minutes: 11, accent: '#fbbf24', canvas: 'entanglement', stageNumber: 4, stageLabel: 'Entanglement', nextSlug: 'decoherence',
    steps: [
      {
        label: 'Rules', eyebrow: 'Local hidden instructions', title: 'Could each particle carry a private answer sheet?',
        lede: 'A local classical model can preload responses for every detector setting.',
        body: 'Compare a classical instruction strategy with a quantum Bell pair. Bell’s insight was to design a score no local answer sheet can exceed.',
        scene: 'hidden-instructions', control: 'bell-model',
      },
      {
        label: 'Angles', eyebrow: 'Choose questions independently', title: 'Detector settings turn correlation into a test',
        lede: 'Alice and Bob choose measurement settings only after the particles separate.',
        body: 'Rotate the relative detector angle. Quantum correlation changes smoothly with angle instead of following a fixed local lookup table.',
        scene: 'analyzer-angles', control: 'bell-angle',
      },
      {
        label: 'Run', eyebrow: 'CHSH game', title: 'Quantum predictions cross the local score ceiling',
        lede: 'In this Bell game, any local hidden-variable strategy wins at most 75% of trials.',
        body: 'Run 200 trials. An ideal quantum strategy approaches 85%, crossing the classical ceiling without allowing either side to signal.',
        scene: 'bell-trials', control: 'bell-run',
      },
      {
        label: 'Check', eyebrow: 'Concept check', title: 'What does a Bell violation rule out?',
        lede: 'State the conclusion precisely; it is strong enough without exaggeration.',
        body: 'The observed correlations cannot be explained by a theory with both local influences and pre-existing hidden results of the tested kind.',
        scene: 'bell-check', control: 'check',
      },
      {
        label: 'Complete', eyebrow: 'Lesson complete', title: 'Nature beats the local instruction-sheet limit',
        lede: 'You can now read Bell’s theorem as an experimental boundary on classical explanation.',
        body: 'The correlations are nonclassical, but each local outcome remains random and cannot carry a chosen message.',
        scene: 'entanglement-complete',
      },
    ],
    questions: [{
      question: 'What is the careful conclusion of a loophole-controlled Bell violation?',
      options: ['Local hidden-variable models of the tested correlations cannot reproduce the data.', 'Useful information traveled faster than light.', 'Every possible classical theory has been disproved.'], correct: 0,
      success: 'Correct. Bell violations rule out the relevant local hidden-variable account, while preserving no-signalling.',
    }],
    takeaways: ['Bell inequalities set limits for local hidden-variable correlations.', 'Quantum measurements can violate those limits.', 'Bell correlations cannot be used to send a chosen faster-than-light message.'],
  },
  {
    slug: 'decoherence', title: 'Decoherence', number: 22, minutes: 9, accent: '#34d399', canvas: 'entanglement', stageNumber: 4, stageLabel: 'Entanglement', nextSlug: 'schrodingers-cat',
    steps: [
      {
        label: 'Phase', eyebrow: 'Coherent alternatives', title: 'Interference needs branches to keep a phase relationship',
        lede: 'A clean superposition can recombine because its alternatives retain relative phase.',
        body: 'Increase environmental coupling. The two branches begin sharing their phase information with surrounding particles.',
        scene: 'phase-branches', control: 'environment-strength',
      },
      {
        label: 'Record', eyebrow: 'Environment as witness', title: 'Scattered particles carry away which-branch records',
        lede: 'Air molecules, photons, and vibrations become correlated with different system alternatives.',
        body: 'Grow the environment. The records spread into many degrees of freedom, making a controlled reversal fantastically difficult.',
        scene: 'environment-record', control: 'environment-size',
      },
      {
        label: 'Fade', eyebrow: 'Loss of visible interference', title: 'Local interference fades as environmental information grows',
        lede: 'The full system-plus-environment state still evolves quantum mechanically.',
        body: 'Raise the decoherence level. The system alone begins to behave like an ordinary statistical mixture because its phase is inaccessible locally.',
        scene: 'interference-decay', control: 'decoherence-level',
      },
      {
        label: 'Check', eyebrow: 'Concept check', title: 'Did the environment destroy quantum theory?',
        lede: 'Track where the missing interference information went.',
        body: 'It spread into entanglement with the environment. Ignoring those degrees of freedom removes local interference terms.',
        scene: 'decoherence-check', control: 'check',
      },
      {
        label: 'Complete', eyebrow: 'Lesson complete', title: 'Classical appearance can emerge from quantum entanglement',
        lede: 'You can now explain why large warm systems rarely display controllable interference.',
        body: 'Decoherence explains stable classical-looking branches, though interpretations differ on how one observed outcome should be understood.',
        scene: 'entanglement-complete',
      },
    ],
    questions: [{
      question: 'What most directly causes local interference to disappear during decoherence?',
      options: ['Phase information becomes distributed into correlations with the environment.', 'The laws of quantum mechanics switch off for large objects.', 'A conscious observer looks away from the system.'], correct: 0,
      success: 'Right. Environmental entanglement makes the relative phase inaccessible to measurements on the system alone.',
    }],
    takeaways: ['Decoherence is entanglement with uncontrolled environmental degrees of freedom.', 'Environmental records suppress locally observable interference.', 'The global quantum state can remain coherent even when the subsystem looks classical.'],
  },
  {
    slug: 'schrodingers-cat', title: "Schrodinger's cat", number: 23, minutes: 8, accent: '#fb7185', canvas: 'entanglement', stageNumber: 4, stageLabel: 'Entanglement', nextSlug: 'lasers',
    steps: [
      {
        label: 'Chain', eyebrow: 'Build the thought experiment', title: 'A microscopic event can control a macroscopic record',
        lede: 'A quantum decay triggers a detector, an amplifier, and finally two macroscopically distinct outcomes.',
        body: 'Adjust the decay chance. Schrödinger designed this chain to expose what happens when linear quantum evolution is applied all the way to an everyday object.',
        scene: 'cat-apparatus', control: 'cat-trigger',
      },
      {
        label: 'Branches', eyebrow: 'One entangled state', title: 'The cat is correlated with the entire apparatus',
        lede: 'The useful state is not “cat alone,” but a joint state linking atom, detector, mechanism, and cat.',
        body: 'Switch views. The system view shows the apparatus; the branch view shows the two correlated alternatives in the joint wavefunction.',
        scene: 'cat-branches', control: 'cat-view',
      },
      {
        label: 'World', eyebrow: 'Macroscopic decoherence', title: 'The environment distinguishes the branches almost instantly',
        lede: 'A real box leaks enormous numbers of photons, vibrations, and thermal records.',
        body: 'Increase environmental contact. Interference between macroscopic branches becomes inaccessible long before a person opens the box.',
        scene: 'cat-environment', control: 'cat-environment',
      },
      {
        label: 'Checkpoint', eyebrow: 'Entanglement checkpoint', title: 'Can you keep the cat argument precise?',
        lede: 'Connect joint states, Bell tests, decoherence, and measurement across three cases.',
        body: 'Choose one answer for every case, then check the complete Stage 4 model.',
        scene: 'entanglement-checkpoint', control: 'checkpoint',
      },
      {
        label: 'Complete', eyebrow: 'Stage 4 complete', title: 'You can trace quantum relationships into the classical world',
        lede: 'Entanglement organizes joint states, Bell tests expose nonclassical correlation, and decoherence explains classical appearance.',
        body: 'The next stage will turn these principles into lasers, semiconductors, sensors, qubits, circuits, and cryptography.',
        scene: 'entanglement-complete',
      },
    ],
    questions: [
      {
        question: 'What was the cat thought experiment designed to expose?',
        options: ['The tension in applying quantum superposition and measurement rules to macroscopic records.', 'A practical method for keeping animals in two biological states.', 'Evidence that consciousness causes radioactive decay.'], correct: 0,
        success: 'Exactly. The cat magnifies a microscopic superposition into a sharp question about macroscopic measurement.',
      },
      {
        question: 'What does decoherence explain particularly well?',
        options: ['Why interference between macroscopic alternatives becomes locally inaccessible.', 'Why one interpretation of measurement is uniquely correct.', 'How observers can send messages between branches.'], correct: 0,
        success: 'Correct. Decoherence explains the rapid loss of observable branch interference without selecting one interpretation.',
      },
      {
        question: 'What does opening the box physically do?',
        options: ['It correlates the observer with an already strongly decohered macroscopic record.', 'It creates quantum mechanics for the first time.', 'It lets the observer choose the earlier decay result.'], correct: 0,
        success: 'Right. Observation is another physical interaction with a record that has already decohered into stable alternatives.',
      },
    ],
    takeaways: ['The cat belongs to a joint state with the microscopic trigger and apparatus.', 'Macroscopic branches decohere extremely quickly.', 'The thought experiment exposes the measurement problem; it is not a claim that cats are casually half alive.'],
  },
]

export function getEntanglementLesson(slug: string): InteractiveLesson | undefined {
  return ENTANGLEMENT_LESSON_CONTENT.find(lesson => lesson.slug === slug)
}
