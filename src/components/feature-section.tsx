import {
  Globe,
  Wifi,
  Contact,
  MessageSquare,
  FileCheck2,
  Shield,
  Layers,
  Sparkles,
  ArrowRight,
  Printer,
  Smartphone,
  Eye,
} from "lucide-react"

export function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "Input Content",
      description:
        "Select from 9 dedicated content modes: URL, Instagram profile, WhatsApp, plain text, Wi-Fi network, vCard contact, email, phone, or SMS. Specialized validators ensure valid syntax.",
      icon: Layers,
    },
    {
      step: "02",
      title: "Real-Time Verification",
      description:
        "Instant optical preview generated in pure high-contrast Black & White. Automatic payload checks ensure perfect readability on all camera sensors.",
      icon: Eye,
    },
    {
      step: "03",
      title: "Export & Print",
      description:
        "Download vector SVG for Illustrator/Figma, high-resolution PNG (up to 2048px), or a centered, print-ready A4 PDF designed for immediate physical production.",
      icon: Printer,
    },
  ]

  return (
    <section id="how-it-works" className="border-t border-border/70 py-16 sm:py-20 bg-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Simple Workflow
          </h2>
          <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            From raw input to print-ready output in seconds
          </p>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            All calculations occur locally inside your browser thread. No loading spinners from remote servers, no hidden tracking pixels.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.step}
                className="group relative rounded-xl border border-border/80 bg-card p-6 shadow-xs transition-all hover:border-foreground/30 hover:shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-xl font-bold text-muted-foreground/40">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function FeatureSection() {
  const features = [
    {
      title: "100% Client-Side Privacy",
      description:
        "No network requests carry your entered text, Wi-Fi keys, or contact entries. The QR payload is compiled strictly in your web browser memory.",
      icon: Shield,
    },
    {
      title: "Three Production Formats",
      description:
        "Export infinitely scalable vector SVGs, ultra-sharp 2048px PNG rasters, or standardized A4 layout PDFs formatted with alignment guides.",
      icon: FileCheck2,
    },
    {
      title: "High-Contrast Black & White",
      description:
        "Rendered exclusively in standard high-contrast Black & White (21:1 ratio) to guarantee rapid optical recognition across all smartphone cameras.",
      icon: Sparkles,
    },
    {
      title: "9 Specialized Encoders",
      description:
        "Complete payload handlers for Web URLs, Instagram profiles, WhatsApp chat links, vCard 3.0 contacts, Wi-Fi credentials, SMS, and direct dialers.",
      icon: Smartphone,
    },
    {
      title: "Permanent Static Architecture",
      description:
        "Static QR codes store raw data directly in the 2D matrix. They require no URL shorteners, no subscription accounts, and never expire.",
      icon: Globe,
    },
    {
      title: "Reliable Error Correction",
      description:
        "Choose between L (7%), M (15%), Q (25%), or H (30%) Reed-Solomon error correction to keep codes scannable even if partially scuffed.",
      icon: ArrowRight,
    },
  ]

  return (
    <section id="features" className="border-t border-border/70 py-16 sm:py-20 bg-muted/10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 max-w-2xl">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Engineered for Precision
          </h2>
          <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Everything you need for industrial & commercial QR generation
          </p>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Eliminate unreliable third-party dynamic QR services that hold your links hostage behind sudden paywalls.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="rounded-xl border border-border/80 bg-card p-6 shadow-xs transition-all hover:border-foreground/20"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-foreground mb-4">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1.5">
                  {feature.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
