import { useQuery } from '@tanstack/react-query'
import { getDashboardOverview } from '@/api/dashboard'

const dashboardKey = ['dashboard', 'overview'] as const

export function useDashboardOverview() {
  return useQuery({
    queryKey: dashboardKey,
    queryFn: getDashboardOverview,
  })
}
