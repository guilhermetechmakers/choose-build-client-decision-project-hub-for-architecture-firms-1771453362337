/**
 * Main Dashboard page: project and workload overview for logged-in users.
 * Renders active projects, pending approvals, upcoming meetings, recent activity and KPIs.
 * Route: /dashboard (index)
 */
import { DashboardOverview } from '@/pages/dashboard/overview'

export default function Dashboard() {
  return <DashboardOverview />
}
