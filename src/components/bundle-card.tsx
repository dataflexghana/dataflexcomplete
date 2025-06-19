"use client";

import type { DataBundle } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tag, CalendarDays, Zap, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './auth-provider';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


interface BundleCardProps {
  bundle: DataBundle;
  onOrder: (bundle: DataBundle) => void;
}

export function BundleCard({ bundle, onOrder }: BundleCardProps) {
  const { toast } = useToast();
  const { user } = useAuth();

  const handleOrderClick = () => {
    if (user?.subscriptionStatus !== 'active') {
      toast({
        title: "Subscription Required",
        description: "You need an active subscription to order data bundles.",
        variant: "destructive",
      });
      return;
    }
    onOrder(bundle);
  };

  return (
    <Card className="flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden">
      <CardHeader className="bg-primary/10 p-4">
        <CardTitle className="text-xl font-headline text-primary flex items-center">
          <Zap className="w-6 h-6 mr-2" /> {bundle.name}
        </CardTitle>
        {bundle.description && (
          <CardDescription className="text-sm text-muted-foreground flex items-start mt-1">
            <Info className="w-4 h-4 mr-1.5 mt-0.5 shrink-0" /> {bundle.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center text-lg">
          <PackageIcon className="w-5 h-5 mr-2 text-accent" />
          Data: <span className="font-semibold ml-1">{bundle.dataAmount}</span>
        </div>
        <div className="flex items-center">
          <CalendarDays className="w-5 h-5 mr-2 text-accent" />
          Validity: <span className="font-semibold ml-1">{bundle.validityPeriodDays} days</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-muted/50 flex items-center justify-between border-t">
        <p className="text-2xl font-bold text-primary">
          ₵{bundle.price.toFixed(2)}
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              onClick={(e) => { 
                if (user?.subscriptionStatus !== 'active') {
                  e.preventDefault(); // Prevent dialog from opening if not active
                  handleOrderClick(); // This will show the toast
                }
              }}
              aria-label={`Order ${bundle.name}`}
              disabled={user?.subscriptionStatus !== 'active'}
            >
              Order Now
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Order</AlertDialogTitle>
              <AlertDialogDescription>
                You are about to order the <strong>{bundle.name}</strong> bundle for <strong>₵{bundle.price.toFixed(2)}</strong>.
                Ensure you have sufficient MoMo balance. This action is mock and will not actually charge you.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleOrderClick}>Proceed to Order</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}

function PackageIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  )
}
