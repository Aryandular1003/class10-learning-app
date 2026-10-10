import Razorpay from 'razorpay'
import crypto from 'crypto'

export function getRazorpayClient() {
  const key_id = process.env.RAZORPAY_KEY_ID
  const key_secret = process.env.RAZORPAY_KEY_SECRET

  if (!key_id || !key_secret) {
    throw new Error('Razorpay credentials not configured in environment variables')
  }

  return new Razorpay({
    key_id,
    key_secret,
  })
}

export async function handleCreateOrder(body) {
  const amount = 19900
  const currency = body?.currency || 'INR'
  const receipt = body?.receipt || `rcpt_${Date.now()}`

  // Validate amount >= 100 paise
  if (!amount || amount < 100) {
    const error = new Error('Amount must be at least 100 paise (1 INR)')
    error.statusCode = 400
    throw error
  }

  const razorpay = getRazorpayClient()

  try {
    const order = await razorpay.orders.create({
      amount: Math.round(amount),
      currency,
      receipt,
      notes: body?.notes || {},
    })

    return {
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    }
  } catch (err) {
    const error = new Error(err.error?.description || err.message || 'Razorpay order creation failed')
    error.statusCode = err.statusCode || 500
    throw error
  }
}

export function handleVerifySignature(body) {
  const order_id = body?.razorpay_order_id || body?.order_id
  const payment_id = body?.razorpay_payment_id || body?.payment_id
  const signature = body?.razorpay_signature || body?.signature

  if (!order_id || !payment_id || !signature) {
    const error = new Error('Missing required fields: order_id, payment_id, and signature are required')
    error.statusCode = 400
    throw error
  }

  const key_secret = process.env.RAZORPAY_KEY_SECRET
  if (!key_secret) {
    const error = new Error('Razorpay secret not configured')
    error.statusCode = 500
    throw error
  }

  const generatedSignature = crypto
    .createHmac('sha256', key_secret)
    .update(`${order_id}|${payment_id}`)
    .digest('hex')

  if (generatedSignature !== signature) {
    const error = new Error('Invalid signature')
    error.statusCode = 400
    throw error
  }

  return {
    success: true,
    message: 'Payment verified successfully',
    order_id,
    payment_id,
  }
}
