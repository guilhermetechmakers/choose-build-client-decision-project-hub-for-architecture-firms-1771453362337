import { Receipt } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function Orders() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Order / Transaction History</h1>
        <p className="text-muted-foreground">Financial audit and receipts for firm admins and accountants.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardContent className="pt-0">
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12">
              <Receipt className="h-10 w-10 text-muted-foreground" />
              <p className="mt-2 font-medium">No transactions yet</p>
              <p className="text-sm text-muted-foreground">Invoices and receipts will appear here.</p>
            </div>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  )
}
