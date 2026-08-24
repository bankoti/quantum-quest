import { useEffect, useRef } from 'react'
import { FoundationScene } from './foundationLessons'

interface Props {
  scene: FoundationScene
  value: number
  mode: string
  hits: number[]
  active: boolean
  pulse: number
  accent: string
}

export function sampleBands(phase = 0): number {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const y = 0.08 + Math.random() * 0.84
    const centered = y - 0.5
    const envelope = Math.exp(-centered * centered * 9)
    const bands = 0.12 + 0.88 * Math.cos(centered * 34 + phase) ** 2
    if (Math.random() < envelope * bands) return y
  }
  return 0.5
}

export function FoundationCanvas({ scene, value, mode, hits, active, pulse, accent }: Props) {
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
      width = Math.max(bounds.width, 1)
      height = Math.max(bounds.height, 1)
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

    const text = (label: string, x: number, y: number, color = '#9ca3af', align: CanvasTextAlign = 'left', size = 12) => {
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

    const barrier = (slits = 2) => {
      const x = width * 0.48
      const openings = slits === 1 ? [0.5] : [0.39, 0.61]
      let lastY = 24
      openings.forEach(position => {
        const openingTop = height * position - 15
        context.fillStyle = '#d1d5db'
        context.fillRect(x, lastY, 8, openingTop - lastY)
        lastY = openingTop + 30
      })
      context.fillStyle = '#d1d5db'
      context.fillRect(x, lastY, 8, height - 24 - lastY)
    }

    const drawParticle = (time: number) => {
      const speed = 0.00008 + value * 0.0000025
      const progress = (time * speed) % 1
      const x = 42 + progress * (width - 84)
      const floor = height * 0.76
      const bounce = Math.abs(Math.sin(progress * Math.PI * 3)) * height * 0.38
      line(28, floor, width - 28, floor, '#374151')
      for (let index = 1; index < 8; index += 1) {
        const past = Math.max(0, progress - index * 0.018)
        const px = 42 + past * (width - 84)
        const py = floor - Math.abs(Math.sin(past * Math.PI * 3)) * height * 0.38
        dot(px, py, 3, accent, 0.55 - index * 0.055)
      }
      dot(x, floor - bounce, 11, accent)
      dot(x, floor - bounce, 24, accent, 0.12)
      text('ONE OBJECT', 28, 30, accent)
      text('one position • one path', 28, 49)
    }

    const drawWave = (time: number) => {
      const cycles = 1.5 + value / 24
      const baseline = height * 0.52
      context.beginPath()
      for (let x = 24; x <= width - 24; x += 3) {
        const phase = (x / width) * Math.PI * 2 * cycles - time * 0.003
        const y = baseline + Math.sin(phase) * height * 0.2
        if (x === 24) context.moveTo(x, y)
        else context.lineTo(x, y)
      }
      context.strokeStyle = accent
      context.lineWidth = 5
      context.stroke()
      for (let ring = 0; ring < 5; ring += 1) {
        const radius = ((time * 0.035 + ring * 56) % Math.max(width * 0.46, 1))
        context.beginPath()
        context.arc(width * 0.12, baseline, radius, -1.1, 1.1)
        context.strokeStyle = `rgba(34,211,238,${0.5 - ring * 0.06})`
        context.lineWidth = 2
        context.stroke()
      }
      text('DISTRIBUTED DISTURBANCE', 28, 30, accent)
      text('many places • shared phase', 28, 49)
    }

    const drawModelsMeet = (time: number) => {
      barrier(2)
      line(width * 0.88, 24, width * 0.88, height - 24, '#6b7280', 4)
      if (mode === 'particle') {
        const progress = (time * 0.00022) % 1
        const x = width * (0.1 + progress * 0.76)
        const targetY = progress < 0.5 ? height * 0.5 : height * 0.39
        dot(x, targetY, 8, '#fb7185')
        line(width * 0.1, height * 0.5, width * 0.48, height * 0.39, '#7f1d1d', 2)
        line(width * 0.48, height * 0.39, width * 0.88, height * 0.39, '#7f1d1d', 2)
        text('CHOSES ONE OPENING', 25, 30, '#fb7185')
      } else {
        ;[0.39, 0.61].forEach((position, slit) => {
          for (let ring = 0; ring < 6; ring += 1) {
            const radius = (time * 0.045 + ring * 48 + slit * 12) % (width * 0.46)
            context.beginPath()
            context.arc(width * 0.49, height * position, radius, -1.15, 1.15)
            context.strokeStyle = slit ? '#22d3ee' : '#a78bfa'
            context.globalAlpha = 0.72
            context.lineWidth = 2
            context.stroke()
          }
        })
        context.globalAlpha = 1
        text('SPREADS THROUGH BOTH', 25, 30, '#a78bfa')
      }
    }

    const drawEnergyRamp = () => {
      const left = 48
      const right = width - 48
      const bottom = height * 0.8
      if (mode === 'quantum') {
        const steps = 5
        const stepW = (right - left) / steps
        const stepH = height * 0.11
        context.beginPath()
        context.moveTo(left, bottom)
        for (let index = 0; index < steps; index += 1) {
          context.lineTo(left + (index + 1) * stepW, bottom - index * stepH)
          context.lineTo(left + (index + 1) * stepW, bottom - (index + 1) * stepH)
        }
        context.strokeStyle = '#fbbf24'
        context.lineWidth = 5
        context.stroke()
        const level = Math.round(value / 25)
        dot(left + (level + 0.5) * stepW, bottom - level * stepH - 13, 10, '#fbbf24')
        text('ONLY THESE LEVELS', 28, 30, '#fbbf24')
      } else {
        line(left, bottom, right, height * 0.24, '#22d3ee', 5)
        const progress = value / 100
        dot(left + progress * (right - left), bottom - progress * height * 0.56 - 13, 10, '#22d3ee')
        text('EVERY VALUE BETWEEN', 28, 30, '#22d3ee')
      }
    }

    const drawEnergyLevels = (time: number) => {
      const cx = width * 0.44
      const cy = height * 0.51
      const selected = Math.max(1, Math.round(value))
      for (let level = 1; level <= 4; level += 1) {
        const radius = 34 + level * 29
        context.beginPath()
        context.arc(cx, cy, radius, 0, Math.PI * 2)
        context.strokeStyle = level === selected ? '#fbbf24' : '#374151'
        context.lineWidth = level === selected ? 3 : 1
        context.stroke()
      }
      dot(cx, cy, 18, '#fb7185')
      const angle = time * 0.0012
      const radius = 34 + selected * 29
      dot(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius, 8, '#22d3ee')
      for (let level = 4; level >= 1; level -= 1) text(`E${level}`, width - 46, cy - (level - 2.5) * 48, level === selected ? '#fbbf24' : '#6b7280', 'center')
      text(`LEVEL ${selected}`, 28, 30, '#fbbf24')
    }

    const drawSpectrum = (time: number) => {
      const levels = [height * 0.76, height * 0.58, height * 0.39, height * 0.2]
      levels.forEach((y, index) => {
        line(42, y, width * 0.55, y, index === value ? '#fbbf24' : '#4b5563', index === value ? 4 : 2)
        text(`E${index + 1}`, 27, y + 4, index === value ? '#fbbf24' : '#6b7280', 'center', 10)
      })
      const travel = pulse ? (time * 0.00035) % 1 : 0
      const photonColors = ['#fb7185', '#fbbf24', '#22d3ee', '#a78bfa']
      if (pulse > 0) {
        const fromY = levels[Math.max(0, Math.min(3, value))]
        const toY = levels[0]
        line(width * 0.43, fromY, width * 0.43, toY, photonColors[value], 3)
        dot(width * (0.58 + travel * 0.3), toY, 8, photonColors[value])
      }
      const spectrumX = width * 0.68
      photonColors.forEach((color, index) => line(spectrumX + index * 24, height * 0.3, spectrumX + index * 24, height * 0.72, color, 7, index <= value ? 1 : 0.15))
      text('EMISSION LINES', width * 0.76, height * 0.82, '#9ca3af', 'center', 10)
    }

    const drawPhotonStream = (time: number) => {
      const count = Math.max(1, Math.round(value))
      const colors = ['#fbbf24', '#fb7185', '#22d3ee']
      line(width * 0.86, 34, width * 0.86, height - 34, '#d1d5db', 5)
      dot(width * 0.12, height * 0.5, 19, '#fbbf24', 0.18)
      dot(width * 0.12, height * 0.5, 9, '#fbbf24')
      for (let index = 0; index < count * 3; index += 1) {
        const progress = (time * 0.0002 + index / (count * 3)) % 1
        const x = width * (0.16 + progress * 0.69)
        const y = height * (0.23 + ((index * 37) % 55) / 100)
        dot(x, y, 5, colors[index % colors.length])
      }
      text(`${count}× PHOTON TRAFFIC`, 28, 30, '#fbbf24')
    }

    const photonHue = Math.round(8 + (value / 100) * 265)

    const drawPhotonColor = (time: number) => {
      const color = `hsl(${photonHue} 90% 62%)`
      for (let index = 0; index < 7; index += 1) {
        const progress = (time * 0.00018 + index / 7) % 1
        const x = width * (0.1 + progress * 0.8)
        const y = height * (0.5 + Math.sin(progress * Math.PI * 6) * 0.12)
        dot(x, y, 9, color)
        dot(x, y, 23, color, 0.1)
      }
      const energy = 1 + Math.round(value / 20)
      for (let index = 0; index < energy; index += 1) line(width * 0.36, height * (0.78 - index * 0.035), width * 0.64, height * (0.78 - index * 0.035), color, 3)
      text(value < 45 ? 'LOWER ENERGY / PHOTON' : 'HIGHER ENERGY / PHOTON', width / 2, height * 0.88, color, 'center')
    }

    const drawPhotoelectric = (time: number) => {
      const color = `hsl(${photonHue} 90% 62%)`
      const surfaceX = width * 0.62
      context.fillStyle = '#4b5563'
      context.fillRect(surfaceX, height * 0.18, 18, height * 0.64)
      for (let y = height * 0.23; y < height * 0.8; y += 35) dot(surfaceX + 9, y, 5, '#d1d5db')
      const progress = pulse ? (time * 0.00042) % 1 : 0
      if (pulse > 0) dot(width * (0.12 + progress * 0.49), height * 0.5, 9, color)
      if (pulse > 0 && value >= 55 && progress > 0.66) {
        const escape = (progress - 0.66) / 0.34
        dot(surfaceX + 18 + escape * width * 0.28, height * 0.5 - escape * height * 0.3, 7, '#22d3ee')
      }
      line(width * 0.1, height * 0.88, width * 0.9, height * 0.88, '#374151', 2)
      line(width * 0.55, height * 0.85, width * 0.55, height * 0.91, '#fb7185', 3)
      text(value >= 55 ? 'ABOVE THRESHOLD' : 'BELOW THRESHOLD', width / 2, 30, value >= 55 ? '#34d399' : '#fb7185', 'center')
    }

    const drawSlitBuilder = (time: number) => {
      const slitCount = mode === 'one' ? 1 : 2
      barrier(slitCount)
      dot(width * 0.12, height * 0.5, 13, '#fbbf24')
      line(width * 0.86, 28, width * 0.86, height - 28, '#d1d5db', 5)
      for (let index = 0; index < 4; index += 1) {
        const progress = (time * 0.00025 + index * 0.25) % 1
        dot(width * (0.14 + progress * 0.7), height * 0.5, 4, '#fbbf24')
      }
      text(`${slitCount === 1 ? 'ONE' : 'TWO'} OPENING${slitCount === 1 ? '' : 'S'}`, 28, 30, accent)
    }

    const drawSlitWaves = (time: number) => {
      barrier(2)
      const phase = (value / 100) * Math.PI * 2
      ;[0.39, 0.61].forEach((position, slit) => {
        for (let ring = 0; ring < 6; ring += 1) {
          const radius = (time * 0.045 + ring * 46 + (slit ? phase * 8 : 0)) % (width * 0.48)
          context.beginPath()
          context.arc(width * 0.49, height * position, radius, -1.15, 1.15)
          context.strokeStyle = slit ? '#22d3ee' : '#a78bfa'
          context.lineWidth = 2
          context.globalAlpha = 0.7
          context.stroke()
        }
      })
      context.globalAlpha = 1
      for (let index = 0; index < 24; index += 1) {
        const y = 34 + index * (height - 68) / 23
        const intensity = 0.15 + 0.85 * Math.cos((y / height - 0.5) * 29 + phase) ** 2
        context.fillStyle = '#a78bfa'
        context.globalAlpha = intensity
        context.fillRect(width * 0.88, y - 3, width * 0.08 * intensity, 6)
      }
      context.globalAlpha = 1
      text(`PHASE ${Math.round(value * 3.6)}°`, 28, 30, '#a78bfa')
    }

    const drawDetections = () => {
      barrier(2)
      line(width * 0.86, 24, width * 0.86, height - 24, '#d1d5db', 5)
      hits.forEach((hit, index) => dot(width * 0.86 + ((index % 5) - 2) * 2.2, height * hit, 2.8, index % 3 ? '#fb7185' : '#22d3ee', 0.9))
      text(`${hits.length} EVENTS`, 28, 30, hits.length ? '#34d399' : '#6b7280')
    }

    const drawWhichPath = (time: number) => {
      barrier(2)
      ;[0.39, 0.61].forEach((position, slit) => {
        if (active) {
          dot(width * 0.44, height * position, 9, '#fb7185')
          context.strokeStyle = '#fb7185'
        }
        for (let ring = 0; ring < 5; ring += 1) {
          const radius = (time * 0.04 + ring * 48 + slit * 8) % (width * 0.46)
          context.beginPath()
          context.arc(width * 0.49, height * position, radius, -1.05, 1.05)
          context.strokeStyle = slit ? '#22d3ee' : '#a78bfa'
          context.globalAlpha = active ? 0.24 : 0.7
          context.stroke()
        }
      })
      context.globalAlpha = 1
      for (let index = 0; index < 26; index += 1) {
        const y = 30 + index * (height - 60) / 25
        const centered = y / height - 0.5
        const intensity = active
          ? Math.exp(-((centered - 0.18) ** 2) * 55) + Math.exp(-((centered + 0.18) ** 2) * 55)
          : Math.exp(-(centered ** 2) * 7) * (0.12 + 0.88 * Math.cos(centered * 31) ** 2)
        context.fillStyle = active ? '#fb7185' : '#a78bfa'
        context.globalAlpha = Math.min(1, intensity)
        context.fillRect(width * 0.88, y - 3, Math.max(3, intensity * width * 0.08), 6)
      }
      context.globalAlpha = 1
      text(active ? 'PATH RECORDED' : 'PATHS INDISTINGUISHABLE', 28, 30, active ? '#fb7185' : '#a78bfa')
    }

    const drawFoundationMap = (time: number, complete = false) => {
      const nodes = [
        { label: 'STATE', x: 0.5, y: 0.2, color: '#a78bfa' },
        { label: 'AMPLITUDES', x: 0.22, y: 0.52, color: '#22d3ee' },
        { label: 'PROBABILITY', x: 0.78, y: 0.52, color: '#fbbf24' },
        { label: 'EVENT', x: 0.5, y: 0.82, color: '#fb7185' },
      ]
      const connections = [[0, 1], [0, 2], [1, 2], [2, 3]]
      connections.forEach(([from, to], index) => {
        const a = nodes[from]
        const b = nodes[to]
        line(width * a.x, height * a.y, width * b.x, height * b.y, index === Math.floor((time * 0.0007) % connections.length) ? '#e5e7eb' : '#374151', 3)
      })
      nodes.forEach((node, index) => {
        const pulseSize = complete || index === Math.floor((time * 0.0007) % nodes.length) ? 4 : 0
        dot(width * node.x, height * node.y, 34 + pulseSize, node.color, 0.16)
        dot(width * node.x, height * node.y, 18, node.color)
        text(node.label, width * node.x, height * node.y + 55, node.color, 'center', 10)
      })
    }

    const drawCheck = (time: number) => {
      const cx = width * 0.5
      const cy = height * 0.5
      const sceneColor = scene.includes('energy') ? '#fbbf24' : scene.includes('photon') ? '#fb7185' : scene.includes('slit') ? '#a78bfa' : accent
      for (let ring = 0; ring < 5; ring += 1) {
        context.beginPath()
        context.arc(cx, cy, 40 + ring * 30 + Math.sin(time * 0.002 + ring) * 3, 0, Math.PI * 2)
        context.strokeStyle = sceneColor
        context.globalAlpha = 0.5 - ring * 0.075
        context.lineWidth = 2
        context.stroke()
      }
      context.globalAlpha = 1
      dot(cx, cy, 28, '#e5e7eb')
      text('?', cx, cy + 8, '#111827', 'center', 24)
    }

    const render = (time: number) => {
      frame += 1
      grid()
      if (scene === 'particle-motion') drawParticle(time)
      else if (scene === 'wave-motion') drawWave(time)
      else if (scene === 'models-meet') drawModelsMeet(time)
      else if (scene === 'energy-ramp') drawEnergyRamp()
      else if (scene === 'energy-levels') drawEnergyLevels(time)
      else if (scene === 'spectrum') drawSpectrum(time)
      else if (scene === 'photon-stream') drawPhotonStream(time)
      else if (scene === 'photon-color') drawPhotonColor(time)
      else if (scene === 'photoelectric') drawPhotoelectric(time)
      else if (scene === 'slit-builder') drawSlitBuilder(time)
      else if (scene === 'slit-waves') drawSlitWaves(time)
      else if (scene === 'slit-detections') drawDetections()
      else if (scene === 'which-path') drawWhichPath(time)
      else if (scene === 'foundation-map') drawFoundationMap(time)
      else if (scene === 'stage-complete') drawFoundationMap(time, true)
      else drawCheck(time)
      if (!reducedMotion || frame < 2) animationFrame = requestAnimationFrame(render)
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    animationFrame = requestAnimationFrame(render)
    return () => {
      cancelAnimationFrame(animationFrame)
      observer.disconnect()
    }
  }, [accent, active, hits, mode, pulse, scene, value])

  return <canvas ref={canvasRef} className="qa-canvas" aria-label={`Animated ${scene.replace(/-/g, ' ')} experiment`} />
}
