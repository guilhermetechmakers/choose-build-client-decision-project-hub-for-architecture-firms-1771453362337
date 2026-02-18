import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as timelineApi from '@/api/timeline'

const timelineKey = (projectId: string) => ['timeline', projectId] as const

export function useTimeline(projectId: string | undefined) {
  return useQuery({
    queryKey: timelineKey(projectId ?? ''),
    queryFn: () => timelineApi.getTimeline(projectId!),
    enabled: Boolean(projectId),
  })
}

export function useUpdatePhase(projectId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: { phaseId: string; percentComplete?: number; startDate?: string; endDate?: string }) =>
      timelineApi.updatePhase(projectId, payload.phaseId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: timelineKey(projectId) }),
  })
}

export function useCreateMilestone(projectId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: { phaseId: string; name: string; dueDate: string; assigneeId?: string; decisionId?: string; orderIndex?: number }) =>
      timelineApi.createMilestone(projectId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: timelineKey(projectId) }),
  })
}

export function useUpdateMilestone(projectId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ milestoneId, ...payload }: { milestoneId: string } & Parameters<typeof timelineApi.updateMilestone>[2]) =>
      timelineApi.updateMilestone(projectId, milestoneId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: timelineKey(projectId) }),
  })
}

export function useDeleteMilestone(projectId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (milestoneId: string) => timelineApi.deleteMilestone(projectId, milestoneId),
    onSuccess: () => qc.invalidateQueries({ queryKey: timelineKey(projectId) }),
  })
}

export function useRescheduleMilestone(projectId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ milestoneId, dueDate }: { milestoneId: string; dueDate: string }) =>
      timelineApi.rescheduleMilestone(projectId, milestoneId, dueDate),
    onSuccess: () => qc.invalidateQueries({ queryKey: timelineKey(projectId) }),
  })
}

export function useAddCheckpoint(projectId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ decisionId, phaseId, orderIndex }: { decisionId: string; phaseId: string; orderIndex?: number }) =>
      timelineApi.addDecisionCheckpoint(projectId, decisionId, phaseId, orderIndex),
    onSuccess: () => qc.invalidateQueries({ queryKey: timelineKey(projectId) }),
  })
}

export function useRemoveCheckpoint(projectId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (decisionId: string) => timelineApi.removeDecisionCheckpoint(projectId, decisionId),
    onSuccess: () => qc.invalidateQueries({ queryKey: timelineKey(projectId) }),
  })
}
