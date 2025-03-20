"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { ArrowDownIcon, ArrowUpIcon, PlusIcon, X } from "lucide-react"
import * as LucideIcons from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useLanguage } from "@/contexts/language-context"
import { IconPicker } from "@/components/icon-picker"

const formSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z
    .string()
    .min(1, { message: "El monto es requerido" })
    .refine((val) => !isNaN(Number.parseFloat(val)), { message: "Debe ser un número válido" })
    .refine((val) => Number.parseFloat(val) > 0, { message: "El monto debe ser mayor que cero" }),
  category: z.string({
    required_error: "La categoría es requerida",
  }),
  categoryIcon: z.string().optional(),
  account: z.string({
    required_error: "La cuenta es requerida",
  }),
  accountIcon: z.string().optional(),
  date: z.date({
    required_error: "La fecha es requerida",
  }),
  description: z.string().optional(),
})

// Categorías predefinidas con iconos
const predefinedCategories = [
  { id: "food", name: "food", icon: "Utensils" },
  { id: "transport", name: "transport", icon: "Car" },
  { id: "housing", name: "housing", icon: "Home" },
  { id: "entertainment", name: "entertainment", icon: "Film" },
  { id: "health", name: "health", icon: "Stethoscope" },
  { id: "salary", name: "salary", icon: "Briefcase" },
  { id: "other", name: "other", icon: "CircleDashed" },
]

// Cuentas predefinidas con iconos
const predefinedAccounts = [
  { id: "checking", name: "checkingAccount", icon: "Landmark" },
  { id: "savings", name: "savingsAccount", icon: "PiggyBank" },
  { id: "visa", name: "Visa Oro", icon: "CreditCard" },
  { id: "mastercard", name: "Mastercard", icon: "CreditCard" },
]

export function QuickTransactionEntry({
  open,
  onOpenChange,
}: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { t, language } = useLanguage()
  const [showNewAccount, setShowNewAccount] = useState(false)
  const [newAccountName, setNewAccountName] = useState("")
  const [newAccountIcon, setNewAccountIcon] = useState("Landmark")
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryIcon, setNewCategoryIcon] = useState("CircleDashed")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "expense",
      amount: "",
      date: new Date(),
      description: "",
      categoryIcon: "",
      accountIcon: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    toast({
      title: t("transactionRegistered"),
      description: `${values.type === "income" ? t("income") : t("expense")} ${values.amount} ${t("registeredSuccessfully")}`,
    })
    form.reset()
    onOpenChange(false)
  }

  function handleAddAccount() {
    if (newAccountName.trim()) {
      toast({
        title: t("accountCreated"),
        description: `${t("account")} "${newAccountName}" ${t("createdSuccessfully")}`,
      })
      setNewAccountName("")
      setNewAccountIcon("Landmark")
      setShowNewAccount(false)
    }
  }

  function handleAddCategory() {
    if (newCategoryName.trim()) {
      toast({
        title: t("categoryCreated"),
        description: `${t("category")} "${newCategoryName}" ${t("createdSuccessfully")}`,
      })
      setNewCategoryName("")
      setNewCategoryIcon("CircleDashed")
      setShowNewCategory(false)
    }
  }

  // Función para renderizar un icono dinámicamente
  const renderIcon = (iconName: string) => {
    const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] || LucideIcons.CircleDashed
    return <IconComponent className="h-4 w-4" />
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("quickEntry")}</DialogTitle>
          <DialogDescription>{t("addTransaction")}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>{t("type")}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectType")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="income">
                          <div className="flex items-center">
                            <ArrowUpIcon className="mr-2 h-4 w-4 text-green-500" />
                            {t("income")}
                          </div>
                        </SelectItem>
                        <SelectItem value="expense">
                          <div className="flex items-center">
                            <ArrowDownIcon className="mr-2 h-4 w-4 text-red-500" />
                            {t("expense")}
                          </div>
                        </SelectItem>
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
                  <FormItem className="flex-1">
                    <FormLabel>{t("amount")}</FormLabel>
                    <FormControl>
                      <Input placeholder="0.00" type="number" step="0.01" min="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex-1">
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
                  <FormItem className="flex-1">
                    <FormLabel>{t("category")}</FormLabel>
                    <div className="flex gap-2">
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value)
                          if (value !== "new") {
                            const category = predefinedCategories.find((c) => c.id === value)
                            if (category) {
                              form.setValue("categoryIcon", category.icon)
                            }
                          }
                        }}
                        defaultValue={field.value}
                        disabled={showNewCategory}
                      >
                        <FormControl>
                          <SelectTrigger className={showNewCategory ? "opacity-50" : ""}>
                            <SelectValue placeholder={t("selectCategory")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {predefinedCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              <div className="flex items-center">
                                {renderIcon(category.icon)}
                                <span className="ml-2">{t(category.name)}</span>
                              </div>
                            </SelectItem>
                          ))}
                          <SelectItem value="new" onClick={() => setShowNewCategory(true)}>
                            <div className="flex items-center text-primary">
                              <PlusIcon className="mr-2 h-4 w-4" />
                              {t("newCategory")}
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {!showNewCategory && (
                        <Button type="button" variant="outline" size="icon" onClick={() => setShowNewCategory(true)}>
                          <PlusIcon className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {showNewCategory && (
              <div className="space-y-2 p-3 border rounded-md bg-muted/30">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">{t("createNewCategory")}</h4>
                  <Button type="button" variant="ghost" size="icon" onClick={() => setShowNewCategory(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <Input
                    placeholder={t("categoryName")}
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <IconPicker value={newCategoryIcon} onChange={setNewCategoryIcon} />
                    </div>
                    <Button type="button" onClick={handleAddCategory} disabled={!newCategoryName.trim()}>
                      {t("add")}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="account"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("account")}</FormLabel>
                  <div className="flex gap-2">
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        if (value !== "new") {
                          const account = predefinedAccounts.find((a) => a.id === value)
                          if (account) {
                            form.setValue("accountIcon", account.icon)
                          }
                        }
                      }}
                      defaultValue={field.value}
                      disabled={showNewAccount}
                    >
                      <FormControl>
                        <SelectTrigger className={showNewAccount ? "opacity-50" : ""}>
                          <SelectValue placeholder={t("selectAccount")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {predefinedAccounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            <div className="flex items-center">
                              {renderIcon(account.icon)}
                              <span className="ml-2">
                                {account.id === "visa" || account.id === "mastercard" ? account.name : t(account.name)}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                        <SelectItem value="new" onClick={() => setShowNewAccount(true)}>
                          <div className="flex items-center text-primary">
                            <PlusIcon className="mr-2 h-4 w-4" />
                            {t("newAccount")}
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {!showNewAccount && (
                      <Button type="button" variant="outline" size="icon" onClick={() => setShowNewAccount(true)}>
                        <PlusIcon className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {showNewAccount && (
              <div className="space-y-2 p-3 border rounded-md bg-muted/30">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">{t("createNewAccount")}</h4>
                  <Button type="button" variant="ghost" size="icon" onClick={() => setShowNewAccount(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <Input
                    placeholder={t("accountName")}
                    value={newAccountName}
                    onChange={(e) => setNewAccountName(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <IconPicker value={newAccountIcon} onChange={setNewAccountIcon} />
                    </div>
                    <Button type="button" onClick={handleAddAccount} disabled={!newAccountName.trim()}>
                      {t("add")}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("description")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("optionalDescription")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4 flex flex-col sm:flex-row gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="sm:flex-1">
                {t("cancel")}
              </Button>
              <Button type="submit" className="sm:flex-1">
                {t("save")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

