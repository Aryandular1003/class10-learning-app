import { handleCreateOrder } from '../src/server/razorpayApi.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const result = await handleCreateOrder(req.body)
    return res.status(200).json(result)
  } catch (error) {
    const status = error.statusCode || 500
    return res.status(status).json({ error: error.message })
  }
}
