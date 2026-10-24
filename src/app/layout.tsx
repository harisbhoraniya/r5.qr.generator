import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  width: "device-width",
  initialScale: 1,
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://qrstudio.vercel.app"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "R5 QR Code Generator — Production-Ready Static QR Code Generator",
    template: "%s | R5 QR Code Generator",
  },
  description:
    "Generate permanent, static QR codes directly in your browser. Download vector SVG, 2048px high-resolution PNG, or print-ready A4 PDF. 100% client-side privacy with no expiring links.",
  keywords: [
    "QR Code Generator",
    "Static QR Code",
    "Vector SVG QR Code",
    "Print Ready PDF QR",
    "Wi-Fi QR Code",
    "vCard QR Code",
    "Free QR Generator",
    "No Expiration QR",
  ],
  authors: [{ name: "R5 QR Code Generator Team" }],
  creator: "R5 QR Code Generator",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "R5 QR Code Generator — Production-Ready Static QR Code Generator",
    description:
      "Permanent, static QR codes with zero server tracking. Download vector SVG, 2048px PNG, and print-ready A4 PDF.",
    siteName: "R5 QR Code Generator",
  },
  twitter: {
    card: "summary_large_image",
    title: "R5 QR Code Generator — Static QR Code Generator",
    description:
      "Create high-resolution and vector QR codes right in your browser. Never expires, zero ads, no signup.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased text-foreground flex flex-col selection:bg-foreground selection:text-background">
        <ThemeProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  )
}
