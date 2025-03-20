"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"
import { toast } from "@/components/ui/use-toast"

const formSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z
    .string()
    .min(1, {
      message: "El monto es requerido",
    })
    .refine((val) => !isNaN(Number.parseFloat(val)), {
      message: "Debe ser un número válido",
    })
    .refine((val) => Number.parseFloat(val) > 0, {
      message: "El monto debe ser mayor que cero",
    }),
  date: z.date({
    required_error: "La fecha es requerida",
  }),
  category: z.string({
    required_error: "La categoría es requerida",
  }),
  account: z.string({
    required_error: "La cuenta es requerida",
  }),
  description: z.string().optional(),
})

export function TransactionForm() {
  const { t, language } = useLanguage()
  const [date, setDate] = useState<Date>(new Date())

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "expense",
      amount: "",
      date: new Date(),
      description: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    // Aquí iría la lógica para enviar los datos al backend
    toast({
      title: t("transactionRegistered"),
      description: `${values.type === "income" ? t("income") : t("expense")} ${values.amount} ${t("registeredSuccessfully")}`,
    })
    form.reset()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("newTransaction")}</CardTitle>
        <CardDescription>{t("registerIncomeOrExpense")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("type")}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectType")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="income">{t("income")}</SelectItem>
                      <SelectItem value="expense">{t("expense")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("amount")}</FormLabel>
                  <FormControl>
                    <Input placeholder="0.00" type="number" step="0.01" min="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t("date")}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: language === "es" ? es : undefined })
                          ) : (
                            <span>{t("selectDate")}</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        locale={language === "es" ? es : undefined}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                      <SelectItem value="salary">{t("salary")}</SelectItem>
                      <SelectItem value="other">{t("other")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="account"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("account")}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectAccount")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="checking">{t("checkingAccount")}</SelectItem>
                      <SelectItem value="savings">{t("savingsAccount")}</SelectItem>
                      <SelectItem value="visa">Visa Oro</SelectItem>
                      <SelectItem value="mastercard">Mastercard</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("description")}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t("optionalDescription")} className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              {t("saveTransaction")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

