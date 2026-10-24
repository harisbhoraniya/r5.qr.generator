export type QRContentType =
  | "url"
  | "pdf"
  | "instagram"
  | "text"
  | "whatsapp"
  | "phone"
  | "email"
  | "wifi"
  | "vcard"
  | "sms"

export type ErrorCorrectionLevel = "L" | "M" | "Q" | "H"

export type QRDimension = 256 | 512 | 1024 | 2048

export type ExportFormat = "png" | "jpeg" | "jpg" | "webp" | "svg" | "pdf"

export type WifiEncryption = "WPA" | "WEP" | "nopass"

export interface UrlContentData {
  url: string
}

export interface PdfContentData {
  pdfUrl: string
}

export interface TextContentData {
  text: string
}

export interface InstagramContentData {
  username: string
}

export interface WhatsappContentData {
  phoneNumber: string
  message?: string
}

export interface PhoneContentData {
  phoneNumber: string
}

export interface EmailContentData {
  email: string
  subject?: string
  body?: string
}

export interface WifiContentData {
  ssid: string
  password?: string
  encryption: WifiEncryption
  hidden?: boolean
}

export interface VCardContentData {
  firstName: string
  lastName?: string
  organization?: string
  jobTitle?: string
  phone?: string
  email?: string
  website?: string
  address?: string
  note?: string
}

export interface SmsContentData {
  phoneNumber: string
  message?: string
}

export type QRContentData =
  | { type: "url"; data: UrlContentData }
  | { type: "pdf"; data: PdfContentData }
  | { type: "instagram"; data: InstagramContentData }
  | { type: "text"; data: TextContentData }
  | { type: "whatsapp"; data: WhatsappContentData }
  | { type: "phone"; data: PhoneContentData }
  | { type: "email"; data: EmailContentData }
  | { type: "wifi"; data: WifiContentData }
  | { type: "vcard"; data: VCardContentData }
  | { type: "sms"; data: SmsContentData }

export interface QRSettings {
  foregroundColor: string
  backgroundColor: string
  dimension: QRDimension
  margin: number
  errorCorrectionLevel: ErrorCorrectionLevel
}

export interface QRValidationResult {
  isValid: boolean
  errors: Record<string, string>
  payload?: string
  warnings: string[]
}

export interface ContrastCheckResult {
  ratio: number
  isAcceptable: boolean
  warning?: string
}

export interface GeneratedQR {
  dataUrl: string
  svgString: string
  payload: string
  settings: QRSettings
  contentType: QRContentType
  timestamp: number
}
