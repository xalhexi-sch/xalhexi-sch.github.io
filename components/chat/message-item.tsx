'use client'

import React from 'react'
import { File, Paperclip } from 'lucide-react'

export interface ChatMessage {
  id: string
  room_id: string
  user_id: string
  user_email: string
  content: string | null
  file_id?: string | null
  created_at: string
}

interface MessageItemProps {
  message: ChatMessage
  isCurrentUser: boolean
  onOpenFileById?: (fileId: string) => void
}

export default function MessageItem({
  message,
  isCurrentUser,
  onOpenFileById,
}: MessageItemProps) {
  const emailName = message.user_email.split('@')[0]
  const initials = emailName.slice(0, 2).toUpperCase()

  const formattedTime = new Date(message.created_at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div
      className={`group flex items-start gap-3 py-1.5 px-3 rounded-xl transition-colors hover:bg-zinc-900/40 ${
        isCurrentUser ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-semibold shrink-0 shadow-sm ${
          isCurrentUser
            ? 'bg-violet-600 text-white'
            : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
        }`}
      >
        {initials}
      </div>

      {/* Bubble & Metadata */}
      <div
        className={`flex flex-col max-w-[80%] sm:max-w-[70%] ${
          isCurrentUser ? 'items-end' : 'items-start'
        }`}
      >
        <div className="flex items-center gap-2 mb-1 px-1">
          <span className="text-xs font-medium text-zinc-300">
            {isCurrentUser ? 'You' : emailName}
          </span>
          <span className="text-[10px] text-zinc-500">{formattedTime}</span>
        </div>

        {/* Text bubble */}
        {message.content && (
          <div
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed break-words shadow-sm ${
              isCurrentUser
                ? 'bg-violet-600 text-white rounded-tr-sm'
                : 'bg-zinc-900/90 border border-zinc-800 text-zinc-200 rounded-tl-sm'
            }`}
          >
            {message.content}
          </div>
        )}

        {/* Attached File pill if message links to a file */}
        {message.file_id && (
          <button
            onClick={() => onOpenFileById?.(message.file_id!)}
            className="mt-1.5 flex items-center gap-2 px-3 py-1.5 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs text-violet-400 hover:text-violet-300 transition-colors shadow-sm"
          >
            <Paperclip className="w-3.5 h-3.5" />
            <span>Attached File (Click to preview)</span>
          </button>
        )}
      </div>
    </div>
  )
}
