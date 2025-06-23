'use server'
import { triageEmergency, TriageEmergencyInput, TriageEmergencyOutput } from '@/ai/flows/triage-emergency'
import { summarizeTimeline, SummarizeTimelineInput, SummarizeTimelineOutput } from '@/ai/flows/summarize-timeline';
import { generateRecommendation, GenerateRecommendationInput, GenerateRecommendationOutput } from '@/ai/flows/generate-recommendation-from-vitals';
import { updatePatientProfile, getPatientsForDoctor, initializePatientData } from '@/services/patient-service';
import type { Patient } from '@/lib/types';
import { mockPatient } from '@/lib/mock-data';

export async function handleEmergencyTriage(patientVitals: TriageEmergencyInput): Promise<TriageEmergencyOutput | { error: string }> {
  try {
    const result = await triageEmergency(patientVitals);
    return result;
  } catch (error) {
    console.error('Error during emergency triage:', error);
    return { error: 'Failed to get triage recommendation. The AI model may be unavailable.' };
  }
}

export async function handleSummarizeTimeline(input: SummarizeTimelineInput): Promise<SummarizeTimelineOutput | { error: string }> {
  try {
    const result = await summarizeTimeline(input);
    return result;
  } catch (error) {
    console.error('Error during timeline summarization:', error);
    return { error: 'Failed to get timeline summary. The AI model may be unavailable.' };
  }
}

export async function handleGenerateRecommendation(input: GenerateRecommendationInput): Promise<GenerateRecommendationOutput | { error: string }> {
  try {
    const result = await generateRecommendation(input);
    return result;
  } catch (error) {
    console.error('Error during recommendation generation:', error);
    return { error: 'Failed to get recommendation. The AI model may be unavailable.' };
  }
}

export async function handleUpdateProfile(
  userId: string, 
  data: Partial<Patient>
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!userId) {
        throw new Error("User not authenticated.");
    }
    await updatePatientProfile(userId, data);
    return { success: true };
  } catch (error) {
    console.error('Error updating profile:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update profile.';
    return { success: false, error: errorMessage };
  }
}

export async function handleGetPatientsForDoctor(doctorId: string): Promise<{ patients: (Patient & { id: string })[] } | { error: string }> {
    try {
        const patients = await getPatientsForDoctor(doctorId);
        return { patients };
    } catch (error) {
        console.error('Error fetching patients for doctor:', error);
        return { error: 'Failed to fetch patient list.' };
    }
}

export async function handleCreateUserProfile(userData: {
  uid: string;
  name: string;
  email: string | null;
  avatarUrl: string | null;
}): Promise<{ success: boolean; error?: string }> {
  try {
    if (!userData.uid) {
      throw new Error("User ID is missing.");
    }
    const newPatientData: Patient = {
      ...mockPatient,
      name: userData.name,
      email: userData.email || '',
      avatarUrl: userData.avatarUrl || mockPatient.avatarUrl,
      role: 'patient',
    };
    await initializePatientData(userData.uid, newPatientData);
    return { success: true };
  } catch (error) {
    console.error('Error creating user profile:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create user profile.';
    return { success: false, error: errorMessage };
  }
}
