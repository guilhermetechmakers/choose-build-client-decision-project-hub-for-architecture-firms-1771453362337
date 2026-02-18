import { api } from '@/lib/api'
import type {
  AuthSession,
  LoginResponse,
  SignupResponse,
  SignInInput,
  SignUpInput,
  FirmSignupInput,
} from '@/types/auth'

export const authApi = {
  signIn: async (input: SignInInput): Promise<LoginResponse> => {
    const data = await api.post<LoginResponse>('/auth/login', {
      email: input.email,
      password: input.password,
      remember_me: input.remember_me ?? false,
    })
    if (data.session?.access_token) {
      localStorage.setItem('access_token', data.session.access_token)
      if (data.session.refresh_token) {
        localStorage.setItem('refresh_token', data.session.refresh_token)
      }
    }
    return data
  },

  signUp: async (input: SignUpInput): Promise<SignupResponse> => {
    const body: Record<string, unknown> = {
      email: input.email,
      password: input.password,
      name: input.name,
    }
    if (input.invite_token) body.invite_token = input.invite_token
    const data = await api.post<SignupResponse>('/auth/signup', body)
    if (data.session?.access_token) {
      localStorage.setItem('access_token', data.session.access_token)
      if (data.session.refresh_token) {
        localStorage.setItem('refresh_token', data.session.refresh_token)
      }
    }
    return data
  },

  firmSignup: async (input: FirmSignupInput): Promise<{ message?: string }> => {
    return api.post<{ message?: string }>('/auth/signup', {
      company_name: input.company_name,
      admin_email: input.admin_email,
      admin_name: input.admin_name,
    })
  },

  signOut: async (): Promise<void> => {
    try {
      await api.post('/auth/logout', {})
    } finally {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    }
  },

  getSession: async (): Promise<AuthSession | null> => {
    const data = await api.get<{ session: AuthSession } | null>('/auth/session')
    return data?.session ?? null
  },

  refresh: async (): Promise<LoginResponse> => {
    const data = await api.post<LoginResponse>('/auth/refresh', {})
    if (data.session?.access_token) {
      localStorage.setItem('access_token', data.session.access_token)
      if (data.session.refresh_token) {
        localStorage.setItem('refresh_token', data.session.refresh_token)
      }
    }
    return data
  },

  verifyInviteToken: async (token: string): Promise<{ valid: boolean; email?: string }> => {
    return api.get(`/auth/invite/verify?token=${encodeURIComponent(token)}`)
  },
}
