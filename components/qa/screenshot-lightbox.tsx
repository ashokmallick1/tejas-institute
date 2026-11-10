'use client';

import React from 'react';
import { X, ZoomIn, ZoomOut, Download, ExternalLink } from 'lucide-react';

interface ScreenshotLightboxProps {
  imageUrl: string | null;
  title?: string;
  onClose: () => void;
}

export function ScreenshotLightbox({ imageUrl, title, onClose }: ScreenshotLightboxProps) {
  const [scale, setScale] = React.useState(1);

  if (!imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full max-h-[90vh] flex flex-col rounded-2xl border border-border/80 bg-card overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-border bg-muted/40 px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-foreground">
              {title || 'Error Screenshot Evidence'}
            </span>
            <span className="rounded bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-400 border border-rose-500/20">
              Bug Evidence
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <button
              onClick={() => setScale((s) => Math.max(0.5, s - 0.25))}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition"
              title="Zoom out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="text-xs font-mono text-muted-foreground w-12 text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={() => setScale((s) => Math.min(2.5, s + 0.25))}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition"
              title="Zoom in"
            >
              <ZoomIn className="h-4 w-4" />
            </button>

            {/* Download */}
            <a
              href={imageUrl}
              download="qa-screenshot-evidence.png"
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition"
              title="Download image"
            >
              <Download className="h-4 w-4" />
            </a>

            {/* Close */}
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition ml-2"
              title="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Image Display Area */}
        <div className="overflow-auto max-h-[calc(90vh-60px)] p-6 flex items-center justify-center bg-black/40">
          <img
            src={imageUrl}
            alt={title || 'Screenshot Evidence'}
            style={{ transform: `scale(${scale})`, transition: 'transform 0.15s ease-out' }}
            className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-lg border border-border/40"
          />
        </div>
      </div>
    </div>
  );
}
