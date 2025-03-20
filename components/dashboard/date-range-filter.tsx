"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, subMonths, subWeeks } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"

interface DateRangeFilterProps {
  onChange: (range: { from: Date; to: Date }) => void
  className?: string
}

export function DateRangeFilter({ onChange, className }: DateRangeFilterProps) {
  const { t, language } = useLanguage()
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  })
  const [preset, setPreset] = useState("thisMonth")

  // Presets de fechas
  const presets = {
    thisWeek: {
      label: t("thisWeek"),
      getRange: () => ({
        from: startOfWeek(new Date(), { weekStartsOn: 1 }),
        to: endOfWeek(new Date(), { weekStartsOn: 1 }),
      }),
    },
    lastWeek: {
      label: t("lastWeek"),
      getRange: () => ({
        from: startOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 }),
        to: endOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 }),
      }),
    },
    thisMonth: {
      label: t("thisMonth"),
      getRange: () => ({
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date()),
      }),
    },
    lastMonth: {
      label: t("lastMonth"),
      getRange: () => ({
        from: startOfMonth(subMonths(new Date(), 1)),
        to: endOfMonth(subMonths(new Date(), 1)),
      }),
    },
    last3Months: {
      label: t("last3Months"),
      getRange: () => ({
        from: startOfMonth(subMonths(new Date(), 3)),
        to: endOfMonth(new Date()),
      }),
    },
    thisYear: {
      label: t("thisYear"),
      getRange: () => ({
        from: new Date(new Date().getFullYear(), 0, 1),
        to: new Date(new Date().getFullYear(), 11, 31),
      }),
    },
    lastYear: {
      label: t("lastYear"),
      getRange: () => ({
        from: new Date(new Date().getFullYear() - 1, 0, 1),
        to: new Date(new Date().getFullYear() - 1, 11, 31),
      }),
    },
    custom: {
      label: t("customRange"),
      getRange: () => dateRange,
    },
  }

  // Manejar cambio de preset
  const handlePresetChange = (value: string) => {
    setPreset(value)
    if (value !== "custom" && value in presets) {
      const newRange = presets[value as keyof typeof presets].getRange()
      setDateRange(newRange)
      onChange(newRange)
    }
  }

  // Manejar cambio de rango personalizado
  const handleCustomRangeChange = (range: { from?: Date; to?: Date }) => {
    if (range.from && range.to) {
      setDateRange({ from: range.from, to: range.to })
      onChange({ from: range.from, to: range.to })
      setPreset("custom")
    }
  }

  return (
    <div className={cn("flex flex-col sm:flex-row gap-2", className)}>
      <Select value={preset} onValueChange={handlePresetChange}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder={t("selectPeriod")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="thisWeek">{presets.thisWeek.label}</SelectItem>
          <SelectItem value="lastWeek">{presets.lastWeek.label}</SelectItem>
          <SelectItem value="thisMonth">{presets.thisMonth.label}</SelectItem>
          <SelectItem value="lastMonth">{presets.lastMonth.label}</SelectItem>
          <SelectItem value="last3Months">{presets.last3Months.label}</SelectItem>
          <SelectItem value="thisYear">{presets.thisYear.label}</SelectItem>
          <SelectItem value="lastYear">{presets.lastYear.label}</SelectItem>
          <SelectItem value="custom">{presets.custom.label}</SelectItem>
        </SelectContent>
      </Select>

      {preset === "custom" && (
        <div className="flex flex-col sm:flex-row gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full sm:w-auto justify-start text-left font-normal",
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
                onSelect={(date) => date && handleCustomRangeChange({ ...dateRange, from: date })}
                initialFocus
                locale={language === "es" ? es : undefined}
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full sm:w-auto justify-start text-left font-normal",
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
                onSelect={(date) => date && handleCustomRangeChange({ ...dateRange, to: date })}
                initialFocus
                locale={language === "es" ? es : undefined}
              />
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  )
}

