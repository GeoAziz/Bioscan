// triage-emergency.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow for AI triage of patient data in emergency situations.
 *
 * - triageEmergency - A function that takes patient vitals and returns AI-driven recommendations.
 * - TriageEmergencyInput - The input type for the triageEmergency function.
 * - TriageEmergencyOutput - The return type for the triageEmergency function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TriageEmergencyInputSchema = z.object({
  patientVitals: z.string().describe('A JSON string containing the patient vitals data, including heart rate, temperature, oxygen level, blood pressure, and ECG readings.'),
  patientHistory: z.string().optional().describe('A summary of the patient medical history, including any pre-existing conditions or allergies.'),
  patientNotes: z.string().optional().describe('Any additional notes or observations about the patient.'),
});
export type TriageEmergencyInput = z.infer<typeof TriageEmergencyInputSchema>;

const TriageEmergencyOutputSchema = z.object({
  recommendation: z.string().describe('An AI-driven recommendation for the patient, such as \"Take a rest,\" \"Contact physician,\" or \"Dispatch activated.\"'),
  priority: z.enum(['High', 'Medium', 'Low']).describe('The priority of the case, indicating the urgency of the situation.'),
  explanation: z.string().describe('A brief explanation of why the recommendation was made and the priority assigned.'),
});
export type TriageEmergencyOutput = z.infer<typeof TriageEmergencyOutputSchema>;

export async function triageEmergency(input: TriageEmergencyInput): Promise<TriageEmergencyOutput> {
  return triageEmergencyFlow(input);
}

const triageEmergencyPrompt = ai.definePrompt({
  name: 'triageEmergencyPrompt',
  input: {schema: TriageEmergencyInputSchema},
  output: {schema: TriageEmergencyOutputSchema},
  prompt: `You are Zizo_MediAI, an AI triage assistant for doctors.

You are provided with patient vitals, medical history, and notes. Your task is to analyze this information and provide a recommendation, priority, and explanation.

Patient Vitals: {{{patientVitals}}}
Patient History: {{{patientHistory}}}
Patient Notes: {{{patientNotes}}}

Based on this information, provide a recommendation, assign a priority (High, Medium, or Low), and explain your reasoning.

Ensure that the recommendation is clear and actionable. The priority should reflect the urgency of the situation.

Format your output as a JSON object with the following fields:
- recommendation: An AI-driven recommendation for the patient.
- priority: The priority of the case (High, Medium, or Low).
- explanation: A brief explanation of why the recommendation was made and the priority assigned.
`,
});

const triageEmergencyFlow = ai.defineFlow(
  {
    name: 'triageEmergencyFlow',
    inputSchema: TriageEmergencyInputSchema,
    outputSchema: TriageEmergencyOutputSchema,
  },
  async input => {
    const {output} = await triageEmergencyPrompt(input);
    return output!;
  }
);
