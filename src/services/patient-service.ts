import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, writeBatch, updateDoc } from 'firebase/firestore';
import type { Patient, NotificationPreferences } from '@/lib/types';

const defaultNotificationPreferences: NotificationPreferences = {
  highPriorityAlerts: true,
  newRecommendations: false,
};

export async function getPatient(userId: string): Promise<Patient | null> {
  if (!db) return null;
  const userDocRef = doc(db, 'users', userId);
  const userDocSnap = await getDoc(userDocRef);

  if (!userDocSnap.exists()) {
    return null;
  }

  const userData = userDocSnap.data();

  return {
    name: userData.name,
    avatarUrl: userData.avatarUrl,
    devices: userData.devices || [],
    vitals: userData.vitals || [],
    notificationPreferences: userData.notificationPreferences || defaultNotificationPreferences,
  } as Patient;
}

export async function initializePatientData(userId: string, patientData: Patient): Promise<void> {
  if (!db) return;
  const userDocRef = doc(db, 'users', userId);
  const batch = writeBatch(db);

  const userData = {
    ...patientData,
    notificationPreferences: patientData.notificationPreferences || defaultNotificationPreferences
  };

  batch.set(userDocRef, userData);

  await batch.commit();
}

export async function updatePatientProfile(userId: string, data: Partial<Patient>): Promise<void> {
  if (!db) return;
  const userDocRef = doc(db, 'users', userId);
  await updateDoc(userDocRef, data);
}
