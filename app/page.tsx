import React from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import {
  FolderTree,
  MessageSquare,
  FileText,
  ExternalLink,
  Github,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Terminal,
  Cpu,
  Layers,
  GraduationCap,
  Film,
  Lock,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function LandingPage() {
  let currentUser: { email: string } | null = null

  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user?.email) {
      currentUser = { email: user.email }
    }
  } catch {
    // Graceful fallback if client not initialized
  }

  return (
    <div className="min-h-screen bg-[#090a0f] text-zinc-100 selection:bg-violet-500 selection:text-white flex flex-col antialiased">
      {/* Subtle background grid pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#16171d_1px,transparent_1px),linear-gradient(to_bottom,#16171d_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

      {/* Navigation */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-[#090a0f]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-violet-600/20 group-hover:scale-105 transition-transform">
                x
              </div>
              <span className="font-bold text-sm tracking-tight text-white group-hover:text-violet-400 transition-colors">
                xalhexi<span className="text-violet-400">.wtf</span>
              </span>
            </Link>

            <span className="hidden sm:inline-block text-zinc-600">•</span>
            <span className="hidden sm:inline-block text-xs text-zinc-400 font-mono">
              Michael Nas
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs text-zinc-400 font-medium">
            <a href="#about" className="hover:text-white transition-colors">
              About
            </a>
            <a href="#hub" className="hover:text-white transition-colors">
              Hub Workspace
            </a>
            <a href="#projects" className="hover:text-white transition-colors">
              Projects
            </a>
            <a href="#ecosystem" className="hover:text-white transition-colors">
              Ecosystem
            </a>
            <a
              href="http://xalhexi.my.canva.site/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <span>Portfolio '24</span>
              <ExternalLink className="w-3 h-3 text-zinc-500" />
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/xalhexi"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-zinc-800/80 text-zinc-400 hover:text-white rounded-xl transition-colors"
              title="GitHub Profile"
            >
              <Github className="w-4 h-4" />
            </a>

            {currentUser ? (
              <Link
                href="/hub"
                className="px-3.5 py-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-violet-600/20 flex items-center gap-1.5 transition-all"
              >
                <span>Open Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white rounded-xl text-xs font-semibold border border-zinc-700/60 shadow-sm flex items-center gap-1.5 transition-all"
              >
                <span>Access Hub</span>
                <Lock className="w-3.5 h-3.5 text-zinc-400" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 w-full py-12 sm:py-20 space-y-24">
        {/* HERO SECTION */}
        <section id="about" className="space-y-6 pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>IT Student & Developer • Father Saturnino Urios University</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Michael Nas <span className="text-violet-400 font-mono font-normal">(@xalhexi)</span>
            </h1>
            <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl font-light leading-relaxed">
              Software engineer, student developer, and creative builder. Crafting minimal, fast tools, full-stack systems, and media workflows.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href={currentUser ? '/hub' : '/login'}
              className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xl shadow-violet-600/25 flex items-center gap-2 transition-all active:scale-[0.98]"
            >
              <span>{currentUser ? 'Enter Personal Hub' : 'Access Private Hub'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="http://xalhexi.my.canva.site/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 rounded-xl text-xs sm:text-sm font-semibold border border-zinc-800 flex items-center gap-2 transition-colors"
            >
              <span>View Portfolio '24</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
            </a>

            <a
              href="https://github.com/xalhexi-sch"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-zinc-900/50 hover:bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 rounded-xl text-xs font-mono flex items-center gap-2 border border-zinc-800/80 transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>xalhexi-sch</span>
            </a>
          </div>
        </section>

        {/* HUB FEATURE PREVIEW SHOWCASE */}
        <section id="hub" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-zinc-800 pb-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-violet-400 mb-1">
                Featured System
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Personal File Hub & Realtime Chat
              </h2>
            </div>
            <p className="text-xs text-zinc-400 max-w-sm font-mono">
              Replacing fragmented drives & messengers with a private self-hosted space.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: Multi-room Realtime Chat */}
            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700 transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-white">Multi-Room Realtime Chat</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Fast WebSocket discussions organized by channels: <code className="text-zinc-300">#general</code>, <code className="text-zinc-300">#urian</code>, <code className="text-zinc-300">#xalhexi-films</code>, and <code className="text-zinc-300">#personal</code>.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-800/60 text-[11px] font-mono text-zinc-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Supabase Realtime powered</span>
              </div>
            </div>

            {/* Card 2: Direct-to-Storage Uploads */}
            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700 transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <FolderTree className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-white">Direct-to-Storage Cloud</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Browser-to-bucket signed streaming bypassing Vercel limits. Drag-and-drop support up to 100MB per file with automatic CDN caching.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-800/60 text-[11px] font-mono text-zinc-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Live image thumbnail cards</span>
              </div>
            </div>

            {/* Card 3: Document Preview System */}
            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700 transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-white">Multi-Format Preview</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  High-res image pan & zoom, embedded inline PDF viewer, and ready webhook bridges for Gotenberg conversion & OnlyOffice inline editing.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-800/60 text-[11px] font-mono text-zinc-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero-latency synchronous view</span>
              </div>
            </div>
          </div>

          {/* Interactive CTA Banner */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-violet-950/40 via-zinc-900/60 to-zinc-900/40 border border-violet-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-bold text-white mb-1">
                Looking for your files or live chat?
              </h4>
              <p className="text-xs text-zinc-400">
                The hub is protected with an email whitelist. Sign in with your approved account to enter.
              </p>
            </div>
            <Link
              href={currentUser ? '/hub' : '/login'}
              className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-violet-600/20 flex items-center gap-2 transition-all shrink-0 self-start sm:self-auto"
            >
              <span>{currentUser ? 'Open Workspace' : 'Sign In to Hub'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* SELECTED PROJECTS & REPOSITORIES */}
        <section id="projects" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-zinc-800 pb-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1">
                Selected Work
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Projects & University Systems
              </h2>
            </div>
            <p className="text-xs text-zinc-400 font-mono">
              Systems built for FSUU & independent work
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Project 1 */}
            <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/80 hover:border-zinc-700 transition-all space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-violet-400 text-xs font-mono">
                  <GraduationCap className="w-4 h-4" />
                  <span>FSUU Internal</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
                  Active
                </span>
              </div>
              <h3 className="text-base font-bold text-white">FSUU Clearance System</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Automated student clearance platform for Father Saturnino Urios University. Tracks academic standing, department approvals, and clearance validation.
              </p>
              <div className="pt-2 flex items-center gap-2">
                <a
                  href="https://github.com/xalhexi-sch/FSUUClearance-System"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-zinc-300 hover:text-violet-400 flex items-center gap-1 transition-colors"
                >
                  <span>View Repository</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Project 2 */}
            <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/80 hover:border-zinc-700 transition-all space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono">
                  <Layers className="w-4 h-4" />
                  <span>Journalism & Sports</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
                  Live System
                </span>
              </div>
              <h3 className="text-base font-bold text-white">Urian Publication Medal Tally</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Real-time leaderboard and medal tally tracking platform for university athletic events, designed for the official Urian Publication student media organization.
              </p>
              <div className="pt-2 flex items-center gap-2">
                <a
                  href="https://github.com/xalhexi-sch/medaltally-urianpublication"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-zinc-300 hover:text-emerald-400 flex items-center gap-1 transition-colors"
                >
                  <span>View Repository</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Project 3 */}
            <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/80 hover:border-zinc-700 transition-all space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-pink-400 text-xs font-mono">
                  <Film className="w-4 h-4" />
                  <span>Creative & Video</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
                  Production
                </span>
              </div>
              <h3 className="text-base font-bold text-white">xalhexi Films</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Video production and creative cinematography showcase. Scripts, assets, and project files managed within the dedicated <code className="text-zinc-300">#xalhexi-films</code> Hub channel.
              </p>
              <div className="pt-2 flex items-center gap-2">
                <a
                  href="http://xalhexi.my.canva.site/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-zinc-300 hover:text-pink-400 flex items-center gap-1 transition-colors"
                >
                  <span>See Creative Portfolio</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Project 4 */}
            <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/80 hover:border-zinc-700 transition-all space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono">
                  <Terminal className="w-4 h-4" />
                  <span>Infrastructure</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
                  Utility
                </span>
              </div>
              <h3 className="text-base font-bold text-white">Pterodactyl & Server Automation</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Custom server management templates, automated game server deployments, and containerized runtime infrastructure.
              </p>
              <div className="pt-2 flex items-center gap-2">
                <a
                  href="https://github.com/xalhexi-sch/PterodactylUnturned"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-zinc-300 hover:text-cyan-400 flex items-center gap-1 transition-colors"
                >
                  <span>View Repository</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ECOSYSTEM & GITHUB PROFILES */}
        <section id="ecosystem" className="space-y-6">
          <div className="border-b border-zinc-800 pb-4">
            <div className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1">
              Network
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Ecosystem & Accounts
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Account 1 */}
            <a
              href="https://github.com/xalhexi-sch"
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-600 transition-all block group"
            >
              <div className="flex items-center justify-between mb-3">
                <Github className="w-5 h-5 text-zinc-300 group-hover:text-white transition-colors" />
                <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-violet-400 transition-colors">
                @xalhexi-sch
              </h4>
              <p className="text-xs text-zinc-400 mt-1">
                FSUU academic work, course projects & university systems.
              </p>
            </a>

            {/* Account 2 */}
            <a
              href="https://github.com/xalhexi"
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-600 transition-all block group"
            >
              <div className="flex items-center justify-between mb-3">
                <Github className="w-5 h-5 text-zinc-300 group-hover:text-white transition-colors" />
                <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-violet-400 transition-colors">
                @xalhexi
              </h4>
              <p className="text-xs text-zinc-400 mt-1">
                Personal open-source projects, tools, and experiments.
              </p>
            </a>

            {/* Account 3 */}
            <a
              href="https://github.com/xalhexidev"
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-600 transition-all block group"
            >
              <div className="flex items-center justify-between mb-3">
                <Github className="w-5 h-5 text-zinc-300 group-hover:text-white transition-colors" />
                <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-violet-400 transition-colors">
                @xalhexiDev
              </h4>
              <p className="text-xs text-zinc-400 mt-1">
                Organization workspace, team builds & production pipelines.
              </p>
            </a>

            {/* Account 4 */}
            <a
              href="http://xalhexi.my.canva.site/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-600 transition-all block group"
            >
              <div className="flex items-center justify-between mb-3">
                <Sparkles className="w-5 h-5 text-violet-400 group-hover:text-violet-300 transition-colors" />
                <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-violet-400 transition-colors">
                Portfolio '24
              </h4>
              <p className="text-xs text-zinc-400 mt-1">
                Visual design, branding, and creative portfolio on Canva.
              </p>
            </a>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950/60 py-8 px-4 sm:px-6 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-mono">
          <div className="flex items-center gap-2">
            <span>xalhexi.wtf</span>
            <span>•</span>
            <span>Michael Nas</span>
            <span>•</span>
            <span>Butuan City, PH</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/xalhexi-sch"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-300 transition-colors"
            >
              GitHub
            </a>
            <a
              href="http://xalhexi.my.canva.site/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-300 transition-colors"
            >
              Canva
            </a>
            <Link href="/hub" className="hover:text-violet-400 transition-colors">
              Hub Workspace
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
