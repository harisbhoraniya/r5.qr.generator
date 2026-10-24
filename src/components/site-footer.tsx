import Link from "next/link"
import Image from "next/image"
import { QrCode, ShieldCheck, Zap, Lock } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-muted/20 text-muted-foreground text-xs">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {/* Top summary grid */}
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 pb-10 border-b border-border/50">
          <div>
            <div className="flex items-center gap-2.5 font-semibold text-foreground text-sm mb-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md overflow-hidden border border-border/70 bg-white p-0.5 shadow-2xs">
                <Image
                  src="/logo.png"
                  alt="R5 Logo"
                  width={28}
                  height={28}
                  className="h-full w-full object-contain"
                />
              </div>
              R5 QR Code Generator
            </div>
            <p className="leading-relaxed">
              Modern developer-grade static QR code generator. Zero tracking, no subscriptions, and purely client-side rendering.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground text-sm mb-3 flex items-center gap-1.5">
              <Lock className="h-4 w-4 text-foreground" /> Private by Design
            </h4>
            <p className="leading-relaxed">
              Your data never touches a server. QR matrices are synthesized entirely inside your web browser. No accounts or telemetry.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground text-sm mb-3 flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-foreground" /> Permanent Static QRs
            </h4>
            <p className="leading-relaxed">
              Generated QR codes are static and standalone. The image file contains the raw payload and will function forever without this site.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground text-sm mb-3 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-foreground" /> Important Notice
            </h4>
            <p className="leading-relaxed">
              Static QRs cannot change destinations once printed. Always verify scanned payloads before high-volume printing.
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} R5 QR Code Generator. Built with precision and privacy.</p>
          <div className="flex items-center gap-6">
            <Link href="#generator" className="hover:text-foreground transition-colors">
              Generator
            </Link>
            <Link href="#how-it-works" className="hover:text-foreground transition-colors">
              How it Works
            </Link>
            <Link href="#features" className="hover:text-foreground transition-colors">
              Features
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
