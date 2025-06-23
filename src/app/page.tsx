import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DnaStrandIcon } from '@/components/icons/dna-strand';

export default function LoginPage() {
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
        <Link href="/dashboard">
          <Button
            size="lg"
            className="animate-glow-pulse rounded-full px-12 py-6 text-lg font-semibold shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/50"
            aria-label="Enter BioScan Dashboard"
          >
            Enter BioScan
          </Button>
        </Link>
      </div>
    </main>
  );
}
