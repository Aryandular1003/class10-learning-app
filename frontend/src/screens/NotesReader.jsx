import { useState, useEffect } from 'react'
import { useTheme } from '../theme/useTheme'
import { useStudy } from '../hooks/useStudy'
import {
  ArrowLeftIcon,
  BookmarkOutlineIcon,
  BookmarkSolidIcon,
  SunIcon,
  MoonIcon,
  BellIcon,
  SparklesIcon,
  XMarkIcon,
} from '../components/ui/icons'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'
import BottomNav from '../components/ui/BottomNav'
import RazorpayCheckoutModal from '../components/ui/RazorpayCheckoutModal'
import { CHAPTER_NOTES } from '../data/chapterNotesData'
import { useContent } from '../hooks/useContent'
import { useQuiz } from '../hooks/useQuiz'
import { useQuestions } from '../hooks/useQuestions'

const DEFAULT_CHAPTER = {
  id: 'science-1',
  name: 'Light — Reflection & Refraction',
  weight: 12,
  subject: 'Science',
  class: 10,
  done: false,
  locked: false,
}

export default function NotesReader({
  chapter = DEFAULT_CHAPTER,
  initialView = 'unlocked',
  onBack,
  onNavigateHome,
  onNavigate,
}) {
  const { theme, toggleTheme } = useTheme()
  const {
    bookmarkedChapters,
    toggleBookmark,
    setLastOpenedChapter,
    subjectDefinition,
    recordPracticeAttempt,
  } = useStudy()

  // Data hooks for all 4 pillars
  const { content: remoteContent } = useContent(chapter.id, chapter.subjectId || 'math')
  const { quizQuestions } = useQuiz(chapter.id)
  const { questions: pyqQuestions } = useQuestions({ chapter_id: chapter.id, is_pyq: true })
  const { questions: predictedQuestions } = useQuestions({ chapter_id: chapter.id, is_predicted: true })

  // Active top-level tab: 'notes' | 'quiz' | 'pyqs' | 'predicted'
  const [activeTab, setActiveTab] = useState('notes')
  const [viewMode, setViewMode] = useState(initialView)
  const [fontSize, setFontSize] = useState('base')
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)
  const [showUnlockModal, setShowUnlockModal] = useState(false)

  // Quiz Runner interactive state
  const [quizIndex, setQuizIndex] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState({}) // { questionId: 'A' }
  const [quizSubmitted, setQuizSubmitted] = useState(false)

  // PYQs Filter: 'all' | '1' | '2-3' | 'long'
  const [pyqFilter, setPyqFilter] = useState('all')
  const [revealedAnswers, setRevealedAnswers] = useState({}) // { questionId: boolean }

  // Sync last opened chapter
  useEffect(() => {
    if (chapter?.id) {
      setLastOpenedChapter(chapter.id)
    }
  }, [chapter?.id, setLastOpenedChapter])

  const isBookmarked = bookmarkedChapters.some((item) => item.id === chapter.id)
  const isCompleted = !!chapter.done

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Scroll listener for reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight > 0) {
        const pct = Math.min(100, Math.max(0, Math.round((scrollTop / docHeight) * 100)))
        setScrollProgress(pct)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const fontSizeClass = {
    sm: 'text-sm leading-relaxed',
    base: 'text-base leading-relaxed',
    lg: 'text-lg leading-loose',
  }[fontSize]

  const isDarkMode = theme === 'dark'

  // Quiz logic
  const handleSelectQuizOption = (qId, optionLetter) => {
    if (selectedOptions[qId]) return // already answered this question
    setSelectedOptions((prev) => ({ ...prev, [qId]: optionLetter }))
  }

  const handleFinishQuiz = () => {
    let score = 0
    quizQuestions.forEach((q) => {
      const chosen = selectedOptions[q.id]
      const correct = q.correct_option || (q.answer && q.answer[0])
      if (chosen && chosen.toUpperCase() === (correct || '').toUpperCase()) {
        score += q.marks || 1
      }
    })
    const total = quizQuestions.reduce((sum, q) => sum + (q.marks || 1), 0)
    recordPracticeAttempt({
      topic: `${chapter.name} Quiz`,
      difficulty: 'Medium',
      score,
      total: total || 1,
    })
    setQuizSubmitted(true)
  }

  const handleResetQuiz = () => {
    setSelectedOptions({})
    setQuizIndex(0)
    setQuizSubmitted(false)
  }

  const toggleAnswerReveal = (qId) => {
    setRevealedAnswers((prev) => ({ ...prev, [qId]: !prev[qId] }))
  }

  // Filtered PYQs
  const filteredPyqs = pyqQuestions.filter((q) => {
    if (pyqFilter === '1') return q.marks === 1
    if (pyqFilter === '2-3') return q.marks === 2 || q.marks === 3
    if (pyqFilter === 'long') return q.marks >= 3
    return true
  })

  // Note data resolution
  const noteData = remoteContent?.notes || CHAPTER_NOTES[chapter.id] || {
    title: chapter.name,
    subject: subjectDefinition.label,
    weight: chapter.weight,
    readTime: '8 mins',
    sections: [
      {
        heading: `1. Key Concepts — ${chapter.name}`,
        content: `This chapter covers core RBSE Class 10 ${subjectDefinition.label} topics. Thorough revision of these fundamental principles will help you score maximum marks in section A and section B of the board paper.`,
        keyBox: {
          title: '⚡ Essential Exam Takeaways',
          items: [
            '**Core Definition:** Understand the basic principles and definitions.',
            `**High-Yield Weightage:** This chapter holds ${chapter.weight}% weightage in the RBSE Class 10 board exam.`,
            '**Exam Tip:** Practice step-by-step solutions and neat diagrams where applicable.',
          ],
        },
      },
      {
        heading: '2. High-Yield Board Exam Points',
        content: `Make sure to review previous-year board questions for ${chapter.name}. Pay attention to key keywords, standard definitions, and units.`,
      },
    ],
  }

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100 transition-colors duration-200 relative">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 animate-bounce border border-stone-700/50 dark:border-stone-300">
          <SparklesIcon className="w-4 h-4 text-amber-400 dark:text-amber-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-cream-100/95 dark:bg-stone-900/95 backdrop-blur-sm border-b border-stone-200/50 dark:border-stone-800/80 transition-colors duration-200">
        <div className="max-w-2xl mx-auto px-4 py-2.5 flex items-center justify-between relative">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <button
              onClick={onBack || onNavigateHome}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-stone-700 dark:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-amber-400"
              aria-label="Back to dashboard"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide flex items-center gap-1.5">
                <span>Class 10 {subjectDefinition.label}</span>
                <span>•</span>
                <span>Weightage: {chapter.weight}%</span>
              </span>
              <h1 className="text-sm font-bold text-stone-900 dark:text-stone-100 truncate leading-tight mt-0.5">
                {chapter.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-0.5 flex-shrink-0">
            <button
              onClick={() => {
                toggleBookmark(chapter.id)
                showToast(isBookmarked ? 'Removed from saved notes' : 'Chapter saved to bookmarks! 🔖')
              }}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-amber-600 dark:text-amber-400 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-amber-400"
              aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark chapter'}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark chapter'}
            >
              {isBookmarked ? (
                <BookmarkSolidIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              ) : (
                <BookmarkOutlineIcon className="w-5 h-5 text-stone-600 dark:text-stone-300" />
              )}
            </button>

            <button
              onClick={toggleTheme}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-amber-400"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <SunIcon className="w-5 h-5 text-amber-400" /> : <MoonIcon className="w-5 h-5 text-stone-600" />}
            </button>

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
                    <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center mb-2">✨</div>
                    <p className="text-xs font-semibold text-stone-800 dark:text-stone-200">You're all caught up!</p>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">All chapter materials are synced.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Top Reading Progress Bar */}
        <div className="w-full bg-stone-200/60 dark:bg-stone-800 h-1">
          <div
            className="h-full bg-amber-gradient transition-all duration-150 ease-out"
            style={{ width: `${viewMode === 'locked' ? 35 : Math.max(8, scrollProgress)}%` }}
          />
        </div>

        {/* ── 4-PILLAR CHAPTER NAVIGATION BAR ── */}
        <nav aria-label="Chapter sections" className="max-w-2xl mx-auto px-2 py-1.5 flex items-center justify-between gap-1 overflow-x-auto scrollbar-none border-t border-stone-200/40 dark:border-stone-800/60">
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex-1 min-h-[40px] px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
              activeTab === 'notes'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:bg-stone-200/50 dark:hover:bg-stone-800'
            }`}
          >
            <span>📖</span>
            <span>Notes</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex-1 min-h-[40px] px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
              activeTab === 'quiz'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:bg-stone-200/50 dark:hover:bg-stone-800'
            }`}
          >
            <span>🎯</span>
            <span>Quiz</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${activeTab === 'quiz' ? 'bg-amber-600 text-white' : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200'}`}>
              {quizQuestions.length || 15}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('pyqs')}
            className={`flex-1 min-h-[40px] px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
              activeTab === 'pyqs'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:bg-stone-200/50 dark:hover:bg-stone-800'
            }`}
          >
            <span>📜</span>
            <span>PYQs</span>
            {pyqQuestions.length > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${activeTab === 'pyqs' ? 'bg-amber-600 text-white' : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200'}`}>
                {pyqQuestions.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('predicted')}
            className={`flex-1 min-h-[40px] px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
              activeTab === 'predicted'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:bg-stone-200/50 dark:hover:bg-stone-800'
            }`}
          >
            <span>🔥</span>
            <span>2027 Predicted</span>
            {predictedQuestions.length > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${activeTab === 'predicted' ? 'bg-amber-600 text-white' : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'}`}>
                {predictedQuestions.length}
              </span>
            )}
          </button>
        </nav>
      </header>

      {/* ── TAB 1: NOTES READER ── */}
      {activeTab === 'notes' && (
        <>
          {/* TOOLBAR FOR NOTES */}
          <div className="bg-white/80 dark:bg-stone-850/80 border-b border-stone-200/50 dark:border-stone-800/60 px-4 py-2 sticky top-[98px] z-20 backdrop-blur-md">
            <div className="max-w-2xl mx-auto flex items-center justify-between gap-2">
              <div className="flex items-center p-0.5 bg-stone-100 dark:bg-stone-800 rounded-btn">
                <button
                  onClick={() => setViewMode('unlocked')}
                  className={`px-3 py-1 rounded-btn text-xs font-semibold min-h-[36px] transition-all ${
                    viewMode === 'unlocked'
                      ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-sm'
                      : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                  }`}
                >
                  🔓 Unlocked Full
                </button>
                <button
                  onClick={() => setViewMode('locked')}
                  className={`px-3 py-1 rounded-btn text-xs font-semibold min-h-[36px] transition-all ${
                    viewMode === 'locked'
                      ? 'bg-violet-600 text-white shadow-sm'
                      : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                  }`}
                >
                  🔒 Locked Teaser
                </button>
              </div>

              <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-0.5 rounded-btn">
                <span className="text-[10px] uppercase font-bold text-stone-400 dark:text-stone-500 px-1.5 hidden sm:inline">Text Size</span>
                {['sm', 'base', 'lg'].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setFontSize(sz)}
                    className={`w-8 h-8 rounded-btn text-xs font-bold transition-all min-h-[32px] ${
                      fontSize === sz
                        ? 'bg-white dark:bg-stone-700 text-amber-700 dark:text-amber-400 shadow-sm'
                        : 'text-stone-500 dark:text-stone-400'
                    }`}
                    aria-label={`${sz} font size`}
                  >
                    {sz === 'sm' ? 'A-' : sz === 'base' ? 'A' : 'A+'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <main className="max-w-2xl mx-auto px-4 pt-6 pb-40">
            <article className="space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="teal">RBSE Class 10</Badge>
                <Badge variant="accent">{subjectDefinition.label}</Badge>
                <Badge variant="stone">Est. read time: {noteData.readTime || '8 mins'}</Badge>
                {isCompleted && <Badge variant="success">✓ Revised</Badge>}
                {isBookmarked && <Badge variant="accent">🔖 Saved</Badge>}
              </div>

              <div>
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-widest mb-1">
                  Master Revision Notes
                </p>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 leading-tight">
                  {chapter.name}
                </h2>
              </div>

              {viewMode === 'unlocked' ? (
                <div className="space-y-6">
                  {(noteData.sections || []).map((sec, idx) => (
                    <Card key={idx} className="group relative overflow-hidden p-5 border border-stone-200/80 dark:border-stone-800 space-y-3 hover:-translate-y-0.5 hover:shadow-card-md transition-all duration-300">
                      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-amber-400 via-teal-400 to-violet-500 opacity-70 group-hover:opacity-100" />
                      <div className="flex items-start gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-xs font-extrabold text-amber-700 dark:bg-amber-950/70 dark:text-amber-300">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        {sec.heading && (
                          <h3 className="pt-1 text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                            {sec.heading}
                          </h3>
                        )}
                      </div>
                      <div className={`${fontSizeClass} text-stone-700 dark:text-stone-300 whitespace-pre-line leading-relaxed`}>
                        {sec.content}
                      </div>

                      {sec.keyBox && (
                        <div className="p-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 mt-3">
                          <p className="text-xs font-extrabold text-amber-800 dark:text-amber-300 uppercase tracking-wider mb-2">
                            {sec.keyBox.title}
                          </p>
                          <ul className="space-y-1.5 text-xs sm:text-sm text-stone-800 dark:text-stone-200">
                            {(sec.keyBox.items || []).map((item, itemIdx) => (
                              <li key={itemIdx} className="flex items-start gap-2">
                                <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
                                <span>{item.replace(/\*\*/g, '')}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {sec.formulaBox && (
                        <div className="p-4 rounded-xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 mt-3 font-mono">
                          <p className="text-xs font-bold text-teal-800 dark:text-teal-300 uppercase mb-1">
                            {sec.formulaBox.title}
                          </p>
                          <p className="text-sm sm:text-base font-extrabold text-teal-900 dark:text-teal-100">
                            {sec.formulaBox.formula}
                          </p>
                          {sec.formulaBox.subtext && (
                            <p className="text-xs font-sans text-stone-500 dark:text-stone-400 mt-1">
                              {sec.formulaBox.subtext}
                            </p>
                          )}
                        </div>
                      )}
                    </Card>
                  ))}

                  {/* QUICK LAUNCH BANNER TO NEXT PILLARS */}
                  <div className="p-4 rounded-card bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-3 mt-6">
                    <p className="text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider">
                      Done reading? Test your preparation:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setActiveTab('quiz')}
                        className="p-3 rounded-btn bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                      >
                        <span>🎯 Take Chapter Quiz</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('pyqs')}
                        className="p-3 rounded-btn bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                      >
                        <span>📜 Practice PYQs</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* LOCKED TEASER VIEW */
                <Card className="p-6 border-2 border-violet-300 dark:border-violet-700 space-y-4">
                  <div className="flex items-center gap-2">
                    <SparklesIcon className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                    <Badge variant="violet">PRO Feature Preview</Badge>
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                    Unlock Full Revision Handbook & Formula Sheets
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                    Access complete high-yield notes, memory mnemonics, solved board blueprints, and examiner tips for {chapter.name}.
                  </p>
                  <button
                    onClick={() => setShowUnlockModal(true)}
                    className="w-full py-3 rounded-btn bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs sm:text-sm shadow-md"
                  >
                    Unlock Full Access (₹199) →
                  </button>
                </Card>
              )}
            </article>
          </main>
        </>
      )}

      {/* ── TAB 2: INTERACTIVE CHAPTER QUIZ ── */}
      {activeTab === 'quiz' && (
        <main className="max-w-2xl mx-auto px-4 pt-6 pb-40">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest">
                  Self Assessment
                </p>
                <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-100">
                  {chapter.name} — 15-MCQ Quiz
                </h2>
              </div>
              <Badge variant="accent">15 Questions</Badge>
            </div>

            {quizQuestions.length === 0 ? (
              <Card className="p-6 text-center space-y-3">
                <span className="text-3xl">🎯</span>
                <p className="text-sm font-bold text-stone-800 dark:text-stone-200">
                  Quiz for this chapter is being prepared.
                </p>
                <button
                  onClick={() => setActiveTab('notes')}
                  className="px-4 py-2 rounded-btn bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-bold"
                >
                  Back to Notes
                </button>
              </Card>
            ) : quizSubmitted ? (
              /* QUIZ SCORECARD */
              <Card className="p-6 text-center space-y-5 border border-stone-200 dark:border-stone-700 shadow-card-md">
                <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950 flex items-center justify-center mx-auto text-3xl">
                  🏆
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-stone-900 dark:text-stone-100">
                    Quiz Completed!
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    Here is your performance report for {chapter.name}
                  </p>
                </div>

                {(() => {
                  let correct = 0
                  quizQuestions.forEach((q) => {
                    if (selectedOptions[q.id]?.toUpperCase() === (q.correct_option || q.answer?.[0] || '').toUpperCase()) {
                      correct++
                    }
                  })
                  const accuracy = Math.round((correct / quizQuestions.length) * 100)
                  return (
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                        <p className="text-[10px] font-bold text-stone-500 uppercase">Score</p>
                        <p className="text-lg font-extrabold text-amber-600 dark:text-amber-400">{correct} / {quizQuestions.length}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                        <p className="text-[10px] font-bold text-stone-500 uppercase">Accuracy</p>
                        <p className="text-lg font-extrabold text-teal-600 dark:text-teal-400">{accuracy}%</p>
                      </div>
                      <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                        <p className="text-[10px] font-bold text-stone-500 uppercase">Result</p>
                        <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">{accuracy >= 60 ? 'Passed' : 'Needs Review'}</p>
                      </div>
                    </div>
                  )
                })()}

                <div className="flex gap-2">
                  <button
                    onClick={handleResetQuiz}
                    className="flex-1 py-3 rounded-btn bg-stone-100 dark:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold active:scale-95"
                  >
                    🔄 Retake Quiz
                  </button>
                  <button
                    onClick={() => setActiveTab('pyqs')}
                    className="flex-1 py-3 rounded-btn bg-amber-500 text-white text-xs font-bold active:scale-95"
                  >
                    📜 Practice PYQs →
                  </button>
                </div>
              </Card>
            ) : (
              /* ACTIVE QUIZ QUESTION VIEW */
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-bold text-stone-500 dark:text-stone-400">
                  <span>Question {quizIndex + 1} of {quizQuestions.length}</span>
                  <span>1 Mark</span>
                </div>
                <div className="w-full bg-stone-200 dark:bg-stone-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full transition-all duration-300"
                    style={{ width: `${((quizIndex + 1) / quizQuestions.length) * 100}%` }}
                  />
                </div>

                {(() => {
                  const q = quizQuestions[quizIndex]
                  if (!q) return null
                  const chosen = selectedOptions[q.id]
                  const correct = (q.correct_option || q.answer?.[0] || 'A').toUpperCase()

                  return (
                    <Card className="p-5 border border-stone-200 dark:border-stone-700 shadow-card space-y-4">
                      <p className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 leading-snug">
                        {q.question}
                      </p>

                      <div className="space-y-2">
                        {(q.options || []).map((opt, i) => {
                          const letter = opt[0]?.toUpperCase()
                          const isSelected = chosen === letter
                          const isThisCorrect = letter === correct

                          let btnStyle = 'border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900/50 text-stone-700 dark:text-stone-300 hover:border-amber-400'
                          if (chosen) {
                            if (isThisCorrect) {
                              btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-100 font-bold'
                            } else if (isSelected) {
                              btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-100 font-bold'
                            } else {
                              btnStyle = 'border-stone-200 dark:border-stone-800 opacity-50'
                            }
                          }

                          return (
                            <button
                              key={i}
                              disabled={Boolean(chosen)}
                              onClick={() => handleSelectQuizOption(q.id, letter)}
                              className={`w-full p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${btnStyle}`}
                            >
                              <span>{opt}</span>
                              {chosen && isThisCorrect && <span className="text-emerald-600 font-extrabold">✓</span>}
                              {chosen && isSelected && !isThisCorrect && <span className="text-rose-600 font-extrabold">✗</span>}
                            </button>
                          )
                        })}
                      </div>

                      {/* Explanation Reveal */}
                      {chosen && (
                        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-stone-800 dark:text-stone-200 animate-in fade-in">
                          <p className="font-bold text-amber-800 dark:text-amber-300 mb-0.5">
                            {chosen === correct ? '🎉 Correct Answer!' : `❌ Incorrect (Correct: Option ${correct})`}
                          </p>
                          {q.explanation && <p className="mt-1 leading-relaxed">{q.explanation}</p>}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2">
                        <button
                          disabled={quizIndex === 0}
                          onClick={() => setQuizIndex((i) => i - 1)}
                          className="px-3 py-2 rounded-btn border border-stone-200 dark:border-stone-700 text-xs font-bold disabled:opacity-30"
                        >
                          ← Previous
                        </button>

                        {quizIndex < quizQuestions.length - 1 ? (
                          <button
                            onClick={() => setQuizIndex((i) => i + 1)}
                            className="px-4 py-2 rounded-btn bg-amber-500 text-white text-xs font-bold hover:bg-amber-600"
                          >
                            Next Question →
                          </button>
                        ) : (
                          <button
                            onClick={handleFinishQuiz}
                            className="px-4 py-2 rounded-btn bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                          >
                            Submit Quiz 🏆
                          </button>
                        )}
                      </div>
                    </Card>
                  )
                })()}
              </div>
            )}
          </div>
        </main>
      )}

      {/* ── TAB 3: PAST YEAR QUESTIONS (PYQs) ── */}
      {activeTab === 'pyqs' && (
        <main className="max-w-2xl mx-auto px-4 pt-6 pb-40">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-widest">
                  Board Paper Archives
                </p>
                <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-100">
                  {chapter.name} — Past Board PYQs
                </h2>
              </div>
              <Badge variant="teal">{pyqQuestions.length} Questions</Badge>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {[
                { id: 'all', label: 'All Marks' },
                { id: '1', label: '1 Mark (Objective/VSA)' },
                { id: '2-3', label: '2–3 Marks (Short)' },
                { id: 'long', label: 'Long Answer (3+ Marks)' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setPyqFilter(f.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                    pyqFilter === f.id
                      ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-xs'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {filteredPyqs.length === 0 ? (
              <Card className="p-6 text-center space-y-3">
                <span className="text-3xl">📜</span>
                <p className="text-sm font-bold text-stone-800 dark:text-stone-200">
                  No questions match the selected filter.
                </p>
                <button
                  onClick={() => setPyqFilter('all')}
                  className="px-3 py-1.5 rounded-btn bg-stone-900 text-white text-xs font-bold"
                >
                  Show All Marks
                </button>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredPyqs.map((q, idx) => {
                  const isRevealed = Boolean(revealedAnswers[q.id])
                  return (
                    <Card key={q.id || idx} className="p-5 border border-stone-200 dark:border-stone-700 shadow-card space-y-3">
                      <div className="flex items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-2">
                        <div className="flex items-center gap-1.5">
                          <Badge variant="teal">{q.source || `BSER ${q.year || 'Board Paper'}`}</Badge>
                          <Badge variant="stone">{q.marks} {q.marks === 1 ? 'Mark' : 'Marks'}</Badge>
                        </div>
                        <span className="text-[11px] font-bold text-stone-400">Q#{idx + 1}</span>
                      </div>

                      <p className="text-sm font-bold text-stone-900 dark:text-stone-100 leading-snug">
                        {q.question}
                      </p>

                      {q.options && q.options.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {q.options.map((opt, optIdx) => (
                            <div key={optIdx} className="p-2 rounded-lg bg-stone-50 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 text-xs text-stone-700 dark:text-stone-300">
                              {opt}
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="pt-2">
                        <button
                          onClick={() => toggleAnswerReveal(q.id)}
                          className="px-3 py-1.5 rounded-btn bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 transition-all"
                        >
                          <span>{isRevealed ? '🙈 Hide Model Answer' : '👁️ Show Model Answer'}</span>
                        </button>

                        {isRevealed && (
                          <div className="mt-3 p-3.5 rounded-xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 text-xs text-stone-800 dark:text-stone-200 animate-in fade-in space-y-1.5">
                            <p className="font-extrabold text-teal-800 dark:text-teal-300 uppercase tracking-wider">
                              Official Model Solution:
                            </p>
                            <div className="whitespace-pre-line leading-relaxed">
                              {q.answer || q.solution}
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </main>
      )}

      {/* ── TAB 4: PREDICTED QUESTIONS ── */}
      {activeTab === 'predicted' && (
        <main className="max-w-2xl mx-auto px-4 pt-6 pb-40">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-widest">
                  High Probability Blueprint
                </p>
                <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-100">
                  {chapter.name} — 2027 Predicted Questions
                </h2>
              </div>
              <Badge variant="violet">2027 Forecast</Badge>
            </div>

            {predictedQuestions.length === 0 ? (
              <Card className="p-6 text-center space-y-3">
                <span className="text-3xl">🔮</span>
                <p className="text-sm font-bold text-stone-800 dark:text-stone-200">
                  Predicted questions for this chapter will be unlocked soon.
                </p>
                <button
                  onClick={() => setActiveTab('pyqs')}
                  className="px-3 py-1.5 rounded-btn bg-stone-900 text-white text-xs font-bold"
                >
                  View Past Year PYQs
                </button>
              </Card>
            ) : (
              <div className="space-y-4">
                {predictedQuestions.map((q, idx) => {
                  const isRevealed = Boolean(revealedAnswers[q.id])
                  return (
                    <Card key={q.id || idx} className="p-5 border-2 border-purple-200 dark:border-purple-800/60 shadow-card space-y-3">
                      <div className="flex items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-2">
                        <div className="flex items-center gap-1.5">
                          <Badge variant="violet">🔥 {q.prediction_level || 'High Probability'}</Badge>
                          <Badge variant="stone">{q.marks} {q.marks === 1 ? 'Mark' : 'Marks'}</Badge>
                        </div>
                        <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400">Prediction #{idx + 1}</span>
                      </div>

                      <p className="text-sm font-bold text-stone-900 dark:text-stone-100 leading-snug">
                        {q.question}
                      </p>

                      {q.prediction_reason && (
                        <div className="p-2.5 rounded-lg bg-purple-50/60 dark:bg-purple-950/30 text-[11px] text-purple-800 dark:text-purple-300">
                          <strong>Examiner Trend:</strong> {q.prediction_reason}
                        </div>
                      )}

                      <div className="pt-2">
                        <button
                          onClick={() => toggleAnswerReveal(q.id)}
                          className="px-3 py-1.5 rounded-btn bg-purple-100 dark:bg-purple-950/70 hover:bg-purple-200 text-xs font-bold text-purple-800 dark:text-purple-300 flex items-center gap-1.5 transition-all"
                        >
                          <span>{isRevealed ? '🙈 Hide Solution' : '👁️ Show Model Solution'}</span>
                        </button>

                        {isRevealed && (
                          <div className="mt-3 p-3.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs text-stone-800 dark:text-stone-200 animate-in fade-in space-y-1.5">
                            <p className="font-extrabold text-stone-900 dark:text-stone-100 uppercase tracking-wider">
                              Predicted Marking Scheme & Solution:
                            </p>
                            <div className="whitespace-pre-line leading-relaxed font-sans">
                              {q.answer || q.solution}
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </main>
      )}

      {/* BOTTOM NAVIGATION */}
      <BottomNav
        activeScreen="chapters"
        onNavigate={(screen) => {
          if (screen === 'dashboard' || screen === 'chapters') {
            if (onNavigateHome) onNavigateHome()
            else if (onBack) onBack()
          } else if (onNavigate) {
            onNavigate(screen)
          }
        }}
      />

      {/* RAZORPAY CHECKOUT MODAL */}
      <RazorpayCheckoutModal
        isOpen={showUnlockModal}
        onClose={() => setShowUnlockModal(false)}
        targetChapter={chapter}
      />
    </div>
  )
}
