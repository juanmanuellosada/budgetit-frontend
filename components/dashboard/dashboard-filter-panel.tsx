"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"

interface DashboardFilterPanelProps {
  categories: string[]
  accounts: string[]
  onFilterChange: (filters: {
    selectedCategories: string[]
    selectedAccounts: string[]
    dateRange: { from: Date | undefined; to: Date | undefined }
  }) => void
  onClose?: () => void
}

export function DashboardFilterPanel({ categories, accounts, onFilterChange, onClose }: DashboardFilterPanelProps) {
  const { t, language } = useLanguage()
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })

  // Aplicar filtros cuando cambian las selecciones
  useEffect(() => {
    onFilterChange({
      selectedCategories,
      selectedAccounts,
      dateRange,
    })
  }, [selectedCategories, selectedAccounts, dateRange, onFilterChange])

  // Resetear filtros
  const resetFilters = () => {
    setSelectedCategories([])
    setSelectedAccounts([])
    setDateRange({ from: undefined, to: undefined })
  }

  return (
    <div className="p-4 bg-background border rounded-lg shadow-sm w-full max-w-xs">
      {/* Categorías */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2">{t("categories")}</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategories.includes(category) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => {
                setSelectedCategories((prev) =>
                  prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
                )
              }}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Cuentas */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2">{t("accounts")}</h3>
        <div className="flex flex-wrap gap-2">
          {accounts.map((account) => (
            <Badge
              key={account}
              variant={selectedAccounts.includes(account) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => {
                setSelectedAccounts((prev) =>
                  prev.includes(account) ? prev.filter((a) => a !== account) : [...prev, account],
                )
              }}
            >
              {account}
            </Badge>
          ))}
        </div>
      </div>

      {/* Rango de fechas */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2">{t("dateRange")}</h3>
        <div className="grid grid-cols-2 gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !dateRange.from && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  format(dateRange.from, "PP", { locale: language === "es" ? es : undefined })
                ) : (
                  <span>{t("desde")}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateRange.from}
                onSelect={(date) => setDateRange((prev) => ({ ...prev, from: date }))}
                initialFocus
                locale={language === "es" ? es : undefined}
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !dateRange.to && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.to ? (
                  format(dateRange.to, "PP", { locale: language === "es" ? es : undefined })
                ) : (
                  <span>{t("hasta")}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateRange.to}
                onSelect={(date) => setDateRange((prev) => ({ ...prev, to: date }))}
                initialFocus
                locale={language === "es" ? es : undefined}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Botón para restablecer filtros */}
      <Button variant="outline" className="w-full" onClick={resetFilters}>
        {t("resetFilters")}
      </Button>
    </div>
  )
}

