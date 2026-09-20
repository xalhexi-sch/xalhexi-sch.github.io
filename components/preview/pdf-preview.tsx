'use client'

import React, { useState } from 'react'
import { FileText, ExternalLink, Download, AlertCircle } from 'lucide-react'

interface PdfPreviewProps {
  url: string
  fileName: string
}

export default function PdfPreview({ url, fileName }: PdfPreviewProps) {
  const [loadError, setLoadError] = useState(false)

  return (
    <div className="relative w-full h-[75vh] flex flex-col bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800/80">
      {/* Top action bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/90 border-b border-zinc-800 text-xs text-zinc-400">
        <div className="flex items-center gap-2 font-medium text-zinc-200 truncate">
          <FileText className="w-4 h-4 text-red-400 shrink-0" />
          <span className="truncate">{fileName}</span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open in Tab</span>
          </a>
          <a
            href={url}
            download={fileName}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors font-medium"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </a>
        </div>
      </div>

      {/* Embedded PDF Viewer */}
      {!loadError ? (
        <iframe
          src={`${url}#toolbar=1&navpanes=1`}
          title={fileName}
          className="w-full h-full border-none bg-zinc-900"
          onError={() => setLoadError(true)}
        />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <AlertCircle className="w-10 h-10 text-zinc-600 mb-3" />
          <h3 className="text-sm font-semibold text-zinc-200 mb-1">Inline preview unavailable</h3>
          <p className="text-xs text-zinc-400 max-w-sm mb-4">
            Your browser could not render the PDF embedded directly. You can download or view it in a separate tab.
          </p>
          <a
            href={url}
            download={fileName}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium rounded-xl flex items-center gap-2 shadow-lg shadow-violet-600/20"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </a>
        </div>
      )}
    </div>
  )
}
