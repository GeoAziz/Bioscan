'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { usePatientData } from '@/context/patient-data-context';
import { handleUpdateProfile } from '@/app/actions';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Smartphone, Watch, Cpu, Bell, User, Mail } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const deviceIcons: Record<string, LucideIcon> = {
    sw01: Watch,
    sp02: Smartphone,
    si03: Cpu,
  };

const settingsFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  notificationPreferences: z.object({
    highPriorityAlerts: z.boolean().default(false),
    newRecommendations: z.boolean().default(false),
  }),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export default function SettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const { patient, loading: patientLoading } = usePatientData();
  const { toast } = useToast();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      name: '',
      notificationPreferences: {
        highPriorityAlerts: false,
        newRecommendations: false,
      },
    },
  });

  useEffect(() => {
    if (patient) {
      form.reset({
        name: patient.name,
        notificationPreferences: {
          highPriorityAlerts: patient.notificationPreferences?.highPriorityAlerts ?? false,
          newRecommendations: patient.notificationPreferences?.newRecommendations ?? false,
        },
      });
    }
  }, [patient, form]);

  async function onSubmit(data: SettingsFormValues) {
    if (!user) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to save settings.' });
      return;
    }

    toast({ title: 'Saving...', description: 'Your settings are being updated.' });
    
    const result = await handleUpdateProfile(user.uid, data);

    if (result.success) {
      toast({ title: 'Success!', description: 'Your settings have been saved.' });
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
  }

  if (authLoading || patientLoading) {
    return (
      <div className="p-4 lg:p-6 space-y-6">
          <Skeleton className="h-8 w-48 mb-4" />
          <div className="space-y-8">
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-16 w-16 rounded-full" />
                        <div className="flex-1 space-y-2">
                           <Skeleton className="h-4 w-16" />
                           <Skeleton className="h-10 w-full" />
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-72" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                </CardContent>
            </Card>
          </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <h1 className="text-3xl font-headline font-bold">Settings</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><User /> Profile</CardTitle>
              <CardDescription>Manage your personal information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user?.photoURL || undefined} />
                  <AvatarFallback>{patient?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <div className="flex items-center gap-2 text-muted-foreground p-2 border rounded-md bg-muted/30 h-10 px-3">
                    <Mail className="w-4 h-4"/>
                    <span>{user?.email}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Bell /> Notifications</CardTitle>
              <CardDescription>Choose how you want to be notified.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="notificationPreferences.highPriorityAlerts"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">High Priority Alerts</FormLabel>
                      <FormDescription>
                        Receive notifications for high priority triage events.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notificationPreferences.newRecommendations"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">New Health Tips</FormLabel>
                      <FormDescription>
                        Get notified when a new AI health tip is available.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Cpu /> Connected Devices</CardTitle>
              <CardDescription>Manage your connected biometric devices.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {patient?.devices.map((device) => {
                const Icon = deviceIcons[device.id] || Smartphone;
                return (
                  <div key={device.id} className="flex items-center justify-between text-sm p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Icon className="h-6 w-6 text-accent" />
                      <div className="font-medium">{device.name}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-green-400/50 text-green-400">{device.battery}% Battery</Badge>
                      <Button variant="ghost" size="sm" disabled>Manage</Button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
