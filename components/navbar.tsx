"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, User, LogOut, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSelector } from "@/components/language-selector"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { setTheme, theme } = useTheme()
  const { t } = useLanguage()

  return (
    <nav className="border-b bg-background">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-primary">BudgeIt</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <LanguageSelector />

              <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                <span className="sr-only">{t("changeTheme")}</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-user.jpg" alt={t("user")} />
                      <AvatarFallback>US</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
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
            <Link
              href="/"
              className={`block rounded-md px-3 py-2 text-base font-medium ${
                pathname === "/" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {t("dashboard")}
            </Link>
            <Link
              href="/cuentas"
              className={`block rounded-md px-3 py-2 text-base font-medium ${
                pathname === "/cuentas" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {t("accounts")}
            </Link>
            <Link
              href="/tarjetas"
              className={`block rounded-md px-3 py-2 text-base font-medium ${
                pathname === "/tarjetas" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {t("cards")}
            </Link>
            <Link
              href="/transacciones"
              className={`block rounded-md px-3 py-2 text-base font-medium ${
                pathname === "/transacciones" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {t("transactions")}
            </Link>
            <Link
              href="/presupuestos"
              className={`block rounded-md px-3 py-2 text-base font-medium ${
                pathname === "/presupuestos" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {t("budgets")}
            </Link>
            <Link
              href="/configuracion"
              className={`block rounded-md px-3 py-2 text-base font-medium ${
                pathname === "/configuracion" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {t("settings")}
            </Link>
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <LanguageSelector />
              <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

