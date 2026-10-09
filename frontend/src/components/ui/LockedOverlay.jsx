// LockedOverlay — premium content treatment
// Shows a soft blur + lock icon over content that requires paid tier.
// Philosophy: inviting, not punishing. Teases the content, doesn't block harshly.

import { LockClosedIcon } from './icons'

export default function LockedOverlay({ label = 'Unlock full notes', onUnlock }) {
  return (
    <div className="relative">
      {/* Blurred preview area — shows a hint of content */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-card overflow-hidden">
        {/* Soft gradient veil — not a harsh blackout */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/70 to-white/90 backdrop-blur-[2px]" />

        {/* Lock indicator */}
        <div className="relative z-20 flex flex-col items-center gap-2 px-4 text-center">
          <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
            <LockClosedIcon className="w-5 h-5 text-violet-600" />
          </div>
          <p className="text-sm font-semibold text-violet-700">{label}</p>
          <button
            onClick={onUnlock}
            className="mt-1 px-4 py-2 rounded-btn bg-violet-600 text-white text-sm font-semibold
              min-h-[44px] active:scale-95 transition-transform duration-150 shadow-sm
              hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-1"
          >
            See plans →
          </button>
        </div>
      </div>
    </div>
  )
}
