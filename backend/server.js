// Standalone Node.js server for Razorpay order creation and signature verification
// Run with: node backend/server.js

const http = require('http')
const crypto = require('crypto')
const Razorpay = require('razorpay')
const path = require('path')
const fs = require('fs')

// Load environment variables from .env or .env.local if present
function loadEnvFile(filePath) {
  if (fs.existsSync(filePath)) {
    const lines = fs.readFileSync(filePath, 'utf8').split('\n')
    for (const line of lines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/)
      if (match) {
        const key = match[1]
        let value = match[2] || ''
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1)
        if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1)
        if (!process.env[key]) process.env[key] = value.trim()
      }
    }
  }
}

loadEnvFile(path.join(__dirname, '../frontend/.env.local'))
loadEnvFile(path.join(__dirname, '../frontend/.env'))
loadEnvFile(path.join(__dirname, '.env'))

const PORT = process.env.PORT || 5000
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_TleIyHZJw45OdI'
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'EZeEYnyr3CB2lDcS9ZmMQZTs'

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
})

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  const url = req.url.split('?')[0]

  if (req.method === 'POST' && url === '/api/create-order') {
    let body = ''
    req.on('data', (chunk) => { body += chunk })
    req.on('end', async () => {
      try {
        const parsed = body ? JSON.parse(body) : {}
        const amount = Number(parsed.amount)
        const currency = parsed.currency || 'INR'
        const receipt = parsed.receipt || `rcpt_${Date.now()}`

        // Validate amount >= 100 paise
        if (!amount || amount < 100) {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Amount must be at least 100 paise (1 INR)' }))
          return
        }

        const order = await razorpay.orders.create({
          amount: Math.round(amount),
          currency,
          receipt,
        })

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({
          order_id: order.id,
          amount: order.amount,
          currency: order.currency,
        }))
      } catch (err) {
        console.error('Order creation error:', err)
        res.writeHead(err.statusCode || 500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: err.message || 'Failed to create Razorpay order' }))
      }
    })
    return
  }

  if (req.method === 'POST' && url === '/api/verify-payment') {
    let body = ''
    req.on('data', (chunk) => { body += chunk })
    req.on('end', () => {
      try {
        const parsed = body ? JSON.parse(body) : {}
        const order_id = parsed.razorpay_order_id || parsed.order_id
        const payment_id = parsed.razorpay_payment_id || parsed.payment_id
        const signature = parsed.razorpay_signature || parsed.signature

        if (!order_id || !payment_id || !signature) {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'order_id, payment_id, and signature are required' }))
          return
        }

        const expectedSignature = crypto
          .createHmac('sha256', RAZORPAY_KEY_SECRET)
          .update(`${order_id}|${payment_id}`)
          .digest('hex')

        if (expectedSignature === signature) {
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ success: true, message: 'Payment verified successfully' }))
        } else {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ success: false, error: 'Signature verification failed' }))
        }
      } catch (err) {
        console.error('Verification error:', err)
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ success: false, error: err.message }))
      }
    })
    return
  }

  res.writeHead(404, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ error: 'Not Found' }))
})

server.listen(PORT, () => {
  console.log(`Razorpay backend listening on http://localhost:${PORT}`)
})
