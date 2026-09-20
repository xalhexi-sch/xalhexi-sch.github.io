import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hkcgqfuyxehypazfpjew.supabase.co'
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrY2dxZnV5eGVoeXBhemZwamV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4OTk3MTYsImV4cCI6MjEwNTQ3NTcxNn0.Th2UbUnKR9Kn939w26-gw0EXAyBeqwFt8yvAeAX-PY4'

  return createBrowserClient(url, anonKey)
}
