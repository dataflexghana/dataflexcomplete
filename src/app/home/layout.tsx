
import type { Metadata } from 'next';
import HomeHeader from '@/components/home-header';
import HomeFooter from '@/components/home-footer';

export const metadata: Metadata = {
  title: 'DataFlex Agent Platform - Resell Data & Earn',
  description: 'Join DataFlex to become a data agent in Ghana. Sell MTN, Vodafone, AirtelTigo bundles and earn commissions.',
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="font-inter antialiased bg-slate-50 text-slate-800 flex flex-col min-h-screen">
      <HomeHeader />
      <main className="flex-grow pt-16 md:pt-[72px]"> {/* Adjust top padding to account for fixed header height */}
        {children}
      </main>
      <HomeFooter />
    </div>
  );
}
