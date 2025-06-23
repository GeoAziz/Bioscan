
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import type { User, NotificationPreferences } from '@/lib/types';
import { getAuth } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const defaultNotificationPreferences: NotificationPreferences = {
  highPriorityAlerts: true,
  newRecommendations: false,
};

export async function getUser(userId: string): Promise<User | null> {
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
    role: userData.role || 'patient',
    // Patient specific fields
    devices: userData.devices || [],
    vitals: userData.vitals || [],
    notificationPreferences: userData.notificationPreferences || defaultNotificationPreferences,
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

export async function getAllUsers(): Promise<(User & { id: string })[]> {
    if (!db) {
        throw new Error("Database not available.");
    }
    
    // Security for this action is handled by Firestore Security Rules.
    // The rules should ensure that only a user with the 'admin' role can
    // read the entire 'users' collection. A client-side check is redundant
    // and problematic in Server Actions where `auth.currentUser` is null.

    const querySnapshot = await getDocs(collection(db, 'users'));
    const users: (User & { id: string })[] = [];
    querySnapshot.forEach((doc) => {
        users.push({
            id: doc.id,
            ...(doc.data() as User)
        });
    });

    return users;
}


export async function initializeUserData(userId: string, userData: User): Promise<void> {
  if (!db) return;
  const userDocRef = doc(db, 'users', userId);
  
  const initialData = {
    ...userData,
    role: userData.role || 'patient',
    // Ensure patient-specific fields are only added for patients
    ...(userData.role === 'patient' && {
        notificationPreferences: userData.notificationPreferences || defaultNotificationPreferences,
        vitals: userData.vitals || [],
        devices: userData.devices || [],
    }),
  };

  await setDoc(userDocRef, initialData, { merge: true });
}

export async function updateUserProfile(userId: string, data: Partial<User>): Promise<void> {
  if (!db) return;
  const userDocRef = doc(db, 'users', userId);
  await updateDoc(userDocRef, data);
}
