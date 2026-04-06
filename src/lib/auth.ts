import { supabase } from './supabase'

export async function getOrCreateSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) return session

  // No session, create an anonymous one
  const { data, error } = await supabase.auth.signInAnonymously()
  if (error) throw error
  return data.session
}
