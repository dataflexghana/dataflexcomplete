
"use client";

import React, { useState, useEffect } from 'react';
import { mockAgentCommissionSettings } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Settings as SettingsIcon, Percent, Package } from 'lucide-react';

export default function AdminSettingsPage() {
  const [commissionRate, setCommissionRate] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Load current commission rate from mock data
    setCommissionRate(mockAgentCommissionSettings.commissionRate * 100); // Display as percentage
  }, []);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const newRate = parseFloat(commissionRate.toString()) / 100;
    if (isNaN(newRate) || newRate < 0 || newRate > 1) {
      toast({
        title: 'Invalid Rate',
        description: 'Commission rate must be between 0 and 100%.',
        variant: 'destructive',
      });
      return;
    }
    // In a real app, this would be an API call
    mockAgentCommissionSettings.commissionRate = newRate;
    toast({
      title: 'Settings Saved',
      description: `Global agent commission rate for data bundles set to ${(newRate * 100).toFixed(2)}%.`,
    });
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-8">
        <SettingsIcon className="h-8 w-8 mr-3 text-primary" />
        <h1 className="text-3xl font-bold font-headline">Platform Settings</h1>
      </div>

      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center"><Package className="mr-2 h-6 w-6 text-primary"/> Data Bundle Commission</CardTitle>
          <CardDescription>
            Set the global commission rate agents earn from <strong className="text-primary">data bundle sales</strong>. 
            Commissions for "Gigs" are set individually per Gig.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveSettings} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="commissionRate" className="flex items-center">
                <Percent className="h-4 w-4 mr-2" />
                Data Bundle Commission Rate (%)
              </Label>
              <Input
                id="commissionRate"
                type="number"
                value={commissionRate}
                onChange={(e) => setCommissionRate(parseFloat(e.target.value))}
                placeholder="e.g., 5 for 5%"
                min="0"
                max="100"
                step="0.1"
              />
              <p className="text-sm text-muted-foreground">
                Enter a value between 0 and 100. For example, 5 means 5% commission on data bundle sales.
              </p>
            </div>
            <Button type="submit">Save Settings</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

    