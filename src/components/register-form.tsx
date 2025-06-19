
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
import { useRouter } from 'next/navigation';
import { Loader2, Award, Check, Star, BarChartBig, Wallet, ShoppingCart, Users, Info, User, Mail, Phone, Lock, CreditCard, AlertTriangle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


const phoneRegex = new RegExp(/^0[2,5,7,6]\d{8}$/); // Example Ghanaian phone number regex

const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phoneNumber: z.string().regex(phoneRegex, { message: 'Invalid Ghanaian phone number format (e.g., 024xxxxxxx)'}),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val === true, { message: "You must accept the terms and conditions" }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'], // path to error
});

type RegisterFormInputs = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const { register: registerUser } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
        terms: false,
    }
  });

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    setIsLoading(true);
    const success = await registerUser(data.name, data.email, data.phoneNumber, data.password);
    setIsLoading(false);

    if (success) {
      toast({
        title: 'Registration Submitted',
        description: 'Your agent application has been submitted. Please wait for admin approval. You will be notified.',
      });
      router.push('/login'); 
    } else {
      toast({
        title: 'Registration Failed',
        description: 'An account with this email may already exist, or an error occurred.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl shadow-xl bg-white rounded-xl">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-3xl font-headline text-slate-800">Join the DataFlex Agent Network</CardTitle>
        <CardDescription className="text-slate-600">Start your journey to financial freedom today</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        
        <div className="bg-gradient-to-r from-primary to-blue-600 text-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <h3 className="text-xl font-semibold flex items-center gap-2"><Award className="w-6 h-6" /> Agent Registration Package</h3>
            <div className="text-center sm:text-right">
              <span className="text-4xl font-bold block">₵35</span>
              <span className="text-sm opacity-90">3 Months Subscription</span>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">What's Included:</h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm opacity-90">
              {[
                "Unique Agent Code", "Access to Agent Dashboard",
                "Wholesale Bundle Prices", "Earn on Gigs & Bundles", "24/7 Support Access", "Training Resources"
              ].map(item => (
                <li key={item} className="flex items-center gap-2"><Check className="w-4 h-4 text-green-300" /> {item}</li>
              ))}
            </ul>
          </div>
        </div>

        <Alert variant="default" className="bg-yellow-50 border-yellow-300 text-yellow-700">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          <AlertTitle className="font-semibold text-yellow-800">Important: Use Real Information</AlertTitle>
          <AlertDescription className="text-sm text-yellow-700">
            Please provide your actual email address and phone number. These details are crucial for:
            <ul className="list-disc list-inside pl-4 mt-1">
              <li>Receiving commission payouts (e.g., to your MoMo number).</li>
              <li>Account recovery and important notifications.</li>
              <li>Exclusive promotional offers and platform updates.</li>
            </ul>
            All agent accounts require manual admin approval.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="flex items-center gap-1"><User className="w-4 h-4" /> Full Name</Label>
              <Input id="name" {...register('name')} placeholder="Enter your full name" aria-invalid={errors.name ? 'true' : 'false'} />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
            </div>
             <div>
              <Label htmlFor="email" className="flex items-center gap-1"><Mail className="w-4 h-4" /> Email Address *</Label>
              <Input id="email" type="email" {...register('email')} placeholder="Enter your actual email" aria-invalid={errors.email ? 'true' : 'false'} />
               {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="phoneNumber" className="flex items-center gap-1"><Phone className="w-4 h-4" /> Phone Number (MoMo) *</Label>
            <Input id="phoneNumber" type="tel" {...register('phoneNumber')} placeholder="024xxxxxxx (Used for payouts)" aria-invalid={errors.phoneNumber ? 'true' : 'false'} />
            {errors.phoneNumber && <p className="text-sm text-destructive mt-1">{errors.phoneNumber.message}</p>}
            <p className="text-xs text-slate-500 mt-1">Ensure this is your correct MoMo number for commission payouts.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="password" className="flex items-center gap-1"><Lock className="w-4 h-4" /> Password</Label>
              <Input id="password" type="password" {...register('password')} placeholder="Create a password" aria-invalid={errors.password ? 'true' : 'false'} />
              {errors.password && <p className="text-sm text-destructive mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="flex items-center gap-1"><Lock className="w-4 h-4" /> Confirm Password</Label>
              <Input id="confirmPassword" type="password" {...register('confirmPassword')} placeholder="Confirm your password" aria-invalid={errors.confirmPassword ? 'true' : 'false'} />
              {errors.confirmPassword && <p className="text-sm text-destructive mt-1">{errors.confirmPassword.message}</p>}
            </div>
          </div>
          
          <div className="items-top flex space-x-2">
             <Checkbox id="terms" {...register('terms')} aria-invalid={errors.terms ? "true" : "false"} />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-600"
              >
                I agree to the <Link href="/terms" className="font-medium text-primary hover:underline" target="_blank">Terms & Conditions</Link>
              </label>
              {errors.terms && <p className="text-sm text-destructive">{errors.terms.message}</p>}
            </div>
          </div>
          
          <Button type="submit" className="w-full text-lg py-3 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : <><CreditCard className="w-5 h-5 mr-2" /> Register Now - Pay ₵35</>}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-center pt-6 border-t border-slate-200">
        <p className="text-sm text-slate-600 mb-2">Already have an account?</p>
        <Button variant="outline" asChild>
            <Link href="/login">Login Here</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
