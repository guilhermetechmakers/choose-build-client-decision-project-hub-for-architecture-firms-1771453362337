import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let client: SupabaseClient | null = null

/**
 * Returns the Supabase client when VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.
 * Use for Auth (including OAuth), database (with RLS), Realtime, and Storage.
 * For server-only logic (LLM, secrets), use Edge Functions via supabase.functions.invoke().
 */
export function getSupabase(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) return null
  if (!client) {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  }
  return client
}
