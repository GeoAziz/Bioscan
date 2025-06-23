'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Siren, Sparkles } from 'lucide-react';
import { handleEmergencyTriage } from '@/app/actions';
import { mockPatient } from '@/lib/mock-data';
import type { TriageResult } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function AlertsPanel() {
  const [isLoading, setIsLoading] = useState(false);
  const [triageResult, setTriageResult] = useState<TriageResult>(null);
  const { toast } = useToast();

  const onTriage = async () => {
    setIsLoading(true);
    setTriageResult(null);

    const latestVitals = mockPatient.vitals[mockPatient.vitals.length - 1];
    const patientVitals = JSON.stringify(latestVitals);

    const result = await handleEmergencyTriage({ patientVitals });

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Triage Error',
        description: result.error,
      });
    } else {
      setTriageResult(result);
    }
    
    setIsLoading(false);
  };

  const getPriorityBadgeColor = (priority: 'High' | 'Medium' | 'Low' | undefined) => {
    switch(priority) {
      case 'High': return 'bg-red-500/80 border-red-500/30';
      case 'Medium': return 'bg-yellow-500/80 border-yellow-500/30';
      case 'Low': return 'bg-green-500/80 border-green-500/30';
      default: return 'bg-muted';
    }
  }

  return (
    <Card className="h-full flex flex-col bg-card/50 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <AlertTriangle className="text-accent" />
          Alerts & Triage
        </CardTitle>
        <CardDescription>AI-powered real-time analysis.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        {isLoading && (
          <div className="space-y-3">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        )}
        {triageResult && !triageResult.error && (
          <div className="space-y-3 rounded-lg border border-accent/30 bg-accent/10 p-4">
            <div className="flex items-center justify-between">
                <h4 className="font-semibold text-lg text-primary flex items-center gap-2"><Sparkles className="w-5 h-5"/> AI Recommendation</h4>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${getPriorityBadgeColor(triageResult.priority)}`}>
                    {triageResult.priority} Priority
                </span>
            </div>
            <p className="font-bold text-xl">{triageResult.recommendation}</p>
            <p className="text-sm text-muted-foreground">{triageResult.explanation}</p>
          </div>
        )}
        <div className="p-4 bg-muted/30 rounded-lg text-sm text-muted-foreground">
            No active system alerts.
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={onTriage}
          disabled={isLoading}
          className="w-full font-bold text-lg py-6 bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all"
        >
          <Siren className="mr-2 h-5 w-5 animate-pulse" />
          {isLoading ? 'Analyzing...' : 'Initiate Emergency Triage'}
        </Button>
      </CardFooter>
    </Card>
  );
}
