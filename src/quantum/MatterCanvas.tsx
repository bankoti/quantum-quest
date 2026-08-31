import { useEffect, useRef } from 'react'
import { MatterScene } from './matterLessons'

interface Props {
  scene: MatterScene
  value: number
  mode: string
  hits: number[]
  active: boolean
  pulse: number
  accent: string
}

const ELEMENTS = [
  ['H', 1, 1, 1], ['He', 18, 1, 2],
  ['Li', 1, 2, 1], ['Be', 2, 2, 2], ['B', 13, 2, 3], ['C', 14, 2, 4], ['N', 15, 2, 5], ['O', 16, 2, 6], ['F', 17, 2, 7], ['Ne', 18, 2, 8],
  ['Na', 1, 3, 1], ['Mg', 2, 3, 2], ['Al', 13, 3, 3], ['Si', 14, 3, 4], ['P', 15, 3, 5], ['S', 16, 3, 6], ['Cl', 17, 3, 7], ['Ar', 18, 3, 8],
] as const

export function MatterCanvas({ scene, value, mode, hits, active, pulse, accent }: Props) {
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
      line(x2, y2, x2 - Math.cos(angle - 0.55) * 13, y2 - Math.sin(angle - 0.55) * 13, color, size)
      line(x2, y2, x2 - Math.cos(angle + 0.55) * 13, y2 - Math.sin(angle + 0.55) * 13, color, size)
    }

    const wavePath = (left: number, right: number, baseline: number, amplitude: number, nodes: number, phase = 0, color = accent, alpha = 1) => {
      context.save()
      context.globalAlpha = alpha
      context.beginPath()
      for (let x = left; x <= right; x += 2) {
        const progress = (x - left) / Math.max(1, right - left)
        const y = baseline - Math.sin(progress * Math.PI * nodes) * Math.cos(phase) * amplitude
        if (x === left) context.moveTo(x, y)
        else context.lineTo(x, y)
      }
      context.strokeStyle = color
      context.lineWidth = 4
      context.stroke()
      context.restore()
    }

    const drawBox = (time: number, energyView = false) => {
      const n = Math.max(1, Math.round(value))
      if (energyView) {
        const left = width * 0.18
        const right = width * 0.82
        const base = height * 0.84
        for (let level = 1; level <= 5; level += 1) {
          const y = base - (level * level / 27) * height * 0.69
          const selected = level === n
          line(left, y, right, y, selected ? accent : '#374151', selected ? 5 : 2)
          label(`n=${level}`, left - 13, y + 4, selected ? accent : '#6b7280', 'right')
          label(`E proportional to ${level * level}`, right + 12, y + 4, selected ? '#fbbf24' : '#6b7280')
          if (selected) {
            glow(width * 0.5, y, Math.min(width, height) * 0.18, accent)
            wavePath(left, right, y, 16, level, time * 0.002, accent)
          }
        }
        label('DISCRETE ENERGY LADDER', width / 2, 31, '#fbbf24', 'center', 13)
        return
      }

      const boxRatio = scene === 'box-boundary' ? 0.35 + value / 100 * 0.45 : 0.72
      const left = width * (0.5 - boxRatio / 2)
      const right = width * (0.5 + boxRatio / 2)
      const baseline = height * 0.58
      context.fillStyle = '#fb71850d'
      context.fillRect(left, height * 0.18, right - left, height * 0.66)
      line(left, height * 0.16, left, height * 0.84, '#fb7185', 8)
      line(right, height * 0.16, right, height * 0.84, '#fb7185', 8)
      line(left, baseline, right, baseline, '#374151', 2)
      wavePath(left, right, baseline, height * 0.24, scene === 'box-boundary' ? 2 : n, time * 0.002, accent)
      const nodeCount = scene === 'box-boundary' ? 1 : Math.max(0, n - 1)
      for (let index = 1; index <= nodeCount; index += 1) {
        const x = left + (right - left) * index / (nodeCount + 1)
        line(x, baseline - 14, x, baseline + 14, '#fbbf24', 2)
      }
      label(scene === 'box-boundary' ? `BOX WIDTH ${Math.round(boxRatio * 100)}` : `MODE n=${n} / ${nodeCount} NODE${nodeCount === 1 ? '' : 'S'}`, width / 2, 31, accent, 'center', 13)
      label('psi = 0', left, height * 0.9, '#fb7185', 'center')
      label('psi = 0', right, height * 0.9, '#fb7185', 'center')
    }

    const drawBarrier = (time: number, kind: 'build' | 'wave' | 'rate') => {
      const base = height * 0.82
      const barrierHeight = kind === 'build' ? (0.18 + value / 100 * 0.55) * height : height * 0.5
      const barrierWidth = kind === 'rate' ? width * (0.04 + value / 100 * 0.28) : width * 0.13
      const left = width * 0.55 - barrierWidth / 2
      const right = left + barrierWidth
      context.fillStyle = '#fb718534'
      context.fillRect(left, base - barrierHeight, barrierWidth, barrierHeight)
      line(left, base - barrierHeight, right, base - barrierHeight, '#fb7185', 4)
      line(25, base, width - 25, base, '#4b5563')

      const energy = kind === 'wave' ? value / 100 : 0.42
      const energyY = base - energy * height * 0.55
      line(25, energyY, width - 25, energyY, '#fbbf24', 2)
      label('E', 30, energyY - 8, '#fbbf24')

      if (kind === 'build') {
        const particleX = width * 0.2 + ((time * 0.00012) % 0.23) * width
        glow(particleX, energyY, 42, '#22d3ee')
        dot(particleX, energyY, 10, '#22d3ee')
        arrow(particleX - 36, energyY, particleX - 15, energyY, '#22d3ee', 3)
        label(value > 58 ? 'CLASSICALLY BLOCKED' : 'ENOUGH ENERGY', width / 2, 31, value > 58 ? '#fb7185' : '#34d399', 'center', 13)
        return
      }

      const transmission = Math.max(0.02, Math.exp(-(barrierWidth / width) * 12) * (0.18 + energy * 1.25))
      const phase = time * 0.004
      context.beginPath()
      for (let x = 24; x < width - 24; x += 2) {
        const nx = x / width
        let amplitude = 1
        if (x >= left && x <= right) amplitude = Math.exp(-((x - left) / Math.max(1, barrierWidth)) * (kind === 'rate' ? 5 : 3))
        else if (x > right) amplitude = transmission
        const y = height * 0.55 - Math.sin(nx * 38 - phase) * height * 0.17 * amplitude
        if (x === 24) context.moveTo(x, y)
        else context.lineTo(x, y)
      }
      context.strokeStyle = '#a78bfa'
      context.lineWidth = 4
      context.stroke()
      const observed = hits.length ? hits.filter(hit => hit === 1).length / hits.length : transmission
      label(kind === 'rate' ? hits.length ? `OBSERVED ${Math.round(observed * 100)}% / MODEL ${Math.round(transmission * 100)}%` : `MODEL TRANSMISSION ${Math.round(transmission * 100)}%` : 'AMPLITUDE DECAYS, THEN CONTINUES', width / 2, 31, transmission > 0.2 ? '#34d399' : '#a78bfa', 'center', 13)
      if (kind === 'rate') {
        const barWidth = width * 0.28
        context.fillStyle = '#1f2937'
        context.fillRect(width * 0.68, height * 0.9, barWidth, 7)
        context.fillStyle = '#34d399'
        context.fillRect(width * 0.68, height * 0.9, barWidth * Math.min(1, observed), 7)
      }
    }

    const orbitalPoint = (seed: number, shape: string, scale: number) => {
      const a = hash(seed + 1) * Math.PI * 2
      const r = Math.sqrt(-Math.log(Math.max(0.005, hash(seed + 2)))) * scale
      const z = hash(seed + 3) * 2 - 1
      if (shape === 'p') {
        const side = hash(seed + 4) > 0.5 ? 1 : -1
        return { x: side * (scale * 0.32 + r * 0.5), y: Math.sin(a) * r * 0.42, z, color: side > 0 ? '#22d3ee' : '#fb7185' }
      }
      if (shape === 'd') {
        const lobe = Math.floor(hash(seed + 4) * 4)
        const signs = [[1, 1], [-1, 1], [-1, -1], [1, -1]][lobe]
        return { x: signs[0] * (scale * 0.22 + r * 0.38), y: signs[1] * (scale * 0.16 + r * 0.3), z, color: lobe % 2 ? '#fbbf24' : '#c084fc' }
      }
      return { x: Math.cos(a) * r * 0.48, y: Math.sin(a) * r * 0.38, z, color: '#22d3ee' }
    }

    const drawOrbitalCloud = (time: number, measured = false) => {
      const cx = width * 0.5
      const cy = height * 0.53
      const scale = Math.min(width, height) * 0.38
      glow(cx, cy, scale * 0.9, mode === 'p' ? '#a78bfa' : accent, 0.12)
      const points = measured ? hits : Array.from({ length: 240 }, (_, index) => index / 241)
      points.forEach((hit, index) => {
        const seed = measured ? hit * 100000 + index * 0.17 : index * 1.73
        const point = orbitalPoint(seed, mode, scale)
        const rotation = time * 0.00012
        const x = point.x * Math.cos(rotation) - point.z * scale * 0.18 * Math.sin(rotation)
        const depth = point.x * Math.sin(rotation) + point.z * scale * 0.18 * Math.cos(rotation)
        dot(cx + x, cy + point.y, measured ? 3.2 : 2.2, point.color, measured ? 0.9 : 0.25 + (depth / scale + 0.2) * 0.4)
      })
      dot(cx, cy, 9, '#fbbf24')
      label(measured ? `${hits.length} DETECTIONS` : `${mode.toUpperCase()} ORBITAL PROBABILITY CLOUD`, width / 2, 31, accent, 'center', 13)
      if (measured && !hits.length) label('SAMPLE THE STATE TO BUILD THE CLOUD', width / 2, height * 0.9, '#6b7280', 'center')
    }

    const drawRadialNodes = () => {
      const level = Math.max(1, Math.round(value))
      const cx = width * 0.31
      const cy = height * 0.53
      const maxRadius = Math.min(width * 0.25, height * 0.35)
      for (let ring = level; ring >= 1; ring -= 1) {
        const radius = maxRadius * ring / level
        context.beginPath()
        context.arc(cx, cy, radius, 0, Math.PI * 2)
        context.fillStyle = ring % 2 ? '#22d3ee18' : '#fb718518'
        context.fill()
        context.strokeStyle = ring % 2 ? '#22d3ee' : '#fb7185'
        context.globalAlpha = 0.7
        context.stroke()
      }
      context.globalAlpha = 1
      dot(cx, cy, 7, '#fbbf24')
      const graphLeft = width * 0.58
      const graphRight = width * 0.94
      const baseline = height * 0.55
      line(graphLeft, baseline, graphRight, baseline, '#4b5563')
      context.beginPath()
      for (let x = graphLeft; x <= graphRight; x += 2) {
        const r = (x - graphLeft) / (graphRight - graphLeft)
        const y = baseline - Math.exp(-r * 2) * Math.cos(r * level * Math.PI) * height * 0.25
        if (x === graphLeft) context.moveTo(x, y)
        else context.lineTo(x, y)
      }
      context.strokeStyle = accent
      context.lineWidth = 4
      context.stroke()
      label(`LEVEL ${level}: ${Math.max(0, level - 1)} RADIAL NODE${level === 2 ? '' : 'S'}`, width / 2, 31, accent, 'center', 13)
    }

    const drawSternGerlach = (time: number) => {
      const angle = (value / 100 - 0.5) * Math.PI
      const sourceX = width * 0.08
      const midX = width * 0.48
      const screenX = width * 0.88
      const cy = height * 0.53
      context.fillStyle = '#374151'
      context.fillRect(sourceX, cy - 22, 32, 44)
      line(sourceX + 32, cy, midX, cy, '#fbbf24', 4)
      const travel = (time * 0.00025) % 1
      dot(sourceX + 35 + (midX - sourceX - 35) * travel, cy, 7, '#fbbf24')
      context.save()
      context.translate(midX, cy)
      context.rotate(angle)
      context.fillStyle = '#22d3ee28'
      context.fillRect(-28, -70, 56, 140)
      line(0, -70, 0, 70, '#22d3ee', 3)
      context.restore()
      line(midX, cy, screenX, cy - height * 0.22, '#fb7185', 4)
      line(midX, cy, screenX, cy + height * 0.22, '#a78bfa', 4)
      line(screenX, height * 0.2, screenX, height * 0.86, '#4b5563', 7)
      dot(screenX, cy - height * 0.22, 14, '#fb7185')
      dot(screenX, cy + height * 0.22, 14, '#a78bfa')
      label('SPIN +', screenX - 18, cy - height * 0.22 - 24, '#fb7185', 'right')
      label('SPIN -', screenX - 18, cy + height * 0.22 + 30, '#a78bfa', 'right')
      label(`MAGNET AXIS ${Math.round(value * 1.8 - 90)} DEG`, width / 2, 31, '#fbbf24', 'center', 13)
    }

    const drawSpinState = () => {
      const angle = value / 100 * Math.PI * 2
      const cx = width * 0.5
      const cy = height * 0.53
      const radius = Math.min(width, height) * 0.31
      context.beginPath()
      context.ellipse(cx, cy, radius, radius * 0.42, 0, 0, Math.PI * 2)
      context.strokeStyle = '#374151'
      context.lineWidth = 2
      context.stroke()
      context.beginPath()
      context.arc(cx, cy, radius, 0, Math.PI * 2)
      context.stroke()
      line(cx, cy - radius, cx, cy + radius, '#4b5563')
      const x = cx + Math.sin(angle) * radius * 0.82
      const y = cy - Math.cos(angle) * radius * 0.82
      arrow(cx, cy, x, y, '#fbbf24', 5)
      dot(x, y, 9, '#fbbf24')
      label('UP', cx, cy - radius - 14, '#fb7185', 'center')
      label('DOWN', cx, cy + radius + 24, '#a78bfa', 'center')
      label('SPIN STATE: A DIRECTION IN STATE SPACE', width / 2, 31, '#fbbf24', 'center', 13)
    }

    const drawSpinMeasurements = () => {
      const up = hits.filter(hit => hit === 1).length
      const down = hits.length - up
      const max = Math.max(1, up, down)
      const base = height * 0.8
      const barHeight = height * 0.48
      const bars = [{ label: 'SPIN +', count: up, x: width * 0.34, color: '#fb7185' }, { label: 'SPIN -', count: down, x: width * 0.66, color: '#a78bfa' }]
      bars.forEach(bar => {
        context.fillStyle = `${bar.color}33`
        context.fillRect(bar.x - 48, base - bar.count / max * barHeight, 96, bar.count / max * barHeight)
        line(bar.x - 48, base - bar.count / max * barHeight, bar.x + 48, base - bar.count / max * barHeight, bar.color, 5)
        label(String(bar.count), bar.x, base - bar.count / max * barHeight - 14, bar.color, 'center', 16)
        label(bar.label, bar.x, base + 27, bar.color, 'center')
      })
      line(width * 0.2, base, width * 0.8, base, '#4b5563')
      label(hits.length ? `${hits.length} ${mode.toUpperCase()}-AXIS OUTCOMES` : 'MEASURE ALONG Z OR X', width / 2, 31, accent, 'center', 13)
    }

    const drawParticleExchange = (time: number) => {
      const phase = (time * 0.0003) % 1
      const left = width * 0.18
      const right = width * 0.82
      const top = height * 0.34
      const bottom = height * 0.7
      const xA = left + (right - left) * phase
      const xB = right - (right - left) * phase
      const yA = top + (bottom - top) * phase
      const yB = bottom - (bottom - top) * phase
      line(left, top, right, bottom, '#22d3ee', 2, 0.45)
      line(left, bottom, right, top, '#fb7185', 2, 0.45)
      glow(xA, yA, 35, '#22d3ee')
      glow(xB, yB, 35, '#fb7185')
      dot(xA, yA, 13, '#22d3ee')
      dot(xB, yB, 13, '#fb7185')
      label(mode === 'boson' ? 'EXCHANGE: SAME AMPLITUDE SIGN' : 'EXCHANGE: AMPLITUDE SIGN FLIPS', width / 2, 31, mode === 'boson' ? '#34d399' : '#c084fc', 'center', 13)
      label('1', left, top - 23, '#22d3ee', 'center')
      label('2', left, bottom + 30, '#fb7185', 'center')
      label('?', right, top - 23, '#d1d5db', 'center')
      label('?', right, bottom + 30, '#d1d5db', 'center')
    }

    const orbitalBox = (x: number, y: number, size: number, occupants: number, color = accent) => {
      context.fillStyle = '#111827'
      context.fillRect(x, y, size, size)
      context.strokeStyle = occupants ? color : '#374151'
      context.lineWidth = 2
      context.strokeRect(x, y, size, size)
      if (occupants >= 1) arrow(x + size * 0.35, y + size * 0.76, x + size * 0.35, y + size * 0.25, '#fb7185', 3)
      if (occupants >= 2) arrow(x + size * 0.68, y + size * 0.25, x + size * 0.68, y + size * 0.76, '#22d3ee', 3)
    }

    const drawOccupancy = () => {
      const count = Math.max(1, Math.round(value))
      const slots = 5
      const size = Math.min(64, width * 0.115)
      const gap = 10
      const startX = (width - slots * size - (slots - 1) * gap) / 2
      for (let slot = 0; slot < slots; slot += 1) {
        const occupants = Math.max(0, Math.min(2, count - slot * 2))
        orbitalBox(startX + slot * (size + gap), height * 0.46, size, occupants)
        label(`state ${slot + 1}`, startX + slot * (size + gap) + size / 2, height * 0.46 + size + 24, '#6b7280', 'center', 8)
      }
      label(`${count} FERMION${count === 1 ? '' : 'S'} / MAX TWO PER ORBITAL`, width / 2, 31, accent, 'center', 13)
      label('Opposite spin makes the paired states different', width / 2, height * 0.82, '#9ca3af', 'center')
    }

    const drawStatistics = () => {
      const boson = mode === 'boson'
      const count = 8
      if (boson) {
        glow(width / 2, height * 0.56, Math.min(width, height) * 0.26, '#34d399')
        for (let index = 0; index < count; index += 1) {
          const angle = index / count * Math.PI * 2
          dot(width / 2 + Math.cos(angle) * 32, height * 0.56 + Math.sin(angle) * 32, 13, '#34d399')
        }
        label('BOSONS CAN SHARE ONE STATE', width / 2, 31, '#34d399', 'center', 13)
        label('laser light / condensates', width / 2, height * 0.78, '#9ca3af', 'center')
      } else {
        for (let index = 0; index < count; index += 1) {
          const row = Math.floor(index / 2)
          const y = height * 0.76 - row * height * 0.15
          line(width * 0.28, y, width * 0.72, y, index < 2 ? accent : '#374151', 3)
          dot(width * (index % 2 ? 0.57 : 0.43), y - 12, 11, index % 2 ? '#22d3ee' : '#fb7185')
        }
        label('FERMIONS BUILD AN ENERGY LADDER', width / 2, 31, '#c084fc', 'center', 13)
        label('atoms / matter structure', width / 2, height * 0.9, '#9ca3af', 'center')
      }
    }

    const shellCapacity = (electron: number) => electron <= 2 ? 0 : electron <= 10 ? 1 : 2

    const drawShells = (time: number) => {
      const count = Math.max(1, Math.min(18, Math.round(value)))
      const cx = width / 2
      const cy = height * 0.54
      const maxRadius = Math.min(width, height) * 0.36
      dot(cx, cy, 18, '#fbbf24')
      ;[2, 8, 8].forEach((capacity, shell) => {
        const radius = maxRadius * (shell + 1) / 3
        context.beginPath()
        context.arc(cx, cy, radius, 0, Math.PI * 2)
        context.strokeStyle = ['#22d3ee', '#a78bfa', '#34d399'][shell]
        context.globalAlpha = 0.45
        context.stroke()
        context.globalAlpha = 1
        const occupied = Array.from({ length: count }, (_, index) => index + 1).filter(electron => shellCapacity(electron) === shell).length
        for (let electron = 0; electron < occupied; electron += 1) {
          const angle = electron / capacity * Math.PI * 2 + time * (0.00025 - shell * 0.000045)
          dot(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius, 6, '#e5e7eb')
        }
      })
      label(`${count} ELECTRON${count === 1 ? '' : 'S'} / ${ELEMENTS[count - 1][0]}`, width / 2, 31, accent, 'center', 13)
      label(count <= 2 ? 'SHELL 1' : count <= 10 ? 'SHELLS 1-2' : 'SHELLS 1-3', width / 2, height * 0.94, '#9ca3af', 'center')
    }

    const drawPauliBuilder = () => {
      const count = Math.max(1, Math.min(6, Math.round(value)))
      const size = Math.min(86, width * 0.18)
      const gap = 18
      const startX = (width - size * 3 - gap * 2) / 2
      for (let box = 0; box < 3; box += 1) {
        let occupants = 0
        if (count > box) occupants = 1
        if (count > box + 3) occupants = 2
        orbitalBox(startX + box * (size + gap), height * 0.42, size, occupants, '#34d399')
        label(['p(x)', 'p(y)', 'p(z)'][box], startX + box * (size + gap) + size / 2, height * 0.42 + size + 28, '#9ca3af', 'center')
      }
      label(`${count} ELECTRON${count === 1 ? '' : 'S'} IN THREE p ORBITALS`, width / 2, 31, '#34d399', 'center', 13)
      label(count <= 3 ? 'Fill singly before pairing' : 'Pair only after every orbital is occupied', width / 2, height * 0.84, '#fbbf24', 'center')
    }

    const drawPeriodicBuilder = () => {
      const selected = Math.max(1, Math.min(18, Math.round(value)))
      const cellW = Math.min(46, (width - 42) / 18)
      const cellH = Math.min(52, height * 0.18)
      const left = (width - cellW * 18) / 2
      const top = height * 0.25
      ELEMENTS.forEach(([symbol, group, period, valence], index) => {
        const x = left + (group - 1) * cellW
        const y = top + (period - 1) * (cellH + 7)
        const filled = index + 1 <= selected
        const current = index + 1 === selected
        context.fillStyle = current ? '#34d39944' : filled ? '#111827' : '#0b0f19'
        context.fillRect(x + 2, y, cellW - 4, cellH)
        context.strokeStyle = current ? '#34d399' : filled ? '#4b5563' : '#1f2937'
        context.lineWidth = current ? 3 : 1
        context.strokeRect(x + 2, y, cellW - 4, cellH)
        label(symbol, x + cellW / 2, y + cellH * 0.59, current ? '#e5e7eb' : filled ? '#9ca3af' : '#374151', 'center', current ? 14 : 10)
      })
      const [symbol, group, period, valence] = ELEMENTS[selected - 1]
      label(`ELEMENT ${selected}: ${symbol}`, width / 2, 31, '#34d399', 'center', 13)
      label(`period ${period} / group ${group} / ${valence} valence electron${valence === 1 ? '' : 's'}`, width / 2, height * 0.89, '#d1d5db', 'center')
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
      label('CONNECT THE EVIDENCE', cx, 31, accent, 'center', 13)
    }

    const drawComplete = (time: number) => {
      const nodes = [
        { text: 'BOUNDARY', x: 0.5, y: 0.14, color: '#fb7185' },
        { text: 'ORBITAL', x: 0.19, y: 0.43, color: '#22d3ee' },
        { text: 'SPIN', x: 0.81, y: 0.43, color: '#fbbf24' },
        { text: 'EXCLUSION', x: 0.29, y: 0.78, color: '#c084fc' },
        { text: 'MATTER', x: 0.71, y: 0.78, color: '#34d399' },
      ]
      ;[[0, 1], [0, 2], [1, 3], [2, 3], [3, 4]].forEach(([a, b], index) => line(width * nodes[a].x, height * nodes[a].y, width * nodes[b].x, height * nodes[b].y, index === Math.floor((time * 0.0007) % 5) ? '#e5e7eb' : '#374151', 3))
      nodes.forEach((node, index) => {
        const highlighted = index === Math.floor((time * 0.0007) % nodes.length)
        glow(width * node.x, height * node.y, highlighted ? 48 : 35, node.color)
        dot(width * node.x, height * node.y, highlighted ? 18 : 14, node.color)
        label(node.text, width * node.x, height * node.y + 36, node.color, 'center', 9)
      })
    }

    const render = (time: number) => {
      frame += 1
      grid()
      if (scene === 'box-boundary' || scene === 'box-modes') drawBox(time)
      else if (scene === 'box-energy') drawBox(time, true)
      else if (scene === 'barrier-build') drawBarrier(time, 'build')
      else if (scene === 'tunnel-wave') drawBarrier(time, 'wave')
      else if (scene === 'tunnel-rate') drawBarrier(time, 'rate')
      else if (scene === 'orbital-cloud') drawOrbitalCloud(time)
      else if (scene === 'radial-nodes') drawRadialNodes()
      else if (scene === 'orbital-measurements') drawOrbitalCloud(time, true)
      else if (scene === 'stern-gerlach') drawSternGerlach(time)
      else if (scene === 'spin-state') drawSpinState()
      else if (scene === 'spin-measurement') drawSpinMeasurements()
      else if (scene === 'particle-exchange') drawParticleExchange(time)
      else if (scene === 'orbital-occupancy') drawOccupancy()
      else if (scene === 'quantum-statistics') drawStatistics()
      else if (scene === 'electron-shells') drawShells(time)
      else if (scene === 'pauli-builder') drawPauliBuilder()
      else if (scene === 'periodic-builder') drawPeriodicBuilder()
      else if (scene === 'matter-complete') drawComplete(time)
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

  return <canvas ref={canvasRef} className="qa-canvas" aria-label={`Animated ${scene.replace(/-/g, ' ')} atoms-and-matter model`} />
}
