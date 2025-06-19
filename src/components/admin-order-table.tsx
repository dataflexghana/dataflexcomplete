"use client";

import type { Order, OrderStatus } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, CheckCircle, XCircle, RefreshCcwDot } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, parseISO } from 'date-fns';
import { ScrollArea } from './ui/scroll-area';

interface AdminOrderTableProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

const orderStatuses: OrderStatus[] = ['pending_payment', 'processing', 'completed', 'failed', 'cancelled'];

export function AdminOrderTable({ orders, onUpdateStatus }: AdminOrderTableProps) {

  const getStatusBadgeVariant = (status: Order['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'completed': return 'default';
      case 'processing': return 'secondary';
      case 'pending_payment': return 'secondary';
      case 'failed':
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <ScrollArea className="h-[600px] w-full rounded-md border shadow-md">
      <Table>
        <TableHeader className="sticky top-0 bg-background z-10">
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Agent Name</TableHead>
            <TableHead>Bundle Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Price (₵)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium truncate max-w-[100px]" title={order.id}>{order.id}</TableCell>
              <TableCell>{order.agentName || 'N/A'}</TableCell>
              <TableCell>{order.bundleName}</TableCell>
              <TableCell>{format(parseISO(order.orderDate), 'MMM d, yyyy p')}</TableCell>
              <TableCell>{order.pricePaid.toFixed(2)}</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(order.status)} className="capitalize">
                  {order.status.replace('_', ' ')}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <div className="p-2">
                      <Select
                        value={order.status}
                        onValueChange={(newStatus) => onUpdateStatus(order.id, newStatus as OrderStatus)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Update Status" />
                        </SelectTrigger>
                        <SelectContent>
                          {orderStatuses.map(status => (
                            <SelectItem key={status} value={status} className="capitalize">
                              {status.replace('_', ' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {/* More actions can be added here, e.g., View Details */}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
