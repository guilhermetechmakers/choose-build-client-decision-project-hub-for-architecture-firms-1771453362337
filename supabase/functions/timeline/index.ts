// Supabase Edge Function: timeline
// Server-side: fetch/update project timeline (phases, milestones, decision checkpoints).
// Client calls via supabase.functions.invoke('timeline', { body: { action, projectId, ... } })

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const PHASE_LABELS: Record<string, string> = {
  kickoff: 'Kickoff',
  concept: 'Concept',
  schematic: 'Schematic',
  dd: 'DD',
  permitting: 'Permitting',
  ca: 'CA',
  handover: 'Handover',
}

const PHASE_ORDER = ['kickoff', 'concept', 'schematic', 'dd', 'permitting', 'ca', 'handover']

type GetTimelinePayload = { action: 'getTimeline'; projectId: string }
type UpdatePhasePayload = {
  action: 'updatePhase'
  projectId: string
  phaseId: string
  percentComplete?: number
  startDate?: string
  endDate?: string
}
type ListMilestonesPayload = { action: 'listMilestones'; projectId: string; filter?: string }
type CreateMilestonePayload = {
  action: 'createMilestone'
  projectId: string
  phaseId: string
  name: string
  dueDate: string
  assigneeId?: string
  decisionId?: string
  orderIndex?: number
}
type UpdateMilestonePayload = {
  action: 'updateMilestone'
  projectId: string
  milestoneId: string
  name?: string
  dueDate?: string
  phaseId?: string
  assigneeId?: string
  status?: string
  decisionId?: string
  orderIndex?: number
}
type DeleteMilestonePayload = { action: 'deleteMilestone'; projectId: string; milestoneId: string }
type ReschedulePayload = { action: 'reschedule'; projectId: string; milestoneId: string; dueDate: string }
type AddCheckpointPayload = {
  action: 'addCheckpoint'
  projectId: string
  decisionId: string
  phaseId: string
  orderIndex?: number
}
type RemoveCheckpointPayload = { action: 'removeCheckpoint'; projectId: string; decisionId: string }

type Payload =
  | GetTimelinePayload
  | UpdatePhasePayload
  | ListMilestonesPayload
  | CreateMilestonePayload
  | UpdateMilestonePayload
  | DeleteMilestonePayload
  | ReschedulePayload
  | AddCheckpointPayload
  | RemoveCheckpointPayload

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

    const body = (await req.json()) as Payload
    const action = body?.action

    if (action === 'getTimeline') {
      const { projectId } = body as GetTimelinePayload
      if (!projectId) {
        return new Response(
          JSON.stringify({ message: 'projectId is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      const { data: project } = await supabase.from('projects').select('id, name').eq('id', projectId).single()
      const projectName = project?.name ?? 'Project'
      const { data: phasesRows } = await supabase
        .from('project_phases')
        .select('*')
        .eq('project_id', projectId)
        .order('order_index', { ascending: true })
      const phases = (phasesRows ?? []).length
        ? phasesRows!.map((p: { id: string; phase_id: string; label: string; order_index: number; percent_complete: number; start_date: string | null; end_date: string | null; updated_at: string }) => ({
            id: p.id,
            projectId,
            phaseId: p.phase_id,
            label: p.label,
            orderIndex: p.order_index,
            percentComplete: p.percent_complete,
            startDate: p.start_date ?? undefined,
            endDate: p.end_date ?? undefined,
            updatedAt: p.updated_at,
          }))
        : PHASE_ORDER.map((phaseId, i) => ({
            id: '',
            projectId,
            phaseId,
            label: PHASE_LABELS[phaseId] ?? phaseId,
            orderIndex: i,
            percentComplete: 0,
            updatedAt: new Date().toISOString(),
          }))
      const { data: milestonesRows } = await supabase
        .from('project_milestones')
        .select('*')
        .eq('project_id', projectId)
        .order('order_index', { ascending: true })
      const milestones = (milestonesRows ?? []).map((m: { id: string; project_id: string; phase_id: string; name: string; due_date: string; assignee_id: string | null; status: string; decision_id: string | null; order_index: number; created_at: string; updated_at: string }) => ({
        id: m.id,
        projectId: m.project_id,
        phaseId: m.phase_id,
        name: m.name,
        dueDate: m.due_date,
        assigneeId: m.assignee_id ?? undefined,
        assigneeName: undefined,
        status: m.status as 'upcoming' | 'in_progress' | 'completed' | 'overdue',
        decisionId: m.decision_id ?? undefined,
        orderIndex: m.order_index,
        createdAt: m.created_at,
        updatedAt: m.updated_at,
      }))
      const { data: checkpointsRows } = await supabase
        .from('decision_checkpoints')
        .select('*')
        .eq('project_id', projectId)
        .order('order_index', { ascending: true })
      const decisionCheckpoints = (checkpointsRows ?? []).map((c: { id: string; project_id: string; decision_id: string; phase_id: string; order_index: number }) => ({
        id: c.id,
        projectId: c.project_id,
        decisionId: c.decision_id,
        decisionTitle: '',
        phaseId: c.phase_id,
        status: 'pending',
        orderIndex: c.order_index,
      }))
      return new Response(
        JSON.stringify({
          projectId,
          projectName,
          phases,
          milestones,
          decisionCheckpoints,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'updatePhase') {
      const { projectId, phaseId, percentComplete, startDate, endDate } = body as UpdatePhasePayload
      if (!projectId || !phaseId) {
        return new Response(
          JSON.stringify({ message: 'projectId and phaseId are required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      const label = PHASE_LABELS[phaseId] ?? phaseId
      const orderIndex = PHASE_ORDER.indexOf(phaseId) >= 0 ? PHASE_ORDER.indexOf(phaseId) : 0
      const { error } = await supabase.from('project_phases').upsert(
        {
          project_id: projectId,
          phase_id: phaseId,
          label,
          order_index: orderIndex,
          percent_complete: percentComplete ?? 0,
          start_date: startDate ?? null,
          end_date: endDate ?? null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'project_id,phase_id' }
      )
      if (error) {
        return new Response(
          JSON.stringify({ message: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'listMilestones') {
      const { projectId } = body as ListMilestonesPayload
      if (!projectId) {
        return new Response(
          JSON.stringify({ message: 'projectId is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      let q = supabase.from('project_milestones').select('*').eq('project_id', projectId).order('order_index', { ascending: true })
      const { data } = await q
      const milestones = (data ?? []).map((m: { id: string; project_id: string; phase_id: string; name: string; due_date: string; assignee_id: string | null; status: string; decision_id: string | null; order_index: number; created_at: string; updated_at: string }) => ({
        id: m.id,
        projectId: m.project_id,
        phaseId: m.phase_id,
        name: m.name,
        dueDate: m.due_date,
        assigneeId: m.assignee_id ?? undefined,
        status: m.status,
        decisionId: m.decision_id ?? undefined,
        orderIndex: m.order_index,
        createdAt: m.created_at,
        updatedAt: m.updated_at,
      }))
      return new Response(
        JSON.stringify({ milestones }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'createMilestone') {
      const { projectId, phaseId, name, dueDate, assigneeId, decisionId, orderIndex } = body as CreateMilestonePayload
      if (!projectId || !phaseId || !name || !dueDate) {
        return new Response(
          JSON.stringify({ message: 'projectId, phaseId, name and dueDate are required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      const { data: inserted, error } = await supabase
        .from('project_milestones')
        .insert({
          project_id: projectId,
          phase_id: phaseId,
          name,
          due_date: dueDate,
          assignee_id: assigneeId ?? null,
          status: 'upcoming',
          decision_id: decisionId ?? null,
          order_index: orderIndex ?? 0,
        })
        .select('id')
        .single()
      if (error) {
        return new Response(
          JSON.stringify({ message: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      return new Response(
        JSON.stringify({ success: true, id: inserted?.id }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'updateMilestone') {
      const { projectId, milestoneId, name, dueDate, phaseId, assigneeId, status, decisionId, orderIndex } = body as UpdateMilestonePayload
      if (!projectId || !milestoneId) {
        return new Response(
          JSON.stringify({ message: 'projectId and milestoneId are required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
      if (name !== undefined) updates.name = name
      if (dueDate !== undefined) updates.due_date = dueDate
      if (phaseId !== undefined) updates.phase_id = phaseId
      if (assigneeId !== undefined) updates.assignee_id = assigneeId ?? null
      if (status !== undefined) updates.status = status
      if (decisionId !== undefined) updates.decision_id = decisionId ?? null
      if (orderIndex !== undefined) updates.order_index = orderIndex
      const { error } = await supabase
        .from('project_milestones')
        .update(updates)
        .eq('id', milestoneId)
        .eq('project_id', projectId)
      if (error) {
        return new Response(
          JSON.stringify({ message: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'deleteMilestone') {
      const { projectId, milestoneId } = body as DeleteMilestonePayload
      if (!projectId || !milestoneId) {
        return new Response(
          JSON.stringify({ message: 'projectId and milestoneId are required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      const { error } = await supabase
        .from('project_milestones')
        .delete()
        .eq('id', milestoneId)
        .eq('project_id', projectId)
      if (error) {
        return new Response(
          JSON.stringify({ message: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'reschedule') {
      const { projectId, milestoneId, dueDate } = body as ReschedulePayload
      if (!projectId || !milestoneId || !dueDate) {
        return new Response(
          JSON.stringify({ message: 'projectId, milestoneId and dueDate are required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      const { error } = await supabase
        .from('project_milestones')
        .update({ due_date: dueDate, updated_at: new Date().toISOString() })
        .eq('id', milestoneId)
        .eq('project_id', projectId)
      if (error) {
        return new Response(
          JSON.stringify({ message: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'addCheckpoint') {
      const { projectId, decisionId, phaseId, orderIndex } = body as AddCheckpointPayload
      if (!projectId || !decisionId || !phaseId) {
        return new Response(
          JSON.stringify({ message: 'projectId, decisionId and phaseId are required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      const { error } = await supabase.from('decision_checkpoints').upsert(
        {
          project_id: projectId,
          decision_id: decisionId,
          phase_id: phaseId,
          order_index: orderIndex ?? 0,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'project_id,decision_id' }
      )
      if (error) {
        return new Response(
          JSON.stringify({ message: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'removeCheckpoint') {
      const { projectId, decisionId } = body as RemoveCheckpointPayload
      if (!projectId || !decisionId) {
        return new Response(
          JSON.stringify({ message: 'projectId and decisionId are required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      const { error } = await supabase
        .from('decision_checkpoints')
        .delete()
        .eq('project_id', projectId)
        .eq('decision_id', decisionId)
      if (error) {
        return new Response(
          JSON.stringify({ message: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ message: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (e) {
    return new Response(
      JSON.stringify({ message: e instanceof Error ? e.message : 'Request failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
