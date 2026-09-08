import assert from 'node:assert/strict'
import { before, after, test } from 'node:test'
import { createServer } from 'vite'

let server, m
before(async () => {
  server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
  m = await server.ssrLoadModule('/src/quantum/mathModels.ts')
})
after(async () => { await server?.close() })
const close = (actual, expected, tolerance = 1e-9) => assert.ok(Math.abs(actual - expected) < tolerance, `${actual} should equal ${expected}`)
const distribution = (actual, expected) => actual.forEach((value, index) => close(value, expected[index]))
const integrate = (f, left, right, count = 10000) => {
  const step = (right - left) / count
  let sum = (f(left) + f(right)) / 2
  for (let i = 1; i < count; i++) sum += f(left + i * step)
  return sum * step
}

test('complex amplitudes interfere and probabilities remain normalized', () => {
  close(m.interference(0), 1); close(m.interference(Math.PI), 0); close(m.interference(Math.PI / 2), 0.5)
  close(m.magnitudeSquared(m.phasor(1.2, 0.5)), 0.25)
  close(m.inner(m.ket([1, 0]), m.ket([0, 1])).abs(), 0)
})
test('unitary gates preserve norm and their order changes X-basis predictions', () => {
  for (let angle = 0; angle <= Math.PI; angle += 0.1) {
    for (const matrix of Object.values(m.GATES)) close(m.probabilities(m.transform(matrix, m.realQubit(angle))).reduce((a, b) => a + b), 1)
  }
  distribution(m.probabilities(m.gateSequence('hh')), [1, 0])
  distribution(m.observableProbabilities(m.gateSequence('hx'), 'x'), [1, 0])
  distribution(m.observableProbabilities(m.gateSequence('xh'), 'x'), [0, 1])
})
test('projective measurement sequences include all intermediate outcomes', () => {
  distribution(m.measurementSequence('zz'), [1, 0])
  distribution(m.measurementSequence('zxz'), [0.5, 0.5])
  distribution(m.observableProbabilities(m.PLUS, 'z'), [0.5, 0.5])
  distribution(m.observableProbabilities(m.PLUS, 'x'), [1, 0])
})
test('tensor-product and mixed-state predictions distinguish coherence', () => {
  distribution(m.jointProbabilities('bell', 0), [0.5, 0, 0, 0.5])
  distribution(m.jointProbabilities('mixture', 0), [0.5, 0, 0, 0.5])
  distribution(m.jointProbabilities('bell', Math.PI / 4), [0.5, 0, 0, 0.5])
  distribution(m.jointProbabilities('mixture', Math.PI / 4), [0.25, 0.25, 0.25, 0.25])
  distribution(m.jointProbabilities('product', Math.PI / 4), [1, 0, 0, 0])
  for (const mode of ['bell', 'product', 'mixture']) for (let angle = 0; angle < 1.6; angle += 0.1) close(m.jointProbabilities(mode, angle).reduce((a, b) => a + b), 1)
})
test('box eigenfunctions obey boundaries, normalization, and energy scaling', () => {
  for (const width of [1, 1.5, 2]) for (let level = 1; level <= 4; level++) {
    close(m.boxMode(0, level, width), 0); close(m.boxMode(width, level, width), 0)
    close(integrate(x => m.boxMode(x, level, width) ** 2, 0, width), 1)
    close(m.boxEnergy(level, width * 2), m.boxEnergy(level, width) / 4)
  }
})
test('stationary densities stay fixed while normalized superpositions evolve', () => {
  close(m.magnitudeSquared(m.boxState(0.2, 0, false)), m.magnitudeSquared(m.boxState(0.2, 2, false)))
  assert.ok(Math.abs(m.magnitudeSquared(m.boxState(0.2, 0, true)) - m.magnitudeSquared(m.boxState(0.2, 1, true))) > 0.1)
  for (const t of [0, 0.5, 2]) close(integrate(x => m.magnitudeSquared(m.boxState(x, t, true)), 0, 1), 1)
})
test('path contributions have unit magnitude and a stationary central phase', () => {
  const paths = m.pathContributions(7)
  assert.equal(paths.length, 11)
  paths.forEach(path => close(path.abs(), 1))
  close(paths[5].re, 1); close(paths[5].im, 0)
  close(paths[4].sub(paths[6]).abs(), 0)
  assert.ok(paths.reduce((a, b) => a.add(b)).abs() <= 11)
})
test('field-mode number states normalize and retain vacuum quadrature variance', () => {
  for (let level = 0; level <= 3; level++) {
    close(integrate(x => m.oscillatorDensity(x, level), -8, 8), 1)
    close(integrate(x => x * m.oscillatorDensity(x, level), -8, 8), 0)
    close(integrate(x => x * x * m.oscillatorDensity(x, level), -8, 8), level + 0.5)
  }
})
test('sampling respects deterministic outcomes and cumulative probabilities', () => {
  assert.equal(m.sampleOutcome([0, 1], () => 0), 1)
  assert.equal(m.sampleOutcome([1, 0], () => 0.999), 0)
  assert.equal(m.sampleOutcome([0.25, 0.25, 0.25, 0.25], () => 0.6), 2)
})
test('the complete catalog has 35 unique, linked, playable lesson routes', async () => {
  const { PLAYABLE_LESSONS } = await server.ssrLoadModule('/src/quantum/curriculum.ts')
  const { getInteractiveLesson } = await server.ssrLoadModule('/src/quantum/interactiveLessons.ts')
  assert.equal(PLAYABLE_LESSONS.length, 35)
  assert.equal(new Set(PLAYABLE_LESSONS.map(lesson => lesson.slug)).size, 35)
  for (let index = 1; index < PLAYABLE_LESSONS.length; index++) {
    const lesson = getInteractiveLesson(PLAYABLE_LESSONS[index].slug)
    assert.ok(lesson)
    assert.equal(lesson.nextSlug, PLAYABLE_LESSONS[index + 1]?.slug)
    assert.ok(lesson.questions.length > 0)
    lesson.questions.forEach(question => assert.ok(question.correct >= 0 && question.correct < question.options.length))
  }
})
