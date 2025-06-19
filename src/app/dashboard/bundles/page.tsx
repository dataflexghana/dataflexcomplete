
"use client";

import { BundleCard } from '@/components/bundle-card';
import { mockDataBundles, mockOrders, mockUsers, mockAgentCommissionSettings } from '@/lib/mock-data';
import type { DataBundle, Order } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth-provider';
import { AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function BundlesPage() {
  const { toast } = useToast();
  const { user, updateUser } = useAuth();

  const handleOrderBundle = (bundle: DataBundle) => {
    if (!user) {
      toast({ title: 'Error', description: 'You must be logged in to order.', variant: 'destructive' });
      return;
    }
    // Simulate order creation
    const newOrder: Order = {
      id: `order${mockOrders.length + 1}`,
      agentId: user.id,
      agentName: user.name,
      bundleId: bundle.id,
      bundleName: bundle.name,
      orderDate: new Date().toISOString(),
      status: 'pending_payment', // Or 'processing' if payment is assumed to be instant for mock
      pricePaid: bundle.price,
    };
    mockOrders.push(newOrder); // In real app, this would be an API call

    // Simulate commission calculation and update using global percentage for bundles
    const commissionEarned = bundle.price * mockAgentCommissionSettings.commissionRate;
    const updatedCommissionBalance = (user.commissionBalance || 0) + commissionEarned;
    
    updateUser({ ...user, commissionBalance: updatedCommissionBalance }); // Update auth context
     // Update mockUsers directly for demo persistence across soft refreshes
    const userIndex = mockUsers.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      mockUsers[userIndex].commissionBalance = updatedCommissionBalance;
    }

    toast({
      title: 'Bundle Order Placed (Mock)',
      description: `${bundle.name} for ₵${bundle.price.toFixed(2)} ordered. Status: ${newOrder.status}. You earned ₵${commissionEarned.toFixed(2)} commission (${(mockAgentCommissionSettings.commissionRate * 100).toFixed(0)}%).`,
    });
  };
  
  const activeBundles = mockDataBundles.filter(bundle => bundle.isActive);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2 font-headline">Available Data Bundles</h1>
      <p className="text-muted-foreground mb-8">Choose a data bundle that suits your needs. All payments are manual via MoMo.</p>

      {user?.subscriptionStatus !== 'active' && (
         <Alert variant="default" className="mb-6 bg-primary/10 border-primary/30 text-primary">
          <Info className="h-5 w-5 text-primary" />
          <AlertTitle className="font-semibold">Subscription Required</AlertTitle>
          <AlertDescription>
            You need an active subscription to order data bundles. Please activate or renew your subscription.
          </AlertDescription>
        </Alert>
      )}

      {activeBundles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeBundles.map(bundle => (
            <BundleCard key={bundle.id} bundle={bundle} onOrder={handleOrderBundle} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-xl font-semibold">No Bundles Available</h3>
            <p className="mt-1 text-muted-foreground">There are currently no active data bundles. Please check back later.</p>
        </div>
      )}
    </div>
  );
}

    