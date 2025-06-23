'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { DnaStrandIcon } from '@/components/icons/dna-strand';
import { useAuth } from '@/context/auth-context';
import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { toast } from '@/hooks/use-toast';
import { Chrome } from 'lucide-react';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({
        title: 'Login Successful',
        description: 'Welcome to BioScan!',
      });
      router.push('/dashboard');
    } catch (error) {
      console.error('Error signing in with Google', error);
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Could not sign in with Google. Please try again.',
      });
    }
  };

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
        <Button
          size="lg"
          className="animate-glow-pulse rounded-full px-12 py-6 text-lg font-semibold shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/50"
          aria-label="Sign in with Google"
          onClick={handleLogin}
          disabled={loading}
        >
          <Chrome className="mr-2" />
          Sign In with Google
        </Button>
      </div>
    </main>
  );
}
