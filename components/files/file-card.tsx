'use client'

import React from 'react'
import {
  FileText,
  Image as ImageIcon,
  FileSpreadsheet,
  Presentation,
  Archive,
  Code2,
  Film,
  Music,
  File,
  Download,
  Trash2,
  ExternalLink,
} from 'lucide-react'
import { HubFile } from '../preview/file-preview-modal'

interface FileCardProps {
  file: HubFile
  viewMode: 'grid' | 'list'
  currentUserId: string
  onPreview: (file: HubFile) => void
  onDelete: (file: HubFile) => void
}

export default function FileCard({
  file,
  viewMode,
  currentUserId,
  onPreview,
  onDelete,
}: FileCardProps) {
  const name = file.file_name.toLowerCase()
  const mime = file.mime_type || ''

  const getFileStyle = () => {
    if (mime.startsWith('image/') || name.match(/\.(jpg|jpeg|png|webp|gif|svg)$/)) {
      return { icon: ImageIcon, color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/30' }
    }
    if (mime === 'application/pdf' || name.endsWith('.pdf')) {
      return { icon: FileText, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' }
    }
    if (name.match(/\.(docx|doc)$/)) {
      return { icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' }
    }
    if (name.match(/\.(xlsx|xls|csv)$/)) {
      return { icon: FileSpreadsheet, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' }
    }
    if (name.match(/\.(pptx|ppt)$/)) {
      return { icon: Presentation, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' }
    }
    if (name.match(/\.(zip|tar|gz|rar|7z)$/)) {
      return { icon: Archive, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30' }
    }
    if (name.match(/\.(js|ts|tsx|jsx|py|html|css|json|sql|sh)$/)) {
      return { icon: Code2, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30' }
    }
    if (mime.startsWith('video/') || name.match(/\.(mp4|mkv|mov|webm)$/)) {
      return { icon: Film, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/30' }
    }
    if (mime.startsWith('audio/') || name.match(/\.(mp3|wav|ogg|flac)$/)) {
      return { icon: Music, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' }
    }
    return { icon: File, color: 'text-zinc-400', bg: 'bg-zinc-800 border-zinc-700' }
  }

  const { icon: Icon, color, bg } = getFileStyle()

  const formatSize = (bytes?: number | null) => {
    if (!bytes) return '--'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  }

  const isOwner = file.uploaded_by === currentUserId

  if (viewMode === 'list') {
    return (
      <div
        onClick={() => onPreview(file)}
        className="group flex items-center justify-between p-3 rounded-xl bg-zinc-900/40 hover:bg-zinc-800/60 border border-zinc-800/70 hover:border-zinc-700 transition-all cursor-pointer select-none"
      >
        <div className="flex items-center gap-3.5 min-w-0 pr-4">
          <div className={`w-9 h-9 rounded-xl ${bg} border flex items-center justify-center shrink-0`}>
            <Icon className={`w-4 h-4 ${color}`} />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-medium text-zinc-200 group-hover:text-white truncate transition-colors">
              {file.file_name}
            </h4>
            <div className="flex items-center gap-2 text-[11px] text-zinc-500">
              <span>{formatSize(file.size_bytes)}</span>
              <span>•</span>
              <span>{file.uploader_email.split('@')[0]}</span>
              <span>•</span>
              <span>{formatDate(file.created_at)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
          {isOwner && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(file)
              }}
              title="Delete File"
              className="p-1.5 hover:bg-red-500/10 text-zinc-500 hover:text-red-400 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onPreview(file)
            }}
            title="Preview File"
            className="p-1.5 hover:bg-zinc-700/80 text-zinc-400 hover:text-zinc-200 rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  // Grid View
  return (
    <div
      onClick={() => onPreview(file)}
      className="group relative flex flex-col justify-between p-4 rounded-2xl bg-zinc-900/50 hover:bg-zinc-800/70 border border-zinc-800/80 hover:border-zinc-700 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-0.5 select-none"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className={`w-11 h-11 rounded-2xl ${bg} border flex items-center justify-center shadow-inner`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        {isOwner && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(file)
            }}
            title="Delete File"
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/15 text-zinc-500 hover:text-red-400 rounded-lg transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div>
        <h4 className="text-xs font-semibold text-zinc-200 group-hover:text-white line-clamp-2 mb-1.5 transition-colors">
          {file.file_name}
        </h4>
        <div className="flex items-center justify-between text-[11px] text-zinc-500">
          <span>{formatSize(file.size_bytes)}</span>
          <span>{formatDate(file.created_at)}</span>
        </div>
      </div>
    </div>
  )
}
