// Badge — versatile chip/label component
// Variants: accent, teal, violet, success, warning, stone, fire, star, pyq, pro, predicted

const variantClasses = {
  accent:    'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/40',
  teal:      'bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border border-teal-200/50 dark:border-teal-800/40',
  violet:    'bg-violet-100 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300 border border-violet-200/50 dark:border-violet-800/40',
  success:   'bg-green-100 dark:bg-green-950/80 text-green-700 dark:text-green-300',
  warning:   'bg-orange-100 dark:bg-orange-950/80 text-orange-700 dark:text-orange-300',
  stone:     'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300',
  fire:      'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/50',
  star:      'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700',
  pyq:       'bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800',
  predicted: 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800',
  pro:       'bg-amber-500 text-stone-900 font-bold border border-amber-600 shadow-xs',
}

export default function Badge({ children, variant = 'stone', className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-chip
        text-xs font-semibold ${variantClasses[variant] ?? variantClasses.stone} ${className}`}
    >
      {children}
    </span>
  )
}
