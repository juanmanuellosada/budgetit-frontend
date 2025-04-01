import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/contexts/language-context"
import { Toaster } from "@/components/ui/toaster"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { PwaInstallPrompt } from "@/components/pwa-install-prompt"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })


export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1E40AF",
}

export const metadata = {
  title: "BudgeIt - Gestión Financiera Personal",
  description: "Aplicación modular para gestión financiera personal",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BudgeIt",
  },
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <LanguageProvider>
            <div className="flex flex-col min-h-screen overflow-hidden">
              <Navbar />
              <div className="flex flex-1">
                <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
                  {children}
                  <PwaInstallPrompt />
                </main>
              </div>
            </div>
            <Toaster />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'