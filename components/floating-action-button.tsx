"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"

interface FloatingActionButtonProps {
  onClick: () => void
  className?: string
}

export function FloatingActionButton({ onClick, className }: FloatingActionButtonProps) {
  const { t } = useLanguage()

  return (
    <Button
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 z-50 rounded-full shadow-lg",
        "bg-primary hover:bg-primary/90",
        "flex items-center justify-center",
        "transition-all duration-300 ease-in-out",
        "h-14 w-14 p-0 md:h-12 md:w-auto md:px-4 md:py-2 md:rounded-md",
        className,
      )}
    >
      <Plus className="h-6 w-6 md:h-5 md:w-5 md:mr-2" />
      <span className="hidden md:inline">{t("newTransaction")}</span>
    </Button>
  )
}

