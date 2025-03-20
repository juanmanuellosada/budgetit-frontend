"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/contexts/language-context"

const bankAccounts = [
  {
    id: 1,
    name: "Cuenta Corriente",
    type: "Corriente",
    balance: 3250.75,
    currency: "EUR",
    lastUpdate: "2025-03-07",
  },
  {
    id: 2,
    name: "Cuenta de Ahorros",
    type: "Ahorros",
    balance: 7411.28,
    currency: "EUR",
    lastUpdate: "2025-03-07",
  },
  {
    id: 3,
    name: "Cuenta USD",
    type: "Corriente",
    balance: 1000.0,
    currency: "USD",
    lastUpdate: "2025-03-06",
  },
]

const creditCards = [
  {
    id: 1,
    name: "Visa Oro",
    bank: "Banco Principal",
    balance: -1891.56,
    limit: 3000.0,
    currency: "EUR",
    dueDate: "2025-03-15",
  },
  {
    id: 2,
    name: "Mastercard",
    bank: "Banco Secundario",
    balance: -1000.0,
    limit: 2000.0,
    currency: "EUR",
    dueDate: "2025-03-20",
  },
]

export function AccountsList() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState("bank")

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("myAccounts")}</CardTitle>
        <CardDescription>{t("manageYourBankAccountsAndCreditCards")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="bank" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="bank">{t("bankAccounts")}</TabsTrigger>
            <TabsTrigger value="credit">{t("creditCards")}</TabsTrigger>
          </TabsList>
          <TabsContent value="bank">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("name")}</TableHead>
                  <TableHead>{t("type")}</TableHead>
                  <TableHead>{t("currency")}</TableHead>
                  <TableHead className="text-right">{t("balance")}</TableHead>
                  <TableHead className="text-right">{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bankAccounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell className="font-medium">{account.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{account.type}</Badge>
                    </TableCell>
                    <TableCell>{account.currency}</TableCell>
                    <TableCell className="text-right">
                      {account.balance.toLocaleString("es-ES", {
                        style: "currency",
                        currency: account.currency,
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
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="credit">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("name")}</TableHead>
                  <TableHead>{t("bank")}</TableHead>
                  <TableHead>{t("dueDate")}</TableHead>
                  <TableHead className="text-right">
                    {t("balance")} / {t("limit")}
                  </TableHead>
                  <TableHead className="text-right">{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {creditCards.map((card) => (
                  <TableRow key={card.id}>
                    <TableCell className="font-medium">{card.name}</TableCell>
                    <TableCell>{card.bank}</TableCell>
                    <TableCell>{card.dueDate}</TableCell>
                    <TableCell className="text-right">
                      {card.balance.toLocaleString("es-ES", {
                        style: "currency",
                        currency: card.currency,
                      })}{" "}
                      /{" "}
                      {card.limit.toLocaleString("es-ES", {
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
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

