import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { SmoothCursor } from "@/components/ui/smooth-cursor"
import { AuthProvider } from "@/contexts/AuthContext"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "GoApply",
  description: "Your gateway to global education - Find, apply, and track your study abroad journey",
  generator: "GoApply",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AuthProvider>
          <Suspense fallback={null}>
            {children}
            <SmoothCursor />
          </Suspense>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
