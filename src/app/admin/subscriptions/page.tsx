"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Users } from 'lucide-react';
import Link from 'next/link';

export default function ManageSubscriptionsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-8">
        <ShieldCheck className="h-8 w-8 mr-3 text-primary" />
        <h1 className="text-3xl font-bold font-headline">Manage Subscriptions</h1>
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Subscription Management</CardTitle>
          <CardDescription>
            View and manage agent subscriptions. For detailed actions like marking payments or changing expiry, please use the Agent Management page.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <Users className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-lg text-muted-foreground mb-6">
            Detailed subscription management is integrated into the "Manage Agents" section.
          </p>
          <Button asChild size="lg">
            <Link href="/admin/agents">
              Go to Manage Agents
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
