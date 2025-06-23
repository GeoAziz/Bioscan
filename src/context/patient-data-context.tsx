'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Patient } from '@/lib/types';
import { getPatient, initializePatientData } from '@/services/patient-service';
import { mockPatient } from '@/lib/mock-data';
import { useAuth } from './auth-context';

interface PatientDataContextType {
  patient: Patient | null;
  loading: boolean;
  error: Error | null;
}

const PatientDataContext = createContext<PatientDataContextType>({
  patient: null,
  loading: true,
  error: null,
});

export const PatientDataProvider = ({ userId, children }: { userId: string, children: React.ReactNode }) => {
  const { user } = useAuth(); // Get the full user object from auth context
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId || !user) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        let patientData = await getPatient(userId);
        if (!patientData) {
          // If no data, initialize with data from Auth context
          console.log('No patient data found, initializing new profile...');
          const newPatientData: Patient = {
            ...mockPatient,
            name: user.displayName || 'New User',
            email: user.email || '',
            avatarUrl: user.photoURL || mockPatient.avatarUrl,
            role: 'patient', // Default role for new sign-ups
          };
          await initializePatientData(userId, newPatientData);
          patientData = await getPatient(userId); // Re-fetch after creation
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
  }, [userId, user]);

  return (
    <PatientDataContext.Provider value={{ patient, loading, error }}>
      {children}
    </PatientDataContext.Provider>
  );
};

export const usePatientData = () => useContext(PatientDataContext);
