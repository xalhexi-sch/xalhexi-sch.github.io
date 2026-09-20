'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, Download, Copy, Check, File, Loader2 } from 'lucide-react'
import ImagePreview from './image-preview'
import PdfPreview from './pdf-preview'
import OfficePreview from './office-preview'
import { toast } from 'sonner'

export interface HubFile {
  id: string
  room_id: string
  uploaded_by: string
  uploader_email: string
  file_name: string
  storage_path: string
  mime_type?: string | null
  size_bytes?: number | null
  preview_url?: string | null
  created_at: string
}

interface FilePreviewModalProps {
  file: HubFile | null
  onClose: () => void
}

export default function FilePreviewModal({ file, onClose }: FilePreviewModalProps) {
  const supabase = createClient()
  const [signedUrl, setSignedUrl] = useState<string | null>(null)
  const [isLoadingUrl, setIsLoadingUrl] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!file) {
      setSignedUrl(null)
      return
    }

    const currentFile = file
    async function getSignedUrl() {
      setIsLoadingUrl(true)
      try {
        // Create 1-hour signed URL from Supabase Storage
        const { data, error } = await supabase.storage
          .from('hub-files')
          .createSignedUrl(currentFile.storage_path, 3600)

        if (error || !data?.signedUrl) {
          // Fallback to public URL if bucket is public
          const { data: pubData } = supabase.storage
            .from('hub-files')
            .getPublicUrl(currentFile.storage_path)
          setSignedUrl(pubData.publicUrl)
        } else {
          setSignedUrl(data.signedUrl)
        }
      } catch (err) {
        console.error('Failed to create signed URL:', err)
      } finally {
        setIsLoadingUrl(false)
      }
    }

    getSignedUrl()
  }, [file, supabase])

  // ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!file) return null

  const name = file.file_name.toLowerCase()
  const isImage =
    file.mime_type?.startsWith('image/') ||
    name.endsWith('.png') ||
    name.endsWith('.jpg') ||
    name.endsWith('.jpeg') ||
    name.endsWith('.webp') ||
    name.endsWith('.gif') ||
    name.endsWith('.svg')

  const isPdf = file.mime_type === 'application/pdf' || name.endsWith('.pdf')

  const isOffice =
    name.endsWith('.docx') ||
    name.endsWith('.doc') ||
    name.endsWith('.xlsx') ||
    name.endsWith('.xls') ||
    name.endsWith('.pptx') ||
    name.endsWith('.ppt') ||
    name.endsWith('.csv')

  const formatSize = (bytes?: number | null) => {
    if (!bytes) return ''
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const handleCopyLink = async () => {
    if (!signedUrl) return
    await navigator.clipboard.writeText(signedUrl)
    setCopied(true)
    toast.success('Signed link copied to clipboard (valid 1 hour)')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-[#0d0e14] border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-800/80 bg-zinc-900/60">
          <div className="flex items-center gap-3 truncate pr-4">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 shrink-0">
              <File className="w-4 h-4" />
            </div>
            <div className="truncate">
              <h2 className="text-sm font-semibold text-white truncate">{file.file_name}</h2>
              <p className="text-[11px] text-zinc-400 flex items-center gap-2">
                <span>{formatSize(file.size_bytes)}</span>
                <span>•</span>
                <span>Uploaded by {file.uploader_email.split('@')[0]}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {signedUrl && (
              <>
                <button
                  onClick={handleCopyLink}
                  title="Copy 1-hour signed URL"
                  className="p-2 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-xl transition-colors text-xs flex items-center gap-1.5"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">Copy Link</span>
                </button>

                <a
                  href={signedUrl}
                  download={file.file_name}
                  className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-colors text-xs font-medium flex items-center gap-1.5 shadow-md shadow-violet-600/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
              </>
            )}

            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 rounded-xl transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Viewer */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 flex items-center justify-center min-h-[400px]">
          {isLoadingUrl ? (
            <div className="flex flex-col items-center gap-3 text-zinc-500">
              <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
              <span className="text-xs">Generating secure preview token...</span>
            </div>
          ) : !signedUrl ? (
            <div className="text-center text-zinc-400 p-8">
              <p className="text-sm">Unable to access file storage path.</p>
            </div>
          ) : isImage ? (
            <ImagePreview url={signedUrl} fileName={file.file_name} />
          ) : isPdf ? (
            <PdfPreview url={signedUrl} fileName={file.file_name} />
          ) : isOffice ? (
            <OfficePreview
              url={signedUrl}
              fileName={file.file_name}
              mimeType={file.mime_type}
              previewPdfUrl={file.preview_url}
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center max-w-sm">
              <div className="w-16 h-16 rounded-2xl bg-zinc-800/80 border border-zinc-700 flex items-center justify-center mb-4 text-zinc-400">
                <File className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">{file.file_name}</h3>
              <p className="text-xs text-zinc-400 mb-6">
                No inline viewer available for this file type. You can download and open it locally.
              </p>
              <a
                href={signedUrl}
                download={file.file_name}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium rounded-xl flex items-center gap-2 shadow-lg shadow-violet-600/25 transition-all"
              >
                <Download className="w-4 h-4" />
                Download File
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
