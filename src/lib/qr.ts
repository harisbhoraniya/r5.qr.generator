import QRCode from "qrcode"
import { jsPDF } from "jspdf"
import type { ExportFormat, GeneratedQR, QRContentType, QRSettings } from "@/types/qr"

export interface ExportOptions {
  dimension?: number
  transparentBg?: boolean
  customTitle?: string
}

/**
 * Generates both DataURL (for preview and raster export) and SVG string (for vector export)
 * with exact tight bounds (margin: 0, no extra border/background).
 */
export async function generateQRCode(
  payload: string,
  settings: QRSettings,
  contentType: QRContentType
): Promise<GeneratedQR> {
  const margin = settings.margin ?? 0
  const width = settings.dimension || 1024

  // 1. Generate raster DataURL (clean white background for preview)
  const dataUrl = await QRCode.toDataURL(payload, {
    errorCorrectionLevel: settings.errorCorrectionLevel,
    margin,
    width,
    color: {
      dark: settings.foregroundColor || "#000000",
      light: settings.backgroundColor || "#FFFFFF",
    },
  })

  // 2. Generate vector SVG string (margin: 0)
  const svgString = await QRCode.toString(payload, {
    type: "svg",
    errorCorrectionLevel: settings.errorCorrectionLevel,
    margin,
    color: {
      dark: settings.foregroundColor || "#000000",
      light: settings.backgroundColor || "#FFFFFF",
    },
  })

  return {
    dataUrl,
    svgString,
    payload,
    settings: {
      ...settings,
      margin,
    },
    contentType,
    timestamp: Date.now(),
  }
}

/**
 * Generates a clean, timestamped filename for downloads.
 */
export function generateFilename(contentType: QRContentType, extension: ExportFormat): string {
  const dateStr = new Date().toISOString().slice(0, 10)
  return `qr-code-${contentType}-${dateStr}.${extension}`
}

/**
 * Triggers browser download for a Blob or DataURL.
 */
export function triggerBrowserDownload(url: string, filename: string): void {
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Renders the QR code directly to an HTMLCanvasElement with zero extra margin
 * and custom dimension/transparency.
 */
export async function renderQRCanvas(
  payload: string,
  options: {
    dimension?: number
    transparentBg?: boolean
    errorCorrectionLevel?: "L" | "M" | "Q" | "H"
  } = {}
): Promise<HTMLCanvasElement> {
  const dimension = options.dimension || 1024
  const errorCorrectionLevel = options.errorCorrectionLevel || "M"
  const transparentBg = options.transparentBg ?? true

  const canvas = document.createElement("canvas")
  canvas.width = dimension
  canvas.height = dimension

  await QRCode.toCanvas(canvas, payload, {
    errorCorrectionLevel,
    margin: 0, // Zero extra background or margin
    width: dimension,
    color: {
      dark: "#000000",
      light: transparentBg ? "#00000000" : "#FFFFFF",
    },
  })

  return canvas
}

/**
 * Exports as PNG with tight crop (no extra background padding).
 */
export async function exportAsPng(qr: GeneratedQR, options: ExportOptions = {}): Promise<void> {
  const dimension = options.dimension || 1024
  const transparentBg = options.transparentBg ?? true
  const canvas = await renderQRCanvas(qr.payload, {
    dimension,
    transparentBg,
    errorCorrectionLevel: qr.settings.errorCorrectionLevel,
  })

  const targetDataUrl = canvas.toDataURL("image/png")
  const filename = generateFilename(qr.contentType, "png")
  triggerBrowserDownload(targetDataUrl, filename)
}

/**
 * Exports as JPEG / JPG with tight crop (white background, standard quality).
 */
export async function exportAsJpeg(qr: GeneratedQR, options: ExportOptions = {}, ext: "jpeg" | "jpg" = "jpg"): Promise<void> {
  const dimension = options.dimension || 1024
  // JPEG doesn't support alpha transparency, so render on pure white with margin: 0
  const canvas = await renderQRCanvas(qr.payload, {
    dimension,
    transparentBg: false,
    errorCorrectionLevel: qr.settings.errorCorrectionLevel,
  })

  const targetDataUrl = canvas.toDataURL("image/jpeg", 0.96)
  const filename = generateFilename(qr.contentType, ext)
  triggerBrowserDownload(targetDataUrl, filename)
}

/**
 * Exports as WEBP with tight crop.
 */
export async function exportAsWebp(qr: GeneratedQR, options: ExportOptions = {}): Promise<void> {
  const dimension = options.dimension || 1024
  const transparentBg = options.transparentBg ?? true
  const canvas = await renderQRCanvas(qr.payload, {
    dimension,
    transparentBg,
    errorCorrectionLevel: qr.settings.errorCorrectionLevel,
  })

  const targetDataUrl = canvas.toDataURL("image/webp", 0.96)
  const filename = generateFilename(qr.contentType, "webp")
  triggerBrowserDownload(targetDataUrl, filename)
}

/**
 * Exports the QR code as a vector SVG file without extra margin or background.
 */
export async function exportAsSvg(qr: GeneratedQR, options: ExportOptions = {}): Promise<void> {
  const transparentBg = options.transparentBg ?? true

  const svgString = await QRCode.toString(qr.payload, {
    type: "svg",
    errorCorrectionLevel: qr.settings.errorCorrectionLevel,
    margin: 0, // Zero extra background
    color: {
      dark: "#000000",
      light: transparentBg ? "#00000000" : "#FFFFFF",
    },
  })

  const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" })
  const objectUrl = URL.createObjectURL(blob)
  const filename = generateFilename(qr.contentType, "svg")

  try {
    triggerBrowserDownload(objectUrl, filename)
  } finally {
    setTimeout(() => {
      URL.revokeObjectURL(objectUrl)
    }, 1000)
  }
}

/**
 * Exports a clean PDF document containing ONLY the centered QR code (no headers, lines, or text).
 */
export async function exportAsPdf(qr: GeneratedQR): Promise<void> {
  const printDataUrl = await QRCode.toDataURL(qr.payload, {
    errorCorrectionLevel: qr.settings.errorCorrectionLevel,
    margin: 0, // Tight crop
    width: 1024,
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
  })

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  const pageWidth = 210
  const pageHeight = 297

  // QR Code centered cleanly on page (no extra text, lines, or headers)
  const qrSize = 140
  const qrX = (pageWidth - qrSize) / 2
  const qrY = (pageHeight - qrSize) / 2
  doc.addImage(printDataUrl, "PNG", qrX, qrY, qrSize, qrSize)

  const filename = generateFilename(qr.contentType, "pdf")
  doc.save(filename)
}

/**
 * Copies the tight-cropped QR code PNG directly to clipboard for immediate paste (Ctrl+V) in Photoshop or CorelDRAW.
 */
export async function copyQrImageToClipboard(qr: GeneratedQR, transparent = true): Promise<void> {
  const canvas = await renderQRCanvas(qr.payload, {
    dimension: 1024,
    transparentBg: transparent,
    errorCorrectionLevel: qr.settings.errorCorrectionLevel,
  })

  return new Promise((resolve, reject) => {
    canvas.toBlob(async (blob) => {
      if (!blob) {
        reject(new Error("Failed to create blob for clipboard"))
        return
      }
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ])
        resolve()
      } catch (err) {
        reject(err)
      }
    }, "image/png")
  })
}
