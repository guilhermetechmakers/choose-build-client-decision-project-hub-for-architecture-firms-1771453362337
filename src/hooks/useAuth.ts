import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { authApi } from '@/api/auth'
import type { SignInInput, SignUpInput, FirmSignupInput } from '@/types/auth'
import type { ApiError } from '@/lib/api'

export const authKeys = {
  session: ['auth', 'session'] as const,
}

export function useSession() {
  return useQuery({
    queryKey: authKeys.session,
    queryFn: () => authApi.getSession(),
    retry: false,
    staleTime: 1000 * 60 * 5,
    enabled: typeof localStorage !== 'undefined' && !!localStorage.getItem('access_token'),
  })
}

export function useSignIn() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (input: SignInInput) => authApi.signIn(input),
    onSuccess: (data) => {
      if (data?.session?.user?.id) {
        queryClient.setQueryData(authKeys.session, data.session)
        toast.success('Signed in successfully')
        navigate('/dashboard', { replace: true })
      } else {
        toast.error((data as { message?: string })?.message ?? 'Sign in failed')
      }
    },
    onError: (err: unknown) => {
      const message = err && typeof err === 'object' && 'message' in err
        ? String((err as ApiError).message)
        : 'Sign in failed'
      toast.error(message)
    },
  })
}

export function useSignUp() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (input: SignUpInput) => authApi.signUp(input),
    onSuccess: (data) => {
      if (data?.session?.user?.id) {
        queryClient.setQueryData(authKeys.session, data.session)
        toast.success('Account created successfully')
        navigate('/dashboard', { replace: true })
      } else {
        toast.success((data as { message?: string })?.message ?? 'Check your email to complete sign-up')
        navigate('/verify-email', { replace: true })
      }
    },
    onError: (err: unknown) => {
      const message = err && typeof err === 'object' && 'message' in err
        ? String((err as ApiError).message)
        : 'Sign up failed'
      toast.error(message)
    },
  })
}

export function useFirmSignup() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (input: FirmSignupInput) => authApi.firmSignup(input),
    onSuccess: (_data, variables) => {
      toast.success('Check your email to complete sign-up')
      const params = new URLSearchParams({
        company: variables.company_name,
        email: variables.admin_email,
        name: variables.admin_name,
      })
      navigate(`/signup?${params.toString()}`, { replace: true })
    },
    onError: (err: unknown) => {
      const message = err && typeof err === 'object' && 'message' in err
        ? String((err as ApiError).message)
        : 'Sign-up request failed'
      toast.error(message)
    },
  })
}

export function useSignOut() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: () => authApi.signOut(),
    onSuccess: () => {
      queryClient.clear()
      toast.success('Signed out successfully')
      navigate('/login', { replace: true })
    },
    onError: (err: unknown) => {
      const message = err && typeof err === 'object' && 'message' in err
        ? String((err as ApiError).message)
        : 'Sign out failed'
      toast.error(message)
      queryClient.clear()
      navigate('/login', { replace: true })
    },
  })
}

export function useRefreshSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authApi.refresh(),
    onSuccess: (data) => {
      if (data?.session) {
        queryClient.setQueryData(authKeys.session, data.session)
      }
    },
  })
}
