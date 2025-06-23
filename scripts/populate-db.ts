/**
 * @fileoverview This script populates the Firestore database with mock user and patient data.
 *
 * To run this script, use the command: `npm run db:populate`
 *
 * It uses the Firebase Admin SDK, which requires a service account key.
 * Ensure your `google-application-credentials.json` file is present in the project root.
 * The Admin SDK bypasses security rules, allowing it to write data for multiple users.
 */

import admin from 'firebase-admin';
import type { Patient, Vital, Device } from '@/lib/types';
import { serviceAccount } from '../google-application-credentials.json';

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
    {
      id: 'sw01',
      name: 'SmartWatch 7',
      battery: 82,
      signal: 'strong',
      lastSync: '2m ago',
    },
    {
      id: 'sp02',
      name: 'SmartPatch+',
      battery: 95,
      signal: 'strong',
      lastSync: '1m ago',
    },
    {
      id: 'si03',
      name: 'Neural-Implant X',
      battery: 100,
      signal: 'strong',
      lastSync: '<1m ago',
    },
];

const mockUsers: Omit<Patient, 'vitals'>[] = [
  {
    name: 'Eleanor Vance',
    avatarUrl: 'https://placehold.co/100x100.png',
    devices: mockDevices,
    notificationPreferences: { highPriorityAlerts: true, newRecommendations: false },
  },
  {
    name: 'Marcus Thorne',
    avatarUrl: 'https://placehold.co/100x100.png',
    devices: mockDevices.slice(0,2),
    notificationPreferences: { highPriorityAlerts: true, newRecommendations: true },
  },
  {
    name: 'Isabelle Rossi',
    avatarUrl: 'https://placehold.co/100x100.png',
    devices: mockDevices,
    notificationPreferences: { highPriorityAlerts: false, newRecommendations: true },
  },
  {
    name: 'Julian Navarro',
    avatarUrl: 'https://placehold.co/100x100.png',
    devices: mockDevices.slice(1,3),
    notificationPreferences: { highPriorityAlerts: true, newRecommendations: false },
  },
  {
    name: 'Sofia Chen',
    avatarUrl: 'https://placehold.co/100x100.png',
    devices: mockDevices,
    notificationPreferences: { highPriorityAlerts: false, newRecommendations: false },
  }
];


async function populateDatabase() {
  console.log('Starting database population...');

  const batch = db.batch();
  let userCount = 0;

  for (const user of mockUsers) {
    const userId = `mock-user-${Math.random().toString(36).substring(2, 15)}`;
    console.log(`  -> Preparing data for ${user.name} (ID: ${userId})`);
    
    const userDocRef = db.collection('users').doc(userId);
    
    const patientData: Patient = {
      ...user,
      vitals: generateVitals(168), // 168 hours = 7 days of hourly data
    };

    batch.set(userDocRef, patientData);
    userCount++;
  }

  try {
    await batch.commit();
    console.log(`\n✅ Success! Populated database with ${userCount} mock users.`);
    console.log("Each user has 7 days of hourly vital sign data.");
    console.log("You can now go to your Firebase Console to see the new data in the 'users' collection.");

  } catch (error) {
    console.error('❌ Error committing batch:', error);
  }
}

populateDatabase();
