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
  LockClosedIcon,
  BookOpenIcon,
} from '../components/ui/icons'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'
import BottomNav from '../components/ui/BottomNav'
import { CHAPTER_NOTES } from '../data/chapterNotesData'
import { useContent } from '../hooks/useContent'

const DEFAULT_CHAPTER = {
  id: 'science-1',
  name: 'Light \u2014 Reflection & Refraction',
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
  const { bookmarkedChapters, toggleChapterComplete, toggleBookmark, setLastOpenedChapter, subjectDefinition } = useStudy()
  const { content: remoteContent } = useContent(chapter.id, chapter.subjectId || 'math')

  const [viewMode, setViewMode] = useState(initialView)
  const [fontSize, setFontSize] = useState('base')
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)
  const [showUnlockModal, setShowUnlockModal] = useState(false)

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
                <span>\u2022</span>
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
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">No new board exam alerts right now.</p>
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
      </header>

      {/* TOOLBAR */}
      <div className="bg-white/80 dark:bg-stone-850/80 border-b border-stone-200/50 dark:border-stone-800/60 px-4 py-2 sticky top-[57px] z-20 backdrop-blur-md">
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

      {/* ARTICLE CONTENT */}
      <main className="max-w-2xl mx-auto px-4 pt-6 pb-40">
        <article className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="teal">RBSE Class 10</Badge>
            <Badge variant="accent">{subjectDefinition.label}</Badge>
            <Badge variant="stone">Est. read time: 8 mins</Badge>
            {isCompleted && <Badge variant="success">✓ Revised</Badge>}
            {isBookmarked && <Badge variant="accent">🔖 Saved</Badge>}
          </div>

          <div>
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-widest mb-1">
              Revision Notes
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 leading-tight">
              {chapter.name}
            </h2>
          </div>

          {viewMode === 'unlocked' ? (
            <>
              {(() => {
                const noteData = remoteContent?.notes || CHAPTER_NOTES[chapter.id] || {
                  title: chapter.name,
                  subject: subjectDefinition.label,
                  weight: chapter.weight,
                  readTime: '6 mins',
                  sections: [
                    {
                      heading: `1. Key Concepts — ${chapter.name}`,
                      content: `This chapter covers core RBSE Class 10 ${subjectDefinition.label} topics. Thorough revision of these fundamental principles will help you score maximum marks in section A and section B of the board paper.`,
                      keyBox: {
                        title: '⚡ Essential Exam Takeaways',
                        items: [
                          '**Core Definition:** Understand the basic principles and definitions.',
                          '**High-Yield Weightage:** This chapter holds ' + chapter.weight + '% weightage in the RBSE Class 10 board exam.',
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
                  <div className="space-y-6">
                    {noteData.sections.map((sec, idx) => (
                      <section key={idx} className={`space-y-3 ${fontSizeClass}`}>
                        <h3 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 border-b border-stone-200 dark:border-stone-800 pb-2">
                          {sec.heading}
                        </h3>
                        <p className="text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line">
                          {sec.content}
                        </p>

                        {sec.keyBox && (
                          <Card className="p-4 border-l-4 border-amber-500 dark:border-amber-400 bg-amber-50/50 dark:bg-amber-950/30 my-3">
                            <p className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider mb-2">
                              {sec.keyBox.title}
                            </p>
                            <ul className="space-y-1.5 text-xs sm:text-sm text-stone-800 dark:text-stone-200 font-medium">
                              {sec.keyBox.items.map((item, i) => (
                                <li key={i} className="leading-relaxed">
                                  {item.startsWith('**') ? (
                                    <>
                                      <strong>{item.split('**')[1]}</strong>
                                      {item.split('**')[2]}
                                    </>
                                  ) : (
                                    item
                                  )}
                                </li>
                              ))}
                            </ul>
                          </Card>
                        )}

                        {sec.formulaBox && (
                          <div className="p-4 bg-teal-50/60 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/60 rounded-card text-center my-3">
                            <p className="text-xs font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider mb-1">
                              {sec.formulaBox.title}
                            </p>
                            <p className="text-lg sm:text-xl font-extrabold text-teal-900 dark:text-teal-100 font-mono my-1">
                              {sec.formulaBox.formula}
                            </p>
                            {sec.formulaBox.subtext && (
                              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                                {sec.formulaBox.subtext}
                              </p>
                            )}
                          </div>
                        )}
                      </section>
                    ))}

                    {/* Actions Footer */}
                    <div className="pt-6 border-t border-stone-200 dark:border-stone-800 space-y-4">
                      <Card className="p-4 bg-cream-200/60 dark:bg-stone-800/60 border border-amber-200/50 dark:border-stone-700/50">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-bold text-stone-900 dark:text-stone-100">Finished reading?</p>
                            <p className="text-xs text-stone-500 dark:text-stone-400">Marking complete updates your streak and revision history!</p>
                          </div>
                          <button
                            onClick={() => {
                              toggleChapterComplete(chapter.id)
                              showToast(isCompleted ? 'Revision un-marked' : 'Awesome! Chapter marked as revised 🔥')
                            }}
                            className={`min-h-[44px] px-5 py-2.5 rounded-btn font-semibold text-xs sm:text-sm transition-all active:scale-95 shadow-sm ${
                              isCompleted
                                ? 'bg-teal-600 text-white hover:bg-teal-700'
                                : 'bg-amber-500 text-white hover:bg-amber-600'
                            }`}
                          >
                            {isCompleted ? '✓ Revision Complete' : 'Mark as Revised'}
                          </button>
                        </div>
                      </Card>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            if (onNavigate) onNavigate('revision', { chapterId: chapter.id })
                          }}
                          className="min-h-[44px] py-2 px-3 rounded-btn bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-amber-200"
                        >
                          <span>⚡ Quick Revision</span>
                        </button>
                        <button
                          onClick={() => {
                            if (onNavigate) onNavigate('quiz', { chapterId: chapter.id })
                          }}
                          className="min-h-[44px] py-2 px-3 rounded-btn bg-teal-100 dark:bg-teal-950/60 text-teal-900 dark:text-teal-200 border border-teal-300 dark:border-teal-800 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-teal-200"
                        >
                          <span>🎯 Chapter Quiz</span>
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          if (onNavigate) {
                            onNavigate('pyqs', { chapterFilter: chapter.name })
                          } else if (onNavigateHome) {
                            onNavigateHome()
                          }
                        }}
                        className="w-full min-h-[48px] py-3 px-4 rounded-btn bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-bold text-sm flex items-center justify-center gap-2 hover:bg-stone-800 dark:hover:bg-white active:scale-98 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-amber-400"
                      >
                        <BookOpenIcon className="w-4 h-4 text-amber-400 dark:text-amber-600" />
                        <span>Practice chapter PYQs &rarr;</span>
                      </button>
                    </div>
                  </div>
                )
              })()}
            </>
          ) : (
            /* LOCKED / TEASER STATE */
            <div className="relative pt-2">
              <section className="space-y-3 opacity-80 pointer-events-none select-none">
                <h3 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 border-b border-stone-200 dark:border-stone-800 pb-2">
                  2. Spherical Mirrors & Mirror Formula (Teaser Preview)
                </h3>
                <p className="text-stone-700 dark:text-stone-300">
                  A spherical mirror is a mirror whose reflecting surface is part of a hollow sphere of glass...
                </p>
              </section>

              <div className="absolute inset-x-0 top-0 bottom-0 bg-gradient-to-b from-transparent via-cream-100/90 to-cream-100 dark:via-stone-900/95 dark:to-stone-900 pt-24 pb-4 flex flex-col justify-end">
                <Card className="p-5 sm:p-6 bg-white dark:bg-stone-800 border-2 border-violet-300 dark:border-violet-700/80 shadow-card-md">
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-950/90 text-violet-600 dark:text-violet-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <LockClosedIcon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Badge variant="violet">Paid Tier Feature</Badge>
                      <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 mt-1 leading-snug">
                        Unlock Full Notes for {chapter.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
                        Get instant access to complete summaries, step-by-step shortcuts, formula sheets, and AI-predicted question sets.
                      </p>
                      <button
                        onClick={() => setShowUnlockModal(true)}
                        className="w-full mt-4 min-h-[46px] py-3 px-4 rounded-btn bg-violet-600 dark:bg-violet-700 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-violet-700 dark:hover:bg-violet-600 active:scale-98 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-violet-400"
                      >
                        <SparklesIcon className="w-4 h-4" />
                        <span>Unlock Full Notes Access</span>
                      </button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </article>
      </main>

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

      {/* UNLOCK MODAL POPUP */}
      {showUnlockModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-800 dark:border dark:border-stone-700/80 rounded-card shadow-card-md w-full max-w-md p-5 border-t-4 border-violet-600">
            <div className="flex items-start justify-between border-b border-stone-100 dark:border-stone-700/60 pb-3 mb-3">
              <div>
                <Badge variant="violet">Paid Tier Preview</Badge>
                <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 mt-1">
                  Unlock {chapter.name}
                </h3>
              </div>
              <button
                onClick={() => setShowUnlockModal(false)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400"
                aria-label="Close modal"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs sm:text-sm text-stone-600 dark:text-stone-300">
              <p className="leading-relaxed">
                Full unlock functionality will be enabled when backend & payment integration is added in Stage 3.
              </p>
              <div className="p-3 bg-violet-50 dark:bg-violet-950/60 rounded-btn border border-violet-200 dark:border-violet-800/40 text-violet-900 dark:text-violet-200 font-medium">
                ✨ Tip: You can switch between <strong>Unlocked Full Notes</strong> and <strong>Locked Teaser</strong> views using the top switcher toolbar anytime!
              </div>
            </div>
            <div className="mt-5">
              <button
                onClick={() => setShowUnlockModal(false)}
                className="w-full py-3 rounded-btn bg-violet-600 dark:bg-violet-700 text-white font-bold text-sm min-h-[44px] hover:bg-violet-700 active:scale-95 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
