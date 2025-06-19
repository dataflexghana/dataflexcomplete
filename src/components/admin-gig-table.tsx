
"use client";

import type { Gig } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import Image from 'next/image';

interface AdminGigTableProps {
  gigs: Gig[];
  onEdit: (gig: Gig) => void;
  onToggleStatus: (gigId: string) => void;
  onDelete: (gig: Gig) => void;
}

export function AdminGigTable({ gigs, onEdit, onToggleStatus, onDelete }: AdminGigTableProps) {
  return (
    <Card className="shadow-xl">
      <CardHeader>
          <CardTitle>Available Gigs</CardTitle>
          <CardDescription>List of all gigs configured in the system.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] w-full">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price (₵)</TableHead>
                <TableHead>Commission (₵)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gigs.map((gig) => (
                <TableRow key={gig.id}>
                  <TableCell>
                    <Image 
                      src={gig.imageUrl || `https://placehold.co/100x75.png?text=${encodeURIComponent(gig.name.substring(0,3))}`} 
                      alt={gig.name} 
                      width={60} 
                      height={45} 
                      className="rounded-md object-cover"
                      data-ai-hint="service digital product"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{gig.name}</TableCell>
                  <TableCell>{gig.category || 'N/A'}</TableCell>
                  <TableCell>{gig.price.toFixed(2)}</TableCell>
                  <TableCell>{gig.commission.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={gig.isActive ? 'default' : 'secondary'}>
                      {gig.isActive ? 'Active' : 'Inactive'}
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
                        <DropdownMenuItem onClick={() => onEdit(gig)}>
                            <Edit2 className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onToggleStatus(gig.id)}>
                            {gig.isActive ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                            {gig.isActive ? 'Set Inactive' : 'Set Active'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(gig)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
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
  );
}

// Added Card, CardHeader, CardTitle, CardDescription to ensure they are imported
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
