import { useEffect, useState } from 'react'
import { useTheme } from '../theme/useTheme'
import { useStudy } from '../hooks/useStudy'
import { useAuth } from '../hooks/useAuth'
import { toDateKey } from '../data/appData'
import {
  FireIcon,
  ClockIcon,
  BookOpenIcon,
  ChevronRightIcon,
  SparklesIcon,
  LockClosedIcon,
  BellIcon,
  XMarkIcon,
} from '../components/ui/icons'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'
import ScreenHeader from '../components/ui/ScreenHeader'
import BottomNav from '../components/ui/BottomNav'
import SubjectSwitcher from '../components/ui/SubjectSwitcher'
import RazorpayCheckoutModal from '../components/ui/RazorpayCheckoutModal'
import { getSubjectParts } from '../data/subjects'

// ─── Sub-components ────────────────────────────────────────────────────────────

function StreakDot({ active, label }) {
  return (
    <div
      aria-label={label}
      title={label}
      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
        ${active
          ? 'bg-amber-500 text-white shadow-amber'
          : 'bg-stone-100 dark:bg-stone-800 text-stone-300 dark:text-stone-600'
        }`}
    >
      {active ? '✓' : '·'}
    </div>
  )
}

function WeightageBar({ weight, maxWeight }) {
  const pct = Math.round((weight / maxWeight) * 100)
  return (
    <div className="progress-bar w-full">
      <div className="progress-fill bg-amber-gradient" style={{ width: `${pct}%` }} />
    </div>
  )
}

function ChapterCard({ chapter, index, onSelectChapter, onSelectLocked }) {
  const isLocked = chapter.locked
  return (
    <Card
      className={`p-4 transition-all duration-200 cursor-pointer ${
        isLocked
          ? 'bg-stone-50/80 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-700/50 hover:border-violet-300 dark:hover:border-violet-500'
          : 'hover:shadow-card-md active:scale-[0.99]'
      }`}
      onClick={() => (isLocked ? onSelectLocked(chapter) : onSelectChapter(chapter))}
      role="button"
      aria-label={`${isLocked ? 'Preview locked' : 'Open'} chapter ${chapter.name}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-chip flex items-center justify-center text-xs font-bold ${
            chapter.done
              ? 'bg-teal-100 dark:bg-teal-950/90 text-teal-700 dark:text-teal-300'
              : isLocked
              ? 'bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-500'
              : 'bg-amber-50 dark:bg-amber-950/90 text-amber-700 dark:text-amber-300'
          }`}
        >
          {chapter.done ? '✓' : `#${index + 1}`}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <p
              className={`text-sm font-semibold leading-snug ${
                isLocked ? 'text-stone-500 dark:text-stone-400' : 'text-stone-900 dark:text-stone-100'
              }`}
            >
              {chapter.name}
            </p>
            {isLocked ? (
              <LockClosedIcon className="w-4 h-4 text-violet-500 dark:text-violet-400 flex-shrink-0 mt-0.5" />
            ) : (
              <ChevronRightIcon className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <WeightageBar weight={chapter.weight} maxWeight={chapter.maxWeight || chapter.weight} />
            <span className={`text-xs font-bold flex-shrink-0 ${isLocked ? 'text-stone-400 dark:text-stone-400' : 'text-amber-600 dark:text-amber-400'}`}>
              {chapter.weight}%
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <Badge variant={chapter.done ? 'teal' : isLocked ? 'violet' : 'accent'}>
              {chapter.done ? 'Completed' : isLocked ? '🔒 Paid Tier' : 'Ready for revision'}
            </Badge>
            <span className="text-xs text-stone-400 dark:text-stone-400">Board weightage</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

function UnlockTeaser({ onOpenPreview }) {
  return (
    <Card className="p-4 border border-violet-200 dark:border-violet-700/60 bg-gradient-to-br from-violet-50/80 via-white to-amber-50/30 dark:from-violet-950/40 dark:via-stone-800 dark:to-amber-950/30">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-950/90 flex items-center justify-center flex-shrink-0">
          <SparklesIcon className="w-5 h-5 text-violet-600 dark:text-violet-300" />
        </div>
        <div className="flex-1 min-w-0">
          <Badge variant="violet">Paid Tier Preview</Badge>
          <p className="text-sm font-semibold text-stone-900 dark:text-stone-100 mt-1 leading-snug">
            Unlock complete revision notes
          </p>
          <p className="text-xs text-stone-600 dark:text-stone-300 mt-0.5 leading-relaxed">
            All chapters + AI-curated predicted questions for RBSE Class 10.
          </p>
          <button
            onClick={onOpenPreview}
            className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-btn
              bg-violet-600 dark:bg-violet-700 text-white text-sm font-semibold min-h-[44px]
              active:scale-95 transition-transform duration-150 shadow-sm
              hover:bg-violet-700 dark:hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-400"
          >
            <SparklesIcon className="w-4 h-4" />
            See what's included
          </button>
        </div>
      </div>
    </Card>
  )
}

// ─── Main Screen ───────────────────────────────────────────────────────────────

export default function HomeDashboard({ onOpenChapterNotes, onOpenLockedNotes, onNavigate }) {
  const { theme, toggleTheme } = useTheme()
  const { profile } = useAuth()
  const { chapters, studyState, completedCount, monthlyPct, currentStreak, subjectDefinition, subjects, activeSubject, setActiveSubject, setBoardExamDate } = useStudy()
  const [activeModal, setActiveModal] = useState(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showExamDateEditor, setShowExamDateEditor] = useState(false)
  const [examDateDraft, setExamDateDraft] = useState(studyState.boardExamDate || '')
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60 * 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    setExamDateDraft(studyState.boardExamDate || '')
  }, [studyState.boardExamDate])

  const boardExamDate = studyState.boardExamDate || ''
  const examDate = boardExamDate ? new Date(`${boardExamDate}T23:59:59`) : null
  const daysToExam = examDate ? Math.max(0, Math.ceil((examDate.getTime() - now.getTime()) / 86400000)) : null
  const examDateLabel = examDate
    ? examDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  const saveExamDate = () => {
    setBoardExamDate(examDateDraft)
    setShowExamDateEditor(false)
  }

  const streakDays = currentStreak
  const displayName = profile?.full_name || profile?.display_name || 'Student'
  const today = new Date()
  const weekStart = new Date(today)
  const day = weekStart.getDay()
  weekStart.setDate(weekStart.getDate() - (day === 0 ? 6 : day - 1))
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((label, index) => {
    const date = new Date(weekStart)
    date.setDate(weekStart.getDate() + index)
    const key = toDateKey(date)
    return { label, key, active: (studyState.studyDates || []).includes(key), isToday: key === toDateKey(today) }
  })

  // Today's focus: first 2 non-done, non-locked chapters
  const todayFocus = chapters.filter((c) => !c.done && !c.locked).slice(0, 2)
  const maxWeight = Math.max(...chapters.map((chapter) => chapter.weight || 0), 1)
  const scaledChapters = chapters.map((chapter) => ({ ...chapter, maxWeight }))
  const subjectParts = getSubjectParts(activeSubject)

  // Continue studying card: last opened chapter that isn't completed
  const lastOpened = studyState.lastOpenedChapterId
    ? chapters.find((c) => c.id === studyState.lastOpenedChapterId && !c.done && !c.locked)
    : null

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100 transition-colors duration-200 relative">
      <ScreenHeader
        theme={theme}
        toggleTheme={toggleTheme}
        rightSlot={
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-amber-400"
              aria-label="Notifications"
            >
              <BellIcon className="w-5 h-5" />
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-stone-800 rounded-card shadow-card-md border border-stone-200 dark:border-stone-700/80 p-4 z-40 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-700/60 pb-2 mb-2">
                  <p className="text-xs font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wider">Notifications</p>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1 min-h-[32px] min-w-[32px] flex items-center justify-center rounded-full"
                    aria-label="Close notifications"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-center py-4">
                  <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-950/80 mx-auto flex items-center justify-center mb-2 text-amber-600 dark:text-amber-400">✨</div>
                  <p className="text-xs font-semibold text-stone-800 dark:text-stone-200">You're all caught up!</p>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">No new board exam alerts right now.</p>
                </div>
              </div>
            )}
          </div>
        }
      />

      <main className="max-w-2xl mx-auto px-4 pb-44">
        <SubjectSwitcher subjects={subjects} activeSubject={activeSubject} onChange={setActiveSubject} />
        {/* ── Greeting + Countdown ── */}
        <section className="pt-6 pb-4">
          <p className="text-sm text-stone-500 dark:text-stone-400 font-medium mb-0.5">Good evening 👋</p>
          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100 leading-tight">
            Hey, {displayName}!
          </h1>
          <div className="mt-4 bg-amber-gradient rounded-card p-5 shadow-amber text-white">
            <div className="flex items-start justify-between">
              <div>
                <Badge variant="stone" className="bg-white/20 text-white font-semibold backdrop-blur-sm">RBSE Board Exam</Badge>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-4xl font-extrabold tracking-tight">{daysToExam ?? '—'}</span>
                  <span className="text-lg font-semibold text-amber-100">{daysToExam === null ? 'set paper date' : 'days until paper'}</span>
                </div>
                <p className="text-amber-100 text-xs mt-1 font-medium">
                  {examDateLabel ? `RBSE paper: ${examDateLabel}` : 'Add the RBSE board paper date to start the countdown.'}
                </p>
              </div>
              <div className="flex-shrink-0 bg-white/10 p-2.5 rounded-2xl backdrop-blur-sm">
                <ClockIcon className="w-10 h-10 text-amber-100" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/20">
              <div className="flex justify-between text-xs text-amber-100 font-medium mb-1.5">
                <span>Monthly Revision Goal</span>
                <span>{studyState.monthlyDays} / {studyState.monthlyGoal} days completed</span>
              </div>
              <div className="h-2 rounded-full bg-black/20 overflow-hidden">
                <div className="h-full rounded-full bg-white transition-all duration-700" style={{ width: `${monthlyPct}%` }} />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setShowExamDateEditor((value) => !value)}
                className="text-xs font-bold text-white underline underline-offset-2 hover:text-amber-100 focus:outline-none focus:ring-2 focus:ring-white/70 rounded"
              >
                {boardExamDate ? 'Change paper date' : 'Set paper date'}
              </button>
              {boardExamDate && <span className="text-[11px] text-amber-100">Countdown updates every minute</span>}
            </div>
            {showExamDateEditor && (
              <div className="mt-3 p-3 rounded-btn bg-white/15 border border-white/25 backdrop-blur-sm">
                <label htmlFor="board-exam-date" className="block text-xs font-semibold text-white mb-1.5">RBSE board paper date</label>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    id="board-exam-date"
                    type="date"
                    value={examDateDraft}
                    onChange={(event) => setExamDateDraft(event.target.value)}
                    className="min-h-[40px] rounded-btn border-0 px-3 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-white"
                  />
                  <button type="button" onClick={saveExamDate} className="min-h-[40px] px-3 rounded-btn bg-white text-amber-700 text-xs font-bold">Save</button>
                  <button type="button" onClick={() => { setBoardExamDate(''); setExamDateDraft(''); setShowExamDateEditor(false) }} className="min-h-[40px] px-3 rounded-btn bg-black/15 text-white text-xs font-semibold">Clear</button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── Quick Board Prep Hub (Question Bank, Predicted, Mock Tests) ── */}
        <section aria-label="Quick board prep tools" className="mb-6 grid grid-cols-3 gap-2">
          <button
            onClick={() => onNavigate && onNavigate('question-bank')}
            className="p-3 rounded-card bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-card hover:border-amber-400 text-left transition-all active:scale-95 group"
          >
            <span className="text-xl">📚</span>
            <p className="font-bold text-xs text-stone-900 dark:text-stone-100 mt-1">Question Bank</p>
            <p className="text-[10px] text-stone-500 dark:text-stone-400">All types & marks</p>
          </button>

          <button
            onClick={() => onNavigate && onNavigate('predicted')}
            className="p-3 rounded-card bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-card hover:border-purple-400 text-left transition-all active:scale-95 group"
          >
            <span className="text-xl">🔥</span>
            <p className="font-bold text-xs text-purple-700 dark:text-purple-300 mt-1">Predicted</p>
            <p className="text-[10px] text-stone-500 dark:text-stone-400">High probability</p>
          </button>

          <button
            onClick={() => onNavigate && onNavigate('mock-test')}
            className="p-3 rounded-card bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-card hover:border-teal-400 text-left transition-all active:scale-95 group"
          >
            <span className="text-xl">⏱️</span>
            <p className="font-bold text-xs text-teal-700 dark:text-teal-300 mt-1">Practice Papers</p>
            <p className="text-[10px] text-stone-500 dark:text-stone-400">Board-level instructions</p>
          </button>
        </section>

        <section className="mb-6">
          <button
            onClick={() => onNavigate && onNavigate('papers')}
            className="w-full p-4 rounded-card bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 text-left hover:border-teal-400 transition-all"
          >
            <div className="flex items-center justify-between gap-3">
              <div><p className="font-bold text-sm text-teal-900 dark:text-teal-200">📄 Download PYQs & Model Papers</p><p className="text-xs text-teal-700 dark:text-teal-300 mt-1">Year-wise Mathematics PDFs in one place</p></div><span className="text-teal-700 dark:text-teal-300 font-bold">→</span>
            </div>
          </button>
        </section>

        {/* ── Continue Studying ── */}
        {lastOpened && (
          <section className="mb-6">
            <Card
              className="p-4 border-l-4 border-teal-500 dark:border-teal-400 hover:shadow-card-md transition-all cursor-pointer"
              onClick={() => onOpenChapterNotes && onOpenChapterNotes(lastOpened)}
              role="button"
              aria-label={`Continue studying ${lastOpened.name}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <Badge variant="teal">Continue where you left off</Badge>
                  <p className="text-sm font-semibold text-stone-900 dark:text-stone-100 mt-1 leading-snug">{lastOpened.name}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); if (onOpenChapterNotes) onOpenChapterNotes(lastOpened) }}
                  className="flex-shrink-0 min-h-[44px] px-3 bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 hover:bg-teal-200 dark:hover:bg-teal-900/60 rounded-btn font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                >
                  <BookOpenIcon className="w-4 h-4" />
                  <span>Resume</span>
                </button>
              </div>
            </Card>
          </section>
        )}

        {/* ── Study Streak ── */}
        <section className="mb-6 scroll-mt-24">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-h3 font-semibold text-stone-800 dark:text-stone-200">Study Streak</h2>
            <button
              onClick={() => setActiveModal({ type: 'streak' })}
              className="text-xs text-amber-700 dark:text-amber-400 font-semibold min-h-[44px] px-3 rounded-btn hover:bg-amber-100/60 dark:hover:bg-amber-950/40 active:scale-95 transition-all flex items-center focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              View history →
            </button>
          </div>
          <Card className="p-4 cursor-pointer hover:shadow-card-md transition-shadow" onClick={() => setActiveModal({ type: 'streak' })}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/80 flex items-center justify-center flex-shrink-0">
                <FireIcon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-extrabold text-stone-900 dark:text-stone-100 leading-none">{streakDays}</span>
                  <span className="text-sm font-semibold text-stone-600 dark:text-stone-400">days in a row</span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  🔥 {streakDays >= 21 ? '21-day champion achieved!' : `Keep going — ${21 - streakDays} days to 21-day badge!`}
                </p>
              </div>
            </div>
            <div>
              <p className="section-label mb-2">This Week's Log</p>
              <div className="flex gap-2">
              {weekDays.map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-1 flex-1">
                    <StreakDot active={day.active} label={`${day.key}${day.isToday ? ', today' : ''}${day.active ? ', studied' : ', not studied'}`} />
                    <span className={`text-xs font-medium ${day.isToday ? 'text-amber-600 dark:text-amber-400' : 'text-stone-400 dark:text-stone-400'}`}>{day.label}</span>
                </div>
              ))}
              </div>
            </div>
          </Card>
        </section>

        {/* ── Today's Focus ── */}
        {todayFocus.length > 0 && (
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <SparklesIcon className="w-5 h-5 text-amber-500 dark:text-amber-400" />
              <h2 className="text-h3 font-semibold text-stone-800 dark:text-stone-200">Today's Focus</h2>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">High-weightage chapters recommended for revision today:</p>
            <div className="flex flex-col gap-3">
              {todayFocus.map((chapter, i) => (
                <Card
                  key={chapter.id}
                  className="p-4 border-l-4 border-amber-500 dark:border-amber-400 hover:shadow-card-md transition-all cursor-pointer"
                  onClick={() => onOpenChapterNotes && onOpenChapterNotes(chapter)}
                  role="button"
                  aria-label={`Start revising ${chapter.name}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <Badge variant="accent">Priority #{i + 1}</Badge>
                      <p className="text-sm font-semibold text-stone-900 dark:text-stone-100 mt-1 leading-snug">{chapter.name}</p>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{chapter.weight}% board weightage</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); if (onOpenChapterNotes) onOpenChapterNotes(chapter) }}
                      className="flex-shrink-0 min-h-[44px] px-3 bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/60 rounded-btn font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                      aria-label={`Start ${chapter.name}`}
                    >
                      <BookOpenIcon className="w-4 h-4 text-amber-700 dark:text-amber-300" />
                      <span>Start</span>
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* ── Subject Chapters ── */}
        <section id="chapters-section" className="mb-6 scroll-mt-24">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-h3 font-semibold text-stone-800 dark:text-stone-200">{subjectDefinition.label} — Chapter Weightage</h2>
            <span className="text-xs text-stone-500 dark:text-stone-400">{completedCount}/{chapters.filter(c => !c.locked).length} done</span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">Track your revision by chapter and focus on the highest-weightage topics first.</p>
          <div className="mb-4 p-3 rounded-card bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-card">
            <div className="flex items-center justify-between gap-3 mb-2">
              <p className="section-label">Change subject</p>
              <span className="text-[11px] text-stone-400 dark:text-stone-500">{subjectDefinition.label} selected</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" role="tablist" aria-label="Change study subject">
              {subjects.map((subject) => (
                <button
                  key={subject.id}
                  role="tab"
                  aria-selected={activeSubject === subject.id}
                  onClick={() => setActiveSubject(subject.id)}
                  className={`min-h-[42px] px-2 rounded-btn text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-amber-400 ${activeSubject === subject.id
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-600'
                  }`}
                >
                  <span aria-hidden="true" className="mr-1">{subject.emoji}</span>{subject.shortLabel}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-5">
            {subjectParts.map((part) => {
              const partChapters = scaledChapters.filter((chapter) => chapter.partId === part.id)
              if (!partChapters.length) return null
              return (
                <div key={part.id}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 flex items-center justify-center text-xs font-extrabold">{partChapters.length}</span>
                    <div>
                      <h3 className="text-sm font-extrabold text-stone-800 dark:text-stone-200">{part.label}</h3>
                      {part.description && <p className="text-[11px] text-stone-500 dark:text-stone-400">{part.description}</p>}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    {partChapters.map((chapter) => (
                      <ChapterCard
                        key={chapter.id}
                        chapter={chapter}
                        index={scaledChapters.indexOf(chapter)}
                        onSelectChapter={(chap) => onOpenChapterNotes ? onOpenChapterNotes(chap) : setActiveModal({ type: 'chapter', chapter: chap })}
                        onSelectLocked={(chap) => onOpenLockedNotes ? onOpenLockedNotes(chap) : setActiveModal({ type: 'upgrade', lockedChapter: chap })}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── Upgrade Teaser ── */}
        <section className="mb-6">
          <UnlockTeaser onOpenPreview={() => setActiveModal({ type: 'upgrade' })} />
        </section>

        <div className="h-16" aria-hidden="true" />
      </main>

      <BottomNav activeScreen="dashboard" onNavigate={onNavigate || (() => {})} />

      {/* ── Streak Modal ── */}
      {activeModal?.type === 'streak' && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-800 dark:border dark:border-stone-700/80 rounded-card shadow-card-md w-full max-w-md p-5 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-stone-100 dark:border-stone-700/60 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/80 flex items-center justify-center"><FireIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" /></div>
                <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">Streak History</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400" aria-label="Close"><XMarkIcon className="w-5 h-5" /></button>
            </div>
            <div className="text-center p-4 bg-cream-200 dark:bg-stone-900/80 rounded-card border border-stone-200 dark:border-stone-700/60 mb-3">
              <p className="text-3xl font-extrabold text-stone-900 dark:text-stone-100">{streakDays} Days Active</p>
              <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">Consistent studying every day! 🔥</p>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 text-center">Full analytics available in your Profile.</p>
            <div className="mt-5 flex gap-3">
              <button onClick={() => setActiveModal(null)} className="flex-1 py-3 rounded-btn border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-semibold text-sm min-h-[44px] hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400">Close</button>
              <button onClick={() => { setActiveModal(null); if (onNavigate) onNavigate('profile') }} className="flex-1 py-3 rounded-btn bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-semibold text-sm min-h-[44px] hover:bg-stone-800 dark:hover:bg-white active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-amber-400">View Profile →</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Razorpay Upgrade Modal ── */}
      <RazorpayCheckoutModal
        isOpen={activeModal?.type === 'upgrade'}
        onClose={() => setActiveModal(null)}
        targetChapter={activeModal?.lockedChapter}
      />
    </div>
  )
}
