"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Search, Filter } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"
import { DateRangeFilter } from "@/components/dashboard/date-range-filter"

interface AdvancedFilterProps {
  categories?: string[]
  accounts?: string[]
  onFilterChange: (filters: {
    searchTerm: string
    selectedCategories: string[]
    selectedAccounts: string[]
    dateRange: { from: Date; to: Date }
  }) => void
  className?: string
}

export function AdvancedFilter({ categories = [], accounts = [], onFilterChange, className }: AdvancedFilterProps) {
  const { t, language } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
  })

  // Aplicar filtros
  const applyFilters = () => {
    onFilterChange({
      searchTerm,
      selectedCategories,
      selectedAccounts,
      dateRange,
    })
  }

  // Resetear filtros
  const resetFilters = () => {
    setSearchTerm("")
    setSelectedCategories([])
    setSelectedAccounts([])
    setDateRange({
      from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      to: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    })

    onFilterChange({
      searchTerm: "",
      selectedCategories: [],
      selectedAccounts: [],
      dateRange: {
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        to: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
      },
    })
  }

  // Manejar cambio de fecha
  const handleDateRangeChange = (range: { from: Date; to: Date }) => {
    setDateRange(range)
  }

  return (
    <div className={cn("flex flex-col sm:flex-row gap-2", className)}>
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={t("search")}
          className="w-full pl-8"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            // Aplicar filtro inmediatamente al buscar
            onFilterChange({
              searchTerm: e.target.value,
              selectedCategories,
              selectedAccounts,
              dateRange,
            })
          }}
        />
      </div>

      <DateRangeFilter
        onChange={(range) => {
          handleDateRangeChange(range)
          onFilterChange({
            searchTerm,
            selectedCategories,
            selectedAccounts,
            dateRange: range,
          })
        }}
      />

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="flex gap-2">
            <Filter className="h-4 w-4" />
            {t("filters")}
            {(selectedCategories.length > 0 || selectedAccounts.length > 0) && (
              <Badge variant="secondary" className="ml-1">
                {selectedCategories.length + selectedAccounts.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            {categories.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium leading-none">{t("categories")}</h4>
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
            )}

            {accounts.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium leading-none">{t("accounts")}</h4>
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
  )
}

