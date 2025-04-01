import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const budgets = [
  {
    id: 1,
    category: "Alimentación",
    current: 450,
    max: 600,
    percentage: 75,
  },
  {
    id: 2,
    category: "Transporte",
    current: 180,
    max: 200,
    percentage: 90,
  },
  {
    id: 3,
    category: "Ocio",
    current: 120,
    max: 150,
    percentage: 80,
  },
  {
    id: 4,
    category: "Servicios",
    current: 210,
    max: 250,
    percentage: 84,
  },
  {
    id: 5,
    category: "Salud",
    current: 50,
    max: 200,
    percentage: 25,
  },
]

export function BudgetOverview() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Presupuestos</CardTitle>
        <CardDescription>Seguimiento de tus presupuestos mensuales</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {budgets.map((budget) => (
            <div key={budget.id} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{budget.category}</span>
                <span className="text-sm text-muted-foreground">
                  {budget.current.toLocaleString("es-ES", {
                    style: "currency",
                    currency: "ARS",
                  })}{" "}
                  /{" "}
                  {budget.max.toLocaleString("es-ES", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </span>
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
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

