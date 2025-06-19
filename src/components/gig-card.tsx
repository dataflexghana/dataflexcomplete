
"use client";

import type { Gig } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, Info, DollarSign, Percent, ShoppingBag, FileText } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from './auth-provider';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface GigCardProps {
  gig: Gig;
  onOrder: (gig: Gig) => void;
}

export function GigCard({ gig, onOrder }: GigCardProps) {
  const { user } = useAuth();
  const isSubscriptionActive = user?.subscriptionStatus === 'active';

  return (
    <Card className="flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden">
      <div>
        <CardHeader className="p-0">
          <div className="relative w-full h-48">
            <Image 
              src={gig.imageUrl || `https://placehold.co/600x400.png?text=${encodeURIComponent(gig.name.substring(0,10))}`} 
              alt={gig.name} 
              layout="fill" 
              objectFit="cover"
              className="rounded-t-lg"
              data-ai-hint="service digital creative"
            />
          </div>
          <div className="p-4">
            <CardTitle className="text-xl font-headline text-primary flex items-center">
              <Briefcase className="w-5 h-5 mr-2 shrink-0" /> {gig.name}
            </CardTitle>
            {gig.category && (
              <span className="text-xs bg-accent/20 text-accent-foreground py-0.5 px-1.5 rounded-full font-medium">{gig.category}</span>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-3">
          <CardDescription className="text-sm text-muted-foreground line-clamp-3 flex items-start">
              <Info className="w-4 h-4 mr-1.5 mt-0.5 shrink-0" /> {gig.description}
          </CardDescription>
          <div className="flex items-center text-md">
            <DollarSign className="w-5 h-5 mr-2 text-green-500" />
            Price: <span className="font-semibold ml-1">₵{gig.price.toFixed(2)}</span>
          </div>
          <div className="flex items-center text-md">
            <Percent className="w-5 h-5 mr-2 text-orange-500" />
            Agent Commission: <span className="font-semibold ml-1">₵{gig.commission.toFixed(2)}</span>
          </div>
           {gig.termsAndConditions && (
            <Accordion type="single" collapsible className="w-full text-sm">
              <AccordionItem value="item-1" className="border-b-0">
                <AccordionTrigger className="py-2 px-0 hover:no-underline text-muted-foreground hover:text-primary">
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 mr-2" /> View Terms & Conditions
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-1 pb-0">
                  <div className="text-xs bg-muted p-3 rounded whitespace-pre-wrap max-h-24 overflow-y-auto">
                    {gig.termsAndConditions}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </CardContent>
      </div>
      <CardFooter className="p-4 bg-muted/50 flex items-center justify-end border-t mt-auto">
        <Button 
          onClick={() => onOrder(gig)}
          aria-label={`Order ${gig.name}`}
          disabled={!isSubscriptionActive}
          className="w-full sm:w-auto"
        >
          <ShoppingBag className="mr-2 h-4 w-4" /> Order This Gig
        </Button>
      </CardFooter>
    </Card>
  );
}
