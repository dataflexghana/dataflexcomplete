
"use client";

import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type { Gig } from '@/lib/types';
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Loader2 } from 'lucide-react';

const gigSchema = z.object({
  name: z.string().min(3, { message: 'Gig name must be at least 3 characters' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  price: z.coerce.number().min(0, { message: 'Price must be a positive number' }),
  commission: z.coerce.number().min(0, { message: 'Commission must be a positive number (fixed amount)' }),
  category: z.string().optional(),
  imageUrl: z.string().url({ message: "Please enter a valid URL for the image (or leave blank for placeholder)" }).optional().or(z.literal('')),
  termsAndConditions: z.string().optional(),
  isActive: z.boolean().default(true),
});

type GigFormInputs = z.infer<typeof gigSchema>;

interface GigFormProps {
  gig?: Gig | null; 
  onSubmitForm: (data: GigFormInputs, gigId?: string) => Promise<void>;
  isLoading: boolean;
}

export function GigForm({ gig, onSubmitForm, isLoading }: GigFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<GigFormInputs>({
    resolver: zodResolver(gigSchema),
    defaultValues: {
      name: gig?.name || '',
      description: gig?.description || '',
      price: gig?.price || 0,
      commission: gig?.commission || 0,
      category: gig?.category || '',
      imageUrl: gig?.imageUrl || '',
      termsAndConditions: gig?.termsAndConditions || '',
      isActive: gig?.isActive === undefined ? true : gig.isActive,
    },
  });

  const isActiveValue = watch('isActive');

  const processSubmit: SubmitHandler<GigFormInputs> = async (data) => {
    await onSubmitForm(data, gig?.id);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{gig ? 'Edit Gig' : 'Add New Gig'}</DialogTitle>
        <DialogDescription>
          {gig ? 'Update the details of this gig.' : 'Enter the details for the new gig.'}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit(processSubmit)} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
        <div>
          <Label htmlFor="name">Gig Name</Label>
          <Input id="name" {...register('name')} aria-invalid={errors.name ? 'true' : 'false'} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" {...register('description')} rows={3} aria-invalid={errors.description ? 'true' : 'false'} />
          {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <Label htmlFor="price">Price (₵)</Label>
                <Input id="price" type="number" step="0.01" {...register('price')} aria-invalid={errors.price ? 'true' : 'false'} />
                {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
            </div>
            <div>
                <Label htmlFor="commission">Agent Commission (₵)</Label>
                <Input id="commission" type="number" step="0.01" {...register('commission')} aria-invalid={errors.commission ? 'true' : 'false'} />
                {errors.commission && <p className="text-sm text-destructive">{errors.commission.message}</p>}
                <p className="text-xs text-muted-foreground mt-1">Fixed amount agent earns.</p>
            </div>
        </div>
        <div>
          <Label htmlFor="category">Category (Optional)</Label>
          <Input id="category" {...register('category')} placeholder="e.g., Design, Writing, Marketing" />
        </div>
        <div>
          <Label htmlFor="imageUrl">Image URL (Optional)</Label>
          <Input id="imageUrl" {...register('imageUrl')} placeholder="https://example.com/image.png" aria-invalid={errors.imageUrl ? 'true' : 'false'} />
          {errors.imageUrl && <p className="text-sm text-destructive">{errors.imageUrl.message}</p>}
          <p className="text-xs text-muted-foreground mt-1">If blank, a placeholder will be used.</p>
        </div>
        <div>
          <Label htmlFor="termsAndConditions">Terms & Conditions (Optional)</Label>
          <Textarea 
            id="termsAndConditions" 
            {...register('termsAndConditions')} 
            rows={4}
            placeholder="Enter specific terms for this gig, e.g., revision limits, delivery times, scope of work." 
          />
        </div>
        <div className="flex items-center space-x-2 pt-2">
          <Switch 
            id="isActive" 
            checked={isActiveValue}
            onCheckedChange={(checked) => setValue('isActive', checked)}
          />
          <Label htmlFor="isActive">Active (available for agents to order)</Label>
        </div>
        
        <DialogFooter className="pt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isLoading}>Cancel</Button>
          </DialogClose>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
            {gig ? 'Save Changes' : 'Add Gig'}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}

    