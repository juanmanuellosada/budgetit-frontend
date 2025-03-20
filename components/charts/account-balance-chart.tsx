"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Datos de ejemplo
const balanceData = [
  { date: "01/03", checking: 3200, savings: 7400, total: 10600 },
  { date: "05/03", checking: 3100, savings: 7400, total: 10500 },
  { date: "10/03", checking: 2950, savings: 7450, total: 10400 },
  { date: "15/03", checking: 2800, savings: 7500, total: 10300 },
  { date: "20/03", checking: 3300, savings: 7500, total: 10800 },
  { date: "25/03", checking: 3250, savings: 7400, total: 10650 },
  { date: "31/03", checking: 3250, savings: 7410, total: 10660 },
]

export function AccountBalanceChart() {
  const { t } = useLanguage()
  const [period, setPeriod] = useState("month")
  const [account, setAccount] = useState("all")

  return (
    <Card className="w-full h-full">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>{t("accountBalances")}</CardTitle>
          <CardDescription>{t("balanceEvolution")}</CardDescription>
        </div>
        <div className="flex space-x-2">
          <Select defaultValue={account} onValueChange={setAccount}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder={t("selectAccount")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allAccounts")}</SelectItem>
              <SelectItem value="checking">{t("checkingAccount")}</SelectItem>
              <SelectItem value="savings">{t("savingsAccount")}</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder={t("selectPeriod")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">{t("thisWeek")}</SelectItem>
              <SelectItem value="month">{t("thisMonth")}</SelectItem>
              <SelectItem value="quarter">{t("thisQuarter")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={balanceData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                formatter={(value) => [value.toLocaleString("es-ES", { style: "currency", currency: "EUR" }), ""]}
              />
              <Legend />
              {(account === "all" || account === "checking") && (
                <Area
                  type="monotone"
                  dataKey="checking"
                  name={t("checkingAccount")}
                  stackId="1"
                  stroke="#8884d8"
                  fill="#8884d8"
                />
              )}
              {(account === "all" || account === "savings") && (
                <Area
                  type="monotone"
                  dataKey="savings"
                  name={t("savingsAccount")}
                  stackId="1"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                />
              )}
              {account === "all" && (
                <Area
                  type="monotone"
                  dataKey="total"
                  name={t("totalBalance")}
                  stroke="#ffc658"
                  fill="#ffc658"
                  activeDot={{ r: 8 }}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

