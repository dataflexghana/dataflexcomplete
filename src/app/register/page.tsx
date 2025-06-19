
"use client";

import { RegisterForm } from '@/components/register-form';
import HomeHeader from '@/components/home-header'; // Using the new home header
import HomeFooter from '@/components/home-footer'; // Using the new home footer

export default function RegisterPage() {
  return (
    <div className="font-inter antialiased bg-slate-50 text-slate-800 flex flex-col min-h-screen">
      <HomeHeader />
      <main className="flex-grow flex flex-col items-center justify-center p-6 bg-gradient-to-br from-primary/10 via-background to-accent/10 mt-16"> {/* mt-16 for header height */}
        <RegisterForm />
      </main>
      <HomeFooter />
    </div>
  );
}
