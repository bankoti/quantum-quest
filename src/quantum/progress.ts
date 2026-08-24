import { FOUNDATION_LESSONS } from './curriculum'

const COMPLETED_KEY = 'quantum-quest-completed-lessons'
const STEP_PREFIX = 'quantum-quest-step:'
const FIRST_LESSON = 'the-quantum-rules-change'

function storage(): Storage | null {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

export function getCompletedLessons(): string[] {
  const local = storage()
  if (!local) return []

  let completed: string[] = []
  try {
    const saved = JSON.parse(local.getItem(COMPLETED_KEY) || '[]')
    const knownLessons = new Set(FOUNDATION_LESSONS.map(lesson => lesson.slug))
    if (Array.isArray(saved)) completed = [...new Set(saved.filter(value => typeof value === 'string' && knownLessons.has(value)))]
  } catch {
    completed = []
  }

  if (local.getItem('quantum-quest-complete') === 'true' && !completed.includes(FIRST_LESSON)) {
    completed.push(FIRST_LESSON)
    local.setItem(COMPLETED_KEY, JSON.stringify(completed))
  }
  return completed
}

export function markLessonCompleted(slug: string): void {
  const local = storage()
  if (!local) return
  const completed = new Set(getCompletedLessons())
  completed.add(slug)
  local.setItem(COMPLETED_KEY, JSON.stringify([...completed]))
}

export function getSavedStep(slug: string): number {
  const local = storage()
  if (!local) return 0
  const current = local.getItem(`${STEP_PREFIX}${slug}`)
  const legacy = slug === FIRST_LESSON ? local.getItem('quantum-quest-step') : null
  const parsed = Number(current ?? legacy ?? '0')
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0
}

export function saveStep(slug: string, step: number): void {
  storage()?.setItem(`${STEP_PREFIX}${slug}`, String(step))
}

export function getNextFoundationLesson(completed = getCompletedLessons()) {
  const completeSet = new Set(completed)
  return FOUNDATION_LESSONS.find(lesson => lesson.slug && !completeSet.has(lesson.slug)) ?? FOUNDATION_LESSONS[0]
}
