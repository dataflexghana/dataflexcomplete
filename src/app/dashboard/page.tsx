
"use client";

import { StatCard } from '@/components/stat-card';
import { useAuth } from '@/components/auth-provider';
import { mockOrders, mockDataBundles } from '@/lib/mock-data';
import { DollarSign, ShoppingCart, Package, Clock, CheckCircle, AlertTriangle, Wallet, UserCircle as UserIcon } from 'lucide-react'; // Renamed UserCircle to UserIcon
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { format, differenceInDays, parseISO } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Added Alert imports

export default function AgentDashboardPage() {
  const { user } = useAuth();

  if (!user) return null; // Or a loading state

  const agentOrders = mockOrders.filter(order => order.agentId === user.id);
  const totalSpent = agentOrders.reduce((sum, order) => sum + (order.status === 'completed' ? order.pricePaid : 0), 0);
  const pendingOrders = agentOrders.filter(order => order.status === 'processing' || order.status === 'pending_payment').length;
  
  const subscriptionDaysRemaining = user.subscriptionExpiryDate
    ? differenceInDays(parseISO(user.subscriptionExpiryDate), new Date())
    : 0;
  const totalSubscriptionDays = 30; // Assuming a 30-day subscription
  const subscriptionProgress = user.subscriptionStatus === 'active' && user.subscriptionExpiryDate
    ? Math.max(0, Math.min(100, (subscriptionDaysRemaining / totalSubscriptionDays) * 100))
    : 0;

  const getSubscriptionBadgeVariant = () => {
    switch (user.subscriptionStatus) {
      case 'active': return 'default';
      case 'expired': return 'destructive';
      case 'pending_payment': return 'secondary';
      default: return 'outline';
    }
  };


  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 font-headline">Welcome, {user.name}!</h1>

      {(!user.phoneNumber) && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle className="font-semibold">Important: Update Your Profile</AlertTitle>
          <AlertDescription>
            Your phone number is missing. Please <Link href="/dashboard/profile" className="font-semibold underline hover:text-destructive/80">update your profile</Link> to ensure you can receive commission payouts via MoMo and important account notifications.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 mb-8">
        <StatCard
          title="Total Spent"
          value={`₵${totalSpent.toFixed(2)}`}
          icon={DollarSign}
          description="On completed orders"
          iconClassName="text-green-500"
        />
        <StatCard
          title="Total Orders"
          value={agentOrders.length}
          icon={ShoppingCart}
          description={`${pendingOrders} pending`}
          iconClassName="text-blue-500"
        />
        <StatCard
          title="Available Bundles"
          value={mockDataBundles.filter(b => b.isActive).length}
          icon={Package}
          description="Ready to order"
          iconClassName="text-purple-500"
        />
        <StatCard
          title="Commission Balance"
          value={`₵${(user.commissionBalance || 0).toFixed(2)}`}
          icon={Wallet}
          description="Available for cashout"
          iconClassName="text-yellow-500"
          className="hover:bg-yellow-50/50"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 mb-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Subscription Status</span>
              <Badge variant={getSubscriptionBadgeVariant()} className="capitalize">
                {user.subscriptionStatus?.replace('_', ' ') || 'N/A'}
              </Badge>
            </CardTitle>
            {user.subscriptionStatus === 'active' && user.subscriptionExpiryDate && (
              <CardDescription>
                Expires on: {format(parseISO(user.subscriptionExpiryDate), 'PPP')} ({subscriptionDaysRemaining > 0 ? `${subscriptionDaysRemaining} days remaining` : 'Expired Today'})
              </CardDescription>
            )}
             {user.subscriptionStatus === 'pending_payment' && (
              <CardDescription>
                Your subscription payment is pending. Please complete it to activate. Manual MoMo to 024XXXXXXX (Amount: ₵35).
              </CardDescription>
            )}
             {user.subscriptionStatus === 'expired' && (
              <CardDescription>
                Your subscription has expired. Please renew to continue accessing services.
              </CardDescription>
            )}
             {user.subscriptionStatus === 'none' && (
              <CardDescription>
                You do not have an active subscription.
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {user.subscriptionStatus === 'active' && (
              <>
                <Progress value={subscriptionProgress} aria-label={`${subscriptionProgress}% subscription remaining`} className="mb-2" />
                <p className="text-sm text-muted-foreground">{subscriptionDaysRemaining > 0 ? `${subscriptionDaysRemaining} days left` : 'Expires today'}</p>
              </>
            )}
            { (user.subscriptionStatus === 'expired' || user.subscriptionStatus === 'pending_payment' || user.subscriptionStatus === 'none') && (
                <Button asChild className="w-full mt-2">
                    <Link href="/dashboard/subscription">Manage Subscription</Link>
                </Button>
            )}
          </CardContent>
        </Card>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with common tasks.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button asChild variant="default" size="lg" disabled={user.subscriptionStatus !== 'active'}>
              <Link href="/dashboard/bundles" className="flex flex-col h-auto py-3">
                <Package className="mb-2 h-8 w-8" />
                Order New Bundle
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/dashboard/orders" className="flex flex-col h-auto py-3">
                <ShoppingCart className="mb-2 h-8 w-8" />
                View Order History
              </Link>
            </Button>
             <Button asChild variant="outline" size="lg" className="sm:col-span-2">
              <Link href="/dashboard/commission" className="flex flex-col h-auto py-3">
                <Wallet className="mb-2 h-8 w-8" />
                My Commissions & Cashouts
              </Link>
            </Button>
             <Button asChild variant="outline" size="lg" className="sm:col-span-2">
              <Link href="/dashboard/profile" className="flex flex-col h-auto py-3">
                <UserIcon className="mb-2 h-8 w-8" />
                My Profile
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {user.subscriptionStatus !== 'active' && (
        <Card className="bg-yellow-50 border-yellow-300 text-yellow-700 shadow-lg mb-8">
          <CardHeader className="flex flex-row items-start space-x-3">
            <AlertTriangle className="h-6 w-6 mt-1 text-yellow-600" />
            <div>
              <CardTitle className="text-yellow-800">Subscription Notice</CardTitle>
              <CardDescription className="text-yellow-700">
                {user.subscriptionStatus === 'pending_payment' && "Your subscription payment is pending. Please complete payment to access data bundle ordering."}
                {user.subscriptionStatus === 'expired' && "Your subscription has expired. Renew now to continue ordering data bundles."}
                {user.subscriptionStatus === 'none' && "You need an active subscription to order data bundles."}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
             <Button asChild variant="default" className="bg-yellow-500 hover:bg-yellow-600 text-white">
                <Link href="/dashboard/subscription">Manage Subscription</Link>
             </Button>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>A quick look at your latest activity.</CardDescription>
        </CardHeader>
        <CardContent>
          {agentOrders.length > 0 ? (
            <ul className="space-y-4">
              {agentOrders.slice(0, 3).map(order => (
                <li key={order.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                  <div>
                    <p className="font-semibold">{order.bundleName}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(parseISO(order.orderDate), 'PPP p')} - ₵{order.pricePaid.toFixed(2)}
                    </p>
                  </div>
                  <Badge variant={order.status === 'completed' ? 'default' : order.status === 'pending_payment' || order.status === 'processing' ? 'secondary' : 'destructive'} className="capitalize">
                    {order.status === 'completed' && <CheckCircle className="mr-1 h-3 w-3" />}
                    {(order.status === 'processing' || order.status === 'pending_payment') && <Clock className="mr-1 h-3 w-3" />}
                    {order.status.replace('_', ' ')}
                  </Badge>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No recent orders found.</p>
          )}
          {agentOrders.length > 3 && (
            <Button variant="link" asChild className="mt-4">
              <Link href="/dashboard/orders">View All Orders</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
