import { FoundationLesson, getFoundationLesson } from './foundationLessons'
import { getLanguageLesson } from './languageLessons'

export function getInteractiveLesson(slug: string): FoundationLesson | undefined {
  return getFoundationLesson(slug) ?? getLanguageLesson(slug)
}
