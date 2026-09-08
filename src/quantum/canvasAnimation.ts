import { createContext } from 'react'

export type CanvasAnimation = { paused: boolean; clock: { time: number } }
export const CanvasAnimationContext = createContext<CanvasAnimation>({ paused: false, clock: { time: 0 } })

export function animateCanvas(canvas: HTMLCanvasElement, resize: () => unknown, draw: (time: number) => void, animation: CanvasAnimation) {
  let frame: number | null = null
  let previousTime: number | null = null
  let inView = true
  let disposed = false

  const stop = () => {
    if (frame !== null) cancelAnimationFrame(frame)
    frame = null
    previousTime = null
  }
  const tick = (time: number) => {
    frame = null
    if (disposed) return
    if (previousTime !== null) animation.clock.time += Math.min(time - previousTime, 100)
    previousTime = time
    draw(animation.clock.time)
    frame = requestAnimationFrame(tick)
  }
  const update = () => {
    stop()
    if (!disposed && inView && !document.hidden && !animation.paused) frame = requestAnimationFrame(tick)
  }

  // A resize redraws once; only tick owns the recurring animation request.
  const observer = new ResizeObserver(() => { resize(); draw(animation.clock.time) })
  const visibility = new IntersectionObserver(entries => { inView = entries[0].isIntersecting; update() })
  resize()
  draw(animation.clock.time)
  observer.observe(canvas)
  visibility.observe(canvas)
  document.addEventListener('visibilitychange', update)
  update()

  return () => {
    disposed = true
    stop()
    observer.disconnect()
    visibility.disconnect()
    document.removeEventListener('visibilitychange', update)
  }
}
