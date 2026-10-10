// Supabase Edge Function: create-razorpay-order
// Authenticated endpoint that creates a server-side verified Razorpay Order
// and records it in the payments table.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
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
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID') || ''
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET') || ''

    if (!razorpayKeyId || !razorpayKeySecret) {
      return new Response(
        JSON.stringify({ error: 'Razorpay credentials are not configured in environment' }),
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

    // Authoritative pricing: Rs 199 = 19900 paise
    const fixedAmountInPaise = 19900
    const currency = 'INR'

    // Call Razorpay API to create an order
    const basicAuth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`)
    const rzpResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${basicAuth}`,
      },
      body: JSON.stringify({
        amount: fixedAmountInPaise,
        currency,
        receipt: `bready_${Date.now()}`,
        notes: {
          user_id: user.id,
          email: user.email || '',
          product: 'Class 10 RBSE Board Prep Unlock',
        },
      }),
    })

    if (!rzpResponse.ok) {
      const errBody = await rzpResponse.text()
      console.error('Razorpay order creation failed:', errBody)
      return new Response(
        JSON.stringify({ error: 'Failed to create Razorpay order', details: errBody }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const orderData = await rzpResponse.json()

    // Record order in payments table via service role
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
    const { error: dbError } = await supabaseAdmin.from('payments').insert({
      user_id: user.id,
      razorpay_order_id: orderData.id,
      amount: orderData.amount,
      currency: orderData.currency,
      status: 'created',
      package_name: 'Class 10 RBSE Board Prep',
      notes: {
        receipt: orderData.receipt,
        created_at: orderData.created_at,
      },
    })

    if (dbError) {
      console.error('Failed to log order in payments table:', dbError)
    }

    return new Response(
      JSON.stringify({
        orderId: orderData.id,
        amount: orderData.amount,
        currency: orderData.currency,
        keyId: razorpayKeyId,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    console.error('Unhandled order error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
