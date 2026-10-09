import { addDays, toDateKey } from './appData'

export function getCurrentStreak(dates, todayKey = toDateKey()) {
  const set = new Set(dates || [])
  let cursor = todayKey
  let streak = 0
  while (set.has(cursor)) {
    streak += 1
    cursor = addDays(cursor, -1)
  }
  return streak
}

export function getLongestStreak(dates) {
  const sorted = [...new Set(dates || [])].sort()
  let longest = 0
  let current = 0
  sorted.forEach((date, index) => {
    current = index > 0 && date === addDays(sorted[index - 1], 1) ? current + 1 : 1
    longest = Math.max(longest, current)
  })
  return longest
}
