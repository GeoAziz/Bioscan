'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Siren, Sparkles, Lightbulb } from 'lucide-react';
import { handleEmergencyTriage, handleGenerateRecommendation } from '@/app/actions';
import { mockPatient } from '@/lib/mock-data';
import type { TriageResult, RecommendationResult } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function AlertsPanel() {
  const [isTriageLoading, setIsTriageLoading] = useState(false);
  const [isRecommendationLoading, setIsRecommendationLoading] = useState(false);
  const [triageResult, setTriageResult] = useState<TriageResult>(null);
  const [recommendationResult, setRecommendationResult] = useState<RecommendationResult>(null);
  const { toast } = useToast();

  const onTriage = async () => {
    setIsTriageLoading(true);
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
    
    setIsTriageLoading(false);
  };
  
  const onGetRecommendation = async () => {
    setIsRecommendationLoading(true);
    setRecommendationResult(null);

    const latestVitals = mockPatient.vitals[mockPatient.vitals.length - 1];
    const input = {
      heartRate: latestVitals.heartRate,
      temperature: latestVitals.temperature,
      oxygenSaturation: latestVitals.oxygenSaturation,
      bloodPressureSystolic: latestVitals.bloodPressure.systolic,
      bloodPressureDiastolic: latestVitals.bloodPressure.diastolic,
      ecgReading: 'Normal sinus rhythm',
    };

    const result = await handleGenerateRecommendation(input);

    if (result.error) {
        toast({
            variant: 'destructive',
            title: 'Recommendation Error',
            description: result.error,
        });
    } else {
        setRecommendationResult(result);
    }
    
    setIsRecommendationLoading(false);
  };

  const getPriorityBadgeColor = (priority: 'High' | 'Medium' | 'Low' | 'low' | 'medium' | 'high' | undefined) => {
    switch(priority?.toLowerCase()) {
      case 'high': return 'bg-red-500/80 border-red-500/30';
      case 'medium': return 'bg-yellow-500/80 border-yellow-500/30';
      case 'low': return 'bg-green-500/80 border-green-500/30';
      default: return 'bg-muted';
    }
  }

  return (
    <Card className="h-full flex flex-col bg-card/50 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <AlertTriangle className="text-accent" />
          AI Analysis
        </CardTitle>
        <CardDescription>Real-time analysis and recommendations.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        {(isTriageLoading || isRecommendationLoading) && (
          <div className="space-y-3">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        )}
        {recommendationResult && !recommendationResult.error && (
            <div className="space-y-3 rounded-lg border border-primary/30 bg-primary/10 p-4">
                <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-lg text-primary flex items-center gap-2"><Lightbulb className="w-5 h-5"/> AI Health Tip</h4>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full capitalize ${getPriorityBadgeColor(recommendationResult.urgency)}`}>
                        {recommendationResult.urgency} Urgency
                    </span>
                </div>
                <p className="font-bold text-xl">{recommendationResult.recommendation}</p>
            </div>
        )}
        {triageResult && !triageResult.error && (
          <div className="space-y-3 rounded-lg border border-accent/30 bg-accent/10 p-4">
            <div className="flex items-center justify-between">
                <h4 className="font-semibold text-lg text-primary flex items-center gap-2"><Sparkles className="w-5 h-5"/> AI Triage</h4>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${getPriorityBadgeColor(triageResult.priority)}`}>
                    {triageResult.priority} Priority
                </span>
            </div>
            <p className="font-bold text-xl">{triageResult.recommendation}</p>
            <p className="text-sm text-muted-foreground">{triageResult.explanation}</p>
          </div>
        )}
        
        {!triageResult && !recommendationResult && !isTriageLoading && !isRecommendationLoading && (
            <div className="p-4 bg-muted/30 rounded-lg text-sm text-muted-foreground text-center">
                Click a button below to get AI analysis.
            </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2">
        <Button
          onClick={onGetRecommendation}
          disabled={isRecommendationLoading || isTriageLoading}
          variant="outline"
          className="w-full font-bold"
        >
          <Lightbulb className="mr-2 h-5 w-5" />
          {isRecommendationLoading ? 'Thinking...' : 'Get Health Tip'}
        </Button>
        <Button
          onClick={onTriage}
          disabled={isTriageLoading || isRecommendationLoading}
          className="w-full font-bold text-lg bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all"
        >
          <Siren className="mr-2 h-5 w-5 animate-pulse" />
          {isTriageLoading ? 'Analyzing...' : 'Emergency Triage'}
        </Button>
      </CardFooter>
    </Card>
  );
}
