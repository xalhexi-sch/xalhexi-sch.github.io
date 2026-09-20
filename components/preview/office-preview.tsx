'use client'

import React from 'react'
import { FileSpreadsheet, FileText, Presentation, Download, Sparkles, Server } from 'lucide-react'
import PdfPreview from './pdf-preview'

interface OfficePreviewProps {
  url: string
  fileName: string
  mimeType?: string | null
  previewPdfUrl?: string | null
}

export default function OfficePreview({
  url,
  fileName,
  mimeType,
  previewPdfUrl,
}: OfficePreviewProps) {
  // If a converted PDF exists from Gotenberg, render it using PdfPreview!
  if (previewPdfUrl) {
    return <PdfPreview url={previewPdfUrl} fileName={`${fileName} (Converted Preview)`} />
  }

  const isWord = fileName.endsWith('.docx') || fileName.endsWith('.doc') || mimeType?.includes('word')
  const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || fileName.endsWith('.csv') || mimeType?.includes('sheet') || mimeType?.includes('excel')
  const isPowerPoint = fileName.endsWith('.pptx') || fileName.endsWith('.ppt') || mimeType?.includes('presentation')

  const getDocMeta = () => {
    if (isWord) {
      return {
        type: 'Microsoft Word Document',
        color: 'text-blue-400',
        bg: 'bg-blue-500/10 border-blue-500/30',
        icon: FileText,
      }
    }
    if (isExcel) {
      return {
        type: 'Microsoft Excel Spreadsheet',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10 border-emerald-500/30',
        icon: FileSpreadsheet,
      }
    }
    if (isPowerPoint) {
      return {
        type: 'Microsoft PowerPoint Presentation',
        color: 'text-amber-400',
        bg: 'bg-amber-500/10 border-amber-500/30',
        icon: Presentation,
      }
    }
    return {
      type: 'Office Document',
      color: 'text-violet-400',
      bg: 'bg-violet-500/10 border-violet-500/30',
      icon: FileText,
    }
  }

  const meta = getDocMeta()
  const IconComponent = meta.icon

  return (
    <div className="w-full h-[60vh] flex flex-col items-center justify-center bg-zinc-950/60 rounded-2xl border border-zinc-800 p-8 text-center relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute w-[300px] h-[300px] bg-gradient-to-br from-violet-600/10 to-transparent blur-[90px] rounded-full pointer-events-none" />

      {/* Doc Icon Badge */}
      <div className={`w-20 h-20 rounded-2xl ${meta.bg} border flex items-center justify-center mb-5 shadow-xl relative z-10`}>
        <IconComponent className={`w-10 h-10 ${meta.color}`} />
      </div>

      <h3 className="text-lg font-bold text-white mb-1 truncate max-w-md relative z-10">
        {fileName}
      </h3>
      <p className="text-xs text-zinc-400 mb-6 font-medium relative z-10">{meta.type}</p>

      {/* Primary Action: Download file */}
      <div className="flex items-center gap-3 relative z-10 mb-8">
        <a
          href={url}
          download={fileName}
          className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-violet-600/25 transition-all active:scale-[0.98]"
        >
          <Download className="w-4 h-4" />
          Download {isExcel ? 'Spreadsheet' : isPowerPoint ? 'Slides' : 'Document'}
        </a>
      </div>

      {/* Office Integration Status (Phase 2 & Phase 3) */}
      <div className="max-w-md bg-zinc-900/80 border border-zinc-800/80 rounded-xl p-3.5 text-left relative z-10 text-xs">
        <div className="flex items-center gap-2 text-zinc-300 font-semibold mb-1">
          <Server className="w-3.5 h-3.5 text-violet-400" />
          <span>Office Engine Pipeline</span>
        </div>
        <p className="text-zinc-400 text-[11px] leading-relaxed">
          In Phase 1, Office files are securely stored in your Hub and ready for immediate download. When you deploy Gotenberg (Phase 2) or OnlyOffice (Phase 3) on your VPS, inline conversion and browser editing will activate automatically for this file.
        </p>
      </div>
    </div>
  )
}
