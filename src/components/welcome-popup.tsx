
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Rocket, Zap, Users, ShoppingCart, BarChart3, Award, AlertTriangle, Check } from 'lucide-react';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';

interface WelcomePopupProps {
  onDismiss: () => void;
}

export function WelcomePopup({ onDismiss }: WelcomePopupProps) {
  return (
    <AlertDialog open={true} onOpenChange={(isOpen) => { if(!isOpen) onDismiss(); }}>
      <AlertDialogContent className="max-w-lg bg-gradient-to-br from-primary to-blue-600 text-white border-blue-500 shadow-2xl rounded-xl p-0">
        <AlertDialogHeader className="text-center items-center pt-6 px-6 pb-4">
          <Rocket className="h-14 w-14 sm:h-16 sm:w-16 mb-3 text-yellow-300 animate-bounce" />
          <AlertDialogTitle className="text-2xl sm:text-3xl font-bold !leading-tight bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-white to-pink-300">
            Become a DataFlex Agent!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-indigo-100 text-md sm:text-lg mt-2 mb-0 px-2">
            Join Ghana's #1 data reseller platform & start earning today!
          </AlertDialogDescription>
        </AlertDialogHeader>

        <ScrollArea className="max-h-[calc(70vh-180px)] sm:max-h-[calc(60vh-180px)] px-6"> {/* Adjusted max-h for potentially less content */}
          <div className="space-y-3 text-sm pb-4">
            <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm border border-white/30 text-center">
              <p className="font-semibold text-yellow-300 text-lg">
                💰 ₵35 Registration
              </p>
              <p className="text-xs text-indigo-200">Valid for 3 Months</p>
            </div>

            <div className="bg-white/15 p-3 rounded-lg backdrop-blur-sm">
              <h4 className="font-semibold text-indigo-100 mb-1.5 flex items-center">
                <Award className="h-5 w-5 mr-2 text-yellow-300" /> Key Agent Benefits:
              </h4>
              <ul className="list-none space-y-1 text-indigo-200 text-xs pl-1">
                <li className="flex items-center"><Check className="h-3 w-3 mr-1.5 text-green-300 shrink-0" /> Top Data Bundle Discounts</li>
                <li className="flex items-center"><Check className="h-3 w-3 mr-1.5 text-green-300 shrink-0" /> Earn Referral Commissions</li>
                <li className="flex items-center"><Check className="h-3 w-3 mr-1.5 text-green-300 shrink-0" /> Your Own Agent Dashboard</li>
                <li className="flex items-center"><Check className="h-3 w-3 mr-1.5 text-green-300 shrink-0" /> Monthly Performance Bonuses</li>
              </ul>
            </div>
            
            <p className="text-center font-semibold text-indigo-100 text-sm">
              💸 Earn up to <span className="text-yellow-300">₵300</span> in extra bonuses!
            </p>

            <div className="bg-yellow-400/20 text-yellow-100 p-3 rounded-lg border border-yellow-400/50">
              <h4 className="font-semibold mb-1 flex items-center text-yellow-200">
                <AlertTriangle className="h-5 w-5 mr-2 text-yellow-300 shrink-0" /> Dynamic Pricing Alert:
              </h4>
              <p className="text-xs">
                Catch price drops on bundles like MTN ₵6 to ₵4. Buy low, sell high & boost profits!
              </p>
            </div>
          </div>
        </ScrollArea>

        <AlertDialogFooter className="gap-2 sm:gap-3 px-6 pb-6 pt-4 border-t border-white/20">
          <AlertDialogCancel onClick={onDismiss} className="bg-white/20 text-indigo-100 border-indigo-300 hover:bg-white/30 hover:text-white w-full sm:w-auto">
            Maybe Later
          </AlertDialogCancel>
          <AlertDialogAction asChild className="bg-yellow-400 text-purple-700 hover:bg-yellow-500 font-semibold w-full sm:w-auto">
            <Link href="/register" onClick={onDismiss}>
              👉 Register Now!
            </Link>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
