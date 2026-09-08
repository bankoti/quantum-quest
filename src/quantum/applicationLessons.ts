import { InteractiveLesson } from './lessonTypes'

export type ApplicationScene =
  | 'laser-pump'
  | 'laser-inversion'
  | 'stimulated-cascade'
  | 'laser-check'
  | 'band-structure'
  | 'doped-lattice'
  | 'transistor-channel'
  | 'semiconductor-check'
  | 'spin-ensemble'
  | 'resonance-curve'
  | 'mri-signal'
  | 'sensor-check'
  | 'bit-qubit'
  | 'bloch-state'
  | 'qubit-histogram'
  | 'qubit-check'
  | 'gate-transform'
  | 'circuit-builder'
  | 'circuit-results'
  | 'circuit-check'
  | 'qkd-bases'
  | 'qkd-eavesdrop'
  | 'qkd-key'
  | 'applications-checkpoint'
  | 'applications-complete'

export const APPLICATION_LESSON_CONTENT: InteractiveLesson[] = [
  {
    slug: 'lasers', title: 'Lasers', number: 24, minutes: 8, accent: '#fb7185', canvas: 'application', stageNumber: 5, stageLabel: 'Applications', nextSlug: 'semiconductors',
    steps: [
      {
        label: 'Pump', eyebrow: 'Store quantum energy', title: 'Pumping lifts atoms into excited states',
        lede: 'A laser begins by feeding energy into a material with discrete atomic or molecular levels.',
        body: 'Raise the pump rate. Atoms absorb energy and move upward, while spontaneous emissions leave with unrelated directions and phases.',
        scene: 'laser-pump', control: 'pump-rate',
        modelNote: 'These two lines show the lasing transition only. Real laser pumping uses additional energy levels or other energy-transfer processes to establish inversion; resonant pumping of an isolated two-level system cannot do this.',
      },
      {
        label: 'Invert', eyebrow: 'Outnumber absorption', title: 'A population inversion makes amplification possible',
        lede: 'More atoms must occupy the useful excited state than the lower state that can absorb the light.',
        body: 'Increase the inversion. Below the threshold, absorption wins; above it, one passing photon is more likely to trigger an added photon.',
        scene: 'laser-inversion', control: 'inversion-level',
      },
      {
        label: 'Amplify', eyebrow: 'Stimulated emission', title: 'One photon can recruit a matching photon',
        lede: 'A photon with the right energy stimulates an excited atom to emit into the same optical mode.',
        body: 'Release a seed photon. Mirrors return the growing wave through the gain material, selecting a narrow set of directions and frequencies.',
        scene: 'stimulated-cascade', control: 'laser-seed',
      },
      {
        label: 'Check', eyebrow: 'Concept check', title: 'Why is laser light so orderly?',
        lede: 'Connect the energy-level picture to a coherent beam.',
        body: 'The cavity selects modes while stimulated emission adds photons with a fixed phase relationship to the field already present.',
        scene: 'laser-check', control: 'check',
      },
      {
        label: 'Complete', eyebrow: 'Lesson complete', title: 'Quantum transitions become a coherent beam',
        lede: 'You can now trace laser action through pumping, inversion, stimulated emission, and cavity feedback.',
        body: 'The same controlled quantum light reads discs, carries internet traffic, cuts materials, and probes atoms.',
        scene: 'applications-complete',
      },
    ],
    questions: [{
      question: 'What most directly allows light to be amplified coherently inside a laser?',
      options: ['Stimulated emission adds photons to selected cavity modes.', 'Every spontaneous photon happens to leave in the same direction.', 'The mirrors continuously increase each photon’s energy.'], correct: 0,
      success: 'Correct. Stimulated emission feeds the existing field, while the cavity selects and reinforces particular modes.',
    }],
    takeaways: ['Pumping stores energy in excited states.', 'Population inversion lets stimulated emission exceed absorption.', 'Stimulated emission and cavity selection produce coherent laser modes.'],
  },
  {
    slug: 'semiconductors', title: 'Semiconductors', number: 25, minutes: 10, accent: '#fbbf24', canvas: 'application', stageNumber: 5, stageLabel: 'Applications', nextSlug: 'mri-and-quantum-sensors',
    steps: [
      {
        label: 'Bands', eyebrow: 'Many atoms together', title: 'Atomic levels broaden into energy bands',
        lede: 'In a crystal, enormous numbers of nearby atomic states form allowed bands separated by a forbidden gap.',
        body: 'Change the band gap. Electrons in the filled valence band need enough energy to reach mobile states in the conduction band.',
        scene: 'band-structure', control: 'band-gap',
      },
      {
        label: 'Dope', eyebrow: 'Engineer the carriers', title: 'A few substituted atoms reshape conductivity',
        lede: 'Dopants introduce electrons or holes without turning the bulk crystal into a charged object.',
        body: 'Compare intrinsic, n-type, and p-type material. Donors make mobile electrons easier to access; acceptors create mobile holes.',
        scene: 'doped-lattice', control: 'doping-type',
      },
      {
        label: 'Switch', eyebrow: 'Field-effect transistor', title: 'A gate voltage opens and closes a conducting channel',
        lede: 'An electric field shifts the local energy landscape and changes the carrier density beneath the gate.',
        body: 'Raise the gate voltage. Once a channel forms, current can flow between source and drain; remove it and the path disappears.',
        scene: 'transistor-channel', control: 'gate-voltage',
      },
      {
        label: 'Check', eyebrow: 'Concept check', title: 'Why can a semiconductor become a switch?',
        lede: 'Connect quantum bands to controllable current.',
        body: 'Its modest band gap and engineered carrier population let electric fields move the material between insulating and conducting behavior.',
        scene: 'semiconductor-check', control: 'check',
      },
      {
        label: 'Complete', eyebrow: 'Lesson complete', title: 'Quantum bands now perform logic',
        lede: 'You can follow a transistor from atomic states to a voltage-controlled channel.',
        body: 'Billions of these switches coordinate the calculations and memory inside modern electronics.',
        scene: 'applications-complete',
      },
    ],
    questions: [{
      question: 'What makes semiconductor conductivity especially controllable?',
      options: ['A band gap and carrier population that fields and dopants can reshape.', 'Electrons follow fixed wires drawn inside each atom.', 'The crystal alternates between quantum and classical laws.'], correct: 0,
      success: 'Exactly. Band structure, doping, and electrostatic gates provide practical control over mobile carriers.',
    }],
    takeaways: ['Crystal states form valence and conduction bands.', 'Doping controls the availability of electrons and holes.', 'A transistor gate controls whether a conducting channel exists.'],
  },
  {
    slug: 'mri-and-quantum-sensors', title: 'MRI and quantum sensors', number: 26, minutes: 9, accent: '#22d3ee', canvas: 'application', stageNumber: 5, stageLabel: 'Applications', nextSlug: 'qubits',
    steps: [
      {
        label: 'Align', eyebrow: 'Spin in a magnetic field', title: 'A field creates a tiny spin population imbalance',
        lede: 'Hydrogen nuclei have spin and magnetic moments with quantized orientations relative to a field.',
        body: 'Increase the magnetic field. Almost equal populations remain, but a small excess in the lower-energy orientation creates measurable net magnetization.',
        scene: 'spin-ensemble', control: 'magnetic-field',
        modelNote: 'The population difference is deliberately exaggerated. In typical MRI conditions, the excess is only a few nuclei per million; the large number of nuclei makes the net signal measurable. The arrows represent magnetic moments, not little spinning balls.',
      },
      {
        label: 'Tune', eyebrow: 'Resonant control', title: 'Spins respond when the radio pulse matches their precession',
        lede: 'The resonance frequency grows with the magnetic field and depends on the kind of nucleus.',
        body: 'Tune the radio frequency across resonance. At the matching frequency, the pulse efficiently rotates the ensemble magnetization.',
        scene: 'resonance-curve', control: 'rf-frequency',
        modelNote: 'This frequency scan holds the magnetic field fixed. The slider uses relative units; a stronger field would shift the entire resonance peak to a higher frequency.',
      },
      {
        label: 'Listen', eyebrow: 'Turn spin into signal', title: 'Relaxing spins induce a fading electrical signal',
        lede: 'After the pulse, coherent transverse magnetization precesses and induces voltage in a receiver coil.',
        body: 'Excite the sample. Tissue-dependent relaxation changes the fading signal, while magnetic-field gradients encode where it came from.',
        scene: 'mri-signal', control: 'mri-pulse',
      },
      {
        label: 'Check', eyebrow: 'Concept check', title: 'What does an MRI scanner actually detect?',
        lede: 'Move from individual spin outcomes to an ensemble signal.',
        body: 'The receiver detects electromagnetic induction from the precessing net magnetization of a huge spin ensemble, not a photograph of one nucleus.',
        scene: 'sensor-check', control: 'check',
      },
      {
        label: 'Complete', eyebrow: 'Lesson complete', title: 'Spin has become a precision probe',
        lede: 'You can now trace field alignment, resonance, precession, relaxation, and spatial encoding.',
        body: 'Quantum sensors reuse these ideas to detect tiny magnetic fields, timing shifts, acceleration, and material structure.',
        scene: 'applications-complete',
      },
    ],
    questions: [{
      question: 'What produces the radio-frequency signal measured after an MRI pulse?',
      options: ['Precessing net magnetization induces a voltage in the receiver coil.', 'Individual nuclei emit visible-light photographs of nearby tissue.', 'The main magnet mechanically scans each atom’s position.'], correct: 0,
      success: 'Correct. The coherent ensemble magnetization precesses, relaxes, and induces the measured signal.',
    }],
    takeaways: ['A magnetic field creates a small spin population imbalance.', 'Radio-frequency resonance controls the ensemble magnetization.', 'Precession, relaxation, and gradients create the MRI signal and image.'],
  },
  {
    slug: 'qubits', title: 'Qubits', number: 27, minutes: 9, accent: '#a78bfa', canvas: 'application', stageNumber: 5, stageLabel: 'Applications', nextSlug: 'quantum-gates-and-circuits',
    steps: [
      {
        label: 'Encode', eyebrow: 'A physical two-state system', title: 'A qubit stores a direction in quantum state space',
        lede: 'A classical bit occupies one logical value, while a qubit is described by two complex amplitudes.',
        body: 'Switch between the models. A qubit is not merely an unknown classical bit; phase can change what later operations and measurements do.',
        scene: 'bit-qubit', control: 'information-model',
      },
      {
        label: 'Prepare', eyebrow: 'Control amplitudes', title: 'Rotations move the qubit around the Bloch sphere',
        lede: 'The state’s angle sets measurement probabilities, while its orientation around the sphere carries relative phase.',
        body: 'Rotate the state from |0> toward |1>. Intermediate directions create probabilistic Z-basis outcomes that remain precisely controllable.',
        scene: 'bloch-state', control: 'qubit-angle',
      },
      {
        label: 'Measure', eyebrow: 'One result per trial', title: 'Repeated preparations reveal the qubit probabilities',
        lede: 'Each measurement returns 0 or 1 and leaves the qubit in the corresponding outcome state.',
        body: 'Measure many identically prepared qubits. The histogram approaches the probabilities encoded by the state’s amplitudes.',
        scene: 'qubit-histogram', control: 'qubit-sample',
      },
      {
        label: 'Check', eyebrow: 'Concept check', title: 'Is a qubit just two bits at once?',
        lede: 'Use the state-and-measurement language you have built.',
        body: 'A qubit has one quantum state with amplitudes and phase. Measurement produces one classical outcome, not both readable values.',
        scene: 'qubit-check', control: 'check',
      },
      {
        label: 'Complete', eyebrow: 'Lesson complete', title: 'Quantum state space can encode information',
        lede: 'You can now distinguish qubit amplitudes from classical uncertainty and measured bits.',
        body: 'Quantum gates will deliberately rotate these amplitudes so alternative computational paths can interfere.',
        scene: 'applications-complete',
      },
    ],
    questions: [{
      question: 'Which description of a qubit is most accurate?',
      options: ['A controllable quantum state with amplitudes and relative phase.', 'Two independently readable classical bits in one object.', 'A classical bit whose value changes too quickly to observe.'], correct: 0,
      success: 'Right. Amplitudes and phase define the qubit state; one measurement still yields one classical result.',
    }],
    takeaways: ['Qubits are physical two-state quantum systems.', 'Amplitude size and relative phase both affect future outcomes.', 'Measurement produces one classical outcome and changes the state.'],
  },
  {
    slug: 'quantum-gates-and-circuits', title: 'Quantum gates and circuits', number: 28, minutes: 11, accent: '#c084fc', canvas: 'application', stageNumber: 5, stageLabel: 'Applications', nextSlug: 'quantum-cryptography',
    steps: [
      {
        label: 'Rotate', eyebrow: 'Single-qubit gates', title: 'A quantum gate rotates amplitudes without reading them',
        lede: 'X flips the poles, H moves between pole and equator, and Z changes relative phase.',
        body: 'Apply different gates to |0>. X flips it, H creates an equal superposition, and Z leaves this input unchanged because there is no |1> amplitude to phase-flip.',
        scene: 'gate-transform', control: 'gate-choice',
        modelNote: 'The faint arrow is the input |0>; the colored arrow is the output. These pure states stay on the surface of the Bloch sphere under ideal gates. Z changes the relative phase only when both basis amplitudes are present.',
        source: { title: 'IBM Quantum: the Bloch sphere', url: 'https://quantum.cloud.ibm.com/learning/en/courses/general-formulation-of-quantum-information/density-matrices/bloch-sphere' },
      },
      {
        label: 'Compose', eyebrow: 'Interference in a circuit', title: 'Gate sequences make computational paths cancel or reinforce',
        lede: 'Two circuits can visit superposition and still finish with opposite certain outcomes.',
        body: 'Compare H-H with H-Z-H. The middle phase change is invisible by itself in the Z basis, but the final H converts it into a bit flip.',
        scene: 'circuit-builder', control: 'circuit-sequence',
      },
      {
        label: 'Run', eyebrow: 'Sample the circuit', title: 'Measurements expose the circuit’s final interference pattern',
        lede: 'H-H returns |0>, while H-Z-H returns |1> in the ideal model.',
        body: 'Run a batch and switch circuits. Quantum algorithms scale this idea by arranging many amplitudes so useful answers reinforce.',
        scene: 'circuit-results', control: 'circuit-run',
      },
      {
        label: 'Check', eyebrow: 'Concept check', title: 'Where does a quantum algorithm gain structure?',
        lede: 'Superposition alone is not a speedup.',
        body: 'The gate sequence controls phase and amplitude so unwanted computational paths cancel and useful outcomes become more likely.',
        scene: 'circuit-check', control: 'check',
      },
      {
        label: 'Complete', eyebrow: 'Lesson complete', title: 'A circuit is choreography for amplitudes',
        lede: 'You can now read gates as reversible state transformations and circuits as engineered interference.',
        body: 'Entangling gates add joint-state structure, allowing multi-qubit circuits to explore correlations unavailable to isolated bits.',
        scene: 'applications-complete',
      },
    ],
    questions: [{
      question: 'What is the central job of a quantum gate sequence before measurement?',
      options: ['Transform amplitudes and phases so computational paths interfere usefully.', 'Read every superposition branch and print all answers.', 'Duplicate unknown qubits until one has the desired value.'], correct: 0,
      success: 'Exactly. Algorithms engineer amplitude and phase, then measurement samples the resulting distribution.',
    }],
    takeaways: ['Ideal quantum gates are reversible state transformations.', 'Phase changes become observable through later interference.', 'Quantum circuits arrange amplitudes so selected outcomes are enhanced.'],
  },
  {
    slug: 'quantum-cryptography', title: 'Quantum cryptography', number: 29, minutes: 9, accent: '#34d399', canvas: 'application', stageNumber: 5, stageLabel: 'Applications',
    steps: [
      {
        label: 'Encode', eyebrow: 'BB84 states', title: 'Two incompatible bases encode the same bit values',
        lede: 'Alice randomly prepares each photon in the rectilinear or diagonal polarization basis.',
        body: 'Switch bases. States within one basis are distinguishable, but no measurement can perfectly identify all four possible preparations at once.',
        scene: 'qkd-bases', control: 'qkd-basis',
      },
      {
        label: 'Intercept', eyebrow: 'Measurement leaves evidence', title: 'An eavesdropper must sometimes guess the wrong basis',
        lede: 'Eve cannot copy an unknown quantum state perfectly and wait for the basis announcement.',
        body: 'Toggle interception. When Eve measures in the wrong basis and resends, she introduces errors that survive into part of the sifted key.',
        scene: 'qkd-eavesdrop', control: 'eavesdropper',
      },
      {
        label: 'Sift', eyebrow: 'Estimate the error rate', title: 'Alice and Bob compare bases, then test a public subset',
        lede: 'They keep positions where their bases matched and sacrifice some bits to estimate disturbance.',
        body: 'Compare a public sample with and without interception. These test bits are discarded. A high error rate aborts the key; a low rate is only the beginning of further checks and processing.',
        scene: 'qkd-key', control: 'qkd-run',
        modelNote: 'Without Eve, this toy channel has 2% background errors. Full intercept-and-resend uses the ideal 25% error rate. The 11% alarm illustrates an idealized asymptotic BB84 limit, not a security guarantee for 120 bits. A real protocol accounts for finite samples, authenticates messages, and performs error correction and privacy amplification.',
        source: { title: 'IBM Quantum: quantum key distribution', url: 'https://quantum.cloud.ibm.com/learning/en/modules/computer-science/quantum-key-distribution' },
      },
      {
        label: 'Checkpoint', eyebrow: 'Applications checkpoint', title: 'Can you connect quantum rules to working devices?',
        lede: 'Trace states, transitions, bands, spin, gates, and measurement across three cases.',
        body: 'Choose one answer for every case, then check the complete applications model.',
        scene: 'applications-checkpoint', control: 'checkpoint',
      },
      {
        label: 'Complete', eyebrow: 'Stage 5 complete', title: 'Quantum physics is already an engineering toolkit',
        lede: 'The same principles now connect coherent light, electronics, imaging, sensing, computation, and secure key exchange.',
        body: 'The final stage will add the mathematical structure needed to calculate these systems rather than only reason about them.',
        scene: 'applications-complete',
      },
    ],
    questions: [
      {
        question: 'Why does a laser require population inversion?',
        options: ['It makes stimulated emission more likely than competing absorption.', 'It forces every atom into its lowest state.', 'It gives photons permanent extra electric charge.'], correct: 0,
        success: 'Correct. Inversion turns the gain material from a net absorber into a net amplifier.',
      },
      {
        question: 'What turns an otherwise hidden phase change into a circuit output?',
        options: ['Later gates recombine amplitudes so they interfere.', 'The phase is copied directly into a classical register.', 'Every qubit emits a photon labeled with its phase.'], correct: 0,
        success: 'Right. A later basis-changing gate converts relative phase into measurable outcome probability.',
      },
      {
        question: 'How can BB84 reveal interception?',
        options: ['Wrong-basis measurements introduce detectable errors in the sifted data.', 'Entangled photons transmit Eve’s identity to Alice.', 'The protocol makes the optical channel physically impossible to touch.'], correct: 0,
        success: 'Exactly. Measurement disturbance raises the estimated error rate, provided authentication and device assumptions hold.',
      },
    ],
    takeaways: ['Quantum transitions and bands power everyday optical and electronic devices.', 'Controlled spin and qubit states turn quantum behavior into signals and computation.', 'Quantum key distribution detects interception through measurement disturbance, with authentication and hardware security still required.'],
  },
]

export function getApplicationLesson(slug: string): InteractiveLesson | undefined {
  return APPLICATION_LESSON_CONTENT.find(lesson => lesson.slug === slug)
}
