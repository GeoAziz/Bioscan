'use server'
import { triageEmergency, TriageEmergencyInput, TriageEmergencyOutput } from '@/ai/flows/triage-emergency'
import { summarizeTimeline, SummarizeTimelineInput, SummarizeTimelineOutput } from '@/ai/flows/summarize-timeline';
import { generateRecommendation, GenerateRecommendationInput, GenerateRecommendationOutput } from '@/ai/flows/generate-recommendation-from-vitals';

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
