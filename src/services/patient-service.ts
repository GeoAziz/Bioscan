import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, writeBatch, collection } from 'firebase/firestore';
import type { Patient } from '@/lib/types';

export async function getPatient(userId: string): Promise<Patient | null> {
  const userDocRef = doc(db, 'users', userId);
  const userDocSnap = await getDoc(userDocRef);

  if (!userDocSnap.exists()) {
    return null;
  }

  const userData = userDocSnap.data() as Omit<Patient, 'vitals' | 'devices'>;

  // For simplicity, we'll store vitals and devices in the same document.
  // In a real-world scenario with many vitals, a subcollection would be better.
  return {
    name: userData.name,
    avatarUrl: userData.avatarUrl,
    devices: (userData as any).devices || [],
    vitals: (userData as any).vitals || [],
  };
}

export async function initializePatientData(userId: string, patientData: Patient): Promise<void> {
  const userDocRef = doc(db, 'users', userId);
  const batch = writeBatch(db);

  const userData = {
    name: patientData.name,
    avatarUrl: patientData.avatarUrl,
    devices: patientData.devices,
    vitals: patientData.vitals,
  };

  batch.set(userDocRef, userData);

  await batch.commit();
}
