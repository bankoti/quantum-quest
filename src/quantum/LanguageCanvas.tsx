import { useEffect, useRef } from 'react'
import { LanguageScene } from './languageLessons'

interface Props {
  scene: LanguageScene
  value: number
  mode: string
  hits: number[]
  active: boolean
  pulse: number
  accent: string
}

export function LanguageCanvas({ scene, value, mode, hits, active, pulse, accent }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    let width = 1
    let height = 1
    let frame = 0
    let animationFrame = 0
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const resize = () => {
      const bounds = canvas.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = Math.max(1, bounds.width)
      height = Math.max(1, bounds.height)
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    const dot = (x: number, y: number, radius: number, color: string, alpha = 1) => {
      context.save()
      context.globalAlpha = alpha
      context.beginPath()
      context.arc(x, y, radius, 0, Math.PI * 2)
      context.fillStyle = color
      context.fill()
      context.restore()
    }

    const line = (x1: number, y1: number, x2: number, y2: number, color: string, size = 2, alpha = 1) => {
      context.save()
      context.globalAlpha = alpha
      context.beginPath()
      context.moveTo(x1, y1)
      context.lineTo(x2, y2)
      context.strokeStyle = color
      context.lineWidth = size
      context.stroke()
      context.restore()
    }

    const text = (label: string, x: number, y: number, color = '#9ca3af', align: CanvasTextAlign = 'left', size = 11) => {
      context.fillStyle = color
      context.font = `650 ${size}px ui-monospace, SFMono-Regular, Menlo, monospace`
      context.textAlign = align
      context.fillText(label, x, y)
    }

    const grid = () => {
      context.fillStyle = '#080b14'
      context.fillRect(0, 0, width, height)
      for (let x = 18; x < width; x += 28) {
        for (let y = 18; y < height; y += 28) dot(x, y, 1, '#1f2937')
      }
    }

    const gaussian = (x: number, center: number, spread: number) => Math.exp(-((x - center) ** 2) / Math.max(0.001, spread * spread))

    const drawCurve = (sample: (nx: number) => number, baseline: number, scale: number, color: string, fill = false) => {
      context.beginPath()
      for (let x = 24; x <= width - 24; x += 3) {
        const nx = x / width
        const y = baseline - sample(nx) * scale
        if (x === 24) context.moveTo(x, y)
        else context.lineTo(x, y)
      }
      if (fill) {
        context.lineTo(width - 24, baseline)
        context.lineTo(24, baseline)
        context.closePath()
        context.fillStyle = `${color}26`
        context.fill()
      }
      context.strokeStyle = color
      context.lineWidth = 4
      context.stroke()
    }

    const drawWavefunctionMap = (time: number) => {
      const center = 0.16 + value * 0.0068
      const baseline = height * 0.62
      line(24, baseline, width - 24, baseline, '#4b5563')
      drawCurve(nx => gaussian(nx, center, 0.15) * Math.cos(nx * 38 - time * 0.003), baseline, height * 0.25, accent)
      for (let index = 0; index < 45; index += 1) {
        const nx = 0.05 + ((index * 37) % 91) / 100
        const probability = gaussian(nx, center, 0.15) ** 2
        if (((index * 29) % 100) / 100 < probability) dot(nx * width, height * 0.82, 3, '#fb7185', 0.45)
      }
      text('ψ(x)', 27, 30, accent, 'left', 15)
      text('amplitude across possible positions', 27, 50)
    }

    const drawBornRule = (time: number) => {
      const baseline = height * 0.68
      line(25, baseline, width - 25, baseline, '#4b5563')
      if (mode === 'probability') {
        drawCurve(nx => gaussian(nx, 0.5, 0.18) ** 2 * (0.18 + 0.82 * Math.cos(nx * 18) ** 2), baseline, height * 0.44, '#fb7185', true)
        text('|ψ|² ≥ 0', 27, 31, '#fb7185', 'left', 14)
      } else {
        drawCurve(nx => gaussian(nx, 0.5, 0.2) * Math.cos(nx * 18 - time * 0.002), baseline, height * 0.32, '#a78bfa')
        text('ψ has sign + phase', 27, 31, '#a78bfa', 'left', 14)
      }
      text(mode === 'probability' ? 'probability density' : 'amplitude', 27, 51)
    }

    const drawPhaseMap = (time: number) => {
      const phase = value / 100 * Math.PI * 2
      const baseline = height * 0.5
      for (let x = 30; x < width - 30; x += 12) {
        const nx = x / width
        const envelope = gaussian(nx, 0.5, 0.22)
        const angle = nx * 22 + phase - time * 0.001
        const color = `hsl(${((angle * 180 / Math.PI) % 360 + 360) % 360} 80% 65%)`
        dot(x, baseline - Math.cos(angle) * envelope * height * 0.18, 4 + envelope * 5, color)
      }
      drawCurve(nx => gaussian(nx, 0.5, 0.22) ** 2, height * 0.86, height * 0.2, '#6b7280')
      text(`PHASE ${Math.round(value * 3.6)}°`, 27, 31, accent, 'left', 14)
      text('same probability envelope', width / 2, height * 0.93, '#9ca3af', 'center')
    }

    const drawSuperpositionState = () => {
      const balance = value / 100
      const leftHeight = Math.sqrt(1 - balance)
      const rightHeight = Math.sqrt(balance)
      const base = height * 0.8
      const barW = Math.min(90, width * 0.2)
      context.fillStyle = '#a78bfa33'
      context.fillRect(width * 0.25 - barW / 2, base - leftHeight * height * 0.48, barW, leftHeight * height * 0.48)
      context.fillStyle = '#22d3ee33'
      context.fillRect(width * 0.75 - barW / 2, base - rightHeight * height * 0.48, barW, rightHeight * height * 0.48)
      line(width * 0.25, base, width * 0.25, base - leftHeight * height * 0.48, '#a78bfa', 6)
      line(width * 0.75, base, width * 0.75, base - rightHeight * height * 0.48, '#22d3ee', 6)
      text('|0〉', width * 0.25, base + 34, '#a78bfa', 'center', 16)
      text('|1〉', width * 0.75, base + 34, '#22d3ee', 'center', 16)
      text(`${Math.round((1 - balance) * 100)}%`, width * 0.25, 38, '#a78bfa', 'center')
      text(`${Math.round(balance * 100)}%`, width * 0.75, 38, '#22d3ee', 'center')
    }

    const drawSuperpositionWaves = (time: number) => {
      const phase = value / 100 * Math.PI * 2
      const baselines = [height * 0.27, height * 0.5, height * 0.79]
      const colors = ['#a78bfa', '#22d3ee', '#fbbf24']
      baselines.forEach((baseline, row) => {
        line(24, baseline, width - 24, baseline, '#273244')
        context.beginPath()
        for (let x = 24; x <= width - 24; x += 3) {
          const theta = x / width * Math.PI * 5 - time * 0.002
          const waveA = Math.sin(theta)
          const waveB = Math.sin(theta + phase)
          const sample = row === 0 ? waveA : row === 1 ? waveB : (waveA + waveB) / 1.8
          const y = baseline - sample * height * 0.09
          if (x === 24) context.moveTo(x, y)
          else context.lineTo(x, y)
        }
        context.strokeStyle = colors[row]
        context.lineWidth = row === 2 ? 5 : 3
        context.stroke()
      })
      text('A', 28, baselines[0] - 34, colors[0])
      text('B', 28, baselines[1] - 34, colors[1])
      text('A + B', 28, baselines[2] - 38, colors[2])
    }

    const drawBasis = (time: number) => {
      const cx = width * 0.5
      const cy = height * 0.5
      const radius = Math.min(width, height) * 0.31
      context.beginPath()
      context.arc(cx, cy, radius, 0, Math.PI * 2)
      context.strokeStyle = '#374151'
      context.lineWidth = 2
      context.stroke()
      const basisAngle = mode === 'x' ? Math.PI / 2 : 0
      line(cx, cy - radius, cx, cy + radius, mode === 'z' ? '#a78bfa' : '#4b5563', 3)
      line(cx - radius, cy, cx + radius, cy, mode === 'x' ? '#22d3ee' : '#4b5563', 3)
      const stateAngle = Math.PI * 0.27 + Math.sin(time * 0.0004) * 0.02
      const sx = cx + Math.sin(stateAngle) * radius * 0.85
      const sy = cy - Math.cos(stateAngle) * radius * 0.85
      line(cx, cy, sx, sy, '#fbbf24', 6)
      dot(sx, sy, 9, '#fbbf24')
      const projection = mode === 'z' ? sy : sx
      line(sx, sy, mode === 'z' ? cx : projection, mode === 'z' ? projection : cy, mode === 'z' ? '#a78bfa' : '#22d3ee', 3, 0.75)
      text(`${mode.toUpperCase()} BASIS`, 27, 31, mode === 'z' ? '#a78bfa' : '#22d3ee', 'left', 14)
    }

    const drawMeasurementPreparation = () => {
      const probability = value / 100
      const base = height * 0.8
      const maxHeight = height * 0.52
      const drawBar = (x: number, amount: number, color: string, label: string) => {
        context.fillStyle = `${color}38`
        context.fillRect(x - 45, base - amount * maxHeight, 90, amount * maxHeight)
        line(x - 45, base - amount * maxHeight, x + 45, base - amount * maxHeight, color, 5)
        text(label, x, base + 34, color, 'center', 15)
        text(`${Math.round(amount * 100)}%`, x, base - amount * maxHeight - 16, color, 'center')
      }
      drawBar(width * 0.32, 1 - probability, '#a78bfa', '0')
      drawBar(width * 0.68, probability, '#22d3ee', '1')
      text('PREPARED PROBABILITIES', 27, 31, accent)
    }

    const drawMeasurementSample = () => {
      const zeros = hits.filter(hit => hit === 0).length
      const ones = hits.length - zeros
      const total = Math.max(1, hits.length)
      const base = height * 0.78
      ;[[zeros, '#a78bfa', '0'], [ones, '#22d3ee', '1']].forEach(([count, color, label], index) => {
        const amount = Number(count) / total
        const x = width * (index ? 0.67 : 0.33)
        context.fillStyle = `${color}38`
        context.fillRect(x - 48, base - amount * height * 0.5, 96, amount * height * 0.5)
        line(x - 48, base - amount * height * 0.5, x + 48, base - amount * height * 0.5, String(color), 5)
        text(`${label}: ${count}`, x, base + 32, String(color), 'center', 14)
      })
      text(`${hits.length} MEASUREMENTS`, 27, 31, hits.length ? '#34d399' : '#6b7280')
    }

    const drawMeasurementCollapse = (time: number) => {
      const cx = width * 0.5
      const cy = height * 0.52
      if (!active) {
        const orbit = Math.min(width, height) * 0.28
        line(cx - orbit, cy, cx + orbit, cy, '#374151')
        dot(cx - orbit, cy, 22, '#a78bfa', 0.35)
        dot(cx + orbit, cy, 22, '#22d3ee', 0.35)
        for (let index = 0; index < 18; index += 1) {
          const phase = index / 18 * Math.PI * 2 + time * 0.001
          dot(cx + Math.cos(phase) * orbit, cy + Math.sin(phase) * 34, 4, index % 2 ? '#a78bfa' : '#22d3ee')
        }
        text('SUPERPOSITION', cx, 34, accent, 'center', 14)
      } else {
        const outcome = mode === '1' ? 1 : 0
        const x = width * (outcome ? 0.68 : 0.32)
        dot(x, cy, 62, outcome ? '#22d3ee' : '#a78bfa', 0.16)
        dot(x, cy, 28, outcome ? '#22d3ee' : '#a78bfa')
        text(`OUTCOME ${outcome}`, x, cy + 6, '#08101d', 'center', 15)
        text('POST-MEASUREMENT STATE', cx, 34, '#34d399', 'center')
      }
    }

    const drawUncertaintyPacket = () => {
      const positionWidth = 0.035 + value / 100 * 0.28
      const momentumWidth = Math.min(0.34, 0.014 / positionWidth)
      const topBase = height * 0.42
      const bottomBase = height * 0.86
      drawCurve(nx => gaussian(nx, 0.5, positionWidth), topBase, height * 0.27, '#22d3ee', true)
      drawCurve(nx => gaussian(nx, 0.5, momentumWidth), bottomBase, height * 0.27, '#fb7185', true)
      text('POSITION', 27, 30, '#22d3ee')
      text('MOMENTUM', 27, height * 0.55, '#fb7185')
    }

    const drawComponents = (time: number) => {
      const count = Math.max(1, Math.round(value))
      const baseline = height * 0.57
      context.beginPath()
      for (let x = 20; x <= width - 20; x += 2) {
        const nx = x / width - 0.5
        let sum = 0
        for (let component = 0; component < count; component += 1) sum += Math.cos(nx * (8 + component * 1.7) * Math.PI - time * 0.001)
        const envelope = Math.exp(-nx * nx * count * 0.8)
        const y = baseline - (sum / count) * envelope * height * 0.28
        if (x === 20) context.moveTo(x, y)
        else context.lineTo(x, y)
      }
      context.strokeStyle = '#22d3ee'
      context.lineWidth = 4
      context.stroke()
      for (let component = 0; component < count; component += 1) dot(width * 0.2 + component * Math.min(24, width * 0.6 / count), height * 0.86, 4, `hsl(${180 + component * 13} 80% 65%)`)
      text(`${count} WAVE COMPONENT${count === 1 ? '' : 'S'}`, 27, 31, '#22d3ee')
    }

    const drawUncertaintyDual = () => {
      const positionWidth = 0.035 + value / 100 * 0.28
      const momentumWidth = Math.min(0.34, 0.014 / positionWidth)
      const selectedWidth = mode === 'momentum' ? momentumWidth : positionWidth
      const color = mode === 'momentum' ? '#fb7185' : '#22d3ee'
      drawCurve(nx => gaussian(nx, 0.5, selectedWidth), height * 0.77, height * 0.5, color, true)
      text(`${mode.toUpperCase()} SPACE`, 27, 31, color, 'left', 14)
      text(mode === 'momentum' ? 'inverse width' : 'chosen width', 27, 52)
    }

    const drawStateVector = () => {
      const angle = value / 100 * Math.PI * 2
      const cx = width * 0.5
      const cy = height * 0.53
      const radius = Math.min(width, height) * 0.31
      context.beginPath()
      context.arc(cx, cy, radius, 0, Math.PI * 2)
      context.strokeStyle = '#374151'
      context.lineWidth = 2
      context.stroke()
      line(cx, cy - radius, cx, cy + radius, '#4b5563')
      line(cx - radius, cy, cx + radius, cy, '#4b5563')
      const x = cx + Math.sin(angle) * radius * 0.86
      const y = cy - Math.cos(angle) * radius * 0.86
      line(cx, cy, x, y, '#fbbf24', 7)
      dot(x, y, 10, '#fbbf24')
      line(x, y, cx, y, '#a78bfa', 2, 0.65)
      line(x, y, x, cy, '#22d3ee', 2, 0.65)
      text('|ψ〉', x + 14, y - 10, '#fbbf24', 'left', 16)
    }

    const drawAmplitudes = () => {
      const phase = value / 100 * Math.PI * 2
      const amounts = [0.68, 0.32]
      const colors = ['#a78bfa', '#22d3ee']
      const base = height * 0.78
      amounts.forEach((amount, index) => {
        const x = width * (index ? 0.68 : 0.32)
        context.fillStyle = `${colors[index]}38`
        context.fillRect(x - 43, base - amount * height * 0.48, 86, amount * height * 0.48)
        line(x - 43, base - amount * height * 0.48, x + 43, base - amount * height * 0.48, colors[index], 5)
        text(index ? '|1〉' : '|0〉', x, base + 32, colors[index], 'center', 14)
      })
      const cx = width * 0.5
      const cy = height * 0.3
      line(cx - 55, cy, cx + 55, cy, '#374151')
      line(cx, cy - 55, cx, cy + 55, '#374151')
      line(cx, cy, cx + Math.cos(phase) * 48, cy - Math.sin(phase) * 48, '#fbbf24', 5)
      dot(cx + Math.cos(phase) * 48, cy - Math.sin(phase) * 48, 7, '#fbbf24')
      text(`RELATIVE PHASE ${Math.round(value * 3.6)}°`, cx, 31, '#fbbf24', 'center')
    }

    const drawPotential = (time: number) => {
      const base = height * 0.78
      line(24, base, width - 24, base, '#4b5563')
      if (mode === 'box') {
        line(width * 0.18, base, width * 0.18, height * 0.2, '#fb7185', 7)
        line(width * 0.82, base, width * 0.82, height * 0.2, '#fb7185', 7)
      } else if (mode === 'well') {
        context.beginPath()
        for (let x = 25; x < width - 25; x += 3) {
          const nx = x / width - 0.5
          const y = base - nx * nx * height * 1.8
          if (x === 25) context.moveTo(x, y)
          else context.lineTo(x, y)
        }
        context.strokeStyle = '#fb7185'
        context.lineWidth = 5
        context.stroke()
      }
      const center = mode === 'free' ? 0.2 + (time * 0.00008) % 0.6 : 0.5
      drawCurve(nx => gaussian(nx, center, 0.1) * Math.cos(nx * 34 - time * 0.003), height * 0.55, height * 0.16, '#a78bfa')
      text(`${mode.toUpperCase()} POTENTIAL`, 27, 31, '#fb7185')
      text('V(x)', width - 27, base - 12, '#fb7185', 'right', 14)
    }

    const drawEvolution = (time: number) => {
      const speed = 0.00002 + value * 0.000002
      const center = 0.12 + (time * speed) % 0.76
      const spread = 0.08 + ((time * speed) % 0.76) * 0.08
      const baseline = height * 0.65
      drawCurve(nx => gaussian(nx, center, spread) * Math.cos(nx * 38 - time * speed * 45), baseline, height * 0.28, '#a78bfa')
      for (let index = 0; index < 5; index += 1) dot(width * (0.12 + index * 0.19), height * 0.86, 4, index <= Math.floor((time * speed * 5) % 5) ? '#34d399' : '#374151')
      text('STATE NOW → STATE LATER', 27, 31, '#34d399')
    }

    const drawEquationEngine = (time: number) => {
      const blocks = [
        { label: 'CURVATURE', x: 0.2, color: '#22d3ee', active: mode === 'kinetic' || mode === 'both' },
        { label: 'ENERGY', x: 0.5, color: '#fbbf24', active: true },
        { label: 'LOCATION', x: 0.8, color: '#fb7185', active: mode === 'potential' || mode === 'both' },
      ]
      line(width * 0.2, height * 0.5, width * 0.8, height * 0.5, '#374151', 4)
      blocks.forEach((block, index) => {
        const pulseSize = block.active ? Math.sin(time * 0.003 + index) * 3 : 0
        dot(width * block.x, height * 0.5, 42 + pulseSize, block.color, block.active ? 0.2 : 0.05)
        dot(width * block.x, height * 0.5, 22, block.active ? block.color : '#374151')
        text(block.label, width * block.x, height * 0.68, block.active ? block.color : '#6b7280', 'center', 9)
      })
      text('H |ψ〉 → CHANGE IN |ψ〉', width / 2, 33, '#34d399', 'center', 13)
    }

    const drawPrediction = (time: number) => {
      const barrierX = width * 0.56
      const barrierHeight = height * 0.42
      const base = height * 0.78
      context.fillStyle = '#fb718544'
      context.fillRect(barrierX, base - barrierHeight, width * 0.09, barrierHeight)
      line(barrierX, base - barrierHeight, barrierX + width * 0.09, base - barrierHeight, '#fb7185', 4)
      const energy = value / 100
      const center = 0.16 + (time * 0.00007) % 0.7
      const transmission = 0.12 + energy * 0.75
      drawCurve(nx => {
        const incoming = gaussian(nx, Math.min(center, 0.54), 0.08) * Math.cos(nx * 40 - time * 0.003)
        const outgoing = nx > 0.64 ? gaussian(nx, Math.max(0.66, center), 0.11) * transmission * Math.cos(nx * 40 - time * 0.003) : 0
        return incoming + outgoing
      }, height * 0.57, height * 0.2, '#a78bfa')
      line(28, base - energy * height * 0.45, width - 28, base - energy * height * 0.45, '#fbbf24', 2)
      text(`TRANSMISSION ${Math.round(transmission * 100)}%`, 27, 31, '#34d399')
    }

    const drawCheck = (time: number) => {
      const cx = width * 0.5
      const cy = height * 0.5
      for (let ring = 0; ring < 5; ring += 1) {
        context.beginPath()
        context.arc(cx, cy, 38 + ring * 29 + Math.sin(time * 0.002 + ring) * 3, 0, Math.PI * 2)
        context.strokeStyle = accent
        context.globalAlpha = 0.55 - ring * 0.08
        context.lineWidth = 2
        context.stroke()
      }
      context.globalAlpha = 1
      dot(cx, cy, 28, '#e5e7eb')
      text('?', cx, cy + 8, '#111827', 'center', 24)
    }

    const drawLanguageComplete = (time: number) => {
      const nodes = [
        { label: 'STATE', x: 0.5, y: 0.17, color: '#a78bfa' },
        { label: 'EVOLVE', x: 0.2, y: 0.5, color: '#34d399' },
        { label: 'AMPLITUDE', x: 0.8, y: 0.5, color: '#22d3ee' },
        { label: 'MEASURE', x: 0.32, y: 0.83, color: '#fb7185' },
        { label: 'RESULT', x: 0.68, y: 0.83, color: '#fbbf24' },
      ]
      ;[[0, 1], [0, 2], [1, 2], [2, 3], [3, 4]].forEach(([a, b], index) => line(width * nodes[a].x, height * nodes[a].y, width * nodes[b].x, height * nodes[b].y, index === Math.floor((time * 0.0006) % 5) ? '#e5e7eb' : '#374151', 3))
      nodes.forEach((node, index) => {
        const activeNode = index === Math.floor((time * 0.0006) % nodes.length)
        dot(width * node.x, height * node.y, activeNode ? 30 : 25, node.color, 0.18)
        dot(width * node.x, height * node.y, 13, node.color)
        text(node.label, width * node.x, height * node.y + 42, node.color, 'center', 9)
      })
    }

    const render = (time: number) => {
      frame += 1
      grid()
      if (scene === 'wavefunction-map') drawWavefunctionMap(time)
      else if (scene === 'born-rule') drawBornRule(time)
      else if (scene === 'phase-map') drawPhaseMap(time)
      else if (scene === 'superposition-state') drawSuperpositionState()
      else if (scene === 'superposition-waves') drawSuperpositionWaves(time)
      else if (scene === 'superposition-basis' || scene === 'basis-rotation') drawBasis(time)
      else if (scene === 'measurement-preparation') drawMeasurementPreparation()
      else if (scene === 'measurement-sample') drawMeasurementSample()
      else if (scene === 'measurement-collapse') drawMeasurementCollapse(time)
      else if (scene === 'uncertainty-packet') drawUncertaintyPacket()
      else if (scene === 'uncertainty-components') drawComponents(time)
      else if (scene === 'uncertainty-dual') drawUncertaintyDual()
      else if (scene === 'state-vector') drawStateVector()
      else if (scene === 'amplitude-bars') drawAmplitudes()
      else if (scene === 'potential-landscape') drawPotential(time)
      else if (scene === 'equation-evolution') drawEvolution(time)
      else if (scene === 'equation-engine') drawEquationEngine(time)
      else if (scene === 'equation-predict') drawPrediction(time)
      else if (scene === 'language-complete') drawLanguageComplete(time)
      else drawCheck(time)
      if (!reducedMotion || frame < 2) animationFrame = requestAnimationFrame(render)
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    render(performance.now())
    return () => {
      cancelAnimationFrame(animationFrame)
      observer.disconnect()
    }
  }, [accent, active, hits, mode, pulse, scene, value])

  return <canvas ref={canvasRef} className="qa-canvas" aria-label={`Animated ${scene.replace(/-/g, ' ')} quantum-language model`} />
}
