import { useEffect, useRef } from 'react'
import { EntanglementScene } from './entanglementLessons'

interface Props {
  scene: EntanglementScene
  value: number
  mode: string
  hits: number[]
  active: boolean
  pulse: number
  accent: string
}

export function EntanglementCanvas({ scene, value, mode, hits, active, pulse, accent }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    let width = 1
    let height = 1
    let animationFrame = 0
    let frame = 0
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const resize = () => {
      const bounds = canvas.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = Math.max(1, bounds.width)
      height = Math.max(1, bounds.height)
      const nextWidth = Math.round(width * ratio)
      const nextHeight = Math.round(height * ratio)
      if (canvas.width === nextWidth && canvas.height === nextHeight) return false
      canvas.width = nextWidth
      canvas.height = nextHeight
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      return true
    }

    const hash = (seed: number) => {
      const raw = Math.sin(seed * 127.1 + 311.7) * 43758.5453
      return raw - Math.floor(raw)
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

    const label = (text: string, x: number, y: number, color = '#9ca3af', align: CanvasTextAlign = 'left', size = 11) => {
      context.fillStyle = color
      context.font = `650 ${size}px ui-monospace, SFMono-Regular, Menlo, monospace`
      context.textAlign = align
      context.fillText(text, x, y)
    }

    const grid = () => {
      context.fillStyle = '#080b14'
      context.fillRect(0, 0, width, height)
      for (let x = 18; x < width; x += 28) {
        for (let y = 18; y < height; y += 28) dot(x, y, 1, '#1f2937')
      }
    }

    const glow = (x: number, y: number, radius: number, color: string, alpha = 0.18) => {
      const gradient = context.createRadialGradient(x, y, 0, x, y, radius)
      gradient.addColorStop(0, `${color}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`)
      gradient.addColorStop(1, `${color}00`)
      context.fillStyle = gradient
      context.fillRect(x - radius, y - radius, radius * 2, radius * 2)
    }

    const arrow = (x1: number, y1: number, x2: number, y2: number, color: string, size = 4) => {
      line(x1, y1, x2, y2, color, size)
      const angle = Math.atan2(y2 - y1, x2 - x1)
      line(x2, y2, x2 - Math.cos(angle - 0.55) * 12, y2 - Math.sin(angle - 0.55) * 12, color, size)
      line(x2, y2, x2 - Math.cos(angle + 0.55) * 12, y2 - Math.sin(angle + 0.55) * 12, color, size)
    }

    const roundedRect = (x: number, y: number, w: number, h: number, radius: number, fill: string, stroke = '#374151') => {
      context.beginPath()
      context.roundRect(x, y, w, h, radius)
      context.fillStyle = fill
      context.fill()
      context.strokeStyle = stroke
      context.lineWidth = 2
      context.stroke()
    }

    const drawPair = () => {
      const bits = mode.length === 2 ? mode : '00'
      const cy = height * 0.53
      const positions = [width * 0.3, width * 0.7]
      positions.forEach((x, index) => {
        const bit = bits[index]
        glow(x, cy, Math.min(width, height) * 0.18, index ? '#fb7185' : '#22d3ee')
        dot(x, cy, 54, '#111827')
        dot(x, cy, 42, bit === '0' ? '#22d3ee' : '#fb7185', 0.22)
        arrow(x, cy + 23, x, bit === '0' ? cy - 28 : cy + 28, bit === '0' ? '#22d3ee' : '#fb7185', 5)
        label(index ? 'BOB' : 'ALICE', x, cy + 88, '#9ca3af', 'center')
        label(`|${bit}>`, x, cy - 76, bit === '0' ? '#22d3ee' : '#fb7185', 'center', 16)
      })
      line(positions[0] + 58, cy, positions[1] - 58, cy, '#374151', 2)
      label(`PRODUCT STATE |${bits[0]}> x |${bits[1]}>`, width / 2, 31, accent, 'center', 13)
      label('separate descriptions', width / 2, height * 0.88, '#6b7280', 'center')
    }

    const pairProbabilities = () => {
      const correlation = value / 100
      return [0.25 + correlation * 0.25, 0.25 - correlation * 0.25, 0.25 - correlation * 0.25, 0.25 + correlation * 0.25]
    }

    const drawJointTable = (sampled = false) => {
      const outcomes = ['00', '01', '10', '11']
      const probabilities = sampled && hits.length
        ? outcomes.map((_, index) => hits.filter(hit => hit === index).length / hits.length)
        : pairProbabilities()
      const cell = Math.min(width * 0.23, height * 0.28)
      const startX = width / 2 - cell
      const startY = height / 2 - cell
      probabilities.forEach((probability, index) => {
        const column = index % 2
        const row = Math.floor(index / 2)
        const x = startX + column * cell
        const y = startY + row * cell
        context.fillStyle = index === 0 || index === 3 ? `rgba(34,211,238,${0.08 + probability})` : `rgba(251,113,133,${0.08 + probability})`
        context.fillRect(x + 4, y + 4, cell - 8, cell - 8)
        context.strokeStyle = probability > 0.35 ? accent : '#374151'
        context.lineWidth = probability > 0.35 ? 4 : 2
        context.strokeRect(x + 4, y + 4, cell - 8, cell - 8)
        label(outcomes[index], x + cell / 2, y + cell * 0.43, '#e5e7eb', 'center', 16)
        label(sampled && hits.length ? String(hits.filter(hit => hit === index).length) : `${Math.round(probability * 100)}%`, x + cell / 2, y + cell * 0.67, index === 0 || index === 3 ? '#22d3ee' : '#fb7185', 'center', 14)
      })
      label(sampled ? hits.length ? `${hits.length} JOINT OUTCOMES` : 'MEASURE THE PAIR' : `CORRELATION ${value}%`, width / 2, 31, accent, 'center', 13)
      label('Alice 0', startX - 14, startY + cell / 2, '#9ca3af', 'right')
      label('Alice 1', startX - 14, startY + cell * 1.5, '#9ca3af', 'right')
      label('Bob 0', startX + cell / 2, startY - 12, '#9ca3af', 'center')
      label('Bob 1', startX + cell * 1.5, startY - 12, '#9ca3af', 'center')
    }

    const drawEntangleBuilder = (time: number) => {
      const strength = value / 100
      const cy = height * 0.54
      const left = width * 0.27
      const right = width * 0.73
      const radius = Math.min(width, height) * 0.13
      ;[left, right].forEach((x, index) => {
        glow(x, cy, radius * 1.8, index ? '#fb7185' : '#22d3ee', 0.12 + strength * 0.12)
        context.beginPath()
        context.arc(x, cy, radius, 0, Math.PI * 2)
        context.strokeStyle = index ? '#fb7185' : '#22d3ee'
        context.globalAlpha = 1 - strength * 0.65
        context.lineWidth = 3
        context.stroke()
        context.globalAlpha = 1
        arrow(x, cy + radius * 0.55, x, cy - radius * 0.55, index ? '#fb7185' : '#22d3ee', 4)
      })
      const strands = Math.max(1, Math.round(strength * 7))
      for (let strand = 0; strand < strands; strand += 1) {
        const offset = (strand - (strands - 1) / 2) * 10
        context.beginPath()
        context.moveTo(left + radius, cy + offset)
        context.bezierCurveTo(width * 0.42, cy + Math.sin(time * 0.002 + strand) * 30, width * 0.58, cy - Math.sin(time * 0.002 + strand) * 30, right - radius, cy - offset)
        context.strokeStyle = strand % 2 ? '#a78bfa' : accent
        context.globalAlpha = 0.2 + strength * 0.7
        context.lineWidth = 2 + strength * 2
        context.stroke()
      }
      context.globalAlpha = 1
      label(strength > 0.82 ? 'ONE NONFACTORABLE JOINT STATE' : strength > 0.25 ? 'BUILDING JOINT AMPLITUDES' : 'NEARLY SEPARATE STATES', width / 2, 31, accent, 'center', 13)
      label(`ENTANGLEMENT ${value}%`, width / 2, height * 0.9, '#d1d5db', 'center')
    }

    const drawLocalRandomness = (time: number) => {
      const panels = [{ x: width * 0.28, color: '#22d3ee', name: 'ALICE' }, { x: width * 0.72, color: '#fb7185', name: 'BOB' }]
      panels.forEach((panel, side) => {
        roundedRect(panel.x - width * 0.16, height * 0.2, width * 0.32, height * 0.62, 6, '#0c111d', '#273244')
        label(panel.name, panel.x, height * 0.27, panel.color, 'center', 13)
        label(`${mode.toUpperCase()} AXIS`, panel.x, height * 0.33, '#6b7280', 'center')
        for (let index = 0; index < 12; index += 1) {
          const bit = hash(index * 13 + side * 31 + Math.floor(time * 0.00035)) > 0.5 ? 1 : 0
          const column = index % 4
          const row = Math.floor(index / 4)
          dot(panel.x - 48 + column * 32, height * 0.43 + row * 42, 10, bit ? '#fb7185' : '#22d3ee')
          label(String(bit), panel.x - 48 + column * 32, height * 0.43 + row * 42 + 4, '#08101d', 'center', 9)
        }
        label('50% 0 / 50% 1', panel.x, height * 0.76, '#9ca3af', 'center')
      })
      line(width * 0.46, height * 0.51, width * 0.54, height * 0.51, '#374151', 3)
      label('LOCAL STREAMS LOOK RANDOM', width / 2, 31, accent, 'center', 13)
    }

    const drawSharedMeasurements = () => {
      const matched = hits.filter(hit => hit === 0 || hit === 3).length
      const mismatched = hits.length - matched
      const base = height * 0.79
      const max = Math.max(1, matched, mismatched)
      const bars = [
        { x: width * 0.35, count: matched, text: 'MATCH', color: '#22d3ee' },
        { x: width * 0.65, count: mismatched, text: 'DIFFER', color: '#fb7185' },
      ]
      bars.forEach(bar => {
        const h = bar.count / max * height * 0.45
        context.fillStyle = `${bar.color}33`
        context.fillRect(bar.x - 52, base - h, 104, h)
        line(bar.x - 52, base - h, bar.x + 52, base - h, bar.color, 5)
        label(String(bar.count), bar.x, base - h - 14, bar.color, 'center', 16)
        label(bar.text, bar.x, base + 27, bar.color, 'center')
      })
      line(width * 0.2, base, width * 0.8, base, '#4b5563')
      label(hits.length ? `${hits.length} PAIRED ${mode.toUpperCase()}-AXIS MEASUREMENTS` : 'COMPARE BOTH RECORDS', width / 2, 31, accent, 'center', 13)
    }

    const drawHiddenInstructions = (time: number) => {
      const classical = mode === 'classical'
      const left = width * 0.26
      const right = width * 0.74
      const cy = height * 0.53
      ;[left, right].forEach((x, side) => {
        roundedRect(x - 72, cy - 92, 144, 184, 6, '#111827', classical ? '#fbbf24' : '#a78bfa')
        label(side ? 'BOB CARD' : 'ALICE CARD', x, cy - 61, classical ? '#fbbf24' : '#a78bfa', 'center')
        if (classical) {
          ;['setting 0 -> 0', 'setting 1 -> 1'].forEach((text, index) => label(text, x, cy - 12 + index * 42, '#d1d5db', 'center'))
        } else {
          context.beginPath()
          context.arc(x, cy + 8, 44, 0, Math.PI * 2)
          context.strokeStyle = '#a78bfa'
          context.lineWidth = 2
          context.stroke()
          const angle = time * 0.001 + side * Math.PI
          arrow(x, cy + 8, x + Math.cos(angle) * 34, cy + 8 + Math.sin(angle) * 34, '#22d3ee', 3)
          label('NO PREWRITTEN', x, cy + 71, '#9ca3af', 'center', 9)
        }
      })
      line(left + 74, cy, right - 74, cy, classical ? '#fbbf24' : '#a78bfa', 3, 0.6)
      label(classical ? 'LOCAL INSTRUCTION SHEETS' : 'SHARED QUANTUM STATE', width / 2, 31, classical ? '#fbbf24' : '#a78bfa', 'center', 13)
      label(classical ? 'Bell game ceiling: 75%' : 'Ideal quantum score: about 85%', width / 2, height * 0.9, '#d1d5db', 'center')
    }

    const drawAnalyzerAngles = () => {
      const angle = value / 100 * Math.PI / 2
      const cy = height * 0.55
      const left = width * 0.28
      const right = width * 0.72
      const radius = Math.min(width, height) * 0.2
      ;[left, right].forEach(x => {
        context.beginPath()
        context.arc(x, cy, radius, 0, Math.PI * 2)
        context.strokeStyle = '#374151'
        context.lineWidth = 2
        context.stroke()
      })
      arrow(left, cy, left, cy - radius * 0.83, '#22d3ee', 5)
      arrow(right, cy, right + Math.sin(angle) * radius * 0.83, cy - Math.cos(angle) * radius * 0.83, '#fb7185', 5)
      context.beginPath()
      context.arc(right, cy, radius * 0.35, -Math.PI / 2, -Math.PI / 2 + angle)
      context.strokeStyle = '#fbbf24'
      context.lineWidth = 4
      context.stroke()
      label('ALICE', left, cy + radius + 30, '#22d3ee', 'center')
      label('BOB', right, cy + radius + 30, '#fb7185', 'center')
      label(`RELATIVE ANGLE ${Math.round(value * 0.9)} DEG`, width / 2, 31, '#fbbf24', 'center', 13)
      label(`QUANTUM CORRELATION ${Math.round(Math.abs(Math.cos(angle * 2)) * 100)}%`, width / 2, height * 0.93, '#d1d5db', 'center')
    }

    const drawBellTrials = () => {
      const wins = hits.filter(hit => hit === 1).length
      const score = hits.length ? wins / hits.length : mode === 'quantum' ? 0.854 : 0.75
      const left = width * 0.14
      const right = width * 0.88
      const y = height * 0.58
      const classicalX = left + (right - left) * 0.75
      const scoreX = left + (right - left) * score
      line(left, y, right, y, '#374151', 14)
      line(left, y, classicalX, y, '#fbbf24', 14, 0.45)
      if (score > 0.75) line(classicalX, y, scoreX, y, '#a78bfa', 14)
      line(classicalX, y - 45, classicalX, y + 45, '#fbbf24', 3)
      glow(scoreX, y, 46, mode === 'quantum' ? '#a78bfa' : '#fbbf24')
      dot(scoreX, y, 16, mode === 'quantum' ? '#a78bfa' : '#fbbf24')
      label('0%', left, y + 38, '#6b7280', 'center')
      label('LOCAL LIMIT 75%', classicalX, y - 61, '#fbbf24', 'center')
      label('100%', right, y + 38, '#6b7280', 'center')
      label(hits.length ? `${wins} WINS / ${hits.length} TRIALS = ${Math.round(score * 100)}%` : 'RUN THE BELL GAME', width / 2, 31, score > 0.75 ? '#a78bfa' : '#fbbf24', 'center', 13)
      label(mode === 'quantum' ? 'QUANTUM STRATEGY' : 'LOCAL CLASSICAL STRATEGY', width / 2, height * 0.84, '#d1d5db', 'center')
    }

    const drawPhaseBranches = (time: number) => {
      const coupling = value / 100
      const left = width * 0.12
      const right = width * 0.88
      const centerY = height * 0.52
      const branchGap = height * 0.2
      for (let branch = -1; branch <= 1; branch += 2) {
        context.beginPath()
        for (let x = left; x <= right; x += 3) {
          const progress = (x - left) / (right - left)
          const y = centerY + branch * branchGap * Math.sin(progress * Math.PI / 2) + Math.sin(progress * 26 - time * 0.003) * 13 * (1 - coupling * progress)
          if (x === left) context.moveTo(x, y)
          else context.lineTo(x, y)
        }
        context.strokeStyle = branch < 0 ? '#22d3ee' : '#fb7185'
        context.lineWidth = 4
        context.stroke()
      }
      const records = Math.round(coupling * 14)
      for (let index = 0; index < records; index += 1) {
        const x = width * (0.48 + hash(index) * 0.42)
        const y = centerY + (hash(index + 23) - 0.5) * height * 0.65
        dot(x, y, 5, index % 2 ? '#34d399' : '#fbbf24', 0.7)
        line(x, y, width * 0.72, centerY + (index % 2 ? branchGap : -branchGap), '#374151', 1, 0.4)
      }
      label(`ENVIRONMENTAL COUPLING ${value}%`, width / 2, 31, '#34d399', 'center', 13)
      label(coupling < 0.3 ? 'PHASE RELATIONSHIP ACCESSIBLE' : 'PHASE SPREADING INTO ENVIRONMENT', width / 2, height * 0.93, '#d1d5db', 'center')
    }

    const drawEnvironmentRecord = (time: number) => {
      const count = Math.max(1, Math.round(value))
      const cx = width * 0.5
      const cy = height * 0.52
      const systemRadius = Math.min(width, height) * 0.12
      glow(cx, cy, systemRadius * 2, accent)
      dot(cx, cy, systemRadius, '#111827')
      label('SYSTEM', cx, cy + 4, '#e5e7eb', 'center')
      for (let index = 0; index < count; index += 1) {
        const angle = index / count * Math.PI * 2 + time * 0.00008
        const ring = 1.8 + (index % 3) * 0.56
        const x = cx + Math.cos(angle) * systemRadius * ring
        const y = cy + Math.sin(angle) * systemRadius * ring
        line(cx + Math.cos(angle) * systemRadius, cy + Math.sin(angle) * systemRadius, x, y, index % 2 ? '#22d3ee' : '#fb7185', 1.5, 0.35)
        dot(x, y, 5 + index % 3, index % 2 ? '#22d3ee' : '#fb7185', 0.8)
      }
      label(`${count} ENVIRONMENTAL RECORD${count === 1 ? '' : 'S'}`, width / 2, 31, '#34d399', 'center', 13)
      label('which-branch information spreads outward', width / 2, height * 0.94, '#9ca3af', 'center')
    }

    const drawInterferenceDecay = () => {
      const coherence = 1 - value / 100
      const bars = 25
      const left = width * 0.16
      const right = width * 0.84
      const top = height * 0.18
      const bottom = height * 0.84
      for (let index = 0; index < bars; index += 1) {
        const progress = index / (bars - 1)
        const interference = (0.5 + Math.cos(progress * Math.PI * 10) * 0.45 * coherence)
        const x = left + progress * (right - left)
        const barWidth = (right - left) / bars + 1
        const gradient = context.createLinearGradient(0, top, 0, bottom)
        gradient.addColorStop(0, `rgba(34,211,238,${0.08 + interference * 0.75})`)
        gradient.addColorStop(1, `rgba(167,139,250,${0.04 + interference * 0.35})`)
        context.fillStyle = gradient
        context.fillRect(x, top, barWidth, bottom - top)
      }
      line(left, bottom, right, bottom, '#4b5563')
      label(`DECOHERENCE ${value}%`, width / 2, 31, '#34d399', 'center', 13)
      label(`INTERFERENCE VISIBILITY ${Math.round(coherence * 100)}%`, width / 2, height * 0.92, coherence > 0.5 ? '#22d3ee' : '#9ca3af', 'center')
    }

    const drawCatApparatus = (time: number) => {
      const chance = value / 100
      const y = height * 0.55
      const nodes = [
        { x: 0.12, text: 'ATOM', color: '#a78bfa' },
        { x: 0.34, text: 'DETECTOR', color: '#22d3ee' },
        { x: 0.57, text: 'RELAY', color: '#fbbf24' },
        { x: 0.82, text: 'CAT RECORD', color: '#fb7185' },
      ]
      nodes.forEach((node, index) => {
        const x = width * node.x
        glow(x, y, 38, node.color, 0.12)
        dot(x, y, index === 3 ? 30 : 22, node.color, 0.22)
        dot(x, y, index === 3 ? 13 : 9, node.color)
        label(node.text, x, y + 51, node.color, 'center', 9)
        if (index < nodes.length - 1) arrow(x + 30, y, width * nodes[index + 1].x - 30, y, '#4b5563', 3)
      })
      const travel = (time * 0.00025) % 1
      const signalX = width * (nodes[0].x + (nodes[3].x - nodes[0].x) * travel)
      dot(signalX, y - 29, 5, chance > travel ? '#fb7185' : '#34d399')
      label(`DECAY CHANCE ${value}%`, width / 2, 31, accent, 'center', 13)
      label('microscopic event -> amplified macroscopic record', width / 2, height * 0.9, '#9ca3af', 'center')
    }

    const drawCatBranches = (time: number) => {
      if (mode === 'system') {
        drawCatApparatus(time)
        label('APPARATUS VIEW', width / 2, height * 0.18, '#22d3ee', 'center')
        return
      }
      const startX = width * 0.16
      const splitX = width * 0.46
      const endX = width * 0.84
      const cy = height * 0.52
      const gap = height * 0.21
      line(startX, cy, splitX, cy, '#a78bfa', 5)
      context.beginPath()
      context.moveTo(splitX, cy)
      context.bezierCurveTo(width * 0.58, cy, width * 0.62, cy - gap, endX, cy - gap)
      context.strokeStyle = '#34d399'
      context.lineWidth = 5
      context.stroke()
      context.beginPath()
      context.moveTo(splitX, cy)
      context.bezierCurveTo(width * 0.58, cy, width * 0.62, cy + gap, endX, cy + gap)
      context.strokeStyle = '#fb7185'
      context.lineWidth = 5
      context.stroke()
      dot(startX, cy, 18, '#a78bfa')
      dot(endX, cy - gap, 22, '#34d399')
      dot(endX, cy + gap, 22, '#fb7185')
      label('JOINT STATE', startX, cy + 48, '#a78bfa', 'center')
      label('NO DECAY / LIVE RECORD', endX, cy - gap - 38, '#34d399', 'center', 9)
      label('DECAY / DEAD RECORD', endX, cy + gap + 45, '#fb7185', 'center', 9)
      label('CORRELATED BRANCH VIEW', width / 2, 31, accent, 'center', 13)
    }

    const drawCatEnvironment = (time: number) => {
      const contact = value / 100
      const left = width * 0.29
      const right = width * 0.71
      const cy = height * 0.52
      const radius = Math.min(width, height) * 0.13
      ;[{ x: left, color: '#34d399', text: 'LIVE RECORD' }, { x: right, color: '#fb7185', text: 'DEAD RECORD' }].forEach((branch, branchIndex) => {
        glow(branch.x, cy, radius * 1.5, branch.color, 0.14)
        dot(branch.x, cy, radius, branch.color, 0.2)
        label(branch.text, branch.x, cy + radius + 32, branch.color, 'center', 9)
        const records = Math.round(contact * 18)
        for (let index = 0; index < records; index += 1) {
          const angle = index / Math.max(1, records) * Math.PI * 2 + time * 0.0001 * (branchIndex ? -1 : 1)
          const distance = radius * (1.7 + (index % 3) * 0.36)
          const x = branch.x + Math.cos(angle) * distance
          const y = cy + Math.sin(angle) * distance
          line(branch.x, cy, x, y, branch.color, 1, 0.25)
          dot(x, y, 4, branch.color, 0.65)
        }
      })
      line(left + radius, cy, right - radius, cy, '#a78bfa', 4, Math.max(0.04, 1 - contact))
      label(`ENVIRONMENTAL CONTACT ${value}%`, width / 2, 31, accent, 'center', 13)
      label(`BRANCH INTERFERENCE ${Math.round((1 - contact) * 100)}%`, width / 2, height * 0.93, contact > 0.8 ? '#6b7280' : '#a78bfa', 'center')
    }

    const drawCheck = (time: number) => {
      const cx = width / 2
      const cy = height * 0.52
      for (let ring = 0; ring < 4; ring += 1) {
        context.beginPath()
        context.arc(cx, cy, 42 + ring * 34 + Math.sin(time * 0.002 + ring) * 4, 0, Math.PI * 2)
        context.strokeStyle = ring % 2 ? '#a78bfa' : accent
        context.globalAlpha = 0.52 - ring * 0.08
        context.lineWidth = 2
        context.stroke()
      }
      context.globalAlpha = 1
      dot(cx, cy, 29, '#e5e7eb')
      label('?', cx, cy + 8, '#111827', 'center', 24)
      label('TEST THE JOINT MODEL', cx, 31, accent, 'center', 13)
    }

    const drawComplete = (time: number) => {
      const nodes = [
        { text: 'JOINT STATE', x: 0.5, y: 0.14, color: '#22d3ee' },
        { text: 'ENTANGLE', x: 0.18, y: 0.45, color: '#a78bfa' },
        { text: 'BELL TEST', x: 0.82, y: 0.45, color: '#fbbf24' },
        { text: 'ENVIRONMENT', x: 0.28, y: 0.8, color: '#34d399' },
        { text: 'CLASSICAL VIEW', x: 0.72, y: 0.8, color: '#fb7185' },
      ]
      ;[[0, 1], [0, 2], [1, 3], [2, 3], [3, 4]].forEach(([a, b], index) => line(width * nodes[a].x, height * nodes[a].y, width * nodes[b].x, height * nodes[b].y, index === Math.floor((time * 0.0007) % 5) ? '#e5e7eb' : '#374151', 3))
      nodes.forEach((node, index) => {
        const highlighted = index === Math.floor((time * 0.0007) % nodes.length)
        glow(width * node.x, height * node.y, highlighted ? 48 : 35, node.color)
        dot(width * node.x, height * node.y, highlighted ? 18 : 14, node.color)
        label(node.text, width * node.x, height * node.y + 37, node.color, 'center', 9)
      })
    }

    const render = (time: number) => {
      frame += 1
      grid()
      if (scene === 'pair-register') drawPair()
      else if (scene === 'joint-probabilities') drawJointTable()
      else if (scene === 'correlation-sample') drawJointTable(true)
      else if (scene === 'entangle-builder') drawEntangleBuilder(time)
      else if (scene === 'local-randomness') drawLocalRandomness(time)
      else if (scene === 'shared-measurements') drawSharedMeasurements()
      else if (scene === 'hidden-instructions') drawHiddenInstructions(time)
      else if (scene === 'analyzer-angles') drawAnalyzerAngles()
      else if (scene === 'bell-trials') drawBellTrials()
      else if (scene === 'phase-branches') drawPhaseBranches(time)
      else if (scene === 'environment-record') drawEnvironmentRecord(time)
      else if (scene === 'interference-decay') drawInterferenceDecay()
      else if (scene === 'cat-apparatus') drawCatApparatus(time)
      else if (scene === 'cat-branches') drawCatBranches(time)
      else if (scene === 'cat-environment') drawCatEnvironment(time)
      else if (scene === 'entanglement-complete') drawComplete(time)
      else drawCheck(time)
      if (!reducedMotion || frame < 2) animationFrame = requestAnimationFrame(render)
    }

    resize()
    const observer = new ResizeObserver(() => {
      if (resize()) render(performance.now())
    })
    observer.observe(canvas)
    render(performance.now())
    return () => {
      cancelAnimationFrame(animationFrame)
      observer.disconnect()
    }
  }, [accent, active, hits, mode, pulse, scene, value])

  return <canvas ref={canvasRef} className="qa-canvas" aria-label={`Animated ${scene.replace(/-/g, ' ')} entanglement model`} />
}
