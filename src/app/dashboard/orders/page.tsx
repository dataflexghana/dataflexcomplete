"use client";

import { OrderTable } from '@/components/order-table';
import { mockOrders } from '@/lib/mock-data';
import { useAuth } from '@/components/auth-provider';
import { Loader2 } from 'lucide-react';

export default function OrdersPage() {
  const { user, loading } = useAuth();

  if (loading || !user) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const agentOrders = mockOrders.filter(order => order.agentId === user.id);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 font-headline">My Order History</h1>
      <OrderTable orders={agentOrders} />
    </div>
  );
}
