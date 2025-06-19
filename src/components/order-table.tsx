
"use client";

import type { Order } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';

interface OrderTableProps {
  orders: Order[];
}

export function OrderTable({ orders }: OrderTableProps) {
  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'processing': return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />;
      case 'pending_payment': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4 text-gray-500" />;
      default: return null;
    }
  };

   const getStatusBadgeVariant = (status: Order['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'completed': return 'default'; // Greenish if customized, or primary
      case 'processing': return 'secondary'; // Bluish or yellowish
      case 'pending_payment': return 'secondary'; // Yellowish
      case 'failed':
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };


  if (orders.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>You haven&apos;t placed any orders yet.</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
            <ShoppingCartIcon className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Start by ordering a data bundle!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>My Orders</CardTitle>
        <CardDescription>Here is a list of all your data bundle orders.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-[60vh] w-full"> {/* Adjusted height for mobile */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Bundle Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium truncate max-w-[100px]" title={order.id}>{order.id}</TableCell>
                  <TableCell>{order.bundleName}</TableCell>
                  <TableCell>{format(parseISO(order.orderDate), 'MMM d, yyyy p')}</TableCell>
                  <TableCell>₵{order.pricePaid.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(order.status)} className="capitalize">
                      {getStatusIcon(order.status)}
                      <span className="ml-1.5">{order.status.replace('_', ' ')}</span>
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}


function ShoppingCartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.16" />
    </svg>
  )
}
