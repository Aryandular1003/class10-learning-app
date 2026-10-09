import { flattenContentPack } from './contentSchema'
import { SUBJECT_CATALOGUE } from './subjects'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

export async function saveContentPack(pack) {
  if (!isSupabaseConfigured) return { mode: 'local', importedCount: flattenContentPack(pack).length }

  const chapters = pack.chapters.map((chapter, index) => ({
    id: chapter.chapterId,
    subject_id: pack.subjectId,
    title: chapter.title,
    section: chapter.section || null,
    sort_order: index,
  }))
  const { error: chapterError } = await supabase.from('chapters').upsert(chapters, { onConflict: 'id' })
  if (chapterError) throw chapterError

  const records = flattenContentPack(pack).map((record) => ({
    id: record.id,
    subject_id: record.subjectId,
    chapter_id: record.chapterId,
    chapter_name: record.chapterName,
    content_type: record.type,
    content: record.content,
      status: 'approved',
    source_refs: record.sourceRefs,
  }))
  const { error } = await supabase.from('content_items').upsert(records, { onConflict: 'id' })
  if (error) throw error
  return { mode: 'supabase', importedCount: records.length }
}

export async function updateRemoteReviewStatus(itemId, status) {
  if (!isSupabaseConfigured) return { mode: 'local' }
  const { error } = await supabase.from('content_items').update({ status }).eq('id', itemId)
  if (error) throw error
  return { mode: 'supabase' }
}

export async function loadRemoteReviewItems(subjectId) {
  if (!isSupabaseConfigured) return { mode: 'local', items: [] }
  const { data, error } = await supabase
    .from('content_items')
    .select('id, subject_id, chapter_id, chapter_name, content_type, content, status, source_refs')
    .eq('subject_id', subjectId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return {
    mode: 'supabase',
    items: (data || []).map((item) => ({
      id: item.id,
      subjectId: item.subject_id,
      chapterId: item.chapter_id,
      chapterName: item.chapter_name,
      type: item.content_type,
      content: item.content,
      status: 'approved',
      sourceRefs: item.source_refs || [],
    })),
  }
}

export async function loadStudentProgress(userId) {
  if (!isSupabaseConfigured) return { mode: 'local', completedChaptersBySubject: {}, bookmarkedChaptersBySubject: {}, lastOpenedChapterId: null }
  const { data, error } = await supabase.from('student_progress').select('subject_id, chapter_id, completed, bookmarked, metadata').eq('user_id', userId)
  if (error) throw error
  const completedChaptersBySubject = {}
  const bookmarkedChaptersBySubject = {}
  let lastOpenedChapterId = null
  ;(data || []).forEach((row) => {
    if (!completedChaptersBySubject[row.subject_id]) completedChaptersBySubject[row.subject_id] = {}
    if (!bookmarkedChaptersBySubject[row.subject_id]) bookmarkedChaptersBySubject[row.subject_id] = []
    completedChaptersBySubject[row.subject_id][row.chapter_id] = Boolean(row.completed)
    if (row.bookmarked) bookmarkedChaptersBySubject[row.subject_id].push(row.chapter_id)
    if (row.metadata?.last_opened) lastOpenedChapterId = row.chapter_id
  })
  return { mode: 'supabase', completedChaptersBySubject, bookmarkedChaptersBySubject, lastOpenedChapterId }
}

export async function syncStudentProgress(userId, state) {
  if (!isSupabaseConfigured) return { mode: 'local' }
  const rows = []
  Object.entries(SUBJECT_CATALOGUE).forEach(([subjectId, chapters]) => {
    const completed = state.completedChaptersBySubject?.[subjectId] || {}
    const bookmarked = new Set(state.bookmarkedChaptersBySubject?.[subjectId] || [])
    chapters.forEach((chapter) => {
      rows.push({
        user_id: userId,
        subject_id: subjectId,
        chapter_id: chapter.id,
        completed: Boolean(completed[chapter.id]),
        bookmarked: bookmarked.has(chapter.id),
        metadata: { last_opened: state.lastOpenedChapterId === chapter.id },
      })
    })
  })
  const scienceCompleted = state.completedChaptersBySubject?.science || state.completedChapters || {}
  const scienceBookmarked = new Set(state.bookmarkedChaptersBySubject?.science || state.bookmarkedChapters || [])
  const scienceRows = SUBJECT_CATALOGUE.science.map((chapter) => ({
    user_id: userId,
    subject_id: 'science',
    chapter_id: chapter.id,
    completed: Boolean(scienceCompleted[chapter.id]),
    bookmarked: scienceBookmarked.has(chapter.id),
    metadata: { last_opened: state.lastOpenedChapterId === chapter.id },
  }))
  const uniqueRows = [...rows.filter((row) => row.subject_id !== 'science'), ...scienceRows]
  const { error } = await supabase.from('student_progress').upsert(uniqueRows, { onConflict: 'user_id,chapter_id' })
  if (error) throw error
  return { mode: 'supabase' }
}
