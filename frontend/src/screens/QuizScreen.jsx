import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useStudy } from '../hooks/useStudy'
import { useQuiz } from '../hooks/useQuiz'
import { SUBJECT_CATALOGUE } from '../data/subjects'
import ScreenHeader from '../components/ui/ScreenHeader'
import BottomNav from '../components/ui/BottomNav'
import RazorpayCheckoutModal from '../components/ui/RazorpayCheckoutModal'

export default function QuizScreen({ onNavigate }) {
  const { chapterId } = useParams()
  const { chapters, recordPracticeAttempt, isPremium, activatePremium } = useStudy()
  const activeChapterId = chapterId || chapters[0]?.id || 'math-1'
  const subjectId = activeChapterId.replace(/-\d+$/, '')
  const catalogChapters = (SUBJECT_CATALOGUE[subjectId] || []).map((ch) => ({
    ...ch,
    id: ch.id || `${subjectId}-${ch.index + 1}`,
  }))
  const currentChapter = chapters.find((c) => c.id === activeChapterId)
    || catalogChapters.find((c) => c.id === activeChapterId)
    || { id: activeChapterId, name: 'Chapter Quiz' }

  const { quizQuestions, loading } = useQuiz(activeChapterId)

  // Quiz interactive state
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({}) // { questionId: selectedOptionLetter }
  const [submitted, setSubmitted] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)

  // For free users, limit quiz to 3 questions
  const availableQuestions = isPremium ? quizQuestions : quizQuestions.slice(0, 3)

  const currentQ = availableQuestions[currentIndex]

  const handleSelectOption = (qId, optionLetter) => {
    if (submitted) return
    setSelectedAnswers((prev) => ({
      ...prev,
      [qId]: optionLetter,
    }))
  }

  const handleFinish = () => {
    let score = 0
    availableQuestions.forEach((q) => {
      const selected = selectedAnswers[q.id]
      const correct = q.correct_option || (q.answer && q.answer[0])
      if (selected && (selected === correct || q.options?.find((o) => o.startsWith(selected) && o.includes(q.answer)))) {
        score += q.marks || 1
      }
    })

    const total = availableQuestions.reduce((sum, q) => sum + (q.marks || 1), 0)
    recordPracticeAttempt({
      topic: `${currentChapter.name} Quiz`,
      difficulty: 'Medium',
      score,
      total: total || 1,
    })
    setSubmitted(true)
  }

  const handleRestart = () => {
    setSelectedAnswers({})
    setSubmitted(false)
    setCurrentIndex(0)
  }

  const calculateStats = () => {
    let correctCount = 0
    let attemptedCount = 0
    let totalScore = 0
    let maxScore = 0

    availableQuestions.forEach((q) => {
      maxScore += q.marks || 1
      const selected = selectedAnswers[q.id]
      if (selected) {
        attemptedCount += 1
        const correct = q.correct_option || (q.answer && q.answer[0])
        if (selected === correct || q.options?.find((o) => o.startsWith(selected) && o.includes(q.answer))) {
          correctCount += 1
          totalScore += q.marks || 1
        }
      }
    })

    const incorrectCount = attemptedCount - correctCount
    const accuracy = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0

    return {
      correctCount,
      incorrectCount,
      attemptedCount,
      totalScore,
      maxScore,
      accuracy,
    }
  }

  const stats = submitted ? calculateStats() : null

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-stone-900 pb-24 transition-colors duration-200">
      <ScreenHeader
        title="Chapter Quiz"
        subtitle={currentChapter.name}
        actionLabel={isPremium ? '👑 Unlimited' : 'Unlock All (₹99)'}
        onAction={isPremium ? undefined : () => setShowCheckout(true)}
      />

      <main className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {loading ? (
          <div className="p-8 text-center text-stone-400 dark:text-stone-500 text-sm">Loading quiz questions...</div>
        ) : availableQuestions.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-stone-800 rounded-card border border-stone-200 dark:border-stone-700">
            <p className="text-stone-600 dark:text-stone-300 text-sm font-semibold">No quiz questions currently available for this chapter.</p>
          </div>
        ) : submitted ? (
          /* QUIZ RESULTS VIEW */
          <div className="bg-white dark:bg-stone-800 rounded-card p-5 border border-stone-200 dark:border-stone-700 shadow-card space-y-4 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950 flex items-center justify-center mx-auto text-3xl">
              🏆
            </div>
            <h2 className="text-lg font-extrabold text-stone-900 dark:text-stone-100">
              Quiz Completed!
            </h2>

            {/* Scorecard metric grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700">
                <p className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">Score</p>
                <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{stats.totalScore} / {stats.maxScore}</p>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700">
                <p className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">Accuracy</p>
                <p className="text-lg font-bold text-teal-600 dark:text-teal-400">{stats.accuracy}%</p>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700">
                <p className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">Correct</p>
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{stats.correctCount}</p>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700">
                <p className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">Incorrect</p>
                <p className="text-lg font-bold text-rose-600 dark:text-rose-400">{stats.incorrectCount}</p>
              </div>
            </div>

            {/* Free user upgrade prompt */}
            {!isPremium && quizQuestions.length > 3 && (
              <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 text-left">
                <p className="text-xs font-bold text-purple-900 dark:text-purple-200">
                  👑 Unlock remaining {quizQuestions.length - 3} questions & full mock tests
                </p>
                <p className="text-[11px] text-purple-700 dark:text-purple-300 mt-0.5">
                  Free users can attempt up to 3 questions per quiz. Upgrade for unlimited attempts and full board mocks.
                </p>
                <button
                  onClick={() => setShowCheckout(true)}
                  className="mt-2.5 px-3 py-1.5 rounded-btn bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs"
                >
                  Upgrade to PRO (₹99) →
                </button>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleRestart}
                className="flex-1 py-2.5 rounded-btn bg-stone-100 dark:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs"
              >
                🔄 Retry Quiz
              </button>
              <button
                onClick={() => onNavigate('question-bank')}
                className="flex-1 py-2.5 rounded-btn bg-amber-500 text-stone-900 font-bold text-xs"
              >
                📚 Question Bank
              </button>
            </div>
          </div>
        ) : (
          /* ACTIVE QUESTION VIEW */
          <div className="space-y-4">
            {/* Progress bar */}
            <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 font-semibold px-1">
              <span>Question {currentIndex + 1} of {availableQuestions.length}</span>
              <span>{currentQ?.marks || 1} {currentQ?.marks === 1 ? 'Mark' : 'Marks'}</span>
            </div>
            <div className="w-full bg-stone-200 dark:bg-stone-700 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / availableQuestions.length) * 100}%` }}
              />
            </div>

            {/* Question card */}
            <div className="bg-white dark:bg-stone-800 rounded-card p-5 border border-stone-200 dark:border-stone-700 shadow-card space-y-4">
              <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 leading-snug">
                {currentQ?.question}
              </h3>

              {/* Options */}
              <div className="space-y-2">
                {(currentQ?.options || []).map((opt, i) => {
                  const letter = opt[0] // 'A', 'B', 'C', 'D'
                  const isSelected = selectedAnswers[currentQ.id] === letter
                  return (
                    <button
                      key={i}
                      onClick={() => handleSelectOption(currentQ.id, letter)}
                      className={`w-full p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-stone-900 dark:text-stone-100 font-bold shadow-xs'
                          : 'border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900/50 text-stone-700 dark:text-stone-300 hover:border-stone-300'
                      }`}
                    >
                      <span>{opt}</span>
                      <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                        isSelected ? 'border-amber-500 bg-amber-500 text-white' : 'border-stone-300 text-stone-400'
                      }`}>
                        {isSelected ? '✓' : letter}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Nav controls */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-700">
                <button
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((idx) => Math.max(0, idx - 1))}
                  className="px-3 py-2 rounded-btn text-xs font-bold text-stone-600 dark:text-stone-400 disabled:opacity-40"
                >
                  ← Previous
                </button>

                {currentIndex < availableQuestions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIndex((idx) => idx + 1)}
                    className="px-4 py-2 rounded-btn bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold text-xs shadow-xs"
                  >
                    Next Question →
                  </button>
                ) : (
                  <button
                    onClick={handleFinish}
                    className="px-5 py-2 rounded-btn bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                  >
                    Submit Quiz ✔
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <BottomNav activeScreen="practice" onNavigate={onNavigate} />

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
