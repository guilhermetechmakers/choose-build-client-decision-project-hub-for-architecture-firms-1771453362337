import { CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

export function Billing() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-muted-foreground">Manage your subscription and payment method.</p>
      </div>

      <Tabs defaultValue="plan" className="w-full">
        <TabsList>
          <TabsTrigger value="plan">Plan</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>
        <TabsContent value="plan" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Current plan</CardTitle>
              <CardDescription>Professional · $49/mo per active project</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline">Change plan</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payment" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment method</CardTitle>
              <CardDescription>Card on file for subscriptions and add-ons.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CreditCard className="h-5 w-5" />
                <span>•••• •••• •••• 4242</span>
              </div>
              <Button variant="outline" className="mt-4">Update payment method</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="invoices" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoice history</CardTitle>
              <CardDescription>Download past invoices.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">No invoices yet.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
