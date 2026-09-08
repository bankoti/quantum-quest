import { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'
import { CanvasAnimationContext } from './canvasAnimation'

export function LessonVisual({ label, children }: { label: string; children: ReactNode }) {
  const [paused, setPaused] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const clock = useRef({ time: 0 })
  const animation = useMemo(() => ({ paused, clock: clock.current }), [paused])

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const change = () => setPaused(preference.matches)
    preference.addEventListener('change', change)
    return () => preference.removeEventListener('change', change)
  }, [])

  return (
    <section className="qa-visual-panel">
      <div className="qa-visual-caption">
        <span>Interactive model</span>
        <div className="qa-model-actions">
          <strong>{label}</strong>
          <button className="qa-icon-button qa-quiet" title={paused ? 'Play animation' : 'Pause animation'} aria-label={paused ? 'Play animation' : 'Pause animation'} aria-pressed={paused} onClick={() => setPaused(current => !current)}>
            {paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
          </button>
        </div>
      </div>
      <CanvasAnimationContext.Provider value={animation}>{children}</CanvasAnimationContext.Provider>
    </section>
  )
}
