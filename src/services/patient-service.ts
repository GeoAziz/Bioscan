import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, writeBatch, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import type { User, NotificationPreferences } from '@/lib/types';

const defaultNotificationPreferences: NotificationPreferences = {
  highPriorityAlerts: true,
  newRecommendations: false,
};

export async function getPatient(userId: string): Promise<User | null> {
  if (!db) return null;
  const userDocRef = doc(db, 'users', userId);
  const userDocSnap = await getDoc(userDocRef);

  if (!userDocSnap.exists()) {
    return null;
  }

  const userData = userDocSnap.data();

  return {
    name: userData.name,
    email: userData.email,
    avatarUrl: userData.avatarUrl,
    devices: userData.devices || [],
    vitals: userData.vitals || [],
    notificationPreferences: userData.notificationPreferences || defaultNotificationPreferences,
    role: userData.role || 'patient',
    doctorId: userData.doctorId,
  } as User;
}

export async function getPatientsForDoctor(doctorId: string): Promise<(User & { id: string })[]> {
    if (!db) return [];

    const q = query(collection(db, 'users'), where('doctorId', '==', doctorId));
    const querySnapshot = await getDocs(q);

    const patients: (User & { id: string })[] = [];
    querySnapshot.forEach((doc) => {
        patients.push({
            id: doc.id,
            ...(doc.data() as User)
        });
    });

    return patients;
}


export async function initializePatientData(userId: string, patientData: User): Promise<void> {
  if (!db) return;
  const userDocRef = doc(db, 'users', userId);
  
  // Ensure we don't accidentally overwrite vitals or devices with empty arrays
  // if they are already being populated by the mock script.
  const initialData = {
    ...patientData,
    notificationPreferences: patientData.notificationPreferences || defaultNotificationPreferences,
    role: patientData.role || 'patient',
    vitals: patientData.vitals || [],
    devices: patientData.devices || [],
  };

  await setDoc(userDocRef, initialData);
}

export async function updatePatientProfile(userId: string, data: Partial<User>): Promise<void> {
  if (!db) return;
  const userDocRef = doc(db, 'users', userId);
  await updateDoc(userDocRef, data);
}
