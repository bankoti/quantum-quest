import { InteractiveLesson } from './lessonTypes'

const singleSource = { title: 'IBM Quantum: states and transformations', url: 'https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/single-systems/quantum-information' }
const multiSource = { title: 'IBM Quantum: multiple systems', url: 'https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/multiple-systems/quantum-information' }
const boxSource = { title: 'MIT OpenCourseWare: the infinite square well', url: 'https://ocw.mit.edu/courses/8-04-quantum-physics-i-spring-2016/a565b327f85c7721b18f1074dbd69ede_MIT8_04S16_LecNotes11.pdf' }

export const MATH_CONTROL_VALUES: Record<string, number> = {
  'complex-phase': 25, 'complex-length': 70, 'math-interference': 25,
  'algebra-state': 35, 'observable-axis': 35, 'hilbert-dimension': 2,
  'hilbert-overlap': 50, 'hilbert-tensor': 0, 'box-boundary': 15,
  'box-energy': 50, 'box-evolution': 50, 'path-phase': 25, 'path-action': 35,
}
export const MATH_CONTROL_MODES: Record<string, string> = {
  'algebra-state': 'z', 'algebra-gate': 'h', 'algebra-order': 'hx',
  'observable-axis': 'z', 'observable-eigen': 'zero', 'observable-order': 'zz',
  'hilbert-tensor': 'bell', 'box-energy': '1', 'box-evolution': 'stationary', 'field-number': '0',
}
export const MATH_EVIDENCE_CONTROLS = ['math-interference', 'algebra-order', 'observable-axis', 'observable-order', 'hilbert-tensor']

export function validMathSettings(control: string, settings: { value: number; mode: string }): boolean {
  const ranges: Record<string, [number, number]> = { 'hilbert-dimension': [1, 4], 'box-boundary': [10, 50], 'box-energy': [50, 100], 'box-evolution': [10, 100] }
  const modes: Record<string, string[]> = {
    'algebra-state': ['z', 'x'], 'algebra-gate': ['x', 'h', 'z'], 'algebra-order': ['hx', 'xh'],
    'observable-axis': ['z', 'x'], 'observable-eigen': ['zero', 'one', 'plus'], 'observable-order': ['zz', 'zxz'],
    'hilbert-tensor': ['product', 'bell', 'mixture'], 'box-energy': ['1', '2', '3', '4'],
    'box-evolution': ['stationary', 'superposition'], 'field-number': ['0', '1', '2', '3'],
  }
  const [min, max] = ranges[control] ?? [0, 100]
  return Number.isInteger(settings.value) && settings.value >= min && settings.value <= max && (!modes[control] || modes[control].includes(settings.mode))
}

export const MATH_LESSONS: InteractiveLesson[] = [
  {
    slug: 'complex-numbers', title: 'Complex numbers', number: 30, minutes: 12,
    accent: '#f472b6', canvas: 'math', stageNumber: 6, stageLabel: 'Mathematical track', nextSlug: 'linear-algebra-intuition',
    steps: [
      { label: 'Phase', eyebrow: 'Two coordinates, one amplitude', title: 'A complex number is an arrow with a phase',
        lede: 'The real part runs horizontally; the imaginary part runs vertically. Together they describe one number.',
        body: 'Rotate the unit arrow. Its components change while its length stays one. Multiplying by i makes a quarter-turn; doing it twice points backwards, which is why i squared is -1.',
        scene: 'complex-phase', control: 'complex-phase', equation: { expression: 'z = cos(phi) + i sin(phi)', explanation: 'phi is the angle. The real and imaginary components locate the arrow tip; neither component alone is its length.' } },
      { label: 'Length', eyebrow: 'The Born rule', title: 'An amplitude is not a probability',
        lede: 'For one outcome in an orthonormal basis, probability is the squared length of its amplitude.',
        body: 'Shorten this arrow while keeping its phase fixed. Half the amplitude length means one quarter of the probability. The remaining probability belongs to the other outcome.',
        scene: 'complex-length', control: 'complex-length', equation: { expression: '|a + ib|^2 = a^2 + b^2', explanation: 'A negative or imaginary amplitude is allowed. The squared magnitude is always real and nonnegative.' } },
      { label: 'Combine', eyebrow: 'Add, then square', title: 'Relative phase turns two routes into interference',
        lede: 'At one output of a balanced interferometer, the two route amplitudes each have length one half.',
        body: 'At zero phase they reinforce; at 180 degrees they cancel at this output. The other output receives the missing probability. Compare the prediction with repeated detections.',
        scene: 'math-interference', control: 'math-interference',
        modelNote: 'This is an ideal balanced two-output interferometer with coherent paths and no losses. The arrows are contributions to one output, not two independent probabilities.',
        equation: { expression: 'P(0) = |(1 + exp(i phi))/2|^2', explanation: 'Adding probabilities would miss cancellation. P(1) = 1 - P(0) keeps the two-output model normalized.' } },
      { label: 'Check', eyebrow: 'Concept check', title: 'Can you separate length, phase, and probability?', lede: 'Use arrow geometry before reaching for algebra.', body: 'One question changes a length; the other changes the relationship between two arrows.', scene: 'math-check', control: 'check' },
      { label: 'Complete', eyebrow: 'Lesson complete', title: 'Complex amplitudes now have a geometric meaning', lede: 'Rotation carries phase, length carries magnitude, and addition carries interference.', body: 'Next, place several amplitudes together in a state vector.', scene: 'math-complete' },
    ],
    questions: [
      { question: 'An outcome amplitude has length 0.5. What is its probability?', options: ['50%.', '25%.', 'It depends only on the arrow angle.'], correct: 1, success: 'Yes. Squaring 0.5 gives 0.25, or 25%.' },
      { question: 'Two equal contributions point in opposite directions at output 0. What happens?', options: ['Their probabilities add to one at output 0.', 'Each amplitude disappears from both outputs.', 'Their amplitudes cancel at output 0.'], correct: 2, success: 'Correct. Opposite amplitudes cancel at this output; the full interferometer still conserves total probability.' },
    ],
    takeaways: ['Complex numbers encode magnitude and phase.', 'An outcome probability is the squared magnitude of its total amplitude.', 'Indistinguishable alternatives add as amplitudes before probabilities are calculated.'],
  },
  {
    slug: 'linear-algebra-intuition', title: 'Linear algebra intuition', number: 31, minutes: 14,
    accent: '#22d3ee', canvas: 'math', stageNumber: 6, stageLabel: 'Mathematical track', nextSlug: 'operators-and-observables',
    steps: [
      { label: 'Vectors', eyebrow: 'A list of amplitudes', title: 'A state vector lists amplitudes in a chosen basis',
        lede: 'A qubit needs two complex entries. For now, explore a slice where both entries are real.',
        body: 'Change the preparation and compare its Z and X coordinates. Changing coordinates does not physically change the state; it changes which measurement outcomes the entries refer to.',
        scene: 'algebra-state', control: 'algebra-state', equation: { expression: '|psi> = a|0> + b|1>; |a|^2 + |b|^2 = 1', explanation: 'The normalization condition makes the probabilities sum to one. Negative entries carry phase, not negative probability.' }, modelNote: 'This circle is a real slice of a two-dimensional complex state space, not the Bloch sphere or a path through physical space.' },
      { label: 'Matrices', eyebrow: 'Transform the whole vector', title: 'A matrix tells each input amplitude where to go',
        lede: 'Each matrix row combines input entries into one output entry.',
        body: 'Start with |+>, whose two amplitudes are equal. X swaps them, Z reverses the second, and H recombines them into |0>. Every gate shown preserves the vector length.',
        scene: 'algebra-gate', control: 'algebra-gate', equation: { expression: 'output[row] = sum(matrix[row, column] * input[column])', explanation: 'A unitary matrix preserves inner products and total probability. A general matrix need not be a valid deterministic quantum gate.' }, source: singleSource, modelNote: 'The input is freshly prepared as |+> for each selected gate. The signed bars show real amplitudes, not probabilities.' },
      { label: 'Order', eyebrow: 'Composition matters', title: 'The same gates in a different order can change the state',
        lede: 'Both sequences start in |0>, but H then X produces |+>, while X then H produces |->.',
        body: 'A Z measurement would give 50/50 for either output. An X measurement distinguishes them perfectly. Run each sequence and compare its X-basis detections.',
        scene: 'algebra-order', control: 'algebra-order', equation: { expression: 'X H |0> = |+>; H X |0> = |->', explanation: 'In matrix notation, the operation nearest the state acts first. The sequence buttons list operations in time order.' } },
      { label: 'Check', eyebrow: 'Concept check', title: 'What must a quantum transformation preserve?', lede: 'Separate a basis choice from a physical gate.', body: 'Then use the circuit experiment to reason about order.', scene: 'math-check', control: 'check' },
      { label: 'Complete', eyebrow: 'Lesson complete', title: 'Vectors and matrices now describe quantum operations', lede: 'You can read states as coordinates and gates as rules for combining those coordinates.', body: 'Not every operator is a gate. Next comes the special structure behind measurable quantities.', scene: 'math-complete' },
    ],
    questions: [
      { question: 'What does an ideal unitary gate preserve?', options: ['The squared norm, so total probability stays one.', 'Every individual amplitude.', 'The outcome of every possible measurement.'], correct: 0, success: 'Exactly. A unitary transformation preserves length and inner products, not every coordinate.' },
      { question: 'Why can H then X differ from X then H?', options: ['A qubit forgets the first gate.', 'Matrix multiplication need not commute.', 'The second sequence has more gates.'], correct: 1, success: 'Right. The order of noncommuting operations changes the final state.' },
    ],
    takeaways: ['A basis determines which amplitudes appear in a state vector.', 'Unitary matrices preserve normalization.', 'Gate order can change relative phase and measurable predictions.'],
  },
  {
    slug: 'operators-and-observables', title: 'Operators and observables', number: 32, minutes: 12,
    accent: '#fbbf24', canvas: 'math', stageNumber: 6, stageLabel: 'Mathematical track', nextSlug: 'hilbert-spaces',
    steps: [
      { label: 'Outcomes', eyebrow: 'A measurement has a spectrum', title: 'An observable connects a state to possible measured values',
        lede: 'The Pauli Z and X observables each have two eigenvalues: +1 and -1.',
        body: 'Rotate the preparation and choose an observable. Its expectation value is a probability-weighted average over many fresh preparations, not necessarily a result any one trial can return.',
        scene: 'observable-axis', control: 'observable-axis', equation: { expression: '<A> = (+1)P(+) + (-1)P(-)', explanation: 'An average of zero can come from equal numbers of +1 and -1. The measurement does not return zero in this two-outcome example.' }, modelNote: 'These dimensionless Pauli outcomes correspond to physical spin components after multiplication by hbar/2. Hermitian operators represent projective observables in this finite-dimensional model.' },
      { label: 'Eigenstates', eyebrow: 'A definite outcome', title: 'An eigenstate returns one observable value with certainty',
        lede: 'Applying the observable operator to an eigenvector multiplies it by its eigenvalue.',
        body: 'For Z, |0> and |1> are eigenstates with values +1 and -1. In contrast, |+> has equal probabilities for both Z outcomes. Applying a matrix is not itself the act of measuring.',
        scene: 'observable-eigen', control: 'observable-eigen', equation: { expression: 'A|a> = a|a>', explanation: 'The same letter a labels the eigenvalue. An ideal projective measurement of A in its eigenstate gives that value and leaves the state in that eigenspace.' } },
      { label: 'Order', eyebrow: 'Measurement changes the preparation', title: 'An intervening X measurement changes a later Z prediction',
        lede: 'Prepare |0> for every trial. Z then Z always finishes at +1; Z then X then Z finishes 50/50.',
        body: 'The middle X outcome is not selected or discarded. Averaging over both X outcomes still changes the final statistics. Noncommuting observables need not have simultaneous definite values.',
        scene: 'observable-order', control: 'observable-order', modelNote: 'Every batch uses freshly prepared |0> states and ideal projective measurements. The displayed statistics belong to the final Z measurement, with all intermediate outcomes retained.' },
      { label: 'Check', eyebrow: 'Concept check', title: 'Does an expectation value describe a single trial?', lede: 'Distinguish eigenvalues, averages, and state changes.', body: 'Connect the operator vocabulary to the measured evidence.', scene: 'math-check', control: 'check' },
      { label: 'Complete', eyebrow: 'Lesson complete', title: 'Operators now have an experimental meaning', lede: 'Eigenvalues name outcomes, eigenstates give certainty, and expectations summarize repeated trials.', body: 'The geometry behind these statements extends far beyond a single qubit.', scene: 'math-complete' },
    ],
    questions: [
      { question: 'A Pauli measurement has expectation zero. Which individual outcomes are possible?', options: ['Only zero.', '+1 or -1.', 'Any real value between -1 and +1.'], correct: 1, success: 'Correct. The average can be zero even though each result is +1 or -1.' },
      { question: 'Why does inserting X between two Z measurements change the final distribution?', options: ['The first detector loses its record.', 'The total probability stops being one.', 'X projects into states that are not Z eigenstates.'], correct: 2, success: 'Yes. The intermediate state has uncertain Z outcomes, even when the first Z result was definite.' },
    ],
    takeaways: ['Hermitian observables have real eigenvalues.', 'An expectation is an ensemble average, not a promised single outcome.', 'Measurements of noncommuting observables can change later statistics.'],
  },
  {
    slug: 'hilbert-spaces', title: 'Hilbert spaces', number: 33, minutes: 13,
    accent: '#a78bfa', canvas: 'math', stageNumber: 6, stageLabel: 'Mathematical track', nextSlug: 'solve-schrodingers-equation',
    steps: [
      { label: 'Dimension', eyebrow: 'Count independent directions', title: 'State-space dimension counts basis states, not spatial axes',
        lede: 'One qubit has two basis states. Two qubits have four; three have eight.',
        body: 'Add qubits and count the joint bit strings. This is the number of amplitudes needed for a general pure state in that basis, not the number of classical values one measurement reveals.',
        scene: 'hilbert-dimension', control: 'hilbert-dimension', equation: { expression: 'dim(H for n qubits) = 2^n', explanation: 'A Hilbert space is a complex inner-product space that is complete: limits of convergent state sequences remain in the space. Finite-dimensional examples are automatically complete; a particle on a line requires an infinite-dimensional space.' } },
      { label: 'Overlap', eyebrow: 'Geometry predicts detection', title: 'The inner product measures overlap between states',
        lede: 'Parallel state vectors have maximum overlap. Orthogonal states have zero overlap.',
        body: 'Compare the changing state with |0>. Squaring their overlap gives the probability of the |0> result. Orthogonal states can be perfectly distinguished in a suitable ideal measurement.',
        scene: 'hilbert-overlap', control: 'hilbert-overlap', equation: { expression: 'P(0) = |<0|psi>|^2', explanation: 'The bra <0| is the conjugate transpose of the ket |0>. The inner product conjugates the first vector before multiplying and adding coordinates.' }, modelNote: 'The arrows show a real slice of abstract state space. Angles here are not distances between objects in a laboratory.' },
      { label: 'Together', eyebrow: 'Tensor products', title: 'Joint spaces contain both product states and entangled states',
        lede: 'Combining two systems multiplies their dimensions. It does not force their joint state to factor into two independent vectors.',
        body: 'Compare |+>|+>, an entangled Bell state, and a classical mixture of 00 and 11. The last two agree in Z but differ in X. One matching probability table is not enough to establish entanglement.',
        scene: 'hilbert-tensor', control: 'hilbert-tensor', equation: { expression: '|Phi+> = (|00> + |11>)/sqrt(2)', explanation: 'This Bell vector cannot be written as |a> tensor |b>. The classical mixture needs a density matrix rather than one pure-state vector.' }, modelNote: 'Both observers use the same real measurement basis, rotated continuously from Z to X. The mixture is an equal statistical mixture of |00> and |11>, without coherence between them.', source: multiSource },
      { label: 'Check', eyebrow: 'Concept check', title: 'How large is a joint quantum state space?', lede: 'Count coordinates without confusing them with readable classical information.', body: 'Then distinguish coherent superposition from a statistical mixture.', scene: 'math-check', control: 'check' },
      { label: 'Complete', eyebrow: 'Lesson complete', title: 'One geometry now connects single and joint systems', lede: 'Dimensions, inner products, and tensor products organize quantum predictions.', body: 'Next, put a continuous wavefunction into this structure and solve for its allowed energies.', scene: 'math-complete' },
    ],
    questions: [
      { question: 'How many basis amplitudes describe a general pure state of three qubits?', options: ['3.', '6.', '8.'], correct: 2, success: 'Yes. Each qubit doubles the dimension: 2 times 2 times 2 equals 8.' },
      { question: 'Why are the Bell state and the 00/11 mixture not the same state?', options: ['Their coherence produces different predictions in other bases.', 'The mixture has more spatial dimensions.', 'The Bell state makes every individual result predictable.'], correct: 0, success: 'Exactly. Matching Z probabilities do not imply matching states; X-basis correlations reveal the difference here.' },
    ],
    takeaways: ['Hilbert-space dimensions count independent state coordinates.', 'Squared inner products determine ideal projection probabilities.', 'Tensor products combine systems; entangled states do not factor into independent pure states.'],
  },
  {
    slug: 'solve-schrodingers-equation', title: "Solve Schrodinger's equation", number: 34, minutes: 16,
    accent: '#fb7185', canvas: 'math', stageNumber: 6, stageLabel: 'Mathematical track', nextSlug: 'path-integrals-and-fields',
    steps: [
      { label: 'Boundaries', eyebrow: 'The infinite square well', title: 'Only waves that fit both walls are allowed',
        lede: 'Inside an ideal empty box the stationary wave is sinusoidal. At both infinitely high walls it must vanish.',
        body: 'Vary the number of half-waves across the box. Non-integer choices miss the right boundary. Positive integers satisfy both walls; zero would give the zero function, which cannot be normalized.',
        scene: 'box-boundary', control: 'box-boundary', equation: { expression: 'psi(0) = psi(L) = 0; kL = n*pi, n = 1, 2, ...', explanation: 'Inside the box, -hbar^2/(2m) times the second derivative of psi equals E times psi. Sine functions have a second derivative proportional to themselves, and the walls select their wavelengths.' }, modelNote: 'Trial curves are not normalized states until the boundary condition is satisfied. This model is a nonrelativistic particle in one dimension with ideal infinite walls.', source: boxSource },
      { label: 'Energies', eyebrow: 'A worked solution', title: 'Shorter wavelengths require higher kinetic energies',
        lede: 'The allowed energies grow as n squared and fall as the box width squared.',
        body: 'Choose an energy level and widen the box. Doubling its width divides every energy by four. The ground energy is nonzero because a confined state cannot be a flat, zero-momentum wave.',
        scene: 'box-energy', control: 'box-energy', equation: { expression: 'E_n = n^2*pi^2*hbar^2/(2mL^2)', explanation: 'Substitute k = n*pi/L into E = hbar^2*k^2/(2m). The normalized eigenfunction is sqrt(2/L)*sin(n*pi*x/L). Energies shown are relative to the ground energy at the reference width.' } },
      { label: 'Evolve', eyebrow: 'Time dependence', title: 'Stationary does not mean the wavefunction stops evolving',
        lede: 'One energy eigenstate gains a global phase while its probability density stays fixed.',
        body: 'Compare one eigenstate with an equal superposition of the two lowest energies. Different phase speeds make the superposition density change, even though its total probability stays one.',
        scene: 'box-evolution', control: 'box-evolution', equation: { expression: 'psi_n(x,t) = psi_n(x,0)*exp(-i E_n t/hbar)', explanation: 'A common phase cancels in the squared magnitude. Two different energies generate a changing relative phase. Time is displayed in units of hbar/E_1 for a fixed reference box.' } },
      { label: 'Check', eyebrow: 'Concept check', title: 'What did the boundary conditions determine?', lede: 'Connect allowed shapes, energy spacing, and time evolution.', body: 'Use the solved box rather than memorizing isolated formulas.', scene: 'math-check', control: 'check' },
      { label: 'Complete', eyebrow: 'Lesson complete', title: 'You have solved a quantum system from its boundaries', lede: 'The walls selected eigenfunctions, the eigenfunctions selected energies, and the energies determined phase evolution.', body: 'More complicated potentials often need numerical methods. The structure of the calculation remains the same.', scene: 'math-complete' },
    ],
    questions: [
      { question: 'For the same level n, doubling the box width changes the energy to...', options: ['Twice its original value.', 'One quarter of its original value.', 'The same value.'], correct: 1, success: 'Correct. Energy is proportional to 1/L squared.' },
      { question: 'Why is the probability density of an energy eigenstate stationary?', options: ['Its time dependence is a global phase that cancels in the squared magnitude.', 'Its wavefunction is independent of time.', 'The particle sits motionless at a wave peak.'], correct: 0, success: 'Exactly. A changing global phase leaves the probability density unchanged; it does not imply a stationary particle.' },
    ],
    takeaways: ['Boundary conditions select the allowed wavefunctions.', 'Infinite-well energies scale as n squared divided by L squared.', 'Relative phase between different energies makes superposition densities evolve.'],
  },
  {
    slug: 'path-integrals-and-fields', title: 'Path integrals and fields', number: 35, minutes: 15,
    accent: '#34d399', canvas: 'math', stageNumber: 6, stageLabel: 'Mathematical track',
    steps: [
      { label: 'Routes', eyebrow: 'Another way to calculate', title: 'Alternative routes contribute amplitudes to one outcome',
        lede: 'The path-integral viewpoint extends the same addition rule you used in the interferometer.',
        body: 'Change the phase on one of two coherent routes. The route is an alternative in the calculation, not a path that a detector has secretly observed. Recording which route removes the interference.',
        scene: 'path-phase', control: 'path-phase', equation: { expression: 'A(total) = sum of amplitudes for alternatives', explanation: 'For distinguishable alternatives the corresponding probabilities add. Coherent, indistinguishable alternatives can interfere.' } },
      { label: 'Action', eyebrow: 'Phases from motion', title: 'Action sets the phase associated with each path',
        lede: 'Nearby paths can reinforce when their actions differ little; rapidly changing phases can cancel.',
        body: 'Increase the action scale in this small family of bent routes. Watch their amplitude arrows spread. Near the straight path the phase varies least, suggesting how classical stationary-action motion emerges.',
        scene: 'path-action', control: 'path-action', equation: { expression: 'path contribution is proportional to exp(i S/hbar)', explanation: 'S is the action: the time integral of kinetic minus potential energy. Stationary action means small path variations leave S unchanged to first order; it need not be a minimum.' },
        modelNote: 'These eleven equal-weight, two-segment free-particle paths illustrate phase addition. They are not a converged path integral. The displayed coherence ratio is |sum of arrows|/11, not a normalized detection probability; discrete samples can also re-align.', source: { title: 'Feynman Lectures: action and quantum paths', url: 'https://www.feynmanlectures.caltech.edu/II_19.html' } },
      { label: 'Fields', eyebrow: 'Quantize a mode', title: 'A quantum field can carry different numbers of excitations',
        lede: 'A field has degrees of freedom throughout space. Quantizing a free field turns its modes into quantum oscillators.',
        body: 'Choose the photon number of one ideal optical mode. Its energy rises in equal steps. Even the vacuum has a spread of possible field-quadrature measurements; a number state has zero mean quadrature.',
        scene: 'field-number', control: 'field-number', equation: { expression: 'E_n = (n + 1/2)*hbar*omega', explanation: 'Here n counts excitations in one bosonic mode, not nodes of the particle-in-a-box wavefunction. The curve is a probability density for a dimensionless field quadrature, not the path or position of a photon.' },
        modelNote: 'This is one free bosonic mode, not a full quantum field simulation. Number states have no definite classical phase. The vacuum curve shows measurement variance, not little particles appearing on a timer. Interacting fields and fermionic fields require more structure.', source: { title: 'CERN: particles and quantum fields', url: 'https://home.cern/science/physics/higgs-boson/what/' } },
      { label: 'Checkpoint', eyebrow: 'The final connection', title: 'Can you connect the picture to the mathematics?', lede: 'Use phase, state geometry, energy, and field excitations together.', body: 'Each case tests a different link in the course, without requiring a long calculation.', scene: 'math-check', control: 'checkpoint' },
      { label: 'Complete', eyebrow: 'Mathematical track complete', title: 'You can connect the quantum picture to its mathematics', lede: 'Your toolkit now spans amplitudes, matrices, observables, Hilbert spaces, solved wavefunctions, and field modes.', body: 'This is a conceptual foundation, not the end of quantum physics. Deeper work leads to angular momentum, perturbation theory, scattering, many-body systems, and relativistic quantum fields.', scene: 'math-complete' },
    ],
    questions: [
      { question: 'What must be combined before squaring for coherent alternatives?', options: ['The independently squared probabilities.', 'The complex amplitudes.', 'The detector names.'], correct: 1, success: 'Yes. Complex amplitudes retain the relative phase that permits interference.' },
      { question: 'What is the dimension of the joint space of two qubits?', options: ['2.', '3.', '4.'], correct: 2, success: 'Correct. Tensor products multiply the component dimensions: 2 times 2 equals 4.' },
      { question: 'What changes in a superposition of different energy eigenstates?', options: ['Relative phase, which can change the probability density.', 'Total probability, which grows with time.', 'The positions of the infinite walls.'], correct: 0, success: 'Right. Different energy components evolve at different phase rates.' },
      { question: 'What does the vacuum of the single field mode demonstrate?', options: ['All possible field measurements must be zero.', 'Zero excitations can still have nonzero quadrature variance.', 'A hidden classical wave has a definite phase.'], correct: 1, success: 'Exactly. No quanta does not mean every field-quadrature measurement has a definite value.' },
    ],
    takeaways: ['Path integrals sum amplitudes with phases determined by action.', 'Stationary-action reasoning explains an important route to classical behavior.', 'Quantum fields extend state-and-operator ideas to modes with variable excitation numbers.'],
  },
]
