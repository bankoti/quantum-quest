import assert from 'node:assert/strict'
import { before, after, test } from 'node:test'
import { spawn } from 'node:child_process'
import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright'
import { completeMathJourney } from './math-journey.mjs'

const base = 'http://127.0.0.1:4186'
let server
let browser

before(async () => {
  server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '4186', '--strictPort'], { stdio: 'pipe' })
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (server.exitCode !== null) throw new Error('Review server failed to start')
    if (await fetch(base).then(response => response.ok).catch(() => false)) break
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  browser = await chromium.launch({ headless: true })
})

after(async () => {
  await browser?.close()
  if (server && server.exitCode === null) {
    const exited = new Promise(resolve => server.once('exit', resolve))
    server.kill()
    await exited
  }
})

async function withPage(run, options = {}) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, ...options })
  context.setDefaultTimeout(5000)
  try { await run(await context.newPage(), context) } finally { await context.close() }
}

const next = page => page.getByRole('button', { name: 'Continue →' }).click()
const completed = page => page.evaluate(() => JSON.parse(localStorage.getItem('quantum-quest-completed-lessons') || '[]'))

test('only a passed quiz completes a lesson, including after next-lesson navigation', async () => {
  await withPage(async page => {
    await page.goto(`${base}/qubits`)
    await next(page)
    await next(page)
    await page.getByRole('button', { name: 'Measure 100 qubits' }).click()
    await next(page)
    await page.getByRole('radio', { name: /controllable quantum state with amplitudes/ }).click()
    await page.getByRole('button', { name: 'Check model →' }).click()
    await page.getByRole('button', { name: 'See summary →' }).click()
    await page.getByRole('button', { name: 'Start next lesson →' }).click()
    await page.getByRole('heading', { name: 'A quantum gate rotates amplitudes without reading them' }).waitFor()
    assert.deepEqual(await completed(page), ['qubits'])
  })
})

test('reload restores the prepared state and data; changing preparation clears obsolete data', async () => {
  await withPage(async page => {
    await page.goto(`${base}/qubits`)
    await next(page)
    await page.getByRole('slider', { name: 'Qubit rotation' }).fill('100')
    await next(page)
    await page.getByRole('button', { name: 'Measure 100 qubits' }).click()
    await page.reload()
    await page.getByText('100 qubit measurements recorded.').waitFor({ timeout: 3000 })
    assert.equal(await page.getByText('Observed 100 / 100', { exact: true }).count(), 1)
    await page.getByRole('button', { name: 'Previous step' }).click()
    assert.equal(await page.getByRole('slider', { name: 'Qubit rotation' }).inputValue(), '100')
    await page.reload()
    await next(page)
    await page.getByText('100 qubit measurements recorded.').waitFor()
    await page.getByRole('button', { name: 'Previous step' }).click()
    await page.getByRole('slider', { name: 'Qubit rotation' }).fill('0')
    await next(page)
    assert.equal(await page.getByRole('button', { name: 'Continue →' }).isEnabled(), false)
    assert.equal(await page.getByText('100 qubit measurements recorded.').count(), 0)
  })
})

test('the first journey resumes its step after a reload', async () => {
  await withPage(async page => {
    await page.goto(`${base}/the-quantum-rules-change`)
    await next(page)
    await page.getByRole('button', { name: 'Wave', exact: true }).click()
    await page.reload()
    await page.getByRole('heading', { name: 'A particle or a wave?' }).waitFor({ timeout: 3000 })
    assert.equal(await page.getByRole('button', { name: 'Wave', exact: true }).getAttribute('aria-pressed'), 'true')
  })
})

test('invalid saved steps and unavailable browser storage do not crash a lesson', async () => {
  await withPage(async (page, context) => {
    await context.addInitScript(() => localStorage.setItem('quantum-quest-step:qubits', '1.5'))
    await page.goto(`${base}/qubits`)
    await page.getByRole('heading', { name: 'A qubit stores a direction in quantum state space' }).waitFor({ timeout: 3000 })
  })
  await withPage(async (page, context) => {
    await context.addInitScript(() => { Storage.prototype.setItem = () => { throw new DOMException('Blocked', 'QuotaExceededError') } })
    await page.goto(`${base}/qubits`)
    await next(page)
    await page.getByRole('heading', { name: 'Rotations move the qubit around the Bloch sphere' }).waitFor({ timeout: 3000 })
  })
})

async function canvasColors(page) {
  return page.locator('canvas').evaluate(canvas => {
    const ctx = canvas.getContext('2d')
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    const colors = new Set()
    // Sparse grids can miss thin chart edges and labels even on a fully drawn model.
    for (let offset = 0; offset < pixels.length; offset += 4) {
      colors.add(pixels[offset] * 16777216 + pixels[offset + 1] * 65536 + pixels[offset + 2] * 256 + pixels[offset + 3])
      if (colors.size > 32) break
    }
    return colors.size
  })
}

test('every canvas remains drawn after a reduced-motion resize', async () => {
  await withPage(async page => {
    for (const slug of ['the-quantum-rules-change', 'classical-particles-and-waves', 'the-wavefunction', 'atomic-orbitals', 'entanglement', 'qubits', 'complex-numbers']) {
      await page.goto(`${base}/${slug}`)
      await page.waitForTimeout(150)
      await page.setViewportSize({ width: 360, height: 740 })
      await page.waitForTimeout(150)
      assert.ok(await canvasColors(page) > 4, `${slug} went blank after resizing`)
      await page.setViewportSize({ width: 390, height: 844 })
    }
  }, { reducedMotion: 'reduce' })
})

test('resizing and changing lessons releases all animation callbacks', async () => {
  await withPage(async (page, context) => {
    await context.addInitScript(() => {
      const request = window.requestAnimationFrame.bind(window)
      const cancel = window.cancelAnimationFrame.bind(window)
      window.pendingFrames = new Set()
      window.requestAnimationFrame = callback => {
        const id = request(time => { window.pendingFrames.delete(id); callback(time) })
        window.pendingFrames.add(id)
        return id
      }
      window.cancelAnimationFrame = id => { window.pendingFrames.delete(id); cancel(id) }
    })
    for (const slug of ['atomic-orbitals', 'entanglement', 'qubits', 'complex-numbers']) {
      await page.goto(`${base}/${slug}`)
      for (const width of [360, 430, 390]) {
        await page.setViewportSize({ width, height: 844 })
        await page.waitForTimeout(100)
      }
      await page.getByRole('link', { name: 'Close lesson' }).click()
      await page.waitForTimeout(1500)
      assert.equal(await page.evaluate(() => window.pendingFrames.size), 0, `${slug} retained an animation after closing`)
    }
  })
})

test('all six math lessons work on phones and desktop, including equations and quizzes', async () => {
  await mkdir('smoke-shots', { recursive: true })
  for (const width of [320, 390, 1280]) {
    await withPage(async page => {
      const errors = []
      page.on('pageerror', error => errors.push(error.message))
      await completeMathJourney(page, base, async (slug, step) => {
        for (const details of await page.locator('details').all()) {
          if (await details.getAttribute('open') === null) await details.locator('summary').click()
        }
        await page.evaluate(() => scrollTo(0, 0))
        await page.screenshot({ path: `smoke-shots/review-math-${slug}-${step}-${width}.png`, fullPage: width < 900 })
        assert.ok(await canvasColors(page) > 4, `${slug} step ${step} is blank`)
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${slug} overflows at ${width}`)
        assert.ok(await page.evaluate(() => document.querySelector('.qa-lesson-nav').getBoundingClientRect().top >= document.querySelector('.qa-copy-inner').getBoundingClientRect().bottom), `${slug} has overlapping navigation`)
      })
      assert.equal((await completed(page)).length, 6)
      await page.getByRole('button', { name: 'Return to course map →' }).click()
      await page.getByText('6/35 lessons', { exact: true }).waitFor()
      assert.equal(await page.locator('.qa-playable').count(), 35)
      assert.equal(await page.locator('.qa-locked').count(), 0)
      assert.deepEqual(errors, [])
    }, { viewport: { width, height: 900 }, reducedMotion: 'reduce' })
  }
})

test('math preparations clear old trials and invalid saved settings recover safely', async () => {
  await withPage(async page => {
    await page.goto(`${base}/operators-and-observables`)
    await page.getByRole('button', { name: 'Measure 100 trials' }).click()
    await page.getByRole('button', { name: 'Pauli X', exact: true }).click()
    assert.equal(await page.getByRole('button', { name: 'Continue →' }).isEnabled(), false)
    await page.getByRole('button', { name: 'Measure one', exact: true }).click()
    assert.equal(await page.getByRole('button', { name: 'Continue →' }).isEnabled(), true)
    await page.getByRole('button', { name: 'Reset trials' }).click()
    assert.equal(await page.getByRole('button', { name: 'Continue →' }).isEnabled(), false)
  })
  for (const [slug, step] of [['hilbert-spaces', 0], ['linear-algebra-intuition', 2]]) {
    await withPage(async (page, context) => {
      const errors = []
      page.on('pageerror', error => errors.push(error.message))
      await context.addInitScript(({ slug, step }) => localStorage.setItem(`quantum-quest-session:${slug}`, JSON.stringify({ version: 1, step, experiments: { [step]: { value: 99, mode: 'invalid', hits: [], active: false, pulse: 0 } }, answers: {}, answerState: 'idle' })), { slug, step })
      await page.goto(`${base}/${slug}`)
      await page.locator('h1').waitFor()
      assert.ok(await canvasColors(page) > 4)
      assert.deepEqual(errors, [])
    }, { reducedMotion: 'reduce' })
  }
})

test('the new time-evolution model animates and can be paused', async () => {
  await withPage(async page => {
    await page.goto(`${base}/solve-schrodingers-equation`)
    await page.getByRole('slider').fill('20'); await next(page); await next(page)
    await page.getByRole('button', { name: 'Two-energy superposition', exact: true }).click()
    await page.evaluate(() => scrollTo(0, 0))
    const pixels = () => page.locator('canvas').evaluate(canvas => canvas.toDataURL())
    const first = await pixels()
    await page.waitForTimeout(350)
    assert.notEqual(await pixels(), first)
    await page.getByRole('button', { name: 'Pause animation' }).click()
    const paused = await pixels()
    await page.waitForTimeout(200)
    assert.equal(await pixels(), paused)
  })
})

test('pause freezes the model, resizing preserves it, and play resumes movement', async () => {
  await withPage(async page => {
    await page.goto(`${base}/classical-particles-and-waves`)
    await page.waitForTimeout(150)
    await page.getByRole('button', { name: 'Pause animation' }).click()
    const pixels = () => page.locator('canvas').evaluate(canvas => canvas.toDataURL())
    const paused = await pixels()
    await page.waitForTimeout(180)
    assert.equal(await pixels(), paused)
    await page.setViewportSize({ width: 320, height: 680 })
    await page.waitForTimeout(100)
    assert.ok(await canvasColors(page) > 4)
    const resized = await pixels()
    await page.getByRole('button', { name: 'Play animation' }).click()
    await page.waitForTimeout(250)
    assert.notEqual(await pixels(), resized)
  })
})

test('the hub resumes the last unfinished lesson and quiz options support arrow keys', async () => {
  await withPage(async page => {
    await page.goto(`${base}/semiconductors`)
    await next(page)
    await page.getByRole('link', { name: 'Close lesson' }).click()
    assert.equal(await page.locator('.qa-next').getAttribute('href'), '/semiconductors')
    await page.locator('.qa-next').click()
    await next(page)
    await next(page)
    const options = page.getByRole('radio')
    await options.first().focus()
    await options.first().press('ArrowDown')
    assert.equal(await options.nth(1).getAttribute('aria-checked'), 'true')
    await page.getByRole('button', { name: 'Check model →' }).click()
    assert.equal(await page.getByText('Revisit this connection and try another answer.').count(), 1)
    assert.deepEqual(await completed(page), [])
    await options.nth(1).press('Home')
    await page.getByRole('button', { name: 'Check model →' }).click()
    assert.deepEqual(await completed(page), ['semiconductors'])
  })
})

test('switching the QKD channel clears its previous public sample', async () => {
  await withPage(async page => {
    await page.goto(`${base}/quantum-cryptography`)
    await next(page)
    await page.getByRole('button', { name: /Direct quantum channel/ }).click()
    await next(page)
    await page.getByRole('button', { name: 'Compare 120 test bits' }).click()
    await page.reload()
    await page.getByText(/errors found in 120 test bits/).waitFor()
    assert.equal(await page.getByRole('button', { name: /Eve intercepts/ }).getAttribute('aria-pressed'), 'true')
    await page.getByRole('button', { name: /Eve intercepts/ }).click()
    assert.equal(await page.getByRole('button', { name: 'Continue →' }).isEnabled(), false)
    assert.equal(await page.getByText(/errors found in 120 test bits/).count(), 0)
  })
})

test('revised experiments fit small phones and desktop with visible nonblank models', async () => {
  await mkdir('smoke-shots', { recursive: true })
  for (const width of [320, 390, 1280]) {
    await withPage(async page => {
      const errors = []
      page.on('pageerror', error => errors.push(error.message))
      const capture = async name => {
        await page.evaluate(() => window.scrollTo(0, 0))
        await page.waitForTimeout(100)
        await page.screenshot({ path: `smoke-shots/review-${name}-${width}.png`, fullPage: width < 900 })
        const colors = await canvasColors(page)
        assert.ok(colors > 4, `${name} at ${width} has only ${colors} sampled colors`)
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth) <= 1, `${name} overflows at ${width}`)
        assert.ok(await page.evaluate(() => {
          const content = document.querySelector('.qa-copy-inner').getBoundingClientRect()
          const navigation = document.querySelector('.qa-lesson-nav').getBoundingClientRect()
          return navigation.top >= content.bottom
        }), `${name} navigation covers lesson content at ${width}`)
      }
      await page.goto(`${base}/quantum-gates-and-circuits`)
      await page.getByRole('button', { name: 'H gate', exact: true }).click()
      await capture('gate')
      await page.goto(`${base}/qubits`)
      await next(page)
      await page.getByRole('slider', { name: 'Qubit rotation' }).fill('65')
      await capture('bloch')
      await next(page)
      await page.getByRole('button', { name: 'Measure 100 qubits' }).click()
      await capture('qubit')
      await page.goto(`${base}/quantum-cryptography`)
      await next(page)
      await next(page)
      await page.getByRole('button', { name: 'Compare 120 test bits' }).click()
      await capture('qkd')
      await page.locator('.qa-model-note summary').click()
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth) <= 1)
      assert.deepEqual(errors, [])
    }, { viewport: { width, height: width < 900 ? 844 : 900 }, reducedMotion: 'reduce' })
  }
})
