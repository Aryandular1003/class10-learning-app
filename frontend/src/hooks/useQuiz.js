import { useState, useEffect } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { VERIFIED_QUESTIONS_POOL } from '../data/questionPool'

export function useQuiz(chapterId) {
  const [quizQuestions, setQuizQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true

    async function loadQuiz() {
      setLoading(true)
      setError(null)

      try {
        if (isSupabaseConfigured && supabase) {
          // Check for quizzes associated with chapter
          const { data: quizData } = await supabase
            .from('quizzes')
            .select('id, title, total_marks, duration_minutes')
            .eq('chapter_id', chapterId)
            .maybeSingle()

          if (quizData) {
            const { data: qLinks } = await supabase
              .from('quiz_questions')
              .select('question_id, questions(*)')
              .eq('quiz_id', quizData.id)

            if (qLinks && qLinks.length > 0) {
              const qs = qLinks.map((item) => item.questions).filter(Boolean)
              if (active && qs.length > 0) {
                setQuizQuestions(qs)
                setLoading(false)
                return
              }
            }
          }

          // Alternatively pull mcqs from questions table
          const { data: mcqs } = await supabase
            .from('questions')
            .select('*')
            .eq('chapter_id', chapterId)
            .eq('question_type', 'mcq')

          if (mcqs && mcqs.length > 0) {
            if (active) {
              setQuizQuestions(mcqs)
              setLoading(false)
              return
            }
          }
        }

        // Local pool fallback
        const mcqs = VERIFIED_QUESTIONS_POOL.filter(
          (q) => q.chapter_id === chapterId && q.question_type === 'mcq'
        )

        if (active) {
          setQuizQuestions(mcqs)
          setLoading(false)
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Failed to load quiz')
          setLoading(false)
        }
      }
    }

    if (chapterId) loadQuiz()
    else setLoading(false)

    return () => {
      active = false
    }
  }, [chapterId])

  return { quizQuestions, loading, error }
}
