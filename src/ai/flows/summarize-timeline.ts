// SummarizeTimeline: Generates a summary of changes in vitals over a selected time period for a patient.
// Includes functions for summarizing the timeline and defining input/output schemas.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeTimelineInputSchema = z.object({
  vitalsData: z.string().describe('The vital signs data in JSON format.'),
  startTime: z.string().describe('The start time of the period to summarize.'),
  endTime: z.string().describe('The end time of the period to summarize.'),
});
export type SummarizeTimelineInput = z.infer<typeof SummarizeTimelineInputSchema>;

const SummarizeTimelineOutputSchema = z.object({
  summary: z.string().describe('A summary of what changed in the vitals and potential reasons for those changes.'),
});
export type SummarizeTimelineOutput = z.infer<typeof SummarizeTimelineOutputSchema>;

export async function summarizeTimeline(input: SummarizeTimelineInput): Promise<SummarizeTimelineOutput> {
  return summarizeTimelineFlow(input);
}

const summarizeTimelinePrompt = ai.definePrompt({
  name: 'summarizeTimelinePrompt',
  input: {schema: SummarizeTimelineInputSchema},
  output: {schema: SummarizeTimelineOutputSchema},
  prompt: `You are a medical AI assistant tasked with summarizing changes in a patient's vital signs over a specific period.\n\nYou will receive vital signs data, a start time, and an end time. Analyze the data to identify significant changes and provide a summary of what changed and possible reasons for those changes. Consider potential correlations between different vital signs.\n\nVitals Data: {{{vitalsData}}}\nStart Time: {{{startTime}}}\nEnd Time: {{{endTime}}}\n\nSummary: `,
});

const summarizeTimelineFlow = ai.defineFlow(
  {
    name: 'summarizeTimelineFlow',
    inputSchema: SummarizeTimelineInputSchema,
    outputSchema: SummarizeTimelineOutputSchema,
  },
  async input => {
    const {output} = await summarizeTimelinePrompt(input);
    return output!;
  }
);
