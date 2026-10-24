import type {
  ContrastCheckResult,
  QRContentData,
  QRSettings,
  QRValidationResult,
} from "@/types/qr"
import {
  buildEmailPayload,
  buildInstagramPayload,
  buildPdfPayload,
  buildPhonePayload,
  buildSmsPayload,
  buildTextPayload,
  buildUrlPayload,
  buildVCardPayload,
  buildWhatsappPayload,
  buildWifiPayload,
} from "./qr-payloads"

/**
 * Calculates relative luminance for WCAG contrast ratio calculation.
 */
function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

/**
 * Parses a hex color string to RGB numbers.
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleanHex = hex.trim().replace(/^#/, "")
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16)
    const g = parseInt(cleanHex[1] + cleanHex[1], 16)
    const b = parseInt(cleanHex[2] + cleanHex[2], 16)
    return isNaN(r) || isNaN(g) || isNaN(b) ? null : { r, g, b }
  }
  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.slice(0, 2), 16)
    const g = parseInt(cleanHex.slice(2, 4), 16)
    const b = parseInt(cleanHex.slice(4, 6), 16)
    return isNaN(r) || isNaN(g) || isNaN(b) ? null : { r, g, b }
  }
  return null
}

/**
 * Validates whether a string is a valid 3- or 6-digit hex color.
 */
export function isValidHexColor(hex: string): boolean {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex.trim())
}

/**
 * Calculates WCAG contrast ratio between two hex colors.
 */
export function calculateContrastRatio(foreground: string, background: string): ContrastCheckResult {
  const fgRgb = hexToRgb(foreground)
  const bgRgb = hexToRgb(background)

  if (!fgRgb || !bgRgb) {
    return {
      ratio: 1,
      isAcceptable: false,
      warning: "Invalid color format. Please use valid hex colors like #000000.",
    }
  }

  const lumFg = getRelativeLuminance(fgRgb.r, fgRgb.g, fgRgb.b)
  const lumBg = getRelativeLuminance(bgRgb.r, bgRgb.g, bgRgb.b)

  const lighter = Math.max(lumFg, lumBg)
  const darker = Math.min(lumFg, lumBg)
  const ratio = (lighter + 0.05) / (darker + 0.05)
  const roundedRatio = Math.round(ratio * 10) / 10

  if (ratio < 3.0) {
    return {
      ratio: roundedRatio,
      isAcceptable: false,
      warning: `Poor contrast (${roundedRatio}:1). Most cameras will not scan this QR code. Maintain at least 4.5:1.`,
    }
  }

  if (ratio < 4.5) {
    return {
      ratio: roundedRatio,
      isAcceptable: true,
      warning: `Moderate contrast (${roundedRatio}:1). Code is scan-capable but may struggle in low lighting.`,
    }
  }

  return {
    ratio: roundedRatio,
    isAcceptable: true,
  }
}

/**
 * Basic email format validator.
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

/**
 * Basic phone number format validator (accepts international format with +, digits, spaces, hyphens).
 */
export function isValidPhoneNumber(phone: string): boolean {
  const digits = phone.replace(/\D/g, "")
  return digits.length >= 4 && digits.length <= 16
}

/**
 * Validates a URL string. Accepts domains with or without scheme.
 */
export function isValidUrl(url: string): boolean {
  const trimmed = url.trim()
  if (!trimmed) return false

  try {
    const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
    const parsed = new URL(withScheme)
    // Domain should have at least one dot or be localhost
    return parsed.hostname === "localhost" || parsed.hostname.includes(".")
  } catch {
    return false
  }
}

/**
 * Validates input data for any given QR content mode.
 */
export function validateQRContent(content: QRContentData): QRValidationResult {
  const errors: Record<string, string> = {}
  const warnings: string[] = []
  let payload = ""

  switch (content.type) {
    case "url": {
      const { url } = content.data
      if (!url || !url.trim()) {
        errors.url = "Website URL is required."
      } else if (!isValidUrl(url)) {
        errors.url = "Please enter a valid website address (e.g. example.com or https://site.com)."
      } else {
        payload = buildUrlPayload(content.data)
      }
      break
    }

    case "pdf": {
      const { pdfUrl } = content.data
      if (!pdfUrl || !pdfUrl.trim()) {
        errors.pdfUrl = "PDF document link is required."
      } else if (!isValidUrl(pdfUrl)) {
        errors.pdfUrl = "Please enter a valid web link to your PDF (e.g. Google Drive, Dropbox, or website link)."
      } else {
        payload = buildPdfPayload(content.data)
      }
      break
    }

    case "text": {
      const { text } = content.data
      if (!text || !text.trim()) {
        errors.text = "Text content cannot be empty."
      } else {
        if (text.length > 2000) {
          warnings.push("High character count may produce a dense QR code that is harder to scan from a distance.")
        }
        payload = buildTextPayload(content.data)
      }
      break
    }

    case "instagram": {
      const { username } = content.data
      const cleanHandle = username.trim().replace(/^@/, "").replace(/^(?:https?:\/\/)?(?:www\.)?instagram\.com\//i, "").replace(/\/.*$/, "")
      if (!cleanHandle) {
        errors.username = "Instagram username or profile link is required."
      } else {
        payload = buildInstagramPayload(content.data)
      }
      break
    }

    case "whatsapp": {
      const { phoneNumber } = content.data
      if (!phoneNumber || !phoneNumber.trim()) {
        errors.phoneNumber = "Phone number with country code is required."
      } else if (!isValidPhoneNumber(phoneNumber)) {
        errors.phoneNumber = "Please enter a valid phone number including country code (e.g. +1 555 123 4567)."
      } else {
        payload = buildWhatsappPayload(content.data)
      }
      break
    }

    case "phone": {
      const { phoneNumber } = content.data
      if (!phoneNumber || !phoneNumber.trim()) {
        errors.phoneNumber = "Phone number is required."
      } else if (!isValidPhoneNumber(phoneNumber)) {
        errors.phoneNumber = "Please enter a valid phone number."
      } else {
        payload = buildPhonePayload(content.data)
      }
      break
    }

    case "email": {
      const { email } = content.data
      if (!email || !email.trim()) {
        errors.email = "Recipient email address is required."
      } else if (!isValidEmail(email)) {
        errors.email = "Please enter a valid email address."
      } else {
        payload = buildEmailPayload(content.data)
      }
      break
    }

    case "wifi": {
      const { ssid, password, encryption } = content.data
      if (!ssid || !ssid.trim()) {
        errors.ssid = "Network name (SSID) is required."
      }
      if (encryption !== "nopass" && (!password || password.length < 8)) {
        errors.password = "WPA/WPA2 networks require a password of at least 8 characters."
      }
      if (Object.keys(errors).length === 0) {
        payload = buildWifiPayload(content.data)
      }
      break
    }

    case "vcard": {
      const { firstName, lastName, email, phone, website } = content.data
      if (!firstName || !firstName.trim()) {
        errors.firstName = "First name is required."
      }
      if (email && email.trim() && !isValidEmail(email)) {
        errors.email = "Please enter a valid email address."
      }
      if (phone && phone.trim() && !isValidPhoneNumber(phone)) {
        errors.phone = "Please enter a valid phone number."
      }
      if (website && website.trim() && !isValidUrl(website)) {
        errors.website = "Please enter a valid website URL."
      }
      if (Object.keys(errors).length === 0) {
        payload = buildVCardPayload(content.data)
      }
      break
    }

    case "sms": {
      const { phoneNumber } = content.data
      if (!phoneNumber || !phoneNumber.trim()) {
        errors.phoneNumber = "Phone number is required."
      } else if (!isValidPhoneNumber(phoneNumber)) {
        errors.phoneNumber = "Please enter a valid phone number."
      } else {
        payload = buildSmsPayload(content.data)
      }
      break
    }
  }

  // Payload density warning
  if (payload.length > 2500) {
    errors.payload = "QR payload exceeds standard density limits (2,500 characters). Please reduce the content length."
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    payload: Object.keys(errors).length === 0 ? payload : undefined,
    warnings,
  }
}

/**
 * Validates customization settings.
 */
export function validateQRSettings(settings: QRSettings): { isValid: boolean; errors: Record<string, string>; warnings: string[] } {
  const errors: Record<string, string> = {}
  const warnings: string[] = []

  if (!isValidHexColor(settings.foregroundColor)) {
    errors.foregroundColor = "Foreground must be a valid hex color (#000000)."
  }
  if (!isValidHexColor(settings.backgroundColor)) {
    errors.backgroundColor = "Background must be a valid hex color (#FFFFFF)."
  }

  const contrast = calculateContrastRatio(settings.foregroundColor, settings.backgroundColor)
  if (contrast.warning) {
    if (!contrast.isAcceptable) {
      warnings.push(contrast.warning)
    } else {
      warnings.push(contrast.warning)
    }
  }

  if (settings.margin < 0 || settings.margin > 10) {
    errors.margin = "Margin must be between 0 and 10 modules."
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings,
  }
}

/**
 * Standard default QR settings (Exact tight bounding box, zero extra background margin).
 */
export const DEFAULT_QR_SETTINGS: QRSettings = {
  foregroundColor: "#000000",
  backgroundColor: "#FFFFFF",
  dimension: 1024,
  margin: 0,
  errorCorrectionLevel: "M",
}
