"use client";

import React, { useState, useMemo } from 'react';
import { mockDataBundles } from '@/lib/mock-data';
import type { DataBundle } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, Package, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { DataBundleForm } from '@/components/data-bundle-form';
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ManageDataBundlesPage() {
  const [bundles, setBundles] = useState<DataBundle[]>(mockDataBundles);
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState<DataBundle | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [bundleToDelete, setBundleToDelete] = useState<DataBundle | null>(null);


  const handleFormSubmit = async (data: Omit<DataBundle, 'id'>, bundleId?: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call

    if (bundleId) { // Editing
      setBundles(prev => prev.map(b => b.id === bundleId ? { ...b, ...data } : b));
      toast({ title: 'Bundle Updated', description: `${data.name} has been updated.` });
    } else { // Adding
      const newBundle: DataBundle = { ...data, id: `bundle${Date.now()}` };
      setBundles(prev => [newBundle, ...prev]);
      toast({ title: 'Bundle Added', description: `${newBundle.name} has been added.` });
    }
    setIsLoading(false);
    setIsFormOpen(false);
    setEditingBundle(null);
  };

  const handleEditBundle = (bundle: DataBundle) => {
    setEditingBundle(bundle);
    setIsFormOpen(true);
  };

  const handleDeleteBundle = (bundleId: string) => {
    setBundles(prev => prev.filter(b => b.id !== bundleId));
    toast({ title: 'Bundle Deleted', description: 'The bundle has been deleted.', variant: 'destructive' });
    setBundleToDelete(null);
  };
  
  const toggleBundleStatus = (bundleId: string) => {
     setBundles(prev => prev.map(b => b.id === bundleId ? { ...b, isActive: !b.isActive } : b));
     const bundle = bundles.find(b => b.id === bundleId);
     toast({ title: 'Bundle Status Updated', description: `${bundle?.name} is now ${bundle?.isActive ? 'inactive' : 'active'}.` });
  };

  const filteredBundles = useMemo(() => {
    return bundles.filter(bundle => 
      bundle.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [bundles, searchTerm]);

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center">
            <Package className="h-8 w-8 mr-3 text-primary" />
            <h1 className="text-3xl font-bold font-headline">Manage Data Bundles</h1>
        </div>
        <Button onClick={() => { setEditingBundle(null); setIsFormOpen(true); }}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Bundle
        </Button>
      </div>

      <Card className="shadow-xl mb-6">
        <CardHeader>
          <CardTitle>Filter Bundles</CardTitle>
        </CardHeader>
        <CardContent>
           <Input 
            placeholder="Search by bundle name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={(isOpen) => { setIsFormOpen(isOpen); if (!isOpen) setEditingBundle(null); }}>
        <DialogContent className="sm:max-w-[525px]">
          <DataBundleForm 
            bundle={editingBundle} 
            onSubmitForm={handleFormSubmit}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>
      
      {filteredBundles.length > 0 ? (
        <Card className="shadow-xl">
            <CardHeader>
                <CardTitle>Available Bundles</CardTitle>
                <CardDescription>List of all data bundles configured in the system.</CardDescription>
            </CardHeader>
            <CardContent>
            <ScrollArea className="h-[500px] w-full">
            <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Data Amount</TableHead>
                    <TableHead>Price (₵)</TableHead>
                    <TableHead>Validity (Days)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {filteredBundles.map((bundle) => (
                    <TableRow key={bundle.id}>
                    <TableCell className="font-medium">{bundle.name}</TableCell>
                    <TableCell>{bundle.dataAmount}</TableCell>
                    <TableCell>{bundle.price.toFixed(2)}</TableCell>
                    <TableCell>{bundle.validityPeriodDays}</TableCell>
                    <TableCell>
                        <Badge variant={bundle.isActive ? 'default' : 'secondary'}>
                        {bundle.isActive ? 'Active' : 'Inactive'}
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
                            <DropdownMenuItem onClick={() => handleEditBundle(bundle)}>
                                <Edit2 className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleBundleStatus(bundle.id)}>
                                {bundle.isActive ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                                {bundle.isActive ? 'Set Inactive' : 'Set Active'}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setBundleToDelete(bundle)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
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
                <Package className="mx-auto h-16 w-16 text-muted-foreground" />
                <CardTitle className="mt-4">No Bundles Found</CardTitle>
           </CardHeader>
           <CardContent>
                <CardDescription>
                    There are no data bundles matching your current search. Try adding a new bundle.
                </CardDescription>
           </CardContent>
        </Card>
      )}

      {bundleToDelete && (
        <Dialog open={!!bundleToDelete} onOpenChange={(isOpen) => !isOpen && setBundleToDelete(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the data bundle <strong>{bundleToDelete.name}</strong>? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" onClick={() => setBundleToDelete(null)}>Cancel</Button>
              </DialogClose>
              <Button variant="destructive" onClick={() => handleDeleteBundle(bundleToDelete.id)}>Delete Bundle</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
