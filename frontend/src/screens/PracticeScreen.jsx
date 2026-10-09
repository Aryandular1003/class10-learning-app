import { useState } from 'react'
import { useTheme } from '../theme/useTheme'
import { useStudy } from '../hooks/useStudy'
import { CheckCircleIcon, XMarkIcon } from '../components/ui/icons'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'
import ScreenHeader from '../components/ui/ScreenHeader'
import BottomNav from '../components/ui/BottomNav'

// ─── Quiz Data ─────────────────────────────────────────────────────────────────
const ALL_QUESTIONS = [
  {
    id: 1,
    topic: 'Science',
    difficulty: 'Easy',
    question: 'Which type of mirror is used in vehicles as a rear-view mirror?',
    options: ['Concave mirror', 'Convex mirror', 'Plane mirror', 'Parabolic mirror'],
    correct: 1,
    explanation: 'Convex mirrors are used as rear-view mirrors because they give a wider field of view, allowing the driver to see a larger area behind the vehicle.',
  },
  {
    id: 2,
    topic: 'Science',
    difficulty: 'Easy',
    question: 'The SI unit of electric resistance is:',
    options: ['Ampere', 'Volt', 'Ohm', 'Watt'],
    correct: 2,
    explanation: 'The SI unit of electric resistance is Ohm (Ω), named after German physicist Georg Simon Ohm. 1 Ohm = 1 Volt/Ampere.',
  },
  {
    id: 3,
    topic: 'Mathematics',
    difficulty: 'Easy',
    question: 'If the HCF of two numbers 306 and 657 is 9, what is their LCM?',
    options: ['22338', '22348', '22330', '22438'],
    correct: 0,
    explanation: 'HCF × LCM = Product of two numbers ⇒ 9 × LCM = 306 × 657 ⇒ LCM = (306 × 657)/9 = 34 × 657 = 22,338.',
  },
  {
    id: 4,
    topic: 'Mathematics',
    difficulty: 'Board level',
    question: 'If α and β are the zeros of the quadratic polynomial P(x) = x² - 5x + 6, then α + β is:',
    options: ['-5', '5', '6', '-6'],
    correct: 1,
    explanation: 'For P(x) = ax² + bx + c, sum of zeros α + β = -b/a = -(-5)/1 = 5.',
  },
  {
    id: 5,
    topic: 'English',
    difficulty: 'Easy',
    question: 'In "A Letter to God", where was Lencho\'s house located?',
    options: ['In a crowded city', 'On the crest of a low hill', 'Near a river bank in a desert', 'In a forest valley'],
    correct: 1,
    explanation: 'Lencho\'s house was the only one in the entire valley, situated on the crest of a low hill.',
  },
  {
    id: 6,
    topic: 'English',
    difficulty: 'Board level',
    question: 'Identify the correct passive voice: "Mahatma Gandhi led the Salt March in 1930."',
    options: [
      'The Salt March is led by Mahatma Gandhi in 1930.',
      'The Salt March was led by Mahatma Gandhi in 1930.',
      'The Salt March had been led by Mahatma Gandhi in 1930.',
      'The Salt March was being led by Mahatma Gandhi in 1930.',
    ],
    correct: 1,
    explanation: 'Simple Past Tense active ("led") changes to "was/were + past participle" ("was led") in passive voice.',
  },
  {
    id: 7,
    topic: 'Social Science',
    difficulty: 'Easy',
    question: 'Which civil war torn island nation adopted Majoritarianism in 1956?',
    options: ['Belgium', 'Sri Lanka', 'Nepal', 'India'],
    correct: 1,
    explanation: 'Sri Lanka passed an Act in 1956 establishing Sinhala as the sole official language, fostering majoritarianism.',
  },
  {
    id: 8,
    topic: 'Social Science',
    difficulty: 'Board level',
    question: 'Which incident led Mahatma Gandhi to abruptly withdraw the Non-Cooperation Movement in February 1922?',
    options: ['Jallianwala Bagh Massacre', 'Chauri Chaura Incident', 'Dandi Salt March', 'Passing of Rowlatt Act'],
    correct: 1,
    explanation: 'At Chauri Chaura (Gorakhpur), a peaceful demonstration turned violent when protestors set fire to a police station, killing 22 policemen. Distressed by violence, Gandhi withdrew the movement.',
  },
  {
    id: 9,
    topic: 'Science',
    difficulty: 'Challenge',
    question: 'An object is placed at the centre of curvature (C) of a concave mirror. The image formed will be:',
    options: ['At focus, virtual and erect', 'At C, real and inverted, same size', 'At infinity', 'Between F and C, real and diminished'],
    correct: 1,
    explanation: 'When object is at C (2F), image forms at C (2F) on the same side — real, inverted, and same size as object.',
  },
  {
    id: 10,
    topic: 'Mathematics',
    difficulty: 'Challenge',
    question: 'What is the value of (sin²30° + cos²30°) - (tan²45°)?',
    options: ['1', '0', '2', '-1'],
    correct: 1,
    explanation: 'Using trigonometric identity sin²θ + cos²θ = 1, so (sin²30° + cos²30°) = 1. Since tan 45° = 1, tan²45° = 1. Therefore 1 - 1 = 0.',
  },
]

const TOPICS = ['All Subjects', 'Science', 'Mathematics', 'English', 'Social Science']
const DIFFICULTIES = ['Easy', 'Board level', 'Challenge']

function getQuestions(topic, difficulty) {
  let qs = ALL_QUESTIONS
  if (topic !== 'All Subjects') qs = qs.filter((q) => q.topic === topic)
  if (difficulty !== 'All') qs = qs.filter((q) => q.difficulty === difficulty)
  if (qs.length === 0) qs = ALL_QUESTIONS.slice(0, 5)
  if (qs.length > 10) qs = qs.slice(0, 10)
  return qs
}

// ─── Setup Screen ──────────────────────────────────────────────────────────────
function SetupScreen({ onStart }) {
  const { bestScoreByTopic } = useStudy()
  const [topic, setTopic] = useState('All Subjects')
  const [difficulty, setDifficulty] = useState('Board level')

  const bestPct = bestScoreByTopic[topic]

  return (
    <div className="space-y-5">
      <div className="bg-amber-gradient rounded-card p-5 shadow-amber text-white">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl" aria-hidden="true">✏️</span>
          <div>
            <h2 className="text-xl font-bold leading-tight">Quick Practice</h2>
            <p className="text-amber-100 text-sm">Test your RBSE Class 10 knowledge</p>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-white/20 text-amber-100 text-xs flex items-center justify-between">
          <span>📋 Up to 10 questions</span>
          <span>💡 Instant explanations</span>
          <span>⏰ No time limit</span>
        </div>
      </div>

      {bestPct !== undefined && (
        <Card className="p-3 bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200/50 dark:border-teal-800/40 flex items-center justify-between">
          <span className="text-xs font-semibold text-teal-800 dark:text-teal-200">
            🏆 Personal Best in {topic}:
          </span>
          <Badge variant="teal">{bestPct}% score</Badge>
        </Card>
      )}

      <Card className="p-4">
        <p className="section-label mb-3">Choose Topic</p>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((t) => (
            <button
              key={t}
              onClick={() => setTopic(t)}
              className={`px-4 py-2 rounded-btn text-sm font-semibold min-h-[44px] transition-all focus:outline-none focus:ring-2 focus:ring-amber-400
                ${topic === t
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-600'
                }`}
              aria-pressed={topic === t}
            >
              {t}
            </button>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <p className="section-label mb-3">Difficulty</p>
        <div className="flex flex-wrap gap-2">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`px-4 py-2 rounded-btn text-sm font-semibold min-h-[44px] transition-all focus:outline-none focus:ring-2 focus:ring-amber-400
                ${difficulty === d
                  ? d === 'Easy'
                    ? 'bg-teal-500 text-white shadow-sm'
                    : d === 'Board level'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-violet-600 text-white shadow-sm'
                  : 'bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-600'
                }`}
              aria-pressed={difficulty === d}
            >
              {d === 'Easy' ? '🟢 ' : d === 'Board level' ? '🟡 ' : '🔴 '}{d}
            </button>
          ))}
        </div>
      </Card>

      <button
        onClick={() => onStart(topic, difficulty)}
        className="w-full py-4 rounded-btn bg-amber-500 hover:bg-amber-600 text-white font-bold text-base min-h-[56px] active:scale-95 transition-all shadow-amber focus:outline-none focus:ring-2 focus:ring-amber-400"
      >
        Start Practice &rarr;
      </button>
    </div>
  )
}

// ─── Quiz Screen ──────────────────────────────────────────────────────────────
function QuizScreen({ questions, onFinish }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [answers, setAnswers] = useState([])

  const question = questions[currentIndex]
  const isLast = currentIndex === questions.length - 1
  const isCorrect = selectedAnswer === question.correct

  const handleSelect = (idx) => {
    if (showFeedback) return
    setSelectedAnswer(idx)
    setShowFeedback(true)
  }

  const handleNext = () => {
    const newAnswers = [...answers, { correct: isCorrect }]
    if (isLast) {
      onFinish(newAnswers)
    } else {
      setAnswers(newAnswers)
      setCurrentIndex((i) => i + 1)
      setSelectedAnswer(null)
      setShowFeedback(false)
    }
  }

  // Question 1 of 10 shows 10% progress (instead of 0%)
  const progressPct = Math.round(((currentIndex + 1) / questions.length) * 100)

  return (
    <div className="space-y-5">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-stone-700 dark:text-stone-300">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <Badge variant={question.difficulty === 'Easy' ? 'teal' : question.difficulty === 'Board level' ? 'accent' : 'violet'}>
            {question.difficulty}
          </Badge>
        </div>
        <div className="progress-bar w-full">
          <div
            className="progress-fill bg-amber-gradient"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
          {question.topic} \u2022 {progressPct}% complete
        </p>
      </Card>

      <Card className="p-4">
        <p className="text-base font-semibold text-stone-900 dark:text-stone-100 leading-relaxed">
          {question.question}
        </p>
      </Card>

      <div className="flex flex-col gap-2.5">
        {question.options.map((opt, idx) => {
          let optStyle = 'bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 hover:border-amber-400 dark:hover:border-amber-500'
          if (showFeedback) {
            if (idx === question.correct) {
              optStyle = 'bg-teal-50 dark:bg-teal-950/40 border-2 border-teal-500 text-teal-800 dark:text-teal-200'
            } else if (idx === selectedAnswer && idx !== question.correct) {
              optStyle = 'bg-red-50 dark:bg-red-950/40 border-2 border-red-400 text-red-800 dark:text-red-200'
            } else {
              optStyle = 'bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400'
            }
          } else if (selectedAnswer === idx) {
            optStyle = 'bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-500 text-stone-900 dark:text-stone-100'
          }
          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={showFeedback}
              className={`w-full text-left px-4 py-3 rounded-btn text-sm font-medium min-h-[52px] transition-all focus:outline-none focus:ring-2 focus:ring-amber-400 flex items-center gap-3 ${optStyle} ${!showFeedback ? 'active:scale-[0.99] cursor-pointer' : 'cursor-default'}`}
              aria-pressed={selectedAnswer === idx}
            >
              <span className="w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-xs font-bold border-current">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="flex-1">{opt}</span>
              {showFeedback && idx === question.correct && (
                <CheckCircleIcon className="w-5 h-5 text-teal-600 dark:text-teal-400 flex-shrink-0" />
              )}
              {showFeedback && idx === selectedAnswer && idx !== question.correct && (
                <XMarkIcon className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0" />
              )}
            </button>
          )
        })}
      </div>

      {showFeedback && (
        <Card className={`p-4 border ${isCorrect ? 'border-teal-200 dark:border-teal-800/50 bg-teal-50/50 dark:bg-teal-950/20' : 'border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-950/20'}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg" aria-hidden="true">{isCorrect ? '✅' : '💡'}</span>
            <span className="text-sm font-bold text-stone-900 dark:text-stone-100">
              {isCorrect ? 'Correct! Well done.' : 'Not quite \u2014 here\'s why:'}
            </span>
          </div>
          <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">{question.explanation}</p>
        </Card>
      )}

      {showFeedback && (
        <button
          onClick={handleNext}
          className="w-full py-3.5 rounded-btn bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-bold text-sm min-h-[52px] hover:bg-stone-800 dark:hover:bg-white active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-amber-400 flex items-center justify-center gap-2"
        >
          {isLast ? 'See Results \u2192' : 'Next Question \u2192'}
        </button>
      )}
    </div>
  )
}

// ─── Results Screen ────────────────────────────────────────────────────────────
function ResultsScreen({ answers, onRetry, onBack }) {
  const correct = answers.filter((a) => a.correct).length
  const total = answers.length
  const pct = Math.round((correct / total) * 100)

  let message, emoji, badgeVariant
  if (pct >= 80) {
    message = 'Excellent! You\'re board exam ready! 🎉'
    emoji = '🏆'
    badgeVariant = 'teal'
  } else if (pct >= 60) {
    message = 'Good effort! A little more revision will do the trick.'
    emoji = '💪'
    badgeVariant = 'accent'
  } else {
    message = 'Keep practising \u2014 every attempt makes you stronger!'
    emoji = '📚'
    badgeVariant = 'stone'
  }

  return (
    <div className="space-y-5">
      <div className="bg-amber-gradient rounded-card p-6 shadow-amber text-white text-center">
        <div className="text-5xl mb-3" aria-hidden="true">{emoji}</div>
        <div className="text-5xl font-extrabold mb-1">{pct}%</div>
        <p className="text-amber-100 text-sm font-medium">{message}</p>
      </div>

      <Card className="p-4">
        <p className="section-label mb-4">Your Results</p>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-cream-200 dark:bg-stone-900/80 rounded-btn">
            <p className="text-2xl font-extrabold text-stone-900 dark:text-stone-100">{total}</p>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">Total</p>
          </div>
          <div className="p-3 bg-teal-50 dark:bg-teal-950/40 rounded-btn">
            <p className="text-2xl font-extrabold text-teal-700 dark:text-teal-300">{correct}</p>
            <p className="text-xs text-teal-600 dark:text-teal-400 mt-0.5">Correct</p>
          </div>
          <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-btn">
            <p className="text-2xl font-extrabold text-red-600 dark:text-red-400">{total - correct}</p>
            <p className="text-xs text-red-500 dark:text-red-400 mt-0.5">Incorrect</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="progress-bar">
            <div
              className={`progress-fill ${pct >= 80 ? 'bg-teal-gradient' : 'bg-amber-gradient'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-center text-stone-500 dark:text-stone-400 mt-1.5">{pct}% score</p>
        </div>
      </Card>

      <Badge variant={badgeVariant} className="w-full justify-center py-2">
        {pct >= 80 ? '🌟 Board Exam Ready' : pct >= 60 ? '📈 Making Good Progress' : '🔄 Keep Revising'}
      </Badge>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 rounded-btn border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-semibold text-sm min-h-[52px] hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          &larr; Back to Practice
        </button>
        <button
          onClick={onRetry}
          className="flex-1 py-3 rounded-btn bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm min-h-[52px] active:scale-95 transition-all shadow-amber focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}

// ─── Main Screen ────────────────────────────────────────────────────────────────

export default function PracticeScreen({ onNavigate }) {
  const { theme, toggleTheme } = useTheme()
  const { recordPracticeAttempt } = useStudy()

  const [phase, setPhase] = useState('setup')
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState([])
  const [currentConfig, setCurrentConfig] = useState({ topic: '', difficulty: '' })

  const handleStart = (topic, difficulty) => {
    const qs = getQuestions(topic, difficulty)
    setQuestions(qs)
    setCurrentConfig({ topic, difficulty })
    setPhase('quiz')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleFinish = (ans) => {
    setAnswers(ans)
    const correctCount = ans.filter((a) => a.correct).length
    recordPracticeAttempt({
      topic: currentConfig.topic,
      difficulty: currentConfig.difficulty,
      score: correctCount,
      total: questions.length,
    })
    setPhase('results')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleRetry = () => {
    setPhase('setup')
    setQuestions([])
    setAnswers([])
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100 transition-colors duration-200">
      <ScreenHeader
        title="Practice"
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <main className="max-w-2xl mx-auto px-4 pb-40 pt-6">
        <div className="mb-5">
          <h1 className="text-h2 font-bold text-stone-900 dark:text-stone-100">Practice</h1>
          {phase === 'setup' && (
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
              Build exam confidence one question at a time.
            </p>
          )}
        </div>

        {phase === 'setup' && <SetupScreen onStart={handleStart} />}
        {phase === 'quiz' && (
          <QuizScreen
            questions={questions}
            onFinish={handleFinish}
          />
        )}
        {phase === 'results' && (
          <ResultsScreen
            answers={answers}
            onRetry={handleRetry}
            onBack={handleRetry}
          />
        )}
      </main>

      <BottomNav activeScreen="practice" onNavigate={onNavigate} />
    </div>
  )
}
