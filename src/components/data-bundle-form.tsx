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
import type { DataBundle } from '@/lib/types';
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Loader2 } from 'lucide-react';

const bundleSchema = z.object({
  name: z.string().min(3, { message: 'Bundle name must be at least 3 characters' }),
  dataAmount: z.string().min(1, { message: 'Data amount is required (e.g., 1GB, 500MB)' }),
  price: z.coerce.number().min(0, { message: 'Price must be a positive number' }),
  validityPeriodDays: z.coerce.number().int().min(1, { message: 'Validity must be at least 1 day' }),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

type BundleFormInputs = z.infer<typeof bundleSchema>;

interface DataBundleFormProps {
  bundle?: DataBundle | null; // For editing
  onSubmitForm: (data: BundleFormInputs, bundleId?: string) => Promise<void>;
  isLoading: boolean;
}

export function DataBundleForm({ bundle, onSubmitForm, isLoading }: DataBundleFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch
  } = useForm<BundleFormInputs>({
    resolver: zodResolver(bundleSchema),
    defaultValues: {
      name: bundle?.name || '',
      dataAmount: bundle?.dataAmount || '',
      price: bundle?.price || 0,
      validityPeriodDays: bundle?.validityPeriodDays || 1,
      description: bundle?.description || '',
      isActive: bundle?.isActive === undefined ? true : bundle.isActive,
    },
  });

  const isActiveValue = watch('isActive');

  const processSubmit: SubmitHandler<BundleFormInputs> = async (data) => {
    await onSubmitForm(data, bundle?.id);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{bundle ? 'Edit Data Bundle' : 'Add New Data Bundle'}</DialogTitle>
        <DialogDescription>
          {bundle ? 'Update the details of this data bundle.' : 'Enter the details for the new data bundle.'}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit(processSubmit)} className="space-y-4 py-4">
        <div>
          <Label htmlFor="name">Bundle Name</Label>
          <Input id="name" {...register('name')} aria-invalid={errors.name ? 'true' : 'false'} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <Label htmlFor="dataAmount">Data Amount (e.g., 1GB, 500MB)</Label>
                <Input id="dataAmount" {...register('dataAmount')} aria-invalid={errors.dataAmount ? 'true' : 'false'} />
                {errors.dataAmount && <p className="text-sm text-destructive">{errors.dataAmount.message}</p>}
            </div>
            <div>
                <Label htmlFor="price">Price (₵)</Label>
                <Input id="price" type="number" step="0.01" {...register('price')} aria-invalid={errors.price ? 'true' : 'false'} />
                {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
            </div>
        </div>
        <div>
          <Label htmlFor="validityPeriodDays">Validity (Days)</Label>
          <Input id="validityPeriodDays" type="number" {...register('validityPeriodDays')} aria-invalid={errors.validityPeriodDays ? 'true' : 'false'} />
          {errors.validityPeriodDays && <p className="text-sm text-destructive">{errors.validityPeriodDays.message}</p>}
        </div>
        <div>
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea id="description" {...register('description')} />
        </div>
        <div className="flex items-center space-x-2">
          <Switch 
            id="isActive" 
            checked={isActiveValue}
            onCheckedChange={(checked) => setValue('isActive', checked)}
          />
          <Label htmlFor="isActive">Active (available for agents to order)</Label>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isLoading}>Cancel</Button>
          </DialogClose>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
            {bundle ? 'Save Changes' : 'Add Bundle'}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
