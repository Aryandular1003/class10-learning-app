import { describe, expect, it, beforeEach } from 'vitest'
import { createEmptyStudyState, loadStudyState, saveStudyState } from './appData'
import { validateContentPack } from './contentSchema'
import { getCurrentStreak, getLongestStreak } from './studyUtils'
import { sanitizeProfileUpdate } from './profile'

function createStorage() {
  const values = new Map()
  return {
    getItem: (key) => values.get(key) || null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
    clear: () => values.clear(),
  }
}

beforeEach(() => {
  globalThis.localStorage = createStorage()
})

describe('study state', () => {
  it('starts signed-in users with zero progress', () => {
    const state = createEmptyStudyState()
    expect(state.studyDates).toEqual([])
    expect(state.streakDays).toBe(0)
    expect(state.earnedAchievements).toEqual({})
  })

  it('saves and loads state from a user-specific key', () => {
    const state = createEmptyStudyState()
    state.completedChaptersBySubject = { science: { 'science-1': true } }
    saveStudyState(state, 'user-a')
    expect(loadStudyState('user-a', createEmptyStudyState()).completedChaptersBySubject.science['science-1']).toBe(true)
    expect(loadStudyState('user-b', createEmptyStudyState()).completedChaptersBySubject).toEqual({})
  })

  it('migrates old numeric Science chapter ids', () => {
    localStorage.setItem('legacy', JSON.stringify({ completedChapters: { 1: true }, bookmarkedChapters: [2] }))
    const state = loadStudyState('legacy', createEmptyStudyState())
    expect(state.completedChapters['science-1']).toBe(true)
    expect(state.bookmarkedChapters).toEqual(['science-2'])
  })
})

describe('streak rules', () => {
  it('counts only consecutive study dates through today', () => {
    expect(getCurrentStreak(['2026-09-08', '2026-09-09', '2026-09-10'], '2026-09-10')).toBe(3)
    expect(getCurrentStreak(['2026-09-08', '2026-09-10'], '2026-09-10')).toBe(1)
  })

  it('finds the longest historical run', () => {
    expect(getLongestStreak(['2026-09-01', '2026-09-02', '2026-09-05', '2026-09-06', '2026-09-07'])).toBe(3)
  })
})

describe('content and profile boundaries', () => {
  it('rejects invalid content packs', () => {
    expect(validateContentPack({ subjectId: 'science', chapters: [] }).valid).toBe(true)
    expect(validateContentPack({ subjectId: 'not-a-subject', chapters: [] }).valid).toBe(false)
  })

  it('never sends a role in a client profile update', () => {
    const safe = sanitizeProfileUpdate({ full_name: 'Aryan', role: 'founder', board: 'RBSE' })
    expect(safe).toEqual({ full_name: 'Aryan', board: 'RBSE' })
    expect(safe.role).toBeUndefined()
  })

  it('never sends is_premium or premium_since in a client profile update', () => {
    const safe = sanitizeProfileUpdate({ full_name: 'Aryan', is_premium: true, premium_since: '2026-01-01', role: 'student' })
    expect(safe).toEqual({ full_name: 'Aryan' })
    expect(safe.is_premium).toBeUndefined()
    expect(safe.premium_since).toBeUndefined()
  })
})
