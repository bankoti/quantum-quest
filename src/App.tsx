import { useLayoutEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { QuantumHubPage } from './quantum/QuantumHubPage'
import { QuantumLessonPage } from './quantum/QuantumLessonPage'
import { FoundationLessonPage } from './quantum/FoundationLessonPage'
import { QUANTUM_LESSON_PATH } from './quantum/curriculum'

function ScrollToTop() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    window.history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    const frame = window.requestAnimationFrame(() => window.scrollTo(0, 0))
    const settle = window.setTimeout(() => window.scrollTo(0, 0), 50)
    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(settle)
    }
  }, [pathname])

  return null
}

export function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<QuantumHubPage />} />
        <Route path={QUANTUM_LESSON_PATH} element={<QuantumLessonPage />} />
        <Route path="/:lessonSlug" element={<FoundationLessonPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
