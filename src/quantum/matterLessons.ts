import { InteractiveLesson } from './lessonTypes'

export type MatterScene =
  | 'box-boundary'
  | 'box-modes'
  | 'box-energy'
  | 'box-check'
  | 'barrier-build'
  | 'tunnel-wave'
  | 'tunnel-rate'
  | 'tunnel-check'
  | 'orbital-cloud'
  | 'radial-nodes'
  | 'orbital-measurements'
  | 'orbital-check'
  | 'stern-gerlach'
  | 'spin-state'
  | 'spin-measurement'
  | 'spin-check'
  | 'particle-exchange'
  | 'orbital-occupancy'
  | 'quantum-statistics'
  | 'identical-check'
  | 'electron-shells'
  | 'pauli-builder'
  | 'periodic-builder'
  | 'matter-check'
  | 'matter-complete'

export const MATTER_LESSON_CONTENT: InteractiveLesson[] = [
  {
    slug: 'particle-in-a-box', title: 'Particle in a box', number: 13, minutes: 9, accent: '#fb7185', canvas: 'matter', stageNumber: 3, stageLabel: 'Atoms and matter', nextSlug: 'quantum-tunneling',
    steps: [
      {
        label: 'Confine', eyebrow: 'Add boundaries', title: 'Walls turn traveling possibilities into standing waves',
        lede: 'A confined wavefunction must fit the boundaries and vanish at impenetrable walls.',
        body: 'Change the box width. Only patterns that meet both walls cleanly survive, just as only certain standing waves fit a fixed string.',
        scene: 'box-boundary', control: 'box-width',
      },
      {
        label: 'Modes', eyebrow: 'Allowed states', title: 'Each extra half-wave creates a new quantum state',
        lede: 'The integer n counts the standing-wave modes that fit inside the box.',
        body: 'Raise the mode number. More nodes appear, the wavelength shortens, and the state carries greater kinetic energy.',
        scene: 'box-modes', control: 'box-level',
      },
      {
        label: 'Energy', eyebrow: 'Discrete spectrum', title: 'Boundary conditions quantize energy',
        lede: 'The box does not permit arbitrary wavelengths, so it does not permit arbitrary energies.',
        body: 'Move among the allowed levels. Notice that their spacing grows: higher modes are separated by increasingly large energy gaps.',
        scene: 'box-energy', control: 'box-level',
      },
      {
        label: 'Check', eyebrow: 'Concept check', title: 'Where did the energy ladder come from?',
        lede: 'Connect discrete energy to the wavefunction’s boundary conditions.',
        body: 'Nothing is rounding a continuous answer. The other patterns simply fail to satisfy the physical walls.',
        scene: 'box-check', control: 'check',
      },
      {
        label: 'Complete', eyebrow: 'Lesson complete', title: 'Confinement builds a spectrum',
        lede: 'You can now derive the idea of discrete energy from standing-wave geometry.',
        body: 'Real atoms use a three-dimensional potential rather than a square box, but the same boundary logic produces their allowed states.',
        scene: 'matter-complete',
      },
    ],
    questions: [{
      question: 'Why are only certain energies allowed for a particle in an ideal box?',
      options: ['Only certain standing-wave patterns satisfy both walls.', 'The detector rounds every energy to an integer.', 'The particle loses all energy whenever it touches a wall.'], correct: 0,
      success: 'Exactly. Boundary conditions select allowed wavelengths, and those wavelengths select allowed energies.',
    }],
    takeaways: ['A confined wavefunction must satisfy its boundaries.', 'Each allowed standing-wave mode is a quantum state.', 'Restricted wavelengths produce discrete energy levels.'],
  },
  {
    slug: 'quantum-tunneling', title: 'Quantum tunneling', number: 14, minutes: 8, accent: '#a78bfa', canvas: 'matter', stageNumber: 3, stageLabel: 'Atoms and matter', nextSlug: 'atomic-orbitals',
    steps: [
      {
        label: 'Barrier', eyebrow: 'Classical forbidden region', title: 'Build a barrier higher than the particle’s energy',
        lede: 'Classically, a particle with too little energy must reflect from the barrier.',
        body: 'Raise the barrier. The energy line remains below its top, creating a region that classical motion cannot enter.',
        scene: 'barrier-build', control: 'barrier-height',
      },
      {
        label: 'Tail', eyebrow: 'Wavefunction inside the barrier', title: 'The amplitude decays, but it does not stop instantly',
        lede: 'Schrödinger evolution carries a shrinking wavefunction through the forbidden region.',
        body: 'Adjust the packet energy. If some amplitude reaches the far edge, it can emerge as a transmitted wave and produce a detection beyond the barrier.',
        scene: 'tunnel-wave', control: 'tunnel-energy',
      },
      {
        label: 'Rate', eyebrow: 'Probability, not a free pass', title: 'Barrier width controls the tunneling probability',
        lede: 'A wider barrier gives the wavefunction more distance over which to decay.',
        body: 'Change the width, then send a batch. Tunneling becomes exponentially rarer, while each individual trial still ends as reflection or transmission.',
        scene: 'tunnel-rate', control: 'barrier-width',
      },
      {
        label: 'Check', eyebrow: 'Concept check', title: 'Does tunneling borrow energy?',
        lede: 'Choose the explanation that preserves energy conservation.',
        body: 'The transmitted particle has the same total energy; the wavefunction simply had nonzero amplitude beyond the barrier.',
        scene: 'tunnel-check', control: 'check',
      },
      {
        label: 'Complete', eyebrow: 'Lesson complete', title: 'Forbidden does not mean zero amplitude',
        lede: 'You can now explain tunneling through wavefunction decay and transmission probability.',
        body: 'This effect powers scanning tunneling microscopes, nuclear fusion, radioactive decay, and modern electronics.',
        scene: 'matter-complete',
      },
    ],
    questions: [{
      question: 'Why can a particle be detected beyond a barrier higher than its energy?',
      options: ['Its wavefunction can retain nonzero amplitude across the barrier.', 'It temporarily receives unlimited energy from the detector.', 'The barrier disappears whenever nobody watches it.'], correct: 0,
      success: 'Correct. The wavefunction decays through the barrier but can remain nonzero on the far side.',
    }],
    takeaways: ['A forbidden region produces exponential wavefunction decay.', 'Nonzero amplitude beyond the barrier gives a transmission probability.', 'Tunneling conserves the particle’s total energy.'],
  },
  {
    slug: 'atomic-orbitals', title: 'Atomic orbitals', number: 15, minutes: 10, accent: '#22d3ee', canvas: 'matter', stageNumber: 3, stageLabel: 'Atoms and matter', nextSlug: 'spin',
    steps: [
      {
        label: 'Shape', eyebrow: 'Three-dimensional states', title: 'An orbital is a probability shape, not an orbit',
        lede: 'Electrons in atoms occupy wavefunctions spread through three-dimensional space.',
        body: 'Switch among s, p, and d orbitals. The shapes are regions of likely detection separated by nodes where the amplitude vanishes.',
        scene: 'orbital-cloud', control: 'orbital-shape',
      },
      {
        label: 'Nodes', eyebrow: 'Structure inside the cloud', title: 'Higher states add shells and nodal surfaces',
        lede: 'Nodes encode sign and phase changes in the wavefunction, not empty planetary gaps.',
        body: 'Follow the s-state family upward. New radial nodes appear and the typical distance from the nucleus grows.',
        scene: 'radial-nodes', control: 'orbital-level',
      },
      {
        label: 'Sample', eyebrow: 'From state to evidence', title: 'Repeated detections reveal the orbital cloud',
        lede: 'One electron detection is a point. Many identically prepared atoms reconstruct the probability distribution.',
        body: 'Sample the orbital. Dots accumulate into the same lobes and nodes predicted by the wavefunction.',
        scene: 'orbital-measurements', control: 'orbital-sample',
      },
      {
        label: 'Check', eyebrow: 'Concept check', title: 'What is an atomic orbital?',
        lede: 'Leave the miniature solar-system picture behind.',
        body: 'An orbital is a stationary quantum state with an energy, shape, and phase structure.',
        scene: 'orbital-check', control: 'check',
      },
      {
        label: 'Complete', eyebrow: 'Lesson complete', title: 'Atoms now have probability architecture',
        lede: 'You can read orbital shapes as wavefunction structure and detection probability.',
        body: 'Spin and identical-particle rules will determine how electrons occupy these states.',
        scene: 'matter-complete',
      },
    ],
    questions: [{
      question: 'Which statement best describes an atomic orbital?',
      options: ['A fixed elliptical path followed by an electron', 'A three-dimensional quantum state with probability and phase structure', 'A hollow shell made of stationary electrons'], correct: 1,
      success: 'Right. Orbitals are wavefunctions, and their squared magnitudes predict detection distributions.',
    }],
    takeaways: ['Orbitals are quantum states, not trajectories.', 'Orbital lobes and nodes come from wavefunction structure.', 'Many detections reconstruct an orbital’s probability cloud.'],
  },
  {
    slug: 'spin', title: 'Spin', number: 16, minutes: 9, accent: '#fbbf24', canvas: 'matter', stageNumber: 3, stageLabel: 'Atoms and matter', nextSlug: 'identical-particles',
    steps: [
      {
        label: 'Split', eyebrow: 'Stern-Gerlach experiment', title: 'A magnetic field splits spin into two outcomes',
        lede: 'A beam of atoms does not spread continuously; it separates into spin-up and spin-down spots.',
        body: 'Rotate the measurement axis. Whatever direction you choose, a spin-½ system still produces two discrete outcomes along that axis.',
        scene: 'stern-gerlach', control: 'spin-axis',
      },
      {
        label: 'State', eyebrow: 'Intrinsic angular momentum', title: 'Spin is a two-state quantum property',
        lede: 'The Bloch-sphere arrow represents a spin state, not a tiny ball physically rotating in space.',
        body: 'Rotate the prepared spin. Its angle relative to the measurement axis sets the two outcome probabilities.',
        scene: 'spin-state', control: 'spin-angle',
      },
      {
        label: 'Measure', eyebrow: 'Incompatible axes', title: 'A definite Z spin is uncertain along X',
        lede: 'Changing the measurement axis changes the basis used to ask the spin question.',
        body: 'Choose an axis and measure a batch. A state aligned with Z is predictable in Z and split evenly in X.',
        scene: 'spin-measurement', control: 'spin-measurement',
      },
      {
        label: 'Check', eyebrow: 'Concept check', title: 'Is spin literal rotation?',
        lede: 'Choose the interpretation supported by experiments.',
        body: 'Spin behaves as intrinsic angular momentum with quantized measurement outcomes and no classical rotating-object model.',
        scene: 'spin-check', control: 'check',
      },
      {
        label: 'Complete', eyebrow: 'Lesson complete', title: 'A new two-state degree of freedom',
        lede: 'You can now prepare, rotate, and measure spin without picturing a tiny spinning sphere.',
        body: 'Spin supplies the paired labels that let electrons share orbitals under the exclusion principle.',
        scene: 'matter-complete',
      },
    ],
    questions: [{
      question: 'What does the arrow used to draw a spin state represent?',
      options: ['A quantum state relative to possible measurement axes', 'The physical surface rotation of a tiny sphere', 'The electron’s orbit around a nucleus'], correct: 0,
      success: 'Exactly. The arrow is a state-space representation used to predict quantized spin outcomes.',
    }],
    takeaways: ['Spin is intrinsic and has no complete classical rotation picture.', 'Spin-½ measurements return two outcomes along any axis.', 'A definite state in one basis can be uncertain in another.'],
  },
  {
    slug: 'identical-particles', title: 'Identical particles', number: 17, minutes: 10, accent: '#c084fc', canvas: 'matter', stageNumber: 3, stageLabel: 'Atoms and matter', nextSlug: 'why-the-periodic-table-works',
    steps: [
      {
        label: 'Exchange', eyebrow: 'No hidden name tags', title: 'Identical quantum particles cannot be tracked by identity',
        lede: 'Exchanging two identical particles must leave every observable prediction unchanged.',
        body: 'Switch particle families. Bosonic amplitudes reinforce under exchange; fermionic amplitudes change sign and can cancel.',
        scene: 'particle-exchange', control: 'particle-kind',
      },
      {
        label: 'Occupy', eyebrow: 'Pauli exclusion', title: 'Two identical fermions cannot share one full state',
        lede: 'Electrons may share a spatial orbital only when another quantum label, their spin, differs.',
        body: 'Add electrons to the orbital boxes. Each box can accept one up-spin and one down-spin; after those two states are used, another orbital is required.',
        scene: 'orbital-occupancy', control: 'occupancy',
      },
      {
        label: 'Statistics', eyebrow: 'Build different kinds of matter', title: 'Bosons gather; fermions build structure',
        lede: 'Bosons can pile into one state, while fermions fill an expanding ladder of states.',
        body: 'Compare their occupancy patterns. The fermionic rule creates electron shells, material stiffness, and the architecture of ordinary matter.',
        scene: 'quantum-statistics', control: 'statistics-mode',
      },
      {
        label: 'Check', eyebrow: 'Concept check', title: 'Why does exclusion matter?',
        lede: 'Connect exchange symmetry to the structure of atoms.',
        body: 'Without exclusion, every atomic electron could fall into the same lowest state and chemistry would lose its layered structure.',
        scene: 'identical-check', control: 'check',
      },
      {
        label: 'Complete', eyebrow: 'Lesson complete', title: 'Particle identity has become a physical rule',
        lede: 'You can now distinguish bosonic gathering from fermionic state filling.',
        body: 'The periodic table is the visible record of electrons filling orbitals under these rules.',
        scene: 'matter-complete',
      },
    ],
    questions: [{
      question: 'Why can an atomic orbital hold at most two electrons?',
      options: ['Electrons repel with exactly two units of force.', 'The two electrons can differ by spin, while a third would duplicate a full state.', 'Every orbital has two classical tracks.'], correct: 1,
      success: 'Correct. Opposite spins make two distinct full states; a third electron would violate Pauli exclusion.',
    }],
    takeaways: ['Identical particles have no observable individual identity.', 'Bosons and fermions obey different exchange symmetries.', 'Pauli exclusion forces electrons to fill distinct states.'],
  },
  {
    slug: 'why-the-periodic-table-works', title: 'Why the periodic table works', number: 18, minutes: 10, accent: '#34d399', canvas: 'matter', stageNumber: 3, stageLabel: 'Atoms and matter',
    steps: [
      {
        label: 'Shells', eyebrow: 'Fill an atom', title: 'Electron states organize into shells and subshells',
        lede: 'Each new proton attracts one more electron, which must enter the lowest available state.',
        body: 'Add electrons from hydrogen through argon. Watch inner shells close and new shells begin.',
        scene: 'electron-shells', control: 'electron-count',
      },
      {
        label: 'Pair', eyebrow: 'Apply spin and exclusion', title: 'Orbitals fill one spin at a time, then pair',
        lede: 'Electrons first occupy equal-energy orbitals separately before pairing, reducing avoidable overlap.',
        body: 'Move through a subshell. Arrows mark spin states, while boxes mark spatial orbitals.',
        scene: 'pauli-builder', control: 'subshell-fill',
      },
      {
        label: 'Repeat', eyebrow: 'Periodic behavior', title: 'Valence patterns repeat across rows',
        lede: 'Elements in one column share similar outer-electron arrangements and therefore similar chemistry.',
        body: 'Build the first 18 elements. Completed shells mark noble gases; one-electron outer shells begin the next repeating cycle.',
        scene: 'periodic-builder', control: 'element-build',
      },
      {
        label: 'Checkpoint', eyebrow: 'Atoms and matter checkpoint', title: 'Can you assemble matter from the rules?',
        lede: 'Connect confinement, orbitals, spin, and exclusion across three cases.',
        body: 'Choose one answer for every case, then check the complete atomic model.',
        scene: 'matter-check', control: 'checkpoint',
      },
      {
        label: 'Complete', eyebrow: 'Stage 3 complete', title: 'Quantum rules now build ordinary matter',
        lede: 'You can trace the periodic table from allowed states, orbital shapes, spin, and exclusion.',
        body: 'The next stage will connect multiple particles into entanglement, Bell experiments, decoherence, and the quantum-to-classical transition.',
        scene: 'matter-complete',
      },
    ],
    questions: [
      {
        question: 'Why do atomic electrons occupy discrete shells?',
        options: ['Bound wavefunctions permit only certain states.', 'Electrons choose round-number distances.', 'Detectors divide every orbit into rings.'], correct: 0,
        success: 'Boundaries and the atomic potential admit only specific wavefunction states and energies.',
      },
      {
        question: 'What limits one spatial orbital to two electrons?',
        options: ['The two available opposite spin states', 'A universal two-electron electric force', 'The size of the orbital drawing'], correct: 0,
        success: 'Opposite spins provide two distinct full states; exclusion forbids a duplicate third state.',
      },
      {
        question: 'Why do chemical properties repeat down a periodic-table column?',
        options: ['Elements repeat similar outer-electron configurations.', 'Every column has the same nuclear charge.', 'Orbitals reset to classical paths after each row.'], correct: 0,
        success: 'Similar valence configurations produce recurring bonding and chemical behavior.',
      },
    ],
    takeaways: ['Atomic potentials create shells of allowed states.', 'Spin and exclusion determine orbital occupancy.', 'Repeating valence configurations create periodic chemistry.'],
  },
]

export function getMatterLesson(slug: string): InteractiveLesson | undefined {
  return MATTER_LESSON_CONTENT.find(lesson => lesson.slug === slug)
}
