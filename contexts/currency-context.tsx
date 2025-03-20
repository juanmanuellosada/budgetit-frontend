"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type CurrencyInfo = {
  code: string
  name: string
  symbol: string
  exchangeRate: string
  isPrimary: boolean
}

type CurrencyContextType = {
  currencies: CurrencyInfo[]
  primaryCurrency: string
  visibleCurrencies: string[]
  setCurrencies: (currencies: CurrencyInfo[]) => void
  setPrimaryCurrency: (code: string) => void
  setVisibleCurrencies: (codes: string[]) => void
  formatAmount: (amount: number, currencyCode?: string) => string
  convertAmount: (amount: number, fromCurrency: string, toCurrency: string) => number
}

// Datos de ejemplo para monedas
const initialCurrencies: CurrencyInfo[] = [
  { code: "ARS", name: "Peso Argentino", symbol: "$", exchangeRate: "1", isPrimary: true },
  { code: "USD", name: "Dólar Estadounidense", symbol: "US$", exchangeRate: "0.0011", isPrimary: false },
]

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currencies, setCurrenciesState] = useState<CurrencyInfo[]>(initialCurrencies)
  const [primaryCurrency, setPrimaryCurrencyState] = useState<string>("ARS")
  const [visibleCurrencies, setVisibleCurrenciesState] = useState<string[]>(["ARS", "USD"])

  // Cargar monedas desde localStorage al iniciar
  useEffect(() => {
    const savedCurrencies = localStorage.getItem("currencies")
    const savedPrimaryCurrency = localStorage.getItem("primaryCurrency")
    const savedVisibleCurrencies = localStorage.getItem("visibleCurrencies")

    if (savedCurrencies) {
      try {
        setCurrenciesState(JSON.parse(savedCurrencies))
      } catch (e) {
        console.error("Error parsing saved currencies:", e)
      }
    }

    if (savedPrimaryCurrency) {
      setPrimaryCurrencyState(savedPrimaryCurrency)
    }

    if (savedVisibleCurrencies) {
      try {
        setVisibleCurrenciesState(JSON.parse(savedVisibleCurrencies))
      } catch (e) {
        console.error("Error parsing visible currencies:", e)
      }
    }
  }, [])

  // Guardar monedas en localStorage cuando cambian
  useEffect(() => {
    if (currencies.length > 0) {
      localStorage.setItem("currencies", JSON.stringify(currencies))
      localStorage.setItem("primaryCurrency", primaryCurrency)
      localStorage.setItem("visibleCurrencies", JSON.stringify(visibleCurrencies))
    }
  }, [currencies, primaryCurrency, visibleCurrencies])

  const setCurrencies = (newCurrencies: CurrencyInfo[]) => {
    setCurrenciesState(newCurrencies)
  }

  const setPrimaryCurrency = (code: string) => {
    setPrimaryCurrencyState(code)
  }

  const setVisibleCurrencies = (codes: string[]) => {
    setVisibleCurrenciesState(codes)
  }

  // Formatear un monto según la moneda
  const formatAmount = (amount: number, currencyCode?: string) => {
    const code = currencyCode || primaryCurrency
    const currency = currencies.find((c) => c.code === code)

    if (!currency) return amount.toString()

    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: code,
      currencyDisplay: "symbol",
    }).format(amount)
  }

  // Convertir un monto de una moneda a otra
  const convertAmount = (amount: number, fromCurrency: string, toCurrency: string) => {
    if (fromCurrency === toCurrency) return amount

    const fromCurrencyInfo = currencies.find((c) => c.code === fromCurrency)
    const toCurrencyInfo = currencies.find((c) => c.code === toCurrency)

    if (!fromCurrencyInfo || !toCurrencyInfo) return amount

    const fromRate = Number.parseFloat(fromCurrencyInfo.exchangeRate)
    const toRate = Number.parseFloat(toCurrencyInfo.exchangeRate)

    // Convertir a la moneda primaria primero, luego a la moneda destino
    return amount * (fromRate / toRate)
  }

  return (
    <CurrencyContext.Provider
      value={{
        currencies,
        primaryCurrency,
        visibleCurrencies,
        setCurrencies,
        setPrimaryCurrency,
        setVisibleCurrencies,
        formatAmount,
        convertAmount,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}

