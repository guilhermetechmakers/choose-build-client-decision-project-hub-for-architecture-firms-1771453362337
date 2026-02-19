// Supabase Edge Function: auth-invite-verify
// Handles POST body: { token } or GET query: ?token=...
// Returns: { valid: boolean, email?: string } for invite token verification (e.g. client invite flow).

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    let token: string | null = null
    if (req.method === 'POST') {
      const body = (await req.json()) as { token?: string }
      token = body?.token ?? null
    } else {
      const url = new URL(req.url)
      token = url.searchParams.get('token')
    }

    if (!token || typeof token !== 'string' || !token.trim()) {
      return new Response(
        JSON.stringify({ valid: false, message: 'Token is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Stub: in production, verify token against invites table and return email if valid
    // For now, accept any non-empty token and do not expose email for security
    const trimmed = token.trim()
    const valid = trimmed.length > 0

    return new Response(
      JSON.stringify({ valid, ...(valid ? {} : {}) }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (e) {
    return new Response(
      JSON.stringify({
        valid: false,
        message: e instanceof Error ? e.message : 'Verification failed',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
