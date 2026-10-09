import { useState } from 'react'
import { useTheme } from '../theme/useTheme'
import { useStudy } from '../hooks/useStudy'
import { useAuth } from '../hooks/useAuth'
import {
  FireIcon,
  TrophyIcon,
  CheckCircleIcon,
  BookmarkSolidIcon,
  BookOpenIcon,
  XMarkIcon,
} from '../components/ui/icons'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'
import ScreenHeader from '../components/ui/ScreenHeader'
import BottomNav from '../components/ui/BottomNav'
import SubjectSwitcher from '../components/ui/SubjectSwitcher'

function AchievementCard({ achievement }) {
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-btn border transition-all
        ${achievement.earned
          ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-200/50 dark:border-amber-800/40'
          : 'bg-stone-50 dark:bg-stone-800/40 border-stone-200/50 dark:border-stone-700/40 opacity-70'
        }`}
    >
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-2xl
          ${achievement.earned
            ? 'bg-amber-100 dark:bg-amber-950/80'
            : 'bg-stone-100 dark:bg-stone-800 grayscale'
          }`}
        aria-hidden="true"
      >
        {achievement.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">{achievement.title}</p>
          {achievement.earned && <Badge variant="teal">Earned</Badge>}
        </div>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">{achievement.description}</p>
        {achievement.earned && achievement.earnedDate && (
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">{achievement.earnedDate}</p>
        )}
        {!achievement.earned && achievement.progress !== undefined && (
          <div className="mt-1.5">
            <div className="progress-bar">
              <div
                className="progress-fill bg-amber-gradient"
                style={{ width: `${Math.min(100, Math.round((achievement.progress / achievement.target) * 100))}%` }}
              />
            </div>
            <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">
              {achievement.progress}/{achievement.target}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function SettingsToggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-start justify-between gap-3 py-3">
      <div className="flex-1">
        <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">{label}</p>
        {description && (
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">{description}</p>
        )}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative flex-shrink-0 w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 dark:focus:ring-offset-stone-800
          ${checked ? 'bg-amber-500' : 'bg-stone-300 dark:bg-stone-600'}`}
        aria-label={label}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200
            ${checked ? 'translate-x-6' : 'translate-x-0'}`}
        />
      </button>
    </div>
  )
}

export default function ProfileScreen({ onNavigate, onOpenChapter }) {
  const { user, profile, signOut, isSupabaseConfigured } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const {
    studyState,
    completedCount,
    monthlyPct,
    bookmarkedChapters,
    achievements,
    currentStreak,
    longestStreak,
    totalQuestions,
    averageScore,
    topicPerformance,
    subjects,
    activeSubject,
    setActiveSubject,
    subjectDefinition,
    toggleBookmark,
    resetToDefaults,
  } = useStudy()

  const [notificationsOn, setNotificationsOn] = useState(() => {
    return localStorage.getItem('notifications') !== 'off'
  })

  const [showAllHistory, setShowAllHistory] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)

  const handleNotificationsChange = (val) => {
    setNotificationsOn(val)
    localStorage.setItem('notifications', val ? 'on' : 'off')
  }

  const isDark = theme === 'dark'
  const history = studyState.practiceHistory || []
  const visibleHistory = showAllHistory ? history : history.slice(0, 3)
  const performanceRows = Object.entries(topicPerformance)
  const strongestTopic = performanceRows.sort((a, b) => b[1].average - a[1].average)[0]
  const weakestTopic = performanceRows.sort((a, b) => a[1].average - b[1].average)[0]

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100 transition-colors duration-200">
      <ScreenHeader
        title="Profile"
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <main className="max-w-2xl mx-auto px-4 pb-40 pt-6">
        {/* Profile Hero */}
        <section className="mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-amber-gradient flex items-center justify-center shadow-amber flex-shrink-0">
              <span className="text-2xl font-extrabold text-white" aria-hidden="true">
                {(profile?.full_name || profile?.display_name || 'Student')[0]}
              </span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-stone-900 dark:text-stone-100">{profile?.full_name || profile?.display_name || 'Student'}</h1>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                Class {profile?.class_level || 10} \u2022 {profile?.board || 'RBSE'} \u2022 {subjectDefinition.label}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <Badge variant="accent">🔥 {currentStreak}-day streak</Badge>
                <Badge variant="teal">✓ {completedCount} chapter{completedCount !== 1 ? 's' : ''} done</Badge>
              </div>
            </div>
            <button type="button" onClick={() => onNavigate && onNavigate('profile-edit')} className="ml-auto self-start min-h-[40px] px-3 rounded-btn border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-200">
              Edit profile
            </button>
          </div>
        </section>

        <SubjectSwitcher subjects={subjects} activeSubject={activeSubject} onChange={setActiveSubject} />

        {/* Dynamic Stats */}
        <section className="mb-6">
          <h2 className="text-h3 font-semibold text-stone-800 dark:text-stone-200 mb-3">Your Progress</h2>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Card className="p-4 text-center">
              <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 mb-0.5">
                {currentStreak}
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400">Current streak</p>
              <div className="flex items-center justify-center mt-1">
                <FireIcon className="w-4 h-4 text-amber-500" />
              </div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-3xl font-extrabold text-teal-600 dark:text-teal-400 mb-0.5">
                {completedCount}
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400">Chapters completed</p>
              <div className="flex items-center justify-center mt-1">
                <CheckCircleIcon className="w-4 h-4 text-teal-500" />
              </div>
            </Card>
          </div>

          <Card className="p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-semibold text-stone-800 dark:text-stone-200">Monthly Revision Goal</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">
                {studyState.monthlyDays}/{studyState.monthlyGoal} days
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill bg-amber-gradient"
                style={{ width: `${monthlyPct}%` }}
              />
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1.5">
              {monthlyPct}% of monthly goal \u2022 {studyState.monthlyGoal - studyState.monthlyDays} days remaining
            </p>
          </Card>
        </section>

        {/* Study Analytics */}
        <section className="mb-6">
          <h2 className="text-h3 font-semibold text-stone-800 dark:text-stone-200 mb-3">Study Analytics</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              ['Study days', (studyState.studyDates || []).length, '📅'],
              ['Longest streak', `${longestStreak || currentStreak} days`, '🏆'],
              ['Questions answered', totalQuestions, '📝'],
              ['Average score', `${averageScore}%`, '📈'],
            ].map(([label, value, icon]) => (
              <Card key={label} className="p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-2xl" aria-hidden="true">{icon}</span>
                  <span className="text-xl font-extrabold text-stone-900 dark:text-stone-100">{value}</span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{label}</p>
              </Card>
            ))}
          </div>
          {performanceRows.length > 0 && (
            <Card className="p-4 mt-3">
              <p className="section-label mb-3">Topic Performance</p>
              <div className="space-y-3">
                {performanceRows.map(([topic, item]) => (
                  <div key={topic}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-stone-800 dark:text-stone-200">{topic}</span>
                      <span className="text-stone-500 dark:text-stone-400">{item.average}% · {item.attempts} attempt{item.attempts !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="progress-bar">
                      <div className={`progress-fill ${item.average >= 80 ? 'bg-teal-gradient' : 'bg-amber-gradient'}`} style={{ width: `${item.average}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-3">
                {strongestTopic ? `Strongest: ${strongestTopic[0]}` : 'Complete a quiz to see topic insights.'}
                {weakestTopic && strongestTopic?.[0] !== weakestTopic[0] ? ` · Revise next: ${weakestTopic[0]}` : ''}
              </p>
            </Card>
          )}
        </section>

        {/* Saved Notes Section */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <BookmarkSolidIcon className="w-5 h-5 text-amber-500" />
            <h2 className="text-h3 font-semibold text-stone-800 dark:text-stone-200">Saved Notes</h2>
          </div>

          {bookmarkedChapters.length === 0 ? (
            <Card className="p-5 text-center border-dashed">
              <div className="text-3xl mb-2" aria-hidden="true">🔖</div>
              <p className="text-sm font-semibold text-stone-800 dark:text-stone-200 mb-1">No saved notes yet</p>
              <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
                Bookmark important chapters while reading notes to quickly access them here.
              </p>
              <button
                onClick={() => onNavigate && onNavigate('dashboard')}
                className="px-4 py-2 rounded-btn bg-amber-500 text-white font-semibold text-xs min-h-[44px] hover:bg-amber-600 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-amber-400 inline-flex items-center gap-1.5"
              >
                <BookOpenIcon className="w-4 h-4" />
                Browse chapters
              </button>
            </Card>
          ) : (
            <div className="flex flex-col gap-2.5">
              {bookmarkedChapters.map((ch) => (
                <Card
                  key={ch.id}
                  className="p-3.5 flex items-center justify-between gap-3 hover:shadow-card-md transition-all cursor-pointer"
                  onClick={() => onOpenChapter && onOpenChapter(ch)}
                  role="button"
                  aria-label={`Open notes for ${ch.name}`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-chip bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                      🔖
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-stone-900 dark:text-stone-100 truncate">{ch.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant={ch.done ? 'teal' : 'accent'}>{ch.done ? '✓ Completed' : 'Ready to revise'}</Badge>
                        <span className="text-xs text-stone-400">{ch.weight}% weightage</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleBookmark(ch.id)
                    }}
                    className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-stone-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    aria-label={`Remove bookmark for ${ch.name}`}
                    title="Remove bookmark"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Practice History Section */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-h3 font-semibold text-stone-800 dark:text-stone-200">Practice History</h2>
            {history.length > 3 && (
              <button
                onClick={() => setShowAllHistory((v) => !v)}
                className="text-xs text-amber-700 dark:text-amber-400 font-semibold min-h-[44px] px-2 flex items-center focus:outline-none focus:ring-2 focus:ring-amber-400 rounded"
              >
                {showAllHistory ? 'Show less' : `View all (${history.length}) \u2192`}
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <Card className="p-5 text-center">
              <div className="text-3xl mb-2" aria-hidden="true">✏️</div>
              <p className="text-sm font-semibold text-stone-800 dark:text-stone-200 mb-1">No practice attempts yet</p>
              <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
                Take a quick 10-question practice quiz to test your Science concepts!
              </p>
              <button
                onClick={() => onNavigate && onNavigate('practice')}
                className="px-4 py-2 rounded-btn bg-amber-500 text-white font-semibold text-xs min-h-[44px] hover:bg-amber-600 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-amber-400 inline-flex items-center gap-1.5"
              >
                Start Practice \u2192
              </button>
            </Card>
          ) : (
            <div className="flex flex-col gap-2.5">
              {visibleHistory.map((item, idx) => (
                <Card key={idx} className="p-3.5 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-stone-900 dark:text-stone-100">{item.topic}</p>
                      <Badge variant={item.difficulty === 'Easy' ? 'teal' : item.difficulty === 'Board level' ? 'accent' : 'violet'}>
                        {item.difficulty}
                      </Badge>
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                      {item.date} \u2022 {item.score}/{item.total} correct
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`text-lg font-extrabold ${item.pct >= 80 ? 'text-teal-600 dark:text-teal-400' : item.pct >= 60 ? 'text-amber-600 dark:text-amber-400' : 'text-stone-600 dark:text-stone-400'}`}>
                      {item.pct}%
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Achievements Section */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <TrophyIcon className="w-5 h-5 text-amber-500" />
            <h2 className="text-h3 font-semibold text-stone-800 dark:text-stone-200">Achievements</h2>
          </div>
          <div className="flex flex-col gap-2.5">
            {achievements.map((a) => (
              <AchievementCard key={a.id} achievement={a} />
            ))}
          </div>
        </section>

        {/* Settings Section */}
        <section className="mb-6">
          <h2 className="text-h3 font-semibold text-stone-800 dark:text-stone-200 mb-3">Settings</h2>
          <Card className="p-4 divide-y divide-stone-100 dark:divide-stone-700/60">
            <SettingsToggle
              label="Dark Mode"
              description="Switch between light and dark themes"
              checked={isDark}
              onChange={() => toggleTheme()}
            />
            <SettingsToggle
              label="Study Reminders"
              description="Daily nudges to keep your streak going"
              checked={notificationsOn}
              onChange={handleNotificationsChange}
            />
            {isSupabaseConfigured && user && (
              <div className="pt-3 mt-3">
                <button type="button" onClick={() => signOut()} className="w-full min-h-[42px] rounded-btn border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 text-xs font-semibold">
                  Sign out
                </button>
              </div>
            )}
          </Card>
        </section>

        {/* About Card */}
        <section className="mb-6">
          <Card className="p-4 border border-amber-200/60 dark:border-amber-800/40 bg-amber-50/30 dark:bg-amber-950/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-chip bg-amber-gradient flex items-center justify-center shadow-amber">
                <TrophyIcon className="w-3.5 h-3.5 text-white" />
              </div>
              <p className="text-sm font-bold text-stone-900 dark:text-stone-100">About BoardReady</p>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              BoardReady is built for RBSE Class 10 students in Rajasthan. Our goal is to make board exam preparation accessible, stress-free, and effective \u2014 with high-quality notes, previous year questions, and daily practice tools.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="accent">Version 1.0</Badge>
              <Badge variant="stone">RBSE 2026 Syllabus</Badge>
            </div>
          </Card>
        </section>

        {profile?.role === 'founder' && <Card className="p-4 mb-6 border border-violet-200 dark:border-violet-800/50 bg-violet-50/40 dark:bg-violet-950/20">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-stone-900 dark:text-stone-100">Founder content tools</p>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">Import approved content and manage the paper library.</p>
            </div>
            <button
              onClick={() => onNavigate && onNavigate('founder')}
              className="flex-shrink-0 min-h-[44px] px-3 rounded-btn bg-violet-600 text-white text-xs font-bold hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
            >
              Open admin tools
            </button>
          </div>
        </Card>}

        {/* Reset Demo Progress Button */}
        <section className="mb-6 text-center">
          <button
            onClick={() => setShowResetModal(true)}
            className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline min-h-[44px] px-4 py-2 rounded-btn hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            🔄 Reset demo progress
          </button>
        </section>
      </main>

      <BottomNav activeScreen="profile" onNavigate={onNavigate} />

      {/* Confirmation Modal for Resetting Demo Progress */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-800 rounded-card shadow-card-md w-full max-w-md p-5 animate-in fade-in zoom-in-95 dark:border dark:border-stone-700/80">
            <div className="flex items-start justify-between border-b border-stone-100 dark:border-stone-700/60 pb-3 mb-4">
              <div>
                <Badge variant="warning">Reset Confirmation</Badge>
                <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mt-1">
                  Reset demo progress?
                </h3>
              </div>
              <button
                onClick={() => setShowResetModal(false)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400"
                aria-label="Close"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed mb-4">
              This will restore the original demo state for chapter completions, streak, bookmarked notes, and practice history.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetModal(false)}
                className="flex-1 py-3 rounded-btn border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-semibold text-sm min-h-[44px] hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetToDefaults()
                  setShowResetModal(false)
                }}
                className="flex-1 py-3 rounded-btn bg-red-600 text-white font-bold text-sm min-h-[44px] hover:bg-red-700 active:scale-95 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
