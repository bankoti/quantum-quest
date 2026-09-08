import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { InteractiveLesson } from './lessonTypes'
import { getSavedStep, readLessonSession, saveLessonSession, saveStep } from './progress'
import { validMathSettings } from './mathLessons'

export type AnswerState = 'idle' | 'correct' | 'wrong'
type Experiment = { value: number; mode: string; hits: number[]; active: boolean; pulse: number }
type Session = { version: 1; step: number; experiments: Record<number, Experiment>; answers: Record<number, number>; answerState: AnswerState }
type Defaults = { value: number; mode: string }

function isExperiment(value: unknown): value is Experiment {
  if (!value || typeof value !== 'object') return false
  const item = value as Experiment
  return Number.isFinite(item.value) && item.value >= 0 && item.value <= 100
    && typeof item.mode === 'string' && item.mode.length <= 40
    && typeof item.active === 'boolean' && Number.isInteger(item.pulse) && item.pulse >= 0
    && Array.isArray(item.hits) && item.hits.length <= 400 && item.hits.every(hit => Number.isFinite(hit) && hit >= 0 && hit <= 3)
}

export function useLessonSession(lesson: InteractiveLesson, defaults: Defaults, values: Record<string, number>, modes: Record<string, string>) {
  function createExperiment(step: number, previous: Defaults = defaults): Experiment {
    const control = lesson.steps[step].control ?? ''
    return { value: values[control] ?? previous.value, mode: modes[control] ?? previous.mode, hits: [], active: false, pulse: 0 }
  }

  const [session, setSession] = useState<Session>(() => {
    const stored = readLessonSession(lesson.slug) as Partial<Session> | null
    const validStep = (step: unknown): step is number => Number.isInteger(step) && Number(step) >= 0 && Number(step) < lesson.steps.length - 1
    const resumable = stored?.version === 1 && validStep(stored.step)
    const step = resumable ? stored.step! : validStep(getSavedStep(lesson.slug)) ? getSavedStep(lesson.slug) : 0
    const experiments: Record<number, Experiment> = {}
    for (let index = 0; index < lesson.steps.length; index += 1) {
      const saved = resumable ? stored.experiments?.[index] : undefined
      if (isExperiment(saved) && (lesson.canvas !== 'math' || validMathSettings(lesson.steps[index].control ?? '', saved))) experiments[index] = saved
      else if (index <= step) experiments[index] = createExperiment(index, experiments[index - 1])
    }
    const answers: Record<number, number> = {}
    if (resumable && stored.answers && typeof stored.answers === 'object') {
      lesson.questions.forEach((question, index) => {
        const answer = stored.answers?.[index]
        if (Number.isInteger(answer) && Number(answer) >= 0 && Number(answer) < question.options.length) answers[index] = Number(answer)
      })
    }
    const checked = stored?.answerState === 'correct' && lesson.questions.every((question, index) => answers[index] === question.correct)
    return { version: 1, step, experiments, answers, answerState: checked ? 'correct' : 'idle' }
  })

  useEffect(() => {
    saveLessonSession(lesson.slug, session)
    saveStep(lesson.slug, session.step)
  }, [lesson.slug, session])

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [session.step])

  function updateExperiment<K extends keyof Experiment>(key: K, update: SetStateAction<Experiment[K]>) {
    setSession(current => {
      const experiment = current.experiments[current.step]
      const next = typeof update === 'function' ? (update as (value: Experiment[K]) => Experiment[K])(experiment[key]) : update
      if (Object.is(experiment[key], next)) return current
      // Later trials depend on this preparation and must be repeated if it changes.
      const experiments = Object.fromEntries(Object.entries(current.experiments).filter(([index]) => Number(index) <= current.step))
      experiments[current.step] = { ...experiment, [key]: next }
      return { ...current, experiments, answers: {}, answerState: 'idle' }
    })
  }

  function goTo(step: number) {
    setSession(current => {
      const target = Math.max(0, Math.min(lesson.steps.length - 1, step))
      const previous = current.experiments[current.step]
      const experiment = current.experiments[target] ?? { ...createExperiment(target, previous), active: previous.active }
      return { ...current, step: target, experiments: { ...current.experiments, [target]: experiment } }
    })
  }

  const setAnswers: Dispatch<SetStateAction<Record<number, number>>> = update => setSession(current => ({ ...current, answers: typeof update === 'function' ? update(current.answers) : update }))
  const setAnswerState: Dispatch<SetStateAction<AnswerState>> = update => setSession(current => ({ ...current, answerState: typeof update === 'function' ? update(current.answerState) : update }))

  return {
    step: session.step, ...session.experiments[session.step], answers: session.answers, answerState: session.answerState,
    setValue: (value: number) => updateExperiment('value', value),
    setMode: (mode: string) => updateExperiment('mode', mode),
    setHits: (update: SetStateAction<number[]>) => updateExperiment('hits', update),
    setActive: (update: SetStateAction<boolean>) => updateExperiment('active', update),
    setPulse: (update: SetStateAction<number>) => updateExperiment('pulse', update),
    setAnswers, setAnswerState, goTo,
  }
}
