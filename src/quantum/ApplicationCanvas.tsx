import { useContext, useEffect, useRef } from 'react'
import { animateCanvas, CanvasAnimationContext } from './canvasAnimation'
import { ApplicationScene } from './applicationLessons'

interface Props {
  scene: ApplicationScene
  value: number
  mode: string
  hits: number[]
  active: boolean
  pulse: number
  accent: string
}

export function ApplicationCanvas({ scene, value, mode, hits, active, pulse, accent }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animation = useContext(CanvasAnimationContext)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    let width = 1
    let height = 1

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
      const available = align === 'center' ? 2 * Math.min(x, width - x) : align === 'right' ? x : width - x
      context.fillText(text, x, y, Math.max(1, available - 20))
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

    const panel = (x: number, y: number, w: number, h: number, fill = '#0c111d', stroke = '#273244') => {
      context.beginPath()
      context.roundRect(x, y, w, h, 6)
      context.fillStyle = fill
      context.fill()
      context.strokeStyle = stroke
      context.lineWidth = 2
      context.stroke()
    }

    const drawLaserPump = (time: number) => {
      const excited = Math.round(value / 100 * 16)
      const left = width * 0.16
      const right = width * 0.84
      const groundY = height * 0.75
      const excitedY = height * 0.29
      line(left, groundY, right, groundY, '#22d3ee', 4)
      line(left, excitedY, right, excitedY, '#fb7185', 4)
      label('EXCITED STATE', left, excitedY - 17, '#fb7185')
      label('GROUND STATE', left, groundY + 29, '#22d3ee')
      for (let index = 0; index < 16; index += 1) {
        const x = left + 18 + index * (right - left - 36) / 15
        const y = index < excited ? excitedY : groundY
        glow(x, y, 18, index < excited ? '#fb7185' : '#22d3ee', 0.12)
        dot(x, y, 7, index < excited ? '#fb7185' : '#22d3ee')
      }
      const travel = (time * 0.00025) % 1
      const pumpX = left + travel * (right - left)
      arrow(pumpX, height * 0.92, pumpX, groundY + (excitedY - groundY) * travel, '#fbbf24', 2)
      label(`PUMP RATE ${value}%`, width / 2, 31, '#fbbf24', 'center', 13)
      label(`${excited} OF 16 ATOMS EXCITED`, width / 2, height * 0.91, '#d1d5db', 'center')
    }

    const drawInversion = () => {
      const excited = value / 100
      const base = height * 0.82
      const maxHeight = height * 0.5
      const bars = [
        { x: width * 0.35, fraction: 1 - excited, text: 'LOWER', color: '#22d3ee' },
        { x: width * 0.65, fraction: excited, text: 'EXCITED', color: '#fb7185' },
      ]
      bars.forEach(bar => {
        context.fillStyle = `${bar.color}35`
        context.fillRect(bar.x - 58, base - bar.fraction * maxHeight, 116, bar.fraction * maxHeight)
        line(bar.x - 58, base - bar.fraction * maxHeight, bar.x + 58, base - bar.fraction * maxHeight, bar.color, 5)
        label(`${Math.round(bar.fraction * 100)}%`, bar.x, base - bar.fraction * maxHeight - 14, bar.color, 'center', 16)
        label(bar.text, bar.x, base + 27, bar.color, 'center')
      })
      line(width * 0.18, base, width * 0.82, base, '#4b5563')
      const inverted = excited > 0.5
      label(inverted ? 'POPULATION INVERTED: NET GAIN' : 'ABSORPTION DOMINATES', width / 2, 31, inverted ? '#34d399' : '#fbbf24', 'center', 13)
      line(width / 2, height * 0.2, width / 2, base, '#374151', 2)
      label('THRESHOLD', width / 2, height * 0.18, '#6b7280', 'center')
    }

    const drawStimulatedCascade = (time: number) => {
      const left = width * 0.1
      const right = width * 0.9
      const top = height * 0.22
      const bottom = height * 0.82
      context.fillStyle = '#111827'
      context.fillRect(left, top, right - left, bottom - top)
      line(left, top, left, bottom, '#e5e7eb', 8)
      line(right, top, right, bottom, '#e5e7eb', 8)
      const atoms = 12
      for (let index = 0; index < atoms; index += 1) {
        const x = left + (index + 1) * (right - left) / (atoms + 1)
        const y = height * (0.39 + (index % 2) * 0.25)
        dot(x, y, 11, pulse ? '#34d399' : '#fb7185', 0.28)
        dot(x, y, 5, pulse ? '#34d399' : '#fb7185')
      }
      const photons = pulse ? Math.min(18, 3 + pulse * 3) : 1
      for (let index = 0; index < photons; index += 1) {
        const progress = ((time * 0.00028 + index / photons) % 1)
        const x = left + progress * (right - left)
        const y = height * 0.51 + Math.sin(progress * 28) * 15
        glow(x, y, 18, '#fbbf24', 0.2)
        dot(x, y, 5, '#fbbf24')
      }
      line(left, height * 0.51, right, height * 0.51, '#fbbf24', 2, 0.35)
      label(pulse ? `${photons} MATCHED PHOTONS IN THE CAVITY MODE` : 'RELEASE A SEED PHOTON', width / 2, 31, pulse ? '#34d399' : '#fbbf24', 'center', 13)
      label('partially transmitting mirror ->', right - 4, height * 0.9, '#9ca3af', 'right')
    }

    const drawBands = () => {
      const gap = height * (0.08 + value / 100 * 0.32)
      const left = width * 0.16
      const right = width * 0.84
      const center = height * 0.52
      const bandHeight = height * 0.19
      const gradientTop = context.createLinearGradient(0, center - gap / 2 - bandHeight, 0, center - gap / 2)
      gradientTop.addColorStop(0, '#22d3ee18')
      gradientTop.addColorStop(1, '#22d3ee66')
      context.fillStyle = gradientTop
      context.fillRect(left, center - gap / 2 - bandHeight, right - left, bandHeight)
      const gradientBottom = context.createLinearGradient(0, center + gap / 2, 0, center + gap / 2 + bandHeight)
      gradientBottom.addColorStop(0, '#a78bfa66')
      gradientBottom.addColorStop(1, '#a78bfa18')
      context.fillStyle = gradientBottom
      context.fillRect(left, center + gap / 2, right - left, bandHeight)
      line(left, center - gap / 2, right, center - gap / 2, '#22d3ee', 4)
      line(left, center + gap / 2, right, center + gap / 2, '#a78bfa', 4)
      arrow(width * 0.72, center + gap / 2 + 35, width * 0.72, center - gap / 2 - 35, '#fbbf24', 3)
      label('CONDUCTION BAND', left, center - gap / 2 - bandHeight - 12, '#22d3ee')
      label('VALENCE BAND', left, center + gap / 2 + bandHeight + 26, '#a78bfa')
      label(`BAND GAP ${value}`, width / 2, 31, '#fbbf24', 'center', 13)
      label(value > 65 ? 'WIDE GAP / HARDER TO EXCITE' : value < 30 ? 'NARROW GAP / EASIER TO CONDUCT' : 'SEMICONDUCTOR GAP', width / 2, height * 0.94, '#d1d5db', 'center')
    }

    const drawDopedLattice = (time: number) => {
      const columns = 9
      const rows = 6
      const spacingX = Math.min(58, width * 0.085)
      const spacingY = Math.min(58, height * 0.105)
      const startX = width / 2 - spacingX * (columns - 1) / 2
      const startY = height / 2 - spacingY * (rows - 1) / 2
      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const x = startX + column * spacingX
          const y = startY + row * spacingY
          if (column < columns - 1) line(x, y, x + spacingX, y, '#273244', 1)
          if (row < rows - 1) line(x, y, x, y + spacingY, '#273244', 1)
          const dopant = mode !== 'intrinsic' && row === 2 && column === 4
          dot(x, y, dopant ? 10 : 6, dopant ? '#fbbf24' : '#6b7280')
        }
      }
      if (mode === 'n') {
        const x = startX + ((time * 0.00025) % 1) * spacingX * (columns - 1)
        dot(x, startY + spacingY * 1.4, 7, '#22d3ee')
        arrow(x - 24, startY + spacingY * 1.4, x - 10, startY + spacingY * 1.4, '#22d3ee', 2)
      } else if (mode === 'p') {
        const x = startX + (1 - (time * 0.00022) % 1) * spacingX * (columns - 1)
        context.beginPath()
        context.arc(x, startY + spacingY * 3.7, 8, 0, Math.PI * 2)
        context.strokeStyle = '#fb7185'
        context.lineWidth = 3
        context.stroke()
      }
      label(mode === 'n' ? 'N-TYPE: MOBILE ELECTRONS' : mode === 'p' ? 'P-TYPE: MOBILE HOLES' : 'INTRINSIC: FEW MOBILE CARRIERS', width / 2, 31, mode === 'n' ? '#22d3ee' : mode === 'p' ? '#fb7185' : '#9ca3af', 'center', 13)
      label(mode === 'intrinsic' ? 'pure crystal' : 'one dopant can influence many unit cells', width / 2, height * 0.94, '#9ca3af', 'center')
    }

    const drawTransistor = (time: number) => {
      const on = value >= 52
      const left = width * 0.12
      const right = width * 0.88
      const channelY = height * 0.66
      const gateY = height * 0.25
      context.fillStyle = '#111827'
      context.fillRect(left, channelY - 44, right - left, 88)
      context.fillStyle = '#22d3ee55'
      context.fillRect(left, channelY - 55, width * 0.14, 110)
      context.fillRect(right - width * 0.14, channelY - 55, width * 0.14, 110)
      context.fillStyle = on ? '#34d39988' : '#34d3990d'
      context.fillRect(left + width * 0.14, channelY - 18, right - left - width * 0.28, 36)
      context.fillStyle = value > 10 ? '#fbbf2444' : '#111827'
      context.fillRect(width * 0.34, gateY, width * 0.32, 48)
      line(width * 0.34, gateY + 48, width * 0.66, gateY + 48, '#fbbf24', 4)
      label('GATE', width / 2, gateY + 30, '#fbbf24', 'center')
      label('SOURCE', left + width * 0.07, channelY + 82, '#22d3ee', 'center')
      label('DRAIN', right - width * 0.07, channelY + 82, '#22d3ee', 'center')
      if (on) {
        for (let index = 0; index < 9; index += 1) {
          const progress = (time * 0.0003 + index / 9) % 1
          dot(left + width * 0.15 + progress * (right - left - width * 0.3), channelY, 5, '#34d399')
        }
      }
      label(`GATE VOLTAGE ${value}`, width / 2, 31, '#fbbf24', 'center', 13)
      label(on ? 'CHANNEL OPEN / CURRENT FLOWS' : 'CHANNEL CLOSED', width / 2, height * 0.94, on ? '#34d399' : '#fb7185', 'center')
    }

    const drawSpinEnsemble = (time: number) => {
      const strength = value / 100
      const columns = 6
      const rows = 6
      const startX = width * 0.2
      const startY = height * 0.28
      const dx = width * 0.1
      const dy = height * 0.085
      let up = 0
      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const index = row * columns + column
          const biased = (index * 13) % 36 < 18 + Math.round(strength * 3)
          if (biased) up += 1
          const x = startX + column * dx
          const y = startY + row * dy
          arrow(x, y + (biased ? 10 : -10), x, y + (biased ? -10 : 10), biased ? '#22d3ee' : '#fb7185', 2)
        }
      }
      const vector = strength * height * 0.22
      if (vector > 0) arrow(width * 0.88, height * 0.66, width * 0.88, height * 0.66 - vector, '#fbbf24', 5)
      else dot(width * 0.88, height * 0.66, 3, '#fbbf24')
      label('NET M', width * 0.88, height * 0.7, '#fbbf24', 'center')
      label(`FIELD STRENGTH ${value}`, width / 2, 31, accent, 'center', 13)
      label(`${up} LOWER / ${columns * rows - up} UPPER (EXAGGERATED)`, width / 2, height * 0.93, '#d1d5db', 'center')
      line(width * 0.12, height * 0.16, width * 0.12, height * 0.84, '#374151', 3)
      for (let y = height * 0.2; y < height * 0.82; y += 28) arrow(width * 0.12, y + 10, width * 0.12, y - 10, '#fbbf24', 1.5)
      void time
    }

    const drawResonance = () => {
      const left = width * 0.12
      const right = width * 0.9
      const base = height * 0.8
      const top = height * 0.21
      line(left, base, right, base, '#4b5563')
      line(left, base, left, top, '#4b5563')
      context.beginPath()
      for (let x = left; x <= right; x += 2) {
        const frequency = (x - left) / (right - left)
        const response = 1 / (1 + ((frequency - 0.5) / 0.075) ** 2)
        const y = base - response * (base - top)
        if (x === left) context.moveTo(x, y)
        else context.lineTo(x, y)
      }
      context.strokeStyle = '#22d3ee'
      context.lineWidth = 5
      context.stroke()
      const markerX = left + value / 100 * (right - left)
      const response = 1 / (1 + (((value / 100) - 0.5) / 0.075) ** 2)
      const markerY = base - response * (base - top)
      line(markerX, base, markerX, markerY, '#fbbf24', 3)
      glow(markerX, markerY, 34, '#fbbf24')
      dot(markerX, markerY, 9, '#fbbf24')
      label(`RF FREQUENCY ${value}`, width / 2, 31, '#fbbf24', 'center', 13)
      label(response > 0.8 ? 'ON RESONANCE / STRONG ROTATION' : 'OFF RESONANCE / WEAK RESPONSE', width / 2, height * 0.93, response > 0.8 ? '#34d399' : '#9ca3af', 'center')
    }

    const drawMriSignal = (time: number) => {
      const cx = width * 0.22
      const cy = height * 0.5
      const radius = Math.min(width, height) * 0.16
      context.beginPath()
      context.arc(cx, cy, radius, 0, Math.PI * 2)
      context.strokeStyle = '#374151'
      context.lineWidth = 2
      context.stroke()
      if (!pulse) {
        arrow(cx, cy + radius * 0.62, cx, cy - radius * 0.62, '#22d3ee', 5)
        label('APPLY AN RF PULSE', width / 2, 31, accent, 'center', 13)
      } else {
        const phase = time * 0.004
        arrow(cx, cy, cx + Math.cos(phase) * radius * 0.72, cy + Math.sin(phase) * radius * 0.36, '#fbbf24', 5)
        const left = width * 0.43
        const right = width * 0.92
        const baseline = height * 0.52
        line(left, baseline, right, baseline, '#374151')
        context.beginPath()
        for (let x = left; x <= right; x += 2) {
          const progress = (x - left) / (right - left)
          const y = baseline - Math.exp(-progress * 3) * Math.sin(progress * 38) * height * 0.25
          if (x === left) context.moveTo(x, y)
          else context.lineTo(x, y)
        }
        context.strokeStyle = '#34d399'
        context.lineWidth = 4
        context.stroke()
        label('FREE INDUCTION DECAY', (left + right) / 2, height * 0.83, '#34d399', 'center')
        label(`SIGNAL ${pulse} ACQUIRED`, width / 2, 31, '#34d399', 'center', 13)
      }
      label('NET SPIN', cx, cy + radius + 30, '#9ca3af', 'center')
    }

    const drawBitQubit = (time: number) => {
      const cx = width / 2
      const cy = height * 0.53
      if (mode === 'bit') {
        const bit = Math.floor(time * 0.0005) % 2
        panel(cx - 78, cy - 78, 156, 156, '#111827', bit ? '#fb7185' : '#22d3ee')
        label(String(bit), cx, cy + 24, bit ? '#fb7185' : '#22d3ee', 'center', 64)
        label('ONE CLASSICAL VALUE', cx, 31, '#9ca3af', 'center', 13)
        label('0 or 1', cx, cy + 113, '#d1d5db', 'center')
      } else {
        const radius = Math.min(width, height) * 0.29
        context.beginPath()
        context.arc(cx, cy, radius, 0, Math.PI * 2)
        context.strokeStyle = '#a78bfa'
        context.lineWidth = 2
        context.stroke()
        context.beginPath()
        context.ellipse(cx, cy, radius, radius * 0.34, 0, 0, Math.PI * 2)
        context.strokeStyle = '#374151'
        context.stroke()
        const angle = time * 0.0008
        arrow(cx, cy, cx + Math.sin(angle) * radius * 0.76, cy - Math.cos(angle) * radius * 0.76, '#fbbf24', 5)
        label('ONE QUANTUM STATE', cx, 31, '#a78bfa', 'center', 13)
        label('amplitudes + relative phase', cx, cy + radius + 34, '#d1d5db', 'center')
      }
    }

    const drawBloch = () => {
      const angle = value / 100 * Math.PI
      const cx = width / 2
      const cy = height * 0.53
      const radius = Math.min(width * 0.31, Math.max(24, (height - 115) / 2))
      context.beginPath()
      context.arc(cx, cy, radius, 0, Math.PI * 2)
      context.strokeStyle = '#a78bfa'
      context.lineWidth = 2
      context.stroke()
      context.beginPath()
      context.ellipse(cx, cy, radius, radius * 0.34, 0, 0, Math.PI * 2)
      context.strokeStyle = '#374151'
      context.stroke()
      line(cx, cy - radius, cx, cy + radius, '#4b5563')
      const x = cx + Math.sin(angle) * radius
      const y = cy - Math.cos(angle) * radius
      arrow(cx, cy, x, y, '#fbbf24', 5)
      glow(x, y, 34, '#fbbf24')
      dot(x, y, 8, '#fbbf24')
      const probabilityOne = Math.sin(angle / 2) ** 2
      label('|0>', cx, cy - radius - 14, '#22d3ee', 'center', 14)
      label('|1>', cx, cy + radius + 25, '#fb7185', 'center', 14)
      label(`STATE ROTATION ${Math.round(value * 1.8)} DEG`, width / 2, 31, accent, 'center', 13)
      label(`P(0) ${Math.round((1 - probabilityOne) * 100)}% / P(1) ${Math.round(probabilityOne * 100)}%`, width / 2, height * 0.94, '#d1d5db', 'center')
    }

    const drawHistogram = (title: string) => {
      const zeros = hits.filter(hit => hit === 0).length
      const ones = hits.length - zeros
      const total = Math.max(1, hits.length)
      const base = height * 0.8
      const maxHeight = height * 0.47
      const barWidth = Math.min(110, width * 0.24)
      ;[{ x: width * 0.35, count: zeros, text: '0', color: '#22d3ee' }, { x: width * 0.65, count: ones, text: '1', color: '#fb7185' }].forEach(bar => {
        const h = bar.count / total * maxHeight
        context.fillStyle = `${bar.color}33`
        context.fillRect(bar.x - barWidth / 2, base - h, barWidth, h)
        line(bar.x - barWidth / 2, base - h, bar.x + barWidth / 2, base - h, bar.color, 5)
        label(`${bar.count} (${Math.round(bar.count / total * 100)}%)`, bar.x, base - h - 14, bar.color, 'center', 12)
        label(bar.text, bar.x, base + 30, bar.color, 'center', 15)
      })
      line(width * 0.2, base, width * 0.8, base, '#4b5563')
      label(hits.length ? `${hits.length} ${title}` : `RUN ${title}`, width / 2, 31, accent, 'center', 13)
    }

    const gateEndpoint = () => {
      if (mode === 'x') return { x: 0, y: 1, label: '|1>' }
      if (mode === 'h') return { x: 1, y: 0, label: '|+>' }
      return { x: 0, y: -1, label: '|0> (unchanged for this input)' }
    }

    const drawGate = (time: number) => {
      const cx = width * 0.65
      const cy = height * 0.53
      const radius = Math.min(width * 0.25, Math.max(24, (height - 110) / 2))
      context.beginPath()
      context.arc(cx, cy, radius, 0, Math.PI * 2)
      context.strokeStyle = '#374151'
      context.lineWidth = 2
      context.stroke()
      line(cx, cy - radius, cx, cy + radius, '#4b5563')
      line(cx - radius, cy, cx + radius, cy, '#4b5563')
      const target = gateEndpoint()
      const x = cx + target.x * radius
      const y = cy + target.y * radius
      arrow(cx, cy, cx, cy - radius, '#6b7280', 2)
      glow(x, y, 16 + Math.sin(time * 0.002) * 3, '#fbbf24')
      arrow(cx, cy, x, y, '#fbbf24', 5)
      const gateSize = Math.min(80, width * 0.16)
      const gateX = width * 0.14
      panel(gateX, cy - gateSize / 2, gateSize, gateSize, '#171130', '#a78bfa')
      label(mode.toUpperCase(), gateX + gateSize / 2, cy + 8, '#c084fc', 'center', 24)
      label('|0> input', gateX + gateSize / 2, cy + gateSize / 2 + 24, '#9ca3af', 'center')
      arrow(gateX + gateSize + 8, cy, cx - radius - 12, cy, '#a78bfa', 2)
      label('|0>', cx, cy - radius - 14, '#9ca3af', 'center')
      label('|1>', cx, cy + radius + 20, '#9ca3af', 'center')
      label('|+>', cx + radius + 20, cy + 4, '#9ca3af', 'center')
      label(`${mode.toUpperCase()} GATE TRANSFORM`, width / 2, 31, accent, 'center', 13)
      label(`OUTPUT ${target.label}`, width / 2, height * 0.95, '#fbbf24', 'center')
    }

    const circuitGates = () => mode === 'hzh' ? ['H', 'Z', 'H'] : ['H', 'H']

    const drawCircuit = (time: number) => {
      const gates = circuitGates()
      const left = width * 0.12
      const right = width * 0.88
      const y = height * 0.54
      line(left, y, right, y, '#6b7280', 3)
      label('|0>', left, y - 23, '#22d3ee', 'center', 14)
      gates.forEach((gate, index) => {
        const x = left + (index + 1) * (right - left) / (gates.length + 1)
        panel(x - 28, y - 28, 56, 56, '#211442', '#a78bfa')
        label(gate, x, y + 7, gate === 'Z' ? '#fb7185' : '#c084fc', 'center', 19)
      })
      const detectorX = right
      context.fillStyle = '#111827'
      context.fillRect(detectorX - 20, y - 34, 40, 68)
      label(mode === 'hzh' ? '1' : '0', detectorX, y + 6, mode === 'hzh' ? '#fb7185' : '#22d3ee', 'center', 17)
      const pulseX = left + ((time * 0.00022) % 1) * (right - left)
      glow(pulseX, y, 24, '#fbbf24')
      dot(pulseX, y, 5, '#fbbf24')
      label(mode === 'hzh' ? 'H - Z - H: PHASE BECOMES BIT FLIP' : 'H - H: SUPERPOSITION RECOMBINES', width / 2, 31, accent, 'center', 13)
      label(mode === 'hzh' ? 'ideal output |1>' : 'ideal output |0>', width / 2, height * 0.88, '#d1d5db', 'center')
    }

    const drawQkdBases = () => {
      const diagonal = mode === 'diagonal'
      const cx = width / 2
      const cy = height * 0.53
      const radius = Math.min(width, height) * 0.27
      const angles = diagonal ? [-Math.PI / 4, Math.PI / 4] : [0, Math.PI / 2]
      context.beginPath()
      context.arc(cx, cy, radius, 0, Math.PI * 2)
      context.strokeStyle = '#374151'
      context.lineWidth = 2
      context.stroke()
      angles.forEach((angle, index) => {
        const x1 = cx - Math.cos(angle) * radius * 0.76
        const y1 = cy - Math.sin(angle) * radius * 0.76
        const x2 = cx + Math.cos(angle) * radius * 0.76
        const y2 = cy + Math.sin(angle) * radius * 0.76
        line(x1, y1, x2, y2, index ? '#fb7185' : '#22d3ee', 6)
        label(index ? 'BIT 1' : 'BIT 0', x2 + Math.cos(angle) * 22, y2 + Math.sin(angle) * 22, index ? '#fb7185' : '#22d3ee', 'center', 9)
      })
      label(diagonal ? 'DIAGONAL BASIS' : 'RECTILINEAR BASIS', width / 2, 31, accent, 'center', 13)
      label('states within one basis are distinguishable', width / 2, height * 0.92, '#9ca3af', 'center')
    }

    const drawQkdEavesdrop = (time: number) => {
      const y = height * 0.54
      const nodes = [
        { x: width * 0.13, text: 'ALICE', color: '#22d3ee' },
        { x: width * 0.5, text: 'EVE', color: active ? '#fb7185' : '#374151' },
        { x: width * 0.87, text: 'BOB', color: '#34d399' },
      ]
      line(nodes[0].x, y, nodes[2].x, y, '#4b5563', 3)
      nodes.forEach(node => {
        glow(node.x, y, 38, node.color, 0.13)
        dot(node.x, y, 20, node.color, 0.28)
        dot(node.x, y, 8, node.color)
        label(node.text, node.x, y + 52, node.color, 'center')
      })
      const progress = (time * 0.00025) % 1
      const photonX = nodes[0].x + progress * (nodes[2].x - nodes[0].x)
      const disturbed = active && progress > 0.5
      const angle = disturbed ? Math.PI / 4 : 0
      glow(photonX, y, 22, disturbed ? '#fb7185' : '#fbbf24')
      line(photonX - Math.cos(angle) * 12, y - Math.sin(angle) * 12, photonX + Math.cos(angle) * 12, y + Math.sin(angle) * 12, disturbed ? '#fb7185' : '#fbbf24', 4)
      if (active) {
        context.beginPath()
        context.arc(nodes[1].x, y, 46 + Math.sin(time * 0.003) * 3, 0, Math.PI * 2)
        context.strokeStyle = '#fb7185'
        context.lineWidth = 2
        context.stroke()
      }
      label(active ? 'INTERCEPT AND RESEND ACTIVE' : 'DIRECT QUANTUM CHANNEL', width / 2, 31, active ? '#fb7185' : '#34d399', 'center', 13)
      label(active ? 'wrong-basis guesses leave errors' : 'no eavesdropper disturbance', width / 2, height * 0.9, '#d1d5db', 'center')
    }

    const drawQkdKey = () => {
      const errors = hits.filter(hit => hit === 1).length
      const rate = hits.length ? errors / hits.length : 0
      const columns = 20
      const rows = 6
      const left = width * 0.14
      const top = height * 0.25
      const dx = width * 0.72 / (columns - 1)
      const dy = height * 0.38 / (rows - 1)
      for (let index = 0; index < Math.min(hits.length, columns * rows); index += 1) {
        const column = index % columns
        const row = Math.floor(index / columns)
        dot(left + column * dx, top + row * dy, Math.min(5, dx * 0.34), hits[index] ? '#fb7185' : '#34d399')
      }
      const meterLeft = width * 0.2
      const meterRight = width * 0.8
      const meterY = height * 0.79
      line(meterLeft, meterY, meterRight, meterY, '#374151', 12)
      const thresholdX = meterLeft + (meterRight - meterLeft) * 0.11
      line(meterLeft, meterY, meterLeft + (meterRight - meterLeft) * Math.min(1, rate), meterY, rate > 0.11 ? '#fb7185' : '#34d399', 12)
      line(thresholdX, meterY - 10, thresholdX, meterY + 10, '#fbbf24', 3)
      label('ILLUSTRATIVE 11% ALARM', width / 2, height * 0.72, '#fbbf24', 'center', 9)
      label(hits.length ? `${errors} ERRORS / ${hits.length} TEST BITS = ${Math.round(rate * 100)}%` : 'COMPARE A PUBLIC TEST SAMPLE', width / 2, 31, rate > 0.11 ? '#fb7185' : '#34d399', 'center', 13)
      label(rate > 0.11 ? 'ABORT: DISTURBANCE DETECTED' : hits.length ? 'LOW ERROR: FURTHER CHECKS NEEDED' : 'green = agreement / coral = error', width / 2, height * 0.93, rate > 0.11 ? '#fb7185' : '#d1d5db', 'center')
    }

    const drawCheck = (time: number) => {
      const cx = width / 2
      const cy = height * 0.52
      for (let ring = 0; ring < 4; ring += 1) {
        context.beginPath()
        context.arc(cx, cy, 42 + ring * 34 + Math.sin(time * 0.002 + ring) * 4, 0, Math.PI * 2)
        context.strokeStyle = ring % 2 ? '#22d3ee' : accent
        context.globalAlpha = 0.52 - ring * 0.08
        context.lineWidth = 2
        context.stroke()
      }
      context.globalAlpha = 1
      dot(cx, cy, 29, '#e5e7eb')
      label('?', cx, cy + 8, '#111827', 'center', 24)
      label('CONNECT PRINCIPLE TO DEVICE', cx, 31, accent, 'center', 13)
    }

    const drawComplete = (time: number) => {
      const nodes = [
        { text: 'TRANSITIONS', x: 0.5, y: 0.13, color: '#fb7185' },
        { text: 'BANDS', x: 0.16, y: 0.43, color: '#fbbf24' },
        { text: 'SPIN', x: 0.84, y: 0.43, color: '#22d3ee' },
        { text: 'QUBITS', x: 0.28, y: 0.79, color: '#a78bfa' },
        { text: 'SECURE KEY', x: 0.72, y: 0.79, color: '#34d399' },
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
      grid()
      if (scene === 'laser-pump') drawLaserPump(time)
      else if (scene === 'laser-inversion') drawInversion()
      else if (scene === 'stimulated-cascade') drawStimulatedCascade(time)
      else if (scene === 'band-structure') drawBands()
      else if (scene === 'doped-lattice') drawDopedLattice(time)
      else if (scene === 'transistor-channel') drawTransistor(time)
      else if (scene === 'spin-ensemble') drawSpinEnsemble(time)
      else if (scene === 'resonance-curve') drawResonance()
      else if (scene === 'mri-signal') drawMriSignal(time)
      else if (scene === 'bit-qubit') drawBitQubit(time)
      else if (scene === 'bloch-state') drawBloch()
      else if (scene === 'qubit-histogram') drawHistogram('QUBIT MEASUREMENTS')
      else if (scene === 'gate-transform') drawGate(time)
      else if (scene === 'circuit-builder') drawCircuit(time)
      else if (scene === 'circuit-results') drawHistogram('CIRCUIT SHOTS')
      else if (scene === 'qkd-bases') drawQkdBases()
      else if (scene === 'qkd-eavesdrop') drawQkdEavesdrop(time)
      else if (scene === 'qkd-key') drawQkdKey()
      else if (scene === 'applications-complete') drawComplete(time)
      else drawCheck(time)
    }

    return animateCanvas(canvas, resize, render, animation)
  }, [accent, active, animation, hits, mode, pulse, scene, value])

  return <canvas ref={canvasRef} className="qa-canvas" aria-label={`Animated ${scene.replace(/-/g, ' ')} quantum-application model`} />
}
