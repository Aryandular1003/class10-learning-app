import { createContext, useEffect, useMemo, useRef, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { sanitizeProfileUpdate } from '../data/profile'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [profile, setProfile] = useState(null)
  const [profileLoading, setProfileLoading] = useState(isSupabaseConfigured)
  const [profileError, setProfileError] = useState(null)
  const [profileRetry, setProfileRetry] = useState(0)
  const [authNotice, setAuthNotice] = useState(null)
  const isExplicitSignOutRef = useRef(false)
  const hadSessionRef = useRef(false)

  useEffect(() => {
    if (!supabase) {
      return undefined
    }

    let active = true
    const loadSession = async () => {
      // getClaims validates the locally persisted JWT against Supabase's JWKS
      // before the app treats a restored session as authenticated.
      try {
        const [{ data: sessionData }, { data: claimsData, error: claimsError }] = await Promise.all([
          supabase.auth.getSession(),
          supabase.auth.getClaims(),
        ])
        if (!active) return
        const validSession = claimsError || !claimsData?.claims ? null : sessionData?.session
        setSession(validSession)
        if (validSession) {
          hadSessionRef.current = true
        } else if (sessionData?.session && (claimsError || !claimsData?.claims)) {
          setAuthNotice('Your session has expired or was revoked. Please sign in again.')
        }
      } catch {
        if (active) {
          setSession(null)
          setAuthNotice('Session verification failed. Please sign in again.')
        }
      } finally {
        if (active) setLoading(false)
      }
    }
    loadSession()
    const { data: listener } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (event === 'SIGNED_OUT') {
        if (hadSessionRef.current && !isExplicitSignOutRef.current) {
          setAuthNotice('Your session has expired or was signed out from another device. Please sign in again.')
        }
        hadSessionRef.current = false
        isExplicitSignOutRef.current = false
        setSession(null)
        setProfile(null)
        setProfileError(null)
        setProfileLoading(false)
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
        if (nextSession) {
          hadSessionRef.current = true
          setSession(nextSession)
        }
      } else {
        setSession(nextSession)
      }
      setLoading(false)
    })
    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!supabase || !session?.user) {
      return undefined
    }
    let active = true
    setProfileLoading(true)
    setProfileError(null)
    const loadProfile = async () => {
      let lastError = null
      for (let attempt = 0; attempt < 3 && active; attempt += 1) {
        const { data, error } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle()
        if (!error) {
          if (active) {
            setProfile(data || null)
            setProfileLoading(false)
          }
          return
        }
        lastError = error
        if (attempt < 2) await new Promise((resolve) => window.setTimeout(resolve, 500 * (attempt + 1)))
      }
      if (active) {
        setProfileError(lastError || new Error('We could not load your profile.'))
        setProfileLoading(false)
      }
    }
    loadProfile()
    return () => { active = false }
  }, [session, profileRetry])

  const value = useMemo(() => ({
    session,
    user: session?.user || null,
    loading,
    profile,
    profileLoading,
    profileError,
    authNotice,
    clearAuthNotice: () => setAuthNotice(null),
    retryProfile: () => setProfileRetry((value) => value + 1),
    refreshProfile: async () => {
      if (!supabase || !session?.user) return null
      const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle()
      if (data) setProfile(data)
      return data
    },
    isSupabaseConfigured,
    signIn: async (email, password) => {
      if (!supabase) return { error: new Error('Authentication is not available.') }
      setAuthNotice(null)
      const result = await supabase.auth.signInWithPassword({ email, password })
      if (!result.error) {
        // Keep the newly authenticated device and revoke older refresh-token sessions.
        // Supabase's dashboard single-session setting remains the authoritative guard.
        await supabase.auth.signOut({ scope: 'others' })
      }
      return result
    },
    signUp: (email, password) => {
      setAuthNotice(null)
      return supabase?.auth.signUp({ email, password })
    },
    signOut: async () => {
      isExplicitSignOutRef.current = true
      hadSessionRef.current = false
      setAuthNotice(null)
      setProfile(null)
      setProfileError(null)
      setProfileLoading(false)
      if (!supabase) {
        setSession(null)
        return { error: null }
      }
      const result = await supabase.auth.signOut()
      setSession(null)
      return result
    },
    saveProfile: async (values) => {
      if (!supabase || !session?.user) return { error: new Error('Authentication is not available.') }
      const { data, error } = await supabase.from('profiles').update(sanitizeProfileUpdate(values)).eq('id', session.user.id).select().single()
      if (!error) setProfile(data)
      return { data, error }
    },
  }), [authNotice, loading, profile, profileError, profileLoading, session])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
