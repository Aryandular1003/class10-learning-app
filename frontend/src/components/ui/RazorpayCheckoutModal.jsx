import { useState } from 'react'
import { openRazorpayCheckout } from '../../lib/razorpay'
import { useAuth } from '../../hooks/useAuth'
import { useStudy } from '../../hooks/useStudy'
import { SparklesIcon, CheckCircleIcon, XMarkIcon, LockClosedIcon } from './icons'
import Badge from './Badge'
import Card from './Card'

export default function RazorpayCheckoutModal({ isOpen, onClose, targetChapter }) {
  const { user, profile, refreshProfile } = useAuth()
  const { activatePremium, isPremium } = useStudy()
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [successPayment, setSuccessPayment] = useState(null)

  if (!isOpen) return null

  const handlePayViaRazorpay = () => {
    setLoading(true)
    setErrorMessage(null)
    setLoadingStep('Opening payment...')

    openRazorpayCheckout({
      amount: 199,
      currency: 'INR',
      studentName: profile?.full_name || profile?.display_name || 'Student',
      studentEmail: user?.email || '',
      studentPhone: profile?.phone || '',
      onProgress: (stepText) => {
        setLoadingStep(stepText)
      },
      onSuccess: async (paymentData) => {
        setLoading(false)
        setLoadingStep('')
        activatePremium(paymentData)
        if (refreshProfile) {
          try {
            await refreshProfile()
          } catch {
            // Profile will refresh on next navigation
          }
        }
        setSuccessPayment(paymentData)
      },
      onFailure: (err) => {
        setLoading(false)
        setLoadingStep('')
        if (err?.message !== 'Payment window closed.') {
          setErrorMessage(err.message || 'Razorpay checkout encountered an issue.')
        }
      },
    })
  }

  const handleSimulateTestPayment = () => {
    setLoading(true)
    setLoadingStep('Activating demo unlock...')
    setTimeout(async () => {
      const simPayment = {
        paymentId: `pay_demo_${Math.random().toString(36).substr(2, 9)}`,
        orderId: `order_demo_${Date.now()}`,
        amount: 199,
        currency: 'INR',
        paidAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      }
      setLoading(false)
      setLoadingStep('')
      activatePremium(simPayment)
      setSuccessPayment(simPayment)
    }, 800)
  }

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="bg-white dark:bg-stone-800 rounded-card shadow-card-md w-full max-w-lg p-5 sm:p-6 animate-in fade-in zoom-in-95 border-t-4 border-amber-500 dark:border-amber-400">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-100 dark:border-stone-700/60 pb-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="amber">🔥 Limited Time Offer</Badge>
              <Badge variant="teal">₹199 One-Time</Badge>
            </div>
            <h2 className="text-xl font-extrabold text-stone-900 dark:text-stone-100 mt-1">
              Unlock BoardReady Premium
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400"
            aria-label="Close checkout modal"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Success View */}
        {successPayment || isPremium ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto text-3xl">
              🎉
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-stone-900 dark:text-stone-100">Payment Successful!</h3>
              <p className="text-sm text-stone-600 dark:text-stone-300 mt-1">
                You now have full access to BoardReady Premium for RBSE Class 10!
              </p>
            </div>

            <Card className="p-4 bg-teal-50/60 dark:bg-teal-950/40 border border-teal-200/50 dark:border-teal-800/40 text-left text-xs space-y-1.5">
              <div className="flex justify-between font-semibold text-stone-800 dark:text-stone-200">
                <span>Amount Paid:</span>
                <span className="text-teal-700 dark:text-teal-300 font-bold">₹199.00 INR</span>
              </div>
              <div className="flex justify-between text-stone-600 dark:text-stone-400">
                <span>Payment ID:</span>
                <span className="font-mono">{successPayment?.paymentId || 'pay_active_premium'}</span>
              </div>
              <div className="flex justify-between text-stone-600 dark:text-stone-400">
                <span>Date:</span>
                <span>{successPayment?.paidAt || 'Today'}</span>
              </div>
            </Card>

            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-btn bg-teal-600 text-white font-bold text-sm min-h-[48px] hover:bg-teal-700 active:scale-95 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-teal-400"
            >
              Start Studying Now &rarr;
            </button>
          </div>
        ) : (
          /* Payment Offer View */
          <div className="space-y-4">
            {targetChapter && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 rounded-btn flex items-center gap-2 text-xs font-semibold text-amber-900 dark:text-amber-200">
                <LockClosedIcon className="w-4 h-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                <span>Unlocks <strong>{targetChapter.name}</strong> + all 61 Class 10 chapters!</span>
              </div>
            )}

            {/* Pricing Banner */}
            <div className="bg-amber-gradient rounded-card p-4 text-white text-center shadow-amber">
              <p className="text-xs text-amber-100 font-semibold uppercase tracking-wider">Full Syllabus & Predicted Questions Pass</p>
              <div className="flex items-baseline justify-center gap-2 mt-1">
                <span className="text-4xl font-extrabold">₹199</span>
                <span className="text-sm line-through text-amber-200">₹499</span>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-bold">60% OFF</span>
              </div>
              <p className="text-xs text-amber-100 mt-1">One-time payment • Valid for 1 year or until 1 month after the RBSE board exam, whichever comes first</p>
            </div>

            {/* Feature List */}
            <div className="space-y-2 text-xs text-stone-700 dark:text-stone-300">
              {[
                'Full handwritten notes for all 61 chapters (Science, Math, English, Social Science)',
                '2026 AI-Predicted Board Questions with step-by-step model answers',
                'Verified Previous Year Question Bank (2019-2025) with marking schemes',
                'Instant access across Mobile, Tablet, and Laptop',
                'Access validity: 1 year or until 1 month after the board exam, whichever comes first',
              ].map((feat, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2 bg-stone-50 dark:bg-stone-800/80 rounded-btn border border-stone-200/60 dark:border-stone-700/50">
                  <CheckCircleIcon className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {errorMessage && (
              <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 p-2.5 rounded-btn border border-red-200 dark:border-red-900/60" role="alert">
                ⚠️ {errorMessage}
              </p>
            )}

            {/* CTA Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handlePayViaRazorpay}
                disabled={loading}
                className="w-full py-4 rounded-btn bg-amber-500 hover:bg-amber-600 text-white font-bold text-base min-h-[52px] active:scale-98 transition-all shadow-amber focus:outline-none focus:ring-2 focus:ring-amber-400 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>{loadingStep || 'Processing Payment...'}</span>
                ) : (
                  <>
                    <SparklesIcon className="w-5 h-5" />
                    <span>Pay ₹199 with Razorpay</span>
                  </>
                )}
              </button>

              <button
                onClick={handleSimulateTestPayment}
                disabled={loading}
                className="w-full py-2.5 rounded-btn border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700 font-semibold text-xs min-h-[40px] transition-colors"
              >
                ⚡ Simulate Instant Test Mode Payment (Demo Unlock)
              </button>
            </div>

            <div className="flex items-center justify-center gap-3 text-[11px] text-stone-400 dark:text-stone-500 pt-1">
              <span>🔒 256-bit Secure Razorpay Checkout</span>
              <span>•</span>
              <span>UPI / Cards / Netbanking</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
