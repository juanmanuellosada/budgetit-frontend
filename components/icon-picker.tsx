"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search } from "lucide-react"
import * as LucideIcons from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

// Excluir algunos iconos que no son relevantes para categorías o cuentas
const excludedIcons = ["ChevronDown", "ChevronUp", "X", "Plus", "Search"]

// Obtener todos los iconos de Lucide
const iconList = Object.entries(LucideIcons)
  .filter(
    ([name]) =>
      !excludedIcons.includes(name) &&
      typeof LucideIcons[name as keyof typeof LucideIcons] === "function" &&
      name !== "createLucideIcon" &&
      !name.startsWith("Lucide"),
  )
  .map(([name, Icon]) => ({
    name,
    Icon: Icon as React.FC<React.SVGProps<SVGSVGElement>>,
  }))

interface IconPickerProps {
  value: string
  onChange: (value: string) => void
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Encontrar el icono seleccionado
  const selectedIcon = iconList.find((icon) => icon.name === value)
  const SelectedIconComponent = selectedIcon ? selectedIcon.Icon : LucideIcons.CircleDashed

  // Filtrar iconos basados en el término de búsqueda
  const filteredIcons = iconList.filter((icon) => icon.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-between"
        type="button"
      >
        <div className="flex items-center gap-2">
          <SelectedIconComponent className="h-4 w-4" />
          <span>{value || t("selectIcon")}</span>
        </div>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("selectIcon")}</DialogTitle>
          </DialogHeader>

          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("searchIcons")}
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <ScrollArea className="h-[300px]">
            <div className="grid grid-cols-4 gap-2">
              {filteredIcons.map(({ name, Icon }) => (
                <Button
                  key={name}
                  variant="outline"
                  className={`h-12 p-0 flex flex-col items-center justify-center gap-1 ${
                    value === name ? "border-primary bg-primary/10" : ""
                  }`}
                  onClick={() => {
                    onChange(name)
                    setOpen(false)
                  }}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs truncate w-full text-center px-1">{name}</span>
                </Button>
              ))}

              {filteredIcons.length === 0 && (
                <div className="col-span-4 py-4 text-center text-muted-foreground">{t("noIconsFound")}</div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}

