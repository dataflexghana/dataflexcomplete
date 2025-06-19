
"use client";

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, UserCircle, LayoutDashboard, Settings, ShieldCheck } from 'lucide-react'; // Added ShieldCheck for Profile
import { useAuth } from './auth-provider';
import { SidebarTrigger, useSidebar } from './ui/sidebar'; 

export function DashboardHeader() {
  const { user, logout } = useAuth();
  const { toggleSidebar, isMobile } = useSidebar(); 

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return names[0][0] + names[names.length - 1][0];
    }
    return names[0].substring(0, 2);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      {isMobile && (
         <SidebarTrigger onClick={toggleSidebar} />
      )}
      <div className="flex-1">
        {/* Can add breadcrumbs or page title here */}
      </div>
      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={`https://placehold.co/100x100.png?text=${getInitials(user.name)}`} alt={user.name || 'User'} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email} ({user.role})
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={user.role === 'admin' ? "/admin" : "/dashboard"}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </DropdownMenuItem>
            {user.role === 'agent' && (
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">
                  <UserCircle className="mr-2 h-4 w-4" />
                  My Profile
                </Link>
              </DropdownMenuItem>
            )}
             {user.role === 'admin' && (
                <DropdownMenuItem asChild>
                    <Link href="/admin/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        Platform Settings
                    </Link>
                </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
}
