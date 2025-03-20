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

  const sidebarItems = [
    {
      name: t("dashboard"),
      href: "/",
      icon: LayoutDashboard,
    },
    {
      name: t("accounts"),
      href: "/cuentas",
      icon: Wallet,
    },
    {
      name: t("cards"),
      href: "/tarjetas",
      icon: CreditCard,
    },
    {
      name: t("transactions"),
      href: "/transacciones",
      icon: ArrowLeftRight,
    },
    {
      name: t("budgets"),
      href: "/presupuestos",
      icon: PieChart,
    },
    {
      name: t("settings"),
      href: "/configuracion",
      icon: Settings,
    },
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
                {!collapsed && <span>{item.name}</span>}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto">
          <Button variant="outline" className={cn("w-full justify-start", collapsed && "justify-center")}>
            <HelpCircle className="h-4 w-4 mr-2" />
            {!collapsed && <span>{t("support")}</span>}
          </Button>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-6 h-6 w-6 rounded-full border bg-background shadow-sm"
        onClick={toggleSidebar}
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </Button>
    </div>
  )
}

