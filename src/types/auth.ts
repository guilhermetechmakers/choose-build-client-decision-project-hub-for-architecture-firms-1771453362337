/** Login/Signup feature record (maps to login_signup table) */
export interface LoginSignup {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}

export interface AuthSession {
  user: { id: string; email?: string }
  access_token: string
  refresh_token?: string
  expires_at?: number
}

export interface LoginResponse {
  session: AuthSession
}

export interface SignupResponse {
  session?: AuthSession
  message?: string
}

export interface SignInInput {
  email: string
  password: string
  remember_me?: boolean
}

export interface SignUpInput {
  email: string
  password: string
  name?: string
  invite_token?: string
  company_name?: string
  admin_email?: string
  admin_name?: string
}

export interface FirmSignupInput {
  company_name: string
  admin_email: string
  admin_name: string
}
