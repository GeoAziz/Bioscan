import type { Patient, Vital } from './types';

const generateVitals = (): Vital[] => {
  const vitals: Vital[] = [];
  const now = new Date();
  for (let i = 24; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    vitals.push({
      time: time.toISOString(),
      heartRate: 60 + Math.floor(Math.random() * 25) - 10, // 50-85
      temperature: 36.5 + (Math.random() * 2 - 1), // 35.5 - 37.5
      oxygenSaturation: 95 + Math.floor(Math.random() * 5), // 95-99
      bloodPressure: {
        systolic: 110 + Math.floor(Math.random() * 20) - 10, // 100-130
        diastolic: 70 + Math.floor(Math.random() * 20) - 10, // 60-90
      },
    });
  }
  return vitals;
};

export const mockPatient: Patient = {
  name: 'Alex Ryder',
  avatarUrl: 'https://placehold.co/100x100.png',
  devices: [
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
  ],
  vitals: generateVitals(),
  notificationPreferences: {
    highPriorityAlerts: true,
    newRecommendations: false,
  },
};
