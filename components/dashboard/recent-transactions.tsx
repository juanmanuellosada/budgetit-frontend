import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Coffee, Home, Car, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

const transactions = [
  {
    id: 1,
    description: "Supermercado",
    amount: -125.5,
    date: "2025-03-07",
    category: "Alimentación",
    icon: ShoppingBag,
  },
  {
    id: 2,
    description: "Café",
    amount: -4.75,
    date: "2025-03-06",
    category: "Restaurantes",
    icon: Coffee,
  },
  {
    id: 3,
    description: "Alquiler",
    amount: -850.0,
    date: "2025-03-05",
    category: "Vivienda",
    icon: Home,
  },
  {
    id: 4,
    description: "Gasolina",
    amount: -45.0,
    date: "2025-03-04",
    category: "Transporte",
    icon: Car,
  },
  {
    id: 5,
    description: "Salario",
    amount: 2500.0,
    date: "2025-03-01",
    category: "Ingresos",
    icon: Plus,
  },
]

export function RecentTransactions() {
  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Transacciones Recientes</CardTitle>
          <CardDescription>Últimas 5 transacciones registradas</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          Ver todas
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descripción</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead className="text-right">Monto</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="flex items-center gap-2">
                  <div className="rounded-full p-1 bg-muted">
                    <transaction.icon className="h-4 w-4" />
                  </div>
                  <span>{transaction.description}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{transaction.category}</Badge>
                </TableCell>
                <TableCell
                  className={`text-right font-medium ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {transaction.amount.toLocaleString("es-ES", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

