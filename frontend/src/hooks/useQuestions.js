import { useState, useEffect } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { VERIFIED_QUESTIONS_POOL } from '../data/questionPool'

export function useQuestions(filter = {}) {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const {
    subject_id: subjectId,
    chapter_id: chapterId,
    question_type: questionType,
    difficulty,
    priority,
    is_pyq: isPyq,
    is_predicted: isPredicted,
    marks,
  } = filter

  useEffect(() => {
    let active = true

    async function fetchQuestions() {
      setLoading(true)
      setError(null)

      try {
        if (isSupabaseConfigured && supabase) {
          let query = supabase.from('questions').select('*')

          if (subjectId) query = query.eq('subject_id', subjectId)
          if (chapterId) query = query.eq('chapter_id', chapterId)
          if (questionType && questionType !== 'all') query = query.eq('question_type', questionType)
          if (difficulty && difficulty !== 'all') query = query.eq('difficulty', difficulty)
          if (priority && priority !== 'all') query = query.eq('priority', priority)
          if (isPyq !== undefined) query = query.eq('is_pyq', isPyq)
          if (isPredicted !== undefined) query = query.eq('is_predicted', isPredicted)

          const { data, error: dbError } = await query
          if (!dbError && data && data.length > 0) {
            if (active) {
              setQuestions(data)
              setLoading(false)
            }
            return
          }
        }

        // Local verified dataset fallback
        let filtered = [...VERIFIED_QUESTIONS_POOL]
        if (subjectId) {
          filtered = filtered.filter((q) => q.subject_id === subjectId)
        }
        if (chapterId) {
          filtered = filtered.filter((q) => q.chapter_id === chapterId)
        }
        if (questionType && questionType !== 'all') {
          filtered = filtered.filter((q) => q.question_type === questionType)
        }
        if (difficulty && difficulty !== 'all') {
          filtered = filtered.filter((q) => (q.difficulty || '').toLowerCase() === difficulty.toLowerCase())
        }
        if (priority && priority !== 'all') {
          filtered = filtered.filter((q) => (q.priority || '').toLowerCase() === priority.toLowerCase())
        }
        if (isPyq !== undefined) {
          filtered = filtered.filter((q) => Boolean(q.is_pyq) === Boolean(isPyq))
        }
        if (isPredicted !== undefined) {
          filtered = filtered.filter((q) => Boolean(q.is_predicted) === Boolean(isPredicted))
        }
        if (marks && marks !== 'all') {
          filtered = filtered.filter((q) => String(q.marks) === String(marks))
        }

        if (active) {
          setQuestions(filtered)
          setLoading(false)
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Error fetching questions')
          setLoading(false)
        }
      }
    }

    fetchQuestions()

    return () => {
      active = false
    }
  }, [chapterId, difficulty, isPredicted, isPyq, marks, priority, questionType, subjectId])

  return { questions, loading, error }
}
