import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, writeBatch, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
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
    role: userData.role || 'patient',
    doctorId: userData.doctorId,
  } as Patient;
}

export async function getPatientsForDoctor(doctorId: string): Promise<(Patient & { id: string })[]> {
    if (!db) return [];

    const q = query(collection(db, 'users'), where('doctorId', '==', doctorId));
    const querySnapshot = await getDocs(q);

    const patients: (Patient & { id: string })[] = [];
    querySnapshot.forEach((doc) => {
        patients.push({
            id: doc.id,
            ...(doc.data() as Patient)
        });
    });

    return patients;
}


export async function initializePatientData(userId: string, patientData: Patient): Promise<void> {
  if (!db) return;
  const userDocRef = doc(db, 'users', userId);
  const batch = writeBatch(db);

  const userData = {
    ...patientData,
    notificationPreferences: patientData.notificationPreferences || defaultNotificationPreferences,
    role: patientData.role || 'patient',
  };

  batch.set(userDocRef, userData);

  await batch.commit();
}

export async function updatePatientProfile(userId: string, data: Partial<Patient>): Promise<void> {
  if (!db) return;
  const userDocRef = doc(db, 'users', userId);
  await updateDoc(userDocRef, data);
}
