'use server'
import { triageEmergency, TriageEmergencyInput, TriageEmergencyOutput } from '@/ai/flows/triage-emergency'
import { summarizeTimeline, SummarizeTimelineInput, SummarizeTimelineOutput } from '@/ai/flows/summarize-timeline';
import { generateRecommendation, GenerateRecommendationInput, GenerateRecommendationOutput } from '@/ai/flows/generate-recommendation-from-vitals';
import { updatePatientProfile } from '@/services/patient-service';
import type { Patient } from '@/lib/types';

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