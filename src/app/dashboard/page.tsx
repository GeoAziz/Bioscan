
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserData } from '@/context/user-data-context';
import { DnaStrandIcon } from '@/components/icons/dna-strand';

export default function DashboardRedirector() {
  const { user, loading } = useUserData();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    // Redirect based on role
    switch (user.role) {
      case 'admin':
        router.replace('/dashboard/admin');
        break;
      case 'doctor':
        router.replace('/dashboard/doctor');
        break;
      case 'patient':
      default:
        router.replace('/dashboard/patient');
        break;
    }
  }, [user, loading, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <DnaStrandIcon className="h-24 w-24 animate-dna-spin text-primary" />
          <p className="text-muted-foreground">Redirecting to your dashboard...</p>
        </div>
      </div>
  );
}
