// Razorpay Payment SDK Helper for BoardReady Class 10

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

export async function openRazorpayCheckout({
  amount = 99,
  currency = 'INR',
  studentName = 'Student',
  studentEmail = '',
  studentPhone = '',
  onSuccess,
  onFailure,
}) {
  const loaded = await loadRazorpayScript()
  if (!loaded) {
    if (onFailure) onFailure(new Error('Razorpay SDK failed to load. Please check your internet connection.'))
    return
  }

  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_boardready_99'
  const amountInPaise = Math.round(amount * 100)

  const options = {
    key: razorpayKey,
    amount: amountInPaise,
    currency,
    name: 'BoardReady Class 10',
    description: 'Full Syllabus & 2026 Predicted Questions Unlock',
    image: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
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
    handler: function (response) {
      if (onSuccess) {
        onSuccess({
          paymentId: response.razorpay_payment_id || `pay_sim_${Date.now()}`,
          orderId: response.razorpay_order_id || `order_sim_${Date.now()}`,
          signature: response.razorpay_signature || 'simulated_signature',
          amount,
          currency,
          paidAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        })
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
