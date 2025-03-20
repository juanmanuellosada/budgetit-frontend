"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, ArrowUpRight, ArrowDownRight, Filter } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

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
]

export function OperationsSummary() {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredTransactions = transactions.filter((transaction) => {
    // Filtrar por búsqueda
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.account.toLowerCase().includes(searchTerm.toLowerCase())

    // Filtrar por tipo
    const matchesType =
      activeTab === "all" ||
      (activeTab === "income" && transaction.type === "income") ||
      (activeTab === "expense" && transaction.type === "expense")

    return matchesSearch && matchesType
  })

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">{t("operationsSummary")}</h2>
          <p className="text-sm text-muted-foreground">{t("recentTransactionsOverview")}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("search")}
              className="w-full pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="shrink-0">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab} className="mb-4">
        <TabsList>
          <TabsTrigger value="all">{t("all")}</TabsTrigger>
          <TabsTrigger value="income">{t("income")}</TabsTrigger>
          <TabsTrigger value="expense">{t("expense")}</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">{t("date")}</TableHead>
                <TableHead>{t("description")}</TableHead>
                <TableHead className="hidden md:table-cell">{t("category")}</TableHead>
                <TableHead className="hidden md:table-cell">{t("account")}</TableHead>
                <TableHead className="text-right">{t("amount")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                    {t("noTransactionsFound")}
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((transaction) => (
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
                        <span className={`font-medium ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                          {transaction.amount.toLocaleString("es-ES", {
                            style: "currency",
                            currency: "EUR",
                          })}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <Button variant="outline" asChild>
          <Link href="/transacciones">{t("viewAllTransactions")}</Link>
        </Button>
      </div>
    </div>
  )
}

