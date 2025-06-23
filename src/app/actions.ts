'use server'
import { triageEmergency, TriageEmergencyInput, TriageEmergencyOutput } from '@/ai/flows/triage-emergency'

export async function handleEmergencyTriage(patientVitals: TriageEmergencyInput): Promise<TriageEmergencyOutput | { error: string }> {
  try {
    const result = await triageEmergency(patientVitals);
    return result;
  } catch (error) {
    console.error('Error during emergency triage:', error);
    return { error: 'Failed to get triage recommendation. The AI model may be unavailable.' };
  }
}
