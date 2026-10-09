// Supabase Edge Function: razorpay-webhook
// Asynchronous webhook receiver configured in Razorpay Dashboard
// (Events: order.paid, payment.captured)

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

async function verifyWebhookSignature(rawBody: string, signature: string, secret: string): Promise<boolean> {
  const encoder = new TextEncoder()
  const data = encoder.encode(rawBody)
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signatureBytes = await crypto.subtle.sign('HMAC', key, data)
  const hex = Array.from(new Uint8Array(signatureBytes))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  return hex.toLowerCase() === signature.toLowerCase()
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const webhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET') || ''
    const signature = req.headers.get('x-razorpay-signature') || ''

    const rawBody = await req.text()

    if (webhookSecret) {
      const isValid = await verifyWebhookSignature(rawBody, signature, webhookSecret)
      if (!isValid) {
        console.error('Invalid Razorpay webhook signature')
        return new Response('Invalid signature', { status: 400 })
      }
    }

    const payload = JSON.parse(rawBody)
    const event = payload.event

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    if (event === 'order.paid' || event === 'payment.captured') {
      const paymentEntity = payload.payload?.payment?.entity
      const orderId = paymentEntity?.order_id
      const paymentId = paymentEntity?.id

      if (orderId) {
        const nowIso = new Date().toISOString()

        // Update payment row
        const { data: paymentRow } = await supabaseAdmin
          .from('payments')
          .update({
            razorpay_payment_id: paymentId,
            status: 'captured',
            updated_at: nowIso,
          })
          .eq('razorpay_order_id', orderId)
          .select('user_id')
          .maybeSingle()

        if (paymentRow?.user_id) {
          await supabaseAdmin
            .from('profiles')
            .update({
              is_premium: true,
              premium_since: nowIso,
            })
            .eq('id', paymentRow.user_id)
        }
      }
    }

    return new Response(JSON.stringify({ status: 'ok' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})
