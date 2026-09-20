'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutGrid,
  List,
  Search,
  Filter,
  FolderOpen,
  FilePlus,
  Loader2,
  Sparkles,
} from 'lucide-react'
import FileCard from './file-card'
import FileUploadZone from './file-upload-zone'
import FilePreviewModal, { HubFile } from '../preview/file-preview-modal'
import { toast } from 'sonner'

interface FileBrowserProps {
  roomId: string
  roomName: string
  currentUserId: string
  currentUserEmail: string
}

export default function FileBrowser({
  roomId,
  roomName,
  currentUserId,
  currentUserEmail,
}: FileBrowserProps) {
  const supabase = createClient()

  const [files, setFiles] = useState<HubFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'images' | 'pdfs' | 'office' | 'others'>('all')
  const [previewFile, setPreviewFile] = useState<HubFile | null>(null)
  const [showUploadZone, setShowUploadZone] = useState(true)

  // 1. Fetch files for current room
  const loadFiles = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching files:', error)
    } else {
      setFiles(data || [])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    loadFiles()

    // 2. Realtime listener for new and deleted files in this room
    const channel = supabase
      .channel(`room_files:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'files',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setFiles((prev) => [payload.new as HubFile, ...prev])
          } else if (payload.eventType === 'DELETE') {
            setFiles((prev) => prev.filter((f) => f.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomId, supabase])

  // Delete file
  const handleDeleteFile = async (file: HubFile) => {
    if (!confirm(`Delete "${file.file_name}" permanently?`)) return

    try {
      // 1. Delete from Supabase Storage
      await supabase.storage.from('hub-files').remove([file.storage_path])

      // 2. Delete from Postgres 'files' table
      const { error } = await supabase.from('files').delete().eq('id', file.id)
      if (error) throw error

      setFiles((prev) => prev.filter((f) => f.id !== file.id))
      toast.success(`Deleted ${file.file_name}`)
    } catch (err: any) {
      toast.error(`Delete failed: ${err.message || 'Unknown error'}`)
    }
  }

  // Filter & Search
  const filteredFiles = files.filter((file) => {
    const name = file.file_name.toLowerCase()
    const mime = file.mime_type || ''

    // Match Search Query
    if (searchQuery && !name.includes(searchQuery.toLowerCase())) {
      return false
    }

    // Match Category Filter
    if (selectedFilter === 'images') {
      return mime.startsWith('image/') || name.match(/\.(jpg|jpeg|png|webp|gif|svg)$/)
    }
    if (selectedFilter === 'pdfs') {
      return mime === 'application/pdf' || name.endsWith('.pdf')
    }
    if (selectedFilter === 'office') {
      return name.match(/\.(docx|doc|xlsx|xls|pptx|ppt|csv)$/)
    }
    if (selectedFilter === 'others') {
      const isImg = mime.startsWith('image/') || name.match(/\.(jpg|jpeg|png|webp|gif|svg)$/)
      const isPdf = mime === 'application/pdf' || name.endsWith('.pdf')
      const isOff = name.match(/\.(docx|doc|xlsx|xls|pptx|ppt|csv)$/)
      return !isImg && !isPdf && !isOff
    }

    return true
  })

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0d0e14] overflow-hidden">
      {/* Top Controls Bar */}
      <div className="p-4 sm:p-5 border-b border-zinc-800/80 bg-zinc-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>{roomName} Files</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-mono font-normal">
              {files.length}
            </span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Store, view, and share docs for #{roomName.toLowerCase()}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Search bar */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files..."
              className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          {/* Grid / List view toggle */}
          <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {/* Upload Zone */}
        <FileUploadZone
          roomId={roomId}
          userId={currentUserId}
          userEmail={currentUserEmail}
          onFileUploaded={(newFile) => setFiles((prev) => [newFile, ...prev])}
        />

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: 'All Files' },
            { id: 'images', label: 'Images' },
            { id: 'pdfs', label: 'PDFs' },
            { id: 'office', label: 'Office Docs' },
            { id: 'others', label: 'Other Files' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all font-medium ${
                selectedFilter === tab.id
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20'
                  : 'bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* File Gallery */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-zinc-500">
            <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
            <span className="text-xs">Loading files...</span>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="py-20 border border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-center p-6">
            <FolderOpen className="w-12 h-12 text-zinc-600 mb-3" />
            <h3 className="text-sm font-semibold text-zinc-300 mb-1">
              {searchQuery ? 'No files match your search' : 'No files in this room yet'}
            </h3>
            <p className="text-xs text-zinc-500 max-w-xs">
              {searchQuery
                ? 'Try adjusting your search or category filter.'
                : 'Drop any file above to upload it to this room.'}
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {filteredFiles.map((f) => (
              <FileCard
                key={f.id}
                file={f}
                viewMode="grid"
                currentUserId={currentUserId}
                onPreview={(selected) => setPreviewFile(selected)}
                onDelete={(selected) => handleDeleteFile(selected)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredFiles.map((f) => (
              <FileCard
                key={f.id}
                file={f}
                viewMode="list"
                currentUserId={currentUserId}
                onPreview={(selected) => setPreviewFile(selected)}
                onDelete={(selected) => handleDeleteFile(selected)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <FilePreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />
    </div>
  )
}
