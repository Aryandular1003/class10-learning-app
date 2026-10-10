// Razorpay Payment SDK Client Helper for BoardReady Class 10
// Connects to /api/create-order and /api/verify-payment backend endpoints

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

export async function createOrder({ amount = 19900, currency = 'INR', receipt }) {
  const response = await fetch('/api/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: Math.round(amount),
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
    }),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error || 'Failed to create payment order')
  }

  return data
}

export async function verifyPayment({ order_id, payment_id, signature }) {
  const response = await fetch('/api/verify-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      order_id,
      payment_id,
      signature,
      razorpay_order_id: order_id,
      razorpay_payment_id: payment_id,
      razorpay_signature: signature,
    }),
  })

  const data = await response.json()
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Payment signature verification failed')
  }

  return data
}

export async function openRazorpayCheckout({
  amount = 199,
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

  if (onProgress) onProgress('Creating order...')

  // Step 1: Call Backend to Create Order
  let orderData = null
  const amountInPaise = Math.round(amount * 100)

  try {
    orderData = await createOrder({
      amount: amountInPaise,
      currency,
    })
  } catch (err) {
    console.error('Error creating order:', err)
    if (onFailure) onFailure(err)
    return
  }

  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TleIyHZJw45OdI'

  // Step 2: Open Razorpay Modal with order_id
  const options = {
    key: razorpayKey,
    amount: orderData.amount,
    currency: orderData.currency,
    name: 'BoardReady Class 10',
    description: 'Full Syllabus & 2026 Predicted Questions Unlock',
    image: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
    order_id: orderData.order_id,
    prefill: {
      name: studentName,
      email: studentEmail,
      contact: studentPhone,
    },
    notes: {
      package: 'Class 10 RBSE Board Prep',
      price: '₹199',
    },
    theme: {
      color: '#d97706', // Amber theme
    },
    handler: async function (response) {
      if (onProgress) onProgress('Verifying payment signature...')
      try {
        // Step 3: Call Backend to Verify Signature
        await verifyPayment({
          order_id: response.razorpay_order_id,
          payment_id: response.razorpay_payment_id,
          signature: response.razorpay_signature,
        })

        if (onSuccess) {
          onSuccess({
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
            amount,
            currency,
            paidAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          })
        }
      } catch (verificationError) {
        console.error('Payment verification failed:', verificationError)
        if (onFailure) onFailure(verificationError)
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

    // Handle payment.failed event
    rzp.on('payment.failed', function (response) {
      const errorMsg = response.error?.description || response.error?.reason || 'Payment failed'
      if (onFailure) onFailure(new Error(errorMsg))
    })

    rzp.open()
  } catch (error) {
    if (onFailure) onFailure(error)
  }
}
