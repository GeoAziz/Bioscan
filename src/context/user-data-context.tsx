
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '@/lib/types';
import { getUser, initializeUserData } from '@/services/user-service';
import { mockPatient } from '@/lib/mock-data';
import { useAuth } from './auth-context';

interface UserDataContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

const UserDataContext = createContext<UserDataContextType>({
  user: null,
  loading: true,
  error: null,
});

export const UserDataProvider = ({ userId, children }: { userId: string, children: React.ReactNode }) => {
  const { user: authUser } = useAuth(); // Get the full user object from auth context
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId || !authUser) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        let userData = await getUser(userId);
        if (!userData) {
          // If no data, initialize with data from Auth context
          console.log('No user data found, initializing new profile...');
          const newUser: User = {
            ...mockPatient,
            name: authUser.displayName || 'New User',
            email: authUser.email || '',
            avatarUrl: authUser.photoURL || 'https://placehold.co/100x100.png',
            role: 'patient', // Default role for new sign-ups
          };
          await initializeUserData(userId, newUser);
          userData = await getUser(userId); // Re-fetch after creation
        }
        setUser(userData);
      } catch (err) {
        setError(err as Error);
        console.error("Failed to fetch user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, authUser]);

  return (
    <UserDataContext.Provider value={{ user, loading, error }}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => useContext(UserDataContext);
