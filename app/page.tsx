import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import HubLayout from '@/components/hub-layout'
import { ShieldAlert, Database, KeyRound } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If Supabase env vars are not set yet, show friendly configuration screen
  if (!url || !anonKey || url.includes('placeholder')) {
    return (
      <div className="min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-zinc-900/70 border border-zinc-800 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-4">
            <Database className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Supabase Setup Required</h1>
          <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
            Your Personal File Hub codebase is ready! To connect your database and storage:
          </p>

          <div className="text-left bg-zinc-950/80 border border-zinc-800 rounded-xl p-4 text-xs font-mono text-zinc-300 space-y-3 mb-6">
            <div>
              <div className="text-zinc-500 text-[10px] uppercase font-sans font-semibold mb-1">
                1. Create .env.local with your keys:
              </div>
              <div className="text-violet-400">NEXT_PUBLIC_SUPABASE_URL=...</div>
              <div className="text-violet-400">NEXT_PUBLIC_SUPABASE_ANON_KEY=...</div>
            </div>
            <div>
              <div className="text-zinc-500 text-[10px] uppercase font-sans font-semibold mb-1">
                2. Run Database Migration:
              </div>
              <div className="text-zinc-400">Execute <span className="text-emerald-400 font-semibold">supabase/schema.sql</span> in your Supabase SQL Editor.</div>
            </div>
          </div>

          <div className="text-[11px] text-zinc-500">
            Once configured, refresh this page to sign in and begin using your hub.
          </div>
        </div>
      </div>
    )
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !user.email) {
    redirect('/login')
  }

  // Check Whitelist
  const { data: allowedUser } = await supabase
    .from('allowed_users')
    .select('id, email')
    .ilike('email', user.email)
    .single()

  if (!allowedUser) {
    return (
      <div className="min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-zinc-900/70 border border-red-500/30 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Access Restricted</h1>
          <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
            Signed in as <span className="text-white font-medium">{user.email}</span>, but this email is not on the approved whitelist table (<code className="text-violet-400">allowed_users</code>).
          </p>
          <a
            href="/login"
            className="inline-block px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-xl transition-colors"
          >
            Switch Account
          </a>
        </div>
      </div>
    )
  }

  return <HubLayout user={{ id: user.id, email: user.email }} />
}
