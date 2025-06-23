/**
 * @fileoverview This script populates the Firestore database and Firebase Auth with mock users.
 * It creates one doctor and multiple patients with pre-defined email/password credentials.
 *
 * To run this script, use the command: `npm run db:populate`
 *
 * It uses the Firebase Admin SDK, which requires a service account key.
 * Ensure your `google-application-credentials.json` file is present in the project root.
 */

import admin from 'firebase-admin';
import type { Patient, Vital, Device } from '@/lib/types';
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

const mockUsers: Omit<Patient, 'vitals'>[] = [
  {
    email: 'doctor@bioscan.io',
    name: 'Dr. Eleanor Vance',
    avatarUrl: 'https://placehold.co/100x100.png',
    devices: mockDevices,
    notificationPreferences: { highPriorityAlerts: true, newRecommendations: false },
    role: 'doctor',
  },
  {
    email: 'marcus@bioscan.io',
    name: 'Marcus Thorne',
    avatarUrl: 'https://placehold.co/100x100.png',
    devices: mockDevices.slice(0, 2),
    notificationPreferences: { highPriorityAlerts: true, newRecommendations: true },
    role: 'patient',
  },
  {
    email: 'isabelle@bioscan.io',
    name: 'Isabelle Rossi',
    avatarUrl: 'https://placehold.co/100x100.png',
    devices: mockDevices,
    notificationPreferences: { highPriorityAlerts: false, newRecommendations: true },
    role: 'patient',
  },
];

async function populateDatabase() {
  console.log('Starting database and auth population...');
  const password = 'password123';
  let doctorId = '';

  // Create the doctor first
  const doctorData = mockUsers[0];
  try {
    console.log(`  -> Creating auth user for DOCTOR: ${doctorData.email}`);
    const doctorAuthRecord = await auth.createUser({
      email: doctorData.email,
      password: password,
      displayName: doctorData.name,
      photoURL: doctorData.avatarUrl,
    });
    doctorId = doctorAuthRecord.uid;
    console.log(`     Auth user created with UID: ${doctorId}`);

    const doctorFirestoreData: Patient = {
      ...doctorData,
      vitals: generateVitals(168),
    };
    await db.collection('users').doc(doctorId).set(doctorFirestoreData);
    console.log(`     Firestore profile created for ${doctorData.name}`);

  } catch (error: any) {
    if (error.code === 'auth/email-already-exists') {
      console.log(`     Auth user ${doctorData.email} already exists. Fetching UID.`);
      const existingUser = await auth.getUserByEmail(doctorData.email);
      doctorId = existingUser.uid;
    } else {
      console.error(`❌ Error creating doctor ${doctorData.email}:`, error);
      return; // Stop if doctor creation fails
    }
  }

  // Create the patients
  const patientUsers = mockUsers.slice(1);
  for (const patientData of patientUsers) {
    try {
      console.log(`  -> Creating auth user for PATIENT: ${patientData.email}`);
      const patientAuthRecord = await auth.createUser({
        email: patientData.email,
        password: password,
        displayName: patientData.name,
        photoURL: patientData.avatarUrl,
      });
      const patientId = patientAuthRecord.uid;
      console.log(`     Auth user created with UID: ${patientId}`);

      const patientFirestoreData: Patient = {
        ...patientData,
        vitals: generateVitals(168),
        doctorId: doctorId,
      };
      await db.collection('users').doc(patientId).set(patientFirestoreData);
      console.log(`     Firestore profile for ${patientData.name} created and assigned to Dr. Vance.`);

    } catch (error: any) {
      if (error.code === 'auth/email-already-exists') {
        console.log(`     Auth user ${patientData.email} already exists. Skipping.`);
      } else {
        console.error(`❌ Error creating patient ${patientData.email}:`, error);
      }
    }
  }

  console.log(`\n✅ Success! Populated database and auth with ${mockUsers.length} mock users.`);
  console.log("You can now log in with the following credentials:");
  console.log("  Doctor: doctor@bioscan.io / password123");
  console.log("  Patient: marcus@bioscan.io / password123");
}

populateDatabase();
