"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/contexts/language-context"
import { toast } from "@/components/ui/use-toast"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor, introduce un email válido.",
  }),
  language: z.string({
    required_error: "Por favor, selecciona un idioma.",
  }),
  currency: z.string({
    required_error: "Por favor, selecciona una moneda.",
  }),
  dateFormat: z.string({
    required_error: "Por favor, selecciona un formato de fecha.",
  }),
})

export function GeneralSettings() {
  const { t, language: currentLanguage, setLanguage } = useLanguage()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "Usuario",
      email: "usuario@ejemplo.com",
      language: currentLanguage,
      currency: "ARS",
      dateFormat: "DD/MM/YYYY",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Actualizar el idioma si ha cambiado
    if (values.language !== currentLanguage) {
      setLanguage(values.language as any)
    }

    console.log(values)
    toast({
      title: t("settingsSaved"),
      description: t("yourSettingsHaveBeenSaved"),
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{t("generalSettings")}</h3>
        <p className="text-sm text-muted-foreground">{t("generalSettingsDescription")}</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("name")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("enterYourName")} {...field} />
                </FormControl>
                <FormDescription>{t("nameDescription")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("email")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("enterYourEmail")} {...field} />
                </FormControl>
                <FormDescription>{t("emailDescription")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("language")}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectLanguage")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>{t("languageDescription")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("defaultCurrency")}</FormLabel>
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
                  <FormDescription>{t("currencyDescription")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="dateFormat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("dateFormat")}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectDateFormat")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>{t("dateFormatDescription")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">{t("saveChanges")}</Button>
        </form>
      </Form>
    </div>
  )
}

