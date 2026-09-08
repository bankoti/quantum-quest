import assert from 'node:assert/strict'

export const mathJourney = [
  { slug: 'complex-numbers', title: 'A complex number is an arrow with a phase', answers: [1, 2] },
  { slug: 'linear-algebra-intuition', title: 'A state vector lists amplitudes in a chosen basis', answers: [0, 1] },
  { slug: 'operators-and-observables', title: 'An observable connects a state to possible measured values', answers: [1, 2] },
  { slug: 'hilbert-spaces', title: 'State-space dimension counts basis states, not spatial axes', answers: [2, 0] },
  { slug: 'solve-schrodingers-equation', title: 'Only waves that fit both walls are allowed', answers: [1, 0] },
  { slug: 'path-integrals-and-fields', title: 'Alternative routes contribute amplitudes to one outcome', answers: [1, 2, 0, 1] },
]

export async function completeMathJourney(page, base, onStep = async () => {}) {
  const click = name => page.getByRole('button', { name, exact: true }).click()
  const slide = (name, value) => page.getByRole('slider', { name }).fill(String(value))
  await page.goto(`${base}/complex-numbers`)
  for (const [index, lesson] of mathJourney.entries()) {
    await page.getByRole('heading', { name: lesson.title, exact: true }).waitFor()
    for (let step = 0; step < 3; step++) {
      if (index === 0) {
        if (step === 0) await slide('Arrow phase', 75)
        if (step === 1) await slide('Amplitude length', 50)
        if (step === 2) {
          await slide('Relative phase', 50)
          await click('Measure 100 trials')
          assert.deepEqual(await page.locator('.qa-math-stats dd').allTextContents(), ['0%', '100%'])
          await page.reload()
          await page.getByText('100 trials recorded.', { exact: true }).waitFor()
          assert.equal(await page.getByRole('slider').inputValue(), '50')
        }
      }
      if (index === 1) {
        if (step === 0) { await slide('State preparation', 70); await click('X coordinates') }
        if (step === 1) { for (const gate of ['X', 'H', 'Z']) await click(gate) }
        if (step === 2) {
          await click('X then H'); await click('Measure 100 trials')
          assert.deepEqual(await page.locator('.qa-math-stats dd').allTextContents(), ['0%', '100%'])
        }
      }
      if (index === 2) {
        if (step === 0) { await slide('State preparation', 50); await click('Pauli Z'); await click('Measure 100 trials') }
        if (step === 1) { await click('|+>'); await click('|1>') }
        if (step === 2) {
          await click('Z then X then Z'); await click('Measure 100 trials')
          assert.deepEqual(await page.locator('.qa-math-stats dd').allTextContents(), ['50%', '50%'])
        }
      }
      if (index === 3) {
        if (step === 0) await slide('Number of qubits', 4)
        if (step === 1) await slide('State angle', 100)
        if (step === 2) {
          await slide('Shared basis rotation', 100); await click('00/11 mixture')
          assert.deepEqual(await page.locator('.qa-math-stats dd').allTextContents(), ['25%', '25%', '25%', '25%'])
          await click('Bell state')
          assert.deepEqual(await page.locator('.qa-math-stats dd').allTextContents(), ['50%', '0%', '0%', '50%'])
          await click('Measure 100 trials')
        }
      }
      if (index === 4) {
        if (step === 0) {
          assert.equal(await page.getByRole('button', { name: 'Continue →' }).isEnabled(), false)
          await slide('Half-waves across the box', 30)
          await page.getByText('Both walls satisfied: n = 3.').waitFor()
        }
        if (step === 1) {
          await page.getByRole('spinbutton', { name: 'Energy level n' }).fill('3'); await slide('Box width', 100)
          await page.getByText('Energy: 2.25 E_ref').waitFor()
        }
        if (step === 2) await click('Two-energy superposition')
      }
      if (index === 5) {
        if (step === 0) await slide('Relative phase', 50)
        if (step === 1) await slide('Action scale', 65)
        if (step === 2) await page.getByRole('spinbutton', { name: 'Photon number n' }).fill('3')
      }
      await onStep(lesson.slug, step)
      await click('Continue →')
    }
    const groups = page.getByRole('radiogroup')
    for (const [question, answer] of lesson.answers.entries()) await groups.nth(question).getByRole('radio').nth((answer + 1) % 3).click()
    await click('Check model →')
    assert.equal(await page.getByRole('button', { name: 'See summary →' }).isEnabled(), false)
    assert.ok(!await page.evaluate(slug => JSON.parse(localStorage.getItem('quantum-quest-completed-lessons') || '[]').includes(slug), lesson.slug))
    for (const [question, answer] of lesson.answers.entries()) await groups.nth(question).getByRole('radio').nth(answer).click()
    await click('Check model →'); await click('See summary →')
    assert.ok(await page.evaluate(slug => JSON.parse(localStorage.getItem('quantum-quest-completed-lessons') || '[]').includes(slug), lesson.slug))
    if (index < mathJourney.length - 1) await click('Start next lesson →')
  }
  await page.getByRole('heading', { name: 'You can connect the quantum picture to its mathematics' }).waitFor()
}
