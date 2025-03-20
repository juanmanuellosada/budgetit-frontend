"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Search, Pencil, Trash2, CreditCard } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

// Datos de ejemplo
const creditCards = [
  {
    id: 1,
    name: "Visa Oro",
    bank: "Banco Principal",
    balance: -189156,
    limit: 300000,
    currency: "ARS",
    dueDate: "2025-03-15",
    type: "Visa",
    color: "bg-gradient-to-r from-blue-600 to-blue-400",
  },
  {
    id: 2,
    name: "Mastercard",
    bank: "Banco Secundario",
    balance: -1000,
    limit: 2000,
    currency: "USD",
    dueDate: "2025-03-20",
    type: "Mastercard",
    color: "bg-gradient-to-r from-red-600 to-orange-400",
  },
  {
    id: 3,
    name: "American Express",
    bank: "Banco Internacional",
    balance: -45000,
    limit: 500000,
    currency: "ARS",
    dueDate: "2025-03-25",
    type: "Amex",
    color: "bg-gradient-to-r from-green-600 to-green-400",
  },
]

export function CreditCardsList() {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCards = creditCards.filter(
    (card) =>
      card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.bank.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={t("searchCards")}
          className="w-full pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("card")}</TableHead>
                <TableHead>{t("bank")}</TableHead>
                <TableHead>{t("dueDate")}</TableHead>
                <TableHead>{t("usage")}</TableHead>
                <TableHead className="text-right">{t("balance")}</TableHead>
                <TableHead className="text-right">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCards.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                    {t("noCardsFound")}
                  </TableCell>
                </TableRow>
              ) : (
                filteredCards.map((card) => {
                  const usagePercentage = Math.abs((card.balance / card.limit) * 100)

                  return (
                    <TableRow key={card.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-5 rounded ${card.color} flex items-center justify-center`}>
                            <CreditCard className="h-3 w-3 text-white" />
                          </div>
                          <div>
                            <div className="font-medium">{card.name}</div>
                            <div className="text-xs text-muted-foreground">{card.type}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{card.bank}</TableCell>
                      <TableCell>
                        <Badge variant={new Date(card.dueDate) < new Date() ? "destructive" : "outline"}>
                          {card.dueDate}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 w-32">
                          <Progress
                            value={usagePercentage}
                            className={`h-2 ${
                              usagePercentage > 90
                                ? "bg-muted [&>div]:bg-red-500"
                                : usagePercentage > 75
                                  ? "bg-muted [&>div]:bg-amber-500"
                                  : "bg-muted [&>div]:bg-green-500"
                            }`}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{usagePercentage.toFixed(0)}%</span>
                            <span>
                              {Math.abs(card.balance).toLocaleString("es-ES", {
                                style: "currency",
                                currency: card.currency,
                              })}{" "}
                              /{" "}
                              {card.limit.toLocaleString("es-ES", {
                                style: "currency",
                                currency: card.currency,
                              })}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium text-red-600">
                        {card.balance.toLocaleString("es-ES", {
                          style: "currency",
                          currency: card.currency,
                        })}
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
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

