import { useState, useMemo } from 'react'
import { useStudy } from '../hooks/useStudy'
import { useQuestions } from '../hooks/useQuestions'
import { SUBJECT_CHAPTERS } from '../data/subjects'
import ScreenHeader from '../components/ui/ScreenHeader'
import BottomNav from '../components/ui/BottomNav'
import ContentCard from '../components/ui/ContentCard'
import RazorpayCheckoutModal from '../components/ui/RazorpayCheckoutModal'

const QUESTION_TYPES = [
  { id: 'all', label: 'All Types' },
  { id: 'mcq', label: 'MCQ' },
  { id: 'very_short', label: 'Very Short' },
  { id: 'short', label: 'Short Answer' },
  { id: 'long', label: 'Long Answer' },
  { id: 'numerical', label: 'Numerical' },
  { id: 'case_based', label: 'Case-Based' },
  { id: 'assertion_reason', label: 'Assertion-Reason' },
]

const DIFFICULTIES = [
  { id: 'all', label: 'All Difficulties' },
  { id: 'easy', label: 'Easy' },
  { id: 'medium', label: 'Medium' },
  { id: 'hard', label: 'Hard' },
]

const PRIORITIES = [
  { id: 'all', label: 'All Priorities' },
  { id: 'must_do', label: 'Must Do ⭐' },
  { id: 'important', label: 'Important' },
  { id: 'practice', label: 'Practice' },
]

export default function QuestionBankScreen({ onNavigate }) {
  const { activeSubject, subjects, isPremium, activatePremium } = useStudy()
  const [selectedSubject, setSelectedSubject] = useState(activeSubject || 'math')
  const [selectedChapter, setSelectedChapter] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [selectedMarks, setSelectedMarks] = useState('all')
  const [filterPyqOnly, setFilterPyqOnly] = useState(false)
  const [filterPredictedOnly, setFilterPredictedOnly] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)

  // Chapter options for selected subject
  const chaptersList = useMemo(() => {
    const names = SUBJECT_CHAPTERS[selectedSubject] || []
    return names.map((name, i) => ({
      id: `${selectedSubject}-${i + 1}`,
      name,
    }))
  }, [selectedSubject])

  // Prepare query filter for useQuestions hook
  const filterParams = useMemo(() => {
    const params = { subject_id: selectedSubject }
    if (selectedChapter !== 'all') params.chapter_id = selectedChapter
    if (selectedType !== 'all') params.question_type = selectedType
    if (selectedDifficulty !== 'all') params.difficulty = selectedDifficulty
    if (selectedPriority !== 'all') params.priority = selectedPriority
    if (selectedMarks !== 'all') params.marks = selectedMarks
    if (filterPyqOnly) params.is_pyq = true
    if (filterPredictedOnly) params.is_predicted = true
    return params
  }, [selectedSubject, selectedChapter, selectedType, selectedDifficulty, selectedPriority, selectedMarks, filterPyqOnly, filterPredictedOnly])

  const { questions, loading } = useQuestions(filterParams)

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-stone-900 pb-24 transition-colors duration-200">
      <ScreenHeader
        title="Question Bank"
        subtitle="RBSE Class 10 Board Practice & Solutions"
        actionLabel={isPremium ? '👑 PRO Active' : 'Upgrade to PRO'}
        onAction={isPremium ? undefined : () => setShowCheckout(true)}
      />

      <main className="max-w-2xl mx-auto px-4 py-4 space-y-4">
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
                  ? 'bg-amber-500 text-stone-900 shadow-sm'
                  : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
              }`}
            >
              <span>{sub.emoji}</span>
              <span>{sub.label}</span>
            </button>
          ))}
        </section>

        {/* Detailed Filters Card */}
        <section className="bg-white dark:bg-stone-800 rounded-card p-3.5 border border-stone-200 dark:border-stone-700 shadow-card space-y-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* Chapter dropdown */}
            <div>
              <label className="block font-semibold text-stone-600 dark:text-stone-400 mb-1">Chapter</label>
              <select
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(e.target.value)}
                className="w-full p-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-medium"
              >
                <option value="all">All Chapters</option>
                {chaptersList.map((ch) => (
                  <option key={ch.id} value={ch.id}>{ch.name}</option>
                ))}
              </select>
            </div>

            {/* Question Type */}
            <div>
              <label className="block font-semibold text-stone-600 dark:text-stone-400 mb-1">Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full p-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-medium"
              >
                {QUESTION_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            {/* Difficulty */}
            <div>
              <label className="block font-semibold text-stone-600 dark:text-stone-400 mb-1">Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full p-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-medium"
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d.id} value={d.id}>{d.label}</option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block font-semibold text-stone-600 dark:text-stone-400 mb-1">Priority</label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full p-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-medium"
              >
                {PRIORITIES.map((p) => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            </div>

            {/* Marks */}
            <div>
              <label className="block font-semibold text-stone-600 dark:text-stone-400 mb-1">Marks</label>
              <select
                value={selectedMarks}
                onChange={(e) => setSelectedMarks(e.target.value)}
                className="w-full p-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-medium"
              >
                <option value="all">All Marks</option>
                <option value="1">1 Mark</option>
                <option value="2">2 Marks</option>
                <option value="3">3 Marks</option>
                <option value="4">4 Marks</option>
                <option value="5">5 Marks</option>
              </select>
            </div>
          </div>

          {/* Quick toggle chips */}
          <div className="flex items-center gap-2 pt-1 border-t border-stone-100 dark:border-stone-700">
            <button
              onClick={() => setFilterPyqOnly(!filterPyqOnly)}
              className={`px-2.5 py-1 rounded-chip text-xs font-semibold border transition-colors ${
                filterPyqOnly
                  ? 'bg-sky-500 text-white border-sky-600'
                  : 'bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-600'
              }`}
            >
              📝 PYQs Only
            </button>
            <button
              onClick={() => setFilterPredictedOnly(!filterPredictedOnly)}
              className={`px-2.5 py-1 rounded-chip text-xs font-semibold border transition-colors ${
                filterPredictedOnly
                  ? 'bg-purple-600 text-white border-purple-700'
                  : 'bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-600'
              }`}
            >
              🔥 Predicted Only
            </button>
          </div>
        </section>

        {/* Results Summary */}
        <div className="flex items-center justify-between px-1 text-xs text-stone-500 dark:text-stone-400 font-medium">
          <span>Found {questions.length} questions</span>
          {!isPremium && <span className="text-amber-600 dark:text-amber-400 font-bold">Limited preview for Free users</span>}
        </div>

        {/* Questions List */}
        {loading ? (
          <div className="p-8 text-center text-stone-400 dark:text-stone-500 text-sm">Loading questions...</div>
        ) : questions.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-stone-800 rounded-card border border-stone-200 dark:border-stone-700">
            <p className="text-stone-600 dark:text-stone-300 text-sm font-semibold">No questions match the selected filters.</p>
            <button
              onClick={() => {
                setSelectedChapter('all')
                setSelectedType('all')
                setSelectedDifficulty('all')
                setSelectedPriority('all')
                setSelectedMarks('all')
                setFilterPyqOnly(false)
                setFilterPredictedOnly(false)
              }}
              className="mt-2 text-xs font-bold text-amber-600 dark:text-amber-400 underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {questions.map((q, index) => {
              // FREE user access policy: first 3 questions are free, remainder requires PRO
              const isLocked = !isPremium && q.is_premium && index >= 3
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

      <BottomNav activeScreen="question-bank" onNavigate={onNavigate} />

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
