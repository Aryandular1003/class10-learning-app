import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { handleCreateOrder, handleVerifySignature } from './src/server/razorpayApi.js'

function razorpayDevPlugin() {
  return {
    name: 'razorpay-api-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0]
        if (req.method === 'POST' && (url === '/api/create-order' || url === '/api/verify-payment')) {
          let body = ''
          req.on('data', (chunk) => {
            body += chunk
          })
          req.on('end', async () => {
            try {
              const parsed = body ? JSON.parse(body) : {}
              res.setHeader('Content-Type', 'application/json')
              if (url === '/api/create-order') {
                const order = await handleCreateOrder(parsed)
                res.statusCode = 200
                res.end(JSON.stringify(order))
              } else if (url === '/api/verify-payment') {
                const result = handleVerifySignature(parsed)
                res.statusCode = 200
                res.end(JSON.stringify(result))
              }
            } catch (err) {
              res.statusCode = err.statusCode || 500
              res.end(JSON.stringify({ error: err.message, success: false }))
            }
          })
          return
        }
        next()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  process.env.RAZORPAY_KEY_ID = env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID
  process.env.RAZORPAY_KEY_SECRET = env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET

  return {
    plugins: [react(), razorpayDevPlugin()],
  }
})
