import { api } from '@/lib/api'
import { getSupabase } from '@/lib/supabase'
import type {
  AuthSession,
  LoginResponse,
  SignupResponse,
  SignInInput,
  SignUpInput,
  FirmSignupInput,
} from '@/types/auth'

function setTokens(session: AuthSession): void {
  if (session.access_token) {
    localStorage.setItem('access_token', session.access_token)
    if (session.refresh_token) {
      localStorage.setItem('refresh_token', session.refresh_token)
    }
  }
}

async function invokeAuth<T>(
  name: string,
  body: Record<string, unknown>
): Promise<T> {
  const supabase = getSupabase()
  if (!supabase) {
    throw new Error('Supabase is not configured')
  }
  const { data, error } = await supabase.functions.invoke(name, { body })
  if (error) {
    const err = new Error((data as { message?: string })?.message ?? error.message) as Error & {
      status?: number
      code?: string
    }
    err.status = (data as { status?: number })?.status ?? 500
    err.code = (data as { code?: string })?.code
    throw err
  }
  const payload = data as T & { message?: string; status?: number }
  if (payload && typeof payload === 'object' && (payload.status ?? 0) >= 400) {
    const msg = (payload as { message?: string }).message ?? 'Request failed'
    const err = new Error(msg) as Error & { status?: number }
    err.status = (payload as { status?: number }).status
    throw err
  }
  return payload as T
}

export const authApi = {
  signIn: async (input: SignInInput): Promise<LoginResponse> => {
    const supabase = getSupabase()
    if (supabase) {
      const data = await invokeAuth<LoginResponse>('auth-login', {
        email: input.email,
        password: input.password,
        remember_me: input.remember_me ?? false,
      })
      if (data.session) setTokens(data.session)
      return data
    }
    const data = await api.post<LoginResponse>('/auth/login', {
      email: input.email,
      password: input.password,
      remember_me: input.remember_me ?? false,
    })
    if (data.session) setTokens(data.session)
    return data
  },

  signUp: async (input: SignUpInput): Promise<SignupResponse> => {
    const body: Record<string, unknown> = {
      email: input.email,
      password: input.password,
      name: input.name,
    }
    if (input.invite_token) body.invite_token = input.invite_token
    const supabase = getSupabase()
    if (supabase) {
      const data = await invokeAuth<SignupResponse>('auth-signup', body)
      if (data.session) setTokens(data.session)
      return data
    }
    const data = await api.post<SignupResponse>('/auth/signup', body)
    if (data.session) setTokens(data.session)
    return data
  },

  firmSignup: async (input: FirmSignupInput): Promise<{ message?: string }> => {
    const supabase = getSupabase()
    if (supabase) {
      return invokeAuth<{ message?: string }>('auth-signup', {
        company_name: input.company_name,
        admin_email: input.admin_email,
        admin_name: input.admin_name,
      })
    }
    return api.post<{ message?: string }>('/auth/signup', {
      company_name: input.company_name,
      admin_email: input.admin_email,
      admin_name: input.admin_name,
    })
  },

  signOut: async (): Promise<void> => {
    const supabase = getSupabase()
    const token = localStorage.getItem('access_token')
    if (supabase && token) {
      try {
        await invokeAuth<unknown>('auth-logout', { access_token: token })
      } catch {
        // ignore
      }
    } else {
      try {
        await api.post('/auth/logout', {})
      } catch {
        // ignore
      }
    }
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  },

  getSession: async (): Promise<AuthSession | null> => {
    const supabase = getSupabase()
    const token = localStorage.getItem('access_token')
    if (supabase && token) {
      try {
        const data = await invokeAuth<{ session: AuthSession }>('auth-session', { access_token: token })
        return data?.session ?? null
      } catch {
        return null
      }
    }
    try {
      const data = await api.get<{ session: AuthSession } | null>('/auth/session')
      return data?.session ?? null
    } catch {
      return null
    }
  },

  refresh: async (): Promise<LoginResponse> => {
    const refreshToken = localStorage.getItem('refresh_token')
    const supabase = getSupabase()
    if (supabase && refreshToken) {
      const data = await invokeAuth<LoginResponse>('auth-refresh', { refresh_token: refreshToken })
      if (data.session) setTokens(data.session)
      return data
    }
    const data = await api.post<LoginResponse>('/auth/refresh', {})
    if (data.session) setTokens(data.session)
    return data
  },

  verifyInviteToken: async (token: string): Promise<{ valid: boolean; email?: string }> => {
    const supabase = getSupabase()
    if (supabase) {
      return invokeAuth<{ valid: boolean; email?: string }>('auth-invite-verify', { token })
    }
    return api.get<{ valid: boolean; email?: string }>(
      `/auth/invite/verify?token=${encodeURIComponent(token)}`
    )
  },
}
