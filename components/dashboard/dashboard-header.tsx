"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DashboardHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Bienvenido a tu panel financiero personal</p>
      </div>
      <Button variant="outline" className="gap-2">
        <Download className="h-4 w-4" />
        Exportar
      </Button>
    </div>
  )
}

