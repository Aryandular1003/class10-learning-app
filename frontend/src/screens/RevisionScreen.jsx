import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useStudy } from '../hooks/useStudy'
import { useContent } from '../hooks/useContent'
import { SUBJECT_CATALOGUE } from '../data/subjects'
import ScreenHeader from '../components/ui/ScreenHeader'
import BottomNav from '../components/ui/BottomNav'
import RazorpayCheckoutModal from '../components/ui/RazorpayCheckoutModal'

export default function RevisionScreen({ onNavigate }) {
  const { chapterId } = useParams()
  const { chapters, isPremium, activatePremium } = useStudy()
  const [activeTab, setActiveTab] = useState('quick') // 'quick' | 'one_hour'
  const [showCheckout, setShowCheckout] = useState(false)

  const activeChapterId = chapterId || chapters[0]?.id || 'math-1'
  const subjectId = activeChapterId.replace(/-\d+$/, '')
  const catalogChapters = (SUBJECT_CATALOGUE[subjectId] || []).map((ch) => ({
    ...ch,
    id: ch.id || `${subjectId}-${ch.index + 1}`,
  }))
  const currentChapter = chapters.find((c) => c.id === activeChapterId)
    || catalogChapters.find((c) => c.id === activeChapterId)
    || { id: activeChapterId, name: 'Chapter Revision' }

  const { content, loading } = useContent(activeChapterId)

  // Extract quick revision & 1-hour revision items
  const quickRevision = content?.quick_revision || [
    'अंकगणित की आधारभूत प्रमेय: प्रत्येक भाज्य संख्या को अभाज्य गुणनखंडों के अद्वितीय गुणनफल में व्यक्त किया जा सकता है।',
    'HCF = उभयनिष्ठ अभाज्य गुणनखंडों की न्यूनतम घातों का गुणनफल।',
    'LCM = सभी अभाज्य गुणनखंडों की उच्चतम घातों का गुणनफल।',
    'दो धनात्मक पूर्णांकों a और b के लिए: HCF(a, b) × LCM(a, b) = a × b.',
    '√2, √3, √5 अपरिमेय संख्याएँ हैं (विरोधाभास विधि द्वारा सिद्ध)।',
  ]

  const oneHourRevision = content?.one_hour_revision || [
    '1. 140, 156, 3825 का अभाज्य गुणनखंडन लिखकर दोहराएँ।',
    '2. HCF(a,b) × LCM(a,b) = a × b सूत्र पर 1 प्रश्न हल करें।',
    '3. √5 की अपरिमेयता सिद्ध करने का पूरा उत्तर लिखकर देखें।',
    '4. (3 + 2√5) रूप की अपरिमेयता सिद्ध करने का चरणबद्ध तरीका याद करें।',
  ]

  const commonMistakes = content?.common_mistakes || [
    {
      error_title: 'तीन संख्याओं के लिए HCF × LCM = a × b × c लिखना',
      correction: 'HCF × LCM = a × b केवल दो धनात्मक पूर्णांकों के लिए सत्य है। तीन संख्याओं के लिए यह सूत्र लागू नहीं होता।',
    },
    {
      error_title: "अपरिमेयता की उपपत्ति में 'सह-अभाज्य' न लिखना",
      correction: "विरोधाभास विधि में a और b को 'सह-अभाज्य (Co-prime)' लिखना अनिवार्य है, अन्यथा अंक कटते हैं।",
    },
    {
      error_title: 'HCF और LCM में घातों का भ्रम',
      correction: 'HCF में उभयनिष्ठ गुणनखंडों की न्यूनतम (smallest) घात ली जाती है, जबकि LCM में सभी अभाज्य गुणनखंडों की उच्चतम (greatest) घात ली जाती है।',
    },
  ]

  const examTips = content?.exam_tips || [
    'गुणनखंडन करते समय अभाज्य संख्याओं (2, 3, 5, 7, 11, 13...) के क्रम का ध्यान रखें और घातांकीय रूप (exponential form) में साफ लिखें।',
    'अपरिमेयता सिद्ध करने वाले प्रश्न में सभी चरण - मान लेना (Assumption), वर्ग करना, विभाजन दर्शाना और विरोधाभास लिखना स्पष्ट रूप से दर्शाएँ।',
    'उत्तर में इकाइयाँ (जैसे मिनट, मीटर) अवश्य लिखें जब केस-स्टडी या व्यावहारिक समस्या हल कर रहे हों।',
  ]

  const formulas = content?.formulas || []
  return (
    <div className="min-h-screen bg-cream-100 dark:bg-stone-900 pb-24 transition-colors duration-200">
      <ScreenHeader
        title="Chapter Revision"
        subtitle={currentChapter.name}
        actionLabel={isPremium ? '👑 PRO' : 'Get PRO (₹199)'}
        onAction={isPremium ? undefined : () => setShowCheckout(true)}
      />

      <main className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {/* Toggle between Quick Revision and 1-Hour Revision */}
        <section className="flex p-1 rounded-card bg-stone-200/70 dark:bg-stone-800 border border-stone-300/60 dark:border-stone-700">
          <button
            onClick={() => setActiveTab('quick')}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'quick'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
                : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            ⚡ Quick Revision
          </button>
          <button
            onClick={() => setActiveTab('one_hour')}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'one_hour'
                ? 'bg-amber-500 text-stone-900 shadow-sm font-extrabold'
                : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            <span>⏱️ 1-Hour Board Sprint</span>
            {!isPremium && <span className="text-[10px] bg-stone-900 text-amber-400 px-1.5 py-0.2 rounded font-bold">PRO</span>}
          </button>
        </section>

        {loading ? (
          <div className="p-8 text-center text-stone-400 dark:text-stone-500 text-sm">Loading revision points...</div>
        ) : activeTab === 'quick' ? (
          /* QUICK REVISION SECTION */
          <div className="space-y-4">
            {/* Core Revision Bullet Points */}
            <section className="bg-white dark:bg-stone-800 rounded-card p-4 border border-stone-200 dark:border-stone-700 shadow-card">
              <h2 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 mb-3">
                <span>📌</span> Key Concepts to Remember
              </h2>
              <ul className="space-y-2 text-xs sm:text-sm text-stone-800 dark:text-stone-200">
                {quickRevision.map((point, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold mt-0.5">•</span>
                    <span className="leading-relaxed font-medium">{point}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Formulae / Relations sheet */}
            {formulas.length > 0 && (
              <section className="bg-white dark:bg-stone-800 rounded-card p-4 border border-stone-200 dark:border-stone-700 shadow-card">
                <h2 className="text-sm font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1.5 mb-3">
                  <span>📐</span> Essential Formula Sheet
                </h2>
                <div className="space-y-2.5">
                  {formulas.map((f, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-teal-50/50 dark:bg-stone-900/60 border border-teal-200/50 dark:border-stone-700">
                      <p className="font-bold text-xs text-teal-800 dark:text-teal-300">{f.formula_name}</p>
                      <p className="font-mono text-xs sm:text-sm text-stone-900 dark:text-stone-100 font-bold mt-0.5">{f.expression}</p>
                      {f.description && <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">{f.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Common Mistakes */}
            <section className="bg-white dark:bg-stone-800 rounded-card p-4 border border-stone-200 dark:border-stone-700 shadow-card">
              <h2 className="text-sm font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5 mb-3">
                <span>⚠️</span> Common Mistakes in Board Exam
              </h2>
              <div className="space-y-2.5">
                {commonMistakes.map((m, i) => (
                  <div key={i} className="p-3 rounded-xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/30 text-xs">
                    <p className="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1">
                      <span>❌</span> {m.error_title}
                    </p>
                    <p className="mt-1 text-stone-700 dark:text-stone-300 font-medium leading-relaxed">
                      <strong className="text-emerald-700 dark:text-emerald-400">Correct Way: </strong>
                      {m.correction}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Exam Tips */}
            <section className="bg-white dark:bg-stone-800 rounded-card p-4 border border-stone-200 dark:border-stone-700 shadow-card">
              <h2 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mb-2.5">
                <span>💡</span> Examiner Tips for Full Marks
              </h2>
              <ul className="space-y-1.5 text-xs text-stone-700 dark:text-stone-300">
                {examTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">✔</span>
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        ) : (
          /* 1-HOUR REVISION SECTION (PRO GATE) */
          <div>
            {!isPremium ? (
              <div className="bg-white dark:bg-stone-800 rounded-card p-6 border border-stone-200 dark:border-stone-700 shadow-card text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950 flex items-center justify-center mx-auto text-2xl">
                  👑
                </div>
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                  1-Hour High-Priority Revision Sprint
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 max-w-sm mx-auto leading-relaxed">
                  The 1-Hour Sprint condenses the highest-yield questions, top definitions, and crucial theorems for rapid last-minute revision before exams.
                </p>
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 text-left space-y-1">
                  <p className="font-bold">What is inside:</p>
                  <p>• Highest priority NCERT & Board questions for this chapter</p>
                  <p>• 15-minute formula and theorem drill</p>
                  <p>• Step-by-step marking scheme traps</p>
                </div>
                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full py-3 rounded-btn bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold text-sm shadow-md transition-transform active:scale-95"
                >
                  Unlock 1-Hour Sprint with PRO (₹199) →
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <section className="bg-white dark:bg-stone-800 rounded-card p-4 border border-stone-200 dark:border-stone-700 shadow-card">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                      <span>⏱️</span> 60-Minute Rapid Action Checklist
                    </h2>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-chip bg-amber-500 text-stone-900">
                      👑 PRO Exclusive
                    </span>
                  </div>
                  <ol className="space-y-3 text-xs sm:text-sm text-stone-800 dark:text-stone-200">
                    {oneHourRevision.map((task, i) => (
                      <li key={i} className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 flex items-start gap-2.5">
                        <span className="font-bold text-amber-600 dark:text-amber-400">{i + 1}.</span>
                        <span className="leading-relaxed font-medium">{task}</span>
                      </li>
                    ))}
                  </ol>
                </section>

                <section className="bg-white dark:bg-stone-800 rounded-card p-4 border border-stone-200 dark:border-stone-700 shadow-card">
                  <h3 className="text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider mb-2">
                    Sprint Strategy
                  </h3>
                  <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                    Spend 15 mins reviewing definitions, 20 mins solving the two guaranteed theorems on paper, and 25 mins doing the numericals without looking at solutions.
                  </p>
                </section>
              </div>
            )}
          </div>
        )}
      </main>

      <BottomNav activeScreen="chapters" onNavigate={onNavigate} />

      {showCheckout && (
        <RazorpayCheckoutModal
          onClose={() => setShowCheckout(false)}
          onSuccess={(payment) => {
            activatePremium(payment)
            setShowCheckout(false)
          }}
        />
      )}
    </div>
  )
}
