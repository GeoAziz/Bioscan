'use server';
/**
 * @fileOverview An AI agent that generates recommendations based on abnormal vitals.
 *
 * - generateRecommendation - A function that generates a recommendation based on vitals.
 * - GenerateRecommendationInput - The input type for the generateRecommendation function.
 * - GenerateRecommendationOutput - The return type for the generateRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRecommendationInputSchema = z.object({
  heartRate: z.number().describe('The patient\'s heart rate in BPM.'),
  temperature: z.number().describe('The patient\'s body temperature in degrees Celsius.'),
  oxygenSaturation: z.number().describe('The patient\'s oxygen saturation percentage.'),
  bloodPressureSystolic: z.number().describe('The patient\'s systolic blood pressure.'),
  bloodPressureDiastolic: z.number().describe('The patient\'s diastolic blood pressure.'),
  ecgReading: z.string().describe('A summary of the patient\'s ECG reading.'),
});
export type GenerateRecommendationInput = z.infer<typeof GenerateRecommendationInputSchema>;

const GenerateRecommendationOutputSchema = z.object({
  recommendation: z.string().describe('The AI-generated recommendation for the patient.'),
  urgency: z.enum(['low', 'medium', 'high']).describe('The urgency of the recommendation.'),
});
export type GenerateRecommendationOutput = z.infer<typeof GenerateRecommendationOutputSchema>;

export async function generateRecommendation(input: GenerateRecommendationInput): Promise<GenerateRecommendationOutput> {
  return generateRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecommendationPrompt',
  input: {schema: GenerateRecommendationInputSchema},
  output: {schema: GenerateRecommendationOutputSchema},
  prompt: `You are an AI health assistant that provides recommendations to patients based on their vital signs.

  Given the following vital signs, generate a recommendation for the patient. Include an assessment of the urgency of the recommendation (low, medium, or high).

  Heart Rate: {{{heartRate}}} BPM
  Temperature: {{{temperature}}} °C
  Oxygen Saturation: {{{oxygenSaturation}}}%
  Blood Pressure: {{{bloodPressureSystolic}}}/{{{bloodPressureDiastolic}}} mmHg
  ECG Reading: {{{ecgReading}}}

  Consider the following when generating the recommendation:
  - Normal ranges for vital signs
  - Potential causes of abnormal vital signs
  - Appropriate actions for the patient to take

  Format the recommendation to be concise and easy to understand.  If the vitals are within normal limits, recommend that the patient continue to monitor their health.`,
});

const generateRecommendationFlow = ai.defineFlow(
  {
    name: 'generateRecommendationFlow',
    inputSchema: GenerateRecommendationInputSchema,
    outputSchema: GenerateRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
