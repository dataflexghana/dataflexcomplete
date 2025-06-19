
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page will now redirect to the new /home page.
export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/home');
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p>Redirecting...</p>
    </div>
  );
}
