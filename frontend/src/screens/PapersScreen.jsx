import { useEffect, useMemo, useState } from 'react'
import { useTheme } from '../theme/useTheme'
import ScreenHeader from '../components/ui/ScreenHeader'
import BottomNav from '../components/ui/BottomNav'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'

const STORAGE_KEY = 'boardready-paper-library'

const STARTER_PAPERS = [
  { id: 'rbse-math-2025', title: 'Mathematics Board Paper', year: '2025', type: 'Previous year', subject: 'Mathematics', status: 'Add PDF' },
  { id: 'rbse-math-2024', title: 'Mathematics Board Paper', year: '2024', type: 'Previous year', subject: 'Mathematics', status: 'Add PDF' },
  { id: 'rbse-math-2023', title: 'Mathematics Board Paper', year: '2023', type: 'Previous year', subject: 'Mathematics', status: 'Add PDF' },
  { id: 'math-model-1', title: 'Mathematics Model Paper 1', year: '2026', type: 'Model paper', subject: 'Mathematics', status: 'Add PDF' },
  { id: 'math-model-2', title: 'Mathematics Model Paper 2', year: '2026', type: 'Model paper', subject: 'Mathematics', status: 'Add PDF' },
]

function readSavedPapers() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}

export default function PapersScreen({ onNavigate }) {
  const { theme, toggleTheme } = useTheme()
  const [papers, setPapers] = useState(() => [...STARTER_PAPERS, ...readSavedPapers()])
  const [activeType, setActiveType] = useState('All')
  const [year, setYear] = useState('All years')
  const [uploadType, setUploadType] = useState('Previous year')
  const [uploadYear, setUploadYear] = useState('2025')

  useEffect(() => {
    const saved = papers.filter((paper) => paper.uploaded)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved, (key, value) => key === 'objectUrl' ? undefined : value))
  }, [papers])

  const years = useMemo(() => ['All years', ...new Set(papers.map((paper) => paper.year))], [papers])
  const visiblePapers = papers.filter((paper) =>
    (activeType === 'All' || paper.type === activeType) &&
    (year === 'All years' || paper.year === year)
  )

  function handleUpload(event) {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.type !== 'application/pdf') {
      window.alert('Please choose a PDF file.')
      event.target.value = ''
      return
    }
    const paper = {
      id: `uploaded-${Date.now()}`,
      title: file.name.replace(/\.pdf$/i, '').replace(/[-_]+/g, ' '),
      year: uploadYear,
      type: uploadType,
      subject: 'Mathematics',
      status: 'Uploaded',
      filename: file.name,
      uploaded: true,
      objectUrl: URL.createObjectURL(file),
    }
    setPapers((current) => [paper, ...current])
    event.target.value = ''
  }

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100 transition-colors duration-200">
      <ScreenHeader title="Papers Library" theme={theme} toggleTheme={toggleTheme} />
      <main className="max-w-2xl mx-auto px-4 pb-40 pt-6">
        <section className="mb-5">
          <div className="flex items-center gap-2 mb-1"><span className="text-2xl">📄</span><h1 className="text-h2 font-bold">PYQ & Model Papers</h1></div>
          <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">Keep Mathematics PDFs organised year-wise. Upload a board paper or a model paper and download it whenever you need a timed practice session.</p>
        </section>

        <Card className="p-4 mb-5 border-l-4 border-amber-500">
          <p className="section-label mb-3">Upload a Mathematics PDF</p>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <label className="flex flex-col gap-1"><span className="section-label">Paper type</span><select value={uploadType} onChange={(e) => setUploadType(e.target.value)} className="text-sm bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-btn px-3 py-2 min-h-[44px]"><option>Previous year</option><option>Model paper</option></select></label>
            <label className="flex flex-col gap-1"><span className="section-label">Year</span><input value={uploadYear} onChange={(e) => setUploadYear(e.target.value)} inputMode="numeric" className="text-sm bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-btn px-3 py-2 min-h-[44px]" /></label>
          </div>
          <label className="flex items-center justify-center gap-2 min-h-[46px] rounded-btn bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm cursor-pointer transition-colors"><span>⬆️ Choose PDF</span><input type="file" accept="application/pdf,.pdf" onChange={handleUpload} className="sr-only" /></label>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-2">Demo mode keeps uploaded files available in this browser session. Connect storage later for permanent multi-device uploads.</p>
        </Card>

        <Card className="p-4 mb-5">
          <div className="flex gap-2 mb-3"><button onClick={() => setActiveType('All')} className={`flex-1 min-h-[42px] rounded-btn text-xs font-bold ${activeType === 'All' ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'}`}>All papers</button><button onClick={() => setActiveType('Previous year')} className={`flex-1 min-h-[42px] rounded-btn text-xs font-bold ${activeType === 'Previous year' ? 'bg-teal-600 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'}`}>Year-wise PYQs</button><button onClick={() => setActiveType('Model paper')} className={`flex-1 min-h-[42px] rounded-btn text-xs font-bold ${activeType === 'Model paper' ? 'bg-violet-600 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'}`}>Model papers</button></div>
          <select value={year} onChange={(e) => setYear(e.target.value)} className="w-full text-sm bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-btn px-3 py-2 min-h-[44px]">{years.map((item) => <option key={item}>{item}</option>)}</select>
        </Card>

        <div className="flex flex-col gap-3">{visiblePapers.map((paper) => <Card key={paper.id} className="p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><div className="flex flex-wrap gap-2 mb-2"><Badge variant={paper.type === 'Model paper' ? 'violet' : 'teal'}>{paper.type}</Badge><Badge variant="stone">{paper.year}</Badge></div><h2 className="font-bold capitalize leading-snug">{paper.title}</h2><p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{paper.filename || 'PDF slot ready for upload'}</p></div>{paper.objectUrl ? <a href={paper.objectUrl} download={paper.filename} target="_blank" rel="noreferrer" className="shrink-0 min-h-[42px] px-3 rounded-btn bg-teal-600 text-white text-xs font-bold flex items-center">Download</a> : <span className="shrink-0 text-xs font-semibold text-stone-400">Pending PDF</span>}</div></Card>)}</div>
        <div className="h-10" aria-hidden="true" />
      </main>
      <BottomNav activeScreen="papers" onNavigate={onNavigate || (() => {})} />
    </div>
  )
}
