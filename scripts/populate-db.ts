
/**
 * @fileoverview This script populates the Firestore database and Firebase Auth with mock users.
 * It creates one admin, one doctor, and multiple patients with pre-defined email/password credentials.
 *
 * To run this script, use the command: `npm run db:populate`
 *
 * It uses the Firebase Admin SDK, which requires a service account key.
 * Ensure your `google-application-credentials.json` file is present in the project root.
 */

import admin from 'firebase-admin';
import type { User, Vital, Device } from '@/lib/types';
import serviceAccount from '../google-application-credentials.json';

// Initialize Firebase Admin SDK
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
  });
} catch (error: any) {
  if (error.code !== 'app/duplicate-app') {
    throw error;
  }
}

const db = admin.firestore();
const auth = admin.auth();

// --- Mock Data Generation ---

const generateVitals = (numEntries: number): Vital[] => {
  const vitals: Vital[] = [];
  const now = new Date();
  for (let i = numEntries - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000); // Hourly readings
    vitals.push({
      time: time.toISOString(),
      heartRate: 60 + Math.floor(Math.random() * 25) - 10,
      temperature: 36.5 + (Math.random() * 2 - 1),
      oxygenSaturation: 95 + Math.floor(Math.random() * 5),
      bloodPressure: {
        systolic: 110 + Math.floor(Math.random() * 20) - 10,
        diastolic: 70 + Math.floor(Math.random() * 20) - 10,
      },
    });
  }
  return vitals;
};

const mockDevices: Device[] = [
    { id: 'sw01', name: 'SmartWatch 7', battery: 82, signal: 'strong', lastSync: '2m ago' },
    { id: 'sp02', name: 'SmartPatch+', battery: 95, signal: 'strong', lastSync: '1m ago' },
    { id: 'si03', name: 'Neural-Implant X', battery: 100, signal: 'strong', lastSync: '<1m ago' },
];

const mockUsers: Omit<User, 'vitals' | 'devices' | 'notificationPreferences' | 'doctorId'>[] = [
  {
    email: 'admin@bioscan.io',
    name: 'Admin User',
    avatarUrl: 'https://placehold.co/100x100.png',
    role: 'admin',
  },
  {
    email: 'doctor@bioscan.io',
    name: 'Dr. Eleanor Vance',
    avatarUrl: 'https://placehold.co/100x100.png',
    role: 'doctor',
  },
  {
    email: 'marcus@bioscan.io',
    name: 'Marcus Thorne',
    avatarUrl: 'https://placehold.co/100x100.png',
    role: 'patient',
  },
  {
    email: 'isabelle@bioscan.io',
    name: 'Isabelle Rossi',
    avatarUrl: 'https://placehold.co/100x100.png',
    role: 'patient',
  },
];

async function populateDatabase() {
  console.log('Starting database and auth population...');
  const password = 'password123';
  let doctorId = '';

  for (const userData of mockUsers) {
    try {
      console.log(`  -> Creating auth user for ${userData.role.toUpperCase()}: ${userData.email}`);
      const userAuthRecord = await auth.createUser({
        email: userData.email,
        password: password,
        displayName: userData.name,
        photoURL: userData.avatarUrl,
      });
      const userId = userAuthRecord.uid;
      console.log(`     Auth user created with UID: ${userId}`);

      if (userData.role === 'doctor') {
        doctorId = userId;
      }

      const userFirestoreData: Partial<User> = {
        ...userData
      };
      
      if (userData.role === 'patient') {
        userFirestoreData.vitals = generateVitals(168);
        userFirestoreData.devices = mockDevices;
        userFirestoreData.notificationPreferences = { highPriorityAlerts: true, newRecommendations: true };
        if (doctorId) {
            userFirestoreData.doctorId = doctorId;
        }
      }

      await db.collection('users').doc(userId).set(userFirestoreData);
      console.log(`     Firestore profile created for ${userData.name}`);

    } catch (error: any) {
      if (error.code === 'auth/email-already-exists') {
        console.log(`     Auth user ${userData.email} already exists. Fetching info.`);
        const existingUser = await auth.getUserByEmail(userData.email);
        if(userData.role === 'doctor') {
            doctorId = existingUser.uid;
        }
        // If doctor already exists, we need to assign existing patients to them.
        if (doctorId) {
            const userDoc = await db.collection('users').doc(existingUser.uid).get();
            if (userDoc.exists && userDoc.data()?.role === 'patient' && !userDoc.data()?.doctorId) {
                await db.collection('users').doc(existingUser.uid).update({ doctorId: doctorId });
                console.log(`     Assigned patient ${userData.name} to doctor.`);
            }
        }
      } else {
        console.error(`❌ Error creating user ${userData.email}:`, error);
      }
    }
  }

  console.log(`\n✅ Success! Populated database and auth with ${mockUsers.length} mock users.`);
  console.log("You can now log in with the following credentials:");
  console.log("  Admin:   admin@bioscan.io / password123");
  console.log("  Doctor:  doctor@bioscan.io / password123");
  console.log("  Patient: marcus@bioscan.io / password123");
}

populateDatabase();
