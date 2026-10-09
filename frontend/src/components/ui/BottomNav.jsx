// BottomNav — shared fixed bottom navigation bar

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Home',     icon: '🏠' },
  { id: 'chapters',  label: 'Chapters', icon: '📚' },
  { id: 'pyqs',      label: 'PYQs',     icon: '📝' },
  { id: 'papers',    label: 'Papers',   icon: '📄' },
  { id: 'practice',  label: 'Practice', icon: '✏️' },
  { id: 'profile',   label: 'Profile',  icon: '👤' },
]

export default function BottomNav({ activeScreen, onNavigate }) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-stone-900 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 shadow-card-md dark:shadow-[0_-8px_28px_rgba(0,0,0,0.28)] pb-[env(safe-area-inset-bottom)] transition-colors duration-200"
      aria-label="Main navigation"
    >
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center">
          {NAV_ITEMS.map((item) => {
            const isActive = activeScreen === item.id
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex-1 min-h-[56px] flex flex-col items-center justify-center gap-0.5
                  transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-amber-400 relative
                  ${isActive
                    ? 'text-amber-600 dark:text-amber-400 font-bold'
                    : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
                  }`}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="text-xl leading-none" aria-hidden="true">{item.icon}</span>
                <span className={`text-[11px] ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400 mt-0.5" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
