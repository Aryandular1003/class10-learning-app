// ─── Shared App Data ──────────────────────────────────────────────────────────
// Single source of truth for all static master data used across the app.

import { SUBJECTS, SUBJECT_CATALOGUE, CONTENT_REVIEW_ITEMS, getSubject, getSubjectParts } from './subjects'

export { SUBJECTS, SUBJECT_CATALOGUE, CONTENT_REVIEW_ITEMS, getSubject, getSubjectParts }

export const STUDENT_META = {
  name: 'Student',
  class: 10,
  board: 'RBSE',
  subject: 'Science',
  daysToBoards: 42,
}

export const MASTER_CHAPTERS = [
  { id: 'science-1', name: 'Light \u2014 Reflection & Refraction', weight: 12, locked: false },
  { id: 'science-2', name: 'Electricity',                      weight: 10, locked: false },
  { id: 'science-3', name: 'Chemical Reactions & Equations',   weight: 9,  locked: false },
  { id: 'science-4', name: 'Life Processes',                   weight: 8, locked: false },
  { id: 'science-5', name: 'Magnetic Effects of Current',      weight: 7, locked: true  },
  { id: 'science-6', name: 'Carbon & Its Compounds',           weight: 7, locked: true  },
  { id: 'science-7', name: 'Heredity & Evolution',             weight: 6, locked: true  },
]

export function toDateKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function addDays(dateKey, amount) {
  const date = new Date(`${dateKey}T12:00:00`)
  date.setDate(date.getDate() + amount)
  return toDateKey(date)
}

export function isDateKey(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(`${value}T12:00:00`).getTime())
}

export function getPremiumExpiryDate(startDate, boardExamDate) {
  const start = new Date(startDate)
  if (Number.isNaN(start.getTime())) return null

  const oneYearLater = new Date(start)
  oneYearLater.setFullYear(oneYearLater.getFullYear() + 1)
  if (!isDateKey(boardExamDate)) return oneYearLater

  const oneMonthAfterBoard = new Date(`${boardExamDate}T23:59:59`)
  oneMonthAfterBoard.setMonth(oneMonthAfterBoard.getMonth() + 1)
  return oneMonthAfterBoard < oneYearLater ? oneMonthAfterBoard : oneYearLater
}

const todayKey = toDateKey()
const seededStudyDates = Array.from({ length: 14 }, (_, index) => addDays(todayKey, index - 13))

// Default study state — used when localStorage has nothing or gets reset
export const DEFAULT_STUDY_STATE = {
  activeSubject: 'science',
  boardExamDate: '',
  // chapter completion: map of chapterId -> boolean
  completedChapters: { 'science-1': true },
  completedChaptersBySubject: { science: { 'science-1': true } },
  // bookmarked chapter ids
  bookmarkedChapters: [],
  bookmarkedChaptersBySubject: { science: [] },
  // streak
  streakDays: 14,
  // monthly revision (days studied this month)
  monthlyDays: 14,
  monthlyGoal: 30,
  studyDates: seededStudyDates,
  earnedAchievements: {
    streak7: seededStudyDates[6],
    streak14: seededStudyDates[13],
    firstchapter: seededStudyDates[0],
  },
  activities: [],
  contentReview: Object.fromEntries(CONTENT_REVIEW_ITEMS.map((item) => [item.id, item.defaultStatus])),
  importedContent: [],
  // practice history: array of { date, topic, difficulty, score, total, pct }
  practiceHistory: [],
  // last opened chapter id (for "continue studying" card)
  lastOpenedChapterId: null,
}

export function createEmptyStudyState() {
  return {
    ...DEFAULT_STUDY_STATE,
    completedChapters: {},
    completedChaptersBySubject: {},
    bookmarkedChapters: [],
    bookmarkedChaptersBySubject: {},
    streakDays: 0,
    monthlyDays: 0,
    studyDates: [],
    earnedAchievements: {},
    activities: [],
    contentReview: { ...DEFAULT_STUDY_STATE.contentReview },
    importedContent: [],
    practiceHistory: [],
    lastOpenedChapterId: null,
    boardExamDate: '',
  }
}

export const STORAGE_KEY = 'boardready-study-state-v1'

// Safe read from localStorage
export function loadStudyState(storageKey = STORAGE_KEY, fallbackState = DEFAULT_STUDY_STATE) {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return { ...fallbackState }
    const parsed = JSON.parse(raw)
    const chapterIds = new Set(MASTER_CHAPTERS.map((chapter) => chapter.id))
    const normalizeScienceIds = (value) => Object.fromEntries(Object.entries(value || {}).flatMap(([id, done]) => {
      if (typeof done !== 'boolean') return []
      const normalizedId = /^\d+$/.test(id) ? `science-${id}` : id
      return chapterIds.has(normalizedId) || SUBJECTS.some((subject) => normalizedId.startsWith(`${subject.id}-`))
        ? [[normalizedId, done]]
        : []
    }))
    const completedChapters = parsed.completedChapters && typeof parsed.completedChapters === 'object' && !Array.isArray(parsed.completedChapters)
      ? normalizeScienceIds(parsed.completedChapters)
      : fallbackState.completedChapters
    const bookmarkedChapters = Array.isArray(parsed.bookmarkedChapters)
      ? parsed.bookmarkedChapters.map((id) => /^\d+$/.test(String(id)) ? `science-${id}` : String(id)).filter((id) => chapterIds.has(id))
      : fallbackState.bookmarkedChapters
    const studyDates = Array.isArray(parsed.studyDates)
      ? [...new Set(parsed.studyDates.filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(date)))].sort()
      : fallbackState.studyDates
    const practiceHistory = Array.isArray(parsed.practiceHistory)
      ? parsed.practiceHistory.filter((attempt) => attempt && typeof attempt === 'object' && Number.isFinite(attempt.score) && Number.isFinite(attempt.total))
      : fallbackState.practiceHistory
    const activities = Array.isArray(parsed.activities)
      ? parsed.activities.filter((activity) => activity && typeof activity === 'object' && activity.title && activity.dateKey).slice(0, 20)
      : fallbackState.activities
    const earnedAchievements = parsed.earnedAchievements && typeof parsed.earnedAchievements === 'object'
      ? parsed.earnedAchievements
      : fallbackState.earnedAchievements
    const completedChaptersBySubject = parsed.completedChaptersBySubject && typeof parsed.completedChaptersBySubject === 'object'
      ? Object.fromEntries(Object.entries(parsed.completedChaptersBySubject).map(([subjectId, values]) => [subjectId, normalizeScienceIds(values)]))
      : fallbackState.completedChaptersBySubject
    const bookmarkedChaptersBySubject = parsed.bookmarkedChaptersBySubject && typeof parsed.bookmarkedChaptersBySubject === 'object'
      ? Object.fromEntries(Object.entries(parsed.bookmarkedChaptersBySubject).map(([subjectId, values]) => [subjectId, (values || []).map((id) => /^\d+$/.test(String(id)) ? `science-${id}` : String(id))]))
      : fallbackState.bookmarkedChaptersBySubject
    const contentReview = parsed.contentReview && typeof parsed.contentReview === 'object'
      ? parsed.contentReview
      : fallbackState.contentReview
    const importedContent = Array.isArray(parsed.importedContent) ? parsed.importedContent : fallbackState.importedContent
    const boardExamDate = isDateKey(parsed.boardExamDate) ? parsed.boardExamDate : (fallbackState.boardExamDate || '')
    return {
      ...fallbackState,
      ...parsed,
      activeSubject: SUBJECTS.some((subject) => subject.id === parsed.activeSubject) ? parsed.activeSubject : 'science',
      completedChapters,
      completedChaptersBySubject,
      bookmarkedChapters,
      bookmarkedChaptersBySubject,
      studyDates,
      practiceHistory,
      activities,
      earnedAchievements,
      contentReview,
      importedContent,
      boardExamDate,
    }
  } catch {
    return { ...fallbackState }
  }
}

// Safe write to localStorage
export function saveStudyState(state, storageKey = STORAGE_KEY) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state))
  } catch {
    // Ignore storage errors (e.g. incognito quota)
  }
}
