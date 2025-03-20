"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"
import { toast } from "@/components/ui/use-toast"

const formSchema = z
  .object({
    dataType: z.enum(["transactions", "accounts", "budgets", "all"], {
      required_error: "Por favor, selecciona un tipo de datos.",
    }),
    format: z.enum(["csv", "pdf", "json"], {
      required_error: "Por favor, selecciona un formato.",
    }),
    dateRange: z.enum(["all", "thisMonth", "lastMonth", "custom"], {
      required_error: "Por favor, selecciona un rango de fechas.",
    }),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
  })
  .refine(
    (data) => {
      if (data.dateRange === "custom") {
        return data.startDate !== undefined && data.endDate !== undefined
      }
      return true
    },
    {
      message: "Las fechas de inicio y fin son requeridas para un rango personalizado.",
      path: ["startDate"],
    },
  )
  .refine(
    (data) => {
      if (data.dateRange === "custom" && data.startDate && data.endDate) {
        return data.startDate <= data.endDate
      }
      return true
    },
    {
      message: "La fecha de inicio debe ser anterior o igual a la fecha de fin.",
      path: ["startDate"],
    },
  )

export function ExportSettings() {
  const { t, language } = useLanguage()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dataType: "transactions",
      format: "csv",
      dateRange: "thisMonth",
    },
  })

  const dateRange = form.watch("dateRange")

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    toast({
      title: t("exportStarted"),
      description: t("yourDataIsBeingExported"),
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{t("exportData")}</h3>
        <p className="text-sm text-muted-foreground">{t("exportDataDescription")}</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="dataType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("dataType")}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectDataType")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="transactions">{t("transactions")}</SelectItem>
                    <SelectItem value="accounts">{t("accounts")}</SelectItem>
                    <SelectItem value="budgets">{t("budgets")}</SelectItem>
                    <SelectItem value="all">{t("allData")}</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>{t("dataTypeDescription")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="format"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>{t("exportFormat")}</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="csv" />
                      </FormControl>
                      <FormLabel className="font-normal">CSV</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="pdf" />
                      </FormControl>
                      <FormLabel className="font-normal">PDF</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="json" />
                      </FormControl>
                      <FormLabel className="font-normal">JSON</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormDescription>{t("exportFormatDescription")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dateRange"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>{t("dateRange")}</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="all" />
                      </FormControl>
                      <FormLabel className="font-normal">{t("allTime")}</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="thisMonth" />
                      </FormControl>
                      <FormLabel className="font-normal">{t("thisMonth")}</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="lastMonth" />
                      </FormControl>
                      <FormLabel className="font-normal">{t("lastMonth")}</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="custom" />
                      </FormControl>
                      <FormLabel className="font-normal">{t("customRange")}</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {dateRange === "custom" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t("startDate")}</FormLabel>
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
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t("endDate")}</FormLabel>
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
            </div>
          )}
          <Button type="submit" className="flex gap-2">
            <Download className="h-4 w-4" />
            {t("exportData")}
          </Button>
        </form>
      </Form>
    </div>
  )
}

