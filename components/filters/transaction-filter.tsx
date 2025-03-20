"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Search, Filter, CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TransactionFilterProps {
  categories: string[]
  accounts: string[]
  onFilterChange: (filters: {
    searchTerm: string
    transactionType: string
    selectedCategories: string[]
    selectedAccounts: string[]
    dateRange: { from: Date | undefined; to: Date | undefined }
  }) => void
  className?: string
}

export function TransactionFilter({
  categories = [],
  accounts = [],
  onFilterChange,
  className,
}: TransactionFilterProps) {
  const { t, language } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [transactionType, setTransactionType] = useState("all")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
  })
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Aplicar filtros cuando cambian
  useEffect(() => {
    onFilterChange({
      searchTerm,
      transactionType,
      selectedCategories,
      selectedAccounts,
      dateRange,
    })
  }, [searchTerm, transactionType, selectedCategories, selectedAccounts, dateRange, onFilterChange])

  // Resetear filtros
  const resetFilters = () => {
    setSelectedCategories([])
    setSelectedAccounts([])
    setDateRange({
      from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      to: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    })
  }

  // Contar filtros activos
  const activeFiltersCount =
    selectedCategories.length + selectedAccounts.length + (dateRange.from && dateRange.to ? 1 : 0)

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

        <Select value={transactionType} onValueChange={setTransactionType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("allTypes")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allTypes")}</SelectItem>
            <SelectItem value="income">{t("income")}</SelectItem>
            <SelectItem value="expense">{t("expense")}</SelectItem>
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

              {/* Rango de fechas */}
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

              <Button variant="outline" size="sm" onClick={resetFilters} className="w-full">
                {t("resetFilters")}
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

