
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { mockCashoutRequests, mockUsers } from '@/lib/mock-data';
import type { CashoutRequest, CashoutRequestStatus } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, CheckCircle, XCircle, Landmark, Truck, Edit3 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";

export default function ManageCashoutsPage() {
  const [cashoutRequests, setCashoutRequests] = useState<CashoutRequest[]>(mockCashoutRequests);
  const { toast } = useToast();
  const [filterStatus, setFilterStatus] = useState<CashoutRequestStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingRequest, setEditingRequest] = useState<CashoutRequest | null>(null);
  const [transactionRef, setTransactionRef] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    // Enrich requests with agent names (if not already present, though mock data has it)
    setCashoutRequests(prev => prev.map(req => {
      if (!req.agentName) {
        const agent = mockUsers.find(u => u.id === req.agentId);
        return { ...req, agentName: agent?.name || 'Unknown Agent' };
      }
      return req;
    }).sort((a,b) => parseISO(b.requestedDate).getTime() - parseISO(a.requestedDate).getTime()));
  }, []);

  const handleUpdateStatus = (requestId: string, newStatus: CashoutRequestStatus, notes?: string, txRef?: string) => {
    setCashoutRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        const updatedReq: CashoutRequest = { 
            ...req, 
            status: newStatus, 
            processedDate: new Date().toISOString(),
            adminNotes: notes || req.adminNotes, // Keep existing notes if new ones not provided
        };
        if (newStatus === 'paid' && txRef) {
            updatedReq.transactionReference = txRef;
        }
        // If request is rejected, ideally refund the commission to agent's balance
        if (newStatus === 'rejected' && req.status !== 'rejected') {
           const agent = mockUsers.find(u => u.id === req.agentId);
           if (agent) {
             agent.commissionBalance = (agent.commissionBalance || 0) + req.amount;
             toast({ title: 'Commission Refunded', description: `₵${req.amount.toFixed(2)} refunded to ${agent.name}'s balance.`});
           }
        }
        return updatedReq;
      }
      return req;
    }));
    toast({ title: 'Cashout Status Updated', description: `Request ID ${requestId} status set to ${newStatus}.` });
    setEditingRequest(null);
    setTransactionRef('');
    setAdminNotes('');
  };

  const openEditModal = (request: CashoutRequest) => {
    setEditingRequest(request);
    setTransactionRef(request.transactionReference || '');
    setAdminNotes(request.adminNotes || '');
  };

  const filteredRequests = useMemo(() => {
    return cashoutRequests
      .filter(req => filterStatus === 'all' || req.status === filterStatus)
      .filter(req => 
        req.agentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [cashoutRequests, filterStatus, searchTerm]);

  const getStatusBadgeVariant = (status: CashoutRequest['status']) => {
    switch (status) {
      case 'paid':
      case 'approved': return 'default';
      case 'pending': return 'secondary';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  const cashoutStatuses: CashoutRequestStatus[] = ['pending', 'approved', 'paid', 'rejected'];

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-8">
        <Landmark className="h-8 w-8 mr-3 text-primary" />
        <h1 className="text-3xl font-bold font-headline">Manage Agent Cashouts</h1>
      </div>

      <Card className="shadow-xl mb-8">
        <CardHeader>
          <CardTitle>Filter Cashout Requests</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input 
            placeholder="Search by Agent Name or Request ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
          <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as CashoutRequestStatus | 'all')}>
            <SelectTrigger className="max-w-xs">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {cashoutStatuses.map(status => (
                <SelectItem key={status} value={status} className="capitalize">{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      
      {filteredRequests.length > 0 ? (
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Cashout Queue</CardTitle>
            <CardDescription>Review and process pending agent cashout requests.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] w-full">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Agent Name</TableHead>
                    <TableHead>Amount (₵)</TableHead>
                    <TableHead>Requested Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell className="font-medium truncate max-w-[100px]" title={req.id}>{req.id}</TableCell>
                      <TableCell>{req.agentName || 'N/A'}</TableCell>
                      <TableCell>₵{req.amount.toFixed(2)}</TableCell>
                      <TableCell>{format(parseISO(req.requestedDate), 'MMM d, yyyy p')}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(req.status)} className="capitalize">
                          {req.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => openEditModal(req)}>
                                <Edit3 className="mr-2 h-4 w-4" /> Manage Request
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {req.status === 'pending' && (
                              <DropdownMenuItem onClick={() => handleUpdateStatus(req.id, 'approved')}>
                                <CheckCircle className="mr-2 h-4 w-4" /> Approve
                              </DropdownMenuItem>
                            )}
                            {(req.status === 'pending' || req.status === 'approved') && (
                              <DropdownMenuItem onClick={() => openEditModal(req)}>
                                <Truck className="mr-2 h-4 w-4" /> Mark as Paid
                              </DropdownMenuItem>
                            )}
                            {req.status !== 'rejected' && (
                              <DropdownMenuItem onClick={() => handleUpdateStatus(req.id, 'rejected')} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                                <XCircle className="mr-2 h-4 w-4" /> Reject
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
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
                <Landmark className="mx-auto h-16 w-16 text-muted-foreground" />
                <CardTitle className="mt-4">No Cashout Requests</CardTitle>
           </CardHeader>
           <CardContent>
                <CardDescription>
                    There are no cashout requests matching your current filters.
                </CardDescription>
           </CardContent>
        </Card>
      )}

      {editingRequest && (
        <Dialog open={!!editingRequest} onOpenChange={(isOpen) => { if (!isOpen) setEditingRequest(null); }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Manage Cashout Request: {editingRequest.id}</DialogTitle>
              <DialogDescription>
                Agent: {editingRequest.agentName} | Amount: ₵{editingRequest.amount.toFixed(2)}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="status-dialog">Status</Label>
                <Select 
                  value={editingRequest.status} 
                  onValueChange={(newStatus) => setEditingRequest(prev => prev ? {...prev, status: newStatus as CashoutRequestStatus} : null)}
                >
                  <SelectTrigger id="status-dialog">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {cashoutStatuses.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              {editingRequest.status === 'paid' && (
                <div>
                  <Label htmlFor="transactionRef">Transaction Reference</Label>
                  <Input 
                    id="transactionRef" 
                    value={transactionRef} 
                    onChange={(e) => setTransactionRef(e.target.value)}
                    placeholder="MoMo Transaction ID"
                  />
                </div>
              )}
              <div>
                <Label htmlFor="adminNotes">Admin Notes</Label>
                <Textarea 
                  id="adminNotes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Optional notes for this transaction..."
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={() => handleUpdateStatus(editingRequest.id, editingRequest.status, adminNotes, transactionRef)}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
