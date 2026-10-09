import { useState } from 'react'
import { useTheme } from '../theme/useTheme'
import { useStudy } from '../hooks/useStudy'
import { SparklesIcon, ChevronRightIcon, LockClosedIcon, CheckCircleIcon, XMarkIcon } from '../components/ui/icons'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'
import ScreenHeader from '../components/ui/ScreenHeader'
import BottomNav from '../components/ui/BottomNav'

// ─── PYQ Data ─────────────────────────────────────────────────────────────────
const PYQS = [
  {
    id: 1,
    year: 2024,
    subject: 'Science',
    chapter: 'Light — Reflection & Refraction',
    marks: 3,
    locked: false,
    question: 'State the laws of reflection of light. Draw a labelled diagram to show the reflection of a ray of light on a plane mirror.',
    answer: 'Laws of Reflection: (1) The angle of incidence is equal to the angle of reflection (∠i = ∠r). (2) The incident ray, the reflected ray, and the normal at the point of incidence all lie in the same plane. Diagram: Draw a plane mirror as a horizontal line. Show an incident ray hitting the mirror at a point. Draw the normal (perpendicular) at that point. Show the reflected ray making equal angle on the other side of normal.',
  },
  {
    id: 2,
    year: 2023,
    subject: 'Science',
    chapter: 'Electricity',
    marks: 2,
    locked: false,
    question: 'State Ohm\'s Law. Write its mathematical form. An electric lamp of 100 Ω is connected to a 220 V power supply. Calculate the current through it.',
    answer: 'Ohm\'s Law: At constant temperature, the current flowing through a conductor is directly proportional to the potential difference across its ends. Mathematical form: V = IR, where V = voltage (volts), I = current (amperes), R = resistance (ohms). Calculation: I = V/R = 220/100 = 2.2 A.',
  },
  {
    id: 3,
    year: 2024,
    subject: 'Mathematics',
    chapter: 'Real Numbers',
    marks: 3,
    locked: false,
    question: 'Prove that √5 is an irrational number using the method of contradiction.',
    answer: 'Assume √5 is rational. Let √5 = a/b where a, b are co-prime integers and b ≠ 0. Squaring both sides: 5 = a²/b² ⇒ a² = 5b². Thus 5 divides a², so 5 divides a. Let a = 5c. Then (5c)² = 5b² ⇒ 25c² = 5b² ⇒ b² = 5c². Thus 5 divides b², so 5 divides b. Hence 5 is a common factor of a and b, contradicting that a and b are co-prime. Therefore √5 is irrational.',
  },
  {
    id: 4,
    year: 2023,
    subject: 'Mathematics',
    chapter: 'Quadratic Equations',
    marks: 4,
    locked: false,
    question: 'Find the nature of the roots of the quadratic equation 2x² - 4x + 3 = 0. If real roots exist, find them.',
    answer: 'Given equation: 2x² - 4x + 3 = 0 where a = 2, b = -4, c = 3. Discriminant D = b² - 4ac = (-4)² - 4(2)(3) = 16 - 24 = -8. Since D < 0, the equation has no real roots.',
  },
  {
    id: 5,
    year: 2024,
    subject: 'English',
    chapter: 'A Letter to God',
    marks: 3,
    locked: false,
    question: 'Why did Lencho say the raindrops were like "new coins"? What happened to his fields shortly after?',
    answer: 'Lencho compared the raindrops to new coins because the rain was essential for a rich harvest of corn, which would bring him money and prosperity. Shortly after, a devastating hailstorm covered the field with hail like salt, completely destroying his crop.',
  },
  {
    id: 6,
    year: 2023,
    subject: 'Social Science',
    chapter: 'Nationalism in India',
    marks: 5,
    locked: false,
    question: 'Explain the main features of the Civil Disobedience Movement launched by Mahatma Gandhi in 1930.',
    answer: 'Features: (1) Started with Dandi Salt March (12 March – 6 April 1930) breaking salt law. (2) People were asked not only to refuse cooperation with the British but also to break colonial laws. (3) Thousands broke salt laws across India and manufactured salt. (4) Boycott of foreign cloth, picketing of liquor shops, refusal to pay land revenue. (5) Widespread participation of women.',
  },
  {
    id: 7,
    year: 2024,
    subject: 'Social Science',
    chapter: 'Power Sharing',
    marks: 3,
    locked: false,
    question: 'Differentiate between Horizontal and Vertical distribution of power sharing with examples.',
    answer: 'Horizontal Power Sharing: Power is shared among different organs of government at the same level (Legislature, Executive, Judiciary). Example: Indian Constitution system of checks and balances. Vertical Power Sharing: Power is shared among governments at different levels (Union/Central government, State government, Local government). Example: Federalism in India.',
  },
  {
    id: 8,
    year: 2025,
    subject: 'Science',
    chapter: 'Electricity',
    marks: 5,
    locked: true,
    question: 'Three resistors of 2Ω, 3Ω, and 6Ω are connected: (a) in series, (b) in parallel. Calculate equivalent resistance in each case. Which arrangement draws more current from a 12V battery?',
    answer: '(a) Series: R_eq = 2+3+6 = 11Ω. Current I = 12/11 ≈ 1.09 A. (b) Parallel: 1/R_eq = 1/2+1/3+1/6 = 6/6 = 1 ⇒ R_eq = 1Ω. Current I = 12/1 = 12 A. Parallel arrangement draws more current (12 A vs 1.09 A).',
  },
]

const PREDICTED_QUESTIONS = [
  {
    id: 'pred-1',
    probability: '🔥 High Probability',
    subject: 'Science',
    chapter: 'Light — Reflection & Refraction',
    marks: 4,
    locked: false,
    question: 'A convex lens forms a real and inverted image of a needle at a distance of 50 cm from it. Where is the needle placed in front of the convex lens if the image is equal to the size of the object? Also, find the power of the lens.',
    predictionReason: 'Repeated in 2018, 2021, and 2024 sample papers. Frequently tested 4-mark numerical concept.',
    answer: '1. Position of Object: Since image is real, inverted, and equal to size of object, the object is at 2F₁ and image is at 2F₂. Given v = +50 cm ⇒ 2f = 50 cm ⇒ f = +25 cm = +0.25 m. Object distance u = -50 cm. 2. Power of Lens P = 1 / f(in m) = 1 / (+0.25) = +4.0 Dioptres (D).',
  },
  {
    id: 'pred-2',
    probability: '⚡ Must Prepare',
    subject: 'Science',
    chapter: 'Electricity',
    marks: 3,
    locked: false,
    question: 'Derive Joule\'s Law of Heating mathematically. Mention two practical applications of heating effect of electric current.',
    predictionReason: 'High weightage chapter theoretical question expected in 2026 board exam.',
    answer: 'Mathematical Derivation: Work done W = V × Q. Since Q = I × t, W = V × I × t. By Ohm\'s Law V = I × R, substituting V yields W = (I × R) × I × t = I² × R × t. Assuming all work converts to heat energy H = I² R t. Applications: Electric iron, electric heater, fuse wire, incandescent electric lamp.',
  },
  {
    id: 'pred-3',
    probability: '🔥 High Probability',
    subject: 'Mathematics',
    chapter: 'Triangles',
    marks: 5,
    locked: false,
    question: 'State and prove Basic Proportionality Theorem (Thales Theorem).',
    predictionReason: 'Standard 5-mark proof question that appears every 2 years in RBSE Class 10 Board exams.',
    answer: 'Statement: If a line is drawn parallel to one side of a triangle to intersect the other two sides in distinct points, the other two sides are divided in the same ratio. Proof: Given △ABC where DE ∥ BC. Area(△ADE)/Area(△BDE) = AD/DB and Area(△ADE)/Area(△DEC) = AE/EC. Since △BDE and △DEC lie on same base DE between same parallels DE and BC, Area(△BDE) = Area(△DEC). Hence AD/DB = AE/EC. (Q.E.D.)',
  },
  {
    id: 'pred-4',
    probability: '⚡ Must Prepare',
    subject: 'Social Science',
    chapter: 'The Rise of Nationalism in Europe',
    marks: 4,
    locked: false,
    question: 'Describe the process of German Unification. What role did Otto von Bismarck play in it?',
    predictionReason: 'Core 4-mark history essay question for section D of the RBSE paper.',
    answer: 'German Unification Process: (1) Nationalist feelings were widespread among middle-class Germans who tried to unite Germany in 1848 Frankfurt Parliament. (2) Prussia took leadership under Chief Minister Otto von Bismarck. (3) Bismarck carried out unification through "Blood and Iron" policy with Prussian army and bureaucracy. (4) Three wars over 7 years against Denmark, Austria, and France ended in Prussian victory. (5) In January 1871, Kaiser William I was proclaimed German Emperor at Hall of Mirrors in Versailles.',
  },
]

const CHAPTERS = [
  'All chapters',
  'Light — Reflection & Refraction',
  'Electricity',
  'Chemical Reactions & Equations',
  'Real Numbers',
  'Quadratic Equations',
  'Triangles',
  'A Letter to God',
  'Nationalism in India',
  'The Rise of Nationalism in Europe',
  'Power Sharing',
]
const YEARS = ['All years', '2025', '2024', '2023', '2022']

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="section-label">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm font-medium bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-btn px-3 py-2 min-h-[44px] text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  )
}

function QuestionCard({ pyq, onLockedClick, onReveal }) {
  const [expanded, setExpanded] = useState(false)

  if (pyq.locked) {
    return (
      <Card className="p-4 border border-violet-200/60 dark:border-violet-700/50 bg-gradient-to-br from-violet-50/60 via-white to-white dark:from-violet-950/30 dark:via-stone-800 dark:to-stone-800">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="violet">🔒 Premium</Badge>
            {pyq.year && <Badge variant="stone">{pyq.year}</Badge>}
            {pyq.probability && <Badge variant="accent">{pyq.probability}</Badge>}
            <Badge variant="accent">{pyq.marks} marks</Badge>
          </div>
        </div>
        <p className="text-sm font-medium text-stone-500 dark:text-stone-400 leading-relaxed line-clamp-2 italic">
          {pyq.question}
        </p>
        <button
          onClick={() => onLockedClick(pyq)}
          className="mt-3 w-full py-2.5 rounded-btn text-sm font-semibold
            bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300
            border border-violet-200/60 dark:border-violet-700/50
            hover:bg-violet-200 dark:hover:bg-violet-900/60 min-h-[44px]
            transition-colors flex items-center justify-center gap-2
            focus:outline-none focus:ring-2 focus:ring-violet-400"
        >
          <LockClosedIcon className="w-4 h-4" />
          Unlock to see question & answer
        </button>
      </Card>
    )
  }

  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {pyq.year && <Badge variant="stone">{pyq.year}</Badge>}
        {pyq.probability && <Badge variant="accent">{pyq.probability}</Badge>}
        <Badge variant="accent">{pyq.marks} marks</Badge>
        <Badge variant="teal">{pyq.subject || pyq.chapter.split('—')[0].trim()}</Badge>
      </div>
      <p className="text-sm font-medium text-stone-900 dark:text-stone-100 leading-relaxed mb-2">
        {pyq.question}
      </p>
      {pyq.predictionReason && (
        <div className="p-2.5 bg-amber-50/60 dark:bg-amber-950/30 rounded-btn border border-amber-200/40 dark:border-amber-800/30 my-2 text-xs text-amber-900 dark:text-amber-200">
          💡 <strong>Prediction Rationale:</strong> {pyq.predictionReason}
        </div>
      )}
      <button
        onClick={() => {
          setExpanded((v) => !v)
          if (!expanded && onReveal) onReveal(pyq)
        }}
        className="w-full py-2.5 rounded-btn text-sm font-semibold
          bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300
          border border-amber-200/50 dark:border-amber-800/40
          hover:bg-amber-100 dark:hover:bg-amber-900/60 min-h-[44px]
          transition-colors flex items-center justify-center gap-2
          focus:outline-none focus:ring-2 focus:ring-amber-400"
        aria-expanded={expanded}
      >
        <ChevronRightIcon
          className={`w-4 h-4 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
        />
        {expanded ? 'Hide answer' : 'Show answer'}
      </button>
      {expanded && (
        <div className="mt-3 p-3 bg-teal-50/70 dark:bg-teal-950/30 rounded-btn border border-teal-200/50 dark:border-teal-800/40">
          <div className="flex items-center gap-1.5 mb-2">
            <CheckCircleIcon className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
            <span className="text-xs font-bold text-teal-700 dark:text-teal-300 uppercase tracking-wide">Model Answer</span>
          </div>
          <p className="text-sm text-stone-800 dark:text-stone-200 leading-relaxed">{pyq.answer}</p>
        </div>
      )}
    </Card>
  )
}

// ─── Main Screen ────────────────────────────────────────────────────────────────

export default function PYQsScreen({ onNavigate, initialChapterFilter }) {
  const { theme, toggleTheme } = useTheme()
  const { recordStudyActivity } = useStudy()
  const [activeTab, setActiveTab] = useState('pyq') // 'pyq' | 'predicted'
  const [chapterFilter, setChapterFilter] = useState(
    initialChapterFilter && CHAPTERS.includes(initialChapterFilter) ? initialChapterFilter : 'All chapters'
  )
  const [yearFilter, setYearFilter] = useState('All years')
  const [lockedModal, setLockedModal] = useState(null)

  const activeDataset = activeTab === 'pyq' ? PYQS : PREDICTED_QUESTIONS

  const filtered = activeDataset.filter((q) => {
    const chapterMatch = chapterFilter === 'All chapters' || q.chapter === chapterFilter
    const yearMatch = activeTab === 'predicted' || yearFilter === 'All years' || String(q.year) === yearFilter
    return chapterMatch && yearMatch
  })

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100 transition-colors duration-200">
      <ScreenHeader
        title={activeTab === 'pyq' ? 'Previous Year Questions' : 'Predicted Board Questions'}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <main className="max-w-2xl mx-auto px-4 pb-40 pt-6">
        {/* Mode Tab Switcher */}
        <div className="flex bg-stone-200/80 dark:bg-stone-800 p-1 rounded-card mb-5">
          <button
            onClick={() => setActiveTab('pyq')}
            className={`flex-1 py-2.5 rounded-btn text-xs sm:text-sm font-bold transition-all min-h-[44px] flex items-center justify-center gap-1.5 ${
              activeTab === 'pyq'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            <span>📝 Past Year Papers</span>
          </button>
          <button
            onClick={() => setActiveTab('predicted')}
            className={`flex-1 py-2.5 rounded-btn text-xs sm:text-sm font-bold transition-all min-h-[44px] flex items-center justify-center gap-1.5 ${
              activeTab === 'predicted'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            <span>✨ 2026 Predicted</span>
          </button>
        </div>

        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl" aria-hidden="true">{activeTab === 'pyq' ? '📝' : '✨'}</span>
            <h1 className="text-h2 font-bold text-stone-900 dark:text-stone-100">
              {activeTab === 'pyq' ? 'Previous Year Questions' : '2026 Predicted Board Questions'}
            </h1>
          </div>
          <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
            {activeTab === 'pyq'
              ? 'RBSE Class 10 board-style questions from 2022–2025. Practice with real exam questions and model answers.'
              : 'AI-curated high-probability questions predicted for the 2026 RBSE Class 10 board exams based on past repetition patterns.'}
          </p>
          <div className="mt-2 flex gap-2">
            <Badge variant="teal">RBSE Class 10</Badge>
            {activeTab === 'predicted' && <Badge variant="accent">🔥 High Probability</Badge>}
          </div>
        </div>

        <Card className="p-4 mb-5">
          <p className="section-label mb-3">Filter Questions</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FilterSelect
              label="Chapter"
              value={chapterFilter}
              onChange={setChapterFilter}
              options={CHAPTERS}
            />
            {activeTab === 'pyq' ? (
              <FilterSelect
                label="Year"
                value={yearFilter}
                onChange={setYearFilter}
                options={YEARS}
              />
            ) : (
              <div className="flex flex-col gap-1 justify-end">
                <span className="section-label">Prediction Level</span>
                <div className="px-3 py-2 bg-amber-50 dark:bg-amber-950/40 rounded-btn border border-amber-200/50 dark:border-amber-800/40 text-xs font-semibold text-amber-800 dark:text-amber-300 min-h-[44px] flex items-center">
                  ✨ High Weightage Board Topics
                </div>
              </div>
            )}
          </div>
        </Card>

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-stone-700 dark:text-stone-300">
            {filtered.length} question{filtered.length !== 1 ? 's' : ''} found
          </p>
          {(chapterFilter !== 'All chapters' || yearFilter !== 'All years') && (
            <button
              onClick={() => { setChapterFilter('All chapters'); setYearFilter('All years') }}
              className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline min-h-[44px] px-2 flex items-center focus:outline-none focus:ring-2 focus:ring-amber-400 rounded"
            >
              Clear filters
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4" aria-hidden="true">🔍</div>
            <p className="text-base font-semibold text-stone-700 dark:text-stone-300 mb-2">No questions found</p>
            <p className="text-sm text-stone-500 dark:text-stone-400 mb-5">
              Try changing the chapter or year filter to find questions.
            </p>
            <button
              onClick={() => { setChapterFilter('All chapters'); setYearFilter('All years') }}
              className="px-5 py-2.5 rounded-btn bg-amber-500 text-white font-semibold text-sm min-h-[44px] hover:bg-amber-600 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              Show all questions
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((pyq) => (
              <QuestionCard
                key={pyq.id}
                pyq={pyq}
                onLockedClick={(q) => setLockedModal(q)}
                onReveal={(q) => recordStudyActivity({ type: 'pyq', title: `Viewed ${q.year} PYQ answer` })}
              />
            ))}
          </div>
        )}
      </main>

      <BottomNav activeScreen="pyqs" onNavigate={onNavigate} />

      {lockedModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-800 rounded-card shadow-card-md w-full max-w-md p-5 animate-in fade-in zoom-in-95 border-t-4 border-violet-600 dark:border-violet-500 dark:border-x dark:border-b dark:border-stone-700/80">
            <div className="flex items-start justify-between border-b border-stone-100 dark:border-stone-700/60 pb-3 mb-4">
              <div>
                <Badge variant="violet">Premium Question</Badge>
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 mt-1">
                  Unlock {lockedModal.year} — {lockedModal.marks}-mark Question
                </h3>
              </div>
              <button
                onClick={() => setLockedModal(null)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400"
                aria-label="Close"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed mb-4">
              This question-bank area is reserved for future reviewed content. No payment or unlocking is available in this preview build.
            </p>
            <div className="space-y-2 mb-4">
              {['Full model answers after content review is complete', 'Board-focused practice after the question bank is added', 'Coverage across all subjects in a future release'].map((item) => (
                <div key={item} className="flex items-center gap-2.5 p-2.5 bg-violet-50/60 dark:bg-violet-950/40 rounded-btn border border-violet-100/50 dark:border-violet-800/40">
                  <CheckCircleIcon className="w-4 h-4 text-violet-600 dark:text-violet-400 flex-shrink-0" />
                  <span className="text-xs text-stone-800 dark:text-stone-200">{item}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setLockedModal(null)}
                className="flex-1 py-3 rounded-btn border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-semibold text-sm min-h-[44px] hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                Maybe later
              </button>
              <button
                onClick={() => setLockedModal(null)}
                className="flex-1 py-3 rounded-btn bg-violet-600 dark:bg-violet-700 text-white font-semibold text-sm min-h-[44px] hover:bg-violet-700 dark:hover:bg-violet-600 active:scale-95 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              >
                <SparklesIcon className="w-4 h-4 inline mr-1.5" />
                Coming later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
