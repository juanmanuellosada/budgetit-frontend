"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Datos de ejemplo
const savingsData = [
  { name: "Ene", value: 700 },
  { name: "Feb", value: 750 },
  { name: "Mar", value: 750 },
  { name: "Abr", value: 800 },
  { name: "May", value: 850 },
  { name: "Jun", value: 800 },
  { name: "Jul", value: 900 },
  { name: "Ago", value: 950 },
  { name: "Sep", value: 1000 },
  { name: "Oct", value: 1050 },
  { name: "Nov", value: 1100 },
  { name: "Dic", value: 1200 },
]

export function SavingsTrendChart() {
  const { t } = useLanguage()
  const [period, setPeriod] = useState("year")

  return (
    <Card className="w-full h-full">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>{t("savingsTrend")}</CardTitle>
          <CardDescription>{t("monthlySavingsEvolution")}</CardDescription>
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
            <LineChart
              data={savingsData}
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
                formatter={(value) => [value.toLocaleString("es-ES", { style: "currency", currency: "ARS" }), ""]}
              />
              <Legend />
              <Line type="monotone" dataKey="value" name={t("monthlyBalance")} stroke="#3b82f6" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

