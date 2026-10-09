import Card from './Card'

export default function SubjectSwitcher({ subjects, activeSubject, onChange }) {
  return (
    <Card className="p-3 mb-5">
      <div className="flex items-center justify-between gap-3 mb-2">
        <p className="section-label">Study subject</p>
        <span className="text-xs text-stone-400 dark:text-stone-500">Class 10 RBSE</span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Choose subject">
        {subjects.map((subject) => (
          <button
            key={subject.id}
            role="tab"
            aria-selected={activeSubject === subject.id}
            onClick={() => onChange(subject.id)}
            className={`flex-shrink-0 min-h-[44px] px-3 rounded-btn text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-amber-400 ${activeSubject === subject.id
              ? 'bg-amber-500 text-white shadow-sm'
              : 'bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-600'
            }`}
          >
            <span aria-hidden="true" className="mr-1">{subject.emoji}</span>
            {subject.shortLabel}
          </button>
        ))}
      </div>
    </Card>
  )
}
