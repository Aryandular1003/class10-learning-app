import { createContext, useState, useCallback, useMemo, useEffect, useRef } from 'react'
import {
  MASTER_CHAPTERS,
  DEFAULT_STUDY_STATE,
  loadStudyState,
  saveStudyState,
  toDateKey,
  addDays,
  SUBJECTS,
  SUBJECT_CATALOGUE,
  CONTENT_REVIEW_ITEMS,
  STORAGE_KEY,
  createEmptyStudyState,
} from '../data/appData'
import { flattenContentPack, validateContentPack } from '../data/contentSchema'
import { loadRemoteReviewItems, loadStudentProgress, saveContentPack, syncStudentProgress } from '../data/contentRepository'
import { useAuth } from '../hooks/useAuth'

// ─── Context ──────────────────────────────────────────────────────────────────
const StudyContext = createContext(null)

export function StudyProvider({ children }) {
  const { user, profile } = useAuth()
  const userStorageKey = user?.id ? `${STORAGE_KEY}-${user.id}` : STORAGE_KEY
  const [studyState, setStudyState] = useState(() => loadStudyState(userStorageKey, user ? createEmptyStudyState() : DEFAULT_STUDY_STATE))
  const progressHydratedFor = useRef(null)
  const [progressSyncError, setProgressSyncError] = useState(null)

  useEffect(() => {
    setStudyState(loadStudyState(userStorageKey, user ? createEmptyStudyState() : DEFAULT_STUDY_STATE))
  }, [user, userStorageKey])

  useEffect(() => {
    if (!user) {
      progressHydratedFor.current = null
      return undefined
    }
    let active = true
    loadStudentProgress(user.id).then((remote) => {
      if (!active) return
      const local = loadStudyState(userStorageKey, createEmptyStudyState())
      const completedChaptersBySubject = { ...(local.completedChaptersBySubject || {}), ...(remote.completedChaptersBySubject || {}) }
      const bookmarkedChaptersBySubject = { ...(local.bookmarkedChaptersBySubject || {}), ...(remote.bookmarkedChaptersBySubject || {}) }
      const next = {
        ...local,
        completedChaptersBySubject,
        bookmarkedChaptersBySubject,
        completedChapters: completedChaptersBySubject.science || {},
        bookmarkedChapters: bookmarkedChaptersBySubject.science || [],
        lastOpenedChapterId: remote.lastOpenedChapterId || local.lastOpenedChapterId,
      }
      progressHydratedFor.current = user.id
      setStudyState(next)
      saveStudyState(next, userStorageKey)
      setProgressSyncError(null)
    }).catch((error) => {
      if (active) {
        progressHydratedFor.current = user.id
        setProgressSyncError(error.message || 'Progress sync is unavailable; local progress is still active.')
      }
    })
    return () => { active = false }
  }, [user, userStorageKey])

  useEffect(() => {
    if (!user || progressHydratedFor.current !== user.id) return
    syncStudentProgress(user.id, studyState).then(() => setProgressSyncError(null)).catch((error) => {
      setProgressSyncError(error.message || 'Progress sync is unavailable; local progress is still active.')
    })
  }, [studyState, user])
  const activeSubject = studyState.activeSubject || 'science'
  const subjectDefinition = SUBJECTS.find((subject) => subject.id === activeSubject) || SUBJECTS[3]
  const baseChapters = useMemo(() => (SUBJECT_CATALOGUE[activeSubject] || MASTER_CHAPTERS).map((chapter) => ({
    ...chapter,
    id: chapter.id || `${activeSubject}-${chapter.index + 1}`,
  })), [activeSubject])
  const [remoteReviewItems, setRemoteReviewItems] = useState([])
  const [remoteReviewError, setRemoteReviewError] = useState(null)

  useEffect(() => {
    if (!user || !['founder', 'teacher'].includes(profile?.role)) {
      setRemoteReviewItems([])
      setRemoteReviewError(null)
      return undefined
    }
    let active = true
    loadRemoteReviewItems(activeSubject).then((result) => {
      if (active) {
        setRemoteReviewItems(result.items || [])
        setRemoteReviewError(null)
      }
    }).catch((error) => {
      if (active) setRemoteReviewError(error.message || 'Could not load remote review content.')
    })
    return () => { active = false }
  }, [activeSubject, profile?.role, user])

  const getCurrentStreak = useCallback((dates) => {
    const set = new Set(dates)
    let cursor = toDateKey()
    let streak = 0
    while (set.has(cursor)) {
      streak += 1
      cursor = addDays(cursor, -1)
    }
    return streak
  }, [])

  const getLongestStreak = useCallback((dates) => {
    const sorted = [...new Set(dates)].sort()
    let longest = 0
    let current = 0
    sorted.forEach((date, index) => {
      current = index > 0 && date === addDays(sorted[index - 1], 1) ? current + 1 : 1
      longest = Math.max(longest, current)
    })
    return longest
  }, [])

  const addActivity = useCallback((prev, activity) => {
    const dateKey = toDateKey()
    const activityItem = { ...activity, dateKey, id: `${dateKey}-${Date.now()}` }
    return [activityItem, ...(prev.activities || [])].slice(0, 20)
  }, [])

  const applyDateActivity = useCallback((prev, activity) => {
    const studyDates = [...new Set([...(prev.studyDates || []), toDateKey()])].sort()
    const currentStreak = getCurrentStreak(studyDates)
    const completedCount = Object.values(prev.completedChapters || {}).filter(Boolean).length
    const earnedAchievements = { ...(prev.earnedAchievements || {}) }
    const rules = [
      ['streak7', currentStreak >= 7 || getLongestStreak(studyDates) >= 7],
      ['streak14', currentStreak >= 14 || getLongestStreak(studyDates) >= 14],
      ['streak21', currentStreak >= 21 || getLongestStreak(studyDates) >= 21],
      ['firstchapter', completedCount >= 1],
      ['chapters5', completedCount >= 5],
      ['practicePro', (prev.practiceHistory || []).length >= 5],
    ]
    rules.forEach(([id, earned]) => {
      if (earned && !earnedAchievements[id]) earnedAchievements[id] = toDateKey()
    })
    const today = toDateKey()
    const alreadyStudiedToday = (prev.studyDates || []).includes(today)
    return {
      ...prev,
      studyDates,
      streakDays: currentStreak || prev.streakDays,
      monthlyDays: alreadyStudiedToday ? prev.monthlyDays : Math.min(prev.monthlyGoal, prev.monthlyDays + 1),
      earnedAchievements,
      activities: activity ? addActivity(prev, activity) : prev.activities || [],
    }
  }, [addActivity, getCurrentStreak, getLongestStreak])

  // Generic updater — merges partial state and persists
  const update = useCallback((partial) => {
    setStudyState((prev) => {
      const next = { ...prev, ...partial }
      saveStudyState(next, userStorageKey)
      return next
    })
  }, [userStorageKey])

  const isPremium = Boolean(studyState.isPremium || profile?.is_premium)
  const paymentDetails = studyState.paymentDetails || null

  const activatePremium = useCallback((paymentData) => {
    setStudyState((prev) => {
      const next = {
        ...prev,
        isPremium: true,
        paymentDetails: paymentData,
      }
      saveStudyState(next, userStorageKey)
      return next
    })
  }, [userStorageKey])

  // ── Derived chapter list (with live done status) ──
  const completedForSubject = studyState.completedChaptersBySubject?.[activeSubject]
    || (activeSubject === 'science' ? studyState.completedChapters : {})
    || {}
  const chapters = baseChapters.map((ch) => ({
    ...ch,
    done: !!completedForSubject[ch.id],
    locked: isPremium ? false : ch.locked,
    subjectId: activeSubject,
  }))

  const setActiveSubject = useCallback((subjectId) => {
    if (!SUBJECTS.some((subject) => subject.id === subjectId)) return
    update({ activeSubject: subjectId })
  }, [update])

  // ── Chapter completion toggle ──
  const toggleChapterComplete = useCallback((chapterId, forceValue) => {
    setStudyState((prev) => {
      const previousMap = prev.completedChaptersBySubject?.[activeSubject]
        || (activeSubject === 'science' ? prev.completedChapters : {})
      const current = !!previousMap[chapterId]
      const next = forceValue !== undefined ? forceValue : !current
      const completedForSubject = { ...previousMap, [chapterId]: next }
      const completedChaptersBySubject = {
        ...(prev.completedChaptersBySubject || {}),
        [activeSubject]: completedForSubject,
      }

      const newState = applyDateActivity(
        {
          ...prev,
          completedChapters: activeSubject === 'science' ? completedForSubject : prev.completedChapters,
          completedChaptersBySubject,
        },
        next && !current ? { type: 'chapter', title: `Completed ${baseChapters.find((chapter) => chapter.id === chapterId)?.name || 'chapter'}` } : null,
      )
      saveStudyState(newState, userStorageKey)
      return newState
    })
  }, [activeSubject, applyDateActivity, baseChapters, userStorageKey])

  // ── Bookmark toggle ──
  const toggleBookmark = useCallback((chapterId) => {
    setStudyState((prev) => {
      const previousBookmarks = prev.bookmarkedChaptersBySubject?.[activeSubject]
        || (activeSubject === 'science' ? prev.bookmarkedChapters : [])
      const isBookmarked = previousBookmarks.includes(chapterId)
      const bookmarkedChapters = isBookmarked
        ? previousBookmarks.filter((id) => id !== chapterId)
        : [...previousBookmarks, chapterId]
      const bookmarkedChaptersBySubject = { ...(prev.bookmarkedChaptersBySubject || {}), [activeSubject]: bookmarkedChapters }
      const newState = {
        ...prev,
        bookmarkedChapters: activeSubject === 'science' ? bookmarkedChapters : prev.bookmarkedChapters,
        bookmarkedChaptersBySubject,
      }
      saveStudyState(newState, userStorageKey)
      return newState
    })
  }, [activeSubject, userStorageKey])

  // ── Set last opened chapter ──
  const setLastOpenedChapter = useCallback((chapterId) => {
    update({ lastOpenedChapterId: chapterId })
  }, [update])

  const recordStudyActivity = useCallback((activity) => {
    setStudyState((prev) => {
      const next = applyDateActivity(prev, activity)
      saveStudyState(next, userStorageKey)
      return next
    })
  }, [applyDateActivity, userStorageKey])

  // ── Record practice attempt ──
  const recordPracticeAttempt = useCallback(({ topic, difficulty, score, total }) => {
    setStudyState((prev) => {
      const pct = Math.round((score / total) * 100)
      const attempt = {
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        topic,
        difficulty,
        score,
        total,
        pct,
      }
      const practiceHistory = [attempt, ...prev.practiceHistory].slice(0, 20)
      const newState = applyDateActivity(
        { ...prev, practiceHistory },
        { type: 'practice', title: `Practised ${topic}`, detail: `${pct}% score` },
      )
      saveStudyState(newState, userStorageKey)
      return newState
    })
  }, [applyDateActivity, userStorageKey])

  // ── Reset to demo defaults ──
  const resetToDefaults = useCallback(() => {
    const fresh = user ? createEmptyStudyState() : {
      ...DEFAULT_STUDY_STATE,
      studyDates: [...DEFAULT_STUDY_STATE.studyDates],
      activities: [],
      completedChaptersBySubject: { ...DEFAULT_STUDY_STATE.completedChaptersBySubject },
      bookmarkedChaptersBySubject: { ...DEFAULT_STUDY_STATE.bookmarkedChaptersBySubject },
      contentReview: { ...DEFAULT_STUDY_STATE.contentReview },
    }
    saveStudyState(fresh, userStorageKey)
    setStudyState(fresh)
  }, [user, userStorageKey])

  // ── Computed values ──
  const completedCount = Object.values(completedForSubject).filter(Boolean).length
  const monthlyPct = Math.min(100, Math.round((studyState.monthlyDays / studyState.monthlyGoal) * 100))
  const bookmarkedForSubject = studyState.bookmarkedChaptersBySubject?.[activeSubject]
    || (activeSubject === 'science' ? studyState.bookmarkedChapters : [])
    || []
  const bookmarkedChapters = baseChapters.filter((ch) =>
    bookmarkedForSubject.includes(ch.id)
  ).map((ch) => ({ ...ch, done: !!completedForSubject[ch.id] }))

  const builtInReviewItems = CONTENT_REVIEW_ITEMS.filter((item) => item.subjectId === activeSubject).map((item) => ({
    ...item,
    status: 'approved',
  }))
  const importedReviewItems = (studyState.importedContent || [])
    .filter((item) => item.subjectId === activeSubject)
    .map((item) => ({
      ...item,
      defaultStatus: 'approved',
      status: 'approved',
    }))
  const remoteIds = new Set(remoteReviewItems.map((item) => item.id))
  const reviewItems = [...builtInReviewItems, ...remoteReviewItems, ...importedReviewItems.filter((item) => !remoteIds.has(item.id))]

  const importContentPack = useCallback(async (pack) => {
    const validation = validateContentPack(pack)
    if (!validation.valid) return validation

    const records = flattenContentPack(pack)
    setStudyState((prev) => {
      const otherRecords = (prev.importedContent || []).filter((record) => record.subjectId !== pack.subjectId)
      const contentReview = { ...(prev.contentReview || {}) }
      records.forEach((record) => {
        contentReview[record.id] = 'approved'
      })
      const next = {
        ...prev,
        importedContent: [...otherRecords, ...records],
        contentReview,
      }
      saveStudyState(next, userStorageKey)
      return next
    })
    try {
      const persistence = await saveContentPack(pack)
      return { valid: true, errors: [], importedCount: records.length, mode: persistence.mode }
    } catch {
      return { valid: true, errors: [], importedCount: records.length, mode: 'local', syncWarning: true }
    }
  }, [userStorageKey])

  // ── Best practice score per topic ──
  const bestScoreByTopic = studyState.practiceHistory.reduce((acc, attempt) => {
    if (!acc[attempt.topic] || attempt.pct > acc[attempt.topic]) {
      acc[attempt.topic] = attempt.pct
    }
    return acc
  }, {})

  // ── Achievements ──
  const longestStreak = getLongestStreak(studyState.studyDates || [])
  const achievements = [
    {
      id: 'streak7',
      title: '7-Day Starter',
      description: 'Studied for 7 days in a row',
      emoji: '🔥',
      earned: !!studyState.earnedAchievements?.streak7,
      earnedDate: studyState.earnedAchievements?.streak7,
    },
    {
      id: 'streak14',
      title: '14-Day Streak',
      description: 'Studied for 14 consecutive days',
      emoji: '⚡',
      earned: !!studyState.earnedAchievements?.streak14,
      earnedDate: studyState.earnedAchievements?.streak14,
    },
    {
      id: 'firstchapter',
      title: 'First Chapter Revised',
      description: 'Completed your first chapter revision',
      emoji: '📖',
      earned: !!studyState.earnedAchievements?.firstchapter,
      earnedDate: studyState.earnedAchievements?.firstchapter,
    },
    {
      id: 'streak21',
      title: '21-Day Champion',
      description: 'Keep going to unlock!',
      emoji: '🏅',
      earned: !!studyState.earnedAchievements?.streak21,
      progress: Math.max(studyState.streakDays, longestStreak),
      target: 21,
    },
    {
      id: 'chapters5',
      title: 'Chapter Champion',
      description: 'Complete 5 chapters to unlock',
      emoji: '🌟',
      earned: !!studyState.earnedAchievements?.chapters5,
      progress: completedCount,
      target: 5,
    },
    {
      id: 'practicePro',
      title: 'Practice Pro',
      description: 'Complete 5 practice quizzes',
      emoji: '✏️',
      earned: !!studyState.earnedAchievements?.practicePro,
      earnedDate: studyState.earnedAchievements?.practicePro || null,
      progress: Math.min(5, studyState.practiceHistory?.length || 0),
      target: 5,
    },
  ]

  const topicPerformance = (studyState.practiceHistory || []).reduce((acc, attempt) => {
    const item = acc[attempt.topic] || { attempts: 0, correct: 0, total: 0, average: 0 }
    item.attempts += 1
    item.correct += attempt.score
    item.total += attempt.total
    item.average = item.total ? Math.round((item.correct / item.total) * 100) : 0
    acc[attempt.topic] = item
    return acc
  }, {})
  const totalQuestions = (studyState.practiceHistory || []).reduce((sum, attempt) => sum + attempt.total, 0)
  const totalCorrect = (studyState.practiceHistory || []).reduce((sum, attempt) => sum + attempt.score, 0)
  const averageScore = totalQuestions ? Math.round((totalCorrect / totalQuestions) * 100) : 0

  const value = {
    studyState,
    chapters,
    subjectDefinition,
    activeSubject,
    subjects: SUBJECTS,
    completedCount,
    monthlyPct,
    bookmarkedChapters,
    bestScoreByTopic,
    reviewItems,
    remoteReviewError,
    progressSyncError,
    currentStreak: getCurrentStreak(studyState.studyDates || []),
    longestStreak,
    totalQuestions,
    averageScore,
    topicPerformance,
    achievements,
    isPremium,
    paymentDetails,
    activatePremium,
    setActiveSubject,
    importContentPack,
    toggleChapterComplete,
    toggleBookmark,
    setLastOpenedChapter,
    recordStudyActivity,
    recordPracticeAttempt,
    resetToDefaults,
  }

  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>
}

export { StudyContext }
