
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { mockCashoutRequests, mockUsers } from '@/lib/mock-data'; // Assuming mockUsers can be updated
import type { CashoutRequest } from '@/lib/types';
import { Loader2, Wallet, Send, Landmark, History, AlertCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function AgentCommissionPage() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agentCashouts, setAgentCashouts] = useState<CashoutRequest[]>([]);

  useEffect(() => {
    if (user) {
      setAgentCashouts(mockCashoutRequests.filter(req => req.agentId === user.id).sort((a,b) => parseISO(b.requestedDate).getTime() - parseISO(a.requestedDate).getTime()));
    }
  }, [user]);

  const currentCommissionBalance = useMemo(() => {
    if (!user || user.commissionBalance === undefined) return 0;
    // Find the user in mockUsers to get the most up-to-date balance
    const currentUserData = mockUsers.find(u => u.id === user.id);
    return currentUserData?.commissionBalance || user.commissionBalance || 0;
  }, [user]);

  const handleRequestCashout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const cashoutAmount = parseFloat(amount);
    if (isNaN(cashoutAmount) || cashoutAmount <= 0) {
      toast({ title: 'Invalid Amount', description: 'Please enter a valid positive amount.', variant: 'destructive' });
      return;
    }
    if (cashoutAmount > (currentCommissionBalance || 0)) {
      toast({ title: 'Insufficient Balance', description: 'Cashout amount cannot exceed your commission balance.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 700)); // Simulate API call

    const newCashoutRequest: CashoutRequest = {
      id: `cashout${Date.now()}`,
      agentId: user.id,
      agentName: user.name,
      amount: cashoutAmount,
      requestedDate: new Date().toISOString(),
      status: 'pending',
    };
    mockCashoutRequests.unshift(newCashoutRequest);
    setAgentCashouts(prev => [newCashoutRequest, ...prev].sort((a,b) => parseISO(b.requestedDate).getTime() - parseISO(a.requestedDate).getTime()));
    
    // Update user's balance in mockUsers and in auth context
    const updatedBalance = (currentCommissionBalance || 0) - cashoutAmount;
    updateUser({ ...user, commissionBalance: updatedBalance }); // Update auth context
    
    // Update mockUsers directly for demo persistence across soft refreshes
    const userIndex = mockUsers.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      mockUsers[userIndex].commissionBalance = updatedBalance;
    }

    toast({ title: 'Cashout Requested', description: `Your request for ₵${cashoutAmount.toFixed(2)} has been submitted.` });
    setAmount('');
    setIsLoading(false);
  };

  const getStatusBadgeVariant = (status: CashoutRequest['status']) => {
    switch (status) {
      case 'paid':
      case 'approved':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-8">
        <Wallet className="h-8 w-8 mr-3 text-primary" />
        <h1 className="text-3xl font-bold font-headline">My Commissions</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="md:col-span-1 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center"><Landmark className="mr-2 h-6 w-6 text-green-500" /> Commission Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-green-600">₵{currentCommissionBalance.toFixed(2)}</p>
            <CardDescription className="mt-1">Your available earnings for cashout.</CardDescription>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center"><Send className="mr-2 h-6 w-6 text-blue-500" /> Request Cashout</CardTitle>
            <CardDescription>Withdraw your earned commissions. Payments are made via your registered MoMo number.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRequestCashout} className="space-y-4">
              <div>
                <Label htmlFor="amount">Amount to Cashout (₵)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g., 50.00"
                  min="1" // Assuming a minimum cashout amount
                  step="0.01"
                  disabled={isLoading || currentCommissionBalance === 0}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading || currentCommissionBalance === 0 || parseFloat(amount) <=0}>
                {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2 h-4 w-4" />}
                Request Cashout
              </Button>
              {currentCommissionBalance === 0 && (
                 <p className="text-sm text-destructive flex items-center mt-2"><AlertCircle className="h-4 w-4 mr-1"/>No balance to cashout.</p>
              )}
            </form>
          </CardContent>
           <CardFooter>
             <p className="text-xs text-muted-foreground">Cashouts are processed by admin. Ensure your MoMo details are up-to-date in settings.</p>
           </CardFooter>
        </Card>
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center"><History className="mr-2 h-6 w-6" />Cashout History</CardTitle>
          <CardDescription>Track your past cashout requests.</CardDescription>
        </CardHeader>
        <CardContent>
          {agentCashouts.length > 0 ? (
            <ScrollArea className="max-h-[50vh] w-full"> {/* Adjusted height for mobile */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Amount (₵)</TableHead>
                    <TableHead>Requested Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Processed Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agentCashouts.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell className="font-medium truncate max-w-[100px]" title={req.id}>{req.id}</TableCell>
                      <TableCell>₵{req.amount.toFixed(2)}</TableCell>
                      <TableCell>{format(parseISO(req.requestedDate), 'MMM d, yyyy p')}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(req.status)} className="capitalize">
                          {req.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {req.processedDate ? format(parseISO(req.processedDate), 'MMM d, yyyy p') : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          ) : (
            <div className="text-center py-8">
              <History className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">You have not made any cashout requests yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
