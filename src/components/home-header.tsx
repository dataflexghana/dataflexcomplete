
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, LogIn, UserPlus, LayoutDashboardIcon } from 'lucide-react';
import { useAuth } from './auth-provider'; 
import { useRouter } from 'next/navigation';

export default function HomeHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { 
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const commonNavLinks = [
    { href: "/home#home", label: "Home" },
    { href: "/home#benefits", label: "Benefits" },
    { href: "/home#success-stories", label: "Testimonials" },
    { href: "/home#bundles", label: "Bundles & Gigs" },
    { href: "/terms", label: "Terms" },
  ];

  const handleLogout = () => {
    logout();
    toggleMobileMenu(); // Close menu after action
  }
  
  const handleDashboardRedirect = () => {
    router.push(user?.role === 'admin' ? '/admin' : '/dashboard');
    toggleMobileMenu(); // Close menu after action
  }


  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-white/80"> {/* Changed z-50 to z-40 */}
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3 md:py-4">
          <div className="nav-brand">
            <Link href="/home" className="flex items-center gap-2">
              <div className="logo-icon w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-primary to-blue-700 rounded-lg flex items-center justify-center shadow-md hover:scale-105 transition-transform">
                <Image src="/images/logo.png" alt="DataFlex Logo" width={30} height={30} className="rounded"/>
              </div>
            </Link>
          </div>
          
          <nav className="hidden md:flex gap-2 lg:gap-4 items-center">
            {commonNavLinks.map(link => (
                 <Link key={link.href} href={link.href} className="text-slate-600 hover:text-primary font-medium px-3 py-2 rounded-md transition-colors text-sm">
                    {link.label}
                 </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                 <Button variant="outline" size="sm" onClick={handleDashboardRedirect} className="flex items-center gap-1">
                    <LayoutDashboardIcon className="w-4 h-4"/> Dashboard
                </Button>
                <Button variant="ghost" size="sm" onClick={logout}>Logout</Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/login" className="flex items-center gap-1"><LogIn className="w-4 h-4"/>Login</Link>
                </Button>
                <Button size="sm" asChild className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white shadow hover:shadow-md transform hover:scale-105 transition-all">
                  <Link href="/register" className="flex items-center gap-1"><UserPlus className="w-4 h-4"/>Register</Link>
                </Button>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-primary p-2 rounded-md hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg py-2 z-40 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="flex flex-col gap-1 px-4 pb-4">
             {commonNavLinks.map(link => (
                 <Link key={link.href} href={link.href} className="block px-3 py-3 rounded-md text-slate-700 hover:bg-primary/10 hover:text-primary font-medium" onClick={toggleMobileMenu}>
                    {link.label}
                 </Link>
            ))}
            <hr className="my-2 border-slate-200"/>
             {user ? (
              <>
                <Button variant="default" className="w-full justify-start mb-2" onClick={handleDashboardRedirect}>
                    <LayoutDashboardIcon className="w-4 h-4 mr-2"/>Dashboard
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Button variant="outline" className="w-full justify-start mb-2" asChild>
                  <Link href="/login" onClick={toggleMobileMenu}><LogIn className="w-4 h-4 mr-2"/>Login</Link>
                </Button>
                <Button className="w-full justify-start bg-gradient-to-r from-primary to-blue-600 text-white" asChild>
                  <Link href="/register" onClick={toggleMobileMenu}><UserPlus className="w-4 h-4 mr-2"/>Register</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
