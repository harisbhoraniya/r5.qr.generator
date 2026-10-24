import { describe, it, expect } from "vitest"
import {
  buildEmailPayload,
  buildPhonePayload,
  buildSmsPayload,
  buildTextPayload,
  buildUrlPayload,
  buildVCardPayload,
  buildWhatsappPayload,
  buildWifiPayload,
  escapeVCardString,
  escapeWifiString,
  formatWhatsappNumber,
  normalizePhoneNumber,
} from "../src/lib/qr-payloads"

describe("QR Payload Encoders", () => {
  describe("URL Encoder", () => {
    it("should prepend https:// if missing", () => {
      const payload = buildUrlPayload({ url: "example.com/pricing" })
      expect(payload).toBe("https://example.com/pricing")
    })

    it("should preserve existing https:// protocol", () => {
      const payload = buildUrlPayload({ url: "https://my-site.org/docs" })
      expect(payload).toBe("https://my-site.org/docs")
    })

    it("should preserve existing http:// protocol", () => {
      const payload = buildUrlPayload({ url: "http://internal.lan" })
      expect(payload).toBe("http://internal.lan")
    })

    it("should return empty string for empty input", () => {
      expect(buildUrlPayload({ url: "   " })).toBe("")
    })
  })

  describe("Plain Text Encoder", () => {
    it("should encode plain text as-is including Unicode and spaces", () => {
      const sample = "Serial #984210-AB • Tested OK 🚀"
      expect(buildTextPayload({ text: sample })).toBe(sample)
    })
  })

  describe("WhatsApp Encoder", () => {
    it("should normalize phone and encode optional message", () => {
      const payload = buildWhatsappPayload({
        phoneNumber: "+1 (555) 234-5678",
        message: "Hello world!",
      })
      expect(payload).toBe("https://wa.me/15552345678?text=Hello%20world!")
    })

    it("should output wa.me link without text param when message is omitted", () => {
      const payload = buildWhatsappPayload({
        phoneNumber: "+44 7911 123456",
      })
      expect(payload).toBe("https://wa.me/447911123456")
    })
  })

  describe("Phone Encoder", () => {
    it("should format tel: URI preserving leading international +", () => {
      const payload = buildPhonePayload({ phoneNumber: "+1 (800) 555-0199" })
      expect(payload).toBe("tel:+18005550199")
    })

    it("should format local numbers without +", () => {
      const payload = buildPhonePayload({ phoneNumber: "0800 123 456" })
      expect(payload).toBe("tel:0800123456")
    })
  })

  describe("Email Encoder", () => {
    it("should format basic mailto URI", () => {
      const payload = buildEmailPayload({ email: "team@acme.com" })
      expect(payload).toBe("mailto:team@acme.com")
    })

    it("should format mailto URI with subject and body params", () => {
      const payload = buildEmailPayload({
        email: "team@acme.com",
        subject: "Meeting Follow-up",
        body: "Hi team,\nThanks for today's demo.",
      })
      expect(payload).toContain("mailto:team@acme.com?")
      expect(payload).toContain("subject=Meeting%20Follow-up")
      expect(payload).toContain("body=Hi%20team%2C%0AThanks%20for%20today's%20demo.")
    })
  })

  describe("Wi-Fi Encoder & Escaping", () => {
    it("should escape special characters in SSID and password", () => {
      const escaped = escapeWifiString("My;Special:SSID\\Name,")
      expect(escaped).toBe("My\\;Special\\:SSID\\\\Name\\,")
    })

    it("should construct valid WIFI URI for WPA network", () => {
      const payload = buildWifiPayload({
        ssid: "Guest WiFi",
        password: "Secret;Password:123",
        encryption: "WPA",
        hidden: false,
      })
      expect(payload).toBe("WIFI:T:WPA;S:Guest WiFi;P:Secret\\;Password\\:123;;")
    })

    it("should handle open/nopass network without password", () => {
      const payload = buildWifiPayload({
        ssid: "Free_WiFi",
        encryption: "nopass",
      })
      expect(payload).toBe("WIFI:T:nopass;S:Free_WiFi;;")
    })

    it("should include H:true; when network is hidden", () => {
      const payload = buildWifiPayload({
        ssid: "HiddenNet",
        password: "pass12345678",
        encryption: "WPA",
        hidden: true,
      })
      expect(payload).toBe("WIFI:T:WPA;S:HiddenNet;P:pass12345678;H:true;;")
    })
  })

  describe("vCard 3.0 Encoder", () => {
    it("should build valid vCard 3.0 payload with proper escaping", () => {
      const payload = buildVCardPayload({
        firstName: "Sarah;Jane",
        lastName: "Connor",
        organization: "Cyberdyne Systems",
        jobTitle: "Lead Architect",
        phone: "+1 555 987 6543",
        email: "sarah@cyberdyne.com",
        website: "cyberdyne.com",
      })

      expect(payload).toContain("BEGIN:VCARD")
      expect(payload).toContain("VERSION:3.0")
      expect(payload).toContain("N:Connor;Sarah\\;Jane;;;")
      expect(payload).toContain("FN:Sarah\\;Jane Connor")
      expect(payload).toContain("ORG:Cyberdyne Systems")
      expect(payload).toContain("TITLE:Lead Architect")
      expect(payload).toContain("TEL;TYPE=CELL:+15559876543")
      expect(payload).toContain("EMAIL:sarah@cyberdyne.com")
      expect(payload).toContain("URL:https://cyberdyne.com")
      expect(payload).toContain("END:VCARD")
    })
  })

  describe("SMS Encoder", () => {
    it("should build valid sms URI", () => {
      const payload = buildSmsPayload({
        phoneNumber: "+1 555 333 4444",
        message: "Confirmation code: 4920",
      })
      expect(payload).toBe("sms:+15553334444?body=Confirmation%20code%3A%204920")
    })

    it("should handle SMS without message", () => {
      const payload = buildSmsPayload({
        phoneNumber: "911",
      })
      expect(payload).toBe("sms:911")
    })
  })
})
