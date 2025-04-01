"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { toast } from "@/components/ui/use-toast"
import { IconPicker } from "@/components/icon-picker"

const formSchema = z.object({
  category: z.string({
    required_error: "La categoría es requerida",
  }),
  icon: z.string().optional(),
  amount: z
    .string()
    .min(1, { message: "El monto es requerido" })
    .refine((val) => !isNaN(Number.parseFloat(val)), { message: "Debe ser un número válido" })
    .refine((val) => Number.parseFloat(val) > 0, { message: "El monto debe ser mayor que cero" }),
  period: z.enum(["monthly", "yearly"]),
  currency: z.string().default("ARS"),
})

interface BudgetFormProps {
  onSuccess?: () => void
}

export function BudgetForm({ onSuccess }: BudgetFormProps) {
  const { t } = useLanguage()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      period: "monthly",
      currency: "ARS",
      icon: "CircleDollarSign",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    // Aquí iría la lógica para enviar los datos al backend
    toast({
      title: t("budgetCreated"),
      description: `${t("budget")} ${values.category} ${t("hasBeenCreatedSuccessfully")}`,
    })
    form.reset()
    if (onSuccess) {
      onSuccess()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("newBudget")}</CardTitle>
        <CardDescription>{t("createNewBudgetDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("category")}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectCategory")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="food">{t("food")}</SelectItem>
                      <SelectItem value="transport">{t("transport")}</SelectItem>
                      <SelectItem value="housing">{t("housing")}</SelectItem>
                      <SelectItem value="entertainment">{t("entertainment")}</SelectItem>
                      <SelectItem value="health">{t("health")}</SelectItem>
                      <SelectItem value="services">{t("services")}</SelectItem>
                      <SelectItem value="other">{t("other")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("icon")}</FormLabel>
                  <FormControl>
                    <IconPicker value={field.value || ""} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("limitAmount")}</FormLabel>
                  <FormControl>
                    <Input placeholder="0.00" type="number" step="0.01" min="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="period"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("period")}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectPeriod")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="monthly">{t("monthly")}</SelectItem>
                      <SelectItem value="yearly">{t("yearly")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("currency")}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectCurrency")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ARS">ARS - Peso argentino</SelectItem>
                      <SelectItem value="USD">USD - Dólar</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col sm:flex-row justify-end gap-2">
              {onSuccess && (
                <Button type="button" variant="outline" onClick={onSuccess} className="w-full sm:w-auto">
                  {t("cancel")}
                </Button>
              )}
              <Button type="submit" className="w-full sm:w-auto">
                {t("saveBudget")}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

