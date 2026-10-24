"use client"

import * as React from "react"
import { Download, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { GeneratedQR } from "@/types/qr"
import { QRDownloadDialog } from "@/components/qr-download-dialog"

interface QRDownloadsProps {
  qr: GeneratedQR | null
  isValid: boolean
  isGenerating: boolean
}

export function QRDownloads({ qr, isValid, isGenerating }: QRDownloadsProps) {
  const [dialogOpen, setDialogOpen] = React.useState(false)

  const isDisabled = !qr || !isValid || isGenerating

  return (
    <div className="pt-4 border-t border-border/70 space-y-3">
      {/* Primary Download Button */}
      <Button
        type="button"
        size="lg"
        onClick={() => setDialogOpen(true)}
        disabled={isDisabled}
        className="w-full h-12 text-sm font-semibold gap-2.5 cursor-pointer shadow-sm bg-foreground text-background hover:bg-foreground/90 transition-all active:scale-[0.99] disabled:opacity-50"
      >
        <Download className="h-4.5 w-4.5" />
        <span>{qr ? "Download QR" : "Generate QR First"}</span>
      </Button>

      {/* Helper spec notes */}
      <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
        <span>PNG • JPG • WEBP • SVG • PDF</span>
      </div>

      {/* Format & Design Tools Modal Dialog */}
      <QRDownloadDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        qr={qr}
      />
    </div>
  )
}
