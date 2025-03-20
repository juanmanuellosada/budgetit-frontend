"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, subMonths, subWeeks } from "date-fns"
import { es } from "date-fns/locale"
import { Search, Filter, CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DashboardFilterProps {
  categories: string[]
  accounts: string[]
  onFilterChange: (filters: {
    searchTerm: string
    dateRange: { from: Date | undefined; to: Date | undefined }
    selectedCategories: string[]
    selectedAccounts: string[]
  }) => void
  className?: string
}

export function DashboardFilter({ categories = [], accounts = [], onFilterChange, className }: DashboardFilterProps) {
  const { t, language } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([])
  const [datePreset, setDatePreset] = useState("thisMonth")
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  })
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Presets de fechas
  const datePresets = {
    thisWeek: {
      label: t("thisWeek"),
      range: {
        from: startOfWeek(new Date(), { weekStartsOn: 1 }),
        to: endOfWeek(new Date(), { weekStartsOn: 1 }),
      },
    },
    lastWeek: {
      label: t("lastWeek"),
      range: {
        from: startOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 }),
        to: endOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 }),
      },
    },
    thisMonth: {
      label: t("thisMonth"),
      range: {
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date()),
      },
    },
    lastMonth: {
      label: t("lastMonth"),
      range: {
        from: startOfMonth(subMonths(new Date(), 1)),
        to: endOfMonth(subMonths(new Date(), 1)),
      },
    },
    last3Months: {
      label: t("last3Months"),
      range: {
        from: startOfMonth(subMonths(new Date(), 3)),
        to: endOfMonth(new Date()),
      },
    },
    thisYear: {
      label: t("thisYear"),
      range: {
        from: new Date(new Date().getFullYear(), 0, 1),
        to: new Date(new Date().getFullYear(), 11, 31),
      },
    },
    lastYear: {
      label: t("lastYear"),
      range: {
        from: new Date(new Date().getFullYear() - 1, 0, 1),
        to: new Date(new Date().getFullYear() - 1, 11, 31),
      },
    },
    custom: {
      label: t("customRange"),
      range: dateRange,
    },
  }

  // Memoizamos la función para evitar recreaciones innecesarias
  const applyFilters = useCallback(() => {
    onFilterChange({
      searchTerm,
      dateRange,
      selectedCategories,
      selectedAccounts,
    })
  }, [searchTerm, dateRange, selectedCategories, selectedAccounts, onFilterChange])

  // Cambiar rango de fechas cuando cambia el preset
  useEffect(() => {
    if (datePreset !== "custom" && datePreset in datePresets) {
      const newRange = datePresets[datePreset as keyof typeof datePresets].range
      setDateRange(newRange)
    }
  }, [datePreset])

  // Aplicar filtros solo cuando el usuario hace clic en el botón
  // o cuando cambia el término de búsqueda o el preset de fechas
  useEffect(() => {
    // Solo aplicamos los filtros automáticamente para búsqueda y cambio de preset
    if (datePreset !== "custom") {
      applyFilters()
    }
  }, [searchTerm, datePreset, applyFilters])

  // Resetear filtros
  const resetFilters = () => {
    setSearchTerm("")
    setSelectedCategories([])
    setSelectedAccounts([])
    setDatePreset("thisMonth")
    setDateRange(datePresets.thisMonth.range)

    // Aplicar los filtros reseteados
    onFilterChange({
      searchTerm: "",
      dateRange: datePresets.thisMonth.range,
      selectedCategories: [],
      selectedAccounts: [],
    })
  }

  // Contar filtros activos
  const activeFiltersCount = selectedCategories.length + selectedAccounts.length + (datePreset !== "thisMonth" ? 1 : 0)

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("search")}
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={datePreset} onValueChange={setDatePreset}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("selectPeriod")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="thisWeek">{datePresets.thisWeek.label}</SelectItem>
            <SelectItem value="lastWeek">{datePresets.lastWeek.label}</SelectItem>
            <SelectItem value="thisMonth">{datePresets.thisMonth.label}</SelectItem>
            <SelectItem value="lastMonth">{datePresets.lastMonth.label}</SelectItem>
            <SelectItem value="last3Months">{datePresets.last3Months.label}</SelectItem>
            <SelectItem value="thisYear">{datePresets.thisYear.label}</SelectItem>
            <SelectItem value="lastYear">{datePresets.lastYear.label}</SelectItem>
            <SelectItem value="custom">{datePresets.custom.label}</SelectItem>
          </SelectContent>
        </Select>

        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex gap-2">
              <Filter className="h-4 w-4" />
              {t("filters")}
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="end">
            <div className="space-y-4">
              {/* Categorías */}
              <div className="space-y-2">
                <h4 className="font-medium">{t("categories")}</h4>
                <div className="flex flex-wrap gap-1">
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
              <div className="space-y-2">
                <h4 className="font-medium">{t("accounts")}</h4>
                <div className="flex flex-wrap gap-1">
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

              {/* Rango de fechas personalizado */}
              {datePreset === "custom" && (
                <div className="space-y-2">
                  <h4 className="font-medium">{t("dateRange")}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !dateRange.from && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange.from ? (
                              format(dateRange.from, "PPP", { locale: language === "es" ? es : undefined })
                            ) : (
                              <span>{t("from")}</span>
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
                    </div>
                    <div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !dateRange.to && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange.to ? (
                              format(dateRange.to, "PPP", { locale: language === "es" ? es : undefined })
                            ) : (
                              <span>{t("to")}</span>
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
                </div>
              )}

              <div className="flex justify-between">
                <Button variant="outline" size="sm" onClick={resetFilters}>
                  {t("resetFilters")}
                </Button>
                <Button size="sm" onClick={applyFilters}>
                  {t("applyFilters")}
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

