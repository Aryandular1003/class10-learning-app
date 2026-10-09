import { useState } from 'react'

const BADGE_MAP = {
  very_high_probability: {
    emoji: '🔥',
    label: 'Very High Probability',
    classes: 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-200/60 dark:border-rose-800/50',
  },
  high_probability: {
    emoji: '🔥',
    label: 'High Probability',
    classes: 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/50',
  },
  moderate_probability: {
    emoji: '⚡',
    label: 'Moderate Probability',
    classes: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200/40 dark:border-amber-800/30',
  },
  must_do: {
    emoji: '⭐',
    label: 'Must Do',
    classes: 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700',
  },
  important: {
    emoji: '⭐',
    label: 'Important',
    classes: 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
  },
  practice: {
    emoji: '📚',
    label: 'Practice',
    classes: 'bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800',
  },
  pyq: {
    emoji: '📝',
    label: 'PYQ',
    classes: 'bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800',
  },
  ai_predicted: {
    emoji: '🤖',
    label: 'AI Predicted',
    classes: 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  },
  pro: {
    emoji: '👑',
    label: 'PRO',
    classes: 'bg-amber-500 text-white font-bold border-amber-600 shadow-sm',
  },
}

export default function ContentCard({
  item,
  isLocked = false,
  onUnlock,
  defaultExpanded = false,
}) {
  const [expanded, setExpanded] = useState(defaultExpanded)

  const badges = []
  if (item.is_premium || item.locked) badges.push(BADGE_MAP.pro)
  if (item.is_pyq || item.year) badges.push(BADGE_MAP.pyq)
  if (item.is_predicted || item.prediction_level) {
    const levelKey = (item.prediction_level || '').toLowerCase().replace(/\s+/g, '_')
    if (levelKey.includes('very_high')) badges.push(BADGE_MAP.very_high_probability)
    else if (levelKey.includes('high')) badges.push(BADGE_MAP.high_probability)
    else if (levelKey.includes('moderate')) badges.push(BADGE_MAP.moderate_probability)
    else badges.push(BADGE_MAP.ai_predicted)
  }
  if (item.priority) {
    const pKey = item.priority.toLowerCase().replace(/[\s-]/g, '_')
    if (BADGE_MAP[pKey]) badges.push(BADGE_MAP[pKey])
  }

  const difficultyColors = {
    easy: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/40',
    medium: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/40',
    hard: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/40',
  }
  const diffClass = difficultyColors[(item.difficulty || '').toLowerCase()] || 'text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800'

  return (
    <article className="relative bg-white dark:bg-stone-800/90 rounded-card border border-stone-200/80 dark:border-stone-700/60 p-4 shadow-card hover:shadow-card-md transition-all duration-200 overflow-hidden">
      {/* Top badges bar */}
      <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
        {badges.map((b, idx) => (
          <span
            key={idx}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-chip text-[11px] font-semibold border ${b.classes}`}
          >
            <span>{b.emoji}</span>
            <span>{b.label}</span>
          </span>
        ))}

        {item.marks && (
          <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-chip text-[11px] font-bold bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-600">
            {item.marks} {item.marks === 1 || item.marks === '1' ? 'Mark' : 'Marks'}
          </span>
        )}

        {item.difficulty && (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-chip text-[11px] font-semibold border capitalize ${diffClass}`}>
            {item.difficulty}
          </span>
        )}
      </div>

      {/* Meta context line: Subject / Chapter / Topic / Year */}
      {(item.chapter_name || item.topic || item.year) && (
        <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium mb-1.5 flex flex-wrap items-center gap-1.5">
          {item.chapter_name && <span className="font-semibold text-stone-700 dark:text-stone-300">{item.chapter_name}</span>}
          {item.chapter_name && item.topic && <span>•</span>}
          {item.topic && <span>{item.topic}</span>}
          {item.year && (
            <span className="font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.2 rounded border border-amber-200/60 dark:border-amber-800/40">
              RBSE {item.year}
            </span>
          )}
        </p>
      )}

      {/* Question text */}
      <h3 className="text-sm sm:text-base font-semibold text-stone-900 dark:text-stone-100 leading-snug whitespace-pre-line mb-3">
        {item.question}
      </h3>

      {/* Multiple Choice Options if applicable */}
      {Array.isArray(item.options) && item.options.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
          {item.options.map((opt, i) => (
            <div
              key={i}
              className={`p-2.5 rounded-lg border text-xs sm:text-sm font-medium transition-colors ${
                expanded && (opt.startsWith(item.correct_option) || opt === item.answer)
                  ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                  : 'border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/50 text-stone-700 dark:text-stone-300'
              }`}
            >
              {opt}
            </div>
          ))}
        </div>
      )}

      {/* Prediction Reason box if present */}
      {item.prediction_reason && (
        <div className="mb-3 p-2.5 rounded-lg bg-purple-50/80 dark:bg-purple-950/30 border border-purple-200/70 dark:border-purple-800/40 text-xs text-purple-900 dark:text-purple-200">
          <p className="font-bold flex items-center gap-1 mb-0.5 text-purple-800 dark:text-purple-300">
            <span>💡</span> Why This Question Is Important:
          </p>
          <p className="leading-relaxed">{item.prediction_reason}</p>
        </div>
      )}

      {/* Locked overlay for PRO content */}
      {isLocked ? (
        <div className="relative mt-2 p-4 rounded-xl bg-gradient-to-b from-stone-50/40 to-stone-100/90 dark:from-stone-800/40 dark:to-stone-900/90 border border-stone-200 dark:border-stone-700 text-center backdrop-blur-xs">
          <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950 flex items-center justify-center mx-auto mb-1.5 text-amber-600 dark:text-amber-400 font-bold">
            🔒
          </div>
          <p className="text-xs font-bold text-stone-800 dark:text-stone-200">PRO Board-Style Solution & Steps</p>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 mb-2.5">
            Full step-by-step marking scheme and examiner tips require PRO access.
          </p>
          <button
            onClick={onUnlock}
            className="px-3.5 py-1.5 rounded-btn bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold text-xs shadow-sm transition-transform active:scale-95"
          >
            Unlock with PRO (₹99) →
          </button>
        </div>
      ) : (
        <>
          {/* Solution toggle button */}
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors focus:outline-none"
          >
            <span>{expanded ? '▲ Hide Board Solution' : '▼ View Board-Style Solution'}</span>
          </button>

          {/* Expanded Board-Style Solution & Steps */}
          {expanded && (
            <div className="mt-3 pt-3 border-t border-stone-100 dark:border-stone-700/60 space-y-2.5">
              {item.answer && (
                <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-stone-900/60 border border-amber-200/50 dark:border-amber-900/30">
                  <p className="text-xs font-bold text-amber-800 dark:text-amber-300 mb-1">
                    🎯 Board Answer:
                  </p>
                  <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 whitespace-pre-line leading-relaxed font-medium">
                    {item.answer}
                  </p>
                </div>
              )}

              {/* Step-by-step Solution */}
              {item.solution && (
                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900/40 border border-stone-200/60 dark:border-stone-700/50">
                  <p className="text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    📝 Step-by-Step Solution & Working:
                  </p>
                  <div className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 whitespace-pre-line leading-relaxed">
                    {item.solution}
                  </div>
                </div>
              )}

              {/* Math structured format if present: Given, Formula, Substitution, Final Answer */}
              {item.solution_steps && (
                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900/40 border border-stone-200/60 dark:border-stone-700/50 text-xs sm:text-sm space-y-1.5">
                  {item.solution_steps.given && (
                    <p><strong className="text-stone-900 dark:text-stone-100">Given:</strong> {item.solution_steps.given}</p>
                  )}
                  {item.solution_steps.formula && (
                    <p><strong className="text-stone-900 dark:text-stone-100">Formula:</strong> {item.solution_steps.formula}</p>
                  )}
                  {item.solution_steps.calculation && (
                    <p><strong className="text-stone-900 dark:text-stone-100">Calculation:</strong> {item.solution_steps.calculation}</p>
                  )}
                  {item.solution_steps.final_answer && (
                    <p><strong className="text-stone-900 dark:text-stone-100">Final Answer:</strong> {item.solution_steps.final_answer}</p>
                  )}
                </div>
              )}

              {/* Detailed Explanation / Keywords / Source */}
              {item.explanation && (
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  <span className="font-semibold text-stone-800 dark:text-stone-200">Explanation: </span>
                  {item.explanation}
                </p>
              )}

              {item.source && (
                <p className="text-[11px] text-stone-400 dark:text-stone-500 italic">
                  Source: {item.source}
                </p>
              )}
            </div>
          )}
        </>
      )}
    </article>
  )
}
