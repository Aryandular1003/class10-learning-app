// Supabase Edge Function: verify-razorpay-payment
// Authenticated endpoint that verifies the Razorpay HMAC-SHA256 signature
// and upgrades the user's profile to is_premium = true using service_role.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function verifySignature(orderId: string, paymentId: string, signature: string, secret: string): Promise<boolean> {
  const encoder = new TextEncoder()
  const data = encoder.encode(`${orderId}|${paymentId}`)
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
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET') || ''

    if (!razorpayKeySecret) {
      return new Response(
        JSON.stringify({ error: 'RAZORPAY_KEY_SECRET is not configured on server' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // Verify authenticated user
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    })
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized user' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const body = await req.json()
    const {
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature,
    } = body

    if (!orderId || !paymentId || !signature) {
      return new Response(
        JSON.stringify({ error: 'Missing payment verification parameters (orderId, paymentId, or signature)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // Cryptographic verification
    const isValid = await verifySignature(orderId, paymentId, signature, razorpayKeySecret)
    if (!isValid) {
      console.error(`Invalid payment signature attempt for user ${user.id}, order ${orderId}`)
      return new Response(
        JSON.stringify({ success: false, error: 'Payment signature verification failed' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
    const nowIso = new Date().toISOString()

    // 1. Update payments table
    await supabaseAdmin
      .from('payments')
      .update({
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
        status: 'captured',
        updated_at: nowIso,
      })
      .eq('razorpay_order_id', orderId)

    // 2. Grant premium access on user profile
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({
        is_premium: true,
        premium_since: nowIso,
      })
      .eq('id', user.id)

    if (profileError) {
      console.error('Failed to grant premium on profile:', profileError)
      return new Response(
        JSON.stringify({ error: 'Payment verified, but failed to activate profile. Contact support.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Payment verified and Premium access granted!',
        paymentId,
        orderId,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    console.error('Unhandled payment verification error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
