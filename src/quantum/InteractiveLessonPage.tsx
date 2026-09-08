import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { ApplicationCanvas } from './ApplicationCanvas'
import { ApplicationScene } from './applicationLessons'
import { FoundationCanvas, sampleBands } from './FoundationCanvas'
import { FoundationScene } from './foundationLessons'
import { EntanglementCanvas } from './EntanglementCanvas'
import { EntanglementScene } from './entanglementLessons'
import { LanguageCanvas } from './LanguageCanvas'
import { LanguageScene } from './languageLessons'
import { MatterCanvas } from './MatterCanvas'
import { MatterScene } from './matterLessons'
import { getInteractiveLesson } from './interactiveLessons'
import { ConceptQuestion, InteractiveLesson } from './lessonTypes'
import { lessonPath } from './curriculum'
import { markLessonCompleted } from './progress'
import { AnswerState, useLessonSession } from './useLessonSession'
import { LessonVisual } from './LessonVisual'
import { AnswerOptions } from './AnswerOptions'
import './quantum.css'

const lessonDefaults: Record<string, { value: number; mode: string }> = {
  'classical-particles-and-waves': { value: 45, mode: 'particle' },
  'energy-comes-in-chunks': { value: 50, mode: 'continuous' },
  'light-becomes-photons': { value: 3, mode: 'stream' },
  'double-slit-experiment': { value: 0, mode: 'two' },
  'foundations-checkpoint': { value: 50, mode: 'map' },
  'the-wavefunction': { value: 50, mode: 'amplitude' },
  superposition: { value: 50, mode: 'z' },
  'measurement-and-collapse': { value: 50, mode: '0' },
  'uncertainty-principle': { value: 50, mode: 'position' },
  'states-bases-and-amplitudes': { value: 25, mode: 'z' },
  'schrodingers-equation': { value: 50, mode: 'free' },
  'particle-in-a-box': { value: 60, mode: 'box' },
  'quantum-tunneling': { value: 60, mode: 'barrier' },
  'atomic-orbitals': { value: 2, mode: 's' },
  spin: { value: 0, mode: 'z' },
  'identical-particles': { value: 4, mode: 'fermion' },
  'why-the-periodic-table-works': { value: 10, mode: 'shells' },
  'two-particle-states': { value: 70, mode: '00' },
  entanglement: { value: 100, mode: 'z' },
  'bells-experiment': { value: 50, mode: 'classical' },
  decoherence: { value: 35, mode: 'environment' },
  'schrodingers-cat': { value: 50, mode: 'system' },
  lasers: { value: 50, mode: 'pump' },
  semiconductors: { value: 50, mode: 'intrinsic' },
  'mri-and-quantum-sensors': { value: 55, mode: 'spin' },
  qubits: { value: 35, mode: 'bit' },
  'quantum-gates-and-circuits': { value: 0, mode: 'x' },
  'quantum-cryptography': { value: 50, mode: 'rectilinear' },
}

const controlDefaults: Record<string, number> = {
  'particle-speed': 45,
  'wave-frequency': 45,
  'energy-mode': 50,
  'energy-level': 2,
  spectrum: 2,
  brightness: 3,
  color: 45,
  photoelectric: 35,
  phase: 0,
  'packet-center': 50,
  'wave-phase': 0,
  'state-balance': 50,
  'superposition-phase': 0,
  'prepare-probability': 65,
  'uncertainty-width': 50,
  'wave-components': 5,
  'uncertainty-view': 50,
  'state-angle': 25,
  'amplitude-phase': 0,
  'evolution-speed': 50,
  'tunnel-energy': 45,
  'box-width': 60,
  'box-level': 2,
  'barrier-height': 70,
  'barrier-width': 45,
  'orbital-level': 2,
  'spin-axis': 50,
  'spin-angle': 25,
  occupancy: 4,
  'electron-count': 10,
  'subshell-fill': 4,
  'element-build': 10,
  'pair-correlation': 70,
  'entangle-strength': 80,
  'bell-angle': 50,
  'environment-strength': 30,
  'environment-size': 12,
  'decoherence-level': 50,
  'cat-trigger': 50,
  'cat-environment': 75,
  'pump-rate': 50,
  'inversion-level': 55,
  'band-gap': 50,
  'gate-voltage': 35,
  'magnetic-field': 55,
  'rf-frequency': 35,
  'qubit-angle': 35,
}

const controlModeDefaults: Record<string, string> = {
  'model-switch': 'particle',
  'energy-mode': 'continuous',
  'wave-view': 'amplitude',
  'basis-switch': 'z',
  'uncertainty-view': 'position',
  'basis-choice': 'z',
  'potential-shape': 'free',
  'equation-part': 'both',
  'orbital-shape': 's',
  'spin-measurement': 'z',
  'particle-kind': 'fermion',
  'statistics-mode': 'fermion',
  'pair-state': '00',
  'pair-axis': 'z',
  'bell-model': 'classical',
  'cat-view': 'system',
  'doping-type': 'intrinsic',
  'information-model': 'bit',
  'gate-choice': 'x',
  'circuit-sequence': 'hh',
  'qkd-basis': 'rectilinear',
}

function RangeControl({ label, value, min, max, onChange, low, high }: { label: string; value: number; min: number; max: number; onChange: (value: number) => void; low: string; high: string }) {
  return (
    <div className="qa-control-block">
      <div className="qa-control-label"><span>{label}</span><strong>{value}</strong></div>
      <input aria-label={label} type="range" min={min} max={max} value={value} onChange={event => onChange(Number(event.target.value))} />
      <div className="qa-range-labels"><span>{low}</span><span>{high}</span></div>
    </div>
  )
}

function Segmented({ label, value, options, onChange }: { label: string; value: string; options: { value: string; label: string; icon: string }[]; onChange: (value: string) => void }) {
  return (
    <div className="qa-segmented" role="group" aria-label={label}>
      {options.map(option => (
        <button key={option.value} aria-pressed={value === option.value} className={value === option.value ? 'active' : ''} onClick={() => onChange(option.value)}>
          <span aria-hidden="true">{option.icon}</span>{option.label}
        </button>
      ))}
    </div>
  )
}

function ChannelControl({ active, onChange }: { active: boolean; onChange: (active: boolean) => void }) {
  return (
    <button className={`qa-observer ${active ? 'active' : ''}`} onClick={() => onChange(!active)} aria-pressed={active}>
      <span className="qa-observer-icon" aria-hidden="true">{active ? '◉' : '○'}</span>
      <span><strong>{active ? 'Eve intercepts every photon' : 'Direct quantum channel'}</strong><small>{active ? 'Wrong-basis measurements add disturbance' : 'No interception simulated'}</small></span>
    </button>
  )
}

function QuestionBlock({ question, index, answer, answerState, onAnswer }: { question: ConceptQuestion; index: number; answer: number | undefined; answerState: AnswerState; onAnswer: (answer: number) => void }) {
  return (
    <section className="qa-question-block">
      <p className="qa-question-number">Case {index + 1}</p>
      <h2>{question.question}</h2>
      <AnswerOptions label={`Case ${index + 1} answers`} options={question.options} answer={answer} correct={question.correct} state={answerState} onAnswer={onAnswer} />
      {answerState === 'wrong' && <p className={`qa-question-feedback ${answer === question.correct ? 'qa-success' : ''}`}>{answer === question.correct ? question.success : 'Revisit this connection and try another answer.'}</p>}
    </section>
  )
}

function LessonControls({ lesson, control, value, mode, hits, active, pulse, answers, answerState, setValue, setMode, setHits, setActive, setPulse, setAnswers, setAnswerState, checkAnswers }: {
  lesson: InteractiveLesson
  control?: string
  value: number
  mode: string
  hits: number[]
  active: boolean
  pulse: number
  answers: Record<number, number>
  answerState: AnswerState
  setValue: (value: number) => void
  setMode: (mode: string) => void
  setHits: React.Dispatch<React.SetStateAction<number[]>>
  setActive: React.Dispatch<React.SetStateAction<boolean>>
  setPulse: React.Dispatch<React.SetStateAction<number>>
  setAnswers: React.Dispatch<React.SetStateAction<Record<number, number>>>
  setAnswerState: React.Dispatch<React.SetStateAction<AnswerState>>
  checkAnswers: () => void
}) {
  if (control === 'particle-speed') return <RangeControl label="Particle speed" value={value} min={10} max={100} onChange={setValue} low="Slow" high="Fast" />
  if (control === 'wave-frequency') return <RangeControl label="Wave frequency" value={value} min={10} max={100} onChange={setValue} low="Long rhythm" high="Rapid rhythm" />
  if (control === 'model-switch') return <Segmented label="Choose a classical model" value={mode} onChange={setMode} options={[{ value: 'particle', label: 'Particle', icon: '●' }, { value: 'wave', label: 'Wave', icon: '∿' }]} />

  if (control === 'energy-mode') return (
    <>
      <Segmented label="Choose an energy model" value={mode} onChange={setMode} options={[{ value: 'continuous', label: 'Classical ramp', icon: '╱' }, { value: 'quantum', label: 'Quantum steps', icon: '▥' }]} />
      <RangeControl label="Energy" value={value} min={0} max={100} onChange={setValue} low="Low" high="High" />
    </>
  )
  if (control === 'energy-level') return <RangeControl label="Allowed level" value={value} min={1} max={4} onChange={setValue} low="Ground state" high="Excited state" />
  if (control === 'spectrum') return (
    <>
      <RangeControl label="Excited level" value={value} min={1} max={3} onChange={setValue} low="Small jump" high="Large jump" />
      <button className="qa-primary" onClick={() => setPulse(current => current + 1)}>Release one photon →</button>
      <p className="qa-hint">{pulse ? `${pulse} emission${pulse === 1 ? '' : 's'} observed.` : 'Release a photon to reveal its spectral line.'}</p>
    </>
  )

  if (control === 'brightness') return <RangeControl label="Brightness" value={value} min={1} max={5} onChange={setValue} low="Few photons" high="Many photons" />
  if (control === 'color') return <RangeControl label="Photon color" value={value} min={0} max={100} onChange={setValue} low="Red / lower energy" high="Violet / higher energy" />
  if (control === 'photoelectric') return (
    <>
      <RangeControl label="Photon energy" value={value} min={0} max={100} onChange={setValue} low="Below threshold" high="Above threshold" />
      <button className="qa-primary" onClick={() => setPulse(current => current + 1)}>Fire photon →</button>
      <p className={`qa-hint ${pulse && value >= 55 ? 'qa-success' : ''}`}>{pulse ? value >= 55 ? 'An electron escaped the surface.' : 'No electron escaped. Raise the photon energy.' : 'Fire a photon at the metal.'}</p>
    </>
  )

  if (control === 'slit-count') return <Segmented label="Choose the number of openings" value={mode} onChange={setMode} options={[{ value: 'one', label: 'One slit', icon: 'Ⅰ' }, { value: 'two', label: 'Two slits', icon: 'Ⅱ' }]} />
  if (control === 'phase') return <RangeControl label="Relative phase" value={value} min={0} max={100} onChange={setValue} low="0°" high="360°" />
  if (control === 'detections') return (
    <>
      <div className="qa-action-row">
        <button className="qa-secondary" onClick={() => setHits(current => [...current, sampleBands(value)].slice(-300))}>Send one</button>
        <button className="qa-primary" onClick={() => setHits(current => [...current, ...Array.from({ length: 50 }, () => sampleBands(value))].slice(-300))}>Send 50</button>
        <button className="qa-icon-button" title="Reset detections" aria-label="Reset detections" onClick={() => setHits([])}>↺</button>
      </div>
      <p className={`qa-hint ${hits.length ? 'qa-success' : ''}`}>{hits.length ? `${hits.length} photon events recorded.` : 'Record at least one event to continue.'}</p>
    </>
  )
  if (control === 'which-path') return (
    <button className={`qa-observer ${active ? 'active' : ''}`} onClick={() => setActive(current => !current)} aria-pressed={active}>
      <span className="qa-observer-icon" aria-hidden="true">{active ? '◉' : '○'}</span>
      <span><strong>{active ? 'Path record stored' : 'No path record'}</strong><small>{active ? 'Interference removed' : 'Alternatives interfere'}</small></span>
    </button>
  )

  if (control === 'packet-center') return <RangeControl label="Packet center" value={value} min={0} max={100} onChange={setValue} low="Left" high="Right" />
  if (control === 'wave-view') return <Segmented label="Choose a wavefunction view" value={mode} onChange={setMode} options={[{ value: 'amplitude', label: 'Amplitude ψ', icon: '∿' }, { value: 'probability', label: 'Probability |ψ|²', icon: '▥' }]} />
  if (control === 'wave-phase') return <RangeControl label="Global phase" value={value} min={0} max={100} onChange={setValue} low="0°" high="360°" />
  if (control === 'state-balance') return <RangeControl label="Outcome 1 probability" value={value} min={0} max={100} onChange={setValue} low="All |0〉" high="All |1〉" />
  if (control === 'superposition-phase') return <RangeControl label="Relative phase" value={value} min={0} max={100} onChange={setValue} low="Reinforce" high="One full turn" />
  if (control === 'basis-switch') return <Segmented label="Choose a measurement basis" value={mode} onChange={setMode} options={[{ value: 'z', label: 'Z basis', icon: '↕' }, { value: 'x', label: 'X basis', icon: '↔' }]} />
  if (control === 'prepare-probability') return <RangeControl label="Probability of outcome 1" value={value} min={5} max={95} onChange={setValue} low="Mostly 0" high="Mostly 1" />
  if (control === 'measurement-lab') {
    const sample = () => Math.random() < value / 100 ? 1 : 0
    return (
      <>
        <div className="qa-action-row">
          <button className="qa-secondary" onClick={() => setHits(current => [...current, sample()].slice(-300))}>Measure once</button>
          <button className="qa-primary" onClick={() => setHits(current => [...current, ...Array.from({ length: 50 }, sample)].slice(-300))}>Measure 50</button>
          <button className="qa-icon-button" title="Reset measurements" aria-label="Reset measurements" onClick={() => setHits([])}>↺</button>
        </div>
        <p className={`qa-hint ${hits.length ? 'qa-success' : ''}`}>{hits.length ? `${hits.length} outcomes recorded.` : 'Record at least one outcome to continue.'}</p>
      </>
    )
  }
  if (control === 'collapse-lab') return (
    <>
      <div className="qa-action-row">
        <button className="qa-primary" onClick={() => { setMode(Math.random() < 0.5 ? '0' : '1'); setActive(true); setPulse(current => current + 1) }}>Measure state</button>
        <button className="qa-icon-button" title="Prepare the superposition again" aria-label="Prepare the superposition again" onClick={() => setActive(false)}>↺</button>
      </div>
      <p className={`qa-hint ${active ? 'qa-success' : ''}`}>{active ? `Outcome ${mode} recorded. The state now matches it.` : 'Measure the prepared superposition to continue.'}</p>
    </>
  )
  if (control === 'uncertainty-width') return <RangeControl label="Position width" value={value} min={5} max={95} onChange={setValue} low="Narrow position" high="Broad position" />
  if (control === 'wave-components') return <RangeControl label="Wave components" value={value} min={1} max={9} onChange={setValue} low="One wavelength" high="Many wavelengths" />
  if (control === 'uncertainty-view') return (
    <>
      <Segmented label="Choose a distribution" value={mode} onChange={setMode} options={[{ value: 'position', label: 'Position', icon: '⌖' }, { value: 'momentum', label: 'Momentum', icon: '→' }]} />
      <RangeControl label="Position width" value={value} min={5} max={95} onChange={setValue} low="Localized" high="Spread out" />
    </>
  )
  if (control === 'state-angle') return <RangeControl label="State angle" value={value} min={0} max={100} onChange={setValue} low="0°" high="360°" />
  if (control === 'basis-choice') return <Segmented label="Choose coordinates" value={mode} onChange={setMode} options={[{ value: 'z', label: 'Z basis', icon: '↕' }, { value: 'x', label: 'X basis', icon: '↔' }]} />
  if (control === 'amplitude-phase') return <RangeControl label="Relative phase" value={value} min={0} max={100} onChange={setValue} low="0°" high="360°" />
  if (control === 'potential-shape') return <Segmented label="Choose a potential" value={mode} onChange={setMode} options={[{ value: 'free', label: 'Free', icon: '—' }, { value: 'box', label: 'Box', icon: '□' }, { value: 'well', label: 'Well', icon: '⌣' }]} />
  if (control === 'evolution-speed') return <RangeControl label="Evolution speed" value={value} min={10} max={100} onChange={setValue} low="Slow" high="Fast" />
  if (control === 'equation-part') return <Segmented label="Inspect the Hamiltonian" value={mode} onChange={setMode} options={[{ value: 'kinetic', label: 'Kinetic', icon: '∿' }, { value: 'potential', label: 'Potential', icon: '⌖' }, { value: 'both', label: 'Together', icon: '+' }]} />
  if (control === 'tunnel-energy') return <RangeControl label="Packet energy" value={value} min={5} max={95} onChange={setValue} low="Below barrier" high="Above barrier" />

  if (control === 'box-width') return <RangeControl label="Box width" value={value} min={35} max={90} onChange={setValue} low="Tight confinement" high="Wide box" />
  if (control === 'box-level') return <RangeControl label="Quantum level" value={value} min={1} max={5} onChange={setValue} low="Ground state" high="Higher mode" />
  if (control === 'barrier-height') return <RangeControl label="Barrier height" value={value} min={20} max={95} onChange={setValue} low="Below energy" high="Classically forbidden" />
  if (control === 'barrier-width') {
    const transmission = Math.max(0.02, Math.exp(-(0.04 + value / 100 * 0.28) * 12) * 0.705)
    const sample = () => Math.random() < transmission ? 1 : 0
    const transmitted = hits.filter(hit => hit === 1).length
    return (
      <>
        <RangeControl label="Barrier width" value={value} min={10} max={90} onChange={next => { setValue(next); setHits([]) }} low="Thin" high="Thick" />
        <div className="qa-action-row">
          <button className="qa-primary" onClick={() => setHits(Array.from({ length: 100 }, sample))}>Send 100 particles</button>
          <button className="qa-icon-button" title="Reset tunneling trials" aria-label="Reset tunneling trials" onClick={() => setHits([])}>↺</button>
        </div>
        <p className={`qa-hint ${hits.length ? 'qa-success' : ''}`}>{hits.length ? `${transmitted} of ${hits.length} particles tunneled.` : 'Send a batch to test this barrier.'}</p>
      </>
    )
  }
  if (control === 'orbital-shape') return <Segmented label="Choose an orbital family" value={mode} onChange={setMode} options={[{ value: 's', label: 's orbital', icon: '●' }, { value: 'p', label: 'p orbital', icon: '∞' }, { value: 'd', label: 'd orbital', icon: '✣' }]} />
  if (control === 'orbital-level') return <RangeControl label="Orbital level" value={value} min={1} max={4} onChange={setValue} low="No radial node" high="More radial nodes" />
  if (control === 'orbital-sample') return (
    <>
      <div className="qa-action-row">
        <button className="qa-secondary" onClick={() => setHits(current => [...current, Math.random()].slice(-300))}>Sample one</button>
        <button className="qa-primary" onClick={() => setHits(current => [...current, ...Array.from({ length: 60 }, Math.random)].slice(-300))}>Sample 60</button>
        <button className="qa-icon-button" title="Reset orbital detections" aria-label="Reset orbital detections" onClick={() => setHits([])}>↺</button>
      </div>
      <p className={`qa-hint ${hits.length ? 'qa-success' : ''}`}>{hits.length ? `${hits.length} orbital detections recorded.` : 'Record detections to reveal the probability cloud.'}</p>
    </>
  )
  if (control === 'spin-axis') return <RangeControl label="Magnet axis" value={value} min={0} max={100} onChange={setValue} low="-90 degrees" high="+90 degrees" />
  if (control === 'spin-angle') return <RangeControl label="Spin state angle" value={value} min={0} max={100} onChange={setValue} low="Up" high="One full turn" />
  if (control === 'spin-measurement') {
    const sample = () => mode === 'z' ? 1 : Math.random() < 0.5 ? 1 : 0
    return (
      <>
        <Segmented label="Choose a spin measurement axis" value={mode} onChange={value => { setMode(value); setHits([]) }} options={[{ value: 'z', label: 'Z axis', icon: '↕' }, { value: 'x', label: 'X axis', icon: '↔' }]} />
        <div className="qa-action-row">
          <button className="qa-secondary" onClick={() => setHits(current => [...current, sample()].slice(-300))}>Measure once</button>
          <button className="qa-primary" onClick={() => setHits(current => [...current, ...Array.from({ length: 50 }, sample)].slice(-300))}>Measure 50</button>
          <button className="qa-icon-button" title="Reset spin outcomes" aria-label="Reset spin outcomes" onClick={() => setHits([])}>↺</button>
        </div>
        <p className={`qa-hint ${hits.length ? 'qa-success' : ''}`}>{hits.length ? `${hits.length} spin outcomes recorded along ${mode.toUpperCase()}.` : 'Measure the prepared spin to continue.'}</p>
      </>
    )
  }
  if (control === 'particle-kind') return <Segmented label="Choose an identical particle family" value={mode} onChange={setMode} options={[{ value: 'fermion', label: 'Fermion', icon: '−' }, { value: 'boson', label: 'Boson', icon: '+' }]} />
  if (control === 'occupancy') return <RangeControl label="Fermion count" value={value} min={1} max={8} onChange={setValue} low="One particle" high="Fill states" />
  if (control === 'statistics-mode') return <Segmented label="Compare quantum statistics" value={mode} onChange={setMode} options={[{ value: 'fermion', label: 'Fermions', icon: '▥' }, { value: 'boson', label: 'Bosons', icon: '◎' }]} />
  if (control === 'electron-count') return <RangeControl label="Electron count" value={value} min={1} max={18} onChange={setValue} low="Hydrogen" high="Argon" />
  if (control === 'subshell-fill') return <RangeControl label="p subshell electrons" value={value} min={1} max={6} onChange={setValue} low="Fill singly" high="Pair all" />
  if (control === 'element-build') return <RangeControl label="Atomic number" value={value} min={1} max={18} onChange={setValue} low="Hydrogen" high="Argon" />

  if (control === 'pair-state') return <Segmented label="Prepare a two-particle product state" value={mode} onChange={setMode} options={[{ value: '00', label: '00', icon: '|' }, { value: '01', label: '01', icon: '|' }, { value: '10', label: '10', icon: '|' }, { value: '11', label: '11', icon: '|' }]} />
  if (control === 'pair-correlation') return <RangeControl label="Pair correlation" value={value} min={0} max={100} onChange={setValue} low="Independent" high="Always matched" />
  if (control === 'correlation-sample') {
    const sample = () => {
      const matched = Math.random() < 0.5 + value / 200
      return matched ? Math.random() < 0.5 ? 0 : 3 : Math.random() < 0.5 ? 1 : 2
    }
    return (
      <>
        <div className="qa-action-row">
          <button className="qa-secondary" onClick={() => setHits(current => [...current, sample()].slice(-320))}>Measure pair</button>
          <button className="qa-primary" onClick={() => setHits(current => [...current, ...Array.from({ length: 80 }, sample)].slice(-320))}>Measure 80 pairs</button>
          <button className="qa-icon-button" title="Reset pair measurements" aria-label="Reset pair measurements" onClick={() => setHits([])}>↺</button>
        </div>
        <p className={`qa-hint ${hits.length ? 'qa-success' : ''}`}>{hits.length ? `${hits.length} joint outcomes recorded.` : 'Measure the pair to reconstruct its joint table.'}</p>
      </>
    )
  }
  if (control === 'entangle-strength') return <RangeControl label="Entanglement strength" value={value} min={0} max={100} onChange={setValue} low="Product state" high="Bell pair" />
  if (control === 'pair-axis') return <Segmented label="Choose a local measurement axis" value={mode} onChange={setMode} options={[{ value: 'z', label: 'Z axis', icon: '↕' }, { value: 'x', label: 'X axis', icon: '↔' }]} />
  if (control === 'entangled-sample') {
    const sample = () => Math.random() < 0.5 ? 0 : 3
    return (
      <>
        <Segmented label="Choose a shared measurement axis" value={mode} onChange={next => { setMode(next); setHits([]) }} options={[{ value: 'z', label: 'Z axis', icon: '↕' }, { value: 'x', label: 'X axis', icon: '↔' }]} />
        <div className="qa-action-row">
          <button className="qa-secondary" onClick={() => setHits(current => [...current, sample()].slice(-320))}>Measure pair</button>
          <button className="qa-primary" onClick={() => setHits(current => [...current, ...Array.from({ length: 80 }, sample)].slice(-320))}>Measure 80 pairs</button>
          <button className="qa-icon-button" title="Reset Bell-pair measurements" aria-label="Reset Bell-pair measurements" onClick={() => setHits([])}>↺</button>
        </div>
        <p className={`qa-hint ${hits.length ? 'qa-success' : ''}`}>{hits.length ? `${hits.length} Bell-pair outcomes compared.` : 'Measure both particles along the same axis.'}</p>
      </>
    )
  }
  if (control === 'bell-model') return <Segmented label="Choose a Bell-game model" value={mode} onChange={setMode} options={[{ value: 'classical', label: 'Local cards', icon: '▤' }, { value: 'quantum', label: 'Bell pair', icon: '∞' }]} />
  if (control === 'bell-angle') return <RangeControl label="Detector angle" value={value} min={0} max={100} onChange={setValue} low="Same axis" high="90 degrees" />
  if (control === 'bell-run') {
    const winProbability = mode === 'quantum' ? Math.cos(Math.PI / 8) ** 2 : 0.75
    const sample = () => Math.random() < winProbability ? 1 : 0
    return (
      <>
        <Segmented label="Choose a Bell-game strategy" value={mode} onChange={next => { setMode(next); setHits([]) }} options={[{ value: 'classical', label: 'Local cards', icon: '▤' }, { value: 'quantum', label: 'Bell pair', icon: '∞' }]} />
        <div className="qa-action-row">
          <button className="qa-primary" onClick={() => setHits(Array.from({ length: 200 }, sample))}>Run 200 trials</button>
          <button className="qa-icon-button" title="Reset Bell trials" aria-label="Reset Bell trials" onClick={() => setHits([])}>↺</button>
        </div>
        <p className={`qa-hint ${hits.length ? 'qa-success' : ''}`}>{hits.length ? `${hits.filter(hit => hit === 1).length} of ${hits.length} Bell-game trials won.` : 'Run the game to compare its score with the local limit.'}</p>
      </>
    )
  }
  if (control === 'environment-strength') return <RangeControl label="Environmental coupling" value={value} min={0} max={100} onChange={setValue} low="Isolated" high="Strongly coupled" />
  if (control === 'environment-size') return <RangeControl label="Environment records" value={value} min={1} max={24} onChange={setValue} low="One record" high="Many records" />
  if (control === 'decoherence-level') return <RangeControl label="Decoherence level" value={value} min={0} max={100} onChange={setValue} low="Visible fringes" high="Classical-looking mixture" />
  if (control === 'cat-trigger') return <RangeControl label="Decay probability" value={value} min={0} max={100} onChange={setValue} low="No decay" high="Certain decay" />
  if (control === 'cat-view') return <Segmented label="Choose a cat experiment view" value={mode} onChange={setMode} options={[{ value: 'system', label: 'Apparatus', icon: '→' }, { value: 'branches', label: 'Branches', icon: '⑂' }]} />
  if (control === 'cat-environment') return <RangeControl label="Environmental contact" value={value} min={0} max={100} onChange={setValue} low="Ideal isolation" high="Everyday world" />

  if (control === 'pump-rate') return <RangeControl label="Pump rate" value={value} min={0} max={100} onChange={setValue} low="No pumping" high="Strong pumping" />
  if (control === 'inversion-level') return <RangeControl label="Excited population" value={value} min={0} max={100} onChange={setValue} low="Absorption dominates" high="Strong inversion" />
  if (control === 'laser-seed') return (
    <>
      <div className="qa-action-row">
        <button className="qa-primary" onClick={() => setPulse(current => current + 1)}>Release seed photon →</button>
        <button className="qa-icon-button" title="Reset laser cavity" aria-label="Reset laser cavity" onClick={() => setPulse(0)}>↺</button>
      </div>
      <p className={`qa-hint ${pulse ? 'qa-success' : ''}`}>{pulse ? `${Math.min(18, 3 + pulse * 3)} photons now reinforce the selected mode.` : 'Seed the inverted gain material to begin amplification.'}</p>
    </>
  )
  if (control === 'band-gap') return <RangeControl label="Band gap" value={value} min={10} max={90} onChange={setValue} low="Narrow gap" high="Wide gap" />
  if (control === 'doping-type') return <Segmented label="Choose semiconductor doping" value={mode} onChange={setMode} options={[{ value: 'intrinsic', label: 'Intrinsic', icon: '◇' }, { value: 'n', label: 'n-type', icon: '−' }, { value: 'p', label: 'p-type', icon: '+' }]} />
  if (control === 'gate-voltage') return <RangeControl label="Gate voltage" value={value} min={0} max={100} onChange={setValue} low="Channel off" high="Channel on" />
  if (control === 'magnetic-field') return <RangeControl label="Magnetic field" value={value} min={0} max={100} onChange={setValue} low="Weak field" high="Strong field" />
  if (control === 'rf-frequency') return <RangeControl label="Radio frequency" value={value} min={0} max={100} onChange={setValue} low="Below resonance" high="Above resonance" />
  if (control === 'mri-pulse') return (
    <>
      <div className="qa-action-row">
        <button className="qa-primary" onClick={() => setPulse(current => current + 1)}>Excite sample →</button>
        <button className="qa-icon-button" title="Reset MRI signal" aria-label="Reset MRI signal" onClick={() => setPulse(0)}>↺</button>
      </div>
      <p className={`qa-hint ${pulse ? 'qa-success' : ''}`}>{pulse ? `Signal acquisition ${pulse} recorded.` : 'Apply a radio-frequency pulse to create transverse magnetization.'}</p>
    </>
  )
  if (control === 'information-model') return <Segmented label="Compare information carriers" value={mode} onChange={setMode} options={[{ value: 'bit', label: 'Classical bit', icon: '0' }, { value: 'qubit', label: 'Qubit', icon: 'ψ' }]} />
  if (control === 'qubit-angle') return <RangeControl label="Qubit rotation" value={value} min={0} max={100} onChange={setValue} low="State |0>" high="State |1>" />
  if (control === 'qubit-sample') {
    const probabilityOne = Math.sin(value / 100 * Math.PI / 2) ** 2
    const sample = () => Math.random() < probabilityOne ? 1 : 0
    return (
      <>
        <dl className="qa-result-comparison" aria-label="Prepared qubit probabilities">
          <div><dt>Expected 0</dt><dd>{Math.round((1 - probabilityOne) * 100)}%</dd>{hits.length > 0 && <small>Observed {hits.filter(hit => hit === 0).length} / {hits.length}</small>}</div>
          <div><dt>Expected 1</dt><dd>{Math.round(probabilityOne * 100)}%</dd>{hits.length > 0 && <small>Observed {hits.filter(hit => hit === 1).length} / {hits.length}</small>}</div>
        </dl>
        <div className="qa-action-row">
          <button className="qa-secondary" onClick={() => setHits(current => [...current, sample()].slice(-400))}>Measure once</button>
          <button className="qa-primary" onClick={() => setHits(current => [...current, ...Array.from({ length: 100 }, sample)].slice(-400))}>Measure 100 qubits</button>
          <button className="qa-icon-button" title="Reset qubit measurements" aria-label="Reset qubit measurements" onClick={() => setHits([])}>↺</button>
        </div>
        <p className={`qa-hint ${hits.length ? 'qa-success' : ''}`}>{hits.length ? `${hits.length} qubit measurements recorded.` : 'Measure repeated preparations to reveal their probabilities.'}</p>
      </>
    )
  }
  if (control === 'gate-choice') return <Segmented label="Apply a quantum gate" value={mode} onChange={setMode} options={[{ value: 'x', label: 'X gate', icon: 'X' }, { value: 'h', label: 'H gate', icon: 'H' }, { value: 'z', label: 'Z gate', icon: 'Z' }]} />
  if (control === 'circuit-sequence') return <Segmented label="Choose an interference circuit" value={mode} onChange={setMode} options={[{ value: 'hh', label: 'H-H', icon: '0' }, { value: 'hzh', label: 'H-Z-H', icon: '1' }]} />
  if (control === 'circuit-run') {
    const sample = () => mode === 'hzh' ? 1 : 0
    return (
      <>
        <Segmented label="Choose a circuit to run" value={mode} onChange={next => { setMode(next); setHits([]) }} options={[{ value: 'hh', label: 'H-H', icon: '0' }, { value: 'hzh', label: 'H-Z-H', icon: '1' }]} />
        <div className="qa-action-row">
          <button className="qa-primary" onClick={() => setHits(Array.from({ length: 100 }, sample))}>Run 100 shots</button>
          <button className="qa-icon-button" title="Reset circuit shots" aria-label="Reset circuit shots" onClick={() => setHits([])}>↺</button>
        </div>
        <p className={`qa-hint ${hits.length ? 'qa-success' : ''}`}>{hits.length ? `${hits.length} circuit shots recorded.` : 'Run the circuit to expose its final interference result.'}</p>
      </>
    )
  }
  if (control === 'qkd-basis') return <Segmented label="Choose a BB84 preparation basis" value={mode} onChange={setMode} options={[{ value: 'rectilinear', label: 'Rectilinear', icon: '+' }, { value: 'diagonal', label: 'Diagonal', icon: '×' }]} />
  if (control === 'eavesdropper') return <ChannelControl active={active} onChange={setActive} />
  if (control === 'qkd-run') {
    const errorProbability = active ? 0.25 : 0.02
    const sample = () => Math.random() < errorProbability ? 1 : 0
    const errors = hits.filter(hit => hit === 1).length
    return (
      <>
        <ChannelControl active={active} onChange={next => { setActive(next); setHits([]) }} />
        <div className="qa-action-row">
          <button className="qa-primary" onClick={() => setHits(Array.from({ length: 120 }, sample))}>Compare 120 test bits</button>
          <button className="qa-icon-button" title="Reset key transmission" aria-label="Reset key transmission" onClick={() => setHits([])}>↺</button>
        </div>
        <p className={`qa-hint ${hits.length && errors / hits.length <= 0.11 ? 'qa-success' : ''}`} aria-live="polite">{hits.length ? `${errors} errors found in ${hits.length} test bits.` : `${active ? 'Eve is active.' : 'The channel has 2% background noise.'} Compare a public sample.`}</p>
      </>
    )
  }

  if (control === 'check' || control === 'checkpoint') {
    return (
      <div className="qa-check-stack">
        {lesson.questions.map((question, index) => (
          <QuestionBlock key={question.question} question={question} index={index} answer={answers[index]} answerState={answerState} onAnswer={answer => { setAnswers(current => ({ ...current, [index]: answer })); setAnswerState('idle') }} />
        ))}
        <button className="qa-primary" disabled={Object.keys(answers).length !== lesson.questions.length} onClick={checkAnswers}>Check model →</button>
        <div className={`qa-feedback-panel ${answerState}`} aria-live="polite">
          {answerState === 'wrong' && <p>One connection is still off. Revisit the evidence and try again.</p>}
          {answerState === 'correct' && lesson.questions.map(question => <p key={question.success}><span aria-hidden="true">✓</span>{question.success}</p>)}
        </div>
      </div>
    )
  }
  return null
}

export function InteractiveLessonPage() {
  const { lessonSlug = '' } = useParams()
  const lesson = getInteractiveLesson(lessonSlug)
  return lesson ? <LessonPlayer key={lesson.slug} lesson={lesson} /> : <Navigate to="/" replace />
}

function LessonPlayer({ lesson }: { lesson: InteractiveLesson }) {
  const navigate = useNavigate()
  const defaults = lessonDefaults[lesson.slug] ?? { value: 50, mode: 'particle' }
  const { step, value, mode, hits, active, pulse, answers, answerState, setValue, setMode, setHits, setActive, setPulse, setAnswers, setAnswerState, goTo } = useLessonSession(lesson, defaults, controlDefaults, controlModeDefaults)

  const currentStep = Math.min(step, lesson.steps.length - 1)
  const current = lesson.steps[currentStep]
  const isCheck = current.control === 'check' || current.control === 'checkpoint'
  const evidenceControls = ['detections', 'measurement-lab', 'barrier-width', 'orbital-sample', 'spin-measurement', 'correlation-sample', 'entangled-sample', 'bell-run', 'qubit-sample', 'circuit-run', 'qkd-run']
  const pulseControls = ['spectrum', 'photoelectric', 'laser-seed', 'mri-pulse']
  const canContinue = evidenceControls.includes(current.control ?? '') ? hits.length > 0 : current.control === 'collapse-lab' ? active : pulseControls.includes(current.control ?? '') ? pulse > 0 : isCheck ? answerState === 'correct' : true

  const checkAnswers = () => {
    const correct = lesson.questions.every((question, index) => answers[index] === question.correct)
    setAnswerState(correct ? 'correct' : 'wrong')
    if (correct) markLessonCompleted(lesson.slug)
  }

  const previous = () => goTo(step - 1)
  const next = () => {
    if (canContinue) goTo(step + 1)
  }

  return (
    <div className="qa-player" style={{ '--qa-lesson-accent': lesson.accent } as React.CSSProperties}>
      <header className="qa-player-header">
        <Link className="qa-icon-button qa-quiet" title="Close lesson" aria-label="Close lesson" to="/">×</Link>
        <button className="qa-icon-button qa-quiet" title="Previous step" aria-label="Previous step" disabled={step === 0} onClick={previous}>←</button>
        <div className="qa-step-rail" style={{ gridTemplateColumns: `repeat(${lesson.steps.length}, 1fr)` }} aria-label={`Step ${currentStep + 1} of ${lesson.steps.length}`}>
          {lesson.steps.map((item, index) => <span key={item.label} className={index < currentStep ? 'done' : index === currentStep ? 'current' : ''} title={item.label} />)}
        </div>
        <div className="qa-discovery-count" title={`Course lesson ${lesson.number}`}><span aria-hidden="true">◆</span><strong>{lesson.number}</strong></div>
      </header>

      <main className="qa-player-main">
        <LessonVisual label={current.label}>
          {lesson.canvas === 'application'
            ? <ApplicationCanvas scene={current.scene as ApplicationScene} value={value} mode={mode} hits={hits} active={active} pulse={pulse} accent={lesson.accent} />
            : lesson.canvas === 'entanglement'
              ? <EntanglementCanvas scene={current.scene as EntanglementScene} value={value} mode={mode} hits={hits} active={active} pulse={pulse} accent={lesson.accent} />
              : lesson.canvas === 'matter'
                ? <MatterCanvas scene={current.scene as MatterScene} value={value} mode={mode} hits={hits} active={active} pulse={pulse} accent={lesson.accent} />
                : lesson.canvas === 'language'
                  ? <LanguageCanvas scene={current.scene as LanguageScene} value={value} mode={mode} hits={hits} active={active} pulse={pulse} accent={lesson.accent} />
                  : <FoundationCanvas scene={current.scene as FoundationScene} value={value} mode={mode} hits={hits} active={active} pulse={pulse} accent={lesson.accent} />}
        </LessonVisual>
        <section className="qa-lesson-copy">
          <div className="qa-copy-inner">
            <p className="qa-lesson-kicker">{lesson.stageLabel ?? 'Foundation'} {String(lesson.number).padStart(2, '0')} · {lesson.minutes} min</p>
            <p className="qa-eyebrow">{current.eyebrow}</p>
            <h1>{current.title}</h1>
            <p className="qa-lesson-lede">{current.lede}</p>
            <p>{current.body}</p>
            {current.modelNote && <details className="qa-model-note"><summary>About this model</summary><p>{current.modelNote}</p>{current.source && <a href={current.source.url} target="_blank" rel="noreferrer">{current.source.title}</a>}</details>}
            {currentStep === lesson.steps.length - 1 ? (
              <>
                <div className="qa-takeaways">
                  {lesson.takeaways.map(takeaway => <div key={takeaway}><span>✓</span><p>{takeaway}</p></div>)}
                </div>
                <div className="qa-complete-actions">
                  {lesson.nextSlug ? <button className="qa-primary" onClick={() => navigate(lessonPath(lesson.nextSlug!))}>Start next lesson →</button> : <button className="qa-primary" onClick={() => navigate('/')}>Return to course map →</button>}
                  <Link to="/" className="qa-text-link">Course map</Link>
                </div>
              </>
            ) : (
              <LessonControls lesson={lesson} control={current.control} value={value} mode={mode} hits={hits} active={active} pulse={pulse} answers={answers} answerState={answerState} setValue={setValue} setMode={setMode} setHits={setHits} setActive={setActive} setPulse={setPulse} setAnswers={setAnswers} setAnswerState={setAnswerState} checkAnswers={checkAnswers} />
            )}
          </div>
          {currentStep < lesson.steps.length - 1 && <div className="qa-lesson-nav"><span>{currentStep + 1}/{lesson.steps.length - 1}</span><button className="qa-primary" disabled={!canContinue} onClick={next}>{isCheck ? 'See summary' : 'Continue'} →</button></div>}
        </section>
      </main>
    </div>
  )
}
