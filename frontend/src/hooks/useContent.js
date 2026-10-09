import { useState, useEffect } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { RBSE_MATH_CH1_CONTENT } from '../data/rbseVerifiedData'
import { CHAPTER_NOTES } from '../data/chapterNotesData'

function toRevisionContent(notes) {
  if (!notes) return null

  const sections = notes.sections || []
  return {
    quick_revision: sections.map((section) => `${section.heading}: ${section.content.replace(/\*\*/g, '')}`),
    one_hour_revision: sections.slice(0, 4).map((section, index) => `${index + 1}. Revise ${section.heading.replace(/^\d+\.\s*/, '')} and write one board-style answer.`),
    formulas: sections
      .filter((section) => section.formulaBox)
      .map((section) => ({
        formula_name: section.formulaBox.title,
        expression: section.formulaBox.formula,
        description: section.formulaBox.subtext,
      })),
    common_mistakes: sections
      .filter((section) => section.heading.toLowerCase().includes('mistake') || section.heading.toLowerCase().includes('trap'))
      .map((section) => ({ error_title: section.heading, correction: section.content.replace(/\*\*/g, '') })),
    exam_tips: sections
      .filter((section) => section.keyBox)
      .flatMap((section) => section.keyBox.items || [])
      .map((item) => item.replace(/\*\*/g, '')),
    concepts: sections.map((section) => section.heading),
  }
}

export function useContent(chapterId, subjectId = 'math') {
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true

    async function fetchContent() {
      setLoading(true)
      setError(null)

      try {
        if (isSupabaseConfigured && supabase) {
          // Fetch from Supabase content_items using existing schema
          const { data, error: dbError } = await supabase
            .from('content_items')
            .select('*')
            .eq('chapter_id', chapterId)

          if (!dbError && data && data.length > 0) {
            // Aggregate content_items by type
            const aggregated = {
              chapter_id: chapterId,
              subject_id: subjectId,
            }
            data.forEach((item) => {
              aggregated[item.content_type] = item.content
            })
            if (active) {
              setContent(aggregated)
              setLoading(false)
            }
            return
          }
        }

        // Verified local repository fallback keeps revision useful offline.
        const localNotes = toRevisionContent(CHAPTER_NOTES[chapterId])
        if (localNotes) {
          if (active) {
            setContent(localNotes)
            setLoading(false)
          }
          return
        }

        if (chapterId === 'math-1') {
          if (active) {
            setContent(RBSE_MATH_CH1_CONTENT)
            setLoading(false)
          }
          return
        }

        if (active) {
          setContent(null)
          setLoading(false)
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Failed to load content')
          setLoading(false)
        }
      }
    }

    if (chapterId) {
      fetchContent()
    } else {
      setLoading(false)
    }

    return () => {
      active = false
    }
  }, [chapterId, subjectId])

  return { content, loading, error }
}
