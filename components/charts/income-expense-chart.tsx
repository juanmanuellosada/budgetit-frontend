"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import dynamic from "next/dynamic"

// Importar Recharts dinámicamente para evitar problemas de SSR
const BarChart = dynamic(() => import("recharts").then((mod) => mod.BarChart), { ssr: false })
const Bar = dynamic(() => import("recharts").then((mod) => mod.Bar), { ssr: false })
const XAxis = dynamic(() => import("recharts").then((mod) => mod.XAxis), { ssr: false })
const YAxis = dynamic(() => import("recharts").then((mod) => mod.YAxis), { ssr: false })
const CartesianGrid = dynamic(() => import("recharts").then((mod) => mod.CartesianGrid), { ssr: false })
const Tooltip = dynamic(() => import("recharts").then((mod) => mod.Tooltip), { ssr: false })
const Legend = dynamic(() => import("recharts").then((mod) => mod.Legend), { ssr: false })
const ResponsiveContainer = dynamic(() => import("recharts").then((mod) => mod.ResponsiveContainer), { ssr: false })

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

  if (!mounted) {
    return (
      <Card className="w-full h-full">
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle>{t("incomeVsExpenses")}</CardTitle>
            <CardDescription>{t("monthlyComparison")}</CardDescription>
          </div>
          <Select defaultValue={period} onValueChange={setPeriod} disabled>
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
          <div className="h-[300px] w-full flex items-center justify-center">
            <p className="text-muted-foreground">Cargando gráfico...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

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
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value) => [value.toLocaleString("es-ES", { style: "currency", currency: "EUR" }), ""]}
              />
              <Legend />
              <Bar dataKey="income" name={t("income")} fill="#4ade80" />
              <Bar dataKey="expense" name={t("expense")} fill="#f87171" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

