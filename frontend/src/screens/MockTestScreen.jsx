import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useStudy } from '../hooks/useStudy'
import { useMockTest } from '../hooks/useMockTest'
import ScreenHeader from '../components/ui/ScreenHeader'
import BottomNav from '../components/ui/BottomNav'
import RazorpayCheckoutModal from '../components/ui/RazorpayCheckoutModal'

export default function MockTestScreen({ onNavigate }) {
  const { testId } = useParams()
  const { isPremium, activatePremium, recordPracticeAttempt } = useStudy()
  const { mockTest, questions, loading: _loading } = useMockTest(testId || 'rbse-mock-1')

  const [timeLeft, setTimeLeft] = useState(45 * 60) // 45 mins in seconds
  const [testStarted, setTestStarted] = useState(false)
  const [userAnswers, setUserAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)

  // Countdown timer
  useEffect(() => {
    if (!testStarted || submitted) return undefined
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setSubmitted(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [testStarted, submitted])

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const handleSubmit = () => {
    setSubmitted(true)
    recordPracticeAttempt({
      topic: mockTest?.title || 'Full Board Mock Test',
      difficulty: 'Hard',
      score: 22,
      total: mockTest?.total_marks || 30,
    })
  }

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-stone-900 pb-24 transition-colors duration-200">
      <ScreenHeader
        title="Practice Paper"
        subtitle={mockTest?.title || 'RBSE Board-Level Practice Paper'}
        actionLabel={isPremium ? '👑 Full Access' : 'Upgrade to PRO'}
        onAction={isPremium ? undefined : () => setShowCheckout(true)}
      />

      <main className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {/* PRO Access Guard for Full Mock Tests */}
        {!isPremium ? (
          <div className="bg-white dark:bg-stone-800 rounded-card p-6 border border-stone-200 dark:border-stone-700 shadow-card text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-950 flex items-center justify-center mx-auto text-3xl">
              👑
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                PRO Full-Length RBSE Mock Tests
              </h2>
              <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 max-w-sm mx-auto leading-relaxed">
                Full Subject and Board-Pattern Mock Tests with live timers, strict blueprint marks, and complete examiner solutions are exclusive to PRO students.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-left text-xs space-y-1.5">
              <p className="font-bold text-stone-800 dark:text-stone-200">Features included:</p>
              <p className="text-stone-600 dark:text-stone-300">✔ 80 Marks RBSE Full Syllabus Blueprint Model Papers</p>
              <p className="text-stone-600 dark:text-stone-300">✔ Timed 3 Hours 15 Minutes Exam Simulation</p>
              <p className="text-stone-600 dark:text-stone-300">✔ Complete Step-by-Step Marking Scheme & Traps</p>
            </div>

            <button
              onClick={() => setShowCheckout(true)}
              className="w-full py-3 rounded-btn bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold text-sm shadow-md transition-transform active:scale-95"
            >
              Unlock Board Practice Papers (₹199) →
            </button>
          </div>
        ) : !testStarted ? (
          /* TEST INSTRUCTIONS & START SCREEN */
          <div className="bg-white dark:bg-stone-800 rounded-card p-6 border border-stone-200 dark:border-stone-700 shadow-card space-y-4">
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
              Board-Level Practice Paper — Instructions
            </h2>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700">
                <span className="text-stone-500 dark:text-stone-400">Total Marks:</span>
                <p className="font-bold text-stone-900 dark:text-stone-100 text-sm">{mockTest?.total_marks || 30} Marks</p>
              </div>
              <div className="p-2.5 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700">
                <span className="text-stone-500 dark:text-stone-400">Duration:</span>
                <p className="font-bold text-stone-900 dark:text-stone-100 text-sm">{mockTest?.duration_minutes || 45} Minutes</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              {[
                ['Section A', 'Objective', '6 × 1'],
                ['Section B', 'Short answer', '4 × 2'],
                ['Section C', 'Analytical', '4 × 3'],
                ['Section D', 'Application', '1 × 4'],
              ].map(([section, label, marks]) => (
                <div key={section} className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50">
                  <p className="font-extrabold text-amber-800 dark:text-amber-300">{section}</p>
                  <p className="text-stone-600 dark:text-stone-400">{label}</p>
                  <p className="font-bold text-stone-800 dark:text-stone-200">{marks} marks</p>
                </div>
              ))}
            </div>

            <ul className="text-xs text-stone-600 dark:text-stone-300 space-y-1 list-disc list-inside">
              <li>Attempt the paper in one sitting and follow the section order.</li>
              <li>Write answers step-by-step and show formulas, units and diagrams where required.</li>
              <li>Calculators, notes and mobile phones are not allowed during the attempt.</li>
              <li>The timer auto-submits the practice paper at 00:00.</li>
            </ul>

            <button
              onClick={() => setTestStarted(true)}
              className="w-full py-3 rounded-btn bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold text-sm shadow-md transition-transform active:scale-95"
            >
              Start Examination Now ⏱️
            </button>
          </div>
        ) : (
          /* RUNNING MOCK TEST */
          <div className="space-y-4">
            {/* Sticky timer bar */}
            <div className="sticky top-14 z-20 flex items-center justify-between p-3 rounded-xl bg-stone-900 text-white shadow-md">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-stone-300">Time Left:</span>
                <span className="text-sm font-mono font-bold text-amber-400">{formatTimer(timeLeft)}</span>
              </div>
              {!submitted && (
                <button
                  onClick={handleSubmit}
                  className="px-3 py-1 rounded-btn bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                >
                  Submit Paper
                </button>
              )}
            </div>

            {/* Questions list */}
            {questions.map((q, idx) => (
              <div
                key={q.id || idx}
                className="bg-white dark:bg-stone-800 rounded-card p-4 border border-stone-200 dark:border-stone-700 shadow-card space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-500 dark:text-stone-400">Q{idx + 1} ({q.marks} {q.marks === 1 ? 'Mark' : 'Marks'})</span>
                  <span className="capitalize font-semibold text-stone-500 dark:text-stone-400">{q.question_type?.replace(/_/g, ' ')}</span>
                </div>
                <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">{q.question}</p>

                {submitted ? (
                  <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs">
                    <p className="font-bold text-emerald-800 dark:text-emerald-300">Board Marking Scheme Answer:</p>
                    <p className="text-stone-800 dark:text-stone-200 mt-0.5 whitespace-pre-line">{q.answer}</p>
                    {q.solution && <p className="mt-1 text-stone-600 dark:text-stone-400">{q.solution}</p>}
                  </div>
                ) : (
                  <textarea
                    rows={2}
                    placeholder="Write your rough answer or key steps here..."
                    value={userAnswers[q.id] || ''}
                    onChange={(e) => setUserAnswers({ ...userAnswers, [q.id]: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs text-stone-800 dark:text-stone-200"
                  />
                )}
              </div>
            ))}
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
