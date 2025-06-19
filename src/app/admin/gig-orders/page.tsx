
"use client";

import React, { useState, useMemo } from 'react';
import { mockGigOrders, mockUsers, mockGigs } from '@/lib/mock-data';
import type { GigOrder, GigOrderStatus } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit3, CheckCircle, XCircle, Briefcase, Info } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function ManageGigOrdersPage() {
  const [gigOrders, setGigOrders] = useState<GigOrder[]>(() => 
    mockGigOrders.sort((a,b) => parseISO(b.orderDate).getTime() - parseISO(a.orderDate).getTime())
  );
  const { toast } = useToast();
  const [filterStatus, setFilterStatus] = useState<GigOrderStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingOrder, setEditingOrder] = useState<GigOrder | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [paymentRef, setPaymentRef] = useState('');


  const handleUpdateStatus = (orderId: string, newStatus: GigOrderStatus) => {
    setGigOrders(prevOrders => prevOrders.map(order => {
      if (order.id === orderId) {
        const updatedOrder = { ...order, status: newStatus, adminNotes: editingOrder?.adminNotes || order.adminNotes, paymentReference: paymentRef || order.paymentReference };
        if (newStatus === 'completed' || newStatus === 'cancelled') {
          updatedOrder.processedDate = new Date().toISOString();
        }

        // If order completed, add fixed commission to agent
        if (newStatus === 'completed' && order.status !== 'completed') {
            const gigDetails = mockGigs.find(g => g.id === order.gigId);
            const agent = mockUsers.find(u => u.id === order.agentId);
            if (gigDetails && agent) {
                const commissionAmount = gigDetails.commission; // This is the fixed commission amount
                agent.commissionBalance = (agent.commissionBalance || 0) + commissionAmount;
                updatedOrder.agentCommissionEarned = commissionAmount;
                toast({ title: 'Commission Added', description: `Fixed commission of ₵${commissionAmount.toFixed(2)} added to ${agent.name}'s balance for Gig: ${gigDetails.name}.` });
            }
        }
        return updatedOrder;
      }
      return order;
    }));
    toast({ title: 'Gig Order Status Updated', description: `Order ID ${orderId} status set to ${newStatus}.` });
    setEditingOrder(null); // Close modal after update
  };

  const openEditModal = (order: GigOrder) => {
    setEditingOrder(order);
    setAdminNotes(order.adminNotes || '');
    setPaymentRef(order.paymentReference || '');
  };

  const filteredGigOrders = useMemo(() => {
    return gigOrders
      .filter(order => filterStatus === 'all' || order.status === filterStatus)
      .filter(order => 
        order.agentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.gigName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.clientName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [gigOrders, filterStatus, searchTerm]);

  const getStatusBadgeVariant = (status: GigOrderStatus) => {
    switch (status) {
      case 'completed': return 'default'; 
      case 'in_progress': return 'secondary'; 
      case 'pending_payment':
      case 'pending_requirements': return 'outline'; 
      case 'requires_discussion': return 'secondary'; 
      case 'cancelled': return 'destructive'; 
      default: return 'outline';
    }
  };

  const gigOrderStatuses: GigOrderStatus[] = ['pending_payment', 'pending_requirements', 'in_progress', 'requires_discussion', 'completed', 'cancelled'];

  const handleSaveChangesInModal = () => {
    if (editingOrder) {
        // Pass the current values from the modal state
        const updatedOrderData: Partial<GigOrder> = {
            status: editingOrder.status,
            adminNotes: adminNotes,
            paymentReference: paymentRef,
        };
        // Update the main state with this data
        setEditingOrder(prev => prev ? {...prev, ...updatedOrderData} : null);
        // Call the main update function which uses editingOrder's state
        handleUpdateStatus(editingOrder.id, editingOrder.status);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-8">
        <Briefcase className="h-8 w-8 mr-3 text-primary" />
        <h1 className="text-3xl font-bold font-headline">Manage Gig Orders</h1>
      </div>

      <Card className="shadow-xl mb-8">
        <CardHeader>
          <CardTitle>Filter Gig Orders</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input 
            placeholder="Search by Order ID, Agent, Gig, Client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
          <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as GigOrderStatus | 'all')}>
            <SelectTrigger className="max-w-xs">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {gigOrderStatuses.map(status => (
                <SelectItem key={status} value={status} className="capitalize">{status.replace(/_/g, ' ')}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      
      {filteredGigOrders.length > 0 ? (
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Gig Order Queue</CardTitle>
            <CardDescription>Review and process agent gig orders.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] w-full">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead>Gig Name</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Price (₵)</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGigOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium truncate max-w-[100px]" title={order.id}>{order.id}</TableCell>
                      <TableCell>{order.agentName}</TableCell>
                      <TableCell>{order.gigName}</TableCell>
                      <TableCell>{order.clientName || 'N/A'}</TableCell>
                      <TableCell>₵{order.pricePaid.toFixed(2)}</TableCell>
                      <TableCell>{format(parseISO(order.orderDate), 'MMM d, yyyy')}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(order.status)} className="capitalize">
                          {order.status.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => openEditModal(order)}>
                            <Edit3 className="mr-2 h-4 w-4" /> Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-lg text-center py-12">
           <CardHeader>
                <Briefcase className="mx-auto h-16 w-16 text-muted-foreground" />
                <CardTitle className="mt-4">No Gig Orders Found</CardTitle>
           </CardHeader>
           <CardContent>
                <CardDescription>
                    There are no gig orders matching your current filters.
                </CardDescription>
           </CardContent>
        </Card>
      )}

      {editingOrder && (
        <Dialog open={!!editingOrder} onOpenChange={(isOpen) => { if (!isOpen) setEditingOrder(null); }}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Manage Gig Order: {editingOrder.id.substring(0,15)}...</DialogTitle>
              <DialogDescription>
                Agent: {editingOrder.agentName} | Gig: {editingOrder.gigName} | Price: ₵{editingOrder.pricePaid.toFixed(2)}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Client & Order Details</AlertTitle>
                <AlertDescription className="text-xs space-y-1">
                  <p><strong>Client Name:</strong> {editingOrder.clientName}</p>
                  <p><strong>Client Contact:</strong> {editingOrder.clientContact}</p>
                  <p><strong>Requirements:</strong> {editingOrder.requirements || "Not provided"}</p>
                  {editingOrder.agentNotes && <p><strong>Agent Notes:</strong> {editingOrder.agentNotes}</p>}
                </AlertDescription>
              </Alert>

              <div>
                <Label htmlFor="status-dialog">Update Status</Label>
                <Select 
                  value={editingOrder.status} 
                  onValueChange={(newStatus) => setEditingOrder(prev => prev ? {...prev, status: newStatus as GigOrderStatus} : null)}
                >
                  <SelectTrigger id="status-dialog">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {gigOrderStatuses.map(s => <SelectItem key={s} value={s} className="capitalize">{s.replace(/_/g, ' ')}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
             {(editingOrder.status === 'pending_payment' || editingOrder.status === 'completed' || editingOrder.status === 'in_progress') && (
                <div>
                    <Label htmlFor="paymentRef">Payment Reference (Optional)</Label>
                    <Input 
                        id="paymentRef" 
                        value={paymentRef} 
                        onChange={(e) => setPaymentRef(e.target.value)}
                        placeholder="MoMo Transaction ID / Other Ref"
                    />
                </div>
              )}
              <div>
                <Label htmlFor="adminNotes">Admin Notes / Communication</Label>
                <Textarea 
                  id="adminNotes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes for the agent or internal tracking..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" onClick={() => setEditingOrder(null)}>Cancel</Button>
              </DialogClose>
              <Button onClick={handleSaveChangesInModal}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

    