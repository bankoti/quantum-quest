import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { lessonPath, PLAYABLE_LESSONS, QUANTUM_LESSON_COUNT, QUANTUM_STAGES, stageForLesson } from './curriculum'
import { getCompletedLessons, getNextPlayableLesson } from './progress'
import './quantum.css'

export function QuantumHubPage() {
  const [completed, setCompleted] = useState<string[]>([])

  useEffect(() => {
    setCompleted(getCompletedLessons())
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  const completeSet = new Set(completed)
  const nextLesson = getNextPlayableLesson(completed)
  const nextIndex = PLAYABLE_LESSONS.findIndex(lesson => lesson.slug === nextLesson.slug)
  const availableJourneyComplete = PLAYABLE_LESSONS.every(lesson => lesson.slug && completeSet.has(lesson.slug))
  const nextStage = stageForLesson(nextLesson.slug!)
  const nextPath = lessonPath(nextLesson.slug!)

  return (
    <div className="qa-page">
      <nav className="qa-site-nav" aria-label="Quantum course navigation">
        <Link to="/" className="qa-brand"><span aria-hidden="true">◉</span> Quantum Quest</Link>
        <span className="qa-progress">{completed.length}/{QUANTUM_LESSON_COUNT} lessons</span>
      </nav>

      <header className="qa-hero">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="qa-hero-copy">
          <p className="qa-eyebrow">Zero to hero, one experiment at a time</p>
          <h1>Build a quantum universe you can actually see.</h1>
          <p>Start with ordinary intuition, break it carefully through experiments, then rebuild your understanding around states, probability, atoms, entanglement, and computation.</p>
          <Link className="qa-primary qa-large" to={nextPath}>{availableJourneyComplete ? 'Review the journey' : completed.length ? 'Continue your journey' : 'Start first journey'} <span aria-hidden="true">→</span></Link>
          <div className="qa-hero-meta"><span>12 interactive lessons</span><span>40+ live models</span><span>No heavy math</span></div>
        </motion.div>
        <div className="qa-atom-visual" aria-label="Animated atomic state model">
          <div className="qa-atom-core"><i /></div>
          <div className="qa-orbit qa-orbit-one"><i /></div>
          <div className="qa-orbit qa-orbit-two"><i /></div>
          <div className="qa-orbit qa-orbit-three"><i /></div>
          <span className="qa-concept qa-concept-wave">wave</span>
          <span className="qa-concept qa-concept-state">state</span>
          <span className="qa-concept qa-concept-prob">probability</span>
        </div>
      </header>

      <section className="qa-build-line" aria-label="Course stages">
        <p>The build line</p>
        <div>
          {QUANTUM_STAGES.map((stage, index) => (
            <a key={stage.number} href={`#quantum-stage-${stage.number}`}>
              <span style={{ color: stage.accent }}>{stage.number}</span>
              <strong>{stage.shortTitle}</strong>
              {index < QUANTUM_STAGES.length - 1 && <i aria-hidden="true">→</i>}
            </a>
          ))}
        </div>
      </section>

      <Link to={nextPath} className="qa-next">
        <div className="qa-next-index"><span>{availableJourneyComplete ? 'Journey complete' : 'Recommended next'}</span><strong>{String(nextIndex + 1).padStart(2, '0')}</strong></div>
        <div><p className="qa-eyebrow">{nextStage?.shortTitle}</p><h2>{nextLesson.title}</h2><p>{nextLesson.description}</p></div>
        <span className="qa-next-action">{completeSet.has(nextLesson.slug!) ? 'Replay' : 'Begin'} →</span>
      </Link>

      <div className="qa-curriculum">
        {QUANTUM_STAGES.map((stage, stageIndex) => {
          const previousLessons = QUANTUM_STAGES.slice(0, stageIndex).reduce((sum, item) => sum + item.lessons.length, 0)
          return (
            <section id={`quantum-stage-${stage.number}`} className="qa-stage" style={{ '--qa-stage': stage.accent } as React.CSSProperties} key={stage.number}>
              <div className="qa-stage-heading">
                <div className="qa-stage-number"><span>Stage {stage.number}</span></div>
                <div><h2>{stage.title}</h2><p>{stage.description}</p></div>
                <span className="qa-stage-count">{stage.lessons.length} lessons</span>
              </div>
              <div className="qa-lesson-grid">
                {stage.lessons.map((lesson, lessonIndex) => {
                  const number = String(previousLessons + lessonIndex + 1).padStart(2, '0')
                  const lessonComplete = Boolean(lesson.slug && completeSet.has(lesson.slug))
                  if (lesson.playable && lesson.slug) {
                    return (
                      <Link className="qa-lesson-card qa-playable" key={lesson.title} to={lessonPath(lesson.slug)}>
                        <div className="qa-card-top"><span>{lessonComplete ? '✓' : number}</span><span className="qa-status">{lessonComplete ? 'Complete' : 'Available'}</span></div>
                        <h3>{lesson.title}</h3><p>{lesson.description}</p>
                        <div className="qa-card-meta"><span>{lesson.minutes} min</span><span>→</span></div>
                      </Link>
                    )
                  }
                  return (
                    <div className="qa-lesson-card qa-locked" key={lesson.title}>
                      <div className="qa-card-top"><span>{number}</span><span aria-label="Not yet available">◇</span></div>
                      <h3>{lesson.title}</h3><p>{lesson.description}</p>
                      <div className="qa-card-meta"><span>{lesson.minutes} min</span><span>Next release</span></div>
                    </div>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>

      <footer className="qa-footer"><span>◉ Quantum Quest</span><p>Progress saves in this browser.</p></footer>
    </div>
  )
}
