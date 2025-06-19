
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { DashboardHeader } from '@/components/dashboard-header';
import { DashboardSidebarNav } from '@/components/dashboard-sidebar-nav';
import { Loader2, ShieldAlert, Info } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarHeader, SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { mockGlobalMessages } from '@/lib/mock-data'; // For global messages
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, updateUser } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [showGlobalMessage, setShowGlobalMessage] = useState(false);
  const [globalMessageContent, setGlobalMessageContent] = useState<{ id: string; message: string } | null>(null);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'agent')) {
      router.replace('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && user.role === 'agent' && user.status === 'active') {
      const activeGlobalMessage = mockGlobalMessages.find(m => m.isActive);
      if (activeGlobalMessage) {
        const lastDismissedId = localStorage.getItem('lastDismissedGlobalMessageId_agent_' + user.id);
        if (activeGlobalMessage.id !== lastDismissedId) {
          setGlobalMessageContent({ id: activeGlobalMessage.id, message: activeGlobalMessage.message });
          setShowGlobalMessage(true);
        }
      }
    }
  }, [user, loading]);

  const handleDismissGlobalMessage = () => {
    if (globalMessageContent && user) {
      localStorage.setItem('lastDismissedGlobalMessageId_agent_' + user.id, globalMessageContent.id);
      // Optionally update user context if storing on backend
      // updateUser({ ...user, lastDismissedGlobalMessageId: globalMessageContent.id });
    }
    setShowGlobalMessage(false);
    setGlobalMessageContent(null);
  };


  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user.role !== 'agent') {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <p>Redirecting to login...</p>
        </div>
    );
  }
  
  if (user.status === 'pending') {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md text-center shadow-lg">
          <CardHeader>
            <ShieldAlert className="mx-auto h-16 w-16 text-yellow-500" />
            <CardTitle className="mt-4 text-2xl">Account Pending Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-6">
              Your agent account is currently awaiting approval from an administrator.
              You will be notified once your account is active.
              You can check your subscription status or contact support if you have questions.
            </CardDescription>
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/dashboard/subscription">Check Subscription</Link>
              </Button>
              <Button variant="outline" onClick={() => router.push('/')} className="w-full">
                Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user.status === 'banned') {
    return (
       <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md text-center shadow-lg">
          <CardHeader>
            <ShieldAlert className="mx-auto h-16 w-16 text-destructive" />
            <CardTitle className="mt-4 text-2xl">Account Banned</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-6">
              Your account has been banned. Please contact support for more information.
            </CardDescription>
             <Button variant="outline" onClick={() => router.push('/')} className="w-full">
                Back to Login
              </Button>
          </CardContent>
        </Card>
      </div>
    );
  }


  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar variant="sidebar" collapsible="icon">
        <SidebarHeader className="border-b border-sidebar-border">
          <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold text-sidebar-foreground hover:text-sidebar-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7 text-sidebar-primary">
              <path d="M12 .75a8.25 8.25 0 00-6.065 2.627.75.75 0 001.115.996A6.75 6.75 0 0112 2.25a6.75 6.75 0 014.95 11.123.75.75 0 00.784 1.24A8.25 8.25 0 0012 .75z" />
              <path d="M4.646 4.646a.75.75 0 00-1.06 1.06L6.593 8.714a.75.75 0 001.06-1.06L4.646 4.646zM17.293 6.707a.75.75 0 00-1.06-1.06l-2.121 2.121a.75.75 0 001.06 1.06l2.121-2.121zM12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9zM3.75 12a8.25 8.25 0 002.627 6.065.75.75 0 00.996-1.115A6.75 6.75 0 012.25 12a6.75 6.75 0 0111.123-4.95.75.75 0 001.24-.784A8.25 8.25 0 003.75 12z" />
              <path d="M19.354 19.354a.75.75 0 001.06-1.06l-3.007-3.008a.75.75 0 00-1.06 1.06l3.007 3.007zm-8.107-3.007a.75.75 0 001.06-1.06l-2.122-2.121a.75.75 0 00-1.06 1.06l2.122 2.121z" />
            </svg>
            <span className="font-headline group-data-[collapsible=icon]:hidden">Agent Platform</span>
          </Link>
        </SidebarHeader>
        <SidebarContent className="p-2">
            <DashboardSidebarNav role="agent" isAgentApproved={user.isApproved} agentSubscriptionStatus={user.subscriptionStatus} />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <DashboardHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </SidebarInset>

      {globalMessageContent && (
        <AlertDialog open={showGlobalMessage} onOpenChange={setShowGlobalMessage}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center">
                <Info className="h-5 w-5 mr-2 text-primary" /> Important Update from Admin
              </AlertDialogTitle>
              <AlertDialogDescription className="py-4 whitespace-pre-wrap">
                {globalMessageContent.message}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={handleDismissGlobalMessage}>Okay, Got It!</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </SidebarProvider>
  );
}
