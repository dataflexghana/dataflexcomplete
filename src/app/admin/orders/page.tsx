"use client";

import React, { useState, useMemo } from 'react';
import { AdminOrderTable } from '@/components/admin-order-table';
import { mockOrders, mockUsers } from '@/lib/mock-data';
import type { Order, OrderStatus } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';

export default function ManageOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(() => 
    mockOrders.map(order => {
      const agent = mockUsers.find(u => u.id === order.agentId);
      return { ...order, agentName: agent?.name || 'Unknown Agent' };
    })
  );
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');


  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    toast({ title: 'Order Status Updated', description: `Order ID ${orderId} status changed to ${newStatus}.` });
  };

  const filteredOrders = useMemo(() => {
    return orders
      .filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.agentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.bundleName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(order => statusFilter === 'all' || order.status === statusFilter);
  }, [orders, searchTerm, statusFilter]);

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-8">
        <ShoppingCart className="h-8 w-8 mr-3 text-primary" />
        <h1 className="text-3xl font-bold font-headline">Manage Orders</h1>
      </div>

      <Card className="shadow-xl mb-8">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Refine the list of orders.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input 
            placeholder="Search by Order ID, Agent, or Bundle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as OrderStatus | 'all')}>
            <SelectTrigger className="max-w-xs">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending_payment">Pending Payment</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      
      {filteredOrders.length > 0 ? (
         <AdminOrderTable orders={filteredOrders} onUpdateStatus={handleUpdateStatus} />
      ) : (
        <Card className="shadow-lg text-center py-12">
           <CardHeader>
                <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground" />
                <CardTitle className="mt-4">No Orders Found</CardTitle>
           </CardHeader>
           <CardContent>
                <CardDescription>
                    There are no orders matching your current filter criteria.
                </CardDescription>
           </CardContent>
        </Card>
      )}
    </div>
  );
}
