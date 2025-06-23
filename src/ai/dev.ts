import { config } from 'dotenv';
config();

import '@/ai/flows/triage-emergency.ts';
import '@/ai/flows/generate-recommendation-from-vitals.ts';
import '@/ai/flows/summarize-timeline.ts';