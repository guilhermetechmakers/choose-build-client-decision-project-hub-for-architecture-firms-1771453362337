// Supabase Edge Function: auth-signup
// Handles POST body: { email, password, name?, invite_token? } or { company_name, admin_email, admin_name } (firm request)
// Returns: { session?: { user, access_token, ... }, message?: string }

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = (await req.json()) as Record<string, unknown>
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Firm sign-up request (company name + admin contact)
    if (body.company_name && body.admin_email && body.admin_name) {
      // Stub: in production, create pending invite, send email, etc.
      return new Response(
        JSON.stringify({ message: 'Check your email to complete sign-up.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const email = body.email as string | undefined
    const password = body.password as string | undefined
    const name = body.name as string | undefined
    const inviteToken = body.invite_token as string | undefined

    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: 'Email and password are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: name ? { full_name: name } : undefined,
        emailRedirectTo: inviteToken
          ? `${Deno.env.get('SITE_URL') ?? ''}/signup?invite=${encodeURIComponent(inviteToken)}`
          : undefined,
      },
    })

    if (error) {
      return new Response(
        JSON.stringify({ message: error.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const session = data.session
    if (!session) {
      return new Response(
        JSON.stringify({
          message: 'Check your email to verify your account.',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({
        session: {
          user: { id: session.user.id, email: session.user.email },
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          expires_at: session.expires_at,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (e) {
    return new Response(
      JSON.stringify({ message: e instanceof Error ? e.message : 'Sign up failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
