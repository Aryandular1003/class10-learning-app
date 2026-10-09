import { lazy, Suspense, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import './index.css'
import HomeDashboard from './screens/HomeDashboard'
import AuthScreen from './screens/AuthScreen'
import ProfileSetupScreen from './screens/ProfileSetupScreen'
import { useAuth } from './hooks/useAuth'
import { useStudy } from './hooks/useStudy'
import { SUBJECT_CATALOGUE } from './data/appData'

const NotesReader = lazy(() => import('./screens/NotesReader'))
const PYQsScreen = lazy(() => import('./screens/PYQsScreen'))
const PapersScreen = lazy(() => import('./screens/PapersScreen'))
const PracticeScreen = lazy(() => import('./screens/PracticeScreen'))
const ProfileScreen = lazy(() => import('./screens/ProfileScreen'))
const FounderDashboardScreen = lazy(() => import('./screens/FounderDashboardScreen'))
const QuestionBankScreen = lazy(() => import('./screens/QuestionBankScreen'))
const PredictedScreen = lazy(() => import('./screens/PredictedScreen'))
const RevisionScreen = lazy(() => import('./screens/RevisionScreen'))
const QuizScreen = lazy(() => import('./screens/QuizScreen'))
const MockTestScreen = lazy(() => import('./screens/MockTestScreen'))

function RouteLoading({ message = 'Loading your study space…' }) {
  return (
    <main className="min-h-screen bg-cream-100 dark:bg-stone-900 flex items-center justify-center p-5">
      <div className="text-center" role="status" aria-live="polite">
        <div className="w-10 h-10 rounded-full border-4 border-amber-200 dark:border-stone-700 border-t-amber-500 animate-spin mx-auto" />
        <p className="mt-3 text-sm font-semibold text-stone-600 dark:text-stone-300">{message}</p>
      </div>
    </main>
  )
}

function ProtectedRoute({ children }) {
  const { isSupabaseConfigured, user, loading } = useAuth()
  const location = useLocation()

  if (!isSupabaseConfigured) return children
  if (loading) return <RouteLoading message="Verifying authentication…" />
  if (!user) return <Navigate to="/auth" replace state={{ from: location }} />
  return children
}

function PublicOnlyRoute({ children }) {
  const { isSupabaseConfigured, user, loading } = useAuth()

  if (!isSupabaseConfigured) return <Navigate to="/" replace />
  if (loading) return <RouteLoading message="Verifying authentication…" />
  if (isSupabaseConfigured && user) return <Navigate to="/" replace />
  return children
}

export default function App() {
  const { loading, user, profile, profileLoading, profileError, retryProfile, isSupabaseConfigured, signOut } = useAuth()

  if (loading || (user && profileLoading)) {
    return <RouteLoading message={loading ? 'Restoring session…' : 'Loading your profile…'} />
  }
  if (isSupabaseConfigured && user && profileError) {
    return (
      <main className="min-h-screen bg-cream-100 dark:bg-stone-900 flex items-center justify-center p-5">
        <section className="w-full max-w-md rounded-card bg-white dark:bg-stone-800 p-6 shadow-card-md text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Profile connection issue</p>
          <h1 className="mt-2 text-xl font-bold text-stone-900 dark:text-stone-100">Your account is safe</h1>
          <p className="mt-2 text-sm text-stone-600 dark:text-stone-300">We could not load your profile right now. Please try again.</p>
          <button onClick={retryProfile} className="mt-5 w-full rounded-btn bg-stone-900 dark:bg-stone-100 px-4 py-3 text-sm font-bold text-white dark:text-stone-900">Try again</button>
          <button onClick={signOut} className="mt-2 w-full rounded-btn border border-stone-200 dark:border-stone-700 px-4 py-2.5 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200">Sign out</button>
        </section>
      </main>
    )
  }
  if (isSupabaseConfigured && user && !profile?.onboarding_completed) return <ProfileSetupScreen />

  return <AppRoutes />
}

function NotesRoute({ onNavigate }) {
  const { chapterId } = useParams()
  const location = useLocation()
  const { chapters, activeSubject, setActiveSubject } = useStudy()
  const subjectId = chapterId?.replace(/-\d+$/, '') || activeSubject

  useEffect(() => {
    if (subjectId && subjectId !== activeSubject && SUBJECT_CATALOGUE[subjectId]) {
      setActiveSubject(subjectId)
    }
  }, [activeSubject, setActiveSubject, subjectId])

  const targetSubject = SUBJECT_CATALOGUE[subjectId] ? subjectId : activeSubject
  const catalogChapters = (SUBJECT_CATALOGUE[targetSubject] || []).map((item) => ({
    ...item,
    id: item.id || `${targetSubject}-${item.index + 1}`,
  }))
  const chapter = chapters.find((item) => item.id === chapterId) || catalogChapters.find((item) => item.id === chapterId)
  if (!chapter) return <Navigate to="/" replace />
  return <NotesReader chapter={chapter} initialView={new URLSearchParams(location.search).get('preview') === 'locked' ? 'locked' : 'unlocked'} onBack={() => onNavigate('home')} onNavigateHome={() => onNavigate('home')} onNavigate={onNavigate} />
}

function AppRoutes() {
  const navigate = useNavigate()
  const location = useLocation()
  const { profile } = useAuth()
  const { chapters } = useStudy()

  const handleNavigate = (screen, state = {}) => {
    if (screen === 'home' || screen === 'dashboard') navigate('/')
    else if (screen === 'chapters') {
      navigate('/')
      window.setTimeout(() => document.getElementById('chapters-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    } else if (screen === 'notes') {
      const chapterId = state.chapterId || state.chapter?.id || chapters[0]?.id
      if (chapterId) navigate(`/notes/${chapterId}`)
    } else if (screen === 'pyqs') {
      const filter = state.chapterFilter ? `?chapter=${encodeURIComponent(state.chapterFilter)}` : ''
      navigate(`/pyqs${filter}`)
    } else if (screen === 'papers') navigate('/papers')
    else if (screen === 'question-bank') navigate('/question-bank')
    else if (screen === 'predicted') navigate('/predicted')
    else if (screen === 'revision') {
      const chapterId = state.chapterId || chapters[0]?.id || 'math-1'
      navigate(`/revision/${chapterId}`)
    } else if (screen === 'quiz') {
      const chapterId = state.chapterId || chapters[0]?.id || 'math-1'
      navigate(`/quiz/${chapterId}`)
    } else if (screen === 'mock-test') {
      const testId = state.testId || 'rbse-mock-1'
      navigate(`/mock-test/${testId}`)
    } else if (screen === 'practice') navigate('/practice')
    else if (screen === 'profile') navigate('/profile')
    else if (screen === 'profile-edit') navigate('/profile-edit')
    else if (screen === 'founder') navigate('/founder')
  }

  const openChapter = (chapter, initialView = 'unlocked') => navigate(`/notes/${chapter.id}${initialView === 'locked' ? '?preview=locked' : ''}`)
  const pyqFilter = new URLSearchParams(location.search).get('chapter') || undefined

  return (
    <Suspense fallback={<RouteLoading />}>
      <Routes>
      <Route path="/auth" element={<PublicOnlyRoute><AuthScreen /></PublicOnlyRoute>} />
      <Route path="/" element={<ProtectedRoute><HomeDashboard onOpenChapterNotes={(chapter) => openChapter(chapter)} onOpenLockedNotes={(chapter) => openChapter(chapter, 'locked')} onNavigate={handleNavigate} /></ProtectedRoute>} />
      <Route path="/notes/:chapterId" element={<ProtectedRoute><NotesRoute onNavigate={handleNavigate} /></ProtectedRoute>} />
      <Route path="/pyqs" element={<ProtectedRoute><PYQsScreen onNavigate={handleNavigate} initialChapterFilter={pyqFilter} /></ProtectedRoute>} />
      <Route path="/papers" element={<ProtectedRoute><PapersScreen onNavigate={handleNavigate} /></ProtectedRoute>} />
      <Route path="/question-bank" element={<ProtectedRoute><QuestionBankScreen onNavigate={handleNavigate} /></ProtectedRoute>} />
      <Route path="/predicted" element={<ProtectedRoute><PredictedScreen onNavigate={handleNavigate} /></ProtectedRoute>} />
      <Route path="/revision/:chapterId" element={<ProtectedRoute><RevisionScreen onNavigate={handleNavigate} /></ProtectedRoute>} />
      <Route path="/quiz/:chapterId" element={<ProtectedRoute><QuizScreen onNavigate={handleNavigate} /></ProtectedRoute>} />
      <Route path="/mock-test/:testId" element={<ProtectedRoute><MockTestScreen onNavigate={handleNavigate} /></ProtectedRoute>} />
      <Route path="/mock-test" element={<ProtectedRoute><MockTestScreen onNavigate={handleNavigate} /></ProtectedRoute>} />
      <Route path="/practice" element={<ProtectedRoute><PracticeScreen onNavigate={handleNavigate} /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfileScreen onNavigate={handleNavigate} onOpenChapter={openChapter} /></ProtectedRoute>} />
      <Route path="/profile-edit" element={<ProtectedRoute><ProfileSetupScreen onComplete={() => navigate('/profile')} /></ProtectedRoute>} />
      <Route path="/founder" element={<ProtectedRoute>{profile?.role === 'founder' ? <FounderDashboardScreen onNavigate={handleNavigate} /> : <Navigate to="/" replace />}</ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
