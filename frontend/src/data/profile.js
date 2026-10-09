export const SAFE_PROFILE_FIELDS = [
  'display_name',
  'full_name',
  'class_level',
  'board',
  'preferred_language',
  'state',
  'city',
  'school_name',
  'study_goal',
  'onboarding_completed',
]

export function sanitizeProfileUpdate(values) {
  return Object.fromEntries(SAFE_PROFILE_FIELDS
    .filter((field) => Object.prototype.hasOwnProperty.call(values || {}, field))
    .map((field) => [field, values[field]]))
}
