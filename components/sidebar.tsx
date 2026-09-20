'use client'

import React, { useState } from 'react'
import {
  MessageSquare,
  GraduationCap,
  Film,
  Lock,
  Hash,
  FolderTree,
  Plus,
  LogOut,
  ShieldCheck,
  ChevronRight,
  HardDrive,
  Layers,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export interface Room {
  id: string
  name: string
  slug: string
  description?: string | null
  icon?: string | null
}

interface SidebarProps {
  rooms: Room[]
  activeRoomId: string
  activeTab: 'files' | 'chat'
  onSelectRoom: (roomId: string) => void
  onSelectTab: (tab: 'files' | 'chat') => void
  onRoomCreated: (newRoom: Room) => void
  userEmail: string
}

export default function Sidebar({
  rooms,
  activeRoomId,
  activeTab,
  onSelectRoom,
  onSelectTab,
  onRoomCreated,
  userEmail,
}: SidebarProps) {
  const router = useRouter()
  const supabase = createClient()

  const [isCreatingRoom, setIsCreatingRoom] = useState(false)
  const [newRoomName, setNewRoomName] = useState('')

  const getRoomIcon = (iconName?: string | null, slug?: string) => {
    if (slug === 'urian' || iconName === 'graduation-cap') return GraduationCap
    if (slug === 'xalhexi-films' || iconName === 'film') return Film
    if (slug === 'personal' || iconName === 'lock') return Lock
    if (iconName === 'message-square') return MessageSquare
    return Hash
  }

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    const name = newRoomName.trim()
    if (!name) return

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')

    try {
      const { data, error } = await supabase
        .from('rooms')
        .insert({
          name,
          slug,
          icon: 'hash',
        })
        .select('*')
        .single()

      if (error) throw error

      toast.success(`Created room #${name}`)
      onRoomCreated(data)
      setNewRoomName('')
      setIsCreatingRoom(false)
      onSelectRoom(data.id)
    } catch (err: any) {
      toast.error(`Could not create room: ${err.message}`)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="w-full md:w-64 lg:w-72 bg-[#090a0f] border-r border-zinc-800/80 flex flex-col h-full shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-zinc-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-violet-600/20">
            <HardDrive className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>xalhexi Hub</span>
            </h1>
            <a
              href="/"
              className="text-[10px] text-zinc-500 hover:text-violet-400 font-mono block transition-colors"
            >
              ← xalhexi.wtf
            </a>
          </div>
        </div>

        <button
          onClick={() => setIsCreatingRoom(!isCreatingRoom)}
          title="Create Room"
          className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* New Room Form Drawer */}
      {isCreatingRoom && (
        <form onSubmit={handleCreateRoom} className="p-3 bg-zinc-900/80 border-b border-zinc-800 space-y-2">
          <input
            type="text"
            required
            autoFocus
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            placeholder="Room name..."
            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500"
          />
          <div className="flex items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={() => setIsCreatingRoom(false)}
              className="px-2 py-1 text-[11px] text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-2.5 py-1 bg-violet-600 hover:bg-violet-500 text-white rounded-md text-[11px] font-medium"
            >
              Add Room
            </button>
          </div>
        </form>
      )}

      {/* View Switcher: Files Hub vs Live Chat */}
      <div className="px-3 pt-3">
        <div className="flex bg-zinc-950/80 p-1 rounded-xl border border-zinc-800/80 text-xs font-medium">
          <button
            onClick={() => onSelectTab('files')}
            className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'files'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5" />
            <span>Files</span>
          </button>
          <button
            onClick={() => onSelectTab('chat')}
            className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'chat'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat</span>
          </button>
        </div>
      </div>

      {/* Rooms List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
          Rooms & Channels
        </div>

        {rooms.map((room) => {
          const Icon = getRoomIcon(room.icon, room.slug)
          const isActive = room.id === activeRoomId

          return (
            <button
              key={room.id}
              onClick={() => onSelectRoom(room.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-zinc-800/90 text-white border border-zinc-700/60 shadow-sm'
                  : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-violet-400' : 'text-zinc-500 group-hover:text-zinc-400'
                  }`}
                />
                <span className="truncate">{room.name}</span>
              </div>

              {isActive && <ChevronRight className="w-3.5 h-3.5 text-violet-400 shrink-0" />}
            </button>
          )
        })}
      </div>

      {/* User Status & Sign Out */}
      <div className="p-3 border-t border-zinc-800/80 bg-zinc-950/40">
        <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-zinc-900/50 border border-zinc-800/80">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className="text-xs font-semibold text-zinc-200 truncate">
                {userEmail.split('@')[0]}
              </div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-emerald-400" />
                <span>Whitelisted</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            title="Sign Out"
            className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-red-400 rounded-lg transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
