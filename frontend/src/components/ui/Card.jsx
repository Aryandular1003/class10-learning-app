// Card — base surface component
// Variants: default (white), amber (accent), teal, violet (locked/premium)

const variantClasses = {
  default: 'bg-white dark:bg-stone-800/90 dark:border dark:border-stone-700/60 shadow-card',
  amber:   'bg-amber-gradient text-white shadow-amber',
  teal:    'bg-teal-gradient text-white shadow-teal',
  violet:  'bg-violet-gradient text-white',
  muted:   'bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-700/50',
}

export default function Card({
  children,
  variant = 'default',
  className = '',
  onClick,
  role,
  'aria-label': ariaLabel,
}) {
  const interactive = !!onClick
  return (
    <div
      className={`rounded-card ${variantClasses[variant] ?? variantClasses.default}
        ${interactive ? 'cursor-pointer active:scale-[0.98] transition-transform duration-150' : ''}
        ${className}`}
      onClick={onClick}
      role={role}
      aria-label={ariaLabel}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={interactive ? (e) => e.key === 'Enter' && onClick(e) : undefined}
    >
      {children}
    </div>
  )
}
