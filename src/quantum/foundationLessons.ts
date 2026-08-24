export type FoundationScene =
  | 'particle-motion'
  | 'wave-motion'
  | 'models-meet'
  | 'model-check'
  | 'energy-ramp'
  | 'energy-levels'
  | 'spectrum'
  | 'energy-check'
  | 'photon-stream'
  | 'photon-color'
  | 'photoelectric'
  | 'photon-check'
  | 'slit-builder'
  | 'slit-waves'
  | 'slit-detections'
  | 'which-path'
  | 'slit-check'
  | 'foundation-map'
  | 'foundation-check'
  | 'stage-complete'

export interface ConceptQuestion {
  question: string
  options: string[]
  correct: number
  success: string
}

export interface FoundationStep {
  label: string
  eyebrow: string
  title: string
  lede: string
  body: string
  scene: FoundationScene
  control?: 'particle-speed' | 'wave-frequency' | 'model-switch' | 'energy-mode' | 'energy-level' | 'spectrum' | 'brightness' | 'color' | 'photoelectric' | 'slit-count' | 'phase' | 'detections' | 'which-path' | 'check' | 'checkpoint'
}

export interface FoundationLesson {
  slug: string
  title: string
  number: number
  minutes: number
  accent: string
  steps: FoundationStep[]
  questions: ConceptQuestion[]
  takeaways: string[]
  nextSlug?: string
}

export const FOUNDATION_LESSON_CONTENT: FoundationLesson[] = [
  {
    slug: 'classical-particles-and-waves',
    title: 'Classical particles and waves',
    number: 2,
    minutes: 7,
    accent: '#22d3ee',
    nextSlug: 'energy-comes-in-chunks',
    steps: [
      {
        label: 'Particles', eyebrow: 'Classical model 1', title: 'A particle carries its story along one path',
        lede: 'A classical particle is localized: at each moment it has a place and a direction of motion.',
        body: 'Change its speed. The dot moves faster, but it remains one object following one continuous trajectory. That makes collisions and detector clicks easy to picture.',
        scene: 'particle-motion', control: 'particle-speed',
      },
      {
        label: 'Waves', eyebrow: 'Classical model 2', title: 'A wave spreads the story across space',
        lede: 'A classical wave is a distributed disturbance. Many places can move at the same time.',
        body: 'Change the frequency. Crests pass more often, while the disturbance remains spread out. Waves can overlap, reinforce, and cancel without becoming little pellets.',
        scene: 'wave-motion', control: 'wave-frequency',
      },
      {
        label: 'Compare', eyebrow: 'Put the models to work', title: 'Each model predicts a different kind of evidence',
        lede: 'Particles make localized impacts. Waves make interference patterns. Quantum experiments show both kinds of evidence.',
        body: 'Switch models at the barrier. Watch how a particle chooses one opening while a wave passes through both and combines on the far side.',
        scene: 'models-meet', control: 'model-switch',
      },
      {
        label: 'Check', eyebrow: 'Concept check', title: 'Which classical picture is enough?',
        lede: 'Choose the statement that survives the experiments.',
        body: 'The goal is not to pick a winner. It is to notice where both familiar pictures stop being complete descriptions.',
        scene: 'model-check', control: 'check',
      },
      {
        label: 'Complete', eyebrow: 'Lesson complete', title: 'Two models, one important limitation',
        lede: 'You can now use particle and wave pictures without mistaking either one for the whole quantum story.',
        body: 'Quantum theory keeps the localized event and the spread-out pattern, then replaces the classical pictures with a state that predicts both.',
        scene: 'stage-complete',
      },
    ],
    questions: [{
      question: 'Why do physicists need more than one classical picture for light and electrons?',
      options: ['They physically change from solid objects into water waves.', 'Different experiments reveal localized detections and distributed interference.', 'The correct picture depends only on which one is easier to draw.'],
      correct: 1,
      success: 'Right. The evidence contains particle-like events and wave-like patterns, so neither classical model is complete by itself.',
    }],
    takeaways: ['Particles are localized and follow one classical path.', 'Waves are distributed and can reinforce or cancel.', 'Quantum states predict both localized events and interference patterns.'],
  },
  {
    slug: 'energy-comes-in-chunks',
    title: 'Energy comes in chunks',
    number: 3,
    minutes: 8,
    accent: '#fbbf24',
    nextSlug: 'light-becomes-photons',
    steps: [
      {
        label: 'Ramp', eyebrow: 'Continuous or discrete?', title: 'Classical energy looks like a ramp',
        lede: 'In everyday mechanics, an object can usually carry any amount of energy you choose.',
        body: 'Move the control slowly. In the classical picture every in-between value is allowed. Turn on the quantum picture and the ramp becomes a staircase of permitted levels.',
        scene: 'energy-ramp', control: 'energy-mode',
      },
      {
        label: 'Levels', eyebrow: 'Inside a bound system', title: 'An atom can stand only on certain steps',
        lede: 'A bound electron does not occupy an arbitrary energy. It belongs to one of the atom’s allowed states.',
        body: 'Choose a level. The spacing is a property of the system, much like the permitted notes of a fixed guitar string.',
        scene: 'energy-levels', control: 'energy-level',
      },
      {
        label: 'Jump', eyebrow: 'A quantum is exchanged', title: 'A jump releases one exact packet',
        lede: 'When the atom drops between levels, the missing energy leaves as one photon.',
        body: 'Excite the atom, then let it fall. Different jumps create different colors, which is why each element has a distinctive spectral fingerprint.',
        scene: 'spectrum', control: 'spectrum',
      },
      {
        label: 'Check', eyebrow: 'Concept check', title: 'What does quantized mean?',
        lede: 'Choose the description that matches an atom’s energy.',
        body: 'Quantization does not mean that everything is visibly jerky. It means a particular system has a discrete set of allowed outcomes.',
        scene: 'energy-check', control: 'check',
      },
      {
        label: 'Complete', eyebrow: 'Lesson complete', title: 'The ramp has become a staircase',
        lede: 'You can now recognize a quantum as one permitted packet exchanged between discrete states.',
        body: 'This one idea explains atomic spectra and prepares the way for photons, lasers, chemistry, and much more.',
        scene: 'stage-complete',
      },
    ],
    questions: [{
      question: 'For an electron bound in an atom, quantized energy means:',
      options: ['Only particular energy levels are allowed.', 'Its energy must always be zero.', 'Every energy is allowed, but instruments round the result.'],
      correct: 0,
      success: 'Exactly. The atom offers a ladder of allowed states, and transitions exchange the energy difference.',
    }],
    takeaways: ['Classical systems often allow a continuous range of energies.', 'Bound quantum systems have specific allowed energy levels.', 'Transitions exchange the exact energy difference as a quantum.'],
  },
  {
    slug: 'light-becomes-photons',
    title: 'Light becomes photons',
    number: 4,
    minutes: 7,
    accent: '#fb7185',
    nextSlug: 'double-slit-experiment',
    steps: [
      {
        label: 'Packets', eyebrow: 'One click at a time', title: 'A dim light still arrives in whole detections',
        lede: 'Lowering brightness reduces how often photons arrive, not the fraction of a detector click.',
        body: 'Change the brightness. Every moving packet can produce one localized detection; brighter light simply sends more packets during the same interval.',
        scene: 'photon-stream', control: 'brightness',
      },
      {
        label: 'Color', eyebrow: 'Energy per photon', title: 'Color changes the packet, not just the paint',
        lede: 'Higher-frequency light carries more energy in each photon. Brightness controls the number of photons.',
        body: 'Move from red toward violet. The photons become more energetic even if their arrival rate stays fixed. Color and brightness are two different controls.',
        scene: 'photon-color', control: 'color',
      },
      {
        label: 'Threshold', eyebrow: 'Photoelectric experiment', title: 'Enough photons are not always enough',
        lede: 'Electrons leave a metal only when each photon carries enough energy to cross the material’s threshold.',
        body: 'Tune the photon energy and fire it at the surface. Below threshold, making the beam brighter adds more insufficient photons; above threshold, electrons escape.',
        scene: 'photoelectric', control: 'photoelectric',
      },
      {
        label: 'Check', eyebrow: 'Concept check', title: 'Brightness or color?',
        lede: 'Separate the number of photons from the energy carried by each one.',
        body: 'This distinction resolves the photoelectric effect and gives the photon idea real predictive power.',
        scene: 'photon-check', control: 'check',
      },
      {
        label: 'Complete', eyebrow: 'Lesson complete', title: 'Light now has a packet count',
        lede: 'You can treat brightness as photon traffic and color as energy per photon.',
        body: 'Photons still produce wave-like interference, so the packet model is another part of the quantum story, not a return to ordinary particles.',
        scene: 'stage-complete',
      },
    ],
    questions: [{
      question: 'What happens when you brighten red light that is below a metal’s emission threshold?',
      options: ['Each red photon gains enough energy to eject an electron.', 'More low-energy photons arrive, but individual photons remain below threshold.', 'The light automatically changes to violet.'],
      correct: 1,
      success: 'Correct. Brightness changes photon traffic; frequency determines the energy of each photon.',
    }],
    takeaways: ['Light is detected in whole photon events.', 'Brightness changes photon rate; color changes energy per photon.', 'The photoelectric threshold depends on individual photon energy.'],
  },
  {
    slug: 'double-slit-experiment',
    title: 'The double-slit experiment',
    number: 5,
    minutes: 10,
    accent: '#a78bfa',
    nextSlug: 'foundations-checkpoint',
    steps: [
      {
        label: 'Build', eyebrow: 'Assemble the experiment', title: 'Source, openings, screen',
        lede: 'The apparatus is simple enough to draw in one line, but it exposes the central quantum puzzle.',
        body: 'Switch between one slit and two. A source sends identical photons toward openings; a screen records where each one arrives.',
        scene: 'slit-builder', control: 'slit-count',
      },
      {
        label: 'Paths', eyebrow: 'Combine alternatives', title: 'Two paths carry phase',
        lede: 'The alternatives reach the same point with phases that can reinforce or cancel.',
        body: 'Shift their relative phase. Bright locations become dark and dark locations become bright. Quantum amplitudes combine before probabilities are calculated.',
        scene: 'slit-waves', control: 'phase',
      },
      {
        label: 'Dots', eyebrow: 'Build the pattern', title: 'The interference pattern arrives as particles',
        lede: 'Each photon makes one dot. Many unpredictable dots reveal a stable interference distribution.',
        body: 'Send photons in batches. The pattern is not painted by a continuous smear; it accumulates event by event.',
        scene: 'slit-detections', control: 'detections',
      },
      {
        label: 'Observe', eyebrow: 'Which path?', title: 'Path information changes what can interfere',
        lede: 'A detector that records the chosen slit makes the two alternatives distinguishable.',
        body: 'Toggle the path detector. When the alternatives leave different records, their interference disappears even if nobody watches the data live.',
        scene: 'which-path', control: 'which-path',
      },
      {
        label: 'Check', eyebrow: 'Concept check', title: 'What destroys the bands?',
        lede: 'Choose the physical explanation, not the story about human attention.',
        body: 'Measurement matters because it is an interaction that stores information in the world.',
        scene: 'slit-check', control: 'check',
      },
      {
        label: 'Complete', eyebrow: 'Lesson complete', title: 'One experiment, the whole foundation',
        lede: 'Discrete events, wave-like amplitudes, probability, and measurement now fit into one apparatus.',
        body: 'The double slit is not a mystical exception. It is a compact demonstration of the rules every quantum system follows.',
        scene: 'stage-complete',
      },
    ],
    questions: [{
      question: 'Why does a working which-path detector remove the interference pattern?',
      options: ['It stores information that distinguishes the alternatives.', 'A person’s awareness pushes the photons aside.', 'It closes both slits and blocks all photons.'],
      correct: 0,
      success: 'Exactly. Distinguishable alternatives no longer combine into the same interference pattern.',
    }],
    takeaways: ['Amplitudes from alternative paths combine before probabilities.', 'Single events are random while their distribution is predictable.', 'Physical path information removes interference by making alternatives distinguishable.'],
  },
  {
    slug: 'foundations-checkpoint',
    title: 'Foundations checkpoint',
    number: 6,
    minutes: 6,
    accent: '#34d399',
    steps: [
      {
        label: 'Connect', eyebrow: 'Build the model', title: 'Four clues point to one new framework',
        lede: 'Localized events, interference, discrete energy, and measurement are not separate curiosities.',
        body: 'Follow the animated links. A quantum state carries amplitudes, those amplitudes predict probabilities, and measurement produces one recorded outcome.',
        scene: 'foundation-map',
      },
      {
        label: 'Challenge', eyebrow: 'Foundations checkpoint', title: 'Can your model explain the evidence?',
        lede: 'Solve three short cases. Each one tests a different connection across the stage.',
        body: 'Choose one answer for every case, then check the whole model at once.',
        scene: 'foundation-check', control: 'checkpoint',
      },
      {
        label: 'Complete', eyebrow: 'Stage 1 complete', title: 'You have left the classical world',
        lede: 'You now have the conceptual foundation needed to learn the quantum language precisely.',
        body: 'The next stage will turn these clues into states, amplitudes, superposition, measurement, uncertainty, and the Schrodinger equation.',
        scene: 'stage-complete',
      },
    ],
    questions: [
      {
        question: 'A detector records one dot at a time, but many dots form interference bands. What combines?',
        options: ['The recorded dots after they arrive', 'The amplitudes for alternative paths', 'Tiny classical waves emitted by the detector'],
        correct: 1,
        success: 'Alternative amplitudes combine; each measurement still records one event.',
      },
      {
        question: 'An atom emits only a few sharp colors. What is the strongest clue?',
        options: ['Its allowed energies are discrete', 'The atom is too small to contain color', 'Every electron has the same classical orbit'],
        correct: 0,
        success: 'Sharp spectral lines reveal transitions between specific energy levels.',
      },
      {
        question: 'Which action removes double-slit interference?',
        options: ['Lowering brightness to one photon at a time', 'Storing reliable which-path information', 'Moving the screen farther away'],
        correct: 1,
        success: 'Path information makes the alternatives distinguishable, so their amplitudes no longer interfere.',
      },
    ],
    takeaways: ['A quantum state encodes amplitudes for possible outcomes.', 'Discrete energy exchanges appear as photons and spectral lines.', 'Measurement records one event and can change which alternatives interfere.'],
  },
]

export function getFoundationLesson(slug: string): FoundationLesson | undefined {
  return FOUNDATION_LESSON_CONTENT.find(lesson => lesson.slug === slug)
}
