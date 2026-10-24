"use client"

import * as React from "react"
import { QrCode, AlertTriangle, ShieldCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { GeneratedQR, QRContentType } from "@/types/qr"

interface QRPreviewProps {
  qr: GeneratedQR | null
  contentType: QRContentType
  isValid: boolean
  isGenerating: boolean
  warnings: string[]
}

export function QRPreview({
  qr,
  contentType,
  isValid,
  isGenerating,
  warnings,
}: QRPreviewProps) {
  return (
    <div className="flex flex-col h-full justify-between space-y-6">
      {/* Top Preview Card */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">Live Optical Preview</h3>
            <Badge variant="outline" className="text-[11px] uppercase tracking-wider font-mono">
              {contentType}
            </Badge>
          </div>
          {qr && (
            <span className="text-[11px] font-mono text-muted-foreground">
              EC: {qr.settings.errorCorrectionLevel} • {qr.settings.dimension}px
            </span>
          )}
        </div>

        {/* QR Display Container */}
        <div className="relative flex items-center justify-center min-h-[320px] sm:min-h-[380px] rounded-xl border border-border/80 bg-muted/20 p-6 overflow-hidden">
          {/* Subtle checkered backdrop pattern for transparency awareness */}
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
            style={{
              backgroundImage:
                "linear-gradient(45deg, #888 25%, transparent 25%), linear-gradient(-45deg, #888 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #888 75%), linear-gradient(-45deg, transparent 75%, #888 75%)",
              backgroundSize: "20px 20px",
              backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
            }}
          />

          {qr && isValid ? (
            <div className="relative z-10 flex flex-col items-center">
              {/* QR Image Frame with soft shadow (tight exact crop, no extra margin) */}
              <div
                className="relative rounded-lg p-0 overflow-hidden shadow-md border border-border/80 transition-all duration-200"
                style={{ backgroundColor: qr.settings.backgroundColor }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qr.dataUrl}
                  alt={`Generated QR Code for ${contentType}`}
                  width={280}
                  height={280}
                  className="max-w-[240px] sm:max-w-[280px] h-auto object-contain transition-opacity duration-150 select-none"
                  style={{
                    opacity: isGenerating ? 0.6 : 1,
                  }}
                />

                {isGenerating && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/30 backdrop-blur-[1px] rounded-lg">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
                  </div>
                )}
              </div>

              {/* Status indicator below QR */}
              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Permanent Static QR • Verified Scannable</span>
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 max-w-xs">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-dashed border-border bg-background shadow-xs text-muted-foreground/60 mb-3">
                <QrCode className="h-7 w-7" />
              </div>
              <h4 className="text-sm font-semibold text-foreground">Ready to Generate</h4>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Enter your details on the left and click &quot;Generate QR Code&quot; to preview and download.
              </p>
            </div>
          )}
        </div>

        {/* Warnings list */}
        {warnings.length > 0 && (
          <div className="space-y-1.5">
            {warnings.map((warn, i) => (
              <div
                key={i}
                className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-2.5 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2"
              >
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                <span className="text-[11px] leading-relaxed">{warn}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
