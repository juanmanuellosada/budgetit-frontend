"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSelector } from "@/components/language-selector"
import {
  Menu, X, User, LogOut, Moon, Sun,
  LayoutDashboard, Wallet, CreditCard, ArrowLeftRight,
  PieChart, Settings, HelpCircle
} from "lucide-react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { setTheme, theme } = useTheme()
  const { t } = useLanguage()
  const [mounted, setMounted] = useState(false)

  // Agrega este useEffect para manejar el montaje
  useEffect(() => {
    setMounted(true)
  }, [])  

  // Define las rutas principales con sus iconos correspondientes
  const mainRoutes = [
    { path: "/", label: t("dashboard"), icon: LayoutDashboard },
    { path: "/cuentas", label: t("accounts"), icon: Wallet },
    { path: "/tarjetas", label: t("cards"), icon: CreditCard },
    { path: "/transacciones", label: t("transactions"), icon: ArrowLeftRight },
    { path: "/presupuestos", label: t("budgets"), icon: PieChart },
    { path: "/configuracion", label: t("settings"), icon: Settings }
  ]

  return (
    <nav className="border-b bg-background">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img src="/logo.png" alt="BudgeIt Logo" className="h-8 w-8" />
              <span className="text-xl font-bold text-primary">BudgeIt</span>
            </Link>
            
            {/* Pestañas de navegación con iconos */}
            <div className="hidden md:flex ml-8 space-x-2">
              {mainRoutes.map(route => (
                <Link
                  key={route.path}
                  href={route.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2
                    ${pathname === route.path 
                      ? "bg-primary text-primary-foreground" 
                      : "text-foreground hover:bg-muted"}
                  `}
                >
                  <route.icon className="h-4 w-4" />
                  {route.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <LanguageSelector />

              <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {mounted && (
                  <>
                    {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    <span className="sr-only">{t("changeTheme")}</span>
                  </>
                )}
              </Button>

                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">                    
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">Usuario</p>
                        <p className="text-xs leading-none text-muted-foreground">
                        usuario@example.com
                        </p>
                    </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>{t("profile")}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t("logout")}</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
            </div>
          </div>

          <div className="flex md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              <span className="sr-only">{t("openMenu")}</span>
            </Button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {/* También agrega iconos en el menú móvil */}
            {mainRoutes.map(route => (
              <Link
                key={route.path}
                href={route.path}
                className={`block rounded-md px-3 py-2 text-base font-medium flex items-center gap-2 ${
                  pathname === route.path ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                }`}
                onClick={() => setIsOpen(false)}
              >
                <route.icon className="h-4 w-4" />
                {route.label}
              </Link>
            ))}
            
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <LanguageSelector />
              <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {mounted && (
                  <>
                    {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

