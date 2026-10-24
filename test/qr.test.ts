import { describe, it, expect } from "vitest"
import { generateFilename, generateQRCode } from "../src/lib/qr"
import { DEFAULT_QR_SETTINGS } from "../src/lib/qr-validation"

describe("QR Generator Engine", () => {
  it("should generate valid raster DataURL and vector SVG string", async () => {
    const payload = "https://example.com"
    const qr = await generateQRCode(payload, DEFAULT_QR_SETTINGS, "url")

    // DataURL checks
    expect(qr.dataUrl).toBeDefined()
    expect(qr.dataUrl.startsWith("data:image/png;base64,")).toBe(true)

    // Vector SVG checks
    expect(qr.svgString).toBeDefined()
    expect(qr.svgString).toContain("<svg")
    expect(qr.svgString).toContain("</svg>")
    // qrcode library generates stroke for dark modules and fill for background
    expect(qr.svgString).toContain('stroke="#000000"')
    expect(qr.svgString).toContain('fill="#FFFFFF"')

    // Metadata checks
    expect(qr.contentType).toBe("url")
    expect(qr.payload).toBe(payload)
    expect(qr.settings.dimension).toBe(512)
  })

  it("should generate standardized filenames with date and format", () => {
    const pngName = generateFilename("url", "png")
    expect(pngName).toMatch(/^qr-studio-url-\d{4}-\d{2}-\d{2}\.png$/)

    const svgName = generateFilename("wifi", "svg")
    expect(svgName).toMatch(/^qr-studio-wifi-\d{4}-\d{2}-\d{2}\.svg$/)

    const pdfName = generateFilename("vcard", "pdf")
    expect(pdfName).toMatch(/^qr-studio-vcard-\d{4}-\d{2}-\d{2}\.pdf$/)
  })

  it("should respect custom colors in generated SVG", async () => {
    const customSettings = {
      ...DEFAULT_QR_SETTINGS,
      foregroundColor: "#0F172A",
      backgroundColor: "#F8FAFC",
    }
    const qr = await generateQRCode("Test Payload", customSettings, "text")

    expect(qr.svgString.toUpperCase()).toContain("#0F172A")
    expect(qr.svgString.toUpperCase()).toContain("#F8FAFC")
  })
})
