export interface ConceptQuestion {
  question: string
  options: string[]
  correct: number
  success: string
}

export interface InteractiveStep {
  label: string
  eyebrow: string
  title: string
  lede: string
  body: string
  scene: string
  control?: string
  equation?: { expression: string; explanation: string }
  modelNote?: string
  source?: { title: string; url: string }
}

export interface InteractiveLesson {
  slug: string
  title: string
  number: number
  minutes: number
  accent: string
  canvas?: 'foundation' | 'language' | 'matter' | 'entanglement' | 'application' | 'math'
  stageNumber?: number
  stageLabel?: string
  steps: InteractiveStep[]
  questions: ConceptQuestion[]
  takeaways: string[]
  nextSlug?: string
}
