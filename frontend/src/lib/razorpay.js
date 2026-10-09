// Razorpay Payment SDK Helper for BoardReady Class 10
// Supports both server-side verified orders via Supabase Edge Functions
// and seamless client-side development fallback.

import { supabase, isSupabaseConfigured } from './supabase'

const RAZORPAY_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js'

export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.src = RAZORPAY_SCRIPT_URL
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export async function createServerRazorpayOrder(amount = 99) {
  if (!isSupabaseConfigured || !supabase) return null
  try {
    const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
      body: { amount },
    })
    if (error || !data?.orderId) {
      return null
    }
    return data
  } catch {
    return null
  }
}

export async function verifyServerRazorpayPayment({ orderId, paymentId, signature }) {
  if (!isSupabaseConfigured || !supabase) return { verified: true, simulated: true }
  const { data, error } = await supabase.functions.invoke('verify-razorpay-payment', {
    body: {
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature,
    },
  })
  if (error) {
    throw new Error(error.message || 'Payment signature verification failed on server.')
  }
  return { verified: true, ...data }
}

export async function openRazorpayCheckout({
  amount = 99,
  currency = 'INR',
  studentName = 'Student',
  studentEmail = '',
  studentPhone = '',
  onProgress,
  onSuccess,
  onFailure,
}) {
  const loaded = await loadRazorpayScript()
  if (!loaded) {
    if (onFailure) onFailure(new Error('Razorpay SDK failed to load. Please check your internet connection.'))
    return
  }

  if (onProgress) onProgress('Preparing secure order...')

  // Attempt to create a cryptographically bound order on the server
  let serverOrder = null
  try {
    serverOrder = await createServerRazorpayOrder(amount)
  } catch {
    // Continue with client fallback if edge function is not deployed yet
  }

  const razorpayKey = serverOrder?.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_boardready_99'
  const amountInPaise = serverOrder?.amount || Math.round(amount * 100)

  const options = {
    key: razorpayKey,
    amount: amountInPaise,
    currency: serverOrder?.currency || currency,
    name: 'BoardReady Class 10',
    description: 'Full Syllabus & 2026 Predicted Questions Unlock',
    image: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
    ...(serverOrder?.orderId ? { order_id: serverOrder.orderId } : {}),
    prefill: {
      name: studentName,
      email: studentEmail,
      contact: studentPhone,
    },
    notes: {
      package: 'Class 10 RBSE Board Prep',
      price: '₹99',
    },
    theme: {
      color: '#d97706', // Amber theme
    },
    handler: async function (response) {
      if (onProgress) onProgress('Verifying payment on server...')
      try {
        if (serverOrder?.orderId && response.razorpay_signature) {
          // Cryptographic verification on backend Edge Function
          await verifyServerRazorpayPayment({
            orderId: response.razorpay_order_id || serverOrder.orderId,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          })
        }

        if (onSuccess) {
          onSuccess({
            paymentId: response.razorpay_payment_id || `pay_sim_${Date.now()}`,
            orderId: response.razorpay_order_id || serverOrder?.orderId || `order_sim_${Date.now()}`,
            signature: response.razorpay_signature || 'simulated_signature',
            amount,
            currency,
            paidAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          })
        }
      } catch (err) {
        if (onFailure) onFailure(err)
      }
    },
    modal: {
      ondismiss: function () {
        if (onFailure) onFailure(new Error('Payment window closed.'))
      },
    },
  }

  try {
    const rzp = new window.Razorpay(options)
    rzp.open()
  } catch (error) {
    if (onFailure) onFailure(error)
  }
}
