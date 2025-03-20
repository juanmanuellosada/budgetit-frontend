import { TransactionsList } from "@/components/transactions/transactions-list"

export default function TransactionsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Transacciones</h1>
        <p className="text-muted-foreground">Gestiona tus ingresos y gastos</p>
      </div>

      <TransactionsList />
    </div>
  )
}

