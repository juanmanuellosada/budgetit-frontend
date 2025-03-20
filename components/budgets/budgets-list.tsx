"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"

const budgets = [
  {
    id: 1,
    category: "Alimentación",
    current: 450,
    max: 600,
    percentage: 75,
    currency: "EUR",
    period: "Mensual",
  },
  {
    id: 2,
    category: "Transporte",
    current: 180,
    max: 200,
    percentage: 90,
    currency: "EUR",
    period: "Mensual",
  },
  {
    id: 3,
    category: "Ocio",
    current: 120,
    max: 150,
    percentage: 80,
    currency: "EUR",
    period: "Mensual",
  },
  {
    id: 4,
    category: "Servicios",
    current: 210,
    max: 250,
    percentage: 84,
    currency: "EUR",
    period: "Mensual",
  },
  {
    id: 5,
    category: "Salud",
    current: 50,
    max: 200,
    percentage: 25,
    currency: "EUR",
    period: "Mensual",
  },
]

export function BudgetsList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Presupuestos Actuales</CardTitle>
        <CardDescription>Seguimiento de tus presupuestos mensuales</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {budgets.map((budget) => (
            <div key={budget.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-medium">{budget.category}</h3>
                  <p className="text-sm text-muted-foreground">{budget.period}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Abrir menú</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {budget.current.toLocaleString("es-ES", {
                      style: "currency",
                      currency: budget.currency,
                    })}{" "}
                    /{" "}
                    {budget.max.toLocaleString("es-ES", {
                      style: "currency",
                      currency: budget.currency,
                    })}
                  </span>
                  <span className="text-sm font-medium">{budget.percentage}%</span>
                </div>
                <Progress
                  value={budget.percentage}
                  className={`h-2 ${
                    budget.percentage > 90
                      ? "bg-muted [&>div]:bg-red-500"
                      : budget.percentage > 75
                        ? "bg-muted [&>div]:bg-amber-500"
                        : "bg-muted [&>div]:bg-green-500"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

