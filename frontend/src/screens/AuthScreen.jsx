import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useTheme } from '../theme/useTheme'
import { useAuth } from '../hooks/useAuth'

export default function AuthScreen() {
  const { theme, toggleTheme } = useTheme()
  const { signIn, signUp, authNotice, clearAuthNotice } = useAuth()
  const location = useLocation()
  const [mode, setMode] = useState('sign-in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [busy, setBusy] = useState(false)

  const activeNotice = location.state?.notice || authNotice

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (busy) return
    setBusy(true)
    setMessage(null)
    clearAuthNotice?.()
    const action = mode === 'sign-in' ? signIn : signUp
    const result = await action(email.trim(), password)
    setBusy(false)
    if (result?.error) {
      const isRateLimited = result.error.code === 'over_email_send_rate_limit'
        || result.error.status === 429
        || result.error.message?.toLowerCase().includes('rate limit')
      setMessage(isRateLimited
        ? { type: 'warning', text: 'Supabase has temporarily paused verification emails for this project. Wait for the limit to reset, then try again once. Do not repeatedly press the signup button.' }
        : { type: 'error', text: result.error.message })
      return
    }
    if (mode === 'sign-up') {
      setMode('sign-in')
      setMessage({ type: 'success', text: 'Account created. Verify your email, then use the Sign in button below.' })
    }
  }

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100 flex items-center justify-center px-4 transition-colors duration-200">
      <button type="button" onClick={toggleTheme} className="fixed top-4 right-4 min-h-[40px] px-3 rounded-btn border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs font-semibold">
        {theme === 'dark' ? 'Light mode' : 'Dark mode'}
      </button>
      <main className="w-full max-w-md">
        <div className="text-center mb-7">
          <div className="text-4xl mb-3">🧪</div>
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-400">RBSE Class 10</p>
          <h1 className="text-h1 font-bold mt-1">Welcome to BoardReady</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-2">Your study progress and approved content will sync securely.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-stone-800 rounded-card shadow-card p-5 space-y-4">
          <div>
            <label htmlFor="auth-email" className="block text-sm font-semibold mb-1">Email</label>
            <input id="auth-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="w-full min-h-[44px] rounded-btn border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 px-3 text-sm" autoComplete="email" />
          </div>
          <div>
            <label htmlFor="auth-password" className="block text-sm font-semibold mb-1">Password</label>
            <input id="auth-password" type="password" required minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} className="w-full min-h-[44px] rounded-btn border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 px-3 text-sm" autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'} />
          </div>
          {activeNotice && !message && (
            <div className="rounded-btn border p-3 border-amber-200 bg-amber-50 dark:border-amber-900/60 dark:bg-amber-950/30" role="alert">
              <div className="flex items-start gap-2.5">
                <span className="text-lg" aria-hidden="true">🔒</span>
                <div>
                  <p className="text-sm font-bold text-amber-800 dark:text-amber-300">Session expired or signed out</p>
                  <p className="text-xs leading-relaxed mt-1 text-amber-700 dark:text-amber-400">{activeNotice}</p>
                </div>
              </div>
            </div>
          )}
          {message && (
            <div className={`rounded-btn border p-3 ${message.type === 'error' ? 'border-red-200 bg-red-50 dark:border-red-900/60 dark:bg-red-950/30' : message.type === 'warning' ? 'border-amber-200 bg-amber-50 dark:border-amber-900/60 dark:bg-amber-950/30' : 'border-teal-200 bg-teal-50 dark:border-teal-900/60 dark:bg-teal-950/30'}`} role="alert">
              <div className="flex items-start gap-2.5">
                <span className="text-lg" aria-hidden="true">{message.type === 'error' ? '⚠️' : message.type === 'warning' ? '⏳' : '✉️'}</span>
                <div>
                  <p className={`text-sm font-bold ${message.type === 'error' ? 'text-red-800 dark:text-red-300' : message.type === 'warning' ? 'text-amber-800 dark:text-amber-300' : 'text-teal-800 dark:text-teal-300'}`}>
                    {message.type === 'error' ? 'Something needs attention' : message.type === 'warning' ? 'Please wait a little' : 'Check your email'}
                  </p>
                  <p className={`text-xs leading-relaxed mt-1 ${message.type === 'error' ? 'text-red-700 dark:text-red-400' : message.type === 'warning' ? 'text-amber-700 dark:text-amber-400' : 'text-teal-700 dark:text-teal-400'}`}>{message.text}</p>
                  {message.type === 'success' && <p className="text-xs font-semibold text-teal-800 dark:text-teal-300 mt-2">After verification, press “Sign in” below with the same email and password.</p>}
                </div>
              </div>
            </div>
          )}
          <button type="submit" disabled={busy} className="w-full min-h-[44px] rounded-btn bg-teal-700 text-white text-sm font-semibold disabled:opacity-60">
            {busy ? 'Please wait…' : mode === 'sign-in' ? 'Sign in' : 'Create account'}
          </button>
          <button type="button" onClick={() => { setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in'); setMessage(null); clearAuthNotice?.() }} className="w-full text-xs font-semibold text-teal-700 dark:text-teal-400">
            {mode === 'sign-in' ? 'New here? Create an account' : 'Already have an account? Sign in'}
          </button>
        </form>
      </main>
    </div>
  )
}
