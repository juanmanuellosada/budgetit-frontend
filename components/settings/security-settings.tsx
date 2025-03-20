"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useLanguage } from "@/contexts/language-context"
import { toast } from "@/components/ui/use-toast"

const formSchema = z
  .object({
    currentPassword: z.string().min(1, {
      message: "La contraseña actual es requerida.",
    }),
    newPassword: z.string().min(8, {
      message: "La nueva contraseña debe tener al menos 8 caracteres.",
    }),
    confirmPassword: z.string().min(8, {
      message: "La confirmación de contraseña debe tener al menos 8 caracteres.",
    }),
    twoFactorAuth: z.boolean().default(false),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  })

export function SecuritySettings() {
  const { t } = useLanguage()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      twoFactorAuth: false,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    toast({
      title: t("securitySettingsUpdated"),
      description: t("yourSecuritySettingsHaveBeenUpdated"),
    })
    form.reset({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      twoFactorAuth: values.twoFactorAuth,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{t("securitySettings")}</h3>
        <p className="text-sm text-muted-foreground">{t("securitySettingsDescription")}</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("currentPassword")}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("newPassword")}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormDescription>{t("passwordRequirements")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("confirmPassword")}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="twoFactorAuth"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mt-6">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">{t("twoFactorAuthentication")}</FormLabel>
                    <FormDescription>{t("twoFactorAuthenticationDescription")}</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <Button type="submit">{t("updatePassword")}</Button>
        </form>
      </Form>
    </div>
  )
}

