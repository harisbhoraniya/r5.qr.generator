"use client"

import * as React from "react"
import {
  Globe,
  FileText,
  MessageCircle,
  Phone,
  Mail,
  Wifi,
  Contact,
  MessageSquare,
  AlertCircle,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import type {
  EmailContentData,
  InstagramContentData,
  PdfContentData,
  PhoneContentData,
  QRContentData,
  QRContentType,
  SmsContentData,
  TextContentData,
  UrlContentData,
  VCardContentData,
  WhatsappContentData,
  WifiContentData,
  WifiEncryption,
} from "@/types/qr"

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

interface QRContentFormProps {
  contentType: QRContentType
  onContentTypeChange: (type: QRContentType) => void
  contentData: QRContentData
  onChange: (newData: QRContentData) => void
  errors: Record<string, string>
}

const CONTENT_TYPES: { id: QRContentType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "url", label: "URL", icon: Globe },
  { id: "pdf", label: "PDF File", icon: FileText },
  { id: "instagram", label: "Instagram", icon: InstagramIcon },
  { id: "text", label: "Text", icon: FileText },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { id: "wifi", label: "Wi-Fi", icon: Wifi },
  { id: "vcard", label: "vCard", icon: Contact },
  { id: "email", label: "Email", icon: Mail },
  { id: "phone", label: "Phone", icon: Phone },
  { id: "sms", label: "SMS", icon: MessageSquare },
]

export function QRContentForm({
  contentType,
  onContentTypeChange,
  contentData,
  onChange,
  errors,
}: QRContentFormProps) {
  return (
    <div className="space-y-5">
      {/* Type Selector Grid */}
      <div>
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5 block">
          Select Content Type
        </Label>
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {CONTENT_TYPES.map((type) => {
            const Icon = type.icon
            const isSelected = contentType === type.id
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => onContentTypeChange(type.id)}
                className={`flex flex-col items-center justify-center gap-1.5 rounded-lg border p-2.5 text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? "border-foreground bg-foreground text-background shadow-xs font-semibold"
                    : "border-border/80 bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="truncate">{type.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Mode-specific Fields */}
      <div className="rounded-lg border border-border/80 bg-background/50 p-4 space-y-4">
        {contentType === "url" && (
          <div className="space-y-2">
            <Label htmlFor="url-input" className="text-xs font-semibold">
             Enter Website URL <span className="text-muted-foreground font-normal"></span>
            </Label>
            <Input
              id="url-input"
              type="text"
              inputMode="url"
              placeholder="example.com/page or https://yourdomain.com"
              value={(contentData as { type: "url"; data: UrlContentData }).data.url}
              onChange={(e) =>
                onChange({
                  type: "url",
                  data: { url: e.target.value },
                })
              }
              className={errors.url ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.url ? (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" /> {errors.url}
              </p>
            ) : (
              <p className="text-[11px] text-muted-foreground">
                Protocol (https://) will be added automatically if omitted.
              </p>
            )}
          </div>
        )}

        {contentType === "pdf" && (
          <div className="space-y-2">
            <Label htmlFor="pdf-input" className="text-xs font-semibold">
              Enter PDF Document URL
            </Label>
            <Input
              id="pdf-input"
              type="text"
              inputMode="url"
              placeholder="https://drive.google.com/... or yoursite.com/menu.pdf"
              value={(contentData as { type: "pdf"; data: PdfContentData }).data.pdfUrl}
              onChange={(e) =>
                onChange({
                  type: "pdf",
                  data: { pdfUrl: e.target.value },
                })
              }
              className={errors.pdfUrl ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.pdfUrl ? (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" /> {errors.pdfUrl}
              </p>
            ) : (
              <p className="text-[11px] text-muted-foreground">
                Enter any public web link to your PDF (Google Drive, Dropbox, Cloudinary, or your website).
              </p>
            )}
          </div>
        )}

        {contentType === "instagram" && (
          <div className="space-y-2">
            <Label htmlFor="instagram-input" className="text-xs font-semibold">
              Instagram Username or Profile Link
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground select-none">
                @
              </span>
              <Input
                id="instagram-input"
                type="text"
                placeholder="username or instagram.com/username"
                value={(contentData as { type: "instagram"; data: InstagramContentData }).data.username}
                onChange={(e) =>
                  onChange({
                    type: "instagram",
                    data: { username: e.target.value },
                  })
                }
                className={`pl-7 ${errors.username ? "border-destructive focus-visible:ring-destructive" : ""}`}
              />
            </div>
            {errors.username ? (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" /> {errors.username}
              </p>
            ) : (
              <p className="text-[11px] text-muted-foreground">
                Enter your Instagram username (e.g. yourbrand) or full profile link.
              </p>
            )}
          </div>
        )}

        {contentType === "text" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="text-input" className="text-xs font-semibold">
                Plain Text Message
              </Label>
              <span className="text-[11px] text-muted-foreground">
                {(contentData as { type: "text"; data: TextContentData }).data.text.length} chars
              </span>
            </div>
            <Textarea
              id="text-input"
              rows={4}
              placeholder="Type or paste any text, notes, serial numbers, or raw data..."
              value={(contentData as { type: "text"; data: TextContentData }).data.text}
              onChange={(e) =>
                onChange({
                  type: "text",
                  data: { text: e.target.value },
                })
              }
              className={errors.text ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.text && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" /> {errors.text}
              </p>
            )}
          </div>
        )}

        {contentType === "whatsapp" && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="wa-phone" className="text-xs font-semibold">
                WhatsApp Phone Number <span className="text-muted-foreground font-normal">(with country code)</span>
              </Label>
              <Input
                id="wa-phone"
                type="tel"
                placeholder="+1 555 123 4567"
                value={(contentData as { type: "whatsapp"; data: WhatsappContentData }).data.phoneNumber}
                onChange={(e) =>
                  onChange({
                    type: "whatsapp",
                    data: {
                      ...(contentData as { type: "whatsapp"; data: WhatsappContentData }).data,
                      phoneNumber: e.target.value,
                    },
                  })
                }
                className={errors.phoneNumber ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.phoneNumber && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" /> {errors.phoneNumber}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="wa-message" className="text-xs font-semibold">
                Prefilled Message <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <Textarea
                id="wa-message"
                rows={2}
                placeholder="Hello, I would like more information..."
                value={(contentData as { type: "whatsapp"; data: WhatsappContentData }).data.message || ""}
                onChange={(e) =>
                  onChange({
                    type: "whatsapp",
                    data: {
                      ...(contentData as { type: "whatsapp"; data: WhatsappContentData }).data,
                      message: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>
        )}

        {contentType === "wifi" && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="wifi-ssid" className="text-xs font-semibold">
                Network Name (SSID)
              </Label>
              <Input
                id="wifi-ssid"
                type="text"
                placeholder="e.g. Office_Guest_WiFi"
                value={(contentData as { type: "wifi"; data: WifiContentData }).data.ssid}
                onChange={(e) =>
                  onChange({
                    type: "wifi",
                    data: {
                      ...(contentData as { type: "wifi"; data: WifiContentData }).data,
                      ssid: e.target.value,
                    },
                  })
                }
                className={errors.ssid ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.ssid && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" /> {errors.ssid}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="wifi-encryption" className="text-xs font-semibold">
                  Security Type
                </Label>
                <Select
                  value={(contentData as { type: "wifi"; data: WifiContentData }).data.encryption}
                  onValueChange={(val: WifiEncryption) =>
                    onChange({
                      type: "wifi",
                      data: {
                        ...(contentData as { type: "wifi"; data: WifiContentData }).data,
                        encryption: val,
                      },
                    })
                  }
                >
                  <SelectTrigger id="wifi-encryption">
                    <SelectValue placeholder="Encryption" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WPA">WPA / WPA2 / WPA3</SelectItem>
                    <SelectItem value="WEP">WEP</SelectItem>
                    <SelectItem value="nopass">None (Open Network)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(contentData as { type: "wifi"; data: WifiContentData }).data.encryption !== "nopass" && (
                <div className="space-y-1.5">
                  <Label htmlFor="wifi-pass" className="text-xs font-semibold">
                    Network Password
                  </Label>
                  <Input
                    id="wifi-pass"
                    type="text"
                    placeholder="Minimum 8 characters"
                    value={(contentData as { type: "wifi"; data: WifiContentData }).data.password || ""}
                    onChange={(e) =>
                      onChange({
                        type: "wifi",
                        data: {
                          ...(contentData as { type: "wifi"; data: WifiContentData }).data,
                          password: e.target.value,
                        },
                      })
                    }
                    className={errors.password ? "border-destructive focus-visible:ring-destructive" : ""}
                  />
                </div>
              )}
            </div>

            {errors.password && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" /> {errors.password}
              </p>
            )}

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={Boolean((contentData as { type: "wifi"; data: WifiContentData }).data.hidden)}
                onChange={(e) =>
                  onChange({
                    type: "wifi",
                    data: {
                      ...(contentData as { type: "wifi"; data: WifiContentData }).data,
                      hidden: e.target.checked,
                    },
                  })
                }
                className="h-4 w-4 rounded border-border text-foreground focus:ring-1 focus:ring-ring"
              />
              <span className="text-xs text-foreground">Hidden network SSID</span>
            </label>
          </div>
        )}

        {contentType === "vcard" && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="vc-fn" className="text-xs font-semibold">
                  First Name *
                </Label>
                <Input
                  id="vc-fn"
                  type="text"
                  placeholder="Jane"
                  value={(contentData as { type: "vcard"; data: VCardContentData }).data.firstName}
                  onChange={(e) =>
                    onChange({
                      type: "vcard",
                      data: {
                        ...(contentData as { type: "vcard"; data: VCardContentData }).data,
                        firstName: e.target.value,
                      },
                    })
                  }
                  className={errors.firstName ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {errors.firstName && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" /> {errors.firstName}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="vc-ln" className="text-xs font-semibold">
                  Last Name
                </Label>
                <Input
                  id="vc-ln"
                  type="text"
                  placeholder="Doe"
                  value={(contentData as { type: "vcard"; data: VCardContentData }).data.lastName || ""}
                  onChange={(e) =>
                    onChange({
                      type: "vcard",
                      data: {
                        ...(contentData as { type: "vcard"; data: VCardContentData }).data,
                        lastName: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="vc-org" className="text-xs font-semibold">
                  Company / Organization
                </Label>
                <Input
                  id="vc-org"
                  type="text"
                  placeholder="Acme Corp"
                  value={(contentData as { type: "vcard"; data: VCardContentData }).data.organization || ""}
                  onChange={(e) =>
                    onChange({
                      type: "vcard",
                      data: {
                        ...(contentData as { type: "vcard"; data: VCardContentData }).data,
                        organization: e.target.value,
                      },
                    })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="vc-title" className="text-xs font-semibold">
                  Job Title
                </Label>
                <Input
                  id="vc-title"
                  type="text"
                  placeholder="Software Engineer"
                  value={(contentData as { type: "vcard"; data: VCardContentData }).data.jobTitle || ""}
                  onChange={(e) =>
                    onChange({
                      type: "vcard",
                      data: {
                        ...(contentData as { type: "vcard"; data: VCardContentData }).data,
                        jobTitle: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="vc-phone" className="text-xs font-semibold">
                  Mobile Phone
                </Label>
                <Input
                  id="vc-phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={(contentData as { type: "vcard"; data: VCardContentData }).data.phone || ""}
                  onChange={(e) =>
                    onChange({
                      type: "vcard",
                      data: {
                        ...(contentData as { type: "vcard"; data: VCardContentData }).data,
                        phone: e.target.value,
                      },
                    })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="vc-email" className="text-xs font-semibold">
                  Email Address
                </Label>
                <Input
                  id="vc-email"
                  type="email"
                  placeholder="jane.doe@example.com"
                  value={(contentData as { type: "vcard"; data: VCardContentData }).data.email || ""}
                  onChange={(e) =>
                    onChange({
                      type: "vcard",
                      data: {
                        ...(contentData as { type: "vcard"; data: VCardContentData }).data,
                        email: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="vc-web" className="text-xs font-semibold">
                Website URL
              </Label>
              <Input
                id="vc-web"
                type="text"
                placeholder="https://janedoe.me"
                value={(contentData as { type: "vcard"; data: VCardContentData }).data.website || ""}
                onChange={(e) =>
                  onChange({
                    type: "vcard",
                    data: {
                      ...(contentData as { type: "vcard"; data: VCardContentData }).data,
                      website: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>
        )}

        {contentType === "email" && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="email-to" className="text-xs font-semibold">
                Recipient Email Address *
              </Label>
              <Input
                id="email-to"
                type="email"
                placeholder="contact@company.com"
                value={(contentData as { type: "email"; data: EmailContentData }).data.email}
                onChange={(e) =>
                  onChange({
                    type: "email",
                    data: {
                      ...(contentData as { type: "email"; data: EmailContentData }).data,
                      email: e.target.value,
                    },
                  })
                }
                className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.email && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" /> {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email-subject" className="text-xs font-semibold">
                Subject <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <Input
                id="email-subject"
                type="text"
                placeholder="Inquiry regarding..."
                value={(contentData as { type: "email"; data: EmailContentData }).data.subject || ""}
                onChange={(e) =>
                  onChange({
                    type: "email",
                    data: {
                      ...(contentData as { type: "email"; data: EmailContentData }).data,
                      subject: e.target.value,
                    },
                  })
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email-body" className="text-xs font-semibold">
                Message Body <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <Textarea
                id="email-body"
                rows={3}
                placeholder="Write your email draft here..."
                value={(contentData as { type: "email"; data: EmailContentData }).data.body || ""}
                onChange={(e) =>
                  onChange({
                    type: "email",
                    data: {
                      ...(contentData as { type: "email"; data: EmailContentData }).data,
                      body: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>
        )}

        {contentType === "phone" && (
          <div className="space-y-2">
            <Label htmlFor="phone-input" className="text-xs font-semibold">
              Telephone Number
            </Label>
            <Input
              id="phone-input"
              type="tel"
              placeholder="+1 800 555 0199"
              value={(contentData as { type: "phone"; data: PhoneContentData }).data.phoneNumber}
              onChange={(e) =>
                onChange({
                  type: "phone",
                  data: { phoneNumber: e.target.value },
                })
              }
              className={errors.phoneNumber ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.phoneNumber ? (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" /> {errors.phoneNumber}
              </p>
            ) : (
              <p className="text-[11px] text-muted-foreground">
                Scanning on iOS or Android directly prompts the user to place the phone call.
              </p>
            )}
          </div>
        )}

        {contentType === "sms" && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="sms-phone" className="text-xs font-semibold">
                Recipient Phone Number
              </Label>
              <Input
                id="sms-phone"
                type="tel"
                placeholder="+1 555 123 4567"
                value={(contentData as { type: "sms"; data: SmsContentData }).data.phoneNumber}
                onChange={(e) =>
                  onChange({
                    type: "sms",
                    data: {
                      ...(contentData as { type: "sms"; data: SmsContentData }).data,
                      phoneNumber: e.target.value,
                    },
                  })
                }
                className={errors.phoneNumber ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.phoneNumber && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" /> {errors.phoneNumber}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sms-body" className="text-xs font-semibold">
                SMS Text Message <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <Textarea
                id="sms-body"
                rows={2}
                placeholder="Predefined SMS message text..."
                value={(contentData as { type: "sms"; data: SmsContentData }).data.message || ""}
                onChange={(e) =>
                  onChange({
                    type: "sms",
                    data: {
                      ...(contentData as { type: "sms"; data: SmsContentData }).data,
                      message: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
