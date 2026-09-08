import { Dispatch, SetStateAction } from 'react'
import { RotateCcw } from 'lucide-react'
import { boxEnergy, gateSequence, inner, interference, jointProbabilities, measurementSequence, observableProbabilities, realQubit, sampleOutcome, ZERO } from './mathModels'

type Props = {
  control: string; value: number; mode: string; hits: number[];
  setValue: (value: number) => void; setMode: (mode: string) => void;
  setHits: Dispatch<SetStateAction<number[]>>;
}

export function MathLessonControls({ control, value, mode, hits, setValue, setMode, setHits }: Props) {
  const changeValue = (next: number) => { setValue(next); setHits([]) }
  const changeMode = (next: string) => { setMode(next); setHits([]) }
  const range = (label: string, min: number, max: number, low: string, high: string, display = String(value)) => (
    <div className="qa-control-block">
      <div className="qa-control-label"><span>{label}</span><strong>{display}</strong></div>
      <input type="range" aria-label={label} min={min} max={max} value={value} onChange={event => changeValue(Number(event.target.value))} />
      <div className="qa-range-labels"><span>{low}</span><span>{high}</span></div>
    </div>
  )
  const choices = (label: string, options: [string, string][]) => (
    <div className="qa-segmented" role="group" aria-label={label}>
      {options.map(([id, text]) => <button key={id} aria-pressed={mode === id} className={mode === id ? 'active' : ''} onClick={() => changeMode(id)}>{text}</button>)}
    </div>
  )
  const levelInput = (label: string, min: number, max: number) => (
    <label className="qa-math-number">{label}<input aria-label={label} type="number" min={min} max={max} step={1} value={mode} onChange={event => {
      const next = Number(event.target.value)
      if (Number.isInteger(next) && next >= min && next <= max) changeMode(String(next))
    }} /></label>
  )
  const stats = (weights: number[], labels: string[]) => (
    <dl className="qa-math-stats">
      {weights.map((weight, index) => <div key={labels[index]}><dt>Predicted {labels[index]}</dt><dd>{Math.round(weight * 100)}%</dd>{hits.length > 0 && <small>Observed<br />{hits.filter(hit => hit === index).length} / {hits.length}</small>}</div>)}
    </dl>
  )
  const sample = (weights: number[], labels: string[]) => <>
    {stats(weights, labels)}
    <div className="qa-action-row">
      <button className="qa-secondary" onClick={() => setHits(current => [...current, sampleOutcome(weights)].slice(-400))}>Measure one</button>
      <button className="qa-primary" onClick={() => setHits(Array.from({ length: 100 }, () => sampleOutcome(weights)))}>Measure 100 trials</button>
      <button className="qa-icon-button" title="Reset trials" aria-label="Reset trials" onClick={() => setHits([])}><RotateCcw size={18} aria-hidden="true" /></button>
    </div>
    <p className={`qa-hint ${hits.length ? 'qa-success' : ''}`} aria-live="polite">{hits.length ? `${hits.length} trials recorded.` : 'No trials recorded.'}</p>
  </>
  const phase = () => range('Relative phase', 0, 100, '0 degrees', '360 degrees', `${Math.round(value * 3.6)} degrees`)

  if (control === 'complex-phase') return range('Arrow phase', 0, 100, '0 degrees', '360 degrees', `${Math.round(value * 3.6)} degrees`)
  if (control === 'complex-length') return <>{range('Amplitude length', 0, 100, '0', '1', (value / 100).toFixed(2))}{stats([(value / 100) ** 2, 1 - (value / 100) ** 2], ['This outcome', 'Other outcome'])}</>
  if (control === 'math-interference' || control === 'path-phase') {
    const zero = interference(value / 100 * Math.PI * 2)
    return <>{phase()}{control === 'math-interference' ? sample([zero, 1 - zero], ['Output 0', 'Output 1']) : stats([zero, 1 - zero], ['Output 0', 'Output 1'])}</>
  }
  if (control === 'algebra-state') return <>{range('State preparation', 0, 100, '|0>', '|1>', `${Math.round(value * 1.8)} degrees`)}{choices('Coordinate basis', [['z', 'Z coordinates'], ['x', 'X coordinates']])}{stats(observableProbabilities(realQubit(value / 100 * Math.PI), mode), mode === 'x' ? ['|+>', '|->'] : ['|0>', '|1>'])}</>
  if (control === 'algebra-gate') return choices('Matrix', [['x', 'X'], ['h', 'H'], ['z', 'Z']])
  if (control === 'algebra-order') return <>{choices('Gate order', [['hx', 'H then X'], ['xh', 'X then H']])}{sample(observableProbabilities(gateSequence(mode), 'x'), ['X: +1', 'X: -1'])}</>
  if (control === 'observable-axis') {
    const weights = observableProbabilities(realQubit(value / 100 * Math.PI), mode)
    return <>{range('State preparation', 0, 100, '|0>', '|1>', `${Math.round(value * 1.8)} degrees`)}{choices('Observable', [['z', 'Pauli Z'], ['x', 'Pauli X']])}<p className="qa-hint">Expectation: {(weights[0] - weights[1]).toFixed(2)}</p>{sample(weights, ['+1', '-1'])}</>
  }
  if (control === 'observable-eigen') return choices('Input state for Z', [['zero', '|0>'], ['one', '|1>'], ['plus', '|+>']])
  if (control === 'observable-order') return <>{choices('Measurement sequence', [['zz', 'Z then Z'], ['zxz', 'Z then X then Z']])}{sample(measurementSequence(mode), ['Final Z: +1', 'Final Z: -1'])}</>
  if (control === 'hilbert-dimension') return range('Number of qubits', 1, 4, '1 qubit', '4 qubits', `${value} qubits / ${2 ** value} basis states`)
  if (control === 'hilbert-overlap') return <>{range('State angle', 0, 100, 'Parallel', 'Orthogonal', `${Math.round(value * 0.9)} degrees`)}{stats([inner(ZERO, realQubit(value / 100 * Math.PI)).abs() ** 2], ['Projection onto |0>'])}</>
  if (control === 'hilbert-tensor') return <>{choices('Joint preparation', [['product', '|+>|+>'], ['bell', 'Bell state'], ['mixture', '00/11 mixture']])}{range('Shared basis rotation', 0, 100, 'Z basis', 'X basis', `${Math.round(value * 0.45)} degrees`)}{sample(jointProbabilities(mode, value / 100 * Math.PI / 4), ['00', '01', '10', '11'])}</>
  if (control === 'box-boundary') {
    const valid = value % 10 === 0
    return <>{range('Half-waves across the box', 10, 50, '1', '5', (value / 10).toFixed(1))}<p className={`qa-hint ${valid ? 'qa-success' : ''}`} aria-live="polite">{valid ? `Both walls satisfied: n = ${value / 10}.` : 'Right wall not satisfied. Choose a whole number to continue.'}</p></>
  }
  if (control === 'box-energy') return <>{levelInput('Energy level n', 1, 4)}{range('Box width', 50, 100, 'Reference L', 'Twice L', `${(value / 50).toFixed(2)} L`)}<p className="qa-hint" aria-live="polite">Energy: {boxEnergy(Number(mode), value / 50).toFixed(2)} E_ref</p></>
  if (control === 'box-evolution') return <>{choices('Energy preparation', [['stationary', 'One eigenstate'], ['superposition', 'Two-energy superposition']])}{range('Evolution rate', 10, 100, 'Slow', 'Fast')}</>
  if (control === 'path-action') return range('Action scale', 0, 100, 'Similar phases', 'Many phase turns', (value / 5 + 0.2).toFixed(1))
  if (control === 'field-number') return <>{levelInput('Photon number n', 0, 3)}<p className="qa-hint" aria-live="polite">Energy: {(Number(mode) + 0.5).toFixed(1)} hbar omega. Mean quadrature: 0.</p></>
  return null
}
