'use client'

import React, { useState } from 'react'
import { ZoomIn, ZoomOut, RotateCcw, Image as ImageIcon } from 'lucide-react'

interface ImagePreviewProps {
  url: string
  fileName: string
}

export default function ImagePreview({ url, fileName }: ImagePreviewProps) {
  const [scale, setScale] = useState(1)
  const [isLoaded, setIsLoaded] = useState(false)

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.25, 3))
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.25, 0.5))
  const handleReset = () => setScale(1)

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-black/40 overflow-hidden select-none">
      {/* Floating Zoom Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-xl px-2.5 py-1.5 shadow-xl text-zinc-300">
        <button
          onClick={handleZoomOut}
          disabled={scale <= 0.5}
          title="Zoom Out"
          className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors disabled:opacity-30"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="text-xs font-mono px-1 min-w-[42px] text-center">
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={handleZoomIn}
          disabled={scale >= 3}
          title="Zoom In"
          className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors disabled:opacity-30"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-zinc-800 mx-0.5" />
        <button
          onClick={handleReset}
          title="Reset Zoom"
          className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Image Display */}
      <div className="w-full h-full flex items-center justify-center overflow-auto p-6">
        <div
          style={{ transform: `scale(${scale})`, transition: 'transform 0.15s ease-out' }}
          className="relative max-w-full max-h-full flex items-center justify-center"
        >
          <img
            src={url}
            alt={fileName}
            onLoad={() => setIsLoaded(true)}
            className={`max-h-[70vh] w-auto max-w-full object-contain rounded-lg shadow-2xl transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
          {!isLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-zinc-500">
              <ImageIcon className="w-8 h-8 animate-pulse text-zinc-600" />
              <span className="text-xs">Loading high-resolution image...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
