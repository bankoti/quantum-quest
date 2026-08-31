import { getFoundationLesson } from './foundationLessons'
import { getEntanglementLesson } from './entanglementLessons'
import { getLanguageLesson } from './languageLessons'
import { InteractiveLesson } from './lessonTypes'
import { getMatterLesson } from './matterLessons'

export function getInteractiveLesson(slug: string): InteractiveLesson | undefined {
  return getFoundationLesson(slug) ?? getLanguageLesson(slug) ?? getMatterLesson(slug) ?? getEntanglementLesson(slug)
}
