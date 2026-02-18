// Supabase Edge Function: dashboard
// Server-side: overview data (projects with progress/phase, pending approvals, activity, upcoming meetings).
// Client calls via supabase.functions.invoke('dashboard', { body: { action: 'getOverview' } })

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
    const authHeader = req.headers.get('Authorization')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: authHeader ? { Authorization: authHeader } : {} },
    })

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return new Response(
        JSON.stringify({ message: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const body = (await req.json()) as { action?: string }
    if (body?.action !== 'getOverview') {
      return new Response(
        JSON.stringify({ message: 'Invalid action' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data: projectsRows } = await supabase
      .from('projects')
      .select('id, name, status, updated_at')
      .or(`created_by.eq.${user.id},created_by.is.null`)
      .order('updated_at', { ascending: false })

    const projectIds = (projectsRows ?? []).map((p: { id: string }) => p.id)
    const phasesByProject: Record<string, { phase: string; percentComplete: number }[]> = {}
    if (projectIds.length > 0) {
      const { data: phases } = await supabase
        .from('project_phases')
        .select('project_id, phase_id, label, percent_complete')
        .in('project_id', projectIds)
      for (const row of phases ?? []) {
        const pid = (row as { project_id: string }).project_id
        if (!phasesByProject[pid]) phasesByProject[pid] = []
        phasesByProject[pid].push({
          phase: (row as { label: string }).label,
          percentComplete: (row as { percent_complete: number }).percent_complete,
        })
      }
    }

    const projects = (projectsRows ?? []).map((p: { id: string; name: string; status: string; updated_at: string }) => {
      const phases = phasesByProject[p.id] ?? []
      const current = phases.find((x) => x.percentComplete < 100) ?? phases[phases.length - 1]
      return {
        id: p.id,
        name: p.name,
        status: p.status,
        phase: current?.phase ?? 'Kickoff',
        progress: current?.percentComplete ?? 0,
        pendingApprovals: 0,
        updatedAt: p.updated_at,
      }
    })

    const pendingApprovals: { id: string; projectId: string; projectName: string; title: string; status: string }[] = []
    const activity: { action: string; project: string; projectId: string; time: string }[] = []
    const upcomingMeetings: { id: string; title: string; start: string; projectId: string }[] = []

    return new Response(
      JSON.stringify({
        projects,
        pendingApprovals,
        activity,
        upcomingMeetings,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (e) {
    return new Response(
      JSON.stringify({ message: e instanceof Error ? e.message : 'Request failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
