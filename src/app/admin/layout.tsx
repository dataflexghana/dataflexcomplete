"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { DashboardHeader } from '@/components/dashboard-header';
import { DashboardSidebarNav } from '@/components/dashboard-sidebar-nav';
import { Loader2 } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarHeader, SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.replace('/'); // Redirect to login if not admin or not logged in
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    // This should ideally not be reached due to the useEffect redirect
    return (
         <div className="flex min-h-screen items-center justify-center bg-background">
            <p>Access Denied. Redirecting...</p>
        </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar variant="sidebar" collapsible="icon">
        <SidebarHeader className="border-b border-sidebar-border">
           <Link href="/admin" className="flex items-center gap-2 text-lg font-semibold text-sidebar-foreground hover:text-sidebar-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7 text-sidebar-primary">
              <path fillRule="evenodd" d="M12.5 4.75A.75.75 0 0011 5.5v5.69l-1.72-1.72a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l3-3a.75.75 0 00-1.06-1.06L13.5 11.19V5.5A.75.75 0 0012.5 4.75zM3.52 8.62A8.252 8.252 0 0012 20.25a8.252 8.252 0 008.48-11.63.75.75 0 10-1.23-.875A6.752 6.752 0 0112 18.75a6.752 6.752 0 01-7.25-9.255.75.75 0 00-1.23.875z" clipRule="evenodd" />
            </svg>
            <span className="font-headline group-data-[collapsible=icon]:hidden">Admin Panel</span>
          </Link>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <DashboardSidebarNav role="admin" />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <DashboardHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
