"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useTheme } from "next-themes"
import { useLanguage } from "@/contexts/language-context"
import { toast } from "@/components/ui/use-toast"
import { useEffect } from "react"

const formSchema = z.object({
  theme: z.enum(["light", "dark", "system"], {
    required_error: "Por favor, selecciona un tema.",
  }),
})

export function AppearanceSettings() {
  const { t } = useLanguage()
  const { theme, setTheme } = useTheme()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      theme: (theme as "light" | "dark" | "system") || "system",
    },
  })

  // Actualizar el formulario cuando cambie el tema
  useEffect(() => {
    if (theme) {
      form.setValue("theme", theme as "light" | "dark" | "system")
    }
  }, [theme, form])

  function onSubmit(values: z.infer<typeof formSchema>) {
    setTheme(values.theme)
    console.log(values)
    toast({
      title: t("appearanceUpdated"),
      description: t("yourAppearanceSettingsHaveBeenUpdated"),
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{t("appearanceSettings")}</h3>
        <p className="text-sm text-muted-foreground">{t("appearanceSettingsDescription")}</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="theme"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>{t("theme")}</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="light" />
                      </FormControl>
                      <FormLabel className="font-normal">{t("light")}</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="dark" />
                      </FormControl>
                      <FormLabel className="font-normal">{t("dark")}</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="system" />
                      </FormControl>
                      <FormLabel className="font-normal">{t("system")}</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormDescription>{t("themeDescription")}</FormDescription>
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

