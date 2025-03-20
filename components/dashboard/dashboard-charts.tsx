"use client"

import { useState, useEffect } from "react"
import { CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { cn } from "@/lib/utils"
import { ChartManager } from "@/components/charts/chart-manager"
import dynamic from "next/dynamic"

// Importar los componentes de gráficos dinámicamente para evitar problemas de SSR
const ExpenseCategoryChart = dynamic(
  () => import("@/components/charts/expense-category-chart").then((mod) => mod.ExpenseCategoryChart),
  { ssr: false },
)
const IncomeExpenseChart = dynamic(
  () => import("@/components/charts/income-expense-chart").then((mod) => mod.IncomeExpenseChart),
  { ssr: false },
)
const SavingsTrendChart = dynamic(
  () => import("@/components/charts/savings-trend-chart").then((mod) => mod.SavingsTrendChart),
  { ssr: false },
)
const BudgetProgressChart = dynamic(
  () => import("@/components/charts/budget-progress-chart").then((mod) => mod.BudgetProgressChart),
  { ssr: false },
)
const AccountBalanceChart = dynamic(
  () => import("@/components/charts/account-balance-chart").then((mod) => mod.AccountBalanceChart),
  { ssr: false },
)

interface DashboardChartsProps {
  expandedSection?: string | null
  className?: string
}

export function DashboardCharts({ expandedSection, className }: DashboardChartsProps) {
  const { t } = useLanguage()
  const [activeCharts, setActiveCharts] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  // Lista de todos los gráficos disponibles
  const availableCharts = [
    { id: "expenseCategory", name: t("expensesByCategory"), component: ExpenseCategoryChart, category: "expense" },
    { id: "incomeExpense", name: t("incomeVsExpenses"), component: IncomeExpenseChart, category: "overview" },
    { id: "savingsTrend", name: t("savingsTrend"), component: SavingsTrendChart, category: "savings" },
    { id: "budgetProgress", name: t("budgetProgress"), component: BudgetProgressChart, category: "budget" },
    { id: "accountBalance", name: t("accountBalances"), component: AccountBalanceChart, category: "account" },
  ]

  // Marcar cuando el componente está montado para evitar problemas de hidratación
  useEffect(() => {
    setMounted(true)
  }, [])

  // Cargar las preferencias de gráficos desde localStorage al iniciar
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCharts = localStorage.getItem("dashboardActiveCharts")
      if (savedCharts) {
        try {
          setActiveCharts(JSON.parse(savedCharts))
        } catch (e) {
          console.error("Error parsing saved charts:", e)
        }
      } else {
        // Gráficos predeterminados si no hay nada guardado
        const defaultCharts = ["expenseCategory", "incomeExpense", "savingsTrend"]
        setActiveCharts(defaultCharts)
        localStorage.setItem("dashboardActiveCharts", JSON.stringify(defaultCharts))
      }
    }
  }, [])

  // Guardar las preferencias de gráficos cuando cambian
  useEffect(() => {
    if (activeCharts.length > 0 && typeof window !== "undefined") {
      localStorage.setItem("dashboardActiveCharts", JSON.stringify(activeCharts))
    }
  }, [activeCharts])

  // Función para activar o desactivar un gráfico
  const toggleChart = (chartId: string) => {
    setActiveCharts((prev) => (prev.includes(chartId) ? prev.filter((id) => id !== chartId) : [...prev, chartId]))
  }

  // Filtrar los gráficos según la sección expandida
  const filteredCharts = expandedSection
    ? availableCharts.filter(
        (chart) =>
          chart.category === expandedSection ||
          (expandedSection === "overview" && chart.category !== "expense" && chart.category !== "income"),
      )
    : availableCharts

  // Ordenar los gráficos para que primero aparezcan los activos
  const sortedCharts = filteredCharts.sort((a, b) => {
    const aActive = activeCharts.includes(a.id)
    const bActive = activeCharts.includes(b.id)

    if (aActive && !bActive) return -1
    if (!aActive && bActive) return 1
    return 0
  })

  if (!mounted) {
    return <div className="py-10 text-center text-muted-foreground">Cargando gráficos...</div>
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex justify-between items-center mb-4">
        <CardTitle>{t("financialAnalysis")}</CardTitle>
        <ChartManager
          availableCharts={availableCharts.map((c) => ({ id: c.id, name: c.name }))}
          activeCharts={activeCharts}
          onToggleChart={toggleChart}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sortedCharts.map((chart) => {
          const ChartComponent = chart.component
          // Solo mostrar el gráfico si está activo
          if (!activeCharts.includes(chart.id)) {
            return null
          }

          return (
            <div key={chart.id} className="col-span-1">
              <ChartComponent />
            </div>
          )
        })}
      </div>
    </div>
  )
}

