import { useState } from 'react'
import { useTheme } from '../theme/useTheme'
import { useAuth } from '../hooks/useAuth'
import { useStudy } from '../hooks/useStudy'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import ScreenHeader from '../components/ui/ScreenHeader'
import BottomNav from '../components/ui/BottomNav'
import SubjectSwitcher from '../components/ui/SubjectSwitcher'

export default function FounderDashboardScreen({ onNavigate }) {
  const { theme, toggleTheme } = useTheme()
  const { profile } = useAuth()
  const { subjects, activeSubject, setActiveSubject, subjectDefinition, reviewItems, importContentPack } = useStudy()
  const [message, setMessage] = useState(null)
  const approved = reviewItems.length

  async function handleImport(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    try {
      const pack = JSON.parse(await file.text())
      const result = await importContentPack(pack)
      setMessage(result.valid ? `${result.importedCount} item${result.importedCount === 1 ? '' : 's'} imported and marked approved.` : result.errors[0])
    } catch {
      setMessage('The selected file is not valid JSON.')
    }
  }

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100 transition-colors duration-200">
      <ScreenHeader title="Admin Tools" theme={theme} toggleTheme={toggleTheme} />
      <main className="max-w-2xl mx-auto px-4 pb-40 pt-6">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-700 dark:text-violet-400 mb-1">Founder workspace</p>
          <h1 className="text-h1 font-bold">Welcome, {profile?.full_name || profile?.display_name || 'Founder'}</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-2 leading-relaxed">Content you upload is treated as approved immediately, because you review it before importing. Use this space to import content and manage paper resources.</p>
        </div>
        <SubjectSwitcher subjects={subjects} activeSubject={activeSubject} onChange={setActiveSubject} />
        <Card className="p-4 mb-5 border border-violet-200 dark:border-violet-800/50 bg-violet-50/40 dark:bg-violet-950/20">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-700 dark:text-violet-400">Current subject</p>
          <p className="text-lg font-bold mt-1">{subjectDefinition.label}</p>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">All existing and imported learning content is student-facing and approved.</p>
          <label className="mt-4 w-full min-h-[44px] rounded-btn bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold flex items-center justify-center cursor-pointer">Import approved JSON<input type="file" accept=".json,application/json" onChange={handleImport} className="sr-only" /></label>
          {message && <p className="text-xs text-teal-700 dark:text-teal-400 mt-3" role="status">{message}</p>}
        </Card>
        <div className="grid grid-cols-2 gap-3 mb-5">
          <Card className="p-4"><p className="text-2xl font-bold text-teal-700 dark:text-teal-400">{approved}</p><p className="text-xs text-stone-500 dark:text-stone-400 mt-1">Approved content items</p></Card>
          <Card className="p-4"><p className="text-2xl font-bold text-violet-700 dark:text-violet-400">{subjects.length}</p><p className="text-xs text-stone-500 dark:text-stone-400 mt-1">Subjects available</p></Card>
        </div>
        <Card className="p-4 mb-5">
          <div className="flex items-center justify-between gap-3"><p className="text-sm font-semibold">Resource management</p><Badge variant="teal">Approved workflow</Badge></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            <button type="button" onClick={() => onNavigate('papers')} className="min-h-[52px] rounded-btn bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold">📄 Manage PYQ PDFs</button>
            <button type="button" onClick={() => onNavigate('home')} className="min-h-[52px] rounded-btn border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-sm font-bold">🏠 View student app</button>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between gap-3"><p className="text-sm font-semibold">Admin checklist</p><Badge variant="violet">Live</Badge></div>
          <div className="space-y-3 mt-4 text-sm text-stone-600 dark:text-stone-300">
            <p>✓ Content imports are approved automatically</p><p>✓ Existing content is available to students</p><p>✓ PYQ and model-paper library is available</p><p>○ Connect permanent file storage when ready</p>
          </div>
        </Card>
      </main>
      <BottomNav activeScreen="profile" onNavigate={onNavigate} />
    </div>
  )
}
