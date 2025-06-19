
"use client";

import React, { useState } from 'react';
import { mockGigs, mockGigOrders, mockUsers } from '@/lib/mock-data';
import type { Gig, GigOrder } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth-provider';
import { AlertCircle, Info, Briefcase, FileText, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { GigCard } from '@/components/gig-card'; 
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle as UICardTitle } from '@/components/ui/card'; // Renamed CardTitle to avoid conflict

export default function AgentGigsPage() {
  const { toast } = useToast();
  const { user } = useAuth(); // Removed updateUser as it's not used here
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [clientName, setClientName] = useState('');
  const [clientContact, setClientContact] = useState('');
  const [requirements, setRequirements] = useState('');
  const [agentNotes, setAgentNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenOrderModal = (gig: Gig) => {
    if (user?.subscriptionStatus !== 'active') {
      toast({
        title: "Subscription Required",
        description: "You need an active subscription to order gigs.",
        variant: "destructive",
      });
      return;
    }
    setSelectedGig(gig);
    setIsOrderModalOpen(true);
    setClientName('');
    setClientContact('');
    setRequirements('');
    setAgentNotes('');
  };

  const handlePlaceGigOrder = async () => {
    if (!user || !selectedGig) {
      toast({ title: 'Error', description: 'User or Gig not selected.', variant: 'destructive' });
      return;
    }
    if (!clientName.trim() || !clientContact.trim()) {
      toast({ title: 'Client Info Missing', description: 'Client name and contact are required.', variant: 'destructive' });
      return;
    }
    if (!requirements.trim()) {
      toast({ title: 'Requirements Missing', description: 'Please provide requirements for the gig.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 700)); 

    const newGigOrder: GigOrder = {
      id: `gigOrder${mockGigOrders.length + 1}`,
      agentId: user.id,
      agentName: user.name,
      gigId: selectedGig.id,
      gigName: selectedGig.name,
      orderDate: new Date().toISOString(),
      status: 'pending_payment', 
      pricePaid: selectedGig.price,
      clientName,
      clientContact,
      requirements,
      agentNotes,
    };
    mockGigOrders.unshift(newGigOrder); 
    
    toast({
      title: 'Gig Order Placed (Mock)',
      description: `${selectedGig.name} for ₵${selectedGig.price.toFixed(2)} has been submitted. Order ID: ${newGigOrder.id}. Please follow payment instructions.`,
    });
    setIsLoading(false);
    setIsOrderModalOpen(false);
    setSelectedGig(null);
  };
  
  const activeGigs = mockGigs.filter(gig => gig.isActive);

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-2">
        <Briefcase className="h-8 w-8 mr-3 text-primary" />
        <h1 className="text-3xl font-bold font-headline">Order Digital Gigs</h1>
      </div>
      <p className="text-muted-foreground mb-8">Offer valuable digital services to your clients and earn commissions.</p>

      {user?.subscriptionStatus !== 'active' && (
         <Alert variant="default" className="mb-6 bg-primary/10 border-primary/30 text-primary">
          <Info className="h-5 w-5 text-primary" />
          <AlertTitle className="font-semibold">Active Subscription Required</AlertTitle>
          <AlertDescription>
            You need an active subscription to order Gigs. Please activate or renew your subscription.
          </AlertDescription>
        </Alert>
      )}

      {activeGigs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeGigs.map(gig => (
            <GigCard key={gig.id} gig={gig} onOrder={() => handleOpenOrderModal(gig)} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-xl font-semibold">No Gigs Available</h3>
            <p className="mt-1 text-muted-foreground">There are currently no active Gigs. Please check back later.</p>
        </div>
      )}

      {selectedGig && (
        <Dialog open={isOrderModalOpen} onOpenChange={setIsOrderModalOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Order Gig: {selectedGig.name}</DialogTitle>
              <DialogDescription>
                Price: ₵{selectedGig.price.toFixed(2)} | Est. Commission: ₵{selectedGig.commission.toFixed(2)}
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh] overflow-y-auto pr-4">
              <div className="space-y-4 py-4">
                {selectedGig.termsAndConditions && (
                  <Card className="bg-muted/50">
                    <CardHeader className="p-3">
                      <UICardTitle className="text-sm font-semibold flex items-center">
                        <FileText className="w-4 h-4 mr-2 text-primary" /> Gig Terms & Conditions
                      </UICardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <ScrollArea className="h-24 w-full">
                        <p className="text-xs whitespace-pre-wrap">{selectedGig.termsAndConditions}</p>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                )}
                <div>
                  <Label htmlFor="clientName">Client's Full Name *</Label>
                  <Input id="clientName" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Enter client's name" />
                </div>
                <div>
                  <Label htmlFor="clientContact">Client's Contact (Phone/Email) *</Label>
                  <Input id="clientContact" value={clientContact} onChange={(e) => setClientContact(e.target.value)} placeholder="Enter client's phone or email" />
                </div>
                <div>
                  <Label htmlFor="requirements">Project Requirements / Brief *</Label>
                  <Textarea 
                    id="requirements" 
                    value={requirements} 
                    onChange={(e) => setRequirements(e.target.value)} 
                    placeholder="Describe what needs to be done, provide links, or any specific instructions."
                    rows={4} 
                  />
                </div>
                <div>
                  <Label htmlFor="agentNotes">Your Notes (Optional)</Label>
                  <Textarea 
                    id="agentNotes" 
                    value={agentNotes} 
                    onChange={(e) => setAgentNotes(e.target.value)} 
                    placeholder="Any additional notes for the admin or yourself."
                    rows={2}
                  />
                </div>
                <Alert variant="default" className="bg-blue-50 border-blue-200 text-blue-700">
                    <Info className="h-5 w-5 text-blue-600" />
                    <AlertTitle className="font-semibold">Payment Process</AlertTitle>
                    <AlertDescription className="text-sm">
                      After submitting, you will receive payment instructions (manual MoMo). The gig will be initiated once payment is confirmed by an admin. Use the Order ID as reference.
                    </AlertDescription>
                </Alert>
              </div>
            </ScrollArea>
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="outline" disabled={isLoading}>Cancel</Button>
              </DialogClose>
              <Button onClick={handlePlaceGigOrder} disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin mr-2"/> : null}
                Submit Gig Order
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
