import { getApplicationLesson } from './applicationLessons'
import { getFoundationLesson } from './foundationLessons'
import { getEntanglementLesson } from './entanglementLessons'
import { getLanguageLesson } from './languageLessons'
import { InteractiveLesson } from './lessonTypes'
import { getMatterLesson } from './matterLessons'
import { MATH_LESSONS } from './mathLessons'

export function getInteractiveLesson(slug: string): InteractiveLesson | undefined {
  return getFoundationLesson(slug) ?? getLanguageLesson(slug) ?? getMatterLesson(slug) ?? getEntanglementLesson(slug) ?? getApplicationLesson(slug) ?? MATH_LESSONS.find(lesson => lesson.slug === slug)
}
