
"use client";

import React, { useState, useMemo } from 'react';
import { mockGigs } from '@/lib/mock-data';
import type { Gig } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PlusCircle, Briefcase, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { GigForm } from '@/components/gig-form';
import { AdminGigTable } from '@/components/admin-gig-table';

export default function ManageGigsPage() {
  const [gigs, setGigs] = useState<Gig[]>(mockGigs);
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGig, setEditingGig] = useState<Gig | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [gigToDelete, setGigToDelete] = useState<Gig | null>(null);

  const handleFormSubmit = async (data: Omit<Gig, 'id' | 'imageUrl'> & { imageUrl?: string }, gigId?: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call

    if (gigId) { // Editing
      setGigs(prev => prev.map(g => g.id === gigId ? { ...g, ...data, imageUrl: data.imageUrl || g.imageUrl } : g));
      toast({ title: 'Gig Updated', description: `${data.name} has been updated.` });
    } else { // Adding
      const newGig: Gig = { 
        ...data, 
        id: `gig${Date.now()}`,
        imageUrl: data.imageUrl || `https://placehold.co/600x400.png?text=${encodeURIComponent(data.name.substring(0,10))}` 
      };
      setGigs(prev => [newGig, ...prev]);
      toast({ title: 'Gig Added', description: `${newGig.name} has been added.` });
    }
    setIsLoading(false);
    setIsFormOpen(false);
    setEditingGig(null);
  };

  const handleEditGig = (gig: Gig) => {
    setEditingGig(gig);
    setIsFormOpen(true);
  };

  const handleDeleteGig = (gigId: string) => {
    setGigs(prev => prev.filter(g => g.id !== gigId));
    toast({ title: 'Gig Deleted', description: 'The gig has been deleted.', variant: 'destructive' });
    setGigToDelete(null);
  };
  
  const toggleGigStatus = (gigId: string) => {
     setGigs(prev => prev.map(g => g.id === gigId ? { ...g, isActive: !g.isActive } : g));
     const gig = gigs.find(g => g.id === gigId);
     toast({ title: 'Gig Status Updated', description: `${gig?.name} is now ${gig?.isActive ? 'inactive' : 'active'}.` });
  };

  const filteredGigs = useMemo(() => {
    return gigs.filter(gig => 
      gig.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gig.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [gigs, searchTerm]);

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center">
            <Briefcase className="h-8 w-8 mr-3 text-primary" />
            <h1 className="text-3xl font-bold font-headline">Manage Gigs</h1>
        </div>
        <Button onClick={() => { setEditingGig(null); setIsFormOpen(true); }}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Gig
        </Button>
      </div>

      <Card className="shadow-xl mb-6">
        <CardHeader>
          <CardTitle>Filter Gigs</CardTitle>
        </CardHeader>
        <CardContent>
           <Input 
            placeholder="Search by gig name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={(isOpen) => { setIsFormOpen(isOpen); if (!isOpen) setEditingGig(null); }}>
        <DialogContent className="sm:max-w-[625px]">
          <GigForm 
            gig={editingGig} 
            onSubmitForm={handleFormSubmit}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>
      
      {filteredGigs.length > 0 ? (
        <AdminGigTable 
          gigs={filteredGigs}
          onEdit={handleEditGig}
          onToggleStatus={toggleGigStatus}
          onDelete={(gig) => setGigToDelete(gig)}
        />
      ) : (
        <Card className="shadow-lg text-center py-12">
           <CardHeader>
                <Briefcase className="mx-auto h-16 w-16 text-muted-foreground" />
                <CardTitle className="mt-4">No Gigs Found</CardTitle>
           </CardHeader>
           <CardContent>
                <CardDescription>
                    There are no gigs matching your current search. Try adding a new gig.
                </CardDescription>
           </CardContent>
        </Card>
      )}

      {gigToDelete && (
        <Dialog open={!!gigToDelete} onOpenChange={(isOpen) => !isOpen && setGigToDelete(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the gig <strong>{gigToDelete.name}</strong>? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" onClick={() => setGigToDelete(null)}>Cancel</Button>
              </DialogClose>
              <Button variant="destructive" onClick={() => handleDeleteGig(gigToDelete.id)}>Delete Gig</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
