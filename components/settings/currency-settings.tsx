"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useLanguage } from "@/contexts/language-context"
import { toast } from "@/components/ui/use-toast"
import { Trash2, Plus, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const formSchema = z.object({
  code: z
    .string()
    .min(3, {
      message: "El código de moneda debe tener al menos 3 caracteres",
    })
    .max(3, {
      message: "El código de moneda debe tener exactamente 3 caracteres",
    }),
  name: z.string().min(2, {
    message: "El nombre de la moneda debe tener al menos 2 caracteres",
  }),
  symbol: z.string().min(1, {
    message: "El símbolo es requerido",
  }),
  exchangeRate: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "El tipo de cambio debe ser un número positivo",
  }),
  isPrimary: z.boolean().default(false),
  isVisible: z.boolean().default(true),
})

// Datos de ejemplo para monedas
const initialCurrencies = [
  { code: "ARS", name: "Peso Argentino", symbol: "$", exchangeRate: "1", isPrimary: true, isVisible: true },
  {
    code: "USD",
    name: "Dólar Estadounidense",
    symbol: "US$",
    exchangeRate: "0.0011",
    isPrimary: false,
    isVisible: true,
  },
]

export function CurrencySettings() {
  const { t } = useLanguage()
  const [currencies, setCurrencies] = useState<typeof initialCurrencies>([])
  const [isAddingCurrency, setIsAddingCurrency] = useState(false)
  const [primaryCurrency, setPrimaryCurrency] = useState("ARS")
  const [visibleCurrencies, setVisibleCurrencies] = useState<string[]>(["ARS", "USD"])

  // Cargar monedas desde localStorage al iniciar
  useEffect(() => {
    const savedCurrencies = localStorage.getItem("currencies")
    const savedPrimaryCurrency = localStorage.getItem("primaryCurrency")
    const savedVisibleCurrencies = localStorage.getItem("visibleCurrencies")

    if (savedCurrencies) {
      try {
        setCurrencies(JSON.parse(savedCurrencies))
      } catch (e) {
        console.error("Error parsing saved currencies:", e)
        setCurrencies(initialCurrencies)
      }
    } else {
      setCurrencies(initialCurrencies)
    }

    if (savedPrimaryCurrency) {
      setPrimaryCurrency(savedPrimaryCurrency)
    }

    if (savedVisibleCurrencies) {
      try {
        setVisibleCurrencies(JSON.parse(savedVisibleCurrencies))
      } catch (e) {
        console.error("Error parsing visible currencies:", e)
        setVisibleCurrencies(["ARS", "USD"])
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      name: "",
      symbol: "",
      exchangeRate: "",
      isPrimary: false,
      isVisible: true,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Si es moneda primaria, actualizar la moneda primaria actual
    if (values.isPrimary) {
      setCurrencies(
        currencies.map((currency) => ({
          ...currency,
          isPrimary: currency.code === values.code,
          // Actualizar tipos de cambio si cambia la moneda primaria
          exchangeRate: currency.code === values.code ? "1" : currency.exchangeRate,
        })),
      )
      setPrimaryCurrency(values.code)
    }

    // Verificar si la moneda ya existe
    const existingCurrencyIndex = currencies.findIndex((currency) => currency.code === values.code)

    if (existingCurrencyIndex >= 0) {
      // Actualizar moneda existente
      const updatedCurrencies = [...currencies]
      updatedCurrencies[existingCurrencyIndex] = {
        ...values,
        exchangeRate: values.isPrimary ? "1" : values.exchangeRate,
      }
      setCurrencies(updatedCurrencies)

      toast({
        title: t("currencyUpdated"),
        description: `${values.name} ${t("hasBeenUpdatedSuccessfully")}`,
      })
    } else {
      // Agregar nueva moneda
      setCurrencies([
        ...currencies,
        {
          ...values,
          exchangeRate: values.isPrimary ? "1" : values.exchangeRate,
        },
      ])

      // Si es visible, agregarla a las monedas visibles (máximo 2)
      if (values.isVisible && visibleCurrencies.length < 2) {
        setVisibleCurrencies([...visibleCurrencies, values.code])
      }

      toast({
        title: t("currencyAdded"),
        description: `${values.name} ${t("hasBeenAddedSuccessfully")}`,
      })
    }

    // Resetear formulario y cerrar panel de agregar
    form.reset()
    setIsAddingCurrency(false)
  }

  function deleteCurrency(code: string) {
    // No permitir eliminar la moneda primaria
    if (code === primaryCurrency) {
      toast({
        title: t("cannotDeletePrimaryCurrency"),
        description: t("pleaseSelectAnotherPrimaryCurrencyFirst"),
        variant: "destructive",
      })
      return
    }

    // Eliminar moneda
    setCurrencies(currencies.filter((currency) => currency.code !== code))

    // Eliminar de monedas visibles si está presente
    if (visibleCurrencies.includes(code)) {
      setVisibleCurrencies(visibleCurrencies.filter((c) => c !== code))
    }

    toast({
      title: t("currencyDeleted"),
      description: t("currencyHasBeenDeletedSuccessfully"),
    })
  }

  function editCurrency(currency: (typeof currencies)[0]) {
    form.reset({
      code: currency.code,
      name: currency.name,
      symbol: currency.symbol,
      exchangeRate: currency.exchangeRate,
      isPrimary: currency.isPrimary,
      isVisible: visibleCurrencies.includes(currency.code),
    })
    setIsAddingCurrency(true)
  }

  function toggleCurrencyVisibility(code: string, isCurrentlyVisible: boolean) {
    // Si ya está visible y queremos ocultarla
    if (isCurrentlyVisible) {
      // No permitir ocultar la moneda primaria
      if (code === primaryCurrency) {
        toast({
          title: t("cannotHidePrimaryCurrency"),
          description: t("primaryCurrencyMustAlwaysBeVisible"),
          variant: "destructive",
        })
        return
      }

      setVisibleCurrencies(visibleCurrencies.filter((c) => c !== code))
    }
    // Si no está visible y queremos mostrarla
    else {
      // Verificar si ya hay 2 monedas visibles
      if (visibleCurrencies.length >= 2) {
        toast({
          title: t("maximumVisibleCurrenciesReached"),
          description: t("youCanOnlyHaveTwoVisibleCurrencies"),
          variant: "destructive",
        })
        return
      }

      setVisibleCurrencies([...visibleCurrencies, code])
    }
  }

  function setPrimaryAndRecalculate(code: string) {
    // Encontrar la moneda que será la nueva primaria
    const newPrimary = currencies.find((currency) => currency.code === code)
    if (!newPrimary) return

    // Obtener el tipo de cambio actual de la nueva moneda primaria
    const newPrimaryRate = Number(newPrimary.exchangeRate)

    // Actualizar todas las monedas
    setCurrencies(
      currencies.map((currency) => {
        if (currency.code === code) {
          // La nueva moneda primaria
          return { ...currency, isPrimary: true, exchangeRate: "1" }
        } else {
          // Recalcular el tipo de cambio para las demás monedas
          // Si la moneda anterior tenía un tipo de cambio de X respecto a la antigua primaria,
          // y la nueva primaria tenía un tipo de cambio de Y respecto a la antigua primaria,
          // entonces el nuevo tipo de cambio de la moneda es X/Y respecto a la nueva primaria
          const oldRate = Number(currency.exchangeRate)
          const newRate = (oldRate / newPrimaryRate).toString()
          return { ...currency, isPrimary: false, exchangeRate: newRate }
        }
      }),
    )

    setPrimaryCurrency(code)

    // Asegurarse de que la moneda primaria esté visible
    if (!visibleCurrencies.includes(code)) {
      // Si ya hay 2 monedas visibles, reemplazar la última
      if (visibleCurrencies.length >= 2) {
        setVisibleCurrencies([visibleCurrencies[0], code])
      } else {
        setVisibleCurrencies([...visibleCurrencies, code])
      }
    }

    toast({
      title: t("primaryCurrencyChanged"),
      description: t("exchangeRatesHaveBeenRecalculated"),
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{t("currencySettings")}</h3>
        <p className="text-sm text-muted-foreground">{t("manageCurrenciesAndExchangeRates")}</p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>
          {t("primaryCurrency")}: {primaryCurrency}
        </AlertTitle>
        <AlertDescription>{t("primaryCurrencyDescription")}</AlertDescription>
      </Alert>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t("availableCurrencies")}</CardTitle>
            <CardDescription>{t("manageYourCurrencies")}</CardDescription>
          </div>
          <Button onClick={() => setIsAddingCurrency(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {t("addCurrency")}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("code")}</TableHead>
                  <TableHead>{t("name")}</TableHead>
                  <TableHead>{t("symbol")}</TableHead>
                  <TableHead>{t("exchangeRate")}</TableHead>
                  <TableHead>{t("primaryCurrency")}</TableHead>
                  <TableHead>{t("visible")}</TableHead>
                  <TableHead className="text-right">{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currencies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                      {t("noCurrenciesFound")}
                    </TableCell>
                  </TableRow>
                ) : (
                  currencies.map((currency) => (
                    <TableRow key={currency.code}>
                      <TableCell className="font-medium">{currency.code}</TableCell>
                      <TableCell>{currency.name}</TableCell>
                      <TableCell>{currency.symbol}</TableCell>
                      <TableCell>
                        {currency.isPrimary ? (
                          "1.0 (Base)"
                        ) : (
                          <span title={`1 ${primaryCurrency} = ${currency.exchangeRate} ${currency.code}`}>
                            {currency.exchangeRate} {currency.code}/{primaryCurrency}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={currency.isPrimary}
                          onCheckedChange={() => setPrimaryAndRecalculate(currency.code)}
                          disabled={currency.isPrimary}
                        />
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={visibleCurrencies.includes(currency.code)}
                          onCheckedChange={() =>
                            toggleCurrencyVisibility(currency.code, visibleCurrencies.includes(currency.code))
                          }
                          disabled={currency.isPrimary} // La moneda primaria siempre debe ser visible
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => editCurrency(currency)}>
                            {t("edit")}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteCurrency(currency.code)}
                            disabled={currency.isPrimary} // No permitir eliminar la moneda primaria
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {isAddingCurrency && (
        <Card>
          <CardHeader>
            <CardTitle>{form.getValues().code ? t("editCurrency") : t("addNewCurrency")}</CardTitle>
            <CardDescription>{t("enterCurrencyDetails")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("currencyCode")}</FormLabel>
                        <FormControl>
                          <Input placeholder="ARS" {...field} disabled={!!form.getValues().code} maxLength={3} />
                        </FormControl>
                        <FormDescription>{t("threeLetterISOCode")}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("currencyName")}</FormLabel>
                        <FormControl>
                          <Input placeholder="Peso Argentino" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="symbol"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("currencySymbol")}</FormLabel>
                        <FormControl>
                          <Input placeholder="$" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="exchangeRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("exchangeRate")}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.0000001"
                            placeholder="1.0"
                            {...field}
                            disabled={form.getValues().isPrimary}
                          />
                        </FormControl>
                        <FormDescription>
                          {t("exchangeRateDescription", { currency: form.getValues().isPrimary ? t("itself") : primaryCurrency })}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="isPrimary"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">{t("primaryCurrency")}</FormLabel>
                          <FormDescription>{t("primaryCurrencyDescription")}</FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked)
                              if (checked) {
                                form.setValue("exchangeRate", "1")
                                form.setValue("isVisible", true)
                              }
                            }}
                            disabled={currencies.some((c) => c.isPrimary && c.code === form.getValues().code)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isVisible"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">{t("visibleCurrency")}</FormLabel>
                          <FormDescription>{t("visibleCurrencyDescription")}</FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={
                              form.getValues().isPrimary ||
                              (visibleCurrencies.length >= 2 && !visibleCurrencies.includes(form.getValues().code))
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      form.reset()
                      setIsAddingCurrency(false)
                    }}
                    className="w-full sm:w-auto"
                  >
                    {t("cancel")}
                  </Button>
                  <Button type="submit" className="w-full sm:w-auto">
                    {form.getValues().code ? t("updateCurrency") : t("addCurrency")}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

