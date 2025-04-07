"use client"

import { CurrencySettings } from "@/components/settings/currency-settings"
import { useLanguage } from "@/contexts/language-context"

/*************  ✨ Codeium Command ⭐  *************/
/**
 * Page component for managing currencies and exchange rates.
 *
 * This page is used by the settings route and displays the
 * CurrencySettings component.
 *
 * @returns The currency page component
 */
/******  64dd2a9c-9fd0-4d0e-8eec-e4137e09362d  *******/
export default function CurrencyPage() {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("currencies")}</h1>
        <p className="text-muted-foreground">{t("manageCurrenciesAndExchangeRates")}</p>
      </div>
      <CurrencySettings />
    </div>
  )
}