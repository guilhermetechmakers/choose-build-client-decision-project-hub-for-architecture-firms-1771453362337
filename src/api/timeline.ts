import { getSupabase } from '@/lib/supabase'
import type {
  ProjectTimeline,
  ProjectMilestone,
} from '@/types'
import { PROJECT_PHASE_IDS } from '@/types'

function mockTimeline(projectId: string): ProjectTimeline {
  const phaseLabels: Record<string, string> = {
    kickoff: 'Kickoff',
    concept: 'Concept',
    schematic: 'Schematic',
    dd: 'DD',
    permitting: 'Permitting',
    ca: 'CA',
    handover: 'Handover',
  }
  return {
    projectId,
    projectName: 'Project',
    phases: PROJECT_PHASE_IDS.map((id, i) => ({
      id: id,
      projectId,
      phaseId: id,
      label: phaseLabels[id] ?? id,
      orderIndex: i,
      percentComplete: id === 'dd' ? 80 : ['kickoff', 'concept', 'schematic'].includes(id) ? 100 : 0,
      updatedAt: new Date().toISOString(),
    })),
    milestones: [],
    decisionCheckpoints: [],
  }
}

async function invokeTimeline<T>(body: Record<string, unknown>): Promise<T> {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase.functions.invoke<T>('timeline', { body })
  if (error) throw error
  if (data == null) throw new Error('No response from timeline')
  return data
}

export function getTimeline(projectId: string): Promise<ProjectTimeline> {
  const supabase = getSupabase()
  if (!supabase) return Promise.resolve(mockTimeline(projectId))
  return invokeTimeline<ProjectTimeline>({ action: 'getTimeline', projectId })
}

export function updatePhase(
  projectId: string,
  phaseId: string,
  payload: { percentComplete?: number; startDate?: string; endDate?: string }
): Promise<{ success: boolean }> {
  return invokeTimeline<{ success: boolean }>({
    action: 'updatePhase',
    projectId,
    phaseId,
    ...payload,
  })
}

export function listMilestones(
  projectId: string,
  filter?: string
): Promise<{ milestones: ProjectMilestone[] }> {
  return invokeTimeline<{ milestones: ProjectMilestone[] }>({
    action: 'listMilestones',
    projectId,
    filter,
  })
}

export function createMilestone(
  projectId: string,
  payload: {
    phaseId: string
    name: string
    dueDate: string
    assigneeId?: string
    decisionId?: string
    orderIndex?: number
  }
): Promise<{ success: boolean; id?: string }> {
  return invokeTimeline<{ success: boolean; id?: string }>({
    action: 'createMilestone',
    projectId,
    ...payload,
  })
}

export function updateMilestone(
  projectId: string,
  milestoneId: string,
  payload: Partial<{
    name: string
    dueDate: string
    phaseId: string
    assigneeId: string
    status: string
    decisionId: string
    orderIndex: number
  }>
): Promise<{ success: boolean }> {
  return invokeTimeline<{ success: boolean }>({
    action: 'updateMilestone',
    projectId,
    milestoneId,
    ...payload,
  })
}

export function deleteMilestone(
  projectId: string,
  milestoneId: string
): Promise<{ success: boolean }> {
  return invokeTimeline<{ success: boolean }>({
    action: 'deleteMilestone',
    projectId,
    milestoneId,
  })
}

export function rescheduleMilestone(
  projectId: string,
  milestoneId: string,
  dueDate: string
): Promise<{ success: boolean }> {
  return invokeTimeline<{ success: boolean }>({
    action: 'reschedule',
    projectId,
    milestoneId,
    dueDate,
  })
}

export function addDecisionCheckpoint(
  projectId: string,
  decisionId: string,
  phaseId: string,
  orderIndex?: number
): Promise<{ success: boolean }> {
  return invokeTimeline<{ success: boolean }>({
    action: 'addCheckpoint',
    projectId,
    decisionId,
    phaseId,
    orderIndex,
  })
}

export function removeDecisionCheckpoint(
  projectId: string,
  decisionId: string
): Promise<{ success: boolean }> {
  return invokeTimeline<{ success: boolean }>({
    action: 'removeCheckpoint',
    projectId,
    decisionId,
  })
}
