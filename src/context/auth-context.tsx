// src/context/AuthContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, isFirebaseConfigValid } from '@/lib/firebase';
import { DnaStrandIcon } from '@/components/icons/dna-strand';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  if (!isFirebaseConfigValid) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-4 text-center">
        <div className="max-w-xl space-y-6 rounded-lg border border-destructive/50 bg-card p-8 shadow-2xl shadow-destructive/10">
            <div className="flex justify-center">
            <DnaStrandIcon className="h-24 w-24 text-destructive" />
            </div>
            <h1 className="text-3xl font-headline font-bold text-destructive">Firebase Configuration Missing</h1>
            <p className="text-muted-foreground">
            Your Firebase environment variables are not set correctly. Please copy your Firebase project configuration into the <strong>.env</strong> file in the project's root directory.
            </p>
            <div className="rounded-lg bg-muted p-4 text-left text-sm font-mono text-muted-foreground/80">
            <p>NEXT_PUBLIC_FIREBASE_API_KEY=...</p>
            <p>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...</p>
            <p>NEXT_PUBLIC_FIREBASE_PROJECT_ID=...</p>
            <p>NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...</p>
            <p>NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...</p>
            <p>NEXT_PUBLIC_FIREBASE_APP_ID=...</p>
            </div>
            <p className="text-sm text-muted-foreground">
            After you've updated the <strong>.env</strong> file, you may need to restart the application.
            </p>
        </div>
        </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
