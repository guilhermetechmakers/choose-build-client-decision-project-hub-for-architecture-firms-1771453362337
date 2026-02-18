import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AuthLayout } from '@/layouts/auth-layout'
import { DashboardLayout } from '@/layouts/dashboard-layout'
import { Login } from '@/pages/auth/login'
import { Signup } from '@/pages/auth/signup'
import LoginSignupPage from '@/pages/Login/Signup'
import { ForgotPassword } from '@/pages/auth/forgot-password'
import { ResetPassword } from '@/pages/auth/reset-password'
import { VerifyEmail } from '@/pages/auth/verify-email'
import { Landing } from '@/pages/landing'
import { DashboardOverview } from '@/pages/dashboard/overview'
import { ProjectsList } from '@/pages/dashboard/projects-list'
import { NewProject } from '@/pages/dashboard/new-project'
import { ProjectBoard } from '@/pages/dashboard/project-board'
import DecisionLogPage from '@/pages/DecisionLog'
import { DecisionLog } from '@/pages/dashboard/decision-log'
import { CreateDecision } from '@/pages/dashboard/create-decision'
import { Messages } from '@/pages/dashboard/messages'
import { MessagesOverview } from '@/pages/dashboard/messages-overview'
import { FilesDrawings } from '@/pages/dashboard/files-drawings'
import { FilesOverview } from '@/pages/dashboard/files-overview'
import { Meetings } from '@/pages/dashboard/meetings'
import { Templates } from '@/pages/dashboard/templates'
import { Reports } from '@/pages/dashboard/reports'
import { Billing } from '@/pages/dashboard/billing'
import { Orders } from '@/pages/dashboard/orders'
import { Settings } from '@/pages/dashboard/settings'
import { Users } from '@/pages/dashboard/users'
import { AdminDashboard } from '@/pages/admin/dashboard'
import { AdminUsers } from '@/pages/admin/users'
import { Privacy } from '@/pages/legal/privacy'
import { Terms } from '@/pages/legal/terms'
import { Cookies } from '@/pages/legal/cookies'
import { Help } from '@/pages/help'
import { About } from '@/pages/about'
import { NotFound } from '@/pages/not-found'
import { ServerError } from '@/pages/server-error'

export const router = createBrowserRouter([
  { path: '/', element: <Landing /> },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/signup', element: <Signup /> },
      { path: '/login-signup', element: <LoginSignupPage /> },
      { path: '/login-/-signup', element: <LoginSignupPage /> },
      { path: '/forgot-password', element: <ForgotPassword /> },
      { path: '/reset-password', element: <ResetPassword /> },
      { path: '/verify-email', element: <VerifyEmail /> },
    ],
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DashboardOverview /> },
      { path: 'decision-log', element: <DecisionLogPage /> },
      { path: 'projects', element: <ProjectsList /> },
      { path: 'projects/new', element: <NewProject /> },
      { path: 'projects/:projectId', element: <ProjectBoard /> },
      { path: 'projects/:projectId/decisions', element: <DecisionLog /> },
      { path: 'projects/:projectId/decisions/:decisionId', element: <DecisionLog /> },
      { path: 'projects/:projectId/decisions/new', element: <CreateDecision /> },
      { path: 'messages', element: <MessagesOverview /> },
      { path: 'files', element: <FilesOverview /> },
      { path: 'projects/:projectId/messages', element: <Messages /> },
      { path: 'projects/:projectId/files', element: <FilesDrawings /> },
      { path: 'projects/:projectId/meetings', element: <Meetings /> },
      { path: 'templates', element: <Templates /> },
      { path: 'reports', element: <Reports /> },
      { path: 'billing', element: <Billing /> },
      { path: 'orders', element: <Orders /> },
      { path: 'settings', element: <Settings /> },
      { path: 'users', element: <Users /> },
    ],
  },
  { path: '/decision-log', element: <Navigate to="/dashboard/decision-log" replace /> },
  { path: '/admin', element: <AdminDashboard /> },
  { path: '/admin/users', element: <AdminUsers /> },
  { path: '/decision-log', element: <Navigate to="/dashboard/decision-log" replace /> },
  { path: '/privacy', element: <Privacy /> },
  { path: '/terms', element: <Terms /> },
  { path: '/cookies', element: <Cookies /> },
  { path: '/help', element: <Help /> },
  { path: '/about', element: <About /> },
  { path: '/500', element: <ServerError /> },
  { path: '*', element: <NotFound /> },
])
