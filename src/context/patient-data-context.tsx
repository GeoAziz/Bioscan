'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Patient } from '@/lib/types';
import { getPatient, initializePatientData } from '@/services/patient-service';
import { mockPatient } from '@/lib/mock-data';
import { auth } from '@/lib/firebase';

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
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId || !auth) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        let patientData = await getPatient(userId);
        if (!patientData) {
          // If no data, initialize with mock data
          const newPatientData: Patient = {
            ...mockPatient,
            name: auth.currentUser?.displayName || 'New User',
            avatarUrl: auth.currentUser?.photoURL || mockPatient.avatarUrl,
            role: 'patient', // Default role for new sign-ups
          };
          await initializePatientData(userId, newPatientData);
          patientData = await getPatient(userId);
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
  }, [userId]);

  return (
    <PatientDataContext.Provider value={{ patient, loading, error }}>
      {children}
    </PatientDataContext.Provider>
  );
};

export const usePatientData = () => useContext(PatientDataContext);
