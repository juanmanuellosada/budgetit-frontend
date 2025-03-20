"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, CreditCard, AlertCircle, Wallet } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { CreditCardsList } from "@/components/cards/credit-cards-list"
import { AddCreditCardDialog } from "@/components/cards/add-credit-card-dialog"

export default function CardsPage() {
  const { t } = useLanguage()
  const [isAddCardDialogOpen, setIsAddCardDialogOpen] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("cards")}</h1>
          <p className="text-muted-foreground">{t("manageYourCards")}</p>
        </div>
        <Button className="gap-2" onClick={() => setIsAddCardDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          {t("newCard")}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("totalCreditLimit")}</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€5,000.00</div>
            <p className="text-xs text-muted-foreground">{t("acrossAllCards")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("totalBalance")}</CardTitle>
            <Wallet className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-€2,891.56</div>
            <p className="text-xs text-muted-foreground">{t("currentDebt")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("nextPayment")}</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€450.00</div>
            <p className="text-xs text-muted-foreground">
              {t("dueIn")} 5 {t("days")}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("creditCards")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mt-4">
            <CreditCardsList />
          </div>
        </CardContent>
      </Card>

      <AddCreditCardDialog open={isAddCardDialogOpen} onOpenChange={setIsAddCardDialogOpen} />
    </div>
  )
}

