'use client'

import React, { useState, useRef } from 'react'
import { Send, Paperclip, Loader2 } from 'lucide-react'

interface ChatInputProps {
  onSendMessage: (content: string) => Promise<void>
  disabled?: boolean
}

export default function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [text, setText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed || isSubmitting || disabled) return

    setIsSubmitting(true)
    setText('')
    try {
      await onSendMessage(trimmed)
    } finally {
      setIsSubmitting(false)
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
    // Auto-adjust height up to 120px
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-3 bg-zinc-900/60 border-t border-zinc-800/80">
      <div className="flex items-end gap-2 bg-zinc-950/80 border border-zinc-800 focus-within:border-violet-500 rounded-2xl p-2 transition-colors">
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Send a message in this room... (Enter to send, Shift+Enter for newline)"
          disabled={disabled || isSubmitting}
          className="flex-1 bg-transparent border-none resize-none text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none px-2 py-1.5 max-h-[120px] leading-relaxed"
        />

        <button
          type="submit"
          disabled={!text.trim() || isSubmitting || disabled}
          className="p-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-md shadow-violet-600/20 active:scale-95 shrink-0"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>
    </form>
  )
}
