import { useState, useEffect } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { RBSE_MATH_CH1_CONTENT } from '../data/rbseVerifiedData'
import { CHAPTER_NOTES } from '../data/chapterNotesData'
import { getSocialScienceSource, parseMarkdownContent } from '../data/socialScienceContent'
import { MATH_CHAPTERS } from '../data/mathContent'
import { SCIENCE_CHAPTERS } from '../data/scienceContent'
import { ENGLISH_CHAPTERS } from '../data/englishContent'

const LOCAL_SUBJECTS = {
  'social-science': {
    label: 'Social Science',
    sources: getSocialScienceSource,
    path: 'social-science',
  },
  math: {
    label: 'Mathematics',
    sources: (chapterId) => MATH_CHAPTERS.find((chapter) => chapter.id === chapterId),
    path: 'math',
  },
  science: {
    label: 'Science',
    sources: (chapterId) => SCIENCE_CHAPTERS.find((chapter) => chapter.id === chapterId),
    path: 'science',
  },
  english: {
    label: 'English',
    sources: (chapterId) => ENGLISH_CHAPTERS.find((chapter) => chapter.id === chapterId),
    path: 'english',
  },
}

async function loadLocalChapterContent(chapterId, subjectId) {
  const subject = LOCAL_SUBJECTS[subjectId]
  if (!subject) return null

  const normalizedChapterId = subjectId === 'english'
    ? chapterId.replace(/^english-0?/, 'english-')
    : chapterId
  const source = subject.sources(normalizedChapterId)
  if (!source) return null

  const response = await fetch(`/content/${subject.path}/${source.file}`)
  if (!response.ok) return null

  const markdown = await response.text()
  return {
    notes: parseMarkdownContent(
      markdown,
      { id: chapterId, name: source.title, weight: 5 },
      subject.label,
      source.unit,
      source.file,
    ),
  }
}

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
        // The bundled chapter Markdown is the complete, verified source for
        // all subjects. Load it first so a stale Supabase row cannot hide a
        // chapter that is already present in the app bundle.
        const bundledContent = await loadLocalChapterContent(chapterId, subjectId)
        if (bundledContent) {
          if (active) {
            setContent(bundledContent)
            setLoading(false)
          }
          return
        }

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

        // Older, richer in-app notes remain a final fallback for legacy chapters.
        const localNotes = toRevisionContent(CHAPTER_NOTES[chapterId])
        if (localNotes || chapterId === 'math-1') {
          if (active) {
            setContent(localNotes || RBSE_MATH_CH1_CONTENT)
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
