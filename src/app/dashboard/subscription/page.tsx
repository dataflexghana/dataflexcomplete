"use client";

import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, CreditCard, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { format, differenceInDays, parseISO } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function SubscriptionPage() {
  const { user, loading, updateUser } = useAuth();
  const { toast } = useToast();

  if (loading || !user) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const subscriptionDaysRemaining = user.subscriptionExpiryDate
    ? differenceInDays(parseISO(user.subscriptionExpiryDate), new Date())
    : 0;
  const totalSubscriptionDays = 30; // Assuming a 30-day subscription
  const subscriptionProgress = user.subscriptionStatus === 'active' && user.subscriptionExpiryDate
    ? Math.max(0, Math.min(100, (subscriptionDaysRemaining / totalSubscriptionDays) * 100))
    : 0;

  const handleMockPayment = () => {
    // This is a mock function. In a real app, this would trigger a payment flow
    // and then an admin would confirm. For this demo, we simulate admin approval.
    const newExpiryDate = new Date();
    newExpiryDate.setDate(newExpiryDate.getDate() + 30);
    
    updateUser({ 
        id: user.id, 
        subscriptionStatus: 'active', 
        subscriptionExpiryDate: newExpiryDate.toISOString(),
        // If agent was pending, admin might approve them now.
        // For simplicity, we only update subscription here.
        // isApproved: user.status === 'pending' ? true : user.isApproved,
        // status: user.status === 'pending' ? 'active' : user.status,
    });

    toast({
      title: "Mock Payment Processed",
      description: "Your subscription has been marked as active (mock).",
    });
  };

  const getSubscriptionBadgeVariant = () => {
    switch (user.subscriptionStatus) {
      case 'active': return 'default';
      case 'expired': return 'destructive';
      case 'pending_payment': return 'secondary';
      case 'none': return 'outline';
      default: return 'outline';
    }
  };


  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8 font-headline">My Subscription</h1>
      <Card className="shadow-xl">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl flex items-center">
              <CreditCard className="mr-3 h-7 w-7 text-primary" />
              Subscription Details
            </CardTitle>
            <Badge variant={getSubscriptionBadgeVariant()} className="capitalize text-sm px-3 py-1">
              {user.subscriptionStatus?.replace('_', ' ') || 'N/A'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {user.subscriptionStatus === 'active' && user.subscriptionExpiryDate && (
            <div className="space-y-3 p-4 border rounded-lg bg-green-50 border-green-200">
              <div className="flex items-center text-green-700">
                <CheckCircle2 className="h-6 w-6 mr-2" />
                <p className="text-lg font-semibold">Your subscription is active!</p>
              </div>
              <p className="text-muted-foreground">
                Expires on: <strong>{format(parseISO(user.subscriptionExpiryDate), 'PPP')}</strong>
              </p>
              <Progress value={subscriptionProgress} aria-label={`${subscriptionProgress}% subscription remaining`} className="h-3 [&>div]:bg-green-500" />
              <p className="text-sm text-muted-foreground">
                {subscriptionDaysRemaining > 0 ? `${subscriptionDaysRemaining} days remaining.` : 'Expires today.'} Enjoy discounted data bundles.
              </p>
            </div>
          )}

          {(user.subscriptionStatus === 'expired' || user.subscriptionStatus === 'none') && (
            <div className="space-y-3 p-4 border rounded-lg bg-red-50 border-red-200">
              <div className="flex items-center text-red-700">
                <AlertTriangle className="h-6 w-6 mr-2" />
                <p className="text-lg font-semibold">
                  {user.subscriptionStatus === 'expired' ? 'Subscription Expired' : 'No Active Subscription'}
                </p>
              </div>
              <p className="text-muted-foreground">
                {user.subscriptionStatus === 'expired' ? 'Your subscription has expired.' : 'You do not have an active subscription.'} Please renew to continue accessing discounted data bundles.
              </p>
            </div>
          )}
          
          {user.subscriptionStatus === 'pending_payment' && (
             <div className="space-y-3 p-4 border rounded-lg bg-yellow-50 border-yellow-300">
              <div className="flex items-center text-yellow-700">
                <AlertTriangle className="h-6 w-6 mr-2" />
                <p className="text-lg font-semibold">Payment Pending</p>
              </div>
              <p className="text-muted-foreground">
                Your subscription payment of <strong>₵35.00</strong> is pending. Please complete the manual MoMo payment to the designated number.
                Once payment is confirmed by an admin, your subscription will be activated.
              </p>
            </div>
          )}

          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg">Subscription Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><strong>Cost:</strong> ₵35.00</p>
              <p><strong>Duration:</strong> 30 days</p>
              <p><strong>Payment Method:</strong> Manual Mobile Money (MoMo)</p>
              <p><strong>Instructions:</strong> Send ₵35.00 to MoMo number <strong className="text-primary">0240000000</strong> (Example Number). Use your registered email or phone number as reference. After payment, an admin will verify and activate your subscription.</p>
            </CardContent>
          </Card>

        </CardContent>
        <CardFooter className="border-t pt-6">
          {(user.subscriptionStatus === 'expired' || user.subscriptionStatus === 'pending_payment' || user.subscriptionStatus === 'none') && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="lg" className="w-full">
                  <RefreshCw className="mr-2 h-5 w-5" /> 
                  {user.subscriptionStatus === 'pending_payment' ? 'Payment Made? Notify Admin (Mock)' : 'Pay / Renew Subscription (₵35.00)'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Subscription Payment</AlertDialogTitle>
                  <AlertDialogDescription>
                    This is a mock action. Clicking 'Confirm Payment' will simulate a successful manual MoMo payment and activate your subscription for 30 days. 
                    In a real scenario, an admin would verify your manual payment.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleMockPayment}>Confirm Payment (Mock)</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {user.subscriptionStatus === 'active' && (
            <p className="text-sm text-muted-foreground text-center w-full">
              Your subscription is active. No action needed at this time.
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
