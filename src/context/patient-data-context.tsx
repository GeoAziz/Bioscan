'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '@/lib/types';
import { getUser, initializeUserData } from '@/services/user-service';
import { mockPatient } from '@/lib/mock-data';
import { useAuth } from './auth-context';

interface PatientDataContextType {
  patient: User | null;
  loading: boolean;
  error: Error | null;
}

const PatientDataContext = createContext<PatientDataContextType>({
  patient: null,
  loading: true,
  error: null,
});

export const PatientDataProvider = ({ userId, children }: { userId: string, children: React.ReactNode }) => {
  const { user: authUser } = useAuth(); // Get the full user object from auth context
  const [patient, setPatient] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId || !authUser) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        let patientData = await getUser(userId);
        if (!patientData) {
          // If no data, initialize with data from Auth context
          console.log('No patient data found, initializing new profile...');
          const newPatientData: User = {
            ...mockPatient,
            name: authUser.displayName || 'New User',
            email: authUser.email || '',
            avatarUrl: authUser.photoURL || 'https://placehold.co/100x100.png',
            role: 'patient', // Default role for new sign-ups
          };
          await initializeUserData(userId, newPatientData);
          patientData = await getUser(userId); // Re-fetch after creation
        }
        setPatient(patientData);
      } catch (err) {
        setError(err as Error);
        console.error("Failed to fetch patient data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, authUser]);

  return (
    <PatientDataContext.Provider value={{ patient, loading, error }}>
      {children}
    </PatientDataContext.Provider>
  );
};

export const usePatientData = () => useContext(PatientDataContext);
