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
}

export interface InteractiveLesson {
  slug: string
  title: string
  number: number
  minutes: number
  accent: string
  canvas?: 'foundation' | 'language' | 'matter'
  stageNumber?: number
  stageLabel?: string
  steps: InteractiveStep[]
  questions: ConceptQuestion[]
  takeaways: string[]
  nextSlug?: string
}
