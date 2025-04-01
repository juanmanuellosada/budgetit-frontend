"use client"

import React from 'react'
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts'
import { useLanguage } from "@/contexts/language-context"

type IncomeExpenseBarChartProps = {
  data: Array<{
    name: string;
    income: number;
    expense: number;
  }>;
  currencyCode: string;
}

export function IncomeExpenseBarChart({ data, currencyCode }: IncomeExpenseBarChartProps) {
  const { t } = useLanguage()
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
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
          formatter={(value: any) => [value.toLocaleString("es-ES", { style: "currency", currency: currencyCode }), ""]}
        />
        <Legend />
        <Bar dataKey="income" name={t("income")} fill="#4ade80" />
        <Bar dataKey="expense" name={t("expense")} fill="#f87171" />
      </BarChart>
    </ResponsiveContainer>
  )
}