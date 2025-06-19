
"use client";

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { LoginForm } from '@/components/login-form';
import { Loader2 } from 'lucide-react';
import HomeHeader from '@/components/home-header';
import HomeFooter from '@/components/home-footer';

function LoginPageContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role');

  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'admin') {
        router.replace('/admin');
      } else if (user.role === 'agent') {
         if (user.status === 'active') {
            router.replace('/dashboard');
         }
         // For pending/banned, they will stay on this page and see the login form.
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="font-inter antialiased bg-slate-50 text-slate-800 flex flex-col min-h-screen">
      <HomeHeader />
      <main className="flex-grow flex flex-col items-center justify-center p-6 bg-gradient-to-br from-primary/10 via-background to-accent/10 mt-16 md:mt-[72px]"> {/* Adjusted top padding */}
        <LoginForm initialRole={initialRole} />
      </main>
      <HomeFooter />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}>
      <LoginPageContent />
    </Suspense>
  );
}
