"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"

// Datos de ejemplo
const budgetData = [
  { name: "Alimentación", current: 450, limit: 600 },
  { name: "Transporte", current: 180, limit: 200 },
  { name: "Ocio", current: 120, limit: 150 },
  { name: "Servicios", current: 210, limit: 250 },
  { name: "Salud", current: 50, limit: 200 },
]

export function BudgetProgressChart() {
  const { t } = useLanguage()
  const [category, setCategory] = useState("all")

  // Filtrar datos según la categoría seleccionada
  const filteredData =
    category === "all" ? budgetData : budgetData.filter((item) => item.name.toLowerCase() === category)

  return (
    <Card className="w-full h-full">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>{t("budgetProgress")}</CardTitle>
          <CardDescription>{t("actualVsPlanned")}</CardDescription>
        </div>
        <Select defaultValue={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder={t("selectCategory")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allCategories")}</SelectItem>
            {budgetData.map((item) => (
              <SelectItem key={item.name} value={item.name.toLowerCase()}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={100} />
              <Tooltip
                formatter={(value) => [value.toLocaleString("es-ES", { style: "currency", currency: "EUR" }), ""]}
              />
              <Legend />
              <Bar dataKey="current" name={t("currentSpending")} fill="#3b82f6" />
              <ReferenceLine x={0} stroke="#000" />
              {filteredData.map((entry, index) => (
                <ReferenceLine
                  key={`ref-${index}`}
                  x={entry.limit}
                  stroke="red"
                  strokeDasharray="3 3"
                  isFront={true}
                  label={{ value: t("limit"), position: "right" }}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

