import { PLAYABLE_LESSONS } from './curriculum'

const COMPLETED_KEY = 'quantum-quest-completed-lessons'
const STEP_PREFIX = 'quantum-quest-step:'
const FIRST_LESSON = 'the-quantum-rules-change'
const LAST_LESSON_KEY = 'quantum-quest-last-lesson'

function storage(): Storage | null {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

export function readProgress(key: string): string | null {
  try { return storage()?.getItem(key) ?? null } catch { return null }
}

export function writeProgress(key: string, value: string): void {
  try { storage()?.setItem(key, value) } catch { /* Lessons remain usable when storage is full or blocked. */ }
}

export function readLessonSession(slug: string): unknown {
  try { return JSON.parse(readProgress(`quantum-quest-session:${slug}`) || 'null') } catch { return null }
}

export function saveLessonSession(slug: string, session: unknown): void {
  writeProgress(`quantum-quest-session:${slug}`, JSON.stringify(session))
}

export function getCompletedLessons(): string[] {
  let completed: string[] = []
  try {
    const saved = JSON.parse(readProgress(COMPLETED_KEY) || '[]')
    const knownLessons = new Set(PLAYABLE_LESSONS.map(lesson => lesson.slug))
    if (Array.isArray(saved)) completed = [...new Set(saved.filter(value => typeof value === 'string' && knownLessons.has(value)))]
  } catch {
    completed = []
  }

  if (readProgress('quantum-quest-complete') === 'true' && !completed.includes(FIRST_LESSON)) {
    completed.push(FIRST_LESSON)
    writeProgress(COMPLETED_KEY, JSON.stringify(completed))
  }
  return completed
}

export function markLessonCompleted(slug: string): void {
  if (!PLAYABLE_LESSONS.some(lesson => lesson.slug === slug)) return
  const completed = new Set(getCompletedLessons())
  completed.add(slug)
  writeProgress(COMPLETED_KEY, JSON.stringify([...completed]))
}

export function getSavedStep(slug: string): number {
  const current = readProgress(`${STEP_PREFIX}${slug}`)
  const legacy = slug === FIRST_LESSON ? readProgress('quantum-quest-step') : null
  const parsed = Number(current ?? legacy ?? '0')
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : 0
}

export function saveStep(slug: string, step: number): void {
  if (!Number.isInteger(step) || step < 0) return
  writeProgress(`${STEP_PREFIX}${slug}`, String(step))
  writeProgress(LAST_LESSON_KEY, slug)
}

export function getNextPlayableLesson(completed = getCompletedLessons()) {
  const completeSet = new Set(completed)
  const lastLesson = readProgress(LAST_LESSON_KEY)
  const resume = PLAYABLE_LESSONS.find(lesson => lesson.slug === lastLesson && !completeSet.has(lastLesson!))
  if (resume) return resume
  return PLAYABLE_LESSONS.find(lesson => lesson.slug && !completeSet.has(lesson.slug)) ?? PLAYABLE_LESSONS[0]
}
