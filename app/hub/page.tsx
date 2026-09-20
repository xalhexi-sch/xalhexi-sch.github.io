import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import HubLayout from '@/components/hub-layout'
import { ShieldAlert, Database } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function HubPage() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey || url.includes('placeholder')) {
    return (
      <div className="min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-zinc-900/70 border border-zinc-800 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-4">
            <Database className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Supabase Setup Required</h1>
          <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
            Please add your Supabase credentials to <code className="text-violet-400">.env.local</code>.
          </p>
        </div>
      </div>
    )
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !user.email) {
    redirect('/login?next=/hub')
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
            Signed in as <span className="text-white font-medium">{user.email}</span>, but this account is not on the approved whitelist (<code className="text-violet-400">allowed_users</code>).
          </p>
          <div className="flex items-center justify-center gap-3">
            <a
              href="/"
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold rounded-xl transition-colors"
            >
              ← Back to Home
            </a>
            <a
              href="/login?next=/hub"
              className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              Switch Account
            </a>
          </div>
        </div>
      </div>
    )
  }

  return <HubLayout user={{ id: user.id, email: user.email }} />
}
