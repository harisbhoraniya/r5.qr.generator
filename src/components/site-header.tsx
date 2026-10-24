"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { QrCode, Menu, X, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-provider"

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-semibold tracking-tight transition-opacity hover:opacity-85"
          aria-label="R5 QR Code Generator Homepage"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg overflow-hidden border border-border/70 bg-white p-0.5 shadow-2xs">
            <Image
              src="/logo.png"
              alt="R5 Logo"
              width={36}
              height={36}
              className="h-full w-full object-contain"
              priority
            />
          </div>
          <span className="text-base font-semibold text-foreground">R5 QR Code Generator</span>
          <span className="rounded border border-border bg-muted/60 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
            Static
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex" aria-label="Main Navigation">
          <Link
            href="#generator"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Generator
          </Link>
          <Link
            href="#how-it-works"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            How it Works
          </Link>
          <Link
            href="#features"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Features
          </Link>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            asChild
            size="sm"
            className="hidden sm:inline-flex gap-1 text-xs font-medium"
          >
            <Link href="#generator">
              Create QR <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Button>

          {/* Mobile menu trigger */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-border bg-background px-4 py-4 md:hidden animate-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-3 text-sm font-medium">
            <Link
              href="#generator"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-foreground transition-colors hover:text-muted-foreground"
            >
              Generator
            </Link>
            <Link
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-foreground transition-colors hover:text-muted-foreground"
            >
              How it Works
            </Link>
            <Link
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-foreground transition-colors hover:text-muted-foreground"
            >
              Features
            </Link>
            <div className="pt-2">
              <Button asChild size="sm" className="w-full">
                <Link href="#generator" onClick={() => setMobileMenuOpen(false)}>
                  Create QR Code
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
