'use client'

import React, { useState, useEffect } from 'react'
import Sidebar, { Room } from './sidebar'
import FileBrowser from './files/file-browser'
import ChatPanel from './chat/chat-panel'
import { createClient } from '@/lib/supabase/client'
import { Menu, X, FolderTree, MessageSquare, HardDrive } from 'lucide-react'

interface HubLayoutProps {
  user: {
    id: string
    email: string
  }
}

// Fallback seed rooms for zero-latency initial render
const DEFAULT_ROOMS: Room[] = [
  { id: '11111111-1111-1111-1111-111111111111', name: 'General', slug: 'general', icon: 'message-square' },
  { id: '22222222-2222-2222-2222-222222222222', name: 'Urian', slug: 'urian', icon: 'graduation-cap' },
  { id: '33333333-3333-3333-3333-333333333333', name: 'xalhexi Films', slug: 'xalhexi-films', icon: 'film' },
  { id: '44444444-4444-4444-4444-444444444444', name: 'Personal', slug: 'personal', icon: 'lock' },
]

export default function HubLayout({ user }: HubLayoutProps) {
  const supabase = createClient()

  const [rooms, setRooms] = useState<Room[]>(DEFAULT_ROOMS)
  const [activeRoomId, setActiveRoomId] = useState<string>(DEFAULT_ROOMS[0].id)
  const [activeTab, setActiveTab] = useState<'files' | 'chat'>('files')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Load rooms from Supabase
  useEffect(() => {
    async function loadRooms() {
      const { data, error } = await supabase.from('rooms').select('*').order('created_at', { ascending: true })
      if (!error && data && data.length > 0) {
        setRooms(data)
        setActiveRoomId(data[0].id)
      }
    }
    loadRooms()
  }, [supabase])

  const currentRoom = rooms.find((r) => r.id === activeRoomId) || rooms[0]

  return (
    <div className="flex h-screen w-full bg-[#090a0f] overflow-hidden">
      {/* Mobile Top Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-zinc-950 border-b border-zinc-800 z-30 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="text-sm font-bold text-white">#{currentRoom?.name}</span>
        </div>

        {/* Tab switch buttons for mobile */}
        <div className="flex items-center bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs">
          <button
            onClick={() => setActiveTab('files')}
            className={`px-2.5 py-1 rounded-lg ${
              activeTab === 'files' ? 'bg-violet-600 text-white font-medium' : 'text-zinc-400'
            }`}
          >
            Files
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-2.5 py-1 rounded-lg ${
              activeTab === 'chat' ? 'bg-violet-600 text-white font-medium' : 'text-zinc-400'
            }`}
          >
            Chat
          </button>
        </div>
      </div>

      {/* Sidebar for Desktop */}
      <div className="hidden md:flex h-full">
        <Sidebar
          rooms={rooms}
          activeRoomId={activeRoomId}
          activeTab={activeTab}
          onSelectRoom={(id) => setActiveRoomId(id)}
          onSelectTab={(tab) => setActiveTab(tab)}
          onRoomCreated={(newRoom) => setRooms((prev) => [...prev, newRoom])}
          userEmail={user.email}
        />
      </div>

      {/* Mobile Sidebar Overlay Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative w-72 h-full z-50 animate-in slide-in-from-left duration-200">
            <Sidebar
              rooms={rooms}
              activeRoomId={activeRoomId}
              activeTab={activeTab}
              onSelectRoom={(id) => {
                setActiveRoomId(id)
                setMobileMenuOpen(false)
              }}
              onSelectTab={(tab) => {
                setActiveTab(tab)
                setMobileMenuOpen(false)
              }}
              onRoomCreated={(newRoom) => setRooms((prev) => [...prev, newRoom])}
              userEmail={user.email}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full pt-14 md:pt-0 overflow-hidden relative">
        {activeTab === 'files' ? (
          <FileBrowser
            key={`files-${activeRoomId}`}
            roomId={currentRoom.id}
            roomName={currentRoom.name}
            currentUserId={user.id}
            currentUserEmail={user.email}
          />
        ) : (
          <ChatPanel
            key={`chat-${activeRoomId}`}
            roomId={currentRoom.id}
            roomName={currentRoom.name}
            currentUserId={user.id}
            currentUserEmail={user.email}
          />
        )}
      </main>
    </div>
  )
}
