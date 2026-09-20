'use client'

import React, { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import MessageItem, { ChatMessage } from './message-item'
import ChatInput from './chat-input'
import { MessageSquare, Loader2, Sparkles, Hash } from 'lucide-react'
import { toast } from 'sonner'
import FilePreviewModal, { HubFile } from '../preview/file-preview-modal'

interface ChatPanelProps {
  roomId: string
  roomName: string
  currentUserId: string
  currentUserEmail: string
}

export default function ChatPanel({
  roomId,
  roomName,
  currentUserId,
  currentUserEmail,
}: ChatPanelProps) {
  const supabase = createClient()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [previewFile, setPreviewFile] = useState<HubFile | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior })
  }

  // 1. Fetch initial messages
  useEffect(() => {
    async function loadMessages() {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true })
        .limit(200)

      if (error) {
        console.error('Failed to load messages:', error)
      } else {
        setMessages(data || [])
      }
      setIsLoading(false)
      setTimeout(() => scrollToBottom('auto'), 100)
    }

    loadMessages()

    // 2. Realtime Postgres Changes subscription
    const channel = supabase
      .channel(`room_messages:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const newMsg = payload.new as ChatMessage
          setMessages((prev) => {
            // Avoid duplicate if optimistic message already exists
            if (prev.some((m) => m.id === newMsg.id)) return prev
            return [...prev, newMsg]
          })
          setTimeout(() => scrollToBottom('smooth'), 100)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomId, supabase])

  // 3. Send message handler
  const handleSendMessage = async (content: string) => {
    const tempId = crypto.randomUUID()
    const optimisticMessage: ChatMessage = {
      id: tempId,
      room_id: roomId,
      user_id: currentUserId,
      user_email: currentUserEmail,
      content,
      created_at: new Date().toISOString(),
    }

    // Optimistically add to state
    setMessages((prev) => [...prev, optimisticMessage])
    setTimeout(() => scrollToBottom('smooth'), 50)

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          id: tempId,
          room_id: roomId,
          user_id: currentUserId,
          user_email: currentUserEmail,
          content,
        })
        .select('*')
        .single()

      if (error) {
        throw error
      }
    } catch (err: any) {
      toast.error(`Message failed to send: ${err.message}`)
      // Rollback optimistic update
      setMessages((prev) => prev.filter((m) => m.id !== tempId))
    }
  }

  // Open file attached to message
  const handleOpenFileById = async (fileId: string) => {
    const { data: file, error } = await supabase
      .from('files')
      .select('*')
      .eq('id', fileId)
      .single()

    if (error || !file) {
      toast.error('Attached file could not be found or has been deleted.')
    } else {
      setPreviewFile(file)
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0b0c12] overflow-hidden">
      {/* Room Header */}
      <div className="p-4 sm:p-5 border-b border-zinc-800/80 bg-zinc-900/40 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <Hash className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white">#{roomName}</h2>
            <p className="text-[11px] text-zinc-400">Live chat & discussions</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Realtime active</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center gap-3 text-zinc-500">
            <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
            <span className="text-xs">Connecting to room channel...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <div className="w-12 h-12 rounded-2xl bg-zinc-800/60 border border-zinc-700 flex items-center justify-center text-zinc-500 mb-3">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-200 mb-1">No messages yet</h3>
            <p className="text-xs text-zinc-500 max-w-xs">
              Start the conversation in #{roomName}. Messages are synced live to everyone in the room.
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageItem
              key={msg.id}
              message={msg}
              isCurrentUser={msg.user_id === currentUserId}
              onOpenFileById={handleOpenFileById}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />

      {/* File Preview Modal */}
      <FilePreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />
    </div>
  )
}
