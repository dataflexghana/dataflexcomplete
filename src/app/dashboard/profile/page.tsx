
"use client";

import React, { useState } from 'react';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserCircle, Phone, KeyRound, Save, ShieldAlert } from 'lucide-react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { mockUsers } from '@/lib/mock-data'; // Direct import for mock data updates

const phoneRegex = new RegExp(/^0[2,5,7,6]\d{8}$/);

const profileSchema = z.object({
  phoneNumber: z.string().regex(phoneRegex, { message: 'Invalid Ghanaian phone number format (e.g., 024xxxxxxx)' }).optional().or(z.literal('')),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, { message: 'Current password is required' }),
  newPassword: z.string().min(6, { message: 'New password must be at least 6 characters' }),
  confirmNewPassword: z.string(),
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: "New passwords don't match",
  path: ['confirmNewPassword'],
});

type ProfileFormInputs = z.infer<typeof profileSchema>;
type PasswordFormInputs = z.infer<typeof passwordSchema>;

export default function AgentProfilePage() {
  const { user, updateUser: updateAuthContextUser } = useAuth();
  const { toast } = useToast();
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  const profileForm = useForm<ProfileFormInputs>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      phoneNumber: user?.phoneNumber || '',
    },
  });

  const passwordForm = useForm<PasswordFormInputs>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    }
  });

  if (!user) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleProfileUpdate: SubmitHandler<ProfileFormInputs> = async (data) => {
    setIsProfileLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const updatedUser = { ...user, phoneNumber: data.phoneNumber || user.phoneNumber };
    
    // Update in mockUsers array
    const userIndex = mockUsers.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...updatedUser };
    }
    
    updateAuthContextUser(updatedUser); // Update auth context

    toast({ title: 'Profile Updated', description: 'Your phone number has been updated.' });
    setIsProfileLoading(false);
  };

  const handlePasswordChange: SubmitHandler<PasswordFormInputs> = async (data) => {
    setIsPasswordLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    if (user.password !== data.currentPassword) {
      toast({ title: 'Password Change Failed', description: 'Incorrect current password.', variant: 'destructive' });
      setIsPasswordLoading(false);
      return;
    }

    const updatedUser = { ...user, password: data.newPassword };

    // Update in mockUsers array
    const userIndex = mockUsers.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...updatedUser };
    }

    updateAuthContextUser(updatedUser); // Update auth context

    toast({ title: 'Password Changed', description: 'Your password has been successfully updated.' });
    passwordForm.reset();
    setIsPasswordLoading(false);
  };


  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <div className="flex items-center mb-8">
        <UserCircle className="h-8 w-8 mr-3 text-primary" />
        <h1 className="text-3xl font-bold font-headline">My Profile</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center"><Phone className="mr-2 h-5 w-5 text-primary" /> Contact Information</CardTitle>
            <CardDescription>Update your phone number used for MoMo payouts and communication.</CardDescription>
          </CardHeader>
          <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)}>
            <CardContent className="space-y-4">
                <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={user.name} disabled className="bg-muted/50"/>
                </div>
                <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" value={user.email} disabled className="bg-muted/50"/>
                </div>
              <div>
                <Label htmlFor="phoneNumber">Phone Number (MoMo)</Label>
                <Input 
                  id="phoneNumber" 
                  type="tel" 
                  {...profileForm.register('phoneNumber')} 
                  placeholder="024xxxxxxx"
                  aria-invalid={profileForm.formState.errors.phoneNumber ? 'true' : 'false'}
                />
                {profileForm.formState.errors.phoneNumber && <p className="text-sm text-destructive mt-1">{profileForm.formState.errors.phoneNumber.message}</p>}
                <p className="text-xs text-muted-foreground mt-1">Ensure this is correct for commission payouts.</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isProfileLoading}>
                {isProfileLoading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 h-4 w-4" />}
                Save Phone Number
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center"><KeyRound className="mr-2 h-5 w-5 text-primary"/> Change Password</CardTitle>
            <CardDescription>Update your account password regularly for security.</CardDescription>
          </CardHeader>
          <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)}>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input 
                  id="currentPassword" 
                  type="password" 
                  {...passwordForm.register('currentPassword')}
                  aria-invalid={passwordForm.formState.errors.currentPassword ? 'true' : 'false'}
                />
                 {passwordForm.formState.errors.currentPassword && <p className="text-sm text-destructive mt-1">{passwordForm.formState.errors.currentPassword.message}</p>}
              </div>
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input 
                  id="newPassword" 
                  type="password" 
                  {...passwordForm.register('newPassword')} 
                  aria-invalid={passwordForm.formState.errors.newPassword ? 'true' : 'false'}
                />
                 {passwordForm.formState.errors.newPassword && <p className="text-sm text-destructive mt-1">{passwordForm.formState.errors.newPassword.message}</p>}
              </div>
              <div>
                <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                <Input 
                  id="confirmNewPassword" 
                  type="password" 
                  {...passwordForm.register('confirmNewPassword')} 
                  aria-invalid={passwordForm.formState.errors.confirmNewPassword ? 'true' : 'false'}
                />
                {passwordForm.formState.errors.confirmNewPassword && <p className="text-sm text-destructive mt-1">{passwordForm.formState.errors.confirmNewPassword.message}</p>}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isPasswordLoading}>
                {isPasswordLoading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 h-4 w-4" />}
                Update Password
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
       {user.status === 'pending' && (
         <Card className="mt-8 bg-yellow-50 border-yellow-300 text-yellow-700">
            <CardHeader className="flex flex-row items-start space-x-3">
              <ShieldAlert className="h-6 w-6 mt-1 text-yellow-600" />
              <div>
                <CardTitle className="text-yellow-800">Account Still Pending</CardTitle>
                <CardDescription className="text-yellow-700">
                  Your agent account is still under review by an administrator. Some features may be limited until approved. You can update your profile information in the meantime.
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        )}
    </div>
  );
}
