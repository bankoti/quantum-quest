import { FoundationLesson } from './foundationLessons'

export type LanguageScene =
  | 'wavefunction-map'
  | 'born-rule'
  | 'phase-map'
  | 'wavefunction-check'
  | 'superposition-state'
  | 'superposition-waves'
  | 'superposition-basis'
  | 'superposition-check'
  | 'measurement-preparation'
  | 'measurement-sample'
  | 'measurement-collapse'
  | 'measurement-check'
  | 'uncertainty-packet'
  | 'uncertainty-components'
  | 'uncertainty-dual'
  | 'uncertainty-check'
  | 'state-vector'
  | 'basis-rotation'
  | 'amplitude-bars'
  | 'states-check'
  | 'potential-landscape'
  | 'equation-evolution'
  | 'equation-engine'
  | 'equation-predict'
  | 'equation-check'
  | 'language-complete'

export const LANGUAGE_LESSON_CONTENT: FoundationLesson[] = [
  {
    slug: 'the-wavefunction', title: 'The wavefunction', number: 7, minutes: 8, accent: '#a78bfa', canvas: 'language', stageNumber: 2, stageLabel: 'Quantum language', nextSlug: 'superposition',
    steps: [
      {
        label: 'Map', eyebrow: 'A map of possibilities', title: 'The wavefunction describes a state, not a blurry object',
        lede: 'At every possible position, the wavefunction assigns an amplitude with a size and a phase.',
        body: 'Move the packet. You are changing the prepared state and therefore changing where future detections are likely, not dragging a faint classical cloud around.',
        scene: 'wavefunction-map', control: 'packet-center',
      },
      {
        label: 'Probability', eyebrow: 'From amplitude to chance', title: 'Square the size to get probability',
        lede: 'The wavefunction itself can be positive, negative, or complex. Probability is always non-negative.',
        body: 'Switch between the amplitude and probability views. Peaks in the squared magnitude mark likely outcomes; nodes remain impossible outcomes.',
        scene: 'born-rule', control: 'wave-view',
      },
      {
        label: 'Phase', eyebrow: 'The hidden working part', title: 'Equal probabilities can hide different phases',
        lede: 'Two states can predict the same position histogram now and still behave differently when combined later.',
        body: 'Rotate the phase. The probability envelope stays fixed while the internal phase changes, ready to alter future interference.',
        scene: 'phase-map', control: 'wave-phase',
      },
      {
        label: 'Check', eyebrow: 'Concept check', title: 'What kind of map is ψ?',
        lede: 'Choose the statement that keeps amplitude, probability, and detection separate.',
        body: 'The wavefunction is the predictive state used by the theory. A detector still records one concrete outcome.',
        scene: 'wavefunction-check', control: 'check',
      },
      {
        label: 'Complete', eyebrow: 'Lesson complete', title: 'Possibility now has structure',
        lede: 'You can read a wavefunction as amplitudes whose squared sizes predict measurement probabilities.',
        body: 'The phase information that probability hides becomes essential in the next lesson, where states combine.',
        scene: 'language-complete',
      },
    ],
    questions: [{
      question: 'What does the wavefunction directly assign to each possible outcome?',
      options: ['A guaranteed detector result', 'An amplitude with size and phase', 'A hidden classical path'], correct: 1,
      success: 'Right. Probabilities come from amplitude sizes, while phase controls how alternatives combine.',
    }],
    takeaways: ['The wavefunction represents the quantum state.', 'Squared amplitude size gives probability.', 'Phase can matter even when the current probability picture looks unchanged.'],
  },
  {
    slug: 'superposition', title: 'Superposition', number: 8, minutes: 8, accent: '#c084fc', canvas: 'language', stageNumber: 2, stageLabel: 'Quantum language', nextSlug: 'measurement-and-collapse',
    steps: [
      {
        label: 'Combine', eyebrow: 'Build a state', title: 'A superposition combines possible states',
        lede: 'A two-state system can be prepared with amplitudes for both alternatives at once.',
        body: 'Shift the balance between |0〉 and |1〉. The state changes continuously even though a measurement will return one of only two outcomes.',
        scene: 'superposition-state', control: 'state-balance',
      },
      {
        label: 'Interfere', eyebrow: 'Amplitudes add', title: 'Phase decides whether alternatives reinforce or cancel',
        lede: 'Superposition is more than ordinary uncertainty because amplitudes can interfere.',
        body: 'Rotate the relative phase. The two component waves keep the same individual sizes, but their sum changes from reinforcement to cancellation.',
        scene: 'superposition-waves', control: 'superposition-phase',
      },
      {
        label: 'Basis', eyebrow: 'Ask a different question', title: 'The same state looks different in another basis',
        lede: 'A basis is the set of alternatives your measurement distinguishes.',
        body: 'Switch the measurement basis. A definite state in one basis can become an even superposition in another.',
        scene: 'superposition-basis', control: 'basis-switch',
      },
      {
        label: 'Check', eyebrow: 'Concept check', title: 'Is superposition just ignorance?',
        lede: 'Use interference to distinguish a coherent superposition from an unknown classical choice.',
        body: 'If alternatives retain a relative phase, later operations can make them reinforce or cancel.',
        scene: 'superposition-check', control: 'check',
      },
      {
        label: 'Complete', eyebrow: 'Lesson complete', title: 'Alternatives can coexist as amplitudes',
        lede: 'You can now treat superposition as one state built from multiple basis states.',
        body: 'Measurement will turn those amplitudes into one result, but only after their interference opportunities have mattered.',
        scene: 'language-complete',
      },
    ],
    questions: [{
      question: 'What makes a coherent superposition different from an ordinary unknown choice?',
      options: ['Its alternatives have a relative phase and can interfere.', 'It always produces both detector results.', 'It contains no probabilities.'], correct: 0,
      success: 'Exactly. Relative phase gives a superposition experimentally visible interference behavior.',
    }],
    takeaways: ['A superposition is one state made from basis-state amplitudes.', 'Relative phase controls interference.', 'Changing basis changes how the same state is represented.'],
  },
  {
    slug: 'measurement-and-collapse', title: 'Measurement and collapse', number: 9, minutes: 9, accent: '#fb7185', canvas: 'language', stageNumber: 2, stageLabel: 'Quantum language', nextSlug: 'uncertainty-principle',
    steps: [
      {
        label: 'Prepare', eyebrow: 'Before measurement', title: 'Preparation sets probabilities, not a secret answer',
        lede: 'Identically prepared systems share a quantum state, yet individual measurements can differ.',
        body: 'Set the probability for outcome 1. This preparation controls the long-run statistics without specifying the next individual result.',
        scene: 'measurement-preparation', control: 'prepare-probability',
      },
      {
        label: 'Sample', eyebrow: 'One run versus many', title: 'Single outcomes vary; frequencies settle',
        lede: 'Quantum theory predicts a distribution that appears through repeated preparation and measurement.',
        body: 'Measure once or in a batch. The running histogram fluctuates, then approaches the probability encoded by the prepared state.',
        scene: 'measurement-sample', control: 'measurement-lab',
      },
      {
        label: 'Collapse', eyebrow: 'State update', title: 'After a result, the state matches the recorded outcome',
        lede: 'Measurement produces one result and prepares the system in the corresponding outcome state.',
        body: 'Measure the superposition. The probability display becomes one definite branch. Reset to prepare the original state again.',
        scene: 'measurement-collapse', control: 'collapse-lab',
      },
      {
        label: 'Check', eyebrow: 'Concept check', title: 'What does collapse describe?',
        lede: 'Separate a predictive rule from claims about human consciousness.',
        body: 'In this course, collapse is the state update associated with a physical measurement record.',
        scene: 'measurement-check', control: 'check',
      },
      {
        label: 'Complete', eyebrow: 'Lesson complete', title: 'Prediction and event are now distinct',
        lede: 'You can follow the full cycle: prepare a state, predict probabilities, record one result, update the state.',
        body: 'Repeating that cycle turns quantum probability into testable laboratory frequencies.',
        scene: 'language-complete',
      },
    ],
    questions: [{
      question: 'After measuring outcome 1, what state should predict an immediate repeat measurement?',
      options: ['The original superposition', 'The outcome-1 state', 'A state with no possible outcomes'], correct: 1,
      success: 'Correct. The post-measurement state matches the recorded outcome, so an immediate repeat is predictable.',
    }],
    takeaways: ['Preparation determines outcome probabilities.', 'One measurement gives one result; many runs reveal the distribution.', 'Collapse is the state update associated with the recorded outcome.'],
  },
  {
    slug: 'uncertainty-principle', title: 'The uncertainty principle', number: 10, minutes: 9, accent: '#22d3ee', canvas: 'language', stageNumber: 2, stageLabel: 'Quantum language', nextSlug: 'states-bases-and-amplitudes',
    steps: [
      {
        label: 'Localize', eyebrow: 'Position spread', title: 'A narrow position needs a broad momentum range',
        lede: 'Uncertainty is built into the shapes of quantum states, not merely caused by clumsy instruments.',
        body: 'Squeeze the position packet. The momentum distribution widens automatically. Broaden position and the momentum possibilities narrow.',
        scene: 'uncertainty-packet', control: 'uncertainty-width',
      },
      {
        label: 'Compose', eyebrow: 'Build a packet from waves', title: 'Localization requires many wavelengths',
        lede: 'A single wavelength extends everywhere. A localized packet appears only when many wave components combine.',
        body: 'Increase the number of components. Their sum becomes more concentrated while the range of momenta grows.',
        scene: 'uncertainty-components', control: 'wave-components',
      },
      {
        label: 'Dual views', eyebrow: 'Two descriptions of one state', title: 'Position space and momentum space trade sharpness',
        lede: 'The two distributions are connected descriptions of the same wavefunction.',
        body: 'Switch views while adjusting width. The trade-off is structural: no state can make both distributions arbitrarily narrow.',
        scene: 'uncertainty-dual', control: 'uncertainty-view',
      },
      {
        label: 'Check', eyebrow: 'Concept check', title: 'Is uncertainty just bad measurement?',
        lede: 'Choose the explanation that remains true with perfect instruments.',
        body: 'Measurement disturbance can exist, but it is not the origin of the position-momentum relation.',
        scene: 'uncertainty-check', control: 'check',
      },
      {
        label: 'Complete', eyebrow: 'Lesson complete', title: 'Precision has a shape-dependent trade-off',
        lede: 'You can now explain uncertainty through wave-packet structure rather than vague observer disturbance.',
        body: 'The same mathematics appears in sound, imaging, and signal processing wherever localized patterns require many frequencies.',
        scene: 'language-complete',
      },
    ],
    questions: [{
      question: 'Why does a tightly localized quantum state have a broad momentum distribution?',
      options: ['Localization requires combining many wavelengths.', 'The detector randomly adds momentum after every run.', 'Position and momentum are secretly fixed but hidden.'], correct: 0,
      success: 'Right. Many wave components are needed to form a narrow packet, producing a broad momentum range.',
    }],
    takeaways: ['Uncertainty is a property of quantum states.', 'Localization requires a spread of wavelengths and momenta.', 'Position and momentum distributions cannot both be arbitrarily narrow.'],
  },
  {
    slug: 'states-bases-and-amplitudes', title: 'States, bases, and amplitudes', number: 11, minutes: 10, accent: '#fbbf24', canvas: 'language', stageNumber: 2, stageLabel: 'Quantum language', nextSlug: 'schrodingers-equation',
    steps: [
      {
        label: 'State', eyebrow: 'A geometric picture', title: 'A state is a direction in an abstract space',
        lede: 'For a two-state system, a vector gives an intuitive picture of the complete preparation.',
        body: 'Rotate the state. Its projections onto the two basis directions determine the amplitudes for those measurement outcomes.',
        scene: 'state-vector', control: 'state-angle',
      },
      {
        label: 'Basis', eyebrow: 'Choose the question', title: 'A basis defines which alternatives count as outcomes',
        lede: 'The state remains the same while the measurement axes change.',
        body: 'Switch between Z and X bases. A vector aligned with one basis can project onto both directions of the other.',
        scene: 'basis-rotation', control: 'basis-choice',
      },
      {
        label: 'Amplitudes', eyebrow: 'Coordinates of a state', title: 'Amplitudes are state coordinates in a chosen basis',
        lede: 'Their squared sizes give outcome probabilities, while relative phase carries interference information.',
        body: 'Adjust the phase. Probability bars stay fixed, but the state marker rotates around the axis, changing later interference behavior.',
        scene: 'amplitude-bars', control: 'amplitude-phase',
      },
      {
        label: 'Check', eyebrow: 'Concept check', title: 'State or representation?',
        lede: 'Keep the physical state separate from the coordinates used to describe it.',
        body: 'Changing basis rewrites the amplitudes without physically changing the prepared system.',
        scene: 'states-check', control: 'check',
      },
      {
        label: 'Complete', eyebrow: 'Lesson complete', title: 'The vocabulary now fits together',
        lede: 'State, basis, amplitude, phase, probability, and measurement now form one coherent language.',
        body: 'You are ready to ask how a state changes with time, which is the job of Schrödinger’s equation.',
        scene: 'language-complete',
      },
    ],
    questions: [{
      question: 'What changes when you express the same quantum state in a different basis?',
      options: ['The physical preparation must change.', 'Its amplitude coordinates change.', 'All outcome probabilities become zero.'], correct: 1,
      success: 'Exactly. A basis changes the coordinates and the measurement question, not the already prepared state.',
    }],
    takeaways: ['A state is independent of the coordinates used to describe it.', 'A basis defines a set of distinguishable measurement outcomes.', 'Amplitudes are basis-dependent coordinates with size and phase.'],
  },
  {
    slug: 'schrodingers-equation', title: "Schrodinger's equation", number: 12, minutes: 10, accent: '#34d399', canvas: 'language', stageNumber: 2, stageLabel: 'Quantum language',
    steps: [
      {
        label: 'Landscape', eyebrow: 'Set the physical situation', title: 'Potential energy shapes the possibilities',
        lede: 'Walls, wells, and barriers define the environment in which a wavefunction evolves.',
        body: 'Switch landscapes. The same evolution law responds differently because each potential changes what motion and standing-wave shapes are allowed.',
        scene: 'potential-landscape', control: 'potential-shape',
      },
      {
        label: 'Evolve', eyebrow: 'A law of motion', title: 'Schrödinger’s equation moves amplitudes through time',
        lede: 'Given the state now and the energy rules, the equation determines the state at later times.',
        body: 'Adjust the playback speed. The wavefunction evolves smoothly and predictably until a measurement is made.',
        scene: 'equation-evolution', control: 'evolution-speed',
      },
      {
        label: 'Engine', eyebrow: 'Read the equation as a machine', title: 'Kinetic spreading and potential shaping work together',
        lede: 'The Hamiltonian is the energy operator that drives time evolution.',
        body: 'Inspect each contribution. The kinetic part responds to curvature; the potential part responds to location; together they generate the next state.',
        scene: 'equation-engine', control: 'equation-part',
      },
      {
        label: 'Predict', eyebrow: 'Use the model', title: 'A barrier reshapes the future wavefunction',
        lede: 'A packet can reflect and transmit because the equation evolves amplitudes through the entire landscape.',
        body: 'Raise the packet energy relative to the barrier. The transmitted share grows, while a lower-energy packet still leaves a tunneling tail.',
        scene: 'equation-predict', control: 'tunnel-energy',
      },
      {
        label: 'Check', eyebrow: 'Concept check', title: 'What does the equation predict?',
        lede: 'Choose the role played by Schrödinger’s equation between measurements.',
        body: 'It is the dynamical rule for the quantum state, analogous in role, though not form, to a classical law of motion.',
        scene: 'equation-check', control: 'check',
      },
      {
        label: 'Complete', eyebrow: 'Stage 2 complete', title: 'You can speak the quantum language',
        lede: 'You can now follow a state from preparation through evolution, interference, probability, and measurement.',
        body: 'The next stage will use this language to build atoms, orbitals, spin, identical particles, and the periodic table.',
        scene: 'language-complete',
      },
    ],
    questions: [{
      question: 'Between measurements, what does Schrödinger’s equation determine?',
      options: ['The smooth time evolution of the wavefunction', 'The exact next detector click', 'Which observer will inspect the apparatus'], correct: 0,
      success: 'Correct. The equation evolves the state; the evolved amplitudes determine probabilities for later measurements.',
    }],
    takeaways: ['The potential describes the physical energy landscape.', 'The Hamiltonian drives smooth wavefunction evolution.', 'The evolved state supplies amplitudes for future measurement outcomes.'],
  },
]

export function getLanguageLesson(slug: string): FoundationLesson | undefined {
  return LANGUAGE_LESSON_CONTENT.find(lesson => lesson.slug === slug)
}
