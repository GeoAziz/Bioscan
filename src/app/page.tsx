'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { DnaStrandIcon } from '@/components/icons/dna-strand';
import { useAuth } from '@/context/auth-context';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function WelcomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (loading || user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <DnaStrandIcon className="h-48 w-48 animate-dna-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="flex h-screen w-full flex-col items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center justify-center space-y-8 text-center">
        <div className="perspective-[1000px]">
          <DnaStrandIcon className="h-48 w-48 animate-dna-spin text-primary" />
        </div>
        <div className="space-y-2">
          <h1 className="font-headline text-6xl font-bold tracking-tighter text-primary glow-shadow">
            BioScan
          </h1>
          <p className="text-lg text-muted-foreground">
            Your personal healthverse. Real-time, immersive, intelligent.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="rounded-full px-12 py-6 text-lg font-semibold shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/50">
              <Link href="/login">
                Get Started <ArrowRight className="ml-2" />
              </Link>
            </Button>
        </div>
      </div>
    </main>
  );
}
