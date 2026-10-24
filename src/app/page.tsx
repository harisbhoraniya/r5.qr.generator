import Link from "next/link"
import { ArrowDown, CheckCircle2, ShieldCheck, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { QRGenerator } from "@/components/qr-generator"
import { FeatureSection, HowItWorksSection } from "@/components/feature-section"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-8 sm:pt-20 sm:pb-12 border-b border-border/70 overflow-hidden bg-radial from-background via-background to-muted/20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          {/* Trust pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-muted/40 px-3.5 py-1 text-xs text-muted-foreground mb-6 shadow-2xs">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-foreground">Static & Permanent</span>
            <span>•</span>
            <span>Zero Tracking</span>
            <span>•</span>
            <span>100% In-Browser</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground max-w-3xl mx-auto leading-[1.08]">
            Your link. <span className="text-muted-foreground/80 font-normal">Your QR.</span>
          </h1>

          {/* Supporting Pitch */}
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Generate industrial-grade, permanent static QR codes with zero server calls.
            Download crisp vector SVGs, high-resolution PNGs up to 2048px, or centered A4 print PDFs.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="h-11 px-6 text-sm font-semibold cursor-pointer">
              <Link href="#generator">
                Create QR Code <ArrowDown className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-11 px-6 text-sm font-medium cursor-pointer">
              <Link href="#how-it-works">
                How It Works
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* GENERATOR WORKSPACE */}
      <QRGenerator />

      {/* HOW IT WORKS */}
      <HowItWorksSection />

      {/* FEATURES */}
      <FeatureSection />
    </div>
  )
}
