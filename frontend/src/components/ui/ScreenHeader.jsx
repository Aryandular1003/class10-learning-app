// ScreenHeader — shared sticky header used across all screens
import { TrophyIcon, SunIcon, MoonIcon, ArrowLeftIcon } from './icons'

export default function ScreenHeader({ title, onBack, theme, toggleTheme, rightSlot }) {
  const isDark = theme === 'dark'

  return (
    <header className="sticky top-0 z-30 bg-cream-100/95 dark:bg-stone-900/95 backdrop-blur-sm border-b border-stone-200/50 dark:border-stone-800/80 transition-colors duration-200">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between relative">
        {onBack ? (
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <button
              onClick={onBack}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-stone-700 dark:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-amber-400"
              aria-label="Go back"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <p className="text-sm font-semibold text-stone-900 dark:text-stone-100 truncate">{title}</p>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-chip bg-amber-gradient flex items-center justify-center shadow-amber">
              <TrophyIcon className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-stone-900 dark:text-stone-100 tracking-tight leading-none">BoardReady</span>
              <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 leading-none mt-0.5">RBSE Class 10</span>
            </div>
          </div>
        )}
        <div className="flex items-center gap-1">
          {rightSlot}
          <button
            onClick={toggleTheme}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-amber-400"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <SunIcon className="w-5 h-5 text-amber-400" /> : <MoonIcon className="w-5 h-5 text-stone-600" />}
          </button>
        </div>
      </div>
    </header>
  )
}
