
"use client";

import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/components/auth-provider';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Loader2, Mail, Lock, LogIn, BarChartBig, Wallet, ShoppingCart, Users, Star, ShieldCheck } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

interface LoginFormProps {
  initialRole?: string | null;
}

export function LoginForm({ initialRole }: LoginFormProps) {
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const isAdminLogin = initialRole === 'admin';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setIsLoading(true);
    const success = await login(data.email, data.password); // AuthProvider handles redirection
    setIsLoading(false);
    if (!success) {
      toast({
        title: 'Login Failed',
        description: 'Invalid email or password. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl bg-white rounded-xl">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-3xl font-headline text-slate-800 flex items-center justify-center gap-2">
          {isAdminLogin ? <ShieldCheck className="w-8 h-8 text-primary" /> : <LogIn className="w-8 h-8 text-primary" />}
          {isAdminLogin ? 'Administrator Login' : 'Agent Login'}
        </CardTitle>
        <CardDescription className="text-slate-600">
          {isAdminLogin ? "Access the platform's admin panel" : 'Access your DataFlex agent dashboard'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {!isAdminLogin && (
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h4 className="text-md font-semibold text-slate-700 mb-3 flex items-center gap-2"><Star className="w-5 h-5 text-yellow-500" /> Agent Dashboard Features</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-slate-600 text-xs">
              {[
                { icon: BarChartBig, label: "Sales Analytics" }, { icon: Wallet, label: "Earnings Tracker" },
                { icon: ShoppingCart, label: "Order Management" }, { icon: Users, label: "Customer Base" }
              ].map(item => (
                <div key={item.label} className="flex items-center gap-1"><item.icon className="w-3 h-3 text-primary" /> {item.label}</div>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="email" className="flex items-center gap-1"><Mail className="w-4 h-4" /> Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register('email')}
              aria-invalid={errors.email ? 'true' : 'false'}
              className={errors.email ? 'border-destructive' : ''}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="password" className="flex items-center gap-1"><Lock className="w-4 h-4" /> Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register('password')}
              aria-invalid={errors.password ? 'true' : 'false'}
              className={errors.password ? 'border-destructive' : ''}
            />
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>
          <Button type="submit" className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : <><LogIn className="w-4 h-4 mr-2"/> {isAdminLogin ? 'Login as Administrator' : 'Login to Dashboard'}</>}
          </Button>
        </form>
      </CardContent>
      {!isAdminLogin && (
        <CardFooter className="flex flex-col items-center pt-6 border-t border-slate-200">
          <p className="text-sm text-slate-600 mb-2">Don't have an agent account?</p>
          <Button variant="outline" asChild>
              <Link href="/register">Register Now</Link>
          </Button>
        </CardFooter>
      )}
       {isAdminLogin && (
        <CardFooter className="flex flex-col items-center pt-6 border-t border-slate-200">
          <p className="text-sm text-slate-600">This login is for authorized administrators only.</p>
        </CardFooter>
      )}
    </Card>
  );
}
