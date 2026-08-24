import { Navigate, Route, Routes } from 'react-router-dom'
import { QuantumHubPage } from './quantum/QuantumHubPage'
import { QuantumLessonPage } from './quantum/QuantumLessonPage'
import { QUANTUM_LESSON_PATH } from './quantum/curriculum'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<QuantumHubPage />} />
      <Route path={QUANTUM_LESSON_PATH} element={<QuantumLessonPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
