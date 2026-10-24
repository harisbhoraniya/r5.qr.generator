"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import type { GeneratedQR } from "@/types/qr"
import {
  exportAsPng,
  exportAsJpeg,
  exportAsWebp,
  exportAsSvg,
  exportAsPdf,
  copyQrImageToClipboard,
} from "@/lib/qr"
import {
  FileImage,
  FileCode,
  FileText,
  Copy,
  Check,
  ExternalLink,
  Download,
  Palette,
} from "lucide-react"

interface QRDownloadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  qr: GeneratedQR | null
}

type AllowedFormat = "png" | "jpg" | "webp" | "svg" | "pdf"

export function QRDownloadDialog({ open, onOpenChange, qr }: QRDownloadDialogProps) {
  const [selectedFormat, setSelectedFormat] = React.useState<AllowedFormat>("png")
  const [downloadingFormat, setDownloadingFormat] = React.useState<string | null>(null)
  const [copiedForPhotoshop, setCopiedForPhotoshop] = React.useState(false)
  const [transparentBg, setTransparentBg] = React.useState(true)
  const [dimension, setDimension] = React.useState<number>(1024)
  const [statusMessage, setStatusMessage] = React.useState<string | null>(null)

  if (!qr) return null

  const handleDownload = async (format: AllowedFormat) => {
    try {
      setDownloadingFormat(format)
      const options = { dimension, transparentBg }

      switch (format) {
        case "png":
          await exportAsPng(qr, options)
          break
        case "jpg":
          await exportAsJpeg(qr, options, "jpg")
          break
        case "webp":
          await exportAsWebp(qr, options)
          break
        case "svg":
          await exportAsSvg(qr, options)
          break
        case "pdf":
          await exportAsPdf(qr)
          break
      }
      setStatusMessage(`${format.toUpperCase()} downloaded successfully!`)
      setTimeout(() => setStatusMessage(null), 3000)
    } catch {
      setStatusMessage(`Failed to export ${format.toUpperCase()}`)
      setTimeout(() => setStatusMessage(null), 3000)
    } finally {
      setDownloadingFormat(null)
    }
  }

  const handleCopyPhotoshop = async () => {
    try {
      await copyQrImageToClipboard(qr, transparentBg)
      setCopiedForPhotoshop(true)
      setStatusMessage("QR copied to clipboard! Open Photoshop and press Ctrl + V")
      setTimeout(() => {
        setCopiedForPhotoshop(false)
        setStatusMessage(null)
      }, 4000)
    } catch {
      setStatusMessage("Failed to copy image to clipboard")
      setTimeout(() => setStatusMessage(null), 3000)
    }
  }

  const handleOpenPhotoshopWeb = () => {
    handleCopyPhotoshop()
    window.open("https://photoshop.adobe.com", "_blank", "noopener,noreferrer")
  }

  const handleOpenAdobeExpress = () => {
    handleCopyPhotoshop()
    window.open("https://new.express.adobe.com", "_blank", "noopener,noreferrer")
  }

  const formatList: {
    id: AllowedFormat
    name: string
    ext: string
    desc: string
    icon: React.ComponentType<{ className?: string }>
  }[] = [
    {
      id: "png",
      name: "PNG",
      ext: ".png",
      desc: "Lossless raster with optional transparent background",
      icon: FileImage,
    },
    {
      id: "jpg",
      name: "JPEG / JPG",
      ext: ".jpg",
      desc: "Standard high-contrast white background image",
      icon: FileImage,
    },
    {
      id: "webp",
      name: "WEBP",
      ext: ".webp",
      desc: "Ultra compressed format for modern websites",
      icon: FileImage,
    },
    {
      id: "svg",
      name: "SVG Vector",
      ext: ".svg",
      desc: "Infinite resolution vector (CorelDRAW / Illustrator)",
      icon: FileCode,
    },
    {
      id: "pdf",
      name: "PDF Document",
      ext: ".pdf",
      desc: "Standard centered print document",
      icon: FileText,
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-6 sm:p-7">
        <DialogHeader className="text-left">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-foreground text-background">
              <Download className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg">Download QR Code</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Select your preferred format:
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Global Options: Resolution & Transparency */}
        <div className="rounded-xl border border-border/80 bg-muted/20 p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-[11px]">Resolution:</span>
            <div className="flex items-center gap-1.5">
              {[512, 1024, 2048].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setDimension(size)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                    dimension === size
                      ? "bg-foreground text-background font-semibold"
                      : "bg-background border border-border/70 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {size}px
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={transparentBg}
              onChange={(e) => setTransparentBg(e.target.checked)}
              className="rounded border-border accent-foreground cursor-pointer h-3.5 w-3.5"
            />
            <span className="text-[11px] font-medium text-foreground">
              Transparent Background
            </span>
          </label>
        </div>

        {/* Formats Selection Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold text-foreground uppercase tracking-wider block">
              Choose Format
            </Label>
            <span className="text-[11px] text-muted-foreground">
              Selected: <strong className="text-foreground uppercase">{selectedFormat}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {formatList.map((item) => {
              const Icon = item.icon
              const isSelected = selectedFormat === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedFormat(item.id)}
                  className={`flex items-start gap-3 rounded-xl border p-3 text-left transition-all cursor-pointer ${
                    isSelected
                      ? "border-foreground bg-muted/60 ring-1 ring-foreground shadow-xs font-semibold"
                      : "border-border/80 bg-card hover:border-foreground/40 hover:bg-muted/30"
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border mt-0.5 ${
                      isSelected
                        ? "bg-foreground text-background border-foreground"
                        : "bg-muted border-border/60 text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        {item.name}
                        {isSelected && <Check className="h-3.5 w-3.5 text-foreground" />}
                      </span>
                      <Badge
                        variant={isSelected ? "default" : "secondary"}
                        className="text-[10px] px-1.5 py-0 font-normal"
                      >
                        {item.ext}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Dedicated Download Trigger Button */}
          <div className="pt-1">
            <Button
              type="button"
              size="lg"
              onClick={() => handleDownload(selectedFormat)}
              disabled={Boolean(downloadingFormat)}
              className="w-full h-11 text-xs font-semibold gap-2 shadow-xs cursor-pointer bg-foreground text-background hover:bg-foreground/90 transition-all active:scale-[0.99]"
            >
              {downloadingFormat ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Downloading {selectedFormat.toUpperCase()}...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Download {selectedFormat.toUpperCase()} ({selectedFormat === "svg" ? "Vector" : `${dimension}px`})
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Design Software Redirect & Direct Import Section */}
        <div className="rounded-xl border border-border/80 bg-muted/30 p-4 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-foreground" />
              <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                Direct Add to Photoshop & CorelDRAW
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground font-medium">1-Click Actions</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Photoshop Direct Box */}
            <div className="rounded-lg border border-border/70 bg-background p-3 flex flex-col justify-between space-y-2.5">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded bg-blue-600 text-[10px] font-black text-white">
                      Ps
                    </span>
                    Adobe Photoshop
                  </span>
                  <Badge variant="outline" className="text-[9px] font-mono">
                    Paste / Web
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1 leading-snug">
                  Direct paste into desktop Photoshop or open online.
                </p>
              </div>

              <div className="flex flex-col gap-1.5 pt-1">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleCopyPhotoshop}
                  className="h-8 text-xs font-medium justify-center gap-1.5 cursor-pointer w-full"
                >
                  {copiedForPhotoshop ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Copied! Press Ctrl + V</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy for Photoshop (Ctrl + V)</span>
                    </>
                  )}
                </Button>

                <div className="grid grid-cols-2 gap-1.5">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={handleOpenPhotoshopWeb}
                    className="h-7 text-[11px] justify-center gap-1 cursor-pointer border border-border/60 hover:bg-muted"
                  >
                    <span>Open Web Ps</span>
                    <ExternalLink className="h-3 w-3 opacity-70" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={handleOpenAdobeExpress}
                    className="h-7 text-[11px] justify-center gap-1 cursor-pointer border border-border/60 hover:bg-muted"
                  >
                    <span>Adobe Express</span>
                    <ExternalLink className="h-3 w-3 opacity-70" />
                  </Button>
                </div>
              </div>
            </div>

            {/* CorelDRAW Direct Box */}
            <div className="rounded-lg border border-border/70 bg-background p-3 flex flex-col justify-between space-y-2.5">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded bg-emerald-600 text-[10px] font-black text-white">
                      CD
                    </span>
                    CorelDRAW
                  </span>
                  <Badge variant="outline" className="text-[9px] font-mono">
                    Vector / PDF
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1 leading-snug">
                  Download tight vector SVG for direct drag-and-drop into CorelDRAW.
                </p>
              </div>

              <div className="flex flex-col gap-1.5 pt-1">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleDownload("svg")}
                  className="h-8 text-xs font-medium justify-center gap-1.5 cursor-pointer w-full bg-foreground text-background hover:bg-foreground/90"
                >
                  <FileCode className="h-3.5 w-3.5" />
                  <span>Download SVG for CorelDRAW</span>
                </Button>

                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDownload("pdf")}
                  className="h-7 text-[11px] justify-center gap-1 cursor-pointer border border-border/60 hover:bg-muted"
                >
                  <FileText className="h-3 w-3" />
                  <span>Print-Ready PDF for Corel</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Status message */}
        {statusMessage && (
          <div className="text-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 animate-in fade-in-50">
            {statusMessage}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
