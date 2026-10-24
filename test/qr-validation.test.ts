import { describe, it, expect } from "vitest"
import {
  calculateContrastRatio,
  DEFAULT_QR_SETTINGS,
  hexToRgb,
  isValidEmail,
  isValidHexColor,
  isValidPhoneNumber,
  isValidUrl,
  validateQRContent,
  validateQRSettings,
} from "../src/lib/qr-validation"

describe("QR Validation and Contrast Engine", () => {
  describe("Color & Contrast Calculations", () => {
    it("should parse 3-digit and 6-digit hex colors accurately", () => {
      expect(hexToRgb("#FFF")).toEqual({ r: 255, g: 255, b: 255 })
      expect(hexToRgb("#000000")).toEqual({ r: 0, g: 0, b: 0 })
      expect(hexToRgb("#FF0000")).toEqual({ r: 255, g: 0, b: 0 })
      expect(hexToRgb("invalid")).toBeNull()
    })

    it("should validate hex color strings", () => {
      expect(isValidHexColor("#000")).toBe(true)
      expect(isValidHexColor("#1A2B3C")).toBe(true)
      expect(isValidHexColor("#12345")).toBe(false)
      expect(isValidHexColor("rgb(0,0,0)")).toBe(false)
    })

    it("should calculate standard 21:1 contrast for black on white", () => {
      const result = calculateContrastRatio("#000000", "#FFFFFF")
      expect(result.ratio).toBe(21)
      expect(result.isAcceptable).toBe(true)
      expect(result.warning).toBeUndefined()
    })

    it("should warn on low contrast (< 3.0:1)", () => {
      // Light gray on white
      const result = calculateContrastRatio("#CCCCCC", "#FFFFFF")
      expect(result.ratio).toBeLessThan(3.0)
      expect(result.isAcceptable).toBe(false)
      expect(result.warning).toContain("Poor contrast")
    })

    it("should flag moderate contrast (between 3.0 and 4.5)", () => {
      const result = calculateContrastRatio("#777777", "#FFFFFF")
      expect(result.ratio).toBeGreaterThanOrEqual(3.0)
      expect(result.ratio).toBeLessThan(5.0)
      if (result.ratio < 4.5) {
        expect(result.warning).toContain("Moderate contrast")
      }
    })
  })

  describe("Field Format Validators", () => {
    it("should validate email addresses", () => {
      expect(isValidEmail("user@domain.com")).toBe(true)
      expect(isValidEmail("not-an-email")).toBe(false)
      expect(isValidEmail("@domain.com")).toBe(false)
    })

    it("should validate phone numbers", () => {
      expect(isValidPhoneNumber("+1 555 123 4567")).toBe(true)
      expect(isValidPhoneNumber("1234")).toBe(true)
      expect(isValidPhoneNumber("ab")).toBe(false)
    })

    it("should validate URLs with and without schemes", () => {
      expect(isValidUrl("https://example.com")).toBe(true)
      expect(isValidUrl("example.com/path")).toBe(true)
      expect(isValidUrl("http://localhost:3000")).toBe(true)
      expect(isValidUrl("not a url")).toBe(false)
    })
  })

  describe("QR Content Data Validation", () => {
    it("should flag missing URL", () => {
      const res = validateQRContent({ type: "url", data: { url: "" } })
      expect(res.isValid).toBe(false)
      expect(res.errors.url).toBeDefined()
    })

    it("should pass valid URL", () => {
      const res = validateQRContent({ type: "url", data: { url: "mysite.io" } })
      expect(res.isValid).toBe(true)
      expect(res.payload).toBe("https://mysite.io")
    })

    it("should flag empty plain text", () => {
      const res = validateQRContent({ type: "text", data: { text: "  " } })
      expect(res.isValid).toBe(false)
      expect(res.errors.text).toBeDefined()
    })

    it("should flag Wi-Fi password under 8 chars for WPA", () => {
      const res = validateQRContent({
        type: "wifi",
        data: { ssid: "OfficeNet", password: "short", encryption: "WPA" },
      })
      expect(res.isValid).toBe(false)
      expect(res.errors.password).toBeDefined()
    })

    it("should pass Wi-Fi with no password for open network", () => {
      const res = validateQRContent({
        type: "wifi",
        data: { ssid: "CoffeeShop", encryption: "nopass" },
      })
      expect(res.isValid).toBe(true)
      expect(res.payload).toContain("WIFI:T:nopass;S:CoffeeShop;;")
    })

    it("should require first name for vCard", () => {
      const res = validateQRContent({
        type: "vcard",
        data: { firstName: "" },
      })
      expect(res.isValid).toBe(false)
      expect(res.errors.firstName).toBeDefined()
    })
  })

  describe("QR Settings Validation", () => {
    it("should validate default settings successfully", () => {
      const res = validateQRSettings(DEFAULT_QR_SETTINGS)
      expect(res.isValid).toBe(true)
      expect(Object.keys(res.errors)).toHaveLength(0)
    })

    it("should reject invalid hex colors in settings", () => {
      const res = validateQRSettings({
        ...DEFAULT_QR_SETTINGS,
        foregroundColor: "blue",
      })
      expect(res.isValid).toBe(false)
      expect(res.errors.foregroundColor).toBeDefined()
    })

    it("should warn on quiet zone margin < 2", () => {
      const res = validateQRSettings({
        ...DEFAULT_QR_SETTINGS,
        margin: 1,
      })
      expect(res.isValid).toBe(true)
      expect(res.warnings.some((w) => w.includes("quiet zone"))).toBe(true)
    })
  })
})
