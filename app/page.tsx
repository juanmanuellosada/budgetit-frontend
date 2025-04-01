"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSummary } from "@/components/dashboard/dashboard-summary"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { BudgetOverview } from "@/components/dashboard/budget-overview"
import { OperationsSummary } from "@/components/dashboard/operations-summary"
import { FloatingActionButton } from "@/components/floating-action-button"
import { QuickTransactionEntry } from "@/components/dashboard/quick-transaction-entry"
import { useLanguage } from "@/contexts/language-context"
import { SimpleDashboardGrid } from "@/components/dashboard/simple-dashboard-grid"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DashboardFilterPanel } from "@/components/dashboard/dashboard-filter-panel"

// Mock transactions data for demonstration
const transactions = [
  { id: 1, category: "Alimentación", account: "Cuenta Corriente" },
  { id: 2, category: "Restaurantes", account: "Visa Oro" },
  { id: 3, category: "Vivienda", account: "Cuenta Corriente" },
  { id: 4, category: "Transporte", account: "Mastercard" },
  { id: 5, category: "Ingresos", account: "Cuenta Corriente" },
  { id: 6, category: "Ocio", account: "Visa Oro" },
  { id: 7, category: "Compras", account: "Mastercard" },
  { id: 8, category: "Inversiones", account: "Cuenta de Ahorros" },
  { id: 9, category: "Salud", account: "Cuenta Corriente" },
  { id: 10, category: "Seguros", account: "Cuenta Corriente" },
]

export default function Home() {
  const { t } = useLanguage()
  const [isQuickEntryOpen, setIsQuickEntryOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    selectedCategories: [],
    selectedAccounts: [],
    dateRange: { from: undefined, to: undefined },
  })

  // Verificar si estamos en el cliente
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Definir los títulos de los widgets
  const widgetTitles = [
    t("dashboard"),
    t("income"),
    t("expense"),
    t("balance"),
    t("cards"),
    t("operationsSummary"),
    t("recentTransactions"),
    t("budgets"),
  ]

  // Componentes para el dashboard
  const dashboardComponents = [
    <DashboardSummary key="summary" />,
    // Componentes individuales para cada tarjeta del DashboardSummary
    <div key="income" className="flex flex-col">
      <div className="text-2xl font-bold">$15,231.89</div>
      <p className="text-xs text-muted-foreground">+20.1% respecto al mes anterior</p>
    </div>,
    <div key="expense" className="flex flex-col">
      <div className="text-2xl font-bold">$7,461.42</div>
      <p className="text-xs text-muted-foreground">-4.5% respecto al mes anterior</p>
    </div>,
    <div key="balance" className="flex flex-col">
      <div className="text-2xl font-bold">$7,770.47</div>
      <p className="text-xs text-muted-foreground">+$1,254.25 respecto al mes anterior</p>
    </div>,
    <div key="cards" className="flex flex-col">
      <div className="text-2xl font-bold">$2,891.56</div>
      <p className="text-xs text-muted-foreground">Deuda pendiente en tarjetas</p>
    </div>,
    <OperationsSummary key="operations" />,
    <RecentTransactions key="transactions" />,
    <BudgetOverview key="budgets" />,
  ]

// Define interfaces
interface Transaction {
    id: number;
    category: string;
    account: string;
}

interface FilterState {
    selectedCategories: string[];
    selectedAccounts: string[];
    dateRange: {
        from: Date | undefined;
        to: Date | undefined;
    };
}

const categories: string[] = Array.from(new Set(transactions.map((t: Transaction) => t.category)))
const accounts: string[] = Array.from(new Set(transactions.map((t: Transaction) => t.account)))

// Memoizamos la función para evitar recreaciones innecesarias
const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters)
    console.log("Filters changed:", newFilters)
}, [])

// Si no estamos en el cliente, mostrar un estado de carga
if (!isClient) {
    return (
        <div className="flex flex-col gap-6">
            <DashboardHeader />
            <div>Cargando dashboard...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("dashboard")}</h1>
          <p className="text-muted-foreground">{t("welcome")}</p>
        </div>
        <Button variant="outline" onClick={() => console.log("Exportar")}>
          {t("export")}
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex flex-1 gap-2 w-full">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("search")}
              className="w-full pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                {t("filters")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <DashboardFilterPanel
                categories={categories}
                accounts={accounts}
                onFilterChange={handleFilterChange}
                onClose={() => setIsFilterOpen(false)}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <SimpleDashboardGrid titles={widgetTitles}>{dashboardComponents}</SimpleDashboardGrid>

      <FloatingActionButton onClick={() => setIsQuickEntryOpen(true)} />
      <QuickTransactionEntry open={isQuickEntryOpen} onOpenChange={setIsQuickEntryOpen} />
    </div>
  )
}

