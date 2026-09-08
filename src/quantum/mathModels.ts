import Complex from 'complex.js'

export type State = Complex[]
export const ket = (values: number[]): State => values.map(value => new Complex(value))
export const ZERO = ket([1, 0])
export const PLUS = ket([Math.SQRT1_2, Math.SQRT1_2])
export const phasor = (phase: number, length = 1) => new Complex({ abs: length, arg: phase })
export const magnitudeSquared = (value: Complex) => value.abs() ** 2
export const probabilities = (state: State) => state.map(magnitudeSquared)
export const inner = (left: State, right: State) => left.reduce((sum, value, index) => sum.add(value.conjugate().mul(right[index])), new Complex(0))
export const realQubit = (angle: number) => ket([Math.cos(angle / 2), Math.sin(angle / 2)])
export const interference = (phase: number) => magnitudeSquared(new Complex(1).add(phasor(phase)).div(2))

export const GATES: Record<string, number[][]> = {
  x: [[0, 1], [1, 0]],
  h: [[Math.SQRT1_2, Math.SQRT1_2], [Math.SQRT1_2, -Math.SQRT1_2]],
  z: [[1, 0], [0, -1]],
}

export function transform(matrix: number[][], state: State): State {
  return matrix.map(row => row.reduce((sum, value, index) => sum.add(state[index].mul(value)), new Complex(0)))
}

export function gateSequence(sequence: string, state = ZERO): State {
  return [...sequence].reduce((current, gate) => transform(GATES[gate], current), state)
}

export function observableProbabilities(state: State, basis: string) {
  return probabilities(basis === 'x' ? transform(GATES.h, state) : state)
}

export function measurementSequence(axes: string): number[] {
  let branches = [{ state: ZERO, probability: 1 }]
  for (const axis of axes) {
    const eigenstates = axis === 'x' ? [PLUS, ket([Math.SQRT1_2, -Math.SQRT1_2])] : [ZERO, ket([0, 1])]
    branches = branches.flatMap(branch => eigenstates.map(state => ({ state, probability: branch.probability * magnitudeSquared(inner(state, branch.state)) })))
  }
  return [0, 1].map(outcome => branches.reduce((sum, branch) => sum + branch.probability * magnitudeSquared(branch.state[outcome]), 0))
}

export function tensor(left: State, right: State): State {
  return left.flatMap(a => right.map(b => a.mul(b)))
}

export function jointProbabilities(mode: string, angle: number): number[] {
  const rotation = [[Math.cos(angle), Math.sin(angle)], [-Math.sin(angle), Math.cos(angle)]]
  const pairRotation = rotation.flatMap(left => rotation.map(right => left.flatMap(a => right.map(b => a * b))))
  if (mode === 'mixture') {
    const a = probabilities(transform(pairRotation, ket([1, 0, 0, 0])))
    const b = probabilities(transform(pairRotation, ket([0, 0, 0, 1])))
    return a.map((value, index) => (value + b[index]) / 2)
  }
  const state = mode === 'product' ? tensor(PLUS, PLUS) : ket([Math.SQRT1_2, 0, 0, Math.SQRT1_2])
  return probabilities(transform(pairRotation, state))
}

export function sampleOutcome(weights: number[], random = Math.random): number {
  const point = random() * weights.reduce((sum, value) => sum + value, 0)
  let cumulative = 0
  for (let index = 0; index < weights.length; index += 1) {
    cumulative += weights[index]
    if (point < cumulative) return index
  }
  return weights.length - 1
}

export const boxEnergy = (level: number, width: number) => level ** 2 / width ** 2
export const boxMode = (x: number, level: number, width = 1) => x < 0 || x > width ? 0 : Math.sqrt(2 / width) * Math.sin(level * Math.PI * x / width)
export function boxState(x: number, time: number, superposition: boolean): Complex {
  const ground = phasor(-time).mul(boxMode(x, 1))
  return superposition ? ground.add(phasor(-4 * time).mul(boxMode(x, 2))).mul(Math.SQRT1_2) : ground
}

export function pathContributions(scale: number): Complex[] {
  return Array.from({ length: 11 }, (_, index) => phasor(scale * ((index - 5) / 5) ** 2))
}

export function oscillatorDensity(x: number, level: number): number {
  let previous = 1
  let current = 2 * x
  let factorial = 1
  for (let n = 1; n <= level; n += 1) factorial *= n
  for (let n = 2; n <= level; n += 1) [previous, current] = [current, 2 * x * current - 2 * (n - 1) * previous]
  const hermite = level === 0 ? 1 : current
  return hermite ** 2 * Math.exp(-x * x) / (2 ** level * factorial * Math.sqrt(Math.PI))
}
