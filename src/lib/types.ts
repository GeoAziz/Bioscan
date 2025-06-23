export interface Vital {
  time: string;
  heartRate: number;
  temperature: number;
  oxygenSaturation: number;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
}

export interface Device {
  id: string;
  name: string;
  battery: number;
  signal: 'strong' | 'medium' | 'weak';
  lastSync: string;
}

export interface NotificationPreferences {
  highPriorityAlerts: boolean;
  newRecommendations: boolean;
}

export interface Patient {
  name: string;
  avatarUrl: string;
  devices: Device[];
  vitals: Vital[];
  notificationPreferences?: NotificationPreferences;
  role: 'patient' | 'doctor';
  doctorId?: string;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  timestamp: string;
}

export type TriageResult = {
  recommendation: string;
  priority: 'High' | 'Medium' | 'Low';
  explanation: string;
  error?: undefined;
} | {
  error: string;
  recommendation?: undefined;
  priority?: undefined;
  explanation?: undefined;
} | null;

export type RecommendationResult = {
  recommendation: string;
  urgency: 'low' | 'medium' | 'high';
  error?: undefined;
} | {
  error: string;
  recommendation?: undefined;
  urgency?: undefined;
} | null;
