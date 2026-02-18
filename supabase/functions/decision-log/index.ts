// Supabase Edge Function: decision-log
// Server-side only: list decisions, get detail (versions/audit/related), submit approval, download version.
// Client calls via supabase.functions.invoke('decision-log', { body: { action, ... } })

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type ListPayload = {
  action: 'list'
  projectId: string
  status?: string
  phase?: string
  assignee?: string
  costImpact?: 'any' | 'none' | 'positive'
  sortBy?: 'date' | 'status' | 'cost' | 'title' | 'phase'
  sortOrder?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

type DetailPayload = {
  action: 'detail'
  projectId: string
  decisionId: string
}

type ApprovePayload = {
  action: 'approve'
  projectId: string
  decisionId: string
  versionId: string
  approvalAction: 'approve' | 'request_change' | 'ask_question'
  comment?: string
}

type DownloadPayload = {
  action: 'download'
  projectId: string
  decisionId: string
  versionId: string
}

type Payload = ListPayload | DetailPayload | ApprovePayload | DownloadPayload

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

    if (action === 'list') {
      const { projectId, status, phase, assignee, costImpact, sortBy, sortOrder, page = 1, pageSize = 50 } = body as ListPayload
      if (!projectId) {
        return new Response(
          JSON.stringify({ message: 'projectId is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      // Placeholder: in production query decision_log or project-scoped decisions table with filters/sort
      const items: unknown[] = []
      const total = 0
      return new Response(
        JSON.stringify({ items, total, page, pageSize }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'detail') {
      const { projectId, decisionId } = body as DetailPayload
      if (!projectId || !decisionId) {
        return new Response(
          JSON.stringify({ message: 'projectId and decisionId are required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      const decision = {
        id: decisionId,
        projectId,
        title: '',
        status: 'pending',
        options: [],
      }
      const versions: unknown[] = []
      const auditLog: unknown[] = []
      const relatedItems: unknown[] = []
      return new Response(
        JSON.stringify({ decision, versions, auditLog, relatedItems }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'approve') {
      const { projectId, decisionId, versionId, approvalAction, comment } = body as ApprovePayload
      if (!projectId || !decisionId || !versionId || !approvalAction) {
        return new Response(
          JSON.stringify({ message: 'projectId, decisionId, versionId and approvalAction are required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      const approval = {
        id: crypto.randomUUID(),
        decisionId,
        versionId,
        userId: user.id,
        userName: user.email ?? 'User',
        action: approvalAction === 'approve' ? 'approved' : approvalAction === 'request_change' ? 'request_change' : 'ask_question',
        comment,
        createdAt: new Date().toISOString(),
      }
      return new Response(
        JSON.stringify({ success: true, approval }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'download') {
      const { projectId, decisionId, versionId } = body as DownloadPayload
      if (!projectId || !decisionId || !versionId) {
        return new Response(
          JSON.stringify({ message: 'projectId, decisionId and versionId are required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      // Placeholder: generate signed URL from storage or return static URL
      const url = ''
      return new Response(
        JSON.stringify({ url }),
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
