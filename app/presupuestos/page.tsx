"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { BudgetForm } from "@/components/budgets/budget-form"
import { BudgetsList } from "@/components/budgets/budgets-list"
import { useLanguage } from "@/contexts/language-context"

export default function BudgetsPage() {
  const { t } = useLanguage()
  const [showBudgetForm, setShowBudgetForm] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("budgets")}</h1>
          <p className="text-muted-foreground">{t("manageYourBudgets")}</p>
        </div>
        <Button className="gap-2" onClick={() => setShowBudgetForm(true)}>
          <Plus className="h-4 w-4" />
          {t("newBudget")}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {showBudgetForm && (
          <div className="md:col-span-1">
            <BudgetForm onSuccess={() => setShowBudgetForm(false)} />
          </div>
        )}
        <div className={showBudgetForm ? "md:col-span-2" : "md:col-span-3"}>
          <BudgetsList />
        </div>
      </div>
    </div>
  )
}

