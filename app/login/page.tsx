'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ShieldCheck, Mail, Lock, ArrowRight, Loader2, Sparkles, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'password' | 'magic-link'>('password')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [magicLinkSent, setMagicLinkSent] = useState(false)

  useEffect(() => {
    // If already logged in and whitelisted, redirect to hub
    async function checkExistingSession() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push('/hub')
      }
    }
    checkExistingSession()
  }, [router, supabase])

  const verifyWhitelistAndProceed = async (userEmail: string) => {
    // Query allowed_users table
    const { data: allowed, error } = await supabase
      .from('allowed_users')
      .select('id, email')
      .ilike('email', userEmail)
      .single()

    if (error || !allowed) {
      await supabase.auth.signOut()
      throw new Error(
        `Access restricted: "${userEmail}" is not on the approved whitelist for this hub. Contact the admin.`
      )
    }

    router.push('/hub')
    router.refresh()
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg(null)

    try {
      const cleanEmail = email.trim().toLowerCase()

      if (mode === 'magic-link') {
        const { error } = await supabase.auth.signInWithOtp({
          email: cleanEmail,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })
        if (error) throw error
        setMagicLinkSent(true)
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        })
        if (error) throw error
        if (data.user?.email) {
          await verifyWhitelistAndProceed(data.user.email)
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during authentication')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col justify-center items-center px-4 relative overflow-hidden selection:bg-violet-500 selection:text-white">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-violet-600/15 via-indigo-500/10 to-transparent blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[250px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-b from-violet-500/20 to-violet-700/10 border border-violet-500/30 text-violet-400 mb-4 shadow-lg shadow-violet-500/10">
            <ShieldCheck className="w-7 h-7 text-violet-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            Personal File Hub
          </h1>
          <p className="text-sm text-zinc-400 mt-2">
            Private, whitelisted workspace for files, chat & documents
          </p>
        </div>

        {/* Card */}
        <div className="bg-zinc-900/70 border border-zinc-800/80 backdrop-blur-xl rounded-2xl p-7 shadow-2xl shadow-black/60">
          {magicLinkSent ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Check your email</h3>
              <p className="text-sm text-zinc-400 mb-6">
                We sent a magic sign-in link to <span className="text-zinc-200 font-medium">{email}</span>. Click the link to log in.
              </p>
              <button
                type="button"
                onClick={() => setMagicLinkSent(false)}
                className="text-xs text-violet-400 hover:text-violet-300 transition-colors font-medium"
              >
                ← Back to standard login
              </button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Mode Toggle */}
              <div className="flex bg-zinc-950/60 p-1 rounded-xl border border-zinc-800/80 text-xs font-medium mb-5">
                <button
                  type="button"
                  onClick={() => { setMode('password'); setErrorMsg(null) }}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${
                    mode === 'password'
                      ? 'bg-zinc-800 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Password
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('magic-link'); setErrorMsg(null) }}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${
                    mode === 'magic-link'
                      ? 'bg-zinc-800 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Magic Link
                </button>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs leading-relaxed">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">Email address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@xalhexi.wtf"
                    className="w-full bg-zinc-950/70 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition-colors"
                  />
                </div>
              </div>

              {/* Password Input (if in password mode) */}
              {mode === 'password' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-zinc-950/70 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 active:scale-[0.99] text-white font-medium text-sm py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-violet-600/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying credentials...</span>
                  </>
                ) : (
                  <>
                    <span>{mode === 'password' ? 'Sign In to Hub' : 'Send Magic Link'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Whitelist notice footer */}
          <div className="mt-6 pt-5 border-t border-zinc-800/80 text-center">
            <div className="inline-flex items-center gap-1.5 text-[11px] text-zinc-500">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>Restricted access: Whitelisted users only</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
