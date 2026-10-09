// Design System — Color Tokens
// Single source of truth for all colors used across the app.
// Import these in components to ensure consistency.

export const colors = {
  // Primary Accent — Warm Amber
  accent:         '#F59E0B',
  accentDark:     '#B45309',
  accentLight:    '#FEF3C7',

  // Secondary — Teal (progress, streaks, correct answers)
  teal:           '#0D9488',
  tealLight:      '#CCFBF1',

  // Locked/Paid — Soft Violet (premium feel, not aggressive)
  locked:         '#7C3AED',
  lockedLight:    '#EDE9FE',

  // Backgrounds
  bgBase:         '#FFFBF5',  // warm off-white page background
  surface:        '#FFFFFF',  // card surfaces

  // Text
  textPrimary:    '#1C1917',  // warm near-black
  textSecondary:  '#78716C',  // warm grey
  textMuted:      '#A8A29E',  // captions, placeholders

  // Semantic
  success:        '#16A34A',
  successLight:   '#DCFCE7',
  warning:        '#EA580C',
  warningLight:   '#FEF3C7',
  danger:         '#DC2626',

  // Neutrals (warm grey stone scale)
  stone100:       '#F5F5F4',
  stone200:       '#E7E5E4',
  stone300:       '#D6D3D1',
  stone400:       '#A8A29E',
  stone500:       '#78716C',
  stone600:       '#57534E',
  stone700:       '#44403C',
  stone900:       '#1C1917',
}

// Typography scale for reference
export const typography = {
  h1: { size: '28px', weight: 700, lineHeight: 1.25 },
  h2: { size: '22px', weight: 600, lineHeight: 1.30 },
  h3: { size: '18px', weight: 600, lineHeight: 1.40 },
  body: { size: '16px', weight: 400, lineHeight: 1.60 },
  sm:  { size: '14px', weight: 400, lineHeight: 1.50 },
  xs:  { size: '12px', weight: 400, lineHeight: 1.40 },
}

// Spacing & shape tokens
export const shape = {
  radiusCard:   '16px',
  radiusBtn:    '12px',
  radiusPill:   '9999px',
  radiusChip:   '8px',
  minTouchSize: '44px',
}

export default { colors, typography, shape }
