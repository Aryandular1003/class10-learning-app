import { SUBJECTS, CONTENT_TYPES, REVIEW_STATUSES } from './subjects'

export const CONTENT_PACK_VERSION = '1.0'

export function createContentPackTemplate(subjectId = 'science') {
  return {
    version: CONTENT_PACK_VERSION,
    subjectId,
    syllabusSession: 'RBSE Class 10',
    sourceRefs: [],
    chapters: [
      {
          chapterId: `${subjectId}-1`,
        title: 'Replace with verified chapter name',
        section: 'Replace with section or unit',
          reviewStatus: 'approved',
        content: {
          notes: [],
          pyq: [],
          practice: [],
          predicted: [],
        },
      },
    ],
  }
}

export function validateContentPack(input) {
  const errors = []
  if (!input || typeof input !== 'object') errors.push('Content pack must be a JSON object.')
  const subjectId = input?.subjectId
  if (!SUBJECTS.some((subject) => subject.id === subjectId)) errors.push('subjectId must be one of the supported subjects.')
  if (!Array.isArray(input?.chapters)) errors.push('chapters must be an array.')
  if (Array.isArray(input?.chapters)) {
    input.chapters.forEach((chapter, index) => {
      if (!chapter || typeof chapter !== 'object') errors.push(`chapters[${index}] must be an object.`)
      if (!chapter?.chapterId) errors.push(`chapters[${index}].chapterId is required.`)
      if (!chapter?.title) errors.push(`chapters[${index}].title is required.`)
      if (chapter?.reviewStatus && !REVIEW_STATUSES.includes(chapter.reviewStatus)) errors.push(`chapters[${index}].reviewStatus is invalid.`)
      if (chapter?.content && typeof chapter.content !== 'object') errors.push(`chapters[${index}].content must be an object.`)
      if (chapter?.content) {
        Object.keys(chapter.content).forEach((type) => {
          if (!CONTENT_TYPES.includes(type)) errors.push(`chapters[${index}].content.${type} is not a supported content type.`)
          if (!Array.isArray(chapter.content[type])) errors.push(`chapters[${index}].content.${type} must be an array.`)
        })
      }
    })
  }
  return { valid: errors.length === 0, errors }
}

export function flattenContentPack(pack) {
  return pack.chapters.flatMap((chapter) => Object.entries(chapter.content || {}).flatMap(([type, items]) =>
    items.map((item, index) => ({
      id: `${pack.subjectId}-${chapter.chapterId}-${type}-${index + 1}`,
      subjectId: pack.subjectId,
      chapterId: chapter.chapterId,
      chapterName: chapter.title,
      type,
      status: 'approved',
      content: item,
      sourceRefs: pack.sourceRefs || [],
    })),
  ))
}
