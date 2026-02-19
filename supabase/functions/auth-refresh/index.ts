// Supabase Edge Function: auth-refresh
// Handles POST with body {} and Authorization: Bearer <refresh_token> or Cookie.
// Returns: { session: { user, access_token, ... } }.

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
    const body = req.method === 'POST' ? ((await req.json()) as { refresh_token?: string }) : {}
    const refreshToken = body?.refresh_token ?? req.headers.get('Authorization')?.replace(/^Bearer\s+/i, '')
    if (!refreshToken) {
      return new Response(
        JSON.stringify({ message: 'Refresh token required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken })

    if (error || !data.session) {
      return new Response(
        JSON.stringify({ message: error?.message ?? 'Refresh failed' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const session = data.session
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
      JSON.stringify({ message: e instanceof Error ? e.message : 'Refresh failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
