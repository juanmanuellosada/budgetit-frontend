"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Wallet, CreditCard, Landmark } from "lucide-react"
import { AccountsList } from "@/components/accounts/accounts-list"
import { AddAccountDialog } from "@/components/accounts/add-account-dialog"
import { useLanguage } from "@/contexts/language-context"

export default function AccountsPage() {
  const { t } = useLanguage()
  const [isAddAccountDialogOpen, setIsAddAccountDialogOpen] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("accounts")}</h1>
          <p className="text-muted-foreground">{t("manageYourAccounts")}</p>
        </div>
        <Button className="gap-2" onClick={() => setIsAddAccountDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          {t("newAccount")}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("totalBalance")}</CardTitle>
            <Wallet className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€7,770.47</div>
            <p className="text-xs text-muted-foreground">{t("allAccounts")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("bankAccounts")}</CardTitle>
            <Landmark className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€10,662.03</div>
            <p className="text-xs text-muted-foreground">3 {t("activeAccounts")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("creditCards")}</CardTitle>
            <CreditCard className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-€2,891.56</div>
            <p className="text-xs text-muted-foreground">2 {t("activeCards")}</p>
          </CardContent>
        </Card>
      </div>

      <AccountsList />

      <AddAccountDialog open={isAddAccountDialogOpen} onOpenChange={setIsAddAccountDialogOpen} />
    </div>
  )
}

