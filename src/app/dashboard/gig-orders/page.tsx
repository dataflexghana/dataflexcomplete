
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@/components/auth-provider';
import { mockGigOrders, mockGigs } from '@/lib/mock-data'; // Added mockGigs
import type { GigOrder, GigOrderStatus, Gig } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Briefcase, Info, ShoppingCart, FileText } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from 'next/link'; 

export default function AgentGigOrdersPage() {
  const { user, loading } = useAuth();
  const [agentGigOrders, setAgentGigOrders] = useState<GigOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<GigOrder | null>(null);
  const [selectedGigDetails, setSelectedGigDetails] = useState<Gig | null>(null);

  useEffect(() => {
    if (user) {
      setAgentGigOrders(
        mockGigOrders
          .filter(order => order.agentId === user.id)
          .sort((a,b) => parseISO(b.orderDate).getTime() - parseISO(a.orderDate).getTime())
      );
    }
  }, [user]);

  useEffect(() => {
    if (selectedOrder) {
      const gigDetail = mockGigs.find(g => g.id === selectedOrder.gigId);
      setSelectedGigDetails(gigDetail || null);
    } else {
      setSelectedGigDetails(null);
    }
  }, [selectedOrder]);

  if (loading || !user) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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


  if (agentGigOrders.length === 0) {
    return (
      <div className="container mx-auto py-8">
         <div className="flex items-center mb-8">
            <ShoppingCart className="h-8 w-8 mr-3 text-primary" />
            <h1 className="text-3xl font-bold font-headline">My Gig Orders</h1>
        </div>
        <Card className="shadow-lg text-center py-12">
            <CardHeader>
                <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
                <CardTitle className="mt-4">No Gig Orders Yet</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription>You haven&apos;t placed any gig orders. Explore available Gigs and start offering more services!</CardDescription>
                <Button asChild className="mt-4">
                    <Link href="/dashboard/gigs">Explore Gigs</Link>
                </Button>
            </CardContent>
        </Card>
      </div>
    );
  }


  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-8">
        <ShoppingCart className="h-8 w-8 mr-3 text-primary" />
        <h1 className="text-3xl font-bold font-headline">My Gig Orders</h1>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Your Gig Order History</CardTitle>
          <CardDescription>Track the status of digital services you&apos;ve ordered for clients.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="max-h-[60vh] w-full"> {/* Adjusted height for mobile */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Gig Name</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Price (₵)</TableHead>
                  <TableHead>Commission (₵)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agentGigOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium truncate max-w-[100px]" title={order.id}>{order.id}</TableCell>
                    <TableCell>{order.gigName}</TableCell>
                    <TableCell>{order.clientName || 'N/A'}</TableCell>
                    <TableCell>{format(parseISO(order.orderDate), 'MMM d, yyyy')}</TableCell>
                    <TableCell>₵{order.pricePaid.toFixed(2)}</TableCell>
                    <TableCell>₵{(order.agentCommissionEarned || 0).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(order.status)} className="capitalize">
                        {order.status.replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={(isOpen) => { if (!isOpen) setSelectedOrder(null); }}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Order Details: {selectedOrder.id.substring(0,15)}...</DialogTitle>
                    <DialogDescription>Gig: {selectedOrder.gigName}</DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[70vh] pr-4">
                  <div className="space-y-3 py-3 text-sm">
                      <p><strong>Client Name:</strong> {selectedOrder.clientName}</p>
                      <p><strong>Client Contact:</strong> {selectedOrder.clientContact}</p>
                      <p><strong>Status:</strong> <Badge variant={getStatusBadgeVariant(selectedOrder.status)} className="capitalize">{selectedOrder.status.replace(/_/g, ' ')}</Badge></p>
                      <p><strong>Price Paid:</strong> ₵{selectedOrder.pricePaid.toFixed(2)}</p>
                      <p><strong>Est. Commission:</strong> ₵{(mockGigs.find(g=>g.id === selectedOrder.gigId)?.commission || 0).toFixed(2)}</p>
                      <p><strong>Earned Commission:</strong> ₵{(selectedOrder.agentCommissionEarned || 0).toFixed(2)}</p>
                      <p><strong>Order Date:</strong> {format(parseISO(selectedOrder.orderDate), 'PPP p')}</p>
                      {selectedOrder.processedDate && <p><strong>Processed Date:</strong> {format(parseISO(selectedOrder.processedDate), 'PPP p')}</p>}
                      {selectedOrder.paymentReference && <p><strong>Payment Ref:</strong> {selectedOrder.paymentReference}</p>}
                      
                      <div className="mt-2 pt-2 border-t">
                          <h4 className="font-semibold mb-1">Requirements Provided:</h4>
                          <p className="text-xs bg-muted p-2 rounded whitespace-pre-wrap">{selectedOrder.requirements || "None"}</p>
                      </div>

                      {selectedOrder.agentNotes && (
                          <div className="mt-2 pt-2 border-t">
                              <h4 className="font-semibold mb-1">Your Notes:</h4>
                              <p className="text-xs bg-blue-50 p-2 rounded whitespace-pre-wrap">{selectedOrder.agentNotes}</p>
                          </div>
                      )}
                      {selectedOrder.adminNotes && (
                          <div className="mt-2 pt-2 border-t">
                              <h4 className="font-semibold mb-1">Admin Notes/Communication:</h4>
                              <p className="text-xs bg-green-50 p-2 rounded whitespace-pre-wrap">{selectedOrder.adminNotes}</p>
                          </div>
                      )}
                      {selectedGigDetails?.termsAndConditions && (
                        <div className="mt-2 pt-2 border-t">
                          <h4 className="font-semibold mb-1 flex items-center"><FileText className="w-4 h-4 mr-1.5"/>Gig Terms & Conditions:</h4>
                          <ScrollArea className="h-20 w-full text-xs bg-muted/70 p-2 rounded whitespace-pre-wrap">
                            {selectedGigDetails.termsAndConditions}
                          </ScrollArea>
                        </div>
                      )}
                      {selectedOrder.status === 'pending_payment' && (
                          <Alert variant="default" className="bg-yellow-50 border-yellow-300 text-yellow-700 mt-3">
                              <Info className="h-5 w-5 text-yellow-600" />
                              <AlertTitle className="font-semibold">Payment Pending</AlertTitle>
                              <AlertDescription className="text-xs">
                                  Please complete the manual MoMo payment for this gig order. Use the Order ID as reference. Admin will update the status once payment is confirmed.
                              </AlertDescription>
                          </Alert>
                      )}
                  </div>
                </ScrollArea>
                <Button onClick={() => setSelectedOrder(null)} variant="outline" className="w-full mt-4">Close</Button>
            </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
