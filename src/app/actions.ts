
'use server'
import { triageEmergency, TriageEmergencyInput, TriageEmergencyOutput } from '@/ai/flows/triage-emergency'
import { summarizeTimeline, SummarizeTimelineInput, SummarizeTimelineOutput } from '@/ai/flows/summarize-timeline';
import { generateRecommendation, GenerateRecommendationInput, GenerateRecommendationOutput } from '@/ai/flows/generate-recommendation-from-vitals';
import { updateUserProfile, getPatientsForDoctor, initializeUserData, getAllUsers } from '@/services/user-service';
import type { User } from '@/lib/types';
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
  data: Partial<User>
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!userId) {
        throw new Error("User not authenticated.");
    }
    await updateUserProfile(userId, data);
    return { success: true };
  } catch (error) {
    console.error('Error updating profile:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update profile.';
    return { success: false, error: errorMessage };
  }
}

export async function handleGetPatientsForDoctor(doctorId: string): Promise<{ patients: (User & { id: string })[] } | { error: string }> {
    try {
        const patients = await getPatientsForDoctor(doctorId);
        return { patients };
    } catch (error) {
        console.error('Error fetching patients for doctor:', error);
        return { error: 'Failed to fetch patient list.' };
    }
}

export async function handleGetAllUsers(): Promise<{ users: (User & { id: string })[] } | { error: string }> {
    try {
        const users = await getAllUsers();
        return { users };
    } catch (error) {
        console.error('Error fetching all users:', error);
        return { error: 'Failed to fetch user list. You may not have admin permissions.' };
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
    const newUser: User = {
      ...mockPatient,
      name: userData.name,
      email: userData.email || '',
      avatarUrl: userData.avatarUrl || 'https://placehold.co/100x100.png',
      role: 'patient',
    };
    await initializeUserData(userData.uid, newUser);
    return { success: true };
  } catch (error) {
    console.error('Error creating user profile:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create user profile.';
    return { success: false, error: errorMessage };
  }
}
