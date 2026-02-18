import { getSupabase } from '@/lib/supabase'

export interface DashboardProject {
  id: string
  name: string
  status: string
  phase: string
  progress: number
  pendingApprovals: number
  updatedAt: string
}

export interface PendingApprovalCard {
  id: string
  projectId: string
  projectName: string
  title: string
  status: string
}

export interface ActivityEvent {
  action: string
  project: string
  projectId: string
  time: string
}

export interface UpcomingMeeting {
  id: string
  title: string
  start: string
  projectId: string
}

export interface DashboardOverview {
  projects: DashboardProject[]
  pendingApprovals: PendingApprovalCard[]
  activity: ActivityEvent[]
  upcomingMeetings: UpcomingMeeting[]
}

const MOCK_OVERVIEW: DashboardOverview = {
  projects: [
    { id: '1', name: 'Riverside Residence', status: 'active', phase: 'DD', progress: 80, pendingApprovals: 2, updatedAt: new Date().toISOString() },
    { id: '2', name: 'Commerce Tower', status: 'active', phase: 'CA', progress: 45, pendingApprovals: 0, updatedAt: new Date().toISOString() },
    { id: '3', name: 'Park View Loft', status: 'active', phase: 'Schematic', progress: 100, pendingApprovals: 1, updatedAt: new Date().toISOString() },
  ],
  pendingApprovals: [
    { id: 'd1', projectId: '1', projectName: 'Riverside Residence', title: 'Kitchen fixture selection', status: 'pending' },
    { id: 'd2', projectId: '3', projectName: 'Park View Loft', title: 'Exterior material approval', status: 'pending' },
  ],
  activity: [
    { action: 'Approval received', project: 'Riverside Residence', projectId: '1', time: '2 hours ago' },
    { action: 'Decision published', project: 'Park View Loft', projectId: '3', time: '5 hours ago' },
    { action: 'New comment', project: 'Commerce Tower', projectId: '2', time: '1 day ago' },
  ],
  upcomingMeetings: [
    { id: 'm1', title: 'Design review', start: new Date(Date.now() + 86400000).toISOString(), projectId: '1' },
    { id: 'm2', title: 'Client sign-off', start: new Date(Date.now() + 172800000).toISOString(), projectId: '2' },
  ],
}

export async function getDashboardOverview(): Promise<DashboardOverview> {
  const supabase = getSupabase()
  if (!supabase) {
    return MOCK_OVERVIEW
  }
  try {
    const { data, error } = await supabase.functions.invoke<DashboardOverview>('dashboard', {
      body: { action: 'getOverview' },
    })
    if (error) throw error
    if (!data) return MOCK_OVERVIEW
    return data
  } catch {
    return MOCK_OVERVIEW
  }
}
