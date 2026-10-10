import { useState, useEffect } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { VERIFIED_QUESTIONS_POOL } from '../data/questionPool'

export function useMockTest(testId) {
  const [mockTest, setMockTest] = useState(null)
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true

    async function loadTest() {
      setLoading(true)
      setError(null)

      try {
        if (isSupabaseConfigured && supabase) {
          const { data: testData } = await supabase
            .from('mock_tests')
            .select('*')
            .eq('id', testId)
            .maybeSingle()

          if (testData) {
            const { data: qLinks } = await supabase
              .from('mock_test_questions')
              .select('order_index, questions(*)')
              .eq('mock_test_id', testId)
              .order('order_index', { ascending: true })

            const qs = (qLinks || []).map((l) => l.questions).filter(Boolean)
            if (active) {
              setMockTest(testData)
              setQuestions(qs)
              setLoading(false)
              return
            }
          }
        }

        // Fallback mock test from verified question pool
        const qs = VERIFIED_QUESTIONS_POOL.slice(0, 10)
        if (active) {
          setMockTest({
            id: testId || 'mock-rbse-math-1',
            title: 'RBSE Class 10 Board-Level Practice Paper',
            total_marks: 30,
            duration_minutes: 45,
            level: 'Subject Test',
          })
          setQuestions(qs)
          setLoading(false)
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Error loading mock test')
          setLoading(false)
        }
      }
    }

    loadTest()

    return () => {
      active = false
    }
  }, [testId])

  return { mockTest, questions, loading, error }
}
