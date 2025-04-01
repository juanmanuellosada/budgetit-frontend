"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Wallet,
  CreditCard,
  ArrowLeftRight,
  PieChart,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"

export function Sidebar() {
  const pathname = usePathname()
  const { t } = useLanguage()
  const [collapsed, setCollapsed] = useState(false)

  // Cargar estado del sidebar desde localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarCollapsed")
    if (savedState) {
      setCollapsed(savedState === "true")
    }
  }, [])

  // Guardar estado del sidebar en localStorage
  const toggleSidebar = () => {
    const newState = !collapsed
    setCollapsed(newState)
    localStorage.setItem("sidebarCollapsed", String(newState))
  }

  // Ahora solo incluye ítems adicionales que no están en la barra superior
  // o puedes dejarla completamente vacía o con solo algunos elementos útiles
  const sidebarItems = [
    {
      name: t("help"),
      href: "/ayuda",
      icon: HelpCircle,
    },
    // Puedes añadir otros elementos específicos aquí si es necesario
  ]

  return (
    <div
      className={cn(
        "relative h-full border-r bg-muted/40 transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-full max-h-screen flex-col gap-2 p-4">
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start gap-2">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary",
                  pathname === item.href ? "bg-muted text-primary" : "text-muted-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                <span className={collapsed ? "hidden" : ""}>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="mt-auto mb-4"
          onClick={toggleSidebar}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  )
}

