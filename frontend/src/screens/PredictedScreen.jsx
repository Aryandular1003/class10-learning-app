import { useState, useMemo } from 'react'
import { useStudy } from '../hooks/useStudy'
import { useQuestions } from '../hooks/useQuestions'
import { SUBJECT_CHAPTERS } from '../data/subjects'
import ScreenHeader from '../components/ui/ScreenHeader'
import BottomNav from '../components/ui/BottomNav'
import ContentCard from '../components/ui/ContentCard'
import RazorpayCheckoutModal from '../components/ui/RazorpayCheckoutModal'

const PROBABILITY_LEVELS = [
  { id: 'all', label: 'All Probabilities' },
  { id: 'very_high', label: '🔥 Very High' },
  { id: 'high', label: '⭐ High' },
  { id: 'moderate', label: '⚡ Moderate' },
]

export default function PredictedScreen({ onNavigate }) {
  const { activeSubject, subjects, isPremium, activatePremium } = useStudy()
  const [selectedSubject, setSelectedSubject] = useState(activeSubject || 'math')
  const [selectedChapter, setSelectedChapter] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [showCheckout, setShowCheckout] = useState(false)

  const chaptersList = useMemo(() => {
    const names = SUBJECT_CHAPTERS[selectedSubject] || []
    return names.map((name, i) => ({
      id: `${selectedSubject}-${i + 1}`,
      name,
    }))
  }, [selectedSubject])

  const filterParams = useMemo(() => {
    const params = {
      subject_id: selectedSubject,
      is_predicted: true,
    }
    if (selectedChapter !== 'all') params.chapter_id = selectedChapter
    return params
  }, [selectedSubject, selectedChapter])

  const { questions, loading } = useQuestions(filterParams)

  // In-memory filter for probability level
  const displayedQuestions = useMemo(() => {
    if (selectedLevel === 'all') return questions
    return questions.filter((q) => {
      const lvl = (q.prediction_level || '').toLowerCase()
      if (selectedLevel === 'very_high') return lvl.includes('very high')
      if (selectedLevel === 'high') return lvl === 'high'
      if (selectedLevel === 'moderate') return lvl.includes('moderate')
      return true
    })
  }, [questions, selectedLevel])

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-stone-900 pb-24 transition-colors duration-200">
      <ScreenHeader
        title="Predicted Questions"
        subtitle="RBSE 2026 High-Probability Board Exam Questions"
        actionLabel={isPremium ? '👑 PRO Active' : 'Unlock All (₹99)'}
        onAction={isPremium ? undefined : () => setShowCheckout(true)}
      />

      <main className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {/* MANDATORY DISCLAIMER BOX */}
        <section className="p-3.5 rounded-card bg-amber-50 dark:bg-amber-950/40 border border-amber-300/80 dark:border-amber-700/60 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200 shadow-xs">
          <span className="text-base leading-none">⚠️</span>
          <div>
            <p className="font-bold">Important Board Preparation Disclaimer:</p>
            <p className="mt-0.5 leading-relaxed text-amber-800 dark:text-amber-300">
              Predictions are based on past trends, question frequency, repeated concepts, and available study material. They are not guaranteed questions. Do not rely solely on predictions.
            </p>
          </div>
        </section>

        {/* Subject Filter Tabs */}
        <section aria-label="Subject filter" className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {subjects.map((sub) => (
            <button
              key={sub.id}
              onClick={() => {
                setSelectedSubject(sub.id)
                setSelectedChapter('all')
              }}
              className={`px-3 py-1.5 rounded-chip text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                selectedSubject === sub.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
              }`}
            >
              <span>{sub.emoji}</span>
              <span>{sub.label}</span>
            </button>
          ))}
        </section>

        {/* Probability & Chapter Filters */}
        <section className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <label className="block font-semibold text-stone-600 dark:text-stone-400 mb-1">Chapter</label>
            <select
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
              className="w-full p-2 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-medium"
            >
              <option value="all">All Chapters</option>
              {chaptersList.map((ch) => (
                <option key={ch.id} value={ch.id}>{ch.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-stone-600 dark:text-stone-400 mb-1">Probability Level</label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full p-2 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-medium"
            >
              {PROBABILITY_LEVELS.map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
          </div>
        </section>

        {/* Questions Display */}
        {loading ? (
          <div className="p-8 text-center text-stone-400 dark:text-stone-500 text-sm">Loading predicted questions...</div>
        ) : displayedQuestions.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-stone-800 rounded-card border border-stone-200 dark:border-stone-700">
            <p className="text-stone-600 dark:text-stone-300 text-sm font-semibold">No predicted questions found for this selection.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedQuestions.map((q, index) => {
              // FREE users see first 2 predicted questions with answers; remaining are PRO
              const isLocked = !isPremium && index >= 2
              return (
                <ContentCard
                  key={q.id || index}
                  item={q}
                  isLocked={isLocked}
                  onUnlock={() => setShowCheckout(true)}
                />
              )
            })}
          </div>
        )}
      </main>

      <BottomNav activeScreen="predicted" onNavigate={onNavigate} />

      {showCheckout && (
        <RazorpayCheckoutModal
          onClose={() => setShowCheckout(false)}
          onSuccess={(payment) => {
            activatePremium(payment)
            setShowCheckout(false)
          }}
        />
      )}
    </div>
  )
}
