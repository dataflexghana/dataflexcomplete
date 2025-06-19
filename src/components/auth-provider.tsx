
"use client";

import type { User as AppUser } from '@/lib/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string; user?: AppUser }>;
  logout: () => Promise<void>;
  register: (name: string, email: string, phone: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  updateUser: (updatedUserPartial: Partial<AppUser>) => Promise<{ success: boolean; user?: AppUser; error?: string }>;
  fetchCurrentUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchCurrentUser = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        localStorage.setItem('authUser', JSON.stringify(data.user)); // For quick UI updates
      } else {
        setUser(null);
        localStorage.removeItem('authUser');
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
      setUser(null);
      localStorage.removeItem('authUser');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('authUser');
      }
    }
    fetchCurrentUser(); // Verify session with backend
  }, []);


  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string; user?: AppUser }> => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });
      const data = await response.json();
      if (response.ok && data.user) {
        setUser(data.user);
        localStorage.setItem('authUser', JSON.stringify(data.user));
        return { success: true, user: data.user };
      }
      return { success: false, error: data.error || 'Login failed' };
    } catch (error: any) {
      return { success: false, error: error.message || 'An error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, phoneNumber: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phoneNumber, password: pass }),
      });
      const data = await response.json();
      if (response.ok) {
        return { success: true };
      }
      return { success: false, error: data.error || 'Registration failed' };
    } catch (error: any) {
      return { success: false, error: error.message || 'An error occurred' };
    } finally {
      setLoading(false);
    }
  };
  
  const logout = async () => {
    setLoading(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error("Logout API call error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem('authUser');
      setLoading(false);
      router.push('/'); 
    }
  };
  
  const updateUser = async (updatedUserPartial: Partial<AppUser>): Promise<{ success: boolean; user?: AppUser; error?: string }> => {
    if (!user || !user.id) return { success: false, error: "No user to update" };
    setLoading(true);
    try {
      // Example: Assuming user.id from custom auth is the Supabase Users table primary key
      const response = await fetch(`/api/users/${user.id}`, { 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUserPartial),
      });
      const data = await response.json();
      if (response.ok && data.user) {
        setUser(data.user);
        localStorage.setItem('authUser', JSON.stringify(data.user));
        return { success: true, user: data.user };
      }
      return { success: false, error: data.error || 'Update failed' };
    } catch (error: any) {
      console.error("Error updating user profile:", error);
      return { success: false, error: error.message || "An error occurred" };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, updateUser, fetchCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
