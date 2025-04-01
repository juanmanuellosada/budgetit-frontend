"use client"

import React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  MoreHorizontal,
  Search,
  Pencil,
  Trash2,
  Filter,
  ArrowUpDown,
  Calendar,
  Download,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"

// Datos de ejemplo
const transactions = [
  {
    id: 1,
    description: "Supermercado",
    amount: -125.5,
    date: "2025-03-07",
    category: "Alimentación",
    account: "Cuenta Corriente",
    type: "expense",
  },
  {
    id: 2,
    description: "Café",
    amount: -4.75,
    date: "2025-03-06",
    category: "Restaurantes",
    account: "Visa Oro",
    type: "expense",
  },
  {
    id: 3,
    description: "Alquiler",
    amount: -850.0,
    date: "2025-03-05",
    category: "Vivienda",
    account: "Cuenta Corriente",
    type: "expense",
  },
  {
    id: 4,
    description: "Gasolina",
    amount: -45.0,
    date: "2025-03-04",
    category: "Transporte",
    account: "Mastercard",
    type: "expense",
  },
  {
    id: 5,
    description: "Salario",
    amount: 2500.0,
    date: "2025-03-01",
    category: "Ingresos",
    account: "Cuenta Corriente",
    type: "income",
  },
  {
    id: 6,
    description: "Freelance",
    amount: 350.0,
    date: "2025-03-03",
    category: "Ingresos",
    account: "Cuenta de Ahorros",
    type: "income",
  },
  {
    id: 7,
    description: "Cine",
    amount: -15.0,
    date: "2025-03-02",
    category: "Ocio",
    account: "Visa Oro",
    type: "expense",
  },
  {
    id: 8,
    description: "Compra online",
    amount: -89.99,
    date: "2025-02-28",
    category: "Compras",
    account: "Mastercard",
    type: "expense",
  },
  {
    id: 9,
    description: "Dividendos",
    amount: 120.0,
    date: "2025-02-25",
    category: "Inversiones",
    account: "Cuenta de Ahorros",
    type: "income",
  },
  {
    id: 10,
    description: "Gimnasio",
    amount: -50.0,
    date: "2025-02-20",
    category: "Salud",
    account: "Cuenta Corriente",
    type: "expense",
  },
  {
    id: 11,
    description: "Seguro de coche",
    amount: -180.0,
    date: "2025-02-15",
    category: "Seguros",
    account: "Cuenta Corriente",
    type: "expense",
  },
  {
    id: 12,
    description: "Bonus",
    amount: 500.0,
    date: "2025-02-10",
    category: "Ingresos",
    account: "Cuenta Corriente",
    type: "income",
  },
]

// Extraer categorías y cuentas únicas para los filtros
const categories = Array.from(new Set(transactions.map((t) => t.category)))
const accounts = Array.from(new Set(transactions.map((t) => t.account)))

export function TransactionsList() {
  const { t, language } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeType, setActiveType] = useState<string | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null)
  const [page, setPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const tableRef = useRef<HTMLDivElement>(null)

  // Filtrar transacciones
  const filteredTransactions = transactions.filter((transaction) => {
    // Filtro de búsqueda
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.account.toLowerCase().includes(searchTerm.toLowerCase())

    // Filtro por tipo
    const matchesType =
      activeType === null ||
      (activeType === "income" && transaction.type === "income") ||
      (activeType === "expense" && transaction.type === "expense")

    // Filtro por categoría
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(transaction.category)

    // Filtro por cuenta
    const matchesAccount = selectedAccounts.length === 0 || selectedAccounts.includes(transaction.account)

    // Filtro por fecha
    const transactionDate = new Date(transaction.date)
    const matchesDateFrom = !dateRange.from || transactionDate >= dateRange.from
    const matchesDateTo = !dateRange.to || transactionDate <= dateRange.to

    return matchesSearch && matchesType && matchesCategory && matchesAccount && matchesDateFrom && matchesDateTo
  })

  // Ordenar transacciones
  const sortedTransactions = React.useMemo(() => {
    const sortableTransactions = [...filteredTransactions]
    if (sortConfig !== null) {
      sortableTransactions.sort((a, b) => {
        if (a[sortConfig.key as keyof typeof a] < b[sortConfig.key as keyof typeof b]) {
          return sortConfig.direction === "asc" ? -1 : 1
        }
        if (a[sortConfig.key as keyof typeof a] > b[sortConfig.key as keyof typeof b]) {
          return sortConfig.direction === "asc" ? 1 : -1
        }
        return 0
      })
    }
    return sortableTransactions
  }, [filteredTransactions, sortConfig])

  // Paginación
  const paginatedTransactions = sortedTransactions.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage)

  // Función para ordenar
  const requestSort = (key: string) => {
    let direction: "asc" | "desc" = "asc"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  // Función para exportar transacciones
  const exportTransactions = () => {
    const csvContent = [
      ["ID", "Descripción", "Monto", "Fecha", "Categoría", "Cuenta", "Tipo"].join(","),
      ...filteredTransactions.map((t) =>
        [t.id, t.description, t.amount, t.date, t.category, t.account, t.type].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "transacciones.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Resetear filtros
  const resetFilters = () => {
    setSearchTerm("")
    setActiveType(null)
    setSelectedCategories([])
    setSelectedAccounts([])
    setDateRange({})
    setSortConfig(null)
    setPage(1)
  }

  // Scroll al cambiar de página
  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [page])

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>{t("transactions")}</CardTitle>
            <CardDescription>{t("transactionsHistory")}</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={exportTransactions} className="flex gap-2">
              <Download className="h-4 w-4" />
              {t("export")}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Barra de búsqueda y filtros */}
          <div className="flex flex-col sm:flex-row gap-2">
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
            <div className="flex flex-wrap gap-2">
              <Select
                value={activeType || "all"}
                onValueChange={(value) => setActiveType(value === "all" ? null : value)}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder={t("allTypes")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allTypes")}</SelectItem>
                  <SelectItem value="income">{t("income")}</SelectItem>
                  <SelectItem value="expense">{t("expense")}</SelectItem>
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="flex gap-2">
                    <Filter className="h-4 w-4" />
                    {t("filters")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">{t("categories")}</h4>
                      <div className="flex flex-wrap gap-1">
                        {categories.map((category) => (
                          <Badge
                            key={category}
                            variant={selectedCategories.includes(category) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => {
                              setSelectedCategories((prev) =>
                                prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
                              )
                            }}
                          >
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">{t("accounts")}</h4>
                      <div className="flex flex-wrap gap-1">
                        {accounts.map((account) => (
                          <Badge
                            key={account}
                            variant={selectedAccounts.includes(account) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => {
                              setSelectedAccounts((prev) =>
                                prev.includes(account) ? prev.filter((a) => a !== account) : [...prev, account],
                              )
                            }}
                          >
                            {account}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">{t("dateRange")}</h4>
                      <div className="flex flex-col gap-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !dateRange.from && "text-muted-foreground",
                                  )}
                                >
                                  <Calendar className="mr-2 h-4 w-4" />
                                  {dateRange.from ? (
                                    format(dateRange.from, "PPP", { locale: language === "es" ? es : undefined })
                                  ) : (
                                    <span>{t("from")}</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <CalendarComponent
                                  mode="single"
                                  selected={dateRange.from}
                                  onSelect={(date) => setDateRange((prev) => ({ ...prev, from: date }))}
                                  initialFocus
                                  locale={language === "es" ? es : undefined}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          <div>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !dateRange.to && "text-muted-foreground",
                                  )}
                                >
                                  <Calendar className="mr-2 h-4 w-4" />
                                  {dateRange.to ? (
                                    format(dateRange.to, "PPP", { locale: language === "es" ? es : undefined })
                                  ) : (
                                    <span>{t("to")}</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <CalendarComponent
                                  mode="single"
                                  selected={dateRange.to}
                                  onSelect={(date) => setDateRange((prev) => ({ ...prev, to: date }))}
                                  initialFocus
                                  locale={language === "es" ? es : undefined}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={resetFilters}>
                      {t("resetFilters")}
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Tabla de transacciones */}
          <div className="rounded-md border overflow-hidden" ref={tableRef}>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">
                      <Button
                        variant="ghost"
                        onClick={() => requestSort("date")}
                        className="flex items-center gap-1 p-0 h-auto font-medium"
                      >
                        {t("date")}
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => requestSort("description")}
                        className="flex items-center gap-1 p-0 h-auto font-medium"
                      >
                        {t("description")}
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      <Button
                        variant="ghost"
                        onClick={() => requestSort("category")}
                        className="flex items-center gap-1 p-0 h-auto font-medium"
                      >
                        {t("category")}
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      <Button
                        variant="ghost"
                        onClick={() => requestSort("account")}
                        className="flex items-center gap-1 p-0 h-auto font-medium"
                      >
                        {t("account")}
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">
                      <Button
                        variant="ghost"
                        onClick={() => requestSort("amount")}
                        className="flex items-center gap-1 p-0 h-auto font-medium ml-auto"
                      >
                        {t("amount")}
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">{t("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                        {t("noTransactionsFound")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="whitespace-nowrap">{transaction.date}</TableCell>
                        <TableCell className="font-medium max-w-[150px] truncate">{transaction.description}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline">{transaction.category}</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{transaction.account}</TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            {transaction.type === "income" ? (
                              <ArrowUpRight className="h-4 w-4 text-green-500" />
                            ) : (
                              <ArrowDownRight className="h-4 w-4 text-red-500" />
                            )}
                            <span
                              className={`font-medium ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}
                            >
                              {transaction.amount.toLocaleString("es-ES", {
                                style: "currency",
                                currency: "ARS",
                              })}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">{t("openMenu")}</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Pencil className="mr-2 h-4 w-4" />
                                {t("edit")}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                {t("delete")}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {t("showing")} {(page - 1) * itemsPerPage + 1}-
                {Math.min(page * itemsPerPage, filteredTransactions.length)} {t("of")} {filteredTransactions.length}
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(Number.parseInt(value))
                    setPage(1)
                  }}
                >
                  <SelectTrigger className="w-[70px]">
                    <SelectValue placeholder={itemsPerPage} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((page) => Math.max(1, page - 1))}
                  disabled={page === 1}
                >
                  {t("previous")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((page) => Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                >
                  {t("next")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

