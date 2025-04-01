"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import dynamic from "next/dynamic"

// Importar el componente de gráfico como un todo
const DynamicIncomeExpenseBarChart = dynamic(
  () => import('./income-expense-bar-chart').then(mod => mod.IncomeExpenseBarChart),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[300px] w-full flex items-center justify-center">
        <p className="text-muted-foreground">Cargando gráfico...</p>
      </div>
    )
  }
)

// Datos de ejemplo
const monthlyData = [
  { name: "Ene", income: 2500, expense: 1800 },
  { name: "Feb", income: 2700, expense: 1950 },
  { name: "Mar", income: 2850, expense: 2100 },
  { name: "Abr", income: 3000, expense: 2200 },
  { name: "May", income: 2900, expense: 2050 },
  { name: "Jun", income: 3100, expense: 2300 },
]

export function IncomeExpenseChart() {
  const { t } = useLanguage()
  const [period, setPeriod] = useState("halfYear")
  const [mounted, setMounted] = useState(false)

  // Verificar si estamos en el cliente
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Card className="w-full h-full">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>{t("incomeVsExpenses")}</CardTitle>
          <CardDescription>{t("monthlyComparison")}</CardDescription>
        </div>
        <Select defaultValue={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder={t("selectPeriod")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="quarter">{t("lastQuarter")}</SelectItem>
            <SelectItem value="halfYear">{t("lastSixMonths")}</SelectItem>
            <SelectItem value="year">{t("lastYear")}</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          {mounted ? (
            <DynamicIncomeExpenseBarChart data={monthlyData} currencyCode="ARS" />
          ) : (
            <div className="h-[300px] w-full flex items-center justify-center">
              <p className="text-muted-foreground">Cargando gráfico...</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}