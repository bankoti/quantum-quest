import { useContext, useEffect, useRef } from 'react'
import { animateCanvas, CanvasAnimationContext } from './canvasAnimation'
import { boxEnergy, boxMode, boxState, GATES, gateSequence, interference, jointProbabilities, ket, magnitudeSquared, measurementSequence, observableProbabilities, oscillatorDensity, pathContributions, phasor, PLUS, realQubit, transform } from './mathModels'

type Props = { scene: string; value: number; mode: string; hits: number[]; accent: string }

export function MathCanvas({ scene, value, mode, hits, accent }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)
  const animation = useContext(CanvasAnimationContext)
  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    let w = 1, h = 1
    const cyan = '#22d3ee', pink = '#fb7185', gold = '#fbbf24', green = '#34d399', muted = '#9ca3af'
    const resize = () => {
      const bounds = canvas.getBoundingClientRect()
      w = Math.max(1, bounds.width); h = Math.max(1, bounds.height)
      const scale = Math.min(devicePixelRatio || 1, 2)
      canvas.width = Math.round(w * scale); canvas.height = Math.round(h * scale)
      ctx.setTransform(scale, 0, 0, scale, 0, 0)
    }
    const line = (x: number, y: number, xx: number, yy: number, color = '#374151', thickness = 2) => {
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(xx, yy); ctx.strokeStyle = color; ctx.lineWidth = thickness; ctx.stroke()
    }
    const text = (label: string, x: number, y: number, color = muted, size = 12, align: CanvasTextAlign = 'center') => {
      ctx.fillStyle = color; ctx.font = `600 ${size}px ui-monospace, monospace`; ctx.textAlign = align
      const available = align === 'center' ? Math.min(x, w - x) * 2 : align === 'left' ? w - x : x
      ctx.fillText(label, x, y, Math.max(1, available - 16))
    }
    const circle = (x: number, y: number, r: number, color: string, fill = false) => {
      ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI)
      if (fill) { ctx.fillStyle = color; ctx.fill() } else { ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke() }
    }
    const arrow = (x: number, y: number, xx: number, yy: number, color: string) => {
      if (Math.hypot(xx - x, yy - y) < 2) { circle(x, y, 3, color, true); return }
      line(x, y, xx, yy, color, 3)
      const a = Math.atan2(yy - y, xx - x)
      line(xx, yy, xx - 9 * Math.cos(a - 0.5), yy - 9 * Math.sin(a - 0.5), color)
      line(xx, yy, xx - 9 * Math.cos(a + 0.5), yy - 9 * Math.sin(a + 0.5), color)
    }
    const curve = (fn: (x: number) => number, left: number, right: number, baseline: number, scale: number, color: string) => {
      ctx.beginPath()
      for (let i = 0; i <= 180; i++) {
        const x = i / 180, y = baseline - fn(x) * scale
        if (i === 0) ctx.moveTo(left, y); else ctx.lineTo(left + (right - left) * x, y)
      }
      ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.stroke()
    }
    const header = (label: string) => text(label, w / 2, 28, accent, 13)
    const footer = (label: string) => text(label, w / 2, h - 14, muted, 11)
    const bars = (weights: number[], labels: string[], top = h * 0.3, bottom = h - 45) => {
      const left = w * 0.12, span = w * 0.76, slot = span / weights.length
      line(left, bottom, left + span, bottom)
      weights.forEach((p, i) => {
        const color = [cyan, pink, gold, green][i % 4], x = left + slot * (i + 0.5), bw = Math.min(80, slot * 0.55)
        const high = Math.max(0, p) * (bottom - top)
        ctx.fillStyle = `${color}40`; ctx.fillRect(x - bw / 2, bottom - high, bw, high)
        line(x - bw / 2, bottom - high, x + bw / 2, bottom - high, color, 3)
        text(`${Math.round(p * 100)}%`, x, bottom - high - 10, color)
        text(labels[i], x, bottom + 20, color, 12)
        if (hits.length) text(`${hits.filter(hit => hit === i).length} hits`, x, top - 24, muted, 10)
      })
    }
    const plane = (phase: number, length: number, time: number) => {
      const r = Math.min(w * 0.3, (h - 100) * 0.43), x = w / 2, y = h / 2
      line(x - r - 12, y, x + r + 12, y); line(x, y - r - 12, x, y + r + 12)
      circle(x, y, r, '#374151')
      const z = phasor(phase, length), xx = x + z.re * r, yy = y - z.im * r
      ctx.setLineDash([4, 4]); line(xx, y, xx, yy, pink); line(x, yy, xx, yy, cyan); ctx.setLineDash([])
      arrow(x, y, xx, yy, gold)
      const progress = (time * 0.0003) % 1
      circle(x + (xx - x) * progress, y + (yy - y) * progress, 3, gold, true)
      text('real', x + r + 15, y + 22, cyan, 10)
      text('imaginary', x, y - r - 20, pink, 10)
      footer(`${z.re.toFixed(2)} ${z.im < 0 ? '-' : '+'} ${Math.abs(z.im).toFixed(2)}i   |z| = ${length.toFixed(2)}`)
    }
    const amplitudeBars = (input: number[], output: number[], label: string) => {
      header(label)
      const baseline = h * 0.67, scale = Math.min(110, h * 0.18)
      for (let group = 0; group < 2; group++) {
        const values = group ? output : input, center = w * (group ? 0.73 : 0.27)
        line(center - w * 0.13, baseline, center + w * 0.13, baseline)
        values.forEach((a, i) => {
          const x = center + (i ? 1 : -1) * w * 0.055, yy = baseline - a * scale, color = i ? pink : cyan
          line(x, baseline, x, yy, color, Math.min(24, w * 0.045))
          text(a.toFixed(2), x, a >= 0 ? yy - 11 : yy + 18, color, 11)
        })
        text(group ? 'OUTPUT' : 'INPUT', center, h * 0.24, muted, 11)
      }
      arrow(w * 0.46, baseline, w * 0.54, baseline, gold)
      footer('real amplitudes: cyan = first / coral = second')
    }
    const routes = (time: number, many: boolean) => {
      header(many ? 'PATHS AND THEIR PHASES' : 'TWO COHERENT ROUTES')
      const x1 = w * 0.13, x2 = w * 0.87, y = h * 0.4, bend = Math.min(65, h * 0.2)
      const paths = many ? pathContributions(value / 5 + 0.2) : [phasor(0), phasor(value / 100 * Math.PI * 2)]
      paths.forEach((p, i) => {
        const offset = many ? (i - 5) / 5 : i ? 1 : -1, mid = y + offset * bend, color = many && i === 5 ? gold : i % 2 ? pink : cyan
        ctx.globalAlpha = many && i !== 5 ? 0.4 : 1
        line(x1, y, w / 2, mid, color, 1.5); line(w / 2, mid, x2, y, color, 1.5)
        const t = (time * 0.00025) % 1
        circle(x1 + (x2 - x1) * t, y + offset * bend * (1 - Math.abs(2 * t - 1)), 2, color, true)
        ctx.globalAlpha = 1
        const x = w * 0.1 + (i + 0.5) * w * 0.8 / paths.length, yy = h * 0.77, radius = Math.min(18, w * 0.32 / paths.length)
        arrow(x, yy, x + p.re * radius, yy - p.im * radius, color)
      })
      circle(x1, y, 5, green, true); circle(x2, y, 5, green, true)
      const sum = paths.reduce((a, b) => a.add(b))
      footer(many ? `coherence ratio = ${(sum.abs() / paths.length).toFixed(2)}` : `P(0) = ${Math.round(interference(value / 100 * Math.PI * 2) * 100)}%`)
    }
    const draw = (time: number) => {
      ctx.fillStyle = '#080b14'; ctx.fillRect(0, 0, w, h)
      if (scene === 'complex-phase' || scene === 'complex-length') {
        header(scene === 'complex-phase' ? 'COMPLEX PLANE' : 'AMPLITUDE LENGTH')
        plane(scene === 'complex-phase' ? value / 100 * Math.PI * 2 : Math.PI / 4, scene === 'complex-length' ? value / 100 : 1, time)
      } else if (scene === 'math-interference') {
        header('ADD THE TWO CONTRIBUTIONS')
        const phase = value / 100 * Math.PI * 2, a = phasor(0, 0.5), b = phasor(phase, 0.5), sum = a.add(b)
        const x = w * 0.25, y = h * 0.39, r = Math.min(w * 0.48, (h - 86) * 0.6)
        arrow(x, y, x + a.re * r, y, cyan)
        arrow(x + a.re * r, y, x + sum.re * r, y - sum.im * r, pink)
        arrow(x, y + 5, x + sum.re * r, y - sum.im * r + 5, gold)
        text('first + second = total', w / 2, h * 0.57, muted, 11)
        const p = interference(phase)
        bars([p, 1 - p], ['0', '1'], h * 0.72, h - 43)
      } else if (scene === 'algebra-state' || scene === 'hilbert-overlap') {
        header(scene === 'algebra-state' ? 'STATE COORDINATES' : 'PROJECT ONTO |0>')
        const state = realQubit(value / 100 * Math.PI), coords = scene === 'algebra-state' && mode === 'x' ? transform(GATES.h, state) : state
        const r = Math.min(w * 0.26, (h - 100) * 0.43), x = w / 2, y = h * 0.52
        circle(x, y, r, '#374151'); line(x - r, y, x + r, y); line(x, y - r, x, y + r)
        arrow(x, y, x + coords[0].re * r, y - coords[1].re * r, gold)
        ctx.setLineDash([4, 4]); line(x + coords[0].re * r, y, x + coords[0].re * r, y - coords[1].re * r, cyan); ctx.setLineDash([])
        text(scene === 'algebra-state' && mode === 'x' ? '|+>' : '|0>', x + r + 18, y + 6, cyan, 10)
        text(scene === 'algebra-state' && mode === 'x' ? '|->' : '|1>', x, y - r - 14, pink, 10)
        footer(`coordinates (${coords[0].re.toFixed(2)}, ${coords[1].re.toFixed(2)}) / norm = 1`)
      } else if (scene === 'algebra-gate') {
        amplitudeBars(PLUS.map(x => x.re), transform(GATES[mode] ?? GATES.h, PLUS).map(x => x.re), `${mode.toUpperCase()} MATRIX ON |+>`)
        const matrix = GATES[mode] ?? GATES.h
        text(`[${matrix[0].map(x => x.toFixed(2)).join('  ')}]`, w / 2, h * 0.32, accent, 11)
        text(`[${matrix[1].map(x => x.toFixed(2)).join('  ')}]`, w / 2, h * 0.32 + 17, accent, 11)
      } else if (scene === 'algebra-order') {
        header(mode === 'xh' ? 'X THEN H / MEASURE X' : 'H THEN X / MEASURE X')
        bars(observableProbabilities(gateSequence(mode), 'x'), ['+1', '-1'])
        footer(hits.length ? `observed counts above / ${hits.length} trials` : 'predicted probabilities')
      } else if (scene === 'observable-axis' || scene === 'observable-order' || scene === 'observable-eigen') {
        const state = scene === 'observable-eigen' ? mode === 'plus' ? PLUS : mode === 'one' ? ket([0, 1]) : ket([1, 0]) : realQubit(value / 100 * Math.PI)
        const p = scene === 'observable-order' ? measurementSequence(mode) : observableProbabilities(state, scene === 'observable-eigen' ? 'z' : mode)
        header(scene === 'observable-order' ? `${mode.toUpperCase().split('').join(' THEN ')} / FINAL Z` : scene === 'observable-eigen' ? 'EIGENSTATES OF Z' : `PAULI ${mode.toUpperCase()} OUTCOMES`)
        bars(p, ['+1', '-1'])
        footer(`expectation = ${(p[0] - p[1]).toFixed(2)} / outcomes = +1 or -1`)
      } else if (scene === 'hilbert-dimension') {
        header(`${value} QUBITS / ${2 ** value} BASIS STATES`)
        const count = 2 ** value, columns = Math.min(4, count), rows = Math.ceil(count / columns)
        const cellW = w * 0.8 / columns, cellH = (h - 94) / rows
        for (let index = 0; index < count; index++) {
          const x = w * 0.1 + (index % columns) * cellW, y = 48 + Math.floor(index / columns) * cellH
          ctx.fillStyle = index % 2 ? '#173c3b' : '#25213e'; ctx.fillRect(x + 3, y + 3, cellW - 6, cellH - 6)
          text(`|${index.toString(2).padStart(value, '0')}>`, x + cellW / 2, y + cellH / 2 + 4, index % 2 ? green : accent, 12)
        }
        footer('basis labels / not extra spatial dimensions')
      } else if (scene === 'hilbert-tensor') {
        header(mode === 'product' ? 'PRODUCT |+>|+>' : mode === 'mixture' ? 'INCOHERENT 00/11 MIXTURE' : 'ENTANGLED BELL STATE')
        bars(jointProbabilities(mode, value / 100 * Math.PI / 4), ['00', '01', '10', '11'])
        footer(`shared basis angle ${Math.round(value * 0.45)} degrees`)
      } else if (scene === 'box-boundary') {
        header('FIT BOTH BOUNDARIES')
        const left = w * 0.14, right = w * 0.86, baseline = h * 0.57, scale = Math.min(80, h * 0.24)
        line(left, baseline - scale, left, baseline + scale, muted, 4); line(right, baseline - scale, right, baseline + scale, muted, 4); line(left, baseline, right, baseline)
        curve(x => Math.sin(value / 10 * Math.PI * x), left, right, baseline, scale * 0.8, cyan)
        const mismatch = Math.sin(value / 10 * Math.PI)
        circle(right, baseline - mismatch * scale * 0.8, 5, value % 10 === 0 ? green : pink, true)
        footer(`half-waves = ${(value / 10).toFixed(1)} / right-wall residual = ${Math.abs(mismatch).toFixed(2)}`)
      } else if (scene === 'box-energy') {
        header('INFINITE-WELL ENERGY LEVELS')
        const width = value / 50, level = Number(mode), bottom = h - 47, plotHeight = h - 105
        let previousLabel = bottom + 20
        for (let n = 1; n <= 4; n++) {
          const y = bottom - boxEnergy(n, width) / 16 * plotHeight
          const labelY = Math.min(y + 4, previousLabel - 14)
          previousLabel = labelY
          line(w * 0.12, y, w * 0.46, y, n === level ? gold : '#4b5563', n === level ? 3 : 1)
          line(w * 0.105, labelY - 4, w * 0.12, y)
          text(`n=${n}`, w * 0.08, labelY, n === level ? gold : muted, 10)
        }
        line(w * 0.12, bottom, w * 0.46, bottom)
        text('E = 0', w * 0.29, bottom + 18, muted, 10)
        const left = w * 0.57, right = left + w * 0.32 * width / 2, y = h * 0.54
        line(left, h * 0.26, left, h * 0.8, muted); line(right, h * 0.26, right, h * 0.8, muted)
        curve(x => boxMode(x * width, level, width), left, right, y, h * 0.12, cyan)
        footer(`E_${level} = ${boxEnergy(level, width).toFixed(2)} E_ref / L = ${width.toFixed(2)} L_ref`)
      } else if (scene === 'box-evolution') {
        header(mode === 'superposition' ? 'TWO DIFFERENT PHASE SPEEDS' : 'ONE ENERGY / GLOBAL PHASE')
        const t = time * 0.001 * value / 50, left = w * 0.14, right = w * 0.88, superposition = mode === 'superposition'
        const upper = h * 0.36, lower = h * 0.83, scale = h * 0.075
        text('Re(psi)', left, upper - h * 0.16, cyan, 10, 'left'); text('|psi|^2', left, lower - h * 0.21, pink, 10, 'left')
        line(left, upper, right, upper); line(left, lower, right, lower)
        curve(x => boxState(x, t, superposition).re, left, right, upper, scale, cyan)
        curve(x => magnitudeSquared(boxState(x, t, superposition)), left, right, lower, scale, pink)
        footer('fixed box / total probability = 1')
      } else if (scene === 'path-phase' || scene === 'path-action') routes(time, scene === 'path-action')
      else if (scene === 'field-number') {
        const n = Number(mode)
        header(`ONE FIELD MODE / ${n} PHOTON${n === 1 ? '' : 'S'}`)
        const bottom = h * 0.78, top = h * 0.25
        for (let level = 0; level <= 3; level++) {
          const y = bottom - level / 3 * (bottom - top)
          line(w * 0.12, y, w * 0.35, y, level === n ? gold : '#374151', level === n ? 3 : 1)
          text(String(level), w * 0.08, y + 4, level === n ? gold : muted, 11)
        }
        const left = w * 0.48, right = w * 0.9
        line(left, bottom, right, bottom)
        curve(x => oscillatorDensity(x * 8 - 4, n), left, right, bottom, (bottom - top) / 0.65, cyan)
        text('quadrature q', (left + right) / 2, bottom + 22, muted, 10)
        footer(`E = ${n + 0.5} hbar omega / <q> = 0`)
      } else {
        header(scene === 'math-check' ? 'CONNECT THE MATHEMATICS' : 'YOUR QUANTUM TOOLKIT')
        const labels = ['PHASE', 'STATE', 'GATE', 'MEASURE', 'ENERGY', 'FIELD']
        labels.forEach((label, i) => {
          const x = w * (i % 2 ? 0.73 : 0.27), y = h * (0.3 + Math.floor(i / 2) * 0.22)
          if (i % 2 === 0) arrow(x + w * 0.14, y - 4, w * 0.59, y - 4, [cyan, gold, green][Math.floor(i / 2)])
          text(label, x, y, [cyan, pink, gold, green, accent, cyan][i], 12)
        })
        footer('amplitudes -> predictions -> evidence')
      }
    }
    return animateCanvas(canvas, resize, draw, animation)
  }, [scene, value, mode, hits, accent, animation])
  return <canvas ref={ref} className="qa-canvas qa-math-canvas" aria-label={`${scene.replace(/-/g, ' ')} mathematical quantum model`} />
}
