"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QRContentForm } from "@/components/qr-content-form"
import { QRPreview } from "@/components/qr-preview"
import { QRDownloads } from "@/components/qr-downloads"
import type { GeneratedQR, QRContentData, QRContentType, QRSettings } from "@/types/qr"
import { DEFAULT_QR_SETTINGS, validateQRContent, validateQRSettings } from "@/lib/qr-validation"
import { generateQRCode } from "@/lib/qr"
import { FileText, CheckCircle2, QrCode } from "lucide-react"

export function QRGenerator() {
  const [contentType, setContentType] = React.useState<QRContentType>("url")
  const settings: QRSettings = React.useMemo(() => ({ ...DEFAULT_QR_SETTINGS }), [])

  // User input state starts blank so they can enter their own URL/data
  const [contentData, setContentData] = React.useState<QRContentData>({
    type: "url",
    data: { url: "" },
  })

  // Starts null: generation only occurs on user button click
  const [qr, setQr] = React.useState<GeneratedQR | null>(null)
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [warnings, setWarnings] = React.useState<string[]>([])
  const [isValid, setIsValid] = React.useState(true)

  // Handle type switching with clean empty states
  const handleContentTypeChange = (newType: QRContentType) => {
    setContentType(newType)
    setErrors({})
    setWarnings([])
    let newContentData: QRContentData

    switch (newType) {
      case "url":
        newContentData = { type: "url", data: { url: "" } }
        break
      case "pdf":
        newContentData = { type: "pdf", data: { pdfUrl: "" } }
        break
      case "instagram":
        newContentData = { type: "instagram", data: { username: "" } }
        break
      case "text":
        newContentData = { type: "text", data: { text: "" } }
        break
      case "whatsapp":
        newContentData = {
          type: "whatsapp",
          data: { phoneNumber: "", message: "" },
        }
        break
      case "wifi":
        newContentData = {
          type: "wifi",
          data: { ssid: "", password: "", encryption: "WPA" },
        }
        break
      case "vcard":
        newContentData = {
          type: "vcard",
          data: {
            firstName: "",
            lastName: "",
            organization: "",
            phone: "",
            email: "",
            website: "",
          },
        }
        break
      case "email":
        newContentData = {
          type: "email",
          data: { email: "", subject: "", body: "" },
        }
        break
      case "phone":
        newContentData = { type: "phone", data: { phoneNumber: "" } }
        break
      case "sms":
        newContentData = {
          type: "sms",
          data: { phoneNumber: "", message: "" },
        }
        break
    }

    setContentData(newContentData)
  }

  const handleContentChange = (newData: QRContentData) => {
    setContentData(newData)
    if (Object.keys(errors).length > 0) {
      setErrors({})
    }
  }

  // Generation triggered strictly on button click or form submit
  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    const contentValidation = validateQRContent(contentData)
    const settingsValidation = validateQRSettings(settings)

    const allErrors = { ...contentValidation.errors, ...settingsValidation.errors }
    const allWarnings = [...contentValidation.warnings, ...settingsValidation.warnings]

    setErrors(allErrors)
    setWarnings(allWarnings)

    if (!contentValidation.isValid || !settingsValidation.isValid || !contentValidation.payload) {
      setIsValid(false)
      return
    }

    setIsValid(true)
    setIsGenerating(true)

    try {
      const generated = await generateQRCode(
        contentValidation.payload,
        settings,
        contentData.type
      )
      setQr(generated)
    } catch {
      setErrors((prev) => ({ ...prev, generation: "Failed to render QR matrix." }))
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <section id="generator" className="py-8 sm:py-12 bg-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT PANEL: Inputs & Generate Button */}
          <div className="lg:col-span-7 space-y-4">
            <Card className="shadow-xs border-border/80">
              <CardContent className="p-4 sm:p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-border/60 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-md bg-muted border border-border/80">
                      <FileText className="h-4 w-4 text-foreground" />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-foreground">Content & Payload</h2>
                      <p className="text-xs text-muted-foreground">Select data mode and fill in your details</p>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/60 border border-border/80 text-[11px] font-medium text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-black dark:bg-white inline-block border border-border" />
                    Black & White
                  </div>
                </div>

                <form onSubmit={handleGenerate} className="space-y-5">
                  <QRContentForm
                    contentType={contentType}
                    onContentTypeChange={handleContentTypeChange}
                    contentData={contentData}
                    onChange={handleContentChange}
                    errors={errors}
                  />

                  {/* Generate Button right after input fields */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isGenerating}
                      className="w-full h-12 text-sm font-semibold gap-2 cursor-pointer shadow-sm bg-foreground text-background hover:bg-foreground/90 transition-all active:scale-[0.99]"
                    >
                      {isGenerating ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                          Generating QR Code...
                        </>
                      ) : (
                        <>
                          <QrCode className="h-4.5 w-4.5" />
                          {qr ? "Regenerate QR Code" : "Generate QR Code"}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Quick Helper Banner */}
            <div className="rounded-lg border border-border/70 bg-muted/20 px-4 py-3 flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                All generation executes locally on your CPU
              </span>
              <span className="text-[11px] font-mono text-muted-foreground hidden sm:inline-block">
                Pure Black & White • Max Contrast
              </span>
            </div>
          </div>

          {/* RIGHT PANEL: Live Preview & Export Engine */}
          <div className="lg:col-span-5 sticky top-20">
            <Card className="shadow-xs border-border/80 bg-card">
              <CardContent className="p-4 sm:p-6 space-y-6">
                <QRPreview
                  qr={qr}
                  contentType={contentType}
                  isValid={isValid}
                  isGenerating={isGenerating}
                  warnings={warnings}
                />

                <QRDownloads
                  qr={qr}
                  isValid={isValid}
                  isGenerating={isGenerating}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
