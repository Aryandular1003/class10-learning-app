import { useState } from 'react'
import { useTheme } from '../theme/useTheme'
import { useAuth } from '../hooks/useAuth'

const initialForm = {
  full_name: '',
  class_level: '10',
  board: 'RBSE',
  preferred_language: 'English',
  state: 'Rajasthan',
  city: '',
  school_name: '',
  study_goal: 'Improve my board exam score',
  onboarding_completed: true,
}

export default function ProfileSetupScreen({ onComplete }) {
  const { theme, toggleTheme } = useTheme()
  const { profile, saveProfile } = useAuth()
  const [form, setForm] = useState({ ...initialForm, full_name: profile?.full_name || profile?.display_name || '' })
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState(null)

  const update = (field, value) => setForm((previous) => ({ ...previous, [field]: value }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (busy) return
    setBusy(true)
    setMessage(null)
    const result = await saveProfile({ ...form, display_name: form.full_name, class_level: Number(form.class_level) })
    setBusy(false)
    if (result.error) setMessage({ type: 'error', text: result.error.message || 'Could not save your profile.' })
    else if (onComplete) onComplete()
  }

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100 flex items-center justify-center px-4 py-8 transition-colors duration-200">
      <button type="button" onClick={toggleTheme} className="fixed top-4 right-4 min-h-[40px] px-3 rounded-btn border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs font-semibold">{theme === 'dark' ? 'Light mode' : 'Dark mode'}</button>
      <main className="w-full max-w-xl">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-400 mb-1">One last step</p>
          <h1 className="text-h1 font-bold">Tell us about the learner</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-2 leading-relaxed">This helps BoardReady personalize your study experience. You can update these details later.</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white dark:bg-stone-800 rounded-card shadow-card p-5 space-y-4">
          <div>
            <label htmlFor="profile-name" className="block text-sm font-semibold mb-1">Full name</label>
            <input id="profile-name" required value={form.full_name} onChange={(event) => update('full_name', event.target.value)} className="w-full min-h-[44px] rounded-btn border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 px-3 text-sm" autoComplete="name" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="profile-class" className="block text-sm font-semibold mb-1">Class</label>
              <select id="profile-class" value={form.class_level} onChange={(event) => update('class_level', event.target.value)} className="w-full min-h-[44px] rounded-btn border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 px-3 text-sm"><option value="10">Class 10</option></select>
            </div>
            <div>
              <label htmlFor="profile-board" className="block text-sm font-semibold mb-1">Board</label>
              <select id="profile-board" value={form.board} onChange={(event) => update('board', event.target.value)} className="w-full min-h-[44px] rounded-btn border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 px-3 text-sm"><option value="RBSE">RBSE</option></select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="profile-language" className="block text-sm font-semibold mb-1">Preferred language</label>
              <select id="profile-language" value={form.preferred_language} onChange={(event) => update('preferred_language', event.target.value)} className="w-full min-h-[44px] rounded-btn border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 px-3 text-sm"><option>English</option><option>Bilingual (English + Hindi)</option></select>
            </div>
            <div>
              <label htmlFor="profile-state" className="block text-sm font-semibold mb-1">State</label>
              <input id="profile-state" value={form.state} onChange={(event) => update('state', event.target.value)} className="w-full min-h-[44px] rounded-btn border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 px-3 text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="profile-city" className="block text-sm font-semibold mb-1">City <span className="font-normal text-stone-400">(optional)</span></label>
              <input id="profile-city" value={form.city} onChange={(event) => update('city', event.target.value)} className="w-full min-h-[44px] rounded-btn border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 px-3 text-sm" />
            </div>
            <div>
              <label htmlFor="profile-school" className="block text-sm font-semibold mb-1">School <span className="font-normal text-stone-400">(optional)</span></label>
              <input id="profile-school" value={form.school_name} onChange={(event) => update('school_name', event.target.value)} className="w-full min-h-[44px] rounded-btn border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 px-3 text-sm" />
            </div>
          </div>
          <div>
            <label htmlFor="profile-goal" className="block text-sm font-semibold mb-1">Main study goal</label>
            <select id="profile-goal" value={form.study_goal} onChange={(event) => update('study_goal', event.target.value)} className="w-full min-h-[44px] rounded-btn border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 px-3 text-sm"><option>Improve my board exam score</option><option>Build strong subject basics</option><option>Prepare consistently every day</option></select>
          </div>
          {message && <p className="text-xs text-red-600" role="alert">{message.text}</p>}
          <button type="submit" disabled={busy} className="w-full min-h-[44px] rounded-btn bg-teal-700 text-white text-sm font-semibold disabled:opacity-60">{busy ? 'Saving profile…' : 'Continue to BoardReady'}</button>
        </form>
      </main>
    </div>
  )
}
