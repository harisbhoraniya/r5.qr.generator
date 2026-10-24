import type {
  EmailContentData,
  InstagramContentData,
  PdfContentData,
  PhoneContentData,
  SmsContentData,
  TextContentData,
  UrlContentData,
  VCardContentData,
  WhatsappContentData,
  WifiContentData,
} from "@/types/qr"

/**
 * Escapes characters for Wi-Fi QR code syntax: \ , ; : "
 */
export function escapeWifiString(value: string): string {
  return value.replace(/([\\;,:"'])/g, "\\$1")
}

/**
 * Escapes text for vCard 3.0 fields: \ , ; \n
 */
export function escapeVCardString(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n")
}

/**
 * Normalizes phone numbers for URL/tel scheme usage.
 * Preserves leading + if present, strips whitespace, hyphens, parentheses.
 */
export function normalizePhoneNumber(phone: string): string {
  const trimmed = phone.trim()
  const hasPlus = trimmed.startsWith("+")
  const digits = trimmed.replace(/\D/g, "")
  return hasPlus ? `+${digits}` : digits
}

/**
 * Strips all non-digit characters for WhatsApp click-to-chat URL (wa.me).
 * WhatsApp links require international country code with no + and no leading zeroes.
 */
export function formatWhatsappNumber(phone: string): string {
  return phone.replace(/\D/g, "")
}

/**
 * Formats a website URL. If missing protocol, defaults to https://.
 */
export function buildUrlPayload(data: UrlContentData): string {
  let url = data.url.trim()
  if (!url) return ""
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`
  }
  return url
}

/**
 * Formats PDF document URL payload.
 */
export function buildPdfPayload(data: PdfContentData): string {
  let url = data.pdfUrl.trim()
  if (!url) return ""
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`
  }
  return url
}

/**
 * Formats plain text payload.
 */
export function buildTextPayload(data: TextContentData): string {
  return data.text
}

/**
 * Formats Instagram profile payload (e.g. https://instagram.com/username).
 */
export function buildInstagramPayload(data: InstagramContentData): string {
  let handle = data.username.trim()
  if (!handle) return ""

  if (/^https?:\/\//i.test(handle)) {
    return handle
  }

  handle = handle.replace(/^@/, "")
  handle = handle.replace(/^(?:https?:\/\/)?(?:www\.)?instagram\.com\//i, "")
  handle = handle.replace(/\/.*$/, "")

  return `https://instagram.com/${handle}`
}

/**
 * Formats WhatsApp click-to-chat payload.
 */
export function buildWhatsappPayload(data: WhatsappContentData): string {
  const cleanNumber = formatWhatsappNumber(data.phoneNumber)
  if (!cleanNumber) return ""
  
  const base = `https://wa.me/${cleanNumber}`
  if (data.message && data.message.trim()) {
    const encodedMsg = encodeURIComponent(data.message.trim())
    return `${base}?text=${encodedMsg}`
  }
  return base
}

/**
 * Formats phone call URI (tel:).
 */
export function buildPhonePayload(data: PhoneContentData): string {
  const clean = normalizePhoneNumber(data.phoneNumber)
  return clean ? `tel:${clean}` : ""
}

/**
 * Formats mailto URI.
 */
export function buildEmailPayload(data: EmailContentData): string {
  const email = data.email.trim()
  if (!email) return ""
  
  const params: string[] = []
  if (data.subject && data.subject.trim()) {
    params.push(`subject=${encodeURIComponent(data.subject.trim())}`)
  }
  if (data.body && data.body.trim()) {
    params.push(`body=${encodeURIComponent(data.body.trim())}`)
  }

  const queryString = params.length > 0 ? `?${params.join("&")}` : ""
  return `mailto:${email}${queryString}`
}

/**
 * Formats Wi-Fi configuration QR code payload (WIFI:S:...;T:...;P:...;H:...;;).
 */
export function buildWifiPayload(data: WifiContentData): string {
  const ssid = escapeWifiString(data.ssid.trim())
  if (!ssid) return ""

  const encryption = data.encryption || "WPA"
  const password = data.password ? escapeWifiString(data.password) : ""
  const isHidden = data.hidden ? "true" : "false"

  let payload = `WIFI:T:${encryption};S:${ssid};`
  if (encryption !== "nopass" && password) {
    payload += `P:${password};`
  }
  if (data.hidden) {
    payload += `H:${isHidden};`
  }
  payload += ";"
  return payload
}

/**
 * Formats vCard 3.0 contact payload.
 */
export function buildVCardPayload(data: VCardContentData): string {
  const firstName = data.firstName.trim()
  const lastName = data.lastName ? data.lastName.trim() : ""
  if (!firstName && !lastName) return ""

  const fullName = [firstName, lastName].filter(Boolean).join(" ")
  const lines: string[] = ["BEGIN:VCARD", "VERSION:3.0"]

  lines.push(`N:${escapeVCardString(lastName)};${escapeVCardString(firstName)};;;`)
  lines.push(`FN:${escapeVCardString(fullName)}`)

  if (data.organization && data.organization.trim()) {
    lines.push(`ORG:${escapeVCardString(data.organization.trim())}`)
  }
  if (data.jobTitle && data.jobTitle.trim()) {
    lines.push(`TITLE:${escapeVCardString(data.jobTitle.trim())}`)
  }
  if (data.phone && data.phone.trim()) {
    const cleanPhone = normalizePhoneNumber(data.phone)
    lines.push(`TEL;TYPE=CELL:${cleanPhone}`)
  }
  if (data.email && data.email.trim()) {
    lines.push(`EMAIL:${data.email.trim()}`)
  }
  if (data.website && data.website.trim()) {
    let site = data.website.trim()
    if (!/^https?:\/\//i.test(site)) {
      site = `https://${site}`
    }
    lines.push(`URL:${site}`)
  }
  if (data.address && data.address.trim()) {
    lines.push(`ADR:;;${escapeVCardString(data.address.trim())};;;;`)
  }
  if (data.note && data.note.trim()) {
    lines.push(`NOTE:${escapeVCardString(data.note.trim())}`)
  }

  lines.push("END:VCARD")
  return lines.join("\n")
}

/**
 * Formats SMS URI (sms:<number>?body=<message>).
 */
export function buildSmsPayload(data: SmsContentData): string {
  const cleanPhone = normalizePhoneNumber(data.phoneNumber)
  if (!cleanPhone) return ""

  if (data.message && data.message.trim()) {
    const encodedBody = encodeURIComponent(data.message.trim())
    return `sms:${cleanPhone}?body=${encodedBody}`
  }
  return `sms:${cleanPhone}`
}
