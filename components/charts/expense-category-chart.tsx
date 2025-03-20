"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import dynamic from "next/dynamic"

// Importar Recharts dinámicamente para evitar problemas de SSR
const PieChart = dynamic(() => import("recharts").then((mod) => mod.PieChart), { ssr: false })
const Pie = dynamic(() => import("recharts").then((mod) => mod.Pie), { ssr: false })
const Cell = dynamic(() => import("recharts").then((mod) => mod.Cell), { ssr: false })
const ResponsiveContainer = dynamic(() => import("recharts").then((mod) => mod.ResponsiveContainer), { ssr: false })
const Legend = dynamic(() => import("recharts").then((mod) => mod.Legend), { ssr: false })
const Tooltip = dynamic(() => import("recharts").then((mod) => mod.Tooltip), { ssr: false })

// Datos de ejemplo
const expenseData = [
  { name: "Alimentación", value: 450, color: "#FF6384" },
  { name: "Transporte", value: 180, color: "#36A2EB" },
  { name: "Vivienda", value: 850, color: "#FFCE56" },
  { name: "Ocio", value: 120, color: "#4BC0C0" },
  { name: "Salud", value: 50, color: "#9966FF" },
  { name: "Servicios", value: 210, color: "#FF9F40" },
]

export function ExpenseCategoryChart() {
  const { t } = useLanguage()
  const [period, setPeriod] = useState("month")
  const [mounted, setMounted] = useState(false)

  // Verificar si estamos en el cliente
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Card className="w-full h-full">
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle>{t("expensesByCategory")}</CardTitle>
            <CardDescription>{t("distributionOfExpenses")}</CardDescription>
          </div>
          <Select defaultValue={period} onValueChange={setPeriod} disabled>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder={t("selectPeriod")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">{t("thisWeek")}</SelectItem>
              <SelectItem value="month">{t("thisMonth")}</SelectItem>
              <SelectItem value="quarter">{t("thisQuarter")}</SelectItem>
              <SelectItem value="year">{t("thisYear")}</SelectItem>
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
          <CardTitle>{t("expensesByCategory")}</CardTitle>
          <CardDescription>{t("distributionOfExpenses")}</CardDescription>
        </div>
        <Select defaultValue={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder={t("selectPeriod")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">{t("thisWeek")}</SelectItem>
            <SelectItem value="month">{t("thisMonth")}</SelectItem>
            <SelectItem value="quarter">{t("thisQuarter")}</SelectItem>
            <SelectItem value="year">{t("thisYear")}</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {expenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}`, ""]}
              />
              <Legend layout="vertical" verticalAlign="middle" align="right" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

