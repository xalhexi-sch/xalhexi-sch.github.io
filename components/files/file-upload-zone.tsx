'use client'

import React, { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { UploadCloud, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { HubFile } from '../preview/file-preview-modal'

interface FileUploadZoneProps {
  roomId: string
  userId: string
  userEmail: string
  onFileUploaded: (file: HubFile) => void
}

const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB

export default function FileUploadZone({
  roomId,
  userId,
  userEmail,
  onFileUploaded,
}: FileUploadZoneProps) {
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string | null>(null)

  const processUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return

    setIsUploading(true)
    const filesArray = Array.from(fileList)

    for (const file of filesArray) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`"${file.name}" exceeds the 100MB file size limit.`)
        continue
      }

      const fileId = crypto.randomUUID()
      // Clean file name to prevent storage URL issues
      const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const storagePath = `${roomId}/${fileId}-${cleanName}`

      setUploadProgress(`Uploading ${file.name}...`)

      try {
        // 1. Direct browser-to-Supabase Storage upload (bypasses Vercel 4.5MB limit)
        const { error: uploadError } = await supabase.storage
          .from('hub-files')
          .upload(storagePath, file, {
            cacheControl: '3600',
            upsert: false,
          })

        if (uploadError) {
          throw uploadError
        }

        // 2. Insert metadata record into 'files' table
        const { data: dbFile, error: dbError } = await supabase
          .from('files')
          .insert({
            id: fileId,
            room_id: roomId,
            uploaded_by: userId,
            uploader_email: userEmail,
            file_name: file.name,
            storage_path: storagePath,
            mime_type: file.type || 'application/octet-stream',
            size_bytes: file.size,
          })
          .select('*')
          .single()

        if (dbError) {
          throw dbError
        }

        toast.success(`Uploaded: ${file.name}`)
        onFileUploaded(dbFile)
      } catch (err: any) {
        console.error('Upload failed:', err)
        toast.error(`Failed to upload ${file.name}: ${err.message || 'Unknown error'}`)
      }
    }

    setUploadProgress(null)
    setIsUploading(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    processUpload(e.dataTransfer.files)
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !isUploading && fileInputRef.current?.click()}
      className={`relative w-full border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
        isDragging
          ? 'border-violet-500 bg-violet-500/10 scale-[0.99]'
          : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 hover:bg-zinc-900/60'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => processUpload(e.target.files)}
      />

      <div className="flex flex-col items-center justify-center gap-2 select-none">
        <div className="w-12 h-12 rounded-2xl bg-zinc-800/80 border border-zinc-700/80 flex items-center justify-center text-zinc-400 mb-1 group-hover:text-violet-400 group-hover:border-violet-500/50 transition-colors">
          {isUploading ? (
            <Loader2 className="w-6 h-6 animate-spin text-violet-400" />
          ) : (
            <UploadCloud className="w-6 h-6 text-zinc-300" />
          )}
        </div>

        {isUploading ? (
          <div>
            <p className="text-sm font-semibold text-white">{uploadProgress}</p>
            <p className="text-xs text-zinc-400 mt-0.5">Streaming directly to storage...</p>
          </div>
        ) : (
          <div>
            <p className="text-sm font-semibold text-white">
              Drop files here or <span className="text-violet-400 underline">browse</span>
            </p>
            <p className="text-xs text-zinc-400 mt-1">
              Supports Images, PDFs, Office Docs, Archives (up to 100MB)
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
