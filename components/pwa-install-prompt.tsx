"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function PwaInstallPrompt() {
  const { t } = useLanguage()
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallButton, setShowInstallButton] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevenir que Chrome muestre automáticamente el diálogo
      e.preventDefault()
      // Guardar el evento para usarlo más tarde
      setDeferredPrompt(e)
      // Mostrar nuestro botón personalizado
      setShowInstallButton(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    // Verificar si la app ya está instalada
    const isAppInstalled = window.matchMedia("(display-mode: standalone)").matches
    if (isAppInstalled) {
      setShowInstallButton(false)
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // Mostrar el diálogo de instalación
    deferredPrompt.prompt()

    // Esperar a que el usuario responda
    const { outcome } = await deferredPrompt.userChoice

    // Ocultar el botón independientemente de la respuesta
    setShowInstallButton(false)
    setDeferredPrompt(null)
  }

  if (!showInstallButton) return null

  return (
    <div className="fixed bottom-20 right-6 z-50">
      <Button onClick={handleInstallClick} className="shadow-lg flex items-center gap-2 bg-primary hover:bg-primary/90">
        <Download className="h-4 w-4" />
        {t("installApp")}
      </Button>
    </div>
  )
}

